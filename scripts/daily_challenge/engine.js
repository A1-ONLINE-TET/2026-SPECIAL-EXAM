const fs = require('fs');
const path = require('path');
const https = require('https');

const TRACKER_FILE = path.join(__dirname, 'tracker.json');
const TARGET_REPO = 'a1onlinecoachingcenter-star/test-series-';
const TOKEN = process.env.MY_GITHUB_TOKEN;

// Hardcoded sorted lists based on your rules (Descending from 5th to 1st)
// In a real scenario, this builds from the directory.
const SYLLABUS_ORDER = {
    tamil: ['5','4','3','2','1'],
    english: ['5','4','3','2','1'],
    maths: ['5','4','3','2','1'],
    science: ['5','4','3','2','1'],
    social: ['5','4','3','2','1']
};

function getAllFilesForSubject(subject) {
    const basePath = path.join(__dirname, '../../PAPER 1/json-db/lessons', subject);
    if (!fs.existsSync(basePath)) return [];
    
    let allFiles = [];
    const classes = SYLLABUS_ORDER[subject] || ['5','4','3','2','1'];
    
    for (const cls of classes) {
        const clsPath = path.join(basePath, cls);
        if (fs.existsSync(clsPath)) {
            const files = fs.readdirSync(clsPath).filter(f => f.endsWith('.json'));
            // Sort by natural number if terms and lessons exist e.g. tam_5_t1_l1
            files.sort((a,b) => a.localeCompare(b, undefined, {numeric: true, sensitivity: 'base'}));
            allFiles.push(...files.map(f => path.join(clsPath, f)));
        }
    }
    return allFiles;
}

async function uploadToGithub(filePath, content, message) {
    return new Promise((resolve, reject) => {
        const encodedContent = Buffer.from(content).toString('base64');
        const url = `https://api.github.com/repos/${TARGET_REPO}/contents/${filePath}`;
        
        // Need to get SHA first
        const options = {
            method: 'GET',
            headers: { 'User-Agent': 'NodeJS', 'Authorization': `Bearer ${TOKEN}` }
        };
        
        const req = https.request(url, options, (res) => {
            let data = '';
            res.on('data', d => data += d);
            res.on('end', () => {
                let sha = null;
                if (res.statusCode === 200) {
                    sha = JSON.parse(data).sha;
                }
                
                const putData = JSON.stringify({
                    message: message,
                    content: encodedContent,
                    sha: sha,
                    branch: 'main'
                });
                
                const putOpts = {
                    method: 'PUT',
                    headers: {
                        'User-Agent': 'NodeJS',
                        'Authorization': `Bearer ${TOKEN}`,
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(putData)
                    }
                };
                
                const putReq = https.request(url, putOpts, (putRes) => {
                    putRes.on('end', () => resolve());
                    putRes.resume();
                });
                putReq.write(putData);
                putReq.end();
            });
        });
        req.end();
    });
}

async function run() {
    let action = process.argv[2] || 'open'; // 'notes', 'open', 'close', 'test'
    if (action === 'test') { action = 'open'; }

    let dayStr = new Date().toLocaleString('en-US', { weekday: 'short', timeZone: 'Asia/Kolkata' });
    if (process.env.TEST_DAY) {
        dayStr = process.env.TEST_DAY;
    }

    console.log(`Running Action: ${action} for Day: ${dayStr}`);

    if (action === 'close') {
        await uploadToGithub('1.json', JSON.stringify({ title: "Disabled", quiz: [] }, null, 2), "Auto Close Daily Exam");
        console.log('Closed successfully');
        return;
    }

    let tracker = JSON.parse(fs.readFileSync(TRACKER_FILE, 'utf8'));

    let targetSubject = '';
    let isTest = false;

    if (dayStr === 'Mon') targetSubject = 'tamil';
    else if (dayStr === 'Tue') targetSubject = 'english';
    else if (dayStr === 'Wed') targetSubject = 'maths';
    else if (dayStr === 'Thu') targetSubject = 'science';
    else if (dayStr === 'Fri') targetSubject = 'social';
    else if (dayStr === 'Sat') { targetSubject = 'revision'; isTest = true; }
    else if (dayStr === 'Sun') { targetSubject = 'mocktest'; isTest = true; }

    let finalQuiz = [];
    let testTitle = "";

    if (isTest) {
        let testIdx = tracker[targetSubject];
        testIdx = testIdx + 1; // Since we start at 0 but tests usually start at 1
        
        let filePrefix = targetSubject === 'revision' ? 'rev_special' : 'mock_test';
        let basePath = path.join(__dirname, `../../PAPER 1/json-db/lessons/${targetSubject}/all`);
        // Try finding actual file
        let files = fs.readdirSync(basePath).filter(f => f.endsWith('.json'));
        let chosenFile = files.find(f => f.includes(`_${testIdx}.`)) || files[0];
        
        console.log(`Picking Test: ${chosenFile}`);
        let data = JSON.parse(fs.readFileSync(path.join(basePath, chosenFile), 'utf8'));
        
        if (action === 'notes') {
            testTitle = `${data.title} - Notes`;
            finalQuiz = data.quiz.map(q => ({ question: q.question, explanation: q.explanation || "No notes available." }));
        } else {
            testTitle = data.title;
            finalQuiz = data.quiz;
        }

        if (action === 'open') {
            tracker[targetSubject] = testIdx; 
        }
    } else {
        const files = getAllFilesForSubject(targetSubject);
        let idx = tracker[targetSubject];
        
        let file1 = files[idx] || files[0];
        let file2 = files[idx + 1] || files[0]; // Roll around or just pick next
        
        console.log(`Picking Lessons: \n - ${file1} \n - ${file2}`);
        
        let d1 = JSON.parse(fs.readFileSync(file1, 'utf8'));
        let d2 = JSON.parse(fs.readFileSync(file2, 'utf8'));
        
        let q1 = d1.quiz || d1.sections[0].content || d1;
        let q2 = d2.quiz || d2.sections[0].content || d2;
        if (!Array.isArray(q1)) q1 = [];
        if (!Array.isArray(q2)) q2 = [];

        if (action === 'notes') {
            testTitle = "Daily Notes - " + targetSubject.toUpperCase();
            finalQuiz = [...q1, ...q2].map(q => ({ question: q.question, explanation: q.explanation || "No notes available." }));
        } else {
            testTitle = "Daily Exam - " + targetSubject.toUpperCase();
            finalQuiz = [...q1, ...q2];
        }

        if (action === 'open') {
            tracker[targetSubject] = idx + 2;
        }
    }

    let payload = {
        title: testTitle,
        downloadable: false, // UI indication to disable download
        unit: 'Daily Challenge',
        quiz: finalQuiz
    };

    console.log(`Uploading ${finalQuiz.length} questions to GitHub...`);
    await uploadToGithub('1.json', JSON.stringify(payload, null, 2), `Auto Push for ${targetSubject} - Action: ${action}`);
    
    // Save state back
    if (action === 'open') {
        fs.writeFileSync(TRACKER_FILE, JSON.stringify(tracker, null, 2), 'utf8');
        console.log('Tracker state updated.');
    }
}

run().catch(err => console.error(err));
