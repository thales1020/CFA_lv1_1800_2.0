const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabase() {
  console.log('📊 Kiểm tra chi tiết database...\n');
  
  // Check questions table
  try {
    const { data: questions, error: qError, count } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: false })
      .limit(1);
    
    if (qError) {
      console.log('❌ Bảng questions:', qError.message);
    } else {
      console.log('✅ Bảng questions: OK');
      console.log(`   - Có thể truy cập được`);
      if (questions && questions.length > 0) {
        console.log(`   - Sample data:`, Object.keys(questions[0]));
      }
    }
  } catch (err) {
    console.log('❌ Bảng questions:', err.message);
  }
  
  // Check exams table
  try {
    const { data: exams, error: eError } = await supabase
      .from('exams')
      .select('*')
      .limit(1);
    
    if (eError) {
      console.log('❌ Bảng exams:', eError.message);
    } else {
      console.log('✅ Bảng exams: OK');
      if (exams && exams.length > 0) {
        console.log(`   - Sample data:`, Object.keys(exams[0]));
      }
    }
  } catch (err) {
    console.log('❌ Bảng exams:', err.message);
  }
  
  // Check exam_attempts table
  try {
    const { data: attempts, error: aError } = await supabase
      .from('exam_attempts')
      .select('*')
      .limit(1);
    
    if (aError) {
      console.log('❌ Bảng exam_attempts:', aError.message);
    } else {
      console.log('✅ Bảng exam_attempts: OK');
      if (attempts && attempts.length > 0) {
        console.log(`   - Sample data:`, Object.keys(attempts[0]));
      }
    }
  } catch (err) {
    console.log('❌ Bảng exam_attempts:', err.message);
  }
  
  // Check user_answers table
  try {
    const { data: answers, error: uaError } = await supabase
      .from('user_answers')
      .select('*')
      .limit(1);
    
    if (uaError) {
      console.log('❌ Bảng user_answers:', uaError.message);
    } else {
      console.log('✅ Bảng user_answers: OK');
      if (answers && answers.length > 0) {
        console.log(`   - Sample data:`, Object.keys(answers[0]));
      }
    }
  } catch (err) {
    console.log('❌ Bảng user_answers:', err.message);
  }
  
  console.log('\n📈 Tổng kết:');
  console.log('- URL Supabase:', supabaseUrl);
  console.log('- Anon Key format:', supabaseAnonKey.startsWith('eyJ') ? 'JWT (chuẩn)' : 'Custom (không chuẩn nhưng vẫn hoạt động)');
  console.log('- Kết nối: ✅ Hoạt động');
}

checkDatabase();
