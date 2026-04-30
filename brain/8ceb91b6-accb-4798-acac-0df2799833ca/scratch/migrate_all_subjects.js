const fs = require('fs');
const path = require('path');

const srcBase = "c:\\Users\\MATHAN\\2026-SPECIAL-EXAM\\PAPER 1\\json-db\\lessons";
const destBase = "C:\\Users\\MATHAN\\Desktop\\A1_Tamil_Primary_Edition\\json-db\\lessons";

const subjectsWithGrades = ["english", "maths", "science", "social", "soc"];
const subjectsFlat = {
    "psychology": "psychology",
    "mocktest": "mocktest",
    "revision": "revision",
    "standard_6_7_8": "notes_678"
};

// Migrate subjects with grades
subjectsWithGrades.forEach(sub => {
    const subSrc = path.join(srcBase, sub);
    if (!fs.existsSync(subSrc)) return;

    const items = fs.readdirSync(subSrc);
    
    items.forEach(item => {
        const itemPath = path.join(subSrc, item);
        if (!fs.lstatSync(itemPath).isDirectory()) return;
        
        const grade = parseInt(item);
        if (isNaN(grade) || grade > 5) return; // Only grades 1-5
        
        const files = fs.readdirSync(itemPath).filter(f => f.endsWith('.json'));
        
        // Track lesson count per term
        const termCounts = { 1: 1, 2: 1, 3: 1 };
        
        files.forEach(file => {
            let term = 1;
            if (file.includes('_t2_')) term = 2;
            if (file.includes('_t3_')) term = 3;
            
            // Map 'soc' to 'social'
            const destSub = (sub === 'soc' || sub === 'social') ? 'social' : sub;
            const destFolder = path.join(destBase, destSub, String(grade), `Term ${term}`);
            
            if (!fs.existsSync(destFolder)) fs.mkdirSync(destFolder, { recursive: true });
            
            const destPath = path.join(destFolder, `Lesson_${termCounts[term]++}.json`);
            
            fs.copyFileSync(path.join(itemPath, file), destPath);
            console.log(`Migrated: ${sub}/${item}/${file} -> ${destPath}`);
        });
    });
});

// Migrate flat subjects
for (const [srcSub, destSub] of Object.entries(subjectsFlat)) {
    const subSrc = path.join(srcBase, srcSub);
    if (!fs.existsSync(subSrc)) continue;

    const allSrc = path.join(subSrc, "all");
    const srcDir = fs.existsSync(allSrc) ? allSrc : subSrc;
    
    if (!fs.existsSync(srcDir)) continue;

    const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.json') && !fs.lstatSync(path.join(srcDir, f)).isDirectory());
    
    let count = 1;
    files.forEach(file => {
        const destFolder = path.join(destBase, destSub, "all");
        if (!fs.existsSync(destFolder)) fs.mkdirSync(destFolder, { recursive: true });
        
        const destPath = path.join(destFolder, `Lesson_${count++}.json`);
        fs.copyFileSync(path.join(srcDir, file), destPath);
        console.log(`Migrated Flat: ${srcSub}/${file} -> ${destPath}`);
    });
}
