import React, { useState } from 'react';
import { LegalTooltipInfo } from '../utils/legalGlossary';
import { BookOpen, Copy, Check, ExternalLink, Lightbulb, Scale, X, Sparkles, PlusCircle } from 'lucide-react';

interface TooltipJuridicoProps {
  info: LegalTooltipInfo;
  position: { top: number; left: number };
  onClose: () => void;
  onNavegarParaAba?: (aba: string) => void;
  onInserirFundamentacao?: (texto: string) => void;
}

export const TooltipJuridico: React.FC<TooltipJuridicoProps> = ({
  info,
  position,
  onClose,
  onNavegarParaAba,
  onInserirFundamentacao
}) => {
  const [copiado, setCopiado] = useState(false);

  const handleCopiar = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textoParaCopiar = `${info.titulo}\nFundamentação: ${info.fundamentoLegal}\nConceito: ${info.conceito}`;
    navigator.clipboard.writeText(textoParaCopiar);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleInserir = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onInserirFundamentacao) {
      const trecho = ` (${info.fundamentoLegal})`;
      onInserirFundamentacao(trecho);
    }
  };

  const handleNavegar = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (info.linkAba && onNavegarParaAba) {
      onNavegarParaAba(info.linkAba);
      onClose();
    }
  };

  // Ícone por categoria
  const getCategoryIcon = () => {
    switch (info.categoria) {
      case 'peca': return <Scale className="w-3.5 h-3.5 text-emerald-400" />;
      case 'artigo': return <BookOpen className="w-3.5 h-3.5 text-amber-400" />;
      case 'tributo': return <Sparkles className="w-3.5 h-3.5 text-sky-400" />;
      case 'tese': return <Lightbulb className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  return (
    <div
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`
      }}
      className="fixed z-50 w-80 sm:w-96 max-w-[calc(100vw-32px)] rounded-xl border border-slate-600 bg-[#1e293b]/95 backdrop-blur-md shadow-2xl p-4 text-slate-100 transition-all duration-150 animate-in fade-in zoom-in-95"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header com Categoria e Botão Fechar */}
      <div className="flex items-start justify-between gap-2 pb-2 mb-2 border-b border-slate-700">
        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${info.badgeCor}`}>
            {getCategoryIcon()}
            <span>{info.categoriaLabel}</span>
          </span>
          <span className="text-[11px] text-slate-400 font-mono truncate max-w-[150px]">
            "{info.termo}"
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-0.5 rounded hover:bg-slate-700/60 transition cursor-pointer"
          title="Fechar tooltip"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Título Principal */}
      <h4 className="text-xs font-bold text-white mb-1.5 leading-snug">
        {info.titulo}
      </h4>

      {/* Conceito Jurídico Resumido */}
      <p className="text-[11.5px] leading-relaxed text-slate-300 mb-2.5">
        {info.conceito}
      </p>

      {/* Fundamentação Legal com Destaque */}
      <div className="rounded-lg bg-slate-900/70 border border-slate-700/70 p-2 mb-2.5 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
            Base Legal & Súmula
          </span>
          <span className="text-xs font-semibold text-amber-300 font-mono break-words leading-tight">
            {info.fundamentoLegal}
          </span>
        </div>
        <button
          onClick={handleCopiar}
          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition shrink-0 cursor-pointer"
          title="Copiar fundamentação para a área de transferência"
        >
          {copiado ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Dica FGV OAB */}
      {info.dicaOAB && (
        <div className="rounded-lg bg-amber-950/25 border border-amber-500/30 p-2 mb-3 text-[11px] text-amber-200/90 leading-relaxed flex items-start gap-1.5">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-300 font-semibold block text-[10px] uppercase tracking-wide">
              Dica de Ouro OAB / FGV
            </strong>
            <span>{info.dicaOAB}</span>
          </div>
        </div>
      )}

      {/* Barra de Ações Rápidas */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-700/70 flex-wrap">
        {onInserirFundamentacao && (
          <button
            onClick={handleInserir}
            className="rounded-lg bg-sky-600/30 hover:bg-sky-600/50 border border-sky-500/40 px-2 py-1 text-[11px] font-medium text-sky-200 hover:text-white transition inline-flex items-center gap-1 cursor-pointer"
            title="Inserir dispositivo legal diretamente na redação"
          >
            <PlusCircle className="w-3 h-3 text-sky-400" />
            <span>Inserir na Peça</span>
          </button>
        )}

        {info.linkAba && onNavegarParaAba && (
          <button
            onClick={handleNavegar}
            className="rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 px-2.5 py-1 text-[11px] font-semibold text-slate-200 hover:text-white transition inline-flex items-center gap-1 ml-auto cursor-pointer"
            title={info.abaLabel || 'Ver na aba correspondente'}
          >
            <span>{info.abaLabel || 'Estudar no Módulo'}</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </button>
        )}
      </div>
    </div>
  );
};
