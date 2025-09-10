# Theme Manager Contract

This document defines the interface contracts for theme management in the portfolio website.

## ThemeManager

Core controller for managing themes across the website.

```typescript
interface ThemeManager {
  // Core methods
  initialize(): void;                       // Initialize the theme manager
  getAvailableThemes(): Array<Theme>;       // Get all available themes
  getCurrentTheme(): Theme;                 // Get current theme
  setTheme(themeId: string): void;          // Set theme by ID
  toggleTheme(): void;                      // Toggle between light and dark
  
  // System preference detection
  detectSystemPreference(): 'light' | 'dark' | null;  // Get system preference
  enableSystemPreferenceDetection(): void;  // Enable auto detection
  disableSystemPreferenceDetection(): void; // Disable auto detection
  
  // Theme storage
  saveThemePreference(themeId: string): void;  // Save user preference
  loadThemePreference(): string | null;      // Load user preference
  
  // Events
  on(event: string, callback: Function): void;  // Add event listener
  off(event: string, callback: Function): void; // Remove event listener
  trigger(event: string, data?: any): void;     // Trigger event
}
```

## Theme

Represents a complete theme configuration.

```typescript
interface Theme {
  // Core properties
  id: string;                     // Unique identifier
  name: string;                   // Display name
  isDefault: boolean;             // Whether this is the default theme
  
  // Color scheme
  colors: {
    primary: string;              // Primary brand color
    secondary: string;            // Secondary brand color
    accent: string;               // Accent color for highlights
    background: string;           // Page background
    surface: string;              // Component surface background
    text: string;                 // Primary text color
    textSecondary: string;        // Secondary text color
    border: string;               // Border color
    shadow: string;               // Shadow color (with alpha)
    success: string;              // Success state color
    warning: string;              // Warning state color
    error: string;                // Error state color
    info: string;                 // Info state color
    [key: string]: string;        // Additional theme-specific colors
  };
  
  // Typography
  fonts: {
    heading: string;              // Heading font family
    body: string;                 // Body text font family
    code: string;                 // Code font family
    [key: string]: string;        // Additional font categories
  };
  
  // Animation settings
  animations: {
    particleColor: string;        // Color for particles
    particleOpacity: number;      // Opacity for particles
    backgroundGradient: string;   // Background gradient
    cardGlow: string;             // Glow effect for cards
    [key: string]: any;           // Additional animation settings
  };
  
  // Theme variant
  variant: 'light' | 'dark' | 'custom';  // Base theme variant
}
```

## ThemePreferences

Manages user theme preferences and settings.

```typescript
interface ThemePreferences {
  // Core properties
  detectSystemTheme: boolean;     // Whether to auto-detect system theme
  fallbackTheme: string;          // Theme to use when system preference unavailable
  enableAnimations: boolean;      // Whether animations are enabled
  reducedMotion: boolean;         // Whether reduced motion is enabled
  transitionSpeed: number;        // Speed of theme transitions in ms
  
  // Methods
  setDetectSystemTheme(enabled: boolean): void;  // Enable/disable system detection
  setFallbackTheme(themeId: string): void;       // Set fallback theme
  setEnableAnimations(enabled: boolean): void;   // Enable/disable animations
  setReducedMotion(enabled: boolean): void;      // Enable/disable reduced motion
  setTransitionSpeed(speed: number): void;       // Set transition speed
  
  // Storage
  save(): void;                   // Save preferences to localStorage
  load(): void;                   // Load preferences from localStorage
  reset(): void;                  // Reset to defaults
}
```

## ThemeStylesManager

Manages the application of theme styles to the DOM.

```typescript
interface ThemeStylesManager {
  // Core methods
  initialize(rootElement?: HTMLElement): void;  // Initialize (default: document.documentElement)
  applyTheme(theme: Theme): void;               // Apply theme to DOM
  applyTransition(duration: number): void;      // Apply transition effect
  removeTransition(): void;                     // Remove transition effect
  
  // CSS variable management
  setCSSVariable(name: string, value: string): void;  // Set CSS variable
  getCSSVariable(name: string): string;               // Get CSS variable
  removeCSSVariable(name: string): void;              // Remove CSS variable
  
  // Class management
  addThemeClass(themeId: string): void;         // Add theme class to root element
  removeThemeClass(themeId: string): void;      // Remove theme class from root element
  removeAllThemeClasses(): void;                // Remove all theme classes
}
```

## SystemPreferenceDetector

Detects and monitors system color scheme preference.

```typescript
interface SystemPreferenceDetector {
  // Core methods
  initialize(): void;                       // Initialize detector
  getCurrentPreference(): 'light' | 'dark' | null;  // Get current preference
  startListening(): void;                   // Start listening for changes
  stopListening(): void;                    // Stop listening for changes
  isSupported(): boolean;                   // Check if browser supports detection
  
  // Events
  onPreferenceChange(callback: (preference: 'light' | 'dark') => void): void;  // Add change listener
  offPreferenceChange(callback: Function): void;  // Remove change listener
}
```

## ThemeAnimationAdapter

Adapts animation parameters based on current theme.

```typescript
interface ThemeAnimationAdapter {
  // Core methods
  initialize(themeManager: ThemeManager): void;  // Initialize with theme manager
  getAnimationSettings(animationId: string): any;  // Get settings for animation
  updateAnimationSettings(animation: any, themeId: string): void;  // Update animation with theme settings
  
  // Specific animation adaptations
  getParticleSettings(themeId: string): any;    // Get particle settings for theme
  getBackgroundSettings(themeId: string): any;  // Get background settings for theme
  getTextEffectSettings(themeId: string): any;  // Get text effect settings for theme
  get3DEffectSettings(themeId: string): any;    // Get 3D effect settings for theme
}
```

## ThemeStorage

Manages theme storage and retrieval.

```typescript
interface ThemeStorage {
  // Core methods
  saveTheme(themeId: string): void;         // Save theme preference
  getTheme(): string | null;                // Get saved theme preference
  clearTheme(): void;                       // Clear saved theme preference
  
  // Preference storage
  savePreferences(preferences: ThemePreferences): void;  // Save all preferences
  getPreferences(): ThemePreferences | null;  // Get all saved preferences
  clearPreferences(): void;                 // Clear all saved preferences
  
  // Custom theme storage
  saveCustomTheme(theme: Theme): void;      // Save custom theme
  getCustomTheme(themeId: string): Theme | null;  // Get custom theme
  getAllCustomThemes(): Theme[];            // Get all custom themes
  deleteCustomTheme(themeId: string): void;  // Delete custom theme
}
```
