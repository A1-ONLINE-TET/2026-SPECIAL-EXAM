const fs = require('fs');
const filePath = 'c:\\Users\\MATHAN\\2026-SPECIAL-EXAM\\PAPER 1\\json-db\\lessons\\mocktest\\all\\mock_test_4.json';

try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const questions = data.quiz || [];
    
    // Subjects usually follow a pattern in these 150-question tests:
    // 1-30: Psychology (Child Development)
    // 31-60: Tamil
    // 61-90: English
    // 91-120: Maths
    // 121-150: Science / Social
    
    // Let's refine by looking at the actual content.
    const counts = {
        "Psychology (உளவியல்)": 0,
        "Tamil (தமிழ்)": 0,
        "English (ஆங்கிலம்)": 0,
        "Maths (கணக்கு)": 0,
        "Science (அறிவியல்)": 0,
        "Social Science (சமூக அறிவியல்)": 0,
        "Unknown": 0
    };

    questions.forEach((q, i) => {
        const text = (q.question || q.q).toLowerCase();
        const options = (q.options || []).join(' ').toLowerCase();

        if (i < 30) counts["Psychology (உளவியல்)"]++;
        else if (i < 60) counts["Tamil (தமிழ்)"]++;
        else if (i < 90) counts["English (ஆங்கிலம்)"]++;
        else if (i < 120) counts["Maths (கணக்கு)"]++;
        else if (i < 135) counts["Science (அறிவியல்)"]++;
        else if (i < 150) counts["Social Science (சமூக அறிவியல்)"]++;
        else counts["Unknown"]++;
    });

    console.log(JSON.stringify(counts, null, 2));
} catch (e) {
    console.error(e.message);
}
