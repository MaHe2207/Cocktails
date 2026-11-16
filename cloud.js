/* Cocktails private Firestore synchronization – Spark plan, no Cloud Storage.
 * REST-only to keep the PWA build-free. Images are content-addressed and chunked.
 * Snapshots are immutable; the current pointer uses an optimistic write precondition.
 */
(()=>{'use strict';
const CHUNK=115000; // comfortably below Firestore's 1-MiB document limit even for UTF-8
const enc = new TextEncoder();
const clone = o => JSON.parse(JSON.stringify(o));
const fsVal = v => {
  if(v==null)return {nullValue:null};
  if(typeof v==='string')return {stringValue:v};
  if(typeof v==='boolean')return {booleanValue:v};
  if(typeof v==='number')return Number.isInteger(v)?{integerValue:String(v)}:{doubleValue:v};
  if(Array.isArray(v))return {arrayValue:{values:v.map(fsVal)}};
  return {mapValue:{fields:Object.fromEntries(Object.entries(v).filter(([,value])=>value!==undefined).map(([k,value])=>[k,fsVal(value)]))}};
};
const unVal = v => {
  if(!v)return undefined;
  if('stringValue'in v)return v.stringValue;
  if('booleanValue'in v)return v.booleanValue;
  if('integerValue'in v)return Number(v.integerValue);
  if('doubleValue'in v)return v.doubleValue;
  if('nullValue'in v)return null;
  if('arrayValue'in v)return (v.arrayValue.values||[]).map(unVal);
  if('mapValue'in v)return Object.fromEntries(Object.entries(v.mapValue.fields||{}).map(([k,value])=>[k,unVal(value)]));
};
const parse = doc => doc?{...unVal({mapValue:{fields:doc.fields||{}}}),_updateTime:doc.updateTime}:null;
async function sha256(s){const bytes=await crypto.subtle.digest('SHA-256',enc.encode(s));return Array.from(new Uint8Array(bytes),v=>v.toString(16).padStart(2,'0')).join('')}
function base(project){if(!/^[A-Za-z0-9-]{3,120}$/.test(project))throw Error('Ungültige Firebase-Projekt-ID.');return `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(project)}/databases/(default)/documents/`}
function client(project,uid,token){
  if(!/^[A-Za-z0-9_-]{1,128}$/.test(uid))throw Error('Ungültige Firebase-Kennung.');
  const root=base(project)+`users/${encodeURIComponent(uid)}/`;
  async function req(path,method='GET',value,precondition){
    let url=root+path;
    if(precondition){let u=new URL(url);if(precondition.updateTime)u.searchParams.set('currentDocument.updateTime',precondition.updateTime);else u.searchParams.set('currentDocument.exists','false');url=u.href}
    let response=await fetch(url,{method,headers:{Authorization:`Bearer ${token}`,...(method==='PATCH'?{'Content-Type':'application/json'}:{})},...(method==='PATCH'?{body:JSON.stringify({fields:fsVal(value).mapValue.fields})}:{})});
    if(response.status===404&&method==='GET')return null;
    if(!response.ok){let error=await response.json().catch(()=>({}));let e=new Error(error.error?.message||`Firestore ${response.status}`);e.code=response.status;throw e}
    if(method==='DELETE')return null;
    return parse(await response.json());
  }
  return {get:path=>req(path),put:(path,value,precondition)=>req(path,'PATCH',value,precondition),delete:path=>req(path,'DELETE')};
}
const chunks = s => {let out=[];for(let p=0;p<s.length;p+=CHUNK)out.push(s.slice(p,p+CHUNK));return out.length?out:['']};
async function limited(jobs,limit=5){let index=0;const result=new Array(jobs.length);await Promise.all(Array.from({length:Math.min(limit,jobs.length)},async()=>{for(;;){const i=index++;if(i>=jobs.length)break;result[i]=await jobs[i]()}}));return result}
const isImage = s => typeof s==='string'&&/^data:image\/(?:png|jpe?g|webp|gif);base64,/.test(s);
async function pack(data){
  const doc=clone(data),photos=new Map();
  const records=[...(doc.cocktails||[]),...(doc.ingredients||[]),...Object.values(doc.pending||{})];
  for(const rec of records){if(!isImage(rec.image))continue;
    const value=rec.image,hash=await sha256(value);
    photos.set(hash,value);rec.image='cloud-photo:'+hash;
  }
  const serialized=JSON.stringify(doc);
  return {serialized,hash:await sha256(serialized),photos};
}
function isBlank(data){return !(data.cocktails||[]).length&&!(data.ingredients||[]).length&&!(Object.keys(data.pending||{})).length}
async function uploadImages(c,photos,known){
  for(const [hash,value] of photos){
    if(known.includes(hash))continue;
    const path=`photos/${hash}`,existing=await c.get(path);
    if(!existing){const segments=chunks(value);await limited(segments.map((str,i)=>()=>c.put(`${path}/parts/${i}`,{part:str})),4);await c.put(path,{count:segments.length,hash,bytes:value.length})}
    known.push(hash);
  }
}
async function downloadImage(c,hash,cache){
  if(cache.has(hash))return cache.get(hash);
  if(!/^[a-f0-9]{64}$/.test(hash))throw Error('Ungültiger Bildverweis in Cloud-Daten.');
  const info=await c.get(`photos/${hash}`);
  if(!info||!Number.isSafeInteger(info.count)||info.count<1||info.count>800)throw Error('Ein Cloud-Bild fehlt oder ist fehlerhaft.');
  const parts=await limited(Array.from({length:info.count},(_,i)=>()=>c.get(`photos/${hash}/parts/${i}`)),6);
  if(parts.some(p=>!p||typeof p.part!=='string'))throw Error('Ein Cloud-Bild ist unvollständig.');
  const picture=parts.map(p=>p.part).join('');
  if(!isImage(picture)||await sha256(picture)!==hash)throw Error('Die Prüfsumme eines Cloud-Bildes stimmt nicht.');
  cache.set(hash,picture);return picture;
}
async function restore(c,serialized){
  let data;
  try{data=JSON.parse(serialized)}catch{throw Error('Cloud-Sicherung ist keine gültige JSON-Datei.')}
  if(!data||!Array.isArray(data.cocktails)||!Array.isArray(data.ingredients)||typeof data.ui!=='object')throw Error('Cloud-Sicherung enthält ungültige Rezeptdaten.');
  let photos=new Map(),records=[...data.cocktails,...data.ingredients,...Object.values(data.pending||{})];
  for(const rec of records){if(typeof rec.image==='string'&&rec.image.startsWith('cloud-photo:'))rec.image=await downloadImage(c,rec.image.slice(12),photos)}
  return data;
}
async function getPointer(c){return c.get('sync/current')}
async function fetchSnapshot(c,pointer){
  if(!pointer||!pointer.rev||!Number.isSafeInteger(pointer.count)||pointer.count<1||pointer.count>800)throw Error('Die Cloud-Sicherung ist unvollständig.');
  const parts=await limited(Array.from({length:pointer.count},(_,i)=>()=>c.get(`snapshots/${pointer.rev}/parts/${i}`)),6);
  if(parts.some(p=>!p||typeof p.part!=='string'))throw Error('Die Cloud-Sicherung enthält fehlende Datenblöcke.');
  const serialized=parts.map(p=>p.part).join('');
  if(await sha256(serialized)!==pointer.hash)throw Error('Die Prüfsumme der Cloud-Sicherung stimmt nicht.');
  return restore(c,serialized);
}
async function push(c,packed,pointer,knownPhotos){
  await uploadImages(c,packed.photos,knownPhotos);
  const rev=crypto.randomUUID().replace(/-/g,''),parts=chunks(packed.serialized);
  await limited(parts.map((part,i)=>()=>c.put(`snapshots/${rev}/parts/${i}`,{part})),5);
  const record={rev,count:parts.length,hash:packed.hash,updatedAt:new Date().toISOString(),previous:pointer?{rev:pointer.rev,count:pointer.count}:null};
  try{await c.put('sync/current',record,pointer?{updateTime:pointer._updateTime}:{exists:false})}
  catch(e){if(e.code===409||e.code===412)e.message='Die Cloud wurde zwischenzeitlich von einem anderen Gerät verändert. Bitte erneut synchronisieren.';throw e}
  // Retain current and preceding revision for safety. Reclaim the older snapshot.
  const old=pointer?.previous;
  if(old&&/^[a-f0-9]{32}$/.test(old.rev)&&Number.isSafeInteger(old.count)&&old.count<800){
    // Best-effort, after the commit only; never fail the completed save because of cleanup.
    Promise.all(Array.from({length:old.count},(_,i)=>c.delete(`snapshots/${old.rev}/parts/${i}`).catch(()=>{}))).catch(()=>{});
  }
  return record;
}
window.CocktailsCloud={client,pack,sha256,isBlank,getPointer,fetchSnapshot,push};
})();
