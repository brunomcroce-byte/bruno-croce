import React, { useMemo, useRef } from 'react';
import { parseLegalSyntax, SyntaxCategory, SyntaxStats } from '../utils/syntaxHighlight';

interface SimuladorSintaxeOverlayProps {
  text: string;
  activeCategories: Record<SyntaxCategory, boolean>;
  overlayRef?: React.RefObject<HTMLDivElement | null>;
  editorRef?: React.RefObject<HTMLTextAreaElement | null>;
  onStatsChange?: (stats: SyntaxStats) => void;
  onHoverTerm?: (term: string, category: SyntaxCategory, rect: DOMRect) => void;
  onLeaveTerm?: () => void;
  tooltipsHabilitados?: boolean;
}

export const SimuladorSintaxeOverlay: React.FC<SimuladorSintaxeOverlayProps> = ({
  text,
  activeCategories,
  overlayRef,
  editorRef,
  onHoverTerm,
  onLeaveTerm,
  tooltipsHabilitados = true
}) => {
  const { segments } = useMemo(() => {
    return parseLegalSyntax(text, { activeCategories });
  }, [text, activeCategories]);

  const handleMarkMouseEnter = (e: React.MouseEvent<HTMLElement>, termText: string, category: SyntaxCategory) => {
    if (!tooltipsHabilitados || !onHoverTerm) return;
    const rect = e.currentTarget.getBoundingClientRect();
    onHoverTerm(termText, category, rect);
  };

  const handleMarkMouseLeave = () => {
    if (onLeaveTerm) {
      onLeaveTerm();
    }
  };

  const handleMarkMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    // Esconde o tooltip imediatamente ao iniciar clique/edição
    if (onLeaveTerm) {
      onLeaveTerm();
    }

    const mark = e.currentTarget;
    mark.style.pointerEvents = 'none';

    if (editorRef?.current) {
      editorRef.current.focus();
    }

    // Restaura os eventos de ponteiro após o clique
    const handleMouseUp = () => {
      mark.style.pointerEvents = 'auto';
      window.removeEventListener('mouseup', handleMouseUp);
    };
    window.addEventListener('mouseup', handleMouseUp);
    setTimeout(() => {
      mark.style.pointerEvents = 'auto';
    }, 150);
  };

  return (
    <div
      ref={overlayRef}
      className={`fgv-syntax-overlay ${tooltipsHabilitados ? 'fgv-syntax-overlay-interactive' : ''}`}
      aria-hidden="true"
    >
      {segments.map((seg, idx) => {
        if (seg.type === 'match' && seg.category) {
          return (
            <mark
              key={idx}
              className={`syntax-mark syntax-mark-${seg.category} ${tooltipsHabilitados ? 'syntax-mark-hoverable' : ''}`}
              onMouseEnter={(e) => handleMarkMouseEnter(e, seg.text, seg.category!)}
              onMouseLeave={handleMarkMouseLeave}
              onMouseDown={handleMarkMouseDown}
              title={tooltipsHabilitados ? `💡 Ver conceito de "${seg.text}"` : undefined}
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
