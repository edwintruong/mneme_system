import React from 'react';
import { FigmaIcon } from './FigmaIcon';

interface FigmaBackButtonProps {
  onClick?: () => void;
  color?: string;
  className?: string;
}

export const FigmaBackButton: React.FC<FigmaBackButtonProps> = ({
  onClick,
  color,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Quay lại"
      className={`p-2 -ml-2 rounded-full hover:bg-black/5 active:scale-95 transition-all text-[#0E0727] ${className}`}
    >
      <FigmaIcon name="back" size={24} color={color} />
    </button>
  );
};
