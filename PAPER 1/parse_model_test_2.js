const fs = require('fs');

const inputFile = 'raw_model_test_2.txt';
const outputFile = 'json-db/lessons/revision/all/model_test_2.json';

const text = fs.readFileSync(inputFile, 'utf-8');
const lines = text.split(/\r?\n/);

const sections = [];
let currentSection = null;
const quiz = [];

// Regex patterns
const sectionPattern = /^பகுதி ([IV]+): (.+)/;
const questionStartPattern = /^வினா (\d+):/;

let i = 0;
while (i < lines.length) {
    let line = lines[i].trim();
    
    if (line.startsWith('பகுதி')) {
        const match = line.match(sectionPattern);
        if (match) {
            const partNum = match[1];
            const titleBn = match[2].trim();
            
            if (i + 1 < lines.length && (lines[i+1].trim().match(/^[A-Za-z &]+$/) || lines[i+1].trim().includes('&'))) {
                i++;
            }
            
            currentSection = {
                title: `பகுதி ${partNum}: ${titleBn}`,
                type: "evaluation",
                evaluationData: {
                    mcqs: []
                }
            };
            sections.push(currentSection);
        }
    } else if (line.match(questionStartPattern)) {
        const match = line.match(questionStartPattern);
        const qNum = match[1];
        i++;
        const qText = lines[i].trim();
        
        // options
        const options = [];
        let ansIdx = -1;
        
        while (i + 1 < lines.length && (lines[i+1].trim().startsWith("அ)") || lines[i+1].trim().startsWith("ஆ)") || lines[i+1].trim().startsWith("இ)") || lines[i+1].trim().startsWith("ஈ)"))) {
            i++;
            let optLine = lines[i].trim();
            let optText = optLine.substring(3).trim(); // remove "அ) "
            
            if (optText.includes("✓")) {
                ansIdx = options.length;
                optText = optText.replace("✓ (சரியான விடை)", "").trim();
                optText = optText.replace("✓", "").trim();
            }
            
            options.push(optText);
        }
        
        // explanation
        let exText = "";
        while (i + 1 < lines.length && (lines[i+1].trim().startsWith("விளக்கம்:") || (!lines[i+1].trim().startsWith("---") && !lines[i+1].trim().startsWith("வினா") && !lines[i+1].trim().startsWith("====="))) && lines[i+1].trim().length > 0) {
            i++;
            let exLine = lines[i].trim();
            if (exLine.startsWith("விளக்கம்:")) {
                exText += exLine.substring(9).trim();
            } else {
                exText += " " + exLine;
            }
        }
        exText = exText.trim();
        
        const alphabets = ["A", "B", "C", "D"];
        const correctAlphabet = ansIdx !== -1 ? alphabets[ansIdx] : "A";
        
        const mcq = {
            question: `${qNum}. ${qText}`,
            answer: `${correctAlphabet}) ${options[ansIdx]} (விளக்கம்: ${exText})`
        };
        
        if (currentSection) {
            currentSection.evaluationData.mcqs.push(mcq);
        }
        
        const quizEntry = {
            q: `${qNum}. ${qText}`,
            options: options,
            a: ansIdx,
            ex: exText
        };
        quiz.push(quizEntry);
    }
    
    i++;
}

const outputData = {
    meta: {
        title: "மாதிரித் தேர்வு 2 (150 வினாக்கள்)"
    },
    unit: "Model Test",
    subject: "Revision",
    class: "all",
    title: "TET மாதிரித் தேர்வு - 2",
    summary: "TET தேர்வு - தாள் 1 மாதிரித்தேர்வு 2 (150 வினாக்கள் தொகுப்பு)",
    totalQuestions: quiz.length,
    sections: sections,
    quiz: quiz
};

fs.writeFileSync(outputFile, JSON.stringify(outputData, null, 2), 'utf-8');
console.log(`Successfully processed ${quiz.length} questions. Output saved to ${outputFile}`);
