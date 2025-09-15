// moved from root visitor-counter.js
class VisitorCounter {
    constructor(options = {}) {
        this.config = {
            apiEndpoint: options.apiEndpoint || 'https://your-api-endpoint.vercel.app/api/visitors',
            useLocalStorage: options.useLocalStorage !== false,
            displayElement: options.displayElement || '#visitor-counter',
            animateNumbers: options.animateNumbers !== false,
            trackUniqueVisitors: options.trackUniqueVisitors !== false,
            trackTotalViews: options.trackTotalViews !== false,
            trackReturnVisitors: options.trackReturnVisitors !== false,
            sessionDuration: options.sessionDuration || 30 * 60 * 1000,
            updateCooldown: options.updateCooldown || 5000,
            debug: options.debug || false
        };
        this.visitorData = {
            uniqueVisitors: 0,
            totalPageViews: 0,
            returnVisitors: 0,
            lastUpdated: null
        };
        this.userSession = {
            isNewVisitor: false,
            sessionId: null,
            lastVisit: null,
            visitCount: 0
        };
        this.lastUpdateTime = 0;
        this.retryCount = 0;
        this.maxRetries = 3;
        this.init();
    }
    async init() {
        try {
            this.log('Initializing visitor counter...');
            this.initSession();
            await this.loadVisitorData();
            await this.trackVisit();
            this.displayCounter();
            this.setupPeriodicUpdates();
            this.log('Visitor counter initialized successfully');
        } catch (error) {
            this.handleError('Initialization failed', error);
        }
    }
    initSession() {
        const now = Date.now();
        const sessionKey = 'visitor_session';
        const existingSession = this.getFromStorage(sessionKey);
        if (existingSession) {
            const sessionAge = now - existingSession.timestamp;
            if (sessionAge < this.config.sessionDuration) {
                this.userSession = { ...existingSession };
                this.userSession.isNewVisitor = false;
            } else {
                this.createNewSession();
            }
        } else {
            this.createNewSession();
            this.userSession.isNewVisitor = true;
        }
        this.userSession.timestamp = now;
        this.userSession.visitCount = (this.userSession.visitCount || 0) + 1;
        this.saveToStorage(sessionKey, this.userSession);
        this.log('Session initialized:', this.userSession);
    }
    createNewSession() {
        this.userSession = {
            sessionId: this.generateSessionId(),
            timestamp: Date.now(),
            isNewVisitor: true,
            visitCount: 1,
            userAgent: navigator.userAgent,
            referrer: document.referrer || 'direct',
            timestamp: Date.now()
        };
    }
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    async loadVisitorData() {
        try {
            const apiData = await this.fetchFromAPI();
            if (apiData) {
                this.visitorData = { ...this.visitorData, ...apiData };
                this.log('Data loaded from API:', this.visitorData);
                return;
            }
        } catch (error) {
            this.log('API load failed, falling back to localStorage:', error.message);
        }
        if (this.config.useLocalStorage) {
            const localData = this.getFromStorage('visitor_data');
            if (localData) {
                this.visitorData = { ...this.visitorData, ...localData };
                this.log('Data loaded from localStorage:', this.visitorData);
            }
        }
    }
    async trackVisit() {
        const now = Date.now();
        if (now - this.lastUpdateTime < this.config.updateCooldown) {
            this.log('Update rate limited, skipping track');
            return;
        }
        try {
            const visitData = {
                sessionId: this.userSession.sessionId,
                isNewVisitor: this.userSession.isNewVisitor,
                timestamp: now,
                userAgent: navigator.userAgent,
                referrer: document.referrer || 'direct',
                url: window.location.href,
                viewport: `${window.innerWidth}x${window.innerHeight}`,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            };
            if (this.userSession.isNewVisitor && this.config.trackUniqueVisitors) {
                this.visitorData.uniqueVisitors += 1;
            }
            if (this.config.trackTotalViews) {
                this.visitorData.totalPageViews += 1;
            }
            if (!this.userSession.isNewVisitor && this.config.trackReturnVisitors) {
                this.visitorData.returnVisitors += 1;
            }
            this.visitorData.lastUpdated = now;
            await this.sendToAPI(visitData);
            if (this.config.useLocalStorage) {
                this.saveToStorage('visitor_data', this.visitorData);
            }
            this.lastUpdateTime = now;
            this.retryCount = 0;
            this.log('Visit tracked successfully:', visitData);
        } catch (error) {
            this.handleError('Failed to track visit', error);
        }
    }
    async fetchFromAPI() {
        if (!this.config.apiEndpoint) return null;
        const response = await fetch(this.config.apiEndpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }
        return await response.json();
    }
    async sendToAPI(visitData) {
        if (!this.config.apiEndpoint) return;
        const response = await fetch(this.config.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'track_visit',
                data: visitData,
                counters: this.visitorData
            })
        });
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }
        const result = await response.json();
        if (result.counters) {
            this.visitorData = { ...this.visitorData, ...result.counters };
        }
        return result;
    }
    displayCounter() {
        const element = document.querySelector(this.config.displayElement);
        if (!element) {
            this.log('Display element not found:', this.config.displayElement);
            return;
        }

        // Add loading state
        element.classList.add('loading');
        
        const html = this.generateCounterHTML();
        element.innerHTML = html;
        
        // Remove loading state after a short delay to show the animation
        setTimeout(() => {
            element.classList.remove('loading');
            
            if (this.config.animateNumbers) {
                this.animateCounters();
            }
            
            // Add entrance animation
            const container = element.querySelector('.visitor-counter-container');
            if (container) {
                container.style.opacity = '0';
                container.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    container.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    container.style.opacity = '1';
                    container.style.transform = 'translateY(0)';
                }, 100);
            }
        }, 300);
        
        this.log('Counter displayed successfully');
    }
    generateCounterHTML() {
        const formatNumber = (num) => {
            return new Intl.NumberFormat().format(num);
        };
        
        return `
            <div class="visitor-counter-container">
                <div class="counter-title">
                    <i class="fas fa-chart-line"></i>
                    <span>Website Analytics</span>
                </div>
                <div class="counter-stats">
                    ${this.config.trackTotalViews ? `
                        <div class="counter-stat" data-stat="total-views">
                            <span class="counter-number" data-target="${this.visitorData.totalPageViews}">${formatNumber(this.visitorData.totalPageViews)}</span>
                            <span class="counter-label">
                                <i class="fas fa-eye"></i>
                                Total Views
                            </span>
                        </div>
                    ` : ''}
                    ${this.config.trackUniqueVisitors ? `
                        <div class="counter-stat" data-stat="unique-visitors">
                            <span class="counter-number" data-target="${this.visitorData.uniqueVisitors}">${formatNumber(this.visitorData.uniqueVisitors)}</span>
                            <span class="counter-label">
                                <i class="fas fa-users"></i>
                                Unique Visitors
                            </span>
                        </div>
                    ` : ''}
                    ${this.config.trackReturnVisitors ? `
                        <div class="counter-stat" data-stat="return-visitors">
                            <span class="counter-number" data-target="${this.visitorData.returnVisitors}">${formatNumber(this.visitorData.returnVisitors)}</span>
                            <span class="counter-label">
                                <i class="fas fa-redo"></i>
                                Return Visits
                            </span>
                        </div>
                    ` : ''}
                </div>
                <div class="counter-footer">
                    <span class="counter-updated">Last updated: ${this.getFormattedTime()}</span>
                </div>
            </div>
        `;
    }
    animateCounters() {
        const counterNumbers = document.querySelectorAll('.counter-number');
        const container = document.querySelector('.visitor-counter-container');
        
        counterNumbers.forEach((counter, index) => {
            const target = parseInt(counter.getAttribute('data-target'));
            const increment = target / 60; // Slower animation for better effect
            let current = 0;
            
            // Add updating class for animation
            const stat = counter.closest('.counter-stat');
            if (stat) {
                stat.classList.add('counter-updating');
            }
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    const value = Math.ceil(current);
                    counter.textContent = new Intl.NumberFormat().format(value);
                    
                    // Add subtle scale effect during counting
                    const progress = current / target;
                    const scale = 1 + (Math.sin(progress * Math.PI * 4) * 0.02);
                    counter.style.transform = `scale(${scale})`;
                    
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = new Intl.NumberFormat().format(target);
                    counter.style.transform = 'scale(1)';
                    
                    // Remove updating class
                    if (stat) {
                        stat.classList.remove('counter-updating');
                    }
                    
                    // Add completion effect
                    this.addCompletionEffect(counter, index);
                }
            };
            
            // Stagger the animation start for each counter
            setTimeout(() => {
                updateCounter();
            }, index * 200);
        });
    }
    
    addCompletionEffect(counter, index) {
        // Add a subtle glow effect when animation completes
        counter.style.textShadow = '0 0 20px var(--accent-primary)';
        counter.style.transition = 'text-shadow 0.3s ease';
        
        setTimeout(() => {
            counter.style.textShadow = '0 0 10px rgba(0, 245, 255, 0.5)';
        }, 300);
        
        // Add a particle effect (optional)
        this.createParticleEffect(counter);
    }
    
    createParticleEffect(element) {
        const rect = element.getBoundingClientRect();
        const particle = document.createElement('div');
        
        particle.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            width: 4px;
            height: 4px;
            background: var(--accent-primary);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: particle-burst 0.6s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        
        // Add the particle animation styles if not already present
        if (!document.querySelector('#particle-animation-styles')) {
            const style = document.createElement('style');
            style.id = 'particle-animation-styles';
            style.textContent = `
                @keyframes particle-burst {
                    0% {
                        transform: scale(1) translate(0, 0);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(0) translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            particle.remove();
        }, 600);
    }
    setupPeriodicUpdates() {
        setInterval(() => {
            this.loadVisitorData().then(() => {
                this.displayCounter();
            }).catch(error => {
                this.log('Periodic update failed:', error);
            });
        }, 30000);
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.loadVisitorData().then(() => {
                    this.displayCounter();
                });
            }
        });
    }
    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            this.log('Failed to save to localStorage:', error);
        }
    }
    getFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            this.log('Failed to read from localStorage:', error);
            return null;
        }
    }
    getFormattedTime() {
        if (!this.visitorData.lastUpdated) return 'Never';
        const date = new Date(this.visitorData.lastUpdated);
        return date.toLocaleString();
    }
    handleError(message, error) {
        this.log(`ERROR - ${message}:`, error);
        if (this.retryCount < this.maxRetries) {
            this.retryCount++;
            setTimeout(() => {
                this.log(`Retrying... Attempt ${this.retryCount}/${this.maxRetries}`);
                this.trackVisit();
            }, 2000 * this.retryCount);
        }
    }
    log(...args) {
        if (this.config.debug) {
            console.log('[VisitorCounter]', ...args);
        }
    }
    async refresh() {
        await this.loadVisitorData();
        this.displayCounter();
    }
    getData() {
        return { ...this.visitorData };
    }
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VisitorCounter;
}
window.VisitorCounter = VisitorCounter;
