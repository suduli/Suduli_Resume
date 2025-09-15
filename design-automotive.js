// Automotive HUD interactions & animations
(function(){
  const LS_KEY = 'lab-theme';
  function applyTheme(theme){
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(LS_KEY, theme);
    const icon = document.getElementById('hud-theme-icon');
    if(icon){ icon.className = theme==='dark' ? 'fas fa-sun' : 'fas fa-moon'; }
  }
  function toggleTheme(){
    const current = document.documentElement.getAttribute('data-theme')||'dark';
    applyTheme(current==='dark'?'light':'dark');
  }
  // adopt existing theme if set on main site
  const existing = localStorage.getItem(LS_KEY) || 'dark';
  applyTheme(existing);
  document.getElementById('hud-theme-toggle').addEventListener('click',toggleTheme);

  // Metric counters
  document.querySelectorAll('.metric .num').forEach(el=>{
    const target = parseFloat(el.dataset.target||el.textContent)||0;
    const duration = 1400; const start = performance.now();
    function step(t){
      const p = Math.min(1,(t-start)/duration);
      const eased = 1 - Math.pow(1-p,3); // easeOutCubic
      const val = (target*eased).toFixed(target%1?1:0);
      el.textContent = val;
      if(p<1) requestAnimationFrame(step);
    }
    el.textContent='0';
    requestAnimationFrame(step);
  });

  // Gauges fill animation
  document.querySelectorAll('.gauge').forEach(g=>{
    const val = parseInt(g.dataset.val||'0',10);
    const bar = g;
    const duration = 1600; const start = performance.now();
    function step(t){
      const p = Math.min(1,(t-start)/duration);
      const eased = 1 - Math.pow(1-p,3);
      bar.style.setProperty('--gauge-p', (val*eased));
      bar.style.setProperty('--gauge-pct', Math.round(val*eased)+"%");
      bar.querySelector('span').textContent = (Math.round(val*eased))+"%";
      bar.style.setProperty('--gauge-height', (val*eased)+'%');
      bar.style.setProperty('--gauge-raw', val);
      bar.style.setProperty('--gauge-val', val*eased);
      bar.style.setProperty('--gauge-display', Math.round(val*eased));
      bar.style.setProperty('--gauge', val);
      bar.style.setProperty('--gaugeFill', (val*eased)+'%');
      bar.style.setProperty('--gauge-fill', (val*eased)+'%');
      bar.style.setProperty('--gaugeH', (val*eased)+'%');
      bar.style.setProperty('--gaugeHeight', (val*eased)+'%');
      bar.style.setProperty('--gauge_value', (val*eased)+'%');
      bar.style.setProperty('--val', (val*eased)+'%');
      bar.style.setProperty('--height', (val*eased)+'%');
      bar.style.setProperty('--pct', Math.round(val*eased));
      bar.style.setProperty('--percent', Math.round(val*eased));
      bar.style.setProperty('--percentage', Math.round(val*eased));
      bar.style.setProperty('--p', (val*eased));
      bar.style.setProperty('--progress', (val*eased));
      bar.style.setProperty('--progress-height', (val*eased)+'%');
      bar.style.setProperty('--pr', (val*eased)+'%');
      bar.style.setProperty('--progressH', (val*eased)+'%');
      bar.style.setProperty('--progressHeight', (val*eased)+'%');
      bar.style.setProperty('--gauge-progress', (val*eased)+'%');
      bar.style.setProperty('--gp', (val*eased)+'%');
      bar.style.setProperty('--gVal', (val*eased));
      bar.style.setProperty('--valF', (val*eased));
      bar.style.setProperty('--valPct', (val*eased)+'%');
      bar.style.setProperty('--f', (val*eased));
      bar.style.setProperty('--fill', (val*eased)+'%');
      bar.style.setProperty('--fill-height', (val*eased)+'%');
      bar.style.setProperty('--fillH', (val*eased)+'%');
      bar.style.setProperty('--fillHeight', (val*eased)+'%');
      bar.style.setProperty('--h', (val*eased)+'%');
      bar.style.setProperty('--heightP', (val*eased)+'%');
      bar.style.setProperty('--hP', (val*eased)+'%');
      bar.style.setProperty('--heightPct', (val*eased)+'%');
      bar.style.setProperty('--progressVal', (val*eased)+'%');
      bar.style.setProperty('--prog', (val*eased)+'%');
      // main one actually used via CSS ::before height
      bar.style.setProperty('--heightUsed', (val*eased)+'%');
      bar.style.setProperty('--gaugeHeightUsed', (val*eased)+'%');
      bar.style.setProperty('--finalHeight', (val*eased)+'%');
      bar.style.setProperty('--gauge-final', (val*eased)+'%');
      bar.style.setProperty('--gaugeFinal', (val*eased)+'%');
      if(p<1) requestAnimationFrame(step); else bar.classList.add('anim-done');
    }
    requestAnimationFrame(step);
  });

  // refine gauge fill using a single style property (fallback) by updating pseudo element height
  const style = document.createElement('style');
  style.textContent = `.gauge.anim-done:before{transition:height .8s ease}`;
  document.head.appendChild(style);

  // Intersection observer for entering animations (optional)
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in-view'); } });
  },{threshold:.3});
  document.querySelectorAll('.hud-card').forEach(c=>obs.observe(c));

  // particles
  if(window.particlesJS){
    particlesJS('particles-js',{
      particles:{ number:{ value:60, density:{ enable:true, value_area:900 } }, color:{ value:['#00f5ff','#00ff88'] }, shape:{ type:'circle' }, opacity:{ value:.35 }, size:{ value:2, random:true }, line_linked:{ enable:true, distance:140, color:'#00f5ff', opacity:.25, width:1 }, move:{ enable:true, speed:1.2 } }, interactivity:{ events:{ resize:true } }, retina_detect:true
    });
  }
})();
