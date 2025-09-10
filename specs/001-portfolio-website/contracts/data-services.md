# API Contract: Data Services

This document defines the interface contracts for data services in the portfolio website.

## DataLoader

Responsible for loading JSON data files.

```typescript
interface DataLoader {
  // Methods
  loadProfile(): Promise<ProfileData>;            // Load profile data
  loadExperience(): Promise<ExperienceData[]>;    // Load experience data
  loadProjects(): Promise<ProjectData[]>;         // Load project data
  loadSkills(): Promise<SkillsData>;              // Load skills data
  loadEducation(): Promise<EducationData[]>;      // Load education data
  loadAwards(): Promise<AwardData[]>;             // Load awards data
  loadLanguages(): Promise<LanguageData[]>;       // Load language data
  loadContactForm(): Promise<ContactFormData>;    // Load contact form config
  loadAll(): Promise<PortfolioData>;              // Load all data at once
  
  // Cache management
  clearCache(): void;                           // Clear data cache
  isCacheValid(): boolean;                      // Check if cache is valid
  getCacheAge(): number;                        // Get cache age in seconds
}
```

## LocalStorageService

Handles browser local storage operations.

```typescript
interface LocalStorageService {
  // Methods
  get<T>(key: string, defaultValue?: T): T;     // Get value by key
  set<T>(key: string, value: T): void;          // Set value for key
  remove(key: string): void;                    // Remove key-value pair
  clear(): void;                                // Clear all storage
  hasKey(key: string): boolean;                 // Check if key exists
  getKeys(): string[];                          // Get all keys
  getSize(): number;                            // Get storage size in bytes
}
```

## ThemeService

Manages theme preferences and application.

```typescript
interface ThemeService {
  // Properties
  currentTheme: 'light' | 'dark' | 'system';  // Current theme
  
  // Methods
  setTheme(theme: 'light' | 'dark' | 'system'): void;  // Set theme
  getTheme(): 'light' | 'dark' | 'system';             // Get current theme
  applyTheme(): void;                                  // Apply current theme
  detectSystemPreference(): 'light' | 'dark';          // Get system preference
  
  // Events listeners
  onThemeChange(callback: (theme: 'light' | 'dark') => void): void;  // Add theme change listener
  removeThemeChangeListener(callback: Function): void;               // Remove listener
}
```

## AnalyticsService

Handles anonymous usage analytics.

```typescript
interface AnalyticsService {
  // Methods
  initialize(options: {
    enabled: boolean;       // Analytics enabled
    anonymize: boolean;     // Anonymize IP
  }): void;
  
  trackPageView(path: string): void;              // Track page view
  trackEvent(category: string, action: string, label?: string, value?: number): void;  // Track event
  trackTiming(category: string, variable: string, time: number): void;  // Track timing
  setEnabled(enabled: boolean): void;             // Enable/disable tracking
  isEnabled(): boolean;                           // Check if enabled
}
```

## FormSubmissionService

Handles contact form submission.

```typescript
interface FormSubmissionService {
  // Methods
  submit(formData: {
    name: string;
    email: string;
    subject: string;
    message: string;
    [key: string]: any;     // Additional fields
  }): Promise<{
    success: boolean;       // Submission successful
    message: string;        // Response message
  }>;
  
  validate(formData: any): {
    valid: boolean;         // Is form valid
    errors: {               // Validation errors
      [field: string]: string;  // Field-specific errors
    };
  };
}
```

## AnimationFactory

Creates and manages animation instances.

```typescript
interface AnimationFactory {
  // Methods
  createTextAnimation(element: HTMLElement | string, options?: any): Animation;  // Create text animation
  createMotionAnimation(element: HTMLElement | string, options?: any): Animation;  // Create motion animation
  createTimelineAnimation(elements: (HTMLElement | string)[], options?: any): Animation;  // Create timeline
  createParticleAnimation(container: HTMLElement | string, options?: any): Animation;  // Create particles
  
  // Animation interface
  interface Animation {
    play(): Promise<void>;              // Play animation
    pause(): void;                      // Pause animation
    restart(): void;                    // Restart animation
    seek(position: number): void;       // Seek to position
    reverse(): void;                    // Play in reverse
    destroy(): void;                    // Clean up resources
    onComplete(callback: Function): void;  // Set completion callback
  }
}
```

## ResponsiveImageLoader

Handles responsive image loading and optimization.

```typescript
interface ResponsiveImageLoader {
  // Methods
  loadImage(src: string, options?: {
    sizes?: string;         // Sizes attribute
    lazy?: boolean;         // Use lazy loading
    placeholder?: boolean;  // Generate placeholder
  }): HTMLImageElement;
  
  getOptimizedSrc(src: string, width: number, format?: 'webp' | 'jpeg' | 'png'): string;  // Get optimized URL
  preloadImages(srcs: string[]): void;             // Preload multiple images
  getLqip(src: string): Promise<string>;           // Get low-quality placeholder
}
```

## ScrollService

Manages scroll-based events and animations.

```typescript
interface ScrollService {
  // Methods
  scrollTo(target: HTMLElement | string, options?: {
    offset?: number;        // Offset from target
    duration?: number;      // Animation duration
    easing?: string;        // Easing function
  }): Promise<void>;
  
  onScroll(callback: (position: number) => void): void;  // Add scroll listener
  removeScrollListener(callback: Function): void;        // Remove scroll listener
  getScrollPosition(): number;                           // Get current scroll position
  isElementInView(element: HTMLElement | string, offset?: number): boolean;  // Check if in viewport
  
  // Events
  // 'scroll:start' - Fired when scroll animation starts
  // 'scroll:complete' - Fired when scroll animation completes
}
```

## PerformanceMonitor

Monitors and reports on website performance.

```typescript
interface PerformanceMonitor {
  // Methods
  initialize(): void;                             // Initialize monitoring
  getMetrics(): {
    fcp: number;            // First Contentful Paint (ms)
    lcp: number;            // Largest Contentful Paint (ms)
    fid: number;            // First Input Delay (ms)
    cls: number;            // Cumulative Layout Shift
    ttfb: number;           // Time to First Byte (ms)
  };
  
  onPerformanceIssue(callback: (metric: string, value: number) => void): void;  // Performance alert
  getResourceTiming(): ResourceTiming[];          // Get resource timing data
  
  // Resource timing interface
  interface ResourceTiming {
    name: string;           // Resource URL
    entryType: string;      // Entry type
    startTime: number;      // Start time
    duration: number;       // Duration
    transferSize: number;   // Transfer size in bytes
  }
}
```

## ResumePDFGenerator

Generates downloadable resume PDF.

```typescript
interface ResumePDFGenerator {
  // Methods
  generatePDF(options?: {
    sections?: string[];     // Sections to include
    theme?: 'light' | 'dark';  // Color theme
    format?: 'A4' | 'Letter';  // Paper format
  }): Promise<Blob>;
  
  getDownloadURL(): string;                     // Get pre-generated PDF URL
  getLastGeneratedDate(): Date | null;          // Get generation timestamp
}
```
