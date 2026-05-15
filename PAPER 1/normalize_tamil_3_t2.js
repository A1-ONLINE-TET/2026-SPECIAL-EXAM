const fs = require('fs');
const path = require('path');

const baseDir = 'C:\\Users\\MATHAN\\2026-SPECIAL-EXAM\\PAPER 1\\json-db\\lessons\\tamil\\3\\';
const files = [
  { in: '1.json', out: 'tam_3_t2_l1.json', unit: "1" },
  { in: '2.json', out: 'tam_3_t2_l2.json', unit: "2" },
  { in: '3.json', out: 'tam_3_t2_l3.json', unit: "3" },
  { in: '4.json', out: 'tam_3_t2_l4.json', unit: "4" },
  { in: '5.json', out: 'tam_3_t2_l5.json', unit: "5" },
  { in: '6.json', out: 'tam_3_t2_l6.json', unit: "6" },
  { in: '7.json', out: 'tam_3_t2_l7.json', unit: "7" },
  { in: '8.json', out: 'tam_3_t2_l8.json', unit: "8" }
];

files.forEach(fileInfo => {
  const inputPath = path.join(baseDir, fileInfo.in);
  if (!fs.existsSync(inputPath)) {
      console.error(`Input file not found: ${inputPath}`);
      return;
  }
  const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

  let title = data.பாட_தலைப்பு || data.lesson_title || data.title || "Unknown Title";
  title = title.replace('பாட தலைப்பு:', '').replace(' - பாடக்குறிப்புகள் மற்றும் தேர்வுகள்', '').trim();
  
  // Normalize material/notes
  let sections = [];
  const rawNotes = data.பாடக்குறிப்புகள் || data.notes || [];
  if (Array.isArray(rawNotes)) {
    rawNotes.forEach(note => {
      const heading = note.தலைப்பு || note.heading || "Section";
      let content = "";
      if (note.விவரங்கள்) {
        content = Array.isArray(note.விவரங்கள்) ? note.விவரங்கள்.join('\n') : note.விவரங்கள்;
      } else if (note.points) {
        content = note.points.join('\n');
      }
      sections.push({ title: heading, content: content });
    });
  } else if (typeof rawNotes === 'object') {
    // Handle object-based notes (like in 1.json)
    for (const [key, value] of Object.entries(rawNotes)) {
        sections.push({ title: key, content: value });
    }
  }

  // Normalize quiz
  let questions = [];
  const rawQuiz = data.தேர்வுகள் || data.கேள்விகள் || data.quiz || [];
  rawQuiz.forEach(q => {
    const questionText = q.கேள்வி || q.question;
    const options = q.ஆப்ஷன்கள் || q.options || q.ஆப்சன் || [];
    const answerStr = q.விடை || q.answer;
    const explanation = q.விளக்கம் || q.explanation || q.விடைக்கான_விளக்கம் || "";

    const clean = (s) => s ? s.toString().trim().replace(/[.,!?;]$/, '') : "";
    
    let answerIndex = -1;
    if (options && options.length > 0) {
        answerIndex = options.indexOf(answerStr);
        if (answerIndex === -1) {
          // Try fuzzy match or cleaning
          answerIndex = options.findIndex(opt => clean(opt) === clean(answerStr));
        }
    }
    
    // If still not found, try to find by letter like "அ." or "A."
    if (answerIndex === -1 && typeof answerStr === 'string') {
      const match = answerStr.match(/^([அ-ஊA-D])[\.)]\s*(.*)/);
      if (match) {
        const letter = match[1];
        const text = match[2];
        // Try to find the text in options
        answerIndex = options.findIndex(opt => clean(opt) === clean(text));
        if (answerIndex === -1) {
            // Mapping letters to indices
            const mapping = { 'அ': 0, 'ஆ': 1, 'இ': 2, 'ஈ': 3, 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
            answerIndex = mapping[letter] !== undefined ? mapping[letter] : -1;
        }
      }
    }

    if (answerIndex === -1) {
       // console.warn(`Could not find answer "${answerStr}" in options for question "${questionText}" in file ${fileInfo.in}`);
       answerIndex = 0; 
    }

    questions.push({
      question: questionText,
      options: options,
      answer: answerIndex,
      explanation: explanation
    });
  });

  const productionData = {
    lesson_meta: {
      title: title,
      unit: fileInfo.unit,
      grade: "3",
      term: "t2",
      subject: "tamil",
      code: fileInfo.out.replace('.json', '')
    },
    quiz: {
      questions: questions
    },
    material: {
      sections: sections
    }
  };

  const outputPath = path.join(baseDir, fileInfo.out);
  fs.writeFileSync(outputPath, JSON.stringify(productionData, null, 2), 'utf8');
  console.log(`Normalized ${fileInfo.in} -> ${fileInfo.out}`);
});

