/**
 * Types for 3D Carousel Configuration
 * Defines configuration options and state interfaces
 */

import type * as THREE from 'three';
import type { Project } from './project';

export interface CarouselConfig {
  radius: number;
  cardWidth: number;
  cardHeight: number;
  autoRotateSpeed: number;
  dragSensitivity: number;
  dampingFactor: number;
  focusDistance: number;
  fogNear: number;
  fogFar: number;
  backgroundColor: number;
  accentColor: number;
}

export interface CameraConfig {
  fov: number;
  near: number;
  far: number;
  position: { x: number; y: number; z: number };
}

export interface LightConfig {
  ambient: {
    color: number;
    intensity: number;
  };
  point: {
    color: number;
    intensity: number;
    position: { x: number; y: number; z: number };
  };
}

export interface CarouselState {
  isDragging: boolean;
  previousMouseX: number;
  targetRotation: number;
  currentRotation: number;
  activeProject: THREE.Mesh | null;
  isAnimating: boolean;
}

export interface SceneElements {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  carousel: THREE.Group;
  projectMeshes: THREE.Mesh[];
}

export type CarouselEventType =
  | 'projectSelect'
  | 'projectDeselect'
  | 'rotationStart'
  | 'rotationEnd'
  | 'animationComplete';

export interface CarouselEvent {
  type: CarouselEventType;
  project?: Project;
  mesh?: THREE.Mesh;
}

export type CarouselEventHandler = (event: CarouselEvent) => void;
