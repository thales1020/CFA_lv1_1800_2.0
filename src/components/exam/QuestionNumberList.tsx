'use client';

import { useExamStore } from '@/store/useExamStore';

export default function QuestionNumberList() {
  const questions = useExamStore((state) => state.questions);
  const currentQuestionIndex = useExamStore((state) => state.currentQuestionIndex);
  const answers = useExamStore((state) => state.answers);
  const flags = useExamStore((state) => state.flags);
  const navigateQuestion = useExamStore((state) => state.navigateQuestion);

  return (
    <div className="w-[120px] flex flex-col gap-2">
      {questions.map((question, index) => {
        const isAnswered = !!answers[question.id];
        const isFlagged = flags.includes(question.id);
        const isCurrent = index === currentQuestionIndex;

        return (
          <button
            key={question.id}
            onClick={() => navigateQuestion(index)}
            className={`w-full py-1 text-center font-bold text-sm transition-colors ${
              isCurrent
                ? 'bg-[#749B44] text-white'
                : isAnswered
                ? 'bg-[#4D4C4D] text-white'
                : 'bg-white border border-[#CCCCCC] text-[#4D4C4D] hover:bg-gray-50'
            }`}
            title={`Question ${index + 1}${isFlagged ? ' (Flagged)' : ''}${isAnswered ? ' (Answered)' : ''}`}
          >
            {index + 1}
            {isFlagged && <span className="text-xs"> 🚩</span>}
          </button>
        );
      })}
    </div>
  );
}
