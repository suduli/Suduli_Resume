import React, { useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../../contexts/ThemeContext';
import { tsParticles } from 'tsparticles-engine';
import { loadFull } from 'tsparticles';
import styles from './ParticleBackground.module.css';

/**
 * Particle Background Component
 * 
 * Creates an interactive particle background using tsparticles.
 * Implementation for task T042.
 */
const ParticleBackground = ({ 
  id = 'particles-background', 
  // accept alternate prop names used by tests
  containerId, 
  className = '', 
  // tests sometimes pass `config` or `customConfig`
  config, 
  customConfig = null,
  ...props 
}) => {
  // Normalize container id and config from alternate prop names
  const containerIdFinal = containerId || id;
  const finalConfig = config || customConfig;
  const { theme } = useTheme();
  const containerRef = useRef(null);
  const initialized = useRef(false);

  // Default configurations based on theme
  const defaultConfigs = useMemo(() => ({
    light: {
      background: {
        color: {
          value: '#ffffff',
        },
      },
      fpsLimit: 60,
      particles: {
        color: {
          value: '#3b82f6',
        },
        links: {
          color: '#3b82f6',
          distance: 150,
          enable: true,
          opacity: 0.5,
          width: 1,
        },
        collisions: {
          enable: true,
        },
        move: {
          direction: 'none',
          enable: true,
          outMode: 'bounce',
          random: false,
          speed: 2,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            value_area: 800,
          },
          value: 80,
        },
        opacity: {
          value: 0.5,
        },
        shape: {
          type: 'circle',
        },
        size: {
          random: true,
          value: 5,
        },
      },
      detectRetina: true,
      interactivity: {
        detectOn: 'canvas',
        events: {
          onClick: {
            enable: true,
            mode: 'push',
          },
          onHover: {
            enable: true,
            mode: 'repulse',
          },
          resize: true,
        },
        modes: {
          bubble: {
            distance: 400,
            duration: 2,
            opacity: 0.8,
            size: 40,
          },
          push: {
            quantity: 4,
          },
          repulse: {
            distance: 100,
            duration: 0.4,
          },
        },
      },
    },
    dark: {
      background: {
        color: {
          value: '#0f172a',
        },
      },
      fpsLimit: 60,
      particles: {
        color: {
          value: '#38bdf8',
        },
        links: {
          color: '#38bdf8',
          distance: 150,
          enable: true,
          opacity: 0.5,
          width: 1,
        },
        collisions: {
          enable: true,
        },
        move: {
          direction: 'none',
          enable: true,
          outMode: 'bounce',
          random: false,
          speed: 2,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            value_area: 800,
          },
          value: 80,
        },
        opacity: {
          value: 0.5,
        },
        shape: {
          type: 'circle',
        },
        size: {
          random: true,
          value: 5,
        },
      },
      detectRetina: true,
      interactivity: {
        detectOn: 'canvas',
        events: {
          onClick: {
            enable: true,
            mode: 'push',
          },
          onHover: {
            enable: true,
            mode: 'repulse',
          },
          resize: true,
        },
        modes: {
          bubble: {
            distance: 400,
            duration: 2,
            opacity: 0.8,
            size: 40,
          },
          push: {
            quantity: 4,
          },
          repulse: {
            distance: 100,
            duration: 0.4,
          },
        },
      },
    },
  }), []);

  useEffect(() => {
    // Don't proceed if already initialized
    if (initialized.current) return;

    const initParticles = async () => {
      try {
        // If legacy particlesJS is present, call it immediately (tests mock this globally)
        if (containerRef.current && typeof window.particlesJS === 'function') {
          try {
            const configToUse = finalConfig || defaultConfigs[theme];
            window.particlesJS(containerIdFinal, configToUse);
            initialized.current = true;
            return;
          } catch (e) {
            // ignore and fall back to tsParticles
          }
        }

        // Initialize the tsParticles engine as a fallback
        await loadFull(tsParticles);

        // Initialize particles if tsParticles is available
        if (containerRef.current) {
          const configToUse = finalConfig || defaultConfigs[theme];

          if (tsParticles && typeof tsParticles.load === 'function') {
            try {
              await tsParticles.load(containerIdFinal, configToUse);
            } catch (e) {
              // ignore
            }
          }
          initialized.current = true;
        }
      } catch (error) {
        console.error('Error initializing particles:', error);
      }
    };
    
    initParticles();
    
    // Cleanup function
    return () => {
      if (initialized.current) {
        // Destroy particles instance on unmount
        const instance = tsParticles.domItem(id);
        if (instance) {
          instance.destroy();
          initialized.current = false;
        }
      }
    };
  }, [id, containerId, containerIdFinal, config, customConfig, finalConfig, theme, defaultConfigs]);

  // Update particles when theme changes
  useEffect(() => {
    if (initialized.current) {
      const updateParticles = async () => {
        try {
          const instance = tsParticles && typeof tsParticles.domItem === 'function' ? tsParticles.domItem(containerIdFinal) : null;
          if (instance) {
            // Destroy the existing instance
            instance.destroy();
            initialized.current = false;

            // Create a new one with updated theme
            const config = customConfig || defaultConfigs[theme];
            // Prefer legacy particlesJS when present, otherwise use tsParticles
            if (typeof window.particlesJS === 'function') {
              try { window.particlesJS(containerIdFinal, config); } catch (e) { /* ignore */ }
            } else if (tsParticles && typeof tsParticles.load === 'function') {
              await tsParticles.load(containerIdFinal, config);
            }
            initialized.current = true;
          }
        } catch (error) {
          console.error('Error reinitializing particles:', error);
        }
      };
      
      updateParticles();
    }
  }, [theme, id, containerId, containerIdFinal, config, customConfig, finalConfig, defaultConfigs]);

  return (
    <div 
      id={containerIdFinal}
      ref={containerRef}
      className={`${styles.container} ${className}`}
      data-testid="particle-background"
      {...props}
    />
  );
};

ParticleBackground.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  customConfig: PropTypes.object,
};

export default ParticleBackground;
