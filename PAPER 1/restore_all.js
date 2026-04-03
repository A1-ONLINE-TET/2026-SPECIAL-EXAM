const fs = require('fs');
const { execSync } = require('child_process');

const lessons = [
  { path: 'json-db/lessons/tamil/5/tam_5_t1_l1.json', commit: '13e9e28' }, // This has 9 sections!
  { path: 'json-db/lessons/tamil/5/tam_5_t1_l2.json', commit: '0a0128e' },
  { path: 'json-db/lessons/tamil/5/tam_5_t1_l3.json', commit: '601cd71' },
  { path: 'json-db/lessons/tamil/5/tam_5_t1_l4.json', commit: 'bdcdf63' },
  { path: 'json-db/lessons/tamil/5/tam_5_t1_l5.json', commit: '56d8507' },
  { path: 'json-db/lessons/tamil/5/tam_5_t1_l6.json', commit: 'a2169eb' },
  { path: 'json-db/lessons/tamil/grammar/tam_gram_01.json', commit: 'acbac15' }
];

lessons.forEach(l => {
  try {
    const current = JSON.parse(fs.readFileSync(l.path, 'utf8'));
    const originalContent = execSync(`git show ${l.commit}:"PAPER 1/${l.path}"`).toString();
    const original = JSON.parse(originalContent);

    console.log(`\nLesson: ${l.path}`);
    console.log('Original Sections:', original.material.sections.map(s => s.title));
    console.log('Current Sections:', current.material.sections.map(s => s.title));
    
    // Auto-fix: Overwrite current material and Q&A with original
    // Preserve the 40-question quiz!
    current.material = original.material;
    current.qa = original.qa;
    
    fs.writeFileSync(l.path, JSON.stringify(current, null, 2));
    console.log('RESTORED: Saved original content for ' + l.path);
  } catch (e) {
    console.log('Error for ' + l.path + ': ' + e.message);
  }
});
