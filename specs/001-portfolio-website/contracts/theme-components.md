# Theme Components Contract

This document defines the interface contracts for theme-related UI components in the portfolio website.

## ThemeToggle

A component to toggle between light and dark modes.

```typescript
interface ThemeToggle {
  // Core properties
  currentTheme: 'light' | 'dark' | string;   // Current theme ID
  isSystemPreferenceEnabled: boolean;        // Whether system preference is enabled
  toggleLabel: string;                        // Accessible label for toggle
  showLabel: boolean;                         // Whether to show text label
  size: 'small' | 'medium' | 'large';         // Size of the toggle
  
  // Core methods
  initialize(themeManager: ThemeManager): void;  // Initialize with theme manager
  render(): HTMLElement;                         // Render the toggle component
  toggle(): void;                                // Toggle the theme
  updateState(themeId: string): void;            // Update toggle state
  
  // Events
  onToggle(callback: (themeId: string) => void): void;  // Add toggle listener
  offToggle(callback: Function): void;                  // Remove toggle listener
}
```

## ThemeSelector

A component to select from multiple themes.

```typescript
interface ThemeSelector {
  // Core properties
  availableThemes: Array<Theme>;               // Available themes
  currentThemeId: string;                      // Current theme ID
  showPreview: boolean;                        // Whether to show theme preview
  
  // Core methods
  initialize(themeManager: ThemeManager): void;  // Initialize with theme manager
  render(): HTMLElement;                         // Render the selector component
  setTheme(themeId: string): void;               // Set the theme
  updateAvailableThemes(themes: Array<Theme>): void;  // Update available themes
  
  // Events
  onThemeSelect(callback: (themeId: string) => void): void;  // Add select listener
  offThemeSelect(callback: Function): void;                  // Remove select listener
}
```

## ThemeSettingsPanel

A panel for configuring theme settings.

```typescript
interface ThemeSettingsPanel {
  // Core properties
  themePreferences: ThemePreferences;           // Current theme preferences
  isOpen: boolean;                              // Whether panel is open
  
  // Core methods
  initialize(themeManager: ThemeManager): void;  // Initialize with theme manager
  render(): HTMLElement;                         // Render the settings panel
  open(): void;                                  // Open the panel
  close(): void;                                 // Close the panel
  toggle(): void;                                // Toggle the panel
  
  // Settings methods
  saveSettings(): void;                         // Save settings
  resetSettings(): void;                        // Reset settings to defaults
  
  // Events
  onSettingsChange(callback: (preferences: ThemePreferences) => void): void;  // Add change listener
  offSettingsChange(callback: Function): void;                                // Remove change listener
}
```

## ThemePreview

A component to preview a theme.

```typescript
interface ThemePreview {
  // Core properties
  theme: Theme;                                 // Theme to preview
  previewSize: 'small' | 'medium' | 'large';    // Size of preview
  
  // Core methods
  initialize(theme: Theme): void;               // Initialize with theme
  render(): HTMLElement;                        // Render the preview component
  updateTheme(theme: Theme): void;              // Update theme to preview
}
```

## SystemPreferenceToggle

A toggle for enabling/disabling system preference detection.

```typescript
interface SystemPreferenceToggle {
  // Core properties
  isEnabled: boolean;                           // Whether detection is enabled
  toggleLabel: string;                          // Accessible label for toggle
  
  // Core methods
  initialize(themeManager: ThemeManager): void;  // Initialize with theme manager
  render(): HTMLElement;                         // Render the toggle component
  toggle(): void;                                // Toggle detection
  updateState(isEnabled: boolean): void;         // Update toggle state
  
  // Events
  onToggle(callback: (isEnabled: boolean) => void): void;  // Add toggle listener
  offToggle(callback: Function): void;                     // Remove toggle listener
}
```

## ReducedMotionToggle

A toggle for enabling/disabling reduced motion.

```typescript
interface ReducedMotionToggle {
  // Core properties
  isEnabled: boolean;                           // Whether reduced motion is enabled
  toggleLabel: string;                          // Accessible label for toggle
  
  // Core methods
  initialize(themePreferences: ThemePreferences): void;  // Initialize with preferences
  render(): HTMLElement;                                 // Render the toggle component
  toggle(): void;                                        // Toggle reduced motion
  updateState(isEnabled: boolean): void;                 // Update toggle state
  
  // Events
  onToggle(callback: (isEnabled: boolean) => void): void;  // Add toggle listener
  offToggle(callback: Function): void;                     // Remove toggle listener
}
```

## AnimationSettingsControl

A control for adjusting animation settings.

```typescript
interface AnimationSettingsControl {
  // Core properties
  enableAnimations: boolean;                     // Whether animations are enabled
  transitionSpeed: number;                       // Transition speed in ms
  
  // Core methods
  initialize(themePreferences: ThemePreferences): void;  // Initialize with preferences
  render(): HTMLElement;                                 // Render the control component
  setEnableAnimations(enabled: boolean): void;           // Enable/disable animations
  setTransitionSpeed(speed: number): void;               // Set transition speed
  
  // Events
  onSettingsChange(callback: (settings: {enableAnimations: boolean, transitionSpeed: number}) => void): void;  // Add change listener
  offSettingsChange(callback: Function): void;                                                                 // Remove change listener
}
```

## ThemeCustomizer

A component for customizing and creating themes.

```typescript
interface ThemeCustomizer {
  // Core properties
  baseTheme: Theme;                             // Base theme for customization
  customizedTheme: Theme;                       // Currently customized theme
  
  // Core methods
  initialize(themeManager: ThemeManager): void;  // Initialize with theme manager
  render(): HTMLElement;                         // Render the customizer component
  setBaseTheme(themeId: string): void;           // Set base theme
  updateColor(colorKey: string, value: string): void;  // Update a color value
  updateFont(fontKey: string, value: string): void;    // Update a font value
  saveTheme(name: string): void;                 // Save customized theme
  resetCustomization(): void;                    // Reset customization
  
  // Preview methods
  getPreview(): HTMLElement;                     // Get preview of customized theme
  applyPreview(): void;                          // Apply preview temporarily
  cancelPreview(): void;                         // Cancel preview
  
  // Events
  onThemeChange(callback: (theme: Theme) => void): void;  // Add change listener
  offThemeChange(callback: Function): void;               // Remove change listener
  onThemeSave(callback: (theme: Theme) => void): void;    // Add save listener
  offThemeSave(callback: Function): void;                 // Remove save listener
}
```
