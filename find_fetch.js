import fs from 'fs';
import path from 'path';

function search(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      search(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('window.fetch =') || content.includes('global.fetch =') || content.includes('self.fetch =')) {
        console.log('Found in:', fullPath);
      }
    }
  }
}

search('node_modules/mathjs');
