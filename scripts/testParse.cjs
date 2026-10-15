const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, 'raw_orange_county.csv');
const raw = fs.readFileSync(csvPath, 'utf8');

function parseCSVLine(text) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (inQuotes && text[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      result.push(cur);
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur);
  return result;
}

const lines = raw.split(/\r?\n/).filter(l => l.trim().length > 0);

// Section 1: Summary table
// Starts at line with "#,Category,Questions..."
let summaryStart = -1;
let questionsStart = -1;
let classificationsStart = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].startsWith('#,Category,Questions')) summaryStart = i;
  if (lines[i].startsWith('ID,Category,Subtopic,Question')) questionsStart = i;
  if (lines[i].startsWith('Category,County of Orange classification')) classificationsStart = i;
}

console.log({ summaryStart, questionsStart, classificationsStart });

// 1. Parse Summary (Categories and County of Orange classifications)
const categories = [];
for (let i = summaryStart + 1; i < questionsStart - 1; i++) {
  const row = parseCSVLine(lines[i]);
  if (!row[0] || row[0] === 'Total' || isNaN(Number(row[0]))) continue;
  const num = row[0];
  const name = row[1];
  const qCount = parseInt(row[2], 10) || 20;
  const classificationsRaw = row[6] || '';
  const classifications = classificationsRaw
    .split(';')
    .map(s => s.trim())
    .filter(Boolean);

  categories.push({
    num,
    name,
    qCount,
    classifications,
    classificationsRaw,
  });
}

console.log(`Parsed ${categories.length} categories.`);

// 2. Parse Questions
const questionsByCategory = {};
categories.forEach(c => {
  questionsByCategory[c.name] = [];
});

const endIdx = classificationsStart === -1 ? lines.length : classificationsStart;
for (let i = questionsStart + 1; i < endIdx; i++) {
  const line = lines[i];
  if (!line || line.startsWith('Category,County of Orange')) break;
  const row = parseCSVLine(line);
  const qId = row[0]?.trim();
  if (!qId || !qId.match(/^\d{2}-\d{2}$/)) continue;

  const category = row[1]?.trim();
  const subtopic = row[2]?.trim();
  const questionText = row[3]?.trim();
  const optA = row[4]?.trim();
  const optB = row[5]?.trim();
  const optC = row[6]?.trim();
  const optD = row[7]?.trim();
  const correctRaw = row[8]?.trim();
  const explanation = row[9]?.trim();

  const options = [
    { id: `opt-${qId}-a`, text: optA },
    { id: `opt-${qId}-b`, text: optB },
    { id: `opt-${qId}-c`, text: optC },
    { id: `opt-${qId}-d`, text: optD },
  ];

  const correctKeys = correctRaw.split(',').map(s => s.trim().toUpperCase());
  const correctOptionIds = correctKeys
    .map(k => `opt-${qId}-${k.toLowerCase()}`)
    .filter(id => options.some(o => o.id === id));

  const qObj = {
    id: `q-oc-${qId}`,
    categoryTag: subtopic,
    text: questionText,
    options,
    correctOptionIds,
    explanation,
  };

  if (!questionsByCategory[category]) {
    questionsByCategory[category] = [];
  }
  questionsByCategory[category].push(qObj);
}

let totalQuestions = 0;
for (const cat of categories) {
  const count = questionsByCategory[cat.name]?.length || 0;
  console.log(`- ${cat.name}: ${count} questions`);
  totalQuestions += count;
}
console.log(`Total questions parsed: ${totalQuestions}`);
