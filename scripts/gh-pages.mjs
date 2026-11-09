// Prepara el build para GitHub Pages:
// - .nojekyll para que GitHub no ignore la carpeta _next (empieza con guion bajo).
// - 404.html ya lo genera Next.js; se verifica que exista.
import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const out = 'out';
if (!existsSync(join(out, 'index.html'))) {
  console.error('No existe out/index.html. Corre primero "npm run build".');
  process.exit(1);
}
writeFileSync(join(out, '.nojekyll'), '');
console.log(`Listo para GitHub Pages: ${out}${existsSync(join(out, '404.html')) ? ' (con 404.html)' : ''}`);
