(function(){
"use strict";
const key="bzaudio.id.profile.preview.v1";
const form=document.getElementById("profile-form");
const status=document.getElementById("profile-status");
const name=document.getElementById("display-name");
const email=document.getElementById("email");
const role=document.getElementById("role");
const clear=document.getElementById("clear-profile");
const allowedRoles=new Set(Array.from(role.options,option=>option.value));
function announce(message){status.textContent=message;}
try{
 const saved=JSON.parse(localStorage.getItem(key)||"null");
 if(saved&&typeof saved==="object"&&!Array.isArray(saved)){
  name.value=typeof saved.name==="string"?saved.name.slice(0,80):"";
  email.value=typeof saved.email==="string"?saved.email.slice(0,254):"";
  role.value=typeof saved.role==="string"&&allowedRoles.has(saved.role)?saved.role:role.value;
  announce("Local profile loaded from this browser.");
 }
}catch{announce("Saved profile could not be read. You can create a new local profile.");}
form.addEventListener("submit",event=>{
 event.preventDefault();
 if(!form.reportValidity())return;
 const cleanName=name.value.trim();
 if(!cleanName){name.setCustomValidity("Enter a name without only spaces.");name.reportValidity();name.setCustomValidity("");return;}
 const profile={name:cleanName,email:email.value.trim(),role:allowedRoles.has(role.value)?role.value:"Other",updatedAt:new Date().toISOString()};
 try{localStorage.setItem(key,JSON.stringify(profile));name.value=cleanName;announce("Profile saved on this device. It is not an authenticated BZaudio account.");}
 catch{announce("This browser could not save the profile. Check local storage settings.");}
});
clear.addEventListener("click",()=>{
 try{localStorage.removeItem(key);form.reset();announce("Local profile cleared from this browser.");}
 catch{announce("Could not clear this browser's saved profile.");}
});
})();