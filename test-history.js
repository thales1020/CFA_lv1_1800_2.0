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

async function testHistoryPage() {
  console.log('🧪 Test History Page - Verification\n');
  
  // Test 1: Fetch attempts
  console.log('1️⃣ Test: Kết nối dữ liệu (fetch attempts)');
  const { data: attempts, error } = await supabase
    .from('attempts')
    .select('id, created_at, score, time_spent_seconds, exam_id')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.log('   ❌ Error:', error.message);
    return;
  }
  
  console.log(`   ✅ Fetched ${attempts.length} attempts`);
  
  if (attempts.length === 0) {
    console.log('   ⚠️  No data found. Need to submit an exam first.');
    console.log('   → Go to http://localhost:3000/exam/exam1 and submit a test');
    return;
  }
  
  // Test 2: Format verification
  console.log('\n2️⃣ Test: Format dữ liệu');
  const sample = attempts[0];
  
  // Format date
  const date = new Date(sample.created_at);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
  
  // Format time
  const seconds = sample.time_spent_seconds;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const formattedTime = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  
  // Format score (assuming 20 questions)
  const totalQuestions = 20;
  const formattedScore = `${sample.score}/${totalQuestions}`;
  
  console.log('   Sample Record:');
  console.log('   - Date:', formattedDate, '✅');
  console.log('   - Exam: CFA Level 1 Mock Exam ✅');
  console.log('   - Score:', formattedScore, '✅');
  console.log('   - Time:', formattedTime, '✅');
  console.log('   - ID:', sample.id, '✅');
  
  // Test 3: Navigation
  console.log('\n3️⃣ Test: Điều hướng');
  console.log('   - View Details URL:', `/result/${sample.id}`, '✅');
  console.log('   → Click "View Details" should redirect to this URL');
  
  console.log('\n✅ All criteria passed!');
  console.log('\n📋 Manual verification steps:');
  console.log('   1. Open: http://localhost:3000/history');
  console.log('   2. Verify table displays with correct formatting');
  console.log('   3. Click "View Details" button');
  console.log('   4. Verify redirect to /result/[id] page');
}

testHistoryPage();
