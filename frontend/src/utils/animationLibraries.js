/**
 * Animation Libraries Initialization
 * This file contains utility functions to verify the proper loading of animation libraries
 */

import anime from 'animejs';
import * as THREE from 'three';
import { gsap } from 'gsap';

/**
 * Verifies that Anime.js is properly initialized
 * @returns {boolean} True if Anime.js is initialized correctly
 */
export function verifyAnimeJs() {
  if (typeof anime === 'function' && anime.version) {
    console.log(`Anime.js loaded successfully. Version: ${anime.version}`);
    return true;
  }
  console.error('Anime.js not loaded correctly');
  return false;
}

/**
 * Verifies that Three.js is properly initialized
 * @returns {boolean} True if Three.js is initialized correctly
 */
export function verifyThreeJs() {
  if (THREE && THREE.REVISION) {
    console.log(`Three.js loaded successfully. Revision: ${THREE.REVISION}`);
    return true;
  }
  console.error('Three.js not loaded correctly');
  return false;
}

/**
 * Verifies that GSAP is properly initialized
 * @returns {boolean} True if GSAP is initialized correctly
 */
export function verifyGSAP() {
  if (gsap && gsap.version) {
    console.log(`GSAP loaded successfully. Version: ${gsap.version}`);
    return true;
  }
  console.error('GSAP not loaded correctly');
  return false;
}

/**
 * Runs all verifications
 * @returns {boolean} True if all libraries are initialized correctly
 */
export function verifyAllAnimationLibraries() {
  const animeResult = verifyAnimeJs();
  const threeResult = verifyThreeJs();
  const gsapResult = verifyGSAP();
  
  return animeResult && threeResult && gsapResult;
}
