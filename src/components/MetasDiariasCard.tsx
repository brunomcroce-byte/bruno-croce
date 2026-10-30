import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  RotateCcw,
  Target,
  Sparkles,
  Clock,
  Flame,
  ArrowRight,
  BookOpen,
  FileText,
  Check,
  Award,
  Zap,
  HelpCircle,
  Play,
  TrendingUp,
  Compass,
  CheckCheck
} from 'lucide-react';
import { SafeStorage } from '../utils/storage';
import { tocarAlarmeWebAudio } from '../utils/audio';
import { dispararConfetesSuaves } from '../utils/confetti';

export interface MetaDiaria {
  id: string;
  texto: string;
  concluida: boolean;
  criadaEm: number;
  destinoAba?: string;
  tempoEstimado?: string;
  dicaExecucao?: string;
}

interface MetasDiariasCardProps {
  onNavigateToTab?: (tab: string) => void;
  onMostrarToast: (msg: string) => void;
  totalLinhasSemana?: number;
  pomodoroBlocosHoje?: number;
}

export function getHojeDataString(): string {
  const agora = new Date();
  const yyyy = agora.getFullYear();
  const mm = String(agora.getMonth() + 1).padStart(2, '0');
  const dd = String(agora.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function getTempoAteMeiaNoite(): string {
  const agora = new Date();
  const meiaNoiteAmanha = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + 1).getTime();
  const diffMs = Math.max(0, meiaNoiteAmanha - agora.getTime());
  const horas = Math.floor(diffMs / (1000 * 60 * 60));
  const minutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${horas}h ${minutos}m`;
}

const SUGESTOES_RAPIDAS = [
  { texto: 'Rever Súmula 166 STJ (ICMS)', aba: 'sumulas', icone: '⭐', tempo: '5 min', dica: 'Memorize a regra: mero deslocamento físico não gera fato gerador.' },
  { texto: 'Redigir 1 Parágrafo na Folha FGV', aba: 'simulador', icone: '✍️', tempo: '15 min', dica: 'Pratique a estrutura formal: fato, fundamento legal e conclusão.' },
  { texto: 'Revisar 5 Flashcards da 2ª Fase', aba: 'flashcards', icone: '⚡', tempo: '10 min', dica: 'Fixe a fundamentação dos precedentes de repercussão geral.' },
  { texto: 'Identificar 1 Peça no Peçômetro', aba: 'pecas', icone: '🎯', tempo: '8 min', dica: 'Observe o momento processual: antes ou depois do lançamento fiscal?' },
  { texto: 'Marcar Artigos 150 e 151 CTN', aba: 'vademecum', icone: '🖍️', tempo: '5 min', dica: 'Destaque as hipóteses de suspensão e imunidades constitucionais.' }
];

export const LIMITE_MAXIMO_METAS = 6;

export const MetasDiariasCard: React.FC<MetasDiariasCardProps> = ({
  onNavigateToTab,
  onMostrarToast,
  totalLinhasSemana = 80,
  pomodoroBlocosHoje = 2
}) => {
  const [tempoRestante, setTempoRestante] = useState<string>(getTempoAteMeiaNoite());
  const [novoTextoMeta, setNovoTextoMeta] = useState('');
  const [modoVisualizacao, setModoVisualizacao] = useState<'passo_a_passo' | 'lista'>('passo_a_passo');

  // Carrega ou inicializa as metas do LocalStorage
  const [{ metas, streak }, setEstadoMetas] = useState<{ metas: MetaDiaria[]; streak: number }>(() => {
    const hoje = getHojeDataString();
    try {
      const raw = SafeStorage.get('tributa_metas_diarias_v1', '');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.data === hoje && Array.isArray(parsed.metas)) {
          return { metas: parsed.metas, streak: parsed.streak || 0 };
        }
      }
    } catch {
      // Ignora erro de parse
    }

    // Inicialização padrão guiada para a 2ª Fase FGV
    const defaultMetas: MetaDiaria[] = [
      {
        id: 'meta-1',
        texto: 'Aquecer: Rever Súmula 166 STJ (Não incidência de ICMS)',
        concluida: false,
        criadaEm: Date.now(),
        destinoAba: 'sumulas',
        tempoEstimado: '5 min',
        dicaExecucao: 'Leia o texto da súmula e identifique o artigo correspondente na CF/88.'
      },
      {
        id: 'meta-2',
        texto: 'Praticar: Redigir 1 parágrafo na folha FGV de 150 linhas',
        concluida: false,
        criadaEm: Date.now() + 1,
        destinoAba: 'simulador',
        tempoEstimado: '15 min',
        dicaExecucao: 'Escreva a introdução dos fatos e o preâmbulo formal da exordial.'
      },
      {
        id: 'meta-3',
        texto: 'Fixar: Revisar 5 flashcards tributários estratégicos',
        concluida: false,
        criadaEm: Date.now() + 2,
        destinoAba: 'flashcards',
        tempoEstimado: '10 min',
        dicaExecucao: 'Treine a resposta mental antes de virar a face do card.'
      }
    ];

    const inicial = {
      data: hoje,
      metas: defaultMetas,
      streak: 1
    };
    SafeStorage.set('tributa_metas_diarias_v1', JSON.stringify(inicial));
    return { metas: defaultMetas, streak: 1 };
  });

  // Salva no LocalStorage sempre que o estado muda
  const salvarEstado = (novasMetas: MetaDiaria[], novoStreak: number = streak) => {
    const hoje = getHojeDataString();
    setEstadoMetas({ metas: novasMetas, streak: novoStreak });
    SafeStorage.set(
      'tributa_metas_diarias_v1',
      JSON.stringify({
        data: hoje,
        metas: novasMetas,
        streak: novoStreak
      })
    );
  };

  // Monitor de meia-noite (00:00)
  useEffect(() => {
    const interval = setInterval(() => {
      setTempoRestante(getTempoAteMeiaNoite());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const totalMetas = metas.length;
  const concluidasCount = metas.filter(m => m.concluida).length;
  const percentualProgresso = totalMetas > 0 ? Math.round((concluidasCount / totalMetas) * 100) : 0;
  const todasConcluidas = totalMetas > 0 && concluidasCount === totalMetas;

  // Próximo passo não concluído da jornada
  const indiceProximoPasso = metas.findIndex(m => !m.concluida);
  const proximoPasso = indiceProximoPasso !== -1 ? metas[indiceProximoPasso] : null;

  // Alterna o estado de conclusão com feedback sonoro e visual
  const alternarConclusaoMeta = (id: string) => {
    const atualizadas = metas.map(m => {
      if (m.id === id) {
        const novoStatus = !m.concluida;
        if (novoStatus) {
          tocarAlarmeWebAudio('suave');
          dispararConfetesSuaves({ count: 35, originY: 0.4 });
        }
        return { ...m, concluida: novoStatus };
      }
      return m;
    });

    const novasConcluidas = atualizadas.filter(m => m.concluida).length;
    let novoStreak = streak;

    if (novasConcluidas === atualizadas.length && atualizadas.length > 0) {
      dispararConfetesSuaves({ count: 80, originY: 0.3 });
      tocarAlarmeWebAudio('padrao');
      onMostrarToast('🎉 Espetacular! Todas as metas de hoje foram cumpridas!');
      novoStreak = Math.max(streak, 1);
    } else {
      const meta = metas.find(m => m.id === id);
      if (meta && !meta.concluida) {
        onMostrarToast('✅ Passo concluído com sucesso! Rumo à aprovação!');
      }
    }

    salvarEstado(atualizadas, novoStreak);
  };

  // Adiciona nova meta
  const adicionarMeta = (textoManual?: string, destinoAbaManual?: string) => {
    const textoFinal = (textoManual || novoTextoMeta).trim();
    if (!textoFinal) return;

    if (metas.length >= LIMITE_MAXIMO_METAS) {
      onMostrarToast(`Limite de ${LIMITE_MAXIMO_METAS} metas atingido por hoje.`);
      return;
    }

    const nova: MetaDiaria = {
      id: `meta-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      texto: textoFinal,
      concluida: false,
      criadaEm: Date.now(),
      destinoAba: destinoAbaManual || (textoFinal.toLowerCase().includes('súmula') ? 'sumulas' : textoFinal.toLowerCase().includes('redig') ? 'simulador' : 'flashcards'),
      tempoEstimado: '10 min',
      dicaExecucao: 'Mantenha o foco sem interrupções para consolidar este ponto na prova.'
    };

    const atualizadas = [...metas, nova];
    salvarEstado(atualizadas);
    if (!textoManual) setNovoTextoMeta('');
    tocarAlarmeWebAudio('suave');
    onMostrarToast('🎯 Novo passo adicionado à sua trilha diária!');
  };

  const removerMeta = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const atualizadas = metas.filter(m => m.id !== id);
    salvarEstado(atualizadas);
    onMostrarToast('Meta removida da trilha.');
  };

  const reiniciarMetasSugeridas = () => {
    const padrao: MetaDiaria[] = [
      {
        id: `meta-${Date.now()}-1`,
        texto: 'Aquecer: Rever Súmula 166 STJ (ICMS entre filiais)',
        concluida: false,
        criadaEm: Date.now(),
        destinoAba: 'sumulas',
        tempoEstimado: '5 min',
        dicaExecucao: 'Identifique o fundamento na Súmula 166 e no Art. 155, II da CF/88.'
      },
      {
        id: `meta-${Date.now()}-2`,
        texto: 'Praticar: Redigir 1 parágrafo na folha FGV de 150 linhas',
        concluida: false,
        criadaEm: Date.now() + 1,
        destinoAba: 'simulador',
        tempoEstimado: '15 min',
        dicaExecucao: 'Estruture o endereçamento, fundamentação do cabimento e pedido liminar.'
      },
      {
        id: `meta-${Date.now()}-3`,
        texto: 'Fixar: Revisar 5 flashcards da 2ª Fase OAB',
        concluida: false,
        criadaEm: Date.now() + 2,
        destinoAba: 'flashcards',
        tempoEstimado: '10 min',
        dicaExecucao: 'Memorize as regras de decadência (Art. 173) e prescrição (Art. 174 CTN).'
      }
    ];
    salvarEstado(padrao);
    tocarAlarmeWebAudio('suave');
    onMostrarToast('Trilha recomendada carregada com sucesso!');
  };

  const getNomeAbaFormatado = (aba?: string) => {
    switch (aba) {
      case 'sumulas':
        return 'Súmulas';
      case 'simulador':
        return 'Folha 150L';
      case 'flashcards':
        return 'Flashcards';
      case 'pecas':
        return 'Peças FGV';
      case 'vademecum':
        return 'Vade Mecum';
      case 'cronograma':
        return 'Cronograma';
      default:
        return 'Módulo';
    }
  };

  return (
    <div className="rounded-3xl border border-emerald-400/25 bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/30 dark:from-zinc-800/95 dark:via-zinc-800/90 dark:to-zinc-800/95 text-zinc-900 dark:text-zinc-100 p-6 lg:p-7 shadow-sm space-y-6 relative overflow-hidden transition-all duration-300">
      {/* 1. TOPO AMIGÁVEL & CONVITE DIÁRIO */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 shrink-0">
            <Compass className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-300/60 dark:border-emerald-700/60 inline-flex items-center gap-1">
                <Target className="h-3 w-3" /> Trilha Guiada de Estudo
              </span>
              <span className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-300/50 dark:border-amber-700/40 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 font-semibold">
                <Clock className="h-3 w-3" /> Reseta às 00:00 ({tempoRestante})
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white mt-1 flex items-center gap-2 tracking-tight">
              Metas do Dia • Passo a Passo
            </h2>
          </div>
        </div>

        {/* Badges de Constância & Alternador de Visão */}
        <div className="flex items-center gap-2 flex-wrap">
          {streak > 0 && (
            <div
              className="rounded-2xl border border-amber-400/40 bg-amber-50 dark:bg-amber-950/40 px-3.5 py-1.5 text-xs font-bold text-amber-700 dark:text-amber-300 inline-flex items-center gap-1.5 shadow-xs"
              title="Dias consecutivos de estudo cumpridos"
            >
              <Flame className="h-4 w-4 text-amber-500 fill-amber-500 animate-pulse" />
              <span>{streak} {streak === 1 ? 'dia de foco' : 'dias de constância!'}</span>
            </div>
          )}

          {/* Toggle de Modo: Passo a Passo vs Lista */}
          <div className="flex items-center rounded-xl bg-black/5 dark:bg-zinc-700/50 p-0.5 border border-black/5 dark:border-white/10">
            <button
              type="button"
              onClick={() => setModoVisualizacao('passo_a_passo')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                modoVisualizacao === 'passo_a_passo'
                  ? 'bg-white dark:bg-zinc-800 text-emerald-700 dark:text-emerald-300 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
            >
              Trilha Ativa
            </button>
            <button
              type="button"
              onClick={() => setModoVisualizacao('lista')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                modoVisualizacao === 'lista'
                  ? 'bg-white dark:bg-zinc-800 text-emerald-700 dark:text-emerald-300 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
            >
              Ver Todas ({metas.length})
            </button>
          </div>
        </div>
      </div>

      {/* 2. CONEXÃO COM A META SEMANAL & PROGRESSO DIÁRIO */}
      <div className="rounded-2xl border border-emerald-200/60 dark:border-white/10 bg-gradient-to-r from-emerald-50/60 via-teal-50/40 to-sky-50/40 dark:from-zinc-900/60 dark:via-zinc-900/40 dark:to-zinc-900/60 p-4.5 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
          <div>
            <span className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Progresso do Dia: {concluidasCount} de {totalMetas} passos concluídos ({percentualProgresso}%)</span>
            </span>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5">
              Cada micro-ação de hoje contribui para sua <strong>Meta Semanal de 150 linhas</strong> ({totalLinhasSemana}/150L redigidas).
            </p>
          </div>

          <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-300/60 shrink-0 self-start sm:self-auto">
            {todasConcluidas ? '🏆 Meta de Hoje Cumprida!' : `Restam ${totalMetas - concluidasCount} passos`}
          </span>
        </div>

        {/* Barra de Progresso com Brilho Suave */}
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-emerald-200/50 dark:bg-zinc-800 shadow-inner">
          <div
            className={`h-full transition-all duration-700 rounded-full ${
              todasConcluidas
                ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-400 shadow-[0_0_14px_rgba(52,211,153,0.7)]'
                : 'bg-gradient-to-r from-emerald-500 to-teal-400'
            }`}
            style={{ width: `${percentualProgresso}%` }}
          />
        </div>
      </div>

      {/* 3. CARD DE CONVITE ATIVO: "SEU PRÓXIMO PASSO AGORA" (HERO SPOTLIGHT) */}
      {!todasConcluidas && proximoPasso ? (
        <div className="rounded-2xl border-2 border-emerald-500/30 bg-white dark:bg-zinc-800/90 p-5 shadow-sm space-y-4 hover:border-emerald-500/50 transition-all duration-300">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              <span>Passo #{indiceProximoPasso + 1} • Vamos Realizar Agora?</span>
            </span>

            {proximoPasso.tempoEstimado && (
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium flex items-center gap-1">
                <Clock className="h-3 w-3" /> Leva apenas ~{proximoPasso.tempoEstimado}
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white leading-snug">
              {proximoPasso.texto}
            </h3>
            {proximoPasso.dicaExecucao && (
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed bg-zinc-50 dark:bg-zinc-900/60 p-2.5 rounded-xl border border-black/5 dark:border-white/5">
                💡 <strong>Dica de Execução:</strong> {proximoPasso.dicaExecucao}
              </p>
            )}
          </div>

          {/* Botões de Ação Imediata: Iniciar o Módulo + Concluir com 1 Toque */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-black/5 dark:border-white/5">
            <div className="flex items-center gap-2">
              {proximoPasso.destinoAba && onNavigateToTab && (
                <button
                  type="button"
                  onClick={() => onNavigateToTab(proximoPasso.destinoAba!)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-xs hover:shadow transition-all cursor-pointer active:scale-95"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Abrir {getNomeAbaFormatado(proximoPasso.destinoAba)} e Executar →</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => alternarConclusaoMeta(proximoPasso.id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 font-semibold text-xs transition cursor-pointer active:scale-95"
            >
              <Check className="h-4 w-4 stroke-[2.5]" />
              <span>Concluir Passo</span>
            </button>
          </div>
        </div>
      ) : todasConcluidas ? (
        <div className="rounded-2xl border-2 border-emerald-400/40 bg-gradient-to-br from-emerald-50 via-teal-50/40 to-sky-50 dark:from-emerald-950/40 dark:via-zinc-800/80 dark:to-teal-950/30 p-6 text-center space-y-3 shadow-sm">
          <div className="h-12 w-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
            <CheckCheck className="h-6 w-6 stroke-[3]" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-emerald-900 dark:text-emerald-200">
              Todas as Metas de Hoje Concluídas! 🏆
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 max-w-md mx-auto mt-1 leading-relaxed">
              Você avançou na redação, fixou teses e manteve a consistência. Sua aprovação na 2ª Fase é fruto dessa disciplina diária!
            </p>
          </div>
          <button
            onClick={() => {
              dispararConfetesSuaves({ count: 60, originY: 0.35 });
              tocarAlarmeWebAudio('suave');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Celebrar Conquista de Hoje!</span>
          </button>
        </div>
      ) : null}

      {/* 4. VISUALIZAÇÃO DA TRILHA DE PASSOS (TIMELINE GUIADA) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-zinc-800 dark:text-zinc-200">
            Passos da Sua Trilha ({concluidasCount}/{totalMetas})
          </span>
          {metas.length > 0 && (
            <button
              onClick={reiniciarMetasSugeridas}
              className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
            >
              Restaurar trilha padrão
            </button>
          )}
        </div>

        <div className="space-y-2">
          {metas.map((meta, idx) => {
            const isAtiva = !meta.concluida && idx === indiceProximoPasso;
            return (
              <div
                key={meta.id}
                onClick={() => alternarConclusaoMeta(meta.id)}
                className={`group flex items-center justify-between gap-3.5 rounded-2xl border p-3.5 transition-all duration-200 cursor-pointer shadow-xs ${
                  meta.concluida
                    ? 'border-emerald-300/50 dark:border-emerald-800/40 bg-emerald-50/50 dark:bg-emerald-950/20 text-zinc-500 dark:text-zinc-400'
                    : isAtiva
                    ? 'border-emerald-400 bg-white dark:bg-zinc-800/95 ring-2 ring-emerald-400/20 shadow-sm'
                    : 'border-black/5 dark:border-white/10 bg-white dark:bg-zinc-800/90 text-zinc-900 dark:text-zinc-100 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  {/* Marcador do Passo */}
                  <label
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center cursor-pointer select-none"
                    title={meta.concluida ? 'Desmarcar' : 'Concluir este passo'}
                  >
                    <input
                      type="checkbox"
                      checked={meta.concluida}
                      onChange={() => alternarConclusaoMeta(meta.id)}
                      className="sr-only"
                    />
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 ${
                        meta.concluida
                          ? 'border-emerald-500 bg-emerald-500 text-white shadow-xs'
                          : isAtiva
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-bold text-xs ring-2 ring-emerald-400/30'
                          : 'border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 text-zinc-400 text-xs font-bold'
                      }`}
                    >
                      {meta.concluida ? (
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>
                  </label>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold leading-relaxed break-words transition-all ${
                          meta.concluida
                            ? 'line-through text-zinc-400 dark:text-zinc-500 italic'
                            : isAtiva
                            ? 'text-zinc-900 dark:text-white font-bold'
                            : 'text-zinc-800 dark:text-zinc-200'
                        }`}
                      >
                        {meta.texto}
                      </span>
                    </div>
                    {meta.tempoEstimado && !meta.concluida && (
                      <span className="text-[10.5px] text-zinc-500 dark:text-zinc-400 block mt-0.5">
                        Duração recomendada: ~{meta.tempoEstimado}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {meta.destinoAba && onNavigateToTab && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateToTab(meta.destinoAba!);
                      }}
                      className="rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 px-3 py-1 text-[11px] font-semibold transition inline-flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
                      title={`Ir para ${getNomeAbaFormatado(meta.destinoAba)}`}
                    >
                      <span>{getNomeAbaFormatado(meta.destinoAba)}</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={(e) => removerMeta(meta.id, e)}
                    className="rounded-lg p-1.5 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                    title="Excluir da trilha"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. ADICIONAR NOVO PASSO & SUGESTÕES DE 1 CLIQUE */}
      <div className="rounded-2xl border border-emerald-200/50 dark:border-white/10 bg-white dark:bg-zinc-800/90 p-4 space-y-3.5 shadow-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            adicionarMeta();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={novoTextoMeta}
              onChange={(e) => setNovoTextoMeta(e.target.value)}
              placeholder="Adicionar novo passo personalizado (ex: Estudar Art. 150 CF)..."
              disabled={metas.length >= LIMITE_MAXIMO_METAS}
              className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900 pl-9 pr-3.5 py-2.5 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition disabled:opacity-60"
              maxLength={120}
            />
            <Plus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          </div>
          <button
            type="submit"
            disabled={!novoTextoMeta.trim() || metas.length >= LIMITE_MAXIMO_METAS}
            className="rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-4 py-2.5 text-xs font-semibold text-white transition inline-flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0 active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Adicionar</span>
          </button>
        </form>

        {/* Sugestões Rápidas de 1 Clique */}
        <div className="space-y-1.5 pt-1 border-t border-black/5 dark:border-white/5">
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-500" /> Adicionar sugestão à sua trilha:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {SUGESTOES_RAPIDAS.map((sug, idx) => {
              const jaAdicionada = metas.some(m => m.texto.toLowerCase().includes(sug.texto.toLowerCase().slice(0, 15)));
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={jaAdicionada || metas.length >= LIMITE_MAXIMO_METAS}
                  onClick={() => adicionarMeta(sug.texto, sug.aba)}
                  className={`rounded-xl px-2.5 py-1 text-[11px] font-medium transition inline-flex items-center gap-1.5 cursor-pointer border shadow-xs ${
                    jaAdicionada
                      ? 'border-emerald-300/40 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 opacity-60 cursor-not-allowed'
                      : 'border-black/5 dark:border-white/10 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:border-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-zinc-700'
                  }`}
                >
                  <span>{sug.icone}</span>
                  <span>{sug.texto}</span>
                  {jaAdicionada && <Check className="h-3 w-3 text-emerald-500 ml-0.5" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
