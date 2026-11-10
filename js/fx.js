/* Efectos: cielo de estrellas + destellos del mouse, texto, tarjetas con foco, contadores. */
(function(){const E=window.EX=window.EX||{},RM=matchMedia("(prefers-reduced-motion:reduce)").matches;E.RM=RM;
const COL=["#ffffff","#FFD65A","#B69AFF","#16C6D3"];
const star=(c,x,y,r,a)=>{c.beginPath();for(let i=0;i<10;i++){const t=a+i*Math.PI/5,d=i%2?r*.45:r;c.lineTo(x+Math.cos(t)*d,y+Math.sin(t)*d)}c.closePath();c.fill()};
E.sky=(host,mouse)=>{const cv=document.createElement("canvas");cv.className="sky";cv.setAttribute("aria-hidden","true");host.prepend(cv);
const x=cv.getContext("2d"),S=[],P=[];let w=0,h=0,on=false,last=0,shoot=null;const dpr=Math.min(devicePixelRatio||1,2);
const rs=()=>{const r=host.getBoundingClientRect();w=r.width;h=r.height;cv.width=w*dpr;cv.height=h*dpr;x.setTransform(dpr,0,0,dpr,0,0);S.length=0;const n=Math.round(w*h/9000);for(let i=0;i<n;i++)S.push({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.6+.4,p:Math.random()*6.3,v:.6+Math.random()*2.2,c:COL[i%4]})};
const draw=t=>{x.clearRect(0,0,w,h);
for(const s of S){const a=RM?.7:.25+.75*Math.abs(Math.sin(t/1000*s.v+s.p));x.globalAlpha=a;x.fillStyle=s.c;if(s.r>1.5){star(x,s.x,s.y,s.r*3.2,t/3000*(s.v-1.5))}else{x.beginPath();x.arc(s.x,s.y,s.r,0,6.3);x.fill()}}
if(shoot){x.globalAlpha=shoot.l;const g=x.createLinearGradient(shoot.x,shoot.y,shoot.x-90,shoot.y-40);g.addColorStop(0,"#fff");g.addColorStop(1,"transparent");x.strokeStyle=g;x.lineWidth=2;x.beginPath();x.moveTo(shoot.x,shoot.y);x.lineTo(shoot.x-90,shoot.y-40);x.stroke();shoot.x+=9;shoot.y+=4;shoot.l-=.012;if(shoot.l<=0)shoot=null}
else if(!RM&&Math.random()<.004)shoot={x:Math.random()*w*.6,y:Math.random()*h*.4,l:1};
for(let i=P.length-1;i>=0;i--){const p=P[i];p.x+=p.vx;p.y+=p.vy;p.vy+=.03;p.l-=.022;p.a+=p.ra;if(p.l<=0){P.splice(i,1);continue}x.globalAlpha=p.l;x.fillStyle=p.c;star(x,p.x,p.y,p.r*p.l+1,p.a)}
x.globalAlpha=1};
const loop=t=>{if(!on)return;draw(t);requestAnimationFrame(loop)};
new IntersectionObserver(es=>{on=es[0].isIntersecting;if(on){rs();RM?draw(0):requestAnimationFrame(loop)}}).observe(host);
addEventListener("resize",()=>{if(on)rs()});
if(mouse&&!RM)host.addEventListener("pointermove",e=>{const r=host.getBoundingClientRect(),px=e.clientX-r.left,py=e.clientY-r.top;
host.style.setProperty("--mx",((px/r.width)*2-1).toFixed(3));host.style.setProperty("--my",((py/r.height)*2-1).toFixed(3));
if(performance.now()-last<28)return;last=performance.now();for(let i=0;i<3;i++)P.push({x:px,y:py,vx:(Math.random()-.5)*2.6,vy:(Math.random()-.9)*2.2,l:1,r:3+Math.random()*7,a:Math.random()*6,ra:(Math.random()-.5)*.2,c:COL[Math.floor(Math.random()*4)]})});
if(mouse&&!RM)host.addEventListener("pointerdown",e=>{const r=host.getBoundingClientRect();for(let i=0;i<24;i++){const a=Math.random()*6.3,v=1+Math.random()*4;P.push({x:e.clientX-r.left,y:e.clientY-r.top,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:1,r:4+Math.random()*8,a:0,ra:.1,c:COL[i%4]})}})};
E.split=el=>{el.setAttribute("aria-label",el.textContent);let i=0;const w=n=>[...n.childNodes].forEach(c=>{if(c.nodeType===3){const f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(t=>{if(!t)return;if(/^\s+$/.test(t))return f.append(" ");const s=document.createElement("span");s.className="wd";[...t].forEach(ch=>{const q=document.createElement("span");q.className="ch";q.style.setProperty("--i",i++);q.textContent=ch;s.append(q)});f.append(s)});c.replaceWith(f)}else w(c)});w(el)};
E.type=(el,ws)=>{if(E.RM){el.textContent=ws[0];return}let i=0,j=0,d=1;const t=()=>{if(!el.isConnected)return;const w=ws[i];j+=d;el.textContent=w.slice(0,j);let ms=d>0?90:45;if(d>0&&j===w.length){d=-1;ms=1500}else if(d<0&&j===0){d=1;i=(i+1)%ws.length;ms=300}setTimeout(t,ms)};t()};
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);if(e.target.dataset.n)count(e.target)}}),{threshold:.15});
const count=el=>{const to=+el.dataset.n;if(RM){el.textContent=to;return}const t0=performance.now(),f=t=>{const k=Math.min((t-t0)/1200,1);el.textContent=Math.round(to*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)};
E.reveal=root=>{root.querySelectorAll(".rv,[data-n]").forEach(x=>io.observe(x));root.querySelectorAll(".dk,.cta,.sk").forEach(h=>{if(!h.querySelector(":scope>canvas.sky"))E.sky(h,false)})};
document.addEventListener("pointermove",e=>{const c=e.target.closest&&e.target.closest(".card");if(!c)return;const r=c.getBoundingClientRect();c.style.setProperty("--x",e.clientX-r.left+"px");c.style.setProperty("--y",e.clientY-r.top+"px")});
addEventListener("scroll",()=>{const d=document.documentElement;document.getElementById("prog").style.transform="scaleX("+(scrollY/Math.max(1,d.scrollHeight-innerHeight))+")"},{passive:true});
})();
