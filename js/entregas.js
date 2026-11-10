/* Registro sin cuenta + entregas con archivos (IndexedDB, todo queda en este navegador). */
(function(){const E=window.EX,$=s=>document.querySelector(s);
const esc=E.esc=s=>String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const st=E.st={n:1,files:[],sel:new Set(),people:[],subs:[],ok:true},MAXMB=100,MAXF=12;
let DB;const db=()=>DB||(DB=new Promise((ok,no)=>{try{const r=indexedDB.open("explora_ia",1);r.onupgradeneeded=()=>{r.result.createObjectStore("people",{keyPath:"id"});r.result.createObjectStore("subs",{keyPath:"code"})};r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)}catch(e){no(e)}}));
const tx=(s,m,f)=>db().then(d=>new Promise((ok,no)=>{const t=d.transaction(s,m),q=f(t.objectStore(s));t.oncomplete=()=>ok(q&&q.result);t.onerror=()=>no(t.error)}));
const all=s=>tx(s,"readonly",o=>o.getAll()),put=(s,v)=>tx(s,"readwrite",o=>o.put(v)),del=(s,k)=>tx(s,"readwrite",o=>o.delete(k));
E.put=put;
const load=E.load=async()=>{try{st.people=await all("people");st.subs=(await all("subs")).sort((a,b)=>a.fecha<b.fecha?1:-1);st.ok=true}catch(e){st.ok=false}};
const sz=b=>b>1e6?(b/1e6).toFixed(1)+" MB":Math.max(1,Math.round(b/1e3))+" KB";
const ico=f=>{const t=f.type||"",n=f.name.toLowerCase();return t.startsWith("image")?"🖼️":t.startsWith("video")?"🎬":t.startsWith("audio")?"🎵":/\.pdf$/.test(n)?"📕":/\.(zip|rar|7z)$/.test(n)?"🗜️":/\.sb[23]$/.test(n)?"🐱":/\.(docx?|txt|odt)$/.test(n)?"📝":/\.(pptx?|key)$/.test(n)?"📊":/\.(xlsx?|csv)$/.test(n)?"📈":"📄"};
const fv=E.fv=(f,rm)=>{const b=f.blob||f,u=URL.createObjectURL(b),t=f.type||"";const m=t.startsWith("image")?`<img src="${u}" alt="${esc(f.name)}">`:t.startsWith("video")?`<video src="${u}" controls preload="metadata"></video>`:t.startsWith("audio")?`<div class="ai">🎵</div><audio src="${u}" controls></audio>`:`<div class="ai">${ico(f)}</div>`;
return `<figure class="fv">${m}<figcaption><b>${esc(f.name)}</b><small>${sz(f.size)}</small></figcaption><a class="dl" href="${u}" download="${esc(f.name)}" title="Descargar">⬇</a>${rm!=null?`<button type="button" class="rmf" data-rm="${rm}" aria-label="Quitar archivo">✕</button>`:""}</figure>`};
const av=p=>{const n=typeof p==="string"?p:p.hero;return `<span class="av" style="--h:${[...n].reduce((a,c)=>a+c.charCodeAt(0),0)%360}">${esc((n.trim()[0]||"★").toUpperCase())}</span>`};
const rnd=()=>{const a="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";let s="";for(let i=0;i<4;i++)s+=a[Math.floor(Math.random()*a.length)];return s};
const rPeople=()=>{$("#ppl").innerHTML=st.people.length?st.people.map(p=>`<div class="hcard">${av(p)}<div><b>${esc(p.hero)}</b><small>${esc(p.full)} · ${p.age} años</small></div><button type="button" data-delp="${p.id}" aria-label="Eliminar a ${esc(p.hero)}">🗑</button></div>`).join(""):'<p class="mut">Aún no hay participantes. ¡Registra al primero!</p>';
$("#chips").innerHTML=st.people.length?st.people.map(p=>`<label class="chip"><input type="checkbox" value="${p.id}" ${st.sel.has(p.id)?"checked":""}><span>${av(p)}${esc(p.hero)}</span></label>`).join(""):'<p class="mut">Primero registra a los participantes (paso 1).</p>'};
const rFiles=()=>{$("#pv").innerHTML=st.files.map((f,i)=>fv(f,i)).join("");$("#dzn").textContent=st.files.length?st.files.length+" archivo(s) listos":"Cualquier tipo de archivo · hasta "+MAXF+" · máx. "+MAXMB+" MB cada uno"};
const subCard=(s,mini)=>`<article class="card sub"><div class="subh"><span class="tag">Clase ${s.n}</span><b class="code">${esc(s.code)}</b>${s.aut?'<span class="ej">EN GALERÍA</span>':""}</div><h3>${esc(s.titulo)}</h3><div class="team">${s.team.map(n=>`<span class="pill">${av(n)}${esc(n)}</span>`).join("")}</div><p>${esc(s.desc)}</p><div class="fgrid">${s.files.slice(0,mini?3:99).map(f=>fv(f)).join("")}</div>${s.links.map(u=>`<p><a class="btn d sm" target="_blank" rel="noopener" href="${esc(u)}">🔗 ${esc(u.replace(/^https?:\/\//,"").slice(0,40))}</a></p>`).join("")}${s.aprendi&&!mini?`<p class="mut"><b>Aprendí:</b> ${esc(s.aprendi)}</p>`:""}${mini?"":`<button class="btn d sm" type="button" data-dels="${esc(s.code)}">Eliminar entrega</button>`}</article>`;
const rMine=()=>{$("#mine").innerHTML=st.subs.length?st.subs.map(s=>subCard(s)).join(""):'<p class="mut">Aquí verás todo lo que subas. ✨</p>'};
const tab=()=>{document.querySelectorAll("#etabs .tb").forEach(b=>b.classList.toggle("on",+b.dataset.n===st.n));$("#eprod").innerHTML="<b>Producto de la clase:</b> "+esc(E.C[st.n-1].prod)};
E.renderEntregas=async root=>{root.innerHTML=`<section class="sk pgh"><div class="w"><div class="eh"><div><h2><span class="grad">Entregas</span></h2><p class="lead">Sin cuentas ni contraseñas: te registras, eliges con quién trabajaste y subes tus creaciones.</p></div><img class="mini" src="assets/img/robot-estrella.webp" alt="" width="150" height="150"></div></div></section>
<section><div class="w"><div class="steps"><div class="panel rv"><h3><span class="num">1</span> Registro</h3><form id="reg" class="f"><label>Nombre completo<input name="full" required maxlength="60" autocomplete="off"></label><label>Nombre heroico ⚡<input name="hero" required maxlength="24" autocomplete="off" placeholder="Ej: Capitán Pixel"></label><label>Edad<input name="age" type="number" min="5" max="99" required></label><button class="btn">Registrarme</button></form><p class="note">En la galería solo se muestra el nombre heroico. Los datos se guardan únicamente en este navegador.</p><div id="ppl" class="ppl"></div></div>
<div class="panel rv"><h3><span class="num">2</span> Tu entrega</h3><div class="tabs" id="etabs">${E.C.map(c=>`<button type="button" class="tb" data-n="${c.n}">${c.e} Clase ${c.n}</button>`).join("")}</div><p class="mut" id="eprod"></p>
<form id="sub" class="f"><div><b>¿Con quiénes trabajaste?</b><div id="chips" class="chips"></div></div><label>Título de tu proyecto<input name="titulo" required maxlength="70"></label><label>Descripción<textarea name="desc" rows="2" required maxlength="400"></textarea></label>
<div id="dz" class="dz" tabindex="0" role="button" aria-label="Elegir archivos"><span class="big">📤</span><b>Suelta aquí tus archivos o haz clic</b><small id="dzn"></small><input id="fi" type="file" multiple hidden></div><div id="pv" class="fgrid"></div>
<label>Enlaces (opcional, uno por línea)<textarea name="links" rows="2" placeholder="https://..."></textarea></label><label>¿Qué aprendí?<textarea name="aprendi" rows="2" maxlength="500"></textarea></label>
<button class="btn">🚀 Guardar mi entrega</button><div id="out" aria-live="polite"></div></form></div></div>
<h3 style="margin:40px 0 14px">Mis entregas</h3><div class="grid" id="mine"></div></div></section>`;
await load();if(!st.ok)$("#mine").insertAdjacentHTML("beforebegin",'<div class="note">Tu navegador no permite guardar archivos (¿modo privado?). Prueba en una ventana normal.</div>');
tab();rPeople();rFiles();rMine();E.reveal(root)};
const addFiles=l=>{const out=[];for(const f of l){if(st.files.length>=MAXF){out.push("Máximo "+MAXF+" archivos.");break}if(f.size>MAXMB*1e6){out.push(f.name+" supera "+MAXMB+" MB.");continue}st.files.push(f)}rFiles();if(out.length)$("#out").innerHTML='<div class="note">'+esc(out.join(" "))+"</div>"};
document.addEventListener("click",async e=>{const t=e.target.closest("button,#dz");if(!t||!$("#sub"))return;
if(t.id==="dz")return $("#fi").click();
if(t.dataset.n){st.n=+t.dataset.n;tab()}
if(t.dataset.rm){st.files.splice(+t.dataset.rm,1);rFiles()}
if(t.dataset.delp){await del("people",t.dataset.delp);st.sel.delete(t.dataset.delp);await load();rPeople()}
if(t.dataset.dels&&confirm("¿Eliminar esta entrega y sus archivos?")){await del("subs",t.dataset.dels);await load();rMine()}});
document.addEventListener("change",e=>{if(e.target.id==="fi"){addFiles(e.target.files);e.target.value=""}
if(e.target.closest&&e.target.closest("#chips")){e.target.checked?st.sel.add(e.target.value):st.sel.delete(e.target.value)}});
document.addEventListener("dragover",e=>{const z=e.target.closest&&e.target.closest("#dz");if(z){e.preventDefault();z.classList.add("over")}});
document.addEventListener("dragleave",e=>{const z=e.target.closest&&e.target.closest("#dz");if(z)z.classList.remove("over")});
document.addEventListener("drop",e=>{const z=e.target.closest&&e.target.closest("#dz");if(z){e.preventDefault();z.classList.remove("over");addFiles(e.dataTransfer.files)}});
document.addEventListener("keydown",e=>{if(e.target.id==="dz"&&(e.key==="Enter"||e.key===" ")){e.preventDefault();$("#fi").click()}});
document.addEventListener("submit",async e=>{const f=e.target;
if(f.id==="reg"){e.preventDefault();const d=new FormData(f);try{await put("people",{id:"p"+Date.now().toString(36)+rnd(),full:d.get("full").trim(),hero:d.get("hero").trim(),age:+d.get("age")});f.reset();await load();rPeople()}catch(er){alert("No se pudo guardar el registro en este navegador.")}}
if(f.id==="sub"){e.preventDefault();const d=new FormData(f),out=$("#out");
if(!st.sel.size)return out.innerHTML='<div class="note">Elige al menos un participante.</div>';
const links=String(d.get("links")).split(/\s+/).filter(u=>/^https?:\/\//i.test(u));
if(!st.files.length&&!links.length)return out.innerHTML='<div class="note">Sube al menos un archivo o pega un enlace.</div>';
const code="EXP-C"+st.n+"-"+rnd(),s={code,n:st.n,team:st.people.filter(p=>st.sel.has(p.id)).map(p=>p.hero),titulo:d.get("titulo"),desc:d.get("desc"),aprendi:d.get("aprendi"),links,aut:true,fecha:new Date().toISOString(),files:st.files.map(x=>({name:x.name,type:x.type,size:x.size,blob:x}))};
try{await put("subs",s)}catch(er){return out.innerHTML='<div class="note">No se pudo guardar (poco espacio o modo privado).</div>'}
st.files=[];st.sel.clear();f.reset();await load();rPeople();rFiles();rMine();out.innerHTML=`<div class="ok">🎉 ¡Entrega guardada! Tu código de galería: <div class="code">${code}</div><small>Esta versión guarda en este navegador; la facilitadora la recibirá cuando se conecte el formulario oficial.</small></div>`}
if(f.id==="bq"){e.preventDefault();await load();const q=$("#bc").value.trim().toUpperCase(),s=st.subs.find(x=>x.code===q);$("#bres").innerHTML=s?subCard(s,true):'<div class="note">No encontramos ese código en este dispositivo.</div>'}});
E.renderGaleria=async root=>{await load();const mine=st.subs.filter(s=>s.aut);
root.innerHTML=`<section class="sk pgh"><div class="w"><h2><span class="grad">Galería</span> de creaciones</h2><p class="lead">Las creaciones de los participantes aparecen aquí apenas se envían.</p></div></section><section><div class="w"><div class="note">Los ejemplos marcados <span class="ej">EJEMPLO</span> son de demostración, no son trabajos de participantes.</div>
<form id="bq" class="srch"><label>Busca tu creación con su código<input id="bc" placeholder="EXP-C1-XXXX" autocomplete="off"></label><button class="btn d">Buscar</button></form><div id="bres"></div>
<div class="grid" id="gal">${mine.map(s=>subCard(s,true)).join("")}${E.DEMO.map(x=>`<div class="card"><div class="thumb" style="background:${E.C[x.c-1].bg}">${x.e}</div><span class="ej">EJEMPLO</span> <span class="tag">Clase ${x.c}</span><h3>${esc(x.n)}</h3><p>${esc(x.d)}</p></div>`).join("")}</div></div></section>`;E.reveal(root)};
})();
