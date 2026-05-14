const fs = require('fs');
const path = 'C:\\Users\\MATHAN\\2026-SPECIAL-EXAM\\PAPER 1\\json-db\\lessons\\social\\4\\soc_4_t3_l3.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const normalized = {
  class: "4",
  term: "3",
  subject: "சமூக அறிவியல்",
  lesson_number: "3",
  lesson_title: data["பாட_தலைப்பு"],
  summary: "குழந்தைகளின் உரிமைகள் மற்றும் கடமைகள், அரசியலமைப்பு, அடிப்படை உரிமைகள் மற்றும் சிறார் உதவி மையம் பற்றிய பாடம்.",
  topics: data["பாடக்குறிப்புகள்"].map(topic => ({
    title: topic["தலைப்பு"],
    details: topic["விவரங்கள்"].join(" ")
  })),
  book_back_evaluations: {
    title: "பின்புற மதிப்பீட்டு வினாக்கள் (சுருக்கம்)",
    questions: []
  },
  quiz: data["கேள்விகள்"].map(q => ({
    question: q["கேள்வி"],
    options: q["ஆப்ஷன்கள்"],
    answer: q["விடை"],
    explanation: q["விளக்கம்"]
  }))
};

// Handle book back evaluations mapping
if (data["புத்தக_மதிப்பீட்டு_வினாக்கள்"]) {
  data["புத்தக_மதிப்பீட்டு_வினாக்கள்"].forEach(section => {
    section["வினாக்கள்"].forEach(qStr => {
      // e.g., "1. -------- இந்திய சட்டத்திற்கு எதிரானது. (விடை: ஆ. தொழிற்சாலைகளில் 14 வயதுக்குட்பட்ட குழந்தைகள் வேலை செய்தல்)"
      const match = qStr.match(/^\d+\.\s*(.*?)\s*\(விடை:\s*(.*?)\)$/);
      if (match) {
        normalized.book_back_evaluations.questions.push({
          question: match[1],
          answer: match[2].replace(/^[அ-ஊ]\.\s*/, '') // Remove options prefix if any
        });
      } else {
        normalized.book_back_evaluations.questions.push({
          question: qStr,
          answer: ""
        });
      }
    });
  });
}

fs.writeFileSync(path, JSON.stringify(normalized, null, 2), 'utf8');
console.log("Successfully normalized soc_4_t3_l3.json");
