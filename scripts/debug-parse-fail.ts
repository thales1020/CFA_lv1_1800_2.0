import * as fs from 'fs';
import * as path from 'path';

const questionsFilePath = path.join(__dirname, '../data/mock1_sec2_ques.txt');
const questionsContent = fs.readFileSync(questionsFilePath, 'utf-8');

const questionBlocks = questionsContent.split(/\r?\n(?=\d+\/)/);

const parsed: number[] = [];
const failed: Array<{num: number, reason: string}> = [];

for (const block of questionBlocks) {
  const trimmed = block.trim();
  if (!trimmed || !trimmed.match(/^\d+\//)) continue;

  const orderMatch = trimmed.match(/^(\d+)\//);
  if (!orderMatch) continue;
  const orderNum = parseInt(orderMatch[1]);

  if (!trimmed.includes('Q.')) {
    failed.push({num: orderNum, reason: 'No Q. found'});
    continue;
  }

  const questionTextMatch = trimmed.match(/Q\.\s+([\s\S]*?)(?=\nA\.)/);
  const optionAMatch = trimmed.match(/\nA\.\s*([\s\S]*?)(?=\nB\.)/);
  const optionBMatch = trimmed.match(/\nB\.\s*([\s\S]*?)(?=\nC\.)/);
  const optionCMatch = trimmed.match(/\nC\.\s*([\s\S]*?)(?=\n\d+\/|\nCFA Program|$)/);

  if (!questionTextMatch) {
    failed.push({num: orderNum, reason: 'No question text match'});
    continue;
  }
  if (!optionAMatch) {
    failed.push({num: orderNum, reason: 'No option A match'});
    continue;
  }
  if (!optionBMatch) {
    failed.push({num: orderNum, reason: 'No option B match'});
    continue;
  }
  if (!optionCMatch) {
    failed.push({num: orderNum, reason: 'No option C match'});
    continue;
  }

  parsed.push(orderNum);
}

console.log('✅ Successfully parsed:', parsed.length, 'questions');
console.log('❌ Failed to parse:', failed.length, 'questions');
console.log('\nFailed questions:');
failed.forEach(f => console.log(`  ${f.num}: ${f.reason}`));
