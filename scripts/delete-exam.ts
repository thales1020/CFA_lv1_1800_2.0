import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import * as readline from 'readline';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }));
}

async function listExams() {
  const { data: exams, error } = await supabase
    .from('exams')
    .select('id, title, duration_minutes, total_questions, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching exams:', error);
    return [];
  }

  if (!exams || exams.length === 0) {
    console.log('📭 No exams found');
    return [];
  }

  console.log('\n📚 Available Exams:\n');
  exams.forEach((exam, index) => {
    console.log(`${index + 1}. ${exam.title}`);
    console.log(`   ID: ${exam.id}`);
    console.log(`   Duration: ${exam.duration_minutes} min | Total Questions: ${exam.total_questions}`);
    console.log(`   Created: ${new Date(exam.created_at).toLocaleString()}\n`);
  });

  return exams;
}

async function getQuestionCount(examId: string): Promise<number> {
  const { count, error } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })
    .eq('exam_id', examId);

  if (error) {
    console.error('⚠️  Error counting questions:', error);
    return 0;
  }

  return count || 0;
}

async function deleteExam(examId: string) {
  // Get exam info
  const { data: exam, error: fetchError } = await supabase
    .from('exams')
    .select('id, title')
    .eq('id', examId)
    .single();

  if (fetchError || !exam) {
    console.error('❌ Exam not found');
    return;
  }

  // Count questions
  const questionCount = await getQuestionCount(examId);

  console.log(`\n⚠️  You are about to DELETE:`);
  console.log(`   Exam: ${exam.title}`);
  console.log(`   ID: ${exam.id}`);
  console.log(`   Questions to be deleted: ${questionCount}\n`);

  const answer = await askQuestion('Type "DELETE" to confirm: ');

  if (answer.trim() !== 'DELETE') {
    console.log('❌ Deletion cancelled');
    return;
  }

  // Delete exam (CASCADE will delete questions automatically)
  const { error: deleteError } = await supabase
    .from('exams')
    .delete()
    .eq('id', examId);

  if (deleteError) {
    console.error('❌ Error deleting exam:', deleteError);
    return;
  }

  console.log(`\n✅ Successfully deleted exam: ${exam.title}`);
  console.log(`✅ ${questionCount} questions were also deleted (CASCADE)\n`);
}

async function deleteByTitle(title: string) {
  const { data: exams, error } = await supabase
    .from('exams')
    .select('id, title')
    .ilike('title', `%${title}%`);

  if (error || !exams || exams.length === 0) {
    console.error('❌ No exams found with that title');
    return;
  }

  if (exams.length > 1) {
    console.log(`\n⚠️  Multiple exams found matching "${title}":\n`);
    exams.forEach((exam, index) => {
      console.log(`${index + 1}. ${exam.title} (ID: ${exam.id})`);
    });
    console.log('\nPlease use the exact exam ID instead.');
    return;
  }

  await deleteExam(exams[0].id);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
Usage: npx ts-node --project tsconfig.scripts.json scripts/delete-exam.ts [exam_id | exam_title | --list]

Options:
  --list              List all exams
  <exam_id>           Delete exam by ID
  <exam_title>        Delete exam by title (partial match)

Examples:
  # List all exams
  npx ts-node --project tsconfig.scripts.json scripts/delete-exam.ts --list

  # Delete by ID
  npx ts-node --project tsconfig.scripts.json scripts/delete-exam.ts 4a39fe07-993a-44b2-a617-f7e012b27e68

  # Delete by title
  npx ts-node --project tsconfig.scripts.json scripts/delete-exam.ts "MOCK 1 SESSION 1"
    `);
    process.exit(1);
  }

  const input = args[0];

  if (input === '--list') {
    await listExams();
    return;
  }

  // Check if input is UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  if (uuidRegex.test(input)) {
    await deleteExam(input);
  } else {
    await deleteByTitle(input);
  }
}

main().catch(console.error);
