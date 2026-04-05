const fs = require('fs');
const path = require('path');

// Configuration
const targetFile = process.argv[2] || 'PAPER 1/raw_materials/mock_test_1.txt';

function validateMockTest(filePath) {
    console.log(`\n🔍 Scanning file: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${filePath}`);
        return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    let errors = 0;
    let warnings = 0;

    console.log("-----------------------------------------");

    // 1. Check for empty options (A) (B) (C) (D)
    // Looking for cases where (A) is followed by (B) with only spaces, or (D) followed by nothing/Answer
    const emptyOptionMatch = content.match(/\([A-D]\)\s{2,}\(/g) || [];
    if (emptyOptionMatch.length > 0) {
        console.error(`❌ ERROR: Found ${emptyOptionMatch.length} positions with empty options!`);
        errors++;
    }

    // 2. Check for missing answers
    const questions = (content.match(/\d{1,3}\./g) || []).length;
    const answers = (content.match(/விடை:/g) || []).length;
    if (questions !== answers) {
        console.warn(`⚠️ WARNING: Question/Answer mismatch! Questions: ${questions}, Answers: ${answers}`);
        warnings++;
    } else {
        console.log(`✅ Questions and Answers count matches (${questions}).`);
    }

    // 3. Find specific broken questions (missing math content/blank parenthesis)
    // Regex matches question numbers where the text between options is just whitespace or missing
    const brokenPattern = /\d{1,3}\.[^?®]*\?\s*\(A\)\s+\(B\)/g;
    const brokenMatches = content.match(brokenPattern);
    if (brokenMatches) {
        brokenMatches.forEach(m => {
            console.log("🚨 Missing content in: " + m.trim().substring(0, 60) + "...");
        });
        errors += brokenMatches.length;
    }

    // 4. Check for missing explanations
    const explanations = (content.match(/விளக்கம்:/g) || []).length;
    if (explanations < answers) {
        console.warn(`⚠️ WARNING: ${answers - explanations} questions are missing the 'விளக்கம்:' section.`);
        warnings++;
    }

    // 5. Final Report
    console.log("-----------------------------------------");
    if (errors === 0 && warnings === 0) {
        console.log("✅ NO ERRORS FOUND. File is healthy.");
    } else {
        console.log(`📊 TOTAL: ${errors} Errors found, ${warnings} Warnings raised.`);
    }
    console.log("-----------------------------------------\n");
}

// Run for the target file
const absolutePath = path.resolve(process.cwd(), targetFile);
validateMockTest(absolutePath);
