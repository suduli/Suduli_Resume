// UI/UX Design Lab JS (module)
const designs = [
  {
    id:'glass', title:'Glassmorphic Grid', meta:'Layered / Translucent', type:'aesthetic', icon:'fa-clone',
    desc:'Frosted panels, depth shadows & color-mixed gradients delivering premium futuristic depth.',
    tags:['glass','gradient','depth'],
    href:'skills/style-glass.html'
  },
  {
    id:'minimal', title:'Minimal Cards', meta:'Whitespace / Focus', type:'minimal', icon:'fa-border-all',
    desc:'Neutral surfaces & reduced chroma emphasize hierarchy, clarity and cognitive ease.',
    tags:['clean','focus','calm'],
    href:'skills/style-minimal.html'
  },
  {
    id:'automotive', title:'Automotive HUD', meta:'Data / Precision', type:'automotive', icon:'fa-gauge-high',
    desc:'Inspired by digital cockpit & HUD clusters—high contrast metrics, radial motifs & motion cues.',
    tags:['hud','speed','telemetry'],
    href:'design-automotive.html'
  },
  {
    id:'neon', title:'Neon Noir', meta:'Cinematic / FX', type:'visual', icon:'fa-bolt',
    desc:'Dark substrate with electric accent glow, subtle scanlines & emissive interactive feedback.',
    tags:['glow','dark','motion'],
    href:'design-neon.html'
  }
];

const grid = document.getElementById('design-grid');
function render(filter='all'){
  grid.innerHTML='';
  const subset = filter==='all'? designs : designs.filter(d=>d.type===filter);
  subset.forEach(d => grid.appendChild(card(d)));
  if(subset.length===0){
    const empty=document.createElement('div');
    empty.style.cssText='grid-column:1/-1;padding:2rem;text-align:center;font-weight:600;color:var(--text-tertiary);border:2px dashed var(--border-accent);border-radius:24px;';
    empty.textContent='No styles match current filter.';
    grid.appendChild(empty);
  }
}

function card(d){
  const el=document.createElement('article');
  el.className='design-card';
  el.dataset.type=d.type;
  el.setAttribute('tabindex','0');
  el.innerHTML=`
    <div class="design-icon"><i class="fas ${d.icon}" aria-hidden="true"></i></div>
    <div class="design-meta">${d.meta}</div>
    <h3 class="design-title">${d.title}</h3>
    <p class="design-desc">${d.desc}</p>
    <div class="design-tags">${d.tags.map(t=>`<span class='design-tag'>${t}</span>`).join('')}</div>
    <div class="design-actions">
      <a class="design-link primary" href="${d.href}">Open <i class="fas fa-arrow-right"></i></a>
      <a class="design-link" href="#" data-preview="${d.id}">Preview</a>
    </div>`;
  // keyboard open with Enter
  el.addEventListener('keydown', e=>{ if(e.key==='Enter'){ window.location = d.href; }});
  return el;
}

// Filter chips
const chips=[...document.querySelectorAll('.filter-chip')];
chips.forEach(c=> c.addEventListener('click', ()=>{
  chips.forEach(x=>{x.classList.remove('active'); x.setAttribute('aria-pressed','false');});
  c.classList.add('active'); c.setAttribute('aria-pressed','true');
  render(c.dataset.filter);
}));

// Theme toggle (reuse minimal logic)
const themeBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
let theme = localStorage.getItem('lab-theme') || 'dark';
applyTheme(theme);

function applyTheme(t){
  if(t==='light') document.documentElement.setAttribute('data-theme','light');
  else document.documentElement.removeAttribute('data-theme');
  themeIcon.className = t==='light'? 'fas fa-moon' : 'fas fa-sun';
  themeBtn.setAttribute('aria-label', t==='light'? 'Switch to dark theme':'Switch to light theme');
  themeBtn.title = themeBtn.getAttribute('aria-label');
  localStorage.setItem('lab-theme', t);
  updateParticles(t);
}
function toggleTheme(){ theme = theme==='dark'? 'light':'dark'; applyTheme(theme); }

themeBtn.addEventListener('click', toggleTheme);
themeBtn.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); toggleTheme(); }});

// Particles init (simplified)
const PARTICLE_CONFIG = { particles:{ number:{value:60,density:{enable:true,value_area:800}}, color:{ value:["#00f5ff","#ff6b6b","#00ff88"] }, shape:{ type:"circle"}, opacity:{value:.45}, size:{value:3,random:true}, line_linked:{ enable:true, distance:140, color:'#00f5ff', opacity:.35, width:1 }, move:{ enable:true, speed:1.3 }}, interactivity:{ detect_on:'window', events:{ onhover:{enable:true, mode:'repulse'}, onclick:{enable:true, mode:'push'} }, modes:{ repulse:{distance:160,duration:.4}, push:{particles_nb:3} } }, retina_detect:true};
function initParticles(){ if(window.particlesJS){ particlesJS('particles-js', PARTICLE_CONFIG); } }
function updateParticles(t){ if(window.pJSDom && pJSDom[0]){ const p=pJSDom[0].pJS; if(t==='light'){ p.particles.color.value=['#0070f3','#f56565','#38a169']; p.particles.line_linked.color='#0070f3'; } else { p.particles.color.value=['#00f5ff','#ff6b6b','#00ff88']; p.particles.line_linked.color='#00f5ff'; } p.fn.particlesRefresh(); }}

document.addEventListener('DOMContentLoaded', ()=>{ initParticles(); render(); });
