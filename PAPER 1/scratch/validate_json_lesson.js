const fs = require('fs');

const lessonFile = "PAPER 1/json-db/lessons/science/5/sci_5_t1_l1.json";

function validateJson(filePath) {
    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        console.log(`Checking ${filePath}...`);
        
        if (!data.quiz || !data.quiz.questions) {
            console.error("Missing quiz questions!");
            return;
        }
        
        let errors = 0;
        data.quiz.questions.forEach((q, i) => {
            if (q.answer === -1) {
                console.error(`Error in Q${i+1}: Answer index not found! Answer was: ${q.answer}`);
                errors++;
            }
            if (!q.explanation) {
                console.error(`Error in Q${i+1}: Missing explanation!`);
                errors++;
            }
            if (!q.options || q.options.length < 2) {
                console.error(`Error in Q${i+1}: Missing options!`);
                errors++;
            }
            // Check for empty strings
            q.options.forEach((opt, j) => {
                if (!opt || opt.trim() === "") {
                    console.error(`Error in Q${i+1}: Empty option at index ${j}!`);
                    errors++;
                }
            });
        });
        
        if (errors === 0) {
            console.log("✅ JSON Quiz Validation Passed!");
        } else {
            console.log(`❌ Found ${errors} errors.`);
        }
    } catch (e) {
        console.error("JSON Parse Error: " + e.message);
    }
}

validateJson(lessonFile);
