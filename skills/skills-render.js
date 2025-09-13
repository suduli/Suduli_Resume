import { SKILLS, colorForCategory } from './skills-data.js';

const PARTICLE_CONFIG = { particles:{ number:{ value:55, density:{ enable:true, value_area:900 }}, color:{ value:['#00f5ff','#ff6b6b','#00ff88'] }, shape:{ type:'circle' }, opacity:{ value:.35 }, size:{ value:3, random:true }, line_linked:{ enable:true, distance:150, color:'#00f5ff', opacity:.35, width:1 }, move:{ enable:true, speed:1.1 } }, interactivity:{ detect_on:'window', events:{ onhover:{ enable:true, mode:'repulse' }, onclick:{ enable:true, mode:'push' } }, modes:{ repulse:{ distance:180, duration:.4 }, push:{ particles_nb:4 } } }, retina_detect:true };

function initParticles(){ if(!document.getElementById('particles-js')) return; let attempts=0; const timer=setInterval(()=>{ attempts++; if(window.particlesJS){ window.particlesJS('particles-js', PARTICLE_CONFIG); clearInterval(timer); } else if(attempts>30){ clearInterval(timer); } },120); }

class ThemeToggle { constructor(){ this.btn=document.getElementById('theme-toggle'); if(!this.btn) return; this.icon=this.btn.querySelector('i'); this.current= localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark':'light'); this.apply(this.current,false); this.btn.addEventListener('click',()=> this.toggle()); this.btn.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' ') { e.preventDefault(); this.toggle(); }}); }
  toggle(){ this.current = this.current==='dark' ? 'light':'dark'; this.apply(this.current,true); localStorage.setItem('theme',this.current); }
  apply(theme, animate){ if(theme==='light') document.documentElement.setAttribute('data-theme','light'); else document.documentElement.removeAttribute('data-theme'); if(this.icon){ this.icon.className = theme==='dark' ? 'fas fa-sun':'fas fa-moon'; this.btn.setAttribute('aria-label', theme==='dark'?'Switch to light theme':'Switch to dark theme'); } if(animate){ document.documentElement.classList.add('theme-transition'); setTimeout(()=> document.documentElement.classList.remove('theme-transition'),320); } }
}

function renderSkills(){ const container=document.querySelector('.skills-wrapper'); if(!container) return; container.innerHTML=''; const bodyClass=[...document.body.classList].find(c=>c.startsWith('style-')) || 'style-glass'; SKILLS.forEach((s,i)=>{ const card=document.createElement('div'); card.className='skill-item fade-in'; card.style.animationDelay=(i*0.02)+'s'; const catColor=colorForCategory(s.category); card.innerHTML=`<span class="level-badge" aria-label="Proficiency level ${s.level} percent">${s.level}%</span><div class="skill-cat" data-cat="${s.category}" style="--cat-color:${catColor}">${s.category}</div><h4>${s.name}</h4><div class="progress" aria-hidden="true"><span style="width:${s.level}%;"></span></div><p class="skill-desc">${s.desc}</p><div class="skill-tags">${(s.tags||[]).map(t=>`<span>${t}</span>`).join('')}</div>`; container.appendChild(card); }); }

function mountVariant(){ if(!document.querySelector('.skills-wrapper')) return; renderSkills(); }

// Accessibility improvement: skip link
function injectSkip(){ if(document.getElementById('skip-link')) return; const a=document.createElement('a'); a.id='skip-link'; a.href='#main'; a.textContent='Skip to content'; a.style.cssText='position:absolute;left:-999px;top:0;background:var(--sk-accent);color:#000;padding:8px 14px;font-weight:700;z-index:2000;border-radius:0 0 6px 0;'; a.addEventListener('focus',()=> a.style.left='0'); a.addEventListener('blur',()=> a.style.left='-999px'); document.body.prepend(a); }

document.addEventListener('DOMContentLoaded',()=>{ new ThemeToggle(); initParticles(); injectSkip(); mountVariant(); });
