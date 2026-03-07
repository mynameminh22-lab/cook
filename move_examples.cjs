const fs = require('fs');

const content = fs.readFileSync('src/examples.ts', 'utf8');
const lines = content.split('\n');

const toMove = lines.slice(254, 498);

// Remove the lines from original place
const newLines = [...lines.slice(0, 254), ...lines.slice(498)];

// Insert them before line 148 (which is the end of BASIC_EXAMPLES)
// Wait, the new array has different indices.
// Original line 148 is `  }`
// Let's find the index of `export const COMPLEX_EXAMPLES`
const complexIdx = newLines.findIndex(l => l.includes('export const COMPLEX_EXAMPLES'));
// The end of BASIC_EXAMPLES is at complexIdx - 2
newLines.splice(complexIdx - 2, 0, ...toMove);

fs.writeFileSync('src/examples.ts', newLines.join('\n'));
console.log('Done moving examples.');
