(function(){
"use strict";
const key="bzaudio.system-builder.plan.v1";
const categories=Array.from(document.getElementById("category").options,option=>option.value);
const form=document.getElementById("item-form");
const list=document.getElementById("items");
const checks=document.getElementById("checks");
const status=document.getElementById("save-status");
const planName=document.getElementById("plan-name");
let items=[];
function announce(message){status.textContent=message;}
function persist(){try{localStorage.setItem(key,JSON.stringify({format:"bzaudio-system-builder-local",schemaVersion:1,name:planName.value.trim().slice(0,80),items,updatedAt:new Date().toISOString()}));announce("Saved locally in this browser · "+items.length+" line items");}catch{announce("Could not save locally. Export a backup and check browser storage.");}}
function render(){
 list.replaceChildren();
 if(!items.length){const p=document.createElement("p");p.className="empty";p.textContent="Your system plan is empty. Add the equipment you want to include.";list.append(p);}
 items.forEach((item,index)=>{
  const row=document.createElement("article");row.className="item";
  const copy=document.createElement("div");const title=document.createElement("strong");title.textContent=item.name;
  const meta=document.createElement("span");meta.textContent=item.category+" · "+item.quantity+" unit"+(item.quantity===1?"":"s");copy.append(title,meta);
  const controls=document.createElement("div");controls.className="item-controls";
  const quantity=document.createElement("input");quantity.type="number";quantity.min="1";quantity.max="999";quantity.value=String(item.quantity);quantity.setAttribute("aria-label","Quantity for "+item.name);
  quantity.addEventListener("change",()=>{const value=Number(quantity.value);if(!Number.isInteger(value)||value<1||value>999){quantity.value=String(item.quantity);announce("Quantity must be a whole number from 1 to 999.");return;}items[index].quantity=value;render();persist();});
  const remove=document.createElement("button");remove.className="remove";remove.type="button";remove.textContent="Remove";remove.addEventListener("click",()=>{items.splice(index,1);render();persist();});
  controls.append(quantity,remove);row.append(copy,controls);list.append(row);
 });
 const present=new Set(items.map(item=>item.category)),gaps=[];
 if(!items.length)gaps.push("Add equipment to begin");
 else{if(!present.has("Mixing console"))gaps.push("No mixing console listed");if(!present.has("Main speakers"))gaps.push("No main speakers listed");if(!present.has("Amplifiers"))gaps.push("No amplifiers listed — verify whether selected speakers are powered");}
 checks.textContent=(gaps.length?"Planning prompts: "+gaps.join(" · ")+". ":"Your list includes a console and main speakers. " )+"These are planning prompts only; confirm system design, power, coverage and compatibility with a qualified audio professional.";
}
function validatePlan(data){
 if(!data||data.format!=="bzaudio-system-plan"||data.schemaVersion!==1||!Array.isArray(data.items)||data.items.length>100)throw new Error("Unsupported or invalid BZaudio system plan.");
 const validated=data.items.map(item=>{if(!item||typeof item.name!=="string"||!item.name.trim()||item.name.length>140||!categories.includes(item.category))throw new Error("A plan item has an invalid name or category.");const quantity=Number(item.quantity);if(!Number.isInteger(quantity)||quantity<1||quantity>999)throw new Error("Plan quantities must be whole numbers from 1 to 999.");return{category:item.category,name:item.name.trim(),quantity};});
 return{name:typeof data.name==="string"?data.name.slice(0,80):"",items:validated};
}
form.addEventListener("submit",event=>{
 event.preventDefault();if(!form.reportValidity())return;
 const name=document.getElementById("item-name").value.trim(),quantity=Number(document.getElementById("quantity").value),category=document.getElementById("category").value;
 if(!name||!categories.includes(category)||!Number.isInteger(quantity)||quantity<1||quantity>999||items.length>=100){announce(items.length>=100?"Plan limit reached (100 line items).":"Check the equipment name and quantity.");return;}
 items.push({category,name,quantity});form.reset();document.getElementById("quantity").value="1";render();persist();
});
planName.addEventListener("change",persist);
document.getElementById("export").addEventListener("click",()=>{
 const data={format:"bzaudio-system-plan",schemaVersion:1,createdAt:new Date().toISOString(),name:planName.value.trim(),items,validation:{status:"planning-only",note:"Not a verified compatibility, acoustic, power or engineering design."}};
 const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));const a=document.createElement("a");a.href=url;a.download="bzaudio-system-plan.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);announce("System plan exported. Review it before using it for a quote or build.");
});
document.getElementById("import-file").addEventListener("change",async event=>{
 const file=event.target.files&&event.target.files[0];event.target.value="";if(!file)return;
 if(file.size>262144) {announce("Plan file is too large (maximum 256 KB).");return;}
 try{const parsed=validatePlan(JSON.parse(await file.text()));items=parsed.items;planName.value=parsed.name;render();persist();announce("Validated plan imported and saved locally.");}catch(error){announce(error.message||"Could not import this plan.");}
});
document.getElementById("clear-plan").addEventListener("click",()=>{
 items=[];planName.value="";render();try{localStorage.removeItem(key);announce("Local plan cleared from this browser.");}catch{persist();}
});
try{const saved=JSON.parse(localStorage.getItem(key)||"null");if(saved&&saved.format==="bzaudio-system-builder-local"&&saved.schemaVersion===1){const parsed=validatePlan({format:"bzaudio-system-plan",schemaVersion:1,name:saved.name,items:saved.items});items=parsed.items;planName.value=parsed.name;announce("Restored local system plan · "+items.length+" line items");}}catch{announce("Saved plan could not be restored. Import a backup to recover it.");}
render();
})();