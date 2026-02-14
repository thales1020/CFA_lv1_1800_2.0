'use client';

import { useExamStore } from '@/store/useExamStore';

interface BottomBarProps {
  onReviewClick?: () => void;
}

export default function BottomBar({ onReviewClick }: BottomBarProps) {
  const questions = useExamStore((state) => state.questions);
  const currentQuestionIndex = useExamStore((state) => state.currentQuestionIndex);
  const currentQuestion = questions[currentQuestionIndex];
  const toggleFlag = useExamStore((state) => state.toggleFlag);
  const flags = useExamStore((state) => state.flags);
  const navigateQuestion = useExamStore((state) => state.navigateQuestion);

  const isFlagged = currentQuestion ? flags.includes(currentQuestion.id) : false;
  const canGoPrevious = currentQuestionIndex > 0;
  const canGoNext = currentQuestionIndex < questions.length - 1;

  const handlePrevious = () => {
    if (canGoPrevious) {
      navigateQuestion(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      navigateQuestion(currentQuestionIndex + 1);
    }
  };

  const handleFlag = () => {
    if (currentQuestion) {
      toggleFlag(currentQuestion.id);
    }
  };

  return (
    <div className="bg-[#4D4C4D] text-white flex items-center justify-between px-4 py-3">
      <div className="flex gap-2">
        <button
          className={`w-[40px] h-[40px] rounded flex items-center justify-center text-xl transition-colors ${
            isFlagged ? 'bg-[#F1D176] text-[#4D4C4D]' : 'bg-white/20 hover:bg-white/30'
          }`}
          onClick={handleFlag}
          title={isFlagged ? 'Remove Flag' : 'Flag Question'}
        >
          🚩
        </button>
        <button
          className="w-[40px] h-[40px] bg-[#DFE7EB]/50 rounded flex items-center justify-center text-xl hover:bg-[#DFE7EB]/70 transition-colors"
          onClick={onReviewClick}
          title="Section Review"
        >
          📋
        </button>
      </div>
      <div className="flex gap-2">
        <button
          className="bg-[#749B44] px-4 py-2 font-bold flex items-center gap-1 rounded hover:bg-[#5A7A30] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handlePrevious}
          disabled={!canGoPrevious}
        >
          &lt; Back
        </button>
        <button
          className="bg-[#749B44] px-4 py-2 font-bold flex items-center gap-1 rounded hover:bg-[#5A7A30] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleNext}
          disabled={!canGoNext}
        >
          Next &gt;
        </button>
      </div>
    </div>
  );
}
