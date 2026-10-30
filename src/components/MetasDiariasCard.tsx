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
  HelpCircle
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
}

interface MetasDiariasCardProps {
  onNavigateToTab?: (tab: string) => void;
  onMostrarToast: (msg: string) => void;
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
  { texto: 'Rever Súmula 166 STJ', aba: 'sumulas', icone: '⭐' },
  { texto: 'Ler 10 Súmulas Tributárias (STF/STJ)', aba: 'sumulas', icone: '📖' },
  { texto: 'Redigir 1 Parágrafo na Folha FGV', aba: 'simulador', icone: '✍️' },
  { texto: 'Revisar 5 Flashcards da 2ª Fase', aba: 'flashcards', icone: '⚡' },
  { texto: 'Identificar 1 Peça no Peçômetro', aba: 'pecas', icone: '🎯' },
  { texto: 'Marcar Artigos 150 e 151 CTN', aba: 'vademecum', icone: '🖍️' },
  { texto: 'Estudar 1 Precedente Qualificado', aba: 'material', icone: '⚖️' }
];

export const LIMITE_MAXIMO_METAS = 6;

export const MetasDiariasCard: React.FC<MetasDiariasCardProps> = ({
  onNavigateToTab,
  onMostrarToast
}) => {
  const [tempoRestante, setTempoRestante] = useState<string>(getTempoAteMeiaNoite());
  const [novoTextoMeta, setNovoTextoMeta] = useState('');

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

    // Inicialização padrão amigável para o primeiro acesso
    const defaultMetas: MetaDiaria[] = [
      {
        id: 'meta-1',
        texto: 'Rever Súmula 166 STJ (ICMS entre estabelecimentos)',
        concluida: false,
        criadaEm: Date.now(),
        destinoAba: 'sumulas'
      },
      {
        id: 'meta-2',
        texto: 'Redigir 1 parágrafo na folha FGV de 150 linhas',
        concluida: false,
        criadaEm: Date.now() + 1,
        destinoAba: 'simulador'
      },
      {
        id: 'meta-3',
        texto: 'Revisar 5 flashcards da 2ª Fase OAB',
        concluida: false,
        criadaEm: Date.now() + 2,
        destinoAba: 'flashcards'
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

  // Monitor de meia-noite (00:00) — limpa automaticamente as metas ao virar o dia
  useEffect(() => {
    const checarViradaDoDia = () => {
      const hoje = getHojeDataString();
      setTempoRestante(getTempoAteMeiaNoite());

      try {
        const raw = SafeStorage.get('tributa_metas_diarias_v1', '');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.data && parsed.data !== hoje) {
            // O relógio cruzou a meia-noite (00:00)!
            const todasConcluidas =
              parsed.metas &&
              parsed.metas.length > 0 &&
              parsed.metas.every((m: MetaDiaria) => m.concluida);
            const streakAtualizado = todasConcluidas ? (parsed.streak || 0) + 1 : 0;

            const novoEstado = {
              data: hoje,
              metas: [], // Auto-limpeza às 00:00
              streak: streakAtualizado
            };

            setEstadoMetas({ metas: [], streak: streakAtualizado });
            SafeStorage.set('tributa_metas_diarias_v1', JSON.stringify(novoEstado));
            onMostrarToast('🌅 Meia-noite alcançada! As micro-metas diárias foram limpas para um novo dia de foco.');
          }
        }
      } catch {
        // Fallback
      }
    };

    checarViradaDoDia();
    const interval = setInterval(checarViradaDoDia, 15000);
    return () => clearInterval(interval);
  }, [onMostrarToast]);

  // Contadores e métricas de progresso
  const totalMetas = metas.length;
  const concluidasCount = useMemo(() => metas.filter(m => m.concluida).length, [metas]);
  const todasConcluidas = totalMetas > 0 && concluidasCount === totalMetas;
  const percentualProgresso = totalMetas > 0 ? Math.round((concluidasCount / totalMetas) * 100) : 0;

  // Alterna o estado de conclusão de uma meta
  const alternarConclusaoMeta = (id: string) => {
    const atualizadas = metas.map(m => {
      if (m.id === id) {
        return { ...m, concluida: !m.concluida };
      }
      return m;
    });

    const metaModificada = atualizadas.find(m => m.id === id);
    const estaConcluindo = metaModificada?.concluida;

    salvarEstado(atualizadas);

    if (estaConcluindo) {
      tocarAlarmeWebAudio('suave');
      const faltam = atualizadas.filter(m => !m.concluida).length;
      if (faltam === 0 && atualizadas.length > 0) {
        dispararConfetesSuaves({ count: 65, originY: 0.35 });
        onMostrarToast('🎉 Parabéns! Todas as tarefas e metas diárias de hoje foram concluídas com sucesso!');
      } else {
        onMostrarToast(`✓ Tarefa cumprida! Faltam apenas ${faltam} para fechar o dia.`);
      }
    } else {
      onMostrarToast('Tarefa reaberta.');
    }
  };

  // Adiciona uma nova meta ou tarefa rápida (limite flexível e sem sobrecarga)
  const adicionarMeta = (textoParaAdicionar?: string, abaDestino?: string) => {
    const texto = (textoParaAdicionar || novoTextoMeta).trim();
    if (!texto) {
      onMostrarToast('Por favor, informe a descrição da sua tarefa rápida.');
      return;
    }

    if (metas.length >= LIMITE_MAXIMO_METAS) {
      onMostrarToast(`⚠️ Limite de ${LIMITE_MAXIMO_METAS} tarefas diárias atingido! O método foca na consistência sem sobrecarga.`);
      return;
    }

    // Auto-detecta aba recomendada pelo conteúdo
    let aba = abaDestino;
    if (!aba) {
      const lower = texto.toLowerCase();
      if (lower.includes('súmula') || lower.includes('sumula') || lower.includes('166')) aba = 'sumulas';
      else if (lower.includes('redig') || lower.includes('parágrafo') || lower.includes('simulador') || lower.includes('linha')) aba = 'simulador';
      else if (lower.includes('flashcard')) aba = 'flashcards';
      else if (lower.includes('peça') || lower.includes('pecometro') || lower.includes('peçômetro')) aba = 'pecas';
      else if (lower.includes('vade') || lower.includes('artigo')) aba = 'vademecum';
      else if (lower.includes('precedente') || lower.includes('stf') || lower.includes('stj') || lower.includes('tese')) aba = 'material';
    }

    const nova: MetaDiaria = {
      id: `meta-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      texto,
      concluida: false,
      criadaEm: Date.now(),
      destinoAba: aba
    };

    const atualizadas = [...metas, nova];
    salvarEstado(atualizadas);
    setNovoTextoMeta('');
    tocarAlarmeWebAudio('suave');
    onMostrarToast(`🎯 Tarefa rápida adicionada (${atualizadas.length}/${LIMITE_MAXIMO_METAS})!`);
  };

  // Remove uma meta individual
  const removerMeta = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const atualizadas = metas.filter(m => m.id !== id);
    salvarEstado(atualizadas);
    onMostrarToast('Tarefa removida.');
  };

  // Reinicia as metas de hoje com sugestões clássicas FGV
  const reiniciarMetasSugeridas = () => {
    const padrao: MetaDiaria[] = [
      {
        id: `meta-${Date.now()}-1`,
        texto: 'Rever Súmula 166 STJ (ICMS entre estabelecimentos)',
        concluida: false,
        criadaEm: Date.now(),
        destinoAba: 'sumulas'
      },
      {
        id: `meta-${Date.now()}-2`,
        texto: 'Redigir 1 parágrafo na folha FGV de 150 linhas',
        concluida: false,
        criadaEm: Date.now() + 1,
        destinoAba: 'simulador'
      },
      {
        id: `meta-${Date.now()}-3`,
        texto: 'Revisar 5 flashcards da 2ª Fase OAB',
        concluida: false,
        criadaEm: Date.now() + 2,
        destinoAba: 'flashcards'
      }
    ];
    salvarEstado(padrao);
    tocarAlarmeWebAudio('suave');
    onMostrarToast('Sugestões recomendadas carregadas para hoje!');
  };

  // Limpa todas as metas de hoje manualmente
  const limparMetasManual = () => {
    salvarEstado([]);
    onMostrarToast('Metas diárias limpas. Você pode adicionar até 3 novas micro-metas.');
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
      case 'material':
        return 'Precedentes';
      default:
        return 'Abrir Módulo';
    }
  };

  return (
    <div className="rounded-2xl border border-emerald-500/40 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-xs">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="badge b-VERDE text-[10px]">Micro-Hábitos FGV</span>
              <span className="text-[11px] text-zinc-500 dark:text-slate-300 font-mono">Consistência Diária</span>
              <span className="text-[11px] text-amber-700 dark:text-amber-300 bg-amber-400/15 border border-amber-400/30 px-2 py-0.5 rounded-full inline-flex items-center gap-1 font-semibold">
                <Clock className="h-3 w-3" /> Limpa às 00:00 (em {tempoRestante})
              </span>
            </div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-white mt-0.5 flex items-center gap-2">
              Metas Diárias & Tarefas Rápidas
              <span className="text-xs font-normal text-zinc-500 dark:text-slate-300">
                (Micro-ações diárias com checkbox • Reseta às 00:00)
              </span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {streak > 0 && (
            <div
              className="rounded-full border border-amber-500/40 bg-amber-50 dark:bg-amber-950/30 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-300 inline-flex items-center gap-1.5 shadow-xs"
              title="Dias consecutivos cumprindo metas diárias"
            >
              <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-500 animate-pulse" />
              <span>{streak} {streak === 1 ? 'dia de constância' : 'dias de constância'}</span>
            </div>
          )}

          {metas.length > 0 ? (
            <button
              onClick={limparMetasManual}
              className="rounded-full border border-black/10 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1 text-[11px] text-zinc-600 dark:text-slate-300 hover:text-zinc-900 dark:hover:text-white transition cursor-pointer"
              title="Limpar tarefas de hoje para começar do zero"
            >
              Limpar tarefas
            </button>
          ) : (
            <button
              onClick={reiniciarMetasSugeridas}
              className="rounded-full border border-emerald-400 bg-emerald-600 hover:bg-emerald-500 px-3 py-1 text-[11px] font-semibold text-white transition inline-flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <RotateCcw className="h-3 w-3" /> Carregar Sugestões
            </button>
          )}
        </div>
      </div>

      {/* Barra de Progresso do Dia */}
      <div className="rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-zinc-800/90 p-3.5 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-900 dark:text-white">Progresso de Hoje:</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              {concluidasCount} de {totalMetas} {totalMetas === 1 ? 'tarefa cumprida' : 'tarefas cumpridas'} ({percentualProgresso}%)
            </span>
          </div>

          <div className="text-[11px] text-zinc-500 dark:text-slate-300 flex items-center gap-1">
            <span>{totalMetas}/{LIMITE_MAXIMO_METAS} slots em uso</span>
          </div>
        </div>

        <div className="h-2.5 w-full overflow-hidden rounded-full border border-black/10 dark:border-white/10 bg-slate-200 dark:bg-zinc-900">
          <div
            className={`h-full transition-all duration-500 ${
              todasConcluidas
                ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]'
                : 'bg-gradient-to-r from-emerald-500 to-sky-500'
            }`}
            style={{ width: `${percentualProgresso}%` }}
          ></div>
        </div>

        {todasConcluidas && (
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/40 rounded-lg p-2 mt-1">
            <Sparkles className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0 animate-spin" />
            <span>
              Excelente trabalho! Todas as tarefas e metas de hoje foram concluídas. Sua constância diária constrói a aprovação!
            </span>
          </div>
        )}
      </div>

      {/* CAMPO DE ENTRADA DE TAREFA RÁPIDA (SEMPRE ACESSÍVEL) */}
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-zinc-800/60 p-3.5 space-y-3 shadow-inner">
        <div className="flex items-center justify-between text-xs flex-wrap gap-1">
          <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5" /> Adicionar Tarefa Rápida
          </span>
          <span className="text-[11px] text-zinc-600 dark:text-slate-300">
            {metas.length < LIMITE_MAXIMO_METAS ? (
              <span>{LIMITE_MAXIMO_METAS - metas.length} {LIMITE_MAXIMO_METAS - metas.length === 1 ? 'vaga restante' : 'vagas restantes'} hoje</span>
            ) : (
              <span className="text-amber-600 dark:text-amber-400 font-medium">Limite de {LIMITE_MAXIMO_METAS} tarefas atingido</span>
            )}
          </span>
        </div>

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
              placeholder="Adicionar tarefa rápida (ex: Rever Súmula 166 STJ)..."
              disabled={metas.length >= LIMITE_MAXIMO_METAS}
              className="w-full rounded-xl border border-black/15 dark:border-white/15 bg-white dark:bg-zinc-900 pl-9 pr-3.5 py-2.5 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 transition disabled:opacity-60"
              maxLength={120}
            />
            <Plus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-slate-400" />
          </div>
          <button
            type="submit"
            disabled={!novoTextoMeta.trim() || metas.length >= LIMITE_MAXIMO_METAS}
            className="rounded-xl border border-emerald-400 bg-emerald-600 disabled:opacity-50 disabled:hover:bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-white transition inline-flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Adicionar Tarefa</span>
          </button>
        </form>

        {/* Sugestões Rápidas de 1 Clique */}
        <div className="space-y-1.5 pt-1 border-t border-black/10 dark:border-slate-700/60">
          <div className="flex items-center justify-between text-[11px] text-zinc-600 dark:text-slate-300">
            <span className="flex items-center gap-1 font-medium">
              <Sparkles className="h-3 w-3 text-amber-500 dark:text-amber-400" /> Sugestões Rápidas de 1 Clique:
            </span>
            <span className="text-[10px] text-zinc-500 dark:text-slate-400">Clique para adicionar ao seu dia</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {SUGESTOES_RAPIDAS.map((sug, idx) => {
              const jaAdicionada = metas.some(m => m.texto.toLowerCase().includes(sug.texto.toLowerCase().slice(0, 15)));
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={jaAdicionada || metas.length >= LIMITE_MAXIMO_METAS}
                  onClick={() => adicionarMeta(sug.texto, sug.aba)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition inline-flex items-center gap-1 cursor-pointer border ${
                    jaAdicionada
                      ? 'border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 opacity-60 cursor-not-allowed'
                      : 'border-black/10 dark:border-[#455468] bg-white dark:bg-[#1b232e] text-zinc-700 dark:text-slate-200 hover:border-emerald-500 hover:bg-slate-50 dark:hover:bg-[#253243]'
                  }`}
                  title={jaAdicionada ? 'Já adicionada hoje' : `Adicionar "${sug.texto}"`}
                >
                  <span>{sug.icone}</span>
                  <span>{sug.texto}</span>
                  {jaAdicionada && <Check className="h-3 w-3 text-emerald-500 dark:text-emerald-400 ml-0.5" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lista das Micro-Metas e Tarefas Diárias */}
      <div className="space-y-2">
        {metas.length === 0 ? (
          <div className="rounded-xl border border-dashed border-black/15 dark:border-[#455468] p-5 text-center space-y-3">
            <Target className="h-8 w-8 text-zinc-400 dark:text-slate-400 mx-auto opacity-60" />
            <div>
              <p className="text-xs font-semibold text-zinc-900 dark:text-white">Nenhuma tarefa definida para hoje.</p>
              <p className="text-[11px] text-zinc-600 dark:text-slate-300 mt-1 max-w-md mx-auto">
                Digite uma tarefa rápida no campo acima (ex: Rever Súmula 166 STJ) ou clique em uma das sugestões rápidas. Às 00:00 o checklist é zerado automaticamente para não acumular pendências.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-2 flex-wrap">
              <button
                onClick={reiniciarMetasSugeridas}
                className="rounded-full border border-emerald-400 bg-emerald-600 hover:bg-emerald-500 px-4 py-1.5 text-xs font-bold text-white transition shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" /> Carregar Tarefas Recomendadas
              </button>
            </div>
          </div>
        ) : (
          metas.map((meta, idx) => (
            <div
              key={meta.id}
              onClick={() => alternarConclusaoMeta(meta.id)}
              className={`group flex items-center justify-between gap-3 rounded-xl border p-3 transition cursor-pointer ${
                meta.concluida
                  ? 'border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/20 text-zinc-500 dark:text-slate-400'
                  : 'border-black/10 dark:border-[#455468] bg-slate-50 dark:bg-[#344154] text-zinc-900 dark:text-slate-100 hover:border-sky-400 hover:bg-slate-100 dark:hover:bg-[#3d4d63]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Checkbox de Conclusão */}
                <label
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center cursor-pointer select-none"
                  title={meta.concluida ? 'Desmarcar conclusão' : 'Marcar como concluída'}
                >
                  <input
                    type="checkbox"
                    checked={meta.concluida}
                    onChange={() => alternarConclusaoMeta(meta.id)}
                    className="sr-only"
                    aria-label={`Concluir tarefa: ${meta.texto}`}
                  />
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                      meta.concluida
                        ? 'border-emerald-400 bg-emerald-500 text-white shadow-xs'
                        : 'border-zinc-300 dark:border-slate-400 bg-white dark:bg-[#1b232e] hover:border-emerald-400'
                    }`}
                  >
                    <Check
                      className={`h-3.5 w-3.5 stroke-[3] transition-opacity ${
                        meta.concluida ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  </div>
                </label>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-zinc-400 dark:text-slate-400">#{idx + 1}</span>
                    <span
                      className={`text-xs font-medium leading-snug break-words transition-colors ${
                        meta.concluida
                          ? 'line-through text-zinc-400 dark:text-slate-400 italic'
                          : 'text-zinc-900 dark:text-white'
                      }`}
                    >
                      {meta.texto}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Botão de Atalho para a Aba Relevante */}
                {meta.destinoAba && onNavigateToTab && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateToTab(meta.destinoAba!);
                    }}
                    className="rounded-full border border-sky-500/40 bg-sky-50 dark:bg-[#1b232e] hover:bg-sky-100 dark:hover:bg-sky-950/60 px-2.5 py-1 text-[10.5px] font-semibold text-sky-700 dark:text-sky-300 transition inline-flex items-center gap-1 cursor-pointer"
                    title={`Ir para o módulo de ${getNomeAbaFormatado(meta.destinoAba)}`}
                  >
                    <span>{getNomeAbaFormatado(meta.destinoAba)}</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                )}

                {/* Botão de Excluir */}
                <button
                  type="button"
                  onClick={(e) => removerMeta(meta.id, e)}
                  className="rounded-lg p-1.5 text-zinc-400 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition opacity-80 group-hover:opacity-100 cursor-pointer"
                  title="Excluir esta tarefa"
                  aria-label="Excluir tarefa"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Rodapé Informativo: Reset à Meia-Noite */}
      <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-slate-400 pt-1 border-t border-black/10 dark:border-[#455468]/60 flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 text-zinc-600 dark:text-slate-300">
          <Clock className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
          <span>Checkboxes e tarefas são resetados automaticamente todo dia às 00:00.</span>
        </span>
        <span className="font-mono text-amber-600 dark:text-amber-300/90 font-medium">
          Próximo reset em {tempoRestante}
        </span>
      </div>
    </div>
  );
};
