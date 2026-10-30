import React, { useState } from 'react';
import { Sparkles, HelpCircle, Check, ChevronDown, ChevronUp, BookOpen, Layers } from 'lucide-react';
import { SyntaxCategory, SyntaxStats } from '../utils/syntaxHighlight';

interface SimuladorSintaxeBarProps {
  ativo: boolean;
  onToggleAtivo: () => void;
  stats: SyntaxStats;
  activeCategories: Record<SyntaxCategory, boolean>;
  onToggleCategory: (cat: SyntaxCategory) => void;
  onInserirTermo?: (termo: string) => void;
  tooltipsAtivos?: boolean;
  onToggleTooltips?: () => void;
}

export const SimuladorSintaxeBar: React.FC<SimuladorSintaxeBarProps> = ({
  ativo,
  onToggleAtivo,
  stats,
  activeCategories,
  onToggleCategory,
  onInserirTermo,
  tooltipsAtivos = true,
  onToggleTooltips
}) => {
  const [guiaExpandido, setGuiaExpandido] = useState(false);

  return (
    <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800/90 text-zinc-900 dark:text-zinc-100 p-3 shadow-sm transition-all space-y-2.5">
      {/* Top Header of Syntax Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onToggleAtivo}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95 ${
              ativo
                ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-sky-500/20 ring-2 ring-sky-400/40'
                : 'border border-black/10 dark:border-[#56677d] bg-slate-100 dark:bg-zinc-700 text-zinc-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-zinc-600'
            }`}
            title="Ativar ou desativar o destaque visual de termos jurídicos no simulador"
          >
            <Sparkles className={`h-3.5 w-3.5 ${ativo ? 'text-amber-200 animate-spin' : 'text-slate-400'}`} />
            <span>{ativo ? 'Destaque de Sintaxe: Ativado' : 'Destaque de Sintaxe: Inativo'}</span>
          </button>

          {ativo && onToggleTooltips && (
            <button
              onClick={onToggleTooltips}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95 ${
                tooltipsAtivos
                  ? 'bg-emerald-600 text-white border border-emerald-400 shadow-emerald-600/20'
                  : 'border border-black/10 dark:border-[#56677d] bg-slate-100 dark:bg-zinc-900 text-zinc-600 dark:text-slate-400 hover:text-zinc-900 dark:hover:text-slate-200'
              }`}
              title="Ativar ou desativar as janelas flutuantes com definições e fundamentações jurídicas ao passar o mouse"
            >
              <span>💡 Tooltips Jurídicos: {tooltipsAtivos ? 'Ativados' : 'Desativados'}</span>
            </button>
          )}

          {ativo && (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-zinc-700 dark:text-slate-300 bg-slate-100 dark:bg-zinc-900 px-2.5 py-1 rounded-full border border-black/10 dark:border-slate-700">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              {stats.total} {stats.total === 1 ? 'termo jurídico identificado' : 'termos jurídicos identificados'}
            </span>
          )}
        </div>

        {/* Guia de Critérios FGV */}
        <button
          onClick={() => setGuiaExpandido(!guiaExpandido)}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition cursor-pointer"
        >
          <HelpCircle className="h-3.5 w-3.5" />
          <span>Critérios de Pontuação FGV</span>
          {guiaExpandido ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Categorias Interativas (Chips com Contador) */}
      {ativo && (
        <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-black/10 dark:border-zinc-700">
          <span className="text-[11px] font-semibold text-zinc-500 dark:text-slate-400">Filtrar camadas:</span>

          {/* 1. Peças */}
          <button
            onClick={() => onToggleCategory('peca')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer ${
              activeCategories.peca
                ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/50 shadow-sm'
                : 'bg-slate-100 dark:bg-zinc-900 text-zinc-600 dark:text-slate-400 border border-black/10 dark:border-slate-700 opacity-70'
            }`}
            title="Peças Práticas (Mandado de Segurança, Apelação, etc.)"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Peças Práticas</span>
            <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.2 font-mono text-[10px] text-emerald-800 dark:text-emerald-200">
              {stats.peca}
            </span>
          </button>

          {/* 2. Artigos & Súmulas */}
          <button
            onClick={() => onToggleCategory('artigo')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer ${
              activeCategories.artigo
                ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/50 shadow-sm'
                : 'bg-slate-100 dark:bg-zinc-900 text-zinc-600 dark:text-slate-400 border border-black/10 dark:border-slate-700 opacity-70'
            }`}
            title="Artigos e Súmulas (Art. 151, CTN, CF/88, SV, STJ)"
          >
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span>Artigos & Súmulas</span>
            <span className="rounded-full bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.2 font-mono text-[10px] text-amber-800 dark:text-amber-200">
              {stats.artigo}
            </span>
          </button>

          {/* 3. Tributos */}
          <button
            onClick={() => onToggleCategory('tributo')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer ${
              activeCategories.tributo
                ? 'bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-500/50 shadow-sm'
                : 'bg-slate-100 dark:bg-zinc-900 text-zinc-600 dark:text-slate-400 border border-black/10 dark:border-slate-700 opacity-70'
            }`}
            title="Tributos e Reforma 2026 (ICMS, IPTU, IBS, CBS)"
          >
            <span className="h-2 w-2 rounded-full bg-sky-500" />
            <span>Tributos & Reforma</span>
            <span className="rounded-full bg-sky-100 dark:bg-sky-950/60 px-1.5 py-0.2 font-mono text-[10px] text-sky-800 dark:text-sky-200">
              {stats.tributo}
            </span>
          </button>

          {/* 4. Requisitos & Teses */}
          <button
            onClick={() => onToggleCategory('tese')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer ${
              activeCategories.tese
                ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/50 shadow-sm'
                : 'bg-slate-100 dark:bg-zinc-900 text-zinc-600 dark:text-slate-400 border border-black/10 dark:border-slate-700 opacity-70'
            }`}
            title="Requisitos e Teses FGV (Liminar, Fumaça do bom direito, Prescrição, etc.)"
          >
            <span className="h-2 w-2 rounded-full bg-purple-500" />
            <span>Requisitos & Teses FGV</span>
            <span className="rounded-full bg-purple-100 dark:bg-purple-950/60 px-1.5 py-0.2 font-mono text-[10px] text-purple-800 dark:text-purple-200">
              {stats.tese}
            </span>
          </button>
        </div>
      )}

      {/* Guia Expandido com Dicas para o Espelho de Correção da FGV */}
      {guiaExpandido && (
        <div className="rounded-xl border border-sky-500/30 bg-slate-50 dark:bg-zinc-900 p-3 text-xs text-zinc-800 dark:text-slate-200 space-y-2 mt-2">
          <div className="flex items-center gap-1.5 font-bold text-sky-600 dark:text-sky-300">
            <BookOpen className="h-4 w-4" />
            <span>Por que o Destaque de Sintaxe garante nota máxima no Espelho FGV?</span>
          </div>
          <p className="text-[11px] leading-relaxed text-zinc-600 dark:text-slate-300">
            A banca examinadora FGV corrige peças profissionais por <strong>itens fechados no espelho de notas</strong> (0 a 5,00 pontos). Não basta redigir o raciocínio: é imprescindível citar expressamente a peça correta, os artigos específicos da fundamentação e a denominação exata do tributo.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1 text-[11px]">
            <div className="p-2 rounded bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30">
              <span className="font-bold text-emerald-700 dark:text-emerald-300 block mb-1">🟢 Peça Oficial (0,50 pt)</span>
              Ex: Mandado de Segurança, Apelação, Embargos à Execução Fiscal.
            </div>
            <div className="p-2 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-500/30">
              <span className="font-bold text-amber-700 dark:text-amber-300 block mb-1">🟡 Artigos (até 2,50 pts)</span>
              Ex: Art. 151, II do CTN, Art. 5º, LXIX da CF/88, Art. 300 do CPC.
            </div>
            <div className="p-2 rounded bg-sky-50 dark:bg-sky-950/30 border border-sky-500/30">
              <span className="font-bold text-sky-700 dark:text-sky-300 block mb-1">🔵 Tributo & Competência</span>
              Ex: ICMS, ITBI, IPTU, IPVA, IRPF, IBS, CBS.
            </div>
            <div className="p-2 rounded bg-purple-50 dark:bg-purple-950/30 border border-purple-500/30">
              <span className="font-bold text-purple-700 dark:text-purple-300 block mb-1">🟣 Requisitos & Liminar</span>
              Ex: Fumaça do bom direito, perigo da demora, tempestividade.
            </div>
          </div>

          {onInserirTermo && (
            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-black/10 dark:border-slate-700">
              <span className="text-[11px] font-semibold text-zinc-500 dark:text-slate-400">Inserir atalho na redação:</span>
              {[
                'Art. 151, II do CTN',
                'Art. 5º, LXIX da CF/88',
                'fumaça do bom direito e perigo da demora',
                'Mandado de Segurança',
                'ICMS'
              ].map(ex => (
                <button
                  key={ex}
                  onClick={() => onInserirTermo(ex)}
                  className="rounded bg-slate-100 dark:bg-zinc-800 border border-black/10 dark:border-white/10 hover:bg-sky-600 hover:text-white px-2 py-0.5 text-[10px] font-mono text-sky-700 dark:text-sky-200 transition cursor-pointer"
                >
                  + {ex}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
