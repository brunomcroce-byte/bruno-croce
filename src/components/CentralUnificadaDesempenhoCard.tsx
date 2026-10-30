import React, { useState } from 'react';
import {
  BarChart3,
  FileText,
  Clock,
  Sparkles,
  Award,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Download,
  Headphones,
  Play,
  RotateCcw,
  Zap
} from 'lucide-react';
import { ResultadoAnalisePeca } from '../utils/pecaAnalyzer';
import { SoundscapeTipo, SOUNDSCAPE_OPCOES } from '../utils/soundscapes';

interface CentralUnificadaDesempenhoCardProps {
  totalLinhasSemana: number;
  linhasCount: number;
  pomodoroBlocosHoje: number;
  pomodoroModo: '25m' | '50m';
  pomodoroRunning: boolean;
  soundscapeTipo: SoundscapeTipo;
  taxaAcertoEstimada: number;
  flashStats: { acertos: number; total: number };
  tarefasConcluidas: (number | string)[];
  totalTarefas: number;
  analisePecaAtual: ResultadoAnalisePeca;
  diasProva: number;
  onNavegarParaTab: (tab: any) => void;
  onAdicionarLinhas: (qtd: number) => void;
  onTogglePomodoro: () => void;
  onAjustarBlocos: (delta: number) => void;
  onExportarPdf: () => void;
  onExportarWord: () => void;
}

export const CentralUnificadaDesempenhoCard: React.FC<CentralUnificadaDesempenhoCardProps> = ({
  totalLinhasSemana,
  linhasCount,
  pomodoroBlocosHoje,
  pomodoroModo,
  pomodoroRunning,
  soundscapeTipo,
  taxaAcertoEstimada,
  flashStats,
  tarefasConcluidas,
  totalTarefas,
  analisePecaAtual,
  diasProva,
  onNavegarParaTab,
  onAdicionarLinhas,
  onTogglePomodoro,
  onAjustarBlocos,
  onExportarPdf,
  onExportarWord
}) => {
  const [subAba, setSubAba] = useState<'geral' | 'redacao' | 'pomodoro' | 'flashcards' | 'radar'>('geral');

  // Cálculo do Índice Geral de Prontidão (0 a 100%)
  const scoreLinhas = Math.min(100, (totalLinhasSemana / 150) * 100);
  const scoreFoco = Math.min(100, (pomodoroBlocosHoje / 4) * 100);
  const scoreRetencao = Math.min(100, taxaAcertoEstimada);
  const scoreCronograma = totalTarefas > 0 ? Math.min(100, (tarefasConcluidas.length / totalTarefas) * 100) : 50;
  
  const indiceProntidao = Math.round(
    scoreLinhas * 0.35 + scoreRetencao * 0.25 + scoreFoco * 0.2 + scoreCronograma * 0.2
  );

  const pecaNome = analisePecaAtual.pecaMaisProvavel?.nome || 'Mandado de Segurança';
  const pecaProb = analisePecaAtual.pecaMaisProvavel?.probabilidade || 88;

  return (
    <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 shadow-sm transition-all overflow-hidden">
      {/* 1. TOPO DA CENTRAL: TÍTULO, ÍNDICE DE PRONTIDÃO & CONTAGEM REGRESSIVA */}
      <div className="p-5 lg:p-6 border-b border-black/5 dark:border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-blue-500/[0.04] via-transparent to-indigo-500/[0.04]">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 font-mono">
              Central Unificada de Desempenho
            </span>
            <span className="text-[10.5px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-semibold">
              Índice de Prontidão: {indiceProntidao}%
            </span>
            <span className="text-[10.5px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20">
              Prova: {diasProva >= 0 ? `Faltam ${diasProva} dias` : 'Hoje'}
            </span>
          </div>

          <h2 className="text-lg lg:text-xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Visão Consolidada de Estudos & Simulações</span>
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Métricas integradas de redação (150L), disciplina Pomodoro diária, retenção nos flashcards e radar FGV.
          </p>
        </div>

        {/* Ações Rápidas Integradas */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            onClick={() => onNavegarParaTab('simulador')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition cursor-pointer active:scale-95"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Simulador 150L</span>
          </button>
          <button
            onClick={onExportarPdf}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-zinc-800 dark:text-zinc-200 text-xs font-medium transition cursor-pointer"
            title="Exportar Relatório PDF"
          >
            <Download className="h-3.5 w-3.5 text-blue-500" />
            <span>Relatório PDF</span>
          </button>
        </div>
      </div>

      {/* 2. BARRA DE SUB-ABAS LIMPA & MODERNA */}
      <div className="px-5 pt-3 border-b border-black/5 dark:border-white/10 flex items-center gap-1 overflow-x-auto bg-black/[0.01] dark:bg-white/[0.01]">
        {[
          { id: 'geral', label: 'Visão Geral Consolidada', icon: BarChart3 },
          { id: 'redacao', label: '1. Redação 150L & Peça', icon: FileText, badge: `${totalLinhasSemana}/150L` },
          { id: 'pomodoro', label: '2. Foco Pomodoro', icon: Clock, badge: `${pomodoroBlocosHoje}/4🍅` },
          { id: 'flashcards', label: '3. Flashcards', icon: Sparkles, badge: `${taxaAcertoEstimada}%` },
          { id: 'radar', label: '4. Radar Histórico FGV', icon: Award }
        ].map((tab) => {
          const Icon = tab.icon;
          const isAtivo = subAba === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubAba(tab.id as any)}
              className={`px-3 py-2 text-xs font-semibold border-b-2 transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                isAtivo
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                  : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/5 dark:bg-white/10">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. CONTEÚDO UNIFICADO */}
      <div className="p-5 lg:p-6">
        {/* ABA 1: VISÃO GERAL CONSOLIDADA (PADRÃO) */}
        {subAba === 'geral' && (
          <div className="space-y-6">
            {/* 4 Blocos de Métricas Sintéticos Lado a Lado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Item 1: Simulador */}
              <div
                onClick={() => setSubAba('redacao')}
                className="p-3.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-zinc-900/60 hover:border-blue-500/40 transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                    <span className="font-semibold flex items-center gap-1 text-blue-600 dark:text-blue-400">
                      <FileText className="h-3.5 w-3.5" /> Redação 150L
                    </span>
                    <span className="font-mono text-[10px]">{Math.round((totalLinhasSemana / 150) * 100)}%</span>
                  </div>
                  <div className="flex items-baseline gap-1 my-1">
                    <span className="font-mono text-2xl font-bold text-zinc-900 dark:text-white">
                      {totalLinhasSemana}
                    </span>
                    <span className="text-xs text-zinc-500">/ 150 linhas</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/5 dark:bg-white/10 rounded-full overflow-hidden my-1">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${Math.min(100, (totalLinhasSemana / 150) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2 truncate">
                  Peça: <strong className="text-blue-600 dark:text-blue-400">{pecaNome}</strong>
                </div>
              </div>

              {/* Item 2: Pomodoro */}
              <div
                onClick={() => setSubAba('pomodoro')}
                className="p-3.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-zinc-900/60 hover:border-rose-500/40 transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                    <span className="font-semibold flex items-center gap-1 text-rose-600 dark:text-rose-400">
                      <Clock className="h-3.5 w-3.5" /> Foco Diário
                    </span>
                    <span className="font-mono text-[10px]">{Math.min(100, Math.round((pomodoroBlocosHoje / 4) * 100))}%</span>
                  </div>
                  <div className="flex items-baseline gap-1 my-1">
                    <span className="font-mono text-2xl font-bold text-zinc-900 dark:text-white">
                      {pomodoroBlocosHoje}
                    </span>
                    <span className="text-xs text-zinc-500">/ 4 blocos</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 my-1">
                    {[0, 1, 2, 3].map((idx) => (
                      <div
                        key={idx}
                        className={`h-1.5 rounded-full ${
                          pomodoroBlocosHoje > idx ? 'bg-rose-500' : 'bg-black/5 dark:bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2 truncate flex items-center gap-1">
                  <Headphones className="h-3 w-3 text-rose-500 shrink-0" />
                  <span>Som: <strong className="text-rose-600 dark:text-rose-400">{SOUNDSCAPE_OPCOES.find(o => o.id === soundscapeTipo)?.nome || 'Silencioso'}</strong></span>
                </div>
              </div>

              {/* Item 3: Flashcards */}
              <div
                onClick={() => setSubAba('flashcards')}
                className="p-3.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-zinc-900/60 hover:border-emerald-500/40 transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                    <span className="font-semibold flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <Sparkles className="h-3.5 w-3.5" /> Retenção
                    </span>
                    <span className="font-mono text-[10px]">Meta 75%</span>
                  </div>
                  <div className="flex items-baseline gap-1 my-1">
                    <span className="font-mono text-2xl font-bold text-zinc-900 dark:text-white">
                      {taxaAcertoEstimada}%
                    </span>
                    <span className="text-xs text-zinc-500">acertos</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/5 dark:bg-white/10 rounded-full overflow-hidden my-1">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${Math.min(100, taxaAcertoEstimada)}%` }}
                    />
                  </div>
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2 truncate">
                  Total: <strong className="text-emerald-600 dark:text-emerald-400">{flashStats.total} revisões</strong>
                </div>
              </div>

              {/* Item 4: Cronograma & Simulados FGV */}
              <div
                onClick={() => onNavegarParaTab('cronograma')}
                className="p-3.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-zinc-900/60 hover:border-indigo-500/40 transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                    <span className="font-semibold flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                      <Calendar className="h-3.5 w-3.5" /> Simulado Semanal
                    </span>
                    <span className="font-mono text-[10px]">8 Semanas</span>
                  </div>
                  <div className="flex items-baseline gap-1 my-1">
                    <span className="font-mono text-2xl font-bold text-zinc-900 dark:text-white">
                      {tarefasConcluidas.length}
                    </span>
                    <span className="text-xs text-zinc-500">/ {totalTarefas} metas</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/5 dark:bg-white/10 rounded-full overflow-hidden my-1">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${totalTarefas > 0 ? (tarefasConcluidas.length / totalTarefas) * 100 : 30}%` }}
                    />
                  </div>
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2 truncate">
                  32 Provas FGV estruturadas
                </div>
              </div>
            </div>

            {/* Linha Consolidada de Evolução & Radar */}
            <div className="p-4 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.015] dark:bg-zinc-900/40 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span>Diagnóstico Estratégico do Candidato</span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
                  Você concluiu <strong>{totalLinhasSemana} linhas</strong> na folha padrão. O motor heurístico identificou <strong>{pecaNome} ({pecaProb}%)</strong> como peça cabível provável para o caso ativo. Mantenha a meta de 4 blocos pomodoro diários para garantir memorização das teses.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onNavegarParaTab('simulador')}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
                >
                  Abrir Simulador →
                </button>
                <button
                  onClick={() => setSubAba('radar')}
                  className="px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-black/5 transition cursor-pointer"
                >
                  Ver Radar FGV
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ABA 2: DETALHE REDAÇÃO 150L */}
        {subAba === 'redacao' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl border border-blue-500/20 bg-blue-50/40 dark:bg-blue-950/20">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                  Folha Padrão FGV de 150 Linhas (5 Páginas Pautadas)
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                  Redação ativa no editor: <strong>{linhasCount} linhas</strong> • Total acumulado na semana: <strong>{totalLinhasSemana}/150 linhas</strong>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onAdicionarLinhas(30)}
                  className="px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-black/5 transition cursor-pointer shadow-xs"
                >
                  +1 Página (30L)
                </button>
                <button
                  onClick={() => onNavegarParaTab('simulador')}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition cursor-pointer shadow-xs"
                >
                  Ir para a Folha Padrão →
                </button>
              </div>
            </div>

            {/* Card informativo de peça sugerida */}
            <div className="p-4 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-zinc-900/50 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-blue-500" />
                  Sugestão Heurística em Tempo Real: {pecaNome}
                </span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                  {pecaProb}% de Confiança
                </span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {analisePecaAtual.pecaMaisProvavel?.justificativaCabimento || 'Análise calculada com base nos fatos do enunciado e teses tributárias cadastradas.'}
              </p>
            </div>
          </div>
        )}

        {/* ABA 3: DETALHE FOCO POMODORO */}
        {subAba === 'pomodoro' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl border border-rose-500/20 bg-rose-50/40 dark:bg-rose-950/20">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                  Sessões de Foco Pomodoro & Soundscape
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                  Modo ativo: <strong>{pomodoroModo === '25m' ? '25m Clássico' : '50m Padrão'}</strong> • Soundscape: <strong>{SOUNDSCAPE_OPCOES.find(o => o.id === soundscapeTipo)?.nome}</strong>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onTogglePomodoro}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Play className="h-3 w-3 fill-current" />
                  <span>{pomodoroRunning ? 'Pausar Pomodoro' : 'Iniciar Pomodoro'}</span>
                </button>
                <button
                  onClick={() => onAjustarBlocos(1)}
                  className="px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-black/5 transition cursor-pointer shadow-xs"
                >
                  +1 Bloco
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-zinc-900/50">
                <div className="font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                  Metas Diárias de Foco
                </div>
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-[11.5px]">
                  Recomenda-se 4 blocos diários de foco intenso para a 2ª Fase OAB. O contador zera automaticamente à meia-noite (00:00).
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-zinc-900/50">
                <div className="font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                  Soundscapes Web Audio API
                </div>
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-[11.5px]">
                  Ruído branco sintético, chuva binaural ou frequências lo-fi integradas para manter a imersão na redação jurídica sem distrações externas.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ABA 4: DETALHE FLASHCARDS */}
        {subAba === 'flashcards' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl border border-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-950/20">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                  Retenção com 36 Flashcards Estratégicos
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                  Taxa de acertos: <strong>{taxaAcertoEstimada}%</strong> ({flashStats.acertos}/{flashStats.total} revisões)
                </p>
              </div>
              <button
                onClick={() => onNavegarParaTab('flashcards')}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition cursor-pointer shadow-xs"
              >
                Praticar Flashcards Agora →
              </button>
            </div>
          </div>
        )}

        {/* ABA 5: DETALHE RADAR HISTÓRICO FGV */}
        {subAba === 'radar' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
              <span>Incidência oficial das peças nos 32 exames unificados da OAB:</span>
              <button
                onClick={() => onNavegarParaTab('pecas')}
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Ver Catálogo de Peças Completo →
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {[
                { nome: 'Mandado de Segurança', freq: '10x', pct: '31%', cor: 'border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300' },
                { nome: 'Recurso de Apelação', freq: '9x', pct: '28%', cor: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' },
                { nome: 'Agravo de Instrumento', freq: '7x', pct: '22%', cor: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300' },
                { nome: 'Ação Anulatória', freq: '7x', pct: '22%', cor: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300' },
                { nome: 'Repetição de Indébito', freq: '6x', pct: '19%', cor: 'border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300' },
                { nome: 'Embargos à Execução', freq: '4x', pct: '13%', cor: 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300' }
              ].map(p => (
                <div
                  key={p.nome}
                  className={`p-2.5 rounded-xl border ${p.cor} flex flex-col justify-between cursor-pointer hover:opacity-90 transition`}
                  onClick={() => onNavegarParaTab('pecas')}
                  title={`Clique para estudar ${p.nome}`}
                >
                  <div className="text-[11px] font-bold truncate">{p.nome}</div>
                  <div className="flex items-center justify-between mt-1 text-[10px] font-mono">
                    <span>{p.freq}</span>
                    <span className="opacity-75">{p.pct}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
