const fs = require('fs');
const path = require('path');

const syllabusPath = path.join(__dirname, 'js', 'data', 'syllabus.js');
const extraSyllabusPath = path.join(__dirname, 'js', 'data', 'extraSyllabus.js');
const lessonMapPath = path.join(__dirname, 'js', 'data', 'lessonMap.js');

// 1. Load Lesson Map
let lessonMapCode = fs.readFileSync(lessonMapPath, 'utf8');
let jsonStr = lessonMapCode.substring(lessonMapCode.indexOf('{'), lessonMapCode.lastIndexOf('}') + 1);
const lessonMap = JSON.parse(jsonStr);

// Helper to find entry by code
function findMapEntryByCode(code) {
    return lessonMap[code] || null;
}

// 2. Process Syllabus Files
function processSyllabus(filePath) {
    if (!fs.existsSync(filePath)) return;
    
    let code = fs.readFileSync(filePath, 'utf8');
    let exportName = filePath.includes('extra') ? 'extraSyllabusData' : 'syllabusData';
    let startIdx = code.indexOf('{');
    let endIdx = code.lastIndexOf('}');
    if(startIdx === -1 || endIdx === -1) return;
    
    let obj = JSON.parse(code.substring(startIdx, endIdx + 1));
    let modifiedCount = 0;

    for (let subject in obj) {
        for (let grade in obj[subject]) {
            let terms = obj[subject][grade];
            for (let termObj of terms) {
                for (let unit of termObj.units) {
                    for (let topic of unit.topics) {
                        if (topic.code) {
                            let mapEntry = findMapEntryByCode(topic.code);
                            if (mapEntry) {
                                let changed = false;
                                // Update title if it exists in map and is different
                                if (mapEntry.title && topic.title !== mapEntry.title) {
                                    topic.title = mapEntry.title;
                                    changed = true;
                                }
                                // Update status
                                if (!topic.isUpdated) {
                                    topic.isUpdated = true;
                                    changed = true;
                                }
                                if (changed) modifiedCount++;
                            }
                        }
                    }
                }
            }
        }
    }

    if (modifiedCount > 0) {
        const newContent = `export const ${exportName} = ${JSON.stringify(obj, null, 2)};`;
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`✅ Updated ${modifiedCount} topics in ${path.basename(filePath)}!`);
    } else {
        console.log(`No changes needed in ${path.basename(filePath)}.`);
    }
}

processSyllabus(syllabusPath);
processSyllabus(extraSyllabusPath);
