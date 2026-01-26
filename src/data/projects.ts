/**
 * Portfolio Projects Data
 *
 * This file contains all project information displayed in the 3D carousel.
 * Modify this file to add, remove, or update projects.
 */

import type { Project } from '../types/project';

export const projects: Project[] = [
  {
    id: 'aia-landing',
    title: 'AIA Landing Page',
    description: 'Landing page moderna para plataforma de inteligencia artificial.',
    longDescription: 'Diseño y desarrollo de landing page para una plataforma de IA, con animaciones fluidas, diseño responsivo y optimización de rendimiento.',
    tags: ['React', 'TypeScript', 'TailwindCSS', 'Framer Motion'],
    color: 0x00d4ff,
    image: '/AIA-Landing.png',
    links: [
      { type: 'github', url: 'https://github.com/cosmopablocarvajal/aia-landing' },
      { type: 'live', url: 'https://aia-landing.com' }
    ],
    featured: true,
    year: 2024,
    role: 'Full Stack Developer'
  },
  {
    id: 'fintech-dashboard',
    title: 'FinTech Dashboard',
    description: 'Dashboard de an\u00e1lisis financiero con visualizaciones en tiempo real y predicciones IA.',
    longDescription: 'Aplicaci\u00f3n de an\u00e1lisis financiero que integra m\u00faltiples fuentes de datos, ofrece visualizaciones interactivas y utiliza machine learning para predicciones de mercado.',
    tags: ['TypeScript', 'Vue.js', 'Python', 'TensorFlow', 'D3.js'],
    color: 0xff00d4,
    image: 'https://picsum.photos/seed/fintech/600/400',
    links: [
      { type: 'github', url: 'https://github.com/username/fintech' },
      { type: 'demo', url: 'https://fintech-demo.com' }
    ],
    featured: true,
    year: 2024,
    role: 'Full Stack Developer'
  },
  {
    id: 'healthcare-app',
    title: 'Healthcare Management',
    description: 'Sistema de gesti\u00f3n hospitalaria con integraci\u00f3n de IoT y telemedicina.',
    longDescription: 'Plataforma integral para gesti\u00f3n hospitalaria que incluye historiales m\u00e9dicos electr\u00f3nicos, programaci\u00f3n de citas, integraci\u00f3n con dispositivos IoT para monitoreo de pacientes.',
    tags: ['React Native', 'GraphQL', 'MongoDB', 'MQTT', 'WebRTC'],
    color: 0x00ff88,
    image: 'https://picsum.photos/seed/healthcare/600/400',
    links: [
      { type: 'github', url: 'https://github.com/username/healthcare' }
    ],
    year: 2023,
    role: 'CTO & Technical Lead'
  },
  {
    id: 'devops-platform',
    title: 'DevOps Automation',
    description: 'Plataforma de automatizaci\u00f3n CI/CD con orquestaci\u00f3n de contenedores.',
    longDescription: 'Suite completa de herramientas DevOps que incluye pipelines de CI/CD personalizables, gesti\u00f3n de infraestructura como c\u00f3digo, y monitoreo centralizado de aplicaciones.',
    tags: ['Kubernetes', 'Terraform', 'Go', 'Prometheus', 'GitLab CI'],
    color: 0xffaa00,
    image: 'https://picsum.photos/seed/devops/600/400',
    links: [
      { type: 'github', url: 'https://github.com/username/devops' },
      { type: 'documentation', url: 'https://docs.devops-platform.com' }
    ],
    featured: true,
    year: 2024,
    role: 'Infrastructure Architect'
  },
  {
    id: 'ai-chatbot',
    title: 'AI Customer Service',
    description: 'Chatbot empresarial con procesamiento de lenguaje natural avanzado.',
    longDescription: 'Sistema de atenci\u00f3n al cliente potenciado por IA que maneja consultas complejas, se integra con sistemas CRM existentes y aprende continuamente de las interacciones.',
    tags: ['Python', 'FastAPI', 'LangChain', 'Redis', 'WebSockets'],
    color: 0xff4444,
    image: 'https://picsum.photos/seed/chatbot/600/400',
    links: [
      { type: 'github', url: 'https://github.com/username/ai-chatbot' },
      { type: 'demo', url: 'https://chatbot-demo.com' }
    ],
    year: 2024,
    role: 'AI/ML Engineer'
  },
  {
    id: 'realtime-collab',
    title: 'Real-time Collaboration',
    description: 'Herramienta de colaboraci\u00f3n en tiempo real tipo Notion con edici\u00f3n simult\u00e1nea.',
    longDescription: 'Aplicaci\u00f3n de productividad que permite edici\u00f3n colaborativa en tiempo real, gesti\u00f3n de proyectos, y sincronizaci\u00f3n instant\u00e1nea entre dispositivos usando CRDTs.',
    tags: ['Next.js', 'Yjs', 'PostgreSQL', 'Socket.io', 'TailwindCSS'],
    color: 0x8844ff,
    image: 'https://picsum.photos/seed/collab/600/400',
    links: [
      { type: 'github', url: 'https://github.com/username/realtime-collab' },
      { type: 'live', url: 'https://collab-app.com' }
    ],
    featured: true,
    year: 2024,
    role: 'Full Stack Developer'
  }
];

/**
 * Get featured projects only
 */
export const getFeaturedProjects = (): Project[] => {
  return projects.filter(project => project.featured);
};

/**
 * Get project by ID
 */
export const getProjectById = (id: string): Project | undefined => {
  return projects.find(project => project.id === id);
};

/**
 * Get projects by tag
 */
export const getProjectsByTag = (tag: string): Project[] => {
  return projects.filter(project =>
    project.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
};

/**
 * Get all unique tags from projects
 */
export const getAllTags = (): string[] => {
  const tagSet = new Set<string>();
  projects.forEach(project => {
    project.tags.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
};
