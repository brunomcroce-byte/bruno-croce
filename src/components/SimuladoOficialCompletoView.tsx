import React, { useState, useEffect, useMemo } from 'react';
import {
  SIMULADOS_SEMANAIS_COMPLETOS,
  SimuladoSemanalCompleto,
  QuestaoDiscursivaFGV
} from '../data/simuladoSemanalCompletoData';
import { SimuladoFGV } from '../data/simuladosFgvData';
import { SafeStorage } from '../utils/storage';
import { dispararMegaConfetes150L, dispararConfetesSuaves } from '../utils/confetti';
import { tocarAlarmeWebAudio } from '../utils/audio';
import { exportarCadernoSimuladoCompletoPdf } from '../utils/exportPdf';
import {
  Scale,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Award,
  BookOpen,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  FileText,
  Trophy,
  ArrowRight,
  Check,
  Download,
  Lock,
  Unlock,
  ShieldAlert,
  Compass,
  AlertCircle,
  FileCheck2,
  Target
} from 'lucide-react';

interface SimuladoOficialCompletoViewProps {
  textoRedacaoPrincipal: string;
  onCarregarEsqueletoNaFolha: (simulado: SimuladoFGV) => void;
  onNavegarParaSimulador: () => void;
  mostrarToast: (msg: string) => void;
}

export interface ResultadoSimuladoIntegral {
  simuladoId: number;
  data: string;
  notaPeca: number; // 0.00 a 5.00
  notaQ1: number; // 0.00 a 1.25
  notaQ2: number; // 0.00 a 1.25
  notaQ3: number; // 0.00 a 1.25
  notaQ4: number; // 0.00 a 1.25
  notaTotal: number; // 0.00 a 10.00
  aprovado: boolean; // notaTotal >= 6.00
  linhasPeca: number;
  criteriosPeca: {
    id: string;
    item: string;
    pontosObtidos: number;
    pontosMax: number;
    status: 'integral' | 'parcial' | 'ausente';
    comentario: string;
  }[];
  criteriosQuestoes: {
    questaoNum: number;
    item: 'A' | 'B';
    pontosObtidos: number;
    pontosMax: number;
    status: 'integral' | 'parcial' | 'ausente';
    descricao: string;
  }[];
}

interface OpcaoPecaGate {
  id: string;
  nome: string;
  grupo: 'Inicial' | 'Recursal' | 'Defesa na Execução';
  descricaoCurta: string;
}

const OPCOES_PECAS_FGV: OpcaoPecaGate[] = [
  {
    id: 'MS_REPRESSIVO',
    nome: 'Mandado de Segurança Repressivo (c/ pedido liminar)',
    grupo: 'Inicial',
    descricaoCurta: 'Ato coator já praticado, prova documental pré-constituída, até 120 dias.'
  },
  {
    id: 'MS_PREVENTIVO',
    nome: 'Mandado de Segurança Preventivo',
    grupo: 'Inicial',
    descricaoCurta: 'Justo receio de ato coator iminente contra direito líquido e certo.'
  },
  {
    id: 'ANULATORIA',
    nome: 'Ação Anulatória de Débito Fiscal (c/ tutela de urgência)',
    grupo: 'Inicial',
    descricaoCurta: 'Lançamento efetuado, rito comum, admite dilação probatória ou perícia contábil.'
  },
  {
    id: 'DECLARATORIA',
    nome: 'Ação Declaratória de Inexistência de Relação Jurídico-Tributária',
    grupo: 'Inicial',
    descricaoCurta: 'Antes do lançamento fiscal, visa afastar a incidência futura do tributo.'
  },
  {
    id: 'REPETICAO',
    nome: 'Ação de Repetição de Indébito Tributário',
    grupo: 'Inicial',
    descricaoCurta: 'Tributo indevido já recolhido/pago; busca restituição com juros e SELIC.'
  },
  {
    id: 'EMBARGOS',
    nome: 'Embargos à Execução Fiscal (c/ efeito suspensivo)',
    grupo: 'Defesa na Execução',
    descricaoCurta: 'Execução fiscal ajuizada e JUÍZO INTEGRALMENTE GARANTIDO (penhora, depósito ou fiança).'
  },
  {
    id: 'EPE',
    nome: 'Exceção de Pré-Executividade (EPE)',
    grupo: 'Defesa na Execução',
    descricaoCurta: 'Matéria de ordem pública (prescrição, decadência, imunidade) sem dilação e sem garantia.'
  },
  {
    id: 'CONSIGNACAO',
    nome: 'Ação de Consignação em Pagamento',
    grupo: 'Inicial',
    descricaoCurta: 'Dúvida sobre a quem pagar (bitributação) ou recusa injustificada do Fisco.'
  },
  {
    id: 'APELACAO',
    nome: 'Recurso de Apelação',
    grupo: 'Recursal',
    descricaoCurta: 'Interposto contra SENTENÇA terminativa ou definitiva de juiz de 1º grau (15 dias).'
  },
  {
    id: 'AGRAVO_INST',
    nome: 'Agravo de Instrumento',
    grupo: 'Recursal',
    descricaoCurta: 'Contra decisão interlocutória de 1º grau (indeferimento de liminar/tutela ou penhora).'
  }
];

export const SimuladoOficialCompletoView: React.FC<SimuladoOficialCompletoViewProps> = ({
  textoRedacaoPrincipal,
  onCarregarEsqueletoNaFolha,
  onNavegarParaSimulador,
  mostrarToast
}) => {
  // Simulado ativo (inicia no Simulado 01 - Exame XLI 41º)
  const [simuladoAtivoId, setSimuladoAtivoId] = useState<number>(() => {
    const salvo = SafeStorage.get('tributa_simulado_ativo_completo_id', '1');
    return Number(salvo) || 1;
  });

  const simulado: SimuladoSemanalCompleto = useMemo(() => {
    return (
      SIMULADOS_SEMANAIS_COMPLETOS.find(s => s.id === simuladoAtivoId) ||
      SIMULADOS_SEMANAIS_COMPLETOS[0]
    );
  }, [simuladoAtivoId]);

  // Aba / Etapa da Trilha Oficial FGV:
  // 'gate' (Descobrimento da Peça) -> 'peca' (150L) -> 'q1' -> 'q2' -> 'q3' -> 'q4' -> 'resultado'
  const [etapaTrilha, setEtapaTrilha] = useState<'gate' | 'peca' | 'q1' | 'q2' | 'q3' | 'q4' | 'resultado'>('peca');

  // Estado do Gatilho Obrigatório de Descobrimento da Peça
  const [gateDesbloqueado, setGateDesbloqueado] = useState<boolean>(() => {
    return SafeStorage.get(`tributa_simulado_gate_unlocked_${simuladoAtivoId}`, 'false') === 'true';
  });
  const [opcaoPecaEscolhida, setOpcaoPecaEscolhida] = useState<string | null>(null);
  const [erroGateFeedback, setErroGateFeedback] = useState<{
    tituloErro: string;
    explicacao: string;
    ondeErrou: string;
    bussolaOrientacao: string[];
  } | null>(null);

  // Redação da Peça local
  const [textoPeca, setTextoPeca] = useState<string>(() => {
    const salvo = SafeStorage.get(`tributa_simulado_comp_${simuladoAtivoId}_peca`, '');
    return salvo || textoRedacaoPrincipal || simulado.peca.esqueleto;
  });

  // Respostas das 4 questões discursivas
  const [respostasQuestoes, setRespostasQuestoes] = useState<{
    q1: string;
    q2: string;
    q3: string;
    q4: string;
  }>(() => {
    return {
      q1: SafeStorage.get(`tributa_simulado_comp_${simuladoAtivoId}_q1`, ''),
      q2: SafeStorage.get(`tributa_simulado_comp_${simuladoAtivoId}_q2`, ''),
      q3: SafeStorage.get(`tributa_simulado_comp_${simuladoAtivoId}_q3`, ''),
      q4: SafeStorage.get(`tributa_simulado_comp_${simuladoAtivoId}_q4`, '')
    };
  });

  // Temporizador oficial de 5 horas de prova (300 minutos)
  const [tempoSegundos, setTempoSegundos] = useState<number>(() => {
    const salvo = SafeStorage.get(`tributa_simulado_comp_${simuladoAtivoId}_tempo`, '18000');
    return Number(salvo) || 300 * 60;
  });
  const [timerAtivo, setTimerAtivo] = useState(false);

  // Efeito do timer de 5 horas
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerAtivo && tempoSegundos > 0) {
      interval = setInterval(() => {
        setTempoSegundos(prev => {
          if (prev <= 1) {
            setTimerAtivo(false);
            tocarAlarmeWebAudio('padrao');
            mostrarToast('⏰ TEMPO ESGOTADO! As 5 horas oficiais da prova FGV encerraram.');
            return 0;
          }
          if (prev === 3600) {
            mostrarToast('⚠️ ATENÇÃO: Falta exatamente 1 hora para o término da prova!');
            tocarAlarmeWebAudio('suave');
          }
          if (prev === 900) {
            mostrarToast('🚨 ÚLTIMOS 15 MINUTOS! Conclua o preenchimento das folhas de resposta.');
            tocarAlarmeWebAudio('suave');
          }
          SafeStorage.set(`tributa_simulado_comp_${simuladoAtivoId}_tempo`, String(prev - 1));
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerAtivo, tempoSegundos, simuladoAtivoId, mostrarToast]);

  // Resultado de correção integral da prova
  const [resultadoIntegral, setResultadoIntegral] = useState<ResultadoSimuladoIntegral | null>(() => {
    try {
      const raw = SafeStorage.get(`tributa_simulado_comp_result_${simuladoAtivoId}`, '');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [modalGabaritoAberto, setModalGabaritoAberto] = useState(false);

  // Troca de simulado oficial
  const selecionarSimulado = (id: number) => {
    setSimuladoAtivoId(id);
    SafeStorage.set('tributa_simulado_ativo_completo_id', String(id));
    const novoSimulado = SIMULADOS_SEMANAIS_COMPLETOS.find(s => s.id === id) || SIMULADOS_SEMANAIS_COMPLETOS[0];
    const pecaSalva = SafeStorage.get(`tributa_simulado_comp_${id}_peca`, '') || novoSimulado.peca.esqueleto;
    setTextoPeca(pecaSalva);
    setRespostasQuestoes({
      q1: SafeStorage.get(`tributa_simulado_comp_${id}_q1`, ''),
      q2: SafeStorage.get(`tributa_simulado_comp_${id}_q2`, ''),
      q3: SafeStorage.get(`tributa_simulado_comp_${id}_q3`, ''),
      q4: SafeStorage.get(`tributa_simulado_comp_${id}_q4`, '')
    });
    const tempoSalvo = Number(SafeStorage.get(`tributa_simulado_comp_${id}_tempo`, '18000')) || 300 * 60;
    setTempoSegundos(tempoSalvo);
    setTimerAtivo(false);

    // Carrega status do gate para esse simulado
    const gateStatus = SafeStorage.get(`tributa_simulado_gate_unlocked_${id}`, 'false') === 'true';
    setGateDesbloqueado(gateStatus);
    setOpcaoPecaEscolhida(null);
    setErroGateFeedback(null);

    try {
      const raw = SafeStorage.get(`tributa_simulado_comp_result_${id}`, '');
      setResultadoIntegral(raw ? JSON.parse(raw) : null);
    } catch {
      setResultadoIntegral(null);
    }

    setEtapaTrilha(gateStatus ? 'peca' : 'gate');
    mostrarToast(`Caderno Oficial: ${novoSimulado.titulo} carregado!`);
  };

  // Salva redação da Peça
  const handleAtualizarPeca = (val: string) => {
    setTextoPeca(val);
    SafeStorage.set(`tributa_simulado_comp_${simuladoAtivoId}_peca`, val);
  };

  // Salva resposta de uma questão específica
  const handleAtualizarQuestao = (chave: 'q1' | 'q2' | 'q3' | 'q4', val: string) => {
    setRespostasQuestoes(prev => {
      const updated = { ...prev, [chave]: val };
      SafeStorage.set(`tributa_simulado_comp_${simuladoAtivoId}_${chave}`, val);
      return updated;
    });
  };

  // Formatação de cronômetro
  const formatTimer = (totalSegundos: number) => {
    const horas = Math.floor(totalSegundos / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    const segundos = totalSegundos % 60;
    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
  };

  // Contagem de linhas
  const linhasPecaCount = useMemo(() => (textoPeca ? textoPeca.split('\n').length : 0), [textoPeca]);
  const linhasQ1Count = useMemo(() => (respostasQuestoes.q1 ? respostasQuestoes.q1.split('\n').length : 0), [respostasQuestoes.q1]);
  const linhasQ2Count = useMemo(() => (respostasQuestoes.q2 ? respostasQuestoes.q2.split('\n').length : 0), [respostasQuestoes.q2]);
  const linhasQ3Count = useMemo(() => (respostasQuestoes.q3 ? respostasQuestoes.q3.split('\n').length : 0), [respostasQuestoes.q3]);
  const linhasQ4Count = useMemo(() => (respostasQuestoes.q4 ? respostasQuestoes.q4.split('\n').length : 0), [respostasQuestoes.q4]);

  // Exportar caderno completo em PDF
  const handleExportarCadernoPdf = () => {
    exportarCadernoSimuladoCompletoPdf(simulado, {
      peca: textoPeca,
      q1: respostasQuestoes.q1,
      q2: respostasQuestoes.q2,
      q3: respostasQuestoes.q3,
      q4: respostasQuestoes.q4
    });
    tocarAlarmeWebAudio('suave');
    mostrarToast('📄 Caderno Oficial FGV gerado em PDF com sucesso para impressão!');
  };

  // Validação do Gate de Identificação da Peça
  const handleValidarIdentificacaoPeca = (opcaoId: string) => {
    setOpcaoPecaEscolhida(opcaoId);
    const pecaCorretaTexto = simulado.peca.peca.toLowerCase();

    // Regras de correspondência com a peça correta
    let acertou = false;

    if (pecaCorretaTexto.includes('mandado de segurança') || pecaCorretaTexto.includes('ms')) {
      if (pecaCorretaTexto.includes('preventivo')) {
        acertou = opcaoId === 'MS_PREVENTIVO';
      } else {
        acertou = opcaoId === 'MS_REPRESSIVO' || opcaoId === 'MS_PREVENTIVO';
      }
    } else if (pecaCorretaTexto.includes('anulatória') || pecaCorretaTexto.includes('anulatoria')) {
      acertou = opcaoId === 'ANULATORIA';
    } else if (pecaCorretaTexto.includes('embargos')) {
      acertou = opcaoId === 'EMBARGOS';
    } else if (pecaCorretaTexto.includes('repetição') || pecaCorretaTexto.includes('repeticao')) {
      acertou = opcaoId === 'REPETICAO';
    } else if (pecaCorretaTexto.includes('declaratória') || pecaCorretaTexto.includes('declaratoria')) {
      acertou = opcaoId === 'DECLARATORIA';
    } else if (pecaCorretaTexto.includes('apelação') || pecaCorretaTexto.includes('apelacao')) {
      acertou = opcaoId === 'APELACAO';
    } else if (pecaCorretaTexto.includes('agravo')) {
      acertou = opcaoId === 'AGRAVO_INST';
    } else if (pecaCorretaTexto.includes('consignação') || pecaCorretaTexto.includes('consignacao')) {
      acertou = opcaoId === 'CONSIGNACAO';
    } else if (pecaCorretaTexto.includes('exceção') || pecaCorretaTexto.includes('epe')) {
      acertou = opcaoId === 'EPE';
    }

    if (acertou) {
      setGateDesbloqueado(true);
      SafeStorage.set(`tributa_simulado_gate_unlocked_${simuladoAtivoId}`, 'true');
      setErroGateFeedback(null);
      dispararConfetesSuaves({ count: 70, originY: 0.35 });
      tocarAlarmeWebAudio('suave');
      mostrarToast(`🎉 ACERTOU! Peça cabível confirmada: ${simulado.peca.peca}! Trilha e Folha 150L liberadas.`);
      setEtapaTrilha('peca');
    } else {
      tocarAlarmeWebAudio('padrao');
      const opcEscolhidaObj = OPCOES_PECAS_FGV.find(o => o.id === opcaoId);

      // Gerador de diagnóstico pedagógico específico do erro
      let ondeErrouTexto = 'Momento processual inadequado para a peça indicada.';
      let explicacaoTexto = '';
      const bussola: string[] = [
        '1. Momento Processual: Há ato administrativo já praticado, processo judicial em curso ou sentença?',
        '2. Exigência Probatória: Há prova documental pré-constituída ou há necessidade de perícia técnica contábil?',
        '3. Objeto da Tutela: Deseja-se anular cobrança, suspender exigibilidade, liberar bens penhorados ou reaver valores pagos?'
      ];

      if (opcaoId === 'MS_REPRESSIVO' || opcaoId === 'MS_PREVENTIVO') {
        ondeErrouTexto = 'O Mandado de Segurança não é a peça cabível neste caso.';
        explicacaoTexto =
          'O Mandado de Segurança exige prova documental PRÉ-CONSTITUÍDA, autoridade coatora e respeito ao prazo decadencial de 120 dias (Art. 23 da Lei nº 12.016/09). Se o caso envolver necessidade de dilação probatória pericial, ou se a cobrança já estiver em execução fiscal garantida, o MS é terminantemente inviável!';
      } else if (opcaoId === 'APELACAO') {
        ondeErrouTexto = 'Não cabe Apelação pois inexistiu sentença de 1º grau nos fatos.';
        explicacaoTexto =
          'O Recurso de Apelação (Art. 1.009 do CPC) é cabível estritamente contra SENTENÇA terminativa ou definitiva proferida por juiz de primeiro grau. Na situação descrita, estamos diante de uma petição inicial ou incidente, e não de impugnação de sentença!';
      } else if (opcaoId === 'AGRAVO_INST') {
        ondeErrouTexto = 'Não cabe Agravo de Instrumento pois não há decisão interlocutória de urgência proferida.';
        explicacaoTexto =
          'O Agravo de Instrumento (Art. 1.015 do CPC) desafia decisões interlocutórias do juiz (ex.: indeferimento de liminar ou tutela provisória). Se não houve decisão interlocutória prévia nos autos, o agravo é incabível.';
      } else if (opcaoId === 'EMBARGOS') {
        ondeErrouTexto = 'Não cabem Embargos à Execução se não houver execução fiscal garantida.';
        explicacaoTexto =
          'Os Embargos à Execução Fiscal (Art. 16 da Lei nº 6.830/80) pressupõem execução fiscal JÁ AJUIZADA pela Fazenda e o JUÍZO DEVIDAMENTE GARANTIDO por penhora, depósito ou fiança bancária. Sem garantia do juízo ou sem execução ajuizada, os embargos são inadmissíveis.';
      } else if (opcaoId === 'REPETICAO') {
        ondeErrouTexto = 'A Repetição de Indébito pressupõe que o tributo já tenha sido PAGO indevidamente.';
        explicacaoTexto =
          'Conforme Art. 165 do CTN, a Ação de Repetição visa a restituição de valores que o contribuinte efetivamente já desembolsou aos cofres públicos. Se o tributo foi apenas lançado ou autuado e não houve pagamento, o contribuinte pretende anular o lançamento, e não repetir indébito.';
      } else if (opcaoId === 'ANULATORIA') {
        ondeErrouTexto = 'A Ação Anulatória comum não é a peça mais adequada aqui.';
        explicacaoTexto =
          'A Ação Anulatória (Art. 38 da LEF) é ação do rito ordinário com dilação probatória e condenação em honorários de sucumbência. Se o cliente possui prova documental cabal e busca rito célere sem sucumbência dentro de 120 dias, a via mandamental é o padrão da banca FGV.';
      } else {
        explicacaoTexto = `A peça "${opcEscolhidaObj?.nome}" não se enquadra na narrativa fática do enunciado oficial da FGV.`;
      }

      setErroGateFeedback({
        tituloErro: `❌ Peça Incorreta: ${opcEscolhidaObj?.nome}`,
        explicacao: explicacaoTexto,
        ondeErrou: ondeErrouTexto,
        bussolaOrientacao: bussola
      });

      mostrarToast('❌ Peça incorreta! A folha de 150 linhas e o esqueleto estrutural permanecem bloqueados.');
    }
  };

  // Avaliação automatizada oficial FGV de toda a prova (Peça + 4 Questões = 10,00 pts)
  const corrigirSimuladoIntegral = () => {
    // 1. Correção da Peça (0.00 a 5.00)
    const textoPecaLower = textoPeca.toLowerCase();
    let somaPeca = 0;
    const criteriosPecaAvaliados = simulado.peca.espelhoCorrecao.map(crit => {
      const matches = crit.palavrasChave.filter(kw => textoPecaLower.includes(kw.toLowerCase()));
      let pontosObtidos = 0;
      let status: 'integral' | 'parcial' | 'ausente' = 'ausente';

      if (matches.length >= Math.max(1, Math.ceil(crit.palavrasChave.length * 0.7))) {
        pontosObtidos = crit.pontos;
        status = 'integral';
      } else if (matches.length > 0) {
        pontosObtidos = Number((crit.pontos * 0.5).toFixed(2));
        status = 'parcial';
      }

      somaPeca += pontosObtidos;
      return {
        id: crit.id,
        item: crit.item,
        pontosObtidos,
        pontosMax: crit.pontos,
        status,
        comentario:
          status === 'integral'
            ? 'Atendeu integralmente ao padrão de resposta oficial FGV.'
            : status === 'parcial'
            ? 'Fundamentou parcialmente; faltou citar o número do artigo/súmula ou tese conexa.'
            : 'Critério ou fundamento legal não identificado na redação.'
      };
    });

    const notaPecaFinal = Math.min(5.0, Number(somaPeca.toFixed(2)));

    // 2. Correção das 4 Questões Discursivas (0.00 a 1.25 cada = 5.00 total)
    const notasQ = { q1: 0, q2: 0, q3: 0, q4: 0 };
    const criteriosQuestoesAvaliados: ResultadoSimuladoIntegral['criteriosQuestoes'] = [];

    simulado.questoes.forEach(q => {
      const respTexto =
        q.numero === 1
          ? respostasQuestoes.q1
          : q.numero === 2
          ? respostasQuestoes.q2
          : q.numero === 3
          ? respostasQuestoes.q3
          : respostasQuestoes.q4;

      const respLower = (respTexto || '').toLowerCase();
      let somaQ = 0;

      q.criteriosCorrecao.forEach(crit => {
        const matches = crit.palavrasChave.filter(kw => respLower.includes(kw.toLowerCase()));
        let obtidos = 0;
        let status: 'integral' | 'parcial' | 'ausente' = 'ausente';

        if (matches.length >= Math.max(1, Math.ceil(crit.palavrasChave.length * 0.6))) {
          obtidos = crit.pontos;
          status = 'integral';
        } else if (matches.length > 0) {
          obtidos = Number((crit.pontos * 0.5).toFixed(2));
          status = 'parcial';
        }

        somaQ += obtidos;
        criteriosQuestoesAvaliados.push({
          questaoNum: q.numero,
          item: crit.item,
          pontosObtidos: obtidos,
          pontosMax: crit.pontos,
          status,
          descricao: crit.descricao
        });
      });

      const notaFinalQ = Math.min(1.25, Number(somaQ.toFixed(2)));
      if (q.numero === 1) notasQ.q1 = notaFinalQ;
      else if (q.numero === 2) notasQ.q2 = notaFinalQ;
      else if (q.numero === 3) notasQ.q3 = notaFinalQ;
      else if (q.numero === 4) notasQ.q4 = notaFinalQ;
    });

    const notaQuestoesTotal = Number((notasQ.q1 + notasQ.q2 + notasQ.q3 + notasQ.q4).toFixed(2));
    const notaTotalFinal = Math.min(10.0, Number((notaPecaFinal + notaQuestoesTotal).toFixed(2)));
    const estaAprovado = notaTotalFinal >= 6.0;

    const novoResultado: ResultadoSimuladoIntegral = {
      simuladoId: simulado.id,
      data: new Date().toLocaleDateString('pt-BR'),
      notaPeca: notaPecaFinal,
      notaQ1: notasQ.q1,
      notaQ2: notasQ.q2,
      notaQ3: notasQ.q3,
      notaQ4: notasQ.q4,
      notaTotal: notaTotalFinal,
      aprovado: estaAprovado,
      linhasPeca: linhasPecaCount,
      criteriosPeca: criteriosPecaAvaliados,
      criteriosQuestoes: criteriosQuestoesAvaliados
    };

    setResultadoIntegral(novoResultado);
    SafeStorage.set(`tributa_simulado_comp_result_${simulado.id}`, JSON.stringify(novoResultado));
    setEtapaTrilha('resultado');

    if (linhasPecaCount >= 150) {
      dispararMegaConfetes150L();
      tocarAlarmeWebAudio('suave');
      mostrarToast(`🏆 CONQUISTA HISTÓRICA! 150 Linhas completas + Nota Global: ${notaTotalFinal.toFixed(2)}/10,00!`);
    } else if (estaAprovado) {
      dispararConfetesSuaves({ count: 90, originY: 0.35 });
      tocarAlarmeWebAudio('suave');
      mostrarToast(`🎉 PARABÉNS! APROVADO NA 2ª FASE FGV COM NOTA ${notaTotalFinal.toFixed(2)}/10,00!`);
    } else {
      tocarAlarmeWebAudio('padrao');
      mostrarToast(`Simulado corrigido: Nota ${notaTotalFinal.toFixed(2)}/10,00 (Nota de corte: 6,00). Veja o espelho!`);
    }
  };

  const getStatusBadge = (status: 'integral' | 'parcial' | 'ausente') => {
    switch (status) {
      case 'integral':
        return <span className="badge b-VERDE text-[9.5px]">Integral ✓</span>;
      case 'parcial':
        return <span className="badge b-AMARELO text-[9.5px]">Parcial (50%)</span>;
      case 'ausente':
        return <span className="badge b-ROSA text-[9.5px]">Ausente (0,0)</span>;
    }
  };

  // Itens da Trilha Oficial de Conquistas (Fluxo: 1. Identificação -> 2. 4 Questões Discursivas -> 3. Redação 150L (5h) -> 4. Espelho FGV)
  const passosTrilha = [
    {
      id: 'gate',
      fase: '1',
      conquista: 'Conquista 1',
      label: 'Identificação da Peça',
      pontos: 'Gate Obrigatório',
      concluido: gateDesbloqueado,
      icone: gateDesbloqueado ? Unlock : Lock
    },
    {
      id: 'q1',
      fase: '2',
      conquista: 'Conquista 2',
      label: 'Questão 1 (30L)',
      pontos: '1,25 pt',
      concluido: respostasQuestoes.q1.trim().length > 15,
      icone: FileText
    },
    {
      id: 'q2',
      fase: '2',
      conquista: 'Conquista 2',
      label: 'Questão 2 (30L)',
      pontos: '1,25 pt',
      concluido: respostasQuestoes.q2.trim().length > 15,
      icone: FileText
    },
    {
      id: 'q3',
      fase: '2',
      conquista: 'Conquista 2',
      label: 'Questão 3 (30L)',
      pontos: '1,25 pt',
      concluido: respostasQuestoes.q3.trim().length > 15,
      icone: FileText
    },
    {
      id: 'q4',
      fase: '2',
      conquista: 'Conquista 2',
      label: 'Questão 4 (30L)',
      pontos: '1,25 pt',
      concluido: respostasQuestoes.q4.trim().length > 15,
      icone: FileText
    },
    {
      id: 'peca',
      fase: '3',
      conquista: 'Conquista 3',
      label: 'Redação 150L (5h)',
      pontos: '5,00 pts',
      concluido: linhasPecaCount >= 30,
      icone: Scale
    },
    {
      id: 'resultado',
      fase: '4',
      conquista: 'Conquista 4',
      label: 'Espelho & Boletim',
      pontos: '10,00 pts',
      concluido: resultadoIntegral !== null,
      icone: Trophy
    }
  ] as const;

  // Cálculo de Progresso em Tempo Real da Trilha de Conquistas
  const progressoTrilha = useMemo(() => {
    const c1 = gateDesbloqueado ? 1 : 0;
    const c2Count =
      (respostasQuestoes.q1.trim().length > 15 ? 1 : 0) +
      (respostasQuestoes.q2.trim().length > 15 ? 1 : 0) +
      (respostasQuestoes.q3.trim().length > 15 ? 1 : 0) +
      (respostasQuestoes.q4.trim().length > 15 ? 1 : 0);
    const c2Frac = c2Count / 4;
    const c3Frac = Math.min(1, Math.max(linhasPecaCount > 10 ? 0.3 : 0, linhasPecaCount / 150));
    const c4 = resultadoIntegral !== null ? 1 : 0;

    const percentualTotal = Math.round((c1 * 0.25 + c2Frac * 0.25 + c3Frac * 0.25 + c4 * 0.25) * 100);

    return {
      c1Concluida: gateDesbloqueado,
      c2Count,
      c2Concluida: c2Count === 4,
      c3Linhas: linhasPecaCount,
      c3Concluida: linhasPecaCount >= 150,
      c4Concluida: resultadoIntegral !== null,
      percentualTotal
    };
  }, [gateDesbloqueado, respostasQuestoes, linhasPecaCount, resultadoIntegral]);

  return (
    <div className="space-y-4">
      {/* ============================================================== */}
      {/* MACOS SEQUOIA PRO CONTROL BAR: EXAME + CRONÔMETRO 5H + AÇÕES   */}
      {/* ============================================================== */}
      <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-zinc-800/90 backdrop-blur-xl p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left: Exam Select & Title */}
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Exame:</span>
              <select
                value={simuladoAtivoId}
                onChange={e => selecionarSimulado(Number(e.target.value))}
                className="rounded-xl border border-black/15 dark:border-white/15 bg-white dark:bg-zinc-900 px-3 py-1 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500 cursor-pointer font-medium shadow-xs"
              >
                {SIMULADOS_SEMANAIS_COMPLETOS.map(s => (
                  <option key={s.id} value={s.id}>
                    Semana {s.semanaNumero}: {s.exameReferencia}
                  </option>
                ))}
              </select>
            </div>

            {gateDesbloqueado ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" /> Peça Identificada
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-500/30 px-2.5 py-0.5 rounded-full animate-pulse">
                <Lock className="h-3 w-3 text-amber-600 dark:text-amber-400" /> Descobrimento Obrigatório
              </span>
            )}
          </div>

          <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2 truncate">
            <Scale className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="truncate">{simulado.titulo}</span>
          </h2>
        </div>

        {/* Right: Apple 5-Hour Timer & Primary Actions */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          {/* macOS Glass Countdown Timer */}
          <div className="flex items-center gap-2 bg-black/[0.04] dark:bg-black/40 border border-black/[0.08] dark:border-white/10 px-3 py-1.5 rounded-xl shadow-inner">
            <Clock className={`h-4 w-4 ${timerAtivo ? 'text-emerald-500 animate-spin' : 'text-amber-500'}`} />
            <span className="font-mono text-base font-extrabold text-zinc-900 dark:text-white tracking-wider">
              {formatTimer(tempoSegundos)}
            </span>
            <div className="flex items-center gap-1 pl-1 border-l border-black/10 dark:border-white/10">
              <button
                type="button"
                onClick={() => setTimerAtivo(!timerAtivo)}
                className={`p-1.5 rounded-lg text-white font-bold transition cursor-pointer ${
                  timerAtivo
                    ? 'bg-amber-600 hover:bg-amber-500'
                    : 'bg-emerald-600 hover:bg-emerald-500'
                }`}
                title={timerAtivo ? 'Pausar prova de 5h' : 'Iniciar cronômetro oficial de 5 horas'}
              >
                {timerAtivo ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTimerAtivo(false);
                  setTempoSegundos(300 * 60);
                  SafeStorage.set(`tributa_simulado_comp_${simuladoAtivoId}_tempo`, '18000');
                  mostrarToast('Cronômetro reiniciado para 05:00:00.');
                }}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white transition cursor-pointer"
                title="Reiniciar 5 horas"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleExportarCadernoPdf}
            className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition shadow-xs inline-flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Gera o caderno oficial completo da prova em PDF para impressão"
          >
            <Printer className="h-3.5 w-3.5 text-blue-500" />
            <span className="hidden sm:inline">Caderno PDF</span>
          </button>

          <button
            type="button"
            onClick={corrigirSimuladoIntegral}
            className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 text-xs font-bold transition shadow-xs inline-flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Corrigir Prova</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MACOS SEQUOIA 4-STAGE STEPPER (SEGMENTED BREADCRUMB)            */}
      {/* ============================================================== */}
      <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-800/80 backdrop-blur-md p-2 sm:p-2.5 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
          {/* Etapa 1: Identificação da Peça */}
          <button
            type="button"
            onClick={() => setEtapaTrilha('gate')}
            className={`p-2.5 rounded-xl text-left transition flex items-center justify-between gap-2.5 cursor-pointer border ${
              etapaTrilha === 'gate'
                ? 'border-blue-500/80 bg-blue-50/60 dark:bg-blue-950/40 shadow-xs'
                : gateDesbloqueado
                ? 'border-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-950/20'
                : 'border-transparent hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`p-2 rounded-xl shrink-0 ${
                gateDesbloqueado
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
              }`}>
                {gateDesbloqueado ? <Check className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Etapa 1
                </div>
                <div className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                  Identificar Peça
                </div>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
              gateDesbloqueado
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-500 text-slate-950 font-black'
            }`}>
              {gateDesbloqueado ? 'Liberada' : 'Gate 🔒'}
            </span>
          </button>

          {/* Etapa 2: 4 Questões Discursivas */}
          <button
            type="button"
            onClick={() => {
              if (['q1', 'q2', 'q3', 'q4'].includes(etapaTrilha)) return;
              setEtapaTrilha('q1');
            }}
            className={`p-2.5 rounded-xl text-left transition flex items-center justify-between gap-2.5 cursor-pointer border ${
              ['q1', 'q2', 'q3', 'q4'].includes(etapaTrilha)
                ? 'border-blue-500/80 bg-blue-50/60 dark:bg-blue-950/40 shadow-xs'
                : progressoTrilha.c2Concluida
                ? 'border-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-950/20'
                : 'border-transparent hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`p-2 rounded-xl shrink-0 ${
                progressoTrilha.c2Concluida
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  : 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
              }`}>
                <FileText className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Etapa 2 (5,0 pts)
                </div>
                <div className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                  4 Questões Discursivas
                </div>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
              progressoTrilha.c2Concluida
                ? 'bg-emerald-600 text-white'
                : progressoTrilha.c2Count > 0
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
            }`}>
              {progressoTrilha.c2Count}/4
            </span>
          </button>

          {/* Etapa 3: Redação da Peça (150L) */}
          <button
            type="button"
            onClick={() => {
              if (!gateDesbloqueado) {
                mostrarToast('🔒 Identifique a peça cabível na Etapa 1 antes de redigir!');
                setEtapaTrilha('gate');
                return;
              }
              setEtapaTrilha('peca');
            }}
            className={`p-2.5 rounded-xl text-left transition flex items-center justify-between gap-2.5 cursor-pointer border ${
              etapaTrilha === 'peca'
                ? 'border-blue-500/80 bg-blue-50/60 dark:bg-blue-950/40 shadow-xs'
                : !gateDesbloqueado
                ? 'border-transparent opacity-50'
                : linhasPecaCount >= 150
                ? 'border-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-950/20'
                : 'border-transparent hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`p-2 rounded-xl shrink-0 ${
                linhasPecaCount >= 150
                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                  : 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
              }`}>
                <Scale className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Etapa 3 (5,0 pts)
                </div>
                <div className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                  Redação da Peça (150L)
                </div>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
              linhasPecaCount >= 150
                ? 'bg-amber-400 text-slate-950 font-black'
                : linhasPecaCount > 10
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
            }`}>
              {linhasPecaCount}/150L
            </span>
          </button>

          {/* Etapa 4: Espelho FGV & Boletim */}
          <button
            type="button"
            onClick={() => setEtapaTrilha('resultado')}
            className={`p-2.5 rounded-xl text-left transition flex items-center justify-between gap-2.5 cursor-pointer border ${
              etapaTrilha === 'resultado'
                ? 'border-blue-500/80 bg-blue-50/60 dark:bg-blue-950/40 shadow-xs'
                : resultadoIntegral
                ? 'border-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-950/20'
                : 'border-transparent hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`p-2 rounded-xl shrink-0 ${
                resultadoIntegral?.aprovado
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
              }`}>
                <Trophy className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Etapa 4 (10,0 pts)
                </div>
                <div className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                  Boletim & Espelho FGV
                </div>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
              resultadoIntegral
                ? resultadoIntegral.aprovado
                  ? 'bg-emerald-600 text-white'
                  : 'bg-rose-600 text-white'
                : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
            }`}>
              {resultadoIntegral ? `${resultadoIntegral.notaTotal.toFixed(2)}/10` : 'Corte 6,0'}
            </span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* PASSO 0: GATILHO OBRIGATÓRIO DE DESCOBRIMENTO DA PEÇA FGV      */}
      {/* ============================================================== */}
      {(etapaTrilha === 'gate' || (!gateDesbloqueado && etapaTrilha === 'peca')) && (
        <div className="rounded-2xl border border-amber-500/40 bg-white dark:bg-zinc-800/95 p-5 shadow-lg space-y-5 text-zinc-900 dark:text-zinc-100">
          {/* Banner de Instrução Obrigatória */}
          <div className="flex items-start gap-3.5 p-4 rounded-xl border border-amber-500/30 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="badge b-AMARELO font-bold text-[10px]">Descobrimento Obrigatório de Peça</span>
                <span className="text-[11px] font-mono font-bold text-amber-800 dark:text-amber-300">Regra de Ouro FGV</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white mt-1">
                Identifique a Peça Cabível antes de iniciar a Folha de 150 Linhas
              </h3>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-1 leading-relaxed">
                Na 2ª Fase OAB de Direito Tributário, a indicação incorreta da peça processual implica a <strong>atribuição de NOTA ZERO (0,00)</strong> no espelho oficial da FGV. Leia a situação-problema abaixo e selecione a única peça cabível para desbloquear a folha padrão e o esqueleto.
              </p>
            </div>
          </div>

          {/* Enunciado da Situação-Problema */}
          <div className="rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-zinc-900/70 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                Situação-Problema Narrada no Exame FGV:
              </span>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                {simulado.exameReferencia}
              </span>
            </div>
            <div className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans whitespace-pre-line max-h-[300px] overflow-y-auto pr-1">
              {simulado.peca.enunciado}
            </div>
          </div>

          {/* Estado de Sucesso / Desbloqueado */}
          {gateDesbloqueado && (
            <div className="p-4 rounded-xl border border-emerald-500/50 bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                    Peça Correta Identificada: {simulado.peca.peca}
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300">
                    Parabéns! Você passou pelo filtro da banca. A Folha de 150 Linhas e o Esqueleto Estrutural foram liberados para o seu treino!
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEtapaTrilha('q1')}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-bold text-white transition shadow-sm inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Avançar para Conquista 2: Questão 1</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Feedback de Erro Pedagógico com Diagnóstico */}
          {erroGateFeedback && !gateDesbloqueado && (
            <div className="p-4 rounded-xl border border-rose-500/50 bg-rose-50 dark:bg-rose-950/30 space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-rose-900 dark:text-rose-200">
                    {erroGateFeedback.tituloErro}
                  </h4>
                  <p className="text-xs text-rose-800 dark:text-rose-300 leading-relaxed font-semibold">
                    {erroGateFeedback.ondeErrou}
                  </p>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {erroGateFeedback.explicacao}
                  </p>
                </div>
              </div>

              {/* Bússola Orientadora do Sistema */}
              <div className="p-3 rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 space-y-1.5">
                <div className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                  <Compass className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
                  Orientação Estruturada do Sistema para Identificar o Erro:
                </div>
                <ul className="space-y-1 text-[11px] text-zinc-600 dark:text-zinc-300">
                  {erroGateFeedback.bussolaOrientacao.map((item, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-1.5">
                      <span className="text-sky-500 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-[11px] text-rose-700 dark:text-rose-300 font-semibold italic">
                ⚠️ A folha padrão de 150 linhas permanecerá bloqueada até você indicar a peça correta. Revise os fatos e tente novamente.
              </div>
            </div>
          )}

          {/* Grade de Seleção das Peças */}
          {!gateDesbloqueado && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center justify-between">
                <span>Qual é a peça processual cabível para os fatos narrados?</span>
                <span className="text-[10px] text-zinc-500 font-normal">Clique na sua resposta</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {OPCOES_PECAS_FGV.map(opcao => {
                  const isEscolhida = opcaoPecaEscolhida === opcao.id;
                  return (
                    <button
                      key={opcao.id}
                      type="button"
                      onClick={() => handleValidarIdentificacaoPeca(opcao.id)}
                      className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer group hover:scale-[1.01] active:scale-[0.99] ${
                        isEscolhida
                          ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/50 shadow-sm'
                          : 'border-black/10 dark:border-white/10 bg-slate-50 dark:bg-zinc-900/60 hover:border-sky-400 hover:bg-white dark:hover:bg-zinc-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`badge text-[9.5px] ${
                          opcao.grupo === 'Inicial'
                            ? 'b-AZUL'
                            : opcao.grupo === 'Recursal'
                            ? 'b-ROSA'
                            : 'b-VERDE'
                        }`}>
                          {opcao.grupo}
                        </span>
                        <ChevronRight className="h-3.5 w-3.5 text-zinc-400 group-hover:text-sky-500 transition-transform group-hover:translate-x-1" />
                      </div>
                      <div className="text-xs font-bold text-zinc-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition">
                        {opcao.nome}
                      </div>
                      <div className="text-[10.5px] text-zinc-500 dark:text-zinc-400 mt-1 leading-snug">
                        {opcao.descricaoCurta}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* ETAPA 1: FOLHA PADRÃO DE 150 LINHAS & ESQUELETO DA PEÇA FGV    */}
      {/* ============================================================== */}
      {etapaTrilha === 'peca' && gateDesbloqueado && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Coluna da Esquerda: Enunciado Oficial da Peça */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 p-4.5 shadow-sm space-y-3.5 text-zinc-900 dark:text-zinc-100">
              <div className="flex items-center justify-between">
                <span className="badge b-AZUL text-[10px]">Peça Prático-Profissional</span>
                <span className="text-xs text-amber-600 dark:text-amber-300 font-bold font-mono">
                  Valor: 5,00 pontos
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">{simulado.peca.titulo}</h3>
                <div className="text-xs text-zinc-600 dark:text-zinc-300 mt-0.5">
                  Peça Cabível:{' '}
                  <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{simulado.peca.peca}</strong>
                </div>
              </div>

              <div className="rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-zinc-900/70 p-3.5 text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed max-h-[300px] overflow-y-auto whitespace-pre-line font-sans">
                {simulado.peca.enunciado}
              </div>

              {/* Dica da Banca FGV */}
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/20 p-3 text-xs text-emerald-800 dark:text-emerald-200 flex items-start gap-2.5">
                <Sparkles className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold text-emerald-700 dark:text-emerald-300">Dica da Banca FGV: </strong>
                  {simulado.peca.dicaBanca}
                </div>
              </div>

              {/* Ações da Peça */}
              <div className="pt-2 flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => onCarregarEsqueletoNaFolha(simulado.peca)}
                  className="flex-1 min-w-[170px] rounded-xl border border-sky-400 bg-sky-600 hover:bg-sky-500 px-3 py-2 text-xs font-semibold text-white transition inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Carregar Esqueleto na Folha</span>
                </button>
                <button
                  type="button"
                  onClick={onNavegarParaSimulador}
                  className="rounded-xl border border-black/10 dark:border-white/10 bg-slate-100 dark:bg-zinc-700 hover:bg-slate-200 dark:hover:bg-zinc-600 px-3 py-2 text-xs font-semibold text-zinc-800 dark:text-zinc-100 transition inline-flex items-center gap-1.5 cursor-pointer"
                  title="Abrir o simulador 150L em tela cheia com correções gramaticais"
                >
                  <span>Folha 150L Tela Cheia</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Coluna da Direita: Folha Padrão de 150 Linhas */}
          <div className="lg:col-span-7 space-y-3">
            <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 p-4.5 shadow-sm space-y-3 text-zinc-900 dark:text-zinc-100">
              <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-zinc-900 dark:text-white">Caderno Oficial da Peça FGV</span>
                  <span
                    className={`font-mono font-bold text-xs px-2.5 py-0.5 rounded-full ${
                      linhasPecaCount >= 150
                        ? 'bg-amber-400 text-slate-950 font-black animate-pulse'
                        : 'bg-slate-100 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200'
                    }`}
                  >
                    {linhasPecaCount} / 150 Linhas (Páginas 1 a 5)
                  </span>
                </div>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Salvamento automático ativo • Limite oficial FGV
                </span>
              </div>

              <div className="relative">
                <textarea
                  rows={20}
                  value={textoPeca}
                  onChange={e => handleAtualizarPeca(e.target.value)}
                  placeholder="Redija aqui a petição inicial ou recurso completo conforme os 150 quesitos oficiais da FGV..."
                  className="w-full rounded-xl border border-black/15 dark:border-white/15 bg-slate-50 dark:bg-zinc-900 p-3.5 text-xs font-mono text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-sky-500 leading-relaxed resize-y"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 pt-1 border-t border-black/10 dark:border-white/10 flex-wrap gap-2">
                <span>
                  Estrutura: Endereçamento • Partes • Fatos • Teses/Mérito • Liminar • Pedidos • Fechamento
                </span>
                <button
                  type="button"
                  onClick={() => handleAtualizarPeca(simulado.peca.esqueleto)}
                  className="text-sky-600 dark:text-sky-400 hover:underline transition cursor-pointer font-medium"
                >
                  Restaurar esqueleto padrão
                </button>
              </div>

              {/* Barra de Navegação da Trilha */}
              <div className="pt-2 flex items-center justify-between border-t border-black/10 dark:border-white/10 flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setEtapaTrilha('q4')}
                  className="px-3 py-1.5 rounded-xl border border-black/10 dark:border-white/10 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700 transition inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Voltar para Questão 4</span>
                </button>

                <button
                  type="button"
                  onClick={corrigirSimuladoIntegral}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold text-white transition inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Concluir Simulado & Ver Espelho FGV</span>
                  <Trophy className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ETAPAS 2 A 5: QUESTÕES DISCURSIVAS 1 A 4 (1,25 PT CADA = 30L)  */}
      {/* ============================================================== */}
      {(['q1', 'q2', 'q3', 'q4'] as const).includes(etapaTrilha as any) && (
        (() => {
          const numQuestao =
            etapaTrilha === 'q1' ? 1 : etapaTrilha === 'q2' ? 2 : etapaTrilha === 'q3' ? 3 : 4;
          const questao = simulado.questoes.find(q => q.numero === numQuestao) || simulado.questoes[0];
          const chave = etapaTrilha as 'q1' | 'q2' | 'q3' | 'q4';
          const linhasCount =
            numQuestao === 1 ? linhasQ1Count : numQuestao === 2 ? linhasQ2Count : numQuestao === 3 ? linhasQ3Count : linhasQ4Count;

          return (
            <div className="space-y-3">
              {/* Apple Sub-Segmented Control: Questões 1 a 4 */}
              <div className="flex items-center justify-between gap-2 p-1 rounded-2xl bg-white/70 dark:bg-zinc-800/80 backdrop-blur-md border border-black/10 dark:border-white/10">
                <div className="flex items-center gap-1.5 flex-1">
                  {[1, 2, 3, 4].map(n => {
                    const qKey = `q${n}` as 'q1' | 'q2' | 'q3' | 'q4';
                    const isAtiva = etapaTrilha === qKey;
                    const preenchida = respostasQuestoes[qKey].trim().length > 15;
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setEtapaTrilha(qKey)}
                        className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                          isAtiva
                            ? 'bg-blue-600 text-white shadow-xs font-bold'
                            : preenchida
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
                            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        <span>Questão {n}</span>
                        {preenchida ? (
                          <Check className="h-3 w-3 text-emerald-400 font-bold" />
                        ) : (
                          <span className="text-[10px] opacity-70 font-mono">1,25 pt</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                {/* Coluna da Esquerda: Enunciado Oficial da Questão + Itens A e B */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 p-4.5 shadow-sm space-y-3.5 text-zinc-900 dark:text-zinc-100">
                  <div className="flex items-center justify-between">
                    <span className="badge b-AMARELO text-[10px]">Questão Discursiva {questao.numero}</span>
                    <span className="text-xs text-amber-600 dark:text-amber-300 font-bold font-mono">
                      Valor: 1,25 ponto (30 Linhas)
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">{questao.titulo}</h3>

                  <div className="rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-zinc-900/70 p-3.5 text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-line font-sans">
                    {questao.enunciado}
                  </div>

                  {/* Itens A e B */}
                  <div className="space-y-2.5">
                    <div className="rounded-xl border border-sky-500/30 bg-sky-50 dark:bg-sky-950/20 p-3 space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-sky-800 dark:text-sky-300">
                        <span>Item A)</span>
                        <span className="font-mono text-[11px] text-sky-600 dark:text-sky-400">0,65 pt</span>
                      </div>
                      <p className="text-xs text-zinc-700 dark:text-zinc-300">{questao.itemA.pergunta}</p>
                    </div>

                    <div className="rounded-xl border border-teal-500/30 bg-teal-50 dark:bg-teal-950/20 p-3 space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-teal-800 dark:text-teal-300">
                        <span>Item B)</span>
                        <span className="font-mono text-[11px] text-teal-600 dark:text-teal-400">0,60 pt</span>
                      </div>
                      <p className="text-xs text-zinc-700 dark:text-zinc-300">{questao.itemB.pergunta}</p>
                    </div>
                  </div>

                  {/* Dica da Banca */}
                  <div className="rounded-xl border border-amber-500/30 bg-amber-50 dark:bg-amber-950/20 p-3 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2.5">
                    <Sparkles className="h-4 w-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold text-amber-700 dark:text-amber-300">Dica da Banca FGV: </strong>
                      {questao.dicaBanca}
                    </div>
                  </div>
                </div>
              </div>

              {/* Coluna da Direita: Folha de Resposta Pautada de 30 Linhas FGV */}
              <div className="lg:col-span-7 space-y-3">
                <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 p-4.5 shadow-sm space-y-3 text-zinc-900 dark:text-zinc-100">
                  <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-900 dark:text-white">
                        Caderno de Resposta da Questão {questao.numero}
                      </span>
                      <span
                        className={`font-mono font-bold text-xs px-2.5 py-0.5 rounded-full ${
                          linhasCount > 30
                            ? 'bg-rose-500 text-white font-black animate-bounce'
                            : 'bg-slate-100 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200'
                        }`}
                      >
                        {linhasCount} / 30 Linhas Oficiais
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      Limite máximo FGV: 30 linhas
                    </span>
                  </div>

                  {linhasCount > 30 && (
                    <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-500/40 rounded-xl p-3">
                      <AlertTriangle className="h-4 w-4 text-rose-500 dark:text-rose-400 shrink-0" />
                      <span>
                        ⚠️ Atenção: você ultrapassou o teto oficial de 30 linhas da FGV. Linhas excedentes são anuladas pela banca!
                      </span>
                    </div>
                  )}

                  <div className="relative">
                    <textarea
                      rows={16}
                      value={respostasQuestoes[chave]}
                      onChange={e => handleAtualizarQuestao(chave, e.target.value)}
                      placeholder={`Escreva aqui sua resposta aos itens A e B da Questão ${questao.numero}...\nExemplo de padrão FGV:\nA) O pedido não é legítimo, tendo em vista que o Art. ... do CTN veda expressamente...\nB) Em relação ao direito de crédito, aplica-se o Tema/Súmula...`}
                      className="w-full rounded-xl border border-black/15 dark:border-white/15 bg-slate-50 dark:bg-zinc-900 p-3.5 text-xs font-mono text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-amber-500 leading-relaxed resize-y"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 pt-1 border-t border-black/10 dark:border-white/10 flex-wrap gap-2">
                    <span>
                      Dica de resposta: Divida sua resposta claramente em <strong>A)</strong> e <strong>B)</strong> para pontuação imediata no espelho.
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAtualizarQuestao(chave, '')}
                      className="text-rose-600 dark:text-rose-400 hover:underline transition cursor-pointer font-medium"
                    >
                      Limpar resposta
                    </button>
                  </div>

                  {/* Barra de Navegação da Trilha */}
                  <div className="pt-2 flex items-center justify-between border-t border-black/10 dark:border-white/10 flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (numQuestao === 1) setEtapaTrilha('gate');
                        else if (numQuestao === 2) setEtapaTrilha('q1');
                        else if (numQuestao === 3) setEtapaTrilha('q2');
                        else setEtapaTrilha('q3');
                      }}
                      className="px-3 py-1.5 rounded-xl border border-black/10 dark:border-white/10 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700 transition inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>{numQuestao === 1 ? 'Voltar para Identificação' : 'Voltar'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (numQuestao === 1) setEtapaTrilha('q2');
                        else if (numQuestao === 2) setEtapaTrilha('q3');
                        else if (numQuestao === 3) setEtapaTrilha('q4');
                        else setEtapaTrilha('peca');
                      }}
                      className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white transition inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>
                        {numQuestao === 4
                          ? 'Avançar para Conquista 3: Redação 150L (5h)'
                          : `Avançar para Questão ${numQuestao + 1}`}
                      </span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          );
        })()
      )}

      {/* ============================================================== */}
      {/* ETAPA 6: ESPELHO OFICIAL FGV & RESULTADO INTEGRAL DA PROVA     */}
      {/* ============================================================== */}
      {etapaTrilha === 'resultado' && (
        <div className="space-y-4">
          {resultadoIntegral ? (
            <div className="space-y-4">
              {/* Card de Desempenho Global */}
              <div
                className={`rounded-2xl border p-5 shadow-lg space-y-4 ${
                  resultadoIntegral.aprovado
                    ? 'border-emerald-500/50 bg-gradient-to-br from-emerald-950/70 via-teal-950/60 to-zinc-900 text-zinc-100'
                    : 'border-amber-500/50 bg-gradient-to-br from-amber-950/70 via-stone-900 to-zinc-900 text-zinc-100'
                }`}
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl border shrink-0 ${
                        resultadoIntegral.aprovado
                          ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                          : 'border-amber-400 bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      <Trophy className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`badge font-bold text-[10.5px] ${
                            resultadoIntegral.aprovado ? 'b-VERDE' : 'b-AMARELO'
                          }`}
                        >
                          {resultadoIntegral.aprovado
                            ? '🏆 APROVADO NA 2ª FASE FGV'
                            : '⚠️ REPROVADO • NECESSITA REFORÇO'}
                        </span>
                        <span className="text-[11px] text-zinc-300 font-mono">
                          Data: {resultadoIntegral.data}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-white mt-0.5">
                        Nota Global: {resultadoIntegral.notaTotal.toFixed(2)} de 10,00 pontos
                      </h3>
                      <p className="text-xs text-zinc-300">
                        {resultadoIntegral.aprovado
                          ? 'Parabéns! Sua pontuação superou o ponto de corte oficial da FGV (6,00 pontos).'
                          : 'A nota mínima para aprovação é 6,00. Analise os quesitos pendentes no espelho abaixo.'}
                      </p>
                    </div>
                  </div>

                  {/* Resumo em Cards */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-2.5 text-center min-w-[90px]">
                      <div className="text-[10px] text-zinc-300 font-semibold">Peça Prática</div>
                      <div className="font-mono text-base font-bold text-sky-300">
                        {resultadoIntegral.notaPeca.toFixed(2)} / 5,00
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-2.5 text-center min-w-[90px]">
                      <div className="text-[10px] text-zinc-300 font-semibold">Questão 1</div>
                      <div className="font-mono text-base font-bold text-amber-300">
                        {resultadoIntegral.notaQ1.toFixed(2)} / 1,25
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-2.5 text-center min-w-[90px]">
                      <div className="text-[10px] text-zinc-300 font-semibold">Questão 2</div>
                      <div className="font-mono text-base font-bold text-amber-300">
                        {resultadoIntegral.notaQ2.toFixed(2)} / 1,25
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-2.5 text-center min-w-[90px]">
                      <div className="text-[10px] text-zinc-300 font-semibold">Questão 3</div>
                      <div className="font-mono text-base font-bold text-amber-300">
                        {resultadoIntegral.notaQ3.toFixed(2)} / 1,25
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-2.5 text-center min-w-[90px]">
                      <div className="text-[10px] text-zinc-300 font-semibold">Questão 4</div>
                      <div className="font-mono text-base font-bold text-amber-300">
                        {resultadoIntegral.notaQ4.toFixed(2)} / 1,25
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detalhamento dos Espelhos Oficiais FGV */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Espelho da Peça Prática */}
                <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 p-4 space-y-3 text-zinc-900 dark:text-zinc-100">
                  <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2">
                    <span className="font-bold text-zinc-900 dark:text-white text-sm flex items-center gap-2">
                      <Scale className="h-4 w-4 text-sky-500 dark:text-sky-400" />
                      Espelho Oficial da Peça ({simulado.peca.peca})
                    </span>
                    <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">
                      {resultadoIntegral.notaPeca.toFixed(2)} / 5,00
                    </span>
                  </div>

                  <div className="space-y-2">
                    {resultadoIntegral.criteriosPeca.map(crit => (
                      <div
                        key={crit.id}
                        className="rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-zinc-900/60 p-2.5 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-zinc-900 dark:text-white">{crit.item}</span>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(crit.status)}
                            <span className="font-mono text-[11px] font-bold text-zinc-700 dark:text-zinc-300">
                              {crit.pontosObtidos.toFixed(2)} / {crit.pontosMax.toFixed(2)} pt
                            </span>
                          </div>
                        </div>
                        <p className="text-[11px] text-zinc-600 dark:text-zinc-400">{crit.comentario}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Espelho das 4 Questões Discursivas */}
                <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 p-4 space-y-3 text-zinc-900 dark:text-zinc-100">
                  <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2">
                    <span className="font-bold text-zinc-900 dark:text-white text-sm flex items-center gap-2">
                      <FileCheck2 className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                      Espelho das 4 Questões Discursivas
                    </span>
                    <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                      {(resultadoIntegral.notaQ1 + resultadoIntegral.notaQ2 + resultadoIntegral.notaQ3 + resultadoIntegral.notaQ4).toFixed(2)} / 5,00
                    </span>
                  </div>

                  <div className="space-y-2">
                    {resultadoIntegral.criteriosQuestoes.map((crit, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-zinc-900/60 p-2.5 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-zinc-900 dark:text-white">
                            Questão {crit.questaoNum} • Item {crit.item}
                          </span>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(crit.status)}
                            <span className="font-mono text-[11px] font-bold text-zinc-700 dark:text-zinc-300">
                              {crit.pontosObtidos.toFixed(2)} / {crit.pontosMax.toFixed(2)} pt
                            </span>
                          </div>
                        </div>
                        <p className="text-[11px] text-zinc-600 dark:text-zinc-400">{crit.descricao}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-black/15 dark:border-white/15 bg-slate-50 dark:bg-zinc-800/60 p-8 text-center space-y-3 text-zinc-900 dark:text-zinc-100">
              <Trophy className="h-10 w-10 text-zinc-400 dark:text-zinc-500 mx-auto" />
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">Nenhuma correção integral realizada ainda</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 max-w-md mx-auto">
                Preencha a Peça e as 4 Questões na trilha e clique em <strong>"Corrigir Prova Completa"</strong> para obter a nota oficial de 0 a 10,00 pontos conforme os critérios da banca FGV.
              </p>
              <button
                type="button"
                onClick={corrigirSimuladoIntegral}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 text-xs font-bold text-white transition shadow-sm inline-flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Avaliar Agora com os Espelhos FGV</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL COM O PADRÃO OFICIAL DE RESPOSTA COMPLETO FGV             */}
      {/* ============================================================== */}
      {modalGabaritoAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <div className="max-w-3xl w-full max-h-[85vh] flex flex-col p-5 bg-white dark:bg-zinc-900 border border-black/15 dark:border-white/15 rounded-2xl shadow-2xl text-zinc-900 dark:text-zinc-100">
            <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
              <div>
                <span className="badge b-AMARELO text-[10px]">Padrão de Resposta Oficial da Banca FGV</span>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white mt-1">
                  Espelho Completo: {simulado.titulo}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalGabaritoAberto(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 py-4 pr-1 text-xs text-zinc-800 dark:text-zinc-200">
              {/* Gabarito da Peça */}
              <div className="rounded-xl border border-sky-500/40 bg-sky-50 dark:bg-sky-950/20 p-3 space-y-2">
                <h4 className="font-bold text-sky-700 dark:text-sky-300 text-sm flex items-center gap-2">
                  <Scale className="h-4 w-4" /> Peça Prático-Profissional (5,00 pts): {simulado.peca.peca}
                </h4>
                <div className="space-y-1.5">
                  {simulado.peca.espelhoCorrecao.map(crit => (
                    <div key={crit.id} className="flex items-start justify-between gap-3 text-xs border-b border-black/5 dark:border-white/5 pb-1">
                      <div>
                        <strong className="text-zinc-900 dark:text-white">{crit.item}: </strong>
                        <span className="text-zinc-600 dark:text-zinc-300">{crit.descricao}</span>
                      </div>
                      <span className="font-mono text-sky-600 dark:text-sky-400 font-bold shrink-0">{crit.pontos.toFixed(2)} pt</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gabarito das 4 Questões */}
              {simulado.questoes.map(q => (
                <div key={q.numero} className="rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-zinc-900 p-3 space-y-2">
                  <h4 className="font-bold text-amber-700 dark:text-amber-300 text-sm">
                    Questão {q.numero} (1,25 pts) • {q.titulo}
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/5 space-y-1">
                      <div className="flex items-center justify-between font-bold text-sky-700 dark:text-sky-300">
                        <span>Gabarito Item A)</span>
                        <span className="font-mono">0,65 pt</span>
                      </div>
                      <p className="text-zinc-700 dark:text-zinc-300">{q.itemA.gabaritoEsperado}</p>
                      <div className="text-[11px] text-sky-600 dark:text-sky-400 font-mono">
                        Fundamentos: {q.itemA.fundamentos.join(' • ')}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/5 space-y-1">
                      <div className="flex items-center justify-between font-bold text-teal-700 dark:text-teal-300">
                        <span>Gabarito Item B)</span>
                        <span className="font-mono">0,60 pt</span>
                      </div>
                      <p className="text-zinc-700 dark:text-zinc-300">{q.itemB.gabaritoEsperado}</p>
                      <div className="text-[11px] text-teal-600 dark:text-teal-400 font-mono">
                        Fundamentos: {q.itemB.fundamentos.join(' • ')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-black/10 dark:border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setModalGabaritoAberto(false)}
                className="rounded-xl bg-slate-200 dark:bg-zinc-700 hover:bg-slate-300 dark:hover:bg-zinc-600 px-4 py-2 text-xs font-semibold text-zinc-900 dark:text-white transition cursor-pointer"
              >
                Fechar Espelho
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
