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

async function testAttemptsTable() {
  console.log('🔍 Kiểm tra bảng attempts...\n');
  
  // Test read
  const { data, error } = await supabase
    .from('attempts')
    .select('*')
    .limit(1);
  
  if (error) {
    console.log('❌ Lỗi đọc bảng attempts:');
    console.log('   Message:', error.message);
    console.log('   Code:', error.code);
    console.log('   Details:', error.details);
    console.log('\n💡 Action: Bảng attempts chưa tồn tại hoặc chưa có quyền truy cập');
    console.log('   → Cần chạy schema.db trong Supabase SQL Editor');
    return;
  }
  
  console.log('✅ Bảng attempts tồn tại và có quyền đọc');
  
  if (data && data.length > 0) {
    console.log('   Columns:', Object.keys(data[0]));
  } else {
    console.log('   (Chưa có dữ liệu)');
  }
  
  // Test insert
  console.log('\n🧪 Test insert vào bảng attempts...');
  
  const testPayload = {
    user_id: null,
    exam_id: '550e8400-e29b-41d4-a716-446655440000',
    score: 50,
    time_spent_seconds: 3600,
    answers_data: { q1: 'A', q2: 'B' },
    status: 'completed'
  };
  
  const { data: insertData, error: insertError } = await supabase
    .from('attempts')
    .insert(testPayload)
    .select('id')
    .single();
  
  if (insertError) {
    console.log('❌ Lỗi insert:');
    console.log('   Message:', insertError.message);
    console.log('   Code:', insertError.code);
    console.log('   Details:', insertError.details);
    console.log('   Hint:', insertError.hint);
    
    if (insertError.message.includes('foreign key')) {
      console.log('\n💡 Action: Foreign key constraint - exam_id không tồn tại trong bảng exams');
      console.log('   → Chạy SQL: ALTER TABLE attempts DROP CONSTRAINT attempts_exam_id_fkey;');
    }
    if (insertError.message.includes('violates')) {
      console.log('\n💡 Action: Constraint violation');
      console.log('   → Check schema requirements');
    }
  } else {
    console.log('✅ Insert thành công!');
    console.log('   ID:', insertData.id);
    
    // Cleanup
    await supabase.from('attempts').delete().eq('id', insertData.id);
    console.log('   (Đã xóa test record)');
  }
}

testAttemptsTable();
