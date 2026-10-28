import React, { useState, useEffect, useMemo } from 'react';
import {
  Lightbulb,
  Sparkles,
  Volume2,
  VolumeX,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  RotateCcw,
  Bookmark,
  Clock,
  BookOpen,
  Wand2,
  Loader2,
  Bot,
  Trash2,
  History,
  Tag
} from 'lucide-react';
import {
  DICAS_TRIBUTARIAS,
  DicaTributaria,
  getIndiceDicaDoDia,
  getTempoAteProximaTroca
} from '../data/dicasData';
import { SafeStorage } from '../utils/storage';
import { lerTextoEmVozAlta } from '../utils/audio';

interface DicaDoDiaCardProps {
  onNavigateToTab?: (tab: string) => void;
  onMostrarToast: (msg: string) => void;
}

export const DicaDoDiaCard: React.FC<DicaDoDiaCardProps> = ({
  onNavigateToTab,
  onMostrarToast
}) => {
  // Índice determinístico do dia de hoje no acervo fixo (alterna a cada 24 horas à meia-noite)
  const indiceHoje = getIndiceDicaDoDia(DICAS_TRIBUTARIAS.length);

  // Dicas geradas por IA recuperadas e persistidas no LocalStorage
  const [dicasIA, setDicasIA] = useState<DicaTributaria[]>(() => {
    try {
      return JSON.parse(SafeStorage.get('tributa_dicas_ia', '[]'));
    } catch {
      return [];
    }
  });

  // Lista unificada: primeiro as geradas por IA (mais recentes no topo), seguidas pelas pré-definidas
  const listaCompleta = useMemo(() => {
    return [...dicasIA, ...DICAS_TRIBUTARIAS];
  }, [dicasIA]);

  // Dica ativa persistida no LocalStorage (seja a dica do dia padrão ou uma gerada/selecionada pelo usuário)
  const [dicaAtivaId, setDicaAtivaId] = useState<number>(() => {
    try {
      const salvo = SafeStorage.get('tributa_dica_ativa_id', '');
      if (salvo) {
        const idSalvo = Number(salvo);
        if (!isNaN(idSalvo)) return idSalvo;
      }
    } catch {
      // ignora
    }
    // Caso padrão: dica do dia de hoje do array pré-definido
    return DICAS_TRIBUTARIAS[indiceHoje]?.id ?? 1;
  });

  // Tempo restante para a próxima rotação diária (ex: "13h 45m")
  const [tempoRestante, setTempoRestante] = useState<string>(getTempoAteProximaTroca());

  // Estado de carregamento da chamada à IA
  const [gerandoIA, setGerandoIA] = useState<boolean>(false);

  // Painel de histórico de dicas geradas por IA
  const [mostrarHistoricoIA, setMostrarHistoricoIA] = useState<boolean>(false);

  // Estado de áudio (se está narrando a dica)
  const [narrando, setNarrando] = useState<boolean>(false);

  // Estado de cópia (feedback visual)
  const [copiado, setCopiado] = useState<boolean>(false);

  // Dicas favoritadas salvas em LocalStorage
  const [favoritos, setFavoritos] = useState<number[]>(() => {
    try {
      return JSON.parse(SafeStorage.get('tributa_dicas_favoritas', '[]'));
    } catch {
      return [];
    }
  });

  // Identifica a dica atualmente ativa com base no id
  const dicaAtualIndex = listaCompleta.findIndex((d) => d.id === dicaAtivaId);
  const dicaAtual: DicaTributaria =
    dicaAtualIndex !== -1 ? listaCompleta[dicaAtualIndex] : DICAS_TRIBUTARIAS[indiceHoje] || DICAS_TRIBUTARIAS[0];

  const dicaDeHojePadrao = DICAS_TRIBUTARIAS[indiceHoje];
  const isDicaDeHoje = dicaAtual.id === dicaDeHojePadrao?.id && !dicaAtual.isAiGenerated;
  const isFavorita = favoritos.includes(dicaAtual.id);

  // Persiste a dica ativa sempre que mudar
  useEffect(() => {
    SafeStorage.set('tributa_dica_ativa_id', String(dicaAtual.id));
  }, [dicaAtual.id]);

  // Atualiza contagem regressiva para a próxima rotação a cada 1 minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setTempoRestante(getTempoAteProximaTroca());
      // Se virar o dia e o usuário não tiver navegado manualmente para uma dica de IA
      const novoHoje = getIndiceDicaDoDia(DICAS_TRIBUTARIAS.length);
      if (novoHoje !== indiceHoje && isDicaDeHoje) {
        const novaDicaHoje = DICAS_TRIBUTARIAS[novoHoje];
        if (novaDicaHoje) {
          setDicaAtivaId(novaDicaHoje.id);
        }
      }
    }, 60000);
    return () => clearInterval(timer);
  }, [indiceHoje, isDicaDeHoje]);

  // Cancela áudio ao desmontar ou trocar de dica
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setNarrando(false);
    }
  }, [dicaAtual.id]);

  // GERAR NOVA DICA COM IA E PERSISTIR NO LOCALSTORAGE
  const gerarDicaComIA = async () => {
    if (gerandoIA) return;
    setGerandoIA(true);

    try {
      const response = await fetch('/api/gerar-dica', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`Erro na resposta do servidor (${response.status})`);
      }

      const data = await response.json();
      if (!data.success || !data.dica) {
        throw new Error(data.error || 'Não foi possível gerar a dica');
      }

      const novaDica: DicaTributaria = data.dica;

      // Adiciona à lista de dicas geradas por IA (novas no início)
      const novoArrayIA = [novaDica, ...dicasIA];
      setDicasIA(novoArrayIA);

      // Define como a dica ativa imediatamente
      setDicaAtivaId(novaDica.id);

      // Persiste no LocalStorage garantindo sincronização
      SafeStorage.set('tributa_dicas_ia', JSON.stringify(novoArrayIA));
      SafeStorage.set('tributa_dica_ativa_id', String(novaDica.id));

      onMostrarToast('Nova dica gerada com sucesso pela IA e salva no LocalStorage! ✨');
    } catch (err: any) {
      console.error('Falha ao gerar dica com IA:', err);
      // Fallback gracioso: sorteia uma do banco caso a conexão falhe
      let randomIdx = Math.floor(Math.random() * DICAS_TRIBUTARIAS.length);
      const fallbackDica = DICAS_TRIBUTARIAS[randomIdx];
      if (fallbackDica) {
        setDicaAtivaId(fallbackDica.id);
        SafeStorage.set('tributa_dica_ativa_id', String(fallbackDica.id));
      }
      onMostrarToast('IA temporariamente indisponível. Dica sorteada do acervo tributário.');
    } finally {
      setGerandoIA(false);
    }
  };

  // Alterna favorito
  const toggleFavorito = () => {
    let novos: number[];
    if (isFavorita) {
      novos = favoritos.filter((id) => id !== dicaAtual.id);
      onMostrarToast('Dica removida dos favoritos');
    } else {
      novos = [...favoritos, dicaAtual.id];
      onMostrarToast('Dica salva nos seus favoritos de Direito Tributário!');
    }
    setFavoritos(novos);
    SafeStorage.set('tributa_dicas_favoritas', JSON.stringify(novos));
  };

  // Navegação
  const irParaAnterior = () => {
    const total = listaCompleta.length;
    const currentPos = dicaAtualIndex === -1 ? 0 : dicaAtualIndex;
    const novoIndex = (currentPos - 1 + total) % total;
    setDicaAtivaId(listaCompleta[novoIndex].id);
  };

  const irParaProxima = () => {
    const total = listaCompleta.length;
    const currentPos = dicaAtualIndex === -1 ? 0 : dicaAtualIndex;
    const novoIndex = (currentPos + 1) % total;
    setDicaAtivaId(listaCompleta[novoIndex].id);
  };

  const irParaHoje = () => {
    if (dicaDeHojePadrao) {
      setDicaAtivaId(dicaDeHojePadrao.id);
      SafeStorage.set('tributa_dica_ativa_id', String(dicaDeHojePadrao.id));
      onMostrarToast('Voltando para a Dica do Dia oficial de hoje!');
    }
  };

  const sortearAleatoria = () => {
    const total = listaCompleta.length;
    let randomIdx = Math.floor(Math.random() * total);
    if (total > 1 && listaCompleta[randomIdx].id === dicaAtual.id) {
      randomIdx = (randomIdx + 1) % total;
    }
    const escolhida = listaCompleta[randomIdx];
    setDicaAtivaId(escolhida.id);
    onMostrarToast(`Dica selecionada: ${escolhida.titulo.slice(0, 32)}...`);
  };

  // Excluir uma dica gerada por IA
  const excluirDicaIA = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const novas = dicasIA.filter((d) => d.id !== id);
    setDicasIA(novas);
    SafeStorage.set('tributa_dicas_ia', JSON.stringify(novas));
    if (dicaAtivaId === id) {
      irParaHoje();
    }
    onMostrarToast('Dica de IA removida do histórico.');
  };

  // Narração por voz (SpeechSynthesis)
  const alternarNarracao = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onMostrarToast('Seu navegador não suporta leitura por voz.');
      return;
    }

    if (narrando) {
      window.speechSynthesis.cancel();
      setNarrando(false);
    } else {
      const textoParaLer = `Dica de estudo sobre Direito Tributário. ${dicaAtual.titulo}. Base legal: ${dicaAtual.artigoSumula}. Tese jurídica: ${dicaAtual.tese}. Explicação: ${dicaAtual.explicacao}. Dica prática para a segunda fase da OAB: ${dicaAtual.dicaPraticaOAB}`;
      lerTextoEmVozAlta(textoParaLer);
      setNarrando(true);
      const checkEnd = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          setNarrando(false);
          clearInterval(checkEnd);
        }
      }, 500);
    }
  };

  // Copiar para a área de transferência
  const copiarDica = () => {
    const textoFormatado = `💡 DICA TRIBUTÁRIA FGV OAB 2ª FASE ${dicaAtual.isAiGenerated ? '(Gerada por IA ✨)' : `(#${dicaAtual.id})`}
📌 ${dicaAtual.titulo}
⚖️ Base: ${dicaAtual.artigoSumula}
🎯 Tese: ${dicaAtual.tese}
📖 Explicação: ${dicaAtual.explicacao}
✍️ Dica Prática OAB: ${dicaAtual.dicaPraticaOAB}
🏷️ Categoria: ${dicaAtual.categoria} | Relevância: ${dicaAtual.relevanciaFGV}`;

    navigator.clipboard
      .writeText(textoFormatado)
      .then(() => {
        setCopiado(true);
        onMostrarToast('Dica copiada com sucesso para a área de transferência!');
        setTimeout(() => setCopiado(false), 2500);
      })
      .catch(() => {
        onMostrarToast('Não foi possível copiar automaticamente.');
      });
  };

  // Cor da categoria
  const getCategoriaBadgeClass = (cat: string) => {
    switch (cat) {
      case 'Súmula Vinculante':
        return 'badge b-VERMELHO';
      case 'Prática da Peça':
        return 'badge b-AZUL';
      case 'Impostos em Espécie':
        return 'badge b-VERDE';
      case 'Processo Tributário':
        return 'badge b-ROXO';
      case 'Princípios & Imunidades':
        return 'badge b-AMARELO';
      case 'Reforma Tributária':
        return 'badge b-CIANO';
      case 'Execução Fiscal':
        return 'badge b-AZUL';
      case 'Extinção & Suspensão':
        return 'badge b-VERDE';
      default:
        return 'badge b-AZUL';
    }
  };

  return (
    <div className="win11-widget-card p-5 space-y-4 shadow-sm border border-amber-500/40 relative overflow-hidden transition-all duration-300">
      {/* Barra sutil de destaque no topo com animação se gerando por IA */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-sky-500 to-indigo-500 ${
          gerandoIA ? 'animate-pulse' : ''
        }`}
      ></div>

      {/* CABEÇALHO DO CARD */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-400/60 text-amber-500 dark:text-amber-300 shadow-sm">
            <Lightbulb className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="badge b-AMARELO text-[10px] font-bold inline-flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Dica do Dia • Direito Tributário
              </span>
              {isDicaDeHoje ? (
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700/60 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Dica de Hoje (24 Horas)
                </span>
              ) : dicaAtual.isAiGenerated ? (
                <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-0.5 rounded-full border border-indigo-300 dark:border-indigo-700 flex items-center gap-1 shadow-xs">
                  <Bot className="h-3 w-3 text-indigo-500" />
                  Gerada por IA • Salva no LocalStorage
                </span>
              ) : (
                <span className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-300 dark:border-slate-700">
                  Navegando acervo #{dicaAtualIndex + 1} de {listaCompleta.length}
                </span>
              )}
            </div>
            <h2 className="text-base font-bold text-slate-800 dark:text-white mt-0.5 flex items-center gap-2">
              Dica Estratégica para a 2ª Fase OAB
            </h2>
          </div>
        </div>

        {/* Status de Rotação Automática & Botões Rápidos */}
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#1b232e] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#455468]"
            title="A dica padrão troca automaticamente a cada 24 horas à meia-noite local."
          >
            <Clock className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-[11px]">
              Próxima troca em: <strong className="font-mono">{tempoRestante}</strong>
            </span>
          </div>

          {!isDicaDeHoje && (
            <button
              onClick={irParaHoje}
              className="win11-btn-secondary text-[11px] py-1 px-2.5 inline-flex items-center gap-1 text-sky-600 dark:text-sky-300 font-semibold"
              title="Voltar para a dica automática de hoje"
            >
              <RotateCcw className="h-3 w-3" /> Hoje
            </button>
          )}

          {dicasIA.length > 0 && (
            <button
              onClick={() => setMostrarHistoricoIA(!mostrarHistoricoIA)}
              className="win11-btn-secondary text-[11px] py-1 px-2.5 inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-300"
              title="Ver histórico de dicas geradas com IA"
            >
              <History className="h-3 w-3" />
              <span>IA ({dicasIA.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* PAINEL RECOLHÍVEL DO HISTÓRICO DE DICAS GERADAS POR IA */}
      {mostrarHistoricoIA && dicasIA.length > 0 && (
        <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-2 win11-animate">
          <div className="flex items-center justify-between text-xs font-bold text-indigo-800 dark:text-indigo-200">
            <span className="flex items-center gap-1.5">
              <Bot className="h-4 w-4 text-indigo-500" /> Dicas Geradas por IA Salvas ({dicasIA.length})
            </span>
            <span className="text-[10px] text-indigo-500 dark:text-indigo-300">
              Persistidas no LocalStorage
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {dicasIA.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setDicaAtivaId(item.id);
                  onMostrarToast(`Exibindo dica de IA: ${item.titulo.slice(0, 30)}...`);
                }}
                className={`p-2.5 rounded-lg border text-xs cursor-pointer transition flex items-start justify-between gap-2 ${
                  dicaAtual.id === item.id
                    ? 'bg-indigo-100 dark:bg-indigo-900/60 border-indigo-400 font-semibold text-indigo-900 dark:text-indigo-100 shadow-xs'
                    : 'bg-white/80 dark:bg-[#1b232e]/90 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold text-slate-800 dark:text-slate-100">
                    {item.titulo}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {item.artigoSumula}
                  </div>
                </div>
                <button
                  onClick={(e) => excluirDicaIA(item.id, e)}
                  className="p-1 text-slate-400 hover:text-red-500 transition rounded"
                  title="Excluir do LocalStorage"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONTEÚDO PRINCIPAL DA DICA */}
      <div className="win11-subcard p-4 space-y-3.5 bg-white/70 dark:bg-[#202735]/70 border border-slate-200 dark:border-slate-700/60 rounded-xl">
        {/* Metadados: Categoria, Relevância e Tag */}
        <div className="flex items-center justify-between flex-wrap gap-2 pb-1 border-b border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={getCategoriaBadgeClass(dicaAtual.categoria)}>
              {dicaAtual.categoria}
            </span>
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 font-mono">
              {dicaAtual.tag}
            </span>
            {dicaAtual.isAiGenerated && (
              <span className="badge b-ROXO text-[10px] inline-flex items-center gap-1 font-bold">
                <Sparkles className="h-3 w-3" /> IA Gemini 3.8
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
              Relevância FGV: {dicaAtual.relevanciaFGV}
            </span>
            <button
              onClick={toggleFavorito}
              className={`p-1 rounded-md transition ${
                isFavorita
                  ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/50'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={isFavorita ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
            >
              <Bookmark className={`h-4 w-4 ${isFavorita ? 'fill-amber-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Título da Dica */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
          {dicaAtual.titulo}
        </h3>

        {/* Base Legal / Súmula */}
        <div className="p-2.5 rounded-lg bg-amber-500/10 dark:bg-amber-500/15 border border-amber-300 dark:border-amber-600/40 flex items-start gap-2.5">
          <BookOpen className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider text-[10px] block">
              Fundamento Normativo / Precedente:
            </span>
            <span className="font-mono text-slate-800 dark:text-slate-100 font-semibold text-[11px] sm:text-xs">
              {dicaAtual.artigoSumula}
            </span>
          </div>
        </div>

        {/* Tese Jurídica Sintética */}
        <div className="p-3 rounded-lg bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/50 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300 block">
            Tese Central FGV:
          </span>
          <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-sky-100 leading-relaxed">
            "{dicaAtual.tese}"
          </p>
        </div>

        {/* Explicação Aprofundada */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Comentário Doutrinário & Jurisprudencial:
          </span>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {dicaAtual.explicacao}
          </p>
        </div>

        {/* Dica Prática de Redação para Peça / Discursiva */}
        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Como pontuar na prova de 2ª Fase:</span>
          </div>
          <p className="text-xs text-slate-800 dark:text-emerald-100/90 leading-relaxed">
            {dicaAtual.dicaPraticaOAB}
          </p>
        </div>
      </div>

      {/* BARRA DE FERRAMENTAS E NAVEGAÇÃO COM O BOTÃO DE GERAR COM IA */}
      <div className="flex items-center justify-between flex-wrap gap-2.5 pt-1">
        {/* Ações de Interatividade: Gerar com IA, Ouvir, Copiar, Aleatória */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* BOTÃO PRINCIPAL: GERAR NOVA DICA COM IA (PERSISTÊNCIA NO LOCALSTORAGE) */}
          <button
            onClick={gerarDicaComIA}
            disabled={gerandoIA}
            className="win11-btn-primary text-xs py-1.5 px-3.5 inline-flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 via-sky-600 to-indigo-700 text-white font-semibold shadow-sm hover:brightness-110 disabled:opacity-60 transition"
            title="Gerar uma nova dica inédita de Direito Tributário com inteligência artificial e salvar no LocalStorage"
          >
            {gerandoIA ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Gerando com IA...</span>
              </>
            ) : (
              <>
                <Wand2 className="h-3.5 w-3.5 text-amber-300" />
                <span>Gerar Dica com IA ✨</span>
              </>
            )}
          </button>

          <button
            onClick={alternarNarracao}
            className={`win11-btn-secondary text-xs py-1.5 px-3 inline-flex items-center gap-1.5 transition ${
              narrando
                ? 'bg-amber-100 dark:bg-amber-900/50 border-amber-400 text-amber-700 dark:text-amber-200'
                : ''
            }`}
            title="Ouvir a dica narrada em voz alta"
          >
            {narrando ? (
              <>
                <VolumeX className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
                <span>Parar Áudio</span>
              </>
            ) : (
              <>
                <Volume2 className="h-3.5 w-3.5 text-amber-500" />
                <span>Ouvir</span>
              </>
            )}
          </button>

          <button
            onClick={copiarDica}
            className="win11-btn-secondary text-xs py-1.5 px-3 inline-flex items-center gap-1.5"
            title="Copiar texto completo da dica para anotações"
          >
            {copiado ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-500" />
                <span>Copiar</span>
              </>
            )}
          </button>

          <button
            onClick={sortearAleatoria}
            className="win11-btn-secondary text-xs py-1.5 px-2.5 inline-flex items-center gap-1 text-slate-600 dark:text-slate-300"
            title="Sortear uma dica tributária do acervo"
          >
            <Shuffle className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sortear</span>
          </button>
        </div>

        {/* Controles de Navegação Anterior / Próxima */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={irParaAnterior}
            className="win11-btn-secondary text-xs py-1.5 px-2.5 inline-flex items-center gap-1"
            title="Dica anterior"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 px-2">
            {dicaAtualIndex !== -1 ? dicaAtualIndex + 1 : 1} / {listaCompleta.length}
          </span>

          <button
            onClick={irParaProxima}
            className="win11-btn-secondary text-xs py-1.5 px-2.5 inline-flex items-center gap-1"
            title="Próxima dica"
          >
            <span className="hidden sm:inline">Próxima</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
