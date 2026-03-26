/**
 * Portfolio Projects Data
 *
 * This file contains all project information displayed in the 3D carousel.
 * Modify this file to add, remove, or update projects.
 */

import type { Project } from '../types/project';

export const projects: Project[] = [
  {
    id: 'aia-platform',
    title: 'AIA Platform',
    description: 'SaaS de gestión de restaurantes y catering con IA, pagos Stripe Connect e integraciones de delivery.',
    longDescription: 'Tech Leader en AIA Technology. Arquitecté y desarrollé una plataforma SaaS completa para gestión de restaurantes usando NestJS, PostgreSQL, React 19 y TypeScript. Implementé pagos divididos con Stripe Connect (platform, restaurant_pool, direct_branch), integración con Catering Rewards API, y conectores de delivery (DoorDash, Uber Direct, Cartwheel). Diseñé arquitectura multi-tenant con stored procedures y sistemas de auditoría en PostgreSQL. Desarrollé agentes de IA para asistentes de gerentes con streaming SSE y renderizado de gráficos.',
    tags: ['NestJS', 'TypeScript', 'React', 'PostgreSQL', 'Stripe Connect', 'AI Agents'],
    color: 0x00d4ff,
    image: '/AIA-Landing.png',
    links: [
      { type: 'live', url: 'https://askaia.ai' }
    ],
    featured: true,
    year: 2024,
    role: 'Tech Leader & Full-Stack Developer'
  },
  {
    id: 'galatea-labs',
    title: 'Galatea Labs',
    description: 'Plataforma de productos AI con experiencias visuales inmersivas y animaciones GSAP/Three.js.',
    longDescription: 'Founding Developer de Galatea Labs. Contribuidor principal en productos potenciados por IA y desarrollo de plataforma. Creé la serie de blogs "Building AI Presence". Desarrollé el frontend con React/TypeScript, animaciones GSAP e interfaces Three.js, creando experiencias visuales inmersivas que reflejan la innovación tecnológica.',
    tags: ['React', 'TypeScript', 'GSAP', 'Three.js', 'AI Integration'],
    color: 0xff00d4,
    image: 'https://galatealabs.ai/og-image.png',
    links: [
      { type: 'live', url: 'https://galatealabs.ai' }
    ],
    featured: true,
    year: 2025,
    role: 'Founding Developer'
  },
  {
    id: 'voyagr',
    title: 'Voyagr',
    description: 'Aplicación de viajes con IA y realidad aumentada para conectar viajeros con destinos turísticos.',
    longDescription: 'Tech Leader del proyecto Voyagr. Lideré el desarrollo de servidores MCP e integraciones de IA. Implementé arquitecturas multi-tenant y desarrollo móvil con React Native/Expo. La plataforma conecta viajeros con destinos turísticos y negocios locales mediante recomendaciones generadas por la comunidad usando IA y realidad aumentada.',
    tags: ['Node.js', 'React Native', 'Next.js', 'AI/LLMs', 'MCP Servers'],
    color: 0x00ff88,
    image: 'https://picsum.photos/seed/voyagr/600/400',
    links: [],
    featured: true,
    year: 2024,
    role: 'Tech Leader'
  },
  {
    id: 'incconnection',
    title: 'INCConnection',
    description: 'Plataforma universitaria virtual con integración completa de Google Workspace.',
    longDescription: 'Full-Stack Developer en el proyecto INCConnection. Desarrollé una plataforma universitaria virtual con integración de Google Workspace usando Domain-Wide Delegation. Implementé APIs de Calendar, Meet y Drive con backend NestJS. Gestiono configuración de service accounts de Google Cloud y flujos OAuth.',
    tags: ['NestJS', 'TypeScript', 'Google Cloud', 'OAuth 2.0'],
    color: 0x8844ff,
    image: 'https://picsum.photos/seed/incconnection/600/400',
    links: [],
    featured: true,
    year: 2024,
    role: 'Full-Stack Developer'
  },
  {
    id: 'asy-neuronal-agents',
    title: 'asy-neuronal-agents',
    description: 'Framework de agentes AI multi-LLM con cumplimiento SOLID/DI y soporte para múltiples proveedores.',
    longDescription: 'Creé un framework de agentes AI multi-LLM desde cero con cumplimiento de principios SOLID e inyección de dependencias. Incluye migraciones de SDKs de proveedores y manejo de tool_use de Anthropic. Paquete publicado en NPM para facilitar la integración de múltiples LLMs (OpenAI, Anthropic) en aplicaciones TypeScript/Node.js.',
    tags: ['TypeScript', 'Node.js', 'OpenAI', 'Anthropic', 'Multi-LLM'],
    color: 0xffaa00,
    image: 'https://picsum.photos/seed/asyagents/600/400',
    links: [
      { type: 'live', url: 'https://www.npmjs.com/package/@andrewcarvajal97/asy-neuronal-agents' },
      { type: 'github', url: 'https://github.com/andrewcarvajal97' }
    ],
    featured: true,
    year: 2024,
    role: 'Creator & Maintainer'
  },
  {
    id: 'texelsync',
    title: 'TexelSync / VTEX Integrations',
    description: 'Plataforma Clean Architecture para sincronización VTEX/Shopify con embeddings vectoriales.',
    longDescription: 'Full-Stack Developer en Texelbit. Construí una plataforma NestJS con Clean Architecture para sincronización VTEX/Shopify. Implementé integraciones con Firebase/Firestore/Redis/PostgreSQL. Desarrollé webhooks de afiliados VTEX y embeddings vectoriales con Pinecone para búsqueda semántica.',
    tags: ['NestJS', 'Firebase', 'Redis', 'PostgreSQL', 'Pinecone', 'VTEX'],
    color: 0xff4444,
    image: 'https://picsum.photos/seed/texelsync/600/400',
    links: [
      { type: 'live', url: 'https://texelbit.com/' }
    ],
    year: 2023,
    role: 'Full-Stack Developer'
  },
  {
    id: 'gestor-mudi',
    title: 'Gestor de Proyectos Mudi',
    description: 'Sistema avanzado de gestión de proyectos 3D con visualización en navegador y control de versiones.',
    longDescription: 'Sistema avanzado de gestión de proyectos 3D con seguimiento en tiempo real, visualización 3D basada en navegador con Three.js, y control de versiones. Redujo los tiempos de aprobación en un 60%.',
    tags: ['PHP', 'JavaScript', 'Three.js', 'HTML5', 'CSS3'],
    color: 0x44aaff,
    image: 'https://picsum.photos/seed/mudi3d/600/400',
    links: [
      { type: 'github', url: 'https://github.com/andrewcarvajal97' }
    ],
    year: 2023,
    role: 'Full-Stack Developer'
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
