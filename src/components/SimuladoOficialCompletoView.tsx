import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  FileText,
  HelpCircle,
  Trophy,
  ArrowRight,
  Check,
  Download,
  Flame,
  FileCheck2
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

  const simulado = useMemo(() => {
    return (
      SIMULADOS_SEMANAIS_COMPLETOS.find(s => s.id === simuladoAtivoId) ||
      SIMULADOS_SEMANAIS_COMPLETOS[0]
    );
  }, [simuladoAtivoId]);

  // Aba ativa do caderno oficial de prova
  const [abaCaderno, setAbaCaderno] = useState<'peca' | 'q1' | 'q2' | 'q3' | 'q4' | 'resultado'>('peca');

  // Redação da Peça local (sincronizada com o Simulador 150L)
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

  // Troca de simulado
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
    try {
      const raw = SafeStorage.get(`tributa_simulado_comp_result_${id}`, '');
      setResultadoIntegral(raw ? JSON.parse(raw) : null);
    } catch {
      setResultadoIntegral(null);
    }
    setAbaCaderno('peca');
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
    setAbaCaderno('resultado');

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

  return (
    <div className="space-y-4">
      {/* Banner Principal do Simulado Oficial com Temporizador de 5h e Ações */}
      <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 p-4.5 shadow-md space-y-4 text-zinc-900 dark:text-zinc-100">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="badge b-AZUL font-mono font-bold text-[10.5px]">
                Caderno Oficial FGV
              </span>
              <span className="badge b-VERDE text-[10px]">
                1 Peça (5,0 pts) + 4 Questões (5,0 pts) = 10,00 Total
              </span>
              <span className="badge b-AMARELO text-[10px]">
                Nota de Corte: 6,00 pts
              </span>
            </div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2 mt-1">
              <Scale className="h-5 w-5 text-sky-500 dark:text-sky-400" />
              {simulado.titulo}
            </h2>
            <p className="text-xs text-zinc-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              Estrutura rigorosamente idêntica à prova real aplicada pela banca FGV: uma situação-problema para a Peça Prático-Profissional (folha de 150 linhas) e 4 questões discursivas inéditas com itens A e B (folha de 30 linhas cada).
            </p>
          </div>

          {/* Temporizador Oficial de 5 Horas (300 min) */}
          <div className="flex items-center gap-3 bg-slate-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 p-2.5 rounded-2xl shadow-inner">
            <div className="flex items-center gap-2">
              <Clock className={`h-5 w-5 ${timerAtivo ? 'text-emerald-500 dark:text-emerald-400 animate-spin' : 'text-amber-500 dark:text-amber-400'}`} />
              <div>
                <div className="text-[10px] text-zinc-500 dark:text-slate-400 uppercase font-semibold tracking-wider">
                  Tempo Restante (5h FGV)
                </div>
                <div className="font-mono text-xl font-black text-zinc-900 dark:text-white tracking-wider">
                  {formatTimer(tempoSegundos)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 pl-2 border-l border-black/10 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setTimerAtivo(!timerAtivo)}
                className={`p-2 rounded-xl text-white transition cursor-pointer shadow-sm ${
                  timerAtivo
                    ? 'bg-amber-600 hover:bg-amber-500'
                    : 'bg-emerald-600 hover:bg-emerald-500'
                }`}
                title={timerAtivo ? 'Pausar prova' : 'Iniciar contagem de 5 horas'}
              >
                {timerAtivo ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTimerAtivo(false);
                  setTempoSegundos(300 * 60);
                  SafeStorage.set(`tributa_simulado_comp_${simuladoAtivoId}_tempo`, '18000');
                  mostrarToast('Cronômetro reiniciado para 05:00:00.');
                }}
                className="p-2 rounded-xl border border-black/10 dark:border-slate-600 bg-white dark:bg-slate-800 text-zinc-700 dark:text-slate-300 hover:text-zinc-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
                title="Reiniciar para 5 horas"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Toolbar de Navegação e Ações Rápidas */}
        <div className="flex items-center justify-between border-t border-black/10 dark:border-[#455468]/70 pt-3 flex-wrap gap-3">
          {/* Seletor de Simulado Semanal */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-700 dark:text-slate-300">Edição do Simulado:</span>
            <select
              value={simuladoAtivoId}
              onChange={e => selecionarSimulado(Number(e.target.value))}
              className="rounded-xl border border-black/15 dark:border-[#56677d] bg-white dark:bg-[#1b232e] px-3 py-1.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-sky-400 cursor-pointer font-medium"
            >
              {SIMULADOS_SEMANAIS_COMPLETOS.map(s => (
                <option key={s.id} value={s.id}>
                  Semana {s.semanaNumero}: {s.exameReferencia} ({s.peca.peca})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleExportarCadernoPdf}
              className="rounded-full border border-sky-400 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/70 px-3.5 py-1.5 text-xs font-bold text-sky-800 dark:text-sky-200 transition shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
              title="Gera um PDF completo com a capa, enunciados e folhas de resposta pautadas FGV para impressão"
            >
              <Printer className="h-3.5 w-3.5 text-sky-600 dark:text-sky-300" />
              <span>🖨️ Imprimir Caderno Oficial (PDF)</span>
            </button>

            <button
              type="button"
              onClick={() => setModalGabaritoAberto(true)}
              className="rounded-full border border-amber-400/60 bg-amber-50 dark:bg-[#1b232e] hover:bg-amber-100 dark:hover:bg-amber-950/40 px-3 py-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300 transition inline-flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Padrão de Respostas FGV</span>
            </button>

            <button
              type="button"
              onClick={corrigirSimuladoIntegral}
              className="rounded-full border border-emerald-400 bg-emerald-600 hover:bg-emerald-500 px-4 py-1.5 text-xs font-bold text-white transition shadow-md inline-flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>🏁 Corrigir Prova Completa (10,00 pts)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Caderno de Respostas Oficial: Abas (Peça + Questões 1 a 4 + Resultado) */}
      <div className="flex items-center gap-1.5 border-b border-black/10 dark:border-[#455468] pb-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => setAbaCaderno('peca')}
          className={`px-3.5 py-2 rounded-t-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer border-t border-x ${
            abaCaderno === 'peca'
              ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border-black/10 dark:border-[#56677d] shadow-sm border-b-2 border-b-sky-500'
              : 'text-zinc-600 dark:text-slate-400 hover:text-zinc-900 dark:hover:text-slate-200 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/40'
          }`}
        >
          <Scale className="h-3.5 w-3.5 text-sky-500 dark:text-sky-400" />
          <span>Peça Prática (0,00 - 5,00)</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-500/30">
            {linhasPecaCount}/150L
          </span>
        </button>

        {[1, 2, 3, 4].map(num => {
          const key = `q${num}` as 'q1' | 'q2' | 'q3' | 'q4';
          const linhas =
            num === 1 ? linhasQ1Count : num === 2 ? linhasQ2Count : num === 3 ? linhasQ3Count : linhasQ4Count;
          const respondida = respostasQuestoes[key].trim().length > 10;
          return (
            <button
              key={num}
              type="button"
              onClick={() => setAbaCaderno(key)}
              className={`px-3 py-2 rounded-t-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border-t border-x ${
                abaCaderno === key
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border-black/10 dark:border-[#56677d] shadow-sm border-b-2 border-b-sky-500'
                  : 'text-zinc-600 dark:text-slate-400 hover:text-zinc-900 dark:hover:text-slate-200 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/40'
              }`}
            >
              <FileText className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
              <span>Questão {num} (1,25 pt)</span>
              <span
                className={`text-[9.5px] font-mono px-1.5 py-0.2 rounded border ${
                  respondida
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-100 dark:bg-slate-800 text-zinc-600 dark:text-slate-400 border-black/10 dark:border-slate-700'
                }`}
              >
                {linhas}/30L
              </span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setAbaCaderno('resultado')}
          className={`px-3.5 py-2 rounded-t-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer border-t border-x ml-auto ${
            abaCaderno === 'resultado'
              ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border-black/10 dark:border-[#56677d] shadow-sm border-b-2 border-b-emerald-500'
              : 'text-zinc-600 dark:text-slate-400 hover:text-zinc-900 dark:hover:text-slate-200 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/40'
          }`}
        >
          <Trophy className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
          <span>Boletim & Espelho FGV</span>
          {resultadoIntegral && (
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                resultadoIntegral.aprovado ? 'bg-emerald-500 text-slate-950' : 'bg-red-500 text-white'
              }`}
            >
              {resultadoIntegral.notaTotal.toFixed(2)}/10,00
            </span>
          )}
        </button>
      </div>

      {/* CONTEÚDO DA ABA SELECIONADA */}

      {/* 1. ABA DA PEÇA PRÁTICO-PROFISSIONAL (5,00 PONTOS) */}
      {abaCaderno === 'peca' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Coluna da Esquerda: Enunciado Oficial da Peça */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="badge b-AZUL text-[10px]">Peça Prático-Profissional</span>
                <span className="text-xs text-amber-600 dark:text-amber-300 font-bold font-mono">Valor: 5,00 pontos</span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">{simulado.peca.titulo}</h3>
                <div className="text-xs text-zinc-600 dark:text-slate-300 mt-0.5">
                  Peça Cabível:{' '}
                  <strong className="text-emerald-600 dark:text-emerald-400">{simulado.peca.peca}</strong>
                </div>
              </div>

              <div className="rounded-xl border border-black/10 dark:border-slate-700 bg-slate-50 dark:bg-zinc-900 p-3 text-xs text-zinc-800 dark:text-slate-200 leading-relaxed max-h-[320px] overflow-y-auto whitespace-pre-line font-sans">
                {simulado.peca.enunciado}
              </div>

              {/* Dica da Banca FGV */}
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/20 p-2.5 text-xs text-emerald-800 dark:text-emerald-200 flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold text-emerald-700 dark:text-emerald-300">Dica da Banca FGV: </strong>
                  {simulado.peca.dicaBanca}
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onCarregarEsqueletoNaFolha(simulado.peca)}
                  className="flex-1 rounded-xl border border-sky-400 bg-sky-600 hover:bg-sky-500 px-3 py-2 text-xs font-semibold text-white transition inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Carregar Esqueleto na Folha</span>
                </button>
                <button
                  type="button"
                  onClick={onNavegarParaSimulador}
                  className="rounded-xl border border-black/10 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-2 text-xs font-semibold text-zinc-700 dark:text-slate-200 transition inline-flex items-center gap-1 cursor-pointer"
                  title="Abrir a folha de 150 linhas em tela cheia com overlay de sintaxe e tooltips"
                >
                  <span>Folha 150L</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Coluna da Direita: Folha de Redação Pautada FGV 150 Linhas */}
          <div className="lg:col-span-7 space-y-3">
            <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-zinc-900 dark:text-white">Caderno de Resposta da Peça</span>
                  <span
                    className={`font-mono font-bold text-xs px-2 py-0.5 rounded-full ${
                      linhasPecaCount >= 150
                        ? 'bg-amber-400 text-slate-950 font-black animate-pulse'
                        : 'bg-slate-200 dark:bg-slate-700 text-zinc-800 dark:text-slate-200'
                    }`}
                  >
                    {linhasPecaCount} / 150 Linhas (5 Páginas)
                  </span>
                </div>
                <span className="text-[11px] text-zinc-500 dark:text-slate-400">
                  Páginas 1 a 5 pautadas FGV • Autosave ativo
                </span>
              </div>

              <div className="relative">
                <textarea
                  rows={20}
                  value={textoPeca}
                  onChange={e => handleAtualizarPeca(e.target.value)}
                  placeholder="Redija aqui a petição inicial ou recurso completo conforme os 150 quesitos oficiais da FGV..."
                  className="w-full rounded-xl border border-black/15 dark:border-slate-600 bg-slate-50 dark:bg-[#1b232e] p-3 text-xs font-mono text-zinc-900 dark:text-slate-100 placeholder-zinc-400 dark:placeholder-slate-500 focus:outline-none focus:border-sky-500 leading-relaxed resize-y"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-slate-400 pt-1 border-t border-black/10 dark:border-slate-700/60">
                <span>
                  Estrutura recomendada: Endereçamento • Qualificação • Fatos • Mérito/Teses • Liminar/Tutela • Pedidos • Fechamento
                </span>
                <button
                  type="button"
                  onClick={() => handleAtualizarPeca(simulado.peca.esqueleto)}
                  className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition underline cursor-pointer"
                >
                  Restaurar esqueleto padrão
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ABAS DAS QUESTÕES DISCURSIVAS 1 A 4 (1,25 PONTOS CADA) */}
      {(['q1', 'q2', 'q3', 'q4'] as const).includes(abaCaderno as any) && (
        (() => {
          const numQuestao =
            abaCaderno === 'q1' ? 1 : abaCaderno === 'q2' ? 2 : abaCaderno === 'q3' ? 3 : 4;
          const questao = simulado.questoes.find(q => q.numero === numQuestao) || simulado.questoes[0];
          const chave = abaCaderno as 'q1' | 'q2' | 'q3' | 'q4';
          const linhasCount =
            numQuestao === 1 ? linhasQ1Count : numQuestao === 2 ? linhasQ2Count : numQuestao === 3 ? linhasQ3Count : linhasQ4Count;

          return (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              {/* Coluna da Esquerda: Enunciado Oficial da Questão + Itens A e B */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 p-4 shadow-sm space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="badge b-AMARELO text-[10px]">Questão Discursiva {questao.numero}</span>
                    <span className="text-xs text-amber-600 dark:text-amber-300 font-bold font-mono">Valor: 1,25 ponto</span>
                  </div>

                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">{questao.titulo}</h3>

                  <div className="rounded-xl border border-black/10 dark:border-slate-700 bg-slate-50 dark:bg-zinc-900 p-3 text-xs text-zinc-800 dark:text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                    {questao.enunciado}
                  </div>

                  {/* Itens A e B */}
                  <div className="space-y-2.5">
                    <div className="rounded-xl border border-sky-500/30 bg-sky-50 dark:bg-sky-950/20 p-3 space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-sky-700 dark:text-sky-300">
                        <span>Item A)</span>
                        <span className="font-mono text-[11px] text-sky-600 dark:text-sky-400">0,65 pt</span>
                      </div>
                      <p className="text-xs text-zinc-700 dark:text-slate-200">{questao.itemA.pergunta}</p>
                    </div>

                    <div className="rounded-xl border border-teal-500/30 bg-teal-50 dark:bg-teal-950/20 p-3 space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-teal-700 dark:text-teal-300">
                        <span>Item B)</span>
                        <span className="font-mono text-[11px] text-teal-600 dark:text-teal-400">0,60 pt</span>
                      </div>
                      <p className="text-xs text-zinc-700 dark:text-slate-200">{questao.itemB.pergunta}</p>
                    </div>
                  </div>

                  {/* Dica da Banca */}
                  <div className="rounded-xl border border-amber-500/30 bg-amber-50 dark:bg-amber-950/20 p-2.5 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2">
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
                <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-900 dark:text-white">Caderno de Resposta da Questão {questao.numero}</span>
                      <span
                        className={`font-mono font-bold text-xs px-2 py-0.5 rounded-full ${
                          linhasCount > 30
                            ? 'bg-red-500 text-white font-black animate-bounce'
                            : 'bg-slate-200 dark:bg-slate-700 text-zinc-800 dark:text-slate-200'
                        }`}
                      >
                        {linhasCount} / 30 Linhas
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-500 dark:text-slate-400">
                      Limite oficial FGV: 30 linhas por questão
                    </span>
                  </div>

                  {linhasCount > 30 && (
                    <div className="flex items-center gap-2 text-xs font-semibold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-500/40 rounded-xl p-2.5">
                      <AlertTriangle className="h-4 w-4 text-red-500 dark:text-red-400 shrink-0" />
                      <span>
                        ⚠️ Atenção: você ultrapassou o limite oficial de 30 linhas da FGV para esta questão. Linhas excedentes são desconsideradas pela banca corretora!
                      </span>
                    </div>
                  )}

                  {/* Textarea de Resposta da Questão */}
                  <div className="relative">
                    <textarea
                      rows={16}
                      value={respostasQuestoes[chave]}
                      onChange={e => handleAtualizarQuestao(chave, e.target.value)}
                      placeholder={`Escreva aqui sua resposta aos itens A e B da Questão ${questao.numero}...\nExemplo de estrutura:\nA) O pedido não é legítimo, tendo em vista que...\nB) Em relação aos créditos, aplica-se o artigo...`}
                      className="w-full rounded-xl border border-black/15 dark:border-slate-600 bg-slate-50 dark:bg-[#1b232e] p-3 text-xs font-mono text-zinc-900 dark:text-slate-100 placeholder-zinc-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 leading-relaxed resize-y"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-slate-400 pt-1 border-t border-black/10 dark:border-slate-700/60">
                    <span>
                      Dica de resposta: Divida sua resposta claramente em <strong>A)</strong> e <strong>B)</strong> para facilitar a pontuação no espelho da FGV.
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAtualizarQuestao(chave, '')}
                      className="text-red-400 hover:text-red-300 transition underline cursor-pointer"
                    >
                      Limpar resposta
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()
      )}

      {/* 3. ABA DE RESULTADO INTEGRAL & ESPELHO OFICIAL FGV (10,00 PONTOS) */}
      {abaCaderno === 'resultado' && (
        <div className="space-y-4">
          {resultadoIntegral ? (
            <div className="space-y-4">
              {/* Card de Desempenho Global */}
              <div
                className={`rounded-2xl border p-5 shadow-lg space-y-4 ${
                  resultadoIntegral.aprovado
                    ? 'border-emerald-500/50 bg-gradient-to-br from-[#163326] via-[#1b3d2f] to-[#12281e]'
                    : 'border-amber-500/50 bg-gradient-to-br from-[#38262b] via-[#2d2225] to-[#201a1c]'
                }`}
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
                        resultadoIntegral.aprovado
                          ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
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
                        <span className="text-[11px] text-slate-300 font-mono">
                          Data: {resultadoIntegral.data}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-white mt-0.5">
                        Nota Final: {resultadoIntegral.notaTotal.toFixed(2)} de 10,00 pontos
                      </h3>
                      <p className="text-xs text-slate-300">
                        {resultadoIntegral.aprovado
                          ? 'Parabéns! Sua nota superou o ponto de corte oficial da FGV (6,00 pontos).'
                          : 'A nota necessária para aprovação é 6,00. Analise os critérios pendentes no espelho abaixo.'}
                      </p>
                    </div>
                  </div>

                  {/* Resumo em Cards */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="bg-white/90 dark:bg-[#1b232e]/80 border border-black/10 dark:border-slate-700 rounded-xl p-2.5 text-center min-w-[90px]">
                      <div className="text-[10px] text-zinc-500 dark:text-slate-400 font-semibold">Peça Prática</div>
                      <div className="font-mono text-base font-bold text-sky-600 dark:text-sky-400">
                        {resultadoIntegral.notaPeca.toFixed(2)} / 5,00
                      </div>
                    </div>
                    <div className="bg-white/90 dark:bg-[#1b232e]/80 border border-black/10 dark:border-slate-700 rounded-xl p-2.5 text-center min-w-[90px]">
                      <div className="text-[10px] text-zinc-500 dark:text-slate-400 font-semibold">Questão 1</div>
                      <div className="font-mono text-base font-bold text-amber-600 dark:text-amber-300">
                        {resultadoIntegral.notaQ1.toFixed(2)} / 1,25
                      </div>
                    </div>
                    <div className="bg-white/90 dark:bg-[#1b232e]/80 border border-black/10 dark:border-slate-700 rounded-xl p-2.5 text-center min-w-[90px]">
                      <div className="text-[10px] text-zinc-500 dark:text-slate-400 font-semibold">Questão 2</div>
                      <div className="font-mono text-base font-bold text-amber-600 dark:text-amber-300">
                        {resultadoIntegral.notaQ2.toFixed(2)} / 1,25
                      </div>
                    </div>
                    <div className="bg-white/90 dark:bg-[#1b232e]/80 border border-black/10 dark:border-slate-700 rounded-xl p-2.5 text-center min-w-[90px]">
                      <div className="text-[10px] text-zinc-500 dark:text-slate-400 font-semibold">Questão 3</div>
                      <div className="font-mono text-base font-bold text-amber-600 dark:text-amber-300">
                        {resultadoIntegral.notaQ3.toFixed(2)} / 1,25
                      </div>
                    </div>
                    <div className="bg-white/90 dark:bg-[#1b232e]/80 border border-black/10 dark:border-slate-700 rounded-xl p-2.5 text-center min-w-[90px]">
                      <div className="text-[10px] text-zinc-500 dark:text-slate-400 font-semibold">Questão 4</div>
                      <div className="font-mono text-base font-bold text-amber-600 dark:text-amber-300">
                        {resultadoIntegral.notaQ4.toFixed(2)} / 1,25
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detalhamento dos Espelhos Oficiais FGV */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Espelho da Peça Prática */}
                <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-black/10 dark:border-slate-700 pb-2">
                    <span className="font-bold text-zinc-900 dark:text-white text-sm flex items-center gap-2">
                      <Scale className="h-4 w-4 text-sky-500 dark:text-sky-400" /> Espelho Oficial da Peça ({simulado.peca.peca})
                    </span>
                    <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">
                      {resultadoIntegral.notaPeca.toFixed(2)} / 5,00
                    </span>
                  </div>

                  <div className="space-y-2">
                    {resultadoIntegral.criteriosPeca.map(crit => (
                      <div
                        key={crit.id}
                        className="rounded-xl border border-black/10 dark:border-slate-700 bg-slate-50 dark:bg-zinc-900 p-2.5 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-zinc-900 dark:text-white">{crit.item}</span>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(crit.status)}
                            <span className="font-mono text-[11px] font-bold text-zinc-700 dark:text-slate-300">
                              {crit.pontosObtidos.toFixed(2)} / {crit.pontosMax.toFixed(2)} pt
                            </span>
                          </div>
                        </div>
                        <p className="text-[11px] text-zinc-600 dark:text-slate-400">{crit.comentario}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Espelho das 4 Questões Discursivas */}
                <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-black/10 dark:border-slate-700 pb-2">
                    <span className="font-bold text-zinc-900 dark:text-white text-sm flex items-center gap-2">
                      <FileCheck2 className="h-4 w-4 text-amber-500 dark:text-amber-400" /> Espelho das 4 Questões Discursivas
                    </span>
                    <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                      {(resultadoIntegral.notaQ1 + resultadoIntegral.notaQ2 + resultadoIntegral.notaQ3 + resultadoIntegral.notaQ4).toFixed(2)} / 5,00
                    </span>
                  </div>

                  <div className="space-y-2">
                    {resultadoIntegral.criteriosQuestoes.map((crit, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-black/10 dark:border-slate-700 bg-slate-50 dark:bg-zinc-900 p-2.5 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-zinc-900 dark:text-white">
                            Questão {crit.questaoNum} • Item {crit.item}
                          </span>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(crit.status)}
                            <span className="font-mono text-[11px] font-bold text-zinc-700 dark:text-slate-300">
                              {crit.pontosObtidos.toFixed(2)} / {crit.pontosMax.toFixed(2)} pt
                            </span>
                          </div>
                        </div>
                        <p className="text-[11px] text-zinc-600 dark:text-slate-400">{crit.descricao}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-black/15 dark:border-white/15 bg-slate-50 dark:bg-zinc-800/60 p-8 text-center space-y-3">
              <Trophy className="h-10 w-10 text-zinc-400 dark:text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">Nenhuma correção integral realizada ainda</h3>
              <p className="text-xs text-zinc-600 dark:text-slate-300 max-w-md mx-auto">
                Preencha a Peça e as 4 Questões nos campos do caderno e clique em <strong>"Corrigir Prova Completa"</strong> para receber a nota oficial de 0 a 10,00 pontos conforme os critérios da banca FGV.
              </p>
              <button
                type="button"
                onClick={corrigirSimuladoIntegral}
                className="rounded-full bg-emerald-600 hover:bg-emerald-500 px-5 py-2 text-xs font-bold text-white transition shadow-md inline-flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Avaliar Agora com os Espelhos FGV</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODAL COM O PADRÃO OFICIAL DE RESPOSTA COMPLETO FGV */}
      {modalGabaritoAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <div className="win11-modal max-w-3xl w-full max-h-[85vh] flex flex-col p-5 bg-white dark:bg-zinc-900 border border-black/15 dark:border-slate-700 rounded-2xl shadow-2xl text-zinc-900 dark:text-zinc-100">
            <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-slate-700">
              <div>
                <span className="badge b-AMARELO text-[10px]">Padrão de Resposta Oficial da Banca FGV</span>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white mt-1">
                  Espelho Completo: {simulado.titulo}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalGabaritoAberto(false)}
                className="p-1.5 rounded-lg text-zinc-400 dark:text-slate-400 hover:text-zinc-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 py-4 pr-1 text-xs text-zinc-800 dark:text-slate-200">
              {/* Gabarito da Peça */}
              <div className="rounded-xl border border-sky-500/40 bg-sky-50 dark:bg-sky-950/20 p-3 space-y-2">
                <h4 className="font-bold text-sky-700 dark:text-sky-300 text-sm flex items-center gap-2">
                  <Scale className="h-4 w-4" /> Peça Prático-Profissional (5,00 pts): {simulado.peca.peca}
                </h4>
                <div className="space-y-1.5">
                  {simulado.peca.espelhoCorrecao.map(crit => (
                    <div key={crit.id} className="flex items-start justify-between gap-3 text-xs border-b border-black/5 dark:border-slate-800 pb-1">
                      <div>
                        <strong className="text-zinc-900 dark:text-white">{crit.item}: </strong>
                        <span className="text-zinc-600 dark:text-slate-300">{crit.descricao}</span>
                      </div>
                      <span className="font-mono text-sky-600 dark:text-sky-400 font-bold shrink-0">{crit.pontos.toFixed(2)} pt</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gabarito das 4 Questões */}
              {simulado.questoes.map(q => (
                <div key={q.numero} className="rounded-xl border border-black/10 dark:border-slate-700 bg-slate-50 dark:bg-zinc-900 p-3 space-y-2">
                  <h4 className="font-bold text-amber-700 dark:text-amber-300 text-sm">
                    Questão {q.numero} (1,25 pts) • {q.titulo}
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/5 space-y-1">
                      <div className="flex items-center justify-between font-bold text-sky-700 dark:text-sky-300">
                        <span>Gabarito Item A)</span>
                        <span className="font-mono">0,65 pt</span>
                      </div>
                      <p className="text-zinc-700 dark:text-slate-200">{q.itemA.gabaritoEsperado}</p>
                      <div className="text-[11px] text-sky-600 dark:text-sky-400 font-mono">
                        Fundamentos: {q.itemA.fundamentos.join(' • ')}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/5 space-y-1">
                      <div className="flex items-center justify-between font-bold text-teal-700 dark:text-teal-300">
                        <span>Gabarito Item B)</span>
                        <span className="font-mono">0,60 pt</span>
                      </div>
                      <p className="text-zinc-700 dark:text-slate-200">{q.itemB.gabaritoEsperado}</p>
                      <div className="text-[11px] text-teal-600 dark:text-teal-400 font-mono">
                        Fundamentos: {q.itemB.fundamentos.join(' • ')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-black/10 dark:border-slate-700 flex justify-end">
              <button
                type="button"
                onClick={() => setModalGabaritoAberto(false)}
                className="rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 px-4 py-2 text-xs font-semibold text-zinc-900 dark:text-white transition cursor-pointer"
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
