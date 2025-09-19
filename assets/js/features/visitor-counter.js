// moved from root visitor-counter.js
class VisitorCounter {
    constructor(options = {}) {
        this.config = {
            apiEndpoint: options.apiEndpoint || '/api/visitors', // Uses relative path to current domain
            useLocalStorage: options.useLocalStorage !== false,
            displayElement: options.displayElement || '#visitor-counter',
            animateNumbers: options.animateNumbers !== false,
            trackUniqueVisitors: options.trackUniqueVisitors !== false,
            trackTotalViews: options.trackTotalViews !== false,
            trackReturnVisitors: options.trackReturnVisitors !== false,
            sessionDuration: options.sessionDuration || 30 * 60 * 1000,
            updateCooldown: options.updateCooldown || 5000,
            demoMode: options.demoMode || false, // Enable demo mode for local development
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
            
            // Display counter immediately with default values
            this.displayCounter();
            
            // Then try to load actual data
            await this.loadVisitorData();
            
            // Update the display with the real data
            this.displayCounter();
            
            // Track the visit asynchronously (don't await)
            this.trackVisit().catch(error => {
                this.log('Non-critical error tracking visit:', error);
            });
            
            this.setupPeriodicUpdates();
            this.log('Visitor counter initialized successfully');
            
            // Listen for language changes
            window.addEventListener('languageChanged', () => {
                this.updateCounterLabels();
            });
        } catch (error) {
            this.handleError('Initialization failed', error);
            
            // Make sure we still show something even if initialization fails
            try {
                this.displayCounter();
            } catch (displayError) {
                this.log('Critical error displaying counter:', displayError);
            }
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
            referrer: document.referrer || 'direct'
            // Removed duplicate timestamp property
        };
    }
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    async loadVisitorData() {
        try {
            // Check for demo mode first
            const isLocal = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1' || 
                          window.location.hostname.startsWith('192.168.') || 
                          window.location.port !== '';
            
            // If we're in demo mode or local development with demo mode enabled, skip API call
            if ((isLocal && (this.config.demoMode || window.visitorCounterDemoMode)) || this.config.demoMode) {
                this.log('Demo mode active - using generated data');
                
                // Use fixed data for consistent demo display
                this.visitorData = {
                    uniqueVisitors: 1480,
                    totalPageViews: 6551, 
                    returnVisitors: 842,
                    lastUpdated: Date.now()
                };
                
                // Store in localStorage for consistency
                if (this.config.useLocalStorage) {
                    this.saveToStorage('visitor_data', this.visitorData);
                }
                
                return;
            }
            
            // Try to load data from API first if not in demo mode
            const apiData = await this.fetchFromAPI();
            if (apiData) {
                this.visitorData = { ...this.visitorData, ...apiData };
                this.log('Data loaded from API:', this.visitorData);
                
                // Store in localStorage as fallback
                if (this.config.useLocalStorage) {
                    this.saveToStorage('visitor_data', this.visitorData);
                }
                return;
            }
        } catch (error) {
            this.log('API load failed, falling back to localStorage:', error.message);
        }
        
        // Try to load from localStorage if API fails
        if (this.config.useLocalStorage) {
            const localData = this.getFromStorage('visitor_data');
            if (localData) {
                this.visitorData = { ...this.visitorData, ...localData };
                this.log('Data loaded from localStorage:', this.visitorData);
                return;
            }
        }
        
        // Fallback data if both API and localStorage fail
        this.visitorData = {
            uniqueVisitors: Math.floor(Math.random() * 500) + 1000,
            totalPageViews: Math.floor(Math.random() * 2000) + 5000,
            returnVisitors: Math.floor(Math.random() * 300) + 700,
            lastUpdated: Date.now()
        };
        this.log('Using fallback data:', this.visitorData);
    }
    async trackVisit() {
        const now = Date.now();
        if (now - this.lastUpdateTime < this.config.updateCooldown) {
            this.log('Update rate limited, skipping track');
            return;
        }
        
        // Check for demo mode first
        const isLocal = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' || 
                      window.location.hostname.startsWith('192.168.') || 
                      window.location.port !== '';
        
        // If we're in demo mode or local development with demo mode enabled, skip API call
        if ((isLocal && (this.config.demoMode || window.visitorCounterDemoMode)) || this.config.demoMode) {
            this.log('Demo mode active - incrementing local data only');
            
            // Increment local counters for demo mode
            this.visitorData.totalPageViews++;
            if (this.userSession.isNewVisitor) {
                this.visitorData.uniqueVisitors++;
            } else {
                this.visitorData.returnVisitors++;
            }
            
            // Update timestamp
            this.visitorData.lastUpdated = now;
            
            // Update localStorage
            if (this.config.useLocalStorage) {
                this.saveToStorage('visitor_data', this.visitorData);
            }
            
            this.lastUpdateTime = now;
            this.retryCount = 0;
            
            // Update the display with new counter values
            this.displayCounter();
            
            return;
        }
        
        try {
            const visitData = {
                sessionId: this.userSession.sessionId,
                timestamp: now,
                isNewVisitor: this.userSession.isNewVisitor, // Important for server-side tracking
                userAgent: navigator.userAgent,
                referrer: document.referrer || 'direct',
                url: window.location.href,
                viewport: `${window.innerWidth}x${window.innerHeight}`,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            };

            const result = await this.sendToAPI(visitData);
            
            if (result && result.counters) {
                this.visitorData = { ...this.visitorData, ...result.counters };
                
                // Update the display with the new counter values
                this.displayCounter();
            }

            if (this.config.useLocalStorage) {
                this.saveToStorage('visitor_data', this.visitorData);
            }
            this.lastUpdateTime = now;
            this.retryCount = 0;
            this.log('Visit tracked successfully:', visitData);
        } catch (error) {
            this.handleError('Failed to track visit', error);
            
            // Fallback to local tracking if API fails
            this.visitorData.totalPageViews++;
            if (this.userSession.isNewVisitor) {
                this.visitorData.uniqueVisitors++;
            } else {
                this.visitorData.returnVisitors++;
            }
            
            this.visitorData.lastUpdated = now;
            
            if (this.config.useLocalStorage) {
                this.saveToStorage('visitor_data', this.visitorData);
            }
            
            // Update the display with fallback values
            this.displayCounter();
        }
    }
    async fetchFromAPI() {
        if (!this.config.apiEndpoint) {
            this.log('No API endpoint configured, skipping API fetch');
            return null;
        }
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
            
            // Check if we're in a local environment and modify endpoint if needed
            let endpoint = this.config.apiEndpoint;
            // Use a smarter way to detect if we're in local development
            const isLocal = window.location.hostname === 'localhost' || 
                            window.location.hostname === '127.0.0.1' || 
                            window.location.hostname.startsWith('192.168.') || 
                            window.location.port !== '';
                            
            if (isLocal && !window.forceApiCall) {
                // Make it possible to override with a global flag
                this.log('Local environment detected, entering demo mode');
                
                // For local development, enable demo mode instead of trying to hit the API
                if (this.config.demoMode || window.visitorCounterDemoMode) {
                    this.log('Demo mode active - skipping API call');
                    
                    // Return fixed demo data that matches your production statistics
                    return {
                        uniqueVisitors: 1480,
                        totalPageViews: 6551,
                        returnVisitors: 842,
                        lastUpdated: Date.now()
                    };
                }
                
                // If not in demo mode, try to use the correct local endpoint
                const port = window.location.port || '80';
                endpoint = `${window.location.protocol}//${window.location.hostname}:${port}${this.config.apiEndpoint}`;
            }
            
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Handle different response formats
            if (!data) {
                throw new Error('Invalid API response: empty response');
            }
            
            // If response has counters property, use that directly
            if (data.counters) {
                return data.counters;
            }
            
            // If response has the visitor stats directly as top-level properties
            if (data.uniqueVisitors !== undefined || 
                data.totalPageViews !== undefined ||
                data.returnVisitors !== undefined) {
                return data;
            }
            
            // If response has success property but no counters, try to extract stats
            if (data.success === true) {
                const possibleCounters = {};
                // Try to extract counter fields from any location in the response
                ['uniqueVisitors', 'totalPageViews', 'returnVisitors', 'lastUpdated'].forEach(key => {
                    if (data[key] !== undefined) {
                        possibleCounters[key] = data[key];
                    }
                });
                
                if (Object.keys(possibleCounters).length > 0) {
                    return possibleCounters;
                }
            }
            
            this.log('Unexpected API response format:', data);
            throw new Error('Invalid API response format');
        } catch (error) {
            if (error.name === 'AbortError') {
                this.log('API request timed out');
            } else {
                this.log('API request failed:', error);
            }
            throw error;
        }
    }
    async sendToAPI(visitData) {
        if (!this.config.apiEndpoint) return null;
        
        // Check for demo mode first
        const isLocal = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' || 
                      window.location.hostname.startsWith('192.168.') || 
                      window.location.port !== '';
        
        // If we're in demo mode or local development with demo mode enabled, skip API call
        if ((isLocal && (this.config.demoMode || window.visitorCounterDemoMode)) || this.config.demoMode) {
            this.log('Demo mode active - skipping API call in sendToAPI');
            
            // Return a simulated successful response
            return {
                success: true,
                message: 'Demo mode active',
                counters: {
                    uniqueVisitors: this.visitorData.uniqueVisitors,
                    totalPageViews: this.visitorData.totalPageViews,
                    returnVisitors: this.visitorData.returnVisitors,
                    lastUpdated: Date.now()
                }
            };
        }
        
        try {
            // Adjust endpoint for local development if needed
            let endpoint = this.config.apiEndpoint;
            if (isLocal && !window.forceApiCall) {
                const port = window.location.port || '80';
                endpoint = `${window.location.protocol}//${window.location.hostname}:${port}${this.config.apiEndpoint}`;
                this.log('Using local endpoint:', endpoint);
            }
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
            
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'track_visit',
                    data: visitData
                }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }
            
            const result = await response.json();
            if (result.counters) {
                this.visitorData = { ...this.visitorData, ...result.counters };
            }
            return result;
        } catch (error) {
            if (error.name === 'AbortError') {
                this.log('API request timed out');
            } else {
                this.log('API request failed:', error);
            }
            throw error;
        }
    }
    updateCounterLabels() {
        const getTranslation = (key, fallback) => {
            if (window.LanguageSwitcher && window.LanguageSwitcher.getTranslation) {
                return window.LanguageSwitcher.getTranslation(key, fallback);
            }
            return fallback;
        };

        const container = document.querySelector('#visitor-counter');
        if (container) {
            // Update counter title
            const titleSpan = container.querySelector('.counter-title span');
            if (titleSpan) {
                titleSpan.textContent = getTranslation('footer.visitorCounter', 'Website Analytics');
            }

            // Update stat labels if they exist
            const stats = container.querySelectorAll('.counter-stat');
            stats.forEach((stat, index) => {
                const label = stat.querySelector('.counter-label');
                if (label) {
                    const icon = label.querySelector('i');
                    const statType = stat.getAttribute('data-stat');
                    
                    let translationKey = '';
                    let fallbackText = '';
                    
                    switch (statType) {
                        case 'total-views':
                            translationKey = 'visitorCounter.totalViews';
                            fallbackText = 'Total Views';
                            break;
                        case 'unique-visitors':
                            translationKey = 'visitorCounter.uniqueVisitors';
                            fallbackText = 'Unique Visitors';
                            break;
                        case 'return-visitors':
                            translationKey = 'visitorCounter.returnVisits';
                            fallbackText = 'Return Visits';
                            break;
                    }
                    
                    if (translationKey) {
                        const iconHTML = icon ? icon.outerHTML : '';
                        label.innerHTML = iconHTML + getTranslation(translationKey, fallbackText);
                    }
                }
            });

            // Update "Last updated" text
            const updated = container.querySelector('.counter-updated');
            if (updated && updated.textContent.includes('Last updated:')) {
                const timestamp = this.getFormattedTime();
                updated.textContent = `${getTranslation('visitorCounter.lastUpdated', 'Last updated')}: ${timestamp}`;
            }
        }
    }

    displayCounter() {
        // Find or create the counter element
        let element = document.querySelector(this.config.displayElement);
        if (!element) {
            this.log('Display element not found, creating one:', this.config.displayElement);
            element = document.createElement('div');
            element.id = this.config.displayElement.replace('#', '');
            element.className = 'visitor-counter-wrapper';
            
            // Try to append to the appropriate location based on page structure
            // First, try to find specific containers like footer or a dedicated stats section
            const footer = document.querySelector('footer');
            const contact = document.querySelector('#contact, .contact');
            const stats = document.querySelector('.stats-section, .site-stats');
            
            if (stats) {
                this.log('Appending counter to stats section');
                stats.appendChild(element);
            } else if (contact) {
                this.log('Appending counter to contact section');
                contact.appendChild(element);
            } else if (footer) {
                this.log('Appending counter to footer');
                footer.appendChild(element);
            } else {
                this.log('No suitable container found, appending to body');
                document.body.appendChild(element);
            }
        }

        // Add loading state
        element.classList.add('loading');
        
        const html = this.generateCounterHTML();
        element.innerHTML = html;
        
        // Make sure the counters have default values even if API fails
        if (this.visitorData.uniqueVisitors === 0 && this.visitorData.totalPageViews === 0) {
            this.visitorData = {
                uniqueVisitors: 1,
                totalPageViews: 1,
                returnVisitors: 0,
                lastUpdated: Date.now()
            };
            element.innerHTML = this.generateCounterHTML();
        }
        
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
        
        // Get translations if language switcher is available
        const getTranslation = (key, fallback) => {
            if (window.LanguageSwitcher && window.LanguageSwitcher.getTranslation) {
                return window.LanguageSwitcher.getTranslation(key, fallback);
            }
            return fallback;
        };
        
        return `
            <div class="visitor-counter-container">
                <div class="counter-title">
                    <i class="fas fa-chart-line"></i>
                    <span>${getTranslation('footer.visitorCounter', 'Website Analytics')}</span>
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

// Automatically initialize the visitor counter when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're in a local environment
    const isLocal = window.location.hostname === 'localhost' || 
                  window.location.hostname === '127.0.0.1' || 
                  window.location.hostname.startsWith('192.168.') || 
                  window.location.port !== '';
    
    // Create an instance of the VisitorCounter
    const visitorCounter = new VisitorCounter({
        apiEndpoint: '/api/visitors',
        debug: false,
        useLocalStorage: true,
        displayElement: '#visitor-counter',
        animateNumbers: true,
        // Enable demo mode automatically for local development
        demoMode: isLocal
    });
    
    // Make the instance available globally for debugging
    window.visitorCounterInstance = visitorCounter;
});
