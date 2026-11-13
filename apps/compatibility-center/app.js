(function(){
"use strict";
const records=[
 {id:"ah-avantis-csv",title:"Allen & Heath Avantis — CSV import/export",brand:"Allen & Heath",model:"Avantis",status:"documented",statusLabel:"Manufacturer documented",scope:"Channel names/colours, channel patch sockets, selected input socket settings, output socket patching and Virtual Soundcheck sections.",limitations:"The manufacturer document describes CSV fields; it is not a complete native show-file specification and does not certify cross-console translation.",evidence:"https://support.allen-heath.com/hc/en-gb/articles/7028322319377-CSV-Import-Export",source:"Allen & Heath Support · CSV Import / Export"},
 {id:"yamaha-clql-csv",title:"Yamaha CL/QL — Editor CSV workflow",brand:"Yamaha",model:"CL / QL",status:"documented",statusLabel:"Manufacturer documented",scope:"CL/QL Editor CSV import/export includes channel names, colours/icons, input/output patching and rack patching. The manual describes Short and Normal CSV variants.",limitations:"Exact fixture-specific parsing, encoding, file grouping and round-trip behavior still require genuine exports from each supported editor/firmware version.",evidence:"https://data.yamaha.com/files/download/other_assets/6/798476/qleditor_en_om_f0.pdf",source:"Yamaha QL Editor Operation Manual"},
 {id:"ah-avantis-reader",title:"BZaudio SystemOS — Avantis CSV reader",brand:"BZaudio",model:"Avantis CSV subset",status:"prototype",statusLabel:"BZaudio prototype",scope:"Read-only parsing of documented channel rows, output patch rows and Virtual Soundcheck rows into a neutral show package.",limitations:"Partial subset only. No scenes, processing, complete show state or native Avantis CSV writer. Requires fixture and console round-trip validation before production support.",evidence:"https://support.allen-heath.com/hc/en-gb/articles/7028322319377-CSV-Import-Export",source:"BZaudio implementation + manufacturer format reference"},
 {id:"yamaha-clql-vocab",title:"BZaudio SystemOS — Yamaha CL/QL vocabulary helper",brand:"BZaudio",model:"CL / QL CSV vocabulary",status:"prototype",statusLabel:"BZaudio prototype",scope:"Normalizes documented port and colour vocabulary used in CL/QL CSV workflows.",limitations:"A vocabulary helper only; not a CSV parser, show adapter, writer or verified transfer path.",evidence:"https://data.yamaha.com/files/download/other_assets/6/798476/qleditor_en_om_f0.pdf",source:"BZaudio implementation + Yamaha editor manual"},
 {id:"cross-vendor",title:"Yamaha CL/QL ↔ Allen & Heath Avantis",brand:"Cross-manufacturer",model:"Show-file transfer",status:"unverified",statusLabel:"Unverified",scope:"No end-to-end semantic mapping has been validated between these console families.",limitations:"Do not use for a live show transfer. No complete source parser/destination writer pair, fixture set, semantic round-trip or physical console verification is available.",evidence:"",source:"No validated transfer evidence"}
];
const root=document.getElementById("results"),input=document.getElementById("search"),filter=document.getElementById("status-filter"),count=document.getElementById("result-count");
function render(){
 root.replaceChildren();const q=input.value.trim().toLowerCase(),status=filter.value;
 const matches=records.filter(record=>(status==="all"||record.status===status)&&(record.title+" "+record.brand+" "+record.model+" "+record.scope+" "+record.limitations+" "+record.statusLabel).toLowerCase().includes(q));
 count.textContent=matches.length+" of "+records.length+" evidence records";
 if(!matches.length){const p=document.createElement("p");p.className="empty";p.textContent="No matching records. Try another manufacturer, model or evidence status.";root.append(p);}
 matches.forEach(record=>{
  const card=document.createElement("article");card.className="result";
  const head=document.createElement("div");head.className="result-head";
  const title=document.createElement("strong");title.textContent=record.title;
  const tag=document.createElement("span");tag.className="tag "+(record.status==="documented"?"good":record.status==="unverified"?"warn":"");tag.textContent=record.statusLabel;
  head.append(title,tag);
  const meta=document.createElement("p");meta.className="record-meta";meta.textContent=record.brand+" · "+record.model;
  const scope=document.createElement("p");scope.textContent="Documented scope: "+record.scope;
  const limitations=document.createElement("p");limitations.textContent="Limitations: "+record.limitations;
  const source=document.createElement("p");source.className="record-source";source.textContent="Evidence: "+record.source+" · Reviewed 2026-11-13";
  card.append(head,meta,scope,limitations,source);
  if(record.evidence){const link=document.createElement("a");link.href=record.evidence;link.target="_blank";link.rel="noopener noreferrer";link.textContent="Open source documentation ↗";card.append(link);}
  root.append(card);
 });
}
input.addEventListener("input",render);filter.addEventListener("change",render);render();
})();