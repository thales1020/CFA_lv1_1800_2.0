'use client';

import { useExamStore } from '@/store/useExamStore';

export default function DebugPanel() {
  const questions = useExamStore((state) => state.questions);
  const answers = useExamStore((state) => state.answers);
  const flags = useExamStore((state) => state.flags);
  const currentQuestionIndex = useExamStore((state) => state.currentQuestionIndex);
  const timeLeftSeconds = useExamStore((state) => state.timeLeftSeconds);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).length;
  const flaggedCount = flags.length;
  const progress = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-[#4D4C4D] rounded-lg shadow-lg p-4 w-[280px] z-50 text-[12px] font-mono">
      <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-300">
        <span className="font-bold text-[14px]">🐛 Debug Panel</span>
        <button
          onClick={() => {
            const panel = document.getElementById('debug-panel');
            if (panel) panel.style.display = 'none';
          }}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-1">
        <div className="grid grid-cols-2 gap-1">
          <span className="text-gray-600">Total Questions:</span>
          <span className="font-bold">{questions.length}</span>
          
          <span className="text-gray-600">Current Q:</span>
          <span className="font-bold text-[#749B44]">{currentQuestionIndex + 1}</span>
          
          <span className="text-gray-600">Answered:</span>
          <span className="font-bold text-blue-600">{answeredCount}</span>
          
          <span className="text-gray-600">Flagged:</span>
          <span className="font-bold text-orange-600">{flaggedCount}</span>
          
          <span className="text-gray-600">Progress:</span>
          <span className="font-bold">{progress}%</span>
          
          <span className="text-gray-600">Time Left:</span>
          <span className={`font-bold ${timeLeftSeconds < 300 ? 'text-red-600' : ''}`}>
            {formatTime(timeLeftSeconds)}
          </span>
        </div>

        <div className="pt-2 mt-2 border-t border-gray-300">
          <div className="text-gray-600 mb-1">Answered Questions:</div>
          <div className="bg-gray-50 p-2 rounded max-h-[80px] overflow-y-auto text-[10px]">
            {answeredCount === 0 ? (
              <span className="text-gray-400">None</span>
            ) : (
              Object.entries(answers).map(([qId, answer]) => {
                const qIndex = questions.findIndex((q) => q.id === qId);
                return (
                  <div key={qId}>
                    Q{qIndex + 1}: <span className="text-[#749B44] font-bold">{answer}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="pt-2">
          <div className="text-gray-600 mb-1">Flagged Questions:</div>
          <div className="bg-gray-50 p-2 rounded text-[10px]">
            {flaggedCount === 0 ? (
              <span className="text-gray-400">None</span>
            ) : (
              flags.map((qId) => {
                const qIndex = questions.findIndex((q) => q.id === qId);
                return (
                  <span key={qId} className="inline-block mr-1 text-orange-600 font-bold">
                    Q{qIndex + 1}
                  </span>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-gray-300 text-[10px] text-gray-500 text-center">
        Press F12 → Console for logs
      </div>
    </div>
  );
}
