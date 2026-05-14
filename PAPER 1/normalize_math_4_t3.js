const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\MATHAN\\2026-SPECIAL-EXAM\\PAPER 1\\json-db\\lessons\\maths\\4\\';
const files = ['mat_4_t3_l1.json', 'mat_4_t3_l2.json', 'mat_4_t3_l3.json', 'mat_4_t3_l4.json', 'mat_4_t3_l5.json', 'mat_4_t3_l6.json'];

files.forEach(file => {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${file}`);
    return;
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const normalized = {
    class: data.lesson_meta.grade,
    term: data.lesson_meta.term.replace('t', ''),
    subject: "கணிதம்",
    lesson_number: data.lesson_meta.unit,
    lesson_title: data.lesson_meta.title,
    summary: data.material.sections[0].content,
    topics: data.material.sections.map(s => ({
      title: s.title,
      details: s.content
    })),
    book_back_evaluations: {
      title: "பின்புற மதிப்பீட்டு வினாக்கள் (சுருக்கம்)",
      questions: []
    },
    quiz: data.quiz.questions.map(q => ({
      question: q.question,
      options: q.options,
      answer: q.options[q.answer],
      explanation: q.explanation
    }))
  };

  fs.writeFileSync(filePath, JSON.stringify(normalized, null, 2), 'utf8');
  console.log(`Successfully normalized ${file}`);
});
