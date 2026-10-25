import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {validateSession,generateScore,scoreToMidi,MODES} from "../js/fusion-engine.js";

const example=JSON.parse(readFileSync(new URL("../examples/demo.lifehouse-session.json",import.meta.url),"utf8"));
const copy=()=>structuredClone(example);
const make=(s,mode)=>generateScore(s,"p01",mode);
test("synthetic example conforms to the documented runtime contract",()=>{
 assert.equal(validateSession(example).valid,true);
 assert.deepEqual(MODES,["personality","pulse","fusion"]);
});
test("three modes isolate their event sources",()=>{
 for(const [mode,kinds] of [["personality",["psychometry"]],["pulse",["biometrics"]],["fusion",["psychometry","biometrics"]]]){
   const score=make(copy(),mode);
   assert.deepEqual([...new Set(score.notes.map(x=>x.source))].sort(),kinds.sort());
   assert.ok(score.notes.length>0);
 }
});
test("output is deterministic for the same input, person, seed and mapping",()=>{
 assert.deepEqual(make(copy(),"fusion"),make(copy(),"fusion"));
});
test("changing pulse cannot change personality-only score",()=>{
 const one=copy(),two=copy();
 two.participants[0].biometrics.heart_rate.samples.forEach(x=>x.bpm+=15);
 assert.deepEqual(make(one,"personality"),make(two,"personality"));
 assert.notDeepEqual(make(one,"pulse").notes,make(two,"pulse").notes);
});
test("changing traits cannot change pulse-only score",()=>{
 const one=copy(),two=copy();
 two.participants[0].psychometrics.big_five.scores.openness=0.05;
 two.participants[0].psychometrics.big_five.scores.extraversion=0.1;
 assert.deepEqual(make(one,"pulse"),make(two,"pulse"));
 assert.notDeepEqual(make(one,"personality").notes,make(two,"personality").notes);
});
test("missing personality or pulse is accepted in data but rejected when selected mode needs it",()=>{
 const p=copy();delete p.participants[0].psychometrics;
 assert.equal(validateSession(p).valid,true);
 assert.ok(make(p,"pulse").notes.length>0);
 assert.throws(()=>make(p,"personality"),/Big-Five/);
 const h=copy();delete h.participants[0].biometrics;
 assert.equal(validateSession(h).valid,true);
 assert.ok(make(h,"personality").notes.length>0);
 assert.throws(()=>make(h,"fusion"),/Pulswerte/);
});
test("heart rates must be ordered, plausible BPM readings (not HRV)",()=>{
 const s=copy();s.participants[0].biometrics.heart_rate.samples[1].t_seconds=0;
 assert.equal(validateSession(s).valid,false);
 assert.throws(()=>make(s,"fusion"),/aufsteigende/);
});
test("exports Standard MIDI with MThd/MTrk and valid type-0 header",()=>{
 const midi=scoreToMidi(make(copy(),"fusion"));
 assert.equal(new TextDecoder().decode(midi.slice(0,4)),"MThd");
 assert.equal(new TextDecoder().decode(midi.slice(14,18)),"MTrk");
 assert.ok(midi.length>50);
});
