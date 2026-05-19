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
    longDescription: 'Tech Leader en AIA Technology. Contribuí al desarrollo de una plataforma SaaS completa para gestión de restaurantes usando NestJS, PostgreSQL, React 19 y TypeScript. Implementé pagos divididos con Stripe Connect (platform, restaurant_pool, direct_branch), integración con Catering Rewards API, y conectores de delivery (DoorDash, Uber Direct, Cartwheel). Trabajé sobre una arquitectura multi-tenant existente en PostgreSQL (stored procedures y auditoría) aportando módulos, integraciones y mejoras. Desarrollé agentes de IA para asistentes de gerentes con streaming SSE y renderizado de gráficos.',
    tags: ['NestJS', 'TypeScript', 'React 19', 'PostgreSQL', 'Stripe Connect', 'AI Agents'],
    color: 0x00d4ff,
    image: '/AIA-Landing.webp',
    links: [
      { type: 'live', url: 'https://askaia.ai' }
    ],
    featured: true,
    role: 'Tech Leader & Full-Stack Developer',
    challenges: [
      'Implementar pagos divididos a tres bandas (plataforma, pool del restaurante y sucursal directa) garantizando idempotencia y trazabilidad contable.',
      'Trabajar dentro de una arquitectura multi-tenant en PostgreSQL (stored procedures, RLS, auditoría) sin sacrificar rendimiento en consultas analíticas.',
      'Orquestar múltiples proveedores de delivery (DoorDash, Uber Direct, Cartwheel) bajo una sola interfaz, manejando webhooks, reintentos y reconciliación.',
      'Implementar agentes de IA con streaming SSE que rendericen gráficos en tiempo real sin bloquear el hilo principal del cliente.'
    ],
    experience: [
      'Profundicé en Stripe Connect a nivel productivo: cuentas conectadas, transfers, application_fee_amount y conciliación de payouts.',
      'Aprendí a operar sobre Clean Architecture en NestJS escalando a decenas de módulos sin acoplamiento.',
      'Coordiné trabajo técnico, definí estándares de PR, revisiones y rituales de despliegue continuo dentro del equipo.',
      'Consolidé patrones de event-driven con colas y outbox para integraciones externas resilientes.'
    ]
  },
  {
    id: 'incconnection-suite',
    title: 'INCConnection — Classroom & App',
    description: 'Plataforma universitaria virtual completa: panel admin Classroom + app de estudiantes con Google Workspace.',
    longDescription: 'Construí la suite completa: el panel administrativo Classroom para gestión académica (cursos, secciones, asistencia, calificaciones, calendarios) y la aplicación de estudiantes con experiencia integrada de Google Workspace mediante Domain-Wide Delegation. Implementé Google Calendar, Meet y Drive sobre un backend NestJS modular, gestiono service accounts en Google Cloud y flujos OAuth seguros. Diseñé permisos por rol (admin, docente, estudiante) y un sistema de notificaciones que mantiene sincronizadas a las dos audiencias.',
    tags: ['NestJS', 'TypeScript', 'React', 'Google Workspace', 'OAuth 2.0', 'PostgreSQL'],
    color: 0x8844ff,
    image: '/innco-completo.webp',
    links: [
      { type: 'live', url: 'https://dev.admin.innconection-plus.texelbit.com/classroom', label: 'Admin Classroom' },
      { type: 'live', url: 'https://dev.app.innconection.texelbit.com/', label: 'App Estudiantes' }
    ],
    featured: true,
    role: 'Full-Stack Developer',
    challenges: [
      'Integrar Google Workspace con Domain-Wide Delegation manteniendo principio de mínimo privilegio para cada scope (Calendar, Meet, Drive).',
      'Mantener consistencia entre el dominio académico interno y los recursos espejo en Google (carpetas Drive, eventos Calendar, salas Meet).',
      'Diseñar dos frontends con UX muy distinta (admin denso vs estudiante claro) compartiendo el mismo backend y diseño de tokens.',
      'Manejar refresh tokens, revocaciones y errores 4xx de Google sin romper el flujo del usuario final.'
    ],
    experience: [
      'Aprendí a usar service accounts y delegación a nivel de tenant para automatizar operaciones administrativas seguras.',
      'Refiné mi entendimiento de OAuth 2.0 productivo: PKCE, scopes incrementales, almacenamiento cifrado de tokens.',
      'Adquirí experiencia diseñando APIs versionadas que sirven a dos clientes con prioridades distintas sin acoplarlas.',
      'Aprendí a observar y depurar integraciones externas con métricas, retries con backoff y dashboards de latencia.'
    ]
  },
  {
    id: 'gestion-contable',
    title: 'Gestión Contable',
    description: 'Sistema contable empresarial con facturación electrónica, conciliación bancaria y reportería fiscal.',
    longDescription: 'Full-Stack Developer en el sistema de Gestión Contable de Texelbit. Construí módulos de facturación electrónica, libros contables, conciliación bancaria y reportería fiscal. Diseñé el motor de asientos automáticos con reglas configurables por tipo de operación, importación masiva de movimientos bancarios y exportación de formatos exigidos por la autoridad tributaria. Optimicé queries de balances y estados financieros sobre grandes volúmenes históricos.',
    tags: ['NestJS', 'TypeScript', 'React', 'PostgreSQL', 'Facturación Electrónica'],
    color: 0x22cc88,
    image: '/gestion-contable.webp',
    links: [
      { type: 'live', url: 'https://gestion-contable.texelbit.com/' }
    ],
    featured: true,
    role: 'Full-Stack Developer',
    challenges: [
      'Garantizar que cada asiento contable cumpliera partida doble e inmutabilidad temporal sin perder velocidad en cierres mensuales.',
      'Integrarse con servicios de facturación electrónica que tienen ventanas de mantenimiento y formatos XML estrictos.',
      'Conciliar movimientos bancarios con criterios fuzzy (monto + fecha + referencia parcial) sin generar falsos positivos.',
      'Generar reportes fiscales reproducibles auditables, recalculables ante reclasificaciones retroactivas.'
    ],
    experience: [
      'Profundicé en modelado contable: cuentas T, mayores auxiliares, períodos cerrados y reaperturas controladas.',
      'Aprendí patrones de write-once / append-only para datos sensibles legalmente.',
      'Optimicé consultas analíticas con índices parciales, vistas materializadas y particionamiento por período.',
      'Maduré mi disciplina de testing: cada regla contable se cubre con casos golden replicando ejercicios reales.'
    ]
  },
  {
    id: 'aia-docs',
    title: 'AIA Docs',
    description: 'Plataforma de documentación interna y operativa del ecosistema AIA con búsqueda semántica.',
    longDescription: 'Diseñé y desarrollé AIA Docs, la plataforma central de documentación técnica, operativa y comercial del ecosistema AIA. Incluye versionado por release, control de acceso por rol, búsqueda semántica con embeddings vectoriales y un editor MDX integrado. Sirve como única fuente de verdad para onboarding de empleados, manuales de restaurantes y especificaciones de APIs internas.',
    tags: ['Next.js', 'TypeScript', 'MDX', 'Pinecone', 'Embeddings'],
    color: 0x4488ff,
    image: '/proyectos-protegidos.webp',
    links: [
      { type: 'live', url: 'https://askaia.ai' }
    ],
    featured: true,
    role: 'Full-Stack Developer',
    challenges: [
      'Lograr búsqueda semántica precisa sobre contenido mixto (texto, código, tablas) sin retornar resultados ruidosos.',
      'Versionar documentación alineada al ciclo de releases del producto, evitando que los lectores vean instrucciones obsoletas.',
      'Permitir edición colaborativa MDX con preview en vivo sin romper el bundle del sitio en producción.',
      'Servir contenido sensible con autorización granular sin sacrificar el cacheo de la mayor parte del sitio público.'
    ],
    experience: [
      'Aprendí a diseñar pipelines de ingest, chunking y embeddings para RAG productivo.',
      'Refiné estrategias de ISR y revalidación selectiva en Next.js para sitios con contenido alto.',
      'Adquirí experiencia integrando MDX con componentes interactivos manteniendo accesibilidad y SEO.',
      'Profundicé en la gestión de prompts y system messages para asistentes de documentación.'
    ]
  },
  {
    id: 'aia-rewards',
    title: 'AIA Rewards',
    description: 'Motor propio de rewards multi-proveedor con Strategy pattern: switch en runtime entre el sistema interno y proveedores externos.',
    longDescription: 'Implementación mejorada del sistema de rewards que originalmente dependía exclusivamente del proveedor externo Catering Rewards. Le dio a AIA la libertad de ofrecer el servicio a sus clientes finales con configuraciones y control mucho más granular, manteniendo el proveedor externo como complemento para usuarios que ya contaban con él. La pieza clave es la aplicación del patrón Strategy: una interfaz común de RewardsProvider que permite intercambiar en tiempo de ejecución entre el proveedor interno mejorado y cualquier proveedor externo integrado, sin tocar el código consumidor (checkout, app móvil, dashboard). Incluye motor de reglas configurable por restaurante, niveles, expiración de puntos y detección de fraude.',
    tags: ['NestJS', 'TypeScript', 'Strategy Pattern', 'PostgreSQL', 'Redis', 'Event Sourcing'],
    color: 0xffaa44,
    image: '/aia-rewards-points.webp',
    links: [
      { type: 'live', url: 'https://askaia.ai' }
    ],
    featured: true,
    role: 'Tech Leader & Full-Stack Developer',
    challenges: [
      'Diseñar una abstracción de RewardsProvider lo suficientemente expresiva para cubrir el proveedor interno y externos sin filtrar particularidades de cada uno al cliente.',
      'Permitir el switch de proveedor en runtime por usuario, restaurante o tenant, manteniendo el ledger de puntos consistente y auditable.',
      'Llevar configuración y control granular al panel admin sin sacrificar performance ni romper la compatibilidad con el flujo del proveedor externo legacy.',
      'Detectar y prevenir fraude (acumulación artificial, doble acreditación, canje masivo) en tiempo real con concurrencia alta en checkout.'
    ],
    experience: [
      'Apliqué el patrón Strategy a nivel de dominio productivo, dejando el código consumidor agnóstico al proveedor activo.',
      'Profundicé en event sourcing y outbox pattern para mantener un historial inmutable y reproducible de movimientos de puntos.',
      'Aprendí a diseñar motores de reglas tipo decision-tree configurables desde admin sin acoplar el motor a un proveedor específico.',
      'Maduré decisiones de producto basadas en métricas reales de retención, LTV y costo por punto acreditado.'
    ]
  },
  {
    id: 'aia-catering-rewards',
    title: 'AIA Catering Rewards',
    description: 'Portal para clientes del ecosistema AIA: seguimiento de rewards, órdenes, premios, campañas y tracking en vivo de entregas con SSE.',
    longDescription: 'Portal web que diseñé para los clientes finales del ecosistema AIA: les permite hacer seguimiento de sus rewards (puntos, niveles, historial), revisar sus órdenes y premios canjeados, explorar campañas activas y, sobre todo, hacer tracking de sus órdenes en tiempo real mediante Server-Sent Events. Apenas el driver confirma el pickup en el restaurante, el portal abre un canal SSE que empuja actualizaciones de estado y posición hasta la entrega, sin polling y manteniendo la latencia sub-segundo. Se integra con el motor de Rewards multi-proveedor, el sistema de cupones, el flujo de órdenes y el tracking GPS de drivers.',
    tags: ['React', 'TypeScript', 'NestJS', 'SSE', 'Real-time', 'PostgreSQL'],
    color: 0xff8844,
    image: '/aia-rewards.webp',
    links: [
      { type: 'live', url: 'https://askaia.ai' }
    ],
    featured: true,
    role: 'Full-Stack Developer',
    challenges: [
      'Sincronizar 4 dominios (rewards, órdenes, campañas, tracking) en una sola vista sin acoplar los servicios entre sí.',
      'Abrir el canal SSE justo cuando el driver confirma pickup y sostenerlo hasta la entrega, reconectando ante pérdida de red sin perder eventos intermedios.',
      'Mostrar la posición del driver en vivo en un mapa sin saturar la UI con re-renders ni romper la batería del cliente.',
      'Mantener latencia sub-segundo entre evento de driver y actualización en el portal con cientos de órdenes simultáneas.'
    ],
    experience: [
      'Profundicé en Server-Sent Events productivos: heartbeats, reintentos exponenciales, `Last-Event-ID` para recuperación y backpressure por cliente.',
      'Refiné una arquitectura event-driven donde múltiples microservicios publican y el portal consume un stream unificado por orden.',
      'Aprendí a diseñar UIs en tiempo real sin saturar React: throttling, selectors granulares y componentes desacoplados por canal.',
      'Adquirí experiencia midiendo y optimizando latencia end-to-end de eventos GPS hasta el render en el cliente.'
    ]
  },
  {
    id: 'aia-driver-tracking',
    title: 'AIA Driver Tracking',
    description: 'Tracking en tiempo real de conductores de delivery con rutas, ETAs y geocercas operativas.',
    longDescription: 'Sistema de tracking en tiempo real para los conductores propios y de terceros de AIA. Recibe posiciones GPS por WebSocket, calcula ETAs dinámicos al cliente, dibuja rutas optimizadas y aplica geocercas para eventos operativos (llegada al restaurante, salida, llegada al cliente). Incluye panel de despacho con mapa en vivo y reproducción histórica de rutas.',
    tags: ['NestJS', 'WebSockets', 'React', 'Mapbox', 'PostGIS', 'Redis'],
    color: 0x00ccff,
    image: '/driver-tracking.webp',
    links: [
      { type: 'live', url: 'https://askaia.ai' }
    ],
    featured: true,
    role: 'Full-Stack Developer',
    challenges: [
      'Manejar miles de posiciones GPS por minuto sin saturar la base ni el cliente, manteniendo precisión visual fluida.',
      'Calcular ETAs realistas considerando tráfico, paradas y comportamiento histórico del conductor.',
      'Detectar eventos de geocerca de manera confiable evitando falsos positivos por jitter de GPS.',
      'Reproducir rutas históricas en mapas con scrubbing temporal sin recargar tiles ni saltarse puntos.'
    ],
    experience: [
      'Aprendí a usar PostGIS productivamente: índices GIST, ST_DWithin, snapping a calles.',
      'Refiné arquitectura WebSocket con backpressure, rooms por orden y reconciliación al reconectar.',
      'Adquirí experiencia integrando Mapbox con capas vectoriales personalizadas y clústering dinámico.',
      'Mejoré el diseño de telemetría móvil: buffering offline, batching y compresión delta de posiciones.'
    ]
  },
  {
    id: 'aia-mobile',
    title: 'AIA Mobile App',
    description: 'Versión móvil del dashboard de AIA para administrar el negocio, con los mismos agentes de IA del web.',
    longDescription: 'Versión móvil del dashboard administrativo de AIA. Replica las funcionalidades de gestión del web (operación de restaurantes, métricas, configuración, órdenes, equipo) y embebe los mismos agentes de IA del dashboard para que los gerentes puedan consultarles en cualquier momento. Construida con React Native + Expo, consume las mismas APIs y comparte tipos/SDK con la plataforma web a través de un paquete monorepo, garantizando paridad funcional entre ambos clientes.',
    tags: ['React Native', 'Expo', 'TypeScript', 'AI Agents', 'SSE', 'Monorepo'],
    color: 0x00e0a8,
    image: '/proyectos-protegidos.webp',
    links: [
      { type: 'live', url: 'https://askaia.ai' }
    ],
    featured: true,
    role: 'Full-Stack Developer',
    challenges: [
      'Mantener paridad funcional con el dashboard web sin duplicar lógica: cualquier feature nueva debe aparecer en ambos clientes.',
      'Portar los agentes de IA con streaming SSE a React Native conservando el render incremental de respuestas y gráficos.',
      'Adaptar UIs densas del dashboard (tablas, configuraciones, métricas) a pantallas móviles sin perder información clave.',
      'Compartir tipos, SDK y lógica de dominio entre web y móvil sin acoplar releases de las dos plataformas.'
    ],
    experience: [
      'Maduré una arquitectura monorepo con paquetes compartidos (SDK + tipos + design tokens) entre web y móvil.',
      'Aprendí a llevar agentes de IA con streaming a entornos móviles: SSE, reconexión, manejo de tool_use en tiempo real.',
      'Refiné técnicas para traducir interfaces complejas de admin a móvil sin sacrificar densidad de información útil.',
      'Adquirí experiencia con el ciclo OTA de Expo (EAS Update, build profiles, channels por entorno).'
    ]
  },
  {
    id: 'incconnection-mobile',
    title: 'INCConnection Mobile',
    description: 'App móvil para estudiantes y docentes: clases, asistencia, calendario y notificaciones.',
    longDescription: 'App móvil del ecosistema INCConnection que reúne en una sola experiencia los cursos del estudiante, calendario académico sincronizado con Google Calendar, links rápidos a sesiones Meet, control de asistencia y notificaciones de avisos académicos. Construida en React Native + Expo, consume el mismo backend NestJS de la suite web.',
    tags: ['React Native', 'Expo', 'TypeScript', 'Google Calendar', 'Push Notifications'],
    color: 0xaa66ff,
    image: '/incconnection-mobile.webp',
    links: [
      { type: 'live', url: 'https://dev.app.innconection.texelbit.com/' }
    ],
    featured: true,
    role: 'Full-Stack Developer',
    challenges: [
      'Sincronizar el calendario académico con Google Calendar bidireccionalmente respetando cambios manuales del usuario.',
      'Lanzar sesiones Meet desde la app conservando la sesión OAuth sin romper el flujo nativo.',
      'Manejar asistencia con geolocalización y/o QR de forma justa, evitando fraudes pero tolerando errores de GPS.',
      'Hacer que docentes y estudiantes compartan la misma app con UX adaptada al rol sin duplicar pantallas.'
    ],
    experience: [
      'Aprendí a integrar Google APIs de forma segura desde un cliente móvil con tokens cortos y refresh transparente.',
      'Refiné el manejo de notificaciones push académicas con segmentación por curso y rol.',
      'Adquirí experiencia diseñando experiencias por rol en un mismo binario sin abusar de feature flags.',
      'Profundicé en accesibilidad móvil para estudiantes con distintas capacidades.'
    ]
  },
  {
    id: 'aia-coupons',
    title: 'AIA Cupones & Descuentos',
    description: 'Sistema ad-hoc de cupones y descuentos exclusivo de AIA para lanzar campañas de marketing.',
    longDescription: 'Diseñé y desarrollé un sistema de cupones y descuentos ad-hoc exclusivo del ecosistema AIA. Permite al equipo de marketing crear campañas con descuentos por porcentaje o monto fijo, cupones promocionales para clientes, códigos de uso único o multi-uso, vigencia temporal, restricciones por sucursal/producto y montos mínimos. Incluye generación masiva de códigos, panel de seguimiento de redenciones y métricas por campaña, integrado con el checkout de la plataforma AIA.',
    tags: ['NestJS', 'TypeScript', 'React', 'PostgreSQL', 'Redis', 'Marketing'],
    color: 0xff6688,
    image: '/aia-cupons.webp',
    links: [
      { type: 'live', url: 'https://askaia.ai' }
    ],
    featured: true,
    role: 'Full-Stack Developer (owner)',
    challenges: [
      'Darle a marketing autonomía para crear campañas sin pasar por deploy: reglas configurables desde el panel sin ramificar código.',
      'Garantizar atomicidad al redimir un cupón de un solo uso bajo concurrencia: dos checkouts no pueden consumir el mismo código.',
      'Validar combinaciones de cupones con Rewards y promociones automáticas sin doble descuento ni pérdida de margen.',
      'Generar lotes masivos de códigos únicos legibles y antifraude (sin patrones predecibles) para campañas físicas y digitales.'
    ],
    experience: [
      'Aprendí a diseñar primitives de reglas (porcentaje, monto fijo, productos elegibles, ventanas) componibles desde admin.',
      'Refiné técnicas de locking para inventario de cupones de tirada limitada usando Redis + transacciones PostgreSQL.',
      'Adquirí experiencia construyendo dashboards de marketing accionables: redención por cohorte, ticket promedio, ROI por campaña.',
      'Maduré la integración limpia con un checkout existente sin reescribir su flujo de cálculo de totales.'
    ]
  },
  {
    id: 'galatea-labs',
    title: 'Galatea Labs',
    description: 'Plataforma de productos AI con experiencias visuales inmersivas y animaciones GSAP/Three.js.',
    longDescription: 'Founding Developer de Galatea Labs. Contribuidor principal en productos potenciados por IA y desarrollo de plataforma. Creé la serie de blogs "Building AI Presence". Desarrollé el frontend con React/TypeScript, animaciones GSAP e interfaces Three.js, creando experiencias visuales inmersivas que reflejan la innovación tecnológica.',
    tags: ['React', 'TypeScript', 'GSAP', 'Three.js', 'AI Integration'],
    color: 0xff00d4,
    image: '/galatealabs.webp',
    links: [
      { type: 'live', url: 'https://galatealabs.ai' }
    ],
    featured: true,
    role: 'Founding Developer',
    challenges: [
      'Equilibrar fidelidad visual (Three.js + GSAP) con performance en dispositivos de gama media.',
      'Mantener una identidad de marca premium en cada landing y demo sin sacrificar velocidad de iteración.',
      'Construir un sistema de contenidos para la serie "Building AI Presence" reutilizable entre artículos y demos interactivos.',
      'Coordinar prototipos de IA con flujo de producto en una startup donde el alcance cambia rápido.'
    ],
    experience: [
      'Refiné animaciones complejas con GSAP timelines y ScrollTrigger en escenarios reales de producto.',
      'Profundicé en Three.js: shaders básicos, post-processing y composición de escenas optimizadas.',
      'Aprendí a fundar producto desde cero: branding técnico, tooling, deploys y métricas tempranas.',
      'Maduré una sensibilidad de diseño orientada a producto y no solo a portafolio.'
    ]
  },
  {
    id: 'voyagr',
    title: 'Voyagr',
    description: 'App móvil multiplataforma de viajes: descubrimiento de destinos, planificación de trips, mensajería y reconocimiento de lugares con cámara.',
    longDescription: 'Desarrollador principal y Tech Leader de Voyagr, una app móvil multiplataforma (iOS, Android y web) construida con Expo + React Native y New Architecture. Permite descubrir destinos jerárquicamente (países → estados → ciudades → lugares de interés), planificar viajes (Journey) con itinerarios, intereses y compañeros, mensajería entre viajeros (chats directos, grupales y salas), autenticación multi-proveedor (email, Google, Apple, OTP por email/teléfono) y un módulo de reconocimiento de lugares vía cámara que sube capturas al backend. Arquitectura modular por features con file-based routing (Expo Router 6), patrones de diseño aplicados (Singleton, Factory, Repository, Provider) y consumo de tres APIs REST desacopladas (Auth, Localization y Core). Definí convenciones técnicas, documentación interna y pipeline EAS Build del proyecto.',
    tags: ['React Native', 'Expo', 'TypeScript', 'Expo Router', 'Reanimated', 'EAS Build'],
    color: 0x00ff88,
    image: '/voyagr.webp',
    links: [{
      type: 'live', url: 'https://voyagr.com'
    }],
    featured: true,
    role: 'Tech Leader & Lead Developer',
    challenges: [
      'Orquestar tres clientes Axios (Auth, Localization, Core) sobre un singleton BaseWebServices con manejo unificado de tokens y distinción entre endpoints autenticados y de auth.',
      'Integrar tres proveedores de autenticación (email tradicional, Google Sign-In, Apple Sign-In) con almacenamiento seguro (expo-secure-store + AsyncStorage), OTP por email/teléfono y deep linking nativo (`voyagr://auth`).',
      'Diseñar un sistema propio de internacionalización con ServiceCache, structs tipadas y carga dinámica de traducciones desde API según el locale del dispositivo.',
      'Implementar un pipeline de captura multimedia (expo-camera / expo-image-picker) con preview, retake y subida multipart/form-data integrado al flujo de reconocimiento de lugares.'
    ],
    experience: [
      'Lideré la definición de arquitectura modular por features, convenciones de naming (componentes prefijo "V", servicios sufijo Services) y documentación interna (ARCHITECTURE.md, LLM_GUIDE.md, NAVIGATION.md).',
      'Apliqué patrones de diseño clásicos (Singleton, Factory, Repository, Provider, Service Cache) sobre TypeScript estricto en un cliente móvil productivo.',
      'Profundicé en el ecosistema Expo moderno: New Architecture habilitada, Expo Router 6 con typed routes, Reanimated 4 con Worklets y EAS Build para distribución.',
      'Maduré decisiones de UX móvil críticas: navegación Stack centralizada (StackNavigationManager), gestión consistente del botón back en Android, i18n y caching de cliente con ServiceCache.'
    ]
  },
  {
    id: 'asy-neuronal-agents',
    title: 'asy-neuronal-agents',
    description: 'Framework de agentes AI multi-LLM con cumplimiento SOLID/DI y soporte para múltiples proveedores.',
    longDescription: 'Creé un framework de agentes AI multi-LLM desde cero con cumplimiento de principios SOLID e inyección de dependencias. Incluye migraciones de SDKs de proveedores y manejo de tool_use de Anthropic. Paquete publicado en NPM para facilitar la integración de múltiples LLMs (OpenAI, Anthropic) en aplicaciones TypeScript/Node.js.',
    tags: ['TypeScript', 'Node.js', 'OpenAI', 'Anthropic', 'Multi-LLM'],
    color: 0xffaa00,
    image: '/libreria.webp',
    links: [
      { type: 'live', url: 'https://www.npmjs.com/package/@andrewcarvajal97/asy-neuronal-agents' },
      { type: 'github', url: 'https://github.com/andrewcarvajal97' }
    ],
    featured: true,
    role: 'Creator & Maintainer',
    challenges: [
      'Abstraer diferencias entre SDKs de Anthropic y OpenAI sin perder features nativos (tool_use, streaming, vision).',
      'Mantener tipos estrictos para herramientas declaradas dinámicamente por el consumidor del paquete.',
      'Gestionar versionado semántico cuando los proveedores rompen compatibilidad en sus SDKs.',
      'Diseñar una API ergonómica que respete SOLID sin volverse verbose para casos comunes.'
    ],
    experience: [
      'Aprendí a publicar y mantener un paquete NPM productivo con CI, tipos públicos y semver real.',
      'Profundicé en patrones de inyección de dependencias aplicados a librerías, no solo a apps.',
      'Refiné mi capacidad de leer SDKs ajenos y abstraer sus contratos sin perder fidelidad.',
      'Adquirí soltura con tool calling y streaming a través de proveedores distintos.'
    ]
  },
  {
    id: 'gestor-mudi',
    title: 'Gestor de Proyectos Mudi',
    description: 'Sistema avanzado de gestión de proyectos 3D con visualización en navegador y control de versiones.',
    longDescription: 'Sistema avanzado de gestión de proyectos 3D con seguimiento en tiempo real, visualización 3D basada en navegador con Three.js, y control de versiones. Redujo los tiempos de aprobación en un 60%.',
    tags: ['PHP', 'JavaScript', 'Three.js', 'HTML5', 'CSS3'],
    color: 0x44aaff,
    image: '/proyectos-protegidos.webp',
    links: [
      { type: 'github', url: 'https://github.com/andrewcarvajal97' }
    ],
    role: 'Full-Stack Developer',
    challenges: [
      'Renderizar modelos 3D pesados en navegador sin penalizar dispositivos modestos del equipo cliente.',
      'Versionar archivos binarios 3D conservando trazabilidad de quién aprobó qué versión.',
      'Modelar revisiones y aprobaciones con comentarios anclados a coordenadas del modelo.',
      'Reducir tiempos de aprobación que históricamente vivían en cadenas de correo y reuniones.'
    ],
    experience: [
      'Aprendí Three.js desde fundamentos: cámaras, luces, controles y carga progresiva de assets.',
      'Refiné un workflow PHP/JS clásico aplicando prácticas modernas de versionado y revisión.',
      'Adquirí experiencia midiendo impacto de negocio real (-60% en aprobaciones) y comunicándolo.',
      'Maduré mi capacidad de levantar un producto end-to-end siendo el único responsable técnico.'
    ]
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
