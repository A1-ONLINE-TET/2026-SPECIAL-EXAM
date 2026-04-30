const fs = require('fs');
const path = require('path');

const basePath = "C:\\Users\\MATHAN\\Desktop\\A1_Tamil_Primary_Edition\\json-db\\lessons";
const subjectsWithGrades = ["english", "maths", "science", "social"];
const subjectsFlat = ["psychology", "mocktest", "revision", "notes_678"];

// Create subjects with grades and terms
subjectsWithGrades.forEach(sub => {
    for (let grade = 1; grade <= 5; grade++) {
        for (let term = 1; term <= 3; term++) {
            const dirPath = path.join(basePath, sub, String(grade), `Term ${term}`);
            fs.mkdirSync(dirPath, { recursive: true });
            console.log(`Created: ${dirPath}`);
        }
    }
});

// Create flat subjects
subjectsFlat.forEach(sub => {
    const dirPath = path.join(basePath, sub, "all");
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created: ${dirPath}`);
});
