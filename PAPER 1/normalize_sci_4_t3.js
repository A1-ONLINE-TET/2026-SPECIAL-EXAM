const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\MATHAN\\2026-SPECIAL-EXAM\\PAPER 1\\json-db\\lessons\\science\\4\\';
const files = ['sci_4_t3_l1.json', 'sci_4_t3_l2.json'];

files.forEach(file => {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${file}`);
    return;
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const normalized = {
    class: data.lesson_meta.grade,
    term: data.lesson_meta.term,
    subject: "அறிவியல்",
    lesson_number: data.lesson_meta.unit.toString(),
    lesson_title: data.lesson_meta.title.replace(/^அலகு \d+: /, ''),
    summary: data.material.sections.find(s => s.title.includes('பாடச் சுருக்கம்') || s.title.includes('பாட அறிமுகம்'))?.content[0].text || "",
    topics: data.material.sections.map(s => ({
      title: s.title,
      details: Array.isArray(s.content) ? s.content.map(c => c.text).join('\n') : s.content
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
