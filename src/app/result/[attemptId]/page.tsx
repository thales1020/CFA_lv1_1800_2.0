'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import FormattedText from '@/components/FormattedText';
import type { OptionType } from '@/types';

interface Question {
  id: string;
  exam_id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  correct_option: OptionType;
  order_num: number;
  explanation_a?: string;
  explanation_b?: string;
  explanation_c?: string;
}

interface AttemptData {
  id: string;
  score: number;
  time_spent_seconds: number;
  answers_data: Record<string, OptionType>;
  created_at: string;
  exam_id: string;
}

function ReviewTopBar({ currentIndex, total }: { currentIndex: number; total: number }) {
  return (
    <div className="bg-[#4D4C4D] text-white flex items-center justify-between px-4 py-2 h-[60px]">
      <div className="font-bold leading-tight">
        <div>Review Mode</div>
        <div>Question: {currentIndex + 1} of {total}</div>
      </div>
      <div className="text-lg font-bold">
        Exam Review
      </div>
    </div>
  );
}

function ReviewQuestionNavigator({
  questions,
  currentIndex,
  userAnswers,
  onNavigate
}: {
  questions: Question[];
  currentIndex: number;
  userAnswers: Record<string, OptionType>;
  onNavigate: (index: number) => void;
}) {
  return (
    <div className="w-[120px] h-full flex flex-col bg-[#DFE7EB] overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 gap-2 p-2">
          {questions.map((question, index) => {
            const isActive = currentIndex === index;
            const userAnswer = userAnswers[question.id];
            const isCorrect = userAnswer === question.correct_option;
            const isAnswered = !!userAnswer;

            return (
              <button
                key={question.id}
                onClick={() => onNavigate(index)}
                className={`
                  h-10 rounded text-sm font-semibold
                  ${isActive 
                    ? 'bg-[#749B44] text-white' 
                    : isAnswered
                      ? isCorrect
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                      : 'bg-white text-[#4D4C4D] border border-[#CCCCCC]'
                  }
                  hover:opacity-90 transition-opacity
                `}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ReviewQuestionArea({
  question,
  userAnswer,
}: {
  question: Question;
  userAnswer?: OptionType;
}) {
  const renderOption = (option: OptionType) => {
    const optionText = question[`option_${option.toLowerCase()}` as keyof Question] as string;
    const explanationKey = `explanation_${option.toLowerCase()}` as keyof Question;
    const explanationText = question[explanationKey] as string | undefined;
    const isUserAnswer = userAnswer === option;
    const isCorrectAnswer = question.correct_option === option;
    const isUserCorrect = isUserAnswer && isCorrectAnswer;
    const isUserWrong = isUserAnswer && !isCorrectAnswer;

    let className = 'border-2 border-[#CCCCCC] bg-white text-[#4D4C4D]';
    
    if (isUserCorrect || (isCorrectAnswer && (isUserWrong || !userAnswer))) {
      className = 'border-2 border-green-600 bg-green-100 text-green-800';
    } else if (isUserWrong) {
      className = 'border-2 border-red-600 bg-red-100 text-red-800';
    }

    return (
      <div key={option} className="mb-3">
        <div
          className={`${className} rounded p-4 pointer-events-none`}
        >
          <div className="flex items-start gap-3">
            <div className="font-bold text-lg">{option}.</div>
            <div className="flex-1">{optionText}</div>
            {isCorrectAnswer && (
              <div className="text-green-600 font-bold">✓ Correct</div>
            )}
            {isUserWrong && (
              <div className="text-red-600 font-bold">✗ Your answer</div>
            )}
          </div>
        </div>
        {explanationText && (
          <div className="mt-2 text-sm text-gray-600 px-4">
            <FormattedText content={explanationText} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 bg-white p-6 overflow-y-auto">
      <div className="mb-6">
        <div className="text-[#4D4C4D] leading-relaxed">
          <FormattedText content={question.question_text} />
        </div>
      </div>

      <div className="space-y-3">
        {(['A', 'B', 'C'] as OptionType[]).map(option => renderOption(option))}
      </div>
    </div>
  );
}

function ReviewBottomBar({
  currentIndex,
  total,
  onPrevious,
  onNext,
  onBackToHistory
}: {
  currentIndex: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
  onBackToHistory: () => void;
}) {
  return (
    <div className="bg-[#DFE7EB] border-t-2 border-[#CCCCCC] px-4 py-3 flex items-center justify-between h-[60px]">
      <button
        onClick={onBackToHistory}
        className="px-6 py-2 bg-[#4D4C4D] text-white rounded hover:bg-[#3D3C3D] transition-colors"
      >
        Back to History
      </button>
      
      <div className="flex gap-4">
        <button
          onClick={onPrevious}
          disabled={currentIndex === 0}
          className="px-6 py-2 bg-white border-2 border-[#CCCCCC] text-[#4D4C4D] rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={currentIndex === total - 1}
          className="px-6 py-2 bg-white border-2 border-[#CCCCCC] text-[#4D4C4D] rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default function ReviewPage({ params }: { params: { attemptId: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState<AttemptData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    async function fetchReviewData() {
      try {
        const { data: attemptData, error: attemptError } = await supabase
          .from('attempts')
          .select('id, score, time_spent_seconds, answers_data, created_at, exam_id')
          .eq('id', params.attemptId)
          .single();

        if (attemptError || !attemptData) throw attemptError;
        
        const typedAttempt = attemptData as AttemptData;
        setAttempt(typedAttempt);

        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select('id, exam_id, question_text, option_a, option_b, option_c, correct_option, order_num, explanation_a, explanation_b, explanation_c')
          .eq('exam_id', typedAttempt.exam_id)
          .order('order_num', { ascending: true });

        if (questionsError) throw questionsError;

        setQuestions(questionsData as Question[]);
      } catch (error) {
        console.error('Error fetching review data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchReviewData();
  }, [params.attemptId]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#DFE7EB]">
        <div className="text-[#4D4C4D] text-xl">Loading review...</div>
      </div>
    );
  }

  if (!attempt || questions.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#DFE7EB]">
        <div className="text-center">
          <div className="text-[#4D4C4D] text-xl mb-4">Review data not found</div>
          <button
            onClick={() => router.push('/history')}
            className="px-6 py-2 bg-[#749B44] text-white rounded"
          >
            Back to History
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const userAnswer = attempt.answers_data[currentQuestion.id];

  return (
    <div className="h-screen flex flex-col overflow-hidden select-none">
      <ReviewTopBar currentIndex={currentQuestionIndex} total={questions.length} />
      
      <div className="flex flex-1 overflow-hidden p-4 gap-4">
        <ReviewQuestionNavigator
          questions={questions}
          currentIndex={currentQuestionIndex}
          userAnswers={attempt.answers_data}
          onNavigate={setCurrentQuestionIndex}
        />
        <ReviewQuestionArea
          question={currentQuestion}
          userAnswer={userAnswer}
        />
      </div>

      <ReviewBottomBar
        currentIndex={currentQuestionIndex}
        total={questions.length}
        onPrevious={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
        onNext={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
        onBackToHistory={() => router.push('/history')}
      />
    </div>
  );
}
