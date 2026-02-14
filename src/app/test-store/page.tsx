'use client';

import { useExamStore } from '@/store/useExamStore';
import { useEffect } from 'react';
import type { Question, OptionType } from '@/types';

const mockQuestions: Question[] = [
  {
    id: 'q1',
    exam_id: 'exam1',
    question_text: 'What is the capital of France?',
    option_a: 'London',
    option_b: 'Paris',
    option_c: 'Berlin',
    correct_option: 'B',
    order_num: 1,
  },
  {
    id: 'q2',
    exam_id: 'exam1',
    question_text: 'What is 2 + 2?',
    option_a: '3',
    option_b: '4',
    option_c: '5',
    correct_option: 'B',
    order_num: 2,
  },
  {
    id: 'q3',
    exam_id: 'exam1',
    question_text: 'Which is a programming language?',
    option_a: 'HTML',
    option_b: 'CSS',
    option_c: 'JavaScript',
    correct_option: 'C',
    order_num: 3,
  },
];

export default function StoreTestPage() {
  const {
    questions,
    currentQuestionIndex,
    answers,
    flags,
    strikethroughs,
    timeLeftSeconds,
    initExam,
    setAnswer,
    toggleFlag,
    toggleStrikethrough,
    navigateQuestion,
    tickTimer,
    resetStore,
  } = useExamStore();

  useEffect(() => {
    // Auto tick timer every second for demo
    if (timeLeftSeconds > 0) {
      const timer = setInterval(tickTimer, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeftSeconds, tickTimer]);

  const currentQuestion = questions[currentQuestionIndex];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-prometric-bg p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-prometric-xl font-bold text-prometric-navy mb-6">
          🧪 Zustand Store Test - Task 2 Nghiệm Thu
        </h1>

        {/* Control Panel */}
        <div className="bg-white border-2 border-prometric-navy rounded p-6 mb-6">
          <h2 className="text-prometric-lg font-bold mb-4">Control Panel</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => initExam('test-exam', mockQuestions, 5)}
              className="px-4 py-2 bg-prometric-navy text-white rounded hover:bg-prometric-navy-dark"
            >
              1. Init Exam (5 min, 3 questions)
            </button>
            <button
              onClick={() => setAnswer('q1', 'A')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              2. Set Answer Q1 = A
            </button>
            <button
              onClick={() => setAnswer('q2', 'B')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Set Answer Q2 = B
            </button>
            <button
              onClick={() => toggleFlag('q1')}
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
            >
              3. Toggle Flag Q1
            </button>
            <button
              onClick={() => toggleStrikethrough('q1', 'A')}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
            >
              4. Toggle Strike Q1 Option A
            </button>
            <button
              onClick={() => toggleStrikethrough('q1', 'C')}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
            >
              Toggle Strike Q1 Option C
            </button>
            <button
              onClick={() => navigateQuestion(1)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Navigate to Q2
            </button>
            <button
              onClick={resetStore}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              🗑️ Reset Store
            </button>
          </div>
        </div>

        {/* State Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Left Panel */}
          <div className="bg-prometric-bg-alt border border-prometric-border rounded p-4">
            <h3 className="font-bold text-prometric-navy mb-3">📊 Current State</h3>
            <div className="space-y-2 text-prometric-sm font-mono">
              <div>
                <strong>Questions:</strong> {questions.length} loaded
              </div>
              <div>
                <strong>Current Index:</strong> {currentQuestionIndex}
              </div>
              <div>
                <strong>Time Left:</strong>{' '}
                <span className={timeLeftSeconds < 60 ? 'text-red-600 font-bold' : ''}>
                  {formatTime(timeLeftSeconds)}
                </span>
              </div>
              <div>
                <strong>Answers:</strong> {Object.keys(answers).length} answered
              </div>
              <div>
                <strong>Flags:</strong> {flags.length} flagged
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="bg-prometric-bg-alt border border-prometric-border rounded p-4">
            <h3 className="font-bold text-prometric-navy mb-3">🔍 Detailed Data</h3>
            <div className="space-y-2 text-prometric-sm">
              <div>
                <strong>Answers Object:</strong>
                <pre className="bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                  {JSON.stringify(answers, null, 2)}
                </pre>
              </div>
              <div>
                <strong>Flags Array:</strong>
                <pre className="bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                  {JSON.stringify(flags, null, 2)}
                </pre>
              </div>
              <div>
                <strong>Strikethroughs:</strong>
                <pre className="bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                  {JSON.stringify(strikethroughs, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Current Question Display */}
        {currentQuestion && (
          <div className="bg-white border-2 border-prometric-border rounded p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-prometric-lg">
                Question {currentQuestionIndex + 1} of {questions.length}
              </h3>
              {flags.includes(currentQuestion.id) && (
                <span className="px-3 py-1 bg-prometric-flagged border border-prometric-border rounded text-prometric-sm">
                  🚩 Flagged
                </span>
              )}
            </div>
            <p className="text-prometric-base mb-4 question-content">
              {currentQuestion.question_text}
            </p>
            <div className="space-y-2">
              {(['A', 'B', 'C'] as OptionType[]).map((option) => {
                const optionKey = `option_${option.toLowerCase()}` as keyof Question;
                const optionText = currentQuestion[optionKey] as string;
                const isSelected = answers[currentQuestion.id] === option;
                const isStrikethrough =
                  strikethroughs[currentQuestion.id]?.includes(option);

                return (
                  <div
                    key={option}
                    className={`p-3 border rounded cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-prometric-navy bg-prometric-selected'
                        : 'border-prometric-border hover:bg-gray-50'
                    }`}
                    onClick={() => setAnswer(currentQuestion.id, option)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      toggleStrikethrough(currentQuestion.id, option);
                    }}
                  >
                    <span
                      className={`text-prometric-base ${
                        isStrikethrough ? 'option-strikethrough' : ''
                      }`}
                    >
                      {option}. {optionText}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* F5 Test Instructions */}
        <div className="mt-6 bg-prometric-yellow border-2 border-orange-400 rounded p-4">
          <h3 className="font-bold text-prometric-base mb-2">
            ✅ TEST PERSISTENCE (F5 Reload)
          </h3>
          <ol className="text-prometric-sm space-y-1 ml-4 list-decimal">
            <li>Click "Init Exam" button</li>
            <li>Click "Set Answer Q1 = A" button</li>
            <li>Click "Toggle Flag Q1" button</li>
            <li>Click "Toggle Strike Q1 Option A" button</li>
            <li>
              <strong>Press F5 to reload page</strong>
            </li>
            <li>
              ✅ Check if answers still shows {`{ "q1": "A" }`}, flags shows ["q1"], and
              strikethroughs shows {`{ "q1": ["A"] }`}
            </li>
            <li>If data persists → sessionStorage persistence works! 🎉</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
