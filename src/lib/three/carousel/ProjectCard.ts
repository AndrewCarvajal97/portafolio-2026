/**
 * Project Card
 *
 * Creates a 3D card mesh for displaying a project in the carousel.
 * Handles texture loading, material creation, and visual effects.
 */

import * as THREE from 'three';
import { CAROUSEL_CONFIG } from '../../../data/config';
import type { Project, ProjectMeshUserData } from '../../../types/project';

export class ProjectCard {
  private mesh: THREE.Mesh;
  private edgeMesh: THREE.LineSegments;
  private glowMesh: THREE.Mesh | null = null;
  private project: Project;
  private index: number;
  private isHovered = false;
  private textureLoader: THREE.TextureLoader;

  constructor(project: Project, index: number, totalProjects: number) {
    this.project = project;
    this.index = index;
    this.textureLoader = new THREE.TextureLoader();
    this.textureLoader.crossOrigin = 'anonymous';

    // Calculate position in carousel
    const angle = (index / totalProjects) * Math.PI * 2;

    // Create main mesh
    this.mesh = this.createMesh();
    this.edgeMesh = this.createEdges();
    this.mesh.add(this.edgeMesh);

    // Add title text plane
    this.addTitleOverlay();

    // Position in carousel circle
    this.positionInCircle(angle);

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
      CAROUSEL_CONFIG.cardWidth,
      CAROUSEL_CONFIG.cardHeight,
      1,
      1
    );

    // Create material with project color as base
    const material = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      side: THREE.DoubleSide,
      emissive: new THREE.Color(this.project.color),
      emissiveIntensity: 0.15,
      roughness: 0.3,
      metalness: 0.2
    });

    return new THREE.Mesh(geometry, material);
  }

  /**
   * Create glowing edges for the card
   */
  private createEdges(): THREE.LineSegments {
    const edgesGeometry = new THREE.EdgesGeometry(
      new THREE.PlaneGeometry(
        CAROUSEL_CONFIG.cardWidth,
        CAROUSEL_CONFIG.cardHeight
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
    const overlayGeometry = new THREE.PlaneGeometry(
      CAROUSEL_CONFIG.cardWidth,
      0.4
    );

    const overlayMaterial = new THREE.MeshBasicMaterial({
      color: this.project.color,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide
    });

    const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
    overlay.position.y = -CAROUSEL_CONFIG.cardHeight / 2 + 0.2;
    overlay.position.z = 0.01;
    this.mesh.add(overlay);
  }

  /**
   * Create outer glow effect
   */
  private createGlow(): THREE.Mesh {
    const glowGeometry = new THREE.PlaneGeometry(
      CAROUSEL_CONFIG.cardWidth + 0.3,
      CAROUSEL_CONFIG.cardHeight + 0.3
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
    this.mesh.position.x = Math.sin(angle) * CAROUSEL_CONFIG.radius;
    this.mesh.position.z = Math.cos(angle) * CAROUSEL_CONFIG.radius;
    this.mesh.position.y = 0;

    // Look at center
    this.mesh.lookAt(0, 0, 0);
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
   * Set hover state with visual feedback
   */
  setHovered(hovered: boolean): void {
    if (this.isHovered === hovered) return;
    this.isHovered = hovered;

    const material = this.mesh.material as THREE.MeshStandardMaterial;
    const edgeMaterial = this.edgeMesh.material as THREE.LineBasicMaterial;

    if (hovered) {
      material.emissiveIntensity = 0.35;
      edgeMaterial.opacity = 1;

      // Add glow effect
      if (!this.glowMesh) {
        this.glowMesh = this.createGlow();
        this.mesh.add(this.glowMesh);
      }
    } else {
      material.emissiveIntensity = 0.15;
      edgeMaterial.opacity = 0.9;

      // Remove glow effect
      if (this.glowMesh) {
        this.mesh.remove(this.glowMesh);
        this.glowMesh.geometry.dispose();
        (this.glowMesh.material as THREE.Material).dispose();
        this.glowMesh = null;
      }
    }
  }

  /**
   * Set card as selected (highlighted) or dimmed
   */
  setSelected(selected: boolean): void {
    const material = this.mesh.material as THREE.MeshStandardMaterial;
    const edgeMaterial = this.edgeMesh.material as THREE.LineBasicMaterial;

    if (selected) {
      // Highlight the selected card
      material.emissiveIntensity = 0.5;
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
      material.emissiveIntensity = 0.15;
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
      material.emissiveIntensity = 0.05;
      edgeMaterial.opacity = 0.2;
    } else {
      material.opacity = 1;
      material.transparent = false;
      material.emissiveIntensity = 0.15;
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
