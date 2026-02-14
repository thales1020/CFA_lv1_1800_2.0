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

async function createTestAttempt() {
  console.log('🔨 TẠO TEST DATA CHO NGHIỆM THU\n');
  
  // Get questions from exam
  const examId = '550e8400-e29b-41d4-a716-446655440000';
  const { data: questions, error: qError } = await supabase
    .from('questions')
    .select('id, correct_option, order_num')
    .eq('exam_id', examId)
    .order('order_num', { ascending: true });
  
  if (qError || !questions || questions.length === 0) {
    console.log('❌ Không tìm thấy questions!');
    console.log('💡 Hãy chạy SQL file: docs/insert-sample-questions.sql\n');
    return;
  }
  
  console.log(`✅ Found ${questions.length} questions\n`);
  
  // Create answers_data with mixed results:
  // - First 8 questions: CORRECT
  // - Next 7 questions: WRONG
  // - Last 5 questions: UNANSWERED
  
  const answersData = {};
  let correctCount = 0;
  let wrongCount = 0;
  let unansweredCount = 0;
  
  questions.forEach((q, idx) => {
    if (idx < 8) {
      // Correct answers
      answersData[q.id] = q.correct_option;
      correctCount++;
    } else if (idx < 15) {
      // Wrong answers
      const wrongOptions = ['A', 'B', 'C'].filter(opt => opt !== q.correct_option);
      answersData[q.id] = wrongOptions[0];
      wrongCount++;
    }
    // else: unanswered (no entry in answersData)
    else {
      unansweredCount++;
    }
  });
  
  // Calculate score
  const score = correctCount;
  const total = questions.length;
  
  // Insert attempt
  const { data: attempt, error: attemptError } = await supabase
    .from('attempts')
    .insert({
      exam_id: examId,
      answers_data: answersData,
      score: score,
      time_spent_seconds: 3600 // 60 phút
    })
    .select()
    .single();
  
  if (attemptError) {
    console.log('❌ Lỗi khi tạo attempt:', attemptError.message);
    return;
  }
  
  console.log('✅ TẠO ATTEMPT THÀNH CÔNG!\n');
  console.log('========================================');
  console.log('📋 CHI TIẾT TEST DATA');
  console.log('========================================\n');
  
  console.log(`Attempt ID: ${attempt.id}`);
  console.log(`Exam ID: ${examId}`);
  console.log(`Score: ${score}/${total} (${Math.round(score/total*100)}%)`);
  console.log(`Time spent: ${Math.floor(3600/60)} phút\n`);
  
  console.log('📊 Phân bố câu trả lời:');
  console.log(`✓ Câu ĐÚNG: ${correctCount} câu (câu 1-8)`);
  console.log(`   → Hiển thị: 1 ô XANH LÁ với ✓ Correct\n`);
  
  console.log(`✗ Câu SAI: ${wrongCount} câu (câu 9-15)`);
  console.log(`   → Hiển thị: 1 ô ĐỎ (user) + 1 ô XANH LÁ (correct)\n`);
  
  console.log(`⚪ Câu BỎ TRỐNG: ${unansweredCount} câu (câu 16-20)`);
  console.log(`   → Hiển thị: 1 ô XANH LÁ (correct only)\n`);
  
  console.log('========================================');
  console.log('🎯 KIỂM TRA NGHIỆM THU');
  console.log('========================================\n');
  
  console.log(`1. Mở URL: http://localhost:3000/result/${attempt.id}\n`);
  
  console.log('2. KIỂM TRA từng tiêu chí:\n');
  
  console.log('   ✅ Tiêu chí 1: Fetch Dữ liệu');
  console.log('   ─────────────────────────────');
  console.log('   ☐ Trang load đầy đủ thông tin');
  console.log('   ☐ Không có lỗi undefined');
  console.log('   ☐ Hiển thị Review Mode title\n');
  
  console.log('   ✅ Tiêu chí 2: Logic Màu sắc');
  console.log('   ─────────────────────────────');
  console.log('   ☐ Câu 1-8: CHỈ 1 ô XANH LÁ với ✓ Correct');
  console.log('   ☐ Câu 9-15: 1 ô ĐỎ (✗ Your answer) + 1 ô XANH LÁ (✓ Correct)');
  console.log('   ☐ Câu 16-20: CHỈ 1 ô XANH LÁ với ✓ Correct\n');
  
  console.log('   ✅ Tiêu chí 3: Tương tác Read-only');
  console.log('   ──────────────────────────────────');
  console.log('   ☐ Click vào các options → KHÔNG có phản ứng');
  console.log('   ☐ Cursor không đổi thành pointer\n');
  
  console.log('   ✅ Tiêu chí 4: Điều hướng');
  console.log('   ─────────────────────────');
  console.log('   ☐ Click "Next" → Chuyển sang câu tiếp theo');
  console.log('   ☐ Click "Previous" → Quay lại câu trước');
  console.log('   ☐ Click số câu (VD: "5") trong Navigator → Nhảy đến câu 5');
  console.log('   ☐ Màu sắc options UPDATE ĐÚNG khi chuyển câu');
  console.log('   ☐ Explanation UPDATE ĐÚNG khi chuyển câu\n');
  
  console.log('3. TEST CASES CỤ THỂ:\n');
  
  console.log('   Test Case 1: Câu trả lời ĐÚNG');
  console.log('   ─────────────────────────────');
  console.log('   • Chuyển đến câu 3 (đúng)');
  console.log('   • Verify: Chỉ 1 ô xanh lá, có ✓ Correct');
  console.log('   • Verify: Explanation hiển thị "Your answer was correct!"\n');
  
  console.log('   Test Case 2: Câu trả lời SAI');
  console.log('   ─────────────────────────────');
  console.log('   • Chuyển đến câu 10 (sai)');
  console.log('   • Verify: 1 ô đỏ (✗ Your answer) + 1 ô xanh lá (✓ Correct)');
  console.log('   • Verify: Explanation hiển thị "You selected X, which is incorrect."\n');
  
  console.log('   Test Case 3: Câu BỎ TRỐNG');
  console.log('   ─────────────────────────────');
  console.log('   • Chuyển đến câu 18 (unanswered)');
  console.log('   • Verify: Chỉ 1 ô xanh lá (correct)');
  console.log('   • Verify: Explanation hiển thị "You did not answer this question."\n');
  
  console.log('========================================');
  console.log('✅ TEST DATA ĐÃ SẴN SÀNG!');
  console.log('========================================\n');
}

createTestAttempt();
