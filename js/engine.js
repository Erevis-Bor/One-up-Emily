import {progressFor} from './simulation.js';
const TAU=Math.PI*2,clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),ease=(a,b,t)=>a+(b-a)*t;
const PALETTE=[[98,137,154],[224,186,133],[218,241,236],[133,246,197],[252,211,144]];
const rand=(n)=>{let x=Math.sin(n*127.1+49.12)*43758.5453;return x-Math.floor(x)};
export class Universe{
 constructor(canvas,population){this.canvas=canvas;this.ctx=canvas.getContext('2d',{alpha:false});this.population=population;this.view='field';this.yaw=-.30;this.pitch=-.16;this.targetYaw=-.30;this.targetPitch=-.16;this.zoom=1;this.targetZoom=1;this.pointer={x:-999,y:-999};this.down=null;this.drawn=[];this.elapsed=0;this.evaluation=null;this.comparison=null;this.motion=!matchMedia('(prefers-reduced-motion: reduce)').matches;this.wave=0;this.waveActive=false;this.soundPulse=0;this.artefact=false;this.visualTime=0;this.profile={friction:100,jargon:[],noise:55,focus:.5};this.profileFriction=100;this.width=0;this.height=0;this.last=performance.now();this.running=true;this.onSelect=null;this.onFrame=null;this.onComplete=null;this.warps=[];this.stars=Array.from({length:240},(_,i)=>({x:rand(i*3)*2-1,y:rand(i*3+1)*2-1,s:rand(i*3+2)}));this.bind();this.resize();requestAnimationFrame(t=>this.frame(t));}
 bind(){const c=this.canvas;this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(c);c.addEventListener('pointerdown',e=>{if(this.view==='artefact')return;this.down={x:e.clientX,y:e.clientY,yaw:this.targetYaw,pitch:this.targetPitch,moved:false};c.setPointerCapture?.(e.pointerId)});c.addEventListener('pointermove',e=>{this.pointer={x:e.clientX,y:e.clientY};if(!this.down)return;let dx=e.clientX-this.down.x,dy=e.clientY-this.down.y;if(Math.abs(dx)+Math.abs(dy)>9)this.down.moved=true;this.targetYaw=this.down.yaw+dx*.005;this.targetPitch=clamp(this.down.pitch+dy*.003,-1.1,1.1)});c.addEventListener('pointerup',e=>{if(!this.down)return;const dragged=this.down.moved;this.down=null;if(!dragged)this.selectAt(e.clientX,e.clientY)});c.addEventListener('pointercancel',()=>this.down=null);c.addEventListener('pointerleave',()=>this.pointer={x:-999,y:-999});c.addEventListener('wheel',e=>{if(this.view==='artefact')return;if(e.target===c){e.preventDefault();this.targetZoom=clamp(this.targetZoom*(e.deltaY>0?.91:1.09),.58,2.2)}},{passive:false});
 this.pointers=new Map();c.addEventListener('pointerdown',e=>this.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY}));c.addEventListener('pointermove',e=>{if(!this.pointers.has(e.pointerId))return;this.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(this.pointers.size===2){let p=[...this.pointers.values()];let d=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);if(this.pinch){this.targetZoom=clamp(this.targetZoom*d/this.pinch,.58,2.2)}this.pinch=d;this.down=null}});const end=e=>{this.pointers.delete(e.pointerId);this.pinch=null};c.addEventListener('pointerup',end);c.addEventListener('pointercancel',end);
 }
 resize(){const rect=this.canvas.getBoundingClientRect();this.width=rect.width;this.height=rect.height;const dpr=Math.min(window.devicePixelRatio||1,window.innerWidth<700?1.35:1.65);this.canvas.width=Math.round(rect.width*dpr);this.canvas.height=Math.round(rect.height*dpr);this.scale=dpr;this.ctx.setTransform(dpr,0,0,dpr,0,0)}
 setProfile(analysis,cfg){this.profile={friction:analysis.friction,jargon:analysis.jargon.slice(0,20),noise:+cfg.noise,focus:analysis.focus};}
 setView(view){this.view=view;this.comparison=view==='observe'?this.comparison:null;if(view==='artefact'){this.artefact=false;this.targetYaw=-.4}else if(view==='observe'){this.targetYaw=.32}else if(view==='transmit'){this.targetYaw=-.2} }
 run(evaluation){this.evaluation=evaluation;this.elapsed=0;this.wave=0;this.waveActive=true;this.comparison=null;this.soundPulse=1;for(const p of this.population)p.state=0;this.warps.push({x:this.width*.67,y:this.height*.5,t:0});}
 replay(){if(!this.evaluation)return;this.run(this.evaluation)}
 setComparison(a,b){this.comparison={a,b};this.elapsed=11.5;this.waveActive=false}
 revealArtefact(){this.artefact=true;this.warps.push({x:this.width*.65,y:this.height*.51,t:0})}
 selectAt(x,y){if(this.view==='artefact'||this.view==='transmit')return;let best=null,distance=24;for(const p of this.drawn){const d=Math.hypot(x-p.x,y-p.y);if(d<distance){distance=d;best=p.person}}if(best)this.onSelect?.(best)}
 getPersonState(p){if(!this.evaluation)return 0;return progressFor(p,this.evaluation.outcomes[p.id-1],this.elapsed)}
 frame(t){if(!this.running)return;const dt=Math.min(.045,(t-this.last)/1000||.016);this.last=t;if(this.motion)this.visualTime+=dt;this.yaw=ease(this.yaw,this.targetYaw,Math.min(1,dt*4));this.pitch=ease(this.pitch,this.targetPitch,Math.min(1,dt*4));this.zoom=ease(this.zoom,this.targetZoom,Math.min(1,dt*4));this.profileFriction=ease(this.profileFriction,this.profile.friction,Math.min(1,dt*1.3));if(this.waveActive){this.elapsed=Math.min(12.5,this.elapsed+dt*1.05);if(this.elapsed>=11.6){this.waveActive=false;this.onComplete?.(this.evaluation)}}for(const w of this.warps)w.t+=dt;this.warps=this.warps.filter(w=>w.t<2.3);this.soundPulse*=.96;this.draw();this.onFrame?.(this);requestAnimationFrame(t=>this.frame(t));}
 project(p,cx,cy,scale,motion=1){const yaw=this.yaw+this.visualTime*.014*motion, pitch=this.pitch;let x=p.x*Math.cos(yaw)-p.z*Math.sin(yaw);let z=p.x*Math.sin(yaw)+p.z*Math.cos(yaw);let y=p.y*Math.cos(pitch)-z*Math.sin(pitch);z=p.y*Math.sin(pitch)+z*Math.cos(pitch);const depth=7+z;const s=scale*this.zoom/(depth);return {x:cx+x*s,y:cy+y*s,z,depth,r:Math.max(.4,s*.016)};}
 background(ctx,w,h){ctx.fillStyle='#03070b';ctx.fillRect(0,0,w,h);let g=ctx.createRadialGradient(w*.63,h*.49,0,w*.63,h*.49,Math.max(w,h)*.6);g.addColorStop(0,'#132c3288');g.addColorStop(.25,'#091922');g.addColorStop(.68,'#061017');g.addColorStop(1,'#03070b');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  // Volumetric spectral haze with rotating elliptical pools of light.
  for(let i=0;i<5;i++){let x=w*(.55+Math.sin(this.visualTime*.04+i*2)*.13),y=h*(.44+Math.cos(this.visualTime*.06+i*2)*.17),r=Math.min(w,h)*(.2+i*.095);let grad=ctx.createRadialGradient(x,y,0,x,y,r);grad.addColorStop(0,i%2?'#4bd8ac0b':'#90afed08');grad.addColorStop(1,'#00000000');ctx.fillStyle=grad;ctx.fillRect(x-r,y-r,r*2,r*2)}
  ctx.save();ctx.strokeStyle='#c5e8e20a';ctx.lineWidth=.65;const step=Math.max(45,Math.round(w/23));for(let i=0;i<w+step;i+=step){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,h);ctx.stroke()}for(let j=0;j<h+step;j+=step){ctx.beginPath();ctx.moveTo(0,j);ctx.lineTo(w,j);ctx.stroke()}ctx.restore();
  for(const s of this.stars){const x=(s.x*.5+.5)*w,y=(s.y*.5+.5)*h;let alpha=(.10+s.s*.37)*(1+Math.sin(this.visualTime*.8+s.x*9)*.21);ctx.fillStyle=`rgba(208,248,235,${alpha})`;ctx.fillRect(x,y,s.s> .86?1.5:.7,s.s> .86?1.5:.7)}
  ctx.strokeStyle='#b5e8d817';ctx.lineWidth=1;ctx.beginPath();ctx.arc(w*.62,h*.5,Math.min(w,h)*.39,0,TAU);ctx.stroke();ctx.beginPath();ctx.arc(w*.62,h*.5,Math.min(w,h)*.39,-.2,.3);ctx.strokeStyle='#a8edc047';ctx.stroke();
 }
 draw(){const ctx=this.ctx,w=this.width,h=this.height;if(!w||!h)return;ctx.save();ctx.setTransform(this.scale,0,0,this.scale,0,0);this.background(ctx,w,h);if(this.view==='artefact')this.drawArtefact(ctx,w,h);else if(this.comparison&&this.view==='observe')this.drawComparison(ctx,w,h);else this.drawPopulation(ctx,w,h);this.drawHUD(ctx,w,h);ctx.restore()}
 drawPopulation(ctx,w,h){const mobile=w<760;const center=this.view==='transmit'?(mobile?{x:w*.72,y:h*.52}:{x:w*.71,y:h*.54}):this.view==='observe'?(mobile?{x:w*.54,y:h*.5}:{x:w*.53,y:h*.52}):mobile?{x:w*.55,y:h*.59}:{x:w*.68,y:h*.51};let scale=Math.min(w,h)*(mobile?1.12:1.25);this.drawConstellation(ctx,center,scale,this.evaluation,this.elapsed,true);this.drawWaves(ctx,center,scale);}
 drawConstellation(ctx,center,scale,evaluation,t,interactive=false,opts={}){const members=this.population,projected=[];let drawn=interactive?[]:null;
  const tiny=!!opts.tiny;const time=this.visualTime;
  const orbitR=scale/7*3.85*this.zoom;
  ctx.save();ctx.translate(center.x,center.y);ctx.rotate(this.yaw*.16);ctx.scale(1,.67);ctx.lineWidth=.8;for(let k=0;k<5;k++){const rad=orbitR*(.4+k*.21);ctx.strokeStyle=k===3?'#a7dfbd24':'#a6d7d30f';ctx.beginPath();ctx.ellipse(0,0,rad,rad*.78,Math.sin(time*.07+k)*.07,0,TAU);ctx.stroke()}
  ctx.restore();
  // Procedural photon filaments: flowing, curved paths, no baked image or animation video.
  ctx.save();ctx.globalCompositeOperation='screen';
  const pathCount=this.view==='observe'?16:30;
  for(let s=0;s<pathCount;s++){
    const phase=s*2.399963+this.visualTime*(.07+(s%4)*.013),rad=orbitR*(.35+(s%11)*.055);
    const x1=center.x+Math.cos(phase)*rad*1.3,y1=center.y+Math.sin(phase)*rad*.72;
    const x2=center.x+Math.cos(phase+1.9)*rad*.8,y2=center.y+Math.sin(phase+1.9)*rad*.9;
    ctx.beginPath();ctx.moveTo(x1,y1);ctx.bezierCurveTo(center.x+Math.cos(phase-.5)*rad*.35,center.y+Math.sin(phase-1)*rad*.36,center.x+Math.cos(phase+.6)*rad*.38,center.y+Math.sin(phase+.4)*rad*.44,x2,y2);
    ctx.strokeStyle=s%5===0?'rgba(184,255,211,.16)':'rgba(97,194,192,.062)';ctx.lineWidth=s%5===0?1.3:.7;ctx.stroke();
  }
  ctx.restore();
  // Central black-star accretion, with overlapping real gradients instead of images.
  const core=ctx.createRadialGradient(center.x,center.y,4,center.x,center.y,Math.min(this.width,this.height)*.25);core.addColorStop(0,'#a2f5cf31');core.addColorStop(.08,'#5ff6c526');core.addColorStop(.24,'#2a6d7f1c');core.addColorStop(1,'#02050a00');ctx.fillStyle=core;ctx.fillRect(center.x-300,center.y-300,600,600);
  const source=ctx.createRadialGradient(center.x,center.y,0,center.x,center.y,33);source.addColorStop(0,'#ecfff4e8');source.addColorStop(.18,'#d2ffebad');source.addColorStop(1,'#a9ffd000');ctx.fillStyle=source;ctx.beginPath();ctx.arc(center.x,center.y,33,0,TAU);ctx.fill();
  for(let i=0;i<members.length;i++){const person=members[i];const distortion=this.profileFriction*.0006;const obj={x:person.x*(1+distortion),y:person.y*(1+distortion*.6),z:person.z};const pos=this.project(obj,center.x,center.y,scale);if(pos.x<0||pos.x>this.width||pos.y<0||pos.y>this.height)continue;const outcome=evaluation?.outcomes[i];const state=outcome?progressFor(person,outcome,t):0;projected.push({person,pos,state});}
  projected.sort((a,b)=>b.pos.z-a.pos.z);const hovered=[];
  // Light connections, only between a sampled population to preserve frame time.
  ctx.beginPath();for(let i=0;i<projected.length-7;i+=8){const a=projected[i],b=projected[i+5];const dist=Math.hypot(a.pos.x-b.pos.x,a.pos.y-b.pos.y);if(dist<88){ctx.moveTo(a.pos.x,a.pos.y);ctx.lineTo(b.pos.x,b.pos.y)}}ctx.strokeStyle='#91d8d013';ctx.lineWidth=.65;ctx.stroke();
  for(let i=0;i<projected.length;i++){const item=projected[i],p=item.pos,state=item.state;
   if(interactive&&this.pointer.x>=0){const dx=this.pointer.x-p.x,dy=this.pointer.y-p.y,d2=dx*dx+dy*dy;const magnetic=Math.exp(-d2/17000)*.095;p.x+=dx*magnetic;p.y+=dy*magnetic;}
   let rgb=state===0?[[121,181,179],[150,165,200],[156,194,163],[93,125,158]][item.person.seg]:PALETTE[state];const bright=clamp((9-p.depth)/9,.25,1);const n=item.person.id;const twinkle=(Math.sin(time*2.2+n*9.7)*.2+.8);const alpha=(state===0?.52:state===1?.76:state===2?.89:1)*bright*twinkle;const size=clamp(p.r*(state>=3?1.65:1.12),tiny?.7:.88,tiny?3.2:4);
   if(state>=3&&n%8===0){const grad=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,size*6);grad.addColorStop(0,`rgba(${rgb.join(',')},.29)`);grad.addColorStop(1,`rgba(${rgb.join(',')},0)`);ctx.fillStyle=grad;ctx.beginPath();ctx.arc(p.x,p.y,size*6,0,TAU);ctx.fill()}
   ctx.fillStyle=`rgba(${rgb.join(',')},${alpha.toFixed(3)})`;ctx.beginPath();ctx.arc(p.x,p.y,size,0,TAU);ctx.fill();
   if(interactive)drawn.push({x:p.x,y:p.y,person:item.person});
   if(interactive&&Math.hypot(this.pointer.x-p.x,this.pointer.y-p.y)<14)hovered.push(item);
  }
  if(interactive)this.drawn=drawn;
  if(interactive&&this.view==='field'&&this.profile.jargon.length){
   ctx.save();ctx.font='9px monospace';ctx.textAlign='center';
   for(let j=0;j<Math.min(15,this.profile.jargon.length);j++){
    const label=this.profile.jargon[j].toUpperCase();
    const angle=j*2.3999+time*.045,rad=orbitR*(.55+(j%6)*.12);
    let xx=center.x+Math.cos(angle)*rad,yy=center.y+Math.sin(angle)*rad*.64;
    const alpha=clamp(this.profileFriction/180,.06,.42);
    ctx.fillStyle=`rgba(179,206,209,${alpha})`;ctx.fillText(label.slice(0,30),xx,yy);
   }
   ctx.restore();
  }
  if(hovered.length){let near=hovered[hovered.length-1];const x=near.pos.x,y=near.pos.y;ctx.strokeStyle='#d9ffe4';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,12+Math.sin(time*4)*2,0,TAU);ctx.stroke();ctx.fillStyle='#d8fff0';ctx.font='10px monospace';ctx.fillText('MEMBER '+String(near.person.id).padStart(4,'0'),x+20,y-15)}
 }
 drawWaves(ctx,center,scale){
  if(this.pointer.x>=0&&this.pointer.x<this.width&&this.pointer.y>80&&this.pointer.y<this.height-60){
    const pulse=(Math.sin(this.visualTime*3)*.5+.5),r=39+pulse*6;
    ctx.beginPath();ctx.arc(this.pointer.x,this.pointer.y,r,0,TAU);ctx.strokeStyle='rgba(156,240,216,.14)';ctx.lineWidth=.7;ctx.stroke();
    ctx.beginPath();ctx.arc(this.pointer.x,this.pointer.y,5,0,TAU);ctx.strokeStyle='rgba(186,252,222,.48)';ctx.stroke();
  }
  if(this.evaluation){if(this.elapsed<10){const rad=(this.elapsed*.9)*scale/7;ctx.save();ctx.globalCompositeOperation='screen';for(let k=0;k<3;k++){let rr=rad-k*23;if(rr<=0)continue;let grad=ctx.createRadialGradient(center.x,center.y,Math.max(0,rr-18),center.x,center.y,rr+16);grad.addColorStop(0,'#9cf7cb00');grad.addColorStop(.5,`rgba(184,255,220,${.11/(k+1)})`);grad.addColorStop(1,'#c4ffe000');ctx.fillStyle=grad;ctx.beginPath();ctx.arc(center.x,center.y,rr+16,0,TAU);ctx.fill();ctx.beginPath();ctx.arc(center.x,center.y,rr,0,TAU);ctx.strokeStyle=`rgba(172,254,207,${.38/(k+1)})`;ctx.lineWidth=1.4;ctx.stroke()}ctx.restore()}}
 for(const warp of this.warps){const alpha=clamp(1-warp.t/2.3);ctx.beginPath();ctx.arc(warp.x,warp.y,warp.t*140,0,TAU);ctx.strokeStyle=`rgba(227,253,222,${alpha*.35})`;ctx.lineWidth=1;ctx.stroke()}}
 drawComparison(ctx,w,h){const mobile=w<760;let l={x:w*(mobile?.34:.38),y:h*(mobile?.48:.52)},r={x:w*(mobile?.73:.66),y:h*(mobile?.48:.52)};const scale=Math.min(w,h)*(mobile?.62:.83);ctx.save();ctx.beginPath();ctx.moveTo(w*.5,h*.16);ctx.lineTo(w*.5,h*.87);ctx.strokeStyle='#d9ffe131';ctx.stroke();this.drawConstellation(ctx,l,scale,this.comparison.a,12.3,false,{tiny:true});this.drawConstellation(ctx,r,scale,this.comparison.b,12.3,false,{tiny:true});ctx.font='10px monospace';ctx.fillStyle='#cdeada';ctx.textAlign='center';ctx.fillText('BASELINE / A',l.x,h*.82);ctx.fillText('INTERVENTION / B',r.x,h*.82);ctx.restore()}
 drawArtefact(ctx,w,h){const center={x:w*.62,y:h*.5};let count=Math.floor(this.population.length*(this.artefact?.85:1));let scale=Math.min(w,h)*1.15;let t=this.artefact?Math.min(1,(this.visualTime-this.revealAt)/3):0;if(!Number.isFinite(t))t=0;t=t*t*(3-2*t);
 for(let i=0;i<count;i++){const person=this.population[i],p=this.project(person,center.x,center.y,scale);const theta=person.id*2.3999632297;const rr=Math.sqrt(i/count)*Math.min(w,h)*.4;const tx=center.x+Math.cos(theta)*rr,ty=center.y+Math.sin(theta)*rr*.31;let x=ease(p.x,tx,t),y=ease(p.y,ty,t);ctx.fillStyle=i%8===0?'#ffddb6a8':'#bfeada57';ctx.beginPath();ctx.arc(x,y,i%11===0?2:.85,0,TAU);ctx.fill()}
 if(this.artefact){ctx.beginPath();ctx.arc(center.x,center.y,Math.min(w,h)*.45,0,TAU);ctx.strokeStyle=`rgba(249,216,175,${.16*(1-t)})`;ctx.stroke()}}
 drawHUD(ctx,w,h){if(this.view==='artefact')return;const mob=w<760;ctx.save();ctx.fillStyle='#addfc04c';ctx.font='9px monospace';ctx.textAlign='left';let x=mob?19:122;let y=mob?94:114;if(this.view==='field')ctx.fillText('SPACE / Σ 1440 · 3 AXES · SEED 71219',x,y);
 // Frame corners / tracking marks become part of the diegetic interface.
 const cx=this.view==='field'?w*(mob?.56:.68):w*(mob?.71:.66),cy=h*.54;ctx.strokeStyle='#a5f9cc25';ctx.lineWidth=1;const r=mob?Math.min(w,h)*.26:Math.min(w,h)*.35;for(let j=0;j<4;j++){let a=j*Math.PI*.5+Math.PI*.25,xx=cx+Math.cos(a)*r,yy=cy+Math.sin(a)*r;ctx.beginPath();ctx.moveTo(xx-5,yy);ctx.lineTo(xx+5,yy);ctx.moveTo(xx,yy-5);ctx.lineTo(xx,yy+5);ctx.stroke()}ctx.restore()}
 screenshot(){const c=document.createElement('canvas');c.width=1600;c.height=1000;const g=c.getContext('2d');g.fillStyle='#04090d';g.fillRect(0,0,1600,1000);g.drawImage(this.canvas,0,0,1600,1000);const dark=g.createLinearGradient(0,0,1000,0);dark.addColorStop(0,'#01080dec');dark.addColorStop(.85,'#01080d18');g.fillStyle=dark;g.fillRect(0,0,1600,1000);g.fillStyle='#cbf6dd';g.font='22px monospace';g.fillText('I/U/C   /   CASE FILE 001',85,90);g.fillStyle='#f2fff6';g.font='bold 102px Georgia';g.fillText('We simulated',85,310);g.fillText('a universe.',85,423);g.font='italic 68px Georgia';g.fillStyle='#c1f3dd';g.fillText('It was about a toastie.',85,532);g.fillStyle='#bdcfd0';g.font='23px monospace';g.fillText('INSTITUTE OF UNNECESSARY COMPLEXITY',85,905);if(this.evaluation){const rate=(this.evaluation.actionRate*100).toFixed(1)+'%';g.font='bold 86px Georgia';g.fillStyle='#c6f6df';g.fillText(rate,90,708);g.font='20px monospace';g.fillText('SYNTHETIC ACTION RATE — ILLUSTRATIVE ONLY',90,758)}g.fillStyle='#78958e';g.font='16px monospace';g.fillText('LOCAL SIMULATION / NOT A PREDICTIVE MODEL',950,905);return c}
}
