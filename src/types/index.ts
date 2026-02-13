// TypeScript interfaces and types

export interface Question {
  id: string;
  exam_id: string;
  content: string;
  options: Option[];
  correct_option: string;
}

export interface Option {
  id: string;
  label: string;
  text: string;
}

export interface Attempt {
  id: string;
  user_id: string;
  exam_id: string;
  score: number;
  time_spent: number;
  answer_details: Record<string, any>;
  created_at: string;
}
