import {$,$$,clamp,initShell} from './shared.js';
initShell('home');
const track=$('#story-track');
const panels=$$('.story-panel');
const indicators=$$('.story-indicators button');
const note=['01 // FORM FOLLOWS FILLING','02 // CONTENT TO CHEESE RATIO','03 // MOMENT OF MAXIMUM IMPACT','04 // OPTIMISED NEXT ACTION'];
let current=-1,frame=0;
function updateStory(){if(!track)return;const r=track.getBoundingClientRect();const duration=Math.max(1,r.height-innerHeight);const progress=clamp(-r.top/duration,0,.99999);const active=clamp(Math.floor(progress*4),0,3);if(active!==current){current=active;panels.forEach((p,i)=>p.classList.toggle('active',i===active));indicators.forEach((p,i)=>{p.classList.toggle('active',i===active);p.setAttribute('aria-pressed',String(i===active))});$('#story-count').textContent=`PRINCIPLE 0${active+1} / 04`;$('#story-big-number').textContent=`0${active+1}`;$('#story-note').textContent=note[active];}if(!matchMedia('(prefers-reduced-motion: reduce)').matches){let spread=progress*85;const graphic=$('.story-graphic');graphic.style.setProperty('--layer-top',`${-spread*1.35}px`);graphic.style.setProperty('--layer-ham',`${-spread*.28}px`);graphic.style.setProperty('--layer-cheese',`${spread*.5}px`);graphic.style.setProperty('--layer-base',`${spread*1.15}px`);graphic.style.setProperty('--angle',`${-8+progress*17}deg`)}frame=0;}
function requestUpdate(){if(!frame)frame=requestAnimationFrame(updateStory)}
window.addEventListener('scroll',requestUpdate,{passive:true});window.addEventListener('resize',requestUpdate,{passive:true});
indicators.forEach(b=>b.addEventListener('click',()=>{const index=Number(b.dataset.goto);const scrollable=track.offsetHeight-innerHeight;window.scrollTo({top:track.getBoundingClientRect().top+window.scrollY+scrollable*(index+.08)/4,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}));updateStory();

const heroVisual=$('.hero-visual');if(heroVisual&&matchMedia('(hover:hover) and (pointer:fine)').matches){heroVisual.addEventListener('pointermove',e=>{const r=heroVisual.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;heroVisual.style.setProperty('--tilt-x',`${-y*8}deg`);heroVisual.style.setProperty('--tilt-y',`${x*10}deg`)});heroVisual.addEventListener('pointerleave',()=>{heroVisual.style.setProperty('--tilt-x','0deg');heroVisual.style.setProperty('--tilt-y','0deg')});}
