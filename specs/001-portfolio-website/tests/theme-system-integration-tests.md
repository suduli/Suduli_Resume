# Theme System Integration Tests

This document outlines the test scenarios for verifying the theme system's functionality, including theme switching, system preference detection, animation adaptation, and accessibility features.

## Test Scenarios

### 1. Theme Initialization

#### 1.1 Default Theme Loading
**Objective**: Verify that the theme system initializes with the correct default theme.
**Steps**:
1. Clear local storage of any theme preferences
2. Load the application
3. Observe the initial theme

**Expected Result**: Application loads with the light theme (default) or system preference if enabled.

#### 1.2 Saved Theme Loading
**Objective**: Verify that the theme system loads the saved theme preference.
**Steps**:
1. Set a theme preference in local storage
2. Load the application
3. Observe the initial theme

**Expected Result**: Application loads with the saved theme preference.

#### 1.3 System Preference Loading
**Objective**: Verify that the theme system respects system preference when enabled.
**Steps**:
1. Enable system preference detection in local storage
2. Set system preference to dark mode
3. Load the application
4. Observe the initial theme

**Expected Result**: Application loads with dark theme, matching system preference.

### 2. Theme Switching

#### 2.1 Manual Theme Toggle
**Objective**: Verify that the theme toggle correctly switches between themes.
**Steps**:
1. Load the application with light theme
2. Click the theme toggle button
3. Observe the theme change
4. Click the toggle again
5. Observe the theme change back

**Expected Result**: Theme toggles between light and dark with smooth transition.

#### 2.2 Theme Persistence
**Objective**: Verify that the manually selected theme persists across page reloads.
**Steps**:
1. Load the application
2. Toggle to a different theme
3. Reload the page
4. Observe the theme

**Expected Result**: Selected theme persists after page reload.

#### 2.3 System Preference Override
**Objective**: Verify that manual theme selection overrides system preference.
**Steps**:
1. Enable system preference detection
2. Manually toggle the theme
3. Observe the system preference detection state

**Expected Result**: System preference detection is disabled after manual theme change.

### 3. System Preference Detection

#### 3.1 System Preference Change
**Objective**: Verify that the theme updates when system preference changes.
**Steps**:
1. Enable system preference detection
2. Change system color scheme preference
3. Observe the theme

**Expected Result**: Theme updates to match new system preference.

#### 3.2 System Preference Toggle
**Objective**: Verify that the system preference toggle enables/disables auto-detection.
**Steps**:
1. Disable system preference detection
2. Click the system preference toggle
3. Change system color scheme preference
4. Observe the theme
5. Click the system preference toggle again
6. Change system color scheme preference
7. Observe the theme

**Expected Result**: Theme follows system preference when enabled, ignores it when disabled.

### 4. Animation Adaptation

#### 4.1 Particle Animation Adaptation
**Objective**: Verify that particle animations adapt to theme changes.
**Steps**:
1. Load the application with particles.js active
2. Observe particle color and density in light theme
3. Switch to dark theme
4. Observe particle color and density changes

**Expected Result**: Particles adapt color and density based on theme.

#### 4.2 3D Animation Adaptation
**Objective**: Verify that 3D animations adapt to theme changes.
**Steps**:
1. Navigate to a section with Three.js animations
2. Observe lighting and materials in light theme
3. Switch to dark theme
4. Observe lighting and material changes

**Expected Result**: 3D scene adapts lighting and materials based on theme.

#### 4.3 Text Effect Adaptation
**Objective**: Verify that text effects adapt to theme changes.
**Steps**:
1. Navigate to a section with animated text effects
2. Observe text effects in light theme
3. Switch to dark theme
4. Observe text effect changes

**Expected Result**: Text effects adapt to maintain readability in both themes.

### 5. Accessibility Features

#### 5.1 Reduced Motion Detection
**Objective**: Verify that the site respects the reduced motion preference.
**Steps**:
1. Enable "prefers-reduced-motion: reduce" in browser/OS
2. Load the application
3. Observe animations and transitions

**Expected Result**: Animations and transitions are minimized or disabled.

#### 5.2 Reduced Motion Toggle
**Objective**: Verify that the reduced motion toggle works correctly.
**Steps**:
1. Disable reduced motion preference in browser
2. Load the application
3. Click the reduced motion toggle
4. Observe animations and transitions

**Expected Result**: Animations and transitions are minimized or disabled when toggled on.

#### 5.3 Keyboard Accessibility
**Objective**: Verify that theme controls are keyboard accessible.
**Steps**:
1. Load the application
2. Tab to the theme toggle
3. Press Enter or Space
4. Observe theme change
5. Tab to system preference toggle
6. Press Enter or Space
7. Observe system preference detection state change

**Expected Result**: All theme controls are operable with keyboard.

#### 5.4 Focus Visibility
**Objective**: Verify that focus indicators are visible in all themes.
**Steps**:
1. Load the application with light theme
2. Tab through interactive elements
3. Observe focus indicators
4. Switch to dark theme
5. Tab through interactive elements again
6. Observe focus indicators

**Expected Result**: Focus indicators are clearly visible in both themes.

### 6. Performance

#### 6.1 Theme Switching Performance
**Objective**: Verify that theme switching is performant.
**Steps**:
1. Open browser developer tools performance tab
2. Start recording
3. Toggle theme
4. Stop recording
5. Analyze performance metrics

**Expected Result**: Theme switch completes in under 100ms with no jank.

#### 6.2 Initial Load Flash Prevention
**Objective**: Verify that there is no flash of wrong theme on initial load.
**Steps**:
1. Set a theme preference different from system preference
2. Clear browser cache
3. Load the application with network throttling enabled
4. Observe the initial render

**Expected Result**: No flash of wrong theme during page load.

## Test Matrix

| Test ID | Chrome | Firefox | Safari | Edge | Mobile Chrome | Mobile Safari |
|---------|--------|---------|--------|------|---------------|---------------|
| 1.1     |        |         |        |      |               |               |
| 1.2     |        |         |        |      |               |               |
| 1.3     |        |         |        |      |               |               |
| 2.1     |        |         |        |      |               |               |
| 2.2     |        |         |        |      |               |               |
| 2.3     |        |         |        |      |               |               |
| 3.1     |        |         |        |      |               |               |
| 3.2     |        |         |        |      |               |               |
| 4.1     |        |         |        |      |               |               |
| 4.2     |        |         |        |      |               |               |
| 4.3     |        |         |        |      |               |               |
| 5.1     |        |         |        |      |               |               |
| 5.2     |        |         |        |      |               |               |
| 5.3     |        |         |        |      |               |               |
| 5.4     |        |         |        |      |               |               |
| 6.1     |        |         |        |      |               |               |
| 6.2     |        |         |        |      |               |               |

## Automated Test Examples

```javascript
// Jest test example for ThemeManager
describe('ThemeManager', () => {
  let themeManager;
  
  beforeEach(() => {
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true
    });
    
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
      writable: true
    });
    
    // Create new ThemeManager for each test
    themeManager = new ThemeManager();
    
    // Mock document methods
    document.documentElement.setAttribute = jest.fn();
    document.documentElement.getAttribute = jest.fn().mockReturnValue('light');
    document.documentElement.classList.add = jest.fn();
    document.documentElement.classList.remove = jest.fn();
  });
  
  test('initializes with default theme when no preference is saved', () => {
    window.localStorage.getItem.mockReturnValue(null);
    themeManager.initialize();
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'light');
  });
  
  test('initializes with saved theme when preference exists', () => {
    window.localStorage.getItem.mockImplementation((key) => {
      if (key === 'portfolio-theme-preference') return 'dark';
      if (key === 'portfolio-use-system-preference') return 'false';
      return null;
    });
    themeManager.initialize();
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
  });
  
  test('toggles theme correctly', () => {
    document.documentElement.getAttribute.mockReturnValue('light');
    const newTheme = themeManager.toggleTheme();
    expect(newTheme).toBe('dark');
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
  });
  
  test('saves theme preference when manually set', () => {
    themeManager.applyTheme('dark');
    expect(window.localStorage.setItem).toHaveBeenCalledWith('portfolio-theme-preference', 'dark');
  });
  
  test('applies system preference when enabled', () => {
    window.matchMedia.mockImplementation(() => ({
      matches: true,
      media: '(prefers-color-scheme: dark)',
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    }));
    
    themeManager.enableSystemPreference();
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
    expect(window.localStorage.setItem).toHaveBeenCalledWith('portfolio-use-system-preference', true);
  });
});

// Cypress test example for theme switching
describe('Theme Switching', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  
  it('should toggle theme when clicking the theme toggle', () => {
    // Check initial theme
    cy.get('html').should('have.attr', 'data-theme', 'light');
    
    // Click toggle
    cy.get('.theme-toggle').click();
    
    // Check new theme
    cy.get('html').should('have.attr', 'data-theme', 'dark');
    
    // Click toggle again
    cy.get('.theme-toggle').click();
    
    // Check theme switched back
    cy.get('html').should('have.attr', 'data-theme', 'light');
  });
  
  it('should persist theme selection after reload', () => {
    // Switch to dark theme
    cy.get('.theme-toggle').click();
    cy.get('html').should('have.attr', 'data-theme', 'dark');
    
    // Reload page
    cy.reload();
    
    // Check theme is still dark
    cy.get('html').should('have.attr', 'data-theme', 'dark');
  });
  
  it('should make theme controls keyboard accessible', () => {
    // Focus on theme toggle with tab
    cy.get('body').tab();
    
    // Theme toggle should be focused
    cy.get('.theme-toggle').should('have.focus');
    
    // Activate with keyboard
    cy.get('.theme-toggle').type('{enter}');
    
    // Check theme switched
    cy.get('html').should('have.attr', 'data-theme', 'dark');
    
    // Press space on system preference toggle
    cy.get('.system-preference-toggle').focus().type(' ');
    
    // Check system preference is enabled
    cy.get('.system-preference-toggle').should('have.class', 'enabled');
  });
});
```
