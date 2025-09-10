// Fallback particles.js implementation for environments where CDN is blocked
function particlesJS(elementId, config) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const container = document.getElementById(elementId);
    
    if (!container) return;
    
    container.appendChild(canvas);
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    
    let particles = [];
    let mouse = { x: null, y: null };
    
    function resizeCanvas() {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    }
    
    function Particle() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.size = Math.random() * 3 + 1;
        this.color = config.particles.color.value[Math.floor(Math.random() * config.particles.color.value.length)];
    }
    
    Particle.prototype.update = function() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
        
        // Mouse repulsion
        if (mouse.x && mouse.y) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                this.x += dx * force * 0.1;
                this.y += dy * force * 0.1;
            }
        }
    };
    
    Particle.prototype.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.5;
        ctx.fill();
        ctx.globalAlpha = 1;
    };
    
    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = config.particles.line_linked.color;
                    ctx.globalAlpha = config.particles.line_linked.opacity * (1 - distance / 150);
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        connectParticles();
        requestAnimationFrame(animate);
    }
    
    function init() {
        resizeCanvas();
        particles = [];
        
        for (let i = 0; i < config.particles.number.value; i++) {
            particles.push(new Particle());
        }
        
        animate();
    }
    
    // Event listeners
    window.addEventListener('resize', resizeCanvas);
    
    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    
    container.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });
    
    init();
}

// Simple anime.js fallback
if (typeof anime === 'undefined') {
    window.anime = function(config) {
        const targets = Array.isArray(config.targets) ? config.targets : 
                       typeof config.targets === 'string' ? document.querySelectorAll(config.targets) : 
                       [config.targets];
        
        targets.forEach(target => {
            if (!target) return;
            
            const duration = config.duration || 1000;
            const delay = config.delay || 0;
            
            setTimeout(() => {
                if (config.translateY) {
                    target.style.transform = `translateY(${config.translateY[1]}px)`;
                    target.style.opacity = config.opacity ? config.opacity[1] : '1';
                }
                if (config.opacity) {
                    target.style.opacity = config.opacity[1];
                }
                if (config.scale) {
                    target.style.transform = `scale(${config.scale[1]})`;
                }
                
                target.style.transition = `all ${duration}ms ease`;
            }, delay);
        });
        
        return {
            stagger: function(amount) {
                return amount;
            }
        };
    };
    
    anime.stagger = function(amount, config) {
        return amount;
    };
}