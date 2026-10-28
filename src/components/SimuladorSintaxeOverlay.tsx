import React, { useMemo } from 'react';
import { parseLegalSyntax, SyntaxCategory, SyntaxStats } from '../utils/syntaxHighlight';

interface SimuladorSintaxeOverlayProps {
  text: string;
  activeCategories: Record<SyntaxCategory, boolean>;
  overlayRef?: React.RefObject<HTMLDivElement | null>;
  onStatsChange?: (stats: SyntaxStats) => void;
}

export const SimuladorSintaxeOverlay: React.FC<SimuladorSintaxeOverlayProps> = ({
  text,
  activeCategories,
  overlayRef
}) => {
  const { segments } = useMemo(() => {
    return parseLegalSyntax(text, { activeCategories });
  }, [text, activeCategories]);

  return (
    <div
      ref={overlayRef}
      className="fgv-syntax-overlay"
      aria-hidden="true"
    >
      {segments.map((seg, idx) => {
        if (seg.type === 'match' && seg.category) {
          return (
            <mark
              key={idx}
              className={`syntax-mark syntax-mark-${seg.category}`}
            >
              {seg.text}
            </mark>
          );
        }
        return <React.Fragment key={idx}>{seg.text}</React.Fragment>;
      })}
    </div>
  );
};
