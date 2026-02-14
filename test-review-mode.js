const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testReviewMode() {
  console.log('🧪 Test Review Mode - Verification\n');
  
  // Get latest attempt
  const { data: attempts, error: attemptError } = await supabase
    .from('attempts')
    .select('id, exam_id, answers_data')
    .order('created_at', { ascending: false })
    .limit(1);
  
  if (attemptError || !attempts || attempts.length === 0) {
    console.log('❌ No attempts found. Submit an exam first.');
    return;
  }
  
  const attempt = attempts[0];
  console.log('✅ Found attempt:', attempt.id);
  
  // Fetch questions
  const { data: questions, error: questionsError } = await supabase
    .from('questions')
    .select('*')
    .eq('exam_id', attempt.exam_id)
    .order('order_num', { ascending: true });
  
  if (questionsError || !questions || questions.length === 0) {
    console.log('❌ No questions found for exam_id:', attempt.exam_id);
    console.log('⚠️  This means the exam was created without proper questions in database');
    console.log('💡 Review Mode will show "Review data not found"');
    return;
  }
  
  console.log(`✅ Found ${questions.length} questions\n`);
  
  // Test highlight logic
  console.log('🎨 Test Highlight Logic:\n');
  
  const sampleQuestion = questions[0];
  const userAnswer = attempt.answers_data[sampleQuestion.id];
  const correctAnswer = sampleQuestion.correct_option;
  
  console.log('Sample Question ID:', sampleQuestion.id);
  console.log('User Answer:', userAnswer || '(not answered)');
  console.log('Correct Answer:', correctAnswer);
  
  if (userAnswer === correctAnswer) {
    console.log('✅ User selected CORRECT → Green highlight');
  } else if (userAnswer) {
    console.log('❌ User selected WRONG → Red highlight on user answer, Green on correct');
  } else {
    console.log('⚪ User DID NOT answer → Green highlight on correct answer only');
  }
  
  console.log('\n📋 Review Mode URL:');
  console.log(`http://localhost:3000/result/${attempt.id}`);
  
  console.log('\n✅ Verification checklist:');
  console.log('1. TopBar shows "Review Mode" and question counter');
  console.log('2. QuestionNavigator shows green for correct, red for wrong answers');
  console.log('3. Options are read-only (pointer-events-none)');
  console.log('4. Correct answers highlighted in green');
  console.log('5. Wrong user answers highlighted in red');
  console.log('6. Explanation box displayed below options');
  console.log('7. Previous/Next navigation works');
  console.log('8. "Back to History" button returns to /history');
}

testReviewMode();
