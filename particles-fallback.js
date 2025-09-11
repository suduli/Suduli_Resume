// Enhanced Fallback particles.js implementation for environments where CDN is blocked
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
    let mouse = { 
        x: null, 
        y: null, 
        lastX: null, 
        lastY: null,
        velocity: 0,
        trail: []
    };
    let temporaryParticles = [];
    
    function resizeCanvas() {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    }
    
    function Particle(x = null, y = null, temporary = false) {
        this.x = x !== null ? x : Math.random() * canvas.width;
        this.y = y !== null ? y : Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.baseVx = this.vx;
        this.baseVy = this.vy;
        this.size = Math.random() * 3 + 1;
        this.baseSize = this.size;
        this.color = config.particles.color.value[Math.floor(Math.random() * config.particles.color.value.length)];
        this.opacity = temporary ? 0.8 : 0.5;
        this.baseOpacity = this.opacity;
        this.temporary = temporary;
        this.birthTime = Date.now();
        this.lifeSpan = temporary ? 1000 : Infinity;
    }
    
    Particle.prototype.update = function() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Boundary checking
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
        
        // Enhanced mouse interaction
        if (mouse.x && mouse.y) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 120) {
                const force = (120 - distance) / 120;
                const velocityMultiplier = Math.min(mouse.velocity / 10, 2);
                
                if (mouse.velocity > 5) {
                    // Fast movement: attraction
                    this.vx += -dx * force * 0.03 * velocityMultiplier;
                    this.vy += -dy * force * 0.03 * velocityMultiplier;
                } else {
                    // Slow movement: gentle repulsion
                    this.vx += dx * force * 0.02;
                    this.vy += dy * force * 0.02;
                }
                
                // Enhanced visual effects
                this.opacity = Math.min(1, this.baseOpacity + force * 0.5);
                this.size = this.baseSize * (1 + velocityMultiplier * 0.2);
            } else {
                // Gradually return to normal
                this.vx += (this.baseVx - this.vx) * 0.02;
                this.vy += (this.baseVy - this.vy) * 0.02;
                this.opacity += (this.baseOpacity - this.opacity) * 0.05;
                this.size += (this.baseSize - this.size) * 0.05;
            }
        }
        
        // Damping for smooth movement
        this.vx *= 0.99;
        this.vy *= 0.99;
    };
    
    Particle.prototype.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
    };
    
    Particle.prototype.isExpired = function() {
        return this.temporary && (Date.now() - this.birthTime) > this.lifeSpan;
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
                    
                    // Enhanced connection lines that respond to mouse
                    let lineOpacity = config.particles.line_linked.opacity * (1 - distance / 150);
                    
                    if (mouse.x && mouse.y) {
                        const midX = (particles[i].x + particles[j].x) / 2;
                        const midY = (particles[i].y + particles[j].y) / 2;
                        const mouseDistance = Math.sqrt((midX - mouse.x) ** 2 + (midY - mouse.y) ** 2);
                        
                        if (mouseDistance < 100) {
                            lineOpacity *= (1 + (100 - mouseDistance) / 100);
                        }
                    }
                    
                    ctx.strokeStyle = config.particles.line_linked.color;
                    ctx.globalAlpha = Math.min(1, lineOpacity);
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }
    }
    
    function createTrailParticles() {
        if (mouse.velocity > 10 && mouse.trail.length > 2) {
            for (let i = 0; i < 2; i++) {
                const trailPoint = mouse.trail[mouse.trail.length - 1 - i];
                if (trailPoint) {
                    const tempParticle = new Particle(
                        trailPoint.x + (Math.random() - 0.5) * 20,
                        trailPoint.y + (Math.random() - 0.5) * 20,
                        true
                    );
                    temporaryParticles.push(tempParticle);
                }
            }
        }
    }
    
    function updateTemporaryParticles() {
        temporaryParticles = temporaryParticles.filter(particle => {
            particle.update();
            particle.draw();
            return !particle.isExpired();
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw main particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Update and draw temporary particles
        updateTemporaryParticles();
        
        // Draw connections
        connectParticles();
        
        // Create trail particles if mouse is moving fast
        createTrailParticles();
        
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
    
    // Enhanced event listeners
    window.addEventListener('resize', resizeCanvas);
    
    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const newX = e.clientX - rect.left;
        const newY = e.clientY - rect.top;
        
        // Calculate velocity
        if (mouse.x !== null && mouse.y !== null) {
            const dx = newX - mouse.x;
            const dy = newY - mouse.y;
            mouse.velocity = Math.sqrt(dx * dx + dy * dy);
        }
        
        mouse.lastX = mouse.x;
        mouse.lastY = mouse.y;
        mouse.x = newX;
        mouse.y = newY;
        
        // Add to trail
        mouse.trail.push({ x: newX, y: newY, time: Date.now() });
        if (mouse.trail.length > 20) {
            mouse.trail.shift();
        }
    });
    
    container.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
        mouse.velocity = 0;
        mouse.trail = [];
    });
    
    container.addEventListener('click', (e) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Add new particles on click
        for (let i = 0; i < 4; i++) {
            particles.push(new Particle(
                x + (Math.random() - 0.5) * 50,
                y + (Math.random() - 0.5) * 50
            ));
        }
        
        // Limit total particles
        if (particles.length > config.particles.number.value * 1.5) {
            particles.splice(0, 4);
        }
    });
    
    // Clean up old trail points periodically
    setInterval(() => {
        const now = Date.now();
        mouse.trail = mouse.trail.filter(point => (now - point.time) < 1000);
    }, 1000);
    
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