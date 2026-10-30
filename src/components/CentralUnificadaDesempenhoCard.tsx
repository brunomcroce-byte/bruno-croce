import React from 'react';
import {
  FileText,
  Clock,
  Sparkles,
  Download,
  Headphones,
  Play,
  Pause,
  Plus,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  Calendar,
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
  onExportarPdf
}) => {
  // Cálculo ponderado do Índice de Prontidão (0 a 100%)
  const scoreLinhas = Math.min(100, (totalLinhasSemana / 150) * 100);
  const scoreFoco = Math.min(100, (pomodoroBlocosHoje / 4) * 100);
  const scoreRetencao = Math.min(100, taxaAcertoEstimada);
  const scoreCronograma = totalTarefas > 0 ? Math.min(100, (tarefasConcluidas.length / totalTarefas) * 100) : 50;
  
  const indiceProntidao = Math.round(
    scoreLinhas * 0.35 + scoreRetencao * 0.25 + scoreFoco * 0.2 + scoreCronograma * 0.2
  );

  const pecaNome = analisePecaAtual.pecaMaisProvavel?.nome || 'Mandado de Segurança';
  const pecaProb = analisePecaAtual.pecaMaisProvavel?.probabilidade || 88;
  const soundscapeNome = SOUNDSCAPE_OPCOES.find(o => o.id === soundscapeTipo)?.nome || 'Silencioso';

  // Radar sintético com as peças mais frequentes nos 32 exames FGV
  const pecasRadar = [
    { nome: 'Mandado de Segurança', freq: '10x', pct: '31%' },
    { nome: 'Apelação', freq: '9x', pct: '28%' },
    { nome: 'Agravo de Instrumento', freq: '7x', pct: '22%' },
    { nome: 'Ação Anulatória', freq: '7x', pct: '22%' },
    { nome: 'Repetição de Indébito', freq: '6x', pct: '19%' }
  ];

  return (
    <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-800/90 shadow-sm p-5 sm:p-6 space-y-5 transition-all">
      {/* 1. CABEÇALHO UNIFICADO E DIRETO */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">
              Desempenho & Preparação
            </h2>
            <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
              {indiceProntidao}% Prontidão
            </span>
            <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
              • Prova: {diasProva >= 0 ? `${diasProva} dias` : 'Hoje'}
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Métricas integradas de treino prático (150L), disciplina Pomodoro diária e retenção FGV.
          </p>
        </div>

        {/* Ações Primárias Limpas */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavegarParaTab('simulador')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition cursor-pointer active:scale-95"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Simulador 150L</span>
          </button>
          <button
            onClick={onExportarPdf}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.04] hover:bg-black/[0.06] dark:hover:bg-white/[0.08] text-zinc-700 dark:text-zinc-300 text-xs font-medium transition cursor-pointer"
            title="Exportar Relatório PDF"
          >
            <Download className="h-3.5 w-3.5 text-zinc-500" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* 2. GRID DE ESTATÍSTICAS SIMPLIFICADO (4 COLUNAS SEM BORDAS PESADAS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* COLUNA 1: REDAÇÃO 150 LINHAS */}
        <div className="p-4 rounded-xl bg-zinc-50/70 dark:bg-zinc-900/40 hover:bg-zinc-100/70 dark:hover:bg-zinc-900/60 transition flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">
              <span className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                <span>Redação 150L</span>
              </span>
              <span className="font-mono text-[11px] font-medium">{scoreLinhas.toFixed(0)}%</span>
            </div>

            <div className="flex items-baseline gap-1.5 my-1">
              <span className="text-2xl font-bold font-mono text-zinc-900 dark:text-white">
                {totalLinhasSemana}
              </span>
              <span className="text-xs text-zinc-400 font-mono">/ 150 linhas</span>
            </div>

            {/* Barra de Progresso Suave */}
            <div className="h-1.5 w-full bg-black/5 dark:bg-white/10 rounded-full overflow-hidden my-2">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${scoreLinhas}%` }}
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-black/5 dark:border-white/5 text-[11px]">
            <span className="text-zinc-500 dark:text-zinc-400 truncate max-w-[120px]" title={pecaNome}>
              Peça: <strong className="text-zinc-800 dark:text-zinc-200">{pecaNome}</strong>
            </span>
            <button
              onClick={() => onAdicionarLinhas(30)}
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer shrink-0"
              title="Registrar +30 linhas (1 página)"
            >
              +30L
            </button>
          </div>
        </div>

        {/* COLUNA 2: FOCO POMODORO */}
        <div className="p-4 rounded-xl bg-zinc-50/70 dark:bg-zinc-900/40 hover:bg-zinc-100/70 dark:hover:bg-zinc-900/60 transition flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">
              <span className="font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>Pomodoro Diário</span>
              </span>
              <span className="font-mono text-[11px] font-medium">{pomodoroModo}</span>
            </div>

            <div className="flex items-baseline gap-1.5 my-1">
              <span className="text-2xl font-bold font-mono text-zinc-900 dark:text-white">
                {pomodoroBlocosHoje}
              </span>
              <span className="text-xs text-zinc-400 font-mono">/ 4 blocos</span>
            </div>

            {/* Indicador de 4 Blocos Minimalista */}
            <div className="grid grid-cols-4 gap-1.5 my-2">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    pomodoroBlocosHoje > idx
                      ? 'bg-rose-500'
                      : 'bg-black/5 dark:bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-black/5 dark:border-white/5 text-[11px]">
            <span className="text-zinc-500 dark:text-zinc-400 truncate flex items-center gap-1 max-w-[110px]" title={soundscapeNome}>
              <Headphones className="h-3 w-3 text-rose-500 shrink-0" />
              <span className="truncate">{soundscapeNome}</span>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={onTogglePomodoro}
                className="p-1 rounded-md text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                title={pomodoroRunning ? 'Pausar' : 'Iniciar'}
              >
                {pomodoroRunning ? <Pause className="h-3 w-3 fill-current" /> : <Play className="h-3 w-3 fill-current" />}
              </button>
              <button
                onClick={() => onAjustarBlocos(1)}
                className="text-rose-600 dark:text-rose-400 hover:underline font-semibold cursor-pointer"
                title="Adicionar +1 bloco de foco concluído"
              >
                +1🍅
              </button>
            </div>
          </div>
        </div>

        {/* COLUNA 3: FLASHCARDS & RETENÇÃO */}
        <div className="p-4 rounded-xl bg-zinc-50/70 dark:bg-zinc-900/40 hover:bg-zinc-100/70 dark:hover:bg-zinc-900/60 transition flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Flashcards</span>
              </span>
              <span className="font-mono text-[11px] font-medium">Meta 75%</span>
            </div>

            <div className="flex items-baseline gap-1.5 my-1">
              <span className="text-2xl font-bold font-mono text-zinc-900 dark:text-white">
                {taxaAcertoEstimada}%
              </span>
              <span className="text-xs text-zinc-400 font-mono">retenção</span>
            </div>

            {/* Barra de Retenção Suave */}
            <div className="h-1.5 w-full bg-black/5 dark:bg-white/10 rounded-full overflow-hidden my-2">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, taxaAcertoEstimada)}%` }}
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-black/5 dark:border-white/5 text-[11px]">
            <span className="text-zinc-500 dark:text-zinc-400">
              {flashStats.acertos}/{flashStats.total} acertos
            </span>
            <button
              onClick={() => onNavegarParaTab('flashcards')}
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold cursor-pointer inline-flex items-center gap-0.5"
            >
              <span>Treinar</span>
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* COLUNA 4: CRONOGRAMA 32 PROVAS FGV */}
        <div className="p-4 rounded-xl bg-zinc-50/70 dark:bg-zinc-900/40 hover:bg-zinc-100/70 dark:hover:bg-zinc-900/60 transition flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>Cronograma FGV</span>
              </span>
              <span className="font-mono text-[11px] font-medium">8 Semanas</span>
            </div>

            <div className="flex items-baseline gap-1.5 my-1">
              <span className="text-2xl font-bold font-mono text-zinc-900 dark:text-white">
                {tarefasConcluidas.length}
              </span>
              <span className="text-xs text-zinc-400 font-mono">/ {totalTarefas} metas</span>
            </div>

            {/* Barra de Cronograma Suave */}
            <div className="h-1.5 w-full bg-black/5 dark:bg-white/10 rounded-full overflow-hidden my-2">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${totalTarefas > 0 ? (tarefasConcluidas.length / totalTarefas) * 100 : 30}%` }}
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-black/5 dark:border-white/5 text-[11px]">
            <span className="text-zinc-500 dark:text-zinc-400 truncate">
              32 Provas Oficiais
            </span>
            <button
              onClick={() => onNavegarParaTab('cronograma')}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer inline-flex items-center gap-0.5"
            >
              <span>Acessar</span>
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. FAIXA INFORMATIVA SINTÉTICA: ANÁLISE HEURÍSTICA & RADAR HISTÓRICO */}
      <div className="p-3.5 rounded-xl bg-zinc-50/80 dark:bg-zinc-900/50 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 text-xs">
        {/* Diagnóstico em tempo real */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
            <Zap className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0 truncate">
            <span className="text-zinc-500 dark:text-zinc-400">Peça cabível detectada: </span>
            <strong className="text-zinc-900 dark:text-white font-semibold">{pecaNome}</strong>
            <span className="ml-1.5 font-mono text-[10.5px] px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold">
              {pecaProb}% probabilidade
            </span>
          </div>
        </div>

        {/* Pílulas do Radar de Incidência FGV */}
        <div className="flex items-center gap-1.5 overflow-x-auto shrink-0 pt-1 lg:pt-0">
          <span className="text-[11px] text-zinc-400 mr-1 hidden sm:inline">Mais cobradas:</span>
          {pecasRadar.map((p) => (
            <button
              key={p.nome}
              onClick={() => onNavegarParaTab('pecas')}
              className="px-2 py-0.5 rounded-md bg-white dark:bg-zinc-800 text-[10.5px] font-mono text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/5 transition cursor-pointer border border-black/5 dark:border-white/5 whitespace-nowrap"
              title={`Clique para consultar ${p.nome}`}
            >
              {p.nome.split(' ')[0]} <span className="opacity-60">{p.freq}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
