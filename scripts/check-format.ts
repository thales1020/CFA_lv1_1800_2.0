import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

(async () => {
  // Get first exam
  const { data: exams } = await supabase
    .from('exams')
    .select('id, title')
    .order('created_at', { ascending: false })
    .limit(1);

  if (!exams || exams.length === 0) {
    console.log('No exams found');
    return;
  }

  const exam = exams[0];
  console.log(`Checking exam: ${exam.title}\n`);

  // Get first question with explanation
  const { data: questions } = await supabase
    .from('questions')
    .select('order_num, explanation')
    .eq('exam_id', exam.id)
    .not('explanation', 'is', null)
    .order('order_num', { ascending: true })
    .limit(1);

  if (!questions || questions.length === 0) {
    console.log('No questions with explanation found');
    return;
  }

  const q = questions[0];
  console.log(`Question ${q.order_num} explanation:`);
  console.log('='.repeat(50));
  console.log(q.explanation);
  console.log('='.repeat(50));
  
  // Check if it has proper line breaks
  const hasDoubleLineBreak = q.explanation?.includes('\n\n');
  console.log(`\nHas double line breaks (\\n\\n): ${hasDoubleLineBreak ? '✅ YES' : '❌ NO'}`);
  
  // Count A., B., C. occurrences
  const aCount = (q.explanation?.match(/\nA\. /g) || []).length;
  const bCount = (q.explanation?.match(/\nB\. /g) || []).length;
  const cCount = (q.explanation?.match(/\nC\. /g) || []).length;
  console.log(`A. occurrences: ${aCount}`);
  console.log(`B. occurrences: ${bCount}`);
  console.log(`C. occurrences: ${cCount}`);
})();
