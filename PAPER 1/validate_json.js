const fs = require('fs');
try {
    const data = fs.readFileSync('json-db/lessons/english/5/eng_5_t1_l1.json', 'utf8');
    JSON.parse(data);
    console.log('JSON is perfectly VALID!');
} catch (e) {
    console.error('JSON ERROR found:', e.message);
}
