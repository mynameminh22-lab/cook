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
        const lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes('window.fetch =') || lines[i].includes('global.fetch =') || lines[i].includes('self.fetch =') || lines[i].match(/\Wfetch\s*=\s*/)) {
            console.log(`Found in ${fullPath}:${i + 1}: ${lines[i].trim()}`);
          }
        }
      }
    }
  } catch (e) {}
}

search('node_modules/mathjs');
