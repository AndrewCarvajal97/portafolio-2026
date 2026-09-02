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
import { getResponsiveCarouselConfig, getResponsiveCameraConfig, ANIMATION_DURATION } from '../../../data/config';
import { trackProjectOpen } from '../../analytics';
import type { Project } from '../../../types/project';
import type { CarouselState, CarouselEvent, CarouselEventHandler, CarouselConfig, CameraConfig } from '../../../types/carousel';

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
  private config: CarouselConfig;
  private cameraConfig: CameraConfig;

  constructor(projects: Project[]) {
    this.sceneManager = SceneManager.getInstance();
    this.group = new THREE.Group();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.config = getResponsiveCarouselConfig();
    this.cameraConfig = getResponsiveCameraConfig();

    this.state = {
      isDragging: false,
      previousMouseX: 0,
      previousMouseY: 0,
      targetRotation: 0,
      currentRotation: 0,
      targetRotationX: 0,
      currentRotationX: 0,
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
      // Apply damping to Y-rotation
      this.state.currentRotation +=
        (this.state.targetRotation - this.state.currentRotation) *
        this.config.dampingFactor;

      // Apply damping to X-rotation (vertical tilt)
      this.state.currentRotationX +=
        (this.state.targetRotationX - this.state.currentRotationX) *
        this.config.dampingFactor;

      this.group.rotation.y = this.state.currentRotation;
      this.group.rotation.x = this.state.currentRotationX;

      // Auto-rotate when not dragging
      if (!this.state.isDragging) {
        this.state.targetRotation += this.config.autoRotateSpeed;
      }
    }
  };

  /**
   * Handle mouse/touch start
   */
  onDragStart(clientX: number, clientY: number = 0): void {
    if (this.state.activeProject) return;
    this.state.previousMouseX = clientX;
    this.state.previousMouseY = clientY;
  }

  /**
   * Handle mouse/touch move (called by InputController when mouse is down)
   */
  onDragMove(clientX: number, clientY: number = this.state.previousMouseY): void {
    if (this.state.activeProject) return;

    const deltaX = clientX - this.state.previousMouseX;
    const deltaY = clientY - this.state.previousMouseY;

    if (Math.abs(deltaX) > 0 || Math.abs(deltaY) > 0) {
      if (!this.state.isDragging) {
        this.state.isDragging = true;
        this.emit({ type: 'rotationStart' });
      }
      // Horizontal drag → rotate around Y axis
      this.state.targetRotation += deltaX * this.config.dragSensitivity;

      // Vertical drag → tilt around X axis, clamped so cards stay readable
      const X_LIMIT = 0.45; // ~26°
      this.state.targetRotationX = Math.max(
        -X_LIMIT,
        Math.min(
          X_LIMIT,
          this.state.targetRotationX + deltaY * this.config.dragSensitivity * 0.6
        )
      );
    }
    this.state.previousMouseX = clientX;
    this.state.previousMouseY = clientY;
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
    if (this.state.isAnimating) return;

    this.mouse.x = (clientX / width) * 2 - 1;
    this.mouse.y = -(clientY / height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.sceneManager.getCamera());
    const intersects = this.raycaster.intersectObjects(this.group.children, true);

    if (intersects.length > 0) {
      let targetObject: THREE.Object3D | null = intersects[0].object;

      while (targetObject && !targetObject.userData?.id) {
        targetObject = targetObject.parent;
      }

      if (!targetObject || !targetObject.userData?.id) {
        targetObject = intersects[0].object;
      }

      if (targetObject && targetObject.userData && targetObject.userData.id) {
        this.focusOnProject(targetObject as THREE.Mesh);
      } else {
        const clickedCard = this.cards.find(card => {
          const cardMesh = card.getMesh();
          return cardMesh === intersects[0].object ||
                 cardMesh.children.includes(intersects[0].object as THREE.Object3D);
        });
        if (clickedCard) {
          this.focusOnProject(clickedCard.getMesh());
        }
      }
    }
  }

  /**
   * Handle mouse move for hover effects and 3D tilt
   */
  onMouseMove(clientX: number, clientY: number, width: number, height: number): void {
    if (this.state.activeProject) return;

    this.mouse.x = (clientX / width) * 2 - 1;
    this.mouse.y = -(clientY / height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.sceneManager.getCamera());
    const intersects = this.raycaster.intersectObjects(this.group.children, true);

    // Find currently hovered card
    let newHoveredCard: typeof this.cards[0] | null = null;

    if (intersects.length > 0) {
      // Find the parent card mesh
      let targetObject = intersects[0].object;
      while (targetObject.parent && targetObject.parent !== this.group) {
        targetObject = targetObject.parent as THREE.Mesh;
      }

      newHoveredCard = this.cards.find(card => card.getMesh() === targetObject) || null;
    }

    // Only update hover states if the hovered card changed
    this.cards.forEach(card => {
      const shouldBeHovered = card === newHoveredCard;
      const isCurrentlyHovered = card.getIsHovered();

      if (shouldBeHovered !== isCurrentlyHovered) {
        card.setHovered(shouldBeHovered);
        if (!shouldBeHovered) {
          card.resetTilt();
        }
      }
    });

    // Apply tilt effect to hovered card
    if (newHoveredCard && intersects.length > 0) {
      const intersect = intersects[0];
      if (intersect.uv) {
        const normalizedX = (intersect.uv.x - 0.5) * 2;
        const normalizedY = (intersect.uv.y - 0.5) * 2;
        newHoveredCard.applyTilt(normalizedX, normalizedY);
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

    this.cards.forEach(card => {
      if (card.getMesh() === mesh) {
        card.setSelected(true);
      } else {
        card.setDimmed(true);
      }
    });

    const meshWorldPos = new THREE.Vector3();
    mesh.getWorldPosition(meshWorldPos);

    const direction = meshWorldPos.clone().normalize();
    const targetPosition = new THREE.Vector3(
      meshWorldPos.x - direction.x * 2 - 2,
      meshWorldPos.y + 0.3,
      meshWorldPos.z - direction.z * 2 + 4
    );

    const lookAtTarget = meshWorldPos.clone();

    this.emit({
      type: 'projectSelect',
      project,
      mesh
    });

    // Analytics: which project the user just opened.
    trackProjectOpen(project.id, project.title);

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
      })
      .start();

    this.activeTweens.push(cameraTween);

    setTimeout(() => {
      if (this.state.isAnimating && this.state.activeProject === mesh) {
        this.state.isAnimating = false;
      }
    }, ANIMATION_DURATION.cameraFocus + 500);
  }

  /**
   * Reset camera to original position
   */
  resetView(): void {
    if (!this.state.activeProject) return;

    const previousProject = this.state.activeProject.userData as Project;

    this.state.activeProject = null;
    this.state.isAnimating = false;

    this.cards.forEach(card => {
      card.setSelected(false);
      card.setDimmed(false);
    });

    this.emit({
      type: 'projectDeselect',
      project: previousProject
    });

    const camera = this.sceneManager.getCamera();
    const centerTarget = new THREE.Vector3(0, 0, 0);

    const responsiveCameraConfig = getResponsiveCameraConfig();

    const cameraTween = new Tween(camera.position)
      .to(
        {
          x: responsiveCameraConfig.position.x,
          y: responsiveCameraConfig.position.y,
          z: responsiveCameraConfig.position.z
        },
        ANIMATION_DURATION.cameraReset
      )
      .easing(Easing.Quadratic.Out)
      .onUpdate(() => {
        camera.lookAt(centerTarget);
      })
      .start();

    this.activeTweens.push(cameraTween);
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
   * Get the index of the card currently facing the camera
   */
  getCurrentIndex(): number {
    if (this.cards.length === 0) return 0;
    const anglePerCard = (2 * Math.PI) / this.cards.length;
    const normalizedRotation = ((this.state.currentRotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    return Math.round(normalizedRotation / anglePerCard) % this.cards.length;
  }

  /**
   * Navigate to the next project card
   */
  next(): void {
    if (this.state.activeProject || this.state.isAnimating) return;
    const anglePerCard = (2 * Math.PI) / this.cards.length;
    this.state.targetRotation += anglePerCard;
  }

  /**
   * Navigate to the previous project card
   */
  prev(): void {
    if (this.state.activeProject || this.state.isAnimating) return;
    const anglePerCard = (2 * Math.PI) / this.cards.length;
    this.state.targetRotation -= anglePerCard;
  }

  /**
   * Select the project card currently facing the camera
   */
  selectCurrentProject(): void {
    if (this.state.activeProject || this.state.isAnimating) return;
    const index = this.getCurrentIndex();
    if (index >= 0 && index < this.cards.length) {
      this.focusOnProject(this.cards[index].getMesh());
    }
  }

  /**
   * Get the project at the current front-facing index
   */
  getCurrentProject(): Project | null {
    const index = this.getCurrentIndex();
    if (index >= 0 && index < this.cards.length) {
      return this.cards[index].getProject();
    }
    return null;
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
