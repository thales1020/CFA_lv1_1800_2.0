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

interface QuestionData {
  order_num: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  correct_option: string;
  explanation_a: string;
  explanation_b: string;
  explanation_c: string;
}

interface QuestionInsert {
  exam_id: string;
  order_num: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  correct_option: string;
  explanation_a: string;
  explanation_b: string;
  explanation_c: string;
}

async function seedCFAMock() {
  console.log('🚀 Starting seed for CFA Level 1 - Mock 1 Session 2...');

  const { data: exam, error: examError } = await supabase
    .from('exams')
    .insert({
      title: 'CFA Level 1 - Mock 1 Session 2',
      duration_minutes: 135,
      total_questions: 90
    })
    .select()
    .single();

  if (examError || !exam) {
    console.error('❌ Error creating exam:', examError);
    process.exit(1);
  }

  console.log('✅ Exam created with ID:', exam.id);

  const jsonFilePath = path.join(__dirname, '../data/mock1_section2_cleaned.json');
  
  if (!fs.existsSync(jsonFilePath)) {
    console.error(`❌ JSON file not found: ${jsonFilePath}`);
    process.exit(1);
  }

  console.log('📂 Reading JSON file...');
  const jsonContent = fs.readFileSync(jsonFilePath, 'utf-8');
  const questionsData: QuestionData[] = JSON.parse(jsonContent);

  console.log(`📝 Parsed ${questionsData.length} questions`);

  const questionsToInsert: QuestionInsert[] = questionsData.map(q => ({
    exam_id: exam.id,
    order_num: q.order_num,
    question_text: q.question_text,
    option_a: q.option_a,
    option_b: q.option_b,
    option_c: q.option_c,
    correct_option: q.correct_option,
    explanation_a: q.explanation_a,
    explanation_b: q.explanation_b,
    explanation_c: q.explanation_c
  }));

  const { data: insertedQuestions, error: questionsError } = await supabase
    .from('questions')
    .insert(questionsToInsert)
    .select();

  if (questionsError) {
    console.error('❌ Error inserting questions:', questionsError);
    process.exit(1);
  }

  console.log(`✅ Successfully inserted ${insertedQuestions?.length || 0} questions`);
  console.log('🎉 Seed completed successfully!');
}

seedCFAMock().catch(error => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
