/**
 * Language Switcher - Internationalization System
 * Inspired by Jekyll Multiple Languages Plugin concepts
 * Adapted for static HTML sites
 */

class LanguageSwitcher {
    constructor() {
        this.currentLang = 'en'; // Default language
        this.defaultLang = 'en';
        this.translations = {};
        this.availableLanguages = ['en', 'de', 'fr', 'ja', 'ko', 'zh'];
        this.loadingState = false;
        
        // Initialize the system
        this.init();
    }

    async init() {
        try {
            // Detect language from URL or browser preference
            this.detectLanguage();
            
            // Load translations for all languages
            await this.loadAllTranslations();
            
            // Apply initial translations
            this.applyTranslations();
            
            // Render the language switcher UI
            this.renderLanguageSwitcher();
            
            // Setup event listeners
            this.setupEventListeners();
            
            console.log('Language Switcher initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Language Switcher:', error);
        }
    }

    detectLanguage() {
        // Priority: URL parameter > localStorage > browser language > default
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        const storedLang = localStorage.getItem('preferredLanguage');
        const browserLang = navigator.language.split('-')[0];

        if (urlLang && this.availableLanguages.includes(urlLang)) {
            this.currentLang = urlLang;
        } else if (storedLang && this.availableLanguages.includes(storedLang)) {
            this.currentLang = storedLang;
        } else if (this.availableLanguages.includes(browserLang)) {
            this.currentLang = browserLang;
        }

        // Update URL if language changed
        if (urlLang !== this.currentLang) {
            this.updateURL();
        }
    }

    async loadAllTranslations() {
        const loadPromises = this.availableLanguages.map(lang => this.loadTranslation(lang));
        await Promise.all(loadPromises);
    }

    async loadTranslation(lang) {
        try {
            const response = await fetch(`translations/${lang}.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const translation = await response.json();
            this.translations[lang] = translation;
        } catch (error) {
            console.warn(`Failed to load translation for ${lang}:`, error);
            // Fallback to default language if current language fails to load
            if (lang === this.currentLang && lang !== this.defaultLang) {
                console.log(`Falling back to default language: ${this.defaultLang}`);
                this.currentLang = this.defaultLang;
            }
        }
    }

    // Translate function similar to Jekyll plugin's {% t key %}
    t(key, lang = this.currentLang) {
        const translation = this.translations[lang];
        if (!translation) {
            console.warn(`No translation found for language: ${lang}`);
            return this.t(key, this.defaultLang); // Fallback to default language
        }

        const keys = key.split('.');
        let value = translation;
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                // If key not found, try default language
                if (lang !== this.defaultLang) {
                    return this.t(key, this.defaultLang);
                }
                console.warn(`Translation key not found: ${key} for language: ${lang}`);
                return key; // Return the key itself as fallback
            }
        }
        
        return value;
    }

    // Apply translations to all elements with data-i18n attributes
    applyTranslations() {
        const elementsToTranslate = document.querySelectorAll('[data-i18n]');
        
        elementsToTranslate.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translatedText = this.t(key);
            
            // Handle different types of content
            const targetAttr = element.getAttribute('data-i18n-attr');
            if (targetAttr) {
                // Update specific attribute (e.g., placeholder, title, aria-label)
                element.setAttribute(targetAttr, translatedText);
            } else {
                // Update text content
                if (element.tagName === 'INPUT' && element.type === 'submit') {
                    element.value = translatedText;
                } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translatedText;
                } else {
                    element.textContent = translatedText;
                }
            }
        });

        // Handle aria-label translations
        const elementsWithAriaLabel = document.querySelectorAll('[data-i18n-aria-label]');
        elementsWithAriaLabel.forEach(element => {
            const key = element.getAttribute('data-i18n-aria-label');
            const translatedText = this.t(key);
            element.setAttribute('aria-label', translatedText);
        });

        // Update document language attribute
        document.documentElement.lang = this.currentLang;
        
        // Dispatch event for other components to react to language change
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: this.currentLang }
        }));
    }

    // Switch to a new language
    async switchLanguage(newLang) {
        if (!this.availableLanguages.includes(newLang)) {
            console.error(`Language ${newLang} is not available`);
            return;
        }

        if (newLang === this.currentLang) {
            return; // No change needed
        }

        this.loadingState = true;
        
        try {
            // Ensure translation is loaded
            if (!this.translations[newLang]) {
                await this.loadTranslation(newLang);
            }

            this.currentLang = newLang;
            
            // Store preference
            localStorage.setItem('preferredLanguage', newLang);
            
            // Update URL
            this.updateURL();
            
            // Apply new translations
            this.applyTranslations();
            
            // Update language switcher UI
            this.updateLanguageSwitcherUI();
            
        } catch (error) {
            console.error('Failed to switch language:', error);
        } finally {
            this.loadingState = false;
        }
    }

    updateURL() {
        const url = new URL(window.location);
        if (this.currentLang === this.defaultLang) {
            url.searchParams.delete('lang');
        } else {
            url.searchParams.set('lang', this.currentLang);
        }
        
        // Update URL without page reload
        window.history.replaceState({}, '', url);
    }

    updateLanguageSwitcherUI() {
        // Re-render the entire language switcher to update current language
        this.renderLanguageSwitcher();
    }

    setupEventListeners() {
        // Listen for language switcher clicks
        document.addEventListener('click', (e) => {
            const langOption = e.target.closest('.lang-option');
            if (langOption) {
                e.preventDefault();
                const targetLang = langOption.getAttribute('data-lang');
                this.switchLanguage(targetLang);
            }

            // Toggle dropdown
            const langToggle = e.target.closest('.lang-toggle');
            if (langToggle) {
                e.preventDefault();
                const dropdown = langToggle.nextElementSibling;
                if (dropdown) {
                    dropdown.classList.toggle('show');
                }
            }
            
            // Handle navigation links to preserve language parameter
            const navLink = e.target.closest('.nav-link');
            if (navLink && navLink.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetSection = navLink.getAttribute('href');
                
                // Scroll to the section
                const targetElement = document.querySelector(targetSection);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
                
                // Update URL hash while preserving language parameter
                const url = new URL(window.location);
                url.hash = targetSection;
                window.history.replaceState({}, '', url);
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.language-switcher')) {
                const dropdowns = document.querySelectorAll('.lang-dropdown.show');
                dropdowns.forEach(dropdown => dropdown.classList.remove('show'));
            }
        });

        // Listen for browser back/forward
        window.addEventListener('popstate', () => {
            this.detectLanguage();
            this.applyTranslations();
            this.updateLanguageSwitcherUI();
        });
        
        // Update all internal links when language changes
        window.addEventListener('languageChanged', () => {
            this.updateInternalLinks();
        });
    }

    // Get available languages with their display names
    getAvailableLanguages() {
        return this.availableLanguages.map(lang => ({
            code: lang,
            name: this.t(`lang_names.${lang}`),
            current: lang === this.currentLang
        }));
    }

    // Method to dynamically add translatable content (similar to Jekyll's translate_file)
    addTranslatableContent(element, key) {
        element.setAttribute('data-i18n', key);
        const translatedText = this.t(key);
        element.textContent = translatedText;
    }

    // Method to create language switcher HTML
    createLanguageSwitcherHTML() {
        const languages = this.getAvailableLanguages();
        const currentLang = languages.find(lang => lang.current);
        
        return `
            <div class="language-switcher">
                <button class="lang-toggle lang-current" type="button" title="${currentLang.name}">
                    <i class="fas fa-globe"></i>
                    <span>${currentLang.name}</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                <ul class="lang-dropdown">
                    ${languages.map(lang => `
                        <li>
                            <a href="#" class="lang-option ${lang.current ? 'active' : ''}" 
                               data-lang="${lang.code}" title="${lang.name}">
                                ${lang.name}
                            </a>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }

    // Update internal links to preserve language parameter
    updateInternalLinks() {
        const currentUrl = new URL(window.location);
        const langParam = currentUrl.searchParams.get('lang');
        
        if (langParam && langParam !== this.defaultLang) {
            // Update download links to include language parameter
            const downloadLinks = document.querySelectorAll('a[download]');
            downloadLinks.forEach(link => {
                const linkUrl = new URL(link.href, window.location.origin);
                linkUrl.searchParams.set('lang', langParam);
                link.href = linkUrl.toString();
            });
            
            // Update external links that should preserve language context
            const externalLinks = document.querySelectorAll('a[target="_blank"]');
            externalLinks.forEach(link => {
                // Only update if it's an internal link that opens in new tab
                if (link.href.includes(window.location.hostname)) {
                    const linkUrl = new URL(link.href);
                    linkUrl.searchParams.set('lang', langParam);
                    link.href = linkUrl.toString();
                }
            });
        }
    }

    // Render the language switcher into the DOM
    renderLanguageSwitcher() {
        const container = document.getElementById('language-switcher-container');
        if (container) {
            container.innerHTML = this.createLanguageSwitcherHTML();
        } else {
            console.warn('Language switcher container not found');
        }
    }
}

// Global instance
window.languageSwitcher = new LanguageSwitcher();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageSwitcher;
}