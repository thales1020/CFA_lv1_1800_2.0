import * as fs from 'fs';
import * as path from 'path';

const questionsFilePath = path.join(__dirname, '../data/mock1_sec2_ques.txt');
const questionsContent = fs.readFileSync(questionsFilePath, 'utf-8');

const questionBlocks = questionsContent.split(/(?=\d+\/)/);

// Check specific question numbers
const checkQs = [1, 9, 11, 18, 23, 29, 31, 33, 34, 35, 43, 44, 50, 56];

for (const qNum of checkQs) {
  console.log(`\n======= Checking Question ${qNum} =======`);
  
  let found = false;
  for (const block of questionBlocks) {
    const trimmed = block.trim();
    if (!trimmed || !trimmed.match(/^\d+\//)) continue;

    const orderMatch = trimmed.match(/^(\d+)\//);
    if (!orderMatch) continue;
    const orderNum = parseInt(orderMatch[1]);
    
    if (orderNum !== qNum) continue;
    
    found = true;
    console.log('✓ Block found, length:', trimmed.length);
    console.log('✓ Has Q.:', trimmed.includes('Q.'));
    
    const questionTextMatch = trimmed.match(/Q\.\s+([\s\S]*?)(?=\nA\.)/);
    const optionAMatch = trimmed.match(/\nA\.\s+([\s\S]*?)(?=\nB\.)/);
    const optionBMatch = trimmed.match(/\nB\.\s+([\s\S]*?)(?=\nC\.)/);
    const optionCMatch = trimmed.match(/\nC\.\s+([\s\S]*?)(?=\n\d+\/|\nCFA Program|$)/);
    
    console.log('✓ questionTextMatch:', !!questionTextMatch);
    console.log('✓ optionAMatch:', !!optionAMatch);
    console.log('✓ optionBMatch:', !!optionBMatch);
    console.log('✓ optionCMatch:', !!optionCMatch);
    
    if (!questionTextMatch) console.log('❌ Failed to match question text');
    if (!optionAMatch) console.log('❌ Failed to match option A');
    if (!optionBMatch) console.log('❌ Failed to match option B');
    if (!optionCMatch) console.log('❌ Failed to match option C');
    
    // Show first 200 chars
    console.log('\nFirst 200 chars of block:');
    console.log(trimmed.substring(0, 200));
    
    break;
  }
  
  if (!found) {
    console.log('❌ Block not found in split');
  }
}
