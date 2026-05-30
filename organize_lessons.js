const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'PAPER 1', 'json-db', 'lessons');
const destDir = path.join(process.env.USERPROFILE, 'Desktop', '2.0 2026-SPECIAL-EXAM');

if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, { recursive: true, force: true });
}

const subjectMap = {
    'tam': 'தமிழ்', 'tamil': 'தமிழ்', 'தமிழ்': 'தமிழ்',
    'eng': 'ஆங்கிலம்', 'english': 'ஆங்கிலம்', 'ஆங்கிலம்': 'ஆங்கிலம்',
    'mat': 'கணிதம்', 'maths': 'கணிதம்', 'கணிதம்': 'கணிதம்',
    'sci': 'அறிவியல்', 'science': 'அறிவியல்', 'அறிவியல்': 'அறிவியல்',
    'soc': 'சமூக அறிவியல்', 'social': 'சமூக அறிவியல்', 'social science': 'சமூக அறிவியல்', 'சமூக அறிவியல்': 'சமூக அறிவியல்',
    'psy': 'உளவியல்', 'psychology': 'உளவியல்', 'உளவியல்': 'உளவியல்'
};

const wordToNum = {
    'ஒன்றாம்': 1, 'முதல்': 1, '1': 1,
    'இரண்டாம்': 2, '2': 2,
    'மூன்றாம்': 3, '3': 3,
    'நான்காம்': 4, '4': 4,
    'ஐந்தாம்': 5, '5': 5
};

function sanitize(name) {
    if (!name) return 'Unknown';
    return name.replace(/[<>:"/\\|?*\x00-\x1F]/g, '-').trim();
}

function extractNum(str) {
    if (!str && str !== 0) return 999;
    const s = String(str).trim();
    const match = s.match(/\d+/);
    if (match) return parseInt(match[0], 10);
    
    // Check Tamil words
    for (const [word, num] of Object.entries(wordToNum)) {
        if (s.includes(word)) return num;
    }
    
    return 999;
}

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
const parsedFiles = [];

for (const file of allFiles) {
    const filename = path.basename(file, '.json');
    
    let content;
    try {
        content = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (e) {
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
        // Last fallback: use folder name
        const folder = path.dirname(file).toLowerCase();
        for (const key of Object.keys(subjectMap)) {
            if (folder.includes(key)) {
                mappedSubj = subjectMap[key];
                break;
            }
        }
    }

    if (!mappedSubj) {
        continue;
    }

    let classNum = extractNum(classRaw);
    let termNum = extractNum(termRaw);
    let lessonNum = extractNum(lessonRaw);

    // If still missing class/term, try from parent folder names
    if (classNum === 999 || termNum === 999) {
        const folderParts = path.dirname(file).split(path.sep);
        for (const f of folderParts) {
            const tempNum = extractNum(f);
            if (tempNum >= 1 && tempNum <= 5 && classNum === 999) classNum = tempNum;
        }
    }

    if (mappedSubj === 'உளவியல்') {
        classNum = 0;
    }

    // FILTER OUT Classes > 5 (The user explicitly requested only classes 1 to 5)
    if (classNum > 5 && classNum !== 999 && mappedSubj !== 'உளவியல்') {
        continue;
    }

    // Skip if we couldn't resolve a valid class for non-psychology subjects
    if (classNum === 999 && mappedSubj !== 'உளவியல்') {
        // console.log(`Skipping because class is 999: ${file}`);
        continue;
    }

    if (!titleRaw) titleRaw = filename;

    if (titleRaw.includes('||')) {
        let titleParts = titleRaw.split('||');
        titleRaw = titleParts[1] ? titleParts[1].trim() : titleParts[0].trim();
    }
    
    let finalTitle = sanitize(titleRaw);

    parsedFiles.push({
        file,
        subject: mappedSubj,
        classNum,
        termNum,
        lessonNum,
        title: finalTitle,
        filename
    });
}

// Group and Deduplicate
const grouped = {};
for (const item of parsedFiles) {
    if (!grouped[item.subject]) grouped[item.subject] = {};
    if (!grouped[item.subject][item.classNum]) grouped[item.subject][item.classNum] = {};
    
    const dedupKey = `t${item.termNum}_l${item.lessonNum}_${item.title}`;
    
    if (grouped[item.subject][item.classNum][dedupKey]) {
        const existingFile = grouped[item.subject][item.classNum][dedupKey].file;
        if (existingFile.split(path.sep).length < item.file.split(path.sep).length) {
            grouped[item.subject][item.classNum][dedupKey] = item;
        }
    } else {
        grouped[item.subject][item.classNum][dedupKey] = item;
    }
}

let totalCopied = 0;

for (const subj in grouped) {
    for (const cls in grouped[subj]) {
        let lessons = Object.values(grouped[subj][cls]);
        
        lessons.sort((a, b) => {
            if (a.termNum !== b.termNum) return a.termNum - b.termNum;
            if (a.lessonNum !== b.lessonNum) return a.lessonNum - b.lessonNum;
            return a.filename.localeCompare(b.filename);
        });

        let targetDir = path.join(destDir, subj);
        if (subj !== 'உளவியல்') {
            targetDir = path.join(targetDir, `${cls} ஆம் வகுப்பு`);
        }
        
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        let seq = 1;
        for (const item of lessons) {
            const ext = path.extname(item.file);
            const newName = `${seq} - ${item.title}${ext}`;
            const targetPath = path.join(targetDir, newName);
            
            try {
                fs.copyFileSync(item.file, targetPath);
                totalCopied++;
                seq++;
            } catch (err) {
                console.error(`Error copying ${item.file}:`, err.message);
            }
        }
    }
}

console.log(`\nSuccess! Extracted, deduplicated, and organized ${totalCopied} files into ${destDir}`);
