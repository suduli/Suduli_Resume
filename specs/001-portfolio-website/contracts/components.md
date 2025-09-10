# Component Contract: Core Components

This document defines the interface contracts for core components in the portfolio website.

## BaseComponent

The abstract base component from which all other components will inherit.

```typescript
interface BaseComponent {
  // Core methods
  initialize(): void;                 // Initialize the component and bind events
  render(): HTMLElement;              // Render the component's HTML
  destroy(): void;                    // Clean up resources and event listeners
  
  // Event handling
  on(event: string, callback: Function): void;  // Register an event listener
  off(event: string, callback: Function): void; // Remove an event listener
  trigger(event: string, data?: any): void;     // Trigger an event
  
  // Utility methods
  isVisible(): boolean;               // Check if component is in viewport
  hide(): void;                       // Hide the component
  show(): void;                       // Show the component
  update(data: any): void;            // Update component with new data
}
```

## NavigationComponent

Controls site navigation and menu functionality.

```typescript
interface NavigationComponent extends BaseComponent {
  // Properties
  items: Array<{
    id: string;            // Section ID
    label: string;         // Display name
    url: string;           // Target URL or anchor
    isActive: boolean;     // Currently active
  }>;
  
  // Methods
  setActive(id: string): void;         // Set active menu item
  scrollTo(id: string): void;          // Scroll to section
  toggleMobileMenu(): void;            // Toggle mobile menu visibility
  
  // Events
  // 'navigation:changed' - Fired when active section changes
  // 'navigation:clicked' - Fired when navigation item clicked
}
```

## HeroComponent

The main landing section with personal introduction.

```typescript
interface HeroComponent extends BaseComponent {
  // Properties
  profile: {
    name: string;          // Full name
    title: string;         // Professional title
    tagline: string;       // Short description
    ctaText: string;       // Call-to-action text
    ctaUrl: string;        // Call-to-action URL
  };
  
  // Methods
  startAnimation(): void;               // Start intro animation
  stopAnimation(): void;                // Stop animations
  setReducedMotion(enabled: boolean): void; // Set reduced motion preference
  
  // Events
  // 'hero:animated' - Fired when intro animation completes
  // 'hero:cta-clicked' - Fired when CTA button clicked
}
```

## ParticleBackgroundComponent

Controls the animated particle background.

```typescript
interface ParticleBackgroundComponent extends BaseComponent {
  // Properties
  options: {
    particleCount: number;    // Number of particles
    color: string | string[]; // Particle color(s)
    speed: number;            // Movement speed
    opacity: number;          // Particle opacity
    responsive: Array<{       // Responsive settings
      breakpoint: number;     // Screen width breakpoint
      options: Partial<ParticleOptions>; // Override options
    }>;
  };
  
  // Methods
  start(): void;                        // Start animation
  stop(): void;                         // Pause animation
  resize(): void;                       // Handle window resize
  setDensity(density: number): void;    // Change particle density
  setReducedMotion(enabled: boolean): void; // Set reduced motion
  
  // Events
  // 'particles:initialized' - Fired when particles initialized
  // 'particles:error' - Fired if initialization fails
}
```

## ExperienceTimelineComponent

Displays professional experience as an interactive timeline.

```typescript
interface ExperienceTimelineComponent extends BaseComponent {
  // Properties
  experiences: Array<{
    id: string;            // Unique identifier
    company: string;       // Company name
    position: string;      // Job title
    startDate: string;     // Start date (YYYY-MM-DD)
    endDate: string;       // End date (YYYY-MM-DD) or "present"
    description: string;   // Job description
    highlights: string[];  // Key achievements
    expanded: boolean;     // Currently expanded
  }>;
  
  // Methods
  expandItem(id: string): void;         // Expand single item
  collapseItem(id: string): void;       // Collapse single item
  expandAll(): void;                    // Expand all items
  collapseAll(): void;                  // Collapse all items
  filter(criteria: string): void;       // Filter by search term
  
  // Events
  // 'timeline:item-expanded' - Fired when item expanded
  // 'timeline:item-collapsed' - Fired when item collapsed
}
```

## SkillsComponent

Displays skills organized by category with visual proficiency indicators.

```typescript
interface SkillsComponent extends BaseComponent {
  // Properties
  categories: Array<{
    name: string;          // Category name
    visible: boolean;      // Currently visible
    skills: Array<{
      name: string;        // Skill name
      level: number;       // Proficiency (0-100)
      yearsExperience: number; // Years of experience
    }>;
  }>;
  
  // Methods
  filterByCategory(category: string): void;  // Show single category
  showAllCategories(): void;                 // Show all categories
  sortBy(criteria: 'name' | 'level' | 'experience'): void; // Sort skills
  animateSkills(): void;                     // Animate skill bars
  
  // Events
  // 'skills:category-changed' - Fired when category filter changes
  // 'skills:animation-complete' - Fired when skill animation completes
}
```

## ProjectsComponent

Displays portfolio projects with interactive cards.

```typescript
interface ProjectsComponent extends BaseComponent {
  // Properties
  projects: Array<{
    id: string;            // Unique identifier
    title: string;         // Project title
    description: string;   // Project description
    technologies: string[]; // Technologies used
    image: string;         // Project image URL
    links: Array<{         // Associated links
      type: string;        // Link type (e.g., "demo", "github")
      url: string;         // URL
      label: string;       // Display text
    }>;
  }>;
  
  // Methods
  filterByTechnology(tech: string): void;    // Filter by technology
  showAllProjects(): void;                   // Show all projects
  expandDetails(id: string): void;           // Show project details
  closeDetails(): void;                      // Close project details
  
  // Events
  // 'projects:filtered' - Fired when projects are filtered
  // 'projects:details-opened' - Fired when project details opened
}
```

## ContactFormComponent

Handles the contact form display and submission.

```typescript
interface ContactFormComponent extends BaseComponent {
  // Properties
  formFields: Array<{
    id: string;            // Field ID
    type: string;          // Input type
    label: string;         // Display label
    placeholder: string;   // Placeholder text
    required: boolean;     // Is required
    validation: string;    // Regex validation pattern
    value: string;         // Current value
    error: string;         // Error message if invalid
  }>;
  
  // Methods
  validate(): boolean;                   // Validate all fields
  validateField(id: string): boolean;    // Validate single field
  submit(): Promise<boolean>;            // Submit form
  reset(): void;                         // Reset form
  setSubmitting(isSubmitting: boolean): void; // Update submit button state
  
  // Events
  // 'form:validation-error' - Fired on validation failure
  // 'form:submit-start' - Fired when submission starts
  // 'form:submit-success' - Fired on successful submission
  // 'form:submit-error' - Fired on submission error
}
```

## AnimationController

Controls and coordinates animations across components.

```typescript
interface AnimationController {
  // Properties
  animations: Map<string, any>;  // Animation instances by ID
  
  // Methods
  register(id: string, animation: any): void; // Register animation
  play(id: string, options?: any): Promise<void>; // Play animation
  pause(id: string): void;                    // Pause animation
  stop(id: string): void;                     // Stop animation
  playAll(): void;                            // Play all animations
  pauseAll(): void;                           // Pause all animations
  setReducedMotion(enabled: boolean): void;   // Set reduced motion preference
  
  // Events
  // 'animation:complete' - Fired when animation completes
  // 'animation:error' - Fired if animation fails
}
```

## ScrollRevealComponent

Controls element reveal animations on scroll.

```typescript
interface ScrollRevealComponent {
  // Properties
  options: {
    delay: number;         // Delay before animation (ms)
    duration: number;      // Animation duration (ms)
    easing: string;        // Easing function
    distance: string;      // Move distance (e.g., "20px")
    opacity: number;       // Starting opacity
    scale: number;         // Starting scale
    reset: boolean;        // Reset animation when scrolled out
  };
  
  // Methods
  reveal(element: HTMLElement | string, customOptions?: any): void; // Reveal element
  sync(): void;                          // Recalculate all elements
  destroy(): void;                       // Clean up
  
  // Events
  // 'reveal:complete' - Fired when element revealed
}
```

## DarkModeToggleComponent

Controls theme switching between light, dark, and other theme modes.

```typescript
interface ThemeManagerComponent extends BaseComponent {
  // Properties
  currentTheme: string;     // Current theme ID
  availableThemes: string[];  // List of available theme IDs
  systemPreference: 'light' | 'dark' | null;  // System color scheme preference
  
  // Methods
  toggle(): void;                        // Toggle between light and dark modes
  setTheme(themeId: string): void;       // Set specific theme by ID
  detectSystemPreference(): void;        // Detect system preference
  enableSystemPreferenceDetection(): void;  // Enable auto-detection
  disableSystemPreferenceDetection(): void; // Disable auto-detection
  getThemeData(themeId: string): any;    // Get theme configuration
  applyTheme(themeId: string): void;     // Apply theme to document
  
  // Events
  // 'theme:changed' - Fired when theme changes
  // 'theme:system-preference-changed' - Fired when system preference changes
}
```

## ResponsiveHandler

Manages responsive behavior across components.

```typescript
interface ResponsiveHandler {
  // Properties
  breakpoints: {
    xs: number;            // Extra small breakpoint
    sm: number;            // Small breakpoint
    md: number;            // Medium breakpoint
    lg: number;            // Large breakpoint
    xl: number;            // Extra large breakpoint
  };
  
  // Methods
  getCurrentBreakpoint(): string;         // Get current breakpoint name
  addBreakpointListener(callback: Function): void; // Add breakpoint change listener
  removeBreakpointListener(callback: Function): void; // Remove listener
  isMobile(): boolean;                    // Check if mobile viewport
  isTablet(): boolean;                    // Check if tablet viewport
  isDesktop(): boolean;                   // Check if desktop viewport
  
  // Events
  // 'breakpoint:changed' - Fired when breakpoint changes
}
```
