const fs = require('fs');
const path = require('path');

const baseDir = 'c:\\Users\\MATHAN\\2026-SPECIAL-EXAM\\PAPER 1\\json-db\\lessons';

const config = [
    { subject: 'tamil', grade: '4', count: 30, title: 'தமிழ் (Tamil)' },
    { subject: 'english', grade: '4', count: 30, title: 'English' },
    { subject: 'maths', grade: '4', count: 30, title: 'கணிதம் (Maths)' },
    { subject: 'science', grade: '5', count: 30, title: 'அறிவியல் (Science)' },
    { subject: 'social', grade: '5', count: 30, title: 'சமூக அறிவியல் (Social Science)' }
];

let allQuestions = [];
let allMaterialText = '';

function cleanBySubject(text, subject) {
    if (!text) return "";
    let str = text.toString();
    const tamilRegex = /[\u0b80-\u0bff]+/;
    const targetLang = (subject === 'english') ? 'en' : 'tm';

    // 1. Handle || separator
    if (str.includes('||')) {
        const parts = str.split('||');
        if (targetLang === 'tm') {
            str = (tamilRegex.test(parts[1]) ? parts[1] : parts[0]).trim();
        } else {
            str = (!tamilRegex.test(parts[0]) ? parts[0] : parts[1]).trim();
        }
    }

    // 2. Handle / separator (if it looks like a translation)
    if (str.includes(' / ')) {
        const parts = str.split(' / ');
        if (targetLang === 'tm') {
            if (tamilRegex.test(parts[0]) && !tamilRegex.test(parts[1])) str = parts[0].trim();
            else if (tamilRegex.test(parts[1]) && !tamilRegex.test(parts[0])) str = parts[1].trim();
        } else {
            if (!tamilRegex.test(parts[0]) && tamilRegex.test(parts[1])) str = parts[0].trim();
            else if (!tamilRegex.test(parts[1]) && tamilRegex.test(parts[0])) str = parts[1].trim();
        }
    }

    // 3. Remove English inside parentheses for Tamil subjects, or vice versa
    if (targetLang === 'tm') {
        // Remove patterns like (English Text)
        str = str.replace(/\([A-Za-z0-9\s,.-]+\)/g, '').trim();
    } else {
        // If target is English, remove patterns like (Tamil Text)
        str = str.replace(/\([\u0b80-\u0bff\s,.-]+\)/g, '').trim();
    }

    // Cleanup extra spaces
    str = str.replace(/\s+/g, ' ').trim();
    return str;
}

config.forEach(item => {
    const dir = path.join(baseDir, item.subject, item.grade);
    if (!fs.existsSync(dir)) {
        console.error(`Directory not found: ${dir}`);
        return;
    }

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
    let subjectQuestionsPool = [];

    files.forEach(file => {
        const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
        let qs = data.quiz ? (data.quiz.questions || []) : (data.questions || []);
        subjectQuestionsPool = subjectQuestionsPool.concat(qs);
    });

    console.log(`Subject: ${item.subject}, Grade: ${item.grade}, Total Pool: ${subjectQuestionsPool.length}`);

    // Shuffle and pick 30
    const shuffled = subjectQuestionsPool.sort(() => 0.5 - Math.random());
    let selected = [];
    for (const q of shuffled) {
        if (selected.length >= item.count) break;
        const qText = q.question || q.q || "";
        
        // Skip Assertion/Reason questions
        if (qText.includes('கூற்று') || qText.includes('காரணம்')) {
            continue;
        }

        const qClean = cleanBySubject(qText, item.subject);
        
        selected.push({
            question: qClean,
            options: (q.options || []).map(opt => cleanBySubject(opt, item.subject) || opt),
            answer: q.answer !== undefined ? q.answer : q.a,
            explanation: cleanBySubject(q.explanation || q.ex || "", item.subject)
        });
    }

    allQuestions = allQuestions.concat(selected);
});

// Final JSON structure
const finalData = {
    lesson_meta: {
        title: "திருப்புதல் தேர்வு 3 (Revision Test 3)",
        grade: "all",
        subject: "revision",
        code: "rev_special_3",
        term: "Annual"
    },
    quiz: {
        questions: allQuestions
    },
    questions: allQuestions,
    material: {
        sections: [
            {
                title: "திருப்புதல் தேர்வு 3 - வினா விடைகள்",
                content: allQuestions.map((q, i) => {
                    const ansText = (q.options && q.options[q.answer] !== undefined) ? q.options[q.answer] : "N/A";
                    // Subject-aware labels
                    const isEng = (i >= 30 && i < 60); 
                    const qL = isEng ? "Question" : "வினா";
                    const aL = isEng ? "Answer" : "விடை";
                    
                    return `
                    <div style="background:#fff; border-radius:12px; padding:15px; margin-bottom:15px; border:1px solid #eee; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                        <div style="color:#1a73e8; font-weight:bold; margin-bottom:8px; font-size:0.9rem;">${qL} ${i+1}</div>
                        <div style="color:#1e293b; margin-bottom:10px; font-size:1.1rem; line-height:1.6; font-weight:500;">${q.question}</div>
                        <div style="background:#f0fdf4; border-radius:8px; padding:12px; border-left:4px solid #22c55e;">
                            <span style="font-weight:bold; color:#15803d; font-size:0.9rem;">${aL}:</span> 
                            <span style="color:#0f172a; font-size:1rem;">${ansText}</span>
                        </div>
                    </div>`;
                }).join('')
            }
        ]
    }
};

fs.writeFileSync('c:\\Users\\MATHAN\\2026-SPECIAL-EXAM\\PAPER 1\\json-db\\lessons\\revision\\all\\rev_special_3.json', JSON.stringify(finalData, null, 2));
console.log('Revision Test 3 created successfully with ' + allQuestions.length + ' questions.');
