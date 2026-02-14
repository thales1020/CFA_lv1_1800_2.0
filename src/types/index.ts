// types/index.ts

export type OptionType = 'A' | 'B' | 'C';

// --- SUPABASE DATABASE TYPES ---

export interface Database {
  public: {
    Tables: {
      exams: {
        Row: Exam;
        Insert: Omit<Exam, 'id' | 'created_at'>;
        Update: Partial<Omit<Exam, 'id' | 'created_at'>>;
      };
      questions: {
        Row: Question;
        Insert: Omit<Question, 'id'>;
        Update: Partial<Omit<Question, 'id'>>;
      };
      attempts: {
        Row: {
          id: string;
          user_id: string;
          exam_id: string;
          score: number;
          time_spent_seconds: number;
          answers_data: Record<string, OptionType>;
          status: 'in_progress' | 'completed';
          created_at: string;
        };
        Insert: AttemptInsertPayload;
        Update: Partial<AttemptInsertPayload>;
      };
    };
  };
}

// --- DATABASE MODELS ---

export interface Exam {
  id: string;
  title: string;
  description: string | null;
  duration_minutes: number;
  total_questions: number;
  created_at: string;
}

export interface Question {
  id: string;
  exam_id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  correct_option: OptionType;
  order_num: number;
  explanation?: string;
}

export interface AttemptInsertPayload {
  user_id: string;
  exam_id: string;
  score: number;
  time_spent_seconds: number;
  answers_data: Record<string, OptionType>;
  status: 'in_progress' | 'completed';
}

// --- ZUSTAND STORE STATE ---

export interface ExamStoreState {
  // 1. Data
  examInfo: Exam | null;
  questions: Question[];
  currentQuestionIndex: number;

  // 2. User Interactions (Trạng thái UI/Logic)
  answers: Record<string, OptionType>; // { question_id: 'A' }
  flags: Set<string>; // Lưu danh sách question_id bị Flag
  strikethroughs: Record<string, OptionType[]>; // { question_id: ['A', 'C'] }

  // 3. Timer & Status
  timeLeftSeconds: number;
  isSubmitting: boolean;

  // 4. Actions
  initExam: (exam: Exam, questions: Question[]) => void;
  setAnswer: (questionId: string, option: OptionType) => void;
  toggleFlag: (questionId: string) => void;
  toggleStrikethrough: (questionId: string, option: OptionType) => void;
  navigateQuestion: (index: number) => void;
  tickTimer: () => void;
  submitExam: () => Promise<void>;
}