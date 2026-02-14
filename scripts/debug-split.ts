import * as fs from 'fs';
import * as path from 'path';

const questionsFilePath = path.join(__dirname, '../data/mock1_sec2_ques.txt');
const questionsContent = fs.readFileSync(questionsFilePath, 'utf-8');

const questionBlocks = questionsContent.split(/\r?\n(?=\d+\/)/);

console.log('Total blocks after split:', questionBlocks.length);
console.log('\n=== First 20 blocks ===');

const qNums: number[] = [];

for (let i = 0; i < questionBlocks.length; i++) {
  const block = questionBlocks[i];
  const trimmed = block.trim();
  if (!trimmed) {
    if (i < 20) console.log(`Block ${i}: [EMPTY]`);
    continue;
  }
  
  const orderMatch = trimmed.match(/^(\d+)\//);
  if (orderMatch) {
    const num = parseInt(orderMatch[1]);
    qNums.push(num);
    if (i < 20) console.log(`Block ${i}: Question ${num} (${trimmed.length} chars)`);
  } else {
    if (i < 20) {
      console.log(`Block ${i}: [NO MATCH] (${trimmed.length} chars)`);
      console.log('  Content:', JSON.stringify(trimmed.substring(0, 100)));
    }
  }
}

console.log('\n=== All detected question numbers ===');
console.log(qNums.sort((a, b) => a - b).join(', '));

console.log('\n=== Detailed look at blocks 9-15 ===');
for (let i = 9; i <= 15; i++) {
  const block = questionBlocks[i];
  console.log(`\n--- Block ${i} ---`);
  console.log(JSON.stringify(block));
}
