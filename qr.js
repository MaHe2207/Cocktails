/* Self-contained QR generator: byte-mode, error correction L, versions 1–10.
   QR encoding follows ISO/IEC 18004. No external web service needed. */
(()=>{'use strict';
const ECC=[0,7,10,15,20,26,18,20,24,30,18],BLOCKS=[0,1,1,1,1,1,2,2,2,2,4];
function rawModules(v){let n=(16*v+128)*v+64;if(v>=2){let a=Math.floor(v/7)+2;n-=(25*a-10)*a-55}if(v>=7)n-=36;return n}
function mul(x,y){let z=0;for(let i=7;i>=0;i--){z=(z<<1)^((z>>>7)*0x11d);z^=((y>>>i)&1)*x}return z}
function divisor(n){let a=Array(n).fill(0);a[n-1]=1;let root=1;for(let i=0;i<n;i++){for(let j=0;j<n;j++){a[j]=mul(a[j],root);if(j+1<n)a[j]^=a[j+1]}root=mul(root,2)}return a}
function remainder(data,div){let r=Array(div.length).fill(0);for(const b of data){let factor=b^r.shift();r.push(0);for(let i=0;i<r.length;i++)r[i]^=mul(div[i],factor)}return r}
function matrix(text){const bytes=Array.from(new TextEncoder().encode(text));let version=0;for(let v=1;v<=10;v++){let cap=Math.floor(rawModules(v)/8)-ECC[v]*BLOCKS[v];let bits=4+(v<=9?8:16)+bytes.length*8;if(bits<=cap*8){version=v;break}}if(!version)throw Error('Link ist für einen QR-Code zu lang.');
let v=version,size=v*4+17, ec=ECC[v],nb=BLOCKS[v],raw=Math.floor(rawModules(v)/8),cap=raw-nb*ec;
let bits=[];function push(n,count){for(let i=count-1;i>=0;i--)bits.push((n>>>i)&1)}push(4,4);push(bytes.length,v<=9?8:16);for(const b of bytes)push(b,8);push(0,Math.min(4,cap*8-bits.length));while(bits.length%8)bits.push(0);
let data=[];for(let i=0;i<bits.length;i+=8){let b=0;for(let j=0;j<8;j++)b=(b<<1)|bits[i+j];data.push(b)}for(let b=0;data.length<cap;b^=1)data.push(b?0x11:0xec);
let shortBlockLen=Math.floor(raw/nb),shortDataLen=shortBlockLen-ec,nshort=nb-raw%nb,k=0,bs=[],gen=divisor(ec);
for(let i=0;i<nb;i++){let d=data.slice(k,k+shortDataLen+(i<nshort?0:1));k+=d.length;bs.push({d,e:remainder(d,gen)})}
let code=[];for(let i=0;i<=shortDataLen;i++)for(const b of bs)if(i<b.d.length)code.push(b.d[i]);for(let i=0;i<ec;i++)for(const b of bs)code.push(b.e[i]);
let m=Array.from({length:size},()=>Array(size).fill(false)),fun=Array.from({length:size},()=>Array(size).fill(false));
function set(x,y,d){if(x>=0&&x<size&&y>=0&&y<size){m[y][x]=!!d;fun[y][x]=true}}
function finder(cx,cy){for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){let a=Math.max(Math.abs(dx),Math.abs(dy));set(cx+dx,cy+dy,a!==2&&a!==4)}}
finder(3,3);finder(size-4,3);finder(3,size-4);for(let i=0;i<size;i++){if(!fun[6][i])set(i,6,i%2===0);if(!fun[i][6])set(6,i,i%2===0)}
if(v>=2){let num=Math.floor(v/7)+2,step=v===32?26:Math.ceil((v*4+num*2+1)/(num*2-2))*2,pos=[6];for(let p=num-1;p>=1;p--)pos.splice(1,0,size-7-(num-1-p)*step);
for(let i=0;i<num;i++)for(let j=0;j<num;j++){if((i===0&&j===0)||(i===0&&j===num-1)||(i===num-1&&j===0))continue;let x=pos[i],y=pos[j];for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)set(x+dx,y+dy,Math.max(Math.abs(dx),Math.abs(dy))!==1)}}
function format(mask){let data=(1<<3)|mask,rem=data;for(let i=0;i<10;i++)rem=(rem<<1)^((rem>>>9)*0x537);let b=((data<<10)|rem)^0x5412;
for(let i=0;i<=5;i++)set(8,i,((b>>>i)&1));set(8,7,(b>>>6)&1);set(8,8,(b>>>7)&1);set(7,8,(b>>>8)&1);
for(let i=9;i<15;i++)set(14-i,8,(b>>>i)&1);for(let i=0;i<8;i++)set(size-1-i,8,(b>>>i)&1);for(let i=8;i<15;i++)set(8,size-15+i,(b>>>i)&1);set(8,size-8,true)}
format(0);
if(v>=7){let rem=v;for(let i=0;i<12;i++)rem=(rem<<1)^((rem>>>11)*0x1f25);let bits=(v<<12)|rem;for(let i=0;i<18;i++){let bit=(bits>>>i)&1,a=size-11+i%3,b=Math.floor(i/3);set(a,b,bit);set(b,a,bit)}}
let bi=0;for(let right=size-1;right>=1;right-=2){if(right===6)right=5;for(let vert=0;vert<size;vert++)for(let j=0;j<2;j++){let x=right-j,y=((right+1)&2)===0?size-1-vert:vert;if(!fun[y][x]){let bit=bi<code.length*8?(code[bi>>>3]>>>(7-(bi&7)))&1:0;m[y][x]=Boolean(bit^(((x+y)%2)===0?1:0));bi++}}}
return m}
window.createQrSvg=(value)=>{let m=matrix(value),quiet=4,size=m.length;let path='';for(let y=0;y<size;y++)for(let x=0;x<size;x++)if(m[y][x])path+=`M${x+quiet} ${y+quiet}h1v1h-1z`;let whole=size+quiet*2;return `<svg role="img" aria-label="QR-Code" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${whole} ${whole}" shape-rendering="crispEdges"><path fill="#fff" d="M0 0h${whole}v${whole}H0z"/><path fill="#000" d="${path}"/></svg>`};
})();
