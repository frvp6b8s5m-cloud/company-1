const wave = document.querySelector(".wave-bars");
if (wave) {
  const heights = [12,22,36,58,82,110,76,48,94,126,88,54,34,70,108,80,45,24,60,96,72,38,18,50,84,62,30,14,42,74,52,24,12];
  wave.innerHTML = heights.map((h,i)=>'<i style="--h:'+h+'px;--d:'+((i%9)*-.13)+'s"></i>').join("");
}
const meter = document.querySelector(".meter");
if (meter) {
  const levels=[18,34,53,75,92,68,43,81,58,35,65,24];
  meter.innerHTML=levels.map(h=>'<i style="--mh:'+h+'px"></i>').join("");
}
const menuButton=document.querySelector(".menu-toggle");
const nav=document.querySelector(".nav");
if(menuButton&&nav){
  menuButton.addEventListener("click",()=>{
    const open=nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded",String(open));
    menuButton.setAttribute("aria-label",open?"Close navigation":"Open navigation");
  });
  nav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{
    nav.classList.remove("open");menuButton.setAttribute("aria-expanded","false");
  }));
}
const year=document.querySelector("#year");
if(year)year.textContent=new Date().getFullYear();
const form=document.querySelector("#project-form");
if(form){
  form.addEventListener("submit",event=>{
    event.preventDefault();
    if(!form.reportValidity())return;
    const data=new FormData(form);
    const subject=encodeURIComponent("BZaudio project inquiry — "+data.get("service"));
    const body=encodeURIComponent("Name: "+data.get("name")+"\nEmail: "+data.get("email")+"\nService: "+data.get("service")+"\n\nProject details:\n"+data.get("message"));
    const status=form.querySelector(".form-status");
    status.textContent="Your email draft is ready. Review it and send from your email app.";
    window.location.href="mailto:?subject="+subject+"&body="+body;
  });
}