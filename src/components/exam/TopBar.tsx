'use client';

import { useExamStore } from '@/store/useExamStore';
import { useEffect, useRef } from 'react';

export default function TopBar() {
  const questions = useExamStore((state) => state.questions);
  const currentQuestionIndex = useExamStore((state) => state.currentQuestionIndex);
  const timeLeftSeconds = useExamStore((state) => state.timeLeftSeconds);
  const answers = useExamStore((state) => state.answers);
  const isSubmitting = useExamStore((state) => state.isSubmitting);
  const tickTimer = useExamStore((state) => state.tickTimer);
  const submitExam = useExamStore((state) => state.submitExam);
  const hasAutoSubmitted = useRef(false);

  useEffect(() => {
    if (timeLeftSeconds > 0) {
      const timer = setInterval(tickTimer, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeftSeconds, tickTimer]);

  useEffect(() => {
    if (timeLeftSeconds === 0 && !isSubmitting && !hasAutoSubmitted.current && questions.length > 0) {
      hasAutoSubmitted.current = true;
      submitExam();
    }
  }, [timeLeftSeconds, isSubmitting, questions.length, submitExam]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFinishTest = async () => {
    if (isSubmitting) return;
    
    const confirmed = window.confirm(
      'Are you sure you want to finish the test? This action cannot be undone.'
    );
    
    if (confirmed) {
      await submitExam();
    }
  };

  const progress = questions.length > 0 ? Math.round((Object.keys(answers).length / questions.length) * 100) : 0;

  return (
    <div className="bg-[#4D4C4D] text-white flex items-center justify-between px-4 py-2 h-[60px]">
      <div className="font-bold leading-tight">
        <div>Question: {currentQuestionIndex + 1}</div>
        <div>Section: 1</div>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-sm text-right">
          Section Time Remaining:
          <br />
          <span className={timeLeftSeconds < 300 ? 'text-red-400 font-bold' : ''}>
            {formatTime(timeLeftSeconds)}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-xs">Progress {progress}%</div>
        <button 
          className="bg-[#F1D176] text-[#4D4C4D] px-6 py-2 font-bold rounded hover:bg-[#E8C565] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleFinishTest}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Finish Test'}
        </button>
      </div>
    </div>
  );
}
