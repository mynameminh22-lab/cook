import fs from 'fs';
import path from 'path';

function search(dir) {
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (file === '.bin' || file === '.cache') continue;
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        search(fullPath);
      } else if (fullPath.endsWith('.js') || fullPath.endsWith('.ts') || fullPath.endsWith('.mjs') || fullPath.endsWith('.cjs')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.match(/\Wfetch\s*=\s*/)) {
          console.log('Found in:', fullPath);
        }
      }
    }
  } catch (e) {}
}

search('node_modules');
