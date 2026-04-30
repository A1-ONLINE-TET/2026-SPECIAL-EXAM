const fs = require('fs');

const desktopPath = 'c:\\Users\\MATHAN\\Desktop\\கணிதம்\\ADDITIONAL\\MOCK TEST\\mock_test_4.json';
const repoPath = 'c:\\Users\\MATHAN\\2026-SPECIAL-EXAM\\PAPER 1\\json-db\\lessons\\mocktest\\all\\mock_test_4.json';

try {
    const rawDesktop = fs.readFileSync(desktopPath, 'utf8');
    const desktopData = JSON.parse(rawDesktop);

    const convertedQuiz = desktopData.map(q => {
        const options = [q.A, q.B, q.C, q.D];
        const ansChar = q.answer.trim().toUpperCase();
        const ansIdx = ansChar === 'A' ? 0 : ansChar === 'B' ? 1 : ansChar === 'C' ? 2 : 3;

        // Clean up common LaTeX patterns noticed in previous turns
        let cleanedQuestion = q.question.replace(/\$([\s\S]*?)\$/g, '$1').replace(/\\circ/g, '°').replace(/\\_/g, '_');
        let cleanedExplanation = q.explanation.replace(/\$([\s\S]*?)\$/g, '$1').replace(/\\circ/g, '°').replace(/\\_/g, '_');
        let cleanedOptions = options.map(o => String(o).replace(/\$([\s\S]*?)\$/g, '$1').replace(/\\circ/g, '°').replace(/\\_/g, '_'));

        // Uniform Options Fix: Remove English in parentheses if it's ONLY in the correct answer
        const hasParensEng = (s) => /\([a-zA-Z\s]+\)/.test(String(s));
        const statuses = cleanedOptions.map(hasParensEng);
        const uniqueStatuses = [...new Set(statuses)];
        
        if (uniqueStatuses.length > 1) {
            const otherStatuses = statuses.filter((_, idx) => idx !== ansIdx);
            const isOdd = !otherStatuses.includes(statuses[ansIdx]);
            if (isOdd) {
                cleanedOptions[ansIdx] = cleanedOptions[ansIdx].replace(/\s*\([a-zA-Z\s]+\)/, '').trim();
            }
        }

        return {
            question: cleanedQuestion,
            options: cleanedOptions,
            answer: ansIdx,
            explanation: cleanedExplanation
        };
    });

    const finalData = {
        unit: "Mock Test",
        subject: "all",
        grade: "all",
        class: "all",
        title: "மாதிரித்தேர்வு 4",
        summary: "150 வினாக்கள் கொண்ட மாதிரித்தேர்வு 4. இதில் தமிழ், ஆங்கிலம், கணக்கு, அறிவியல், சமூக அறிவியல் மற்றும் உளவியல் பாடங்கள் அடங்கும்.",
        quiz: convertedQuiz
    };

    fs.writeFileSync(repoPath, JSON.stringify(finalData, null, 2), 'utf8');
    console.log(`Successfully converted and fixed 150 questions to ${repoPath}`);

} catch (e) {
    console.error("Error during conversion:", e.message);
}
