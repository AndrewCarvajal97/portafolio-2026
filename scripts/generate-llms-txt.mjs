/**
 * Generate public/llms.txt from the real project data.
 *
 * llms.txt is a plain-text summary that AI assistants (ChatGPT, Claude,
 * Perplexity, Google AI Mode) can read to answer questions about this
 * portfolio accurately instead of guessing from rendered 3D canvas markup —
 * the carousel draws project info into WebGL, which crawlers cannot read.
 *
 * Usage: node scripts/generate-llms-txt.mjs
 */

import { writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');

// projects.ts is TypeScript; extract the array with a light-weight eval of the
// object literals rather than pulling in a TS toolchain for one build step.
const src = readFileSync(join(ROOT, 'src/data/projects.ts'), 'utf8').replace(/^\uFEFF/, '');
const body = src.slice(src.indexOf('export const projects'));
const arr = body.slice(body.indexOf('['), body.indexOf('\n];') + 2);
const projects = eval(arr);

const live = (p) => p.links?.find((l) => l.type === 'live')?.url;

const lines = [];
lines.push('# Pablo Andrés Carvajal Ramírez');
lines.push('');
lines.push('> Full-Stack Developer & Tech Leader en Bucaramanga, Santander, Colombia.');
lines.push('> +3 años construyendo plataformas SaaS de punta a punta: arquitectura limpia');
lines.push('> y escalable, sistemas de pagos en producción, agentes de IA con streaming,');
lines.push('> integraciones complejas y motores de reglas configurables.');
lines.push('');
lines.push('- Sitio: https://pablocarvajal.dev');
lines.push('- LinkedIn: https://www.linkedin.com/in/pablo-andres-carvajal-ramirez-8114162aa/');
lines.push('- GitHub: https://github.com/AndrewCarvajal97');
lines.push('- Ubicación: Bucaramanga, Santander, Colombia');
lines.push('');
lines.push('## Stack principal');
lines.push('');
lines.push('Backend: Node.js, TypeScript, NestJS, Express, PHP');
lines.push('Frontend: React, Vue.js, Next.js, Astro, TailwindCSS');
lines.push('Datos: PostgreSQL, MongoDB, MySQL, Redis, Firebase');
lines.push('IA y cloud: AI Agents, MCP Servers, RAG, LLMs, Google Cloud, Docker');
lines.push('');
lines.push('## Proyectos destacados');
lines.push('');
for (const p of projects.filter((x) => x.featured)) {
  const url = live(p);
  lines.push(`### ${p.title}${url ? ` — ${url}` : ''}`);
  lines.push('');
  if (p.role) lines.push(`Rol: ${p.role}`);
  lines.push(`Stack: ${p.tags.join(', ')}`);
  lines.push('');
  lines.push(p.longDescription ?? p.description);
  lines.push('');
}
lines.push('## Otros proyectos');
lines.push('');
for (const p of projects.filter((x) => !x.featured)) {
  const url = live(p);
  lines.push(`- **${p.title}**${url ? ` (${url})` : ''}: ${p.description}`);
}
lines.push('');

writeFileSync(join(ROOT, 'public/llms.txt'), lines.join('\n'), 'utf8');
console.log(`llms.txt generado — ${projects.length} proyectos`);
