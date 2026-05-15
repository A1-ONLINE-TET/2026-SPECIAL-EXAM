const fs = require('fs');
const path = require('path');

const baseDir = 'c:\\Users\\MATHAN\\2026-SPECIAL-EXAM\\PAPER 1\\json-db\\lessons\\english\\5';
const rawFiles = ['1.json', '2.json', '3.json'];
const outputFiles = ['eng_5_t3_l1.json', 'eng_5_t3_l2.json', 'eng_5_t3_l3.json'];

const metadata = [
    {
        title: "Unit 1: Learn Always || அலகு 1: எப்போதும் கற்றுக்கொள்",
        unit: "1",
        grade: "5",
        term: "3",
        subject: "English",
        code: "eng_5_t3_l1"
    },
    {
        title: "Unit 2: We are One || அலகு 2: நாம் அனைவரும் ஒன்றே",
        unit: "2",
        grade: "5",
        term: "3",
        subject: "English",
        code: "eng_5_t3_l2"
    },
    {
        title: "Unit 3: My Duties || அலகு 3: எனது கடமைகள்",
        unit: "3",
        grade: "5",
        term: "3",
        subject: "English",
        code: "eng_5_t3_l3"
    }
];

rawFiles.forEach((file, index) => {
    const rawData = JSON.parse(fs.readFileSync(path.join(baseDir, file), 'utf8'));
    
    const sections = [];
    
    if (rawData.பாடக்குறிப்புகள்) {
        if (rawData.பாடக்குறிப்புகள்.பாட_சுருக்கம்) {
            sections.push({
                title: "பாடச் சுருக்கம் (Summary)",
                content: rawData.பாடக்குறிப்புகள்.பாட_சுருக்கம்
            });
        }
        if (rawData.பாடக்குறிப்புகள்.கூடுதல்_குறிப்புகள்) {
            sections.push({
                title: "கூடுதல் குறிப்புகள் (Additional Notes)",
                content: rawData.பாடக்குறிப்புகள்.கூடுதல்_குறிப்புகள்
            });
        }
        if (rawData.பாடக்குறிப்புகள்.நினைவில்_கொள்க_மற்றும்_முக்கிய_குறிப்புகள்) {
            sections.push({
                title: "நினைவில் கொள்க (Points to Remember)",
                content: rawData.பாடக்குறிப்புகள்.நினைவில்_கொள்க_மற்றும்_முக்கிய_குறிப்புகள்
            });
        }
        if (rawData.பாடக்குறிப்புகள்.மதிப்பீட்டு_வினாக்கள்) {
            rawData.பாடக்குறிப்புகள்.மதிப்பீட்டு_வினாக்கள்.forEach(v => {
                sections.push({
                    title: `மதிப்பீடு: ${v.பகுதி}`,
                    content: v.கேள்விகள்_மற்றும்_விடைகள்.join('\n')
                });
            });
        }
    }

    const quiz = rawData.தேர்வு_வினாக்கள்.map(q => {
        let answerIndex = q.ஆப்ஷன்கள்.indexOf(q.விடை);
        if (answerIndex === -1) {
            // Fallback for case sensitivity or minor differences
            answerIndex = q.ஆப்ஷன்கள்.findIndex(opt => opt.toLowerCase().trim() === q.விடை.toLowerCase().trim());
        }
        
        return {
            question: q.கேள்வி,
            options: q.ஆப்ஷன்கள்,
            answer: answerIndex !== -1 ? answerIndex : q.விடை,
            explanation: q.விளக்கம்
        };
    });

    const finalData = {
        lesson_meta: metadata[index],
        sections: sections,
        quiz: quiz
    };

    fs.writeFileSync(path.join(baseDir, outputFiles[index]), JSON.stringify(finalData, null, 2), 'utf8');
    console.log(`Normalized ${file} to ${outputFiles[index]}`);
});
