const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'PAPER 1', 'json-db', 'lessons');

const subjectMap = {
    'tam': 'தமிழ்', 'tamil': 'தமிழ்', 'தமிழ்': 'தமிழ்',
    'eng': 'ஆங்கிலம்', 'english': 'ஆங்கிலம்', 'ஆங்கிலம்': 'ஆங்கிலம்',
    'mat': 'கணிதம்', 'maths': 'கணிதம்', 'கணிதம்': 'கணிதம்',
    'sci': 'அறிவியல்', 'science': 'அறிவியல்', 'அறிவியல்': 'அறிவியல்',
    'soc': 'சமூக அறிவியல்', 'social': 'சமூக அறிவியல்', 'social science': 'சமூக அறிவியல்', 'சமூக அறிவியல்': 'சமூக அறிவியல்',
    'psy': 'உளவியல்', 'psychology': 'உளவியல்', 'உளவியல்': 'உளவியல்'
};

function walkSync(dir, filelist = []) {
    if (!fs.existsSync(dir)) return filelist;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            filelist = walkSync(filepath, filelist);
        } else if (file.endsWith('.json')) {
            filelist.push(filepath);
        }
    }
    return filelist;
}

const allFiles = walkSync(srcDir);
console.log(`Total JSON files in source: ${allFiles.length}`);

const skippedFiles = [];
const validFiles = [];

for (const file of allFiles) {
    const filename = path.basename(file, '.json');
    
    let content;
    try {
        content = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (e) {
        skippedFiles.push({ file, reason: "Invalid JSON" });
        continue;
    }

    let subjRaw = '', classRaw = '', termRaw = '', lessonRaw = '', titleRaw = '';

    titleRaw = content["பாட_தலைப்பு"] || content["பாடத் தலைப்பு"] || content["lesson_title"] || content["title"] || "";
    classRaw = content["வகுப்பு"] || content["class"] || content["grade"] || "";
    termRaw = content["பருவம்"] || content["term"] || "";
    lessonRaw = content["பாட_எண்"] || content["lesson_number"] || content["unit"] || "";
    subjRaw = content["பாடம்"] || content["subject"] || "";

    if (content.lesson_meta) {
        if (!titleRaw) titleRaw = content.lesson_meta.title || "";
        if (!classRaw) classRaw = content.lesson_meta.grade || "";
        if (!termRaw) termRaw = content.lesson_meta.term || "";
        if (!lessonRaw) lessonRaw = content.lesson_meta.unit || "";
        if (!subjRaw) subjRaw = content.lesson_meta.subject || "";
    }

    const parts = filename.split('_');
    if (parts.length >= 4) {
        if (!classRaw) classRaw = parts[1];
        if (!termRaw && parts[2].startsWith('t')) termRaw = parts[2];
        if (!lessonRaw && parts[3].startsWith('l')) lessonRaw = parts[3];
    }

    let mappedSubj = subjectMap[subjRaw.toLowerCase()] || subjectMap[subjRaw.replace(/\d/g,'').toLowerCase()];
    
    if (!mappedSubj) {
        if (subjRaw.toLowerCase().includes('social')) mappedSubj = 'சமூக அறிவியல்';
        else if (parts.length >= 1 && subjectMap[parts[0]]) mappedSubj = subjectMap[parts[0]];
    }

    if (!mappedSubj) {
        // Look at folder name as a last resort
        const folder = path.dirname(file).toLowerCase();
        for (const key of Object.keys(subjectMap)) {
            if (folder.includes(key)) {
                mappedSubj = subjectMap[key];
                break;
            }
        }
    }

    if (!mappedSubj) {
        skippedFiles.push({ file, reason: "Subject could not be determined", details: `subjRaw: '${subjRaw}', filename: '${filename}'` });
        continue;
    }

    // Checking if class is completely missing (unless it's psychology)
    let classNum = parseInt(String(classRaw).match(/\d+/), 10);
    if (isNaN(classNum) && mappedSubj !== 'உளவியல்') {
        skippedFiles.push({ file, reason: "Class missing", details: `classRaw: '${classRaw}'` });
        continue;
    }

    // Checking if term or lesson is missing
    let termNum = parseInt(String(termRaw).match(/\d+/), 10);
    let lessonNum = parseInt(String(lessonRaw).match(/\d+/), 10);
    if (isNaN(termNum) || isNaN(lessonNum)) {
        skippedFiles.push({ file, reason: "Term or Lesson missing", details: `termRaw: '${termRaw}', lessonRaw: '${lessonRaw}'` });
        continue;
    }

    validFiles.push(file);
}

console.log(`Valid files processed: ${validFiles.length}`);
console.log(`Skipped files: ${skippedFiles.length}`);
if (skippedFiles.length > 0) {
    console.log("\nDetails of skipped files:");
    skippedFiles.forEach(s => console.log(`- ${path.basename(s.file)}: ${s.reason} (${s.details || ''})`));
}
