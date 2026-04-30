const fs = require('fs');
const path = require('path');

const filePath = 'c:\\Users\\MATHAN\\2026-SPECIAL-EXAM\\PAPER 1\\json-db\\lessons\\mocktest\\all\\mock_test_4.json';

try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);
    let hasChanged = false;
    let count = 0;

    const questions = data.quiz || [];
    questions.forEach((q, i) => {
        const options = q.options || [];
        const answerIdx = q.answer;

        if (answerIdx === undefined || answerIdx >= options.length) return;

        const hasParensEng = (s) => /\([a-zA-Z\s]+\)/.test(String(s));
        const status = options.map(hasParensEng);

        const uniqueStatuses = [...new Set(status)];
        if (uniqueStatuses.length > 1) {
            // Check if answer is the odd one out
            const otherStatuses = status.filter((_, idx) => idx !== answerIdx);
            const isOdd = !otherStatuses.includes(status[answerIdx]);

            if (isOdd) {
                console.log(`Question ${i + 1} is odd. Options: ${JSON.stringify(options)}. Answer: ${answerIdx}`);
                const currentAns = options[answerIdx];
                const newAns = currentAns.replace(/\s*\([a-zA-Z\s]+\)/, '').trim();
                options[answerIdx] = newAns;
                hasChanged = true;
                count++;
            }
        }
    });

    if (hasChanged) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Fixed ${count} questions.`);
    } else {
        console.log("No odd questions found.");
    }
} catch (e) {
    console.error(e.message);
}
