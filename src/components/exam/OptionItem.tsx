'use client';

import type { OptionType } from '@/types';

interface OptionItemProps {
  questionId: string;
  optionKey: OptionType;
  optionText: string;
  isSelected: boolean;
  isStrikethrough: boolean;
  onSelect: (questionId: string, option: OptionType) => void;
  onToggleStrikethrough: (questionId: string, option: OptionType) => void;
}

export default function OptionItem({
  questionId,
  optionKey,
  optionText,
  isSelected,
  isStrikethrough,
  onSelect,
  onToggleStrikethrough,
}: OptionItemProps) {
  const handleClick = () => {
    onSelect(questionId, optionKey);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onToggleStrikethrough(questionId, optionKey);
  };

  return (
    <div
      className="flex items-stretch w-full cursor-pointer hover:bg-gray-50"
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      <div className="w-[40px] flex items-center justify-center text-[#4D4C4D] font-bold text-[16px]">
        {optionKey}
      </div>
      <div
        className={`flex-1 border-2 p-3 text-[14px] transition-colors ${
          isSelected
            ? 'border-[#749B44] bg-[#E8F4D9] text-[#4D4C4D]'
            : 'border-[#4D4C4D] bg-white text-[#4D4C4D]'
        } ${isStrikethrough ? 'line-through opacity-50' : ''}`}
      >
        {optionText}
      </div>
    </div>
  );
}
