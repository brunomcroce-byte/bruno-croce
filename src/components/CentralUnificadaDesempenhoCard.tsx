import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Clock,
  Sparkles,
  Download,
  Play,
  Pause,
  Plus,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Zap,
  Target,
  Award,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Check,
  SlidersHorizontal
} from 'lucide-react';
import { ResultadoAnalisePeca } from '../utils/pecaAnalyzer';
import { SoundscapeTipo, SOUNDSCAPE_OPCOES } from '../utils/soundscapes';
import { SafeStorage } from '../utils/storage';
import { tocarAlarmeWebAudio } from '../utils/audio';

export interface PilarPrecisao {
  id: 'estrutura' | 'material' | 'pedidos';
  nome: string;
  icone: string;
  scorePct: number; // 0 a 100% de conformidade/precisão
  itens: {
    id: string;
    titulo: string;
    artigo: string;
    conforme: boolean;
    observacao: string;
    sugestao: string;
  }[];
}

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
  const [anelAtivo, setAnelAtivo] = useState<'linhas' | 'retencao' | 'foco' | null>(null);
  const [pilarAtivo, setPilarAtivo] = useState<'estrutura' | 'material' | 'pedidos'>('estrutura');
  const [itemSelecionadoId, setItemSelecionadoId] = useState<string>('est-1');

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

  // Geometria dos 3 anéis concêntricos do gráfico circular
  const r1 = 74;
  const c1 = 2 * Math.PI * r1;
  const offset1 = c1 - (c1 * scoreLinhas) / 100;

  const r2 = 58;
  const c2 = 2 * Math.PI * r2;
  const offset2 = c2 - (c2 * scoreRetencao) / 100;

  const r3 = 42;
  const c3 = 2 * Math.PI * r3;
  const offset3 = c3 - (c3 * scoreFoco) / 100;

  // WIDGET INTERATIVO DE PRECISÃO JURÍDICA: Mapeia de forma amigável os 3 pilares
  const pilares: PilarPrecisao[] = useMemo(() => {
    const gatilhos = analisePecaAtual.gatilhosGeraisEncontrados || [];
    const temAutoridade = gatilhos.some(g => g.includes('coator') || g.includes('autoridade'));
    const temPrazo120 = gatilhos.some(g => g.includes('120') || g.includes('prazo'));
    const temLiminar = gatilhos.some(g => g.includes('liminar') || g.includes('urgência'));
    const temDecadencia = gatilhos.some(g => g.includes('decadência') || g.includes('173'));
    const temSuspensao = gatilhos.some(g => g.includes('suspensão') || g.includes('151'));

    return [
      {
        id: 'estrutura',
        nome: 'Estrutura & Rito',
        icone: '🏛️',
        scorePct: temAutoridade && temPrazo120 ? 94 : 82,
        itens: [
          {
            id: 'est-1',
            titulo: 'Competência do Juízo',
            artigo: 'Art. 319, I CPC e Art. 109 CF',
            conforme: true,
            observacao: 'Endereçamento correto à Vara de Fazenda Pública ou Vara Cível Federal.',
            sugestao: 'Vara da Fazenda Pública para entes estaduais/municipais; Justiça Federal para a União e suas autarquias.'
          },
          {
            id: 'est-2',
            titulo: 'Qualificação do Polo Passivo',
            artigo: 'Art. 6º Lei 12.016/09',
            conforme: temAutoridade,
            observacao: temAutoridade ? 'Autoridade e pessoa jurídica de direito público indicadas com clareza.' : 'Lembre-se de apontar a autoridade coatora e também requerer a citação/cientificação da Pessoa Jurídica.',
            sugestao: 'No Mandado de Segurança, indique a autoridade coatora (ex: Delegado da Receita) E a pessoa jurídica (União).'
          },
          {
            id: 'est-3',
            titulo: 'Tempestividade do Rito',
            artigo: 'Art. 23 LMS / Art. 16 LEF',
            conforme: temPrazo120,
            observacao: temPrazo120 ? 'Demonstração de tempestividade contemplada.' : 'Demonstre no texto que a ação respeita o prazo formal (120 dias no MS ou 30 dias na LEF).',
            sugestao: 'Abra um parágrafo objetivo demonstrando a contagem do prazo a partir da ciência do ato.'
          }
        ]
      },
      {
        id: 'material',
        nome: 'Fundamentação Material',
        icone: '⚖️',
        scorePct: temDecadencia || temSuspensao ? 88 : 75,
        itens: [
          {
            id: 'mat-1',
            titulo: 'Decadência (173) vs Prescrição (174)',
            artigo: 'Arts. 173 e 174 do CTN',
            conforme: temDecadencia,
            observacao: 'Diferenciação clara entre constituição do crédito e cobrança judicial.',
            sugestao: 'Antes da notificação do lançamento, trata-se de decadência (art. 173 CTN). Após a notificação, opera-se a prescrição (art. 174 CTN).'
          },
          {
            id: 'mat-2',
            titulo: 'Imunidades & Anterioridade',
            artigo: 'Art. 150, III e VI da CF/88',
            conforme: true,
            observacao: 'Aplicação das limitações constitucionais ao poder de tributar.',
            sugestao: 'A imunidade atinge apenas impostos e deve ser fundamentada na alínea exata do art. 150, VI da CF.'
          },
          {
            id: 'mat-3',
            titulo: 'Suspensão da Exigibilidade',
            artigo: 'Art. 151 do CTN',
            conforme: temSuspensao,
            observacao: 'Citação das hipóteses taxativas de suspensão do crédito.',
            sugestao: 'Liminar em MS (inciso IV) e depósito integral em dinheiro (inciso II) suspendem a exigibilidade e asseguram a CPD-EN (art. 206 CTN).'
          }
        ]
      },
      {
        id: 'pedidos',
        nome: 'Tutela & Pedidos',
        icone: '🎯',
        scorePct: temLiminar ? 92 : 78,
        itens: [
          {
            id: 'ped-1',
            titulo: 'Medida Liminar / Tutela Provisória',
            artigo: 'Art. 7º, III LMS c/c Art. 151, IV CTN',
            conforme: temLiminar,
            observacao: temLiminar ? 'Fumus boni iuris e periculum in mora justificados.' : 'Enfatize o risco de dano irreparável pela continuidade da cobrança ilegal.',
            sugestao: 'Requeira expressamente a expedição de certidão positiva com efeitos de negativa (CPD-EN, art. 206 CTN).'
          },
          {
            id: 'ped-2',
            titulo: 'Procedência Definitiva',
            artigo: 'Concessão da Ordem / Anulação',
            conforme: true,
            observacao: 'Pedido principal congruente com a causa de pedir.',
            sugestao: 'Peça a confirmação da liminar e a anulação do débito com cancelamento de eventual CDA.'
          },
          {
            id: 'ped-3',
            titulo: 'Custas & Sucumbência',
            artigo: 'Súmula 105 STJ e Art. 85 CPC',
            conforme: true,
            observacao: 'Disciplina correta das verbas sucumbenciais na FGV.',
            sugestao: 'Em Mandado de Segurança, NÃO cabem honorários sucumbenciais (Súmula 105 STJ). Requeira apenas ressarcimento de custas.'
          }
        ]
      }
    ];
  }, [analisePecaAtual]);

  const pilarCorrente = pilares.find(p => p.id === pilarAtivo) || pilares[0];
  const itemCorrente = pilarCorrente.itens.find(it => it.id === itemSelecionadoId) || pilarCorrente.itens[0];

  // Média ponderada de precisão dos 3 pilares
  const mediaPrecisao = Math.round(
    pilares.reduce((acc, p) => acc + p.scorePct, 0) / pilares.length
  );

  return (
    <motion.div
      layout
      transition={{
        layout: { type: 'spring', stiffness: 280, damping: 28, mass: 0.9 },
      }}
      className="macos-card-interactive rounded-3xl border border-black/5 dark:border-white/10 bg-white/80 dark:bg-zinc-800/90 backdrop-blur-xl shadow-sm p-5 lg:p-6 space-y-4"
    >
      {/* 1. TOPO: TÍTULO, SUBTÍTULO & AÇÕES RÁPIDAS */}
      <motion.div
        layout
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-black/5 dark:border-white/5"
      >
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-medium flex-wrap">
            <span className="font-semibold text-blue-600 dark:text-blue-400">Painel de Desempenho</span>
            <span aria-hidden="true">·</span>
            <span>2ª Fase OAB Tributário</span>
            <span aria-hidden="true">·</span>
            <span>{diasProva >= 0 ? `${diasProva} dias para a prova` : 'Hoje é a prova'}</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Prontidão & Precisão Jurídica da Peça</span>
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavegarParaTab('simulador')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-xs transition cursor-pointer active:scale-95"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Simulador 150L</span>
          </button>

          <button
            onClick={onExportarPdf}
            className="p-1.5 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition cursor-pointer shadow-xs"
            title="Exportar Relatório Semanal em PDF"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

      {/* 2. CORPO: GRÁFICO CIRCULAR ÚNICO + WIDGET INTERATIVO DE PRECISÃO JURÍDICA */}
      <motion.div
        layout
        transition={{
          layout: { type: 'spring', stiffness: 280, damping: 28 },
        }}
        className="flex flex-col lg:flex-row items-center lg:items-stretch gap-6"
      >
        {/* GRÁFICO CIRCULAR DE DESEMPENHO (COMPACTO & ELEGANTE COM TRANSIÇÃO DE LAYOUT) */}
        <motion.div
          layout
          transition={{
            layout: { type: 'spring', stiffness: 280, damping: 28 },
          }}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-zinc-50/70 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5 shrink-0 w-full sm:w-auto"
        >
          <motion.div layout className="relative flex items-center justify-center">
            <svg className="w-36 h-36 sm:w-40 sm:h-40 transform -rotate-90 overflow-visible" viewBox="0 0 180 180">
              <defs>
                <linearGradient id="ringLinhasGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
                <linearGradient id="ringRetencaoGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
                <linearGradient id="ringFocoGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
              </defs>

              {/* Trilha de Fundo 1 (Externo) */}
              <circle cx="90" cy="90" r={r1} stroke="currentColor" strokeWidth="6.5" className="text-black/5 dark:text-white/5" fill="transparent" />
              <circle
                cx="90"
                cy="90"
                r={r1}
                stroke="url(#ringLinhasGrad)"
                strokeWidth={anelAtivo === 'linhas' ? '8.5' : '6.5'}
                strokeDasharray={c1}
                strokeDashoffset={offset1}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out cursor-pointer"
                fill="transparent"
                onMouseEnter={() => setAnelAtivo('linhas')}
                onMouseLeave={() => setAnelAtivo(null)}
              />

              {/* Trilha de Fundo 2 (Médio) */}
              <circle cx="90" cy="90" r={r2} stroke="currentColor" strokeWidth="6.5" className="text-black/5 dark:text-white/5" fill="transparent" />
              <circle
                cx="90"
                cy="90"
                r={r2}
                stroke="url(#ringRetencaoGrad)"
                strokeWidth={anelAtivo === 'retencao' ? '8.5' : '6.5'}
                strokeDasharray={c2}
                strokeDashoffset={offset2}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out cursor-pointer"
                fill="transparent"
                onMouseEnter={() => setAnelAtivo('retencao')}
                onMouseLeave={() => setAnelAtivo(null)}
              />

              {/* Trilha de Fundo 3 (Interno) */}
              <circle cx="90" cy="90" r={r3} stroke="currentColor" strokeWidth="6.5" className="text-black/5 dark:text-white/5" fill="transparent" />
              <circle
                cx="90"
                cy="90"
                r={r3}
                stroke="url(#ringFocoGrad)"
                strokeWidth={anelAtivo === 'foco' ? '8.5' : '6.5'}
                strokeDasharray={c3}
                strokeDashoffset={offset3}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out cursor-pointer"
                fill="transparent"
                onMouseEnter={() => setAnelAtivo('foco')}
                onMouseLeave={() => setAnelAtivo(null)}
              />
            </svg>

              {/* Centro do Anel: Índice Ponderado */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-2xl font-extrabold font-mono text-zinc-900 dark:text-white tracking-tight leading-none animate-pop-scale">
                {indiceProntidao}%
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mt-0.5">
                Prontidão
              </span>
              <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                {indiceProntidao >= 75 ? 'Ritmo Forte' : 'Evoluindo'}
              </span>
            </div>
          </motion.div>

          {/* Mini-Métricas Limpas com Transição de Layout */}
          <motion.div
            layout
            className="grid grid-cols-3 gap-2 w-full pt-2.5 mt-1 border-t border-black/5 dark:border-white/5 text-center text-xs"
          >
            <div className="cursor-pointer transition-transform hover:scale-105" onMouseEnter={() => setAnelAtivo('linhas')} onMouseLeave={() => setAnelAtivo(null)}>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block">Redação</span>
              <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">{totalLinhasSemana}/150L</span>
            </div>
            <div className="cursor-pointer transition-transform hover:scale-105" onMouseEnter={() => setAnelAtivo('retencao')} onMouseLeave={() => setAnelAtivo(null)}>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block">Retenção</span>
              <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">{taxaAcertoEstimada}%</span>
            </div>
            <div className="cursor-pointer transition-transform hover:scale-105" onMouseEnter={() => setAnelAtivo('foco')} onMouseLeave={() => setAnelAtivo(null)}>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block">Foco</span>
              <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">{pomodoroBlocosHoje}/4🍅</span>
            </div>
          </motion.div>
        </motion.div>

        {/* WIDGET INTERATIVO DE PRECISÃO & REFORÇO DE TESES (AMIGÁVEL & COM LAYOUT SHIFT SUAVE) */}
        <motion.div
          layout
          transition={{
            layout: { type: 'spring', stiffness: 280, damping: 28 },
          }}
          className="flex-1 min-w-0 space-y-3 w-full"
        >
          {/* Barra Termômetro Superior de Precisão */}
          <div className="p-3 rounded-2xl bg-zinc-50/70 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5 space-y-2 transition-all">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                <SlidersHorizontal className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 animate-pulse" />
                <span>Precisão Jurídica Heurística:</span>
                <strong className="text-zinc-900 dark:text-white font-bold">{mediaPrecisao}% Conforme</strong>
              </span>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Peça em análise: <strong className="text-zinc-900 dark:text-white">{pecaNome}</strong>
              </span>
            </div>

            {/* Barra Termômetro Suave Segmentada com Animação Gradiente */}
            <div className="h-2.5 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden flex shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-sky-400 animate-gradient-flow transition-all duration-700"
                style={{ width: `${pilares[0].scorePct / 3}%` }}
                title="Estrutura & Rito"
              />
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 animate-gradient-flow transition-all duration-700"
                style={{ width: `${pilares[1].scorePct / 3}%` }}
                title="Fundamentação Material"
              />
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-400 animate-gradient-flow transition-all duration-700"
                style={{ width: `${pilares[2].scorePct / 3}%` }}
                title="Tutela & Pedidos"
              />
            </div>
          </div>

          {/* Abas dos 3 Pilares Interativos */}
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-zinc-100/70 dark:bg-zinc-900/80 border border-black/5 dark:border-white/5">
            {pilares.map((p) => {
              const ativo = p.id === pilarAtivo;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    tocarAlarmeWebAudio('suave');
                    setPilarAtivo(p.id);
                    setItemSelecionadoId(p.itens[0].id);
                  }}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 ${
                    ativo
                      ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-xs scale-[1.02]'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <span className="text-xs">{p.icone}</span>
                  <span className="truncate">{p.nome}</span>
                  <span className="text-[10px] font-mono opacity-75">{p.scorePct}%</span>
                </button>
              );
            })}
          </div>

          {/* Lista Amigável de Itens do Pilar Selecionado com Animação de Entrada */}
          <div key={pilarAtivo} className="space-y-1.5 animate-pop-scale">
            {pilarCorrente.itens.map((item) => {
              const isSelected = item.id === itemCorrente.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    tocarAlarmeWebAudio('suave');
                    setItemSelecionadoId(item.id);
                  }}
                  className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 text-xs ${
                    isSelected
                      ? 'border-blue-500/60 bg-blue-50/50 dark:bg-blue-950/25 shadow-xs translate-x-1'
                      : 'border-black/5 dark:border-white/5 bg-zinc-50/50 dark:bg-zinc-900/40 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60 hover:translate-x-0.5'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`h-4 w-4 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold transition-transform ${
                        item.conforme
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                          : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 animate-pulse'
                      }`}
                    >
                      {item.conforme ? '✓' : '💡'}
                    </div>
                    <span className="font-medium text-zinc-900 dark:text-white truncate">
                      {item.titulo}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 shrink-0">
                      {item.artigo}
                    </span>
                  </div>

                  <span
                    className={`text-[10.5px] font-semibold shrink-0 transition-colors ${
                      item.conforme ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {item.conforme ? 'Alinhado' : 'Reforçar'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Caixa de Sugestão Construtiva & Acolhedora */}
          <div key={itemCorrente.id} className="p-3 rounded-2xl bg-blue-50/40 dark:bg-zinc-900/80 border border-blue-200/60 dark:border-white/5 text-xs space-y-1 animate-pop-scale shadow-xs">
            <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
              <span className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Sugestão para o Espelho FGV:
              </span>
              <span className="font-mono text-[10px]">{itemCorrente.artigo}</span>
            </div>
            <p className="text-zinc-700 dark:text-zinc-300 text-[11.5px] leading-relaxed">
              {itemCorrente.sugestao}
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* 3. RODAPÉ SUTIL COM RESUMO DE CONTEXTO */}
      <motion.div
        layout
        className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 pt-1 border-t border-black/5 dark:border-white/5"
      >
        <span className="truncate flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 text-amber-500 shrink-0" />
          <span>Peça: <strong className="text-zinc-800 dark:text-zinc-200">{pecaNome}</strong> ({pecaProb}% probabilidade heurística)</span>
        </span>
        <span className="font-mono text-[11px] shrink-0">
          Cronograma: <strong className="text-zinc-800 dark:text-zinc-200">{tarefasConcluidas.length}/{totalTarefas}</strong>
        </span>
      </motion.div>
    </motion.div>
  );
};
