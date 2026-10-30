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
  Zap,
  Target,
  Award
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

  // Peças mais recorrentes nos 32 exames FGV
  const pecasRadar = [
    { nome: 'Mandado de Segurança', curto: 'MS', freq: '10x', pct: '31%', cor: 'hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400' },
    { nome: 'Recurso de Apelação', curto: 'Apelação', freq: '9x', pct: '28%', cor: 'hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400' },
    { nome: 'Agravo de Instrumento', curto: 'Agravo', freq: '7x', pct: '22%', cor: 'hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400' },
    { nome: 'Ação Anulatória', curto: 'Anulatória', freq: '7x', pct: '22%', cor: 'hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400' },
    { nome: 'Repetição de Indébito', curto: 'Repetição', freq: '6x', pct: '19%', cor: 'hover:border-rose-500 hover:text-rose-600 dark:hover:text-rose-400' }
  ];

  return (
    <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-800/90 shadow-sm p-6 lg:p-7 space-y-6 transition-all duration-300">
      {/* 1. TOPO AMIGÁVEL COM MEDIDOR VISUAL DE PRONTIDÃO */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 pb-2">
        <div className="flex items-center gap-4">
          {/* Anel de Progresso Visual e Agradável */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="currentColor"
                strokeWidth="5"
                className="text-black/5 dark:text-white/10"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="currentColor"
                strokeWidth="5"
                strokeDasharray={163.3}
                strokeDashoffset={163.3 - (163.3 * indiceProntidao) / 100}
                strokeLinecap="round"
                className="text-blue-600 dark:text-blue-400 transition-all duration-1000 ease-out"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-base font-extrabold font-mono text-zinc-900 dark:text-white leading-none">
                {indiceProntidao}%
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800/40">
                Preparação Estratégica
              </span>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/40">
                {indiceProntidao >= 75 ? '🔥 Ritmo Excelente' : '💪 Evoluindo com Constância'}
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                • {diasProva >= 0 ? `Faltam ${diasProva} dias para a prova` : 'Dia da prova'}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white mt-1 tracking-tight">
              Seu Painel de Desempenho Diário
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Acompanhe sua evolução prática rumo aos 10 pontos da 2ª Fase OAB.
            </p>
          </div>
        </div>

        {/* Ações Rápidas Amigáveis */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavegarParaTab('simulador')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-sm hover:shadow transition-all cursor-pointer active:scale-95"
          >
            <FileText className="h-4 w-4" />
            <span>Abrir Simulador 150L</span>
          </button>
          <button
            onClick={onExportarPdf}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300 text-xs font-medium shadow-xs transition-all cursor-pointer"
            title="Exportar Relatório Semanal em PDF"
          >
            <Download className="h-4 w-4 text-blue-500" />
            <span className="hidden sm:inline">Relatório PDF</span>
          </button>
        </div>
      </div>

      {/* 2. GRID VISUAL E AGRADÁVEL (4 CARDS COLORIDOS COM PERSONALIDADE) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CARD 1: REDAÇÃO 150 LINHAS (AZUL / SKY) */}
        <div className="p-5 rounded-2xl border border-blue-200/60 dark:border-blue-900/40 bg-gradient-to-br from-blue-50/90 via-sky-50/30 to-white dark:from-blue-950/25 dark:via-zinc-900/50 dark:to-zinc-800/60 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 font-bold shadow-xs">
                  <FileText className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">
                    Redação 150L
                  </span>
                  <span className="text-[10.5px] text-zinc-500 dark:text-zinc-400">
                    Folha padrão FGV
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-300">
                {scoreLinhas.toFixed(0)}%
              </span>
            </div>

            <div className="flex items-baseline gap-1.5 my-2">
              <span className="text-3xl font-extrabold font-mono text-zinc-900 dark:text-white tracking-tight">
                {totalLinhasSemana}
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">/ 150 linhas</span>
            </div>

            {/* Barra de Progresso Suave e Colorida */}
            <div className="h-2 w-full bg-blue-200/50 dark:bg-zinc-800 rounded-full overflow-hidden my-2.5 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-sky-400 rounded-full transition-all duration-700"
                style={{ width: `${scoreLinhas}%` }}
              />
            </div>
          </div>

          <div className="pt-3 mt-1 flex items-center justify-between border-t border-blue-200/40 dark:border-white/5 text-xs">
            <span className="text-zinc-600 dark:text-zinc-400 truncate max-w-[125px]" title={pecaNome}>
              Peça: <strong className="text-blue-600 dark:text-blue-400 font-semibold">{pecaNome.split(' ')[0]}...</strong>
            </span>
            <button
              onClick={() => onAdicionarLinhas(30)}
              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] transition shadow-xs cursor-pointer active:scale-95"
              title="Registrar +30 linhas (1 página preenchida)"
            >
              +30L (Pág)
            </button>
          </div>
        </div>

        {/* CARD 2: FOCO POMODORO (CORAL / ROSE) */}
        <div className="p-5 rounded-2xl border border-rose-200/60 dark:border-rose-900/40 bg-gradient-to-br from-rose-50/90 via-orange-50/30 to-white dark:from-rose-950/25 dark:via-zinc-900/50 dark:to-zinc-800/60 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold shadow-xs">
                  <Clock className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">
                    Foco Diário
                  </span>
                  <span className="text-[10.5px] text-zinc-500 dark:text-zinc-400">
                    Modo {pomodoroModo}
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300">
                {pomodoroBlocosHoje}/4 🍅
              </span>
            </div>

            <div className="flex items-baseline gap-1.5 my-2">
              <span className="text-3xl font-extrabold font-mono text-zinc-900 dark:text-white tracking-tight">
                {pomodoroBlocosHoje}
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">/ 4 blocos diários</span>
            </div>

            {/* 4 Pílulas Visuais Amigáveis de Progresso */}
            <div className="grid grid-cols-4 gap-1.5 my-2.5">
              {[0, 1, 2, 3].map((idx) => {
                const ativo = pomodoroBlocosHoje > idx;
                return (
                  <div
                    key={idx}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      ativo
                        ? 'bg-gradient-to-r from-rose-500 to-amber-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]'
                        : 'bg-rose-200/50 dark:bg-zinc-800'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          <div className="pt-3 mt-1 flex items-center justify-between border-t border-rose-200/40 dark:border-white/5 text-xs">
            <span className="text-zinc-600 dark:text-zinc-400 truncate flex items-center gap-1.5 max-w-[110px]" title={`Soundscape ativo: ${soundscapeNome}`}>
              <Headphones className="h-3.5 w-3.5 text-rose-500 shrink-0" />
              <span className="text-[11px] font-medium truncate">{soundscapeNome}</span>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={onTogglePomodoro}
                className={`p-1.5 rounded-lg text-white font-semibold transition cursor-pointer shadow-xs active:scale-95 ${
                  pomodoroRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-rose-600 hover:bg-rose-500'
                }`}
                title={pomodoroRunning ? 'Pausar foco' : 'Iniciar sessão de foco'}
              >
                {pomodoroRunning ? <Pause className="h-3 w-3 fill-current" /> : <Play className="h-3 w-3 fill-current" />}
              </button>
              <button
                onClick={() => onAjustarBlocos(1)}
                className="px-2 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/60 dark:hover:bg-rose-900/80 text-rose-700 dark:text-rose-300 font-semibold text-[11px] transition cursor-pointer"
                title="Registrar +1 bloco de foco concluído"
              >
                +1 🍅
              </button>
            </div>
          </div>
        </div>

        {/* CARD 3: FLASHCARDS & RETENÇÃO (ESMERALDA / MINT) */}
        <div className="p-5 rounded-2xl border border-emerald-200/60 dark:border-emerald-900/40 bg-gradient-to-br from-emerald-50/90 via-teal-50/30 to-white dark:from-emerald-950/25 dark:via-zinc-900/50 dark:to-zinc-800/60 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs">
                  <Sparkles className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">
                    Flashcards
                  </span>
                  <span className="text-[10.5px] text-zinc-500 dark:text-zinc-400">
                    Fixação das teses
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                Meta 75%
              </span>
            </div>

            <div className="flex items-baseline gap-1.5 my-2">
              <span className="text-3xl font-extrabold font-mono text-zinc-900 dark:text-white tracking-tight">
                {taxaAcertoEstimada}%
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">taxa de retenção</span>
            </div>

            {/* Barra de Retenção Gradiente Suave */}
            <div className="h-2 w-full bg-emerald-200/50 dark:bg-zinc-800 rounded-full overflow-hidden my-2.5 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, taxaAcertoEstimada)}%` }}
              />
            </div>
          </div>

          <div className="pt-3 mt-1 flex items-center justify-between border-t border-emerald-200/40 dark:border-white/5 text-xs">
            <span className="text-zinc-600 dark:text-zinc-400 text-[11px]">
              {flashStats.acertos}/{flashStats.total} acertos
            </span>
            <button
              onClick={() => onNavegarParaTab('flashcards')}
              className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 font-semibold text-[11px] cursor-pointer group-hover:underline"
            >
              <span>Praticar</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* CARD 4: CRONOGRAMA 32 PROVAS FGV (ÍNDIGO / VIOLETA) */}
        <div className="p-5 rounded-2xl border border-indigo-200/60 dark:border-indigo-900/40 bg-gradient-to-br from-indigo-50/90 via-purple-50/30 to-white dark:from-indigo-950/25 dark:via-zinc-900/50 dark:to-zinc-800/60 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs">
                  <Calendar className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">
                    Cronograma FGV
                  </span>
                  <span className="text-[10.5px] text-zinc-500 dark:text-zinc-400">
                    Ciclo de 8 semanas
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-700 dark:text-indigo-300">
                32 Provas
              </span>
            </div>

            <div className="flex items-baseline gap-1.5 my-2">
              <span className="text-3xl font-extrabold font-mono text-zinc-900 dark:text-white tracking-tight">
                {tarefasConcluidas.length}
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">/ {totalTarefas} metas</span>
            </div>

            {/* Barra de Cronograma Gradiente */}
            <div className="h-2 w-full bg-indigo-200/50 dark:bg-zinc-800 rounded-full overflow-hidden my-2.5 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 to-purple-500 rounded-full transition-all duration-700"
                style={{ width: `${totalTarefas > 0 ? (tarefasConcluidas.length / totalTarefas) * 100 : 30}%` }}
              />
            </div>
          </div>

          <div className="pt-3 mt-1 flex items-center justify-between border-t border-indigo-200/40 dark:border-white/5 text-xs">
            <span className="text-zinc-600 dark:text-zinc-400 text-[11px]">
              Simulado semanal
            </span>
            <button
              onClick={() => onNavegarParaTab('cronograma')}
              className="inline-flex items-center gap-1 text-indigo-700 dark:text-indigo-300 hover:text-indigo-800 font-semibold text-[11px] cursor-pointer group-hover:underline"
            >
              <span>Acessar</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. FAIXA VISUAL DE DIAGNÓSTICO & RADAR DE PEÇAS */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50/70 dark:from-zinc-900/60 dark:via-zinc-900/40 dark:to-zinc-900/60 border border-blue-100 dark:border-white/5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 shrink-0 shadow-xs">
            <Zap className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-zinc-500 dark:text-zinc-400 font-medium">Peça mais provável para o caso atual:</span>
              <span className="font-bold text-zinc-900 dark:text-white">{pecaNome}</span>
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-300">
                {pecaProb}% probabilidade
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
              {analisePecaAtual.pecaMaisProvavel?.justificativaCabimento || 'Identificada automaticamente com base nos fatos narrados e nas teses de 2ª fase.'}
            </p>
          </div>
        </div>

        {/* Pílulas de Acesso Rápido ao Radar de Peças */}
        <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto pt-1 lg:pt-0">
          <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 mr-1 hidden sm:inline">
            Radar FGV:
          </span>
          {pecasRadar.map((p) => (
            <button
              key={p.nome}
              onClick={() => onNavegarParaTab('pecas')}
              className={`px-2.5 py-1 rounded-xl bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 text-[11px] font-medium text-zinc-700 dark:text-zinc-300 shadow-xs transition-all cursor-pointer whitespace-nowrap ${p.cor}`}
              title={`Clique para estudar o esqueleto de ${p.nome} (Cobrada ${p.freq} na OAB)`}
            >
              <span>{p.curto}</span>
              <span className="ml-1 opacity-60 font-mono text-[10px]">{p.freq}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
