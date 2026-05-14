const fs = require('fs');
const path = require('path');

const localDbPath = path.join(__dirname, 'json-db', 'lessons');
const lessonMapFile = path.join(__dirname, 'js', 'data', 'lessonMap.js');

let lessonMap = {};

function addToMap(subject, key, entry) {
    if (!key) return;
    lessonMap[key] = entry;
}

if (fs.existsSync(localDbPath)) {
    console.log("🔍 Scanning local database...");
    const subjects = fs.readdirSync(localDbPath);
    for (const sub of subjects) {
        const dbSubject = sub.toLowerCase();

        const subPath = path.join(localDbPath, sub);
        if (!fs.lstatSync(subPath).isDirectory()) continue;

        // Recursive scanner for subfolders (grades)
        function scanDir(dirPath, grade = null) {
            const items = fs.readdirSync(dirPath);
            for (const item of items) {
                const itemPath = path.join(dirPath, item);
                if (fs.lstatSync(itemPath).isDirectory()) {
                    scanDir(itemPath, item); // child is the grade
                } else if (item.endsWith('.json')) {
                    try {
                        const content = JSON.parse(fs.readFileSync(itemPath, 'utf8'));
                        const title = content.title || (content.lesson_meta && content.lesson_meta.title) || content.பாட_தலைப்பு || content.chapter_title || content.lesson_title;
                        const filename = item.replace('.json', '');
                        const entry = { local: true, filename };
                        if (grade) entry.grade = grade;
                        if (title) entry.title = title;

                        if (title) addToMap(dbSubject, title, entry);
                        addToMap(dbSubject, filename, entry); // Filename as key
                    } catch (e) {
                        // Skip invalid JSON
                    }
                }
            }
        }
        
        scanDir(subPath);
    }
}

// Generate the JS file
const content = `export const lessonMap = ${JSON.stringify(lessonMap, null, 2)};`;
fs.writeFileSync(lessonMapFile, content);
console.log("✅ Successfully regenerated lessonMap.js");
