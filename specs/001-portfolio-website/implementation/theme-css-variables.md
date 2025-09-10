# Theme System CSS Variables

This document defines the CSS variables that will be used for the theme system in the portfolio website.

## Base Theme Variables

```css
:root {
  /* Animation & Transition */
  --transition-speed: 300ms;
  --transition-timing: ease;
  --animation-speed: 1;
  
  /* Spacing */
  --space-unit: 0.25rem;
  --space-xs: calc(2 * var(--space-unit));    /* 0.5rem */
  --space-sm: calc(4 * var(--space-unit));    /* 1rem */
  --space-md: calc(8 * var(--space-unit));    /* 2rem */
  --space-lg: calc(16 * var(--space-unit));   /* 4rem */
  --space-xl: calc(32 * var(--space-unit));   /* 8rem */
  
  /* Typography */
  --font-heading: 'Space Grotesk', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-code: 'Fira Code', monospace;
  
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  
  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --line-height-loose: 1.8;
  
  --font-size-base: 1rem;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  --font-size-5xl: 3rem;
  
  /* Borders */
  --border-radius-sm: 0.25rem;
  --border-radius-md: 0.5rem;
  --border-radius-lg: 1rem;
  --border-radius-xl: 2rem;
  --border-radius-full: 9999px;
  
  --border-width-thin: 1px;
  --border-width-medium: 2px;
  --border-width-thick: 4px;
  
  /* Effects */
  --blur-sm: 4px;
  --blur-md: 8px;
  --blur-lg: 16px;
  --blur-xl: 24px;
  
  /* Z-index layers */
  --z-background: -10;
  --z-default: 1;
  --z-footer: 10;
  --z-header: 20;
  --z-tooltip: 30;
  --z-modal: 40;
  --z-overlay: 50;
  
  /* Container widths */
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
}
```

## Light Theme Variables

```css
:root, [data-theme="light"] {
  /* Core color palette */
  --color-primary: #3a86ff;
  --color-primary-light: #5b9fff;
  --color-primary-dark: #0061f3;
  
  --color-secondary: #8338ec;
  --color-secondary-light: #a05ff0;
  --color-secondary-dark: #6419c7;
  
  --color-accent: #ff006e;
  --color-accent-light: #ff3c90;
  --color-accent-dark: #d40059;
  
  /* UI colors */
  --color-background: #f8f9fa;
  --color-surface: #ffffff;
  --color-surface-2: #f1f3f5;
  --color-surface-3: #e9ecef;
  
  /* Text colors */
  --color-text: #212529;
  --color-text-secondary: #6c757d;
  --color-text-tertiary: #adb5bd;
  --color-text-on-primary: #ffffff;
  --color-text-on-secondary: #ffffff;
  --color-text-on-accent: #ffffff;
  
  /* Border colors */
  --color-border: #dee2e6;
  --color-divider: #e9ecef;
  
  /* Status colors */
  --color-success: #40c057;
  --color-warning: #fcc419;
  --color-error: #fa5252;
  --color-info: #15aabf;
  
  /* Shadow colors */
  --color-shadow: rgba(0, 0, 0, 0.1);
  --color-shadow-dark: rgba(0, 0, 0, 0.18);
  
  /* Common shadows */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04);
  
  /* Animation specific colors */
  --color-particle: var(--color-primary);
  --color-particle-opacity: 0.8;
  --color-card-glow: rgba(58, 134, 255, 0.15);
  --color-text-glow: rgba(58, 134, 255, 0.5);
  
  /* Gradients */
  --gradient-background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  --gradient-primary: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  --gradient-secondary: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-secondary-dark) 100%);
  --gradient-accent: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%);
  
  /* Button colors */
  --button-background: var(--color-surface);
  --button-text: var(--color-text);
  --button-border: var(--color-border);
  --button-hover-background: var(--color-surface-2);
  --button-primary-background: var(--color-primary);
  --button-primary-text: var(--color-text-on-primary);
  
  /* Form colors */
  --input-background: var(--color-surface);
  --input-border: var(--color-border);
  --input-text: var(--color-text);
  --input-placeholder: var(--color-text-tertiary);
  --input-focus-border: var(--color-primary);
  --input-disabled-background: var(--color-surface-2);
  
  /* Link colors */
  --link-color: var(--color-primary);
  --link-hover-color: var(--color-primary-dark);
  --link-visited-color: var(--color-secondary);
  
  /* Focus */
  --focus-ring-color: rgba(58, 134, 255, 0.6);
  --focus-ring-width: 3px;
  
  /* Scrollbar */
  --scrollbar-thumb: var(--color-text-tertiary);
  --scrollbar-track: var(--color-surface-2);
  
  /* Code */
  --code-background: var(--color-surface-2);
  --code-color: var(--color-text);
  --code-border: var(--color-border);
  
  /* 3D elements */
  --3d-light-intensity: 1;
  --3d-ambient-intensity: 0.6;
  --3d-material-shininess: 50;
}
```

## Dark Theme Variables

```css
[data-theme="dark"] {
  /* Core color palette */
  --color-primary: #5b9fff;
  --color-primary-light: #86bfff;
  --color-primary-dark: #0061f3;
  
  --color-secondary: #a05ff0;
  --color-secondary-light: #bc89f7;
  --color-secondary-dark: #6419c7;
  
  --color-accent: #ff3c90;
  --color-accent-light: #ff69a9;
  --color-accent-dark: #d40059;
  
  /* UI colors */
  --color-background: #121212;
  --color-surface: #1e1e1e;
  --color-surface-2: #2c2c2c;
  --color-surface-3: #383838;
  
  /* Text colors */
  --color-text: #e0e0e0;
  --color-text-secondary: #a0a0a0;
  --color-text-tertiary: #6c6c6c;
  --color-text-on-primary: #ffffff;
  --color-text-on-secondary: #ffffff;
  --color-text-on-accent: #ffffff;
  
  /* Border colors */
  --color-border: #333333;
  --color-divider: #333333;
  
  /* Status colors */
  --color-success: #51cf66;
  --color-warning: #ffd43b;
  --color-error: #ff6b6b;
  --color-info: #22d3ee;
  
  /* Shadow colors */
  --color-shadow: rgba(0, 0, 0, 0.3);
  --color-shadow-dark: rgba(0, 0, 0, 0.5);
  
  /* Common shadows */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.25), 0 2px 4px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.25), 0 4px 6px rgba(0, 0, 0, 0.15);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.15);
  
  /* Animation specific colors */
  --color-particle: var(--color-accent);
  --color-particle-opacity: 0.6;
  --color-card-glow: rgba(255, 60, 144, 0.2);
  --color-text-glow: rgba(255, 60, 144, 0.7);
  
  /* Gradients */
  --gradient-background: linear-gradient(135deg, #121212 0%, #1a1a1a 100%);
  --gradient-primary: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  --gradient-secondary: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-secondary-dark) 100%);
  --gradient-accent: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%);
  
  /* Button colors */
  --button-background: var(--color-surface-2);
  --button-text: var(--color-text);
  --button-border: var(--color-border);
  --button-hover-background: var(--color-surface-3);
  --button-primary-background: var(--color-primary);
  --button-primary-text: var(--color-text-on-primary);
  
  /* Form colors */
  --input-background: var(--color-surface);
  --input-border: var(--color-border);
  --input-text: var(--color-text);
  --input-placeholder: var(--color-text-tertiary);
  --input-focus-border: var(--color-primary);
  --input-disabled-background: var(--color-surface-2);
  
  /* Link colors */
  --link-color: var(--color-primary);
  --link-hover-color: var(--color-primary-light);
  --link-visited-color: var(--color-secondary);
  
  /* Focus */
  --focus-ring-color: rgba(91, 159, 255, 0.8);
  --focus-ring-width: 3px;
  
  /* Scrollbar */
  --scrollbar-thumb: var(--color-surface-3);
  --scrollbar-track: var(--color-surface);
  
  /* Code */
  --code-background: var(--color-surface-2);
  --code-color: var(--color-text);
  --code-border: var(--color-border);
  
  /* 3D elements */
  --3d-light-intensity: 0.8;
  --3d-ambient-intensity: 0.4;
  --3d-material-shininess: 30;
}
```

## Theme Transition CSS

```css
/* Global transition settings */
.theme-transition * {
  transition: color var(--transition-speed) var(--transition-timing),
              background-color var(--transition-speed) var(--transition-timing),
              border-color var(--transition-speed) var(--transition-timing),
              box-shadow var(--transition-speed) var(--transition-timing),
              fill var(--transition-speed) var(--transition-timing),
              stroke var(--transition-speed) var(--transition-timing) !important;
}

/* Remove transitions for people who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  .theme-transition * {
    transition-duration: 0.001ms !important;
  }
}

/* Class-based approach for manual control */
.reduced-motion * {
  transition-duration: 0.001ms !important;
  animation-duration: 0.001ms !important;
  animation-iteration-count: 1 !important;
}
```

## Focus Styles

```css
/* Global focus styles for all themes */
:focus {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: 2px;
}

/* Mouse users get different focus styles */
:focus:not(:focus-visible) {
  outline: none;
}

:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: 2px;
}
```

## Scrollbar Styling

```css
/* Custom scrollbar for all themes */
::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

::-webkit-scrollbar-track {
  background: var(--scrollbar-track);
}

::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: 6px;
  border: 3px solid var(--scrollbar-track);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-secondary);
}

/* Firefox scrollbar */
* {
  scrollbar-width: thin;
  scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
}
```
