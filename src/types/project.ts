/**
 * Types for Portfolio Projects
 * Defines the structure of project data and related interfaces
 */

export interface ProjectTag {
  name: string;
  category?: 'frontend' | 'backend' | 'devops' | 'design' | 'other';
}

export interface ProjectLink {
  type: 'github' | 'live' | 'demo' | 'documentation';
  url: string;
  label?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  tags: string[];
  color: number; // Hexadecimal color for Three.js
  image: string;
  links?: ProjectLink[];
  featured?: boolean;
  year?: number;
  role?: string;
}

export interface ProjectMeshUserData extends Project {
  index: number;
  originalPosition: { x: number; y: number; z: number };
  originalRotation: { x: number; y: number; z: number };
}
