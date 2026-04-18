const fs = require('fs');
const data = JSON.parse(fs.readFileSync('c:\\Users\\MATHAN\\2026-SPECIAL-EXAM\\PAPER 1\\json-db\\lessons\\revision\\all\\rev_special_3.json', 'utf8'));

let parsedPYQ = [];
if (data.sections) {
    data.sections.forEach(sec => {
        if (sec.type === 'pyq' || sec.type === 'mocktest' || sec.type === 'evaluation') {
            const evalData = sec.evaluationData ? (sec.evaluationData.mcqs || []) : [];
            const contentArray = Array.isArray(sec.content) ? sec.content : evalData;
            contentArray.forEach(item => {
                parsedPYQ.push(item);
            });
        }
    });
}

let questions = data.quiz ? (data.quiz.questions || (Array.isArray(data.quiz) ? data.quiz : [])) : (data.questions || []);
if (questions.length === 0 && parsedPYQ.length > 0) {
    questions = parsedPYQ;
}

console.log("questions.length: ", questions.length);
console.log("data.quiz exists: ", !!data.quiz);
if(data.quiz) console.log("data.quiz.questions exists: ", !!data.quiz.questions);
