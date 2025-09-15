import { SKILLS, colorForCategory } from './skills-data.js';

// Reuse theme toggle & particles from existing renderer (lightweight duplication to avoid coupling)
const PARTICLE_CONFIG = { particles:{ number:{ value:40, density:{ enable:true, value_area:900 }}, color:{ value:['#00f5ff','#ff6b6b','#00ff88'] }, shape:{ type:'circle' }, opacity:{ value:.25 }, size:{ value:3, random:true }, line_linked:{ enable:true, distance:140, color:'#00f5ff', opacity:.25, width:1 }, move:{ enable:true, speed:1 } }, interactivity:{ detect_on:'window', events:{ onhover:{ enable:true, mode:'repulse' } }, modes:{ repulse:{ distance:150, duration:.4 } } }, retina_detect:true };

function initParticles(){ if(!document.getElementById('particles-js')) return; let tries=0; const t=setInterval(()=>{ tries++; if(window.particlesJS){ window.particlesJS('particles-js', PARTICLE_CONFIG); clearInterval(t);} else if(tries>25){ clearInterval(t);} },120); }

class ThemeToggle { constructor(){ this.btn=document.getElementById('theme-toggle'); if(!this.btn) return; this.icon=this.btn.querySelector('i'); this.current= localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark':'light'); this.apply(this.current,false); this.btn.addEventListener('click',()=> this.toggle()); this.btn.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); this.toggle(); }}); }
	toggle(){ this.current=this.current==='dark'?'light':'dark'; this.apply(this.current,true); localStorage.setItem('theme',this.current);} 
	apply(theme, animate){ if(theme==='light') document.documentElement.setAttribute('data-theme','light'); else document.documentElement.removeAttribute('data-theme'); if(this.icon){ this.icon.className = theme==='dark' ? 'fas fa-sun':'fas fa-moon'; this.btn.setAttribute('aria-label', theme==='dark'?'Switch to light theme':'Switch to dark theme'); } if(animate){ document.documentElement.classList.add('theme-transition'); setTimeout(()=> document.documentElement.classList.remove('theme-transition'),320);} }
}

/* -------------------------------- Radial Layout ----------------------------- */
function buildRadial(){ const stage=document.querySelector('.radial-stage'); if(!stage) return; const ring=document.createElement('div'); ring.className='radial-ring'; stage.appendChild(ring); const center=document.createElement('div'); center.className='radial-center'; center.innerHTML='<h3>Skills Orbit</h3><p>Auto rotating showcase.<br/>Hover to inspect. Drag to spin.</p><div class="drag-hint"><i class="fas fa-arrows-alt"></i> DRAG</div>'; stage.appendChild(center);
	const total=SKILLS.length; const radius = (parseInt(getComputedStyle(stage).width)/2) - 80; // margin for item size
	SKILLS.forEach((s,i)=>{ const angle=(360/total)*i; const rad= angle * Math.PI/180; const x=Math.cos(rad)*radius; const y=Math.sin(rad)*radius; const el=document.createElement('div'); el.className='radial-item'; el.style.setProperty('--angle', angle+'deg'); el.style.setProperty('--tx', x+'px'); el.style.setProperty('--ty', y+'px'); const catColor=colorForCategory(s.category); el.innerHTML=`<div class="skill-cat" style="color:var(--sk-accent);">${s.category}</div><h4>${s.name}</h4><div class="progress" aria-hidden="true"><span style="width:${s.level}%;"></span></div><span class="level-badge">${s.level}%</span>`; // minimal info
		// initial transform positioning
		el.style.transform=`translate3d(${x}px,${y}px,0) rotateZ(${angle}deg)`; ring.appendChild(el); });
	// Accessibility fallback buttons list
	const fallback=document.querySelector('.radial-fallback'); if(fallback){ fallback.innerHTML=''; SKILLS.forEach((s,i)=>{ const b=document.createElement('button'); b.type='button'; b.textContent=s.name+' ('+s.level+'%)'; b.setAttribute('data-index',i); b.addEventListener('focus',()=> focusItem(i)); fallback.appendChild(b); }); }

	function focusItem(i){ const items=[...ring.querySelectorAll('.radial-item')]; const target=items[i]; if(!target) return; // pause spin
		stage.dataset.paused='true'; ring.style.animationPlayState='paused'; items.forEach(it=> it.style.zIndex=''); target.style.zIndex='20'; }
}

/* --------------------------- Drag Interaction ------------------------------ */
function enableDrag(){ const stage=document.querySelector('.radial-stage'); const ring=document.querySelector('.radial-ring'); if(!stage||!ring) return; let dragging=false, lastX=0, velocity=0, current=0, lastTime=0; const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches; if(prefersReduced){ ring.style.animation='none'; }
	function setRotation(v){ current=v; ring.style.transform=`rotate(${current}deg)`; }
	stage.addEventListener('pointerdown',e=>{ dragging=true; stage.dataset.paused='true'; ring.style.animationPlayState='paused'; lastX=e.clientX; velocity=0; lastTime=performance.now(); stage.setPointerCapture(e.pointerId); });
	stage.addEventListener('pointermove',e=>{ if(!dragging) return; const dx=e.clientX-lastX; const now=performance.now(); const dt=now-lastTime; lastTime=now; lastX=e.clientX; const delta= dx * 0.25; setRotation(current+delta); velocity = delta/(dt||16)*16; });
	stage.addEventListener('pointerup',e=>{ if(!dragging) return; dragging=false; stage.releasePointerCapture(e.pointerId); if(Math.abs(velocity)>0.1){ const start=performance.now(); const startVel=velocity; const friction=0.015; (function inertia(ts){ const t=ts-start; const decel=startVel * Math.exp(-friction*t); if(Math.abs(decel)>0.05){ setRotation(current+decel); requestAnimationFrame(inertia); } }) (start); }
	});
	// keyboard accessibility: arrow keys rotate
	stage.setAttribute('tabindex','0'); stage.addEventListener('keydown',e=>{ if(e.key==='ArrowLeft'){ stage.dataset.paused='true'; setRotation(current-10);} else if(e.key==='ArrowRight'){ stage.dataset.paused='true'; setRotation(current+10);} else if(e.key===' '){ // toggle pause/resume
			if(stage.dataset.paused==='true'){ delete stage.dataset.paused; ring.style.animationPlayState='running'; }
			else { stage.dataset.paused='true'; ring.style.animationPlayState='paused'; }
			e.preventDefault(); }
	});
	// hover pause/resume (desktop only)
	stage.addEventListener('pointerenter',()=>{ stage.dataset.paused='true'; ring.style.animationPlayState='paused'; });
	stage.addEventListener('pointerleave',()=>{ if(!dragging && !matchMedia('(prefers-reduced-motion: reduce)').matches){ delete stage.dataset.paused; ring.style.animationPlayState='running'; }});
}

// Skip link for accessibility
function injectSkip(){ if(document.getElementById('skip-link')) return; const a=document.createElement('a'); a.id='skip-link'; a.href='#main'; a.textContent='Skip to content'; a.style.cssText='position:absolute;left:-999px;top:0;background:var(--sk-accent);color:#000;padding:8px 14px;font-weight:700;z-index:2000;border-radius:0 0 6px 0;'; a.addEventListener('focus',()=> a.style.left='0'); a.addEventListener('blur',()=> a.style.left='-999px'); document.body.prepend(a); }

document.addEventListener('DOMContentLoaded',()=>{ new ThemeToggle(); initParticles(); injectSkip(); buildRadial(); enableDrag(); });

