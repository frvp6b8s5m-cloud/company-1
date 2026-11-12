(() => {
"use strict";
const root=document.querySelector("#systemos-app");if(!root)return;
const key="bzaudio.systemos.workspace.v1";
const $=s=>root.querySelector(s),uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,8),clean=(v,n=1500)=>String(v??"").trim().slice(0,n);
const empty=()=>({version:1,activeId:"",projects:[]});
function load(){try{const x=JSON.parse(localStorage.getItem(key)||"null");if(x?.version!==1||!Array.isArray(x.projects))return empty();x.projects=x.projects.filter(p=>p&&typeof p.id==="string"&&typeof p.name==="string").map(p=>({...p,inventory:Array.isArray(p.inventory)?p.inventory:[],signal:Array.isArray(p.signal)?p.signal:[],documents:Array.isArray(p.documents)?p.documents:[],service:Array.isArray(p.service)?p.service:[],activity:Array.isArray(p.activity)?p.activity:[]}));if(!x.projects.some(p=>p.id===x.activeId))x.activeId=x.projects[0]?.id||"";return x}catch{return empty()}}
let state=load();
const active=()=>state.projects.find(p=>p.id===state.activeId)||null;
const say=m=>{$("#sys-status").textContent=m};
function persist(message){try{localStorage.setItem(key,JSON.stringify(state));render();say(message||"Saved in this browser.")}catch{say("Browser storage is unavailable or full. Export your data before continuing.")}}
const val=f=>Object.fromEntries(new FormData(f).entries());
function el(tag,cls,content){const n=document.createElement(tag);if(cls)n.className=cls;if(content!==undefined)n.textContent=content;return n}
function button(label,action,id){const b=el("button","",label);b.type="button";b.dataset.action=action;b.dataset.id=id;return b}
function card(title,meta,notes,action,id){const a=el("article","sys-record"),body=el("div","");body.append(el("strong","",title),el("small","",meta));if(notes)body.append(el("p","",notes));const tools=el("div","sys-record-actions");tools.append(button("Delete",action,id));a.append(body,tools);return a}
function list(target,items,action,title,meta,notes){const box=$(target);box.replaceChildren();if(!items.length){box.append(el("p","sys-empty","No records yet. Add the first one above."));return}items.forEach(x=>box.append(card(title(x),meta(x),notes(x),action,x.id)))}
function render(){
 const p=active(),select=$("#sys-project-select");select.replaceChildren();
 if(!state.projects.length){const o=el("option","","No systems yet");o.value="";select.append(o)}else state.projects.forEach(x=>{const o=el("option","",x.name);o.value=x.id;o.selected=x.id===state.activeId;select.append(o)});
 $("#sys-metric-projects").textContent=state.projects.length;
 $("#sys-metric-equipment").textContent=state.projects.reduce((n,x)=>n+x.inventory.length,0);
 $("#sys-metric-signal").textContent=state.projects.reduce((n,x)=>n+x.signal.length,0);
 $("#sys-metric-service").textContent=state.projects.reduce((n,x)=>n+x.service.length,0);
 $("#sys-today").textContent=new Intl.DateTimeFormat(undefined,{dateStyle:"medium"}).format(new Date());
 $("#sys-active-name").textContent=p?.name||"No system selected";
 $("#sys-active-description").textContent=p?(p.location||p.type)+" · "+(p.description||"Workspace ready."):"Create a system record to begin.";
 $("#sys-overview-subtitle").textContent=p?"Working in "+p.name:"Create your first system to begin.";
 const recent=$("#sys-recent");recent.replaceChildren();if(!p?.activity.length)recent.append(el("p","sys-empty","No activity recorded yet."));else p.activity.slice(-5).reverse().forEach(x=>recent.append(el("p","sys-activity",new Date(x.at).toLocaleString()+" — "+x.label)));
 const projects=$("#sys-project-list");projects.replaceChildren();state.projects.forEach(x=>{const c=card(x.name,(x.type||"System")+" · "+(x.location||"Location not set"),x.description,"delete-project",x.id);c.querySelector(".sys-record-actions").prepend(button(x.id===state.activeId?"Active":"Open","open-project",x.id));projects.append(c)});
 list("#sys-equipment-list",p?.inventory||[],"delete-equipment",x=>x.name,x=>x.category+" · Qty "+x.quantity+" · "+(x.location||"No location"),x=>x.notes);
 list("#sys-document-list",p?.documents||[],"delete-document",x=>x.title,x=>x.type+(x.url?" · "+x.url:""),x=>x.notes);
 list("#sys-service-list",p?.service||[],"delete-service",x=>x.title,x=>x.date+" · "+x.type,x=>x.notes);
 const flow=$("#sys-signal-list");flow.replaceChildren();if(!p?.signal.length)flow.append(el("li","sys-empty","No signal nodes documented yet."));else p.signal.forEach(x=>{const li=el("li",""),body=el("div","");body.append(el("strong","",x.name),el("small","",x.stage+" · "+(x.notes||"No connection notes")));li.append(body,button("Remove","delete-signal",x.id));flow.append(li)});
 root.querySelectorAll("[data-go]").forEach(b=>b.disabled=!p);
}
function go(view){root.querySelectorAll(".sys-tab").forEach(b=>b.classList.toggle("is-active",b.dataset.view===view));root.querySelectorAll(".sys-view").forEach(b=>b.classList.toggle("is-active",b.dataset.panel===view))}
function log(p,msg){p.activity.push({id:uid(),label:msg,at:new Date().toISOString()});p.activity=p.activity.slice(-30)}
function add(form,keyName,map,label){const p=active();if(!p){say("Create or select a system first.");return}const d=val(form),item={id:uid(),...map(d)};p[keyName].push(item);log(p,label(item));form.reset();persist("Saved in this browser.")}
root.addEventListener("click",e=>{const tab=e.target.closest("[data-view]");if(tab){go(tab.dataset.view);return}const nav=e.target.closest("[data-go]");if(nav){go(nav.dataset.go);return}const b=e.target.closest("[data-action]");if(!b)return;const p=active(),id=b.dataset.id,action=b.dataset.action;if(action==="open-project"){state.activeId=id;persist("System selected.");return}if(action==="delete-project"){state.projects=state.projects.filter(x=>x.id!==id);state.activeId=state.projects[0]?.id||"";persist("System deleted.");return}if(!p)return;const fields={"delete-equipment":"inventory","delete-signal":"signal","delete-document":"documents","delete-service":"service"};const field=fields[action];if(field){p[field]=p[field].filter(x=>x.id!==id);log(p,"Removed "+field+" record");persist("Record removed.")}});
$("#sys-project-select").addEventListener("change",e=>{state.activeId=e.target.value;persist("Active system changed.")});
$("#sys-new-project").addEventListener("click",()=>{go("projects");$("#sys-project-form [name=name]").focus()});
$("#sys-project-form").addEventListener("submit",e=>{e.preventDefault();const d=val(e.currentTarget);if(!clean(d.name,80))return;const p={id:uid(),name:clean(d.name,80),location:clean(d.location,120),type:clean(d.type,40),description:clean(d.description,500),inventory:[],signal:[],documents:[],service:[],activity:[]};state.projects.push(p);state.activeId=p.id;log(p,"Created system workspace");e.currentTarget.reset();persist("System created.")});
$("#sys-equipment-form").addEventListener("submit",e=>{e.preventDefault();add(e.currentTarget,"inventory",d=>({name:clean(d.name,100),category:clean(d.category,50),quantity:Math.max(1,Math.min(1000,Number(d.quantity)||1)),location:clean(d.location,100),notes:clean(d.notes,300)}),x=>"Added equipment: "+x.name)});
$("#sys-signal-form").addEventListener("submit",e=>{e.preventDefault();add(e.currentTarget,"signal",d=>({name:clean(d.name,100),stage:clean(d.stage,50),notes:clean(d.notes,300)}),x=>"Added signal node: "+x.name)});
$("#sys-document-form").addEventListener("submit",e=>{e.preventDefault();add(e.currentTarget,"documents",d=>({title:clean(d.title,100),type:clean(d.type,50),url:clean(d.url,500),notes:clean(d.notes,1500)}),x=>"Saved reference: "+x.title)});
$("#sys-service-form").addEventListener("submit",e=>{e.preventDefault();add(e.currentTarget,"service",d=>({title:clean(d.title,100),date:clean(d.date,10),type:clean(d.type,50),notes:clean(d.notes,1500)}),x=>"Logged service: "+x.title)});
$("#sys-export").addEventListener("click",()=>{const blob=new Blob([JSON.stringify({...state,exportedAt:new Date().toISOString()},null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="bzaudio-systemos-backup.json";a.click();URL.revokeObjectURL(url);say("Workspace backup exported.")});
$("#sys-import").addEventListener("change",async e=>{const file=e.target.files?.[0];if(!file)return;try{if(file.size>5000000)throw Error("Backup file exceeds 5 MB.");const data=JSON.parse(await file.text());if(data.version!==1||!Array.isArray(data.projects)||data.projects.length>500)throw Error("Invalid SystemOS backup.");const next=data.projects.filter(p=>p&&typeof p.id==="string"&&typeof p.name==="string").map(p=>({id:clean(p.id,100),name:clean(p.name,80),location:clean(p.location,120),type:clean(p.type,40),description:clean(p.description,500),inventory:Array.isArray(p.inventory)?p.inventory.slice(0,2000):[],signal:Array.isArray(p.signal)?p.signal.slice(0,1000):[],documents:Array.isArray(p.documents)?p.documents.slice(0,1000):[],service:Array.isArray(p.service)?p.service.slice(0,2000):[],activity:Array.isArray(p.activity)?p.activity.slice(-30):[]}));state={version:1,activeId:next.some(p=>p.id===data.activeId)?data.activeId:(next[0]?.id||""),projects:next};persist("Backup imported. Existing workspace data was replaced.")}catch(err){say(err.message||"Could not import backup.")}finally{e.target.value=""}});
render();
})();