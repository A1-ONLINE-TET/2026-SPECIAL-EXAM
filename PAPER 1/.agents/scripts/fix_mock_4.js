const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../json-db/lessons/mocktest/all/mock_test_4.json');
const rawData = fs.readFileSync(filePath, 'utf8');
const oldData = JSON.parse(rawData);

const transformedData = {
    "unit": "Mock Test",
    "subject": "all",
    "grade": "all",
    "class": "all",
    "title": "மாதிரித்தேர்வு 4",
    "summary": "150 வினாக்கள் கொண்ட மாதிரித்தேர்வு 4. இதில் தமிழ், ஆங்கிலம், கணக்கு, அறிவியல், சமூக அறிவியல் மற்றும் உளவியல் பாடங்கள் அடங்கும்.",
    "quiz": oldData.map(q => {
        const optionMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
        return {
            question: q.question,
            options: [q.A, q.B, q.C, q.D],
            answer: optionMap[q.answer] ?? 0,
            explanation: q.explanation
        };
    })
};

fs.writeFileSync(filePath, JSON.stringify(transformedData, null, 2), 'utf8');
console.log('Mock Test 4 formatted successfully.');
