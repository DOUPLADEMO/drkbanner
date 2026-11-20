const SW=4000,SH=2304,TB={x0:1444,y0:598,x1:2446,y1:2248},CELL=32,GW=125,GH=72,YCUT=420;
const clamp=(v,a,b)=>v<a?a:v>b?b:v,sm=(a,b,v)=>{const t=clamp((v-a)/(b-a),0,1);return t*t*(3-2*t)};
let cache=null;
async function prep(){
  if(cache)return cache;
  const img=await readImage('uploads/DRK_Brandingelt_doboz_B_3.png');
  const lv=[img];
  for(let k=1;k<4;k++){const w=SW>>k,h=SH>>k;const c=createCanvas(w,h);const x=c.getContext('2d');x.imageSmoothingQuality='high';x.drawImage(lv[k-1],0,0,w,h);lv.push(c)}
  const d3=lv[3].getContext('2d',{willReadFrequently:true}).getImageData(0,0,500,288).data;
  const lo=[0,1,2].map(()=>new Float32Array(GW*GH));
  for(let j=0;j<GH;j++)for(let i=0;i<GW;i++){for(let c=0;c<3;c++){let m=0;for(let b=0;b<4;b++)for(let a=0;a<4;a++)m+=d3[((j*4+b)*500+i*4+a)*4+c];lo[c][j*GW+i]=m/16}}
  const mask=new Uint8Array(GW*GH);
  for(let j=0;j<GH;j++)for(let i=0;i<GW;i++){
    const cx=(i+.5)*CELL,cy=(j+.5)*CELL;
    if(cx>TB.x0-80&&cx<TB.x1+80&&cy>TB.y0-80&&cy<TB.y1+80)mask[j*GW+i]=1;
    if(cx>2350){const yT=1914-(cx-2444)*.112-150,yB=Math.min(2330,2215-(cx-2444)*.1015+120);if(cy>yT&&cy<yB)mask[j*GW+i]=1}
  }
  const plate=lo.map(a=>{
    const p=Float32Array.from(a);let m=0,n=0;
    for(let k=0;k<p.length;k++)if(!mask[k]){m+=p[k];n++}
    m/=n;for(let k=0;k<p.length;k++)if(mask[k])p[k]=m;
    for(let it=0;it<5000;it++){
      for(let j=0;j<GH;j++)for(let i=0;i<GW;i++){const k=j*GW+i;if(!mask[k])continue;
        const l=p[j*GW+Math.max(i-1,0)],r=p[j*GW+Math.min(i+1,GW-1)],u=p[Math.max(j-1,0)*GW+i],dn=p[Math.min(j+1,GH-1)*GW+i];
        p[k]=(l+r+u+dn)/4}
    }
    return p});
  cache={lv,plate,lo};return cache;
}
function lk(X,Y,A,o){
  const fx=clamp(X/CELL-.5,0,GW-1),fy=clamp(Y/CELL-.5,0,GH-1);
  const i=Math.min(fx|0,GW-2),j=Math.min(fy|0,GH-2),tx=fx-i,ty=fy-j,k=j*GW+i;
  const w00=(1-tx)*(1-ty),w10=tx*(1-ty),w01=(1-tx)*ty,w11=tx*ty;
  for(let c=0;c<3;c++){const a=A[c];o[c]=a[k]*w00+a[k+1]*w10+a[k+GW]*w01+a[k+GW+1]*w11}
}
async function render(f){
  const {lv,plate,lo}=await prep();
  const {W,H}=f;const s=f.hf*H/(TB.y1-TB.y0);
  const oy=f.bot*H-TB.y1*s,ox=f.cx*W-((TB.x0+TB.x1)/2)*s;
  let k=0;while(k<3&&s*Math.pow(2,k+1)<=1)k++;
  const c=createCanvas(W,H);const x=c.getContext('2d',{willReadFrequently:true});x.imageSmoothingQuality='high';
  x.drawImage(lv[k],ox,oy,SW*s,SH*s);
  const id=x.getImageData(0,0,W,H),d=id.data;
  let seed=f.seed||12345;const rnd=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return((seed>>>0)/4294967296)};
  const gn=()=>(rnd()+rnd()+rnd()-1.5)*2;
  const sig=Math.max(.7,2.0*s*1.4);
  const T0=[0,0,0];lk(1950,500,plate,T0);
  const Pin=[0,0,0],Pf=[0,0,0],Lo=[0,0,0];
  for(let v=0;v<H;v++)for(let u=0;u<W;u++){
    const i=(v*W+u)*4;
    const X=(u+.5-ox)/s,Y=(v+.5-oy)/s;
    const Xc=clamp(X,0,SW-1),Yc=clamp(Y,0,SH-1);
    const ext=Math.hypot(X-Xc,Y-Yc);
    const dT=Math.max(TB.x0-X,X-TB.x1,TB.y0-Y,Y-TB.y1);
    const m=1-sm(0,40,dT);
    if(m>=1){d[i+3]=255;continue}
    const a=sm(0,120,Math.min(X,SW-X,Y,SH-Y));
    lk(Xc,Yc,plate,Pin);
    if(Yc<YCUT)lk(Xc,YCUT,plate,Pf);else{Pf[0]=Pin[0];Pf[1]=Pin[1];Pf[2]=Pin[2]}
    const dk=1-.10*(1-Math.exp(-ext/600));
    let w=0;
    if(f.zx!=null)w=sm(f.zx-f.zf,f.zx,u/W);else if(f.zy!=null)w=1-sm(f.zy-f.zf,f.zy,v/H);
    if(f.zb!=null)w=Math.max(w,sm(f.zb-.1,f.zb,v/H));
    w*=sm(0,250,dT);
    const e=Math.abs(2*u/W-1),dkT=1-.07*sm(.7,1,e);
    let corr=1;
    if(X>3200){lk(Xc,Yc,lo,Lo);const sv=(Lo[0]+Lo[1]+Lo[2])/(Pin[0]+Pin[1]+Pin[2]);if(sv<1){const F=1-sm(3200,4100,X);corr=1+((1-(1-sv)*F)/sv-1)*a}}
    const n=gn()*sig*(1-a),nc=gn()*sig*.3*(1-a);
    for(let c=0;c<3;c++){
      let base=Pf[c]*dk;
      if(w>0){const tt=T0[c]*dkT;if(tt>base)base+=w*(tt-base)}
      let r=1;
      if(a>0){r=clamp(d[i+c]/Pin[c],.3,1.5);r=1+(r-1)*a}
      let bg=base*r*corr+n+(c==0?nc:c==2?-nc:0);
      d[i+c]=m>0?d[i+c]*m+bg*(1-m):bg;
    }
    d[i+3]=255;
  }
  x.putImageData(id,0,0);
  return c;
}
function scaleTo(c,W,H){const o=createCanvas(W,H);const x=o.getContext('2d');x.imageSmoothingQuality='high';x.drawImage(c,0,0,W,H);return o}
const FM={
 sq:{W:1200,H:1200,hf:.60,bot:.93,cx:.5,zy:.38,zf:.20},
 p45:{W:1440,H:1800,hf:.55,bot:.945,cx:.5,zy:.42,zf:.22},
 s916:{W:1440,H:2560,hf:.45,bot:.765,cx:.5,zy:.36,zf:.18,zb:.80},
 w169:{W:1920,H:1080,hf:.78,bot:.93,cx:.30,zx:.60,zf:.25},
 w191:{W:1200,H:628,hf:.77,bot:.93,cx:.30,zx:.60,zf:.25},
 w149:{W:700,H:450,hf:.80,bot:.94,cx:.28,zx:.66,zf:.25}
};
return {render,scaleTo,FM};
