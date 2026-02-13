// Database CRUD functions
import { supabase } from './client';

export async function getQuestions(examId: string) {
  // Implement database queries here
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('exam_id', examId);

  if (error) throw error;
  return data;
}
