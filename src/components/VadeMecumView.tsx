import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Highlighter,
  Search,
  Check,
  X,
  Volume2,
  VolumeX,
  Plus,
  Sparkles,
  Zap,
  RotateCcw,
  Paperclip,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  Filter,
  Eye,
  Columns,
  List,
  ChevronLeft,
  ChevronRight,
  BookmarkCheck,
  Share2,
  FileText,
  AlertTriangle,
  Lightbulb,
  Copy,
  BookCheck,
  CheckCheck,
  Scale,
  AlignLeft,
  Sliders
} from 'lucide-react';
import { VADE_DATA, VadeItem } from '../data/tributarioData';
import { dispararConfetesSuaves, dispararMegaConfetes150L } from '../utils/confetti';
import { tocarAlarmeWebAudio, lerTextoEmVozAlta } from '../utils/audio';

interface VadeMecumViewProps {
  vadeMarcados: number[];
  onToggleVade: (index: number) => void;
  onMarcarTodosVade: (marcar: boolean) => void;
  onInserirTextoNaRedacao: (citacao: string, irParaSimulador?: boolean) => void;
  mostrarToast: (msg: string) => void;
  corFiltroInicial?: string;
  buscaInicial?: string;
}

type VisaoModo = 'fichario' | 'leitura' | 'tabela';
type DiplomaFiltro = 'TODOS' | 'CF' | 'CTN' | 'PROCESSO' | 'CLIPES';
type TamanhoFonte = 'normal' | 'grande' | 'extra';

export const VadeMecumView: React.FC<VadeMecumViewProps> = ({
  vadeMarcados,
  onToggleVade,
  onMarcarTodosVade,
  onInserirTextoNaRedacao,
  mostrarToast,
  corFiltroInicial,
  buscaInicial
}) => {
  const [buscaVade, setBuscaVade] = useState(buscaInicial || '');
  const [corFiltroVade, setCorFiltroVade] = useState<string>(corFiltroInicial || 'TODAS');
  const [diplomaFiltro, setDiplomaFiltro] = useState<DiplomaFiltro>('TODOS');
  const [filtroApenasMarcadosVade, setFiltroApenasMarcadosVade] = useState(false);
  const [visaoModo, setVisaoModo] = useState<VisaoModo>('fichario');
  const [artigoSelecionadoIndex, setArtigoSelecionadoIndex] = useState<number>(0);
  const [narrandoIndex, setNarrandoIndex] = useState<number | null>(null);
  const [itemCitadoFeedback, setItemCitadoFeedback] = useState<number | null>(null);
  const [textoCopiadoIndex, setTextoCopiadoIndex] = useState<number | null>(null);
  const [tamanhoFonte, setTamanhoFonte] = useState<TamanhoFonte>('normal');
  const [linhasExpandidasTabela, setLinhasExpandidasTabela] = useState<number[]>([]);

  useEffect(() => {
    if (buscaInicial !== undefined) setBuscaVade(buscaInicial);
  }, [buscaInicial]);

  useEffect(() => {
    if (corFiltroInicial !== undefined) setCorFiltroVade(corFiltroInicial);
  }, [corFiltroInicial]);

  // Modo Treino de Localização Rápida no Vade Físico (Desafio Relâmpago)
  const [modoDesafioAtivo, setModoDesafioAtivo] = useState(false);
  const [desafioIndex, setDesafioIndex] = useState<number>(0);
  const [desafioTempo, setDesafioTempo] = useState<number>(15);
  const [desafioAcertos, setDesafioAcertos] = useState<number>(0);

  // Classificação do Diploma Legal
  const classificarDiploma = (ref: string, cor: string): DiplomaFiltro => {
    if (cor === 'CLIPES') return 'CLIPES';
    if (ref.includes('CF') || ref.includes('EC')) return 'CF';
    if (ref.includes('CTN')) return 'CTN';
    if (ref.includes('CPC') || ref.includes('12.016') || ref.includes('6.830')) return 'PROCESSO';
    return 'TODOS';
  };

  // Contagem dinâmica por cores
  const contagemCoresVade = useMemo(() => {
    const counts = { TODAS: VADE_DATA.length, AMARELO: 0, VERDE: 0, ROSA: 0, AZUL: 0, CLIPES: 0 };
    VADE_DATA.forEach(d => {
      if (counts[d.cor as keyof typeof counts] !== undefined) {
        counts[d.cor as keyof typeof counts]++;
      }
    });
    return counts;
  }, []);

  // Artigos filtrados com busca rica em texto completo e descrições
  const vadeFiltrados = useMemo(() => {
    const q = buscaVade.trim().toLowerCase();
    return VADE_DATA.map((item, originalIndex) => ({
      ...item,
      originalIndex,
      diploma: classificarDiploma(item.ref, item.cor)
    })).filter(item => {
      const matchCor = corFiltroVade === 'TODAS' || item.cor === corFiltroVade;
      const matchDiploma = diplomaFiltro === 'TODOS' || item.diploma === diplomaFiltro;
      const matchBusca =
        !q ||
        item.ref.toLowerCase().includes(q) ||
        (item.titulo && item.titulo.toLowerCase().includes(q)) ||
        (item.textoCompleto && item.textoCompleto.toLowerCase().includes(q)) ||
        (item.descricaoDetalhada && item.descricaoDetalhada.toLowerCase().includes(q)) ||
        (item.obs && item.obs.toLowerCase().includes(q)) ||
        (item.diplomaNome && item.diplomaNome.toLowerCase().includes(q));
      const matchMarcados = !filtroApenasMarcadosVade || vadeMarcados.includes(item.originalIndex);
      return matchCor && matchDiploma && matchBusca && matchMarcados;
    });
  }, [buscaVade, corFiltroVade, diplomaFiltro, filtroApenasMarcadosVade, vadeMarcados]);

  // Artigo ativo no painel de fichário
  const artigoAtivo = useMemo(() => {
    if (vadeFiltrados.length === 0) return null;
    const encontrado = vadeFiltrados.find(a => a.originalIndex === artigoSelecionadoIndex);
    return encontrado || vadeFiltrados[0];
  }, [vadeFiltrados, artigoSelecionadoIndex]);

  const percentualConclusao = useMemo(() => {
    return Math.round((vadeMarcados.length / VADE_DATA.length) * 100);
  }, [vadeMarcados]);

  // Efeito do Desafio de Busca Rápida (15 segundos)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (modoDesafioAtivo && desafioTempo > 0) {
      timer = setInterval(() => {
        setDesafioTempo(prev => {
          if (prev <= 1) {
            tocarAlarmeWebAudio('padrao');
            mostrarToast('⏰ Tempo esgotado! Veja onde estava o artigo no Vade.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [modoDesafioAtivo, desafioTempo, mostrarToast]);

  const iniciarDesafio = () => {
    const randomIdx = Math.floor(Math.random() * VADE_DATA.length);
    setDesafioIndex(randomIdx);
    setDesafioTempo(15);
    setModoDesafioAtivo(true);
    tocarAlarmeWebAudio('suave');
    mostrarToast('⚡ Desafio iniciado: localize o artigo no seu Vade em 15 segundos!');
  };

  const proximoDesafio = (acertou: boolean) => {
    if (acertou) {
      setDesafioAcertos(prev => prev + 1);
      dispararConfetesSuaves({ count: 40, originY: 0.4 });
      tocarAlarmeWebAudio('suave');
      mostrarToast('🎯 Ponto de agilidade! Artigo marcado no Vade.');
      if (!vadeMarcados.includes(desafioIndex)) {
        onToggleVade(desafioIndex);
      }
    }
    let nextIdx = Math.floor(Math.random() * VADE_DATA.length);
    if (nextIdx === desafioIndex) nextIdx = (nextIdx + 1) % VADE_DATA.length;
    setDesafioIndex(nextIdx);
    setDesafioTempo(15);
  };

  const handleToggleArtigo = (idx: number) => {
    const jaMarcado = vadeMarcados.includes(idx);
    onToggleVade(idx);

    if (!jaMarcado) {
      tocarAlarmeWebAudio('suave');
      dispararConfetesSuaves({ count: 25, originY: 0.45 });
      mostrarToast(`Artigo destacado com marca-texto no Vade! 🖍️`);

      if (vadeMarcados.length + 1 >= VADE_DATA.length) {
        dispararMegaConfetes150L();
        tocarAlarmeWebAudio('suave');
        mostrarToast('🏆 CONQUISTA MÁXIMA! Todos os 46 artigos do Vade Mecum estão marcados!');
      }
    }
  };

  const toggleLinhaTabela = (idx: number) => {
    setLinhasExpandidasTabela(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const narrarArtigoCompleto = (item: VadeItem, idx: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      mostrarToast('Leitura de voz não suportada no navegador.');
      return;
    }

    if (narrandoIndex === idx) {
      window.speechSynthesis.cancel();
      setNarrandoIndex(null);
    } else {
      window.speechSynthesis.cancel();
      setNarrandoIndex(idx);
      const texto = `${item.ref}. ${item.titulo ? `Título: ${item.titulo}.` : ''} Teor literal da lei: ${item.textoCompleto}. Descrição jurídica: ${item.descricaoDetalhada}. Dica da prova da FGV: ${item.obs || item.aplicacaoPeca || ''}`;
      lerTextoEmVozAlta(texto);

      const checkEnd = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          setNarrandoIndex(null);
          clearInterval(checkEnd);
        }
      }, 500);
    }
  };

  const copiarTextoLiteral = (texto: string, idx: number) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(texto);
      setTextoCopiadoIndex(idx);
      tocarAlarmeWebAudio('suave');
      mostrarToast('Texto completo do artigo copiado para a área de transferência! 📋');
      setTimeout(() => setTextoCopiadoIndex(null), 2500);
    }
  };

  const copiarECitar = (item: VadeItem, idx: number) => {
    const citacao = `\n\nConforme preceitua o ${item.ref}${item.obs ? ` (${item.obs})` : ''}, segundo o qual: "${item.textoCompleto}".\n`;
    onInserirTextoNaRedacao(citacao, false);
    setItemCitadoFeedback(idx);
    tocarAlarmeWebAudio('suave');
    mostrarToast(`Artigo e dispositivo citados no Simulador de Peça! ⚡`);
    setTimeout(() => setItemCitadoFeedback(null), 2500);
  };

  // Cores do Marcador Real e gradientes
  const getCorInfo = (cor: string) => {
    switch (cor) {
      case 'AMARELO':
        return {
          nome: 'Direito Material',
          indicadorBg: 'bg-amber-400',
          borda: 'border-amber-400/80',
          texto: 'text-amber-500 dark:text-amber-300',
          sweepClass: 'animate-marker-sweep marker-yellow',
          bgSuave: 'bg-amber-500/10 dark:bg-amber-500/15',
          chipBg: 'bg-amber-400/20 text-amber-800 dark:text-amber-300 border-amber-400/40',
          penEmoji: '🟡'
        };
      case 'VERDE':
        return {
          nome: 'Direito Processual',
          indicadorBg: 'bg-emerald-400',
          borda: 'border-emerald-400/80',
          texto: 'text-emerald-500 dark:text-emerald-300',
          sweepClass: 'animate-marker-sweep marker-green',
          bgSuave: 'bg-emerald-500/10 dark:bg-emerald-500/15',
          chipBg: 'bg-emerald-400/20 text-emerald-800 dark:text-emerald-300 border-emerald-400/40',
          penEmoji: '🟢'
        };
      case 'ROSA':
        return {
          nome: 'Estrutura da Peça',
          indicadorBg: 'bg-pink-400',
          borda: 'border-pink-400/80',
          texto: 'text-pink-500 dark:text-pink-300',
          sweepClass: 'animate-marker-sweep marker-pink',
          bgSuave: 'bg-pink-500/10 dark:bg-pink-500/15',
          chipBg: 'bg-pink-400/20 text-pink-800 dark:text-pink-300 border-pink-400/40',
          penEmoji: '🩷'
        };
      case 'AZUL':
        return {
          nome: 'Constitucional / Reforma',
          indicadorBg: 'bg-sky-400',
          borda: 'border-sky-400/80',
          texto: 'text-sky-500 dark:text-sky-300',
          sweepClass: 'animate-marker-sweep marker-blue',
          bgSuave: 'bg-sky-500/10 dark:bg-sky-500/15',
          chipBg: 'bg-sky-400/20 text-sky-800 dark:text-sky-300 border-sky-400/40',
          penEmoji: '🔵'
        };
      case 'CLIPES':
      default:
        return {
          nome: 'Clipes & Prazos',
          indicadorBg: 'bg-purple-400',
          borda: 'border-purple-400/80',
          texto: 'text-purple-500 dark:text-purple-300',
          sweepClass: 'border-l-4 border-purple-400',
          bgSuave: 'bg-purple-500/10 dark:bg-purple-500/15',
          chipBg: 'bg-purple-400/20 text-purple-800 dark:text-purple-300 border-purple-400/40',
          penEmoji: '📎'
        };
    }
  };

  const getTamanhoFonteClasses = () => {
    switch (tamanhoFonte) {
      case 'grande':
        return {
          lei: 'text-base sm:text-lg leading-relaxed',
          desc: 'text-sm sm:text-base leading-relaxed',
          meta: 'text-xs'
        };
      case 'extra':
        return {
          lei: 'text-lg sm:text-xl leading-loose',
          desc: 'text-base sm:text-lg leading-loose',
          meta: 'text-sm'
        };
      case 'normal':
      default:
        return {
          lei: 'text-sm sm:text-base leading-relaxed',
          desc: 'text-xs sm:text-sm leading-relaxed',
          meta: 'text-[11px]'
        };
    }
  };

  const classesFonte = getTamanhoFonteClasses();

  const diplomas = [
    { id: 'TODOS', label: 'Todos os Diplomas', icon: BookOpen },
    { id: 'CF', label: 'CF/88 & Reforma', icon: Award },
    { id: 'CTN', label: 'Código Tributário (CTN)', icon: BookmarkCheck },
    { id: 'PROCESSO', label: 'Processo (CPC, LMS, LEF)', icon: FileText },
    { id: 'CLIPES', label: 'Prazos Fatais & Clipes', icon: Paperclip }
  ] as const;

  return (
    <div className="space-y-4">
      {/* COCKPIT HERO: VIDRO FLUENT 26H2 COM PROGRESSO E AÇÕES */}
      <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/85 dark:bg-zinc-800/85 backdrop-blur-md text-zinc-800 dark:text-zinc-100 p-4 lg:p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-400 to-sky-400 text-slate-950 shadow-md">
                <Highlighter className="h-6 w-6 stroke-[2.2]" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-zinc-800"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="badge b-AMARELO text-[10px] font-bold">
                  Método 4 Cores + Clipes FGV
                </span>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                  Artigos na Íntegra • LC 227 & LC 236/2026
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white mt-0.5">
                Vade Mecum Oficial 2ª Fase Tributário (Artigos & Descrições Sem Supressão)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Seletor de Modo: Fichário vs Leitura Contínua vs Tabela */}
            <div className="flex items-center bg-black/5 dark:bg-white/10 p-1 rounded-xl border border-black/10 dark:border-white/10">
              <button
                onClick={() => setVisaoModo('fichario')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  visaoModo === 'fichario'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
                title="Modo Fichário: Leitura tátil com visão mestre-detalhe e simulador de marca-texto"
              >
                <Columns className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Fichário</span>
              </button>
              <button
                onClick={() => setVisaoModo('leitura')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  visaoModo === 'leitura'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
                title="Modo Livro Aberto: Todos os artigos com teor integral e descrições corridas"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Livro Aberto</span>
              </button>
              <button
                onClick={() => setVisaoModo('tabela')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  visaoModo === 'tabela'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
                title="Modo Tabela: Grade rápida com sanfona de expansão de artigos"
              >
                <List className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Tabela</span>
              </button>
            </div>

            {/* Ajuste de Tamanho da Fonte */}
            <div className="flex items-center bg-black/5 dark:bg-white/10 p-1 rounded-xl border border-black/10 dark:border-white/10">
              <span className="text-[10px] text-zinc-400 px-1 font-mono">Fonte:</span>
              <button
                onClick={() => setTamanhoFonte('normal')}
                className={`px-2 py-1 rounded text-[11px] font-bold ${
                  tamanhoFonte === 'normal'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Fonte Normal (14px)"
              >
                A
              </button>
              <button
                onClick={() => setTamanhoFonte('grande')}
                className={`px-2 py-1 rounded text-xs font-bold ${
                  tamanhoFonte === 'grande'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Fonte Confortável (16px)"
              >
                A+
              </button>
              <button
                onClick={() => setTamanhoFonte('extra')}
                className={`px-2 py-1 rounded text-sm font-bold ${
                  tamanhoFonte === 'extra'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Fonte Extra Grande (18px)"
              >
                A++
              </button>
            </div>

            {/* Treino de Agilidade (15s) */}
            <button
              onClick={modoDesafioAtivo ? () => setModoDesafioAtivo(false) : iniciarDesafio}
              className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer ${
                modoDesafioAtivo
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-sm'
              }`}
            >
              <Zap className={`h-3.5 w-3.5 ${modoDesafioAtivo ? 'animate-bounce' : ''}`} />
              <span>{modoDesafioAtivo ? 'Fechar Desafio' : 'Treino Relâmpago 15s'}</span>
            </button>

            {/* Ações em Lote */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={() => onMarcarTodosVade(true)}
                className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition cursor-pointer"
                title="Marcar todos os artigos no Vade físico"
              >
                ✓ Todos
              </button>
              <button
                onClick={() => onMarcarTodosVade(false)}
                className="rounded-xl border border-black/10 dark:border-white/10 px-3 py-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer"
                title="Limpar todas as marcações"
              >
                Zerar
              </button>
            </div>
          </div>
        </div>

        {/* BARRA DE PROGRESSO LÍQUIDO */}
        <div className="pt-2 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-500 dark:text-zinc-400">Progresso no Vade Físico:</span>
            <strong className="text-emerald-600 dark:text-emerald-400 font-mono">
              {vadeMarcados.length} de {VADE_DATA.length} artigos destacados ({percentualConclusao}%)
            </strong>
          </div>
          <div className="flex items-center gap-2 flex-1 max-w-xs">
            <div className="flex-1 h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-sky-400"
                initial={{ width: 0 }}
                animate={{ width: `${percentualConclusao}%` }}
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            </div>
            {percentualConclusao === 100 && (
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                100% Concluído!
              </span>
            )}
          </div>
        </div>

        {/* DESAFIO RELÂMPAGO BANNER (SE ATIVO) */}
        <AnimatePresence>
          {modoDesafioAtivo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-2xl border border-amber-500/50 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 p-4 space-y-3 overflow-hidden"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-bold text-xs">
                    {desafioTempo}s
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                      Treino de Agilidade no Vade Físico (15 Segundos)
                    </h4>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      Abra seu Vade Mecum de papel e aponte o dedo no artigo antes que o cronômetro zere!
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-500 bg-amber-500/20 px-2.5 py-1 rounded-full">
                    {desafioAcertos} Acertos
                  </span>
                  <button
                    onClick={() => proximoDesafio(true)}
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white shadow-xs cursor-pointer"
                  >
                    ✓ Achei no Vade!
                  </button>
                  <button
                    onClick={() => proximoDesafio(false)}
                    className="rounded-xl border border-zinc-500/30 px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                  >
                    Pular
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/70 dark:bg-zinc-900/80 border border-amber-500/30 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wide">
                    Artigo Alvo:
                  </span>
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400">
                    {VADE_DATA[desafioIndex]?.ref}
                  </h3>
                </div>
                <span className={`badge b-${VADE_DATA[desafioIndex]?.cor}`}>
                  {VADE_DATA[desafioIndex]?.cor}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* NAVEGAÇÃO POR DIPLOMAS LEGAIS */}
        <div className="flex items-center gap-1.5 border-t border-black/10 dark:border-white/10 pt-3 flex-wrap">
          <span className="text-[11px] text-zinc-400 mr-1 font-medium">Diplomas:</span>
          {diplomas.map(dip => {
            const isActive = diplomaFiltro === dip.id;
            const Icon = dip.icon;
            return (
              <button
                key={dip.id}
                onClick={() => setDiplomaFiltro(dip.id)}
                className={`relative px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                  isActive
                    ? 'text-white'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="vade-diploma-active"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 shadow-sm"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5" />
                  <span>{dip.label}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* BUSCA RÁPIDA & MARCADORES DE CORES STABILO */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              value={buscaVade}
              onChange={e => setBuscaVade(e.target.value)}
              placeholder="Pesquisar por artigo, texto legal, tema ou doutrina (ex: Art. 151, Prescrição, Decadência, Pecunia Non Olet, LC 236)..."
              className="w-full rounded-xl border border-black/15 dark:border-white/15 bg-slate-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 pl-10 pr-9 py-2 text-xs placeholder-zinc-400 focus:outline-none focus:border-amber-400 transition"
            />
            {buscaVade && (
              <button
                onClick={() => setBuscaVade('')}
                className="absolute right-3 top-2.5 text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Marcadores de Cores com Contadores */}
          <div className="flex items-center gap-1.5 flex-wrap shrink-0">
            {[
              { val: 'TODAS', label: 'Todas as Cores', count: contagemCoresVade.TODAS },
              { val: 'AMARELO', label: '🟡 Amarelo', count: contagemCoresVade.AMARELO },
              { val: 'VERDE', label: '🟢 Verde', count: contagemCoresVade.VERDE },
              { val: 'ROSA', label: '🩷 Rosa', count: contagemCoresVade.ROSA },
              { val: 'AZUL', label: '🔵 Azul', count: contagemCoresVade.AZUL },
              { val: 'CLIPES', label: '📎 Clipes', count: contagemCoresVade.CLIPES }
            ].map(cor => {
              const ativo = corFiltroVade === cor.val;
              return (
                <button
                  key={cor.val}
                  onClick={() => setCorFiltroVade(cor.val)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition cursor-pointer inline-flex items-center gap-1.5 ${
                    ativo
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                      : 'border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-zinc-600 dark:text-zinc-300 hover:bg-black/10'
                  }`}
                >
                  <span>{cor.label}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                      ativo ? 'bg-slate-950 text-amber-300' : 'bg-black/10 dark:bg-white/15'
                    }`}
                  >
                    {cor.count}
                  </span>
                </button>
              );
            })}

            {/* Filtro Rápido: Apenas Marcados */}
            <button
              onClick={() => setFiltroApenasMarcadosVade(!filtroApenasMarcadosVade)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition inline-flex items-center gap-1.5 cursor-pointer ${
                filtroApenasMarcadosVade
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-black/10'
              }`}
            >
              <Check className="h-3 w-3" />
              <span>Marcados ({vadeMarcados.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* ÁREA PRINCIPAL: MODO FICHÁRIO / MODO LIVRO ABERTO / MODO TABELA */}
      <AnimatePresence mode="wait">
        {visaoModo === 'fichario' && (
          /* MODO FICHÁRIO: SPLIT-VIEW (ÍNDICE À ESQUERDA + PÁGINA COMPLETA À DIREITA COM TEXTO LEGAL E DESCRIÇÃO) */
          <motion.div
            key="fichario-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start"
          >
            {/* COLUNA ESQUERDA: ÍNDICE DE ARTIGOS COM TÍTULOS VISÍVEIS (Lg: col-span-5) */}
            <div className="lg:col-span-5 rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md p-3.5 space-y-2 shadow-xs max-h-[820px] flex flex-col">
              <div className="flex items-center justify-between px-1 pb-2 border-b border-black/10 dark:border-white/10">
                <span className="text-xs font-bold text-zinc-900 dark:text-white">
                  Índice de Artigos ({vadeFiltrados.length})
                </span>
                <span className="text-[11px] text-zinc-400">
                  Clique para folhear
                </span>
              </div>

              <div className="overflow-y-auto space-y-2 pr-1 flex-1">
                {vadeFiltrados.length > 0 ? (
                  vadeFiltrados.map(item => {
                    const isSelected = artigoAtivo?.originalIndex === item.originalIndex;
                    const isChecked = vadeMarcados.includes(item.originalIndex);
                    const corInfo = getCorInfo(item.cor);

                    return (
                      <motion.div
                        key={item.originalIndex}
                        onClick={() => setArtigoSelecionadoIndex(item.originalIndex)}
                        whileTap={{ scale: 0.99 }}
                        className={`group relative p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                          isSelected
                            ? 'border-sky-500 bg-sky-50/90 dark:bg-sky-950/40 shadow-xs ring-1 ring-sky-500/30'
                            : 'border-black/5 dark:border-white/5 bg-slate-50/70 dark:bg-zinc-900/60 hover:border-black/15 dark:hover:border-white/15'
                        }`}
                      >
                        {/* Faixa vertical Stabilo indicadora de cor */}
                        <div
                          className={`absolute left-0 top-2 bottom-2 w-1.5 rounded-r ${corInfo.indicadorBg}`}
                        />

                        <div className="flex-1 min-w-0 pl-2 space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                              {item.artigoNum || item.ref.split('–')[0]?.trim()}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/5 dark:bg-white/10 text-zinc-500 dark:text-zinc-300 font-mono">
                              {item.diplomaNome ? item.diplomaNome.split('(')[0]?.trim() : ''}
                            </span>
                            {item.novo && (
                              <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-700 dark:text-amber-300 border border-amber-400/40">
                                🆕 2026
                              </span>
                            )}
                          </div>

                          {/* Título sem supressão agressiva */}
                          <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-200 leading-snug">
                            {item.titulo || item.ref.split('–')[1]?.trim() || item.ref}
                          </p>

                          {/* Trecho descritivo para escaneamento */}
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                            {item.descricaoDetalhada || item.obs || item.textoCompleto}
                          </p>
                        </div>

                        {/* Botão de Marcar Rápido */}
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            handleToggleArtigo(item.originalIndex);
                          }}
                          className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 transition cursor-pointer mt-0.5 ${
                            isChecked
                              ? 'bg-emerald-500 text-white shadow-xs'
                              : 'border border-black/15 dark:border-white/20 text-zinc-400 hover:border-emerald-500 hover:text-emerald-500'
                          }`}
                          title={isChecked ? 'Destacado no Vade Físico' : 'Marcar no Vade Físico'}
                        >
                          <Check className="h-4 w-4 stroke-[2.5]" />
                        </button>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-xs text-zinc-400">
                    Nenhum artigo encontrado para o filtro atual.
                  </div>
                )}
              </div>
            </div>

            {/* COLUNA DIREITA: PÁGINA DO VADE MECUM REALISTA COM TEOR INTEGRAL E DESCRIÇÃO COMPLETA (Lg: col-span-7) */}
            <div className="lg:col-span-7">
              {artigoAtivo ? (
                <motion.div
                  key={artigoAtivo.originalIndex}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22 }}
                  className="rounded-2xl border border-black/10 dark:border-white/10 bg-gradient-to-b from-[#faf9f6] to-[#f4f3ef] dark:from-zinc-800 dark:to-zinc-850 p-5 lg:p-6 shadow-md text-zinc-900 dark:text-zinc-100 space-y-5 relative overflow-hidden"
                >
                  {/* Linha decorativa de encadernação do Vade Mecum */}
                  <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-r from-black/15 dark:from-white/10 to-transparent" />

                  {/* CABEÇALHO DO ARTIGO NO VADE */}
                  <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{getCorInfo(artigoAtivo.cor).penEmoji}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`badge b-${artigoAtivo.cor} text-[10px] font-bold`}>
                            {getCorInfo(artigoAtivo.cor).nome}
                          </span>
                          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono uppercase tracking-wider">
                            {artigoAtivo.diplomaNome || 'Legislação Tributária'}
                          </span>
                        </div>
                        <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                          {artigoAtivo.ref}
                        </h2>
                      </div>
                    </div>

                    {/* Controles de Navegação Rápida */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          const idx = vadeFiltrados.findIndex(
                            a => a.originalIndex === artigoAtivo.originalIndex
                          );
                          if (idx > 0) {
                            setArtigoSelecionadoIndex(vadeFiltrados[idx - 1].originalIndex);
                          }
                        }}
                        className="p-1.5 rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-300 cursor-pointer"
                        title="Artigo Anterior"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          const idx = vadeFiltrados.findIndex(
                            a => a.originalIndex === artigoAtivo.originalIndex
                          );
                          if (idx < vadeFiltrados.length - 1) {
                            setArtigoSelecionadoIndex(vadeFiltrados[idx + 1].originalIndex);
                          }
                        }}
                        className="p-1.5 rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-300 cursor-pointer"
                        title="Próximo Artigo"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* SEÇÃO 1: TEOR INTEGRAL DA LEI (TEXTO LITERAL DO DISPOSITIVO - SEM SUPRESSÃO) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        <Scale className="h-4 w-4 text-amber-500" />
                        <span>Teor Oficial da Lei (Texto na Íntegra)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copiarTextoLiteral(artigoAtivo.textoCompleto, artigoAtivo.originalIndex)}
                        className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                        title="Copiar redação legal do artigo"
                      >
                        <Copy className="h-3 w-3" />
                        <span>{textoCopiadoIndex === artigoAtivo.originalIndex ? 'Copiado!' : 'Copiar Texto da Lei'}</span>
                      </button>
                    </div>

                    {/* Caixa de Texto Legal com Efeito Stabilo e Tipografia de Código */}
                    <div
                      onClick={() => handleToggleArtigo(artigoAtivo.originalIndex)}
                      className={`p-4 sm:p-5 rounded-xl border transition-all cursor-pointer select-text relative ${
                        vadeMarcados.includes(artigoAtivo.originalIndex)
                          ? `${getCorInfo(artigoAtivo.cor).bgSuave} ${getCorInfo(artigoAtivo.cor).borda} shadow-sm ring-1 ring-black/5`
                          : 'border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/80 hover:border-black/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300 font-mono">
                          {artigoAtivo.artigoNum || 'Dispositivo'}
                        </span>
                        <div
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition ${
                            vadeMarcados.includes(artigoAtivo.originalIndex)
                              ? 'bg-emerald-500 text-white'
                              : 'border border-black/15 dark:border-white/15 bg-black/5 dark:bg-white/5 text-zinc-600 dark:text-zinc-300'
                          }`}
                        >
                          <Check className="h-3 w-3 stroke-[2.5]" />
                          <span>
                            {vadeMarcados.includes(artigoAtivo.originalIndex)
                              ? 'Marcado no Vade'
                              : 'Destacar'}
                          </span>
                        </div>
                      </div>

                      {/* TEXTO COMPLETO SEM SUPRESSÃO */}
                      <div
                        className={`font-serif tracking-normal text-zinc-900 dark:text-zinc-100 whitespace-pre-line leading-relaxed ${classesFonte.lei}`}
                      >
                        {artigoAtivo.textoCompleto}
                      </div>

                      {artigoAtivo.novo && (
                        <div className="mt-3 pt-2 border-t border-black/10 dark:border-white/10 flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-300">
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>Atualização Recente: LC 236/2026 / LC 227/2026 / EC 132/2023</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SEÇÃO 2: DESCRIÇÃO DOUTRINÁRIA & ANÁLISE JURÍDICA COMPLETA (SEM SUPRESSÃO) */}
                  <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-900/60 p-4 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      <BookOpen className="h-4 w-4 text-indigo-500" />
                      <span>Descrição Jurídica e Doutrinária do Artigo</span>
                    </div>
                    <div
                      className={`text-zinc-700 dark:text-zinc-300 whitespace-pre-line leading-relaxed ${classesFonte.desc}`}
                    >
                      {artigoAtivo.descricaoDetalhada}
                    </div>
                  </div>

                  {/* SEÇÃO 3: APLICAÇÃO NA 2ª FASE FGV & CUIDADO COM A PEGADINHA */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="p-3.5 rounded-xl border border-sky-500/25 bg-sky-500/5 dark:bg-sky-500/10 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400">
                        <Lightbulb className="h-4 w-4" />
                        <span>Aplicação na Peça & Espelho FGV</span>
                      </div>
                      <p className={`text-zinc-700 dark:text-zinc-300 leading-relaxed ${classesFonte.meta}`}>
                        {artigoAtivo.aplicacaoPeca ||
                          'Fundamento obrigatório para pontuar no espelho de correção oficial quando a tese de mérito ou preliminar envolver esta matéria.'}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-amber-500/25 bg-amber-500/5 dark:bg-amber-500/10 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Cuidado com a Pegadinha da FGV</span>
                      </div>
                      <p className={`text-zinc-700 dark:text-zinc-300 leading-relaxed ${classesFonte.meta}`}>
                        {artigoAtivo.pegadinhaFGV ||
                          'Nunca esqueça de indicar o inciso ou parágrafo exato na redação; a banca FGV não pontua artigos citados sem especificação do dispositivo.'}
                      </p>
                    </div>
                  </div>

                  {/* DICA ESPECIAL DA BANCA SE HOUVER */}
                  {artigoAtivo.obs && (
                    <div className="p-3 rounded-xl border border-purple-500/20 bg-purple-500/5 dark:bg-purple-500/10 flex items-start gap-2 text-xs">
                      <span className="text-sm">📌</span>
                      <div className="text-zinc-700 dark:text-zinc-300">
                        <strong className="text-purple-600 dark:text-purple-400">Dica da Banca:</strong>{' '}
                        {artigoAtivo.obs}
                      </div>
                    </div>
                  )}

                  {/* BARRA DE AÇÕES DA PÁGINA */}
                  <div className="flex items-center justify-between border-t border-black/10 dark:border-white/10 pt-4 flex-wrap gap-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => narrarArtigoCompleto(artigoAtivo, artigoAtivo.originalIndex)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition inline-flex items-center gap-1.5 cursor-pointer ${
                          narrandoIndex === artigoAtivo.originalIndex
                            ? 'bg-sky-600 text-white'
                            : 'border border-black/15 dark:border-white/15 bg-black/5 dark:bg-white/5 hover:bg-black/10 text-zinc-700 dark:text-zinc-200'
                        }`}
                      >
                        {narrandoIndex === artigoAtivo.originalIndex ? (
                          <>
                            <VolumeX className="h-3.5 w-3.5" />
                            <span>Pausar Leitura de Voz</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="h-3.5 w-3.5" />
                            <span>Ouvir Artigo Completo</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => copiarECitar(artigoAtivo, artigoAtivo.originalIndex)}
                        className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition inline-flex items-center gap-1.5 cursor-pointer ${
                          itemCitadoFeedback === artigoAtivo.originalIndex
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xs'
                        }`}
                      >
                        {itemCitadoFeedback === artigoAtivo.originalIndex ? (
                          <>
                            <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                            <span>✓ Citado no Editor!</span>
                          </>
                        ) : (
                          <>
                            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                            <span>Citar no Simulador 150L</span>
                          </>
                        )}
                      </button>
                    </div>

                    <span className="text-[11px] text-zinc-400 font-mono">
                      Item {vadeFiltrados.findIndex(a => a.originalIndex === artigoAtivo.originalIndex) + 1} de {vadeFiltrados.length}
                    </span>
                  </div>
                </motion.div>
              ) : (
                <div className="p-12 text-center rounded-2xl border border-dashed border-black/15 dark:border-white/15 text-zinc-400">
                  Selecione um artigo no índice para visualizar a página completa de estudo.
                </div>
              )}
            </div>
          </motion.div>
        )}

        {visaoModo === 'leitura' && (
          /* MODO LIVRO ABERTO / LEITURA CONTÍNUA: TODOS OS ARTIGOS EXIBIDOS COM TEOR INTEGRAL E DESCRIÇÕES SEM SUPRESSÃO */
          <motion.div
            key="leitura-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between px-2 py-1 text-xs text-zinc-500 dark:text-zinc-400">
              <span>
                Visualização Contínua de Artigos ({vadeFiltrados.length} dispositivos carregados)
              </span>
              <span>Todos os textos e descrições na íntegra</span>
            </div>

            <div className="space-y-4">
              {vadeFiltrados.map((item, idx) => {
                const isChecked = vadeMarcados.includes(item.originalIndex);
                const corInfo = getCorInfo(item.cor);

                return (
                  <motion.div
                    key={item.originalIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(idx * 0.03, 0.4) }}
                    className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md p-5 sm:p-6 shadow-sm space-y-4 relative overflow-hidden"
                  >
                    {/* Borda decorativa lateral Stabilo */}
                    <div className={`absolute left-0 top-0 bottom-0 w-2 ${corInfo.indicadorBg}`} />

                    <div className="flex items-center justify-between flex-wrap gap-2 pl-2">
                      <div className="flex items-center gap-2">
                        <span className={`badge b-${item.cor} text-[10px] font-bold`}>
                          {item.cor}
                        </span>
                        <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                          {item.ref}
                        </h3>
                        {item.novo && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-700 dark:text-amber-300 border border-amber-400/40">
                            🆕 2026
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => copiarTextoLiteral(item.textoCompleto, item.originalIndex)}
                          className="p-1.5 rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-300 text-xs inline-flex items-center gap-1 cursor-pointer"
                          title="Copiar texto"
                        >
                          <Copy className="h-3 w-3" />
                          <span>{textoCopiadoIndex === item.originalIndex ? 'Copiado!' : 'Copiar'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => copiarECitar(item, item.originalIndex)}
                          className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                          title="Citar no simulador"
                        >
                          <Plus className="h-3 w-3 stroke-[2.5]" />
                          <span>Citar 150L</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleArtigo(item.originalIndex)}
                          className={`h-7 px-2.5 rounded-lg flex items-center gap-1.5 text-xs font-bold transition cursor-pointer ${
                            isChecked
                              ? 'bg-emerald-500 text-white shadow-xs'
                              : 'border border-black/15 dark:border-white/20 text-zinc-500 hover:border-emerald-500'
                          }`}
                        >
                          <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                          <span>{isChecked ? 'Marcado' : 'Marcar'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Texto Legal na Íntegra */}
                    <div
                      className={`pl-2 p-4 rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-zinc-900/60 font-serif whitespace-pre-line text-zinc-900 dark:text-zinc-100 ${classesFonte.lei}`}
                    >
                      {item.textoCompleto}
                    </div>

                    {/* Descrição Detalhada na Íntegra */}
                    <div className="pl-2 space-y-1">
                      <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-sky-500" />
                        <span>Descrição Doutrinária e Análise Prática:</span>
                      </div>
                      <p
                        className={`text-zinc-600 dark:text-zinc-300 whitespace-pre-line leading-relaxed ${classesFonte.desc}`}
                      >
                        {item.descricaoDetalhada}
                      </p>
                    </div>

                    {/* Dica da Banca e Pegadinha */}
                    <div className="pl-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      {item.aplicacaoPeca && (
                        <div className="p-2.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-zinc-700 dark:text-zinc-300">
                          <strong className="text-sky-600 dark:text-sky-400">Aplicação na Peça:</strong>{' '}
                          {item.aplicacaoPeca}
                        </div>
                      )}
                      {item.pegadinhaFGV && (
                        <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-zinc-700 dark:text-zinc-300">
                          <strong className="text-amber-600 dark:text-amber-400">Atenção à Pegadinha:</strong>{' '}
                          {item.pegadinhaFGV}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {visaoModo === 'tabela' && (
          /* MODO TABELA ÁGIL: COM SANFONA ACCORDION PARA EXPANDIR O TEOR INTEGRAL E DESCRIÇÃO SEM SUPRESSÃO */
          <motion.div
            key="tabela-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md p-4 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 px-1 pb-1">
              <span>Clique na linha para expandir o texto oficial e a descrição integral</span>
              <button
                type="button"
                onClick={() => {
                  if (linhasExpandidasTabela.length === vadeFiltrados.length) {
                    setLinhasExpandidasTabela([]);
                  } else {
                    setLinhasExpandidasTabela(vadeFiltrados.map(i => i.originalIndex));
                  }
                }}
                className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
              >
                {linhasExpandidasTabela.length === vadeFiltrados.length
                  ? 'Recolher Todos'
                  : 'Expandir Todos os Artigos'}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-black/10 dark:border-white/10 text-zinc-400">
                    <th className="py-2.5 px-3 text-center w-12">Status</th>
                    <th className="py-2.5 px-3 text-left w-24">Cor</th>
                    <th className="py-2.5 px-3 text-left">Dispositivo & Tema</th>
                    <th className="py-2.5 px-3 text-left">Observação / Atualização</th>
                    <th className="py-2.5 px-3 text-right w-44">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                  {vadeFiltrados.map(item => {
                    const isChecked = vadeMarcados.includes(item.originalIndex);
                    const isExpanded = linhasExpandidasTabela.includes(item.originalIndex);

                    return (
                      <React.Fragment key={item.originalIndex}>
                        <tr
                          onClick={() => toggleLinhaTabela(item.originalIndex)}
                          className={`hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer ${
                            isChecked ? 'bg-emerald-500/5' : ''
                          }`}
                        >
                          <td className="py-2.5 px-3 text-center" onClick={e => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => handleToggleArtigo(item.originalIndex)}
                              className={`h-5 w-5 rounded-md flex items-center justify-center transition cursor-pointer mx-auto ${
                                isChecked
                                  ? 'bg-emerald-500 text-white'
                                  : 'border border-black/20 dark:border-white/20 text-zinc-400 hover:border-emerald-500'
                              }`}
                            >
                              {isChecked && <Check className="h-3 w-3 stroke-[2.5]" />}
                            </button>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`badge b-${item.cor}`}>{item.cor}</span>
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span>{item.ref}</span>
                              {item.novo && (
                                <span className="text-[9px] font-bold text-amber-600 dark:text-amber-300">
                                  🆕 2026
                                </span>
                              )}
                            </div>
                            {item.titulo && (
                              <div className="text-[11px] font-normal text-zinc-500 dark:text-zinc-400">
                                {item.titulo}
                              </div>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-zinc-600 dark:text-zinc-400">
                            {item.obs || item.aplicacaoPeca || '—'}
                          </td>
                          <td className="py-2.5 px-3 text-right" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => copiarECitar(item, item.originalIndex)}
                                className="px-2 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] cursor-pointer"
                                title="Citar no Simulador"
                              >
                                + Citar 150L
                              </button>
                              <button
                                type="button"
                                onClick={() => narrarArtigoCompleto(item, item.originalIndex)}
                                className="p-1 rounded border border-black/10 dark:border-white/10 hover:bg-black/10 text-zinc-600 dark:text-zinc-300 cursor-pointer"
                                title="Ouvir Artigo"
                              >
                                <Volume2 className="h-3 w-3" />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* LINHA EXPANDIDA COM TEXTO OFICIAL E DESCRIÇÃO INTEGRAL (SEM SUPRESSÃO) */}
                        {isExpanded && (
                          <tr className="bg-slate-50/80 dark:bg-zinc-900/60">
                            <td colSpan={5} className="p-4 space-y-3">
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-3 text-xs"
                              >
                                <div className="p-3.5 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 space-y-1.5">
                                  <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-[11px] font-mono">
                                    <span>📜 TEOR INTEGRAL DA LEI ({item.diplomaNome || item.ref})</span>
                                    <button
                                      type="button"
                                      onClick={() => copiarTextoLiteral(item.textoCompleto, item.originalIndex)}
                                      className="text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                                    >
                                      Copiar Texto
                                    </button>
                                  </div>
                                  <p className="font-serif text-zinc-900 dark:text-zinc-100 whitespace-pre-line leading-relaxed text-sm">
                                    {item.textoCompleto}
                                  </p>
                                </div>

                                <div className="p-3.5 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-800/70 space-y-1">
                                  <span className="text-zinc-500 dark:text-zinc-400 text-[11px] font-mono">
                                    📚 DESCRIÇÃO JURÍDICA E ANÁLISE PRÁTICA FGV
                                  </span>
                                  <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-line leading-relaxed text-xs">
                                    {item.descricaoDetalhada}
                                  </p>
                                </div>

                                {(item.aplicacaoPeca || item.pegadinhaFGV) && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                                    {item.aplicacaoPeca && (
                                      <div className="p-2.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-zinc-700 dark:text-zinc-300">
                                        <strong className="text-sky-600 dark:text-sky-400">Aplicação na Peça:</strong>{' '}
                                        {item.aplicacaoPeca}
                                      </div>
                                    )}
                                    {item.pegadinhaFGV && (
                                      <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-zinc-700 dark:text-zinc-300">
                                        <strong className="text-amber-600 dark:text-amber-400">Pegadinha:</strong>{' '}
                                        {item.pegadinhaFGV}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
