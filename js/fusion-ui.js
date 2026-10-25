import {validateSession,generateScore,scoreToMidi,BIG_FIVE,FACETS} from "./fusion-engine.js";

const $=id=>document.getElementById(id);
let session=null,mode="fusion",currentScore=null,audioCtx=null,voices=[];
const descriptions={
 personality:"Nur psychometrische Werte bestimmen die Melodie. Kein Pulssample fließt in diese Partitur ein.",
 pulse:"Nur BPM-Messwerte erzeugen Impulse. Psychometrische Werte werden vollständig ignoriert.",
 fusion:"Big Five + optionale Facetten als Grundstruktur; BPM-Zeitreihe als eigenständige rhythmische Ebene."
};
function status(message,error=false){$("status").textContent=message;$("status").classList.toggle("error",error);}
function userLabel(p){return p.label+" ("+p.id+")";}
function selectedPerson(){return session?.participants.find(p=>p.id===$("person").value);}
function loadData(parsed){
 const result=validateSession(parsed);
 if(!result.valid)throw new Error(result.issues.slice(0,8).join(" "));
 stop();
 session=parsed;
 $("person").replaceChildren(...session.participants.map(p=>{
   const option=document.createElement("option");option.value=p.id;option.textContent=userLabel(p);return option;
 }));
 refresh();
}
function refresh(){
 stop();
 const p=selectedPerson();
 if(!p){status("Keine Daten.",true);return;}
 $("profileStatus").textContent=p.psychometrics?.big_five?"Big Five ✓":"Fehlt";
 $("pulseStatus").textContent=p.biometrics?.heart_rate?.samples?.length+" Werte"||"Fehlt";
 if(p.biometrics?.heart_rate?.samples?.length){
  $("pulseInput").value=Math.round(p.biometrics.heart_rate.samples[0].bpm);
 }
 try{
  currentScore=generateScore(session,p.id,mode);
  $("countPsych").textContent=currentScore.notes.filter(n=>n.source==="psychometry").length;
  $("countPulse").textContent=currentScore.notes.filter(n=>n.source==="biometrics").length;
  $("duration").textContent=currentScore.duration_seconds.toFixed(1)+" s";
  status("Bereit · "+p.label+" · "+mode+" · deterministisches Mapping 0.2");
  draw(currentScore);
 }catch(e){
  currentScore=null;
  $("countPsych").textContent="–";$("countPulse").textContent="–";$("duration").textContent="–";
  status(String(e.message||e),true);draw(null);
 }
}
function draw(score){
 const canvas=$("piano"),ctx=canvas.getContext("2d"),w=canvas.width,h=canvas.height;
 ctx.fillStyle="#101f2c";ctx.fillRect(0,0,w,h);
 if(!score)return;
 const total=score.bars*4;
 for(let i=0;i<=score.bars;i++){const x=18+(w-36)*i/score.bars;ctx.strokeStyle="#314553";ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
 for(const n of score.notes){
  const x=18+n.start_beat/total*(w-36),nw=Math.max(2,n.duration_beats/total*(w-36));
  const y=n.source==="biometrics"?170:150-(n.midi-48)*3.15;
  ctx.fillStyle=n.source==="biometrics"?"#f2b07e":"#7baee9";
  ctx.fillRect(x,Math.max(7,y),nw,n.source==="biometrics"?5:7);
 }
 ctx.font="13px system-ui";ctx.fillStyle="#b3c4cd";ctx.fillText("0 s",18,h-7);
 ctx.fillText(score.duration_seconds.toFixed(1)+" s",w-65,h-7);
}
function stop(){
 for(const node of voices){try{node.stop();}catch(e){/* already stopped */}}
 voices=[];
 if(audioCtx){audioCtx.close().catch(()=>{});audioCtx=null;}
}
function scheduleOsc(ctx,n,origin,bpm){
 const start=origin+n.start_beat*60/bpm;
 const dur=Math.max(.05,n.duration_beats*60/bpm);
 const osc=ctx.createOscillator();
 const gain=ctx.createGain();
 const pulse=n.source==="biometrics";
 osc.type=pulse?"sine":"triangle";
 osc.frequency.setValueAtTime(pulse?115:440*Math.pow(2,(n.midi-69)/12),start);
 if(pulse)osc.frequency.exponentialRampToValueAtTime(58,start+Math.min(.07,dur*.8));
 const peak=(n.velocity/127)*(pulse?.10:.10);
 gain.gain.setValueAtTime(0,start);
 gain.gain.linearRampToValueAtTime(peak,start+.009);
 gain.gain.exponentialRampToValueAtTime(.0001,start+Math.max(.05,Math.min(dur,pulse?.19:dur*.90)));
 osc.connect(gain);gain.connect(ctx.destination);
 osc.start(start);osc.stop(start+dur+.02);
 voices.push(osc);
}
async function play(){
 if(!currentScore)return status("Keine passende Partitur.",true);
 stop();
 try{
  audioCtx=new (window.AudioContext||window.webkitAudioContext)();
  await audioCtx.resume();
  const origin=audioCtx.currentTime+.08;
  currentScore.notes.forEach(n=>scheduleOsc(audioCtx,n,origin,currentScore.bpm));
  status("Spiele "+mode+" – "+currentScore.notes.length+" Ereignisse.");
 }catch(e){status("Audioausgabe fehlgeschlagen: "+e.message,true);}
}
function download(filename,blob){
 const href=URL.createObjectURL(blob),a=document.createElement("a");a.href=href;a.download=filename;
 document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(href),2000);
}
$("play").addEventListener("click",play);
$("stop").addEventListener("click",()=>{stop();status("Wiedergabe gestoppt.");});
$("modes").addEventListener("click",e=>{
 const button=e.target.closest("[data-mode]");if(!button)return;
 mode=button.dataset.mode;
 for(const b of document.querySelectorAll("[data-mode]"))b.classList.toggle("selected",b===button);
 $("modeDescription").textContent=descriptions[mode];refresh();
});
$("person").addEventListener("change",refresh);
$("score").addEventListener("click",()=>{
 if(!currentScore)return;
 download("one-note-"+mode+".lifehouse-score.json",new Blob([JSON.stringify(currentScore,null,2)+"\n"],{type:"application/json"}));
});
$("midi").addEventListener("click",()=>{
 if(!currentScore)return;
 download("one-note-"+mode+".mid",new Blob([scoreToMidi(currentScore)],{type:"audio/midi"}));
});
$("jsonfile").addEventListener("change",async e=>{
 const file=e.target.files[0];if(!file)return;
 if(file.size>2_000_000){status("Datei zu groß (max. 2 MB).",true);return;}
 try{loadData(JSON.parse(await file.text()));}catch(err){status("Import fehlgeschlagen: "+err.message,true);}
 e.target.value="";
});
$("setPulse").addEventListener("click",()=>{
 const p=selectedPerson();if(!p)return;
 const bpm=Number($("pulseInput").value);
 if(!Number.isFinite(bpm)||bpm<35||bpm>220)return status("Puls muss zwischen 35 und 220 BPM liegen.",true);
 // Retain the imported baseline only when provided; otherwise use current BPM.
 const h=p.biometrics?.heart_rate;
 if(!p.biometrics)p.biometrics={};
 p.biometrics.heart_rate={unit:"bpm",baseline_bpm:h?.baseline_bpm??bpm,samples:[{t_seconds:0,bpm,quality:"manual"}]};
 session.project.data_class="sensitive_local";
 refresh();status("Manueller Pulsmesswert übernommen. Keine Speicherung oder Übertragung.");
});
$("demo").addEventListener("click",loadDemo);
async function loadDemo(){
 try{const r=await fetch("./examples/demo.lifehouse-session.json",{cache:"no-store"});if(!r.ok)throw new Error("HTTP "+r.status);loadData(await r.json());}
 catch(err){status("Demo nicht verfügbar: Bitte über GitHub Pages oder einen lokalen HTTP-Server öffnen; alternativ JSON-Datei importieren. "+err.message,true);}
}
loadDemo();
