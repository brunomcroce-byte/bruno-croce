/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  CATALOGO_PECAS,
  PECOMETRO_DATA,
  ROTEIROS,
  PECA_EXAMES,
  CASOS_SIMULADO,
  IMPOSTOS_DATA,
  MATERIAL_DATA,
  PRECEDENTES_QUALIFICADOS,
  SUMULAS_DATA,
  FLASHCARDS_DATA,
  VADE_DATA,
  CRONOGRAMA_DATA,
  TESES_DATA,
  TESES_CONT,
  ESTRUTURA_CONTROLE_AULAS,
  PecaCatalogo
} from './data/tributarioData';
import { SafeStorage } from './utils/storage';
import {
  tocarAlarmeWebAudio,
  lerTextoEmVozAlta,
  testarAlarmeSonoro,
  TomAlarme,
  TONS_ALARME
} from './utils/audio';
import {
  baixarTodasPecasNoWord,
  exportarRedacaoNoWord,
  exportarFlashcardsNoWord,
  baixarRedacaoTxt
} from './utils/exportWord';
import { exportarEsqueletoParaPdf, imprimirEsqueletoPeca, exportarRelatorioSemanalPdf } from './utils/exportPdf';
import { dispararConfetesSuaves, dispararMegaConfetes150L } from './utils/confetti';
import { CronogramaProgressoChart } from './components/CronogramaProgressoChart';
import { GraficoComparativoMensal } from './components/GraficoComparativoMensal';
import { NotificacaoEstudoModal } from './components/NotificacaoEstudoModal';
import { BuscaGlobalModal } from './components/BuscaGlobalModal';
import { SimuladorApoioDrawer } from './components/SimuladorApoioDrawer';
import { DicaDoDiaCard } from './components/DicaDoDiaCard';
import { SimuladoSemanalView } from './components/SimuladoSemanalView';
import { MetasDiariasCard } from './components/MetasDiariasCard';
import { SIMULADOS_FGV_32, SimuladoFGV } from './data/simuladosFgvData';
import { SimuladorSintaxeOverlay } from './components/SimuladorSintaxeOverlay';
import { SimuladorSintaxeBar } from './components/SimuladorSintaxeBar';
import { parseLegalSyntax, SyntaxCategory } from './utils/syntaxHighlight';
import { lookupLegalTerm, LegalTooltipInfo } from './utils/legalGlossary';
import { TooltipJuridico } from './components/TooltipJuridico';
import { GerenciadorVersoesModal, VersaoRedacao } from './components/GerenciadorVersoesModal';
import { NotificacaoFimSimuladoModal } from './components/NotificacaoFimSimuladoModal';
import { CentralAtualizacoesModal } from './components/CentralAtualizacoesModal';
import { onlineLegalSync, StatusConexao } from './utils/onlineLegalSync';
import {
  soundscapeManager,
  SoundscapeTipo,
  SOUNDSCAPE_OPCOES
} from './utils/soundscapes';
import { analisarPecaEmTempoReal } from './utils/pecaAnalyzer';
import { SimuladorAnalisePecaCard } from './components/SimuladorAnalisePecaCard';
import {
  BookOpen,
  Calendar,
  Clock,
  Compass,
  Download,
  FileCheck2,
  FileText,
  HelpCircle,
  Highlighter,
  Layers,
  Map as MapIcon,
  Play,
  RotateCcw,
  Scale,
  Sparkles,
  Volume2,
  CheckCircle2,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Eye,
  Award,
  Search,
  Check,
  Bell,
  Bookmark,
  Plus,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Minus,
  Square,
  Maximize2,
  Sun,
  Moon,
  Star,
  Printer,
  Monitor,
  History,
  GitCompare,
  Headphones,
  Pause,
  RefreshCw,
  Wifi,
  Database
} from 'lucide-react';

type TabType =
  | 'dashboard'
  | 'cronograma'
  | 'pecas'
  | 'impostos'
  | 'material'
  | 'sumulas'
  | 'simulador'
  | 'flashcards'
  | 'vademecum'
  | 'legislacao'
  | 'mapas'
  | 'teses'
  | 'planner';

export type PomodoroModo = '50m' | '25m';
export type PomodoroTipo = 'foco' | 'pausa';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Pomodoro Timer State (50 min padrão vs 25 min clássico com pausa curta de 5 min)
  const [pomodoroModo, setPomodoroModo] = useState<PomodoroModo>(() => {
    const salvo = SafeStorage.get('tributa_pomodoro_modo', '50m');
    return salvo === '25m' ? '25m' : '50m';
  });
  const [pomodoroTipo, setPomodoroTipo] = useState<PomodoroTipo>('foco');
  const [pomodoroSecs, setPomodoroSecs] = useState<number>(() => {
    const salvo = SafeStorage.get('tributa_pomodoro_modo', '50m');
    return salvo === '25m' ? 25 * 60 : 50 * 60;
  });
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const [pomodoroConcluido, setPomodoroConcluido] = useState(false);

  // Contador de Blocos Pomodoro Diários (com auto-reset à meia-noite 00:00)
  const [pomodoroBlocosHoje, setPomodoroBlocosHoje] = useState<number>(() => {
    const hoje = new Date().toISOString().slice(0, 10);
    const dataSalva = SafeStorage.get('tributa_pomodoro_data_dia', '');
    if (dataSalva !== hoje) {
      SafeStorage.set('tributa_pomodoro_data_dia', hoje);
      SafeStorage.set('tributa_pomodoro_blocos_hoje', '0');
      return 0;
    }
    const salvo = SafeStorage.get('tributa_pomodoro_blocos_hoje', '0');
    return Number(salvo) || 0;
  });

  const resetarBlocosPomodoroHoje = () => {
    const hoje = new Date().toISOString().slice(0, 10);
    setPomodoroBlocosHoje(0);
    SafeStorage.set('tributa_pomodoro_data_dia', hoje);
    SafeStorage.set('tributa_pomodoro_blocos_hoje', '0');
    tocarAlarmeWebAudio('suave');
    mostrarToast('🔄 Contador diário de blocos Pomodoro zerado! (Reseta automaticamente à meia-noite)');
  };

  const ajustarBlocosPomodoroHoje = (delta: number) => {
    const hoje = new Date().toISOString().slice(0, 10);
    const novo = Math.max(0, pomodoroBlocosHoje + delta);
    setPomodoroBlocosHoje(novo);
    SafeStorage.set('tributa_pomodoro_data_dia', hoje);
    SafeStorage.set('tributa_pomodoro_blocos_hoje', String(novo));
    if (delta > 0) {
      tocarAlarmeWebAudio('suave');
      dispararConfetesSuaves({ count: 35, originY: 0.35 });
      mostrarToast(`🍅 +1 Bloco Pomodoro registrado! Total de hoje: ${novo} bloco${novo > 1 ? 's' : ''}.`);
    } else {
      mostrarToast(`Bloco Pomodoro removido. Total de hoje: ${novo}.`);
    }
  };

  const contabilizarBlocoFocoConcluido = () => {
    const hoje = new Date().toISOString().slice(0, 10);
    const dataSalva = SafeStorage.get('tributa_pomodoro_data_dia', '');
    const contagemAtual = dataSalva === hoje ? Number(SafeStorage.get('tributa_pomodoro_blocos_hoje', '0')) || 0 : 0;
    const novoTotal = contagemAtual + 1;
    SafeStorage.set('tributa_pomodoro_data_dia', hoje);
    SafeStorage.set('tributa_pomodoro_blocos_hoje', String(novoTotal));
    setPomodoroBlocosHoje(novoTotal);
    return novoTotal;
  };

  // Soundscape de Foco (Ruído Branco, Chuva, Lo-fi) via Web Audio API
  const [soundscapeTipo, setSoundscapeTipo] = useState<SoundscapeTipo>(() => {
    const salvo = SafeStorage.get('tributa_pomodoro_soundscape', 'nenhum');
    if (salvo === 'ruido_branco' || salvo === 'chuva' || salvo === 'lofi') {
      return salvo;
    }
    return 'nenhum';
  });
  const [soundscapeVolume, setSoundscapeVolume] = useState<number>(() => {
    return soundscapeManager.getVolume();
  });
  const [soundscapeTocando, setSoundscapeTocando] = useState(false);
  const [soundscapePreviewManual, setSoundscapePreviewManual] = useState(false);

  // Efeito para ligar/desligar o Soundscape de Foco automaticamente durante os blocos de foco do Pomodoro
  useEffect(() => {
    const deveTocar =
      (pomodoroRunning && pomodoroTipo === 'foco' && soundscapeTipo !== 'nenhum') ||
      soundscapePreviewManual;

    if (deveTocar) {
      soundscapeManager.reproduzir(soundscapeTipo);
      setSoundscapeTocando(true);
    } else {
      soundscapeManager.parar();
      setSoundscapeTocando(false);
    }
  }, [pomodoroRunning, pomodoroTipo, soundscapeTipo, soundscapePreviewManual]);

  const alterarSoundscapeTipo = (novoTipo: SoundscapeTipo) => {
    setSoundscapeTipo(novoTipo);
    SafeStorage.set('tributa_pomodoro_soundscape', novoTipo);
    if (novoTipo === 'nenhum') {
      soundscapeManager.parar();
      setSoundscapeTocando(false);
      setSoundscapePreviewManual(false);
      mostrarToast('🔇 Soundscape desligado.');
    } else {
      const opcao = SOUNDSCAPE_OPCOES.find(o => o.id === novoTipo);
      if (pomodoroRunning && pomodoroTipo === 'foco') {
        soundscapeManager.reproduzir(novoTipo);
        setSoundscapeTocando(true);
        mostrarToast(`${opcao?.icone} Soundscape "${opcao?.nome}" tocando no seu bloco de foco!`);
      } else {
        mostrarToast(`${opcao?.icone} Soundscape "${opcao?.nome}" ativado para tocar nos blocos de foco!`);
      }
    }
  };

  const alterarVolumeSoundscape = (novoVol: number) => {
    setSoundscapeVolume(novoVol);
    soundscapeManager.setVolume(novoVol);
  };

  const alternarPreviewSoundscape = () => {
    if (soundscapeTipo === 'nenhum') {
      alterarSoundscapeTipo('ruido_branco');
      setSoundscapePreviewManual(true);
      return;
    }
    const novoPreview = !soundscapePreviewManual;
    setSoundscapePreviewManual(novoPreview);
    if (novoPreview) {
      soundscapeManager.reproduzir(soundscapeTipo);
      setSoundscapeTocando(true);
      const nome = soundscapeTipo === 'ruido_branco' ? 'Ruído Branco' : soundscapeTipo === 'chuva' ? 'Chuva' : 'Lo-fi';
      mostrarToast(`🎧 Pré-visualização do Soundscape "${nome}" iniciada.`);
    } else {
      if (!pomodoroRunning || pomodoroTipo !== 'foco') {
        soundscapeManager.parar();
        setSoundscapeTocando(false);
      }
      mostrarToast('Pré-visualização de áudio pausada.');
    }
  };

  // 5h Exam Timer State
  const [prova5hSecs, setProva5hSecs] = useState(5 * 3600);
  const [prova5hRunning, setProva5hRunning] = useState(false);

  // Exam Dates & Status
  const [dataRepescagem, setDataRepescagem] = useState(() =>
    SafeStorage.get('tributa_data_rep', '2026-11-23')
  );
  const [dataProva, setDataProva] = useState(() =>
    SafeStorage.get('tributa_data_prv', '2027-02-28')
  );
  const [repescagemPaga, setRepescagemPaga] = useState(() =>
    SafeStorage.get('tributa_rep_ok', 'false') === 'true'
  );

  // Cronograma Tasks
  const [tarefasConcluidas, setTarefasConcluidas] = useState<string[]>(() => {
    try {
      return JSON.parse(SafeStorage.get('tributa_cronograma_v3', '[]'));
    } catch {
      return [];
    }
  });

  // Vade Mecum Markings
  const [vadeMarcados, setVadeMarcados] = useState<number[]>(() => {
    try {
      return JSON.parse(SafeStorage.get('tributa_vade_v1', '[]'));
    } catch {
      return [];
    }
  });
  const [corFiltroVade, setCorFiltroVade] = useState<string>('TODAS');
  const [buscaVade, setBuscaVade] = useState('');
  const [filtroApenasMarcadosVade, setFiltroApenasMarcadosVade] = useState(false);

  // Peças module
  const [pecaSelecionada, setPecaSelecionada] = useState<PecaCatalogo>(CATALOGO_PECAS[0]);
  const [pecometroNode, setPecometroNode] = useState<string>('inicio');
  const [pecometroResultado, setPecometroResultado] = useState<string | null>(null);
  const [pecasFavoritas, setPecasFavoritas] = useState<string[]>(() => {
    try {
      const raw = SafeStorage.get('tributa_pecas_favoritas', '');
      if (raw) return JSON.parse(raw);
      // Padrão inicial: as peças campeãs de incidência na FGV (MS e Apelação)
      return ['MS', 'APELACAO'];
    } catch {
      return ['MS', 'APELACAO'];
    }
  });
  const [filtroApenasFavoritasPecas, setFiltroApenasFavoritasPecas] = useState(false);

  // Impostos module
  const [filtroImposto, setFiltroImposto] = useState<string>('TODOS');

  // Material & Precedentes module
  const [buscaMaterial, setBuscaMaterial] = useState('');
  const [catMaterial, setCatMaterial] = useState('TODAS');
  const [tribPrecedente, setTribPrecedente] = useState('TODOS');
  const [temaPrecedente, setTemaPrecedente] = useState('TODOS');

  // Súmulas module
  const [buscaSumula, setBuscaSumula] = useState('');
  const [filtroTribunal, setFiltroTribunal] = useState('TODOS');
  const [filtroApenasRecentes, setFiltroApenasRecentes] = useState(false);

  // Simulador 150 Linhas
  const [casoIndex, setCasoIndex] = useState(0);
  const [paginaFolha, setPaginaFolha] = useState(1);
  const [modoRascunho, setModoRascunho] = useState(false);
  const [textoRedacao, setTextoRedacao] = useState(() =>
    SafeStorage.get('tributa_redacao', '')
  );
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const syntaxOverlayRef = useRef<HTMLDivElement>(null);

  // Destaque de Sintaxe Jurídica no Simulador 150 Linhas (Peças, Artigos, Tributos e Teses FGV)
  const [destaqueSintaxe, setDestaqueSintaxe] = useState(() =>
    SafeStorage.get('tributa_destaque_sintaxe', 'true') === 'true'
  );
  const [sintaxeCategorias, setSintaxeCategorias] = useState<Record<SyntaxCategory, boolean>>({
    peca: true,
    artigo: true,
    tributo: true,
    tese: true
  });

  const toggleCategoriaSintaxe = (cat: SyntaxCategory) => {
    setSintaxeCategorias(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  const handleEditorScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (syntaxOverlayRef.current) {
      syntaxOverlayRef.current.scrollTop = e.currentTarget.scrollTop;
      syntaxOverlayRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  const sintaxeResultado = useMemo(() => {
    return parseLegalSyntax(textoRedacao, { activeCategories: sintaxeCategorias });
  }, [textoRedacao, sintaxeCategorias]);

  // Tooltips Jurídicos nos Termos Destacados pela Sintaxe FGV
  const [tooltipsAtivos, setTooltipsAtivos] = useState(() =>
    SafeStorage.get('tributa_tooltips_sintaxe', 'true') === 'true'
  );
  const [tooltipInfo, setTooltipInfo] = useState<LegalTooltipInfo | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number } | null>(null);
  const tooltipLeaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleHoverSyntaxTerm = (term: string, category: SyntaxCategory, rect: DOMRect) => {
    if (!tooltipsAtivos) return;
    if (tooltipLeaveTimerRef.current) {
      clearTimeout(tooltipLeaveTimerRef.current);
      tooltipLeaveTimerRef.current = null;
    }

    const info = lookupLegalTerm(term, category);
    const tooltipWidth = 360;
    const tooltipHeight = 280;
    const padding = 16;

    let left = rect.left;
    if (left + tooltipWidth > window.innerWidth - padding) {
      left = window.innerWidth - tooltipWidth - padding;
    }
    if (left < padding) left = padding;

    let top = rect.bottom + 8;
    if (top + tooltipHeight > window.innerHeight - padding) {
      top = Math.max(padding, rect.top - tooltipHeight - 8);
    }

    setTooltipInfo(info);
    setTooltipPos({ top, left });
  };

  const handleLeaveSyntaxTerm = () => {
    if (tooltipLeaveTimerRef.current) {
      clearTimeout(tooltipLeaveTimerRef.current);
    }
    tooltipLeaveTimerRef.current = setTimeout(() => {
      setTooltipInfo(null);
      setTooltipPos(null);
    }, 280);
  };

  const toggleTooltipsSintaxe = () => {
    const novo = !tooltipsAtivos;
    setTooltipsAtivos(novo);
    SafeStorage.set('tributa_tooltips_sintaxe', String(novo));
    if (!novo) {
      setTooltipInfo(null);
      setTooltipPos(null);
    }
    tocarAlarmeWebAudio('suave');
    mostrarToast(
      novo
        ? '💡 Tooltips Jurídicos ativados! Passe o mouse sobre os termos para ver a fundamentação.'
        : 'Tooltips Jurídicos desativados.'
    );
  };

  // Gerenciador de Versões de Redação e Comparador de Mudanças (Diff)
  const [modalVersoesAberto, setModalVersoesAberto] = useState(false);
  const [versoesRedacao, setVersoesRedacao] = useState<VersaoRedacao[]>(() => {
    try {
      const raw = SafeStorage.get('tributa_redacao_versoes_v1', '');
      if (raw) return JSON.parse(raw);
      // Versões iniciais pré-configuradas para demonstração imediata do Diff
      return [
        {
          id: 'v_seed_1',
          casoId: 0,
          casoTitulo: 'Caso 1: Mandado de Segurança com Pedido Liminar (FGV 2024)',
          nome: 'Versão 1 - Esqueleto e Endereçamento',
          descricao: 'Estruturação formal dos tópicos, endereçamento à Vara de Fazenda e preâmbulo das partes.',
          texto: `EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA ... VARA DA FAZENDA PÚBLICA DA COMARCA DE ...\n\nIMPETRANTE ..., pessoa jurídica de direito privado, inscrita no CNPJ sob o nº ..., com sede em ..., por seu advogado que esta subscreve, vem respeitosamente perante Vossa Excelência impetrar o presente\n\nMANDADO DE SEGURANÇA COM PEDIDO DE MEDIDA LIMINAR\n\nem face do ATO COATOR praticado pelo ILUSTRÍSSIMO SENHOR DELEGADO REGIONAL DA RECEITA ESTADUAL DE ...\n\nI - DOS FATOS\n(Síntese fática da exordial conforme o enunciado oficial da prova)\n\nII - DO CABIMENTO E TEMPESTIVIDADE\nO presente writ é cabível nos termos do Art. 5º, LXIX da CF/88 e Lei 12.016/09.\n\nIII - DO DIREITO E FUNDAMENTAÇÃO JURÍDICA\n1. Da Ilegalidade da Exigência Fiscal e Violação ao Princípio da Legalidade\n2. Da Suspensão da Exigibilidade do Crédito Tributário (Art. 151, IV do CTN)\n\nIV - DO PEDIDO LIMINAR\nFumaça do bom direito (fumus boni iuris) e o perigo da demora (periculum in mora).\n\nV - DOS PEDIDOS E REQUERIMENTOS\nNestes termos,\nPede deferimento.\nLocal ..., Data ...\nAdvogado ... / OAB ...`,
          criadoEm: 'Hoje, 09:15',
          linhasCount: 26,
          palavrasCount: 168,
          tag: 'esqueleto'
        },
        {
          id: 'v_seed_2',
          casoId: 0,
          casoTitulo: 'Caso 1: Mandado de Segurança com Pedido Liminar (FGV 2024)',
          nome: 'Versão 2 - Fundamentação Completa com Artigos & Súmulas',
          descricao: 'Adição de preliminares, citação de ICMS, Art. 151 do CTN e requerimento formal de liminar inaudita altera parte.',
          texto: `EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA ... VARA DA FAZENDA PÚBLICA DA COMARCA DE ...\n\nIMPETRANTE ..., pessoa jurídica de direito privado, inscrita no CNPJ sob o nº ..., com sede em ..., por seu advogado constituído (procuração anexa), vem perante Vossa Excelência impetrar\n\nMANDADO DE SEGURANÇA COM PEDIDO DE MEDIDA LIMINAR\n\nem face do ATO COATOR praticado pelo ILUSTRÍSSIMO SENHOR DELEGADO REGIONAL DA RECEITA ESTADUAL DE ...\n\nI - DA TEMPESTIVIDADE E PROVA PRÉ-CONSTITUÍDA\nO presente writ é tempestivo, impetrado no prazo decadencial de 120 dias previsto no Art. 23 da Lei 12.016/09. Demonstra-se direito líquido e certo mediante prova documental pré-constituída acostada aos autos.\n\nII - DOS FATOS\nO Fisco Estadual efetuou lançamento de ofício cobrando indevidamente ICMS em desacordo com a jurisprudência pacífica dos Tribunais Superiores.\n\nIII - DO DIREITO E MÉRITO TRIBUTÁRIO\n1. Da Não Incidência do ICMS sobre a Operação em Questão (Art. 155, II da CF/88)\n2. Da Aplicação da Súmula 166 do STJ e Tema com Repercussão Geral do STF\n3. Da Suspensão da Exigibilidade do Crédito Tributário pelo Art. 151, inciso IV do CTN\n\nIV - DO PEDIDO DE CONCESSÃO DE LIMINAR\nPresentes a fumaça do bom direito e o perigo da demora nos termos do Art. 7º, inciso III da Lei 12.016/09, requer a suspensão imediata do ato coator.\n\nV - DOS PEDIDOS\na) Concessão da medida liminar inaudita altera parte;\nb) Notificação da autoridade coatora para prestar informações no prazo de 10 dias;\nc) Oitiva do douto representante do Ministério Público;\nd) Concessão definitiva da segurança, confirmando a liminar expedida.\nNestes termos,\nPede deferimento.\nLocal ..., Data ...\nAdvogado ... / OAB ...`,
          criadoEm: 'Hoje, 10:40',
          linhasCount: 35,
          palavrasCount: 245,
          tag: 'merito'
        }
      ];
    } catch {
      return [];
    }
  });

  const salvarNovaVersaoRedacao = (dados: { nome: string; descricao?: string; tag: VersaoRedacao['tag'] }) => {
    const agora = new Date();
    const dataFormatada =
      agora.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) +
      ', ' +
      agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const nova: VersaoRedacao = {
      id: `v_${Date.now()}`,
      casoId: casoIndex,
      casoTitulo: CASOS_SIMULADO[casoIndex]?.titulo || `Caso ${casoIndex + 1}`,
      nome: dados.nome,
      descricao: dados.descricao,
      texto: textoRedacao,
      criadoEm: dataFormatada,
      linhasCount: textoRedacao.split('\n').length,
      palavrasCount: textoRedacao.trim() ? textoRedacao.trim().split(/\s+/).length : 0,
      tag: dados.tag
    };

    const atualizadas = [nova, ...versoesRedacao];
    setVersoesRedacao(atualizadas);
    SafeStorage.set('tributa_redacao_versoes_v1', JSON.stringify(atualizadas));
    tocarAlarmeWebAudio('suave');
    mostrarToast(`💾 Versão "${dados.nome}" salva no histórico!`);
  };

  const restaurarVersaoRedacao = (versao: VersaoRedacao) => {
    if (
      textoRedacao.trim() !== '' &&
      !window.confirm(`Deseja carregar a versão "${versao.nome}" no editor? A redação atual será substituída.`)
    ) {
      return;
    }
    setTextoRedacao(versao.texto);
    SafeStorage.set('tributa_redacao', versao.texto);
    tocarAlarmeWebAudio('suave');
    setModalVersoesAberto(false);
    mostrarToast(`🔄 Versão "${versao.nome}" restaurada na folha de 150 linhas!`);
  };

  const excluirVersaoRedacao = (id: string) => {
    const atualizadas = versoesRedacao.filter(v => v.id !== id);
    setVersoesRedacao(atualizadas);
    SafeStorage.set('tributa_redacao_versoes_v1', JSON.stringify(atualizadas));
    mostrarToast('Versão excluída do histórico.');
  };

  // Flashcards module
  const [filtroCatFlash, setFiltroCatFlash] = useState('TODOS');
  const [idxFlash, setIdxFlash] = useState(0);
  const [revelado, setRevelado] = useState(false);

  // Teses module
  const [filtroTeseCat, setFiltroTeseCat] = useState<number>(0);
  const [buscaTese, setBuscaTese] = useState('');

  // Mapas Mentais (PDF)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // Planner
  const [subAbaPlanner, setSubAbaPlanner] = useState<'mensal' | 'semanal' | 'diario' | 'controle'>('mensal');
  const [plannerData, setPlannerData] = useState<Record<string, any>>(() => {
    try {
      return JSON.parse(SafeStorage.get('tributa_planner_v1', '{}'));
    } catch {
      return {};
    }
  });

  // Notificação Diária de Estudo
  const [notifHorario, setNotifHorario] = useState(() =>
    SafeStorage.get('tributa_notif_hora', '20:00')
  );
  const [notifAtiva, setNotifAtiva] = useState(() =>
    SafeStorage.get('tributa_notif_ativa', 'true') === 'true'
  );
  const [notifMensagem, setNotifMensagem] = useState(() =>
    SafeStorage.get('tributa_notif_msg', 'Hora do Bloco Tributário FGV: 1 Peça + 5 Flashcards')
  );
  const [notifDias, setNotifDias] = useState(() =>
    SafeStorage.get('tributa_notif_dias', 'todos')
  );
  const [notifModalAberta, setNotifModalAberta] = useState(false);
  const [notifTipoModal, setNotifTipoModal] = useState<'estudo' | 'word'>('estudo');

  // Notificação de Fim de Simulado (150 Linhas) e Sugestão de Pausa de 15 Minutos com Áudio de Relaxamento
  const [modalFimSimuladoAberto, setModalFimSimuladoAberto] = useState(false);
  const notif150SimuladoDisparadaRef = useRef<boolean>(
    (SafeStorage.get('tributa_redacao', '').split('\n').length || 0) >= 150
  );

  // Central de Atualizações de Leis & Banco de Dados (Sempre Online & Varredura Contínua)
  const [modalAtualizacoesAberta, setModalAtualizacoesAberta] = useState(false);
  const [statusConexao, setStatusConexao] = useState<StatusConexao>(() => onlineLegalSync.getStatus());

  useEffect(() => {
    const unsub = onlineLegalSync.subscrever((st) => setStatusConexao(st));
    return unsub;
  }, []);

  // Lembrete Específico de Exportação da Redação para Word (Frequência Semanal no LocalStorage)
  const [notifWordAtivo, setNotifWordAtivo] = useState(() =>
    SafeStorage.get('tributa_notif_word_ativo', 'true') === 'true'
  );
  const [notifWordDia, setNotifWordDia] = useState(() =>
    SafeStorage.get('tributa_notif_word_dia', '5') // 5 = Sexta-feira
  );
  const [notifWordHora, setNotifWordHora] = useState(() =>
    SafeStorage.get('tributa_notif_word_hora', '20:00')
  );
  const [notifWordMsg, setNotifWordMsg] = useState(() =>
    SafeStorage.get(
      'tributa_notif_word_msg',
      'Lembrete Semanal: Hora de exportar sua redação para Word (.doc) e manter seu backup de 150 linhas em dia!'
    )
  );

  // Aba ativa na seção de Disciplina & Automações do Dashboard (Alarme Diário vs Lembrete Word)
  const [disciplinaTab, setDisciplinaTab] = useState<'alarme' | 'word'>('alarme');
  const [painelAutomacoesAberto, setPainelAutomacoesAberto] = useState(false);

  // Sub-aba no Card Pomodoro da Sidebar (Blocos Diários vs Soundscape de Foco)
  const [pomodoroSubTab, setPomodoroSubTab] = useState<'blocos' | 'soundscape'>('blocos');

  // Tom do Alarme Sonoro (Web Audio API: 'padrao' | 'suave' | 'urgente')
  const [tomAlarme, setTomAlarme] = useState<TomAlarme>(() => {
    return (SafeStorage.get('tributa_notif_tom_alarme', 'padrao') as TomAlarme) || 'padrao';
  });

  // Busca Global Integrada (Command Palette)
  const [buscaGlobalAberta, setBuscaGlobalAberta] = useState(false);

  // Toast feedback rápido para ações entre abas
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const mostrarToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Detecção automática do tema do Sistema Operacional (prefers-color-scheme)
  const detectarTemaSO = (): 'claro' | 'escuro' => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro';
    }
    return 'claro';
  };

  // Rastreia se o usuário escolheu o tema manualmente (travando) ou se segue automaticamente o SO
  const [temaManual, setTemaManual] = useState<boolean>(() => {
    return SafeStorage.get('tributa_tema_manual', 'false') === 'true';
  });

  // Tema Visual: detecta automaticamente o SO ao carregar, ou respeita a preferência manual se já definida
  const [tema, setTema] = useState<'claro' | 'escuro'>(() => {
    const isManual = SafeStorage.get('tributa_tema_manual', 'false') === 'true';
    const salvo = SafeStorage.get('tributa_tema', '');
    if (isManual && (salvo === 'claro' || salvo === 'escuro')) {
      return salvo;
    }
    // Caso o usuário não tenha definido manualmente, adota o tema do SO na inicialização
    return detectarTemaSO();
  });

  useEffect(() => {
    SafeStorage.set('tributa_tema', tema);
    if (tema === 'claro') {
      document.documentElement.classList.add('theme-light');
      document.documentElement.classList.remove('theme-dark', 'dark');
      document.body.classList.add('theme-light');
      document.body.classList.remove('theme-dark', 'dark');
      const metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) metaTheme.setAttribute('content', '#f3f3f3');
    } else {
      document.documentElement.classList.add('theme-dark', 'dark');
      document.documentElement.classList.remove('theme-light');
      document.body.classList.add('theme-dark', 'dark');
      document.body.classList.remove('theme-light');
      const metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) metaTheme.setAttribute('content', '#202020');
    }
  }, [tema]);

  // Listener para sincronização automática quando o tema do SO mudar (se não estiver travado manualmente)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Se não houver preferência manual salva, alinha imediatamente com o SO
    const isManual = SafeStorage.get('tributa_tema_manual', 'false') === 'true';
    if (!isManual) {
      const temaSO = mediaQuery.matches ? 'escuro' : 'claro';
      if (tema !== temaSO) {
        setTema(temaSO);
      }
    }

    const handleSOThemeChange = (e: MediaQueryListEvent) => {
      const manual = SafeStorage.get('tributa_tema_manual', 'false') === 'true';
      if (!manual) {
        const novoTema = e.matches ? 'escuro' : 'claro';
        setTema(novoTema);
        mostrarToast(
          novoTema === 'escuro'
            ? '🌙 Modo Escuro do Sistema Operacional aplicado automaticamente!'
            : '☀️ Modo Claro do Sistema Operacional aplicado automaticamente!'
        );
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSOThemeChange);
      return () => mediaQuery.removeEventListener('change', handleSOThemeChange);
    } else if ((mediaQuery as any).addListener) {
      (mediaQuery as any).addListener(handleSOThemeChange);
      return () => (mediaQuery as any).removeListener(handleSOThemeChange);
    }
  }, [tema]);

  const alternarTema = () => {
    const proximo = tema === 'claro' ? 'escuro' : 'claro';
    setTema(proximo);
    setTemaManual(true);
    SafeStorage.set('tributa_tema_manual', 'true');
    SafeStorage.set('tributa_tema', proximo);
    mostrarToast(proximo === 'claro' ? '☀️ Tema Claro ativado (Manual)!' : '🌙 Tema Escuro ativado (Manual)!');
  };

  const sincronizarComTemaSO = () => {
    setTemaManual(false);
    SafeStorage.set('tributa_tema_manual', 'false');
    const temaSO = detectarTemaSO();
    setTema(temaSO);
    mostrarToast(
      temaSO === 'escuro'
        ? '💻 Sincronizado com o Sistema Operacional: Modo Escuro ativado!'
        : '💻 Sincronizado com o Sistema Operacional: Modo Claro ativado!'
    );
  };

  // Estatísticas de Desempenho (Flashcards & Simulador)
  const [flashStats, setFlashStats] = useState<{ acertos: number; total: number }>(() => {
    try {
      const raw = SafeStorage.get('tributa_flash_stats', '');
      if (raw) return JSON.parse(raw);
      return { acertos: 29, total: 34 }; // Amostragem inicial realista de 85% de acertos
    } catch {
      return { acertos: 29, total: 34 };
    }
  });

  const [linhasAcumuladasSemana, setLinhasAcumuladasSemana] = useState<number>(() => {
    const raw = SafeStorage.get('tributa_linhas_acumuladas_sem', '80');
    return Number(raw) || 80;
  });

  const taxaAcertoEstimada = useMemo(() => {
    if (!flashStats.total || flashStats.total === 0) return 0;
    return Math.round((flashStats.acertos / flashStats.total) * 100);
  }, [flashStats]);

  const registrarRespostaFlashcard = (acertou: boolean) => {
    const updated = {
      acertos: flashStats.acertos + (acertou ? 1 : 0),
      total: flashStats.total + 1
    };
    setFlashStats(updated);
    SafeStorage.set('tributa_flash_stats', JSON.stringify(updated));
    tocarAlarmeWebAudio();
    mostrarToast(acertou ? '✓ Acerto contabilizado nas Estatísticas!' : 'Revisão registrada para novo ciclo!');
    proximoFlashcard();
  };

  const adicionarLinhasAoTotalSemana = (qtd: number) => {
    const novo = linhasAcumuladasSemana + qtd;
    setLinhasAcumuladasSemana(novo);
    SafeStorage.set('tributa_linhas_acumuladas_sem', String(novo));
    tocarAlarmeWebAudio();
    mostrarToast(`+${qtd} linhas registradas nas estatísticas semanais!`);
  };

  // Exportação do Relatório Semanal de Progresso (Flashcards, Simulador e Cronograma) em PDF
  const handleGerarRelatorioSemanalPdf = () => {
    tocarAlarmeWebAudio('suave');
    dispararConfetesSuaves({ count: 50, originY: 0.32 });
    exportarRelatorioSemanalPdf({
      taxaAcertoEstimada,
      flashStats,
      totalLinhasSemana,
      linhasCount,
      tarefasConcluidas,
      totalTarefas,
      dataProva,
      dataRepescagem,
      repescagemPaga,
      vadeMarcadosCount: vadeMarcados.length,
      pomodoroBlocosHoje
    });
    mostrarToast('📄 Relatório Semanal de Progresso gerado e baixado em PDF!');
  };

  // Handlers da Notificação Diária
  const handleNotifHorarioChange = (val: string) => {
    setNotifHorario(val);
    SafeStorage.set('tributa_notif_hora', val);
    mostrarToast(`⏰ Horário de estudo atualizado para às ${val}!`);
  };

  const handleNotifAtivaChange = (checked: boolean) => {
    setNotifAtiva(checked);
    SafeStorage.set('tributa_notif_ativa', String(checked));
    mostrarToast(checked ? '🔔 Notificação diária ativada!' : '🔕 Notificação diária pausada');
  };

  const handleNotifMensagemChange = (val: string) => {
    setNotifMensagem(val);
    SafeStorage.set('tributa_notif_msg', val);
  };

  const handleNotifDiasChange = (val: string) => {
    setNotifDias(val);
    SafeStorage.set('tributa_notif_dias', val);
  };

  // Handlers do Lembrete Semanal de Exportação Word
  const handleNotifWordAtivoChange = (val: boolean) => {
    setNotifWordAtivo(val);
    SafeStorage.set('tributa_notif_word_ativo', String(val));
    mostrarToast(val ? '📄 Lembrete semanal de exportação Word ativado!' : 'Lembrete de exportação Word pausado.');
  };

  const handleNotifWordDiaChange = (val: string) => {
    setNotifWordDia(val);
    SafeStorage.set('tributa_notif_word_dia', val);
    const diasMap: Record<string, string> = {
      '0': 'Domingo',
      '1': 'Segunda-feira',
      '2': 'Terça-feira',
      '3': 'Quarta-feira',
      '4': 'Quinta-feira',
      '5': 'Sexta-feira',
      '6': 'Sábado'
    };
    mostrarToast(`Lembrete de exportação programado para todo(a) ${diasMap[val] || val}!`);
  };

  const handleNotifWordHoraChange = (val: string) => {
    setNotifWordHora(val);
    SafeStorage.set('tributa_notif_word_hora', val);
    mostrarToast(`Horário de exportação Word ajustado para às ${val}!`);
  };

  const handleNotifWordMsgChange = (val: string) => {
    setNotifWordMsg(val);
    SafeStorage.set('tributa_notif_word_msg', val);
  };

  const handleTomAlarmeChange = (novoTom: TomAlarme) => {
    setTomAlarme(novoTom);
    SafeStorage.set('tributa_notif_tom_alarme', novoTom);
    tocarAlarmeWebAudio(novoTom);
    const nomesMap: Record<TomAlarme, string> = {
      padrao: 'Padrão',
      suave: 'Suave',
      urgente: 'Urgente'
    };
    mostrarToast(`Tom de alarme "${nomesMap[novoTom]}" selecionado e salvo no LocalStorage! 🔊`);
  };

  const testarNotificacaoManual = () => {
    tocarAlarmeWebAudio(tomAlarme);
    lerTextoEmVozAlta('Atenção! Horário do seu bloco diário de estudos de Direito Tributário. Vamos produzir?');
    setNotifTipoModal('estudo');
    setNotifModalAberta(true);

    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        try {
          new Notification('TributaOAB: Hora do Estudo Diário', {
            body: notifMensagem || 'Hora do Bloco Tributário: 1 Peça + 5 Flashcards',
            icon: '/favicon.ico'
          });
        } catch {
          // Iframe or browser restriction fallback
        }
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }
  };

  const testarLembreteWordManual = () => {
    tocarAlarmeWebAudio(tomAlarme);
    lerTextoEmVozAlta('Atenção! Lembrete semanal para exportar sua redação para Word e arquivar seu simulador de 150 linhas.');
    setNotifTipoModal('word');
    setNotifModalAberta(true);

    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('TributaOAB: Exportar Peça para Word (.doc)', {
          body: notifWordMsg || 'Lembrete semanal de exportação de redação',
          icon: '/favicon.ico'
        });
      } catch {}
    }
  };

  // Background monitor: Checa a cada 20 segundos se é hora do alarme diário ou do lembrete semanal de Word
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${hh}:${mm}`;
      const dayOfWeek = now.getDay();
      const todayStr = now.toISOString().slice(0, 10);

      // 0. Auto-Reset dos Blocos Pomodoro Diários à Meia-Noite (00:00)
      const dataSalvaPomodoro = SafeStorage.get('tributa_pomodoro_data_dia', '');
      if (dataSalvaPomodoro && dataSalvaPomodoro !== todayStr) {
        SafeStorage.set('tributa_pomodoro_data_dia', todayStr);
        SafeStorage.set('tributa_pomodoro_blocos_hoje', '0');
        setPomodoroBlocosHoje(0);
      }

      // 1. Checagem do Alarme Diário de Estudo
      if (notifAtiva) {
        const permitidoPeloFiltroDias = !(notifDias === 'seg-sex' && (dayOfWeek === 0 || dayOfWeek === 6));
        if (permitidoPeloFiltroDias) {
          const lastFired = SafeStorage.get('tributa_notif_ult_exec', '');
          if (currentTime === notifHorario && lastFired !== todayStr) {
            SafeStorage.set('tributa_notif_ult_exec', todayStr);
            tocarAlarmeWebAudio();
            lerTextoEmVozAlta('Atenção! Horário do seu bloco diário de estudos de Direito Tributário! Hora de focar.');
            setNotifTipoModal('estudo');
            setNotifModalAberta(true);

            if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
              try {
                new Notification('TributaOAB: Hora do Estudo Diário!', {
                  body: notifMensagem,
                  icon: '/favicon.ico'
                });
              } catch {}
            }
          }
        }
      }

      // 2. Checagem do Lembrete Semanal de Exportação para Word
      if (notifWordAtivo && String(dayOfWeek) === notifWordDia && currentTime === notifWordHora) {
        const lastWordFired = SafeStorage.get('tributa_notif_word_ult_exec', '');
        if (lastWordFired !== todayStr) {
          SafeStorage.set('tributa_notif_word_ult_exec', todayStr);
          tocarAlarmeWebAudio();
          lerTextoEmVozAlta('Atenção! Lembrete semanal programado para exportar sua peça prática para o Word.');
          setNotifTipoModal('word');
          setNotifModalAberta(true);

          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            try {
              new Notification('TributaOAB: Exportar Peça para Word (.doc)', {
                body: notifWordMsg,
                icon: '/favicon.ico'
              });
            } catch {}
          }
        }
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [notifAtiva, notifHorario, notifMensagem, notifDias, notifWordAtivo, notifWordDia, notifWordHora, notifWordMsg]);

  // Funções de Integração Total entre as Abas
  const navegarParaPeca = (codigo: string) => {
    const p = CATALOGO_PECAS.find(item => item.codigo === codigo);
    if (p) setPecaSelecionada(p);
    setActiveTab('pecas');
    mostrarToast(`Exibindo modelo oficial: ${p ? p.nome : codigo}`);
  };

  const navegarParaSimulado = (casoId: number, carregarEsqueleto: boolean = false) => {
    setCasoIndex(casoId);
    if (carregarEsqueleto) {
      // encontra a peça cabível correspondente ao caso
      const caso = CASOS_SIMULADO[casoId];
      if (caso) {
        const pecaRelacionada = CATALOGO_PECAS.find(p => caso.titulo.toLowerCase().includes(p.nome.toLowerCase().split(' ')[0]));
        if (pecaRelacionada) {
          setPecaSelecionada(pecaRelacionada);
        }
      }
    }
    setActiveTab('simulador');
    mostrarToast(`Simulador carregado com o Caso ${casoId + 1}`);
  };

  const navegarParaSumula = (termo: string, tribunal?: string, apenasRecentes?: boolean) => {
    setBuscaSumula(termo);
    if (tribunal) setFiltroTribunal(tribunal);
    if (apenasRecentes !== undefined) setFiltroApenasRecentes(apenasRecentes);
    setActiveTab('sumulas');
    mostrarToast(`Súmulas filtradas por "${termo || (apenasRecentes ? 'recentes' : 'todas')}"`);
  };

  const navegarParaVade = (corOuTermo: string) => {
    if (['AMARELO', 'VERDE', 'ROSA', 'AZUL', 'CLIPES'].includes(corOuTermo)) {
      setCorFiltroVade(corOuTermo);
      setBuscaVade('');
    } else {
      setCorFiltroVade('TODAS');
      setBuscaVade(corOuTermo);
    }
    setActiveTab('vademecum');
    mostrarToast(`Vade Mecum aberto (${corOuTermo})`);
  };

  const navegarParaTese = (termo: string, cat?: number) => {
    setBuscaTese(termo);
    if (cat !== undefined) setFiltroTeseCat(cat);
    setActiveTab('teses');
    mostrarToast(`Teses de Peça abertas`);
  };

  const navegarParaImposto = (ente: string) => {
    setFiltroImposto(ente);
    setActiveTab('impostos');
    mostrarToast(`Competência e impostos: ${ente}`);
  };

  const navegarParaFlashcards = (cat: string) => {
    setFiltroCatFlash(cat);
    setIdxFlash(0);
    setActiveTab('flashcards');
    mostrarToast(`Flashcards filtrados: ${cat}`);
  };

  const inserirTextoNaRedacao = (textoParaInserir: string, irParaSimulador: boolean = false) => {
    const textoAtual = SafeStorage.get('tributa_redacao', '');
    const novoTexto = textoAtual ? `${textoAtual}\n${textoParaInserir}` : textoParaInserir;
    setTextoRedacao(novoTexto);
    SafeStorage.set('tributa_redacao', novoTexto);
    tocarAlarmeWebAudio();
    mostrarToast('Citação inserida na folha de 150 linhas!');
    if (irParaSimulador) {
      setActiveTab('simulador');
    }
  };

  const salvarTreinoNoPlanner = (tituloPeca?: string) => {
    const hoje = new Date().toLocaleDateString('pt-BR');
    const nome = tituloPeca || pecaSelecionada.nome;
    const notaAnterior = plannerData['plD_anotacoes'] || '';
    const novaNota = `${notaAnterior ? `${notaAnterior}\n` : ''}[${hoje}] Treino da Peça FGV: ${nome} (${linhasCount} linhas redigidas).`;

    const updatedPlanner: Record<string, any> = { ...plannerData, plD_anotacoes: novaNota };
    for (let i = 0; i < 10; i++) {
      if (!updatedPlanner[`plD_txt_${i}`]) {
        updatedPlanner[`plD_txt_${i}`] = `Simulação da Peça: ${nome}`;
        updatedPlanner[`plD_ck_${i}`] = true;
        break;
      }
    }
    setPlannerData(updatedPlanner);
    SafeStorage.set('tributa_planner_v1', JSON.stringify(updatedPlanner));
    tocarAlarmeWebAudio();
    mostrarToast('Treino registrado com sucesso no seu Planner Diário!');
  };

  const sincronizarCronogramaComPlanner = () => {
    let tarefasAdicionadas = 0;
    const updated: Record<string, any> = { ...plannerData };

    CRONOGRAMA_DATA.forEach((sem, sIdx) => {
      sem.tarefas.forEach((tar, tIdx) => {
        const taskId = `${sIdx}-${tIdx}`;
        const isDone = tarefasConcluidas.includes(taskId);
        if (!isDone && tarefasAdicionadas < 5) {
          for (let i = 0; i < 10; i++) {
            if (!updated[`plD_txt_${i}`]) {
              updated[`plD_txt_${i}`] = `[${sem.semana}] ${tar}`;
              updated[`plD_ck_${i}`] = false;
              tarefasAdicionadas++;
              break;
            }
          }
        }
      });
    });

    setPlannerData(updated);
    SafeStorage.set('tributa_planner_v1', JSON.stringify(updated));
    tocarAlarmeWebAudio();
    mostrarToast(`${tarefasAdicionadas} metas pendentes do Cronograma sincronizadas no Planner Diário!`);
  };

  // Calculate days to Repescagem & Prova
  const diasRepescagem = useMemo(() => {
    const hoje = new Date();
    const target = new Date(dataRepescagem + 'T09:00:00');
    return Math.ceil((target.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
  }, [dataRepescagem]);

  const diasProva = useMemo(() => {
    const hoje = new Date();
    const target = new Date(dataProva + 'T13:00:00');
    return Math.ceil((target.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
  }, [dataProva]);

  // Duração total do bloco atual (foco de 50m ou 25m, ou pausa de 10m ou 5m)
  const tempoTotalPomodoro = useMemo(() => {
    if (pomodoroTipo === 'pausa') {
      return pomodoroModo === '25m' ? 5 * 60 : 10 * 60;
    }
    return pomodoroModo === '25m' ? 25 * 60 : 50 * 60;
  }, [pomodoroTipo, pomodoroModo]);

  // Pomodoro effect (50 min padrão vs 25 min clássico com pausa de 5 min)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (pomodoroRunning && pomodoroSecs > 0) {
      timer = setInterval(() => {
        setPomodoroSecs(prev => {
          if (prev <= 1) {
            setPomodoroRunning(false);
            setPomodoroConcluido(true);
            dispararConfetesSuaves({ count: 75, originY: 0.35 });
            tocarAlarmeWebAudio('suave');
            if (pomodoroTipo === 'pausa') {
              const msg = 'Pausa curta concluída! Mente revigorada para o próximo bloco de estudos.';
              lerTextoEmVozAlta(msg);
              mostrarToast('☕ Pausa curta concluída! Pronto para retomar os estudos?');
            } else {
              const novoTotalHoje = contabilizarBlocoFocoConcluido();
              const duracaoMin = pomodoroModo === '25m' ? 25 : 50;
              const pausaMin = pomodoroModo === '25m' ? 5 : 10;
              const msg = `Parabéns! Bloco de ${duracaoMin} minutos de foco concluído com sucesso! Faça uma pausa revigorante de ${pausaMin} minutos.`;
              lerTextoEmVozAlta(msg);
              mostrarToast(`🎉 Bloco de foco de ${duracaoMin} min concluído! (${novoTotalHoje} hoje) Faça uma pausa curta de ${pausaMin} min.`);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [pomodoroRunning, pomodoroSecs, pomodoroTipo, pomodoroModo]);

  // Pomodoro progress (0 to 1)
  const pomodoroProgresso = useMemo(() => {
    return Math.min(1, Math.max(0, (tempoTotalPomodoro - pomodoroSecs) / tempoTotalPomodoro));
  }, [pomodoroSecs, tempoTotalPomodoro]);

  const alternarModoPomodoro = (novoModo: PomodoroModo) => {
    setPomodoroModo(novoModo);
    SafeStorage.set('tributa_pomodoro_modo', novoModo);
    setPomodoroRunning(false);
    setPomodoroConcluido(false);
    setPomodoroTipo('foco');
    const novoTempo = novoModo === '25m' ? 25 * 60 : 50 * 60;
    setPomodoroSecs(novoTempo);
    tocarAlarmeWebAudio('suave');
    if (novoModo === '25m') {
      mostrarToast('🍅 Modo Pomodoro Clássico ativado: 25 min de foco + 5 min de pausa curta.');
    } else {
      mostrarToast('⏱️ Modo Pomodoro Padrão ativado: 50 min de foco profundo + 10 min de pausa.');
    }
  };

  const iniciarPomodoro = () => {
    setPomodoroConcluido(false);
    if (!pomodoroRunning) tocarAlarmeWebAudio();
    setPomodoroRunning(true);
    const tipoTxt = pomodoroTipo === 'pausa' ? 'Pausa curta' : 'Bloco de foco';
    const minutos = Math.ceil(pomodoroSecs / 60);
    mostrarToast(`${tipoTxt} de ${minutos} minutos iniciado!`);
  };

  const pausarPomodoro = () => {
    setPomodoroRunning(false);
    const tipoTxt = pomodoroTipo === 'pausa' ? 'Pausa curta pausada' : 'Bloco de foco pausado';
    mostrarToast(`${tipoTxt}.`);
  };

  const reiniciarPomodoro = (segundos?: number) => {
    setPomodoroRunning(false);
    setPomodoroConcluido(false);
    const duracao = segundos !== undefined ? segundos : tempoTotalPomodoro;
    setPomodoroSecs(duracao);
    mostrarToast(`Temporizador Pomodoro reiniciado para ${formatTimer(duracao)}.`);
  };

  const iniciarPausaCurta = () => {
    setPomodoroTipo('pausa');
    setPomodoroConcluido(false);
    const duracaoPausa = pomodoroModo === '25m' ? 5 * 60 : 10 * 60;
    setPomodoroSecs(duracaoPausa);
    tocarAlarmeWebAudio('suave');
    setPomodoroRunning(true);
    mostrarToast(`☕ Pausa curta de ${duracaoPausa / 60} minutos iniciada! Relaxe e beba água.`);
  };

  const iniciarNovoBlocoFoco = () => {
    setPomodoroTipo('foco');
    setPomodoroConcluido(false);
    const duracaoFoco = pomodoroModo === '25m' ? 25 * 60 : 50 * 60;
    setPomodoroSecs(duracaoFoco);
    tocarAlarmeWebAudio('suave');
    setPomodoroRunning(true);
    mostrarToast(`🎯 Bloco de foco de ${duracaoFoco / 60} minutos iniciado! Bom estudo.`);
  };

  const simularConclusaoPomodoro = () => {
    setPomodoroSecs(0);
    setPomodoroRunning(false);
    setPomodoroConcluido(true);
    dispararConfetesSuaves({ count: 75, originY: 0.35 });
    tocarAlarmeWebAudio('suave');
    let blocoHojeDesc = '';
    if (pomodoroTipo === 'foco') {
      const novoTotal = contabilizarBlocoFocoConcluido();
      blocoHojeDesc = ` (${novoTotal} hoje)`;
    }
    const tempoDesc = pomodoroTipo === 'pausa'
      ? (pomodoroModo === '25m' ? '5 minutos de pausa' : '10 minutos de pausa')
      : (pomodoroModo === '25m' ? '25 minutos de foco' : '50 minutos de foco');
    mostrarToast(`🎉 Parabéns! Bloco de ${tempoDesc}${blocoHojeDesc} concluído com sucesso!`);
    lerTextoEmVozAlta(`Parabéns! Bloco de ${tempoDesc} concluído com sucesso!`);
  };

  // Prova 5h effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (prova5hRunning && prova5hSecs > 0) {
      timer = setInterval(() => {
        setProva5hSecs(prev => prev - 1);
      }, 1000);
    } else if (prova5hSecs === 0 && prova5hRunning) {
      setProva5hRunning(false);
      tocarAlarmeWebAudio();
      lerTextoEmVozAlta('Tempo de cinco horas esgotado! Encerre sua redação.');
    }
    return () => clearInterval(timer);
  }, [prova5hRunning, prova5hSecs]);

  // Keyboard Shortcuts (Alt+1 to Alt+0, Alt+M, Alt+P, Ctrl+K, /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K opens Busca Global
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setBuscaGlobalAberta(prev => !prev);
        return;
      }

      // / opens search if not currently typing in input
      const target = e.target as HTMLElement;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (!isInput && e.key === '/') {
        e.preventDefault();
        setBuscaGlobalAberta(true);
        return;
      }

      if (e.altKey) {
        if (e.key === '1') setActiveTab('dashboard');
        if (e.key === '2') setActiveTab('cronograma');
        if (e.key === '3') setActiveTab('pecas');
        if (e.key === '4') setActiveTab('impostos');
        if (e.key === '5') setActiveTab('material');
        if (e.key === '6') setActiveTab('sumulas');
        if (e.key === '7') setActiveTab('simulador');
        if (e.key === '8') setActiveTab('flashcards');
        if (e.key === '9') setActiveTab('vademecum');
        if (e.key === '0') setActiveTab('legislacao');
        if (e.key.toLowerCase() === 'm') setActiveTab('mapas');
        if (e.key.toLowerCase() === 'p') setActiveTab('planner');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Save changes to SafeStorage
  const handleRepescagemDateChange = (val: string) => {
    setDataRepescagem(val);
    SafeStorage.set('tributa_data_rep', val);
  };

  const handleProvaDateChange = (val: string) => {
    setDataProva(val);
    SafeStorage.set('tributa_data_prv', val);
  };

  const handleRepescagemPagaChange = (checked: boolean) => {
    setRepescagemPaga(checked);
    SafeStorage.set('tributa_rep_ok', String(checked));
  };

  const toggleTarefa = (id: string) => {
    const isNowCompleting = !tarefasConcluidas.includes(id);
    const updated = isNowCompleting
      ? [...tarefasConcluidas, id]
      : tarefasConcluidas.filter(t => t !== id);
    setTarefasConcluidas(updated);
    SafeStorage.set('tributa_cronograma_v3', JSON.stringify(updated));

    if (isNowCompleting) {
      // Verifica se completou a semana toda do cronograma
      const [sIdxStr] = id.split('-');
      const sIdx = Number(sIdxStr);
      const sem = CRONOGRAMA_DATA[sIdx];
      const completouSemana =
        sem && sem.tarefas.every((_, tIdx) => updated.includes(`${sIdx}-${tIdx}`));

      dispararConfetesSuaves({
        count: completouSemana ? 65 : 44,
        originY: 0.38
      });
      tocarAlarmeWebAudio('suave');
      mostrarToast(
        completouSemana
          ? `🎉 Incrível! Você completou todas as metas da ${sem.semana}!`
          : '✨ Tarefa do cronograma concluída! Continue com o foco total na OAB!'
      );
    }
  };

  const toggleVade = (index: number) => {
    const updated = vadeMarcados.includes(index)
      ? vadeMarcados.filter(i => i !== index)
      : [...vadeMarcados, index];
    setVadeMarcados(updated);
    SafeStorage.set('tributa_vade_v1', JSON.stringify(updated));
  };

  const marcarTodosVade = (marcar: boolean) => {
    const updated = marcar ? VADE_DATA.map((_, i) => i) : [];
    setVadeMarcados(updated);
    SafeStorage.set('tributa_vade_v1', JSON.stringify(updated));
  };

  const handleRedacaoChange = (val: string) => {
    setTextoRedacao(val);
    SafeStorage.set('tributa_redacao', val);
    if (tooltipInfo) {
      setTooltipInfo(null);
      setTooltipPos(null);
    }
  };

  const handlePlannerUpdate = (id: string, value: any) => {
    const updated = { ...plannerData, [id]: value };
    setPlannerData(updated);
    SafeStorage.set('tributa_planner_v1', JSON.stringify(updated));
  };

  const formatTimer = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const format5hTimer = (totalSecs: number) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const [simuladoAtivoTreino, setSimuladoAtivoTreino] = useState<SimuladoFGV>(() => {
    return SIMULADOS_FGV_32[0];
  });

  const carregarEsqueletoDoSimulado = (simulado: SimuladoFGV) => {
    setSimuladoAtivoTreino(simulado);
    setTextoRedacao(simulado.esqueleto);
    SafeStorage.set('tributa_redacao', simulado.esqueleto);
    tocarAlarmeWebAudio('suave');
  };

  const inserirEsqueletoNaRedacao = () => {
    if (!pecaSelecionada) return;
    if (textoRedacao.trim() !== '' && !window.confirm('Substituir a redação atual da folha pelo esqueleto da peça?')) {
      return;
    }
    const textoLimpo = pecaSelecionada.blocos
      .map(b => `${b.titulo}\n${b.texto}`)
      .join('\n\n------------------------------------------------------------\n\n');
    setTextoRedacao(textoLimpo);
    SafeStorage.set('tributa_redacao', textoLimpo);
    tocarAlarmeWebAudio();
  };

  // Metricas do Editor
  const linhasCount = useMemo(() => {
    return textoRedacao.split('\n').length;
  }, [textoRedacao]);

  // Análise Heurística de Peça em Tempo Real no Simulador FGV (Grounded em 32+ Exames e Teses)
  const analisePecaAtual = useMemo(() => {
    const caso = CASOS_SIMULADO[casoIndex];
    return analisarPecaEmTempoReal(caso?.enunciado || '', textoRedacao);
  }, [casoIndex, textoRedacao]);

  const aplicarEsqueletoPecaSugerida = (esqueleto: string) => {
    if (textoRedacao.trim() !== '' && !window.confirm('Substituir a redação da folha pelo esqueleto da peça identificada?')) {
      return;
    }
    setTextoRedacao(esqueleto);
    SafeStorage.set('tributa_redacao', esqueleto);
    tocarAlarmeWebAudio('suave');
    mostrarToast('⚡ Esqueleto padrão da FGV aplicado na folha de 150 linhas!');
  };

  const totalLinhasSemana = useMemo(() => {
    return linhasAcumuladasSemana + Math.max(0, linhasCount);
  }, [linhasAcumuladasSemana, linhasCount]);

  // Monitora a meta semanal de 150 linhas no Simulador FGV para disparar animação suave de confetes
  const meta150AtingidaRef = useRef<boolean>(
    (Number(SafeStorage.get('tributa_linhas_acumuladas_sem', '80')) || 80) +
      (SafeStorage.get('tributa_redacao', '').split('\n').length || 0) >= 150
  );

  useEffect(() => {
    if (totalLinhasSemana >= 150) {
      if (!meta150AtingidaRef.current) {
        meta150AtingidaRef.current = true;
        dispararConfetesSuaves({ count: 70, originY: 0.35 });
        tocarAlarmeWebAudio('suave');
        mostrarToast('🎯 Incrível! Você atingiu a Meta Semanal de 150 Linhas no Simulador FGV!');
      }
    } else {
      meta150AtingidaRef.current = false;
    }
  }, [totalLinhasSemana]);

  // Notificação de Fim de Simulado: detecta quando o usuário completa as 150 linhas no simulador e sugere automaticamente pausa de 15m
  useEffect(() => {
    if (linhasCount >= 150) {
      if (!notif150SimuladoDisparadaRef.current) {
        notif150SimuladoDisparadaRef.current = true;
        setModalFimSimuladoAberto(true);
        mostrarToast('🏆 150 Linhas concluídas! Sugerimos uma pausa de 15 minutos com áudio relaxante.');
      }
    } else if (linhasCount < 145) {
      notif150SimuladoDisparadaRef.current = false;
    }
  }, [linhasCount]);

  const palavrasCount = useMemo(() => {
    return textoRedacao.trim() === '' ? 0 : textoRedacao.trim().split(/\s+/).length;
  }, [textoRedacao]);

  const mudarPaginaFolha = (p: number) => {
    setPaginaFolha(p);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = (p - 1) * 30 * 28;
    }
  };

  // Súmulas filtradas e métricas de recentes
  const sumulasFiltradas = useMemo(() => {
    return SUMULAS_DATA.filter(s => {
      const atendeTribunal = filtroTribunal === 'TODOS' || s.tr === filtroTribunal;
      const atendeRecentes = !filtroApenasRecentes || Boolean(s.recente);
      const termo = buscaSumula.trim().toLowerCase();
      const atendeBusca =
        !termo ||
        (s.tr + ' ' + s.num + ' ' + s.texto + ' ' + (s.tema || '') + ' ' + (s.dataInfo || '')).toLowerCase().includes(termo);
      return atendeTribunal && atendeRecentes && atendeBusca;
    });
  }, [filtroTribunal, filtroApenasRecentes, buscaSumula]);

  const qtdRecentesTotal = useMemo(() => SUMULAS_DATA.filter(s => s.recente).length, []);
  const qtdRecentesNoTribunal = useMemo(() => {
    return SUMULAS_DATA.filter(
      s => s.recente && (filtroTribunal === 'TODOS' || s.tr === filtroTribunal)
    ).length;
  }, [filtroTribunal]);

  // Vade Mecum filtrado por cor, busca textual e marcação
  const vadeFiltrados = useMemo(() => {
    const q = buscaVade.trim().toLowerCase();
    return VADE_DATA.map((item, originalIndex) => ({ ...item, originalIndex })).filter(item => {
      const atendeCor = corFiltroVade === 'TODAS' || item.cor === corFiltroVade;
      const atendeBusca =
        !q ||
        (item.ref + ' ' + item.obs + ' ' + item.cor).toLowerCase().includes(q);
      const atendeMarcado = !filtroApenasMarcadosVade || vadeMarcados.includes(item.originalIndex);
      return atendeCor && atendeBusca && atendeMarcado;
    });
  }, [corFiltroVade, buscaVade, filtroApenasMarcadosVade, vadeMarcados]);

  // Contagem dinâmica por categoria de cor considerando a busca textual atual
  const contagemCoresVade = useMemo(() => {
    const q = buscaVade.trim().toLowerCase();
    const base = VADE_DATA.filter(item =>
      !q || (item.ref + ' ' + item.obs + ' ' + item.cor).toLowerCase().includes(q)
    );
    return {
      TODAS: base.length,
      AMARELO: base.filter(i => i.cor === 'AMARELO').length,
      VERDE: base.filter(i => i.cor === 'VERDE').length,
      ROSA: base.filter(i => i.cor === 'ROSA').length,
      AZUL: base.filter(i => i.cor === 'AZUL').length,
      CLIPES: base.filter(i => i.cor === 'CLIPES').length,
    };
  }, [buscaVade]);

  // Flashcards filtrados
  const flashcardsFiltrados = useMemo(() => {
    return FLASHCARDS_DATA.filter(f => filtroCatFlash === 'TODOS' || f.c === filtroCatFlash);
  }, [filtroCatFlash]);

  const flashcardAtual = flashcardsFiltrados[idxFlash] || flashcardsFiltrados[0];

  const proximoFlashcard = () => {
    setRevelado(false);
    setIdxFlash(prev => (prev + 1) % flashcardsFiltrados.length);
  };

  const anteriorFlashcard = () => {
    setRevelado(false);
    setIdxFlash(prev => (prev - 1 + flashcardsFiltrados.length) % flashcardsFiltrados.length);
  };

  const ouvirFlashcard = () => {
    if (!flashcardAtual) return;
    const falar = revelado
      ? `${flashcardAtual.p}. Resposta: ${flashcardAtual.r}`
      : flashcardAtual.p;
    lerTextoEmVozAlta(falar);
  };

  // Peçômetro navigation
  const handlePecometroEscolha = (dest: string) => {
    if (PECOMETRO_DATA[dest]) {
      setPecometroNode(dest);
    } else {
      // It's a piece code!
      const achada = CATALOGO_PECAS.find(p => p.codigo === dest);
      if (achada) {
        setPecaSelecionada(achada);
        setPecometroResultado(achada.nome);
      }
    }
  };

  const resetPecometro = () => {
    setPecometroNode('inicio');
    setPecometroResultado(null);
  };

  const toggleFavoritoPeca = (codigo: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const ehFavorita = pecasFavoritas.includes(codigo);
    const atualizadas = ehFavorita
      ? pecasFavoritas.filter(c => c !== codigo)
      : [...pecasFavoritas, codigo];

    setPecasFavoritas(atualizadas);
    SafeStorage.set('tributa_pecas_favoritas', JSON.stringify(atualizadas));
    tocarAlarmeWebAudio('suave');

    const peca = CATALOGO_PECAS.find(p => p.codigo === codigo);
    const nomePeca = peca ? peca.nome : codigo;
    if (ehFavorita) {
      mostrarToast(`"${nomePeca}" removida dos favoritos.`);
    } else {
      mostrarToast(`⭐ "${nomePeca}" fixada no topo dos modelos favoritos!`);
    }
  };

  // Peças ordenadas: Favoritas no topo, seguidas pelas demais modelos
  const pecasOrdenadas = useMemo(() => {
    let lista = [...CATALOGO_PECAS];
    if (filtroApenasFavoritasPecas) {
      lista = lista.filter(p => pecasFavoritas.includes(p.codigo));
    }
    return lista.sort((a, b) => {
      const aFav = pecasFavoritas.includes(a.codigo) ? 1 : 0;
      const bFav = pecasFavoritas.includes(b.codigo) ? 1 : 0;
      if (aFav !== bFav) return bFav - aFav; // Favoritas sempre no topo
      return 0; // preserva a ordem do catálogo
    });
  }, [pecasFavoritas, filtroApenasFavoritasPecas]);

  // File loader for Mapas Mentais
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
    } else if (file) {
      alert('Por favor, selecione um arquivo no formato PDF.');
    }
  };

  // Navigation Items
  const navItems = [
    { id: 'dashboard', label: '1. Painel & Regras', icon: Scale, kbd: 'Alt+1' },
    { id: 'cronograma', label: '2. Simulado Semanal', icon: Calendar, kbd: 'Alt+2' },
    { id: 'pecas', label: '3. Peças FGV', icon: Compass, kbd: 'Alt+3' },
    { id: 'impostos', label: '4. Competência', icon: Layers, kbd: 'Alt+4' },
    { id: 'material', label: '5. Direito Material', icon: BookOpen, kbd: 'Alt+5' },
    { id: 'sumulas', label: '6. Súmulas', icon: Scale, kbd: 'Alt+6' },
    { id: 'simulador', label: '7. Folha Padrão', icon: FileText, kbd: 'Alt+7' },
    { id: 'flashcards', label: '8. Flashcards (36)', icon: Sparkles, kbd: 'Alt+8' },
    { id: 'vademecum', label: '9. Vade Mecum (40)', icon: Highlighter, kbd: 'Alt+9' },
    { id: 'legislacao', label: '10. Legislação', icon: ExternalLink, kbd: 'Alt+0' },
    { id: 'mapas', label: '11. Mapas Mentais', icon: MapIcon, kbd: 'Alt+M' },
    { id: 'planner', label: '12. Planner Nativo', icon: FileCheck2, kbd: 'Alt+P' },
    { id: 'teses', label: '13. Teses de Peças', icon: Award, kbd: '' }
  ];

  const totalTarefas = CRONOGRAMA_DATA.reduce((acc, curr) => acc + curr.tarefas.length, 0);

  return (
    <div className={`flex h-screen w-screen flex-col overflow-hidden select-none ${tema === 'claro' ? 'theme-light bg-[#f6f6f7] text-[#1d1d1f]' : 'theme-dark dark bg-[#18181b] text-[#f4f4f5]'}`}>
      {/* macOS SEQUOIA TITLEBAR CHROME */}
      <header className="macos-titlebar shrink-0 z-50">
        {/* Left: macOS Traffic Lights & Window Title */}
        <div className="flex items-center gap-3">
          <div className="macos-traffic-lights flex items-center gap-2">
            <button
              className="macos-traffic-btn close cursor-pointer"
              title="Fechar (Cmd+W)"
              onClick={() => mostrarToast('Janela fechada (Cmd+W)')}
            >
              <span>✕</span>
            </button>
            <button
              className="macos-traffic-btn minimize cursor-pointer"
              title="Minimizar (Cmd+M)"
              onClick={() => mostrarToast('Janela minimizada para o Dock')}
            >
              <span>―</span>
            </button>
            <button
              className="macos-traffic-btn zoom cursor-pointer"
              title="Maximizar / Tela Cheia"
              onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen().catch(() => {});
                } else {
                  document.exitFullscreen().catch(() => {});
                }
              }}
            >
              <span>+</span>
            </button>
          </div>

          <div className="flex items-center gap-2 ml-1">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-[10px] text-white shadow-xs">
              §
            </div>
            <span className="font-semibold tracking-tight text-xs flex items-center gap-1.5 text-zinc-900 dark:text-zinc-100">
              TributaOAB Pro
              <span className="hidden sm:inline text-[9.5px] font-medium border border-black/10 dark:border-white/10 px-1.5 py-0.2 rounded-full bg-black/5 dark:bg-white/10 text-zinc-600 dark:text-zinc-300">
                macOS Sequoia
              </span>
            </span>
          </div>
        </div>

        {/* Center: macOS Spotlight Style Unified Search Bar */}
        <button
          onClick={() => setBuscaGlobalAberta(true)}
          className="hidden md:flex items-center justify-between w-72 lg:w-96 rounded-full border border-black/10 dark:border-white/10 bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.07] dark:hover:bg-white/[0.12] px-3.5 py-1 text-xs text-zinc-700 dark:text-zinc-300 transition cursor-pointer backdrop-blur-md shadow-xs"
          title="Pesquisar em todas as abas (Cmd+K ou /)"
        >
          <span className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
            <span className="text-[11.5px] text-zinc-500 dark:text-zinc-400">Spotlight: Peças, teses, súmulas, vade...</span>
          </span>
          <kbd className="rounded-md bg-black/10 dark:bg-black/50 border border-black/10 dark:border-white/10 px-1.5 py-0.2 font-mono text-[9px] text-zinc-700 dark:text-zinc-300">
            ⌘K
          </kbd>
        </button>

        {/* Right: Theme Toggle & Online Legal Sync Pill */}
        <div className="flex items-center gap-2 h-full">
          {/* Alternar Tema Claro / Escuro & Sincronização com SO */}
          <div className="flex items-center gap-1">
            <button
              onClick={alternarTema}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                tema === 'claro'
                  ? 'bg-amber-100/90 text-amber-900 border border-amber-300 hover:bg-amber-200 shadow-xs'
                  : 'bg-zinc-800 text-zinc-200 border border-white/10 hover:bg-zinc-700 shadow-xs'
              }`}
              title={
                tema === 'claro'
                  ? `Tema Claro ativo${!temaManual ? ' (Seguindo SO)' : ' (Manual)'} — Clique para alternar para Escuro`
                  : `Tema Escuro ativo${!temaManual ? ' (Seguindo SO)' : ' (Manual)'} — Clique para alternar para Claro`
              }
            >
              {tema === 'claro' ? (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-600 fill-amber-500/30" />
                  <span className="hidden sm:inline">Claro</span>
                </>
              ) : (
                <>
                  <Moon className="h-3.5 w-3.5 text-blue-400 fill-blue-400/30" />
                  <span className="hidden sm:inline">Escuro</span>
                </>
              )}
              {!temaManual && (
                <span
                  className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/15 opacity-80"
                  title="Detectado automaticamente a partir do Sistema Operacional (prefers-color-scheme)"
                >
                  Auto
                </span>
              )}
            </button>

            {temaManual && (
              <button
                onClick={sincronizarComTemaSO}
                className="flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-blue-500/10 hover:text-blue-500 dark:hover:text-blue-400 transition cursor-pointer"
                title="Sincronizar com o tema do Sistema Operacional (prefers-color-scheme)"
              >
                <Monitor className="h-3 w-3" />
                <span className="hidden md:inline text-[10px]">SO</span>
              </button>
            )}
          </div>

          {/* Status Sempre Online & Central de Atualizações de Leis */}
          <button
            type="button"
            onClick={() => setModalAtualizacoesAberta(true)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition cursor-pointer text-xs"
            title="Sempre Online: Sincronização contínua de Leis e Banco de Dados ativada (Clique para abrir a Central)"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                statusConexao.online ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <span className="font-medium text-zinc-800 dark:text-zinc-200">
              {statusConexao.online ? `Online (${statusConexao.latenciaMs}ms)` : 'Offline'}
            </span>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">
              • Leis v3.5
            </span>
          </button>
        </div>
      </header>

      {/* WORKSPACE AREA (SIDEBAR + MAIN CONTENT) */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* SIDEBAR (WINDOWS 11 FLUENT NAVIGATION VIEW) */}
        <aside
          className={`fixed inset-y-0 left-0 top-[36px] lg:top-0 z-40 flex w-[275px] shrink-0 flex-col justify-between win11-sidebar border-r border-black/[0.08] dark:border-white/[0.08] transition-transform duration-200 lg:static lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col overflow-y-auto">
            {/* Brand header */}
            <div className="flex items-center justify-between border-b border-black/[0.08] dark:border-white/[0.08] p-3.5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#0067c0] to-[#0078d4] font-bold text-white shadow-sm text-sm">
                  §
                </div>
                <div>
                  <div className="text-[14px] font-bold text-slate-900 dark:text-white tracking-tight">
                    Tributa<span className="text-[#0067c0] dark:text-[#4cc2ff]">OAB</span>
                  </div>
                  <div className="text-[10.5px] text-slate-500 dark:text-[#94a3b8]">2ª Fase FGV • Fluent 11</div>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="rounded-lg p-1 text-slate-500 hover:bg-black/5 dark:text-[#cbd5e1] dark:hover:bg-white/10 lg:hidden"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-0.5 p-2">
              <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-[#94a3b8]">
                Módulos de Preparação
              </div>
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as TabType);
                      setSidebarOpen(false);
                    }}
                    className={`w-full win11-nav-item justify-between ${
                      isActive ? 'active' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`h-4 w-4 ${isActive ? 'text-[#0067c0] dark:text-[#4cc2ff]' : 'text-slate-500 dark:text-slate-400'}`} />
                      <span className={isActive ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}>{item.label}</span>
                    </div>
                    {item.kbd && (
                      <kbd className="rounded bg-black/[0.04] dark:bg-black/40 border border-black/10 dark:border-white/5 px-1.5 py-0.5 font-mono text-[9px] text-slate-500 dark:text-slate-400">
                        {item.kbd}
                      </kbd>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

        {/* SESSÕES DE FOCO (WINDOWS 11 FOCUS SESSIONS POMODORO) */}
        <div
          className={`m-2.5 rounded-xl border p-3 shadow-xs transition-all duration-300 relative overflow-hidden win11-focus-card ${
            pomodoroConcluido
              ? 'pomodoro-success-glow border-emerald-500 bg-emerald-50/80 dark:bg-[#1b3d2f]/90'
              : pomodoroRunning
              ? pomodoroTipo === 'pausa'
                ? 'border-amber-500/50 bg-amber-50/60 dark:bg-[#3a2e22]/80'
                : pomodoroModo === '25m'
                ? 'border-rose-500/50 bg-rose-50/60 dark:bg-[#38262b]/80'
                : 'border-[#0067c0]/40 dark:border-sky-500/50 bg-sky-50/60 dark:bg-[#253243]/80'
              : 'border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#272727]'
          }`}
        >
          {/* Alternador de Modo: 50m Padrão vs 25m Clássico */}
          <div className="flex items-center rounded-lg bg-black/[0.04] dark:bg-black/40 p-0.5 border border-black/[0.06] dark:border-white/5 mb-2.5">
            <button
              type="button"
              onClick={() => alternarModoPomodoro('50m')}
              className={`flex-1 py-1 rounded-md text-[10.5px] font-semibold transition cursor-pointer flex items-center justify-center gap-1 ${
                pomodoroModo === '50m'
                  ? 'bg-[#0067c0] dark:bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Modo Padrão: 50 min foco + 10 min pausa"
            >
              <span>⏱️ 50m Foco</span>
            </button>
            <button
              type="button"
              onClick={() => alternarModoPomodoro('25m')}
              className={`flex-1 py-1 rounded-md text-[10.5px] font-semibold transition cursor-pointer flex items-center justify-center gap-1 ${
                pomodoroModo === '25m'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Modo Clássico: 25 min foco + 5 min pausa curta"
            >
              <span>🍅 25m Clássico</span>
            </button>
          </div>

          {/* Área Central: Círculo de Progresso + Display do Timer */}
          <div className="flex items-center gap-3 my-2">
            <div className={`relative shrink-0 flex items-center justify-center ${pomodoroConcluido ? 'pomodoro-circle-pulse' : ''}`}>
              <svg className="w-12 h-12 -rotate-90 transform" viewBox="0 0 56 56">
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  className="text-slate-200 dark:text-slate-700/60 stroke-current"
                  strokeWidth="4"
                  fill="transparent"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  className={`transition-all duration-700 ${
                    pomodoroConcluido
                      ? 'text-emerald-500 dark:text-emerald-400 stroke-current'
                      : pomodoroTipo === 'pausa'
                      ? 'text-amber-500 dark:text-amber-400 stroke-current'
                      : pomodoroModo === '25m'
                      ? 'text-rose-500 dark:text-rose-400 stroke-current'
                      : pomodoroRunning
                      ? 'text-[#0067c0] dark:text-sky-400 stroke-current'
                      : 'text-slate-400 dark:text-slate-500 stroke-current'
                  }`}
                  strokeWidth="4.5"
                  strokeDasharray="138.23"
                  strokeDashoffset={pomodoroConcluido ? 0 : 138.23 * (1 - pomodoroProgresso)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                {pomodoroConcluido ? (
                  <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-300 animate-bounce stroke-[3]" />
                ) : pomodoroRunning ? (
                  <Sparkles className={`h-3.5 w-3.5 animate-pulse ${
                    pomodoroTipo === 'pausa' ? 'text-amber-500 dark:text-amber-300' : pomodoroModo === '25m' ? 'text-rose-500 dark:text-rose-300' : 'text-[#0067c0] dark:text-sky-300'
                  }`} />
                ) : (
                  <span className="font-mono text-[9.5px] font-bold text-slate-600 dark:text-slate-300">
                    {Math.round(pomodoroProgresso * 100)}%
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className={`font-mono text-2xl font-bold tracking-wider ${
                pomodoroConcluido
                  ? 'text-emerald-600 dark:text-emerald-300'
                  : pomodoroTipo === 'pausa'
                  ? 'text-amber-600 dark:text-amber-300'
                  : pomodoroModo === '25m'
                  ? 'text-rose-600 dark:text-rose-200'
                  : 'text-slate-900 dark:text-white'
              }`}>
                {formatTimer(pomodoroSecs)}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-300 truncate">
                {pomodoroConcluido ? (
                  <span className="text-emerald-600 dark:text-emerald-300 font-semibold">✓ Bloco Concluído!</span>
                ) : pomodoroRunning ? (
                  <span>{pomodoroTipo === 'pausa' ? 'Pausa curta...' : 'Foco em andamento...'}</span>
                ) : (
                  <span className="text-slate-400">{pomodoroSecs === tempoTotalPomodoro ? 'Pronto para iniciar' : 'Pausado'}</span>
                )}
              </div>
            </div>
          </div>

          {/* Ações Primárias do Timer */}
          <div className="flex items-center gap-1.5 pt-1">
            {pomodoroConcluido ? (
              <div className="flex items-center gap-1.5 w-full">
                {pomodoroTipo === 'foco' ? (
                  <button
                    onClick={iniciarPausaCurta}
                    className="flex-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 px-2 py-1.5 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                  >
                    ☕ Iniciar Pausa ({pomodoroModo === '25m' ? '5m' : '10m'})
                  </button>
                ) : (
                  <button
                    onClick={iniciarNovoBlocoFoco}
                    className="flex-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-2 py-1.5 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                  >
                    🎯 Retomar Foco ({pomodoroModo === '25m' ? '25m' : '50m'})
                  </button>
                )}
                <button
                  onClick={() => reiniciarPomodoro()}
                  className="rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/30 hover:bg-black/10 dark:hover:bg-white/10 px-2 py-1.5 text-xs text-slate-600 dark:text-slate-300 transition cursor-pointer"
                  title="Reiniciar"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 w-full">
                <button
                  onClick={() => {
                    if (pomodoroRunning) {
                      pausarPomodoro();
                    } else {
                      iniciarPomodoro();
                    }
                  }}
                  className={`flex-1 rounded-lg px-2.5 py-1.5 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs ${
                    pomodoroRunning
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                      : pomodoroTipo === 'pausa'
                      ? 'bg-amber-600 hover:bg-amber-500 text-white'
                      : pomodoroModo === '25m'
                      ? 'bg-rose-600 hover:bg-rose-500 text-white'
                      : 'bg-[#0067c0] hover:bg-[#0055a4] text-white'
                  }`}
                >
                  {pomodoroRunning ? (
                    <>
                      <Pause className="h-3.5 w-3.5" />
                      <span>Pausar</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>{pomodoroSecs < tempoTotalPomodoro ? 'Continuar' : 'Iniciar Foco'}</span>
                    </>
                  )}
                </button>

                {pomodoroTipo === 'foco' ? (
                  <button
                    type="button"
                    onClick={iniciarPausaCurta}
                    className="rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/25 hover:bg-black/10 dark:hover:bg-white/10 px-2 py-1.5 text-[11px] text-amber-600 dark:text-amber-300 transition cursor-pointer"
                    title="Alternar para Pausa Curta"
                  >
                    ☕
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={iniciarNovoBlocoFoco}
                    className="rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/25 hover:bg-black/10 dark:hover:bg-white/10 px-2 py-1.5 text-[11px] text-[#0067c0] dark:text-sky-300 transition cursor-pointer"
                    title="Alternar para Modo Foco"
                  >
                    🎯
                  </button>
                )}

                <button
                  onClick={() => reiniciarPomodoro()}
                  className="rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/25 hover:bg-black/10 dark:hover:bg-white/10 px-2 py-1.5 text-xs text-slate-600 dark:text-slate-300 transition cursor-pointer"
                  title="Reiniciar Timer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Sub-Aba: Alternador Limpo entre [ Blocos Diários ] e [ Soundscape ] */}
          <div className="flex items-center rounded-lg bg-black/[0.04] dark:bg-black/30 p-0.5 border border-black/[0.06] dark:border-white/5 mt-3 mb-2">
            <button
              type="button"
              onClick={() => setPomodoroSubTab('blocos')}
              className={`flex-1 py-1 text-[10.5px] rounded-md transition cursor-pointer flex items-center justify-center gap-1 ${
                pomodoroSubTab === 'blocos'
                  ? 'bg-white dark:bg-slate-700/80 text-slate-900 dark:text-white font-semibold shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>🍅 Blocos ({pomodoroBlocosHoje})</span>
            </button>
            <button
              type="button"
              onClick={() => setPomodoroSubTab('soundscape')}
              className={`flex-1 py-1 text-[10.5px] rounded-md transition cursor-pointer flex items-center justify-center gap-1 ${
                pomodoroSubTab === 'soundscape'
                  ? 'bg-white dark:bg-slate-700/80 text-slate-900 dark:text-white font-semibold shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Headphones className="h-3 w-3" />
              <span>Som {soundscapeTipo !== 'nenhum' ? '•' : ''}</span>
            </button>
          </div>

          {/* Conteúdo da Sub-Aba: Blocos Diários */}
          {pomodoroSubTab === 'blocos' && (
            <div className="space-y-1.5 pt-0.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Meta: 4 blocos hoje</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => ajustarBlocosPomodoroHoje(1)}
                    className="h-5 px-1.5 rounded bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-black/10 dark:hover:bg-white/10 text-xs font-bold transition cursor-pointer"
                    title="+1 bloco concluído"
                  >
                    +1
                  </button>
                  {pomodoroBlocosHoje > 0 && (
                    <button
                      type="button"
                      onClick={() => ajustarBlocosPomodoroHoje(-1)}
                      className="h-5 px-1 rounded bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-black/10 dark:hover:bg-white/10 text-xs font-bold transition cursor-pointer"
                      title="-1 bloco"
                    >
                      -
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={resetarBlocosPomodoroHoje}
                    className="h-5 px-1.5 rounded bg-rose-50 dark:bg-black/30 border border-rose-300 dark:border-rose-500/30 text-[9.5px] text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950/50 transition cursor-pointer"
                    title="Zerar (auto-reset às 00:00)"
                  >
                    Zerar
                  </button>
                </div>
              </div>

              {/* 4 Barrinhas de Progresso Diário */}
              <div className="grid grid-cols-4 gap-1 py-0.5">
                {[0, 1, 2, 3].map(slotIdx => (
                  <div
                    key={slotIdx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      pomodoroBlocosHoje > slotIdx
                        ? 'bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.5)]'
                        : 'bg-black/10 dark:bg-black/30 border border-black/5 dark:border-white/5'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-[9px] text-slate-500 dark:text-slate-400">
                <span>{pomodoroBlocosHoje * (pomodoroModo === '25m' ? 25 : 50)} min de foco hoje</span>
                <span className="font-mono text-slate-400 dark:text-slate-500">🌙 Auto-reset 00:00</span>
              </div>
            </div>
          )}

          {/* Conteúdo da Sub-Aba: Soundscape de Foco */}
          {pomodoroSubTab === 'soundscape' && (
            <div className="space-y-2 pt-0.5">
              <div className="grid grid-cols-4 gap-1 bg-black/[0.04] dark:bg-black/30 p-1 rounded-lg border border-black/[0.06] dark:border-white/5">
                {SOUNDSCAPE_OPCOES.map(opcao => {
                  const isSelected = soundscapeTipo === opcao.id;
                  return (
                    <button
                      key={opcao.id}
                      type="button"
                      onClick={() => alterarSoundscapeTipo(opcao.id)}
                      className={`py-1 px-1 rounded text-[9.5px] font-medium transition cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                        isSelected
                          ? 'bg-[#0067c0] dark:bg-sky-600 text-white font-bold shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      title={`${opcao.nome}: ${opcao.descricao}`}
                    >
                      <span className="text-xs leading-none">{opcao.icone}</span>
                      <span className="truncate max-w-full">{opcao.nome}</span>
                    </button>
                  );
                })}
              </div>

              {soundscapeTipo !== 'nenhum' && (
                <div className="flex items-center justify-between gap-2 pt-0.5">
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <Volume2 className="h-3 w-3 text-slate-400 shrink-0" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={soundscapeVolume}
                      onChange={(e) => alterarVolumeSoundscape(parseFloat(e.target.value))}
                      className="w-full accent-[#0067c0] dark:accent-sky-400 h-1 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                    />
                    <span className="font-mono text-[9px] text-slate-600 dark:text-slate-300 w-6 text-right shrink-0">
                      {Math.round(soundscapeVolume * 100)}%
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={alternarPreviewSoundscape}
                    className={`text-[9.5px] font-semibold px-2 py-0.5 rounded border transition cursor-pointer ${
                      soundscapePreviewManual
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                        : 'border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/30 text-slate-700 dark:text-slate-300 hover:bg-black/10'
                    }`}
                  >
                    {soundscapePreviewManual ? '■ Parar' : '▶ Testar'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* MAIN WRAPPER */}
      <div className="flex flex-1 min-w-0 flex-col h-full overflow-hidden">
        {/* WINDOWS 11 FLUENT COMMANDBAR (SUB HEADER) */}
        <header className="win11-commandbar h-11 shrink-0 z-30 border-b border-black/[0.08] dark:border-white/[0.08] bg-white/85 dark:bg-[#232323]/85 backdrop-blur-xl px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-1.5 text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="opacity-75">TributaOAB</span>
              <span className="text-slate-400">›</span>
              <span className="opacity-75">Módulos</span>
              <span className="text-slate-400">›</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {navItems.find(item => item.id === activeTab)?.label || 'Painel'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Widget Mini Temporizador Pomodoro no Subheader */}
            {(pomodoroRunning || pomodoroConcluido || pomodoroSecs < tempoTotalPomodoro) && (
              <button
                onClick={() => {
                  if (pomodoroConcluido) {
                    reiniciarPomodoro();
                  } else {
                    setSidebarOpen(true);
                  }
                }}
                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition shadow-xs cursor-pointer ${
                  pomodoroConcluido
                    ? 'border-emerald-500 bg-emerald-100/80 dark:bg-emerald-500/25 text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-400/50 animate-pulse'
                    : pomodoroRunning
                    ? pomodoroTipo === 'pausa'
                      ? 'border-amber-400/60 bg-amber-100/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200'
                      : pomodoroModo === '25m'
                      ? 'border-rose-400/60 bg-rose-100/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200'
                      : 'border-[#0067c0]/50 bg-sky-100/70 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200'
                    : 'border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
                title={
                  pomodoroConcluido
                    ? 'Bloco concluído com sucesso! Clique para reiniciar'
                    : pomodoroTipo === 'pausa'
                    ? `Pausa Curta (${pomodoroModo === '25m' ? '5m' : '10m'})`
                    : `Temporizador Pomodoro ${pomodoroModo === '25m' ? 'Clássico 25m' : 'Padrão 50m'}`
                }
              >
                <Clock
                  className={`h-3 w-3 ${
                    pomodoroConcluido
                      ? 'text-emerald-600 dark:text-emerald-300 animate-spin'
                      : pomodoroRunning
                      ? pomodoroTipo === 'pausa'
                        ? 'text-amber-600 dark:text-amber-300 animate-pulse'
                        : pomodoroModo === '25m'
                        ? 'text-rose-600 dark:text-rose-300 animate-pulse'
                        : 'text-[#0067c0] dark:text-sky-300 animate-pulse'
                      : 'text-slate-500 dark:text-slate-300'
                  }`}
                />
                <span className="font-mono font-bold">
                  {pomodoroConcluido
                    ? `🎉 ${pomodoroTipo === 'pausa' ? 'Pausa' : pomodoroModo === '25m' ? '25m' : '50m'} Concluído!`
                    : `${pomodoroTipo === 'pausa' ? '☕ ' : ''}${formatTimer(pomodoroSecs)}`}
                </span>
                {pomodoroBlocosHoje > 0 && (
                  <span className="text-[10px] text-rose-600 dark:text-rose-300 font-mono font-bold ml-0.5" title={`${pomodoroBlocosHoje} blocos realizados hoje`}>
                    ({pomodoroBlocosHoje}🍅)
                  </span>
                )}
              </button>
            )}

            {/* Botão Status Alarme Diário */}
            <button
              onClick={() => {
                setActiveTab('dashboard');
                testarNotificacaoManual();
              }}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition shadow-xs cursor-pointer ${
                notifAtiva
                  ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-300 hover:bg-amber-100'
                  : 'border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
              title="Notificação Diária de Estudo — Clique para testar ou configurar"
            >
              <Bell className={`h-3 w-3 ${notifAtiva ? 'text-amber-500 animate-pulse' : 'text-slate-400'}`} />
              <span className="font-mono font-bold text-amber-800 dark:text-amber-200">{notifHorario}</span>
              <span className="hidden sm:inline text-[10px]">({notifAtiva ? 'Alarme Ativo' : 'Pausado'})</span>
            </button>

            {/* Contador Dias Prova OAB */}
            <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-slate-300 dark:border-slate-700/60 bg-white/70 dark:bg-slate-800/60 px-3 py-1 text-xs text-slate-700 dark:text-slate-300 font-medium">
              <span>Prova 2ª Fase:</span>
              <strong className="font-mono text-[#0067c0] dark:text-sky-400">{diasProva >= 0 ? `${diasProva} dias` : 'Hoje'}</strong>
            </div>

            {/* Botão Central de Leis & Banco Online */}
            <button
              onClick={() => setModalAtualizacoesAberta(true)}
              className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-semibold text-xs px-3 py-1.5 shadow-xs transition cursor-pointer"
              title="Central de Atualizações de Leis Tributárias & Banco de Dados em Tempo Real"
            >
              <RefreshCw className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 animate-spin" style={{ animationDuration: '10s' }} />
              <span className="hidden lg:inline">Leis & Banco Online</span>
              <span className="lg:hidden">Leis Online</span>
            </button>

            {/* Botão Ação Rápida: Simulado FGV */}
            <button
              onClick={() => setActiveTab('cronograma')}
              className="inline-flex items-center gap-1.5 rounded-md bg-[#0067c0] hover:bg-[#0055a4] text-white font-semibold text-xs px-3.5 py-1.5 shadow-xs transition cursor-pointer"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Simulado Semanal</span>
              <span className="md:hidden">Simulado</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-6">
          {/* TAB 1: DASHBOARD (FLUIDO, INTUITIVO & LIMPO - macOS SEQUOIA) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 macos-animate">
              {/* 1. HERO HEADER: GREETING & STATUS ESSENCIAL */}
              <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-zinc-800/80 p-5 lg:p-6 backdrop-blur-xl shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 font-mono">
                      2ª Fase OAB • Direito Tributário
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                      {statusConexao.online ? 'Base FGV Online' : 'Offline'}
                    </span>
                  </div>
                  <h1 className="text-xl lg:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
                    Painel de Preparação Estratégica
                  </h1>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xl">
                    Visão unificada do seu ciclo de estudos: redação das 150 linhas com análise de peça em tempo real, sessões de foco e retenção das teses da FGV.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setActiveTab('cronograma')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition cursor-pointer active:scale-95"
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Simulado Semanal FGV</span>
                  </button>
                  <button
                    onClick={handleGerarRelatorioSemanalPdf}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-zinc-800 dark:text-zinc-200 text-xs font-medium shadow-xs transition cursor-pointer"
                    title="Exportar relatório completo em PDF"
                  >
                    <Download className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
                    <span>Relatório PDF</span>
                  </button>
                  <button
                    onClick={() => exportarRedacaoNoWord(textoRedacao)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-zinc-800 dark:text-zinc-200 text-xs font-medium shadow-xs transition cursor-pointer"
                    title="Backup da redação no Word (.doc)"
                  >
                    <FileText className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
                    <span>Backup Word</span>
                  </button>
                </div>
              </div>

              {/* 2. TRÊS CARDS DE KPI DE ALTO IMPACTO (FLUIDOS & REATIVOS) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* KPI 1: Folha Padrão 150L & Análise Heurística da Peça */}
                <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-zinc-800/80 p-4.5 flex flex-col justify-between backdrop-blur-xl shadow-xs transition-all hover:shadow-md">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                        <FileText className="h-4 w-4" />
                        Simulador 150 Linhas
                      </span>
                      <span className="text-[10px] font-mono font-bold text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-500/30 px-2 py-0.5 rounded-full">
                        {totalLinhasSemana >= 150 ? 'Meta 150L Concluída! 🎯' : 'Meta: 150L'}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2 my-1.5">
                      <span className="font-mono text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                        {totalLinhasSemana}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">/ 150 linhas</span>
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold ml-auto">
                        {linhasCount}L no editor
                      </span>
                    </div>

                    {/* Barra de Progresso Fluida */}
                    <div className="space-y-1 my-2">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-500 rounded-full"
                          style={{ width: `${Math.min(100, Math.round((totalLinhasSemana / 150) * 100))}%` }}
                        />
                      </div>
                    </div>

                    {/* Chip de Análise em Tempo Real no Simulador */}
                    <div className="mt-2.5 p-2 rounded-xl border border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/30 text-[11px] text-zinc-700 dark:text-zinc-300 flex items-center justify-between gap-2">
                      <span className="truncate">
                        🎯 Peça Provável: <strong className="text-blue-600 dark:text-blue-400">{analisePecaAtual.pecaMaisProvavel?.nome || 'Analisando...'}</strong>
                      </span>
                      <span className="font-mono text-[10px] font-bold text-blue-700 dark:text-blue-300 shrink-0">
                        {analisePecaAtual.pecaMaisProvavel?.probabilidade || 0}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
                    <button
                      onClick={() => setActiveTab('simulador')}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Abrir Simulador</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => adicionarLinhasAoTotalSemana(30)}
                      className="rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 px-2 py-1 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 transition cursor-pointer"
                      title="Registrar +1 página (30 linhas) no histórico semanal"
                    >
                      +30L
                    </button>
                  </div>
                </div>

                {/* KPI 2: Pomodoro & Blocos Diários */}
                <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-zinc-800/80 p-4.5 flex flex-col justify-between backdrop-blur-xl shadow-xs transition-all hover:shadow-md">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        Sessão de Foco Pomodoro
                      </span>
                      <span className="text-[10px] font-mono font-bold text-rose-800 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-500/30 px-2 py-0.5 rounded-full">
                        {pomodoroBlocosHoje >= 4 ? 'Meta Cumprida! 🔥' : 'Meta: 4 Blocos'}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2 my-1.5">
                      <span className="font-mono text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                        {pomodoroBlocosHoje}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">/ 4 blocos</span>
                      <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold ml-auto">
                        {pomodoroBlocosHoje * (pomodoroModo === '25m' ? 25 : 50)} min de foco
                      </span>
                    </div>

                    {/* 4 Blocos em Pill Slots Elegantes */}
                    <div className="grid grid-cols-4 gap-1.5 my-2">
                      {[0, 1, 2, 3].map(slotIdx => (
                        <div
                          key={slotIdx}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            pomodoroBlocosHoje > slotIdx
                              ? 'bg-rose-500 shadow-xs'
                              : 'bg-black/5 dark:bg-white/10'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Chip de Soundscape Ativo */}
                    <div className="mt-2.5 p-2 rounded-xl border border-rose-500/20 bg-rose-50/50 dark:bg-rose-950/30 text-[11px] text-zinc-700 dark:text-zinc-300 flex items-center justify-between gap-2">
                      <span className="truncate flex items-center gap-1">
                        <Headphones className="h-3 w-3 text-rose-500 shrink-0" />
                        <span>Soundscape: <strong className="text-rose-600 dark:text-rose-400">{SOUNDSCAPE_OPCOES.find(o => o.id === soundscapeTipo)?.nome || 'Silencioso'}</strong></span>
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono">🌙 Auto-reset 00h</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
                    <button
                      onClick={() => {
                        if (pomodoroRunning) {
                          pausarPomodoro();
                        } else {
                          iniciarPomodoro();
                        }
                      }}
                      className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="h-3 w-3 fill-current" />
                      <span>{pomodoroRunning ? 'Pausar Timer' : 'Focar Agora'}</span>
                    </button>
                    <button
                      onClick={() => ajustarBlocosPomodoroHoje(1)}
                      className="rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 px-2 py-1 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 transition cursor-pointer"
                      title="+1 bloco concluído"
                    >
                      +1 Bloco
                    </button>
                  </div>
                </div>

                {/* KPI 3: Retenção em Flashcards & Teses */}
                <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-zinc-800/80 p-4.5 flex flex-col justify-between backdrop-blur-xl shadow-xs transition-all hover:shadow-md">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4" />
                        Acertos nos Flashcards
                      </span>
                      <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/30 px-2 py-0.5 rounded-full">
                        {taxaAcertoEstimada >= 75 ? 'Excelente ✓' : 'Meta: 75%'}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2 my-1.5">
                      <span className="font-mono text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                        {taxaAcertoEstimada}%
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                        ({flashStats.acertos}/{flashStats.total} revisões)
                      </span>
                    </div>

                    {/* Barra de Progresso Fluida */}
                    <div className="space-y-1 my-2">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
                          style={{ width: `${Math.min(100, taxaAcertoEstimada)}%` }}
                        />
                      </div>
                    </div>

                    {/* Chip de Memorização Espaçada */}
                    <div className="mt-2.5 p-2 rounded-xl border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/30 text-[11px] text-zinc-700 dark:text-zinc-300 flex items-center justify-between gap-2">
                      <span className="truncate">
                        ⚡ 36 Flashcards com teses da 2ª Fase
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Ativo</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
                    <button
                      onClick={() => setActiveTab('flashcards')}
                      className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Praticar Flashcards</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        const reset = { acertos: 0, total: 0 };
                        setFlashStats(reset);
                        SafeStorage.set('tributa_flash_stats', JSON.stringify(reset));
                        mostrarToast('Contador de flashcards reiniciado!');
                      }}
                      className="text-[10px] text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
                    >
                      Zerar
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. WORKFLOW DIÁRIO: METAS DO DIA & DICA ESTRATÉGICA */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-start">
                <MetasDiariasCard
                  onNavigateToTab={(tab) => setActiveTab(tab as TabType)}
                  onMostrarToast={mostrarToast}
                />
                <DicaDoDiaCard
                  onNavigateToTab={(tab) => setActiveTab(tab as TabType)}
                  onMostrarToast={mostrarToast}
                />
              </div>

              {/* 4. ANÁLISE GRÁFICA & EVOLUÇÃO SEMANAL */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-start">
                <CronogramaProgressoChart
                  tarefasConcluidas={tarefasConcluidas}
                  onNavigateToCronograma={() => setActiveTab('cronograma')}
                />
                <GraficoComparativoMensal
                  taxaAtualFlashcards={taxaAcertoEstimada}
                  linhasSemanaisSimulador={totalLinhasSemana}
                  blocosHojePomodoro={pomodoroBlocosHoje}
                  onNavegarParaSimulador={() => setActiveTab('simulador')}
                  onNavegarParaFlashcards={() => setActiveTab('flashcards')}
                />
              </div>

              {/* 5. RADAR HISTÓRICO FGV & DATAS OFICIAIS (BARRA LIMPA & LEVE) */}
              <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-zinc-800/80 p-5 backdrop-blur-xl shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                      Distribuição Histórica das Peças FGV (32 Exames)
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-zinc-500 dark:text-zinc-400">Prova Oficial:</span>
                    <strong className="font-mono text-blue-600 dark:text-blue-400">
                      {diasProva >= 0 ? `${diasProva} dias` : 'Hoje'} (13h-18h)
                    </strong>
                    <button
                      onClick={() => setActiveTab('pecas')}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline ml-2 cursor-pointer"
                    >
                      Ver Catálogo Completo →
                    </button>
                  </div>
                </div>

                {/* Grid Compacta dos 6 Principais Modelos */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {[
                    { nome: 'Mandado de Segurança', freq: '10x', pct: '31%', cor: 'border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300' },
                    { nome: 'Recurso de Apelação', freq: '9x', pct: '28%', cor: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' },
                    { nome: 'Agravo de Instrumento', freq: '7x', pct: '22%', cor: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300' },
                    { nome: 'Ação Anulatória', freq: '7x', pct: '22%', cor: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300' },
                    { nome: 'Repetição de Indébito', freq: '6x', pct: '19%', cor: 'border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300' },
                    { nome: 'Embargos à Execução', freq: '4x', pct: '13%', cor: 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300' }
                  ].map(p => (
                    <div
                      key={p.nome}
                      className={`p-2.5 rounded-xl border ${p.cor} flex flex-col justify-between cursor-pointer hover:opacity-90 transition`}
                      onClick={() => setActiveTab('pecas')}
                      title={`Clique para estudar o modelo padrão de ${p.nome}`}
                    >
                      <div className="text-[11px] font-bold truncate">{p.nome}</div>
                      <div className="flex items-center justify-between mt-1 text-[10px] font-mono">
                        <span>{p.freq}</span>
                        <span className="opacity-75">{p.pct}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. PREFERÊNCIAS & AUTOMAÇÕES (PAINEL COMPACTO & RETRÁTIL) */}
              <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl shadow-xs overflow-hidden">
                <button
                  type="button"
                  onClick={() => setPainelAutomacoesAberto(!painelAutomacoesAberto)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                      <Bell className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                        <span>Preferências de Alarme & Automações de Backup</span>
                        <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-zinc-500 dark:text-zinc-400 font-mono">
                          {notifAtiva ? `Alarme ${notifHorario}` : 'Alarme Pausado'} • {tomAlarme.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        {painelAutomacoesAberto ? 'Clique para recolher as opções avançadas' : 'Configure o tom do alarme Web Audio, horários diários e lembretes de exportação para Word'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      {painelAutomacoesAberto ? 'Recolher' : 'Configurar'}
                    </span>
                    <span className="text-zinc-400 font-mono text-xs">
                      {painelAutomacoesAberto ? '▲' : '▼'}
                    </span>
                  </div>
                </button>

                {/* Conteúdo Retrátil */}
                {painelAutomacoesAberto && (
                  <div className="p-4 pt-1 border-t border-black/5 dark:border-white/10 space-y-4">
                    {/* Abas Internas */}
                    <div className="flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-2">
                      <button
                        type="button"
                        onClick={() => setDisciplinaTab('alarme')}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                          disciplinaTab === 'alarme'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                        }`}
                      >
                        ⏰ Alarme Diário & Tons
                      </button>
                      <button
                        type="button"
                        onClick={() => setDisciplinaTab('word')}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                          disciplinaTab === 'word'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                        }`}
                      >
                        📄 Backup Semanal no Word
                      </button>
                    </div>

                    {disciplinaTab === 'alarme' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-black/20 space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                              Horário Programado:
                            </label>
                            <input
                              type="time"
                              value={notifHorario}
                              onChange={e => handleNotifHorarioChange(e.target.value)}
                              className="rounded-lg border border-black/15 dark:border-white/15 bg-white dark:bg-zinc-800 px-2 py-1 text-xs font-bold text-zinc-900 dark:text-white"
                            />
                          </div>

                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] text-zinc-400">Atalhos:</span>
                            {['06:30', '08:00', '13:30', '20:00', '21:30'].map(h => (
                              <button
                                key={h}
                                type="button"
                                onClick={() => handleNotifHorarioChange(h)}
                                className={`rounded-md px-2 py-0.5 font-mono text-[10.5px] font-semibold transition cursor-pointer ${
                                  notifHorario === h
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-black/5 dark:bg-white/10 text-zinc-700 dark:text-zinc-300'
                                }`}
                              >
                                {h}
                              </button>
                            ))}
                          </div>

                          <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer pt-1">
                            <input
                              type="checkbox"
                              checked={notifAtiva}
                              onChange={e => handleNotifAtivaChange(e.target.checked)}
                              className="h-4 w-4 rounded accent-blue-600"
                            />
                            <span>Disparar alarme automaticamente</span>
                          </label>
                        </div>

                        <div className="p-3.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-black/20 space-y-2.5">
                          <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                            Tom do Alarme (Web Audio API):
                          </div>
                          <div className="grid grid-cols-3 gap-1.5">
                            {TONS_ALARME.map(t => (
                              <button
                                key={t.id}
                                type="button"
                                onClick={() => {
                                  handleTomAlarmeChange(t.id);
                                  tocarAlarmeWebAudio(t.id);
                                }}
                                className={`p-2 rounded-lg border text-left text-xs transition cursor-pointer ${
                                  tomAlarme === t.id
                                    ? 'border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300 font-bold'
                                    : 'border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                                }`}
                              >
                                <div>{t.icone} {t.nome}</div>
                                <div className="text-[9px] text-zinc-400 mt-0.5 truncate">{t.descricao}</div>
                              </button>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <button
                              type="button"
                              onClick={testarNotificacaoManual}
                              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                            >
                              Testar Alarme Agora →
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {disciplinaTab === 'word' && (
                      <div className="p-3.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-black/20 space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <label className="flex items-center gap-2 text-xs font-bold text-zinc-800 dark:text-zinc-200 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifWordAtivo}
                              onChange={e => handleNotifWordAtivoChange(e.target.checked)}
                              className="h-4 w-4 rounded accent-blue-600"
                            />
                            <span>Lembrete Semanal de Backup no Word (.doc)</span>
                          </label>

                          <button
                            type="button"
                            onClick={() => exportarRedacaoNoWord(textoRedacao)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition cursor-pointer shadow-xs"
                          >
                            <Download className="h-3 w-3" />
                            <span>Exportar Redação Atual</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: SIMULADO SEMANAL (32 PROVAS FGV & CRONOGRAMA) */}
          {activeTab === 'cronograma' && (
            <SimuladoSemanalView
              textoRedacao={textoRedacao}
              onCarregarEsqueletoNaFolha={carregarEsqueletoDoSimulado}
              onNavegarParaSimulador={() => setActiveTab('simulador')}
              mostrarToast={mostrarToast}
              tarefasConcluidas={tarefasConcluidas}
              onToggleTarefa={toggleTarefa}
              onSincronizarPlanner={sincronizarCronogramaComPlanner}
              onNavegarParaPeca={navegarParaPeca}
              onNavegarParaFlashcards={navegarParaFlashcards}
              onNavegarParaVade={navegarParaVade}
            />
          )}

          {/* TAB 3: PEÇAS E QUESITOS */}
          {activeTab === 'pecas' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Left Column: Peçômetro & Catalogo */}
              <div className="lg:col-span-4 space-y-4">
                {/* Peçômetro */}
                <div className="rounded-2xl border border-[#455468] bg-[#2b3646] p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="badge b-VERDE">🎯 Descobridor de Peça</span>
                    <button
                      onClick={resetPecometro}
                      className="rounded-full border border-slate-600 bg-slate-700/60 px-2.5 py-1 text-[11px] text-slate-300 hover:bg-slate-600"
                    >
                      Reiniciar
                    </button>
                  </div>

                  {pecometroResultado ? (
                    <div className="rounded-xl border border-emerald-500/60 bg-emerald-950/30 p-3.5 text-xs">
                      <div className="text-slate-300 mb-1">Peça cabível identificada:</div>
                      <div className="text-sm font-bold text-emerald-300">{pecometroResultado}</div>
                      <button
                        onClick={resetPecometro}
                        className="mt-3 inline-block text-[11px] text-sky-400 underline"
                      >
                        Fazer nova consulta
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-semibold text-white mb-2.5">
                        {PECOMETRO_DATA[pecometroNode]?.q}
                      </p>
                      <div className="space-y-1.5">
                        {PECOMETRO_DATA[pecometroNode]?.o.map(([rotulo, destino], idx) => (
                          <button
                            key={idx}
                            onClick={() => handlePecometroEscolha(destino)}
                            className="w-full text-left rounded-xl border border-[#475569] bg-[#222b38] px-3 py-2 text-xs font-medium text-sky-300 hover:border-sky-400 hover:bg-[#334155] transition"
                          >
                            {rotulo}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Lista de Peças com Favoritos no Topo */}
                <div className="rounded-2xl border border-[#455468] bg-[#2b3646] p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                        Modelos Oficiais FGV
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        {pecasFavoritas.length} {pecasFavoritas.length === 1 ? 'favorita fixada no topo' : 'favoritas fixadas no topo'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          exportarEsqueletoParaPdf(pecaSelecionada);
                          tocarAlarmeWebAudio('suave');
                          mostrarToast(`📄 PDF de "${pecaSelecionada.nome}" gerado para estudo offline!`);
                        }}
                        className="rounded-full border border-rose-400/80 bg-rose-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-rose-500 shadow-sm inline-flex items-center gap-1 transition cursor-pointer"
                        title="Baixar arquivo PDF consolidado com o esqueleto da peça selecionada para estudo offline"
                      >
                        <Download className="w-3 h-3" /> PDF
                      </button>
                      <button
                        onClick={() => baixarTodasPecasNoWord(CATALOGO_PECAS)}
                        className="rounded-full border border-blue-400 bg-blue-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-blue-500 shadow-sm inline-flex items-center gap-1 transition cursor-pointer"
                        title="Baixar catálogo completo de peças no Word (.doc)"
                      >
                        📚 Word
                      </button>
                    </div>
                  </div>

                  {/* Filtro: Todas vs Apenas Favoritas */}
                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#222b38] border border-[#455468]/60">
                    <button
                      onClick={() => setFiltroApenasFavoritasPecas(false)}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold transition text-center ${
                        !filtroApenasFavoritasPecas
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      Todas ({CATALOGO_PECAS.length})
                    </button>
                    <button
                      onClick={() => setFiltroApenasFavoritasPecas(true)}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold transition inline-flex items-center justify-center gap-1.5 ${
                        filtroApenasFavoritasPecas
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'text-amber-300 hover:text-amber-200'
                      }`}
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                      Favoritas ({pecasFavoritas.length})
                    </button>
                  </div>

                  {/* Informação visual amigável */}
                  <div className="text-[10.5px] text-slate-400 flex items-center gap-1 px-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                    <span>Clique na estrela para fixar ou desfixar peças no topo.</span>
                  </div>

                  <div className="space-y-1.5">
                    {pecasOrdenadas.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-[#455468] p-4 text-center">
                        <Star className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                        <p className="text-xs text-slate-300 font-medium">Nenhuma peça favoritada no momento.</p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Marque os modelos mais recorrentes para acessá-los rapidamente no topo da lista.
                        </p>
                        <button
                          onClick={() => setFiltroApenasFavoritasPecas(false)}
                          className="mt-3 text-xs text-sky-400 hover:underline font-semibold"
                        >
                          Ver todos os modelos
                        </button>
                      </div>
                    ) : (
                      pecasOrdenadas.map((p, idx) => {
                        const isFav = pecasFavoritas.includes(p.codigo);
                        const isFirstNonFav =
                          !filtroApenasFavoritasPecas &&
                          !isFav &&
                          idx > 0 &&
                          pecasFavoritas.includes(pecasOrdenadas[idx - 1].codigo);

                        return (
                          <React.Fragment key={p.codigo}>
                            {isFirstNonFav && (
                              <div className="pt-2 pb-1 border-t border-[#455468]/60 flex items-center justify-between text-[10px] uppercase tracking-wider text-slate-400 px-1 font-semibold">
                                <span>Demais Modelos de Peça</span>
                                <span>{CATALOGO_PECAS.length - pecasFavoritas.length}</span>
                              </div>
                            )}
                            <div
                              onClick={() => setPecaSelecionada(p)}
                              className={`w-full text-left rounded-xl px-3 py-2 text-xs font-medium transition flex items-center justify-between cursor-pointer group ${
                                pecaSelecionada.codigo === p.codigo
                                  ? 'bg-sky-600 text-white font-semibold border border-sky-400 shadow-sm'
                                  : isFav
                                  ? 'border border-amber-500/40 bg-[#344154] text-slate-100 hover:bg-slate-600'
                                  : 'border border-[#455468] bg-[#344154] text-slate-200 hover:bg-slate-600'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0 pr-2">
                                <button
                                  type="button"
                                  onClick={(e) => toggleFavoritoPeca(p.codigo, e)}
                                  className="p-1 -ml-1 rounded-md transition hover:bg-slate-500/30 text-amber-400 focus:outline-none"
                                  title={isFav ? 'Remover dos favoritos' : 'Favoritar e fixar no topo'}
                                  aria-label={isFav ? 'Remover dos favoritos' : 'Favoritar e fixar no topo'}
                                >
                                  <Star
                                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                                      isFav
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-slate-400 hover:text-amber-300'
                                    }`}
                                  />
                                </button>
                                <span className="truncate">{p.nome}</span>
                                {isFav && (
                                  <span className="text-[10px] font-bold text-amber-300 bg-amber-400/15 border border-amber-400/30 px-1.5 py-0.5 rounded-sm shrink-0">
                                    ★ Topo
                                  </span>
                                )}
                              </div>
                              <span className={`badge shrink-0 ${p.tipo === 'Inicial' ? 'b-AZUL' : 'b-ROSA'}`}>
                                {p.tipo}
                              </span>
                            </div>
                          </React.Fragment>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Detalhe da Peça */}
              <div className="lg:col-span-8 space-y-4">
                <div className="rounded-2xl border border-[#455468] bg-[#2b3646] p-5 shadow-sm">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="badge b-VERDE">
                        {pecaSelecionada.tipo} • {pecaSelecionada.examesCobrados}
                      </span>
                      {pecasFavoritas.includes(pecaSelecionada.codigo) && (
                        <span className="badge inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> Peça Favorita (Fixada no Topo)
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => {
                          exportarEsqueletoParaPdf(pecaSelecionada);
                          tocarAlarmeWebAudio('suave');
                          mostrarToast(`📄 PDF de "${pecaSelecionada.nome}" gerado com sucesso para estudo offline!`);
                        }}
                        className="rounded-full border border-rose-400 bg-rose-600 hover:bg-rose-500 px-3.5 py-1 text-xs font-semibold text-white transition inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                        title="Gerar e baixar arquivo PDF consolidado com o esqueleto e quesitos da peça para impressão e estudo offline"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Baixar PDF</span>
                      </button>

                      <button
                        onClick={() => {
                          imprimirEsqueletoPeca(pecaSelecionada);
                          mostrarToast('🖨️ Caixa de diálogo de impressão iniciada. Selecione sua impressora ou "Salvar como PDF".');
                        }}
                        className="rounded-full border border-slate-500 bg-slate-700/70 hover:bg-slate-600 px-3 py-1 text-xs font-semibold text-slate-200 hover:text-white transition inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                        title="Abrir layout otimizado para impressão direta em papel A4 ou salvar como PDF nativo"
                      >
                        <Printer className="w-3.5 h-3.5 text-sky-400" />
                        <span className="hidden sm:inline">Imprimir A4</span>
                      </button>

                      <button
                        onClick={(e) => toggleFavoritoPeca(pecaSelecionada.codigo, e)}
                        className={`rounded-full border px-3.5 py-1 text-xs font-semibold transition inline-flex items-center gap-1.5 shadow-sm cursor-pointer ${
                          pecasFavoritas.includes(pecaSelecionada.codigo)
                            ? 'border-amber-400 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                            : 'border-slate-500 bg-slate-700/60 text-slate-200 hover:bg-slate-600 hover:text-white'
                        }`}
                        title={pecasFavoritas.includes(pecaSelecionada.codigo) ? 'Remover dos favoritos' : 'Favoritar e fixar no topo'}
                      >
                        <Star className={`w-3.5 h-3.5 ${pecasFavoritas.includes(pecaSelecionada.codigo) ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
                        {pecasFavoritas.includes(pecaSelecionada.codigo) ? '★ Favorita' : '☆ Favoritar'}
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('simulador');
                          inserirEsqueletoNaRedacao();
                        }}
                        className="rounded-full border border-emerald-400 bg-emerald-600 px-3.5 py-1 text-xs font-semibold text-white hover:bg-emerald-500 transition shadow-sm cursor-pointer"
                      >
                        ⚡ Treinar no Simulador 150L
                      </button>
                    </div>
                  </div>
                  <h2 className="text-lg font-bold text-white mt-2">{pecaSelecionada.nome}</h2>
                  <p className="text-xs text-[#cbd5e1] mt-1">Base legal: {pecaSelecionada.baseLegal}</p>
                </div>

                {/* Quesitos da Prova */}
                <div className="rounded-2xl border border-[#455468] bg-[#2b3646] p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-white mb-3">Quesitos Exigidos no Espelho FGV</h3>
                  <div className="divide-y divide-[#455468]">
                    {pecaSelecionada.quesitosFGV.map((q, qIdx) => (
                      <div key={qIdx} className="flex items-center justify-between py-2 text-xs gap-3">
                        <span className="text-slate-200">{q.item}</span>
                        <span className="flex items-center gap-2 shrink-0">
                          <span className={`badge b-${q.cor}`}>{q.cor}</span>
                          <strong className="font-mono text-emerald-400">{q.pts} pt</strong>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Blocos estruturados da peça */}
                <div className="space-y-3">
                  {pecaSelecionada.blocos.map((bloco, bIdx) => (
                    <div
                      key={bIdx}
                      className="rounded-xl border border-[#455468] bg-[#344154] p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-bold text-sky-300">{bloco.titulo}</h4>
                        <span className={`badge b-${bloco.cor}`}>{bloco.cor}</span>
                      </div>
                      <div className="rounded-lg bg-[#222b38] border border-[#455468]/60 p-2.5 text-[11px] text-slate-300 mb-3">
                        💡 <strong>Como pontuar na FGV:</strong> {bloco.dica}
                      </div>
                      <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-100">
                        {bloco.texto}
                      </pre>
                    </div>
                  ))}
                </div>

                {/* Roteiro especial (se houver) */}
                {ROTEIROS[pecaSelecionada.codigo] && (
                  <div className="rounded-2xl border border-[#455468] bg-[#2b3646] p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-white mb-3">
                      🧭 Roteiro Passo a Passo (Oficina de Recursos)
                    </h3>
                    <ol className="list-decimal pl-5 space-y-1.5 text-xs text-slate-200">
                      {ROTEIROS[pecaSelecionada.codigo].map((step, sIdx) => (
                        <li key={sIdx}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: COMPETÊNCIA E IMPOSTOS */}
          {activeTab === 'impostos' && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-[#455468] bg-[#2b3646] p-5 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold text-white">
                    Competência Tributária & Impostos em Espécie
                  </h2>
                  <p className="text-xs text-slate-300">
                    Discriminação constitucional e novo modelo da Reforma Tributária (EC 132/2023)
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {['TODOS', 'FEDERAL', 'ESTADUAL', 'MUNICIPAL', 'REFORMA'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFiltroImposto(cat)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                        filtroImposto === cat
                          ? 'bg-sky-600 text-white border border-sky-400'
                          : 'border border-[#56677d] bg-[#3b495e] text-slate-200 hover:bg-slate-600'
                      }`}
                    >
                      {cat === 'TODOS'
                        ? 'Todos'
                        : cat === 'FEDERAL'
                        ? 'União'
                        : cat === 'ESTADUAL'
                        ? 'Estados'
                        : cat === 'MUNICIPAL'
                        ? 'Municípios'
                        : 'Reforma (IBS/CBS)'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {IMPOSTOS_DATA.filter(
                  imp => filtroImposto === 'TODOS' || imp.ente === filtroImposto
                ).map((imp, idx) => {
                  const badgeColor =
                    imp.ente === 'FEDERAL'
                      ? 'b-AZUL'
                      : imp.ente === 'ESTADUAL'
                      ? 'b-VERDE'
                      : imp.ente === 'MUNICIPAL'
                      ? 'b-AMARELO'
                      : 'b-ROSA';
                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-[#455468] bg-[#344154] p-4 shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <h3 className="text-xs font-bold text-white">{imp.nome}</h3>
                          <span className={`badge ${badgeColor}`}>{imp.ente}</span>
                        </div>
                        <div className="font-mono text-[11px] text-sky-300 mb-2">{imp.base}</div>
                        <p className="text-xs leading-relaxed text-slate-200">{imp.desc}</p>
                      </div>

                      {/* Ações integradas do imposto */}
                      <div className="mt-3 pt-2.5 border-t border-[#455468] flex items-center gap-1.5 flex-wrap">
                        <button
                          onClick={() => navegarParaSumula(imp.nome.split(' ')[0])}
                          className="rounded-full bg-[#1b232e] border border-[#56677d] px-2 py-0.5 text-[10px] text-sky-300 hover:bg-[#253243] transition"
                          title={`Buscar súmulas de ${imp.nome}`}
                        >
                          ⚖️ Súmulas
                        </button>
                        <button
                          onClick={() => navegarParaVade(imp.ente === 'FEDERAL' ? 'AZUL' : imp.ente === 'ESTADUAL' ? 'VERDE' : 'AMARELO')}
                          className="rounded-full bg-[#1b232e] border border-[#56677d] px-2 py-0.5 text-[10px] text-amber-300 hover:bg-[#253243] transition"
                          title="Ver artigos no Vade Mecum"
                        >
                          📖 Vade Mecum
                        </button>
                        <button
                          onClick={() => {
                            const termo = imp.nome.split(' ')[0].toLowerCase();
                            const casoApropriado = CASOS_SIMULADO.find(c => (c.titulo + ' ' + c.enunciado).toLowerCase().includes(termo));
                            if (casoApropriado) {
                              navegarParaSimulado(casoApropriado.id, true);
                            } else {
                              navegarParaSimulado(0, true);
                            }
                          }}
                          className="rounded-full bg-[#1b232e] border border-[#56677d] px-2 py-0.5 text-[10px] text-emerald-300 hover:bg-[#253243] transition"
                          title="Praticar no Simulador 150L"
                        >
                          ✍️ Simulado
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: DIREITO MATERIAL & PRECEDENTES */}
          {activeTab === 'material' && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-[#455468] bg-[#2b3646] p-5 shadow-sm space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={buscaMaterial}
                    onChange={e => setBuscaMaterial(e.target.value)}
                    placeholder="Pesquisar em todo o direito material e precedentes qualificados..."
                    className="w-full rounded-xl border border-[#56677d] bg-[#1b232e] pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400"
                  />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    'TODAS',
                    'Tributo e competência',
                    'Princípios e imunidades',
                    'Obrigação e crédito',
                    'Processo e execução fiscal',
                    'Impostos e taxas',
                    'Reforma 2026'
                  ].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCatMaterial(cat)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        catMaterial === cat
                          ? 'bg-sky-600 text-white border border-sky-400'
                          : 'border border-[#56677d] bg-[#3b495e] text-slate-200 hover:bg-slate-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid Direito Material */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MATERIAL_DATA.filter(
                  m =>
                    (catMaterial === 'TODAS' || m.cat === catMaterial) &&
                    (m.titulo + ' ' + m.texto).toLowerCase().includes(buscaMaterial.toLowerCase())
                ).map((mat, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-[#455468] bg-[#344154] p-4 shadow-sm"
                  >
                    <span className="badge b-AMARELO mb-2">{mat.cat}</span>
                    <h3 className="text-xs font-bold text-white mb-2">{mat.titulo}</h3>
                    <p className="text-xs leading-relaxed text-slate-200">{mat.texto}</p>
                  </div>
                ))}
              </div>

              {/* Seção Precedentes Qualificados */}
              <div className="rounded-2xl border border-[#455468] bg-[#2b3646] p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Scale className="h-4 w-4 text-pink-400" /> Precedentes Qualificados (STF Repercussão Geral & STJ Repetitivos)
                  </h3>
                  <span className="badge b-ROSA font-mono">
                    {
                      PRECEDENTES_QUALIFICADOS.filter(
                        p =>
                          (tribPrecedente === 'TODOS' || p.tr === tribPrecedente) &&
                          (temaPrecedente === 'TODOS' ||
                            (p.titulo + ' ' + p.texto).toLowerCase().includes(temaPrecedente.toLowerCase())) &&
                          (p.titulo + ' ' + p.texto + ' ' + p.tema).toLowerCase().includes(buscaMaterial.toLowerCase())
                      ).length
                    }{' '}
                    de {PRECEDENTES_QUALIFICADOS.length} temas
                  </span>
                </div>

                {/* Filtros de Tribunal */}
                <div className="flex items-center gap-2 flex-wrap">
                  {['TODOS', 'STF', 'STJ'].map(tr => (
                    <button
                      key={tr}
                      onClick={() => setTribPrecedente(tr)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        tribPrecedente === tr
                          ? 'bg-sky-600 text-white border border-sky-400'
                          : 'border border-[#56677d] bg-[#3b495e] text-slate-200 hover:bg-slate-600'
                      }`}
                    >
                      {tr}
                    </button>
                  ))}
                </div>

                {/* Filtros de Assunto */}
                <div className="flex items-center gap-2 flex-wrap">
                  {['TODOS', 'ICMS', 'ISS', 'IR', 'IOF', 'IPTU', 'ITBI', 'Execução', 'Prescrição', 'SELIC'].map(
                    tema => (
                      <button
                        key={tema}
                        onClick={() => setTemaPrecedente(tema)}
                        className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
                          temaPrecedente === tema
                            ? 'bg-emerald-600 text-white border border-emerald-400'
                            : 'border border-[#56677d] bg-[#1b232e] text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {tema === 'TODOS' ? 'Todos os assuntos' : tema}
                      </button>
                    )
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {PRECEDENTES_QUALIFICADOS.filter(
                    p =>
                      (tribPrecedente === 'TODOS' || p.tr === tribPrecedente) &&
                      (temaPrecedente === 'TODOS' ||
                        (p.titulo + ' ' + p.texto).toLowerCase().includes(temaPrecedente.toLowerCase())) &&
                      (p.titulo + ' ' + p.texto + ' ' + p.tema).toLowerCase().includes(buscaMaterial.toLowerCase())
                  ).map((prec, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-[#455468] bg-[#344154] p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`badge ${prec.tr === 'STF' ? 'b-VERDE' : 'b-AZUL'}`}>
                          {prec.tr} • Tema {prec.tema} {prec.tr === 'STF' ? 'RG' : 'Repetitivo'}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-amber-300 mt-2 mb-1">{prec.titulo}</h4>
                      <p className="text-xs leading-relaxed text-slate-200">{prec.texto}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SÚMULAS */}
          {activeTab === 'sumulas' && (
            <div className="space-y-4">
                {/* Painel de Filtros e Busca */}
                <div className="rounded-2xl border border-[#455468] bg-[#2b3646] p-4 lg:p-5 shadow-sm space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    {/* Campo de Busca */}
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        value={buscaSumula}
                        onChange={e => setBuscaSumula(e.target.value)}
                        placeholder="Pesquisar por número, assunto (ex: IRPF, ICMS, Prescrição) ou texto..."
                        className="w-full rounded-xl border border-[#56677d] bg-[#1b232e] pl-9 pr-9 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400"
                      />
                      {buscaSumula && (
                        <button
                          onClick={() => setBuscaSumula('')}
                          className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-white"
                          title="Limpar busca"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {/* Botão Filtro de Súmulas Recentes (Últimos 6 meses) */}
                    <button
                      onClick={() => setFiltroApenasRecentes(!filtroApenasRecentes)}
                      className={`rounded-full px-3.5 py-2 text-xs font-semibold transition-all inline-flex items-center gap-2 shadow-sm shrink-0 cursor-pointer ${
                        filtroApenasRecentes
                          ? 'bg-amber-500 text-slate-950 font-bold border-2 border-amber-300 ring-2 ring-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.4)] scale-[1.02]'
                          : 'border border-amber-500/60 bg-[#1b232e] text-amber-300 hover:bg-amber-950/40 hover:border-amber-400'
                      }`}
                      title="Exibir somente súmulas recentes editadas ou adicionadas nos últimos 6 meses"
                    >
                      <Sparkles className={`h-3.5 w-3.5 ${filtroApenasRecentes ? 'animate-spin' : 'text-amber-400'}`} />
                      <span>{filtroApenasRecentes ? '✓ Apenas Recentes (Últimos 6 meses)' : '⚡ Súmulas Recentes (Últimos 6m)'}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold font-mono ${
                          filtroApenasRecentes
                            ? 'bg-slate-950 text-amber-300'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {qtdRecentesNoTribunal}
                      </span>
                    </button>
                  </div>

                  {/* Segunda linha de controles: Filtro de Tribunais e Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-[#455468]/60">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] text-slate-400 mr-1 font-medium">Tribunal:</span>
                      {[
                        { id: 'TODOS', label: 'Todas as Cortes' },
                        { id: 'SV', label: 'Súmula Vinculante' },
                        { id: 'STF', label: 'STF' },
                        { id: 'STJ', label: 'STJ' }
                      ].map(tr => {
                        const ativo = filtroTribunal === tr.id;
                        return (
                          <button
                            key={tr.id}
                            onClick={() => setFiltroTribunal(tr.id)}
                            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                              ativo
                                ? 'bg-sky-600 text-white border border-sky-400 shadow-sm'
                                : 'border border-[#56677d] bg-[#344154] text-slate-200 hover:bg-slate-600'
                            }`}
                          >
                            {tr.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Contador e Limpar Filtros */}
                    <div className="flex items-center gap-2 text-[11px] text-slate-300">
                      <span>
                        Exibindo <strong className="text-white font-mono">{sumulasFiltradas.length}</strong> de {SUMULAS_DATA.length} súmulas
                        {filtroApenasRecentes && (
                          <span className="text-amber-300 font-medium"> ({qtdRecentesTotal} no catálogo recente)</span>
                        )}
                      </span>
                      {(buscaSumula || filtroTribunal !== 'TODOS' || filtroApenasRecentes) && (
                        <button
                          onClick={() => {
                            setBuscaSumula('');
                            setFiltroTribunal('TODOS');
                            setFiltroApenasRecentes(false);
                          }}
                          className="text-[10px] text-sky-400 hover:text-sky-200 underline ml-1 cursor-pointer"
                        >
                          Limpar filtros
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Banner Informativo quando o filtro de Recentes está ativado */}
                {filtroApenasRecentes && (
                  <div className="rounded-xl border border-amber-500/50 bg-gradient-to-r from-amber-500/15 via-[#2b3646] to-amber-500/10 p-3.5 flex items-center justify-between flex-wrap gap-3 shadow-md animate-fadeIn">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-400 text-amber-300 font-bold text-base shadow-sm">
                        ⚡
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="badge bg-amber-400 text-slate-950 font-bold text-[10px]">
                            Prioridade Máxima FGV
                          </span>
                          <span className="text-xs font-bold text-amber-200">
                            Modo Jurisprudência Recente Ativo (Últimos 6 meses)
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5">
                          Você está visualizando apenas os enunciados sumulares editados ou atualizados nos últimos 6 meses. O examinador da FGV prioriza fortemente essas súmulas em peças e questões discursivas inéditas.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setFiltroApenasRecentes(false)}
                      className="rounded-lg bg-[#1b232e] border border-amber-500/50 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:text-white hover:bg-amber-950/40 transition shrink-0"
                    >
                      Mostrar Todas ({SUMULAS_DATA.length})
                    </button>
                  </div>
                )}

                {/* Grid de Súmulas */}
                {sumulasFiltradas.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sumulasFiltradas.map((sum, idx) => {
                      const badgeColor =
                        sum.tr === 'SV' ? 'b-ROSA' : sum.tr === 'STF' ? 'b-VERDE' : 'b-AZUL';
                      const title =
                        sum.tr === 'SV'
                          ? `Súmula Vinculante ${sum.num}`
                          : `Súmula ${sum.tr} ${sum.num}`;
                      const isRecente = Boolean(sum.recente);

                      return (
                        <div
                          key={idx}
                          className={`rounded-xl border p-4 shadow-sm flex flex-col justify-between transition-all ${
                            isRecente
                              ? 'border-amber-400/60 bg-gradient-to-b from-[#344154] to-[#25303e] ring-1 ring-amber-400/20 shadow-[0_4px_14px_rgba(0,0,0,0.25)]'
                              : 'border-[#455468] bg-[#344154]'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                              <span className={`badge ${badgeColor}`}>{title}</span>
                              {isRecente && (
                                <span className="badge bg-amber-400/20 text-amber-300 border border-amber-400 font-bold inline-flex items-center gap-1 shadow-sm">
                                  ⚡ Recente ({sum.dataInfo || 'Últimos 6m'})
                                </span>
                              )}
                            </div>

                            {sum.tema && (
                              <div className="text-[11px] font-bold text-sky-300 mb-1 flex items-center gap-1">
                                <span className="text-amber-400 text-xs">📌</span> {sum.tema}
                              </div>
                            )}

                            <p className="text-xs leading-relaxed text-slate-200 mt-2">
                              {sum.texto}
                            </p>
                          </div>

                          {/* Ações integradas da Súmula */}
                          <div className="mt-3.5 pt-2.5 border-t border-[#455468]/80 flex items-center justify-between gap-2">
                            <button
                              onClick={() => {
                                const citacao = `\n\nNesse sentido, prevê a ${title}: "${sum.texto}".\n`;
                                inserirTextoNaRedacao(citacao, false);
                              }}
                              className="rounded-full bg-emerald-600/90 hover:bg-emerald-500 border border-emerald-400/70 px-2.5 py-1 text-[10px] font-bold text-white transition inline-flex items-center gap-1 shadow-sm"
                              title="Inserir citação desta súmula no texto da redação no Simulador 150L"
                            >
                              <Plus className="h-2.5 w-2.5" /> Citar no Simulador
                            </button>
                            <button
                              onClick={() =>
                                navegarParaVade(
                                  sum.tr === 'SV' ? 'ROSA' : sum.tr === 'STF' ? 'VERDE' : 'AZUL'
                                )
                              }
                              className="text-[10px] text-sky-400 hover:text-sky-300 hover:underline inline-flex items-center gap-0.5"
                            >
                              Ver no Vade →
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Estado Vazio */
                  <div className="rounded-2xl border border-dashed border-[#56677d] bg-[#222b38] p-8 text-center space-y-3">
                    <div className="text-3xl">⚖️</div>
                    <h4 className="text-sm font-bold text-white">
                      Nenhuma súmula encontrada com os filtros selecionados
                    </h4>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      {filtroApenasRecentes
                        ? 'Não encontramos súmulas recentes dos últimos 6 meses para a busca ou tribunal selecionado.'
                        : 'Nenhuma súmula correspondeu aos termos pesquisados.'}
                    </p>
                    <div className="flex items-center justify-center gap-2 pt-2">
                      {filtroApenasRecentes && (
                        <button
                          onClick={() => setFiltroApenasRecentes(false)}
                          className="rounded-full bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
                        >
                          Desativar filtro de recentes
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setBuscaSumula('');
                          setFiltroTribunal('TODOS');
                          setFiltroApenasRecentes(false);
                        }}
                        className="rounded-full border border-slate-600 bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
                      >
                        Limpar todos os filtros
                      </button>
                    </div>
                  </div>
                )}
              </div>
          )}

          {/* TAB 7: SIMULADOR 150 LINHAS FGV */}
          {activeTab === 'simulador' && (
            <div className="space-y-4">
              {/* Header Bar */}
              <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/90 dark:bg-zinc-800/90 p-4 shadow-xs backdrop-blur-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1 min-w-[260px]">
                  <label className="text-[10.5px] font-bold text-zinc-500 dark:text-zinc-400 block mb-1">
                    Caderno de Questões FGV / Caso Simulado:
                  </label>
                  <select
                    value={casoIndex}
                    onChange={e => setCasoIndex(Number(e.target.value))}
                    className="w-full rounded-xl border border-black/15 dark:border-white/15 bg-zinc-50 dark:bg-zinc-900/90 px-3 py-2 text-xs font-semibold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500"
                  >
                    {CASOS_SIMULADO.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.titulo}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-50/60 dark:bg-blue-950/40 px-3.5 py-1.5 shadow-xs">
                    <span className="text-[11px] font-medium text-zinc-600 dark:text-zinc-300">Relógio Oficial 5h:</span>
                    <strong className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                      {format5hTimer(prova5hSecs)}
                    </strong>
                    <button
                      onClick={() => {
                        if (!prova5hRunning) tocarAlarmeWebAudio();
                        setProva5hRunning(!prova5hRunning);
                      }}
                      className="rounded-full bg-blue-600 hover:bg-blue-500 px-3 py-1 text-[11px] font-semibold text-white shadow-xs transition cursor-pointer"
                    >
                      {prova5hRunning ? 'Pausar' : prova5hSecs < 5 * 3600 ? 'Retomar' : 'Iniciar 5h'}
                    </button>
                    <button
                      onClick={() => {
                        setProva5hRunning(false);
                        setProva5hSecs(5 * 3600);
                      }}
                      className="rounded-full border border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/10 px-2 py-1 text-[11px] text-zinc-700 dark:text-zinc-300 hover:bg-black/10 transition cursor-pointer"
                      title="Reiniciar relógio de 5 horas"
                    >
                      <RotateCcw className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Split layout: Enunciado & Folha */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Left: Enunciado Oficial & Instruções */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/90 dark:bg-zinc-800/90 p-4 shadow-xs backdrop-blur-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/20">
                        Enunciado Oficial FGV
                      </span>
                      <span className="text-[10.5px] font-mono text-zinc-500 dark:text-zinc-400">Caso {casoIndex + 1}/3</span>
                    </div>
                    <h3 className="text-xs font-bold text-zinc-900 dark:text-white mb-2 leading-snug">
                      {CASOS_SIMULADO[casoIndex].titulo}
                    </h3>
                    <p className="text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                      {CASOS_SIMULADO[casoIndex].enunciado}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/90 dark:bg-zinc-800/90 p-4 shadow-xs backdrop-blur-md">
                    <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-1.5">
                      <span>Instruções da Banca Examinadora</span>
                    </h4>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      <li>Use exclusivamente caneta esferográfica azul ou preta.</li>
                      <li>Máximo de 150 linhas distribuídas rigorosamente em 5 páginas pautadas.</li>
                      <li>Proibida assinatura identificadora no corpo da peça (use "...").</li>
                      <li>Indique artigos e súmulas expressamente no mérito para pontuar.</li>
                    </ul>
                  </div>

                  {/* Central de Apoio e Fundamentação Integrada da Peça */}
                  <SimuladorApoioDrawer
                    pecaAtual={pecaSelecionada}
                    onInserirTexto={inserirTextoNaRedacao}
                    onSalvarNoPlanner={() => salvarTreinoNoPlanner(CASOS_SIMULADO[casoIndex].titulo)}
                    onNavegarParaAba={(aba) => setActiveTab(aba as TabType)}
                  />
                </div>

                {/* Right: Análise em Tempo Real + Folha Padrão 150 Linhas */}
                <div className="lg:col-span-8 space-y-4">
                  {/* Card de Análise Heurística de Peça em Tempo Real (FGV histórico + fatos + redação ativa) */}
                  <SimuladorAnalisePecaCard
                    analise={analisePecaAtual}
                    onAdotarEsqueleto={(esqueleto, nomePeca) => {
                      aplicarEsqueletoPecaSugerida(esqueleto);
                      mostrarToast(`⚡ Esqueleto de ${nomePeca} adotado na folha de 150 linhas!`);
                    }}
                    onNavegarParaCatalogo={(codigoPeca: string) => {
                      const achada = CATALOGO_PECAS.find(p => p.codigo.toUpperCase() === codigoPeca.toUpperCase());
                      if (achada) {
                        setPecaSelecionada(achada);
                      }
                      setActiveTab('pecas');
                    }}
                  />

                  <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/90 dark:bg-zinc-800/90 p-4 shadow-xs backdrop-blur-md">
                    {/* Page Switcher & Mode Toggles */}
                    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map(p => (
                          <button
                            key={p}
                            onClick={() => mudarPaginaFolha(p)}
                            className={`rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                              paginaFolha === p
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'border border-black/10 dark:border-white/15 bg-black/[0.04] dark:bg-white/[0.06] text-zinc-700 dark:text-zinc-300 hover:bg-black/10 dark:hover:bg-white/10'
                            }`}
                          >
                            Pág {p}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Botão de Destaque de Sintaxe */}
                        <button
                          onClick={() => {
                            const novo = !destaqueSintaxe;
                            setDestaqueSintaxe(novo);
                            SafeStorage.set('tributa_destaque_sintaxe', String(novo));
                            tocarAlarmeWebAudio('suave');
                            mostrarToast(
                              novo
                                ? '✨ Destaque de Sintaxe Jurídica ativado!'
                                : 'Destaque de Sintaxe Jurídica desativado.'
                            );
                          }}
                          className={`rounded-full px-3 py-1 text-xs font-semibold transition inline-flex items-center gap-1.5 shadow-xs cursor-pointer ${
                            destaqueSintaxe
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                              : 'border border-black/10 dark:border-white/15 bg-black/[0.04] dark:bg-white/[0.06] text-zinc-700 dark:text-zinc-300 hover:bg-black/10 dark:hover:bg-white/10'
                          }`}
                          title="Alternar modo de destaque de sintaxe jurídica FGV no texto da folha"
                        >
                          <Sparkles className={`h-3.5 w-3.5 ${destaqueSintaxe ? 'text-amber-200 animate-spin' : 'text-zinc-400'}`} />
                          <span>{destaqueSintaxe ? 'Destaque: Ativado' : 'Destaque de Sintaxe'}</span>
                        </button>

                        {/* Botão de Tooltips Jurídicos Flutuantes */}
                        {destaqueSintaxe && (
                          <button
                            onClick={toggleTooltipsSintaxe}
                            className={`rounded-full px-3 py-1 text-xs font-semibold transition inline-flex items-center gap-1.5 shadow-xs cursor-pointer ${
                              tooltipsAtivos
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'border border-black/10 dark:border-white/15 bg-black/[0.04] dark:bg-white/[0.06] text-zinc-700 dark:text-zinc-300 hover:bg-black/10 dark:hover:bg-white/10'
                            }`}
                            title="Alternar exibição de janelas flutuantes com conceitos jurídicos e fundamentação ao passar o mouse sobre os termos"
                          >
                            <span>💡 {tooltipsAtivos ? 'Tooltips: Ativados' : 'Tooltips: Desativados'}</span>
                          </button>
                        )}

                        <button
                          onClick={() => setModalVersoesAberto(true)}
                          className="rounded-full px-3 py-1 text-xs font-semibold transition inline-flex items-center gap-1.5 shadow-xs cursor-pointer border border-black/10 dark:border-white/15 bg-black/[0.04] dark:bg-white/[0.06] text-zinc-700 dark:text-zinc-300 hover:bg-black/10 dark:hover:bg-white/10"
                          title="Gerenciar e comparar versões da redação com visualização de diff"
                        >
                          <History className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
                          <span>Versões ({versoesRedacao.length})</span>
                        </button>

                        <button
                          onClick={() => setModoRascunho(!modoRascunho)}
                          className={`rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                            modoRascunho
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'border border-black/10 dark:border-white/15 bg-black/[0.04] dark:bg-white/[0.06] text-zinc-700 dark:text-zinc-300 hover:bg-black/10 dark:hover:bg-white/10'
                          }`}
                        >
                          📋 {modoRascunho ? 'Modo Definitivo' : 'Alternar Rascunho'}
                        </button>
                      </div>
                    </div>

                    {/* Barra de Filtros e Legenda de Sintaxe Jurídica FGV */}
                    <div className="mb-3">
                      <SimuladorSintaxeBar
                        ativo={destaqueSintaxe}
                        onToggleAtivo={() => {
                          const novo = !destaqueSintaxe;
                          setDestaqueSintaxe(novo);
                          SafeStorage.set('tributa_destaque_sintaxe', String(novo));
                          tocarAlarmeWebAudio('suave');
                          mostrarToast(
                            novo
                              ? '✨ Destaque de Sintaxe Jurídica ativado!'
                              : 'Destaque de Sintaxe Jurídica desativado.'
                          );
                        }}
                        stats={sintaxeResultado.stats}
                        activeCategories={sintaxeCategorias}
                        onToggleCategory={toggleCategoriaSintaxe}
                        onInserirTermo={(termo) => inserirTextoNaRedacao(termo, false)}
                        tooltipsAtivos={tooltipsAtivos}
                        onToggleTooltips={toggleTooltipsSintaxe}
                      />
                    </div>

                    {/* Paper Container */}
                    <div className="fgv-sheet-wrapper">
                      <div className="fgv-sheet-top">
                        <div className="font-bold text-xs text-slate-800">
                          Peça Profissional – Página {paginaFolha}/5 (linhas {(paginaFolha - 1) * 30 + 1}–{paginaFolha * 30})
                        </div>
                        <div className="flex items-center gap-2">
                          {destaqueSintaxe && sintaxeResultado.stats.total > 0 && (
                            <span
                              className="inline-flex items-center gap-1 rounded-full bg-sky-100 text-sky-800 border border-sky-300 px-2 py-0.5 text-[10px] font-bold"
                              title={`${sintaxeResultado.stats.peca} peças, ${sintaxeResultado.stats.artigo} artigos, ${sintaxeResultado.stats.tributo} tributos, ${sintaxeResultado.stats.tese} teses. Passe o mouse nos termos para ver o conceito.`}
                            >
                              ✨ {sintaxeResultado.stats.total} termos destacados {tooltipsAtivos ? '(passe o mouse)' : ''}
                            </span>
                          )}
                          {linhasCount >= 150 ? (
                            <button
                              type="button"
                              onClick={() => setModalFimSimuladoAberto(true)}
                              className="inline-flex items-center gap-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400 px-2.5 py-0.5 text-[10px] font-bold cursor-pointer active:scale-95 transition shadow-xs"
                              title="150 Linhas concluídas! Clique para ver a notificação de fim de simulado e iniciar pausa de 15 minutos."
                            >
                              ☕ 150L Concluídas • Pausa 15m
                            </button>
                          ) : totalLinhasSemana >= 150 ? (
                            <button
                              onClick={() => {
                                dispararConfetesSuaves({ count: 60, originY: 0.35 });
                                tocarAlarmeWebAudio('suave');
                                mostrarToast('🎉 Parabéns! Meta semanal de 150 linhas FGV atingida!');
                              }}
                              className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 text-[10px] font-bold cursor-pointer hover:bg-emerald-200 active:scale-95 transition"
                              title="Meta semanal de 150 linhas atingida! Clique para celebrar com confetes."
                            >
                              🎯 Meta 150L Atingida!
                            </button>
                          ) : null}
                          <div className="font-mono text-xs font-bold text-slate-700">
                            Linha {linhasCount} / 150 • {palavrasCount} palavras
                          </div>
                        </div>
                      </div>

                      <div
                        ref={scrollContainerRef}
                        className="fgv-editor-container"
                        style={{ height: '560px' }}
                      >
                        {modoRascunho && <div className="fgv-watermark">RASCUNHO</div>}
                        <div className="fgv-line-numbers">
                          {Array.from({ length: 150 }, (_, i) => (
                            <div key={i + 1}>{i + 1}</div>
                          ))}
                        </div>

                        {/* Editor com Camada Sobreposta (Overlay) de Destaque de Sintaxe e Tooltips Jurídicos */}
                        <div className="relative flex-1 min-h-[4200px] h-[4200px] flex">
                          {destaqueSintaxe && (
                            <SimuladorSintaxeOverlay
                              text={textoRedacao}
                              activeCategories={sintaxeCategorias}
                              overlayRef={syntaxOverlayRef}
                              editorRef={editorRef}
                              onHoverTerm={handleHoverSyntaxTerm}
                              onLeaveTerm={handleLeaveSyntaxTerm}
                              tooltipsHabilitados={tooltipsAtivos}
                            />
                          )}
                          <textarea
                            ref={editorRef}
                            value={textoRedacao}
                            onChange={e => handleRedacaoChange(e.target.value)}
                            onScroll={handleEditorScroll}
                            placeholder="Linha 01: Comece o Endereçamento aqui..."
                            className="fgv-lined-textarea w-full h-full relative"
                            spellCheck={false}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Janela Flutuante de Tooltip Jurídico ao passar o mouse sobre termos destacados */}
                    {destaqueSintaxe && tooltipsAtivos && tooltipInfo && tooltipPos && (
                      <TooltipJuridico
                        info={tooltipInfo}
                        position={tooltipPos}
                        onClose={() => {
                          setTooltipInfo(null);
                          setTooltipPos(null);
                        }}
                        onNavegarParaAba={(aba) => setActiveTab(aba as TabType)}
                        onInserirFundamentacao={(texto) => inserirTextoNaRedacao(texto, false)}
                      />
                    )}

                    {/* Actions Toolbar */}
                    <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={inserirEsqueletoNaRedacao}
                          className="rounded-full bg-sky-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-sky-500 transition shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          ⚡ Esqueleto do Catálogo
                        </button>
                        <button
                          onClick={() => setActiveTab('cronograma')}
                          className="rounded-full bg-amber-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-amber-500 transition shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
                          title="Abrir os 32 simulados de provas reais FGV"
                        >
                          🎲 32 Simulados FGV
                        </button>
                        <button
                          onClick={() => setModalVersoesAberto(true)}
                          className="rounded-full bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition shadow-sm inline-flex items-center gap-1.5 cursor-pointer active:scale-95"
                          title="Comparar histórico de versões com visualização de diff"
                        >
                          <GitCompare className="h-3.5 w-3.5" />
                          <span>Versões & Diff ({versoesRedacao.length})</span>
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (linhasCount >= 150) {
                              setModalFimSimuladoAberto(true);
                            } else {
                              mostrarToast('Finalizando simulado! Avaliando no espelho oficial da banca FGV...');
                              setActiveTab('cronograma');
                            }
                          }}
                          className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-sm inline-flex items-center gap-1.5 cursor-pointer active:scale-95"
                          title="Finalizar simulado e receber a nota oficial da banca FGV (0 a 5.00)"
                        >
                          🏁 Finalizar Simulado & Corrigir
                        </button>
                        <button
                          onClick={() => exportarRedacaoNoWord(textoRedacao)}
                          className="rounded-full bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 transition shadow-sm inline-flex items-center gap-1.5"
                        >
                          📄 Exportar no Word
                        </button>
                        <button
                          onClick={() => baixarRedacaoTxt(textoRedacao)}
                          className="rounded-full bg-slate-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-500 transition shadow-sm inline-flex items-center gap-1.5"
                        >
                          💾 Salvar (.TXT)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: FLASHCARDS */}
          {activeTab === 'flashcards' && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-[#455468] bg-[#2b3646] p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <span className="badge b-AMARELO">Cartões Oficiais</span>
                    <h2 className="text-base font-semibold text-white mt-1">
                      Repetição Espaçada — Direito Tributário
                    </h2>
                  </div>
                  <button
                    onClick={() => exportarFlashcardsNoWord(flashcardsFiltrados)}
                    className="rounded-full bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 transition shadow-sm inline-flex items-center gap-1.5"
                  >
                    📄 Baixar Flashcards (.doc)
                  </button>
                </div>

                {/* Categorias */}
                <div className="flex items-center gap-2 flex-wrap border-t border-[#455468] pt-3">
                  {['TODOS', 'IMUNIDADES', 'IMPOSTOS', 'EXECUCAO', 'CREDITO', 'REFORMA'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        setFiltroCatFlash(cat);
                        setIdxFlash(0);
                        setRevelado(false);
                      }}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        filtroCatFlash === cat
                          ? 'bg-sky-600 text-white border border-sky-400'
                          : 'border border-[#56677d] bg-[#3b495e] text-slate-200 hover:bg-slate-600'
                      }`}
                    >
                      {cat === 'TODOS'
                        ? 'Todos'
                        : cat === 'IMUNIDADES'
                        ? 'Imunidades'
                        : cat === 'IMPOSTOS'
                        ? 'Impostos'
                        : cat === 'EXECUCAO'
                        ? 'Execução'
                        : cat === 'CREDITO'
                        ? 'Crédito'
                        : 'Reforma'}
                    </button>
                  ))}
                </div>

                {/* Flashcard Viewer */}
                {flashcardAtual ? (
                  <div className="rounded-2xl border border-sky-400/80 bg-[#344154] p-6 shadow-md">
                    <div className="flex items-center justify-between mb-4">
                      <span className="badge b-AMARELO">{flashcardAtual.c}</span>
                      <span className="badge b-AZUL font-mono">
                        Card {idxFlash + 1} de {flashcardsFiltrados.length}
                      </span>
                    </div>

                    <p className="text-sm md:text-base font-semibold text-white mb-4 leading-relaxed">
                      {flashcardAtual.p}
                    </p>

                    {revelado && (
                      <div className="mt-4 border-t border-[#455468] pt-4 space-y-3.5">
                        <div className="text-xs md:text-sm leading-relaxed text-emerald-300 bg-emerald-950/30 p-3 rounded-xl border border-emerald-500/30">
                          <strong className="text-emerald-200">✓ Gabarito FGV:</strong> {flashcardAtual.r}
                        </div>
                        
                        {/* Auto-avaliação do Desempenho (Alimenta o Dashboard) */}
                        <div className="flex items-center justify-between flex-wrap gap-2 pt-1 bg-[#202733]/80 p-3 rounded-xl border border-white/5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-300 font-medium">Como foi sua resposta?</span>
                            <span className="text-[10px] text-slate-400 hidden sm:inline">(atualiza as Estatísticas do Dashboard)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => registrarRespostaFlashcard(true)}
                              className="rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 text-xs font-semibold inline-flex items-center gap-1.5 transition shadow"
                              title="Registrar acerto e avançar"
                            >
                              <Check className="h-3.5 w-3.5" /> Acertei (+1)
                            </button>
                            <button
                              onClick={() => registrarRespostaFlashcard(false)}
                              className="rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-500/50 text-rose-200 px-3 py-1.5 text-xs font-semibold inline-flex items-center gap-1.5 transition"
                              title="Registrar revisão e avançar"
                            >
                              <X className="h-3.5 w-3.5" /> Preciso Revisar
                            </button>
                            <div className="ml-2 pl-2 border-l border-slate-600 font-mono text-[11px] text-sky-300">
                              Média: <strong className="text-white">{taxaAcertoEstimada}%</strong> ({flashStats.acertos}/{flashStats.total})
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between border-t border-[#455468] pt-4 mt-6 flex-wrap gap-2">
                      <button
                        onClick={anteriorFlashcard}
                        className="rounded-full border border-slate-600 bg-slate-700/80 px-3 py-1.5 text-xs text-white hover:bg-slate-600 transition"
                      >
                        ← Anterior
                      </button>
                      <button
                        onClick={ouvirFlashcard}
                        className="rounded-full bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 transition inline-flex items-center gap-1.5"
                      >
                        <Volume2 className="h-3.5 w-3.5" /> Ouvir
                      </button>
                      <button
                        onClick={() => setRevelado(!revelado)}
                        className="flex-1 rounded-full bg-sky-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-sky-500 transition inline-flex items-center justify-center gap-1.5"
                      >
                        <Eye className="h-3.5 w-3.5" /> {revelado ? 'Ocultar Resposta' : '👁️ Revelar Resposta'}
                      </button>
                      <button
                        onClick={proximoFlashcard}
                        className="rounded-full border border-slate-600 bg-slate-700/80 px-3 py-1.5 text-xs text-white hover:bg-slate-600 transition"
                      >
                        Próximo →
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">Nenhum cartão nesta categoria.</p>
                )}
              </div>

              {/* Grid de todos os flashcards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {flashcardsFiltrados.map((fc, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setIdxFlash(i);
                      setRevelado(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`rounded-xl border p-3 cursor-pointer transition ${
                      idxFlash === i
                        ? 'border-sky-400 bg-sky-950/40'
                        : 'border-[#455468] bg-[#344154] hover:bg-[#3d4d63]'
                    }`}
                  >
                    <span className="badge b-AMARELO text-[9px] mb-1">{fc.c}</span>
                    <p className="text-xs text-slate-200 line-clamp-2 mt-1">{fc.p}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: VADE MECUM */}
          {activeTab === 'vademecum' && (
            <div className="space-y-4">
              {/* Painel de Controle, Busca Textual e Filtros */}
              <div className="rounded-2xl border border-[#455468] bg-[#2b3646] p-4 lg:p-5 shadow-sm space-y-3.5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <span className="badge b-AMARELO text-[10px]">
                      Sistema 4 Cores + Clipes • Atualizado com LC 227 e LC 236/2026
                    </span>
                    <h2 className="text-base font-bold text-white mt-1">
                      Guia de Marcação do Vade Mecum FGV
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => marcarTodosVade(true)}
                      className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 transition shadow-sm cursor-pointer"
                    >
                      ✓ Marcar Todos
                    </button>
                    <button
                      onClick={() => marcarTodosVade(false)}
                      className="rounded-full border border-slate-600 bg-slate-700/60 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-600 transition cursor-pointer"
                    >
                      Desmarcar Todos
                    </button>
                  </div>
                </div>

                {/* Campo de Busca Textual no Vade Mecum */}
                <div className="flex flex-col sm:flex-row items-center gap-2.5">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={buscaVade}
                      onChange={e => setBuscaVade(e.target.value)}
                      placeholder="Pesquisar por artigo, código, tema (ex: Art. 151, CTN, Prescrição, Decadência, Reforma)..."
                      className="w-full rounded-xl border border-[#56677d] bg-[#1b232e] pl-9 pr-9 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                    />
                    {buscaVade && (
                      <button
                        onClick={() => setBuscaVade('')}
                        className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-white"
                        title="Limpar busca"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Filtro Rápido: Apenas Marcados */}
                  <button
                    onClick={() => setFiltroApenasMarcadosVade(!filtroApenasMarcadosVade)}
                    className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all inline-flex items-center gap-1.5 shrink-0 cursor-pointer ${
                      filtroApenasMarcadosVade
                        ? 'bg-emerald-600 text-white border border-emerald-400 shadow-sm'
                        : 'border border-[#56677d] bg-[#1b232e] text-slate-300 hover:bg-slate-800'
                    }`}
                    title="Exibir apenas os artigos marcados no seu Vade"
                  >
                    <Check className={`h-3.5 w-3.5 ${filtroApenasMarcadosVade ? 'text-white' : 'text-slate-400'}`} />
                    <span>Apenas Marcados</span>
                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 font-bold">
                      {vadeMarcados.length}
                    </span>
                  </button>
                </div>

                {/* Filtros de Cores com Contadores Dinâmicos */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-[#455468]/60">
                  <span className="text-[11px] text-slate-400 mr-1 font-medium">Categorias:</span>
                  {[
                    { val: 'TODAS', label: 'Todas as Cores', corClass: 'b-AMARELO', count: contagemCoresVade.TODAS },
                    { val: 'AMARELO', label: '🟡 Amarelo (Material)', corClass: 'b-AMARELO', count: contagemCoresVade.AMARELO },
                    { val: 'VERDE', label: '🟢 Verde (Processual)', corClass: 'b-VERDE', count: contagemCoresVade.VERDE },
                    { val: 'ROSA', label: '🩷 Rosa (Estrutura)', corClass: 'b-ROSA', count: contagemCoresVade.ROSA },
                    { val: 'AZUL', label: '🔵 Azul (Constitucional)', corClass: 'b-AZUL', count: contagemCoresVade.AZUL },
                    { val: 'CLIPES', label: '📎 Clipes (Prazos)', corClass: 'b-CLIPES', count: contagemCoresVade.CLIPES }
                  ].map(cat => {
                    const ativo = corFiltroVade === cat.val;
                    return (
                      <button
                        key={cat.val}
                        onClick={() => setCorFiltroVade(cat.val)}
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer ${
                          ativo
                            ? 'bg-amber-500 text-slate-950 font-bold border-2 border-amber-300 shadow-sm'
                            : 'border border-[#56677d] bg-[#344154] text-slate-200 hover:bg-slate-600'
                        }`}
                      >
                        <span>{cat.label}</span>
                        <span
                          className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                            ativo ? 'bg-slate-950 text-amber-300' : 'bg-black/30 text-slate-300'
                          }`}
                        >
                          {cat.count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Barra de Status e Progresso de Marcação */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#455468]/60 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span>
                      Exibindo <strong className="text-white font-mono">{vadeFiltrados.length}</strong> de {VADE_DATA.length} dispositivos
                    </span>
                    {(buscaVade || corFiltroVade !== 'TODAS' || filtroApenasMarcadosVade) && (
                      <button
                        onClick={() => {
                          setBuscaVade('');
                          setCorFiltroVade('TODAS');
                          setFiltroApenasMarcadosVade(false);
                        }}
                        className="text-[10px] text-sky-400 hover:text-sky-200 underline ml-1 cursor-pointer"
                      >
                        Limpar busca e filtros
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">Progresso no Vade:</span>
                    <strong className="text-emerald-400 font-mono text-[11px]">
                      {vadeMarcados.length} de {VADE_DATA.length} ({Math.round((vadeMarcados.length / VADE_DATA.length) * 100)}%)
                    </strong>
                    <div className="w-20 h-2 bg-[#1b232e] rounded-full overflow-hidden border border-[#455468]">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-300"
                        style={{ width: `${(vadeMarcados.length / VADE_DATA.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid de Artigos */}
              {vadeFiltrados.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {vadeFiltrados.map((item) => {
                    const isChecked = vadeMarcados.includes(item.originalIndex);
                    return (
                      <label
                        key={item.originalIndex}
                        className={`flex items-start gap-2.5 rounded-xl border p-3.5 cursor-pointer transition select-none ${
                          isChecked
                            ? 'border-emerald-500/80 bg-emerald-950/25 ring-1 ring-emerald-500/30 shadow-sm'
                            : 'border-[#455468] bg-[#344154] hover:bg-[#3d4d63]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleVade(item.originalIndex)}
                          className="mt-0.5 h-4 w-4 rounded accent-emerald-500 shrink-0 cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`badge b-${item.cor}`}>{item.cor}</span>
                            {item.novo && (
                              <span className="badge b-AMARELO text-[9px] font-bold">🆕 2026</span>
                            )}
                          </div>
                          <div className="text-xs font-semibold text-white mt-1.5 leading-snug">
                            {item.ref}
                          </div>
                          {item.obs && (
                            <div className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                              {item.obs}
                            </div>
                          )}
                          <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#455468]/50">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const citacao = `\n\nConforme estabelece o ${item.ref}${item.obs ? ` (${item.obs})` : ''}.\n`;
                                inserirTextoNaRedacao(citacao, false);
                              }}
                              className="rounded bg-[#1b232e] border border-[#56677d] px-2 py-0.5 text-[9px] font-semibold text-amber-300 hover:bg-[#253243] inline-flex items-center gap-1 cursor-pointer"
                              title="Citar este artigo na folha de 150 linhas do Simulador"
                            >
                              <Plus className="h-2.5 w-2.5" /> Citar no Simulador
                            </button>
                            <span className={`text-[10px] font-semibold ${isChecked ? 'text-emerald-400' : 'text-slate-400'}`}>
                              {isChecked ? '✓ Marcado' : 'Clique p/ marcar'}
                            </span>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              ) : (
                /* Estado Vazio */
                <div className="rounded-2xl border border-dashed border-[#56677d] bg-[#222b38] p-8 text-center space-y-3">
                  <div className="text-3xl">📖</div>
                  <h4 className="text-sm font-bold text-white">
                    Nenhum dispositivo encontrado
                  </h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Não localizamos artigos ou súmulas para os termos pesquisados
                    {buscaVade ? ` ("${buscaVade}")` : ''}
                    {corFiltroVade !== 'TODAS' ? ` na categoria ${corFiltroVade}` : ''}.
                  </p>
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <button
                      onClick={() => {
                        setBuscaVade('');
                        setCorFiltroVade('TODAS');
                        setFiltroApenasMarcadosVade(false);
                      }}
                      className="rounded-full bg-amber-500 px-4 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition cursor-pointer"
                    >
                      Limpar busca e filtros
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 10: LEGISLAÇÃO */}
          {activeTab === 'legislacao' && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-[#455468] bg-[#2b3646] p-5 shadow-sm">
                <h2 className="text-base font-semibold text-white">
                  Central de Legislação Compilada (Portal da Legislação Planalto)
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Acesso oficial e direto às normas fundamentais aplicadas à 2ª Fase OAB
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    lei: "LC 214/2025",
                    titulo: "Reforma Tributária: Regulamento do IBS, CBS e Imposto Seletivo",
                    link: "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp214.htm",
                    cor: "b-ROSA"
                  },
                  {
                    lei: "LC 225/2026",
                    titulo: "Código de Defesa do Contribuinte (Direitos, Garantias e Devedor Contumaz)",
                    link: "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp225.htm",
                    cor: "b-VERDE"
                  },
                  {
                    lei: "LC 227/2026",
                    titulo: "Comitê Gestor do IBS (CGIBS), Normas Gerais do ITCMD e Base do ITBI",
                    link: "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp227.htm",
                    cor: "b-ROSA"
                  },
                  {
                    lei: "LC 236/2026",
                    titulo: "Marco Histórico do CTN: Limites de Multas, PAF Nacional, Prescrição e Mediação",
                    link: "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp236.htm",
                    cor: "b-ROSA"
                  },
                  {
                    lei: "CF/1988",
                    titulo: "Sistema Tributário Nacional (Arts. 145 a 162 da Constituição Federal)",
                    link: "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm",
                    cor: "b-AMARELO"
                  },
                  {
                    lei: "Lei nº 5.172/1966",
                    titulo: "CTN — Código Tributário Nacional Compilado",
                    link: "https://www.planalto.gov.br/ccivil_03/leis/l5172compilado.htm",
                    cor: "b-AMARELO"
                  },
                  {
                    lei: "Lei nº 6.830/1980",
                    titulo: "LEF — Lei de Execução Fiscal da Dívida Ativa da Fazenda Pública",
                    link: "https://www.planalto.gov.br/ccivil_03/leis/l6830.htm",
                    cor: "b-VERDE"
                  },
                  {
                    lei: "Lei nº 12.016/2009",
                    titulo: "LMS — Lei do Mandado de Segurança Individual e Coletivo",
                    link: "https://www.planalto.gov.br/ccivil_03/leis/l12016.htm",
                    cor: "b-VERDE"
                  }
                ].map((item, idx) => (
                  <a
                    key={idx}
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col justify-between rounded-xl border border-[#455468] bg-[#344154] p-4 hover:border-sky-400 hover:bg-[#3d4d63] transition shadow-sm group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`badge ${item.cor}`}>{item.lei}</span>
                        <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-sky-300 transition" />
                      </div>
                      <h3 className="text-xs font-bold text-white group-hover:text-sky-200 transition">
                        {item.titulo}
                      </h3>
                    </div>
                    <span className="text-[11px] text-sky-400 mt-3 inline-block">Abrir no Planalto →</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* TAB 11: MAPAS MENTAIS (PDF VIEWER) */}
          {activeTab === 'mapas' && (
            <div className="flex flex-col h-[calc(100vh-100px)] space-y-3">
              <div className="rounded-2xl border border-[#455468] bg-[#2b3646] p-4 shadow-sm flex items-center justify-between flex-wrap gap-3">
                <div>
                  <span className="badge b-AMARELO">Leitor Integrado</span>
                  <h2 className="text-base font-semibold text-white mt-1">
                    Mapas Mentais de Direito Tributário — Prof. Guilherme Pedrozo
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <label className="rounded-full bg-sky-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-sky-500 transition cursor-pointer shadow-sm inline-flex items-center gap-1.5">
                    📂 Selecionar PDF do Computador
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex-1 rounded-2xl border border-[#455468] bg-[#FAF8F5] overflow-hidden flex flex-col items-center justify-center relative shadow-inner">
                {pdfUrl ? (
                  <iframe
                    src={pdfUrl}
                    title="Mapas Mentais"
                    className="w-full h-full border-none"
                  />
                ) : (
                  <div className="text-center p-8 text-slate-600 space-y-3">
                    <div className="text-5xl">📄</div>
                    <h3 className="text-base font-bold text-slate-800">
                      Nenhum arquivo PDF carregado no momento
                    </h3>
                    <p className="text-xs max-w-md mx-auto text-slate-600 leading-relaxed">
                      Clique no botão acima para selecionar o arquivo PDF dos seus Mapas Mentais ou
                      caderno de resumos. Ele será visualizado imediatamente sem sair da tela.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 12: TESES DE PEÇAS */}
          {activeTab === 'teses' && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-[#455468] bg-[#2b3646] p-5 shadow-sm space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={buscaTese}
                    onChange={e => setBuscaTese(e.target.value)}
                    placeholder="Pesquisar tese, artigo ou súmula..."
                    className="w-full rounded-xl border border-[#56677d] bg-[#1b232e] pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400"
                  />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setFiltroTeseCat(0)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      filtroTeseCat === 0
                        ? 'bg-sky-600 text-white border border-sky-400'
                        : 'border border-[#56677d] bg-[#3b495e] text-slate-200 hover:bg-slate-600'
                    }`}
                  >
                    Todas as Teses
                  </button>
                  {Object.entries(TESES_CONT).map(([catNum, rotulo]) => (
                    <button
                      key={catNum}
                      onClick={() => setFiltroTeseCat(Number(catNum))}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        filtroTeseCat === Number(catNum)
                          ? 'bg-sky-600 text-white border border-sky-400'
                          : 'border border-[#56677d] bg-[#3b495e] text-slate-200 hover:bg-slate-600'
                      }`}
                    >
                      {rotulo}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {TESES_DATA.filter(
                  t =>
                    (filtroTeseCat === 0 || t.c === filtroTeseCat) &&
                    (t.t + ' ' + t.s.map(x => x.join(' ')).join(' ')).toLowerCase().includes(buscaTese.toLowerCase())
                ).map((tese, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-[#455468] bg-[#344154] p-4 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="badge b-AZUL">{TESES_CONT[tese.c]}</span>
                        <span className="badge b-ROSA font-mono">cobrada {tese.n}x</span>
                      </div>
                      <h3 className="text-xs font-bold text-white mb-2.5 leading-snug">{tese.t}</h3>
                      <div className="space-y-2 text-xs">
                        {tese.s.map((sub, sIdx) => (
                          <div key={sIdx} className="rounded-lg bg-[#222b38] p-2.5 border border-[#455468]/60">
                            <strong className="text-sky-300 block mb-1">{sub[0]}</strong>
                            <span className="text-slate-300 leading-relaxed text-[11px]">{sub[1]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3 border-t border-[#455468] pt-2 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          const textoTese = `\n\nDO DIREITO: ${tese.t.toUpperCase()}\n${tese.s.map(sub => `${sub[0]}: ${sub[1]}`).join('\n')}\n`;
                          inserirTextoNaRedacao(textoTese, true);
                        }}
                        className="rounded-full bg-pink-600/80 hover:bg-pink-500 border border-pink-400 px-2.5 py-1 text-[10px] font-bold text-white transition inline-flex items-center gap-1 shadow-sm"
                        title="Inserir esta tese no mérito do Simulador 150L"
                      >
                        <Plus className="h-2.5 w-2.5" /> Inserir no Simulador 150L
                      </button>
                      <button
                        onClick={() => navegarParaVade('AMARELO')}
                        className="text-[10px] text-sky-400 hover:underline"
                      >
                        Ver no Vade →
                      </button>
                    </div>
                    <div className="mt-2 font-mono text-[10px] text-amber-300">
                      Exames OAB: {tese.e}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 13: PLANNER NATIVO */}
          {activeTab === 'planner' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-[#455468] bg-[#2b3646] p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <span className="badge b-AZUL">Integração Nativa 100% Editável</span>
                    <h2 className="text-base font-semibold text-white mt-1">
                      Planner de Estudos — Direito Tributário (Ceisc)
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={sincronizarCronogramaComPlanner}
                      className="rounded-full border border-sky-400 bg-sky-600/90 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-500 transition shadow-sm inline-flex items-center gap-1.5"
                      title="Importa até 5 metas pendentes da semana atual do Cronograma para o checklist do dia"
                    >
                      <FileCheck2 className="h-3.5 w-3.5" /> Puxar Metas do Cronograma
                    </button>
                    <button
                      onClick={() => setActiveTab('simulador')}
                      className="rounded-full border border-emerald-400 bg-emerald-600/90 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 transition shadow-sm inline-flex items-center gap-1.5"
                    >
                      <FileText className="h-3.5 w-3.5" /> Abrir Simulador 150L
                    </button>
                  </div>
                </div>

                {/* Sub tabs do Planner */}
                <div className="flex items-center gap-2 border-b border-[#455468] pb-3 flex-wrap">
                  {[
                    ['mensal', '📅 Planejamento Mensal'],
                    ['semanal', '📆 Planejamento Semanal'],
                    ['diario', '📝 Planejamento Diário'],
                    ['controle', '✅ Controle de Aulas & Peças']
                  ].map(([sub, rotulo]) => (
                    <button
                      key={sub}
                      onClick={() => setSubAbaPlanner(sub as any)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                        subAbaPlanner === sub
                          ? 'bg-sky-600 text-white border border-sky-400'
                          : 'border border-[#56677d] bg-[#3b495e] text-slate-200 hover:bg-slate-600'
                      }`}
                    >
                      {rotulo}
                    </button>
                  ))}
                </div>

                {/* MENSAL */}
                {subAbaPlanner === 'mensal' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <input
                        type="text"
                        placeholder="Mês (Ex: Novembro / Dezembro)"
                        value={plannerData['plM_mes'] || ''}
                        onChange={e => handlePlannerUpdate('plM_mes', e.target.value)}
                        className="rounded-lg border border-[#56677d] bg-[#1b232e] px-3 py-1.5 text-xs font-bold text-white w-52"
                      />
                      <input
                        type="text"
                        placeholder="Foco prioritário do mês..."
                        value={plannerData['plM_foco'] || ''}
                        onChange={e => handlePlannerUpdate('plM_foco', e.target.value)}
                        className="flex-1 min-w-[200px] rounded-lg border border-[#56677d] bg-[#1b232e] px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <textarea
                      placeholder="Tarefas e metas importantes do mês..."
                      value={plannerData['plM_tarefas'] || ''}
                      onChange={e => handlePlannerUpdate('plM_tarefas', e.target.value)}
                      className="w-full h-16 rounded-xl border border-[#56677d] bg-[#1b232e] p-2.5 text-xs text-white resize-none"
                    />

                    {/* 35 Days Grid */}
                    <div className="grid grid-cols-7 gap-2">
                      {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(d => (
                        <div
                          key={d}
                          className="text-center font-bold text-[11px] text-slate-300 py-1"
                        >
                          {d}
                        </div>
                      ))}
                      {Array.from({ length: 35 }).map((_, i) => (
                        <div
                          key={i}
                          className="rounded-xl border border-[#455468] bg-[#1b232e] p-2 min-h-[85px] flex flex-col"
                        >
                          <input
                            type="text"
                            placeholder="Dia"
                            value={plannerData[`plM_dia_${i}`] || ''}
                            onChange={e => handlePlannerUpdate(`plM_dia_${i}`, e.target.value)}
                            className="w-8 border-b border-[#455468] bg-transparent text-[10px] text-sky-400 font-bold focus:outline-none mb-1"
                          />
                          <textarea
                            placeholder="..."
                            value={plannerData[`plM_txt_${i}`] || ''}
                            onChange={e => handlePlannerUpdate(`plM_txt_${i}`, e.target.value)}
                            className="w-full flex-1 bg-transparent text-slate-200 text-xs resize-none focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SEMANAL */}
                {subAbaPlanner === 'semanal' && (
                  <div className="space-y-3">
                    <textarea
                      placeholder="Metas da semana e horários disponíveis..."
                      value={plannerData['plS_metas'] || ''}
                      onChange={e => handlePlannerUpdate('plS_metas', e.target.value)}
                      className="w-full h-16 rounded-xl border border-[#56677d] bg-[#1b232e] p-2.5 text-xs text-white resize-none"
                    />

                    <div className="overflow-x-auto rounded-xl border border-[#455468]">
                      <table className="w-full border-collapse text-xs">
                        <thead>
                          <tr className="bg-[#344154] text-sky-300">
                            <th className="border border-[#455468] p-2 text-center w-20">Turno</th>
                            {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(d => (
                              <th key={d} className="border border-[#455468] p-2 text-left">
                                {d}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {['MANHÃ', 'TARDE', 'NOITE'].map(t => (
                            <tr key={t} className="bg-[#1b232e]">
                              <td className="border border-[#455468] p-2 text-center font-bold text-slate-300 bg-[#2b3646]">
                                {t}
                              </td>
                              {Array.from({ length: 7 }).map((_, dIdx) => (
                                <td key={dIdx} className="border border-[#455468] p-1.5 align-top">
                                  <textarea
                                    value={plannerData[`plS_${t[0]}_${dIdx}`] || ''}
                                    onChange={e =>
                                      handlePlannerUpdate(`plS_${t[0]}_${dIdx}`, e.target.value)
                                    }
                                    className="w-full min-h-[75px] bg-transparent text-slate-200 text-xs resize-none focus:outline-none"
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* DIÁRIO */}
                {subAbaPlanner === 'diario' && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Checklist de Tarefas do Dia */}
                    <div className="md:col-span-6 rounded-xl border border-[#455468] bg-[#1b232e] p-4">
                      <h3 className="text-xs font-bold text-sky-300 mb-3 border-b border-[#455468] pb-2">
                        Tarefas do Dia
                      </h3>
                      <div className="space-y-2">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={plannerData[`plD_ck_${i}`] || false}
                              onChange={e => handlePlannerUpdate(`plD_ck_${i}`, e.target.checked)}
                              className="h-4 w-4 rounded accent-emerald-500"
                            />
                            <input
                              type="text"
                              placeholder={`Tarefa ${i + 1}...`}
                              value={plannerData[`plD_txt_${i}`] || ''}
                              onChange={e => handlePlannerUpdate(`plD_txt_${i}`, e.target.value)}
                              className="flex-1 border-b border-[#455468] bg-transparent text-xs text-white focus:outline-none pb-0.5"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Aulas do Dia & Anotações */}
                    <div className="md:col-span-6 space-y-4">
                      <div className="rounded-xl border border-[#455468] bg-[#1b232e] p-4">
                        <h3 className="text-xs font-bold text-emerald-300 mb-3 border-b border-[#455468] pb-2">
                          Aulas do Dia
                        </h3>
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="text-slate-400 border-b border-[#455468]">
                              <th className="text-left py-1">Aula / Conteúdo</th>
                              <th className="text-left py-1 w-20">EAD</th>
                              <th className="text-left py-1 w-20">Horário</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Array.from({ length: 4 }).map((_, i) => (
                              <tr key={i} className="border-b border-[#455468]/50">
                                <td className="py-1 pr-2">
                                  <input
                                    type="text"
                                    value={plannerData[`plD_a_${i}`] || ''}
                                    onChange={e => handlePlannerUpdate(`plD_a_${i}`, e.target.value)}
                                    className="w-full bg-transparent text-white focus:outline-none"
                                  />
                                </td>
                                <td className="py-1 pr-2">
                                  <input
                                    type="text"
                                    value={plannerData[`plD_ead_${i}`] || ''}
                                    onChange={e => handlePlannerUpdate(`plD_ead_${i}`, e.target.value)}
                                    className="w-full bg-transparent text-white focus:outline-none"
                                  />
                                </td>
                                <td className="py-1">
                                  <input
                                    type="text"
                                    value={plannerData[`plD_h_${i}`] || ''}
                                    onChange={e => handlePlannerUpdate(`plD_h_${i}`, e.target.value)}
                                    className="w-full bg-transparent text-white focus:outline-none"
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="rounded-xl border border-[#455468] bg-[#1b232e] p-4">
                        <h3 className="text-xs font-bold text-amber-300 mb-2 border-b border-[#455468] pb-1">
                          Anotações & Insights
                        </h3>
                        <textarea
                          placeholder="Escreva aqui suas observações, dúvidas ou artigos para reler..."
                          value={plannerData['plD_anotacoes'] || ''}
                          onChange={e => handlePlannerUpdate('plD_anotacoes', e.target.value)}
                          className="w-full h-24 bg-transparent text-xs text-white resize-none focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* CONTROLE DE AULAS */}
                {subAbaPlanner === 'controle' && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-300">
                      Marque abaixo as aulas e os treinamentos conforme for concluindo a visualização e a resolução dos exercícios.
                    </p>
                    <div className="space-y-4">
                      {ESTRUTURA_CONTROLE_AULAS.map((sec, secIdx) => (
                        <div
                          key={secIdx}
                          className="rounded-xl border border-[#455468] bg-[#1b232e] p-4"
                        >
                          <h3 className="text-xs font-bold text-sky-300 border-b border-[#455468] pb-2 mb-3">
                            {sec.titulo}
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {sec.itens.map((it, itIdx) => {
                              const key = `plC_ck_${secIdx}_${itIdx}`;
                              const checked = plannerData[key] || false;
                              return (
                                <label
                                  key={itIdx}
                                  className="flex items-start gap-2 text-xs text-slate-200 cursor-pointer select-none"
                                >
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={e => handlePlannerUpdate(key, e.target.checked)}
                                    className="mt-0.5 h-4 w-4 rounded accent-emerald-500 shrink-0"
                                  />
                                  <span className={checked ? 'line-through text-slate-400' : ''}>
                                    {it}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
      </div>

      {/* WINDOWS 11 FLUENT DESKTOP STATUS BAR */}
      <footer className="win11-statusbar shrink-0">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setModalAtualizacoesAberta(true)}
            className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300 hover:text-[#0067c0] dark:hover:text-[#4cc2ff] transition cursor-pointer"
            title="Clique para abrir a Central de Atualizações de Leis & Banco de Dados"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                statusConexao.online ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <span>
              {statusConexao.online
                ? `Sempre Online (${statusConexao.latenciaMs}ms)`
                : 'Modo Offline (Cache Seguro)'}
            </span>
          </button>
          <span className="hidden md:inline text-slate-300 dark:text-slate-700">|</span>
          <button
            type="button"
            onClick={() => setModalAtualizacoesAberta(true)}
            className="hidden md:flex items-center gap-1 text-[11px] text-[#0067c0] dark:text-[#4cc2ff] hover:underline cursor-pointer"
            title="Varredura contínua de leis tributárias, súmulas e banco de dados ativa"
          >
            <RefreshCw className="h-3 w-3 animate-spin" style={{ animationDuration: '8s' }} />
            <span>Varredura de Leis Ativa ({statusConexao.totalVerificacoes} checagens)</span>
          </button>
          <span className="hidden lg:inline text-slate-300 dark:text-slate-700">|</span>
          <span className="hidden lg:inline text-slate-600 dark:text-slate-400">Folha FGV: {linhasCount}/150 linhas</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 font-mono text-[10.5px]">
          <span className="text-slate-500 dark:text-slate-400">🍅 Foco:</span>
          <strong className="text-rose-600 dark:text-rose-400 font-bold">{pomodoroBlocosHoje}/4 blocos hoje</strong>
          <span className="text-slate-400">({pomodoroModo === '25m' ? '25m' : '50m'})</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setModalAtualizacoesAberta(true)}
            className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-bold hover:bg-emerald-500/20 transition cursor-pointer"
          >
            <Database className="h-2.5 w-2.5" />
            <span>Banco de Leis v3.5</span>
          </button>
          <span className="hidden sm:inline text-slate-600 dark:text-slate-400">
            Prova: <strong className="text-[#0067c0] dark:text-sky-400 font-mono">{diasProva >= 0 ? `${diasProva}d` : 'Hoje'}</strong>
          </span>
        </div>
      </footer>

      {/* MODAL DE NOTIFICAÇÃO DIÁRIA DE ESTUDO & LEMBRETE WORD */}
      <NotificacaoEstudoModal
        aberta={notifModalAberta}
        horario={notifTipoModal === 'word' ? notifWordHora : notifHorario}
        mensagem={notifTipoModal === 'word' ? notifWordMsg : notifMensagem}
        tipo={notifTipoModal}
        onFechar={() => setNotifModalAberta(false)}
        onIniciarFoco={() => {
          iniciarPomodoro();
        }}
        onIrParaSimulador={() => setActiveTab('simulador')}
        onIrParaCronograma={() => setActiveTab('cronograma')}
        onIrParaFlashcards={() => setActiveTab('flashcards')}
        onExportarWord={() => exportarRedacaoNoWord(textoRedacao)}
      />

      {/* MODAL DO GERENCIADOR DE VERSÕES DE REDAÇÃO & COMPARADOR DIFF */}
      <GerenciadorVersoesModal
        aberta={modalVersoesAberto}
        onFechar={() => setModalVersoesAberto(false)}
        textoAtual={textoRedacao}
        casoIndexAtual={casoIndex}
        casoTituloAtual={CASOS_SIMULADO[casoIndex]?.titulo || `Caso ${casoIndex + 1}`}
        versoes={versoesRedacao}
        onSalvarVersao={salvarNovaVersaoRedacao}
        onRestaurarVersao={restaurarVersaoRedacao}
        onExcluirVersao={excluirVersaoRedacao}
      />

      {/* MODAL DE NOTIFICAÇÃO DE FIM DE SIMULADO (150 LINHAS) E PAUSA DE 15 MINUTOS COM RELAXAMENTO */}
      <NotificacaoFimSimuladoModal
        aberto={modalFimSimuladoAberto}
        onFechar={() => setModalFimSimuladoAberto(false)}
        linhasCount={linhasCount}
        palavrasCount={palavrasCount}
        casoTitulo={CASOS_SIMULADO[casoIndex]?.titulo || 'Simulado Oficial FGV'}
        onExportarWord={() => exportarRedacaoNoWord(textoRedacao)}
        onIrParaEspelhoCorrecao={() => {
          setActiveTab('cronograma');
          mostrarToast('Abrindo espelho oficial da banca FGV para correção!');
        }}
        onIniciarPausaPomodoro={(minutos) => {
          setPomodoroTipo('pausa');
          setPomodoroSecs(minutos * 60);
          setPomodoroRunning(true);
          mostrarToast(`☕ Pausa de ${minutos} minutos sincronizada com o temporizador Pomodoro!`);
        }}
      />

      {/* CENTRAL DE ATUALIZAÇÕES DE LEIS & BANCO DE DADOS (SEMPRE ONLINE) */}
      <CentralAtualizacoesModal
        aberto={modalAtualizacoesAberta}
        onFechar={() => setModalAtualizacoesAberta(false)}
        onNavegarParaAba={(aba) => setActiveTab(aba as TabType)}
        onInserirTextoSimulador={(texto) => {
          inserirTextoNaRedacao(texto, false);
          setActiveTab('simulador');
        }}
        linhasRedacaoCount={linhasCount}
      />

      {/* MODAL DE BUSCA GLOBAL INTEGRADA (CTRL+K / '/') */}
      <BuscaGlobalModal
        aberta={buscaGlobalAberta}
        onFechar={() => setBuscaGlobalAberta(false)}
        onSelecionarItem={(destino) => {
          setActiveTab(destino.aba as TabType);
          if (destino.pecaCodigo) navegarParaPeca(destino.pecaCodigo);
          if (destino.sumulaNum) navegarParaSumula(destino.sumulaNum);
          if (destino.casoId !== undefined) navegarParaSimulado(destino.casoId);
          if (destino.impostoNome) navegarParaImposto(destino.impostoNome);
          if (destino.vadeCor) navegarParaVade(destino.vadeCor);
          if (destino.teseCat !== undefined) navegarParaTese('', destino.teseCat);
          if (destino.flashCat) navegarParaFlashcards(destino.flashCat);
        }}
      />

      {/* TOAST FEEDBACK DE INTERAÇÃO ENTRE AS ABAS */}
      {toastMsg && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-16 right-5 z-50 flex items-center gap-2 rounded-xl border border-sky-400 bg-[#1b232e] px-4 py-2.5 text-xs font-semibold text-white shadow-2xl animate-bounce"
        >
          <Sparkles className="h-4 w-4 text-sky-400 animate-spin" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
