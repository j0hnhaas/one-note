// ONE NOTE — experimental composition engine 0.2
// No original test items are bundled. No diagnostic or empirical personality-to-music claim.
export const BIG_FIVE = ["openness","conscientiousness","extraversion","agreeableness","neuroticism"];
export const FACETS = ["warmth","analytical_interest","emotional_stability","assertiveness","liveliness","rule_orientation","social_boldness","sensitivity","vigilance","imagination","privacy","self_doubt","flexibility","self_reliance","orderliness","tension"];
export const MODES = ["personality","pulse","fusion"];
export const MAPPING_ID = "one-note-dual-layer-demo-v0.2";

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const inRange=(v,a,b)=>typeof v==="number"&&Number.isFinite(v)&&v>=a&&v<=b;
const mean=a=>a.reduce((s,x)=>s+x,0)/a.length;
function hash(text){let h=2166136261;for(let i=0;i<text.length;i++){h=Math.imul(h^text.charCodeAt(i),16777619);}return h>>>0;}
function randomFrom(seed){let a=seed>>>0;return ()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};}
function normalizedScoreBlock(obj,keys,path,issues){
 if(!obj||typeof obj!=="object"||typeof obj.instrument!=="string"||!obj.instrument.trim()){issues.push(path+": Instrument-ID fehlt.");return;}
 if(typeof obj.instrument_version!=="string"||!obj.instrument_version.trim())issues.push(path+": Instrumentversion fehlt.");
 if(typeof obj.scoring!=="string"||!obj.scoring.trim())issues.push(path+": Scoring-Verfahren fehlt.");
 if(!obj.scores||typeof obj.scores!=="object"){issues.push(path+": scores fehlen.");return;}
 for(const key of keys) if(!inRange(obj.scores[key],0,1))issues.push(path+"."+key+": Zahl 0–1 erforderlich.");
}
export function validateSession(data){
 const issues=[];
 if(!data||data.format!=="lifehouse-session"||data.version!=="0.2.0")issues.push("Format/Version muss lifehouse-session 0.2.0 sein.");
 if(!data||!data.project||typeof data.project.id!=="string")issues.push("Projekt-ID fehlt.");
 if(!data||!Array.isArray(data.participants)||data.participants.length<1||data.participants.length>12){issues.push("1–12 Teilnehmende erforderlich.");return {valid:false,issues};}
 const ids=new Set();
 for(const [i,p] of data.participants.entries()){
  const loc="participants["+i+"]";
  if(!p||typeof p.id!=="string"||!p.id||ids.has(p.id)){issues.push(loc+": ID fehlt oder ist doppelt.");continue;}
  ids.add(p.id);
  if(p.psychometrics){
    if(p.psychometrics.big_five)normalizedScoreBlock(p.psychometrics.big_five,BIG_FIVE,loc+".big_five",issues);
    if(p.psychometrics.extended)normalizedScoreBlock(p.psychometrics.extended,FACETS,loc+".extended",issues);
  }
  if(p.biometrics?.heart_rate){
   const h=p.biometrics.heart_rate;
   if(h.unit!=="bpm"||!Array.isArray(h.samples)||h.samples.length<1)issues.push(loc+": Puls benötigt BPM-Samples.");
   else {
    let last=-1;
    if(h.samples.length>10000)issues.push(loc+": Maximal 10000 Pulsmessungen.");
    for(const sample of h.samples){
     if(!inRange(sample.t_seconds,0,3600)||sample.t_seconds<=last||!inRange(sample.bpm,35,220))issues.push(loc+": Puls braucht aufsteigende Zeitpunkte und BPM 35–220.");
     last=sample.t_seconds;
     if(sample.quality!==undefined&&!["measured","manual","simulated"].includes(sample.quality))issues.push(loc+": unbekannte Messqualität.");
    }
   }
   if(h.baseline_bpm!==undefined&&!inRange(h.baseline_bpm,35,220))issues.push(loc+": ungültige Puls-Baseline.");
  }
 }
 const comp=data.composition;
 if(!comp||!inRange(comp.tempo_bpm,40,240)||!Number.isInteger(comp.bars)||comp.bars<2||comp.bars>32||!Number.isInteger(comp.seed)||comp.mapping_id!==MAPPING_ID)issues.push("Komposition: tempo_bpm (40–240), bars (2–32), ganzzahliger seed und gültige mapping_id nötig.");
 if(data.sociometry){
  const s=data.sociometry;
  if(typeof s.criterion!=="string"||!Array.isArray(s.links))issues.push("Soziometrie benötigt Kriterium und Links.");
  else for(const link of s.links){
   if(!ids.has(link.source)||!ids.has(link.target)||link.source===link.target||!inRange(link.weight,0,1))issues.push("Soziometrischer Link ungültig.");
  }
 }
 return {valid:issues.length===0,issues};
}
function interpPulse(samples,t){
 if(t<=samples[0].t_seconds)return samples[0].bpm;
 const n=samples.length;
 if(t>=samples[n-1].t_seconds)return samples[n-1].bpm;
 let lo=0,hi=n-1;
 while(hi-lo>1){const mid=(lo+hi)>>1;if(samples[mid].t_seconds<=t)lo=mid;else hi=mid;}
 const a=samples[lo],b=samples[hi],f=(t-a.t_seconds)/(b.t_seconds-a.t_seconds);
 return a.bpm+(b.bpm-a.bpm)*f;
}
function getHeartRate(participant){
 const hr=participant.biometrics?.heart_rate;
 if(!hr||!Array.isArray(hr.samples)||!hr.samples.length)throw new Error("Für diesen Modus fehlen Pulswerte.");
 return hr;
}
function createPsychometricNotes(participant,bpm,bars,seed,mode){
 const p=participant.psychometrics?.big_five;
 if(!p)throw new Error("Für diesen Modus fehlen Big-Five-Werte.");
 const x=p.scores;
 const f=participant.psychometrics?.extended?.scores;
 const rand=randomFrom(hash(participant.id+":"+seed+":"+MAPPING_ID));
 const scale=[0,2,3,5,7,9,10];const notes=[];
 const openness=x.openness,ext=x.extraversion,con=x.conscientiousness,agr=x.agreeableness,neu=x.neuroticism;
 // Extraversion -> note activity; Conscientiousness -> metrical regularity;
 // Openness -> variation; Agreeableness -> lengths; Neuroticism -> dynamic contrasts.
 // Synthetic 16-facet prototype -> secondary colour only; no double-counting claims.
 const step=ext>0.70?0.5:ext>0.35?1:2;
 const extraVariation=f? (f.imagination+f.flexibility)/2 : 0.5;
 const range=5+Math.round(8*openness);
 const base=50+Math.round(10*ext);
 let n=0;
 for(let beat=0;beat<bars*4;beat+=step){
  const chance=0.45+ext*0.45;
  if(rand()>chance)continue;
  const grid=con>0.65?Math.round(beat):con>0.35?Math.round(beat*2)/2:beat;
  const index=Math.max(0,Math.min(range,Math.round((n*2+rand()*4+(extraVariation-0.5)*5+Math.sin(beat/5)*3)% (range+1))));
  const midi=clamp(base+12*Math.floor(index/7)+scale[index%7],45,88);
  const duration=clamp(step*(0.35+0.85*agr),0.12,2);
  const dynamic=clamp(Math.round(62+16*neu*(rand()>.5?1:-1)+12*(f?.assertiveness??0.5)),35,108);
  notes.push({source:"psychometry",kind:"melody",person_id:participant.id,midi,start_beat:Number(grid.toFixed(3)),duration_beats:Number(duration.toFixed(3)),velocity:dynamic,channel:0});
  n++;
 }
 return notes;
}
function createPulseNotes(participant,bpm,bars){
 const h=getHeartRate(participant),duration=bars*4*60/bpm;
 const values=h.samples.map(x=>x.bpm);
 const baseline=h.baseline_bpm??mean(values);
 let t=0,notes=[],steps=0;
 while(t<duration&&steps<1000){
  const current=interpPulse(h.samples,t);
  const delta=clamp((current-baseline)/Math.max(15,baseline*.25),-1,1);
  notes.push({source:"biometrics",kind:"heartbeat",person_id:participant.id,midi:48,start_beat:Number((t*bpm/60).toFixed(4)),duration_beats:0.14,velocity:clamp(Math.round(58+17*delta),35,100),channel:9});
  t+=60/clamp(current,35,220);steps++;
 }
 return notes;
}
export function generateScore(data,personId,mode="fusion"){
 const v=validateSession(data);if(!v.valid)throw new Error(v.issues.join("\n"));
 if(!MODES.includes(mode))throw new Error("Unbekannter Wiedergabemodus.");
 const person=data.participants.find(x=>x.id===personId);if(!person)throw new Error("Person nicht gefunden.");
 const {tempo_bpm:bpm,bars,seed}=data.composition;
 const notes=[];
 if(mode!=="pulse")notes.push(...createPsychometricNotes(person,bpm,bars,seed,mode));
 if(mode!=="personality")notes.push(...createPulseNotes(person,bpm,bars));
 notes.sort((a,b)=>a.start_beat-b.start_beat || a.channel-b.channel || a.midi-b.midi);
 return {format:"lifehouse-score",version:"0.2.0",source_project_id:data.project.id,person_id:person.id,engine:MAPPING_ID,mode,bpm,bars,meter:[4,4],duration_seconds:bars*4*60/bpm,layers:{psychometry:mode!=="pulse",biometrics:mode!=="personality",sociometry:false},notes};
}
// MIDI format 0; separate channels distinguish melody and pulse (GM channel 10 percussion).
const vlq=n=>{let b=[n&127];while(n>>=7)b.unshift((n&127)|128);return b;};
const chunk=(name,bytes)=>[...name.split("").map(c=>c.charCodeAt(0)),(bytes.length>>>24)&255,(bytes.length>>>16)&255,(bytes.length>>>8)&255,bytes.length&255,...bytes];
export function scoreToMidi(score){
 const ppq=480,tempo=Math.round(60000000/score.bpm);const events=[];
 for(const n of score.notes){
  const start=Math.round(n.start_beat*ppq),end=Math.max(start+1,Math.round((n.start_beat+n.duration_beats)*ppq)),ch=n.channel;
  events.push({tick:start,order:1,b:[0x90|ch,n.midi,n.velocity]});
  events.push({tick:end,order:0,b:[0x80|ch,n.midi,0]});
 }
 events.sort((a,b)=>a.tick-b.tick||a.order-b.order);
 const track=[0,0xFF,0x51,3,(tempo>>>16)&255,(tempo>>>8)&255,tempo&255];
 let prev=0;for(const e of events){track.push(...vlq(e.tick-prev),...e.b);prev=e.tick;}
 track.push(0,0xFF,0x2F,0);
 return new Uint8Array([...chunk("MThd",[0,0,0,1,0,0,(ppq>>>8)&255,ppq&255]),...chunk("MTrk",track)]);
}