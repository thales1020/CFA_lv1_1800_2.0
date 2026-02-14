'use client';

import { useState, useEffect } from 'react';
import { useExamStore } from '@/store/useExamStore';
import { supabase } from '@/lib/supabase/client';
import TopBar from '@/components/exam/TopBar';
import SubHeader from '@/components/exam/SubHeader';
import BottomBar from '@/components/exam/BottomBar';
import ReviewOverlay from '@/components/exam/ReviewOverlay';
import QuestionNavigator from '@/components/exam/QuestionNavigator';
import QuestionArea from '@/components/exam/QuestionArea';
import type { Question } from '@/types';

export default function ExamPage({ params }: { params: { id: string } }) {
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const initExam = useExamStore((state) => state.initExam);
  const questions = useExamStore((state) => state.questions);

  useEffect(() => {
    async function fetchExamData() {
      try {
        setIsLoading(true);
        setError(null);

        const { data: exam, error: examError } = await supabase
          .from('exams')
          .select('*')
          .eq('id', params.id)
          .single();

        if (examError) throw examError;
        if (!exam) throw new Error('Exam not found');

        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select('*')
          .eq('exam_id', params.id)
          .order('order_num', { ascending: true });

        if (questionsError) throw questionsError;
        if (!questionsData || questionsData.length === 0) {
          throw new Error('No questions found for this exam');
        }

        const durationMinutes = (exam as any).duration_minutes || 90;
        initExam(params.id, questionsData as Question[], durationMinutes);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching exam data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load exam');
        setIsLoading(false);
      }
    }

    if (questions.length === 0) {
      fetchExamData();
    }
  }, [params.id, initExam, questions.length]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#DFE7EB]">
        <div className="text-[#4D4C4D] text-xl">Loading exam...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#DFE7EB]">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error loading exam</div>
          <div className="text-[#4D4C4D]">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-[#DFE7EB] font-sans select-none overflow-hidden">
      <TopBar />
      <SubHeader />

      <div className="flex flex-1 overflow-hidden">
        <QuestionNavigator />
        <QuestionArea />
      </div>

      <BottomBar onReviewClick={() => setIsReviewOpen(true)} />

      <ReviewOverlay isOpen={isReviewOpen} onClose={() => setIsReviewOpen(false)} />
    </div>
  );
}
