
const fs = require('fs');
const path = require('path');

function parseQuestions(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Split by double asterisk pattern for questions: **1. ...**
    const questionsRaw = content.split(/\n\s*\*\*\s*(\d+)\./);
    
    const parsed = [];
    for (let i = 1; i < questionsRaw.length; i += 2) {
        const qNum = questionsRaw[i];
        const qBody = questionsRaw[i+1];
        
        let qTextMatch = qBody.match(/^(.*?)\s*\*\*/s);
        if (!qTextMatch) {
            qTextMatch = qBody.match(/^(.*?)\s*[a-d]\)/s);
        }
        
        const qText = qTextMatch ? `${qNum}. ${qTextMatch[1].trim()}` : `${qNum}. Unknown`;
        
        const a = qBody.match(/a\)\s*(.*?)\s*[b-d]\)/);
        const b = qBody.match(/b\)\s*(.*?)\s*[c-d]\)/);
        const c = qBody.match(/c\)\s*(.*?)\s*(d\)|$)/);
        const d = qBody.match(/d\)\s*(.*?)\s*(\*\*|$)/);
        
        const options = [
            a ? a[1].trim() : "",
            b ? b[1].trim() : "",
            c ? c[1].trim() : "",
            d ? d[1].trim() : ""
        ];
        
        let ansMatch = qBody.match(/\*\*விடை:\*\*\s*([a-d])\)\s*(.*?)\s*\*\*விளக்கம்:\*\*\s*(.*?)(?=\r?\n|$)/);
        if (!ansMatch) {
            ansMatch = qBody.match(/\*\*Answer:\*\*\s*([a-d])\)\s*(.*?)\s*\*\*Explanation:\*\*\s*(.*?)(?=\r?\n|$)/);
        }
        
        let ansIdx = 0;
        let ansFull = "Unknown";
        let explanation = "";
        
        if (ansMatch) {
            const ansLetter = ansMatch[1];
            const ansText = ansMatch[2].trim();
            explanation = ansMatch[3].trim();
            ansIdx = ansLetter.charCodeAt(0) - 'a'.charCodeAt(0);
            ansFull = `${ansLetter}) ${ansText} (விளக்கம்: ${explanation})`;
        }

        parsed.append = parsed.push({
            question: qText,
            options: options,
            answer_idx: ansIdx,
            answer_full: ansFull,
            explanation: explanation
        });
    }
    
    return parsed;
}

const data1 = parseQuestions('C:\\Users\\MATHAN\\2026-SPECIAL-EXAM\\PAPER 1\\raw_questions_1.txt');
const data2 = parseQuestions('C:\\Users\\MATHAN\\2026-SPECIAL-EXAM\\PAPER 1\\raw_questions_2.txt');
const allData = [...data1, ...data2];

const subjectNames = [
    "பகுதி 1: தமிழ் (1 - 30 வினாக்கள்)",
    "பகுதி 2: ஆங்கிலம் (31 - 60 வினாக்கள்)",
    "பகுதி 3: கணிதம் (61 - 90 வினாக்கள்)",
    "பகுதி 4: அறிவியல் (91 - 120 வினாக்கள்)",
    "பகுதி 5: சமூக அறிவியல் (121 - 150 வினாக்கள்)",
    "பகுதி 6: உளவியல் (151 - 180 வினாக்கள்)"
];

const sections = [];
for (let i = 0; i < 6; i++) {
    const start = i * 30;
    const end = (i + 1) * 30;
    const sectionData = allData.slice(start, end);
    
    sections.push({
        title: subjectNames[i],
        type: "evaluation",
        evaluationData: {
            mcqs: sectionData.map(q => ({
                question: q.question,
                answer: q.answer_full
            }))
        }
    });
}

const quiz = allData.map(q => ({
    q: q.question,
    options: q.options,
    a: q.answer_idx,
    ex: q.explanation
}));

const finalJson = {
    unit: "Special",
    subject: "Revision",
    class: "all",
    title: "பாடக்குறிப்புகள் (180 வினாக்கள் தொகுப்பு)",
    summary: "TET தேர்வுக்குத் தேவையான தமிழ், ஆங்கிலம், கணிதம், அறிவியல், சமூக அறிவியல் மற்றும் உளவியல் ஆகிய பகுதிகளில் இருந்து மிக முக்கியமான 180 வினாக்கள் மற்றும் விளக்கங்கள்.",
    sections: sections,
    quiz: quiz
};

fs.writeFileSync('C:\\Users\\MATHAN\\2026-SPECIAL-EXAM\\PAPER 1\\json-db\\lessons\\revision\\all\\rev_special_180.json', JSON.stringify(finalJson, null, 2), 'utf-8');

console.log("Successfully updated rev_special_180.json");
