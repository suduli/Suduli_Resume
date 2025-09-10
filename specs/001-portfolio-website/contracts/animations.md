# Animation Contract: Animation Controllers

This document defines the interface contracts for animation controllers in the portfolio website.

## AnimationController

Core controller for managing all animations across the website.

```typescript
interface AnimationController {
  // Core methods
  initialize(): void;                     // Initialize the controller
  register(name: string, animation: Animation): void;  // Register an animation
  unregister(name: string): void;         // Remove an animation
  getAnimation(name: string): Animation | null;  // Get animation by name
  
  // Animation control
  play(name: string, options?: any): Promise<void>;  // Play named animation
  pause(name: string): void;              // Pause named animation
  stop(name: string): void;               // Stop named animation
  restart(name: string): void;            // Restart named animation
  playAll(): Promise<void>;               // Play all animations
  pauseAll(): void;                       // Pause all animations
  stopAll(): void;                        // Stop all animations
  
  // Settings
  setReducedMotion(enabled: boolean): void;  // Set reduced motion preference
  getReducedMotion(): boolean;            // Get reduced motion state
  
  // Events
  on(event: string, callback: Function): void;  // Add event listener
  off(event: string, callback: Function): void; // Remove event listener
  trigger(event: string, data?: any): void;     // Trigger event
}
```

## TextAnimationController

Controls text-based animations using anime.js.

```typescript
interface TextAnimationController {
  // Text animation types
  createTypewriter(element: HTMLElement | string, options?: {
    text?: string;           // Text to type (defaults to element content)
    speed?: number;          // Characters per second
    delay?: number;          // Start delay in ms
    cursor?: boolean;        // Show cursor
    loop?: boolean;          // Loop animation
    loopDelay?: number;      // Delay between loops
  }): Animation;
  
  createTextReveal(element: HTMLElement | string, options?: {
    direction?: 'lr' | 'rl' | 'tb' | 'bt';  // Reveal direction
    duration?: number;       // Duration in ms
    stagger?: number;        // Stagger delay in ms
    easing?: string;         // Easing function
  }): Animation;
  
  createCharacterFade(element: HTMLElement | string, options?: {
    duration?: number;       // Duration in ms
    stagger?: number;        // Stagger delay in ms
    easing?: string;         // Easing function
    from?: { opacity: number, translateY: string };  // Start values
    to?: { opacity: number, translateY: string };    // End values
  }): Animation;
  
  createTextScramble(element: HTMLElement | string, options?: {
    duration?: number;       // Duration in ms
    characters?: string;     // Character set to use
    text?: string;           // Target text (defaults to element content)
  }): Animation;
  
  // Character manipulation
  splitText(element: HTMLElement | string, type: 'chars' | 'words' | 'lines'): HTMLElement[];  // Split text
  wrapCharacters(element: HTMLElement | string, className?: string): HTMLElement[];  // Wrap characters
}
```

## ParticleAnimationController

Controls particle-based animations using particles.js.

```typescript
interface ParticleAnimationController {
  // Particle configuration
  createParticles(container: HTMLElement | string, options?: {
    particles?: {
      number?: {
        value: number;       // Particle count
        density?: {
          enable: boolean;   // Enable density control
          value_area: number;  // Area per particle
        };
      };
      color?: {
        value: string | string[];  // Particle color(s)
      };
      shape?: {
        type: string | string[];  // Particle shape(s)
        stroke?: {
          width: number;    // Stroke width
          color: string;    // Stroke color
        };
      };
      opacity?: {
        value: number;      // Opacity
        random: boolean;    // Random opacity
        anim?: {
          enable: boolean;  // Animate opacity
          speed: number;    // Animation speed
          opacity_min: number;  // Minimum opacity
          sync: boolean;    // Sync between particles
        };
      };
      size?: {
        value: number;      // Particle size
        random: boolean;    // Random size
        anim?: {
          enable: boolean;  // Animate size
          speed: number;    // Animation speed
          size_min: number; // Minimum size
          sync: boolean;    // Sync between particles
        };
      };
      line_linked?: {
        enable: boolean;    // Enable links
        distance: number;   // Link distance
        color: string;      // Link color
        opacity: number;    // Link opacity
        width: number;      // Link width
      };
      move?: {
        enable: boolean;    // Enable movement
        speed: number;      // Movement speed
        direction: 'none' | 'top' | 'right' | 'bottom' | 'left';  // Direction
        random: boolean;    // Random movement
        straight: boolean;  // Straight movement
        out_mode: 'out' | 'bounce';  // Out of canvas behavior
        bounce: boolean;    // Bounce off edge
      };
    };
    interactivity?: {
      detect_on: 'canvas' | 'window';  // Detection area
      events: {
        onhover?: {
          enable: boolean;  // Enable hover
          mode: string | string[];  // Hover mode
        };
        onclick?: {
          enable: boolean;  // Enable click
          mode: string | string[];  // Click mode
        };
        resize?: boolean;   // Resize handling
      };
      modes?: {
        [mode: string]: any;  // Mode configurations
      };
    };
    retina_detect?: boolean;  // HiDPI display detection
    responsive?: Array<{      // Responsive configurations
      breakpoint: number;     // Screen width breakpoint
      options: any;           // Override options
    }>;
  }): Animation;
  
  // Advanced particle effects
  createConnectedParticles(container: HTMLElement | string, options?: any): Animation;  // Connected particles
  createInteractiveParticles(container: HTMLElement | string, options?: any): Animation;  // Interactive particles
  createParticleText(container: HTMLElement | string, text: string, options?: any): Animation;  // Text from particles
  createParticleImage(container: HTMLElement | string, imageUrl: string, options?: any): Animation;  // Image from particles
  
  // Particle system control
  pauseParticles(container: HTMLElement | string): void;  // Pause particles
  resumeParticles(container: HTMLElement | string): void; // Resume particles
  destroyParticles(container: HTMLElement | string): void;  // Destroy particles
  updateParticles(container: HTMLElement | string, options: any): void;  // Update options
}
```

## ScrollAnimationController

Controls scroll-based animations using ScrollReveal.

```typescript
interface ScrollAnimationController {
  // Element reveal configurations
  revealElement(element: HTMLElement | string, options?: {
    delay?: number;         // Delay before animation (ms)
    duration?: number;      // Animation duration (ms)
    easing?: string;        // Easing function
    distance?: string;      // Move distance (e.g., "20px")
    origin?: 'top' | 'right' | 'bottom' | 'left';  // Move origin
    opacity?: number;       // Starting opacity
    scale?: number;         // Starting scale
    rotate?: { x: number, y: number, z: number };  // Rotation
    cleanup?: boolean;      // Remove styles after animation
    container?: HTMLElement | string;  // Scrollable container
    mobile?: boolean;       // Enable on mobile
    desktop?: boolean;      // Enable on desktop
    reset?: boolean;        // Reset when scrolled out
    useDelay?: 'always' | 'once' | 'onload';  // When to use delay
    viewFactor?: number;    // Portion visible to trigger
    viewOffset?: { top: number, right: number, bottom: number, left: number };  // Offset
  }): Animation;
  
  // Batch reveal configurations
  revealSequence(elements: (HTMLElement | string)[], options?: any): Animation[];  // Reveal in sequence
  revealStaggered(elements: (HTMLElement | string)[], staggerDelay?: number, options?: any): Animation[];  // Staggered reveal
  
  // Scroll position effects
  createParallax(element: HTMLElement | string, options?: {
    speed?: number;         // Parallax speed
    direction?: 'vertical' | 'horizontal';  // Parallax direction
    reverse?: boolean;      // Reverse direction
    maxTranslate?: string;  // Maximum translation
  }): Animation;
  
  createScrollProgress(element: HTMLElement | string, options?: {
    target?: HTMLElement | string;  // Target element (defaults to document)
    property?: 'width' | 'height' | 'scaleX' | 'scaleY';  // Property to animate
    start?: number;         // Start value (0-1)
    end?: number;           // End value (0-1)
  }): Animation;
  
  // System controls
  sync(): void;             // Recalculate all animations
  destroy(): void;          // Clean up all animations
}
```

## MotionAnimationController

Controls motion-based animations using GSAP.

```typescript
interface MotionAnimationController {
  // Basic animations
  createTween(target: HTMLElement | string, duration: number, properties: any, position?: string | number): Animation;  // Create tween
  createFromTo(target: HTMLElement | string, duration: number, fromProps: any, toProps: any, position?: string | number): Animation;  // From/to animation
  
  // Timeline configurations
  createTimeline(options?: {
    paused?: boolean;       // Start paused
    repeat?: number;        // Repeat count (-1 for infinite)
    yoyo?: boolean;         // Reverse on repeat
    defaults?: {            // Default tween parameters
      duration?: number;    // Default duration
      ease?: string;        // Default easing
    };
  }): TimelineAnimation;
  
  // Timeline interface extends Animation
  interface TimelineAnimation extends Animation {
    add(animation: Animation, position?: string | number): TimelineAnimation;  // Add animation
    addLabel(label: string, position?: string | number): TimelineAnimation;  // Add timeline label
    addPause(position?: string | number, callback?: Function): TimelineAnimation;  // Add pause
    call(callback: Function, params?: any[], position?: string | number): TimelineAnimation;  // Add callback
    to(target: HTMLElement | string, duration: number, props: any, position?: string | number): TimelineAnimation;  // Add to tween
    from(target: HTMLElement | string, duration: number, props: any, position?: string | number): TimelineAnimation;  // Add from tween
    fromTo(target: HTMLElement | string, duration: number, fromProps: any, toProps: any, position?: string | number): TimelineAnimation;  // Add fromTo tween
    staggerFrom(targets: HTMLElement[] | string, duration: number, props: any, stagger: number, position?: string | number): TimelineAnimation;  // Staggered from
    staggerTo(targets: HTMLElement[] | string, duration: number, props: any, stagger: number, position?: string | number): TimelineAnimation;  // Staggered to
    staggerFromTo(targets: HTMLElement[] | string, duration: number, fromProps: any, toProps: any, stagger: number, position?: string | number): TimelineAnimation;  // Staggered fromTo
  }
  
  // Advanced effects
  createSplitTextAnimation(element: HTMLElement | string, options?: any): Animation;  // Split text animation
  createMorphSVG(element: HTMLElement | string, target: HTMLElement | string, options?: any): Animation;  // SVG morphing
  createScrollTrigger(trigger: HTMLElement | string, animation: Animation, options?: any): ScrollTrigger;  // Scroll triggered animation
  
  // ScrollTrigger interface
  interface ScrollTrigger {
    refresh(): void;        // Refresh trigger
    kill(): void;           // Kill trigger
    disable(): void;        // Disable trigger
    enable(): void;         // Enable trigger
    update(): void;         // Force update
  }
}
```

## ThreeJSController

Controls 3D animations using Three.js.

```typescript
interface ThreeJSController {
  // Scene setup
  createScene(container: HTMLElement | string, options?: {
    camera?: {
      type?: 'perspective' | 'orthographic';  // Camera type
      fov?: number;         // Field of view (perspective)
      near?: number;        // Near clipping plane
      far?: number;         // Far clipping plane
      position?: { x: number, y: number, z: number };  // Camera position
    };
    renderer?: {
      antialias?: boolean;  // Enable antialiasing
      alpha?: boolean;      // Transparent background
      pixelRatio?: number;  // Pixel ratio
    };
    controls?: {
      enable?: boolean;     // Enable orbit controls
      autoRotate?: boolean; // Auto-rotate camera
      enableZoom?: boolean; // Enable zoom
      enablePan?: boolean;  // Enable panning
    };
    lights?: Array<{
      type: 'ambient' | 'directional' | 'point' | 'spot';  // Light type
      color?: string;       // Light color
      intensity?: number;   // Light intensity
      position?: { x: number, y: number, z: number };  // Light position
    }>;
  }): ThreeJSScene;
  
  // Scene interface
  interface ThreeJSScene extends Animation {
    add(object: any): void; // Add 3D object
    remove(object: any): void;  // Remove 3D object
    getCamera(): any;       // Get camera
    getRenderer(): any;     // Get renderer
    getScene(): any;        // Get scene
    resize(): void;         // Handle resize
    render(): void;         // Render frame
    getControls(): any;     // Get controls
    setBackground(color: string | null, opacity?: number): void;  // Set background
    enableShadows(enabled: boolean): void;  // Enable shadows
    createRaycaster(): any; // Create raycaster
    loadModel(url: string, options?: any): Promise<any>;  // Load 3D model
    createParticleSystem(count: number, options?: any): any;  // Create particles
  }
  
  // 3D object creation
  createGeometry(type: 'box' | 'sphere' | 'cylinder' | 'cone' | 'torus', options?: any): any;  // Create geometry
  createMaterial(type: 'basic' | 'phong' | 'standard', options?: any): any;  // Create material
  createMesh(geometry: any, material: any): any;  // Create mesh
  createText(text: string, options?: any): any;  // Create 3D text
  
  // Animations
  animateProperty(object: any, property: string, to: any, duration: number, options?: any): Animation;  // Animate property
  animateRotation(object: any, rotation: { x?: number, y?: number, z?: number }, duration: number, options?: any): Animation;  // Animate rotation
  animatePosition(object: any, position: { x?: number, y?: number, z?: number }, duration: number, options?: any): Animation;  // Animate position
  animateScale(object: any, scale: { x?: number, y?: number, z?: number }, duration: number, options?: any): Animation;  // Animate scale
}
```

## Animation

Common interface for all animation types.

```typescript
interface Animation {
  // Core methods
  play(): Promise<void>;    // Play animation
  pause(): void;            // Pause animation
  stop(): void;             // Stop animation
  restart(): void;          // Restart animation
  seek(position: number): void;  // Seek to position (0-1)
  reverse(): void;          // Play in reverse
  setSpeed(speed: number): void;  // Set playback speed
  
  // Configuration
  setDelay(delay: number): void;  // Set start delay
  setDuration(duration: number): void;  // Set duration
  setEasing(easing: string): void;  // Set easing function
  setLoop(loop: boolean): void;  // Set loop state
  
  // State
  isPlaying(): boolean;     // Check if playing
  isPaused(): boolean;      // Check if paused
  getProgress(): number;    // Get progress (0-1)
  getDuration(): number;    // Get duration
  
  // Events
  onStart(callback: Function): Animation;  // Set start callback
  onUpdate(callback: Function): Animation; // Set update callback
  onComplete(callback: Function): Animation;  // Set completion callback
  
  // Cleanup
  destroy(): void;          // Clean up resources
}
```
