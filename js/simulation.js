// A transparent, seeded toy world. Not a predictive model of pension scheme members.
export const COUNT = 1440;
export const SEGMENTS = [
  {id:'retirement',label:'Near retirement',summary:'A decision is approaching; timely options are especially relevant.',core:.70,color:'#e7ca9b'},
  {id:'midcareer',label:'Mid-career',summary:'Busy, financially engaged some days and distracted on others.',core:.43,color:'#b9d8dd'},
  {id:'new',label:'New joiner',summary:'Learning a new scheme while navigating unfamiliar terms.',core:.48,color:'#b4d3c0'},
  {id:'distant',label:'Disengaged',summary:'A message has to work unusually hard to earn attention.',core:.22,color:'#879aaf'}
];
const JARGON = /\b(in accordance with|provisions|governing|documentation|beneficiary nomination arrangements|comprehensive|designation|prospective|recipients|undertaken|at their earliest convenience|explanatory memorandum|hereby|notwithstanding|commencement|pursuant|aforementioned|contributions? remittance|transfer value|accrual|commutation|crystallisation|drawdown|annuit(?:y|ies)|lump sum benefits|eligible members|scheme rules|actuarial|remuneration|consolidation|utilis(?:e|ation)|facilitat(?:e|ion)|leverag(?:e|ing)|stakeholders|interoperability)\b/gi;
const STOPWORDS = new Set('the a an and of that to in for on at by from as with is are was were be been or your you our we it its this these those a'.split(' '));
export const DEFAULT = {
  subject:'Important information about your pension benefits',
  message:"In accordance with the provisions of the scheme's governing documentation, members are hereby advised that a comprehensive review of beneficiary nomination arrangements should be undertaken at their earliest convenience to ensure the appropriate designation of prospective recipients of death benefits. Please consult the enclosed explanatory memorandum and visit the portal to explore your options.",
  channel:'email',timing:'right',target:'all',noise:55,urgency:50
};
export function seedRandom(seed=71219){let state=seed>>>0;return ()=>{state+=0x6D2B79F5;let t=state;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
function clamp(n,a=0,b=1){return Math.max(a,Math.min(b,n))}
function frac(v){return v-Math.floor(v)}
export function makePopulation(seed=71219){const rand=seedRandom(seed);const people=[];
  for(let n=0;n<COUNT;n++){
    const si=n%4, segment=SEGMENTS[si];
    // Four gently interlocking spiral galaxies, each person keeps their exact position between experiments.
    const band=Math.floor(n/4);const u=band/360;const angle=band*2.3999632 +si*.68;
    const r=.35+3.85*Math.sqrt(u);const d=(rand()-.5)*1.65;
    const phi=angle*.75+si*.62;
    const x=Math.cos(angle)*r +Math.sin(phi)*.6;
    const y=Math.sin(angle)*r*.64 +Math.cos(phi)*.7;
    const z=Math.cos(phi)*1.85+d +Math.sin(angle*.8)*.5;
    const traits={attention:clamp(segment.core+.32*(rand()-.5)),literacy:clamp(.35+rand()*.55),trust:clamp(.25+rand()*.67),time:rand(),relevance:rand(),channel:rand(),clarity:rand(),action:rand(),noise:rand(),pulse:rand(),delay:rand()};
    const age=si===0?57+Math.round(rand()*10):si===2?22+Math.round(rand()*15):si===3?28+Math.round(rand()*26):31+Math.round(rand()*22);
    people.push({id:n+1,seg:si,segment,x,y,z,age,traits,state:0,goal:0,reason:'Not yet contacted',encounterAt:0});
  }
  return people;
}
export function analyseMessage(text,subject=''){
 const combined=(subject+' '+text).trim();const words=combined.match(/[\p{L}\p{N}’'-]+/gu)||[];
 const sentences=combined.split(/[.!?]+/).filter(x=>x.trim().length);const jargon=[...combined.matchAll(JARGON)].map(x=>x[0]);
 const distinct=[...new Set(jargon.map(x=>x.toLowerCase()))];
 const avgSentence=words.length/Math.max(1,sentences.length);
 const lengthy=words.filter(w=>w.length>=11).length;
 const actionMatches=[...combined.matchAll(/\b(check|review|explore|visit|consult|download|contact|update|complete|read|call|nominate|consider|log in|sign in|compare|register|submit)\b/gi)];
 // Count distinct tasks rather than individual verb occurrences or a repeat in the subject.
 const taskGroups=[
  /\b(check|review|update|nominate)\b/i,
  /\b(explore|compare|consider)\b/i,
  /\b(consult|read|download)\b/i,
  /\b(contact|call)\b/i,
  /\b(register|submit|complete)\b/i
 ];
 const actionCount=taskGroups.filter(re=>re.test(text)).length||(/\bvisit|log in|sign in\b/i.test(text)?1:0);
 const passive=(combined.match(/\b(be|been|being|is|are|was|were)\s+\w+ed\b/gi)||[]).length;
 const friction=clamp(Math.round(distinct.length*8+Math.max(0,avgSentence-14)*1.8+lengthy*2.5+Math.max(0,words.length-45)*.2+passive*5),0,100);
 const clarity=clamp(1-friction/120,.14,.97);
 const focus=clamp(1-Math.max(0,actionCount-1)*.17,.22,1);
 let intent=/beneficiar|death benefit|nominee/i.test(combined)?'beneficiaries':/retire|retirement|drawdown|annuit|pension options/i.test(combined)?'retirement':/contribut|saving|pay in/i.test(combined)?'contributions':'general';
 const meaningfulVerb=/\b(check|update|review|explore|nominate|log in|sign in|contact|complete|compare)\b/i.test(combined);
 const wordCount=words.length;
 return {words:wordCount,sentences:sentences.length,jargon:distinct,actionCount,avgSentence,friction,clarity,focus,intent,meaningfulVerb,passive, lengthy};
}
export function rewriteMessage(cfg){const a=analyseMessage(cfg.message,cfg.subject);
 if(a.intent==='beneficiaries')return {subject:'Check who would receive your pension',message:'Check who would receive your pension if you die. You can review or update your beneficiaries online. It takes about five minutes.'};
 if(a.intent==='retirement')return {subject:'Explore your retirement options',message:'Thinking about retirement? Explore the ways you could take your pension, including the choices and risks. Start by comparing your options online.'};
 if(a.intent==='contributions')return {subject:'Check what you’re saving for retirement',message:'Want to understand your pension savings? Check your current contributions and see what a change could mean. Sign in to your pension account.'};
 return {subject:'One thing to do with your pension',message:'Your pension information is available online. Sign in to see your details and check whether you need to make any changes.'};
}
// Probability gates using fixed personal random values: results change deterministically with the intervention.
// This is purposefully illustrative, not empirically calibrated.
export function evaluate(population,cfg){const analysis=analyseMessage(cfg.message,cfg.subject);
 const targeted=cfg.target;const timing={early:.69,right:1,late:.18}[cfg.timing]||1;
 const channel={email:.83,post:.64,sms:.93}[cfg.channel]||.8;
 const noise=clamp(+cfg.noise/100);const urgency=clamp(+cfg.urgency/100);
 let counts=[0,0,0,0],cohorts=SEGMENTS.map((s)=>({name:s.label,total:0,reach:0,read:0,understand:0,action:0}));
 const outcomes=population.map(person=>{
  const tr=person.traits;const segment=person.seg;
  const relevant=analysis.intent==='retirement'?segment===0:analysis.intent==='beneficiaries'?segment===0||segment===1:analysis.intent==='contributions'?segment===1||segment===2:true;
  let addressed=targeted==='all'||(targeted==='relevant'&&relevant)||(targeted==='retirees'&&segment===0)||(targeted==='new'&&segment===2);
  const fit=relevant?1:.61;
  const coverage=clamp((channel*(.9+tr.attention*.22))*(1-noise*.29)*(targeted==='all'?.94:1));
  const reach=addressed&&tr.channel<coverage;
  const readingChance=clamp((.25+tr.attention*.65 + urgency*.17)*(1-noise*.47)*(0.88+analysis.focus*.15)*(cfg.channel==='sms'?1.09:1));
  const read=reach&&tr.noise<readingChance;
  const understanding=clamp((analysis.clarity*.85+tr.literacy*.34-.13) * (analysis.words>100?.88:1) * (tr.trust*.34+.79));
  const understand=read&&tr.clarity<understanding;
  const actionChance=clamp((.17+tr.attention*.24+tr.relevance*.20+urgency*.16)*timing*fit*(.4+.6*analysis.focus)*(analysis.meaningfulVerb?1:.62));
  const act=understand&&tr.action<actionChance;
  const goal=act?4:understand?3:read?2:reach?1:0;
  const distance=Math.sqrt(person.x**2+person.y**2+person.z**2);const at=.5+(distance/5.1)*4.0;
  let reason=goal===0?(addressed?'The message did not cut through this person’s channel and attention conditions.':'This member was not in the target audience.'):goal===1?'The signal reached this member, but did not earn a read.':goal===2?'The message was read, but its language was not understood in this illustrative model.':goal===3?'The meaning landed, but the moment, focus or competing demands prevented an action.':'The message reached this member, was understood and resulted in a simulated action.';
  cohorts[segment].total++;if(reach){counts[0]++;cohorts[segment].reach++;}if(read){counts[1]++;cohorts[segment].read++;}if(understand){counts[2]++;cohorts[segment].understand++;}if(act){counts[3]++;cohorts[segment].action++;}
  return {goal,at,reason, addressed, relevant};
 });
 return {cfg:{...cfg},analysis,outcomes,counts,cohorts,total:population.length,actionRate:counts[3]/population.length};
}
export function progressFor(person,outcome,t){if(!outcome||outcome.goal===0||t<outcome.at)return 0;return Math.min(outcome.goal,1+Math.floor(Math.max(0,t-outcome.at)/.58));}
export function snapshot(evaluation,t){if(!evaluation)return [0,0,0,0];const counts=[0,0,0,0];for(let i=0;i<evaluation.outcomes.length;i++){const o=evaluation.outcomes[i];if(o.goal===0||t<o.at)continue;const state=Math.min(o.goal,1+Math.floor((t-o.at)/.58));for(let step=1;step<=state;step++)counts[step-1]++;}return counts;}
export function shareConfig(cfg){return btoa(encodeURIComponent(JSON.stringify(cfg))).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');}
export function loadConfig(encoded){try{const fixed=encoded.replace(/-/g,'+').replace(/_/g,'/');const data=JSON.parse(decodeURIComponent(atob(fixed)));const allowed=['subject','message','channel','timing','target','noise','urgency'];const out={...DEFAULT};for(const k of allowed){if(data[k]!==undefined)out[k]=data[k]};return out;}catch{return null;}}
