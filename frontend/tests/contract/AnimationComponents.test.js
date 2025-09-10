/**
 * Contract test for Animation Components
 * Implements task T014
 */

import { 
  AnimationController,
  TextAnimationController,
  ParticleAnimationController,
  ScrollAnimationController,
  MotionAnimationController,
  ThreeJSController
} from '../../src/services/animations';

describe('Animation Components Contract Tests', () => {
  // Main AnimationController tests
  describe('AnimationController Contract', () => {
    let animationController;
    let mockAnimation;

    beforeEach(() => {
      // Reset any mocks and create fresh instances for each test
      jest.clearAllMocks();
      
      // Create a mock animation
      mockAnimation = {
        play: jest.fn().mockResolvedValue(undefined),
        pause: jest.fn(),
        stop: jest.fn(),
        restart: jest.fn(),
        isPlaying: jest.fn().mockReturnValue(false),
        setSpeed: jest.fn(),
        destroy: jest.fn()
      };
      
      // Initialize the controller
      animationController = new AnimationController();
    });

    describe('Core methods', () => {
      test('should have initialize method', () => {
        expect(typeof animationController.initialize).toBe('function');
        expect(() => animationController.initialize()).not.toThrow();
      });

      test('should register and unregister animations', () => {
        // Register an animation
        animationController.register('testAnimation', mockAnimation);
        
        // Get the animation
        const retrieved = animationController.getAnimation('testAnimation');
        expect(retrieved).toBe(mockAnimation);
        
        // Unregister the animation
        animationController.unregister('testAnimation');
        
        // Verify it's gone
        const afterUnregister = animationController.getAnimation('testAnimation');
        expect(afterUnregister).toBeNull();
      });

      test('should return null for non-existent animations', () => {
        const nonExistent = animationController.getAnimation('nonExistent');
        expect(nonExistent).toBeNull();
      });
    });

    describe('Animation control methods', () => {
      beforeEach(() => {
        // Register a test animation for all control tests
        animationController.register('testAnimation', mockAnimation);
      });

      test('should play a registered animation', async () => {
        await animationController.play('testAnimation');
        expect(mockAnimation.play).toHaveBeenCalled();
      });

      test('should pause a registered animation', () => {
        animationController.pause('testAnimation');
        expect(mockAnimation.pause).toHaveBeenCalled();
      });

      test('should stop a registered animation', () => {
        animationController.stop('testAnimation');
        expect(mockAnimation.stop).toHaveBeenCalled();
      });

      test('should restart a registered animation', () => {
        animationController.restart('testAnimation');
        expect(mockAnimation.restart).toHaveBeenCalled();
      });

      test('should playAll registered animations', async () => {
        // Register another animation
        const mockAnimation2 = {
          play: jest.fn().mockResolvedValue(undefined),
          pause: jest.fn(),
          stop: jest.fn(),
          restart: jest.fn()
        };
        animationController.register('testAnimation2', mockAnimation2);
        
        // Play all animations
        await animationController.playAll();
        
        // Verify both animations were played
        expect(mockAnimation.play).toHaveBeenCalled();
        expect(mockAnimation2.play).toHaveBeenCalled();
      });

      test('should pauseAll registered animations', () => {
        // Register another animation
        const mockAnimation2 = {
          play: jest.fn().mockResolvedValue(undefined),
          pause: jest.fn(),
          stop: jest.fn(),
          restart: jest.fn()
        };
        animationController.register('testAnimation2', mockAnimation2);
        
        // Pause all animations
        animationController.pauseAll();
        
        // Verify both animations were paused
        expect(mockAnimation.pause).toHaveBeenCalled();
        expect(mockAnimation2.pause).toHaveBeenCalled();
      });

      test('should stopAll registered animations', () => {
        // Register another animation
        const mockAnimation2 = {
          play: jest.fn().mockResolvedValue(undefined),
          pause: jest.fn(),
          stop: jest.fn(),
          restart: jest.fn()
        };
        animationController.register('testAnimation2', mockAnimation2);
        
        // Stop all animations
        animationController.stopAll();
        
        // Verify both animations were stopped
        expect(mockAnimation.stop).toHaveBeenCalled();
        expect(mockAnimation2.stop).toHaveBeenCalled();
      });
    });

    describe('Settings and preferences methods', () => {
      test('should set and get reduced motion preferences', () => {
        // Default should be false
        expect(animationController.getReducedMotion()).toBe(false);
        
        // Set to true
        animationController.setReducedMotion(true);
        expect(animationController.getReducedMotion()).toBe(true);
        
        // Set back to false
        animationController.setReducedMotion(false);
        expect(animationController.getReducedMotion()).toBe(false);
      });
    });

    describe('Event handling methods', () => {
      test('should register and trigger event listeners', () => {
        const mockCallback = jest.fn();
        
        // Register the event listener
        animationController.on('test-event', mockCallback);
        
        // Trigger the event
        animationController.trigger('test-event', { data: 'test' });
        
        // Verify callback was called with the data
        expect(mockCallback).toHaveBeenCalledWith({ data: 'test' });
      });

      test('should remove event listeners', () => {
        const mockCallback = jest.fn();
        
        // Register the event listener
        animationController.on('test-event', mockCallback);
        
        // Remove the event listener
        animationController.off('test-event', mockCallback);
        
        // Trigger the event
        animationController.trigger('test-event', { data: 'test' });
        
        // Verify callback was NOT called
        expect(mockCallback).not.toHaveBeenCalled();
      });
    });
  });

  // TextAnimationController tests
  describe('TextAnimationController Contract', () => {
    let textAnimationController;
    let mockElement;

    beforeEach(() => {
      // Reset any mocks and create fresh instances for each test
      jest.clearAllMocks();
      
      // Create a mock DOM element
      mockElement = document.createElement('div');
      mockElement.textContent = 'Test Text';
      document.body.appendChild(mockElement);
      
      // Initialize the controller
      textAnimationController = new TextAnimationController();
    });

    afterEach(() => {
      // Clean up the DOM
      if (mockElement.parentNode) {
        document.body.removeChild(mockElement);
      }
    });

    test('should create typewriter animation', () => {
      const typewriterAnimation = textAnimationController.createTypewriter(mockElement, {
        speed: 50,
        cursor: true
      });
      
      // Verify the returned object is an Animation
      expect(typewriterAnimation).toBeDefined();
      expect(typeof typewriterAnimation.play).toBe('function');
      expect(typeof typewriterAnimation.pause).toBe('function');
      expect(typeof typewriterAnimation.stop).toBe('function');
    });

    test('should create text reveal animation', () => {
      const textRevealAnimation = textAnimationController.createTextReveal(mockElement, {
        direction: 'lr',
        duration: 1000
      });
      
      // Verify the returned object is an Animation
      expect(textRevealAnimation).toBeDefined();
      expect(typeof textRevealAnimation.play).toBe('function');
      expect(typeof textRevealAnimation.pause).toBe('function');
      expect(typeof textRevealAnimation.stop).toBe('function');
    });

    test('should create character fade animation', () => {
      const charFadeAnimation = textAnimationController.createCharacterFade(mockElement, {
        duration: 1000,
        stagger: 50
      });
      
      // Verify the returned object is an Animation
      expect(charFadeAnimation).toBeDefined();
      expect(typeof charFadeAnimation.play).toBe('function');
      expect(typeof charFadeAnimation.pause).toBe('function');
      expect(typeof charFadeAnimation.stop).toBe('function');
    });

    test('should create text scramble animation', () => {
      const textScrambleAnimation = textAnimationController.createTextScramble(mockElement, {
        duration: 1000,
        characters: '!<>-_\\/[]{}—=+*^?#_'
      });
      
      // Verify the returned object is an Animation
      expect(textScrambleAnimation).toBeDefined();
      expect(typeof textScrambleAnimation.play).toBe('function');
      expect(typeof textScrambleAnimation.pause).toBe('function');
      expect(typeof textScrambleAnimation.stop).toBe('function');
    });

    test('should split text by chars, words, or lines', () => {
      const charElements = textAnimationController.splitText(mockElement, 'chars');
      expect(Array.isArray(charElements)).toBe(true);
      expect(charElements.length).toBe(9); // 'Test Text' has 9 characters including space
      
      const wordElements = textAnimationController.splitText(mockElement, 'words');
      expect(Array.isArray(wordElements)).toBe(true);
      expect(wordElements.length).toBe(2); // 'Test Text' has 2 words
    });

    test('should wrap characters with span elements', () => {
      const wrappedChars = textAnimationController.wrapCharacters(mockElement, 'char-class');
      expect(Array.isArray(wrappedChars)).toBe(true);
      expect(wrappedChars.length).toBe(9); // 'Test Text' has 9 characters including space
      
      // Each element should be a span with the specified class
      wrappedChars.forEach(el => {
        expect(el.tagName.toLowerCase()).toBe('span');
        expect(el.classList.contains('char-class')).toBe(true);
      });
    });
  });

  // ParticleAnimationController tests
  describe('ParticleAnimationController Contract', () => {
    let particleAnimationController;
    let mockContainer;

    beforeEach(() => {
      // Reset any mocks and create fresh instances for each test
      jest.clearAllMocks();
      
      // Create a mock container element
      mockContainer = document.createElement('div');
      document.body.appendChild(mockContainer);
      
      // Initialize the controller
      particleAnimationController = new ParticleAnimationController();
    });

    afterEach(() => {
      // Clean up the DOM
      if (mockContainer.parentNode) {
        document.body.removeChild(mockContainer);
      }
    });

    test('should create basic particle animation', () => {
      const particleAnimation = particleAnimationController.createParticles(mockContainer, {
        particles: {
          number: {
            value: 50
          },
          color: {
            value: '#ff0000'
          }
        }
      });
      
      // Verify the returned object is an Animation
      expect(particleAnimation).toBeDefined();
      expect(typeof particleAnimation.play).toBe('function');
      expect(typeof particleAnimation.pause).toBe('function');
      expect(typeof particleAnimation.stop).toBe('function');
    });

    test('should create connected particles animation', () => {
      const connectedParticles = particleAnimationController.createConnectedParticles(mockContainer, {
        lineColor: '#00ff00',
        particleCount: 100
      });
      
      // Verify the returned object is an Animation
      expect(connectedParticles).toBeDefined();
      expect(typeof connectedParticles.play).toBe('function');
      expect(typeof connectedParticles.pause).toBe('function');
      expect(typeof connectedParticles.stop).toBe('function');
    });

    test('should create interactive particles animation', () => {
      const interactiveParticles = particleAnimationController.createInteractiveParticles(mockContainer, {
        hoverEffect: 'repulse',
        clickEffect: 'push'
      });
      
      // Verify the returned object is an Animation
      expect(interactiveParticles).toBeDefined();
      expect(typeof interactiveParticles.play).toBe('function');
      expect(typeof interactiveParticles.pause).toBe('function');
      expect(typeof interactiveParticles.stop).toBe('function');
    });

    test('should create particle text', () => {
      const particleText = particleAnimationController.createParticleText(mockContainer, 'Hello', {
        particleColor: '#0000ff',
        particleSize: 3
      });
      
      // Verify the returned object is an Animation
      expect(particleText).toBeDefined();
      expect(typeof particleText.play).toBe('function');
      expect(typeof particleText.pause).toBe('function');
      expect(typeof particleText.stop).toBe('function');
    });

    test('should create particle image', () => {
      const particleImage = particleAnimationController.createParticleImage(mockContainer, 'image.png', {
        particleColor: '#ff00ff',
        particleCount: 200
      });
      
      // Verify the returned object is an Animation
      expect(particleImage).toBeDefined();
      expect(typeof particleImage.play).toBe('function');
      expect(typeof particleImage.pause).toBe('function');
      expect(typeof particleImage.stop).toBe('function');
    });

    test('should control particle system', () => {
      // Create a particle system
      const particleAnimation = particleAnimationController.createParticles(mockContainer, {
        particles: {
          number: {
            value: 50
          }
        }
      });
      
      // Test the control methods
      expect(() => particleAnimationController.pauseParticles(mockContainer)).not.toThrow();
      expect(() => particleAnimationController.resumeParticles(mockContainer)).not.toThrow();
      expect(() => particleAnimationController.destroyParticles(mockContainer)).not.toThrow();
      expect(() => particleAnimationController.updateParticles(mockContainer, {
        particles: {
          number: {
            value: 100
          }
        }
      })).not.toThrow();
    });
  });

  // ScrollAnimationController tests
  describe('ScrollAnimationController Contract', () => {
    let scrollAnimationController;
    let mockElement;
    let mockElements;

    beforeEach(() => {
      // Reset any mocks and create fresh instances for each test
      jest.clearAllMocks();
      
      // Create mock elements
      mockElement = document.createElement('div');
      document.body.appendChild(mockElement);
      
      mockElements = [];
      for (let i = 0; i < 3; i++) {
        const el = document.createElement('div');
        document.body.appendChild(el);
        mockElements.push(el);
      }
      
      // Initialize the controller
      scrollAnimationController = new ScrollAnimationController();
    });

    afterEach(() => {
      // Clean up the DOM
      if (mockElement.parentNode) {
        document.body.removeChild(mockElement);
      }
      
      mockElements.forEach(el => {
        if (el.parentNode) {
          document.body.removeChild(el);
        }
      });
    });

    test('should reveal element with animation', () => {
      const revealAnimation = scrollAnimationController.revealElement(mockElement, {
        delay: 200,
        duration: 800,
        origin: 'bottom',
        distance: '50px'
      });
      
      // Verify the returned object is an Animation
      expect(revealAnimation).toBeDefined();
      expect(typeof revealAnimation.play).toBe('function');
      expect(typeof revealAnimation.pause).toBe('function');
      expect(typeof revealAnimation.stop).toBe('function');
    });

    test('should reveal sequence of elements', () => {
      const sequenceAnimations = scrollAnimationController.revealSequence(mockElements, {
        delay: 200,
        duration: 800
      });
      
      // Verify the returned array contains Animation objects
      expect(Array.isArray(sequenceAnimations)).toBe(true);
      expect(sequenceAnimations.length).toBe(mockElements.length);
      
      sequenceAnimations.forEach(anim => {
        expect(typeof anim.play).toBe('function');
        expect(typeof anim.pause).toBe('function');
        expect(typeof anim.stop).toBe('function');
      });
    });

    test('should reveal staggered elements', () => {
      const staggeredAnimations = scrollAnimationController.revealStaggered(mockElements, 100, {
        duration: 800,
        origin: 'left'
      });
      
      // Verify the returned array contains Animation objects
      expect(Array.isArray(staggeredAnimations)).toBe(true);
      expect(staggeredAnimations.length).toBe(mockElements.length);
      
      staggeredAnimations.forEach(anim => {
        expect(typeof anim.play).toBe('function');
        expect(typeof anim.pause).toBe('function');
        expect(typeof anim.stop).toBe('function');
      });
    });

    test('should create parallax effect', () => {
      const parallaxAnimation = scrollAnimationController.createParallax(mockElement, {
        speed: 0.5,
        direction: 'vertical'
      });
      
      // Verify the returned object is an Animation
      expect(parallaxAnimation).toBeDefined();
      expect(typeof parallaxAnimation.play).toBe('function');
      expect(typeof parallaxAnimation.pause).toBe('function');
      expect(typeof parallaxAnimation.stop).toBe('function');
    });

    test('should create scroll progress animation', () => {
      const progressAnimation = scrollAnimationController.createScrollProgress(mockElement, {
        property: 'width',
        start: 0,
        end: 1
      });
      
      // Verify the returned object is an Animation
      expect(progressAnimation).toBeDefined();
      expect(typeof progressAnimation.play).toBe('function');
      expect(typeof progressAnimation.pause).toBe('function');
      expect(typeof progressAnimation.stop).toBe('function');
    });

    test('should sync all animations', () => {
      // Add some animations
      scrollAnimationController.revealElement(mockElement);
      scrollAnimationController.revealSequence(mockElements);
      
      // Sync should not throw
      expect(() => scrollAnimationController.sync()).not.toThrow();
    });

    test('should destroy all animations', () => {
      // Add some animations
      scrollAnimationController.revealElement(mockElement);
      scrollAnimationController.revealSequence(mockElements);
      
      // Destroy should not throw
      expect(() => scrollAnimationController.destroy()).not.toThrow();
    });
  });

  // MotionAnimationController tests
  describe('MotionAnimationController Contract', () => {
    let motionAnimationController;
    let mockElement;
    let mockElements;

    beforeEach(() => {
      // Reset any mocks and create fresh instances for each test
      jest.clearAllMocks();
      
      // Create mock elements
      mockElement = document.createElement('div');
      document.body.appendChild(mockElement);
      
      mockElements = [];
      for (let i = 0; i < 3; i++) {
        const el = document.createElement('div');
        document.body.appendChild(el);
        mockElements.push(el);
      }
      
      // Initialize the controller
      motionAnimationController = new MotionAnimationController();
    });

    afterEach(() => {
      // Clean up the DOM
      if (mockElement.parentNode) {
        document.body.removeChild(mockElement);
      }
      
      mockElements.forEach(el => {
        if (el.parentNode) {
          document.body.removeChild(el);
        }
      });
    });

    test('should create basic tween', () => {
      const tween = motionAnimationController.createTween(mockElement, 1, {
        x: 100,
        opacity: 0.5,
        rotation: 45
      });
      
      // Verify the returned object is an Animation
      expect(tween).toBeDefined();
      expect(typeof tween.play).toBe('function');
      expect(typeof tween.pause).toBe('function');
      expect(typeof tween.stop).toBe('function');
    });

    test('should create fromTo animation', () => {
      const fromToAnimation = motionAnimationController.createFromTo(mockElement, 1, 
        { x: 0, opacity: 0 },
        { x: 100, opacity: 1 }
      );
      
      // Verify the returned object is an Animation
      expect(fromToAnimation).toBeDefined();
      expect(typeof fromToAnimation.play).toBe('function');
      expect(typeof fromToAnimation.pause).toBe('function');
      expect(typeof fromToAnimation.stop).toBe('function');
    });

    test('should create timeline animation', () => {
      const timeline = motionAnimationController.createTimeline({
        paused: true,
        repeat: 2,
        yoyo: true,
        defaults: {
          duration: 0.5,
          ease: 'power2.out'
        }
      });
      
      // Verify the returned object is a TimelineAnimation
      expect(timeline).toBeDefined();
      expect(typeof timeline.play).toBe('function');
      expect(typeof timeline.pause).toBe('function');
      expect(typeof timeline.stop).toBe('function');
      
      // Check timeline-specific methods
      expect(typeof timeline.add).toBe('function');
      expect(typeof timeline.addLabel).toBe('function');
      expect(typeof timeline.addPause).toBe('function');
      expect(typeof timeline.to).toBe('function');
      expect(typeof timeline.from).toBe('function');
      expect(typeof timeline.fromTo).toBe('function');
    });

    test('should create split text animation', () => {
      mockElement.textContent = 'Split this text';
      
      const splitTextAnimation = motionAnimationController.createSplitTextAnimation(mockElement, {
        type: 'chars,words',
        stagger: 0.05
      });
      
      // Verify the returned object is an Animation
      expect(splitTextAnimation).toBeDefined();
      expect(typeof splitTextAnimation.play).toBe('function');
      expect(typeof splitTextAnimation.pause).toBe('function');
      expect(typeof splitTextAnimation.stop).toBe('function');
    });

    test('should create SVG morph animation', () => {
      // Create SVG elements
      const svgNS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(svgNS, 'svg');
      const fromPath = document.createElementNS(svgNS, 'path');
      const toPath = document.createElementNS(svgNS, 'path');
      
      fromPath.setAttribute('d', 'M0,0 L100,0 L100,100 L0,100 Z'); // Square
      toPath.setAttribute('d', 'M50,0 L100,50 L50,100 L0,50 Z'); // Diamond
      
      svg.appendChild(fromPath);
      svg.appendChild(toPath);
      document.body.appendChild(svg);
      
      const morphAnimation = motionAnimationController.createMorphSVG(fromPath, toPath, {
        duration: 2
      });
      
      // Verify the returned object is an Animation
      expect(morphAnimation).toBeDefined();
      expect(typeof morphAnimation.play).toBe('function');
      expect(typeof morphAnimation.pause).toBe('function');
      expect(typeof morphAnimation.stop).toBe('function');
      
      // Clean up
      document.body.removeChild(svg);
    });

    test('should create scroll trigger', () => {
      // Create a tween to trigger
      const tween = motionAnimationController.createTween(mockElement, 1, {
        x: 100,
        opacity: 0.5
      });
      
      const scrollTrigger = motionAnimationController.createScrollTrigger(mockElement, tween, {
        start: 'top center',
        end: 'bottom center',
        scrub: true
      });
      
      // Verify the returned object is a ScrollTrigger
      expect(scrollTrigger).toBeDefined();
      expect(typeof scrollTrigger.refresh).toBe('function');
      expect(typeof scrollTrigger.kill).toBe('function');
      expect(typeof scrollTrigger.disable).toBe('function');
      expect(typeof scrollTrigger.enable).toBe('function');
      expect(typeof scrollTrigger.update).toBe('function');
    });
  });

  // ThreeJSController tests
  describe('ThreeJSController Contract', () => {
    let threeJSController;
    let mockContainer;

    beforeEach(() => {
      // Reset any mocks and create fresh instances for each test
      jest.clearAllMocks();
      
      // Create a mock container element
      mockContainer = document.createElement('div');
      document.body.appendChild(mockContainer);
      
      // Initialize the controller
      threeJSController = new ThreeJSController();
    });

    afterEach(() => {
      // Clean up the DOM
      if (mockContainer.parentNode) {
        document.body.removeChild(mockContainer);
      }
    });

    test('should create 3D scene', () => {
      const scene = threeJSController.createScene(mockContainer, {
        camera: {
          type: 'perspective',
          fov: 75,
          position: { x: 0, y: 0, z: 5 }
        },
        renderer: {
          antialias: true,
          alpha: true
        },
        controls: {
          enable: true,
          autoRotate: true
        },
        lights: [
          { 
            type: 'ambient', 
            color: '#ffffff',
            intensity: 0.5
          },
          {
            type: 'directional',
            color: '#ffffff',
            intensity: 1.0,
            position: { x: 1, y: 1, z: 1 }
          }
        ]
      });
      
      // Verify the returned object is a ThreeJSScene
      expect(scene).toBeDefined();
      expect(typeof scene.play).toBe('function');
      expect(typeof scene.pause).toBe('function');
      expect(typeof scene.stop).toBe('function');
      
      // Check scene-specific methods
      expect(typeof scene.add).toBe('function');
      expect(typeof scene.remove).toBe('function');
      expect(typeof scene.getCamera).toBe('function');
      expect(typeof scene.getRenderer).toBe('function');
      expect(typeof scene.getScene).toBe('function');
      expect(typeof scene.resize).toBe('function');
      expect(typeof scene.render).toBe('function');
    });

    test('should create geometries', () => {
      const boxGeometry = threeJSController.createGeometry('box', {
        width: 1,
        height: 1, 
        depth: 1
      });
      
      const sphereGeometry = threeJSController.createGeometry('sphere', {
        radius: 1,
        widthSegments: 32,
        heightSegments: 32
      });
      
      // Verify the geometries were created
      expect(boxGeometry).toBeDefined();
      expect(sphereGeometry).toBeDefined();
    });

    test('should create materials', () => {
      const basicMaterial = threeJSController.createMaterial('basic', {
        color: '#ff0000',
        wireframe: true
      });
      
      const standardMaterial = threeJSController.createMaterial('standard', {
        color: '#00ff00',
        metalness: 0.5,
        roughness: 0.5
      });
      
      // Verify the materials were created
      expect(basicMaterial).toBeDefined();
      expect(standardMaterial).toBeDefined();
    });

    test('should create mesh', () => {
      const geometry = threeJSController.createGeometry('box', {
        width: 1,
        height: 1,
        depth: 1
      });
      
      const material = threeJSController.createMaterial('basic', {
        color: '#ff0000'
      });
      
      const mesh = threeJSController.createMesh(geometry, material);
      
      // Verify the mesh was created
      expect(mesh).toBeDefined();
    });

    test('should create 3D text', () => {
      const textMesh = threeJSController.createText('Hello 3D', {
        size: 1,
        height: 0.2,
        curveSegments: 12,
        font: 'helvetiker'
      });
      
      // Verify the text mesh was created
      expect(textMesh).toBeDefined();
    });

    test('should animate properties', () => {
      // Create a mock object to animate
      const mockObject = {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      };
      
      const propertyAnimation = threeJSController.animateProperty(mockObject, 'position.y', 5, 2, {
        ease: 'elastic',
        repeat: 2
      });
      
      // Verify the returned object is an Animation
      expect(propertyAnimation).toBeDefined();
      expect(typeof propertyAnimation.play).toBe('function');
      expect(typeof propertyAnimation.pause).toBe('function');
      expect(typeof propertyAnimation.stop).toBe('function');
    });

    test('should animate rotation', () => {
      // Create a mock object to animate
      const mockObject = {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      };
      
      const rotationAnimation = threeJSController.animateRotation(mockObject, 
        { x: Math.PI, y: Math.PI * 2, z: 0 },
        2,
        { ease: 'power2.inOut' }
      );
      
      // Verify the returned object is an Animation
      expect(rotationAnimation).toBeDefined();
      expect(typeof rotationAnimation.play).toBe('function');
      expect(typeof rotationAnimation.pause).toBe('function');
      expect(typeof rotationAnimation.stop).toBe('function');
    });

    test('should animate position', () => {
      // Create a mock object to animate
      const mockObject = {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      };
      
      const positionAnimation = threeJSController.animatePosition(mockObject,
        { x: 10, y: 5, z: -3 },
        2,
        { ease: 'power3.out' }
      );
      
      // Verify the returned object is an Animation
      expect(positionAnimation).toBeDefined();
      expect(typeof positionAnimation.play).toBe('function');
      expect(typeof positionAnimation.pause).toBe('function');
      expect(typeof positionAnimation.stop).toBe('function');
    });

    test('should animate scale', () => {
      // Create a mock object to animate
      const mockObject = {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      };
      
      const scaleAnimation = threeJSController.animateScale(mockObject,
        { x: 2, y: 2, z: 2 },
        1,
        { ease: 'back.out' }
      );
      
      // Verify the returned object is an Animation
      expect(scaleAnimation).toBeDefined();
      expect(typeof scaleAnimation.play).toBe('function');
      expect(typeof scaleAnimation.pause).toBe('function');
      expect(typeof scaleAnimation.stop).toBe('function');
    });
  });

  // Animation interface tests
  describe('Animation Interface Contract', () => {
    let animationController;
    let animation;

    beforeEach(() => {
      // Reset any mocks and create fresh instances for each test
      jest.clearAllMocks();
      
      // Initialize the controller
      animationController = new AnimationController();
      
      // Get a real animation instance by creating one
      animation = animationController.createAnimation({
        duration: 1000,
        easing: 'linear',
        loop: false
      });
    });

    test('should have core playback methods', () => {
      expect(typeof animation.play).toBe('function');
      expect(typeof animation.pause).toBe('function');
      expect(typeof animation.stop).toBe('function');
      expect(typeof animation.restart).toBe('function');
      expect(typeof animation.seek).toBe('function');
      expect(typeof animation.reverse).toBe('function');
      expect(typeof animation.setSpeed).toBe('function');
    });

    test('should have configuration methods', () => {
      expect(typeof animation.setDelay).toBe('function');
      expect(typeof animation.setDuration).toBe('function');
      expect(typeof animation.setEasing).toBe('function');
      expect(typeof animation.setLoop).toBe('function');
    });

    test('should have state methods', () => {
      expect(typeof animation.isPlaying).toBe('function');
      expect(typeof animation.isPaused).toBe('function');
      expect(typeof animation.getProgress).toBe('function');
      expect(typeof animation.getDuration).toBe('function');
    });

    test('should have event methods', () => {
      expect(typeof animation.onStart).toBe('function');
      expect(typeof animation.onUpdate).toBe('function');
      expect(typeof animation.onComplete).toBe('function');
    });

    test('should have cleanup method', () => {
      expect(typeof animation.destroy).toBe('function');
    });

    test('should chain event methods', () => {
      const mockCallback = jest.fn();
      
      // Chainable interface
      const result = animation.onStart(mockCallback).onUpdate(mockCallback).onComplete(mockCallback);
      
      // Should return the animation for chaining
      expect(result).toBe(animation);
    });

    test('should call events at appropriate times', async () => {
      const startCallback = jest.fn();
      const updateCallback = jest.fn();
      const completeCallback = jest.fn();
      
      animation.onStart(startCallback)
               .onUpdate(updateCallback)
               .onComplete(completeCallback);
      
      // Play the animation
      await animation.play();
      
      // Since we're in a test environment, animations won't actually run over time
      // But we can verify the start callback was called
      expect(startCallback).toHaveBeenCalled();
      
      // Manually trigger completion to test complete callback
      animation.seek(1);
      expect(completeCallback).toHaveBeenCalled();
    });
  });
});
