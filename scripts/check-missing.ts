import * as fs from 'fs';
import * as path from 'path';

const questionsFile = path.join(__dirname, '../data/mock1_sec2_ques.txt');
const answersFile = path.join(__dirname, '../data/mock1_sec2_ans.txt');

const qContent = fs.readFileSync(questionsFile, 'utf-8');
const aContent = fs.readFileSync(answersFile, 'utf-8');

// Check questions - look for "X/ Q." pattern
const qFound = new Set<number>();
const qMatches = qContent.matchAll(/^(\d+)\/\s*Q\./gm);
for (const match of qMatches) {
  qFound.add(parseInt(match[1]));
}

// Check answers - look for "X/ Solution" pattern
const aFound = new Set<number>();
const aMatches = aContent.matchAll(/^(\d+)\/\s*Solution/gm);
for (const match of aMatches) {
  aFound.add(parseInt(match[1]));
}

const qMissing: number[] = [];
const aMissing: number[] = [];

for (let i = 1; i <= 90; i++) {
  if (!qFound.has(i)) qMissing.push(i);
  if (!aFound.has(i)) aMissing.push(i);
}

console.log('📝 Questions file has:', qFound.size, 'questions');
console.log('❌ Missing in QUESTIONS:', qMissing.join(', '));
console.log('');
console.log('📝 Answers file has:', aFound.size, 'answers');
console.log('❌ Missing in ANSWERS:', aMissing.join(', '));
