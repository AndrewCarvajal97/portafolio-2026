/**
 * Scene Manager
 *
 * Handles Three.js scene initialization, rendering loop, and cleanup.
 * Implements the Singleton pattern for centralized scene management.
 */

import * as THREE from 'three';
import { update as tweenUpdate } from '@tweenjs/tween.js';
import { CAMERA_CONFIG, CAROUSEL_CONFIG, LIGHT_CONFIG, getResponsiveCameraConfig } from '../../../data/config';
import type { SceneElements } from '../../../types/carousel';

export class SceneManager {
  private static instance: SceneManager | null = null;

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private container: HTMLElement | null = null;
  private animationFrameId: number | null = null;
  private renderCallbacks: Set<(delta: number) => void> = new Set();
  private clock: THREE.Clock;
  private isRunning = false;

  private constructor() {
    this.scene = this.createScene();
    this.camera = this.createCamera();
    this.renderer = this.createRenderer();
    this.clock = new THREE.Clock();
    this.setupLights();
  }

  /**
   * Get the singleton instance
   */
  static getInstance(): SceneManager {
    if (!SceneManager.instance) {
      SceneManager.instance = new SceneManager();
    }
    return SceneManager.instance;
  }

  /**
   * Initialize the scene with a container element
   */
  initialize(container: HTMLElement): void {
    this.container = container;
    container.appendChild(this.renderer.domElement);
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  /**
   * Create the Three.js scene with fog
   */
  private createScene(): THREE.Scene {
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(
      CAROUSEL_CONFIG.backgroundColor,
      CAROUSEL_CONFIG.fogNear,
      CAROUSEL_CONFIG.fogFar
    );
    return scene;
  }

  /**
   * Create the perspective camera
   */
  private createCamera(): THREE.PerspectiveCamera {
    const { fov, near, far, position } = CAMERA_CONFIG;
    const camera = new THREE.PerspectiveCamera(
      fov,
      window.innerWidth / window.innerHeight,
      near,
      far
    );
    camera.position.set(position.x, position.y, position.z);
    return camera;
  }

  /**
   * Create the WebGL renderer
   */
  private createRenderer(): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    return renderer;
  }

  /**
   * Setup scene lighting
   */
  private setupLights(): void {
    // Ambient light for base illumination
    const ambientLight = new THREE.AmbientLight(
      LIGHT_CONFIG.ambient.color,
      LIGHT_CONFIG.ambient.intensity
    );
    this.scene.add(ambientLight);

    // Point light for highlights
    const pointLight = new THREE.PointLight(
      LIGHT_CONFIG.point.color,
      LIGHT_CONFIG.point.intensity
    );
    pointLight.position.set(
      LIGHT_CONFIG.point.position.x,
      LIGHT_CONFIG.point.position.y,
      LIGHT_CONFIG.point.position.z
    );
    this.scene.add(pointLight);

    // Secondary point light for better coverage
    const secondaryLight = new THREE.PointLight(0xffffff, 0.3);
    secondaryLight.position.set(-5, 3, -5);
    this.scene.add(secondaryLight);
  }

  /**
   * Handle window resize - adjusts camera for mobile
   */
  private handleResize = (): void => {
    if (!this.container) return;

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;

    // Get responsive camera config
    const responsiveConfig = getResponsiveCameraConfig();

    this.camera.position.set(
      responsiveConfig.position.x,
      responsiveConfig.position.y,
      responsiveConfig.position.z
    );
    this.camera.fov = responsiveConfig.fov;

    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  /**
   * Add object to scene
   */
  add(object: THREE.Object3D): void {
    this.scene.add(object);
  }

  /**
   * Remove object from scene
   */
  remove(object: THREE.Object3D): void {
    this.scene.remove(object);
  }

  /**
   * Register a callback to be called each frame
   */
  onRender(callback: (delta: number) => void): () => void {
    this.renderCallbacks.add(callback);
    return () => this.renderCallbacks.delete(callback);
  }

  /**
   * Start the render loop
   */
  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.clock.start();
    this.animate();
  }

  /**
   * Stop the render loop
   */
  stop(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Animation loop
   */
  private animate = (): void => {
    if (!this.isRunning) return;

    this.animationFrameId = requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();

    // Update all tweens - this is critical for animations to work
    tweenUpdate();

    // Execute all render callbacks
    this.renderCallbacks.forEach(callback => callback(delta));

    // Render the scene
    this.renderer.render(this.scene, this.camera);
  };

  /**
   * Get scene elements for external access
   */
  getElements(): Omit<SceneElements, 'carousel' | 'projectMeshes'> {
    return {
      scene: this.scene,
      camera: this.camera,
      renderer: this.renderer
    };
  }

  /**
   * Get the camera
   */
  getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  /**
   * Get the scene
   */
  getScene(): THREE.Scene {
    return this.scene;
  }

  /**
   * Get the renderer DOM element
   */
  getDomElement(): HTMLCanvasElement {
    return this.renderer.domElement;
  }

  /**
   * Cleanup and dispose resources
   */
  dispose(): void {
    this.stop();

    window.removeEventListener('resize', this.handleResize);

    // Dispose renderer
    this.renderer.dispose();

    // Clear scene
    this.scene.traverse(object => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });

    // Remove canvas from DOM
    if (this.container && this.renderer.domElement.parentNode) {
      this.container.removeChild(this.renderer.domElement);
    }

    // Reset singleton
    SceneManager.instance = null;
  }
}
