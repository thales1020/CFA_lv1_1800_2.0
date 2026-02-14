'use client';

import { useRef } from 'react';
import { useExamStore } from '@/store/useExamStore';

export default function QuestionNavigator() {
  const questions = useExamStore((state) => state.questions);
  const currentQuestionIndex = useExamStore((state) => state.currentQuestionIndex);
  const answers = useExamStore((state) => state.answers);
  const flags = useExamStore((state) => state.flags);
  const navigateQuestion = useExamStore((state) => state.navigateQuestion);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScrollUp = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        top: -100,
        behavior: 'smooth'
      });
    }
  };

  const handleScrollDown = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        top: 100,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-[120px] h-full flex flex-col bg-[#DFE7EB]">
      <button
        onClick={handleScrollUp}
        className="h-10 flex items-center justify-center bg-white border border-[#CCCCCC] hover:bg-gray-100"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 7L15 12L5 12L10 7Z" fill="#4D4C4D" />
        </svg>
      </button>

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-hidden"
        onWheel={(e) => e.preventDefault()}
      >
        <div className="grid grid-cols-1 gap-2 p-2">
          {questions.map((question, index) => {
            const isActive = currentQuestionIndex === index;
            const isAnswered = !!answers[question.id];
            const isFlagged = flags.includes(question.id);

            return (
              <button
                key={question.id}
                onClick={() => navigateQuestion(index)}
                title={`Question ${index + 1}${isFlagged ? ' (Flagged)' : ''}${isAnswered ? ' (Answered)' : ''}`}
                className={`
                  h-10 rounded text-sm font-semibold relative
                  ${isActive 
                    ? 'bg-[#749B44] text-white' 
                    : isAnswered
                    ? 'bg-[#4D4C4D] text-white'
                    : 'bg-white text-[#4D4C4D] border border-[#CCCCCC]'
                  }
                  hover:opacity-90 transition-opacity
                `}
              >
                {index + 1}
                {isFlagged && <span className="absolute top-0 right-1 text-xs">🚩</span>}
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={handleScrollDown}
        className="h-10 flex items-center justify-center bg-white border border-[#CCCCCC] hover:bg-gray-100"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 13L5 8L15 8L10 13Z" fill="#4D4C4D" />
        </svg>
      </button>
    </div>
  );
}
