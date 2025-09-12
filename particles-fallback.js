// Guarded fallback for particles.js only if CDN version missing
if (typeof window.particlesJS === 'undefined') {
    function particlesJS(elementId, config) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const container = document.getElementById(elementId);
        if (!container) return;
        container.appendChild(canvas);
        Object.assign(canvas.style, { position:'absolute', top:'0', left:'0', width:'100%', height:'100%' });
        let particles = [], mouse = {x:null,y:null};
        function resize(){ canvas.width = container.offsetWidth; canvas.height = container.offsetHeight; }
        function Particle(){ this.x=Math.random()*canvas.width; this.y=Math.random()*canvas.height; this.vx=(Math.random()-0.5)*2; this.vy=(Math.random()-0.5)*2; this.size=Math.random()*3+1; this.color=config.particles.color.value[Math.floor(Math.random()*config.particles.color.value.length)]; }
        Particle.prototype.update=function(){ this.x+=this.vx; this.y+=this.vy; if(this.x<0||this.x>canvas.width) this.vx=-this.vx; if(this.y<0||this.y>canvas.height) this.vy=-this.vy; if(mouse.x&&mouse.y){ const dx=this.x-mouse.x, dy=this.y-mouse.y, dist=Math.hypot(dx,dy); if(dist<100){ const force=(100-dist)/100; this.x+=dx*force*0.1; this.y+=dy*force*0.1; } } };
        Particle.prototype.draw=function(){ ctx.beginPath(); ctx.arc(this.x,this.y,this.size,0,Math.PI*2); ctx.fillStyle=this.color; ctx.globalAlpha=0.5; ctx.fill(); ctx.globalAlpha=1; };
        function connect(){ for(let i=0;i<particles.length;i++){ for(let j=i+1;j<particles.length;j++){ const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y, dist=Math.hypot(dx,dy); if(dist<150){ ctx.beginPath(); ctx.moveTo(particles[i].x,particles[i].y); ctx.lineTo(particles[j].x,particles[j].y); ctx.strokeStyle=config.particles.line_linked.color; ctx.globalAlpha=config.particles.line_linked.opacity*(1-dist/150); ctx.stroke(); ctx.globalAlpha=1; } } } }
        function animate(){ ctx.clearRect(0,0,canvas.width,canvas.height); particles.forEach(p=>{p.update();p.draw();}); connect(); requestAnimationFrame(animate); }
        function init(){ resize(); particles=[]; for(let i=0;i<config.particles.number.value;i++){ particles.push(new Particle()); } animate(); }
        window.addEventListener('resize', resize);
        container.addEventListener('mousemove', e=>{ const r=container.getBoundingClientRect(); mouse.x=e.clientX-r.left; mouse.y=e.clientY-r.top; });
        container.addEventListener('mouseleave', ()=>{ mouse.x=null; mouse.y=null; });
        init();
    }
    window.particlesJS = particlesJS;
    console.warn('[fallback] Using local particles fallback implementation.');
    // Anime.js fallback (minimal)
    if (typeof anime === 'undefined') {
        window.anime = function(cfg){ const targets = typeof cfg.targets==='string'?document.querySelectorAll(cfg.targets):cfg.targets; (targets||[]).forEach(t=>{ if(!t)return; const d=cfg.duration||1000, delay=cfg.delay||0; setTimeout(()=>{ if(cfg.translateY){ t.style.transform=`translateY(${cfg.translateY[1]}px)`; t.style.opacity = cfg.opacity?cfg.opacity[1]:'1'; } if(cfg.opacity){ t.style.opacity = cfg.opacity[1]; } if(cfg.scale){ t.style.transform=`scale(${cfg.scale[1]})`; } t.style.transition=`all ${d}ms ease`; },delay); }); return { stagger:(amt)=>amt }; };
        anime.stagger = (amt)=>amt;
    }
} else {
    console.info('[fallback] CDN particles.js present; fallback not applied.');
}