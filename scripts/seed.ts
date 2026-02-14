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

async function seedData() {
  const { data: exam, error: examError } = await supabase
    .from('exams')
    .insert({
      title: 'MOCK 1 SESSION 1',
      description: 'CFA Program Level I Mock Exam',
      duration_minutes: 135,
      total_questions: 90
    })
    .select()
    .single();

  if (examError || !exam) {
    console.error('Error creating exam:', examError);
    process.exit(1);
  }

  console.log('Exam created with ID:', exam.id);

  const questionsFilePath = path.join(__dirname, '../data/mock1_sec1_ques.txt');
  const answersFilePath = path.join(__dirname, '../data/mock1_sec1_ans.txt');

  const questionsContent = fs.readFileSync(questionsFilePath, 'utf-8');
  const answersContent = fs.readFileSync(answersFilePath, 'utf-8');

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

  console.log(`Parsed ${questionsToInsert.length} questions`);

  const { data: insertedQuestions, error: questionsError } = await supabase
    .from('questions')
    .insert(questionsToInsert)
    .select();

  if (questionsError) {
    console.error('Error inserting questions:', questionsError);
    process.exit(1);
  }

  console.log(`Successfully inserted ${insertedQuestions?.length} questions`);
}

seedData().catch(console.error);
