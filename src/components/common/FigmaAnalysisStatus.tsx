import React from 'react';
import { FigmaIcon } from './FigmaIcon';

interface FigmaAnalysisStatusProps {
  done: boolean;
  inProgress: boolean;
  size?: number;
  className?: string;
}

export const FigmaAnalysisStatus: React.FC<FigmaAnalysisStatusProps> = ({
  done,
  inProgress,
  size = 24,
  className = '',
}) => {
  if (done) {
    // Figma ships this state as one filled vector, node 2159:13227.
    return <FigmaIcon name="check-circle" size={size} className={className} />;
  }

  if (inProgress) {
    // Figma has no spinner export; the ring below is the only synthesised mark.
    return (
      <span
        style={{ width: size, height: size }}
        className={`inline-block shrink-0 animate-spin rounded-full border-2 border-[#F1EEFC] border-t-[#7758E2] ${className}`}
      />
    );
  }

  return (
    <span
      style={{ width: size, height: size }}
      className={`inline-block shrink-0 rounded-full border-2 border-[#D1D1D6] ${className}`}
    />
  );
};
