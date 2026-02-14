'use client';

import { useExamStore } from '@/store/useExamStore';
import { useRef, useEffect } from 'react';
import OptionItem from './OptionItem';
import type { OptionType } from '@/types';

export default function QuestionArea() {
  const questions = useExamStore((state) => state.questions);
  const currentQuestionIndex = useExamStore((state) => state.currentQuestionIndex);
  const answers = useExamStore((state) => state.answers);
  const strikethroughs = useExamStore((state) => state.strikethroughs);
  const setAnswer = useExamStore((state) => state.setAnswer);
  const toggleStrikethrough = useExamStore((state) => state.toggleStrikethrough);

  const questionContentRef = useRef<HTMLDivElement>(null);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (questionContentRef.current) {
      const content = questionContentRef.current;
      const textContent = currentQuestion?.question_text || '';
      const pTag = content.querySelector('p');
      if (pTag) {
        pTag.textContent = textContent;
      }
    }
  }, [currentQuestionIndex, currentQuestion?.question_text]);

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !questionContentRef.current) {
      return;
    }

    try {
      const range = selection.getRangeAt(0);
      
      if (!questionContentRef.current.contains(range.commonAncestorContainer)) {
        return;
      }

      const selectedText = range.toString().trim();
      if (selectedText.length === 0) {
        return;
      }

      const span = document.createElement('span');
      span.className = 'highlight-text bg-[#F1D176] text-black px-[2px]';
      
      try {
        range.surroundContents(span);
      } catch {
        const contents = range.extractContents();
        span.appendChild(contents);
        range.insertNode(span);
      }

      selection.removeAllRanges();
    } catch (error) {
      console.error('Error highlighting text:', error);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
      }
    }
  };

  if (!currentQuestion) {
    return (
      <div className="flex-1 bg-white border border-[#CCCCCC] p-8 flex items-center justify-center">
        <p className="text-[#4D4C4D] text-[16px]">No question loaded</p>
      </div>
    );
  }

  const options: Array<{ key: OptionType; text: string }> = [
    { key: 'A', text: currentQuestion.option_a },
    { key: 'B', text: currentQuestion.option_b },
    { key: 'C', text: currentQuestion.option_c },
  ];

  const selectedAnswer = answers[currentQuestion.id];
  const questionStrikethroughs = strikethroughs[currentQuestion.id] || [];

  return (
    <div className="flex-1 bg-white border border-[#CCCCCC] p-8 flex flex-col gap-6 overflow-y-auto">
      <div
        ref={questionContentRef}
        className="bg-[#F4F4F4] p-4 text-[#4D4C4D] select-text"
        onMouseUp={handleMouseUp}
      >
        <p className="text-[14px] leading-relaxed whitespace-pre-wrap">
          {currentQuestion.question_text}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {options.map((option) => (
          <OptionItem
            key={option.key}
            questionId={currentQuestion.id}
            optionKey={option.key}
            optionText={option.text}
            isSelected={selectedAnswer === option.key}
            isStrikethrough={questionStrikethroughs.includes(option.key)}
            onSelect={setAnswer}
            onToggleStrikethrough={toggleStrikethrough}
          />
        ))}
      </div>
    </div>
  );
}
