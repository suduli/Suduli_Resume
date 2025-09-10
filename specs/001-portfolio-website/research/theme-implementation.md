# Theme Implementation Research

## Light/Dark Theme Implementation with System Preference Detection

### Decision
Implement a comprehensive theme system with the following characteristics:
- CSS Variables for theme property definitions
- Data-attribute-based theme application (data-theme="light|dark")
- System preference detection via `prefers-color-scheme` media query
- Local storage for persisting user preferences
- Smooth transitions between themes

### Rationale
This approach provides maximum flexibility, performance, and user experience benefits:
1. CSS Variables allow for easy theme switching without page reloads
2. Data-attributes enable easier CSS selector specificity management than class-based approaches
3. `prefers-color-scheme` is well-supported across modern browsers
4. Local storage persists user preferences across sessions
5. Smooth transitions create a polished experience

### Alternatives Considered
1. **Class-based Theming**: Adding/removing classes for themes. Less flexible for multiple themes.
2. **Separate Stylesheets**: Loading different CSS files per theme. Causes performance issues with page reloads.
3. **JavaScript-only Theming**: Directly manipulating styles via JavaScript. Poor performance and maintainability.
4. **Framework-specific Solutions**: Using React's context or Vue's reactivity. More complex and less portable.

### Implementation Details

#### Core Theme Variables
```css
:root {
  /* Base colors */
  --color-primary: #3a86ff;
  --color-secondary: #8338ec;
  --color-accent: #ff006e;
  
  /* Light theme (default) */
  --color-background: #f8f9fa;
  --color-surface: #ffffff;
  --color-text: #212529;
  --color-text-secondary: #6c757d;
  --color-border: #dee2e6;
  --color-shadow: rgba(0, 0, 0, 0.1);
  
  /* Animation colors */
  --color-particle: var(--color-primary);
  --color-particle-opacity: 0.8;
  --gradient-background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  --color-card-glow: rgba(58, 134, 255, 0.15);
  
  /* Typography */
  --font-heading: 'Space Grotesk', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-code: 'Fira Code', monospace;
}

[data-theme="dark"] {
  --color-background: #121212;
  --color-surface: #1e1e1e;
  --color-text: #e0e0e0;
  --color-text-secondary: #a0a0a0;
  --color-border: #333333;
  --color-shadow: rgba(0, 0, 0, 0.3);
  
  /* Animation colors */
  --color-particle: var(--color-accent);
  --color-particle-opacity: 0.6;
  --gradient-background: linear-gradient(135deg, #121212 0%, #1a1a1a 100%);
  --color-card-glow: rgba(255, 0, 110, 0.2);
}
```

#### Theme Manager Class
```javascript
class ThemeManager {
  constructor() {
    this.THEME_STORAGE_KEY = 'portfolio-theme-preference';
    this.THEMES = {
      LIGHT: 'light',
      DARK: 'dark'
    };
    this.SYSTEM_PREF_KEY = 'portfolio-use-system-preference';
    this.useSystemPreference = this.loadSystemPreference();
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Initialize theme
    this.initialize();
    
    // Add event listener for system preference changes
    this.mediaQuery.addEventListener('change', this.handleSystemPreferenceChange.bind(this));
  }
  
  initialize() {
    if (this.useSystemPreference) {
      this.applyTheme(this.getSystemPreference());
    } else {
      const savedTheme = this.loadThemePreference();
      if (savedTheme) {
        this.applyTheme(savedTheme);
      } else {
        this.applyTheme(this.THEMES.LIGHT); // Default to light theme
      }
    }
  }
  
  getSystemPreference() {
    return this.mediaQuery.matches ? this.THEMES.DARK : this.THEMES.LIGHT;
  }
  
  loadThemePreference() {
    return localStorage.getItem(this.THEME_STORAGE_KEY);
  }
  
  saveThemePreference(theme) {
    localStorage.setItem(this.THEME_STORAGE_KEY, theme);
  }
  
  loadSystemPreference() {
    const pref = localStorage.getItem(this.SYSTEM_PREF_KEY);
    return pref === null ? true : pref === 'true'; // Default to true
  }
  
  saveSystemPreference(useSystem) {
    localStorage.setItem(this.SYSTEM_PREF_KEY, useSystem);
    this.useSystemPreference = useSystem;
  }
  
  getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || this.THEMES.LIGHT;
  }
  
  applyTheme(theme) {
    // Apply transition for smooth theme change
    document.documentElement.classList.add('theme-transition');
    
    // Set the theme attribute
    document.documentElement.setAttribute('data-theme', theme);
    
    // Force a reflow to ensure transition takes effect
    const reflow = document.documentElement.offsetHeight;
    
    // Save the preference if not using system preference
    if (!this.useSystemPreference) {
      this.saveThemePreference(theme);
    }
    
    // Dispatch theme change event
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    
    // Remove transition class after transition completes
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 300); // Match transition duration in CSS
  }
  
  toggleTheme() {
    const currentTheme = this.getCurrentTheme();
    const newTheme = currentTheme === this.THEMES.LIGHT ? this.THEMES.DARK : this.THEMES.LIGHT;
    
    // If we're toggling manually, disable system preference
    if (this.useSystemPreference) {
      this.useSystemPreference = false;
      this.saveSystemPreference(false);
    }
    
    this.applyTheme(newTheme);
    return newTheme;
  }
  
  enableSystemPreference() {
    this.useSystemPreference = true;
    this.saveSystemPreference(true);
    this.applyTheme(this.getSystemPreference());
  }
  
  disableSystemPreference() {
    this.useSystemPreference = false;
    this.saveSystemPreference(false);
  }
  
  handleSystemPreferenceChange(e) {
    if (this.useSystemPreference) {
      this.applyTheme(e.matches ? this.THEMES.DARK : this.THEMES.LIGHT);
    }
  }
}
```

#### CSS Transitions for Smooth Theme Switching
```css
/* Add smooth transition when switching themes */
:root {
  --theme-transition-duration: 300ms;
}

.theme-transition * {
  transition: background-color var(--theme-transition-duration) ease,
              color var(--theme-transition-duration) ease,
              border-color var(--theme-transition-duration) ease,
              box-shadow var(--theme-transition-duration) ease,
              fill var(--theme-transition-duration) ease,
              stroke var(--theme-transition-duration) ease !important;
}
```

#### Theme Toggle Component
```javascript
class ThemeToggle {
  constructor(themeManager, selector) {
    this.themeManager = themeManager;
    this.toggleElement = document.querySelector(selector);
    
    if (this.toggleElement) {
      this.initialize();
    }
  }
  
  initialize() {
    // Set initial state
    this.updateToggleState();
    
    // Add event listener
    this.toggleElement.addEventListener('click', this.handleToggle.bind(this));
    
    // Listen for theme changes from other sources
    window.addEventListener('themechange', this.updateToggleState.bind(this));
  }
  
  updateToggleState() {
    const currentTheme = this.themeManager.getCurrentTheme();
    const isUsingSystemPref = this.themeManager.useSystemPreference;
    
    // Update aria attributes
    this.toggleElement.setAttribute('aria-pressed', currentTheme === this.themeManager.THEMES.DARK);
    
    // Update toggle text/icon
    if (isUsingSystemPref) {
      this.toggleElement.setAttribute('title', 'Using system preference');
      this.toggleElement.classList.add('using-system-preference');
    } else {
      this.toggleElement.setAttribute('title', currentTheme === this.themeManager.THEMES.DARK ? 'Switch to light theme' : 'Switch to dark theme');
      this.toggleElement.classList.remove('using-system-preference');
    }
    
    // Update icon/label for current theme
    if (currentTheme === this.themeManager.THEMES.DARK) {
      this.toggleElement.classList.add('theme-dark');
      this.toggleElement.classList.remove('theme-light');
    } else {
      this.toggleElement.classList.add('theme-light');
      this.toggleElement.classList.remove('theme-dark');
    }
  }
  
  handleToggle() {
    this.themeManager.toggleTheme();
    this.updateToggleState();
  }
}
```

#### System Preference Toggle Component
```javascript
class SystemPreferenceToggle {
  constructor(themeManager, selector) {
    this.themeManager = themeManager;
    this.toggleElement = document.querySelector(selector);
    
    if (this.toggleElement) {
      this.initialize();
    }
  }
  
  initialize() {
    // Set initial state
    this.updateToggleState();
    
    // Add event listener
    this.toggleElement.addEventListener('click', this.handleToggle.bind(this));
  }
  
  updateToggleState() {
    const isUsingSystemPref = this.themeManager.useSystemPreference;
    
    // Update aria attributes
    this.toggleElement.setAttribute('aria-pressed', isUsingSystemPref);
    
    // Update toggle appearance
    if (isUsingSystemPref) {
      this.toggleElement.classList.add('enabled');
      this.toggleElement.setAttribute('title', 'Stop using system preference');
    } else {
      this.toggleElement.classList.remove('enabled');
      this.toggleElement.setAttribute('title', 'Use system preference');
    }
  }
  
  handleToggle() {
    if (this.themeManager.useSystemPreference) {
      this.themeManager.disableSystemPreference();
    } else {
      this.themeManager.enableSystemPreference();
    }
    
    this.updateToggleState();
  }
}
```

#### Animation Adaptation for Themes
```javascript
class ThemeAnimationAdapter {
  constructor(themeManager) {
    this.themeManager = themeManager;
    // Listen for theme changes
    window.addEventListener('themechange', this.handleThemeChange.bind(this));
  }
  
  // Update particles.js configuration
  updateParticlesConfig(particlesConfig) {
    const theme = this.themeManager.getCurrentTheme();
    const root = document.documentElement;
    
    // Get computed style for current theme
    const style = getComputedStyle(root);
    const particleColor = style.getPropertyValue('--color-particle').trim();
    const particleOpacity = parseFloat(style.getPropertyValue('--color-particle-opacity').trim());
    
    // Update particles configuration
    particlesConfig.particles.color.value = particleColor;
    particlesConfig.particles.opacity.value = particleOpacity;
    
    // Adjust particles number for dark/light mode
    if (theme === this.themeManager.THEMES.DARK) {
      particlesConfig.particles.number.value = 80; // More particles in dark mode
      particlesConfig.particles.line_linked.opacity = 0.3; // Less opacity for lines
    } else {
      particlesConfig.particles.number.value = 60; // Fewer particles in light mode
      particlesConfig.particles.line_linked.opacity = 0.4; // More opacity for lines
    }
    
    return particlesConfig;
  }
  
  // Update Three.js scene based on theme
  update3DScene(scene, renderer) {
    const theme = this.themeManager.getCurrentTheme();
    const root = document.documentElement;
    const style = getComputedStyle(root);
    
    if (theme === this.themeManager.THEMES.DARK) {
      // Dark theme adjustments
      renderer.setClearColor(0x121212);
      
      // Update lighting for dark theme
      scene.traverse((object) => {
        if (object.isLight) {
          if (object.isAmbientLight) {
            object.intensity = 0.4; // Reduce ambient light
          } else if (object.isDirectionalLight) {
            object.intensity = 0.8; // Increase directional light for contrast
          }
        }
        
        // Update materials
        if (object.isMesh && object.material) {
          if (object.material.emissive) {
            object.material.emissive.set(0x333333); // Add slight emission in dark mode
          }
        }
      });
    } else {
      // Light theme adjustments
      renderer.setClearColor(0xf8f9fa);
      
      // Update lighting for light theme
      scene.traverse((object) => {
        if (object.isLight) {
          if (object.isAmbientLight) {
            object.intensity = 0.6; // Increase ambient light
          } else if (object.isDirectionalLight) {
            object.intensity = 0.5; // Reduce directional light
          }
        }
        
        // Update materials
        if (object.isMesh && object.material) {
          if (object.material.emissive) {
            object.material.emissive.set(0x000000); // No emission in light mode
          }
        }
      });
    }
  }
  
  // Update GSAP animations based on theme
  updateGsapAnimations() {
    const theme = this.themeManager.getCurrentTheme();
    
    // Adjust common GSAP animation properties based on theme
    if (theme === this.themeManager.THEMES.DARK) {
      // Slower, more dramatic animations for dark theme
      gsap.defaults({
        ease: "power2.out",
        duration: 1.2
      });
    } else {
      // Crisper animations for light theme
      gsap.defaults({
        ease: "power1.out",
        duration: 1
      });
    }
  }
  
  handleThemeChange(e) {
    // When theme changes, update all animation systems
    this.updateGsapAnimations();
    
    // Signal other systems to update (can be picked up by components)
    window.dispatchEvent(new CustomEvent('themeAnimationUpdate', { 
      detail: { 
        theme: e.detail.theme 
      } 
    }));
  }
}
```

#### Accessibility Considerations
```javascript
class ThemeAccessibility {
  constructor(themeManager) {
    this.themeManager = themeManager;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Initialize
    this.initialize();
    
    // Listen for preference changes
    this.prefersReducedMotion.addEventListener('change', this.handleReducedMotionChange.bind(this));
  }
  
  initialize() {
    // Set initial state based on user preference
    this.updateReducedMotionState();
    
    // Ensure theme toggle is keyboard accessible
    const themeToggles = document.querySelectorAll('.theme-toggle');
    themeToggles.forEach(toggle => {
      toggle.setAttribute('role', 'button');
      toggle.setAttribute('tabindex', '0');
      toggle.setAttribute('aria-label', 'Toggle theme');
      
      // Add keyboard support
      toggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle.click();
        }
      });
    });
  }
  
  updateReducedMotionState() {
    const reducedMotion = this.prefersReducedMotion.matches;
    document.documentElement.classList.toggle('reduced-motion', reducedMotion);
    
    // Dispatch event for other components to respond
    window.dispatchEvent(new CustomEvent('reducedMotionChange', { 
      detail: { reducedMotion } 
    }));
  }
  
  handleReducedMotionChange() {
    this.updateReducedMotionState();
  }
}
```

#### CSS Support for Reduced Motion
```css
/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    transition-duration: 0.001ms !important;
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
  }
}

/* Alternative class-based approach */
.reduced-motion * {
  transition-duration: 0.001ms !important;
  animation-duration: 0.001ms !important;
  animation-iteration-count: 1 !important;
}
```
