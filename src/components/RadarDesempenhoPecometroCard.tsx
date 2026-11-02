import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip
} from 'recharts';
import {
  Compass,
  Award,
  TrendingUp,
  Target,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  RotateCcw,
  Plus,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Layers,
  HelpCircle
} from 'lucide-react';
import { SafeStorage } from '../utils/storage';
import { ResultadoAnalisePeca } from '../utils/pecaAnalyzer';
import { tocarAlarmeWebAudio } from '../utils/audio';

export interface CategoriaPecometroData {
  categoria: 'Inicial' | 'Recursal' | 'Defesa' | 'Outras';
  label: string;
  desempenho: number; // 0 a 100
  meta: number; // meta da banca FGV (ex: 85)
  treinosCount: number;
  notaMedia: number; // 0 a 10
  pecasPrincipais: string[];
  pecaMaisTreinada: string;
  status: 'Dominado' | 'Bom' | 'Em Evolução' | 'Atenção';
  cor: string;
  corBg: string;
  descricao: string;
  dicaFGV: string;
}

interface RadarDesempenhoPecometroCardProps {
  onNavegarParaTab: (tab: string) => void;
  analisePecaAtual?: ResultadoAnalisePeca;
  linhasCount?: number;
  totalLinhasSemana?: number;
  mostrarToast?: (msg: string) => void;
}

const STORAGE_KEY_TREINOS_PECOMETRO = 'tributa_radar_pecometro_treinos_v1';

export const RadarDesempenhoPecometroCard: React.FC<RadarDesempenhoPecometroCardProps> = ({
  onNavegarParaTab,
  analisePecaAtual,
  linhasCount = 0,
  totalLinhasSemana = 0,
  mostrarToast
}) => {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<'Inicial' | 'Recursal' | 'Defesa' | 'Outras'>('Inicial');
  const [mostrarMetasFGV, setMostrarMetasFGV] = useState(true);
  const [visualizacaoModo, setVisualizacaoModo] = useState<'radar' | 'barras'>('radar');

  // Estado de treinos adicionais salvos no localStorage
  const [treinosExtras, setTreinosExtras] = useState<Record<string, number>>(() => {
    try {
      const salvo = SafeStorage.get(STORAGE_KEY_TREINOS_PECOMETRO, '');
      return salvo ? JSON.parse(salvo) : { Inicial: 4, Recursal: 2, Defesa: 3, Outras: 1 };
    } catch {
      return { Inicial: 4, Recursal: 2, Defesa: 3, Outras: 1 };
    }
  });

  // Histórico de simulados do Gerenciador de Simulados
  const historicoSimulados = useMemo(() => {
    try {
      const salvo = SafeStorage.get('tributa_historico_ciclos', '');
      return salvo ? JSON.parse(salvo) : [];
    } catch {
      return [];
    }
  }, []);

  // Classifica peça em uma das 4 categorias do Peçômetro
  const classificarPeca = (nomePeca: string): 'Inicial' | 'Recursal' | 'Defesa' | 'Outras' => {
    const nome = (nomePeca || '').toLowerCase();
    if (
      nome.includes('mandado de segurança') ||
      nome.includes('anulatória') ||
      nome.includes('repetição') ||
      nome.includes('declaratória') ||
      nome.includes('consignação') ||
      nome.includes('inicial')
    ) {
      return 'Inicial';
    }
    if (
      nome.includes('apelação') ||
      nome.includes('agravo') ||
      nome.includes('ordinário') ||
      nome.includes('recurso')
    ) {
      return 'Recursal';
    }
    if (
      nome.includes('embargos') ||
      nome.includes('exceção') ||
      nome.includes('pré-executividade') ||
      nome.includes('execução') ||
      nome.includes('epe')
    ) {
      return 'Defesa';
    }
    return 'Outras';
  };

  // Contagem dinâmica com base no histórico do simulador + treinos gravados + peça em redação ativa
  const dadosCategorias = useMemo<CategoriaPecometroData[]>(() => {
    // Conta peças do histórico de simulados
    const contagemHist = { Inicial: 0, Recursal: 0, Defesa: 0, Outras: 0 };
    const notasHist: Record<string, number[]> = { Inicial: [], Recursal: [], Defesa: [], Outras: [] };

    historicoSimulados.forEach((c: any) => {
      const cat = classificarPeca(c.peca || '');
      contagemHist[cat]++;
      if (typeof c.notaFinal === 'number' && c.notaFinal > 0) {
        notasHist[cat].push(c.notaFinal);
      }
    });

    // Peça atualmente em redação no simulador
    const pecaAtualNome = analisePecaAtual?.pecaMaisProvavel?.nome || '';
    const pecaAtualCat = classificarPeca(pecaAtualNome);
    const scoreAderenciaPecaAtual = analisePecaAtual?.pecaMaisProvavel?.probabilidade || 70;

    // Categorias fundamentadas no Peçômetro FGV
    const categoriasBase: {
      cat: 'Inicial' | 'Recursal' | 'Defesa' | 'Outras';
      label: string;
      pecas: string[];
      pecaMaisTreinadaDefault: string;
      meta: number;
      cor: string;
      corBg: string;
      descricao: string;
      dicaFGV: string;
      baseDesempenho: number;
    }[] = [
      {
        cat: 'Inicial',
        label: 'Petições Iniciais',
        pecas: ['Mandado de Segurança', 'Ação Anulatória', 'Repetição de Indébito', 'Ação Declaratória', 'Consignação em Pagamento'],
        pecaMaisTreinadaDefault: 'Mandado de Segurança (Art. 5º, LXIX CF)',
        meta: 88,
        cor: '#0078d4',
        corBg: 'rgba(0, 120, 212, 0.10)',
        descricao: 'Petições de abertura de rito comum e especial (fase pré-executiva). Maior incidência histórica na 2ª Fase OAB (mais de 60% dos exames).',
        dicaFGV: 'Atenção aos requisitos do Art. 319 do CPC, indicação de endereço profissional (Art. 77, V) e especificação cabal dos pedidos liminares.',
        baseDesempenho: 86
      },
      {
        cat: 'Recursal',
        label: 'Peças Recursais',
        pecas: ['Recurso de Apelação', 'Agravo de Instrumento', 'Agravo Interno', 'Recurso Ordinário (ROC)'],
        pecaMaisTreinadaDefault: 'Apelação Cível (Art. 1.009 CPC)',
        meta: 85,
        cor: '#0284c7',
        corBg: 'rgba(2, 132, 199, 0.10)',
        descricao: 'Impugnações a decisões interlocutórias e sentenças terminativas ou definitivas perante os Tribunais (TJ, TRF, STJ).',
        dicaFGV: 'Estruture sempre em Folha de Rosto (Interposição em 1º grau) e Folha de Razões (ao Tribunal ad quem), atacando a dialeticidade.',
        baseDesempenho: 74
      },
      {
        cat: 'Defesa',
        label: 'Defesa na Execução',
        pecas: ['Embargos à Execução Fiscal', 'Exceção de Pré-Executividade (EPE)'],
        pecaMaisTreinadaDefault: 'Embargos à Execução (Art. 16 LEF)',
        meta: 85,
        cor: '#2563eb',
        corBg: 'rgba(37, 99, 235, 0.10)',
        descricao: 'Defesas do executado após propositura da Execução Fiscal com ou sem garantia do juízo.',
        dicaFGV: 'Embargos exigem garantia prévia (Art. 16, §1º LEF). A EPE não exige garantia, mas requer prova pré-constituída (Súmula 393 STJ).',
        baseDesempenho: 80
      },
      {
        cat: 'Outras',
        label: 'Medidas Incidentais',
        pecas: ['Tutela Cautelar Antecedente', 'Contrarrazões Recursais', 'Embargos de Declaração', 'Manifestação sobre Laudo'],
        pecaMaisTreinadaDefault: 'Contrarrazões de Apelação',
        meta: 80,
        cor: '#475569',
        corBg: 'rgba(71, 85, 105, 0.10)',
        descricao: 'Peças especiais, contrarrazões e manifestações incidentais cobradas de forma esporádica ou em questões práticas.',
        dicaFGV: 'Não subestime contrarrazões; a FGV já exigiu no passado e pontua preliminares de não conhecimento e manutenção da decisão.',
        baseDesempenho: 66
      }
    ];

    return categoriasBase.map(item => {
      const extraCount = treinosExtras[item.cat] || 0;
      const histCount = contagemHist[item.cat] || 0;
      const totalTreinos = extraCount + histCount + (pecaAtualCat === item.cat ? 1 : 0);

      // Desempenho ponderado
      let scoreCalc = item.baseDesempenho;
      if (notasHist[item.cat].length > 0) {
        const mediaNotas = notasHist[item.cat].reduce((a, b) => a + b, 0) / notasHist[item.cat].length;
        scoreCalc = Math.round((mediaNotas / 10) * 100);
      } else {
        // Incrementa gradualmente com treinos e linhas escritas
        const bonusTreinos = Math.min(12, totalTreinos * 2.5);
        const bonusLinhas = Math.min(6, (totalLinhasSemana / 150) * 6);
        scoreCalc = Math.min(100, Math.round(item.baseDesempenho + bonusTreinos + bonusLinhas));
      }

      if (pecaAtualCat === item.cat && scoreAderenciaPecaAtual > 0) {
        scoreCalc = Math.round(scoreCalc * 0.7 + scoreAderenciaPecaAtual * 0.3);
      }

      const notaEquivalente = Number((scoreCalc / 10).toFixed(1));

      let status: 'Dominado' | 'Bom' | 'Em Evolução' | 'Atenção';
      if (scoreCalc >= 85) status = 'Dominado';
      else if (scoreCalc >= 75) status = 'Bom';
      else if (scoreCalc >= 65) status = 'Em Evolução';
      else status = 'Atenção';

      return {
        categoria: item.cat,
        label: item.label,
        desempenho: scoreCalc,
        meta: item.meta,
        treinosCount: totalTreinos,
        notaMedia: notaEquivalente,
        pecasPrincipais: item.pecas,
        pecaMaisTreinada: item.pecaMaisTreinadaDefault,
        status,
        cor: item.cor,
        corBg: item.corBg,
        descricao: item.descricao,
        dicaFGV: item.dicaFGV
      };
    });
  }, [historicoSimulados, treinosExtras, analisePecaAtual, totalLinhasSemana]);

  // Formato preparado para o RadarChart do Recharts
  const radarChartData = useMemo(() => {
    return dadosCategorias.map(d => ({
      categoria: d.label,
      catId: d.categoria,
      desempenho: d.desempenho,
      meta: d.meta,
      fullMark: 100,
      treinos: d.treinosCount,
      nota: d.notaMedia
    }));
  }, [dadosCategorias]);

  const catAtiva = useMemo(() => {
    return dadosCategorias.find(d => d.categoria === categoriaSelecionada) || dadosCategorias[0];
  }, [dadosCategorias, categoriaSelecionada]);

  // Média Geral do Peçômetro
  const mediaGeralPecometro = useMemo(() => {
    const soma = dadosCategorias.reduce((acc, curr) => acc + curr.desempenho, 0);
    return Math.round(soma / dadosCategorias.length);
  }, [dadosCategorias]);

  const handleSimularTreino = (cat: 'Inicial' | 'Recursal' | 'Defesa' | 'Outras') => {
    setTreinosExtras(prev => {
      const novo = { ...prev, [cat]: (prev[cat] || 0) + 1 };
      SafeStorage.set(STORAGE_KEY_TREINOS_PECOMETRO, JSON.stringify(novo));
      return novo;
    });
    tocarAlarmeWebAudio('suave');
    mostrarToast?.(`+1 Treino registrado na categoria ${cat}! Gráfico de radar recalculado.`);
  };

  const handleResetarTreinos = () => {
    const padrao = { Inicial: 4, Recursal: 2, Defesa: 3, Outras: 1 };
    setTreinosExtras(padrao);
    SafeStorage.set(STORAGE_KEY_TREINOS_PECOMETRO, JSON.stringify(padrao));
    tocarAlarmeWebAudio('suave');
    mostrarToast?.('Parâmetros de treino do Peçômetro resetados para os valores padrão.');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="macos-card-interactive rounded-3xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-800/65 backdrop-blur-xl p-5 lg:p-6 shadow-sm space-y-5 text-zinc-900 dark:text-zinc-100 relative overflow-hidden"
    >
      {/* Halo de luz de fundo translúcido para o efeito Mica / Acrylic */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 dark:bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-amber-500/10 dark:bg-purple-500/10 blur-3xl" />

      {/* CABEÇALHO DO CARD */}
      <div className="flex items-center justify-between flex-wrap gap-4 relative z-10 border-b border-black/5 dark:border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0067c0] via-[#0078d4] to-[#4cc2ff] text-white shadow-md">
            <Compass className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="badge b-AZUL text-[10px] font-bold">
                Bússola FGV • Peçômetro
              </span>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                Média Geral: {mediaGeralPecometro}%
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white mt-0.5">
              Desempenho por Categorias de Peças (Radar Recharts)
            </h3>
          </div>
        </div>

        {/* Controles de Visão */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-black/5 dark:bg-white/10 p-1 rounded-xl border border-black/10 dark:border-white/10">
            <button
              type="button"
              onClick={() => setVisualizacaoModo('radar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                visualizacaoModo === 'radar'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Gráfico Radar
            </button>
            <button
              type="button"
              onClick={() => setVisualizacaoModo('barras')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                visualizacaoModo === 'barras'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Lista Comparativa
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMostrarMetasFGV(!mostrarMetasFGV)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer inline-flex items-center gap-1.5 ${
              mostrarMetasFGV
                ? 'border-amber-400/60 bg-amber-500/10 text-amber-700 dark:text-amber-300'
                : 'border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-zinc-500'
            }`}
            title="Alternar visibilidade do polígono de Meta da Banca FGV"
          >
            <Target className="h-3.5 w-3.5" />
            <span>Meta FGV</span>
          </button>

          <button
            type="button"
            onClick={() => onNavegarParaTab('pecas')}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs transition cursor-pointer inline-flex items-center gap-1.5"
            title="Abrir o Peçômetro completo"
          >
            <span>Abrir Peçômetro</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* ÁREA CENTRAL: SPLIT RADAR RECHARTS + DETALHES DAS 4 CATEGORIAS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center relative z-10">
        {/* COLUNA ESQUERDA: O GRÁFICO DE RADAR RECHARTS (Lg: col-span-6) */}
        <div className="lg:col-span-6 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] p-4 flex flex-col items-center justify-center relative min-h-[320px]">
          {visualizacaoModo === 'radar' ? (
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="72%" data={radarChartData}>
                  <PolarGrid
                    stroke="currentColor"
                    className="text-black/15 dark:text-white/15"
                    strokeDasharray="3 3"
                  />
                  <PolarAngleAxis
                    dataKey="categoria"
                    tick={({ x, y, payload }: any) => {
                      return (
                        <text
                          x={x}
                          y={y}
                          textAnchor="middle"
                          fill="currentColor"
                          className="text-[12px] font-bold fill-zinc-700 dark:fill-zinc-200"
                        >
                          {payload.value}
                        </text>
                      );
                    }}
                  />
                  <PolarRadiusAxis
                    angle={45}
                    domain={[0, 100]}
                    stroke="currentColor"
                    className="text-black/15 dark:text-white/15"
                    tick={{ fill: '#888', fontSize: 10 }}
                  />

                  {/* Polígono de Meta FGV (Dourado/Amarelo tracejado) */}
                  {mostrarMetasFGV && (
                    <Radar
                      name="Meta de Aprovação FGV"
                      dataKey="meta"
                      stroke="#f59e0b"
                      fill="#f59e0b"
                      fillOpacity={0.12}
                      strokeWidth={2}
                      strokeDasharray="4 4"
                    />
                  )}

                  {/* Polígono de Desempenho do Aluno (Azul Ciano Fluent com Gradiente) */}
                  <Radar
                    name="Seu Desempenho Real"
                    dataKey="desempenho"
                    stroke="#0078d4"
                    fill="#0078d4"
                    fillOpacity={0.45}
                    strokeWidth={2.5}
                  />

                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="rounded-xl border border-black/15 dark:border-white/15 bg-white/95 dark:bg-zinc-800/95 backdrop-blur-md p-3 shadow-xl text-xs space-y-1.5 z-50">
                            <div className="font-bold text-zinc-900 dark:text-white border-b border-black/10 dark:border-white/10 pb-1 flex items-center justify-between gap-3">
                              <span>{data.categoria}</span>
                              <span className="font-mono text-blue-600 dark:text-blue-400">
                                Nota {data.nota}/10
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-zinc-500 dark:text-zinc-400">Desempenho Atual:</span>
                              <strong className="text-emerald-600 dark:text-emerald-400 font-mono">
                                {data.desempenho}%
                              </strong>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-zinc-500 dark:text-zinc-400">Meta da FGV:</span>
                              <span className="text-amber-600 dark:text-amber-400 font-mono font-semibold">
                                {data.meta}%
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-3 pt-1 border-t border-black/5 dark:border-white/5">
                              <span className="text-zinc-500 dark:text-zinc-400">Treinos no Simulador:</span>
                              <span className="font-bold text-zinc-800 dark:text-zinc-200">
                                {data.treinos} ciclos
                              </span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            /* VISUALIZAÇÃO EM BARRAS DE COMPARATIVO */
            <div className="w-full space-y-3 py-2">
              {dadosCategorias.map(item => (
                <div key={item.categoria} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">
                      {item.label}
                    </span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-zinc-500 dark:text-zinc-400 text-[11px]">
                        Meta: {item.meta}%
                      </span>
                      <strong className="text-emerald-600 dark:text-emerald-400 font-bold">
                        {item.desempenho}%
                      </strong>
                    </div>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden relative">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.cor }}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.desempenho}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                    {/* Linha indicadora da Meta */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10"
                      style={{ left: `${item.meta}%` }}
                      title={`Meta FGV: ${item.meta}%`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Legenda do Gráfico */}
          <div className="flex items-center justify-center gap-4 text-[11px] pt-2 border-t border-black/5 dark:border-white/5 w-full flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#0078d4]" />
              <span className="text-zinc-600 dark:text-zinc-300 font-medium">Seu Desempenho Real</span>
            </div>
            {mostrarMetasFGV && (
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full border border-dashed border-amber-500 bg-amber-500/20" />
                <span className="text-zinc-600 dark:text-zinc-300 font-medium">Meta FGV (85%)</span>
              </div>
            )}
          </div>
        </div>

        {/* COLUNA DIREITA: SELETOR DAS 4 CATEGORIAS & DIAGNÓSTICO DOUTRINÁRIO (Lg: col-span-6) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Seletor Rápido das 4 Categorias */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {dadosCategorias.map(cat => {
              const ativo = categoriaSelecionada === cat.categoria;
              return (
                <button
                  key={cat.categoria}
                  type="button"
                  onClick={() => setCategoriaSelecionada(cat.categoria)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                    ativo
                      ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/40 shadow-xs ring-1 ring-blue-500/30'
                      : 'border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/5'
                  }`}
                >
                  <div className="text-[10.5px] font-bold text-zinc-500 dark:text-zinc-400 truncate">
                    {cat.categoria}
                  </div>
                  <div className="text-base font-extrabold text-zinc-900 dark:text-white font-mono mt-0.5">
                    {cat.desempenho}%
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">
                    {cat.treinosCount} treinos
                  </div>
                </button>
              );
            })}
          </div>

          {/* PAINEL DE DETALHE DA CATEGORIA SELECIONADA */}
          <AnimatePresence mode="wait">
            <motion.div
              key={catAtiva.categoria}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800/80 space-y-3"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-900 dark:text-white">
                      {catAtiva.label}
                    </span>
                    <span
                      className={`text-[9.5px] px-2 py-0.5 rounded-full font-bold ${
                        catAtiva.status === 'Dominado'
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                          : catAtiva.status === 'Bom'
                          ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30'
                          : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {catAtiva.status}
                    </span>
                  </div>
                  <p className="text-[11.5px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {catAtiva.descricao}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-zinc-900 dark:text-white">
                    Nota: {catAtiva.notaMedia} / 10
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    {catAtiva.treinosCount} simulações realizadas
                  </div>
                </div>
              </div>

              {/* Peça Mais Treinada & Peças da Categoria */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10.5px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Peças Integrantes do Peçômetro:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {catAtiva.pecasPrincipais.map(p => (
                    <span
                      key={p}
                      className="px-2 py-0.8 rounded-lg bg-black/5 dark:bg-white/10 text-[11px] font-medium text-zinc-700 dark:text-zinc-200"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dica da Banca FGV para esta Categoria */}
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-zinc-700 dark:text-zinc-300 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-400 text-[11px]">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Dica da Banca FGV:</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {catAtiva.dicaFGV}
                </p>
              </div>

              {/* Ações Rápidas */}
              <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5 flex-wrap gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleSimularTreino(catAtiva.categoria)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition cursor-pointer inline-flex items-center gap-1"
                    title="Simular conclusão de mais 1 treino nesta categoria"
                  >
                    <Plus className="h-3 w-3 stroke-[3]" />
                    <span>+1 Treino Simulado</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetarTreinos}
                    className="p-1 rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 text-zinc-500 text-xs cursor-pointer"
                    title="Resetar parâmetros para o padrão"
                  >
                    <RotateCcw className="h-3 w-3" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onNavegarParaTab('simulador')}
                  className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-xs cursor-pointer inline-flex items-center gap-1"
                >
                  <FileText className="h-3 w-3" />
                  <span>Redigir no Simulador 150L</span>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
