/**
 * Carousel
 *
 * Main carousel controller that manages the 3D project cards,
 * rotation, and project selection.
 */

import * as THREE from 'three';
import { Tween, Easing } from '@tweenjs/tween.js';
import { ProjectCard } from './ProjectCard';
import { SceneManager } from '../core/SceneManager';
import { CAROUSEL_CONFIG, ANIMATION_DURATION, CAMERA_CONFIG } from '../../../data/config';
import type { Project } from '../../../types/project';
import type { CarouselState, CarouselEvent, CarouselEventHandler } from '../../../types/carousel';

export class Carousel {
  private group: THREE.Group;
  private cards: ProjectCard[] = [];
  private sceneManager: SceneManager;
  private state: CarouselState;
  private eventListeners: Map<string, Set<CarouselEventHandler>> = new Map();
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private activeTweens: Tween<any>[] = [];
  private renderUnsubscribe: (() => void) | null = null;

  constructor(projects: Project[]) {
    this.sceneManager = SceneManager.getInstance();
    this.group = new THREE.Group();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.state = {
      isDragging: false,
      previousMouseX: 0,
      targetRotation: 0,
      currentRotation: 0,
      activeProject: null,
      isAnimating: false
    };

    // Create project cards
    this.createCards(projects);

    // Add group to scene
    this.sceneManager.add(this.group);

    // Register render callback
    this.renderUnsubscribe = this.sceneManager.onRender(this.update);
  }

  /**
   * Create all project cards
   */
  private createCards(projects: Project[]): void {
    projects.forEach((project, index) => {
      const card = new ProjectCard(project, index, projects.length);
      this.cards.push(card);
      this.group.add(card.getMesh());
    });
  }

  /**
   * Update loop - called every frame
   */
  private update = (): void => {
    // Update all active tweens
    this.activeTweens = this.activeTweens.filter(tween => tween.isPlaying());

    // Only rotate if no project is focused
    if (!this.state.activeProject) {
      // Apply damping to rotation
      this.state.currentRotation +=
        (this.state.targetRotation - this.state.currentRotation) *
        CAROUSEL_CONFIG.dampingFactor;

      this.group.rotation.y = this.state.currentRotation;

      // Auto-rotate when not dragging
      if (!this.state.isDragging) {
        this.state.targetRotation += CAROUSEL_CONFIG.autoRotateSpeed;
      }
    }
  };

  /**
   * Handle mouse/touch start
   */
  onDragStart(clientX: number): void {
    if (this.state.activeProject) return;
    this.state.previousMouseX = clientX;
  }

  /**
   * Handle mouse/touch move (called by InputController when mouse is down)
   */
  onDragMove(clientX: number): void {
    if (this.state.activeProject) return;

    const deltaX = clientX - this.state.previousMouseX;

    // Only start dragging if we moved significantly
    if (Math.abs(deltaX) > 0) {
      if (!this.state.isDragging) {
        this.state.isDragging = true;
        this.emit({ type: 'rotationStart' });
      }
      this.state.targetRotation += deltaX * CAROUSEL_CONFIG.dragSensitivity;
    }
    this.state.previousMouseX = clientX;
  }

  /**
   * Handle mouse/touch end
   */
  onDragEnd(): void {
    if (this.state.isDragging) {
      this.emit({ type: 'rotationEnd' });
    }
    this.state.isDragging = false;
  }

  /**
   * Handle click/tap to select project
   */
  onClick(clientX: number, clientY: number, width: number, height: number): void {
    console.log('Carousel.onClick called - isAnimating:', this.state.isAnimating);

    // Only check isAnimating - InputController handles drag detection
    if (this.state.isAnimating) {
      console.log('Carousel.onClick blocked - animating');
      return;
    }

    // Convert to normalized device coordinates
    this.mouse.x = (clientX / width) * 2 - 1;
    this.mouse.y = -(clientY / height) * 2 + 1;

    console.log('Mouse NDC:', this.mouse.x, this.mouse.y);

    // Raycast - use recursive to also check children
    this.raycaster.setFromCamera(this.mouse, this.sceneManager.getCamera());
    const intersects = this.raycaster.intersectObjects(this.group.children, true);

    console.log('Raycast intersects:', intersects.length);

    if (intersects.length > 0) {
      // Find the card mesh that has project data
      let targetObject: THREE.Object3D | null = intersects[0].object;

      // Walk up the hierarchy to find the mesh with userData.id (project identifier)
      while (targetObject && !targetObject.userData?.id) {
        targetObject = targetObject.parent;
      }

      // If we didn't find it walking up, the intersected object might be the card itself
      if (!targetObject || !targetObject.userData?.id) {
        targetObject = intersects[0].object;
      }

      console.log('Target object userData:', targetObject?.userData);

      // Verify it has project data (check for id which all projects have)
      if (targetObject && targetObject.userData && targetObject.userData.id) {
        this.focusOnProject(targetObject as THREE.Mesh);
      } else {
        console.log('No valid project data on clicked object. Looking for card in hierarchy...');
        // Last resort: find which card was clicked by checking all cards
        const clickedCard = this.cards.find(card => {
          const cardMesh = card.getMesh();
          return cardMesh === intersects[0].object ||
                 cardMesh.children.includes(intersects[0].object as THREE.Object3D);
        });
        if (clickedCard) {
          console.log('Found card by hierarchy search:', clickedCard.getProject().title);
          this.focusOnProject(clickedCard.getMesh());
        }
      }
    } else {
      console.log('No intersections found. Group children count:', this.group.children.length);
    }
  }

  /**
   * Handle mouse move for hover effects
   */
  onMouseMove(clientX: number, clientY: number, width: number, height: number): void {
    if (this.state.activeProject) return;

    this.mouse.x = (clientX / width) * 2 - 1;
    this.mouse.y = -(clientY / height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.sceneManager.getCamera());
    const intersects = this.raycaster.intersectObjects(this.group.children, true);

    // Reset all hover states
    this.cards.forEach(card => card.setHovered(false));

    // Set hover on intersected card
    if (intersects.length > 0) {
      // Find the parent card mesh
      let targetObject = intersects[0].object;
      while (targetObject.parent && targetObject.parent !== this.group) {
        targetObject = targetObject.parent as THREE.Mesh;
      }

      const hoveredCard = this.cards.find(
        card => card.getMesh() === targetObject
      );
      if (hoveredCard) {
        hoveredCard.setHovered(true);
      }
    }
  }

  /**
   * Focus camera on a specific project
   */
  private focusOnProject(mesh: THREE.Mesh): void {
    if (this.state.activeProject === mesh) return;

    this.state.activeProject = mesh;
    this.state.isAnimating = true;

    const camera = this.sceneManager.getCamera();
    const project = mesh.userData as Project;

    console.log('Focusing on project:', project.title);

    // Dim all other cards and highlight the selected one
    this.cards.forEach(card => {
      if (card.getMesh() === mesh) {
        card.setSelected(true);
      } else {
        card.setDimmed(true);
      }
    });

    // Get the world position of the mesh (accounting for group rotation)
    const meshWorldPos = new THREE.Vector3();
    mesh.getWorldPosition(meshWorldPos);

    console.log('Mesh world position:', meshWorldPos);

    // Calculate camera position - move to view the card from a good angle
    // Position camera to put card on the left side of screen
    const direction = meshWorldPos.clone().normalize();
    const targetPosition = new THREE.Vector3(
      meshWorldPos.x - direction.x * 2 - 2,  // Left of the card
      meshWorldPos.y + 0.3,                   // Slightly above
      meshWorldPos.z - direction.z * 2 + 4   // In front
    );

    // Look directly at the card
    const lookAtTarget = meshWorldPos.clone();

    console.log('Camera target position:', targetPosition);
    console.log('Look at target:', lookAtTarget);

    // Emit event IMMEDIATELY so UI can update
    this.emit({
      type: 'projectSelect',
      project,
      mesh
    });

    // Animate camera position
    const cameraTween = new Tween(camera.position)
      .to(
        {
          x: targetPosition.x,
          y: targetPosition.y,
          z: targetPosition.z
        },
        ANIMATION_DURATION.cameraFocus
      )
      .easing(Easing.Quadratic.Out)
      .onUpdate(() => {
        camera.lookAt(lookAtTarget);
      })
      .onComplete(() => {
        this.state.isAnimating = false;
        console.log('Camera animation complete');
      })
      .start();

    this.activeTweens.push(cameraTween);
    console.log('Camera tween started');

    // Safety timeout: if tween doesn't complete in expected time, reset isAnimating
    setTimeout(() => {
      if (this.state.isAnimating && this.state.activeProject === mesh) {
        console.log('Safety timeout: resetting isAnimating');
        this.state.isAnimating = false;
      }
    }, ANIMATION_DURATION.cameraFocus + 500);
  }

  /**
   * Reset camera to original position
   */
  resetView(): void {
    console.log('resetView called, activeProject:', this.state.activeProject ? 'yes' : 'no');

    if (!this.state.activeProject) return;

    const previousProject = this.state.activeProject.userData as Project;

    // Clear active project and isAnimating IMMEDIATELY so new clicks work
    this.state.activeProject = null;
    // Don't set isAnimating to true here - allow immediate interaction
    this.state.isAnimating = false;

    // Reset all cards to normal state
    this.cards.forEach(card => {
      card.setSelected(false);
      card.setDimmed(false);
    });

    // Emit deselect event IMMEDIATELY
    this.emit({
      type: 'projectDeselect',
      project: previousProject
    });

    const camera = this.sceneManager.getCamera();
    const centerTarget = new THREE.Vector3(0, 0, 0);

    // Animate camera back to original position
    const cameraTween = new Tween(camera.position)
      .to(
        {
          x: CAMERA_CONFIG.position.x,
          y: CAMERA_CONFIG.position.y,
          z: CAMERA_CONFIG.position.z
        },
        ANIMATION_DURATION.cameraReset
      )
      .easing(Easing.Quadratic.Out)
      .onUpdate(() => {
        camera.lookAt(centerTarget);
      })
      .onComplete(() => {
        console.log('Camera reset animation complete');
      })
      .start();

    this.activeTweens.push(cameraTween);
    console.log('Reset view started, isAnimating:', this.state.isAnimating);
  }

  /**
   * Get currently active project
   */
  getActiveProject(): Project | null {
    return this.state.activeProject?.userData as Project | null;
  }

  /**
   * Check if a project is currently focused
   */
  hasActiveProject(): boolean {
    return this.state.activeProject !== null;
  }

  /**
   * Subscribe to carousel events
   */
  on(eventType: CarouselEvent['type'], handler: CarouselEventHandler): () => void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set());
    }
    this.eventListeners.get(eventType)!.add(handler);

    return () => {
      this.eventListeners.get(eventType)?.delete(handler);
    };
  }

  /**
   * Emit an event to all listeners
   */
  private emit(event: CarouselEvent): void {
    this.eventListeners.get(event.type)?.forEach(handler => handler(event));
  }

  /**
   * Get all project cards
   */
  getCards(): ProjectCard[] {
    return this.cards;
  }

  /**
   * Dispose of all resources
   */
  dispose(): void {
    // Unsubscribe from render loop
    if (this.renderUnsubscribe) {
      this.renderUnsubscribe();
    }

    // Stop all tweens
    this.activeTweens.forEach(tween => tween.stop());
    this.activeTweens = [];

    // Dispose cards
    this.cards.forEach(card => card.dispose());
    this.cards = [];

    // Remove group from scene
    this.sceneManager.remove(this.group);

    // Clear event listeners
    this.eventListeners.clear();
  }
}
