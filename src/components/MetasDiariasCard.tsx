import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  RotateCcw,
  Sparkles,
  Clock,
  Flame,
  ArrowRight,
  BookOpen,
  FileText,
  Check,
  Award,
  Zap,
  Play,
  TrendingUp,
  Compass,
  CheckCheck,
  Scroll,
  MapPin,
  Flag,
  ShieldCheck,
  ChevronRight
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
  capituloTitulo?: string;
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
  { texto: 'Decifrar Súmula 166 STJ (Não incidência de ICMS)', capitulo: 'Ato 1: O Reconhecimento', aba: 'sumulas', tempo: '5 min' },
  { texto: 'Erguer o Preâmbulo na Folha FGV 150L', capitulo: 'Ato 2: A Batalha na Folha', aba: 'simulador', tempo: '15 min' },
  { texto: 'Blindar 5 Flashcards de Teses Qualificadas', capitulo: 'Ato 3: A Blindagem Jurídica', aba: 'flashcards', tempo: '10 min' },
  { texto: 'Descobrir a Peça Cabível no Peçômetro', capitulo: 'Ato Especial: O Diagnóstico', aba: 'pecas', tempo: '8 min' }
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

  // Carrega ou inicializa as metas com roupagem de Storytelling
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
      // Ignora erro
    }

    // Inicialização padrão guiada pela narrativa do Tributarista
    const defaultMetas: MetaDiaria[] = [
      {
        id: 'meta-1',
        capituloTitulo: 'Ato 1: O Despertar da Jurisprudência',
        texto: 'Investigar a Súmula 166 do STJ e fixar a regra da não-incidência de ICMS',
        concluida: false,
        criadaEm: Date.now(),
        destinoAba: 'sumulas',
        tempoEstimado: '5 min',
        dicaExecucao: 'Compreenda que a mera saída física sem transferência de propriedade não gera obrigação tributária.'
      },
      {
        id: 'meta-2',
        capituloTitulo: 'Ato 2: A Conquista da Folha de 150 Linhas',
        texto: 'Redigir a narrativa dos fatos e a fundamentação preliminar no Simulador FGV',
        concluida: false,
        criadaEm: Date.now() + 1,
        destinoAba: 'simulador',
        tempoEstimado: '15 min',
        dicaExecucao: 'Exercite a objetividade jurídica sem preâmbulos prolixos.'
      },
      {
        id: 'meta-3',
        capituloTitulo: 'Ato 3: O Selo dos 10 Pontos',
        texto: 'Testar e blindar a memória com 5 flashcards de teses repetitivas',
        concluida: false,
        criadaEm: Date.now() + 2,
        destinoAba: 'flashcards',
        tempoEstimado: '10 min',
        dicaExecucao: 'Responda antes de virar a face para fixar a resposta ativa no cérebro.'
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

  // Próximo ato a ser desbravado na história
  const indiceProximoPasso = metas.findIndex(m => !m.concluida);
  const proximoPasso = indiceProximoPasso !== -1 ? metas[indiceProximoPasso] : null;

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
      onMostrarToast('🏆 Capítulo de Hoje Concluído! Você avançou um passo decisivo rumo à aprovação!');
      novoStreak = Math.max(streak, 1);
    } else {
      const meta = metas.find(m => m.id === id);
      if (meta && !meta.concluida) {
        onMostrarToast('⚔️ Ato concluído com maestria!');
      }
    }

    salvarEstado(atualizadas, novoStreak);
  };

  const adicionarMeta = (textoManual?: string, destinoAbaManual?: string, capituloManual?: string) => {
    const textoFinal = (textoManual || novoTextoMeta).trim();
    if (!textoFinal) return;

    if (metas.length >= LIMITE_MAXIMO_METAS) {
      onMostrarToast(`Limite de ${LIMITE_MAXIMO_METAS} metas atingido por hoje.`);
      return;
    }

    const nova: MetaDiaria = {
      id: `meta-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      capituloTitulo: capituloManual || `Ato ${metas.length + 1}: Nova Conquista`,
      texto: textoFinal,
      concluida: false,
      criadaEm: Date.now(),
      destinoAba: destinoAbaManual || (textoFinal.toLowerCase().includes('súmula') ? 'sumulas' : textoFinal.toLowerCase().includes('redig') ? 'simulador' : 'flashcards'),
      tempoEstimado: '10 min',
      dicaExecucao: 'Mantenha foco absoluto para consolidar este ponto na prova.'
    };

    const atualizadas = [...metas, nova];
    salvarEstado(atualizadas);
    if (!textoManual) setNovoTextoMeta('');
    tocarAlarmeWebAudio('suave');
    onMostrarToast('📜 Novo capítulo adicionado à sua jornada!');
  };

  const removerMeta = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const atualizadas = metas.filter(m => m.id !== id);
    salvarEstado(atualizadas);
    onMostrarToast('Ato removido da história.');
  };

  const reiniciarMetasSugeridas = () => {
    const padrao: MetaDiaria[] = [
      {
        id: `meta-${Date.now()}-1`,
        capituloTitulo: 'Ato 1: O Despertar da Jurisprudência',
        texto: 'Investigar a Súmula 166 do STJ e fixar a regra da não-incidência de ICMS',
        concluida: false,
        criadaEm: Date.now(),
        destinoAba: 'sumulas',
        tempoEstimado: '5 min',
        dicaExecucao: 'Identifique o fundamento na Súmula 166 e no Art. 155, II da CF/88.'
      },
      {
        id: `meta-${Date.now()}-2`,
        capituloTitulo: 'Ato 2: A Conquista da Folha de 150 Linhas',
        texto: 'Redigir a narrativa dos fatos e a fundamentação preliminar no Simulador FGV',
        concluida: false,
        criadaEm: Date.now() + 1,
        destinoAba: 'simulador',
        tempoEstimado: '15 min',
        dicaExecucao: 'Estruture o preâmbulo com foco nos dados exigidos pelo edital.'
      },
      {
        id: `meta-${Date.now()}-3`,
        capituloTitulo: 'Ato 3: O Selo dos 10 Pontos',
        texto: 'Testar e blindar a memória com 5 flashcards de teses repetitivas',
        concluida: false,
        criadaEm: Date.now() + 2,
        destinoAba: 'flashcards',
        tempoEstimado: '10 min',
        dicaExecucao: 'Memorize as regras de decadência (Art. 173) e prescrição (Art. 174 CTN).'
      }
    ];
    salvarEstado(padrao);
    tocarAlarmeWebAudio('suave');
    onMostrarToast('Jornada padrão restaurada com sucesso!');
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
    <div className="macos-card-interactive rounded-3xl border border-black/5 dark:border-white/10 bg-white/80 dark:bg-zinc-800/90 backdrop-blur-xl text-zinc-900 dark:text-zinc-100 p-6 lg:p-7 shadow-sm space-y-6 transition-all duration-300">
      {/* 1. TOPO: STORYTELLING HERO HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 shrink-0 animate-emerald-aura">
            <Scroll className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-medium flex-wrap">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Jornada do Tributarista</span>
              <span aria-hidden="true">·</span>
              <span>Capítulo de Hoje</span>
              <span aria-hidden="true">·</span>
              <span>{tempoRestante} até novo capítulo</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white mt-0.5 tracking-tight">
              A Saga da 2ª Fase OAB
            </h2>
          </div>
        </div>

        {streak > 0 && (
          <div
            className="rounded-2xl border border-amber-400/30 bg-amber-50/60 dark:bg-amber-950/40 px-3.5 py-1.5 text-xs font-bold text-amber-700 dark:text-amber-300 inline-flex items-center gap-1.5 shadow-xs shrink-0 self-start sm:self-auto animate-amber-aura"
            title="Sequência de dias cumpridos"
          >
            <Flame className="h-4 w-4 text-amber-500 fill-amber-500 animate-pulse" />
            <span>{streak} {streak === 1 ? 'dia consecutivo' : 'dias de constância!'}</span>
          </div>
        )}
      </div>

      {/* 2. PROGRESSO DA HISTÓRIA DE HOJE */}
      <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-zinc-50/70 dark:bg-zinc-900/60 p-4.5 space-y-3 transition-all">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <span className="font-semibold text-zinc-900 dark:text-white">
              {concluidasCount} de {totalMetas} atos desbravados ({percentualProgresso}%)
            </span>
          </div>
          <span className="font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            {todasConcluidas ? 'Capítulo Cumprido 🏆' : `${totalMetas - concluidasCount} atos restantes`}
          </span>
        </div>

        {/* Linha da Jornada com Gradiente Fluido Animado */}
        <div className="h-2.5 w-full bg-black/5 dark:bg-white/10 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-400 rounded-full animate-gradient-flow shadow-[0_0_12px_rgba(16,185,129,0.35)] transition-all duration-700"
            style={{ width: `${percentualProgresso}%` }}
          />
        </div>
      </div>

      {/* 3. ATO EM DESTAQUE (CONVITE ATIVO PARA O PRÓXIMO ATO DA NARRATIVA COM AURA) */}
      {!todasConcluidas && proximoPasso ? (
        <div className="rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30 dark:from-emerald-950/30 dark:via-zinc-800/95 dark:to-zinc-800/95 p-5 shadow-sm space-y-3.5 transition-all animate-emerald-aura">
          <div className="flex items-center justify-between text-xs flex-wrap gap-2">
            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-bold uppercase tracking-wider text-[10.5px]">
              <MapPin className="h-3.5 w-3.5 text-emerald-600" />
              <span>{proximoPasso.capituloTitulo || 'Ato em Andamento'}</span>
            </div>
            {proximoPasso.tempoEstimado && (
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                Duração estimada: ~{proximoPasso.tempoEstimado}
              </span>
            )}
          </div>

          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white leading-snug">
              {proximoPasso.texto}
            </h3>
            {proximoPasso.dicaExecucao && (
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed pt-1">
                💡 {proximoPasso.dicaExecucao}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-black/5 dark:border-white/5">
            {proximoPasso.destinoAba && onNavigateToTab && (
              <button
                type="button"
                onClick={() => onNavigateToTab(proximoPasso.destinoAba!)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-xs transition cursor-pointer active:scale-95"
              >
                <Play className="h-3 w-3 fill-current" />
                <span>Desbravar {getNomeAbaFormatado(proximoPasso.destinoAba)} →</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => alternarConclusaoMeta(proximoPasso.id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-400/60 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 font-semibold text-xs transition cursor-pointer active:scale-95"
            >
              <Check className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Concluir Ato</span>
            </button>
          </div>
        </div>
      ) : todasConcluidas ? (
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-50/50 dark:bg-emerald-950/20 p-6 text-center space-y-3">
          <div className="h-11 w-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
            <CheckCheck className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
              Capítulo Concluído com Vitória! 🏆
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 max-w-md mx-auto mt-1">
              Todos os atos do dia foram realizados. Descanse ou avance no simulador semanal.
            </p>
          </div>
        </div>
      ) : null}

      {/* 4. LINHA DO TEMPO DA HISTÓRIA COM TODOS OS ATOS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400 font-medium">
          <span>Atos da História de Hoje ({concluidasCount}/{totalMetas})</span>
          {metas.length > 0 && (
            <button
              onClick={reiniciarMetasSugeridas}
              className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              Restaurar narrativa padrão
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
                    ? 'border-emerald-300/40 dark:border-emerald-800/30 bg-emerald-50/30 dark:bg-emerald-950/15 text-zinc-400 dark:text-zinc-500'
                    : isAtiva
                    ? 'border-emerald-400 bg-white dark:bg-zinc-800 ring-2 ring-emerald-400/20 shadow-sm'
                    : 'border-black/5 dark:border-white/10 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-xl border text-xs font-bold transition-all ${
                      meta.concluida
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : isAtiva
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                        : 'border-black/15 dark:border-white/15 bg-zinc-50 dark:bg-zinc-900 text-zinc-400'
                    }`}
                  >
                    {meta.concluida ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : idx + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
                      {meta.capituloTitulo || `Ato ${idx + 1}`}
                    </span>
                    <span
                      className={`text-xs font-medium leading-relaxed block ${
                        meta.concluida ? 'line-through text-zinc-400 dark:text-zinc-500 italic' : 'text-zinc-900 dark:text-white font-semibold'
                      }`}
                    >
                      {meta.texto}
                    </span>
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
                      className="px-2.5 py-1 rounded-xl text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition inline-flex items-center gap-1"
                    >
                      <span>{getNomeAbaFormatado(meta.destinoAba)}</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={(e) => removerMeta(meta.id, e)}
                    className="p-1 text-zinc-400 hover:text-rose-500 transition rounded-lg"
                    title="Excluir ato"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. ADICIONAR NOVO ATO DA HISTÓRIA */}
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
            placeholder="Adicionar novo ato à jornada (ex: Revisar Art. 150 CF)..."
            disabled={metas.length >= LIMITE_MAXIMO_METAS}
            className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900 pl-9 pr-3.5 py-2.5 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-500 transition"
            maxLength={120}
          />
          <Plus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
        </div>
        <button
          type="submit"
          disabled={!novoTextoMeta.trim() || metas.length >= LIMITE_MAXIMO_METAS}
          className="rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-4 py-2.5 text-xs font-semibold text-white transition inline-flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0 active:scale-95"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Adicionar</span>
        </button>
      </form>
    </div>
  );
};
