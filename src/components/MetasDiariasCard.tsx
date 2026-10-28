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
  { texto: 'Ler 10 Súmulas Tributárias (STF/STJ)', aba: 'sumulas', icone: '📖' },
  { texto: 'Redigir 1 Parágrafo na Folha FGV', aba: 'simulador', icone: '✍️' },
  { texto: 'Revisar 5 Flashcards da 2ª Fase', aba: 'flashcards', icone: '⚡' },
  { texto: 'Identificar 1 Peça no Peçômetro', aba: 'pecas', icone: '🎯' },
  { texto: 'Marcar 3 Artigos no Vade Mecum', aba: 'vademecum', icone: '🖍️' },
  { texto: 'Estudar 1 Precedente Qualificado', aba: 'material', icone: '⚖️' }
];

export const MetasDiariasCard: React.FC<MetasDiariasCardProps> = ({
  onNavigateToTab,
  onMostrarToast
}) => {
  const [tempoRestante, setTempoRestante] = useState<string>(getTempoAteMeiaNoite());
  const [novoTextoMeta, setNovoTextoMeta] = useState('');
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);

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
        texto: 'Ler 10 súmulas tributárias essenciais (STF/STJ)',
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
        onMostrarToast('🎉 Parabéns! Todas as 3 micro-metas de hoje foram concluídas com sucesso!');
      } else {
        onMostrarToast(`✓ Micro-meta cumprida! Faltam apenas ${faltam} para fechar o dia.`);
      }
    } else {
      onMostrarToast('Micro-meta reaberta.');
    }
  };

  // Adiciona uma nova meta (máximo 3)
  const adicionarMeta = (textoParaAdicionar?: string, abaDestino?: string) => {
    const texto = (textoParaAdicionar || novoTextoMeta).trim();
    if (!texto) {
      onMostrarToast('Por favor, informe a descrição da sua micro-meta.');
      return;
    }

    if (metas.length >= 3) {
      onMostrarToast('⚠️ Limite de 3 micro-metas atingido! O método foca na consistência sem sobrecarga.');
      return;
    }

    // Auto-detecta aba recomendada pelo conteúdo
    let aba = abaDestino;
    if (!aba) {
      const lower = texto.toLowerCase();
      if (lower.includes('súmula') || lower.includes('sumula')) aba = 'sumulas';
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
    onMostrarToast(`🎯 Micro-meta adicionada (${atualizadas.length}/3)!`);
  };

  // Remove uma meta individual
  const removerMeta = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const atualizadas = metas.filter(m => m.id !== id);
    salvarEstado(atualizadas);
    onMostrarToast('Micro-meta removida.');
  };

  // Reinicia as metas de hoje com sugestões clássicas FGV
  const reiniciarMetasSugeridas = () => {
    const padrao: MetaDiaria[] = [
      {
        id: `meta-${Date.now()}-1`,
        texto: 'Ler 10 súmulas tributárias essenciais (STF/STJ)',
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
    onMostrarToast('3 micro-metas recomendadas carregadas para hoje!');
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
    <div className="rounded-2xl border border-emerald-500/50 bg-[#2b3646] p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500 text-emerald-400 shadow-xs">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="badge b-VERDE text-[10px]">Micro-Hábitos FGV</span>
              <span className="text-[11px] text-slate-300 font-mono">Consistência Diária</span>
              <span className="text-[11px] text-amber-300 bg-amber-400/15 border border-amber-400/30 px-2 py-0.5 rounded-full inline-flex items-center gap-1 font-semibold">
                <Clock className="h-3 w-3" /> Limpa às 00:00 (em {tempoRestante})
              </span>
            </div>
            <h2 className="text-base font-bold text-white mt-0.5 flex items-center gap-2">
              Metas Diárias de Foco
              <span className="text-xs font-normal text-slate-300">
                (Até 3 micro-ações sem sobrecarga)
              </span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {streak > 0 && (
            <div
              className="rounded-full border border-amber-500/50 bg-amber-950/30 px-3 py-1 text-xs font-bold text-amber-300 inline-flex items-center gap-1.5 shadow-xs"
              title="Dias consecutivos cumprindo metas diárias"
            >
              <Flame className="h-3.5 w-3.5 text-amber-400 fill-amber-400 animate-pulse" />
              <span>{streak} {streak === 1 ? 'dia de constância' : 'dias de constância'}</span>
            </div>
          )}

          {metas.length > 0 ? (
            <button
              onClick={limparMetasManual}
              className="rounded-full border border-slate-600 bg-slate-800 hover:bg-slate-700 px-3 py-1 text-[11px] text-slate-300 hover:text-white transition cursor-pointer"
              title="Limpar metas de hoje para começar do zero"
            >
              Limpar metas
            </button>
          ) : (
            <button
              onClick={reiniciarMetasSugeridas}
              className="rounded-full border border-emerald-400 bg-emerald-600 hover:bg-emerald-500 px-3 py-1 text-[11px] font-semibold text-white transition inline-flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <RotateCcw className="h-3 w-3" /> Carregar Sugestões (3)
            </button>
          )}
        </div>
      </div>

      {/* Barra de Progresso do Dia */}
      <div className="rounded-xl border border-[#455468] bg-[#344154] p-3.5 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">Progresso de Hoje:</span>
            <span className="font-mono text-emerald-400 font-bold">
              {concluidasCount} de {totalMetas} {totalMetas === 1 ? 'meta cumprida' : 'metas cumpridas'} ({percentualProgresso}%)
            </span>
          </div>

          <div className="text-[11px] text-slate-300 flex items-center gap-1">
            <span>{totalMetas}/3 slots em uso</span>
          </div>
        </div>

        <div className="h-2.5 w-full overflow-hidden rounded-full border border-[#455468] bg-[#1b232e]">
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
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 bg-emerald-950/40 border border-emerald-500/40 rounded-lg p-2 mt-1">
            <Sparkles className="h-4 w-4 text-emerald-400 shrink-0 animate-spin" />
            <span>
              Excelente trabalho! Todas as 3 micro-metas de hoje foram concluídas. Sua constância diária constrói a aprovação!
            </span>
          </div>
        )}
      </div>

      {/* Lista das Micro-Metas Diárias (Até 3) */}
      <div className="space-y-2">
        {metas.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#455468] p-5 text-center space-y-3">
            <Target className="h-8 w-8 text-slate-400 mx-auto opacity-60" />
            <div>
              <p className="text-xs font-semibold text-white">Nenhuma micro-meta definida para hoje.</p>
              <p className="text-[11px] text-slate-300 mt-1 max-w-md mx-auto">
                Adicione até 3 metas curtas e factíveis (ex: ler 10 súmulas, redigir 1 parágrafo, revisar 5 flashcards). Às 00:00 elas serão zeradas automaticamente para não acumular pendências.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-2 flex-wrap">
              <button
                onClick={reiniciarMetasSugeridas}
                className="rounded-full border border-emerald-400 bg-emerald-600 hover:bg-emerald-500 px-4 py-1.5 text-xs font-bold text-white transition shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" /> Adicionar 3 Metas Recomendadas
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
                  ? 'border-emerald-500/40 bg-emerald-950/20 text-slate-300'
                  : 'border-[#455468] bg-[#344154] text-slate-100 hover:border-sky-400 hover:bg-[#3d4d63]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    alternarConclusaoMeta(meta.id);
                  }}
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition ${
                    meta.concluida
                      ? 'border-emerald-400 bg-emerald-500 text-white shadow-xs'
                      : 'border-slate-400 bg-[#1b232e] text-transparent hover:border-emerald-400'
                  }`}
                  aria-label={meta.concluida ? 'Desmarcar meta' : 'Concluir meta'}
                >
                  <Check className={`h-3.5 w-3.5 stroke-[3] ${meta.concluida ? 'opacity-100' : 'opacity-0'}`} />
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400">#{idx + 1}</span>
                    <span
                      className={`text-xs font-medium leading-snug break-words ${
                        meta.concluida
                          ? 'line-through text-slate-400 italic'
                          : 'text-white'
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
                    className="rounded-full border border-sky-500/40 bg-[#1b232e] hover:bg-sky-950/60 px-2.5 py-1 text-[10.5px] font-semibold text-sky-300 transition inline-flex items-center gap-1 cursor-pointer"
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
                  className="rounded-lg p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition opacity-80 group-hover:opacity-100 cursor-pointer"
                  title="Excluir esta micro-meta"
                  aria-label="Excluir micro-meta"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Formulário de Adição (se menos de 3 metas) */}
      {metas.length < 3 ? (
        <div className="space-y-3 pt-1 border-t border-[#455468]/60">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              adicionarMeta();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={novoTextoMeta}
              onChange={(e) => setNovoTextoMeta(e.target.value)}
              placeholder={`Escreva sua ${metas.length + 1}ª micro-meta (ex: ler 10 súmulas, redigir 1 parágrafo)...`}
              className="flex-1 rounded-xl border border-[#56677d] bg-[#1b232e] px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition"
              maxLength={100}
            />
            <button
              type="submit"
              disabled={!novoTextoMeta.trim()}
              className="rounded-xl border border-emerald-400 bg-emerald-600 disabled:opacity-50 disabled:hover:bg-emerald-600 hover:bg-emerald-500 px-3.5 py-2 text-xs font-semibold text-white transition inline-flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
            >
              <Plus className="h-3.5 w-3.5" /> Adicionar ({metas.length}/3)
            </button>
          </form>

          {/* Sugestões Rápidas de 1 Clique */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-300">
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-amber-400" /> Sugestões Rápidas de 1 Clique:
              </span>
              <span className="text-[10px] text-slate-400">Clique para preencher seu slot diário</span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {SUGESTOES_RAPIDAS.map((sug, idx) => {
                const jaAdicionada = metas.some(m => m.texto.toLowerCase().includes(sug.texto.toLowerCase().slice(0, 15)));
                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={jaAdicionada || metas.length >= 3}
                    onClick={() => adicionarMeta(sug.texto, sug.aba)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition inline-flex items-center gap-1 cursor-pointer border ${
                      jaAdicionada
                        ? 'border-emerald-500/30 bg-emerald-950/30 text-emerald-300 opacity-60 cursor-not-allowed'
                        : 'border-[#455468] bg-[#1b232e] text-slate-200 hover:border-emerald-400 hover:bg-[#253243]'
                    }`}
                  >
                    <span>{sug.icone}</span>
                    <span>{sug.texto}</span>
                    {jaAdicionada && <Check className="h-3 w-3 text-emerald-400 ml-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-[#455468]/60 bg-[#1b232e]/60 p-3 text-center text-xs text-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11.5px]">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>
              Capacidade máxima de 3 micro-metas diárias atingida. O método visa evitar sobrecarga e focar na constância.
            </span>
          </div>
          <span className="text-[10.5px] text-slate-400 shrink-0 font-mono">
            Renovação automática às 00:00
          </span>
        </div>
      )}
    </div>
  );
};
