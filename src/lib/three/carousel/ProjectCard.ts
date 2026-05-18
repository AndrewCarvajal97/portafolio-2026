/**
 * Project Card
 *
 * Creates a 3D card mesh for displaying a project in the carousel.
 * Handles texture loading, material creation, and visual effects.
 */

import * as THREE from 'three';
import { Tween, Easing } from '@tweenjs/tween.js';
import { getResponsiveCarouselConfig } from '../../../data/config';
import type { Project, ProjectMeshUserData } from '../../../types/project';
import type { CarouselConfig } from '../../../types/carousel';

export class ProjectCard {
  private mesh: THREE.Mesh;
  private edgeMesh: THREE.LineSegments;
  private glowMesh: THREE.Mesh | null = null;
  private project: Project;
  private index: number;
  private isHovered = false;
  private textureLoader: THREE.TextureLoader;
  private config: CarouselConfig;
  private hoverTween: Tween<any> | null = null;
  private baseRotation = { x: 0, y: 0 };
  private hoverOffset = { x: 0, y: 0, z: 0 };

  constructor(project: Project, index: number, totalProjects: number) {
    this.project = project;
    this.index = index;
    this.textureLoader = new THREE.TextureLoader();
    this.textureLoader.crossOrigin = 'anonymous';
    this.config = getResponsiveCarouselConfig();

    // Create main mesh
    this.mesh = this.createMesh();
    this.edgeMesh = this.createEdges();
    this.mesh.add(this.edgeMesh);

    // Distribute cards on a multi-ring cylinder when there are enough to crowd
    // a single ring; fall back to a flat circle for small portfolios.
    if (totalProjects > 8) {
      this.positionOnCylinder(index, totalProjects);
    } else {
      const angle = (index / totalProjects) * Math.PI * 2;
      this.positionInCircle(angle);
    }

    // Store user data for raycasting
    this.setupUserData();

    // Load texture asynchronously
    this.loadTexture();
  }

  /**
   * Create the main card mesh
   */
  private createMesh(): THREE.Mesh {
    const geometry = new THREE.PlaneGeometry(
      this.config.cardWidth,
      this.config.cardHeight,
      1,
      1
    );

    // Create material - white base color so textures show correctly
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      emissive: new THREE.Color(this.project.color),
      emissiveIntensity: 0.05,
      roughness: 0.5,
      metalness: 0.1
    });

    return new THREE.Mesh(geometry, material);
  }

  /**
   * Create glowing edges for the card
   */
  private createEdges(): THREE.LineSegments {
    const edgesGeometry = new THREE.EdgesGeometry(
      new THREE.PlaneGeometry(
        this.config.cardWidth,
        this.config.cardHeight
      )
    );

    const edgesMaterial = new THREE.LineBasicMaterial({
      color: this.project.color,
      transparent: true,
      opacity: 0.9
    });

    return new THREE.LineSegments(edgesGeometry, edgesMaterial);
  }

  /**
   * Add a colored overlay with project title indicator
   */
  private addTitleOverlay(): void {
    // Create a smaller plane at the bottom for title area
    const overlayHeight = this.config.cardHeight < 2 ? 0.25 : 0.4;
    const overlayGeometry = new THREE.PlaneGeometry(
      this.config.cardWidth,
      overlayHeight
    );

    const overlayMaterial = new THREE.MeshBasicMaterial({
      color: this.project.color,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide
    });

    const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
    overlay.position.y = -this.config.cardHeight / 2 + overlayHeight / 2;
    overlay.position.z = 0.01;
    this.mesh.add(overlay);
  }

  /**
   * Create outer glow effect
   */
  private createGlow(): THREE.Mesh {
    const glowSize = this.config.cardWidth < 3 ? 0.15 : 0.3;
    const glowGeometry = new THREE.PlaneGeometry(
      this.config.cardWidth + glowSize,
      this.config.cardHeight + glowSize
    );

    const glowMaterial = new THREE.MeshBasicMaterial({
      color: this.project.color,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide
    });

    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.z = -0.02;
    return glow;
  }

  /**
   * Position the card in a circle
   */
  private positionInCircle(angle: number): void {
    this.mesh.position.x = Math.sin(angle) * this.config.radius;
    this.mesh.position.z = Math.cos(angle) * this.config.radius;
    this.mesh.position.y = 0;

    // Look at center
    this.mesh.lookAt(0, 0, 0);
  }

  /**
   * Position the card on a multi-ring cylinder. All cards share the same
   * radial distance, only Y differs across rings. Each card looks at the
   * cylinder axis at its own Y level, so cards stay upright with no tilt.
   * Alternating rings are offset by half a slot for a honeycomb feel.
   */
  private positionOnCylinder(index: number, total: number): void {
    const radius = this.config.radius;

    // Pick rings/cols based on total. Aim for ~5 cards per ring.
    const perRing = Math.max(4, Math.ceil(Math.sqrt(total * 1.6)));
    const ringCount = Math.ceil(total / perRing);

    const ring = Math.floor(index / perRing);
    const col = index % perRing;

    const verticalSpacing = this.config.cardHeight * 1.5;
    const y = (ringCount - 1) / 2 * verticalSpacing - ring * verticalSpacing;

    const angleOffset = (ring % 2) * (Math.PI / perRing);
    const angle = (col / perRing) * Math.PI * 2 + angleOffset;

    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;

    this.mesh.position.set(x, y, z);
    // Look at the cylinder axis at the same Y, so the card stays vertical.
    this.mesh.lookAt(0, y, 0);
  }

  /**
   * Store project data and original transforms in userData
   */
  private setupUserData(): void {
    const userData: ProjectMeshUserData = {
      ...this.project,
      index: this.index,
      originalPosition: {
        x: this.mesh.position.x,
        y: this.mesh.position.y,
        z: this.mesh.position.z
      },
      originalRotation: {
        x: this.mesh.rotation.x,
        y: this.mesh.rotation.y,
        z: this.mesh.rotation.z
      }
    };
    this.mesh.userData = userData;
  }

  /**
   * Load and apply the project image as texture
   */
  private loadTexture(): void {
    // Use a data URL for a gradient placeholder if image fails
    const createGradientTexture = (): THREE.Texture => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 320;
      const ctx = canvas.getContext('2d')!;

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      const color = new THREE.Color(this.project.color);
      gradient.addColorStop(0, `rgba(${Math.floor(color.r * 255)}, ${Math.floor(color.g * 255)}, ${Math.floor(color.b * 255)}, 0.3)`);
      gradient.addColorStop(1, 'rgba(20, 20, 35, 0.9)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add project title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px Inter, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Word wrap title
      const words = this.project.title.split(' ');
      let line = '';
      let y = canvas.height / 2 - 20;
      const lineHeight = 40;
      const maxWidth = canvas.width - 60;

      for (const word of words) {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && line !== '') {
          ctx.fillText(line.trim(), canvas.width / 2, y);
          line = word + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line.trim(), canvas.width / 2, y);

      // Add subtle grid pattern
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };

    // Try to load external image first
    this.textureLoader.load(
      this.project.image,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        const material = this.mesh.material as THREE.MeshStandardMaterial;
        material.map = texture;
        material.needsUpdate = true;
        console.log(`Loaded texture for: ${this.project.title}`);
      },
      undefined,
      () => {
        // On error, use gradient placeholder
        console.log(`Using placeholder for: ${this.project.title}`);
        const material = this.mesh.material as THREE.MeshStandardMaterial;
        material.map = createGradientTexture();
        material.needsUpdate = true;
      }
    );
  }

  /**
   * Get the Three.js mesh
   */
  getMesh(): THREE.Mesh {
    return this.mesh;
  }

  /**
   * Get the project data
   */
  getProject(): Project {
    return this.project;
  }

  /**
   * Get hover state
   */
  getIsHovered(): boolean {
    return this.isHovered;
  }

  /**
   * Set hover state with visual feedback and 3D tilt effect
   */
  setHovered(hovered: boolean): void {
    if (this.isHovered === hovered) return;
    this.isHovered = hovered;

    const material = this.mesh.material as THREE.MeshStandardMaterial;
    const edgeMaterial = this.edgeMesh.material as THREE.LineBasicMaterial;

    // Stop any existing hover animation
    if (this.hoverTween) {
      this.hoverTween.stop();
      this.hoverTween = null;
    }

    if (hovered) {
      material.emissiveIntensity = 0.15;
      edgeMaterial.opacity = 1;

      // Add glow effect
      if (!this.glowMesh) {
        this.glowMesh = this.createGlow();
        this.mesh.add(this.glowMesh);
      }

      // 3D hover effect - move card forward and add subtle tilt
      this.hoverTween = new Tween(this.hoverOffset)
        .to({ x: 0, y: 0, z: 0.8 }, 300)
        .easing(Easing.Quadratic.Out)
        .onUpdate(() => {
          // Apply offset relative to card's local space
          const forward = new THREE.Vector3(0, 0, 1);
          forward.applyQuaternion(this.mesh.quaternion);

          const userData = this.mesh.userData as ProjectMeshUserData;
          this.mesh.position.set(
            userData.originalPosition.x + forward.x * this.hoverOffset.z,
            userData.originalPosition.y + forward.y * this.hoverOffset.z + 0.1,
            userData.originalPosition.z + forward.z * this.hoverOffset.z
          );
        })
        .start();

      // Scale up slightly
      new Tween(this.mesh.scale)
        .to({ x: 1.08, y: 1.08, z: 1.08 }, 300)
        .easing(Easing.Quadratic.Out)
        .start();

    } else {
      material.emissiveIntensity = 0.05;
      edgeMaterial.opacity = 0.9;

      // Remove glow effect
      if (this.glowMesh) {
        this.mesh.remove(this.glowMesh);
        this.glowMesh.geometry.dispose();
        (this.glowMesh.material as THREE.Material).dispose();
        this.glowMesh = null;
      }

      // Reset position
      this.hoverTween = new Tween(this.hoverOffset)
        .to({ x: 0, y: 0, z: 0 }, 300)
        .easing(Easing.Quadratic.Out)
        .onUpdate(() => {
          const forward = new THREE.Vector3(0, 0, 1);
          forward.applyQuaternion(this.mesh.quaternion);

          const userData = this.mesh.userData as ProjectMeshUserData;
          this.mesh.position.set(
            userData.originalPosition.x + forward.x * this.hoverOffset.z,
            userData.originalPosition.y + forward.y * this.hoverOffset.z,
            userData.originalPosition.z + forward.z * this.hoverOffset.z
          );
        })
        .start();

      // Scale back to normal
      new Tween(this.mesh.scale)
        .to({ x: 1, y: 1, z: 1 }, 300)
        .easing(Easing.Quadratic.Out)
        .start();
    }
  }

  /**
   * Apply 3D tilt based on mouse position relative to card center
   */
  applyTilt(normalizedX: number, normalizedY: number): void {
    if (!this.isHovered) return;

    const maxTilt = 0.15; // Max tilt in radians
    const tiltX = -normalizedY * maxTilt;
    const tiltY = normalizedX * maxTilt;

    const userData = this.mesh.userData as ProjectMeshUserData;

    // Create a rotation that tilts around the card's local axes
    const targetRotation = new THREE.Euler(
      userData.originalRotation.x + tiltX,
      userData.originalRotation.y + tiltY,
      userData.originalRotation.z
    );

    // Smooth interpolation
    this.mesh.rotation.x += (targetRotation.x - this.mesh.rotation.x) * 0.15;
    this.mesh.rotation.y += (targetRotation.y - this.mesh.rotation.y) * 0.15;
  }

  /**
   * Reset tilt to original rotation
   */
  resetTilt(): void {
    const userData = this.mesh.userData as ProjectMeshUserData;

    new Tween({ x: this.mesh.rotation.x, y: this.mesh.rotation.y })
      .to({ x: userData.originalRotation.x, y: userData.originalRotation.y }, 300)
      .easing(Easing.Quadratic.Out)
      .onUpdate((obj) => {
        this.mesh.rotation.x = obj.x;
        this.mesh.rotation.y = obj.y;
      })
      .start();
  }

  /**
   * Set card as selected (highlighted) or dimmed
   */
  setSelected(selected: boolean): void {
    const material = this.mesh.material as THREE.MeshStandardMaterial;
    const edgeMaterial = this.edgeMesh.material as THREE.LineBasicMaterial;

    if (selected) {
      // Highlight the selected card
      material.emissiveIntensity = 0.2;
      material.opacity = 1;
      material.transparent = false;
      edgeMaterial.opacity = 1;

      // Add strong glow
      if (!this.glowMesh) {
        this.glowMesh = this.createGlow();
        this.mesh.add(this.glowMesh);
      }
      (this.glowMesh.material as THREE.MeshBasicMaterial).opacity = 0.4;
    } else {
      // Reset to normal state
      material.emissiveIntensity = 0.05;
      material.opacity = 1;
      material.transparent = false;
      edgeMaterial.opacity = 0.9;

      if (this.glowMesh) {
        this.mesh.remove(this.glowMesh);
        this.glowMesh.geometry.dispose();
        (this.glowMesh.material as THREE.Material).dispose();
        this.glowMesh = null;
      }
    }
  }

  /**
   * Dim this card (when another card is selected)
   */
  setDimmed(dimmed: boolean): void {
    const material = this.mesh.material as THREE.MeshStandardMaterial;
    const edgeMaterial = this.edgeMesh.material as THREE.LineBasicMaterial;

    if (dimmed) {
      material.opacity = 0.2;
      material.transparent = true;
      material.emissiveIntensity = 0.02;
      edgeMaterial.opacity = 0.2;
    } else {
      material.opacity = 1;
      material.transparent = false;
      material.emissiveIntensity = 0.05;
      edgeMaterial.opacity = 0.9;
    }
  }

  /**
   * Dispose of resources
   */
  dispose(): void {
    this.mesh.geometry.dispose();

    const material = this.mesh.material as THREE.MeshStandardMaterial;
    if (material.map) material.map.dispose();
    material.dispose();

    this.edgeMesh.geometry.dispose();
    (this.edgeMesh.material as THREE.Material).dispose();

    if (this.glowMesh) {
      this.glowMesh.geometry.dispose();
      (this.glowMesh.material as THREE.Material).dispose();
    }
  }
}
