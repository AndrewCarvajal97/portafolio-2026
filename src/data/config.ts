/**
 * Carousel and Scene Configuration
 *
 * Central configuration file for all 3D scene parameters.
 * Adjust these values to customize the carousel appearance and behavior.
 */

import type { CarouselConfig, CameraConfig, LightConfig } from '../types/carousel';

export const CAROUSEL_CONFIG: CarouselConfig = {
  // Carousel geometry
  radius: 6,
  cardWidth: 4,
  cardHeight: 2.5,

  // Animation settings
  autoRotateSpeed: 0.001,
  dragSensitivity: 0.005,
  dampingFactor: 0.05,

  // Camera focus
  focusDistance: 1.5,

  // Scene atmosphere
  fogNear: 5,
  fogFar: 20,
  backgroundColor: 0x0a0a0c,
  accentColor: 0x00d4ff
};

export const CAMERA_CONFIG: CameraConfig = {
  fov: 75,
  near: 0.1,
  far: 1000,
  position: { x: 0, y: 1, z: 12 }
};

export const LIGHT_CONFIG: LightConfig = {
  ambient: {
    color: 0xffffff,
    intensity: 0.5
  },
  point: {
    color: 0x00d4ff,
    intensity: 1,
    position: { x: 5, y: 5, z: 5 }
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
