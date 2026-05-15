const fs = require('fs');
const path = 'C:\\Users\\MATHAN\\2026-SPECIAL-EXAM\\PAPER 1\\json-db\\lessons\\tamil\\3\\7.json';
let content = fs.readFileSync(path, 'utf8');

let lines = content.split('\n');
let newLines = [];

let state = 0; // 0: outside, 1: after {, 2: after options
for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    if (line.includes('"quiz": [')) {
        state = 0;
    }

    if (line.trim() === '{') {
        state = 1;
        newLines.push(line);
        continue;
    }
    
    if (state === 1 && line.includes(': \\"')) {
        // This is the question line
        let val = line.split(': \\"')[1];
        newLines.push(`"question": "${val}`);
        state = 2;
        continue;
    }
    
    if (state === 2 && line.includes('"options":')) {
        newLines.push(line);
        state = 3;
        continue;
    }
    
    if (state === 3 && line.includes(': \\"')) {
        // This is the answer line
        let val = line.split(': \\"')[1];
        newLines.push(`"answer": "${val}`);
        state = 4;
        continue;
    }
    
    if (state === 4 && line.includes(': \\"')) {
        // This is the explanation line
        let val = line.split(': \\"')[1];
        newLines.push(`"explanation": "${val}`);
        state = 0;
        continue;
    }

    newLines.push(line);
}

fs.writeFileSync(path, newLines.join('\n'), 'utf8');
console.log("Restored keys in 7.json");
