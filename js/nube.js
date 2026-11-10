/* Conexión con Google Drive + Hoja de cálculo (Apps Script). Si E.API está vacío, el sitio sigue en modo local. */
(function(){const E=window.EX,$=s=>document.querySelector(s),MAXMB=25;
const rnd=()=>{const a="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";let s="";for(let i=0;i<4;i++)s+=a[Math.floor(Math.random()*a.length)];return s};
const b64=f=>new Promise((ok,no)=>{const r=new FileReader();r.onload=()=>ok(String(r.result).split(",")[1]||"");r.onerror=()=>no(r.error);r.readAsDataURL(f)});
const post=async b=>{const r=await fetch(E.API,{method:"POST",body:JSON.stringify(b)});return r.json()};
const note=m=>`<div class="note">${E.esc(m)}</div>`;

document.addEventListener("submit",async e=>{
if(!E.API||e.target.id!=="sub")return;
e.preventDefault();e.stopImmediatePropagation();
const f=e.target,st=E.st,d=new FormData(f),out=$("#out"),btn=f.querySelector("button.btn");
if(!st.sel.size)return out.innerHTML=note("Elige al menos un participante.");
const links=String(d.get("links")).split(/\s+/).filter(u=>/^https?:\/\//i.test(u));
if(!st.files.length&&!links.length)return out.innerHTML=note("Sube al menos un archivo o pega un enlace.");
const big=st.files.find(x=>x.size>MAXMB*1e6);
if(big)return out.innerHTML=note(big.name+" pesa más de "+MAXMB+" MB. Súbelo a Drive y pega el enlace aquí.");
const team=st.people.filter(p=>st.sel.has(p.id)),code="EXP-C"+st.n+"-"+rnd(),aut=true,done=[];
btn.disabled=true;
try{
for(let i=0;i<st.files.length;i++){const x=st.files[i];
out.innerHTML=note("Subiendo "+(i+1)+" de "+st.files.length+": "+x.name+" … no cierres esta página.");
const r=await post({op:"file",code,name:x.name,type:x.type,data:await b64(x)});
if(!r.ok)throw new Error(r.error||"error");done.push({id:r.id,name:x.name,type:x.type,size:x.size})}
const m=await post({op:"meta",code,n:st.n,titulo:d.get("titulo"),desc:d.get("desc"),aprendi:d.get("aprendi"),links,aut,
team:team.map(p=>p.hero),reales:team.map(p=>p.full+" ("+p.age+")"),files:done,fecha:new Date().toISOString()});
if(!m.ok)throw new Error(m.error||"error");
}catch(er){btn.disabled=false;return out.innerHTML=note("No se pudo enviar ("+er.message+"). Revisa el internet y vuelve a intentar; tus archivos siguen aquí.")}
try{await E.put("subs",{code,n:st.n,team:team.map(p=>p.hero),titulo:d.get("titulo"),desc:d.get("desc"),aprendi:d.get("aprendi"),links,aut:false,cloud:true,fecha:new Date().toISOString(),files:st.files.map(x=>({name:x.name,type:x.type,size:x.size,blob:x}))})}catch(er){}
st.files=[];st.sel.clear();f.reset();await E.load();await E.renderEntregas($("#app"));
$("#out").innerHTML=`<div class="ok">🎉 ¡Entrega enviada! Tu código: <div class="code">${code}</div><small>Ya aparece en la Galería.</small></div>`;
},true);

const card=s=>{const ok=x=>/^[\w-]+$/.test(x.id);
const fl=(s.files||[]).filter(ok).slice(0,3).map(x=>{const u="https://drive.google.com/file/d/"+x.id+"/view",t=x.type||"";
const m=/^(image|video)/.test(t)?`<img src="https://drive.google.com/thumbnail?id=${x.id}&sz=w600" alt="${E.esc(x.name)}" loading="lazy">`:`<div class="ai">${t.startsWith("audio")?"🎵":"📄"}</div>`;
return `<figure class="fv"><a href="${u}" target="_blank" rel="noopener">${m}</a><figcaption><b>${E.esc(x.name)}</b></figcaption></figure>`}).join("");
const ln=(s.links||[]).filter(u=>/^https?:\/\//i.test(u)).map(u=>`<p><a class="btn d sm" target="_blank" rel="noopener" href="${E.esc(u)}">🔗 ${E.esc(u.replace(/^https?:\/\//,"").slice(0,40))}</a></p>`).join("");
return `<article class="card sub"><div class="subh"><span class="tag">Clase ${+s.n||""}</span></div><h3>${E.esc(s.titulo)}</h3><div class="team">${(s.team||[]).map(n=>`<span class="pill">${E.esc(n)}</span>`).join("")}</div><p>${E.esc(s.desc)}</p><div class="fgrid">${fl}</div>${ln}</article>`};

const og=E.renderGaleria;
E.renderGaleria=async root=>{await og(root);if(!E.API)return;
try{const j=await(await fetch(E.API+"?action=gallery")).json(),g=$("#gal");
if(j.ok&&g&&j.items.length)g.insertAdjacentHTML("afterbegin",j.items.map(card).join(""))}catch(er){}};
})();
