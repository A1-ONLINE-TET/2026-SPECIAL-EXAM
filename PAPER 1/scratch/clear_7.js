const fs = require('fs');
let code = fs.readFileSync('PAPER 1/js/data/syllabus.js', 'utf8');
code = code.replace(/"7": \[\s*\{[\s\S]*?\}\s*\],\s*"8": \[/, '"7": [],\n    "8": [');
fs.writeFileSync('PAPER 1/js/data/syllabus.js', code);
console.log('Replaced 7th grade in syllabus.js');
