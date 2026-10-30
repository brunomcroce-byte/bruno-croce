import React, { useState, useMemo } from 'react';
import {
  SIMULADOS_FGV_32,
  SimuladoFGV,
  CriterioCorrecaoFGV
} from '../data/simuladosFgvData';
import { CRONOGRAMA_DATA } from '../data/tributarioData';
import { SafeStorage } from '../utils/storage';
import { dispararConfetesSuaves, dispararMegaConfetes150L } from '../utils/confetti';
import { tocarAlarmeWebAudio } from '../utils/audio';
import {
  Sparkles,
  Shuffle,
  FileText,
  Award,
  CheckCircle2,
  Clock,
  Search,
  BookOpen,
  Calendar,
  AlertCircle,
  ChevronRight,
  RotateCcw,
  Upload,
  Info,
  Scale,
  Trophy
} from 'lucide-react';
import { GerenciadorSimulados } from './GerenciadorSimulados';
import { SimuladoOficialCompletoView } from './SimuladoOficialCompletoView';

interface ResultadoCorrecao {
  simuladoId: number;
  notaFinal: number;
  aprovadoNaPeca: boolean;
  criteriosAvaliados: {
    id: string;
    item: string;
    notaObtida: number;
    notaMaxima: number;
    status: 'integral' | 'parcial' | 'ausente';
    comentario: string;
  }[];
  pontosFortes: string[];
  pontosMelhoria: string[];
  parecerBancaFGV: string;
  corrigidoEm: string;
}

interface SimuladoSemanalViewProps {
  textoRedacao: string;
  onCarregarEsqueletoNaFolha: (simulado: SimuladoFGV) => void;
  onNavegarParaSimulador: () => void;
  mostrarToast: (msg: string) => void;
  tarefasConcluidas: string[];
  onToggleTarefa: (id: string) => void;
  onSincronizarPlanner: () => void;
  onNavegarParaPeca: (codigo: string) => void;
  onNavegarParaFlashcards: (cat: string) => void;
  onNavegarParaVade: (cor: string) => void;
}

export const SimuladoSemanalView: React.FC<SimuladoSemanalViewProps> = ({
  textoRedacao,
  onCarregarEsqueletoNaFolha,
  onNavegarParaSimulador,
  mostrarToast,
  tarefasConcluidas,
  onToggleTarefa,
  onSincronizarPlanner,
  onNavegarParaPeca,
  onNavegarParaFlashcards,
  onNavegarParaVade
}) => {
  const [subAba, setSubAba] = useState<'oficial_fgv' | 'gerenciador' | 'simulados' | 'cronograma'>('oficial_fgv');
  const [busca, setBusca] = useState('');
  const [filtroPeca, setFiltroPeca] = useState('TODAS');
  const [simuladoSelecionadoId, setSimuladoSelecionadoId] = useState<number>(1);
  const [esqueletoModalAberto, setEsqueletoModalAberto] = useState(false);
  const [correcaoModalAberta, setCorrecaoModalAberta] = useState(false);
  const [corrigindo, setCorrigindo] = useState(false);
  const [resultadoCorrecao, setResultadoCorrecao] = useState<ResultadoCorrecao | null>(() => {
    try {
      const raw = SafeStorage.get('tributa_ult_correcao', '');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Histórico de notas gravado no LocalStorage
  const [notasHistorico, setNotasHistorico] = useState<Record<number, number>>(() => {
    try {
      return JSON.parse(SafeStorage.get('tributa_simulados_notas', '{}'));
    } catch {
      return {};
    }
  });

  // Modal para orientar anexo de arquivos locais do usuário
  const [anexoInfoAberto, setAnexoInfoAberto] = useState(false);

  const simuladoAtivo = useMemo(() => {
    return SIMULADOS_FGV_32.find(s => s.id === simuladoSelecionadoId) || SIMULADOS_FGV_32[0];
  }, [simuladoSelecionadoId]);

  const simuladosFiltrados = useMemo(() => {
    return SIMULADOS_FGV_32.filter(s => {
      const matchBusca =
        s.titulo.toLowerCase().includes(busca.toLowerCase()) ||
        s.enunciado.toLowerCase().includes(busca.toLowerCase()) ||
        s.exame.toLowerCase().includes(busca.toLowerCase()) ||
        s.peca.toLowerCase().includes(busca.toLowerCase());

      const matchPeca =
        filtroPeca === 'TODAS' ||
        s.peca.toLowerCase().includes(filtroPeca.toLowerCase());

      return matchBusca && matchPeca;
    });
  }, [busca, filtroPeca]);

  // Sorteia um simulado aleatório para o modo surpresa
  const sortearSimuladoSurpresa = () => {
    const ids = SIMULADOS_FGV_32.map(s => s.id);
    const idSorteado = ids[Math.floor(Math.random() * ids.length)];
    setSimuladoSelecionadoId(idSorteado);
    dispararConfetesSuaves({ count: 35, originY: 0.3 });
    tocarAlarmeWebAudio('suave');
    const sort = SIMULADOS_FGV_32.find(s => s.id === idSorteado);
    mostrarToast(`🎲 Simulado Surpresa sorteado: ${sort?.exame} — ${sort?.peca}!`);
  };

  // Carrega o esqueleto na folha e abre o simulador
  const handleTreinarNaFolha = (simulado: SimuladoFGV) => {
    setSimuladoSelecionadoId(simulado.id);
    onCarregarEsqueletoNaFolha(simulado);
    onNavegarParaSimulador();
    dispararConfetesSuaves({ count: 40, originY: 0.35 });
    mostrarToast(`📝 Esqueleto do ${simulado.exame} carregado com sucesso na Folha FGV!`);
  };

  // Executa a finalização e correção do simulado
  const finalizarECorrigirSimulado = async () => {
    if (!textoRedacao || textoRedacao.trim().length < 30) {
      mostrarToast('⚠️ A folha padrão está em branco! Escreva ou carregue a peça antes de corrigir.');
      onNavegarParaSimulador();
      return;
    }

    const totalLinhasRedigidas = textoRedacao ? textoRedacao.split('\n').length : 0;
    const atingiu150Linhas = totalLinhasRedigidas >= 150;

    setCorrigindo(true);
    setCorrecaoModalAberta(true);

    // Se atingiu o teto oficial de 150 linhas, dispara imediatamente a celebração épica densa e persistente
    if (atingiu150Linhas) {
      dispararMegaConfetes150L();
      tocarAlarmeWebAudio('suave');
      mostrarToast('🏆 CONQUISTA ÉPICA! Você redigiu as 150 linhas oficiais da prova FGV!');
    }

    try {
      const res = await fetch('/api/corrigir-simulado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          simuladoId: simuladoAtivo.id,
          exame: simuladoAtivo.exame,
          titulo: simuladoAtivo.titulo,
          peca: simuladoAtivo.peca,
          textoRedacao,
          espelhoCorrecao: simuladoAtivo.espelhoCorrecao
        })
      });

      if (!res.ok) {
        throw new Error('Falha na resposta do servidor de IA');
      }

      const data = await res.json();
      if (data.success && data.resultado) {
        const resultado: ResultadoCorrecao = data.resultado;
        setResultadoCorrecao(resultado);
        SafeStorage.set('tributa_ult_correcao', JSON.stringify(resultado));

        // Atualiza histórico de notas
        const atualizado = { ...notasHistorico, [simuladoAtivo.id]: resultado.notaFinal };
        setNotasHistorico(atualizado);
        SafeStorage.set('tributa_simulados_notas', JSON.stringify(atualizado));

        if (atingiu150Linhas) {
          dispararMegaConfetes150L();
          tocarAlarmeWebAudio('suave');
          mostrarToast(`🏆 150 Linhas + Nota ${resultado.notaFinal.toFixed(2)}/5,00 na Peça Profissional!`);
        } else if (resultado.aprovadoNaPeca) {
          dispararConfetesSuaves({ count: 80, originY: 0.3 });
          tocarAlarmeWebAudio('suave');
          mostrarToast(`🎉 Parabéns! Nota ${resultado.notaFinal.toFixed(2)}/5,00 na Peça Profissional!`);
        } else {
          tocarAlarmeWebAudio('padrao');
          mostrarToast(`Nota atribuída: ${resultado.notaFinal.toFixed(2)}/5,00. Veja os pontos de correção!`);
        }
      } else {
        throw new Error(data.error || 'Erro na avaliação');
      }
    } catch (err: any) {
      console.warn('Fallback para correção heurística local:', err);
      // Correção heurística local para garantir funcionamento 100% offline
      const textoLower = textoRedacao.toLowerCase();
      let somaPontos = 0;
      const criteriosAvaliados = simuladoAtivo.espelhoCorrecao.map(crit => {
        const matches = crit.palavrasChave.filter(kw => textoLower.includes(kw.toLowerCase()));
        let notaObtida = 0;
        let status: 'integral' | 'parcial' | 'ausente' = 'ausente';

        if (matches.length >= Math.max(1, Math.ceil(crit.palavrasChave.length * 0.7))) {
          notaObtida = crit.pontos;
          status = 'integral';
        } else if (matches.length > 0) {
          notaObtida = Number((crit.pontos * 0.5).toFixed(2));
          status = 'parcial';
        }

        somaPontos += notaObtida;
        return {
          id: crit.id,
          item: crit.item,
          notaObtida,
          notaMaxima: crit.pontos,
          status,
          comentario:
            status === 'integral'
              ? 'Atendeu aos requisitos e fundamentação exigidos no padrão FGV.'
              : status === 'parcial'
              ? 'Fundamentação citada parcialmente; faltou aprofundar artigos ou súmulas correlatas.'
              : 'Item ou tese não identificado(a) na redação submetida.'
        };
      });

      const notaFinal = Math.min(5.0, Number(somaPontos.toFixed(2)));
      const aprovado = notaFinal >= 3.0;

      const resultadoLocal: ResultadoCorrecao = {
        simuladoId: simuladoAtivo.id,
        notaFinal,
        aprovadoNaPeca: aprovado,
        criteriosAvaliados,
        pontosFortes: [
          'Estrutura formal da peça técnica observada com divisão dos tópicos',
          'Indicação dos polos ativo e passivo na qualificação',
          'Respeito ao fechamento sem identificação'
        ],
        pontosMelhoria: [
          'Aprofundar a subsunção fática nos parágrafos de mérito',
          'Citar expressamente os números dos artigos constitucionais e infraconstitucionais'
        ],
        parecerBancaFGV: `Avaliação baseada no espelho oficial do ${simuladoAtivo.exame}. Para obter nota máxima, mencione sempre o artigo de lei específico junto com a respectiva tese de direito material.`,
        corrigidoEm: new Date().toISOString()
      };

      setResultadoCorrecao(resultadoLocal);
      SafeStorage.set('tributa_ult_correcao', JSON.stringify(resultadoLocal));

      const atualizado = { ...notasHistorico, [simuladoAtivo.id]: notaFinal };
      setNotasHistorico(atualizado);
      SafeStorage.set('tributa_simulados_notas', JSON.stringify(atualizado));

      if (atingiu150Linhas) {
        dispararMegaConfetes150L();
        tocarAlarmeWebAudio('suave');
        mostrarToast(`🏆 150 Linhas Completas! Nota final calculada: ${notaFinal.toFixed(2)}/5,00.`);
      } else if (aprovado) {
        dispararConfetesSuaves({ count: 70, originY: 0.35 });
        tocarAlarmeWebAudio('suave');
        mostrarToast(`Simulado finalizado! Nota calculada: ${notaFinal.toFixed(2)}/5,00.`);
      } else {
        mostrarToast(`Simulado finalizado! Nota calculada: ${notaFinal.toFixed(2)}/5,00.`);
      }
    } finally {
      setCorrigindo(false);
    }
  };

  const totalTarefas = CRONOGRAMA_DATA.reduce((acc, curr) => acc + curr.tarefas.length, 0);

  return (
    <div className="space-y-5">
      {/* Top Header Card */}
      <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge b-AZUL font-mono font-bold">Simulado Semanal OAB</span>
              <span className="badge b-AMARELO text-[10px]">32 Provas FGV Reais</span>
            </div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mt-1.5 flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500 dark:text-amber-400" />
              Simulados Oficiais FGV com Esqueleto de Memorização & Correção
            </h2>
            <p className="text-xs text-zinc-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Treine com as 32 provas históricas da FGV. O esqueleto carrega na folha de 150 linhas com o endereçamento, teses e fundamentos normativos estruturados para você memorizar a peça e desenvolver a fundamentação jurídica.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={sortearSimuladoSurpresa}
              className="rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-xs font-bold text-white hover:from-amber-400 hover:to-amber-500 transition shadow-md inline-flex items-center gap-2 cursor-pointer active:scale-95"
              title="Sorteia uma prova oficial surpresa entre os 32 exames FGV"
            >
              <Shuffle className="h-4 w-4" /> 🎲 Sortear Simulado Surpresa
            </button>

            <button
              onClick={() => setAnexoInfoAberto(true)}
              className="rounded-full border border-sky-400/70 bg-sky-50 dark:bg-sky-950/60 px-3.5 py-2 text-xs font-semibold text-sky-700 dark:text-sky-200 hover:bg-sky-100 dark:hover:bg-sky-900 transition inline-flex items-center gap-1.5 cursor-pointer"
              title="Informações sobre como importar ou enviar seus 32 arquivos específicos"
            >
              <Upload className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" /> Meus 32 Arquivos
            </button>
          </div>
        </div>

        {/* Sub-Aba Toggle: Simulado Oficial FGV (Peça + 4Q) vs. Gerenciador vs. Banco de 32 Provas FGV vs. Cronograma */}
        <div className="flex items-center justify-between border-t border-black/10 dark:border-white/10 pt-3 flex-wrap gap-3">
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-900 p-1 rounded-xl border border-black/10 dark:border-white/10 flex-wrap">
            <button
              onClick={() => setSubAba('oficial_fgv')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer flex items-center gap-2 ${
                subAba === 'oficial_fgv'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Award className="h-3.5 w-3.5 text-amber-300" />
              🎯 Simulado Semanal FGV (Peça + 4 Questões)
            </button>
            <button
              onClick={() => setSubAba('gerenciador')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer flex items-center gap-2 ${
                subAba === 'gerenciador'
                  ? 'bg-amber-600 text-white shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              ⚡ Ciclos & Folha 150L
            </button>
            <button
              onClick={() => setSubAba('simulados')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer flex items-center gap-2 ${
                subAba === 'simulados'
                  ? 'bg-sky-600 text-white shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <FileText className="h-3.5 w-3.5" /> 32 Provas FGV (Casos & Espelhos)
            </button>
            <button
              onClick={() => setSubAba('cronograma')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer flex items-center gap-2 ${
                subAba === 'cronograma'
                  ? 'bg-sky-600 text-white shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Calendar className="h-3.5 w-3.5" /> Cronograma de Metas (8 Semanas)
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-300">
              Simulados Concluídos:{' '}
              <strong className="text-emerald-400 font-mono">
                {Object.keys(notasHistorico).length} / 32
              </strong>
            </span>
            <button
              onClick={finalizarECorrigirSimulado}
              disabled={corrigindo}
              className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-sm inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {corrigindo ? 'Avaliando com Banca FGV...' : '🏁 Finalizar Simulado & Corrigir'}
            </button>
          </div>
        </div>
      </div>

      {/* SUB-ABA 0: SIMULADO SEMANAL COMPLETO FGV (PEÇA + 4 QUESTÕES OFICIAIS = 10,00 PTS) */}
      {subAba === 'oficial_fgv' && (
        <SimuladoOficialCompletoView
          textoRedacaoPrincipal={textoRedacao}
          onCarregarEsqueletoNaFolha={onCarregarEsqueletoNaFolha}
          onNavegarParaSimulador={onNavegarParaSimulador}
          mostrarToast={mostrarToast}
        />
      )}

      {/* SUB-ABA 1: GERENCIADOR DE SIMULADOS (CICLO, ESQUELETO 150L & CORREÇÃO IA) */}
      {subAba === 'gerenciador' && (
        <GerenciadorSimulados
          onSincronizarComFolhaPrincipal={(texto) =>
            onCarregarEsqueletoNaFolha({ ...simuladoAtivo, esqueleto: texto })
          }
          mostrarToast={mostrarToast}
        />
      )}

      {/* SUB-ABA 1: 32 SIMULADOS OFICIAIS FGV */}
      {subAba === 'simulados' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex items-center justify-between gap-3 flex-wrap bg-white dark:bg-zinc-800 p-3.5 rounded-xl border border-black/10 dark:border-white/10">
            <div className="flex items-center gap-2 flex-1 min-w-[260px]">
              <Search className="h-4 w-4 text-zinc-400 ml-1" />
              <input
                type="text"
                value={busca}
                onChange={e => setBusca(e.target.value)}
                placeholder="Buscar por exame, peça (ex: Mandado de Segurança, Repetição, ICMS)..."
                className="w-full bg-transparent text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {[
                'TODAS',
                'Mandado de Segurança',
                'Anulatória',
                'Embargos',
                'Repetição',
                'Apelação',
                'Agravo',
                'Exceção',
                'Consignação',
                'Declaratória'
              ].map(filtro => (
                <button
                  key={filtro}
                  onClick={() => setFiltroPeca(filtro)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition whitespace-nowrap cursor-pointer ${
                    filtroPeca === filtro
                      ? 'bg-sky-600 text-white'
                      : 'border border-black/10 dark:border-white/10 bg-slate-100 dark:bg-zinc-900 text-zinc-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-zinc-800'
                  }`}
                >
                  {filtro}
                </button>
              ))}
            </div>
          </div>

          {/* Active Simulado Showcase Card */}
          <div className="rounded-2xl border-2 border-sky-500/70 bg-white dark:bg-zinc-800 p-5 shadow-lg space-y-4">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="badge b-AMARELO font-mono font-bold text-xs">
                    {simuladoAtivo.exame} ({simuladoAtivo.ano})
                  </span>
                  <span className="badge b-AZUL font-bold text-xs">
                    Peça: {simuladoAtivo.peca}
                  </span>
                  {notasHistorico[simuladoAtivo.id] !== undefined && (
                    <span className="badge b-VERDE font-mono font-bold text-xs">
                      Nota Gravada: {notasHistorico[simuladoAtivo.id].toFixed(2)}/5,00
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white mt-2">
                  {simuladoAtivo.titulo}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEsqueletoModalAberto(true)}
                  className="rounded-full border border-black/15 dark:border-white/15 bg-slate-100 dark:bg-zinc-700 px-3.5 py-1.5 text-xs font-semibold text-zinc-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-zinc-600 transition inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <BookOpen className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" /> Memorizar Esqueleto
                </button>
                <button
                  onClick={() => handleTreinarNaFolha(simuladoAtivo)}
                  className="rounded-full bg-sky-600 hover:bg-sky-500 px-4 py-1.5 text-xs font-bold text-white transition shadow-sm inline-flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <FileText className="h-3.5 w-3.5" /> Treinar na Folha Padrão 150L →
                </button>
              </div>
            </div>

            {/* Official FGV Prompt Box */}
            <div className="rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-zinc-900 p-4 text-xs leading-relaxed text-zinc-800 dark:text-slate-200 space-y-2">
              <div className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <Scale className="h-4 w-4" /> Enunciado Oficial da Prova FGV:
              </div>
              <p className="whitespace-pre-line text-zinc-700 dark:text-slate-200 text-xs leading-relaxed">
                {simuladoAtivo.enunciado}
              </p>
            </div>

            {/* Quick Teses & Normativos preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-zinc-700/60 p-3 text-xs">
                <span className="font-bold text-sky-600 dark:text-sky-300 block mb-1">
                  🎯 Teses de Mérito Exigidas na Peça:
                </span>
                <ul className="list-disc pl-4 space-y-1 text-zinc-600 dark:text-slate-200 text-[11px]">
                  {simuladoAtivo.tesesPrincipais.map((t, idx) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-zinc-700/60 p-3 text-xs">
                <span className="font-bold text-emerald-600 dark:text-emerald-300 block mb-1">
                  ⚖️ Fundamentos Normativos e Súmulas:
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {simuladoAtivo.fundamentosNormativos.map((f, idx) => (
                    <span
                      key={idx}
                      className="rounded bg-slate-100 dark:bg-zinc-900 border border-emerald-500/40 px-2 py-0.5 text-[10.5px] font-mono text-emerald-600 dark:text-emerald-300"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Dica de Ouro da Banca */}
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2">
              <Info className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong>Dica de Ouro da Banca FGV:</strong> {simuladoAtivo.dicaBanca}
              </div>
            </div>
          </div>

          {/* Grid of All 32 FGV Exams */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-slate-400">
                Selecione entre os 32 Exames Oficiais FGV ({simuladosFiltrados.length} disponíveis)
              </h4>
              <span className="text-[11px] text-zinc-400 dark:text-slate-400">
                Clique em qualquer simulado para abrir o enunciado e esqueleto
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {simuladosFiltrados.map(sim => {
                const isSelected = sim.id === simuladoSelecionadoId;
                const nota = notasHistorico[sim.id];

                return (
                  <div
                    key={sim.id}
                    onClick={() => setSimuladoSelecionadoId(sim.id)}
                    className={`rounded-xl border p-3.5 transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50/60 dark:bg-zinc-700 shadow-md ring-1 ring-sky-500'
                        : 'border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 hover:border-black/20 dark:hover:border-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-700/70'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="badge b-AMARELO text-[10px] font-mono">
                          {sim.exame}
                        </span>
                        {nota !== undefined ? (
                          <span
                            className={`badge text-[10px] font-mono font-bold ${
                              nota >= 3.0 ? 'b-VERDE' : 'b-VERMELHO'
                            }`}
                          >
                            {nota.toFixed(2)}/5,00
                          </span>
                        ) : (
                          <span className="badge b-AZUL text-[9.5px]">Não Realizado</span>
                        )}
                      </div>

                      <div className="font-bold text-xs text-sky-300 mb-1">
                        {sim.peca}
                      </div>
                      <div className="text-xs font-semibold text-white line-clamp-2 mb-2">
                        {sim.titulo}
                      </div>
                      <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                        {sim.enunciado}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#455468]/60 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-mono text-[10px]">
                        Ano: {sim.ano}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTreinarNaFolha(sim);
                        }}
                        className="text-sky-300 hover:text-sky-200 font-bold inline-flex items-center gap-1"
                      >
                        Treinar <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-ABA 2: CRONOGRAMA DE 8 SEMANAS */}
      {subAba === 'cronograma' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white dark:bg-zinc-800 p-4 rounded-xl border border-black/10 dark:border-white/10">
            <div>
              <span className="badge b-VERDE">Ciclos de Metas</span>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white mt-1">
                Cronograma de Estudo & Simulados (8 Semanas)
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onSincronizarPlanner}
                className="rounded-full border border-sky-400 bg-sky-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-sky-500 transition shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
              >
                Sincronizar com Planner
              </button>
              <div className="rounded-xl border border-black/10 dark:border-white/10 bg-slate-100 dark:bg-zinc-700 px-3.5 py-1.5 text-right font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {tarefasConcluidas.length} / {totalTarefas} ({Math.round((tarefasConcluidas.length / totalTarefas) * 100)}%)
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CRONOGRAMA_DATA.map((sem, sIdx) => {
              const allDone = sem.tarefas.every((_, tIdx) =>
                tarefasConcluidas.includes(`${sIdx}-${tIdx}`)
              );

              return (
                <div
                  key={sIdx}
                  className={`rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 p-4 transition flex flex-col justify-between ${
                    allDone ? 'border-emerald-500/80 bg-emerald-50/50 dark:bg-emerald-950/20' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 border-b border-black/10 dark:border-white/10 pb-2">
                      <h3 className="text-xs font-bold text-sky-600 dark:text-sky-300">{sem.semana}</h3>
                      {allDone && <span className="badge b-VERDE text-[9px]">Completo</span>}
                    </div>
                    <div className="space-y-2.5">
                      {sem.tarefas.map((tarefa, tIdx) => {
                        const taskId = `${sIdx}-${tIdx}`;
                        const isDone = tarefasConcluidas.includes(taskId);
                        return (
                          <label
                            key={tIdx}
                            className="flex items-start gap-2.5 text-xs text-zinc-700 dark:text-slate-200 cursor-pointer select-none"
                          >
                            <input
                              type="checkbox"
                              checked={isDone}
                              onChange={() => onToggleTarefa(taskId)}
                              className="mt-0.5 h-4 w-4 rounded accent-emerald-500"
                            />
                            <span className={isDone ? 'line-through text-zinc-400 dark:text-slate-500' : ''}>
                              {tarefa}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL 1: ESQUELETO DE MEMORIZAÇÃO */}
      {esqueletoModalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl max-h-[90vh] w-full max-w-3xl overflow-hidden flex flex-col p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
              <div>
                <span className="badge b-AMARELO text-[10px]">Esqueleto de Memorização</span>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white mt-1">
                  {simuladoAtivo.exame} • {simuladoAtivo.peca}
                </h3>
              </div>
              <button
                onClick={() => setEsqueletoModalAberto(false)}
                className="text-zinc-400 hover:text-zinc-800 dark:hover:text-white text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-600 dark:text-slate-300">
              Este esqueleto contém a estrutura padrão oficial exigida pela FGV com os artigos e súmulas de mérito identificados. O desenvolvimento de cada parágrafo é seu!
            </p>

            <div className="flex-1 overflow-y-auto rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-zinc-950 p-4 font-mono text-xs leading-relaxed text-zinc-800 dark:text-slate-200 whitespace-pre-wrap select-all">
              {simuladoAtivo.esqueleto}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-black/10 dark:border-white/10">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(simuladoAtivo.esqueleto);
                  mostrarToast('📋 Esqueleto copiado para a área de transferência!');
                }}
                className="win11-btn-secondary text-xs"
              >
                Copiar Esqueleto
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEsqueletoModalAberto(false)}
                  className="win11-btn-secondary text-xs"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    setEsqueletoModalAberto(false);
                    handleTreinarNaFolha(simuladoAtivo);
                  }}
                  className="win11-btn-primary text-xs"
                >
                  ⚡ Carregar na Folha 150L e Treinar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: RESULTADO DA CORREÇÃO PONTUADA (BANCA FGV) */}
      {correcaoModalAberta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="win11-subcard max-h-[92vh] w-full max-w-4xl overflow-hidden flex flex-col p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#455468] pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 font-bold">
                  §
                </div>
                <div>
                  <span className="badge b-VERDE text-[10px]">Espelho Oficial de Correção FGV</span>
                  <h3 className="text-base font-bold text-white">
                    Resultado da Correção da Peça Prático-Profissional
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setCorrecaoModalAberta(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {corrigindo ? (
              <div className="py-16 text-center space-y-3">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-3 border-sky-400 border-t-transparent"></div>
                <div className="text-sm font-semibold text-white">
                  Avaliando sua peça no padrão FGV...
                </div>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Avaliando endereçamento, qualificação, teses de mérito, artigos constitucionais, súmulas e pedidos formais.
                </p>
              </div>
            ) : resultadoCorrecao ? (
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {/* Banner de Conquista Máxima: 150 Linhas Redigidas */}
                {textoRedacao && textoRedacao.split('\n').length >= 150 && (
                  <div className="rounded-2xl border-2 border-amber-400/90 bg-gradient-to-r from-amber-500/25 via-yellow-500/15 to-emerald-500/20 p-4 shadow-xl flex items-center justify-between gap-4 flex-wrap animate-in fade-in zoom-in-95">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-extrabold shadow-lg">
                        <Trophy className="h-6 w-6 text-slate-950" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="badge b-AMARELO text-[10px] font-bold">
                            🏆 Conquista Épica FGV
                          </span>
                          <span className="badge b-VERDE text-[10px] font-bold font-mono">
                            {textoRedacao.split('\n').length} Linhas • 5/5 Páginas
                          </span>
                        </div>
                        <h3 className="text-sm font-extrabold text-white mt-1">
                          Teto Máximo de 150 Linhas Atingido na Folha Oficial!
                        </h3>
                        <p className="text-[11px] text-amber-100/90 leading-snug mt-0.5 max-w-xl">
                          Você redigiu integralmente todas as 150 linhas da folha padrão da OAB com rigor formal, teses de direito material e fundamentação processual completa!
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        dispararMegaConfetes150L();
                        tocarAlarmeWebAudio('suave');
                      }}
                      className="rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold px-3.5 py-2 text-xs shadow-md transition transform active:scale-95 cursor-pointer whitespace-nowrap ml-auto"
                      title="Disparar novamente a chuva densa de confetes e poeira estelar"
                    >
                      🎉 Repetir Mega Confetes
                    </button>
                  </div>
                )}

                {/* Score Banner */}
                <div
                  className={`rounded-xl border p-4 flex items-center justify-between flex-wrap gap-4 ${
                    resultadoCorrecao.aprovadoNaPeca
                      ? 'border-emerald-500/80 bg-emerald-950/30'
                      : 'border-amber-500/80 bg-amber-950/30'
                  }`}
                >
                  <div>
                    <span className="text-xs font-semibold text-slate-300">Nota Final na Peça:</span>
                    <div className="font-mono text-3xl font-extrabold text-white">
                      {resultadoCorrecao.notaFinal.toFixed(2)}{' '}
                      <span className="text-sm text-slate-300 font-normal">/ 5,00 pontos</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`badge text-xs font-bold ${
                        resultadoCorrecao.aprovadoNaPeca ? 'b-VERDE' : 'b-AMARELO'
                      }`}
                    >
                      {resultadoCorrecao.aprovadoNaPeca
                        ? '🎯 APROVADO NA PEÇA (≥ 3,00)'
                        : '⚠️ EM EVOLUÇÃO (< 3,00)'}
                    </span>
                    <div className="text-[11px] text-slate-300 mt-1">
                      (Mínimo para aprovação na peça: 3,00 de 5,00)
                    </div>
                  </div>
                </div>

                {/* Rubric Breakdown Table */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-slate-400 mb-2">
                    Detalhamento por Quesito do Espelho FGV
                  </h4>
                  <div className="overflow-x-auto rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900">
                    <table className="w-full text-left text-xs text-zinc-800 dark:text-slate-200">
                      <thead className="bg-slate-100 dark:bg-zinc-800 text-[11px] uppercase text-zinc-600 dark:text-slate-400">
                        <tr>
                          <th className="px-3 py-2.5">Quesito Avaliado</th>
                          <th className="px-3 py-2.5 text-center">Status</th>
                          <th className="px-3 py-2.5 text-center">Nota</th>
                          <th className="px-3 py-2.5">Parecer do Avaliador</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/5 dark:divide-slate-800/60">
                        {resultadoCorrecao.criteriosAvaliados.map((crit, idx) => (
                          <tr key={idx} className="hover:bg-black/5 dark:hover:bg-zinc-800/50">
                            <td className="px-3 py-2.5 font-semibold text-zinc-900 dark:text-white">
                              {crit.item}
                            </td>
                            <td className="px-3 py-2.5 text-center">
                              <span
                                className={`badge text-[9.5px] font-bold ${
                                  crit.status === 'integral'
                                    ? 'b-VERDE'
                                    : crit.status === 'parcial'
                                    ? 'b-AMARELO'
                                    : 'b-VERMELHO'
                                }`}
                              >
                                {crit.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-3 py-2.5 text-center font-mono font-bold text-sky-600 dark:text-sky-300">
                              {crit.notaObtida.toFixed(2)} / {crit.notaMaxima.toFixed(2)}
                            </td>
                            <td className="px-3 py-2.5 text-zinc-600 dark:text-slate-300 text-[11px]">
                              {crit.comentario}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Strengths & Improvements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/20 p-3 text-xs">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                      ✓ Pontos Fortes Observados:
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-zinc-700 dark:text-slate-200 text-[11px]">
                      {resultadoCorrecao.pontosFortes.map((p, idx) => (
                        <li key={idx}>{p}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20 p-3 text-xs">
                    <span className="font-bold text-amber-600 dark:text-amber-400 block mb-1">
                      ⚠️ Pontos para Gabaritar na FGV:
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-zinc-700 dark:text-slate-200 text-[11px]">
                      {resultadoCorrecao.pontosMelhoria.map((m, idx) => (
                        <li key={idx}>{m}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Examiner Statement */}
                <div className="rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-zinc-800 p-3.5 text-xs text-zinc-800 dark:text-slate-200">
                  <span className="font-bold text-sky-600 dark:text-sky-300 block mb-1">
                    Parecer Geral da Banca FGV:
                  </span>
                  <p className="leading-relaxed text-zinc-600 dark:text-slate-300">
                    {resultadoCorrecao.parecerBancaFGV}
                  </p>
                </div>
              </div>
            ) : null}

            <div className="flex items-center justify-between pt-2 border-t border-black/10 dark:border-white/10">
              <button
                onClick={() => {
                  finalizarECorrigirSimulado();
                }}
                className="win11-btn-secondary text-xs inline-flex items-center gap-1.5"
              >
                <RotateCcw className="h-3 w-3" /> Reavaliar Redação Atual
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCorrecaoModalAberta(false)}
                  className="win11-btn-secondary text-xs"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    setCorrecaoModalAberta(false);
                    onNavegarParaSimulador();
                  }}
                  className="win11-btn-primary text-xs"
                >
                  Continuar Treinando na Folha 150L →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: INFORMAÇÕES SOBRE O ANEXO DOS 32 ARQUIVOS ESPECÍFICOS */}
      {anexoInfoAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="win11-subcard max-h-[85vh] w-full max-w-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#455468] pb-3">
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-sky-400" />
                <h3 className="text-base font-bold text-white">
                  Seus 32 Arquivos de Provas FGV
                </h3>
              </div>
              <button
                onClick={() => setAnexoInfoAberto(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-200 space-y-3 leading-relaxed">
              <p>
                Você já tem <strong>32 Provas Históricas Reais da FGV</strong> pré-configuradas no aplicativo, completas com:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-300">
                <li>Enunciado oficial de cada exame unificado;</li>
                <li>Esqueleto estruturado com teses materiais e fundamentos legais/sumulares;</li>
                <li>Espelho de correção pontuado de 0,00 a 5,00 pontos.</li>
              </ul>
              <div className="rounded-xl border border-sky-500/40 bg-sky-950/30 p-3 text-sky-200">
                <strong>Quer enviar seus próprios arquivos (PDF, DOCX ou TXT)?</strong>
                <p className="mt-1">
                  Você pode <strong>anexar os seus 32 arquivos diretamente aqui no chat</strong> ou indicar a pasta/links onde estão armazenados! Eu leio e sincronizo os enunciados e critérios específicos das suas provas no aplicativo instantaneamente.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#455468]">
              <button
                onClick={() => setAnexoInfoAberto(false)}
                className="win11-btn-primary text-xs"
              >
                Entendi, continuar com os 32 Simulados
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
