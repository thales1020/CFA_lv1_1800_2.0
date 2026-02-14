import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

interface Question {
  exam_id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  correct_option: string;
  order_num: number;
  explanation: string;
}

async function seedExam(
  examTitle: string,
  questionsFile: string,
  answersFile: string,
  durationMinutes: number = 135,
  totalQuestions: number = 90
) {
  console.log(`\n🚀 Starting seed for: ${examTitle}`);
  console.log(`   Questions: ${questionsFile}`);
  console.log(`   Answers: ${answersFile}\n`);

  // Step 1: Create exam record
  const { data: exam, error: examError } = await supabase
    .from('exams')
    .insert({
      title: examTitle,
      description: 'CFA Program Level I Mock Exam',
      duration_minutes: durationMinutes,
      total_questions: totalQuestions
    })
    .select()
    .single();

  if (examError || !exam) {
    console.error('❌ Error creating exam:', examError);
    process.exit(1);
  }

  console.log('✅ Exam created with ID:', exam.id);

  // Step 2: Read and parse data files
  const questionsFilePath = path.join(__dirname, '../data', questionsFile);
  const answersFilePath = path.join(__dirname, '../data', answersFile);

  if (!fs.existsSync(questionsFilePath)) {
    console.error(`❌ Questions file not found: ${questionsFilePath}`);
    process.exit(1);
  }

  if (!fs.existsSync(answersFilePath)) {
    console.error(`❌ Answers file not found: ${answersFilePath}`);
    process.exit(1);
  }

  const questionsContent = fs.readFileSync(questionsFilePath, 'utf-8');
  const answersContent = fs.readFileSync(answersFilePath, 'utf-8');

  // Parse questions
  const questionBlocks = questionsContent.split(/(?=\d+\/)/);
  const parsedQuestions: Array<{
    order_num: number;
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
  }> = [];

  for (const block of questionBlocks) {
    const trimmed = block.trim();
    if (!trimmed || !trimmed.match(/^\d+\//)) continue;

    const orderMatch = trimmed.match(/^(\d+)\//);
    if (!orderMatch) continue;
    const orderNum = parseInt(orderMatch[1]);

    if (!trimmed.includes('Q.')) continue;

    const questionTextMatch = trimmed.match(/Q\.\s+([\s\S]*?)(?=\nA\.)/);
    const optionAMatch = trimmed.match(/\nA\.\s+([\s\S]*?)(?=\nB\.)/);
    const optionBMatch = trimmed.match(/\nB\.\s+([\s\S]*?)(?=\nC\.)/);
    const optionCMatch = trimmed.match(/\nC\.\s+([\s\S]*?)(?=\n\d+\/|\nCFA Program|$)/);

    if (questionTextMatch && optionAMatch && optionBMatch && optionCMatch) {
      parsedQuestions.push({
        order_num: orderNum,
        question_text: questionTextMatch[1].trim(),
        option_a: optionAMatch[1].trim(),
        option_b: optionBMatch[1].trim(),
        option_c: optionCMatch[1].trim()
      });
    }
  }

  // Parse answers
  const answerBlocks = answersContent.split(/(?=\d+\/\s*Solution)/);
  const parsedAnswers: Array<{
    order_num: number;
    correct_option: string;
    explanation: string;
  }> = [];

  for (const block of answerBlocks) {
    const trimmed = block.trim();
    if (!trimmed || !trimmed.match(/^\d+\/\s*Solution/)) continue;

    const orderMatch = trimmed.match(/^(\d+)\/\s*Solution/);
    if (!orderMatch) continue;
    const orderNum = parseInt(orderMatch[1]);

    let correctOption = '';
    const lines = trimmed.split('\n');
    for (const line of lines) {
      if (line.match(/^[ABC]\.\s+Correct because/)) {
        correctOption = line.charAt(0);
        break;
      }
    }

    const explanationMatch = trimmed.match(/Solution\s+([\s\S]*?)(?=\n\d+\/\s*Solution|$)/);
    let explanation = explanationMatch ? explanationMatch[1].trim() : '';
    
    explanation = explanation
      .replace(/\nCFA Program Level I for [^\n]+\n\d+\n/g, '\n')
      .replace(/\nGuidance for Standards[^\n]*\n[^\n]*\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/([.!?])\s*\n([ABC]\. (?:Correct|Incorrect) because)/g, '$1\n\n$2')
      .trim();

    if (correctOption) {
      parsedAnswers.push({
        order_num: orderNum,
        correct_option: correctOption,
        explanation: explanation
      });
    }
  }

  // Step 3: Merge and prepare bulk insert
  const questionsToInsert: Question[] = [];

  for (const q of parsedQuestions) {
    const answer = parsedAnswers.find(a => a.order_num === q.order_num);
    if (answer) {
      questionsToInsert.push({
        exam_id: exam.id,
        question_text: q.question_text,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        correct_option: answer.correct_option,
        order_num: q.order_num,
        explanation: answer.explanation
      });
    }
  }

  console.log(`📝 Parsed ${questionsToInsert.length} questions`);

  // Bulk insert
  const { data: insertedQuestions, error: questionsError } = await supabase
    .from('questions')
    .insert(questionsToInsert)
    .select();

  if (questionsError) {
    console.error('❌ Error inserting questions:', questionsError);
    process.exit(1);
  }

  console.log(`✅ Successfully inserted ${insertedQuestions?.length} questions\n`);
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length < 3) {
  console.log(`
Usage: npx ts-node --project tsconfig.scripts.json scripts/seed-exam.ts <title> <questions_file> <answers_file> [duration] [total]

Examples:
  npx ts-node --project tsconfig.scripts.json scripts/seed-exam.ts "MOCK 1 SESSION 1" mock1_sec1_ques.txt mock1_sec1_ans.txt
  npx ts-node --project tsconfig.scripts.json scripts/seed-exam.ts "MOCK 1 SESSION 2" mock1_sec2_ques.txt mock1_sec2_ans.txt 135 90

Arguments:
  <title>          Exam title (e.g., "MOCK 1 SESSION 1")
  <questions_file> Questions file name in data/ folder
  <answers_file>   Answers file name in data/ folder
  [duration]       Duration in minutes (default: 135)
  [total]          Total questions (default: 90)
  `);
  process.exit(1);
}

const [title, questionsFile, answersFile, duration, total] = args;

seedExam(
  title,
  questionsFile,
  answersFile,
  duration ? parseInt(duration) : 135,
  total ? parseInt(total) : 90
).catch(console.error);
