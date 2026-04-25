/**
 * A1 Online TET - Daily Challenge Engine (v3 - Target Repo Fixed)
 *
 * Target repo structure:
 *   1.json  ← exam.html இதை படிக்கிறது (quiz array)
 *
 * Actions:
 *   notes  → 6AM:  பாடக்குறிப்புகளை 1.json-ல் push (explanation mode)
 *   open   → 8PM:  Quiz-ஐ 1.json-ல் push (quiz mode)
 *   close  → 11PM: 1.json-ஐ empty/disabled state-ல் push
 *
 * Day → Subject:
 *   Mon=Tamil, Tue=English, Wed=Maths, Thu=Science, Fri=Social
 *   Sat=Revision Test, Sun=Mock Test
 */

const fs    = require('fs');
const path  = require('path');
const https = require('https');

const TRACKER_FILE = path.join(__dirname, 'tracker.json');
const TARGET_REPO  = 'a1onlinecoachingcenter-star/test-series-';
const TOKEN        = process.env.MY_GITHUB_TOKEN;

const DAY_SUBJECT = {
  Mon: { subject: 'tamil',    isTest: false },
  Tue: { subject: 'english',  isTest: false },
  Wed: { subject: 'maths',    isTest: false },
  Thu: { subject: 'science',  isTest: false },
  Fri: { subject: 'social',   isTest: false },
  Sat: { subject: 'revision', isTest: true  },
  Sun: { subject: 'mocktest', isTest: true  },
};

const CLASS_ORDER = ['5', '4', '3'];

// ─── GitHub API ────────────────────────────────────────────────────
function githubRequest(method, urlPath, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: 'api.github.com',
      path: urlPath, method,
      headers: {
        'User-Agent': 'A1-LMS-Bot',
        'Authorization': `Bearer ${TOKEN}`,
        'Accept': 'application/vnd.github+json',
        ...(data ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } : {})
      }
    };
    const req = https.request(opts, res => {
      let buf = '';
      res.on('data', d => buf += d);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(buf) }); }
        catch { resolve({ status: res.statusCode, data: buf }); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function uploadFile(filePath, content, message) {
  const encoded  = Buffer.from(content).toString('base64');
  const apiPath  = `/repos/${TARGET_REPO}/contents/${filePath}`;
  const existing = await githubRequest('GET', apiPath);
  const sha      = existing.status === 200 ? existing.data.sha : null;
  const result   = await githubRequest('PUT', apiPath, { message, content: encoded, sha, branch: 'main' });
  const ok = result.status === 200 || result.status === 201;
  console.log(ok ? `✅ ${filePath}` : `❌ ${filePath} (${result.status}): ${JSON.stringify(result.data).substring(0, 200)}`);
}

// ─── File helpers ──────────────────────────────────────────────────
function getLessonFiles(subject) {
  const base = path.join(__dirname, '../../PAPER 1/json-db/lessons', subject);
  if (!fs.existsSync(base)) { console.warn(`⚠️  Missing: ${base}`); return []; }
  let all = [];
  for (const cls of CLASS_ORDER) {
    const p = path.join(base, cls);
    if (fs.existsSync(p)) {
      const files = fs.readdirSync(p).filter(f => f.endsWith('.json'))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
      all.push(...files.map(f => path.join(p, f)));
    }
  }
  return all;
}

function getTestFile(subject, idx) {
  const base = path.join(__dirname, `../../PAPER 1/json-db/lessons/${subject}/all`);
  if (!fs.existsSync(base)) { console.warn(`⚠️  Missing: ${base}`); return null; }
  const files = fs.readdirSync(base).filter(f => f.endsWith('.json')).sort();
  const found = files.find(f => { const m = f.match(/_(\d+)\.json$/); return m && parseInt(m[1]) === idx; });
  return found ? path.join(base, found || files[0]) : (files[0] ? path.join(base, files[0]) : null);
}

function extractQuiz(data) {
  // Source JSON format: { quiz: [{q, options, a, ex}] } OR { quiz: [{question, options, answer, explanation}] }
  const raw = Array.isArray(data.quiz) ? data.quiz : [];
  return raw.map(q => ({
    q:       q.q       || q.question   || '',
    options: q.options || [],
    a:       q.a       !== undefined ? q.a : (q.answer !== undefined ? q.answer : 0),
    ex:      q.ex      || q.explanation || ''
  })).filter(q => q.q && q.options.length > 0);
}

function extractNoteQuiz(data) {
  // Notes mode: show questions with explanations only (no correct answer revealed in options)
  const raw = Array.isArray(data.quiz) ? data.quiz : [];
  return raw.map(q => ({
    q:       q.q       || q.question   || '',
    options: q.options || [],
    a:       q.a       !== undefined ? q.a : (q.answer !== undefined ? q.answer : 0),
    ex:      q.ex      || q.explanation || '',
    notesMode: true   // flag for UI to show explanation prominently
  })).filter(q => q.q && q.options.length > 0);
}

function getLessonTitle(data, filename) {
  return data.lesson_meta?.title || data.title || path.basename(filename, '.json');
}

// ─── MAIN ──────────────────────────────────────────────────────────
async function run() {
  const action = process.argv[2] || 'open';
  let dayStr   = new Date().toLocaleString('en-US', { weekday: 'short', timeZone: 'Asia/Kolkata' });
  if (process.env.TEST_DAY) dayStr = process.env.TEST_DAY;

  const ist = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true });
  const dateStr = new Date().toLocaleString('en-CA', { timeZone: 'Asia/Kolkata' }).split(',')[0];
  console.log(`\n🕐 IST: ${ist} | Day: ${dayStr} | Action: ${action}\n`);

  // ── CLOSE ──────────────────────────────────────────────────────
  if (action === 'close') {
    const closed = {
      unit: 'Daily Challenge',
      subject: 'Closed',
      title: 'இன்றைய அமர்வு முடிந்தது',
      status: 'closed',
      message: 'நாளை காலை 6 மணிக்கு மீண்டும் திறக்கும்.',
      quiz: []
    };
    await uploadFile('1.json', JSON.stringify(closed, null, 2), `🔒 Night Close: ${dateStr}`);
    console.log('✅ Closed');
    return;
  }

  // ── Load tracker & day config ───────────────────────────────────
  const tracker   = JSON.parse(fs.readFileSync(TRACKER_FILE, 'utf8'));
  const dayConfig = DAY_SUBJECT[dayStr];
  if (!dayConfig) { console.error(`❌ Unknown day: ${dayStr}`); process.exit(1); }

  const { subject, isTest } = dayConfig;
  console.log(`📚 Subject: ${subject} | IsTest: ${isTest} | Action: ${action}`);

  let payload;

  // ── TEST DAY (Sat/Sun) ──────────────────────────────────────────
  if (isTest) {
    let testIdx = (tracker[subject] || 0) + 1;
    const filePath = getTestFile(subject, testIdx);
    if (!filePath) { console.error(`❌ No test file for ${subject} idx ${testIdx}`); process.exit(1); }

    console.log(`📄 Test: ${path.basename(filePath)}`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const quiz = action === 'notes' ? extractNoteQuiz(data) : extractQuiz(data);

    payload = {
      unit:    'Daily Challenge',
      subject: subject.toUpperCase(),
      title:   action === 'notes'
                 ? `${data.title || subject} - குறிப்புகள்`
                 : (data.title || `${subject.toUpperCase()} Test`),
      status:  action === 'notes' ? 'notes' : 'open',
      quiz
    };

    if (action === 'open') {
      tracker[subject] = testIdx;
      fs.writeFileSync(TRACKER_FILE, JSON.stringify(tracker, null, 2), 'utf8');
      console.log(`💾 Tracker: ${subject} → ${testIdx}`);
    }

  // ── LESSON DAY (Mon–Fri) ────────────────────────────────────────
  } else {
    const files = getLessonFiles(subject);
    if (!files.length) { console.error(`❌ No lesson files: ${subject}`); process.exit(1); }

    let idx = tracker[subject] || 0;
    if (idx >= files.length) {
      idx = 0; tracker[subject] = 0;
      console.log(`🔄 Tracker reset for ${subject}`);
    }

    const file1 = files[idx];
    const file2 = files[idx + 1] || files[0];
    console.log(`📄 L1: ${path.basename(file1)}\n📄 L2: ${path.basename(file2)}`);

    const d1 = JSON.parse(fs.readFileSync(file1, 'utf8'));
    const d2 = JSON.parse(fs.readFileSync(file2, 'utf8'));

    const quiz1 = action === 'notes' ? extractNoteQuiz(d1) : extractQuiz(d1);
    const quiz2 = action === 'notes' ? extractNoteQuiz(d2) : extractQuiz(d2);
    const combined = [...quiz1, ...quiz2];

    const t1 = getLessonTitle(d1, file1);
    const t2 = getLessonTitle(d2, file2);

    payload = {
      unit:    'Daily Challenge',
      subject: subject.toUpperCase(),
      title:   action === 'notes'
                 ? `இன்றைய குறிப்புகள்: ${t1} & ${t2}`
                 : `இன்றைய தேர்வு: ${t1} & ${t2}`,
      status:  action === 'notes' ? 'notes' : 'open',
      quiz:    combined
    };

    if (action === 'open') {
      tracker[subject] = idx + 2;
      fs.writeFileSync(TRACKER_FILE, JSON.stringify(tracker, null, 2), 'utf8');
      console.log(`💾 Tracker: ${subject} → ${idx + 2}`);
    }
  }

  console.log(`📊 Quiz count: ${payload.quiz.length}`);
  await uploadFile('1.json', JSON.stringify(payload, null, 2),
    `${action === 'notes' ? '📖' : '📝'} ${action}: ${subject} ${dateStr}`);

  console.log(`\n✅ Done! Action: ${action} | Subject: ${subject}`);
}

run().catch(err => { console.error('❌ Fatal:', err); process.exit(1); });
