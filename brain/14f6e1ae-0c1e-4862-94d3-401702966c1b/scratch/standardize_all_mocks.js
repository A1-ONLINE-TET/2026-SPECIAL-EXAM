const fs = require('fs');

function cleanText(text) {
    if (!text) return "";
    return String(text)
        .replace(/\$([\s\S]*?)\$/g, '$1')
        .replace(/\\circ/g, '°')
        .replace(/\\_/g, '___')
        .replace(/(\d+)\^(\d+)/g, '$1$2') // handle exponent formatting if needed
        .trim();
}

function processFile(inputPath, outputPath, testTitle) {
    console.log(`Processing ${inputPath}...`);
    const raw = fs.readFileSync(inputPath, 'utf8');
    const data = JSON.parse(raw);

    let rawQuestions = [];

    // 1. Check quiz array
    if (data.quiz && Array.isArray(data.quiz)) {
        rawQuestions = data.quiz;
    } 
    // 2. Check sections
    else if (data.sections && Array.isArray(data.sections)) {
        data.sections.forEach(sec => {
            const list = sec.content || sec.questions || sec.evaluationData || [];
            if (Array.isArray(list)) {
                list.forEach(q => rawQuestions.push(q));
            }
        });
    }
    // 3. Check root array
    else if (Array.isArray(data)) {
        rawQuestions = data;
    }

    const convertedQuiz = rawQuestions.map(q => {
        let question = q.question || q.q || "";
        let options = q.options || [];
        let answer = q.answer !== undefined ? q.answer : q.a;
        let explanation = q.explanation || q.ex || "";

        // If options are missing, extract from question text
        if (options.length === 0) {
            const parts = question.split(/[\(\[](A|B|C|D)[\)\]]/i);
            question = parts[0];
            for (let i = 1; i < parts.length; i += 2) {
                options.push(parts[i+1]);
            }
        } else {
            // Handle q.A, q.B style if needed
            if (options.length === 0 && q.A) {
                options = [q.A, q.B, q.C, q.D];
            }
        }

        // Standardize answer to index
        let ansIdx = -1;
        if (typeof answer === 'number') {
            ansIdx = answer;
        } else if (typeof answer === 'string') {
            const match = answer.match(/^([A-D])[\)\s]/i);
            if (match) {
                ansIdx = match[1].toUpperCase().charCodeAt(0) - 65;
                // If it contains explanation in the answer string
                if (!explanation) {
                    explanation = answer.replace(/^[A-D][\)\s]*/i, '');
                }
            } else if (answer.length === 1 && /[A-D]/i.test(answer)) {
                ansIdx = answer.toUpperCase().charCodeAt(0) - 65;
            }
        }

        // Clean all fields
        question = cleanText(question);
        options = options.map(cleanText);
        explanation = cleanText(explanation);

        // Uniform Options Fix
        if (options.length === 4 && ansIdx >= 0 && ansIdx < 4) {
            const hasParensEng = (s) => /\([a-zA-Z\s,]+\)/.test(String(s));
            const statuses = options.map(hasParensEng);
            const uniqueStatuses = [...new Set(statuses)];
            if (uniqueStatuses.length > 1) {
                const otherIdxs = [0,1,2,3].filter(i => i !== ansIdx);
                const isOdd = !otherIdxs.some(i => statuses[i] === statuses[ansIdx]);
                if (isOdd) {
                    options[ansIdx] = options[ansIdx].replace(/\s*\([a-zA-Z\s,]+\)/, '').trim();
                }
            }
        }

        return {
            question: question,
            options: options.length === 4 ? options : ["A", "B", "C", "D"],
            answer: ansIdx !== -1 ? ansIdx : 0,
            explanation: explanation
        };
    });

    const finalData = {
        unit: "Mock Test",
        subject: "all",
        grade: "all",
        class: "all",
        title: testTitle,
        quiz: convertedQuiz
    };

    fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2), 'utf8');
    console.log(`Successfully standardized ${convertedQuiz.length} questions in ${outputPath}`);
}

processFile('c:/Users/MATHAN/2026-SPECIAL-EXAM/PAPER 1/json-db/lessons/mocktest/all/mock_test_1.json', 'c:/Users/MATHAN/2026-SPECIAL-EXAM/PAPER 1/json-db/lessons/mocktest/all/mock_test_1.json', 'மாதிரித்தேர்வு 1');
processFile('c:/Users/MATHAN/2026-SPECIAL-EXAM/PAPER 1/json-db/lessons/mocktest/all/model_test_2.json', 'c:/Users/MATHAN/2026-SPECIAL-EXAM/PAPER 1/json-db/lessons/mocktest/all/model_test_2.json', 'மாதிரித்தேர்வு 2');
processFile('c:/Users/MATHAN/2026-SPECIAL-EXAM/PAPER 1/json-db/lessons/mocktest/all/mock_test_3.json', 'c:/Users/MATHAN/2026-SPECIAL-EXAM/PAPER 1/json-db/lessons/mocktest/all/mock_test_3.json', 'மாதிரித்தேர்வு 3');
