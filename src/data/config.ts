/**
 * Carousel and Scene Configuration
 *
 * Central configuration file for all 3D scene parameters.
 * Adjust these values to customize the carousel appearance and behavior.
 */

import type { CarouselConfig, CameraConfig, LightConfig } from '../types/carousel';

/**
 * Get responsive carousel configuration based on screen width
 */
export function getResponsiveCarouselConfig(): CarouselConfig {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const isSmallMobile = width < 480;
  const isMobile = width < 768;

  if (isSmallMobile) {
    return {
      radius: 5,
      cardWidth: 1.8,
      cardHeight: 1.15,
      autoRotateSpeed: 0.0015,
      dragSensitivity: 0.008,
      dampingFactor: 0.05,
      focusDistance: 1,
      fogNear: 3,
      fogFar: 15,
      backgroundColor: 0x0a0a0c,
      accentColor: 0x00d4ff
    };
  }

  if (isMobile) {
    return {
      radius: 5.5,
      cardWidth: 2.3,
      cardHeight: 1.45,
      autoRotateSpeed: 0.0012,
      dragSensitivity: 0.007,
      dampingFactor: 0.05,
      focusDistance: 1.2,
      fogNear: 4,
      fogFar: 18,
      backgroundColor: 0x0a0a0c,
      accentColor: 0x00d4ff
    };
  }

  return CAROUSEL_CONFIG;
}

export const CAROUSEL_CONFIG: CarouselConfig = {
  // Carousel geometry
  radius: 7.5,
  cardWidth: 3.2,
  cardHeight: 2,

  // Animation settings
  autoRotateSpeed: 0.001,
  dragSensitivity: 0.005,
  dampingFactor: 0.05,

  // Camera focus
  focusDistance: 1.5,

  // Scene atmosphere
  fogNear: 8,
  fogFar: 28,
  backgroundColor: 0x0a0a0c,
  accentColor: 0x00d4ff
};

export const CAMERA_CONFIG: CameraConfig = {
  fov: 75,
  near: 0.1,
  far: 1000,
  position: { x: 0, y: 0, z: 14 }
};

/**
 * Get responsive camera configuration based on screen width
 */
export function getResponsiveCameraConfig(): CameraConfig {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const isSmallMobile = width < 480;
  const isMobile = width < 768;

  if (isSmallMobile) {
    return {
      fov: 75,
      near: 0.1,
      far: 1000,
      position: { x: 0, y: -0.5, z: 9 }
    };
  }

  if (isMobile) {
    return {
      fov: 75,
      near: 0.1,
      far: 1000,
      position: { x: 0, y: -0.3, z: 10 }
    };
  }

  return CAMERA_CONFIG;
}

export const LIGHT_CONFIG: LightConfig = {
  ambient: {
    color: 0xffffff,
    intensity: 1.2
  },
  point: {
    color: 0xffffff,
    intensity: 0.8,
    position: { x: 0, y: 3, z: 10 }
  }
};

// Animation timing (in milliseconds)
export const ANIMATION_DURATION = {
  cameraFocus: 1000,
  cameraReset: 1000,
  cardHover: 300,
  fadeIn: 500,
  fadeOut: 300
};

// Easing functions identifiers for TWEEN
export const EASING = {
  default: 'Quadratic.Out',
  smooth: 'Cubic.InOut',
  bounce: 'Bounce.Out'
};
