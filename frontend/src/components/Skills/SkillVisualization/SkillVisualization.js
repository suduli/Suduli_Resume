import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useTheme } from '../../../contexts/ThemeContext';
import ThemeAnimationAdapter from '../../../services/ThemeAnimationAdapter';
import styles from './SkillVisualization.module.css';

/**
 * A Three.js-powered skill visualization component
 * Implementation for task T045
 * 
 * @param {Object} props Component props
 * @param {Array} props.skills Array of skill objects with name, level, and category properties
 * @param {string} props.className Additional CSS class
 * @returns {JSX.Element} Rendered component
 */
const SkillVisualization = ({ skills, className, ...props }) => {
  const { theme } = useTheme();
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const spheresRef = useRef([]);
  const frameIdRef = useRef(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2(-1, -1));
  const [isInitialized, setIsInitialized] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  
  // Group skills by category for better visualization
  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {});
  
  // Color schemes based on theme
  const colorSchemes = useMemo(() => {
    // Get animation settings from ThemeAnimationAdapter
    const get3DSettings = (themeId) => ThemeAnimationAdapter.get3DEffectSettings(themeId);
    
    const lightThemeSettings = get3DSettings('light');
    const darkThemeSettings = get3DSettings('dark');
    
    return {
      light: {
        background: 0xffffff,
        skillColors: [
          0x3b82f6, // blue
          0x10b981, // green
          0xf59e0b, // yellow
          0xef4444, // red
          0x8b5cf6, // purple
          0xec4899, // pink
        ],
        textColor: 0x1e293b,
        particleColor: lightThemeSettings.materialColor ? parseInt(lightThemeSettings.materialColor.replace('#', '0x')) : 0xcccccc,
        lightColor: lightThemeSettings.lightColor ? parseInt(lightThemeSettings.lightColor.replace('#', '0x')) : 0xffffff,
        lightIntensity: lightThemeSettings.lightIntensity || 1.0,
        ambientLight: lightThemeSettings.ambientLight || 0.5,
        emissiveColor: lightThemeSettings.emissiveColor ? parseInt(lightThemeSettings.emissiveColor.replace('#', '0x')) : 0x333333,
        reflectivity: lightThemeSettings.reflectivity || 0.5,
        metalness: lightThemeSettings.metalness || 0.3,
        roughness: lightThemeSettings.roughness || 0.4,
      },
      dark: {
        background: 0x0f172a,
        skillColors: [
          0x60a5fa, // blue
          0x34d399, // green
          0xfbbf24, // yellow
          0xf87171, // red
          0xa78bfa, // purple
          0xf472b6, // pink
        ],
        textColor: 0xf8fafc,
        particleColor: darkThemeSettings.materialColor ? parseInt(darkThemeSettings.materialColor.replace('#', '0x')) : 0x475569,
        lightColor: darkThemeSettings.lightColor ? parseInt(darkThemeSettings.lightColor.replace('#', '0x')) : 0x5599ff,
        lightIntensity: darkThemeSettings.lightIntensity || 1.2,
        ambientLight: darkThemeSettings.ambientLight || 0.2,
        emissiveColor: darkThemeSettings.emissiveColor ? parseInt(darkThemeSettings.emissiveColor.replace('#', '0x')) : 0x333333,
        reflectivity: darkThemeSettings.reflectivity || 0.7,
        metalness: darkThemeSettings.metalness || 0.5,
        roughness: darkThemeSettings.roughness || 0.3,
      },
    };
  }, []);
  
  // Initialize Three.js scene
  const initScene = useCallback(() => {
    if (!containerRef.current) return;
    
    // Set up scene, camera, and renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const aspectRatio = containerRef.current.clientWidth / containerRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(60, aspectRatio, 0.1, 1000);
    camera.position.z = 15;
    cameraRef.current = camera;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(colorSchemes[theme].background, 1);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.minDistance = 5;
    controls.maxDistance = 30;
    controlsRef.current = controls;
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, colorSchemes[theme].ambientLight);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(colorSchemes[theme].lightColor, colorSchemes[theme].lightIntensity);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Add particle system for background
    const particleGeometry = new THREE.BufferGeometry();
    const particlesCount = 500;
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 50;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: colorSchemes[theme].particleColor,
      transparent: true,
      opacity: 0.8,
    });
    
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);
    
    // Add window resize handler
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
    };
    
    // Mouse move handler for raycasting
    const handleMouseMove = (event) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / containerRef.current.clientWidth) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / containerRef.current.clientHeight) * 2 + 1;
    };
    
    window.addEventListener('resize', handleResize);
    containerRef.current.addEventListener('mousemove', handleMouseMove);
    
    // Animation loop
    const animate = () => {
      if (!controlsRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) {
        return;
      }
      
      // Rotate spheres with a gentle pulsating effect
      if (spheresRef.current.length > 0) {
        spheresRef.current.forEach((sphere, index) => {
          // Use a sine wave to create a pulsating rotation speed
          const time = Date.now() * 0.001;
          const pulseSpeed = Math.sin(time + index) * 0.0005 + 0.002;
          
          sphere.rotation.x += pulseSpeed;
          sphere.rotation.y += pulseSpeed * 1.5;
          
          // Add a subtle floating motion
          sphere.position.y = Math.sin(time * 0.5 + index) * 0.1;
        });
      }
      
      // Rotate particle system with a dynamic pattern
      const particleTime = Date.now() * 0.0001;
      particleSystem.rotation.x += Math.sin(particleTime) * 0.0002;
      particleSystem.rotation.y += Math.cos(particleTime) * 0.0002;
      
      // Raycasting for hover detection with improved detection
      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      
      // Get all meshes from the spheres and store skill data with each mesh
      const meshes = [];
      let hoveredObject = null;
      
      spheresRef.current.forEach(group => {
        group.traverse(object => {
          if (object.isMesh && object.userData && object.userData.skillData) {
            meshes.push(object);
          }
        });
      });
      
      const intersects = raycasterRef.current.intersectObjects(meshes);
      
      if (intersects.length > 0) {
        hoveredObject = intersects[0].object;
        
        // Check if we have skill data attached to the mesh
        if (hoveredObject.userData && hoveredObject.userData.skillData) {
          const foundSkill = hoveredObject.userData.skillData;
          
          // Add a subtle highlight effect to the hovered sphere
          if (hoveredObject.material) {
            hoveredObject.material.emissiveIntensity = 0.5;
            hoveredObject.scale.set(1.1, 1.1, 1.1);
          }
          
          setHoveredSkill(foundSkill);
        }
      } else {
        setHoveredSkill(null);
        
        // Reset all materials when not hovering
        meshes.forEach(mesh => {
          if (mesh.material) {
            mesh.material.emissiveIntensity = 0.2;
            mesh.scale.set(1.0, 1.0, 1.0);
          }
        });
      }
      
      controlsRef.current.update();
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      frameIdRef.current = requestAnimationFrame(animate);
    };
    
    setIsInitialized(true);
    
    // Start animation loop
    animate();
    
    // Cleanup
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      
      if (rendererRef.current && rendererRef.current.domElement && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      window.removeEventListener('resize', handleResize);
      containerRef.current.removeEventListener('mousemove', handleMouseMove);
      
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      
      // Dispose of all geometries and materials
      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object.geometry) object.geometry.dispose();
          
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      }
    };
  }, [theme, colorSchemes, setHoveredSkill]);
  
  // Create skill spheres
  const createSkillSpheres = useCallback(() => {
    if (!isInitialized || !sceneRef.current || !skills.length) return;
    
    // Clear previous spheres
    if (spheresRef.current.length > 0) {
      spheresRef.current.forEach((sphere) => {
        sceneRef.current.remove(sphere);
        sphere.traverse((object) => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      });
      spheresRef.current = [];
    }
    
    // Create new spheres for each category
    Object.entries(groupedSkills).forEach(([category, categorySkills], categoryIndex) => {
      const group = new THREE.Group();
      
      // Create category label
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 256;
      canvas.height = 128;
      
      context.fillStyle = theme === 'dark' ? '#f8fafc' : '#1e293b';
      context.font = 'bold 24px Arial';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(category, 128, 64);
      
      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(4, 2, 1);
      
      const sphereGroup = new THREE.Group();
      
      // Position category groups in a circle around origin
      const totalCategories = Object.keys(groupedSkills).length;
      const angle = (Math.PI * 2 / totalCategories) * categoryIndex;
      const radius = 8;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      
      sphereGroup.position.set(x, 0, z);
      sprite.position.set(0, 3, 0);
      sphereGroup.add(sprite);
      
      // Create spheres for skills in this category
      categorySkills.forEach((skill, skillIndex) => {
        const colorIndex = categoryIndex % colorSchemes[theme].skillColors.length;
        const skillColor = colorSchemes[theme].skillColors[colorIndex];
        
        // Size based on skill level (1-10)
        const size = 0.3 + (skill.level / 10) * 0.7;
        
        // Create sphere geometry with more detailed wireframe for better visual effect
        const geometry = new THREE.SphereGeometry(size, 32, 32);
        const material = new THREE.MeshPhongMaterial({
          color: skillColor,
          emissive: colorSchemes[theme].emissiveColor,
          emissiveIntensity: 0.2,
          specular: 0xffffff,
          shininess: 50,
          transparent: true,
          opacity: 0.9,
          reflectivity: colorSchemes[theme].reflectivity,
          metalness: colorSchemes[theme].metalness,
          roughness: colorSchemes[theme].roughness,
        });
        
        const sphere = new THREE.Mesh(geometry, material);
        
        // Store skill data directly on the mesh for better hover detection
        sphere.userData.skillData = {
          ...skill,
          category
        };
        
        // Create wireframe for additional visual effect
        const wireGeometry = new THREE.SphereGeometry(size * 1.05, 16, 16);
        const wireMaterial = new THREE.MeshBasicMaterial({ 
          color: skillColor, 
          wireframe: true,
          transparent: true, 
          opacity: 0.3
        });
        const wireframe = new THREE.Mesh(wireGeometry, wireMaterial);
        
        // Position skills in a circle within their category
        const skillCount = categorySkills.length;
        const skillAngle = (Math.PI * 2 / skillCount) * skillIndex;
        const skillRadius = 2;
        const skillX = Math.sin(skillAngle) * skillRadius;
        const skillZ = Math.cos(skillAngle) * skillRadius;
        
        sphere.position.set(skillX, 0, skillZ);
        wireframe.position.copy(sphere.position);
        
        // Add a small offset to give a floating effect
        const yOffset = Math.sin(skillIndex * 0.5) * 0.2;
        sphere.position.y += yOffset;
        wireframe.position.y += yOffset;
        
        // Create skill label with improved text rendering
        const skillCanvas = document.createElement('canvas');
        const skillContext = skillCanvas.getContext('2d');
        skillCanvas.width = 256;
        skillCanvas.height = 128;
        
        // Fill with semi-transparent background for better readability
        skillContext.fillStyle = theme === 'dark' ? 'rgba(15, 23, 42, 0.7)' : 'rgba(248, 250, 252, 0.7)';
        skillContext.fillRect(0, 0, 256, 128);
        
        // Draw text with shadow for better visibility
        skillContext.shadowColor = 'rgba(0, 0, 0, 0.5)';
        skillContext.shadowBlur = 4;
        skillContext.shadowOffsetX = 2;
        skillContext.shadowOffsetY = 2;
        
        skillContext.fillStyle = theme === 'dark' ? '#f8fafc' : '#1e293b';
        skillContext.font = 'bold 20px Arial';
        skillContext.textAlign = 'center';
        skillContext.textBaseline = 'middle';
        skillContext.fillText(skill.name, 128, 48);
        
        // Add skill level text
        skillContext.font = '16px Arial';
        skillContext.fillText(`Level: ${skill.level}/10`, 128, 80);
        
        const skillTexture = new THREE.CanvasTexture(skillCanvas);
        const skillSpriteMaterial = new THREE.SpriteMaterial({ map: skillTexture, transparent: true });
        const skillSprite = new THREE.Sprite(skillSpriteMaterial);
        skillSprite.scale.set(3, 1.5, 1);
        skillSprite.position.set(skillX, size + 0.7, skillZ);
        
        // Add everything to the scene
        sphereGroup.add(sphere);
        sphereGroup.add(wireframe);
        sphereGroup.add(skillSprite);
      });
      
      group.add(sphereGroup);
      sceneRef.current.add(group);
      spheresRef.current.push(group);
    });
    
  }, [isInitialized, skills, theme, groupedSkills, colorSchemes]);
  
  // Initialize scene
  useEffect(() => {
    const cleanup = initScene();
    return cleanup;
  }, [initScene]);
  
  // Create skill spheres when initialized or data changes
  useEffect(() => {
    createSkillSpheres();
  }, [createSkillSpheres]);
  
  // Update renderer and materials when theme changes
  useEffect(() => {
    if (!rendererRef.current) return;
    
    // Update renderer clear color
    rendererRef.current.setClearColor(colorSchemes[theme].background, 1);
    
    // Update lighting
    if (sceneRef.current) {
      sceneRef.current.traverse((object) => {
        // Update ambient light
        if (object instanceof THREE.AmbientLight) {
          object.intensity = colorSchemes[theme].ambientLight;
        }
        
        // Update directional light
        if (object instanceof THREE.DirectionalLight) {
          object.color.set(colorSchemes[theme].lightColor);
          object.intensity = colorSchemes[theme].lightIntensity;
        }
        
        // Update particles
        if (object instanceof THREE.Points && object.material) {
          object.material.color.set(colorSchemes[theme].particleColor);
        }
        
        // Update sphere materials
        if (object.isMesh && object.material) {
          if (object.material.emissive) {
            // For phong materials
            if (object.userData.skillData) {
              // Keep skill color but update material properties
              object.material.emissive.set(colorSchemes[theme].emissiveColor);
              if (object.material.reflectivity !== undefined) {
                object.material.reflectivity = colorSchemes[theme].reflectivity;
              }
              if (object.material.metalness !== undefined) {
                object.material.metalness = colorSchemes[theme].metalness;
              }
              if (object.material.roughness !== undefined) {
                object.material.roughness = colorSchemes[theme].roughness;
              }
            }
          }
        }
      });
    }
    
    // Register scene config with ThemeAnimationAdapter
    const sceneConfig = {
      type: 'threejs',
      material: {
        color: colorSchemes[theme].particleColor.toString(16),
        emissive: colorSchemes[theme].emissiveColor.toString(16)
      },
      light: {
        color: colorSchemes[theme].lightColor.toString(16),
        intensity: colorSchemes[theme].lightIntensity
      }
    };
    
    ThemeAnimationAdapter.registerAnimation(sceneConfig, theme);
    
  }, [theme, colorSchemes]);
  
  const containerClasses = [
    styles.container,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div 
      ref={containerRef} 
      className={containerClasses}
      data-testid="skill-visualization"
      {...props}
    >
      {hoveredSkill && (
        <div className={styles.tooltip} data-testid="skill-tooltip">
          <h3>{hoveredSkill.name}</h3>
          <p>
            Level: {hoveredSkill.level}/10
            <span className={styles.level}>
              <span 
                className={styles.levelFill} 
                style={{width: `${hoveredSkill.level * 10}%`}}
              />
            </span>
          </p>
          <p>Category: {hoveredSkill.category}</p>
          {hoveredSkill.description && (
            <p>{hoveredSkill.description}</p>
          )}
        </div>
      )}
    </div>
  );
};

SkillVisualization.propTypes = {
  skills: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      level: PropTypes.number.isRequired,
      category: PropTypes.string,
    })
  ).isRequired,
  className: PropTypes.string,
};

export default SkillVisualization;
