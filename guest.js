(()=>{'use strict';const $=s=>document.querySelector(s),root=$('#guest');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const colors={'Fresh & Citrus':'#C9D94A','Fruity & Tropical':'#F28C28','Strong & Classic':'#B87333','Bitter & Complex':'#D43838','Creamy & Smooth':'#D6C4A1','Sparkling & Light':'#A9C5D3'};
const TASTE_MAX=5;
const tasteNames=[['acid','Säure','#3A7DFF'],['bitter','Bitterkeit','#C43A3A'],['fruit','Fruchtigkeit','#3FA34D'],['sweet','Süße','#D9B300'],['heavy','Schwere','#6B4A2E'],['alcohol','Alkohol','#9146D8']];
function fromFs(v){if(!v)return null;if('stringValue'in v)return v.stringValue;if('booleanValue'in v)return v.booleanValue;if('integerValue'in v)return Number(v.integerValue);if('doubleValue'in v)return v.doubleValue;if('nullValue'in v)return null;if('arrayValue'in v)return(v.arrayValue.values||[]).map(fromFs);if('mapValue'in v)return Object.fromEntries(Object.entries(v.mapValue.fields||{}).map(([k,x])=>[k,fromFs(x)]));return null}
const unwrap=x=>fromFs({mapValue:{fields:x.fields||{}}});
function ingredientList(items){return(items||[]).length?`<div class="small" style="margin-top:10px;color:#c4ced7">${items.map(x=>`${esc(x.name)}${x.amount?` · ${esc(x.amount)} ${esc(x.unit)}`:''}`).join(' · ')}</div>`:''}
function tasteValue(c,key){
  const raw=c.taste?.[key];
  if(raw===undefined||raw===null||raw==='')return null;
  const n=Number(raw);
  if(!Number.isFinite(n)||n<0)return null;
  return Math.min(TASTE_MAX,Math.max(0,c.tasteScale===TASTE_MAX?n:Math.ceil(n/2)));
}
function guestCard(c){
  const color=colors[c.category]||'#D6C4A1';
  const profile=`<div class="guest-taste"><b>Geschmacksprofil</b>${tasteNames.map(([key,label,tone])=>{
    const val=tasteValue(c,key);
    return `<div class="guest-taste-row"><span class="guest-taste-label">${label}</span><span class="guest-taste-bars">${Array.from({length:TASTE_MAX},(_,n)=>`<span style="--taste-color:${tone}" class="guest-taste-seg ${val!==null&&n<val?'filled':''}"></span>`).join('')}</span><span class="guest-taste-value">${val===null?'Unbewertet':`${val}/5`}</span></div>`;
  }).join('')}</div>`;
  return `<article class="guest-card" data-category="${esc(c.category||'')}" style="--accent:${color}">${c.image?`<div class="photo"><img src="${esc(c.image)}" alt="${esc(c.name)}"></div>`:`<div class="photo"><span class="monogram">${esc(c.name?.substring(0,2))}</span></div>`}<div class="guest-card-body"><div class="category-name" style="color:${color}">${esc(c.category||'').toUpperCase()}</div><h2>${esc(c.name)}</h2>${c.bases?.length?`<div class="badge-list">${c.bases.map(b=>`<span class="badge-base">${esc(b)}</span>`).join('')}</div>`:''}${c.glass?`<div class="muted small" style="margin-top:7px">Glas: ${esc(c.glass==='TUMBLER'?'Tumbler':c.glass==='FLÖTE'?'Flöte':c.glass==='WEIN'?'Weinglas':c.glass==='TIKI'?'Tiki-Becher':c.glass==='SHOT'?'Shotglas':c.glass)}</div>`:''}${profile}${ingredientList(c.ingredients)}${c.garnishes?.length?`<div class="muted tiny" style="margin-top:7px">Garnitur: ${c.garnishes.map(x=>esc(x.name)).join(', ')}</div>`:''}</div></article>`;
}
function show(title,cards){
  document.title=`${title} – Cocktails`;
  const categories=Object.entries(colors);
  const controls=cards.length?`<div class="category-quickfilters guest-categories" role="group" aria-label="Cocktailkarte nach Kategorie filtern"><button class="category-chip selected" data-guest-category="" aria-pressed="true">Alle (${cards.length})</button>${categories.map(([name,color])=>`<button class="category-chip" data-guest-category="${esc(name)}" style="--cat-color:${color}" aria-pressed="false">${esc(name)}</button>`).join('')}</div>`:'';
  root.innerHTML=`<div class="guest-hero"><img src="icon-192.png" alt="Cocktails"><h1>COCKTAILS</h1><p>${esc(title)}</p></div><div class="guest-wrap">${controls}${cards.length?`<div class="guest-grid">${cards.map(guestCard).join('')}</div><div id="guest-no-results" class="empty" hidden><h3>Keine Cocktails in dieser Kategorie</h3><p>Wähle eine andere Kategorie oder „Alle“.</p></div>`:`<div class="empty"><h3>Aktuell keine Cocktails auf der Karte</h3><p>Die Gastgeber haben noch keine Cocktails veröffentlicht.</p></div>`}<div class="footer-caption">Cocktails · Digitale Cocktailkarte</div></div>`;
}
root.addEventListener('click',event=>{
  const chip=event.target.closest('button[data-guest-category]');
  if(!chip)return;
  const category=chip.dataset.guestCategory;
  root.querySelectorAll('[data-guest-category]').forEach(button=>{
    const active=button.dataset.guestCategory===category;
    button.classList.toggle('selected',active);
    button.setAttribute('aria-pressed',String(active));
  });
  let visible=0;
  root.querySelectorAll('.guest-card[data-category]').forEach(card=>{
    card.hidden=!!category&&card.dataset.category!==category;
    if(!card.hidden)visible++;
  });
  const empty=root.querySelector('#guest-no-results');
  if(empty)empty.hidden=visible!==0;
});

function failure(text){root.innerHTML=`<div class="guest-hero"><img src="icon-192.png" alt=""><h1>COCKTAILS</h1></div><div class="guest-wrap"><div class="empty"><h3>Cocktailkarte nicht verfügbar</h3><p>${esc(text)}</p></div></div>`}
async function localPreview(){let db=await new Promise((resolve,reject)=>{let r=indexedDB.open('cocktails-app-data',1);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)}),data=await new Promise((resolve,reject)=>{let r=db.transaction('data').objectStore('data').get('state');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});if(!data)throw Error('Keine lokale Sammlung gefunden.');let ids=data.ui?.cardOrder||data.ui?.cardIds||[],cards=ids.map(id=>data.cocktails.find(c=>c.id===id)).filter(c=>c&&!c.draft).map(c=>({id:c.id,name:c.name,category:c.category,image:c.image,glass:c.glass,bases:c.bases,taste:c.taste,tasteScale:c.tasteScale,ingredients:c.ingredients.map(e=>({name:data.ingredients.find(i=>i.id===e.ingredientId)?.name||'Zutat',amount:e.amount,unit:e.unit})),garnishes:c.garnishes.map(e=>({name:data.ingredients.find(i=>i.id===e.ingredientId)?.name||'Garnitur',amount:e.amount,unit:e.unit}))}));show(data.ui?.cardName||'Unsere Cocktailkarte',cards)}
async function remote(){let q=new URLSearchParams(location.search),project=q.get('project'),cardId=q.get('id');if(!/^[a-zA-Z0-9-]{1,120}$/.test(project||'')||!/^[a-zA-Z0-9-]{1,120}$/.test(cardId||''))throw Error('Der Link enthält keine gültige Cocktailkarten-ID.');let base=`https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/publicCards/${cardId}`;
async function get(path){let r=await fetch(path),data=await r.json();if(!r.ok)throw Error(r.status===404?'Die Karte wurde noch nicht veröffentlicht.':data.error?.message||'Verbindung zur Cocktailkarte fehlgeschlagen.');return unwrap(data)}let index=await get(base),ids=index.ids||[],cards=await Promise.all(ids.map(async cid=>{try{return await get(base+'/items/'+encodeURIComponent(cid))}catch(e){console.warn('Cocktail nicht verfügbar',cid,e);return null}}));show(index.title||'Unsere Cocktailkarte',cards.filter(Boolean))}
(async()=>{try{if(new URLSearchParams(location.search).get('preview')==='1')await localPreview();else await remote()}catch(e){console.error(e);failure(e.message)}})();
})();
