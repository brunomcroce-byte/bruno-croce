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
  Target,
  Zap,
  HelpCircle,
  Eye,
  EyeOff,
  Flame,
  Award
} from 'lucide-react';
import {
  DICAS_TRIBUTARIAS,
  DicaTributaria,
  getIndiceDicaDoDia,
  getTempoAteProximaTroca
} from '../data/dicasData';
import { SafeStorage } from '../utils/storage';
import { lerTextoEmVozAlta, tocarAlarmeWebAudio } from '../utils/audio';
import { dispararConfetesSuaves } from '../utils/confetti';

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

  // Dica ativa persistida no LocalStorage
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
    return DICAS_TRIBUTARIAS[indiceHoje]?.id ?? 1;
  });

  // Tempo restante para a próxima rotação diária
  const [tempoRestante, setTempoRestante] = useState<string>(getTempoAteProximaTroca());
  const [gerandoIA, setGerandoIA] = useState<boolean>(false);
  const [mostrarHistoricoIA, setMostrarHistoricoIA] = useState<boolean>(false);
  const [narrando, setNarrando] = useState<boolean>(false);
  const [copiado, setCopiado] = useState<boolean>(false);

  // Estados Interativos de Animação e Insights
  const [revelarEspelhoFGV, setRevelarEspelhoFGV] = useState<boolean>(false);
  const [testeRespondido, setTesteRespondido] = useState<boolean>(false);

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

  // Reseta os estados interativos ao trocar de dica
  useEffect(() => {
    setRevelarEspelhoFGV(false);
    setTesteRespondido(false);
  }, [dicaAtual.id]);

  // Persiste a dica ativa sempre que mudar
  useEffect(() => {
    SafeStorage.set('tributa_dica_ativa_id', String(dicaAtual.id));
  }, [dicaAtual.id]);

  // Atualiza contagem regressiva para a próxima rotação
  useEffect(() => {
    const timer = setInterval(() => {
      setTempoRestante(getTempoAteProximaTroca());
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

  // Gerar nova dica com IA
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
      const novoArrayIA = [novaDica, ...dicasIA];
      setDicasIA(novoArrayIA);
      setDicaAtivaId(novaDica.id);

      SafeStorage.set('tributa_dicas_ia', JSON.stringify(novoArrayIA));
      SafeStorage.set('tributa_dica_ativa_id', String(novaDica.id));

      dispararConfetesSuaves({ count: 40, originY: 0.4 });
      tocarAlarmeWebAudio('suave');
      onMostrarToast('Nova dica gerada com inteligência artificial! ✨');
    } catch (err: any) {
      console.error('Falha ao gerar dica com IA:', err);
      let randomIdx = Math.floor(Math.random() * DICAS_TRIBUTARIAS.length);
      const fallbackDica = DICAS_TRIBUTARIAS[randomIdx];
      if (fallbackDica) {
        setDicaAtivaId(fallbackDica.id);
        SafeStorage.set('tributa_dica_ativa_id', String(fallbackDica.id));
      }
      onMostrarToast('IA temporariamente indisponível. Dica sorteada do acervo.');
    } finally {
      setGerandoIA(false);
    }
  };

  const toggleFavorito = () => {
    let novos: number[];
    if (isFavorita) {
      novos = favoritos.filter((id) => id !== dicaAtual.id);
      onMostrarToast('Dica removida dos favoritos');
    } else {
      novos = [...favoritos, dicaAtual.id];
      tocarAlarmeWebAudio('suave');
      onMostrarToast('Dica salva nos seus favoritos de Direito Tributário! ⭐');
    }
    setFavoritos(novos);
    SafeStorage.set('tributa_dicas_favoritas', JSON.stringify(novos));
  };

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
      onMostrarToast('Exibindo a Dica Oficial do Dia!');
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
    onMostrarToast(`🎲 Dica sorteada: ${escolhida.titulo.slice(0, 30)}...`);
  };

  const excluirDicaIA = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const novas = dicasIA.filter((d) => d.id !== id);
    setDicasIA(novas);
    SafeStorage.set('tributa_dicas_ia', JSON.stringify(novas));
    if (dicaAtivaId === id) {
      irParaHoje();
    }
    onMostrarToast('Dica removida do histórico.');
  };

  // Narração por voz
  const alternarNarracao = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onMostrarToast('Seu navegador não suporta leitura por voz.');
      return;
    }

    if (narrando) {
      window.speechSynthesis.cancel();
      setNarrando(false);
    } else {
      const textoParaLer = `Dica de estudo sobre Direito Tributário. ${dicaAtual.titulo}. Base normativa: ${dicaAtual.artigoSumula}. Tese jurídica da FGV: ${dicaAtual.tese}. Explicação: ${dicaAtual.explicacao}. Como pontuar na segunda fase da OAB: ${dicaAtual.dicaPraticaOAB}`;
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
        tocarAlarmeWebAudio('suave');
        onMostrarToast('Dica copiada para sua área de transferência!');
        setTimeout(() => setCopiado(false), 2500);
      })
      .catch(() => {
        onMostrarToast('Não foi possível copiar automaticamente.');
      });
  };

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
    <div className="rounded-3xl border border-amber-400/25 bg-gradient-to-br from-amber-50/40 via-white to-orange-50/30 dark:from-zinc-800/95 dark:via-zinc-800/90 dark:to-zinc-800/95 p-6 lg:p-7 space-y-6 shadow-sm relative overflow-hidden transition-all duration-300">
      {/* Barra de brilho sutil animada se gerando com IA */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-sky-500 to-indigo-500 ${
          gerandoIA ? 'animate-pulse' : ''
        }`}
      />

      {/* 1. CABEÇALHO ILUMINADO & CONVITE AO INSIGHT */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md shadow-amber-500/25 shrink-0 ${narrando ? 'animate-bounce' : ''}`}>
            <Lightbulb className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-300/60 dark:border-amber-700/60 inline-flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Ponto Chave da 2ª Fase
              </span>
              {isDicaDeHoje ? (
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-300/60 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Dica de Hoje
                </span>
              ) : dicaAtual.isAiGenerated ? (
                <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-0.5 rounded-full border border-indigo-300 dark:border-indigo-700 flex items-center gap-1">
                  <Bot className="h-3 w-3 text-indigo-500" />
                  Gerada por IA
                </span>
              ) : (
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  #{dicaAtualIndex + 1} de {listaCompleta.length}
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white mt-1 flex items-center gap-2 tracking-tight">
              Dica Estratégica do Dia
            </h2>
          </div>
        </div>

        {/* Controles de Rotação & Status */}
        <div className="flex items-center gap-2 flex-wrap">
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-700/50 text-zinc-600 dark:text-zinc-300 border border-black/5 dark:border-white/10 shadow-xs"
            title="A dica padrão troca automaticamente a cada 24 horas à meia-noite local."
          >
            <Clock className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-[11px]">
              Troca em: <strong className="font-mono">{tempoRestante}</strong>
            </span>
          </div>

          {!isDicaDeHoje && (
            <button
              onClick={irParaHoje}
              className="rounded-xl border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 text-sky-700 dark:text-sky-300 text-xs font-bold py-1.5 px-3 inline-flex items-center gap-1 transition shadow-xs cursor-pointer active:scale-95"
              title="Voltar para a dica automática de hoje"
            >
              <RotateCcw className="h-3 w-3" /> Hoje
            </button>
          )}

          {dicasIA.length > 0 && (
            <button
              onClick={() => setMostrarHistoricoIA(!mostrarHistoricoIA)}
              className="rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-semibold py-1.5 px-3 inline-flex items-center gap-1 transition shadow-xs cursor-pointer"
            >
              <History className="h-3 w-3" />
              <span>IA ({dicasIA.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* PAINEL RECOLHÍVEL DO HISTÓRICO DE DICAS GERADAS POR IA */}
      {mostrarHistoricoIA && dicasIA.length > 0 && (
        <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 space-y-2.5 win11-animate">
          <div className="flex items-center justify-between text-xs font-bold text-indigo-900 dark:text-indigo-200">
            <span className="flex items-center gap-1.5">
              <Bot className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> Dicas Geradas por IA ({dicasIA.length})
            </span>
            <span className="text-[11px] text-indigo-600 dark:text-indigo-400">
              Salvas no seu dispositivo
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {dicasIA.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setDicaAtivaId(item.id);
                  onMostrarToast(`Exibindo dica: ${item.titulo.slice(0, 30)}...`);
                }}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start justify-between gap-2 shadow-xs ${
                  dicaAtual.id === item.id
                    ? 'bg-indigo-100 dark:bg-indigo-900/60 border-indigo-400 font-semibold text-indigo-950 dark:text-indigo-100'
                    : 'bg-white dark:bg-zinc-800 border-black/5 dark:border-white/10 hover:border-indigo-300'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold text-zinc-900 dark:text-white">
                    {item.titulo}
                  </div>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                    {item.artigoSumula}
                  </div>
                </div>
                <button
                  onClick={(e) => excluirDicaIA(item.id, e)}
                  className="p-1 text-zinc-400 hover:text-rose-500 transition rounded-lg"
                  title="Excluir dica"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. CONTEÚDO PRINCIPAL: CARDS DIDÁTICOS & INSIGHTS ESTRATÉGICOS */}
      <div className="p-5 space-y-4 bg-white dark:bg-zinc-800/90 border border-amber-200/60 dark:border-white/10 rounded-2xl shadow-xs">
        {/* Metadados: Categoria, Relevância e Favorito */}
        <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-black/5 dark:border-white/5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={getCategoriaBadgeClass(dicaAtual.categoria)}>
              {dicaAtual.categoria}
            </span>
            <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-700/60 px-2.5 py-0.5 rounded-full border border-black/5 dark:border-white/5 font-mono">
              {dicaAtual.tag}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-300/60 dark:border-amber-700/60">
              Relevância FGV: {dicaAtual.relevanciaFGV}
            </span>
            <button
              onClick={toggleFavorito}
              className={`p-1.5 rounded-xl transition cursor-pointer ${
                isFavorita
                  ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/50'
                  : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700'
              }`}
              title={isFavorita ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
            >
              <Bookmark className={`h-4 w-4 ${isFavorita ? 'fill-amber-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Título da Dica */}
        <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white leading-snug">
          {dicaAtual.titulo}
        </h3>

        {/* Base Legal Normativa */}
        <div className="p-3 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-300/70 dark:border-amber-600/40 flex items-start gap-2.5">
          <BookOpen className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider text-[10px] block">
              Fundamento Normativo / Precedente:
            </span>
            <span className="font-mono text-zinc-900 dark:text-zinc-100 font-bold text-xs">
              {dicaAtual.artigoSumula}
            </span>
          </div>
        </div>

        {/* Tese Central FGV com Aspas Tipográficas */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-sky-50 to-blue-50/50 dark:from-sky-950/30 dark:to-zinc-900/60 border border-sky-200 dark:border-sky-800/50 space-y-1 relative">
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300 block">
            Tese Central Exigida na Prova:
          </span>
          <p className="text-xs sm:text-sm font-semibold text-zinc-800 dark:text-sky-100 leading-relaxed italic">
            "{dicaAtual.tese}"
          </p>
        </div>

        {/* Explicação da Doutrina & Aplicação */}
        <div className="space-y-1 px-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Comentário & Contexto Prático:
          </span>
          <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {dicaAtual.explicacao}
          </p>
        </div>

        {/* Dica Prática de Redação para Peça / Discursiva */}
        <div className="p-4 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 space-y-1.5">
          <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <span>Como pontuar na prova de 2ª Fase (Gabarito Oficial):</span>
          </div>
          <p className="text-xs text-zinc-800 dark:text-emerald-100/90 leading-relaxed font-medium">
            {dicaAtual.dicaPraticaOAB}
          </p>
        </div>

        {/* 3. INSIGHT EXPANSÍVEL: O SEGREDO DO ESPELHO FGV */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setRevelarEspelhoFGV(!revelarEspelhoFGV)}
            className="w-full p-3 rounded-xl border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/50 dark:bg-indigo-950/30 hover:bg-indigo-100/60 dark:hover:bg-indigo-950/50 transition-all flex items-center justify-between text-xs text-indigo-900 dark:text-indigo-200 font-bold cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>{revelarEspelhoFGV ? 'Ocultar Segredo do Espelho FGV' : 'Revelar Segredo de Correção do Espelho FGV ✨'}</span>
            </span>
            <span className="text-xs font-mono">{revelarEspelhoFGV ? '▲' : '▼'}</span>
          </button>

          {revelarEspelhoFGV && (
            <div className="mt-2 p-3.5 rounded-xl bg-indigo-50/80 dark:bg-zinc-900/60 border border-indigo-200 dark:border-indigo-900/40 text-xs space-y-2 win11-animate">
              <div className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                <Award className="h-4 w-4 text-amber-500" />
                <span>Critérios Típicos de Pontuação na Banca FGV:</span>
              </div>
              <ul className="space-y-1.5 text-[11.5px] text-zinc-700 dark:text-zinc-300 leading-relaxed pl-1">
                <li>• <strong>Indicação Normativa:</strong> A banca confere tipicamente <strong>0,10 a 0,20 ponto</strong> pela citação literal do artigo correspondente ({dicaAtual.artigoSumula}).</li>
                <li>• <strong>Subsunção do Fato à Norma:</strong> A banca exige que você demonstre o silogismo jurídico vinculando os fatos narrados no problema à tese acolhida (+<strong>0,40 a 0,60 ponto</strong>).</li>
                <li>• <strong>Pedido Específico:</strong> Nas peças iniciais, requeira expressamente a anulação, restituição ou suspensão do débito em consonância com o fundamento indicado.</li>
              </ul>
            </div>
          )}
        </div>

        {/* 4. MICRO-FIXAÇÃO INTERATIVA (TESTE RÁPIDO DE 1 TOQUE) */}
        <div className="pt-1">
          {!testeRespondido ? (
            <div className="p-3.5 rounded-xl border border-amber-200/80 dark:border-amber-700/40 bg-amber-50/40 dark:bg-amber-950/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <Target className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                  Desafio de Fixação: Você saberia citar essa tese em uma questão discursiva agora?
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setTesteRespondido(true);
                  dispararConfetesSuaves({ count: 35, originY: 0.4 });
                  tocarAlarmeWebAudio('suave');
                  onMostrarToast('Excelente! Tese fixada com sucesso no seu repertório!');
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold transition shadow-xs cursor-pointer shrink-0 active:scale-95 text-center"
              >
                Sim, Tese Fixada! 🎯
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-700/50 flex items-center justify-between gap-2 text-xs text-emerald-800 dark:text-emerald-300 font-semibold win11-animate">
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>Parabéns! Ponto memorizado para a prova de 2ª Fase!</span>
              </span>
              <button
                type="button"
                onClick={() => setTesteRespondido(false)}
                className="text-[10px] text-zinc-400 hover:text-zinc-600 underline cursor-pointer"
              >
                Refazer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 5. BARRA DE FERRAMENTAS & AÇÕES CONVIDATIVAS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Botão Gerar Dica com IA */}
          <button
            onClick={gerarDicaComIA}
            disabled={gerandoIA}
            className="text-xs py-2.5 px-4 rounded-xl inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-sky-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold shadow-xs hover:shadow transition-all disabled:opacity-60 cursor-pointer active:scale-95"
            title="Gerar nova dica inédita de Direito Tributário com inteligência artificial"
          >
            {gerandoIA ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Gerando com IA...</span>
              </>
            ) : (
              <>
                <Wand2 className="h-3.5 w-3.5 text-amber-300" />
                <span>Gerar com IA ✨</span>
              </>
            )}
          </button>

          {/* Botão Ouvir com Equalizador de Áudio Animado */}
          <button
            onClick={alternarNarracao}
            className={`text-xs py-2.5 px-3.5 rounded-xl inline-flex items-center gap-2 border transition-all cursor-pointer shadow-xs active:scale-95 ${
              narrando
                ? 'bg-amber-100 dark:bg-amber-900/60 border-amber-400 text-amber-800 dark:text-amber-200'
                : 'bg-white dark:bg-zinc-800 border-black/10 dark:border-white/10 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700'
            }`}
            title="Ouvir a dica narrada em voz alta"
          >
            {narrando ? (
              <>
                {/* Ondas Sonoras Animadas */}
                <div className="flex items-center gap-0.5 h-3.5">
                  <span className="w-1 bg-amber-600 rounded-full animate-[pulse_0.6s_infinite_ease-in-out] h-3.5" />
                  <span className="w-1 bg-amber-600 rounded-full animate-[pulse_0.4s_infinite_ease-in-out] h-2" />
                  <span className="w-1 bg-amber-600 rounded-full animate-[pulse_0.8s_infinite_ease-in-out] h-3" />
                  <span className="w-1 bg-amber-600 rounded-full animate-[pulse_0.5s_infinite_ease-in-out] h-1.5" />
                </div>
                <span>Pausar Áudio</span>
              </>
            ) : (
              <>
                <Volume2 className="h-4 w-4 text-amber-500" />
                <span>Ouvir</span>
              </>
            )}
          </button>

          {/* Botão Copiar */}
          <button
            onClick={copiarDica}
            className="text-xs py-2.5 px-3 rounded-xl inline-flex items-center gap-1.5 bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all cursor-pointer shadow-xs active:scale-95"
            title="Copiar texto completo da dica para suas anotações"
          >
            {copiado ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-zinc-400" />
                <span>Copiar</span>
              </>
            )}
          </button>

          {/* Botão Sortear */}
          <button
            onClick={sortearAleatoria}
            className="text-xs py-2.5 px-3 rounded-xl inline-flex items-center gap-1.5 bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all cursor-pointer shadow-xs active:scale-95"
            title="Sortear uma dica tributária do acervo"
          >
            <Shuffle className="h-3.5 w-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Sortear</span>
          </button>
        </div>

        {/* Navegação Entre Dicas */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            onClick={irParaAnterior}
            className="text-xs py-2 px-3 rounded-xl inline-flex items-center gap-1 bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all cursor-pointer shadow-xs active:scale-95"
            title="Dica anterior"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          <span className="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-300 px-2">
            {dicaAtualIndex !== -1 ? dicaAtualIndex + 1 : 1} / {listaCompleta.length}
          </span>

          <button
            onClick={irParaProxima}
            className="text-xs py-2 px-3 rounded-xl inline-flex items-center gap-1 bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all cursor-pointer shadow-xs active:scale-95"
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
