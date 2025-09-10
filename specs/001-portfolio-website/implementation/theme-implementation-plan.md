# Theme Implementation Plan

## Overview

This document outlines the implementation plan for the theme system in the portfolio website. The theme system will support light and dark modes with system preference detection, smooth transitions, and accessibility features.

## Components to Build

1. **ThemeManager** - Core controller for managing themes
2. **ThemeToggle** - UI component for toggling between themes
3. **SystemPreferenceDetector** - Utility for detecting system theme preference
4. **ThemeStylesManager** - Utility for applying theme styles to the DOM
5. **ThemeAnimationAdapter** - Utility for adapting animations to theme changes
6. **ThemeAccessibility** - Utility for handling accessibility features
7. **ThemeStorage** - Utility for storing theme preferences

## Implementation Steps

### Step 1: Set Up CSS Variable Structure

1. Create a base stylesheet with CSS variables for both light and dark themes
2. Define variables for:
   - Color palette (primary, secondary, accent)
   - Background and surface colors
   - Text colors
   - Border and shadow colors
   - Animation-specific colors
   - Typography settings
3. Group variables logically by function and theme

### Step 2: Implement Core ThemeManager

1. Create a ThemeManager class that:
   - Initializes with available themes
   - Detects system preference
   - Loads saved preferences
   - Provides methods to get/set themes
   - Handles theme transitions
   - Implements event system for theme changes

2. Implement system preference detection:
   - Use `prefers-color-scheme` media query
   - Add listener for system preference changes
   - Provide toggle for enabling/disabling auto-detection

3. Implement theme storage:
   - Store preferences in localStorage
   - Handle fallback for private browsing

### Step 3: Create UI Components

1. Build ThemeToggle component:
   - Create toggle button with accessible markup
   - Add visual indicators for current theme
   - Implement smooth state transitions
   - Add keyboard accessibility

2. Build SystemPreferenceToggle component:
   - Create toggle for automatic theme switching
   - Add visual indicators for enabled/disabled state
   - Connect to ThemeManager

3. Build ReducedMotionToggle component:
   - Create toggle for reduced motion preference
   - Add visual indicators for enabled/disabled state
   - Connect to ThemeManager

### Step 4: Implement Animation Adaptation

1. Create ThemeAnimationAdapter:
   - Define methods for updating animation parameters
   - Create adapters for each animation library:
     - particles.js adapter
     - Three.js adapter
     - GSAP adapter
     - anime.js adapter
   - Listen for theme changes to update animations

2. Implement specific adaptations:
   - Adjust particle colors and density
   - Modify 3D lighting and materials
   - Update animation timing and easing
   - Adjust glow and effect parameters

### Step 5: Implement Accessibility Features

1. Create ThemeAccessibility utility:
   - Detect and respond to reduced motion preference
   - Ensure all theme controls are keyboard accessible
   - Provide appropriate ARIA attributes
   - Implement focus styles that work across themes

2. Add CSS for reduced motion:
   - Create styles that respect `prefers-reduced-motion`
   - Implement class-based alternative for manual control
   - Ensure all animations can be disabled

### Step 6: Cross-Component Integration

1. Implement event system:
   - Create custom events for theme changes
   - Create events for preference changes
   - Ensure components respond to relevant events

2. Create theme initialization sequence:
   - Set up appropriate load order
   - Handle initial theme application before page render
   - Prevent flash of wrong theme

## Testing Checklist

1. **Theme Switching**
   - [ ] Theme toggles correctly between light and dark
   - [ ] Transitions are smooth and performant
   - [ ] Theme persists across page loads
   - [ ] No flash of wrong theme on initial load

2. **System Preference**
   - [ ] System preference is correctly detected
   - [ ] Theme updates when system preference changes
   - [ ] Toggle for enabling/disabling works correctly
   - [ ] Preference for auto-detection persists

3. **Animations**
   - [ ] Animations adapt to theme changes
   - [ ] Particles adapt color and density
   - [ ] 3D effects adapt lighting and materials
   - [ ] Text effects adapt to maintain readability

4. **Accessibility**
   - [ ] Reduced motion preference is respected
   - [ ] Toggle controls are keyboard accessible
   - [ ] Proper ARIA attributes are present
   - [ ] Focus styles are visible in all themes

5. **Performance**
   - [ ] Theme switching is performant (under 100ms)
   - [ ] No layout shifts during theme changes
   - [ ] Animation adaptations don't cause jank
   - [ ] Storage operations don't block main thread

## Timeline

1. **Days 1-2**: CSS Variables and ThemeManager
2. **Days 3-4**: UI Components and Storage
3. **Days 5-6**: Animation Adaptation
4. **Day 7**: Accessibility and Integration
5. **Day 8**: Testing and Refinement

## Dependencies

- anime.js
- particles.js
- Three.js
- GSAP
- scrollreveal.js

## Future Enhancements

1. **Custom Theme Creation**
   - Allow users to create and save custom themes
   - Provide UI for adjusting theme parameters
   - Add export/import functionality

2. **Theme Scheduling**
   - Add option to schedule theme changes
   - Implement sunset/sunrise theme switching
   - Add time-based themes (morning, afternoon, evening)

3. **Enhanced Animations**
   - Create more sophisticated theme-specific animations
   - Add theme transition animations
   - Implement theme-specific particle behaviors
