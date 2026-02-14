'use client';

import { useExamStore } from '@/store/useExamStore';
import { useState } from 'react';

interface ReviewOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

type FilterType = 'all' | 'attempted' | 'flagged';

export default function ReviewOverlay({ isOpen, onClose }: ReviewOverlayProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const questions = useExamStore((state) => state.questions);
  const answers = useExamStore((state) => state.answers);
  const flags = useExamStore((state) => state.flags);
  const currentQuestionIndex = useExamStore((state) => state.currentQuestionIndex);
  const navigateQuestion = useExamStore((state) => state.navigateQuestion);

  if (!isOpen) return null;

  const handleQuestionClick = (index: number) => {
    navigateQuestion(index);
    onClose();
  };

  const filteredQuestions = questions.filter((question, index) => {
    if (filter === 'attempted') {
      return !!answers[question.id];
    }
    if (filter === 'flagged') {
      return flags.includes(question.id);
    }
    return true;
  });

  const handleClearFilter = () => {
    setFilter('all');
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      ></div>
      <div className="fixed top-0 left-0 w-[320px] h-full bg-white shadow-lg flex flex-col z-50">
        <div className="h-[60px] bg-[#4D4C4D] flex items-center justify-between px-4 text-white font-bold">
          <span>Section Review</span>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 text-2xl leading-none"
          >
            ×
          </button>
        </div>
        <div className="bg-[#DFE7EB] p-4 relative text-[#4D4C4D]">
          <div className="font-bold mb-2">Filter by:</div>
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              className={`px-3 py-1 text-xs rounded border transition-colors ${
                filter === 'all'
                  ? 'bg-[#749B44] text-white border-[#749B44]'
                  : 'bg-white border-[#4D4C4D] hover:bg-gray-100'
              }`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`px-3 py-1 text-xs rounded border transition-colors ${
                filter === 'attempted'
                  ? 'bg-[#749B44] text-white border-[#749B44]'
                  : 'bg-white border-[#4D4C4D] hover:bg-gray-100'
              }`}
              onClick={() => setFilter('attempted')}
            >
              Attempted ({Object.keys(answers).length})
            </button>
            <button
              className={`px-3 py-1 text-xs rounded border transition-colors ${
                filter === 'flagged'
                  ? 'bg-[#749B44] text-white border-[#749B44]'
                  : 'bg-white border-[#4D4C4D] hover:bg-gray-100'
              }`}
              onClick={() => setFilter('flagged')}
            >
              Flagged ({flags.length})
            </button>
          </div>
          {filter !== 'all' && (
            <button
              className="absolute bottom-4 right-4 bg-[#749B44] text-white px-3 py-1 rounded font-bold text-sm hover:bg-[#5A7A30] transition-colors"
              onClick={handleClearFilter}
            >
              ✕ Clear
            </button>
          )}
        </div>
        <div className="flex-1 bg-white p-4 overflow-y-auto">
          <div className="flex flex-wrap gap-2">
            {filteredQuestions.map((question, filteredIndex) => {
              const actualIndex = questions.findIndex((q) => q.id === question.id);
              const isAnswered = !!answers[question.id];
              const isFlagged = flags.includes(question.id);
              const isCurrent = actualIndex === currentQuestionIndex;

              return (
                <button
                  key={question.id}
                  onClick={() => handleQuestionClick(actualIndex)}
                  className={`relative h-7 w-[75px] text-xs font-bold rounded flex items-center justify-between px-2 overflow-hidden transition-colors ${
                    isCurrent
                      ? 'bg-[#749B44] text-white'
                      : isAnswered
                      ? 'bg-[#4D4C4D] text-white hover:bg-[#6A6969]'
                      : 'bg-white border border-[#4D4C4D] text-[#4D4C4D] hover:bg-gray-100'
                  }`}
                >
                  {isFlagged && (
                    <div className="absolute top-0 left-0 w-0 h-0 border-t-[8px] border-r-[8px] border-t-[#F1D176] border-r-transparent"></div>
                  )}
                  <span className="ml-1">{actualIndex + 1}</span>
                </button>
              );
            })}
          </div>
          {filteredQuestions.length === 0 && (
            <p className="text-center text-[#4D4C4D] text-sm mt-4">
              No questions match this filter
            </p>
          )}
        </div>
      </div>
    </>
  );
}
