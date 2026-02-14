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

async function verify() {
  console.log('=== VERIFICATION: Seed Data DoD ===\n');

  // 1. Check exam record
  const { data: exams, error: examError } = await supabase
    .from('exams')
    .select('*')
    .eq('title', 'MOCK 1 SESSION 1')
    .order('created_at', { ascending: false })
    .limit(1);

  if (examError) {
    console.error('❌ Error fetching exam:', examError);
    return;
  }

  if (!exams || exams.length === 0) {
    console.error('❌ No exam found with title "MOCK 1 SESSION 1"');
    return;
  }

  const exam = exams[0];
  console.log('✅ Exam found:');
  console.log(`   ID: ${exam.id}`);
  console.log(`   Title: ${exam.title}`);
  console.log(`   Duration: ${exam.duration_minutes} minutes ${exam.duration_minutes === 135 ? '✅' : '❌'}`);
  console.log(`   Total Questions: ${exam.total_questions} ${exam.total_questions === 90 ? '✅' : '❌'}`);
  console.log('');

  // 2. Check questions count
  const { data: questions, error: questionsError, count } = await supabase
    .from('questions')
    .select('*', { count: 'exact' })
    .eq('exam_id', exam.id);

  if (questionsError) {
    console.error('❌ Error fetching questions:', questionsError);
    return;
  }

  console.log(`📊 Questions count: ${count}`);
  if (count === 90) {
    console.log('✅ Exact 90 questions inserted');
  } else {
    console.log(`⚠️  Expected 90, got ${count}`);
  }
  console.log('');

  // 3. Verify exam_id match
  const wrongExamId = questions?.filter(q => q.exam_id !== exam.id).length || 0;
  if (wrongExamId === 0) {
    console.log('✅ All questions have correct exam_id');
  } else {
    console.log(`❌ ${wrongExamId} questions have wrong exam_id`);
  }

  // 4. Sample data quality check
  if (questions && questions.length > 0) {
    console.log('\n📝 Sample Question #1:');
    const q1 = questions.find(q => q.order_num === 1) || questions[0];
    
    console.log(`   order_num: ${q1.order_num}`);
    console.log(`   question_text starts with: "${q1.question_text.substring(0, 60)}..."`);
    console.log(`   ${q1.question_text.match(/^\d+\/\s*Q\./) ? '❌ Contains "N/ Q." prefix' : '✅ Clean question text'}`);
    
    console.log(`   option_a: "${q1.option_a.substring(0, 50)}..."`);
    console.log(`   ${q1.option_a.match(/^[ABC]\.\s/) ? '❌ Contains "X. " prefix' : '✅ Clean option'}`);
    
    console.log(`   option_b: "${q1.option_b.substring(0, 50)}..."`);
    console.log(`   ${q1.option_b.match(/^[ABC]\.\s/) ? '❌ Contains "X. " prefix' : '✅ Clean option'}`);
    
    console.log(`   option_c: "${q1.option_c.substring(0, 50)}..."`);
    console.log(`   ${q1.option_c.match(/^[ABC]\.\s/) ? '❌ Contains "X. " prefix' : '✅ Clean option'}`);
    
    console.log(`   correct_option: "${q1.correct_option}"`);
    console.log(`   ${/^[ABC]$/.test(q1.correct_option) ? '✅ Single uppercase char' : '❌ Invalid format'}`);
    
    console.log(`   explanation length: ${q1.explanation?.length || 0} chars`);
    console.log(`   ${(q1.explanation?.length || 0) > 50 ? '✅ Has explanation' : '⚠️  Explanation too short'}`);

    // Check multiple questions
    console.log('\n📊 Data Quality Summary:');
    const questionsWithPrefix = questions.filter(q => q.question_text.match(/^\d+\/\s*Q\./)).length;
    const optionsWithPrefix = questions.filter(q => 
      q.option_a.match(/^[ABC]\.\s/) || 
      q.option_b.match(/^[ABC]\.\s/) || 
      q.option_c.match(/^[ABC]\.\s/)
    ).length;
    const invalidCorrectOptions = questions.filter(q => !/^[ABC]$/.test(q.correct_option)).length;
    const shortExplanations = questions.filter(q => (q.explanation?.length || 0) < 50).length;

    console.log(`   Questions with "N/ Q." prefix: ${questionsWithPrefix} ${questionsWithPrefix === 0 ? '✅' : '❌'}`);
    console.log(`   Options with "X. " prefix: ${optionsWithPrefix} ${optionsWithPrefix === 0 ? '✅' : '❌'}`);
    console.log(`   Invalid correct_option format: ${invalidCorrectOptions} ${invalidCorrectOptions === 0 ? '✅' : '❌'}`);
    console.log(`   Explanations < 50 chars: ${shortExplanations} ${shortExplanations === 0 ? '✅' : '⚠️ '}`);
  }

  console.log('\n=== END VERIFICATION ===');
}

verify().catch(console.error);
