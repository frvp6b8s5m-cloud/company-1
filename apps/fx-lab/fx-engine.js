(function(root){
"use strict";
function makeCurve(amount){const n=44100,curve=new Float32Array(n),k=Math.max(0,amount)*120+1;for(let i=0;i<n;i++){const x=i*2/n-1;curve[i]=Math.tanh(k*x)/Math.tanh(k);}return curve;}
function makeImpulse(context,seconds){const length=Math.max(1,Math.floor(context.sampleRate*seconds)),buffer=context.createBuffer(2,length,context.sampleRate);for(let c=0;c<2;c++){const data=buffer.getChannelData(c);for(let i=0;i<length;i++){const fade=Math.pow(1-i/length,2.5);data[i]=(Math.random()*2-1)*fade;}}return buffer;}
function create(context,destination){
 const input=context.createGain(),eqDry=context.createGain(),eqWet=context.createGain(),eqOut=context.createGain(),low=context.createBiquadFilter(),mid=context.createBiquadFilter(),high=context.createBiquadFilter(),compDry=context.createGain(),compWet=context.createGain(),compOut=context.createGain(),comp=context.createDynamicsCompressor(),compMakeup=context.createGain(),shaper=context.createWaveShaper(),driveDry=context.createGain(),driveWet=context.createGain(),driveOut=context.createGain(),chorusDry=context.createGain(),chorusDelay=context.createDelay(.05),chorusWet=context.createGain(),chorusOut=context.createGain(),lfo=context.createOscillator(),lfoDepth=context.createGain(),delayDry=context.createGain(),delay=context.createDelay(2),feedback=context.createGain(),delayWet=context.createGain(),delayOut=context.createGain(),reverbDry=context.createGain(),predelay=context.createDelay(.2),convolver=context.createConvolver(),reverbWet=context.createGain(),reverbOut=context.createGain(),master=context.createGain(),analyser=context.createAnalyser();
 eqDry.gain.value=0;eqWet.gain.value=1;compDry.gain.value=0;compWet.gain.value=1;low.type="lowshelf";low.frequency.value=120;mid.type="peaking";mid.frequency.value=1200;mid.Q.value=1;high.type="highshelf";high.frequency.value=8000;shaper.oversample="4x";comp.threshold.value=-18;comp.ratio.value=4;comp.attack.value=.01;comp.release.value=.12;comp.knee.value=12;analyser.fftSize=2048;chorusDelay.delayTime.value=.018;
 input.connect(eqDry);input.connect(low);low.connect(mid);mid.connect(high);high.connect(eqWet);eqDry.connect(eqOut);eqWet.connect(eqOut);eqOut.connect(compDry);eqOut.connect(comp);comp.connect(compMakeup);compMakeup.connect(compWet);compDry.connect(compOut);compWet.connect(compOut);
 compOut.connect(driveDry);compOut.connect(shaper);shaper.connect(driveWet);driveDry.connect(driveOut);driveWet.connect(driveOut);
 driveOut.connect(chorusDry);driveOut.connect(chorusDelay);chorusDelay.connect(chorusWet);chorusDry.connect(chorusOut);chorusWet.connect(chorusOut);lfo.connect(lfoDepth);lfoDepth.connect(chorusDelay.delayTime);lfo.start();
 chorusOut.connect(delayDry);chorusOut.connect(delay);delay.connect(delayWet);delay.connect(feedback);feedback.connect(delay);delayDry.connect(delayOut);delayWet.connect(delayOut);
 delayOut.connect(reverbDry);delayOut.connect(predelay);predelay.connect(convolver);convolver.connect(reverbWet);reverbDry.connect(reverbOut);reverbWet.connect(reverbOut);reverbOut.connect(master);master.connect(analyser);analyser.connect(destination);
 const bypass={eq:false,compressor:false,drive:false,chorus:false,delay:false,reverb:false},last={driveMix:.35,chorusMix:.25,delayMix:.22,reverbMix:.20};
 function connectSource(source){source.connect(input);return source;}
 function set(name,value){
  const v=Number(value);if(!Number.isFinite(v))return;
  switch(name){
   case"low":low.gain.setTargetAtTime(v,context.currentTime,.015);break;case"mid":mid.gain.setTargetAtTime(v,context.currentTime,.015);break;case"high":high.gain.setTargetAtTime(v,context.currentTime,.015);break;
   case"threshold":comp.threshold.setTargetAtTime(v,context.currentTime,.015);break;case"makeup":compMakeup.gain.setTargetAtTime(Math.pow(10,v/20),context.currentTime,.015);break;case"ratio":comp.ratio.setTargetAtTime(v,context.currentTime,.015);break;case"attack":comp.attack.setTargetAtTime(v/1000,context.currentTime,.015);break;case"release":comp.release.setTargetAtTime(v/1000,context.currentTime,.015);break;case"knee":comp.knee.setTargetAtTime(v,context.currentTime,.015);break;
   case"drive":shaper.curve=makeCurve(v/100);break;case"driveMix":driveWet.gain.setTargetAtTime(bypass.drive?0:v/100,context.currentTime,.015);driveDry.gain.setTargetAtTime(bypass.drive?1:1-v/100,context.currentTime,.015);break;
   case"chorusRate":lfo.frequency.setTargetAtTime(v,context.currentTime,.015);break;case"chorusDepth":lfoDepth.gain.setTargetAtTime(v/100*.008,context.currentTime,.015);break;case"chorusMix":chorusWet.gain.setTargetAtTime(bypass.chorus?0:v/100,context.currentTime,.015);chorusDry.gain.setTargetAtTime(bypass.chorus?1:1-v/100,context.currentTime,.015);break;
   case"delayTime":delay.delayTime.setTargetAtTime(v/1000,context.currentTime,.015);break;case"feedback":feedback.gain.setTargetAtTime(Math.min(.85,v/100),context.currentTime,.015);break;case"delayMix":delayWet.gain.setTargetAtTime(bypass.delay?0:v/100,context.currentTime,.015);delayDry.gain.setTargetAtTime(bypass.delay?1:1-v/100,context.currentTime,.015);break;
   case"decay":convolver.buffer=makeImpulse(context,v);break;case"predelay":predelay.delayTime.setTargetAtTime(v/1000,context.currentTime,.015);break;case"reverbMix":reverbWet.gain.setTargetAtTime(bypass.reverb?0:v/100,context.currentTime,.015);reverbDry.gain.setTargetAtTime(bypass.reverb?1:1-v/100,context.currentTime,.015);break;case"master":master.gain.setTargetAtTime(v,context.currentTime,.015);break;
  }
 }
 function setBypass(name,enabled){if(!(name in bypass))return;bypass[name]=Boolean(enabled);const now=context.currentTime,tc=.01;const pair=(wet,dry,mix)=>{wet.gain.setTargetAtTime(enabled?0:mix,now,tc);dry.gain.setTargetAtTime(enabled?1:1-mix,now,tc);};
  if(name==="eq")pair(eqWet,eqDry,1);if(name==="compressor")pair(compWet,compDry,1);
  if(name==="drive")pair(driveWet,driveDry,last.driveMix);if(name==="chorus")pair(chorusWet,chorusDry,last.chorusMix);if(name==="delay")pair(delayWet,delayDry,last.delayMix);if(name==="reverb")pair(reverbWet,reverbDry,last.reverbMix);
 }
 function readGainReduction(){return Number.isFinite(comp.reduction)?comp.reduction:0;}
 function readLevel(){const data=new Float32Array(analyser.fftSize);analyser.getFloatTimeDomainData(data);let peak=0;for(const n of data)peak=Math.max(peak,Math.abs(n));return peak;}
 return{input,connectSource,set,setBypass,readLevel,readGainReduction,dispose(){try{lfo.stop();}catch{};input.disconnect();}};
}
root.BZAudioFxEngine={create};
})(typeof window!=="undefined"?window:globalThis);