const fs = require('fs');
const path = require('path');

const files = [
    'standard_6_7_8/all/sample_678_notes_5.json',
    'standard_6_7_8/all/sample_678_notes_4.json',
    'standard_6_7_8/all/sample_678_notes_1.json',
    'standard_6_7_8/all/sample_678_notes_2.json',
    'standard_6_7_8/all/sample_678_notes_3.json'
];

files.forEach(fileRelPath => {
    const filePath = path.join(__dirname, '../../json-db/lessons', fileRelPath);
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');

    // Replace LaTeX symbols with plain text equivalents for better mobile rendering
    content = content.replace(/\\times/g, '×');
    content = content.replace(/\\div/g, '÷');
    content = content.replace(/\\cdot/g, '·');
    content = content.replace(/\^\\circ/g, '°');
    content = content.replace(/\\circ/g, '°');
    content = content.replace(/\\Rightarrow/g, '→');
    content = content.replace(/\\rightarrow/g, '→');
    content = content.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '$1/$2');
    content = content.replace(/\\leq/g, '≤');
    content = content.replace(/\\geq/g, '≥');
    content = content.replace(/\\neq/g, '≠');
    content = content.replace(/\\approx/g, '≈');

    // Remove $ dollar signs as they often break rendering or show as literals
    content = content.replace(/\$/g, '');

    // Sometimes double backslashes exist after JSON stringify
    content = content.replace(/\\\\/g, '\\');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Cleaned symbols in ${fileRelPath}`);
});
