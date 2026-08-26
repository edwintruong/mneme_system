import React from 'react';
import { Check, Loader2 } from 'lucide-react';

interface FigmaAnalysisStatusProps {
  done: boolean;
  inProgress: boolean;
  size?: number;
  className?: string;
}

export const FigmaAnalysisStatus: React.FC<FigmaAnalysisStatusProps> = ({
  done,
  inProgress,
  size = 22,
  className = '',
}) => {
  if (done) {
    return (
      <div
        style={{ width: `${size}px`, height: `${size}px` }}
        className={`rounded-full bg-[#31CF37] flex items-center justify-center text-white flex-shrink-0 transition-transform scale-100 ${className}`}
      >
        <Check size={size * 0.65} strokeWidth={3} />
      </div>
    );
  }

  if (inProgress) {
    return (
      <div
        style={{ width: `${size}px`, height: `${size}px` }}
        className={`rounded-full bg-[#F1EEFC] border-2 border-[#7758E2] flex items-center justify-center text-[#7758E2] flex-shrink-0 ${className}`}
      >
        <Loader2 size={size * 0.65} className="animate-spin" strokeWidth={2.5} />
      </div>
    );
  }

  return (
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`rounded-full border-2 border-[#D1D1D6] bg-transparent flex-shrink-0 ${className}`}
    />
  );
};
