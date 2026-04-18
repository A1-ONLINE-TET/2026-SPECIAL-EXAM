const lessonMap = {
  "revision": {
    "திருப்புதல் தேர்வு 1": { "local": true, "filename": "rev_special_180", "grade": "all" },
    "rev_special_180": { "local": true, "filename": "rev_special_180", "grade": "all" },
    "திருப்புதல் தேர்வு 2": { "local": true, "filename": "mock_test_2", "grade": "all" },
    "mock_test_2": { "local": true, "filename": "mock_test_2", "grade": "all" },
    "திருப்புதல் தேர்வு 3": { "local": true, "filename": "rev_special_3", "grade": "all" },
    "rev_special_3": { "local": true, "filename": "rev_special_3", "grade": "all" }
  }
};

const subjectKey = "revision";
const lessonId = "rev_special_3";
const className = "all";

const subjectMap = lessonMap[subjectKey] || {};

const findMatch = (map, id) => {
    if (map[id]) return map[id];
    const clean = (s) => s.toString().toLowerCase().replace(/[^a-z0-9\u0b80-\u0bff]/g, '').trim();
    const search = clean(id);
    const entry = Object.entries(map).find(([k]) => clean(k) === search);
    return entry ? entry[1] : null;
};

const match = findMatch(subjectMap, lessonId);
const paths = [];

if (match) {
    const grade = match.grade || className;
    paths.push(`json-db/lessons/${subjectKey}/${grade}/${match.filename}.json`);
}

function getSafeFileName(topic) {
    if (!topic) return "unknown";
    return topic.toString().replace(/[\*\?\"\<\>\|]/g, '').trim().replace(/\s+/g, '_');
}

paths.push(`json-db/lessons/${subjectKey}/${className}/${getSafeFileName(lessonId)}.json`);
paths.push(`json-db/lessons/${subjectKey}/${className}/${lessonId}.json`);

console.log(paths);
