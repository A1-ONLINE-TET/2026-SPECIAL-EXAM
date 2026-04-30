const fs = require('fs');
const paths = [
    ['c:/Users/MATHAN/Desktop/3rd  term/1.json', 'c:/Users/MATHAN/2026-SPECIAL-EXAM/PAPER 1/json-db/lessons/science/2/sci_2_t3_l1.json'],
    ['c:/Users/MATHAN/Desktop/3rd  term/2.json', 'c:/Users/MATHAN/2026-SPECIAL-EXAM/PAPER 1/json-db/lessons/science/2/sci_2_t3_l2.json'],
    ['c:/Users/MATHAN/Desktop/3rd  term/3.json', 'c:/Users/MATHAN/2026-SPECIAL-EXAM/PAPER 1/json-db/lessons/science/2/sci_2_t3_l3.json'],
    ['c:/Users/MATHAN/Desktop/3rd  term/4.json', 'c:/Users/MATHAN/2026-SPECIAL-EXAM/PAPER 1/json-db/lessons/science/2/sci_2_t3_l4.json'],
    ['c:/Users/MATHAN/Desktop/3rd  term/5.json', 'c:/Users/MATHAN/2026-SPECIAL-EXAM/PAPER 1/json-db/lessons/science/2/sci_2_t3_l5.json']
];

paths.forEach(([src, dest], i) => {
    try {
        const sourceData = JSON.parse(fs.readFileSync(src, 'utf8'));
        const destData = JSON.parse(fs.readFileSync(dest, 'utf8'));
        const sCount = sourceData.quiz.questions.length;
        const dCount = destData.quiz.questions.length;
        console.log(`Lesson ${i + 1}: Source Count = ${sCount}, Destination Count = ${dCount}, Match = ${sCount === dCount}`);
        
        if (sCount !== dCount) {
            console.log(`Mismatch in Lesson ${i + 1}!`);
        }
    } catch (err) {
        console.error(`Error reading files for Lesson ${i + 1}:`, err.message);
    }
});
