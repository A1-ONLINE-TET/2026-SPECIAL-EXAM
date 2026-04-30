const fs = require('fs');
const paths = [
    ['c:/Users/MATHAN/Desktop/3rd  term/1.json', 'c:/Users/MATHAN/2026-SPECIAL-EXAM/PAPER 1/json-db/lessons/science/2/sci_2_t3_l1.json', 'sci_2_t3_l1', '1'],
    ['c:/Users/MATHAN/Desktop/3rd  term/2.json', 'c:/Users/MATHAN/2026-SPECIAL-EXAM/PAPER 1/json-db/lessons/science/2/sci_2_t3_l2.json', 'sci_2_t3_l2', '2'],
    ['c:/Users/MATHAN/Desktop/3rd  term/3.json', 'c:/Users/MATHAN/2026-SPECIAL-EXAM/PAPER 1/json-db/lessons/science/2/sci_2_t3_l3.json', 'sci_2_t3_l3', '3'],
    ['c:/Users/MATHAN/Desktop/3rd  term/4.json', 'c:/Users/MATHAN/2026-SPECIAL-EXAM/PAPER 1/json-db/lessons/science/2/sci_2_t3_l4.json', 'sci_2_t3_l4', '4'],
    ['c:/Users/MATHAN/Desktop/3rd  term/5.json', 'c:/Users/MATHAN/2026-SPECIAL-EXAM/PAPER 1/json-db/lessons/science/2/sci_2_t3_l5.json', 'sci_2_t3_l5', '5']
];

paths.forEach(([src, dest, code, unit]) => {
    try {
        const sourceData = JSON.parse(fs.readFileSync(src, 'utf8'));
        
        // Standardize meta
        sourceData.lesson_meta = {
            title: sourceData.lesson_meta.title,
            unit: unit,
            grade: "2",
            term: "3",
            subject: "science",
            code: code
        };

        // Write to destination
        fs.writeFileSync(dest, JSON.stringify(sourceData, null, 2), 'utf8');
        console.log(`Successfully migrated ${code} with ${sourceData.quiz.questions.length} questions.`);
    } catch (err) {
        console.error(`Error migrating ${src}:`, err.message);
    }
});
