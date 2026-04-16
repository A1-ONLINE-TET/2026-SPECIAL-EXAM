const fs = require('fs');
const path = require('path');

const filePath = 'PAPER 1/json-db/lessons/science/5/sci_5_t1_l2.json';
const fileContent = fs.readFileSync(filePath, 'utf-8');
const lesson = JSON.parse(fileContent);

console.log("--- Validation Report for sci_5_t1_l2.json ---");

// 1. Check metadata
console.log(`Title: ${lesson.lesson_meta.title}`);
console.log(`Code: ${lesson.lesson_meta.code}`);

// 2. Check study materials
if (lesson.material && lesson.material.sections.length > 0) {
    console.log(`✅ Material sections: ${lesson.material.sections.length}`);
} else {
    console.log(`❌ No material sections found.`);
}

// 3. Check quiz
const questions = lesson.quiz.questions;
console.log(`✅ Number of questions: ${questions.length}`);

let errorCount = 0;
questions.forEach((q, index) => {
    // Check for answer index
    if (q.answer < 0 || q.answer >= q.options.length) {
        console.log(`❌ Question ${index + 1}: Invalid answer index ${q.answer}`);
        errorCount++;
    }
    // Check for explanation
    if (!q.explanation || q.explanation.length < 5) {
        console.log(`❌ Question ${index + 1}: Missing or short explanation`);
        errorCount++;
    }
});

if (errorCount === 0) {
    console.log("✅ All assessment questions are valid.");
} else {
    console.log(`❌ Found ${errorCount} errors in the assessment bank.`);
}
