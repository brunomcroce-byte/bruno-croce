import React, { useState, useEffect, useMemo } from 'react';
import {
  Lightbulb,
  Sparkles,
  Volume2,
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
  Award,
  AlertTriangle,
  Eye,
  CheckCircle2
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
  const indiceHoje = getIndiceDicaDoDia(DICAS_TRIBUTARIAS.length);

  const [dicasIA, setDicasIA] = useState<DicaTributaria[]>(() => {
    try {
      return JSON.parse(SafeStorage.get('tributa_dicas_ia', '[]'));
    } catch {
      return [];
    }
  });

  const listaCompleta = useMemo(() => {
    return [...dicasIA, ...DICAS_TRIBUTARIAS];
  }, [dicasIA]);

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

  const [tempoRestante, setTempoRestante] = useState<string>(getTempoAteProximaTroca());
  const [gerandoIA, setGerandoIA] = useState<boolean>(false);
  const [mostrarHistoricoIA, setMostrarHistoricoIA] = useState<boolean>(false);
  const [narrando, setNarrando] = useState<boolean>(false);
  const [copiado, setCopiado] = useState<boolean>(false);
  const [insightFixado, setInsightFixado] = useState<boolean>(false);
  const [revelarEspelho, setRevelarEspelho] = useState<boolean>(false);

  const [favoritos, setFavoritos] = useState<number[]>(() => {
    try {
      return JSON.parse(SafeStorage.get('tributa_dicas_favoritas', '[]'));
    } catch {
      return [];
    }
  });

  const dicaAtualIndex = listaCompleta.findIndex((d) => d.id === dicaAtivaId);
  const dicaAtual: DicaTributaria =
    dicaAtualIndex !== -1 ? listaCompleta[dicaAtualIndex] : DICAS_TRIBUTARIAS[indiceHoje] || DICAS_TRIBUTARIAS[0];

  const dicaDeHojePadrao = DICAS_TRIBUTARIAS[indiceHoje];
  const isDicaDeHoje = dicaAtual.id === dicaDeHojePadrao?.id && !dicaAtual.isAiGenerated;
  const isFavorita = favoritos.includes(dicaAtual.id);

  useEffect(() => {
    setInsightFixado(false);
    setRevelarEspelho(false);
  }, [dicaAtual.id]);

  useEffect(() => {
    SafeStorage.set('tributa_dica_ativa_id', String(dicaAtual.id));
  }, [dicaAtual.id]);

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

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setNarrando(false);
    }
  }, [dicaAtual.id]);

  const toggleFavorito = () => {
    let novos: number[];
    if (isFavorita) {
      novos = favoritos.filter((id) => id !== dicaAtual.id);
      onMostrarToast('Insight removido dos favoritos');
    } else {
      novos = [...favoritos, dicaAtual.id];
      tocarAlarmeWebAudio('suave');
      onMostrarToast('Insight salvo nos favoritos! ⭐');
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
      onMostrarToast('Exibindo o Insight Oficial do Dia!');
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
    onMostrarToast(`🎲 Insight sorteado: ${escolhida.titulo.slice(0, 30)}...`);
  };

  const alternarNarracao = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onMostrarToast('Navegador não suporta leitura de voz.');
      return;
    }

    if (narrando) {
      window.speechSynthesis.cancel();
      setNarrando(false);
    } else {
      const textoParaLer = `Insight estratégico de Direito Tributário. ${dicaAtual.titulo}. Base: ${dicaAtual.artigoSumula}. Tese central: ${dicaAtual.tese}. Explicação da doutrina: ${dicaAtual.explicacao}. Como pontuar no gabarito FGV: ${dicaAtual.dicaPraticaOAB}`;
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

  const copiarInsight = () => {
    const textoFormatado = `💡 INSIGHT ESTRATÉGICO DA BANCA FGV
📌 ${dicaAtual.titulo}
⚖️ Base Normativa: ${dicaAtual.artigoSumula}
🎯 Tese Chave: ${dicaAtual.tese}
📖 Comentário Prático: ${dicaAtual.explicacao}
✍️ Pontuação no Gabarito: ${dicaAtual.dicaPraticaOAB}
Categoria: ${dicaAtual.categoria} | Relevância: ${dicaAtual.relevanciaFGV}`;

    navigator.clipboard
      .writeText(textoFormatado)
      .then(() => {
        setCopiado(true);
        tocarAlarmeWebAudio('suave');
        onMostrarToast('Insight copiado para anotações!');
        setTimeout(() => setCopiado(false), 2500);
      })
      .catch(() => {
        onMostrarToast('Não foi possível copiar automaticamente.');
      });
  };

  return (
    <div className="macos-card-interactive rounded-3xl border border-black/5 dark:border-white/10 bg-white/80 dark:bg-zinc-800/90 backdrop-blur-xl p-6 lg:p-7 space-y-6 shadow-sm transition-all duration-300">
      {/* 1. TOPO: INSIGHTS HERO HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md shadow-amber-500/25 shrink-0 animate-amber-aura">
            <Lightbulb className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-medium flex-wrap">
              <span className="font-semibold text-amber-600 dark:text-amber-400">Insights da Banca FGV</span>
              <span aria-hidden="true">·</span>
              <span>Relevância {dicaAtual.relevanciaFGV}</span>
              <span aria-hidden="true">·</span>
              <span>{isDicaDeHoje ? 'Insight do Dia' : `#${dicaAtualIndex + 1} de ${listaCompleta.length}`}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white mt-0.5 tracking-tight">
              Revelações & Teses da Prova
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          {!isDicaDeHoje && (
            <button
              onClick={irParaHoje}
              className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold py-1.5 px-3 transition shadow-xs cursor-pointer active:scale-95"
            >
              <RotateCcw className="h-3 w-3 inline mr-1" />
              <span>Hoje</span>
            </button>
          )}

          <button
            onClick={toggleFavorito}
            className={`p-2 rounded-2xl border transition cursor-pointer shadow-xs active:scale-95 ${
              isFavorita
                ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-500'
                : 'border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 text-zinc-400 hover:text-zinc-600'
            }`}
            title={isFavorita ? 'Remover dos favoritos' : 'Favoritar insight'}
          >
            <Bookmark className={`h-4 w-4 ${isFavorita ? 'fill-amber-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. CARD DO INSIGHT ESTRUTURADO COM TRANSIÇÃO */}
      <div key={dicaAtual.id} className="animate-pop-scale rounded-2xl border border-black/5 dark:border-white/10 bg-zinc-50/70 dark:bg-zinc-900/60 p-5 space-y-4">
        {/* Metadados Limpos sem Pílulas */}
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-900 dark:text-white">{dicaAtual.categoria}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">{dicaAtual.tag}</span>
          </div>
          <span className="font-mono font-semibold text-amber-600 dark:text-amber-400">{dicaAtual.artigoSumula}</span>
        </div>

        {/* Título do Insight */}
        <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white leading-snug">
          {dicaAtual.titulo}
        </h3>

        {/* Bloco 1: A Tese Central Exigida na Correção */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-800/90 border border-black/5 dark:border-white/10 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
            Tese Central do Espelho Oficial:
          </span>
          <p className="text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-100 leading-relaxed italic">
            "{dicaAtual.tese}"
          </p>
        </div>

        {/* Bloco 2: Contexto Prático */}
        <div className="space-y-1">
          <span className="text-[10.5px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
            Comentário & Subsunção aos Fatos:
          </span>
          <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {dicaAtual.explicacao}
          </p>
        </div>

        {/* Bloco 3: Como Pontuar no Gabarito FGV */}
        <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-300/40 dark:border-emerald-800/30 space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Como Garantir a Pontuação Máxima:</span>
          </div>
          <p className="text-xs text-zinc-800 dark:text-emerald-100/90 leading-relaxed">
            {dicaAtual.dicaPraticaOAB}
          </p>
        </div>

        {/* Insight Expansível de Correção da Banca */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setRevelarEspelho(!revelarEspelho)}
            className="w-full p-3 rounded-xl border border-black/5 dark:border-white/5 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700/60 transition flex items-center justify-between text-xs text-zinc-800 dark:text-zinc-200 font-semibold cursor-pointer active:scale-98"
          >
            <span className="flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-500" />
              <span>{revelarEspelho ? 'Ocultar Detalhes do Espelho FGV' : 'Revelar Segredo de Correção do Espelho FGV'}</span>
            </span>
            <span className="font-mono text-xs">{revelarEspelho ? '▲' : '▼'}</span>
          </button>

          {revelarEspelho && (
            <div className="mt-2 p-3.5 rounded-xl bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/5 text-xs space-y-1.5 animate-pop-scale">
              <span className="font-bold text-zinc-900 dark:text-white block">Distribuição Típica de Pontos na FGV:</span>
              <ul className="space-y-1 text-zinc-600 dark:text-zinc-300 text-[11.5px] leading-relaxed">
                <li>• <strong>Indicação Normativa (0,10 - 0,20 pto):</strong> Citação literal do dispositivo legal ({dicaAtual.artigoSumula}).</li>
                <li>• <strong>Silogismo Jurídico (0,40 - 0,60 pto):</strong> Vinculação entre o fato narrado e o conceito tributário.</li>
                <li>• <strong>Pedido Específico:</strong> Conclusão congruente com o fundamento invocado.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Micro-Fixação do Insight */}
        <div className="pt-1">
          {!insightFixado ? (
            <div className="p-3 rounded-xl border border-amber-300/40 bg-amber-50/40 dark:bg-amber-950/20 flex items-center justify-between gap-3 text-xs">
              <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                Desafio Rápido: Você saberia fundamentar essa tese se caísse hoje na 2ª Fase?
              </span>
              <button
                type="button"
                onClick={() => {
                  setInsightFixado(true);
                  tocarAlarmeWebAudio('suave');
                  dispararConfetesSuaves({ count: 30, originY: 0.5 });
                  onMostrarToast('Excelente! Insight memorizado para o dia da prova!');
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold transition shadow-xs cursor-pointer shrink-0 active:scale-95"
              >
                Sim, Tese Fixada! 🎯
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300/40 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 font-semibold animate-pop-scale">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Insight memorizado com sucesso no seu repertório!</span>
              </span>
              <button
                type="button"
                onClick={() => setInsightFixado(false)}
                className="text-[11px] underline text-zinc-400 hover:text-zinc-600 cursor-pointer"
              >
                Refazer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. BARRA DE FERRAMENTAS DO INSIGHT COM EQUALIZADOR ANIMADO */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1 border-t border-black/5 dark:border-white/5">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={alternarNarracao}
            className={`text-xs py-2 px-3.5 rounded-2xl inline-flex items-center gap-2 border transition-all cursor-pointer shadow-xs active:scale-95 ${
              narrando
                ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 text-amber-800 dark:text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                : 'border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700'
            }`}
          >
            {narrando ? (
              <div className="flex items-center gap-0.5 h-3.5 px-0.5" aria-hidden="true">
                <span className="w-0.5 h-3 bg-amber-600 dark:bg-amber-400 rounded-full animate-soundwave-1 inline-block" />
                <span className="w-0.5 h-3 bg-amber-600 dark:bg-amber-400 rounded-full animate-soundwave-2 inline-block" />
                <span className="w-0.5 h-3 bg-amber-600 dark:bg-amber-400 rounded-full animate-soundwave-3 inline-block" />
                <span className="w-0.5 h-3 bg-amber-600 dark:bg-amber-400 rounded-full animate-soundwave-4 inline-block" />
              </div>
            ) : (
              <Volume2 className="h-3.5 w-3.5 text-amber-500" />
            )}
            <span>{narrando ? 'Pausar Áudio' : 'Ouvir Insight'}</span>
          </button>

          <button
            onClick={copiarInsight}
            className="text-xs py-2 px-3 rounded-2xl inline-flex items-center gap-1.5 border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition cursor-pointer shadow-xs active:scale-95"
          >
            {copiado ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5 text-zinc-400" />}
            <span>{copiado ? 'Copiado!' : 'Copiar'}</span>
          </button>

          <button
            onClick={sortearAleatoria}
            className="text-xs py-2 px-3 rounded-2xl inline-flex items-center gap-1.5 border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition cursor-pointer shadow-xs active:scale-95"
          >
            <Shuffle className="h-3.5 w-3.5 text-zinc-400" />
            <span>Sortear Outro</span>
          </button>
        </div>

        {/* Navegação Entre Insights */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            onClick={irParaAnterior}
            className="p-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 cursor-pointer shadow-xs active:scale-95"
            title="Insight anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-mono text-xs font-semibold text-zinc-600 dark:text-zinc-300 px-1">
            {dicaAtualIndex + 1} / {listaCompleta.length}
          </span>
          <button
            onClick={irParaProxima}
            className="p-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 cursor-pointer shadow-xs active:scale-95"
            title="Próximo insight"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
