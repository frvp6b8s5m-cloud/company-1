(function(){
"use strict";
const core=window.BZAudioSystemOSCore,avantisCsv=window.BZAudioAvantisCsv;
if(!core)return;
const $=id=>document.getElementById(id),feedback=$("feedback"),storageKey="bzaudio.systemos.show.v1";
let activeShow=core.createShow({name:"Untitled show"}),activeReport=null;
function announce(message,isError){feedback.textContent=message;feedback.style.color=isError?"#f2c879":"";}
function validateAndStore(show){const result=core.validateShow(show);if(!result.valid)throw new Error("Show package failed validation: "+result.errors.join(" "));activeShow=show;persist();render();}
function persist(){try{activeShow.metadata.updatedAt=new Date().toISOString();const result=core.validateShow(activeShow);if(!result.valid)throw new Error(result.errors.join(" "));localStorage.setItem(storageKey,core.serializeShow(activeShow));announce("Show saved locally in this browser. Export a backup to move it to another device.");}catch(error){announce("Local save failed: "+error.message,true);}}
function render(){
 $("show-name").textContent=activeShow.metadata.name;
 const venue=activeShow.metadata.venue||"No venue assigned";
 const profile=activeShow.consoleProfiles[0];
 const origin=profile?" · "+profile.manufacturer+" "+profile.model:" · Neutral BZaudio show package";
 $("show-meta").textContent=venue+origin+" · "+activeShow.channels.length+" channels · "+activeShow.routing.length+" routes";
 const channelList=$("channel-list");channelList.replaceChildren();$("channel-count").textContent=activeShow.channels.length+" CHANNELS";
 if(!activeShow.channels.length){const empty=document.createElement("p");empty.className="empty";empty.textContent="No channels yet. Add a channel or import a supported show file.";channelList.append(empty);}
 activeShow.channels.forEach(channel=>{
  const row=document.createElement("article");row.className="channel-row";const copy=document.createElement("div"),title=document.createElement("strong"),meta=document.createElement("span");
  title.textContent=channel.label||channel.name||"Unnamed channel";
  const source=typeof channel.source==="string"?channel.source:channel.source?[(channel.source.socketType||""),channel.source.socketNumber?"socket "+channel.source.socketNumber:"",channel.source.sourceSide||""].filter(Boolean).join(" · "):"";
  const preamp=channel.preamp&&Number.isFinite(channel.preamp.gainDb)?" · "+channel.preamp.gainDb+" dB gain":"";
  meta.textContent=[channel.type||"Unknown type",source].filter(Boolean).join(" · ")+preamp;copy.append(title,meta);
  const remove=document.createElement("button");remove.className="secondary";remove.type="button";remove.textContent="Remove";remove.setAttribute("aria-label","Remove "+title.textContent);
  remove.addEventListener("click",()=>{activeShow.channels=activeShow.channels.filter(item=>item.id!==channel.id);persist();render();announce("Channel removed from this local show.");});
  row.append(copy,remove);channelList.append(row);
 });
}
function download(filename,content,type){
 const blob=new Blob([content],{type:type||"application/json"}),url=URL.createObjectURL(blob),anchor=document.createElement("a");
 anchor.href=url;anchor.download=filename;anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function renderReport(report){
 activeReport=report;const section=$("transfer-report");section.hidden=false;
 $("transfer-report-summary").textContent=report.summary;
 const counts=$("transfer-counts");counts.replaceChildren();
 for(const [label,key] of [["Exact","exact"],["Transformed","transformed"],["Needs review","needsReview"],["Unsupported","unsupported"]]){
  const card=document.createElement("article"),caption=document.createElement("span"),value=document.createElement("strong");
  caption.textContent=label;value.textContent=String(report.counts[key]||0);card.append(caption,value);counts.append(card);
 }
 const details=$("transfer-details");details.replaceChildren();
 report.items.forEach(item=>{
  const row=document.createElement("article");row.className="transfer-detail";
  const title=document.createElement("strong");title.textContent=item.field;
  const description=document.createElement("p");description.textContent=item.detail;
  const status=document.createElement("span");status.textContent=item.status;
  row.append(title,description,status);details.append(row);
 });
}
function createAvantisReport(parsed,fileName){
 const warnings=parsed.diagnostics.filter(item=>item.severity==="warning"),errors=parsed.diagnostics.filter(item=>item.severity==="error");
 const report=core.createTransferReport({manufacturer:"Allen & Heath",model:"Avantis",format:"avantis-sectioned-csv",fileName},{format:core.format,schemaVersion:core.schemaVersion,name:"Neutral BZaudio show package"});
 report.status="partial-import";
 report.summary="Partial Avantis CSV import completed. Supported rows were normalized into the BZaudio neutral show package; native Avantis export and cross-vendor transfer are not available.";
 report.counts.transformed=parsed.show.channels.length+parsed.show.routing.length;
 report.counts.needsReview=warnings.length;
 report.counts.unsupported=2;
 report.items=[
  {field:"Channel records",status:"TRANSFORMED",count:parsed.show.channels.length,detail:parsed.show.channels.length+" channel rows parsed into neutral channel records. Selected input patch and preamp fields are retained."},
  {field:"Output patch rows",status:"TRANSFORMED",count:parsed.show.routing.length,detail:parsed.show.routing.length+" output patch rows parsed into neutral routing records."},
  {field:"Virtual Soundcheck",status:"PRESERVED",count:parsed.show.io.length,detail:parsed.show.io.length+" VSC rows preserved as I/O records and vendor source rows."},
  {field:"Scenes and snapshots",status:"UNSUPPORTED",count:0,detail:"Not represented by this partial CSV reader. No scene data was inferred."},
  {field:"Processing and FX",status:"UNSUPPORTED",count:0,detail:"Processing, dynamics, EQ, effects and complete console state are not imported."},
  {field:"Import diagnostics",status:warnings.length?"NEEDS REVIEW":"CHECKED",count:warnings.length+errors.length,detail:warnings.length?warnings.map(item=>item.message).join(" "):"No parser warnings were returned."}
 ];
 report.diagnostics=parsed.diagnostics;
 report.validation={valid:parsed.valid,errorCount:errors.length,warningCount:warnings.length};
 return report;
}
function validateSystemPlan(payload){
 if(!payload||payload.format!=="bzaudio-system-plan"||payload.schemaVersion!==1||!Array.isArray(payload.items)||payload.items.length>100)throw new Error("Invalid System Builder plan.");
 const items=payload.items.map(item=>{if(!item||typeof item.name!=="string"||!item.name.trim()||item.name.length>140||typeof item.category!=="string"||item.category.length>80)throw new Error("System plan contains an invalid item.");const quantity=Number(item.quantity);if(!Number.isInteger(quantity)||quantity<1||quantity>999)throw new Error("System plan quantity is out of range.");return{...item,name:item.name.trim(),quantity};});
 return{...payload,items};
}
function validateShowSheet(payload){
 if(!payload||payload.format!=="bzaudio-show-sheet"||payload.schemaVersion!==1||!Array.isArray(payload.inputs)||payload.inputs.length>100)throw new Error("Invalid Show Workspace sheet.");
 const safeText=(value,max)=>{if(value==null)return"";if(typeof value!=="string"||value.length>max)throw new Error("Show sheet contains an invalid text field.");return value;};
 const date=safeText(payload.date,10);if(date&&!/^\d{4}-\d{2}-\d{2}$/.test(date))throw new Error("Show date must use YYYY-MM-DD.");
 const inputs=payload.inputs.map(item=>{if(!item||typeof item!=="object")throw new Error("Invalid show input row.");const source=safeText(item.source,120).trim();if(!source)throw new Error("Every show input row needs a source name.");return{source,mic:safeText(item.mic,120),notes:safeText(item.notes,500)};});
 return{...payload,show:safeText(payload.show,120),venue:safeText(payload.venue,160),date,stage:safeText(payload.stage,100),notes:safeText(payload.notes,3000),inputs};
}
$("channel-form").addEventListener("submit",event=>{
 event.preventDefault();const label=$("channel-label").value.trim(),type=$("channel-type").value,source=$("channel-source").value.trim();
 if(!label){$("channel-label").focus();return;}
 if(activeShow.channels.length>=1000){announce("Channel list limit reached (1,000 entries).",true);return;}
 const channel={id:"channel-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,8),label,type,source:source||null,extensions:{}};
 activeShow.channels.push(channel);$("channel-form").reset();persist();render();announce("Channel added and saved locally.");
});
$("new-show").addEventListener("click",()=>{$("input-name").value="";$("input-venue").value="";$("show-dialog").showModal();$("input-name").focus();});
$("show-form").addEventListener("submit",event=>{
 if(event.submitter&&event.submitter.id==="create-show"){event.preventDefault();const next=core.createShow({name:$("input-name").value,venue:$("input-venue").value});$("show-dialog").close();validateAndStore(next);announce("New show created and saved locally.");}
});
$("export-show").addEventListener("click",()=>{
 try{const safeName=activeShow.metadata.name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"show";download(safeName+".bzaudio.json",core.serializeShow(activeShow));announce("Validated BZaudio neutral show backup exported. This is not a vendor-native console file.");}
 catch(error){announce(error.message,true);}
});
$("export-report").addEventListener("click",()=>{if(activeReport)download("bzaudio-transfer-report.json",JSON.stringify(activeReport,null,2));});
$("import-show").addEventListener("change",async event=>{
 const file=event.target.files&&event.target.files[0];if(!file)return;
 try{
  if(file.size>core.limits.packageBytes)throw new Error("File exceeds the 10 MB safety limit.");
  const text=await file.text();
  if(file.name.toLowerCase().endsWith(".csv")){
   if(!avantisCsv)throw new Error("Avantis CSV adapter did not load.");
   const parsed=avantisCsv.parse(text);
   if(!parsed.valid)throw new Error("Avantis CSV validation failed: "+parsed.diagnostics.filter(item=>item.severity==="error").map(item=>item.message).join(" "));
   const next=core.createShow({name:"Avantis CSV import — "+file.name});
   next.consoleProfiles.push({id:"profile-avantis-import",manufacturer:"Allen & Heath",model:"Avantis",sourceFormat:"avantis-sectioned-csv",importMode:"read-only-subset"});
   next.channels=parsed.show.channels;next.routing=parsed.show.routing;next.io=parsed.show.io;
   next.extensions["allen-heath.avantis.csv"]=parsed.sections;
   const validation=core.validateShow(next);if(!validation.valid)throw new Error(validation.errors.join(" "));
   validateAndStore(next);const report=createAvantisReport(parsed,file.name);renderReport(report);
   announce("Avantis CSV imported as a partial read-only subset. Review the Transfer Studio report before using the neutral package.");
  }else{
   let payload;try{payload=JSON.parse(text);}catch{throw new Error("File is not valid JSON.");}
   if(payload&&payload.format===core.format){const next=core.parseShow(text);validateAndStore(next);renderReport({summary:"Neutral BZaudio show package validated. This confirms the BZaudio schema only; it does not validate any vendor-native destination.",counts:{exact:0,transformed:0,needsReview:0,unsupported:0},items:[{field:"Neutral show schema",status:"VALIDATED",detail:"BZaudio show package passed schema validation."},{field:"Vendor destination",status:"UNVERIFIED",detail:"No Yamaha or Avantis native writer is enabled."}]});announce("BZaudio neutral show package imported and validated.");}
   else if(payload&&payload.format==="bzaudio-system-plan"){const plan=validateSystemPlan(payload),next=core.createShow({name:plan.name||"Imported system plan"});next.extensions["bzaudio.system-plan.v1"]=plan;validateAndStore(next);renderReport({summary:"System Builder plan imported and preserved as a namespaced extension. It is not treated as verified equipment compatibility or console routing.",counts:{exact:0,transformed:0,needsReview:plan.items.length,unsupported:0},items:[{field:"Equipment plan",status:"PRESERVED",detail:plan.items.length+" planning line items retained in the original extension."}]});announce("System Builder plan imported and preserved.");}
   else if(payload&&payload.format==="bzaudio-show-sheet"){const sheet=validateShowSheet(payload),next=core.createShow({name:sheet.show||"Imported show sheet",venue:sheet.venue||"",notes:sheet.notes||""});next.channels=sheet.inputs.map((input,index)=>({id:"show-sheet-input-"+(index+1),label:input.source,type:"input",extensions:{"bzaudio.show-sheet.v1":{microphone:input.mic,notes:input.notes}}}));next.extensions["bzaudio.show-sheet.v1"]=sheet;validateAndStore(next);renderReport({summary:"Show Workspace sheet imported. Input rows were normalized to neutral channels and the original sheet was preserved.",counts:{exact:0,transformed:sheet.inputs.length,needsReview:0,unsupported:0},items:[{field:"Input list",status:"TRANSFORMED",detail:sheet.inputs.length+" input rows converted to neutral channels; microphone and notes retained in extensions."}]});announce("Show Workspace sheet imported: "+sheet.inputs.length+" input-list entries added.");}
   else throw new Error("Unsupported JSON file. Import a BZaudio show, System Builder plan or Show Workspace sheet.");
  }
 }catch(error){announce("Import rejected: "+error.message,true);}
 finally{event.target.value="";}
});
try{const saved=localStorage.getItem(storageKey);if(saved)activeShow=core.parseShow(saved);}catch(error){announce("Saved SystemOS show could not be restored: "+error.message,true);}
render();
})();