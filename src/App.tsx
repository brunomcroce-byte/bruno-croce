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
import { dispararConfetesSuaves } from './utils/confetti';
import { CronogramaProgressoChart } from './components/CronogramaProgressoChart';
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
  Monitor
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

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Pomodoro Timer State (50 min)
  const [pomodoroSecs, setPomodoroSecs] = useState(50 * 60);
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const [pomodoroConcluido, setPomodoroConcluido] = useState(false);

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
      document.documentElement.classList.remove('theme-dark');
      document.body.classList.add('theme-light');
      document.body.classList.remove('theme-dark');
      const metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) metaTheme.setAttribute('content', '#f8fafc');
    } else {
      document.documentElement.classList.add('theme-dark');
      document.documentElement.classList.remove('theme-light');
      document.body.classList.add('theme-dark');
      document.body.classList.remove('theme-light');
      const metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) metaTheme.setAttribute('content', '#181c24');
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
      vadeMarcadosCount: vadeMarcados.length
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

  // Pomodoro effect (50 minutos)
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
            lerTextoEmVozAlta('Parabéns! Bloco de cinquenta minutos de estudo concluído com sucesso! Faça uma pausa revigorante.');
            mostrarToast('🎉 Bloco de foco de 50 minutos concluído com sucesso!');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [pomodoroRunning, pomodoroSecs]);

  // Pomodoro progress (0 to 1)
  const pomodoroProgresso = useMemo(() => {
    const total = 50 * 60;
    return Math.min(1, Math.max(0, (total - pomodoroSecs) / total));
  }, [pomodoroSecs]);

  const iniciarPomodoro = () => {
    setPomodoroConcluido(false);
    if (!pomodoroRunning) tocarAlarmeWebAudio();
    setPomodoroRunning(true);
    mostrarToast('Bloco de foco de 50 minutos iniciado!');
  };

  const pausarPomodoro = () => {
    setPomodoroRunning(false);
    mostrarToast('Bloco de foco pausado.');
  };

  const reiniciarPomodoro = (segundos: number = 50 * 60) => {
    setPomodoroRunning(false);
    setPomodoroConcluido(false);
    setPomodoroSecs(segundos);
    mostrarToast('Temporizador Pomodoro reiniciado para 50:00.');
  };

  const simularConclusaoPomodoro = () => {
    setPomodoroSecs(0);
    setPomodoroRunning(false);
    setPomodoroConcluido(true);
    dispararConfetesSuaves({ count: 75, originY: 0.35 });
    tocarAlarmeWebAudio('suave');
    mostrarToast('🎉 Parabéns! Bloco de 50 minutos concluído com sucesso!');
    lerTextoEmVozAlta('Parabéns! Bloco de cinquenta minutos de estudo concluído com sucesso! Excelente foco.');
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
    { id: 'teses', label: '13. Teses de Peças', icon: Award, kbd: '' },
    { id: 'planner', label: '12. Planner Nativo', icon: FileCheck2, kbd: 'Alt+P' }
  ];

  const totalTarefas = CRONOGRAMA_DATA.reduce((acc, curr) => acc + curr.tarefas.length, 0);

  return (
    <div className={`flex h-screen w-screen flex-col overflow-hidden ${tema === 'claro' ? 'theme-light bg-[#f3f3f3] text-[#0f172a]' : 'theme-dark bg-[#181c24] text-[#f1f5f9]'}`}>
      {/* WINDOWS 11 TITLEBAR CHROME */}
      <header className="win11-titlebar shrink-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-sky-500 to-blue-600 font-bold text-[10px] text-white shadow-sm">
            §
          </div>
          <span className="font-semibold tracking-tight text-xs flex items-center gap-1.5">
            TributaOAB Desktop Pro
            <span className="hidden sm:inline text-[9.5px] font-normal border border-current/15 px-1.5 py-0.2 rounded bg-black/5 dark:bg-white/5 opacity-80">
              Fluent 11
            </span>
          </span>
        </div>

        {/* Windows 11 Centered Search Bar */}
        <button
          onClick={() => setBuscaGlobalAberta(true)}
          className="hidden md:flex items-center justify-between w-72 lg:w-96 rounded-md border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-1 text-xs hover:border-sky-500/50 transition cursor-pointer"
          title="Pesquisar em todas as abas (Ctrl+K ou /)"
        >
          <span className="flex items-center gap-2 opacity-70">
            <Search className="h-3.5 w-3.5 text-sky-500" />
            <span className="text-[11.5px]">Pesquisar peças, teses, súmulas, vade...</span>
          </span>
          <kbd className="rounded bg-black/10 dark:bg-black/40 border border-current/10 px-1.5 py-0.2 font-mono text-[9px] opacity-80">
            Ctrl+K
          </kbd>
        </button>

        {/* Right Controls & Caption Buttons */}
        <div className="flex items-center gap-2 h-full">
          {/* Botão de Alternar Tema Claro / Escuro & Sincronização com SO */}
          <div className="flex items-center gap-1">
            <button
              onClick={alternarTema}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                tema === 'claro'
                  ? 'bg-amber-100/90 text-amber-900 border border-amber-300 hover:bg-amber-200 shadow-xs'
                  : 'bg-white/10 text-slate-200 border border-white/10 hover:bg-white/20'
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
                  <span className="hidden sm:inline">Tema Claro</span>
                </>
              ) : (
                <>
                  <Moon className="h-3.5 w-3.5 text-sky-400 fill-sky-400/30" />
                  <span className="hidden sm:inline">Tema Escuro</span>
                </>
              )}
              {!temaManual && (
                <span
                  className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-black/10 dark:bg-white/15 opacity-80"
                  title="Detectado automaticamente a partir do Sistema Operacional (prefers-color-scheme)"
                >
                  SO
                </span>
              )}
            </button>

            {temaManual && (
              <button
                onClick={sincronizarComTemaSO}
                className="flex items-center gap-1 px-1.5 py-1 rounded-md text-[11px] font-medium border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-sky-500/10 hover:text-sky-500 dark:hover:text-sky-400 transition cursor-pointer"
                title="Sincronizar com o tema do Sistema Operacional (prefers-color-scheme)"
              >
                <Monitor className="h-3 w-3" />
                <span className="hidden md:inline text-[10px]">Seguir SO</span>
              </button>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 mr-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] opacity-80">Base Ativa</span>
          </div>
          <div className="win11-window-controls">
            <button
              className="win11-caption-btn"
              title="Minimizar"
              onClick={() => mostrarToast('Janela minimizada para a barra de tarefas')}
            >
              <span className="text-sm font-mono leading-none">─</span>
            </button>
            <button
              className="win11-caption-btn"
              title="Maximizar / Restaurar"
              onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen().catch(() => {});
                } else {
                  document.exitFullscreen().catch(() => {});
                }
              }}
            >
              <span className="text-[11px] font-mono leading-none">▢</span>
            </button>
            <button
              className="win11-caption-btn close"
              title="Fechar"
              onClick={() => mostrarToast('Atalho: use Alt+F4 para fechar no Windows')}
            >
              <span className="text-xs font-mono leading-none">✕</span>
            </button>
          </div>
        </div>
      </header>

      {/* WORKSPACE AREA (SIDEBAR + MAIN CONTENT) */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* SIDEBAR */}
        <aside
          className={`fixed inset-y-0 left-0 top-[38px] lg:top-0 z-40 flex w-[280px] flex-col justify-between win11-sidebar border-r border-white/10 transition-transform duration-200 lg:static lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col overflow-y-auto">
            {/* Brand header */}
            <div className="flex items-center justify-between border-b border-white/10 p-3.5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 font-bold text-white shadow-md text-sm">
                  §
                </div>
                <div>
                  <div className="text-[14px] font-bold text-white tracking-tight">
                    Tributa<span className="text-sky-400">OAB</span>
                  </div>
                  <div className="text-[10.5px] text-[#94a3b8]">2ª Fase FGV • Windows 11</div>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="rounded-lg p-1 text-[#cbd5e1] hover:bg-white/10 lg:hidden"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-1 p-2">
              <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#94a3b8]">
                Módulos de Estudo
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
                      <Icon className={`h-4 w-4 ${isActive ? 'text-sky-300' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.kbd && (
                      <kbd className="rounded bg-black/40 border border-white/5 px-1.5 py-0.5 font-mono text-[9.5px] text-slate-400">
                        {item.kbd}
                      </kbd>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

        {/* Focus Pomodoro Box com Animação Visual de Círculo e Pulse de Cor */}
        <div
          className={`m-3 rounded-2xl border p-3.5 shadow-md transition-all duration-500 relative overflow-hidden ${
            pomodoroConcluido
              ? 'pomodoro-success-glow border-emerald-400 bg-gradient-to-br from-[#1b3d2f] via-[#234b3a] to-[#163326] ring-2 ring-emerald-400/50 shadow-[0_0_25px_rgba(34,197,94,0.35)]'
              : pomodoroRunning
              ? 'border-sky-500/70 bg-gradient-to-b from-[#2b3646] to-[#24303f] ring-1 ring-sky-500/30'
              : 'border-[#455468] bg-[#2b3646]'
          }`}
        >
          {/* Header do Box */}
          <div className="flex items-center justify-between mb-2.5">
            <span
              className={`flex items-center gap-1.5 text-[11px] font-bold ${
                pomodoroConcluido ? 'text-emerald-300' : 'text-amber-300'
              }`}
            >
              <Clock
                className={`h-3.5 w-3.5 ${
                  pomodoroConcluido ? 'text-emerald-400 animate-spin' : 'text-amber-400'
                }`}
              />
              <span>Bloco de Foco (50 min)</span>
            </span>

            {pomodoroConcluido ? (
              <span className="badge b-VERDE text-[9.5px] font-extrabold shadow-sm animate-pulse">
                ✓ CONCLUÍDO
              </span>
            ) : pomodoroRunning ? (
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Em Foco
              </span>
            ) : (
              <span className="text-[10px] text-slate-400">
                {pomodoroSecs === 50 * 60 ? 'Pronto' : 'Pausado'}
              </span>
            )}
          </div>

          {/* Área Central: Círculo de Progresso + Display do Timer */}
          <div className="flex items-center gap-3 my-2.5">
            {/* SVG Círculo de Progresso com Animação de Preenchimento e Pulse */}
            <div
              className={`relative shrink-0 flex items-center justify-center ${
                pomodoroConcluido ? 'pomodoro-circle-pulse' : ''
              }`}
            >
              <svg className="w-14 h-14 -rotate-90 transform" viewBox="0 0 56 56">
                {/* Círculo de Fundo */}
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  className={
                    pomodoroConcluido
                      ? 'text-emerald-950/60 stroke-current'
                      : 'text-slate-700/60 stroke-current'
                  }
                  strokeWidth="4"
                  fill="transparent"
                />
                {/* Círculo de Progresso preenchido */}
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  className={`transition-all duration-700 ${
                    pomodoroConcluido
                      ? 'text-emerald-400 stroke-current'
                      : pomodoroRunning
                      ? 'text-sky-400 stroke-current'
                      : 'text-amber-400/80 stroke-current'
                  }`}
                  strokeWidth="4.5"
                  strokeDasharray="138.23"
                  strokeDashoffset={pomodoroConcluido ? 0 : 138.23 * (1 - pomodoroProgresso)}
                  strokeLinecap="round"
                  fill="transparent"
                  style={
                    pomodoroConcluido
                      ? { filter: 'drop-shadow(0 0 7px rgba(34, 197, 94, 0.95))' }
                      : undefined
                  }
                />
              </svg>

              {/* Ícone no Centro do Círculo */}
              <div className="absolute inset-0 flex items-center justify-center">
                {pomodoroConcluido ? (
                  <Check className="h-6 w-6 text-emerald-300 animate-bounce stroke-[3]" />
                ) : pomodoroRunning ? (
                  <Sparkles className="h-4 w-4 text-sky-300 animate-pulse" />
                ) : (
                  <span className="font-mono text-[10px] font-bold text-slate-300">
                    {Math.round(pomodoroProgresso * 100)}%
                  </span>
                )}
              </div>
            </div>

            {/* Display Numérico e Texto de Status */}
            <div className="flex-1 min-w-0">
              <div
                className={`font-mono text-2xl font-black tracking-wider transition-colors ${
                  pomodoroConcluido
                    ? 'text-emerald-300 drop-shadow-[0_0_10px_rgba(52,211,153,0.7)] animate-pulse'
                    : 'text-white'
                }`}
              >
                {formatTimer(pomodoroSecs)}
              </div>

              <div className="text-[11px] leading-snug mt-0.5">
                {pomodoroConcluido ? (
                  <span className="text-emerald-200 font-bold flex items-center gap-1">
                    🎉 Bloco finalizado com sucesso!
                  </span>
                ) : pomodoroRunning ? (
                  <span className="text-sky-200">
                    Faltam {Math.ceil(pomodoroSecs / 60)} min para concluir
                  </span>
                ) : pomodoroSecs < 50 * 60 ? (
                  <span className="text-slate-300">
                    Restam {formatTimer(pomodoroSecs)}
                  </span>
                ) : (
                  <span className="text-slate-300">
                    Meta: 50 minutos de foco
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Barra de Ações do Pomodoro */}
          {pomodoroConcluido ? (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    reiniciarPomodoro(50 * 60);
                    iniciarPomodoro();
                  }}
                  className="flex-1 rounded-full bg-emerald-500 hover:bg-emerald-400 px-3 py-1.5 text-xs font-bold text-slate-950 transition shadow-md inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" /> Iniciar Novo Bloco (50m)
                </button>
                <button
                  onClick={() => reiniciarPomodoro(50 * 60)}
                  className="rounded-full border border-emerald-500/50 bg-[#1b232e] hover:bg-slate-800 px-2.5 py-1.5 text-xs text-emerald-300 transition cursor-pointer"
                  title="Voltar ao início de 50 minutos"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
              <button
                onClick={() => {
                  reiniciarPomodoro(10 * 60);
                  iniciarPomodoro();
                }}
                className="w-full rounded-full border border-emerald-400/40 bg-emerald-950/40 hover:bg-emerald-900/50 px-2.5 py-1 text-[11px] font-semibold text-emerald-200 transition cursor-pointer"
              >
                ☕ Pausa Curta de Descanso (10m)
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 pt-1">
              <button
                onClick={() => {
                  if (pomodoroRunning) {
                    pausarPomodoro();
                  } else {
                    iniciarPomodoro();
                  }
                }}
                className={`flex-1 rounded-full px-3 py-1.5 text-xs font-semibold text-white transition shadow-sm inline-flex items-center justify-center gap-1.5 cursor-pointer ${
                  pomodoroRunning
                    ? 'bg-amber-600 hover:bg-amber-500'
                    : 'bg-sky-600 hover:bg-sky-500'
                }`}
              >
                {pomodoroRunning ? (
                  <>
                    <Clock className="h-3.5 w-3.5" /> Pausar
                  </>
                ) : pomodoroSecs < 50 * 60 ? (
                  <>
                    <Play className="h-3.5 w-3.5 fill-current" /> Retomar
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 fill-current" /> Iniciar 50m
                  </>
                )}
              </button>

              <button
                onClick={() => reiniciarPomodoro(50 * 60)}
                className="rounded-full border border-slate-600 bg-slate-700/80 px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-600 transition cursor-pointer"
                title="Reiniciar Timer para 50 minutos"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>

              {/* Botão de Teste Rápido para simular a conclusão imediatamente */}
              <button
                onClick={simularConclusaoPomodoro}
                className="rounded-full border border-emerald-500/40 bg-[#1b232e] hover:bg-emerald-950/60 px-2 py-1.5 text-[10px] font-bold text-emerald-300 transition cursor-pointer"
                title="Testar animação visual de conclusão de 50 minutos agora (00:00)"
              >
                ⚡ 00:00
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN WRAPPER */}
      <div className="flex flex-1 min-w-0 flex-col h-full overflow-hidden">
        {/* Sub Header */}
        <header className="flex h-12 min-h-[48px] items-center justify-between border-b border-white/10 bg-[#1e2532]/75 backdrop-blur-md px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-800 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="hidden sm:inline">Banco de Dados Integral 100% Restaurado e Operacional</span>
              <span className="sm:hidden font-semibold">TributaOAB Pro</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Botão de Busca Global Integrada */}
            <button
              onClick={() => setBuscaGlobalAberta(true)}
              className="flex items-center gap-2 rounded-full border border-sky-500/50 bg-[#222b38] px-3 py-1.5 text-xs text-sky-300 hover:border-sky-400 hover:bg-sky-950/40 transition shadow-sm"
              title="Buscar em todas as abas (Ctrl+K ou /)"
            >
              <Search className="h-3.5 w-3.5 text-sky-400" />
              <span className="hidden md:inline">Busca Global</span>
              <kbd className="hidden md:inline rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[9px] text-slate-400">
                Ctrl+K
              </kbd>
            </button>

            {/* Widget Mini Temporizador Pomodoro no Subheader */}
            {(pomodoroRunning || pomodoroConcluido || pomodoroSecs < 50 * 60) && (
              <button
                onClick={() => {
                  if (pomodoroConcluido) {
                    reiniciarPomodoro();
                  } else {
                    setSidebarOpen(true);
                  }
                }}
                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition shadow-sm cursor-pointer ${
                  pomodoroConcluido
                    ? 'border-emerald-400 bg-emerald-500/25 text-emerald-300 ring-2 ring-emerald-400/50 animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.4)]'
                    : pomodoroRunning
                    ? 'border-sky-400/60 bg-sky-950/40 text-sky-200'
                    : 'border-amber-500/50 bg-amber-950/30 text-amber-300'
                }`}
                title={pomodoroConcluido ? 'Bloco de 50 minutos concluído com sucesso! Clique para reiniciar' : 'Temporizador Pomodoro de 50m'}
              >
                <Clock className={`h-3 w-3 ${pomodoroConcluido ? 'text-emerald-300 animate-spin' : pomodoroRunning ? 'text-sky-300 animate-pulse' : 'text-amber-300'}`} />
                <span className="font-mono font-bold">
                  {pomodoroConcluido ? '🎉 50m Concluído!' : formatTimer(pomodoroSecs)}
                </span>
              </button>
            )}

            {/* Botão Status Alarme Diário */}
            <button
              onClick={() => {
                setActiveTab('dashboard');
                testarNotificacaoManual();
              }}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition shadow-sm ${
                notifAtiva
                  ? 'border-amber-500/60 bg-amber-950/30 text-amber-300 hover:bg-amber-900/40'
                  : 'border-slate-600 bg-slate-800 text-slate-400'
              }`}
              title="Notificação Diária de Estudo — Clique para testar ou configurar"
            >
              <Bell className={`h-3 w-3 ${notifAtiva ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
              <span className="font-mono font-bold text-amber-200">{notifHorario}</span>
              <span className="hidden sm:inline text-[10px]">({notifAtiva ? 'Alarme Ativo' : 'Pausado'})</span>
            </button>

            {/* Alternador de Tema Rápido no Subheader */}
            <button
              onClick={alternarTema}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition shadow-sm ${
                tema === 'claro'
                  ? 'border-amber-400 bg-amber-50 text-amber-900 hover:bg-amber-100'
                  : 'border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              title="Alternar entre Tema Claro e Escuro"
            >
              {tema === 'claro' ? (
                <>
                  <Sun className="h-3 w-3 text-amber-600" />
                  <span className="font-semibold text-amber-900">Tema Claro</span>
                </>
              ) : (
                <>
                  <Moon className="h-3 w-3 text-sky-400" />
                  <span className="font-semibold text-slate-200">Tema Escuro</span>
                </>
              )}
            </button>

            <div className="hidden lg:flex items-center rounded-full border border-slate-300 dark:border-slate-600 bg-white/80 dark:bg-slate-800/80 px-3 py-1 text-xs text-slate-700 dark:text-slate-300">
              Repescagem: <strong className="font-mono text-amber-600 dark:text-amber-300 ml-1">23/11 a 30/11</strong>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-6">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-5 win11-animate">
              {/* Gráfico Recharts: Progresso do Cronograma de 8 Semanas */}
              <CronogramaProgressoChart
                tarefasConcluidas={tarefasConcluidas}
                onNavigateToCronograma={() => setActiveTab('cronograma')}
              />

              {/* CARD: DICA DO DIA (DIREITO TRIBUTÁRIO FGV) */}
              <DicaDoDiaCard
                onNavigateToTab={(tab) => setActiveTab(tab as TabType)}
                onMostrarToast={mostrarToast}
              />

              {/* CARD: METAS DIÁRIAS (ATÉ 3 MICRO-METAS COM LIMPEZA AUTOMÁTICA ÀS 00:00) */}
              <MetasDiariasCard
                onNavigateToTab={(tab) => setActiveTab(tab as TabType)}
                onMostrarToast={mostrarToast}
              />

              {/* CARD DE AÇÃO RÁPIDA: RELATÓRIO SEMANAL DE PROGRESSO EM PDF */}
              <div className="win11-widget-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-l-4 border-l-sky-500 bg-gradient-to-r from-sky-950/40 via-[#232d3d] to-[#1e293b]">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-500/20 border border-sky-400 text-sky-300 shadow-sm">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="badge b-AZUL text-[10px]">Exportação PDF</span>
                      <span className="badge b-VERDE text-[10px]">Acompanhamento FGV</span>
                    </div>
                    <h3 className="text-sm font-bold text-white mt-0.5">
                      Relatório Semanal de Progresso & Estudo
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Compila automaticamente sua taxa de acerto em Flashcards ({taxaAcertoEstimada}%), linhas redigidas no simulador ({totalLinhasSemana}/150L) e tarefas do cronograma ({tarefasConcluidas.length}/{totalTarefas}).
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleGerarRelatorioSemanalPdf}
                  className="win11-btn-primary inline-flex items-center gap-2 px-4 py-2 text-xs font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer whitespace-nowrap self-stretch sm:self-auto justify-center"
                  title="Exporta um arquivo PDF completo com taxa de flashcards, linhas do simulador e cronograma semanal"
                >
                  <Download className="h-4 w-4" />
                  <span>Gerar Relatório Semanal de Progresso</span>
                </button>
              </div>

              {/* BLOCO DE ESTATÍSTICAS DE DESEMPENHO (WINDOWS 11 WIDGET STYLE) */}
              <div className="win11-widget-card p-5 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/20 border border-sky-400 text-sky-300">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="badge b-AZUL text-[10px]">Windows 11 Widget</span>
                        <span className="text-[11px] text-slate-400 font-mono">Ciclo Semanal OAB</span>
                      </div>
                      <h2 className="text-base font-bold text-white mt-0.5">
                        Estatísticas de Desempenho
                      </h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <button
                      onClick={handleGerarRelatorioSemanalPdf}
                      className="win11-btn-primary inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold shadow-sm hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
                      title="Exporta o Relatório Semanal compilado em PDF"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Gerar Relatório Semanal de Progresso</span>
                    </button>
                    <span className="text-xs text-slate-300 bg-[#1b232e] px-3 py-1 rounded-full border border-[#455468]">
                      Semana Atual • {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Card 1: Média de Acertos Estimada nos Flashcards */}
                  <div className="win11-subcard p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                          <Sparkles className="h-4 w-4 text-emerald-400" />
                          Média de Acertos Estimada nos Flashcards
                        </span>
                        <span className="badge b-VERDE font-mono font-bold">
                          {taxaAcertoEstimada >= 80 ? 'Nível Excelente' : taxaAcertoEstimada >= 65 ? 'Bom Desempenho' : 'Em Fortalecimento'}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-3 my-2">
                        <span className="font-mono text-3xl font-extrabold text-white tracking-tight">
                          {taxaAcertoEstimada}%
                        </span>
                        <span className="text-xs text-slate-300">
                          ({flashStats.acertos} acertos em {flashStats.total} revisões)
                        </span>
                      </div>

                      {/* Barra de Progresso com meta FGV (75%) */}
                      <div className="space-y-1 mt-2">
                        <div className="flex items-center justify-between text-[10px] text-slate-300">
                          <span>Taxa de Retenção</span>
                          <span>Meta recomendada FGV: 75%</span>
                        </div>
                        <div className="h-2.5 w-full overflow-hidden rounded-full border border-[#455468] bg-[#1b232e]">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                            style={{ width: `${Math.min(100, taxaAcertoEstimada)}%` }}
                          ></div>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-300 mt-3 leading-relaxed">
                        Média calculada com base na repetição espaçada das teses, súmulas e peças da 2ª Fase OAB.
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#455468]/60 flex items-center justify-between">
                      <button
                        onClick={() => setActiveTab('flashcards')}
                        className="win11-btn-primary inline-flex items-center gap-1.5"
                      >
                        <Sparkles className="h-3.5 w-3.5" /> Praticar Flashcards Agora →
                      </button>
                      <button
                        onClick={() => {
                          const reset = { acertos: 0, total: 0 };
                          setFlashStats(reset);
                          SafeStorage.set('tributa_flash_stats', JSON.stringify(reset));
                          mostrarToast('Contador de flashcards reiniciado!');
                        }}
                        className="text-[10px] text-slate-400 hover:text-slate-200 underline"
                      >
                        Zerar métricas
                      </button>
                    </div>
                  </div>

                  {/* Card 2: Quantidade Total de Linhas Redigidas no Simulador Esta Semana */}
                  <div className="win11-subcard p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                          <FileText className="h-4 w-4 text-sky-400" />
                          Total de Linhas Redigidas no Simulador Esta Semana
                        </span>
                        <span
                          onClick={() => {
                            if (totalLinhasSemana >= 150) {
                              dispararConfetesSuaves({ count: 65, originY: 0.35 });
                              tocarAlarmeWebAudio('suave');
                              mostrarToast('🎉 Meta semanal de 150 linhas no simulador atingida!');
                            }
                          }}
                          className={`badge font-mono font-bold select-none ${
                            totalLinhasSemana >= 150
                              ? 'b-VERDE cursor-pointer hover:scale-105 active:scale-95 transition-transform'
                              : 'b-AZUL'
                          }`}
                          title={totalLinhasSemana >= 150 ? 'Meta de 150L atingida! Clique para celebrar 🎉' : undefined}
                        >
                          {totalLinhasSemana >= 150 ? 'Meta Semanal Atingida! 🎯' : 'Em Andamento'}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-3 my-2">
                        <span className="font-mono text-3xl font-extrabold text-white tracking-tight">
                          {totalLinhasSemana} <span className="text-sm font-medium text-slate-300">linhas</span>
                        </span>
                        <span className="text-xs text-slate-300">
                          (Meta semanal: 150 linhas • Folha Padrão FGV)
                        </span>
                      </div>

                      {/* Barra de Progresso com meta semanal de 150 linhas */}
                      <div className="space-y-1 mt-2">
                        <div className="flex items-center justify-between text-[10px] text-slate-300">
                          <span>Progresso da Meta Semanal</span>
                          <span>{Math.round((totalLinhasSemana / 150) * 100)}% de 150L</span>
                        </div>
                        <div className="h-2.5 w-full overflow-hidden rounded-full border border-[#455468] bg-[#1b232e]">
                          <div
                            className="h-full bg-gradient-to-r from-sky-500 to-blue-400 transition-all duration-500"
                            style={{ width: `${Math.min(100, Math.round((totalLinhasSemana / 150) * 100))}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-300">
                        <span>📄 Páginas preenchidas: <strong>{Math.min(5, Math.ceil(totalLinhasSemana / 30))}/5</strong></span>
                        <span>✍️ Redação ativa: <strong>{linhasCount} linhas</strong></span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#455468]/60 flex items-center justify-between">
                      <button
                        onClick={() => setActiveTab('simulador')}
                        className="win11-btn-primary inline-flex items-center gap-1.5"
                      >
                        <FileText className="h-3.5 w-3.5" /> Continuar Redigindo →
                      </button>
                      <button
                        onClick={() => adicionarLinhasAoTotalSemana(30)}
                        className="win11-btn-secondary text-[10px] py-1 px-2.5 inline-flex items-center gap-1"
                        title="Adiciona 1 página simulada (30 linhas) ao total da semana"
                      >
                        <Plus className="h-3 w-3" /> 30 Linhas
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* PAINEL DE NOTIFICAÇÃO DIÁRIA DE ESTUDO (LOCALSTORAGE) */}
              <div className="rounded-2xl border border-amber-500/70 bg-[#2b3646] p-5 shadow-md">
                <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500 text-amber-300">
                      <Bell className="h-5 w-5 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="badge b-AMARELO text-[10px]">Alarme de Disciplina FGV</span>
                        <span className="text-[11px] text-slate-400 font-mono">Salvo no LocalStorage</span>
                      </div>
                      <h2 className="text-base font-bold text-white mt-0.5">
                        Notificação Diária de Estudo & Alarme de Horário Fixo
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={testarNotificacaoManual}
                      className="rounded-full border border-amber-400 bg-amber-600/90 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-amber-500 transition shadow-sm inline-flex items-center gap-1.5"
                      title="Dispara o áudio e a janela de notificação para teste imediato"
                    >
                      <Volume2 className="h-3.5 w-3.5" /> Testar Notificação Agora
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Seletor de Horário & Presets */}
                  <div className="md:col-span-5 rounded-xl border border-[#455468] bg-[#344154] p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <label htmlFor="horario-estudo-input" className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" /> Horário Diário Programado:
                      </label>
                      <span className="font-mono text-sm font-bold text-white bg-[#1b232e] px-2.5 py-0.5 rounded-lg border border-[#455468]">
                        {notifHorario}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        id="horario-estudo-input"
                        type="time"
                        value={notifHorario}
                        onChange={e => handleNotifHorarioChange(e.target.value)}
                        className="rounded-xl border border-[#56677d] bg-[#1b232e] px-3 py-1.5 text-sm font-bold text-white focus:outline-none focus:border-amber-400 w-full"
                      />
                    </div>

                    {/* Presets Rápidos */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-slate-400">Sugestões:</span>
                      {['06:30', '08:00', '13:30', '19:00', '20:00', '21:30'].map(h => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => handleNotifHorarioChange(h)}
                          className={`rounded-lg px-2 py-0.5 font-mono text-[11px] font-semibold transition ${
                            notifHorario === h
                              ? 'bg-amber-500 text-slate-950 font-bold'
                              : 'bg-[#1b232e] text-slate-300 hover:bg-slate-700 border border-[#455468]'
                          }`}
                        >
                          {h}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mensagem e Configurações */}
                  <div className="md:col-span-7 rounded-xl border border-[#455468] bg-[#344154] p-4 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <label className="flex items-center gap-2 text-xs font-bold text-emerald-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifAtiva}
                          onChange={e => handleNotifAtivaChange(e.target.checked)}
                          className="h-4 w-4 rounded accent-emerald-500"
                        />
                        <span>Alarme Ativado Automaticamente</span>
                      </label>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-300">Frequência:</span>
                        <select
                          value={notifDias}
                          onChange={e => handleNotifDiasChange(e.target.value)}
                          className="rounded-lg border border-[#56677d] bg-[#1b232e] px-2 py-1 text-xs text-white"
                        >
                          <option value="todos">Todos os Dias</option>
                          <option value="seg-sex">Segunda a Sexta</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] text-slate-300 mb-1">
                        Mensagem de Incentivo / Meta Diária:
                      </div>
                      <input
                        type="text"
                        value={notifMensagem}
                        onChange={e => handleNotifMensagemChange(e.target.value)}
                        placeholder="Ex: Hora do Bloco Tributário FGV: 1 Peça + 5 Flashcards"
                        className="w-full rounded-xl border border-[#56677d] bg-[#1b232e] px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="text-[11px] text-slate-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full ${notifAtiva ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`}></span>
                        Status: <strong className="text-white">{notifAtiva ? `Ativo para hoje às ${notifHorario}` : 'Desativado'}</strong>
                      </span>
                      <span className="text-[10px] text-slate-400">Emite alarme sonoro Web Audio e voz</span>
                    </div>
                  </div>
                </div>

                {/* SELETOR DE TONS DO ALARME SONORO (WEB AUDIO API & LOCALSTORAGE) */}
                <div className="mt-4 pt-4 border-t border-[#455468]/70 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4 text-amber-400" />
                      <span className="text-xs font-bold text-white">
                        Tom do Alarme Sonoro (Web Audio API):
                      </span>
                      <span className="badge b-AMARELO text-[10px]">
                        Salvo no LocalStorage
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-300">
                      Tom ativo: <strong className="text-amber-300 font-semibold">{TONS_ALARME.find(t => t.id === tomAlarme)?.nome}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {TONS_ALARME.map((t) => {
                      const ativo = tomAlarme === t.id;
                      return (
                        <div
                          key={t.id}
                          onClick={() => handleTomAlarmeChange(t.id)}
                          className={`cursor-pointer rounded-xl border p-3.5 transition flex flex-col justify-between ${
                            ativo
                              ? 'border-amber-400 bg-amber-500/20 shadow-md ring-1 ring-amber-400/50'
                              : 'border-[#455468] bg-[#1b232e] hover:border-slate-400 hover:bg-[#222c3a]'
                          }`}
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                <span className="text-base">{t.icone}</span>
                                <span>{t.nome}</span>
                              </span>
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${t.corTag}`}
                              >
                                {ativo ? '✓ Ativo' : 'Selecionar'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                              {t.descricao}
                            </p>
                          </div>

                          <div className="mt-3 pt-2 border-t border-[#455468]/50 flex items-center justify-between">
                            <span className="text-[10px] text-slate-400 font-mono">
                              {t.id === 'padrao'
                                ? 'C5→C6 Triangular'
                                : t.id === 'suave'
                                ? 'Senoidal Zen'
                                : 'Sawtooth Staccato'}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                tocarAlarmeWebAudio(t.id);
                              }}
                              className="text-[10px] font-bold text-amber-300 hover:text-amber-100 bg-amber-600/40 hover:bg-amber-600/70 px-2.5 py-1 rounded-md border border-amber-500/50 inline-flex items-center gap-1 transition"
                              title={`Tocar prévia do tom ${t.nome}`}
                            >
                              <Volume2 className="h-3 w-3" /> Ouvir Tom
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* SEÇÃO INTEGRADA: LEMBRETE ESPECÍFICO DE EXPORTAÇÃO DA REDAÇÃO PARA WORD (FREQUÊNCIA SEMANAL) */}
                <div className="mt-5 pt-5 border-t border-[#455468] space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20 border border-blue-500 text-blue-400">
                        <Download className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="badge b-AZUL text-[10px]">Backup Semanal FGV</span>
                          <span className="text-[11px] text-slate-400 font-mono">Salvo no LocalStorage</span>
                        </div>
                        <h3 className="text-sm font-bold text-white mt-0.5">
                          Lembrete Específico: Exportação da Redação para Word (.doc)
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={testarLembreteWordManual}
                        className="rounded-full border border-blue-400 bg-blue-600/90 hover:bg-blue-500 px-3 py-1.5 text-xs font-bold text-white transition shadow-sm inline-flex items-center gap-1.5"
                        title="Simula o alarme e abre a notificação com botão direto de download do Word"
                      >
                        <Volume2 className="h-3.5 w-3.5" /> Testar Lembrete Word
                      </button>
                      <button
                        onClick={() => exportarRedacaoNoWord(textoRedacao)}
                        className="rounded-full border border-slate-600 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 transition inline-flex items-center gap-1.5"
                        title="Baixar redação no Word imediatamente"
                      >
                        <FileText className="h-3.5 w-3.5 text-sky-400" /> Baixar Word (.doc) Agora
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Seletor de Frequência Semanal e Horário */}
                    <div className="md:col-span-5 rounded-xl border border-[#455468] bg-[#344154] p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" /> Frequência Semanal:
                        </label>
                        <span className="font-mono text-xs font-bold text-white bg-[#1b232e] px-2 py-0.5 rounded-lg border border-[#455468]">
                          {notifWordDia === '0' ? 'Domingo' : notifWordDia === '1' ? 'Segunda-feira' : notifWordDia === '2' ? 'Terça-feira' : notifWordDia === '3' ? 'Quarta-feira' : notifWordDia === '4' ? 'Quinta-feira' : notifWordDia === '5' ? 'Sexta-feira' : 'Sábado'} • {notifWordHora}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">Dia da Semana:</label>
                          <select
                            value={notifWordDia}
                            onChange={e => handleNotifWordDiaChange(e.target.value)}
                            className="w-full rounded-xl border border-[#56677d] bg-[#1b232e] px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-blue-400"
                          >
                            <option value="5">Sexta-feira (Recomendado)</option>
                            <option value="6">Sábado</option>
                            <option value="0">Domingo</option>
                            <option value="1">Segunda-feira</option>
                            <option value="2">Terça-feira</option>
                            <option value="3">Quarta-feira</option>
                            <option value="4">Quinta-feira</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">Horário (ex: Noite):</label>
                          <input
                            type="time"
                            value={notifWordHora}
                            onChange={e => handleNotifWordHoraChange(e.target.value)}
                            className="w-full rounded-xl border border-[#56677d] bg-[#1b232e] px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-blue-400"
                          />
                        </div>
                      </div>

                      {/* Presets Rápidos de Frequência */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        <span className="text-[10px] text-slate-400">Sugestões:</span>
                        <button
                          type="button"
                          onClick={() => {
                            handleNotifWordDiaChange('5');
                            handleNotifWordHoraChange('20:00');
                          }}
                          className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold transition ${
                            notifWordDia === '5' && notifWordHora === '20:00'
                              ? 'bg-blue-600 text-white font-bold'
                              : 'bg-[#1b232e] text-slate-300 hover:bg-slate-700 border border-[#455468]'
                          }`}
                        >
                          Sexta 20:00 (Noite)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            handleNotifWordDiaChange('5');
                            handleNotifWordHoraChange('22:00');
                          }}
                          className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold transition ${
                            notifWordDia === '5' && notifWordHora === '22:00'
                              ? 'bg-blue-600 text-white font-bold'
                              : 'bg-[#1b232e] text-slate-300 hover:bg-slate-700 border border-[#455468]'
                          }`}
                        >
                          Sexta 22:00
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            handleNotifWordDiaChange('0');
                            handleNotifWordHoraChange('19:00');
                          }}
                          className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold transition ${
                            notifWordDia === '0' && notifWordHora === '19:00'
                              ? 'bg-blue-600 text-white font-bold'
                              : 'bg-[#1b232e] text-slate-300 hover:bg-slate-700 border border-[#455468]'
                          }`}
                        >
                          Domingo 19:00
                        </button>
                      </div>
                    </div>

                    {/* Checkbox de Ativação e Mensagem Customizada */}
                    <div className="md:col-span-7 rounded-xl border border-[#455468] bg-[#344154] p-4 space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <label className="flex items-center gap-2 text-xs font-bold text-blue-400 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifWordAtivo}
                            onChange={e => handleNotifWordAtivoChange(e.target.checked)}
                            className="h-4 w-4 rounded accent-blue-500"
                          />
                          <span>Lembrete Semanal Ativado Automaticamente</span>
                        </label>

                        <span className="text-[11px] text-slate-400">
                          {linhasCount} linhas ativas no editor
                        </span>
                      </div>

                      <div>
                        <div className="text-[11px] text-slate-300 mb-1">
                          Mensagem do Alerta de Exportação Word:
                        </div>
                        <input
                          type="text"
                          value={notifWordMsg}
                          onChange={e => handleNotifWordMsgChange(e.target.value)}
                          placeholder="Ex: Hora de exportar sua peça prática para o Word (.doc) e manter seu backup das 150 linhas em dia!"
                          className="w-full rounded-xl border border-[#56677d] bg-[#1b232e] px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-400"
                        />
                      </div>

                      <div className="text-[11px] text-slate-300 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <span className={`h-2 w-2 rounded-full ${notifWordAtivo ? 'bg-blue-400 animate-ping' : 'bg-slate-500'}`}></span>
                          Programação: <strong className="text-white">{notifWordAtivo ? `Toda(o) ${notifWordDia === '0' ? 'Domingo' : notifWordDia === '1' ? 'Segunda-feira' : notifWordDia === '2' ? 'Terça-feira' : notifWordDia === '3' ? 'Quarta-feira' : notifWordDia === '4' ? 'Quinta-feira' : notifWordDia === '5' ? 'Sexta-feira' : 'Sábado'} às ${notifWordHora}` : 'Desativado'}</strong>
                        </span>
                        <span className="text-[10px] text-slate-400">Gera arquivo .doc oficial</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CENTRAL DE INTEGRAÇÃO TOTAL DO SISTEMA */}
              <div className="rounded-2xl border border-sky-500/50 bg-[#2b3646] p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="badge b-AZUL text-[10px]">Ecossistema Conectado</span>
                    <h3 className="text-sm font-bold text-white">Hub de Acesso e Integração Total Entre as Abas</h3>
                  </div>
                  <button
                    onClick={() => setBuscaGlobalAberta(true)}
                    className="text-xs font-semibold text-sky-300 hover:text-sky-200 inline-flex items-center gap-1"
                  >
                    Abrir Busca Geral (Ctrl+K) <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div
                    onClick={() => setActiveTab('cronograma')}
                    className="rounded-xl border border-[#455468] bg-[#344154] p-3 cursor-pointer hover:border-emerald-400 hover:bg-[#3d4d63] transition group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-emerald-400">Cronograma</span>
                      <Calendar className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="font-mono text-base font-bold text-white">
                      {tarefasConcluidas.length} / {totalTarefas}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 group-hover:text-emerald-300 transition">
                      {Math.round((tarefasConcluidas.length / totalTarefas) * 100)}% das metas concluídas →
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveTab('simulador')}
                    className="rounded-xl border border-[#455468] bg-[#344154] p-3 cursor-pointer hover:border-sky-400 hover:bg-[#3d4d63] transition group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-sky-400">Simulador 150L</span>
                      <FileText className="h-4 w-4 text-sky-400" />
                    </div>
                    <div className="font-mono text-base font-bold text-white">
                      {linhasCount} <span className="text-xs font-normal text-slate-400">linhas</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 group-hover:text-sky-300 transition">
                      {palavrasCount} palavras redigidas →
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveTab('vademecum')}
                    className="rounded-xl border border-[#455468] bg-[#344154] p-3 cursor-pointer hover:border-amber-400 hover:bg-[#3d4d63] transition group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-amber-400">Vade Mecum</span>
                      <Highlighter className="h-4 w-4 text-amber-400" />
                    </div>
                    <div className="font-mono text-base font-bold text-white">
                      {vadeMarcados.length} / {VADE_DATA.length}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 group-hover:text-amber-300 transition">
                      Artigos e súmulas marcados →
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveTab('flashcards')}
                    className="rounded-xl border border-[#455468] bg-[#344154] p-3 cursor-pointer hover:border-pink-400 hover:bg-[#3d4d63] transition group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-pink-400">Flashcards</span>
                      <Sparkles className="h-4 w-4 text-pink-400" />
                    </div>
                    <div className="font-mono text-base font-bold text-white">
                      {FLASHCARDS_DATA.length} <span className="text-xs font-normal text-slate-400">cartões</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 group-hover:text-pink-300 transition">
                      Repetição espaçada com voz →
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-6 space-y-5">
                  <div className="rounded-2xl border border-[#455468] bg-[#2b3646] p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="badge b-AMARELO">Calendário Oficial FGV</span>
                        <h2 className="text-base font-semibold text-white mt-1">
                          Radar da Repescagem & Prova
                        </h2>
                      </div>
                      <button
                        onClick={() => testarAlarmeSonoro(tomAlarme)}
                        className="rounded-full border border-[#56677d] bg-[#3b495e] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-600 transition inline-flex items-center gap-1.5"
                      >
                        <Volume2 className="h-3.5 w-3.5 text-amber-300" /> Testar Som
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Repescagem Card */}
                      <div className="rounded-xl border border-amber-500/60 bg-[#344154] p-4">
                        <div className="flex items-center justify-between mb-2">
                          <strong className="text-xs text-amber-300 font-bold">Inscrição Repescagem</strong>
                          <span className="badge b-AMARELO font-mono">
                            {repescagemPaga ? 'Inscrito ✓' : diasRepescagem >= 0 ? `Faltam ${diasRepescagem} dias` : 'Verificar'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2 mt-3 text-xs text-slate-300">
                          <span>Data Alarme:</span>
                          <input
                            type="date"
                            value={dataRepescagem}
                            onChange={e => handleRepescagemDateChange(e.target.value)}
                            className="rounded-lg border border-[#56677d] bg-[#1b232e] px-2 py-1 text-xs text-white"
                          />
                        </div>
                        <label className="flex items-center gap-2.5 mt-3 text-xs font-semibold text-emerald-400 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={repescagemPaga}
                            onChange={e => handleRepescagemPagaChange(e.target.checked)}
                            className="h-4 w-4 rounded accent-emerald-500"
                          />
                          <span>Inscrito e Boleto Pago</span>
                        </label>
                      </div>

                      {/* Prova 5h Card */}
                      <div className="rounded-xl border border-sky-500/60 bg-[#344154] p-4">
                        <div className="flex items-center justify-between mb-2">
                          <strong className="text-xs text-sky-300 font-bold">Dia da Prova (5h)</strong>
                          <span className="badge b-AZUL font-mono">
                            {diasProva >= 0 ? `Faltam ${diasProva} dias` : 'Hoje'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2 mt-3 text-xs text-slate-300">
                          <span>Data da Prova:</span>
                          <input
                            type="date"
                            value={dataProva}
                            onChange={e => handleProvaDateChange(e.target.value)}
                            className="rounded-lg border border-[#56677d] bg-[#1b232e] px-2 py-1 text-xs text-white"
                          />
                        </div>
                        <p className="mt-3 text-[11px] text-slate-400">
                          Horário oficial FGV: 13h00 às 18h00 (5 horas de prova).
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quick actions panel */}
                  <div className="rounded-2xl border border-[#455468] bg-[#2b3646] p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-white mb-3">Atalhos de Alta Produtividade</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <button
                        onClick={() => setActiveTab('simulador')}
                        className="rounded-xl border border-[#455468] bg-[#344154] p-3 text-left hover:border-sky-400 hover:bg-[#3d4d63] transition"
                      >
                        <FileText className="h-5 w-5 text-sky-400 mb-2" />
                        <div className="text-xs font-bold text-white">Simulador 150L</div>
                        <div className="text-[11px] text-slate-400">Treinar folha FGV</div>
                      </button>
                      <button
                        onClick={() => setActiveTab('pecas')}
                        className="rounded-xl border border-[#455468] bg-[#344154] p-3 text-left hover:border-emerald-400 hover:bg-[#3d4d63] transition"
                      >
                        <Compass className="h-5 w-5 text-emerald-400 mb-2" />
                        <div className="text-xs font-bold text-white">Peçômetro</div>
                        <div className="text-[11px] text-slate-400">Descobrir a peça</div>
                      </button>
                      <button
                        onClick={() => setActiveTab('flashcards')}
                        className="rounded-xl border border-[#455468] bg-[#344154] p-3 text-left hover:border-amber-400 hover:bg-[#3d4d63] transition"
                      >
                        <Sparkles className="h-5 w-5 text-amber-400 mb-2" />
                        <div className="text-xs font-bold text-white">Flashcards</div>
                        <div className="text-[11px] text-slate-400">Repetição espaçada</div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Ranking Histórico de Peças */}
                <div className="lg:col-span-6">
                  <div className="rounded-2xl border border-[#455468] bg-[#2b3646] p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-white">Ranking Histórico de Peças FGV</h3>
                      <span className="text-[11px] text-slate-400">Exames Unificados OAB</span>
                    </div>
                    <div className="flex flex-col gap-2.5 text-xs">
                      <div className="flex items-center justify-between rounded-xl border border-[#455468] bg-[#344154] p-3">
                        <span>1º <strong>Mandado de Segurança</strong> (IV, VII, IX, X, XI, XIV, XIX, XXIX, 40º, 45º)</span>
                        <span className="badge b-VERDE">10 Vezes</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl border border-[#455468] bg-[#344154] p-3">
                        <span>2º <strong>Recurso de Apelação</strong> (X, XVI, XX, XXV, XXX, XXXII, 35º, 41º, 43º)</span>
                        <span className="badge b-VERDE">9 Vezes</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl border border-[#455468] bg-[#344154] p-3">
                        <span>3º <strong>Agravo de Instrumento</strong> (VIII, X, XII, XVII, XXVI, XXXIII, 38º)</span>
                        <span className="badge b-AZUL">7 Vezes</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl border border-[#455468] bg-[#344154] p-3">
                        <span>4º <strong>Ação Anulatória</strong> (IV, IX, XXX, XXXI, XXXIV, 39º, 42º)</span>
                        <span className="badge b-AMARELO">7 Vezes</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl border border-[#455468] bg-[#344154] p-3">
                        <span>5º <strong>Repetição de Indébito</strong> (VI, X, XXI, XXIII, XXIV, 37º)</span>
                        <span className="badge b-AMARELO">6 Vezes</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl border border-[#455468] bg-[#344154] p-3">
                        <span>6º <strong>Embargos e Exceção de Pré-Executividade</strong> (36º, 44º)</span>
                        <span className="badge b-ROSA">Execução (4x)</span>
                      </div>
                    </div>
                  </div>
                </div>
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
              <div className="rounded-2xl border border-[#455468] bg-[#2b3646] p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1 min-w-[260px]">
                  <select
                    value={casoIndex}
                    onChange={e => setCasoIndex(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#56677d] bg-[#1b232e] px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-sky-400"
                  >
                    {CASOS_SIMULADO.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.titulo}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 rounded-xl border border-sky-400/60 bg-[#344154] px-3.5 py-1.5">
                    <span className="text-[11px] text-slate-300">Relógio 5h:</span>
                    <strong className="font-mono text-sm font-bold text-sky-300">
                      {format5hTimer(prova5hSecs)}
                    </strong>
                    <button
                      onClick={() => {
                        if (!prova5hRunning) tocarAlarmeWebAudio();
                        setProva5hRunning(!prova5hRunning);
                      }}
                      className="rounded-full bg-sky-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-sky-500 transition"
                    >
                      {prova5hRunning ? 'Pausar 5h' : prova5hSecs < 5 * 3600 ? 'Retomar 5h' : 'Iniciar 5h'}
                    </button>
                    <button
                      onClick={() => {
                        setProva5hRunning(false);
                        setProva5hSecs(5 * 3600);
                      }}
                      className="rounded-full border border-slate-600 px-2 py-1 text-[11px] text-slate-300 hover:bg-slate-600"
                      title="Reiniciar 5h"
                    >
                      <RotateCcw className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Split layout: Enunciado & Folha */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Left: Enunciado Oficial */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="rounded-2xl border border-[#455468] bg-[#2b3646] p-4 shadow-sm">
                    <span className="badge b-AMARELO mb-2">Enunciado Oficial FGV</span>
                    <h3 className="text-xs font-bold text-white mb-2">
                      {CASOS_SIMULADO[casoIndex].titulo}
                    </h3>
                    <p className="text-xs leading-relaxed text-slate-200">
                      {CASOS_SIMULADO[casoIndex].enunciado}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#455468] bg-[#2b3646] p-4 shadow-sm">
                    <h4 className="text-xs font-bold text-sky-300 mb-2">Instruções da Banca FGV</h4>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-300 leading-relaxed">
                      <li>Use exclusivamente caneta esferográfica azul ou preta.</li>
                      <li>Máximo de 150 linhas distribuídas em 5 páginas pautadas.</li>
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

                {/* Right: Folha Padrão 150 Linhas */}
                <div className="lg:col-span-8 space-y-3">
                  <div className="rounded-2xl border border-[#455468] bg-[#2b3646] p-4 shadow-sm">
                    {/* Page Switcher & Mode Toggles */}
                    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map(p => (
                          <button
                            key={p}
                            onClick={() => mudarPaginaFolha(p)}
                            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                              paginaFolha === p
                                ? 'bg-sky-600 text-white border border-sky-400'
                                : 'border border-[#56677d] bg-[#3b495e] text-slate-200 hover:bg-slate-600'
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
                          className={`rounded-full px-3 py-1 text-xs font-semibold transition inline-flex items-center gap-1.5 shadow-sm cursor-pointer ${
                            destaqueSintaxe
                              ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white border border-sky-400'
                              : 'border border-[#56677d] bg-[#3b495e] text-slate-200 hover:bg-slate-600'
                          }`}
                          title="Alternar modo de destaque de sintaxe jurídica FGV no texto da folha"
                        >
                          <Sparkles className={`h-3.5 w-3.5 ${destaqueSintaxe ? 'text-amber-200 animate-spin' : 'text-slate-400'}`} />
                          <span>{destaqueSintaxe ? 'Destaque: Ativado' : 'Destaque de Sintaxe'}</span>
                        </button>

                        <button
                          onClick={() => setModoRascunho(!modoRascunho)}
                          className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                            modoRascunho
                              ? 'bg-amber-600 text-white border border-amber-400'
                              : 'border border-[#56677d] bg-[#3b495e] text-slate-200 hover:bg-slate-600'
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
                              title={`${sintaxeResultado.stats.peca} peças, ${sintaxeResultado.stats.artigo} artigos, ${sintaxeResultado.stats.tributo} tributos, ${sintaxeResultado.stats.tese} teses`}
                            >
                              ✨ {sintaxeResultado.stats.total} termos destacados
                            </span>
                          )}
                          {totalLinhasSemana >= 150 && (
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
                          )}
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

                        {/* Editor com Camada Sobreposta (Overlay) de Destaque de Sintaxe */}
                        <div className="relative flex-1 min-h-[4200px] h-[4200px] flex">
                          {destaqueSintaxe && (
                            <SimuladorSintaxeOverlay
                              text={textoRedacao}
                              activeCategories={sintaxeCategorias}
                              overlayRef={syntaxOverlayRef}
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
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setActiveTab('cronograma');
                            mostrarToast('Finalizando simulado! Avaliando no espelho oficial da banca FGV...');
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

      {/* MODAL DE NOTIFICAÇÃO DIÁRIA DE ESTUDO & LEMBRETE WORD */}
      <NotificacaoEstudoModal
        aberta={notifModalAberta}
        horario={notifTipoModal === 'word' ? notifWordHora : notifHorario}
        mensagem={notifTipoModal === 'word' ? notifWordMsg : notifMensagem}
        tipo={notifTipoModal}
        onFechar={() => setNotifModalAberta(false)}
        onIniciarFoco={() => {
          if (!pomodoroRunning) tocarAlarmeWebAudio();
          setPomodoroRunning(true);
          mostrarToast('Bloco de foco de 50 minutos iniciado!');
        }}
        onIrParaSimulador={() => setActiveTab('simulador')}
        onIrParaCronograma={() => setActiveTab('cronograma')}
        onIrParaFlashcards={() => setActiveTab('flashcards')}
        onExportarWord={() => exportarRedacaoNoWord(textoRedacao)}
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
