import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Question, OptionType } from '@/types';

interface ExamStoreState {
  examId: string;
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, OptionType>;
  flags: string[];
  strikethroughs: Record<string, OptionType[]>;
  timeLeftSeconds: number;
  durationMinutes: number;
  isSubmitting: boolean;
}

interface ExamStoreActions {
  initExam: (examId: string, questions: Question[], durationMinutes: number) => void;
  setAnswer: (questionId: string, option: OptionType) => void;
  toggleFlag: (questionId: string) => void;
  toggleStrikethrough: (questionId: string, option: OptionType) => void;
  navigateQuestion: (index: number) => void;
  tickTimer: () => void;
  submitExam: () => Promise<void>;
  resetStore: () => void;
}

type ExamStore = ExamStoreState & ExamStoreActions;

const initialState: ExamStoreState = {
  examId: '',
  questions: [],
  currentQuestionIndex: 0,
  answers: {},
  flags: [],
  strikethroughs: {},
  timeLeftSeconds: 0,
  durationMinutes: 0,
  isSubmitting: false,
};

export const useExamStore = create<ExamStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      initExam: (examId: string, questions: Question[], durationMinutes: number) => {
        set({
          examId,
          questions,
          currentQuestionIndex: 0,
          answers: {},
          flags: [],
          strikethroughs: {},
          timeLeftSeconds: durationMinutes * 60,
          durationMinutes,
          isSubmitting: false,
        });
      },

      setAnswer: (questionId: string, option: OptionType) => {
        set((state) => ({
          answers: {
            ...state.answers,
            [questionId]: option,
          },
        }));
      },

      toggleFlag: (questionId: string) => {
        set((state) => {
          const flags = [...state.flags];
          const index = flags.indexOf(questionId);
          
          if (index > -1) {
            flags.splice(index, 1);
          } else {
            flags.push(questionId);
          }
          
          return { flags };
        });
      },

      toggleStrikethrough: (questionId: string, option: OptionType) => {
        set((state) => {
          const currentStrikethroughs = state.strikethroughs[questionId] || [];
          const index = currentStrikethroughs.indexOf(option);
          
          let newStrikethroughs: OptionType[];
          if (index > -1) {
            newStrikethroughs = currentStrikethroughs.filter((o) => o !== option);
          } else {
            newStrikethroughs = [...currentStrikethroughs, option];
          }
          
          return {
            strikethroughs: {
              ...state.strikethroughs,
              [questionId]: newStrikethroughs,
            },
          };
        });
      },

      navigateQuestion: (index: number) => {
        const { questions } = get();
        if (index >= 0 && index < questions.length) {
          set({ currentQuestionIndex: index });
        }
      },

      tickTimer: () => {
        set((state) => {
          const newTime = Math.max(0, state.timeLeftSeconds - 1);
          return { timeLeftSeconds: newTime };
        });
      },

      submitExam: async () => {
        const state = get();
        
        if (state.isSubmitting) {
          return;
        }

        set({ isSubmitting: true });

        try {
          const { supabase } = await import('@/lib/supabase/client');
          
          let correctCount = 0;
          state.questions.forEach((question) => {
            const userAnswer = state.answers[question.id];
            if (userAnswer && userAnswer === question.correct_option) {
              correctCount++;
            }
          });

          const score = correctCount;

          const timeSpentSeconds = (state.durationMinutes * 60) - state.timeLeftSeconds;

          // Generate UUID v4 for exam_id if it's not a valid UUID
          const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(state.examId);
          const examIdToUse = isValidUUID ? state.examId : '550e8400-e29b-41d4-a716-446655440000';

          const payload: any = {
            user_id: null,
            exam_id: examIdToUse,
            score,
            time_spent_seconds: timeSpentSeconds,
            answers_data: state.answers,
            status: 'completed',
          };

          const { data, error } = await supabase
            .from('attempts')
            .insert(payload)
            .select('id')
            .single();

          if (error) {
            throw error;
          }

          if (data && 'id' in data) {
            sessionStorage.removeItem('exam-storage');
            window.location.href = `/result/${(data as { id: string }).id}`;
          }
        } catch (error) {
          console.error('Error submitting exam:', error);
          alert('Failed to submit exam. Please try again.');
          set({ isSubmitting: false });
        }
      },

      resetStore: () => {
        set(initialState);
      },
    }),
    {
      name: 'exam-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        examId: state.examId,
        questions: state.questions,
        currentQuestionIndex: state.currentQuestionIndex,
        answers: state.answers,
        flags: state.flags,
        strikethroughs: state.strikethroughs,
        timeLeftSeconds: state.timeLeftSeconds,
        durationMinutes: state.durationMinutes,
      }),
    }
  )
);
