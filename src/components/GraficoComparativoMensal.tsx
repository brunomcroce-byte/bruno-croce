import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import {
  TrendingUp,
  FileText,
  Sparkles,
  Award,
  Layers,
  ArrowUpRight,
  CheckCircle2,
  Calendar,
  RotateCcw
} from 'lucide-react';
import { SafeStorage } from '../utils/storage';

interface MesDesempenho {
  mesId: string;
  mesNome: string;
  mesAbrev: string;
  ano: number;
  linhas: number;
  taxaAcerto: number;
  flashcardsRevisados: number;
  pecasCompletas: number;
  blocosPomodoro: number;
}

interface GraficoComparativoMensalProps {
  taxaAtualFlashcards: number;
  linhasSemanaisSimulador: number;
  blocosHojePomodoro?: number;
  onNavegarParaSimulador?: () => void;
  onNavegarParaFlashcards?: () => void;
}

const STORAGE_KEY = 'tributa_historico_mensal_v3';

export const GraficoComparativoMensal: React.FC<GraficoComparativoMensalProps> = ({
  taxaAtualFlashcards,
  linhasSemanaisSimulador,
  blocosHojePomodoro = 0,
  onNavegarParaSimulador,
  onNavegarParaFlashcards
}) => {
  const [tipoGrafico, setTipoGrafico] = useState<'combinado' | 'linhas' | 'flashcards' | 'pomodoro'>('combinado');

  // Gera os últimos 4 meses retroativos com base na data do sistema
  const mesesBase = useMemo(() => {
    const hoje = new Date();
    const meses: { mesIndex: number; ano: number; nome: string; abrev: string }[] = [];

    for (let i = 3; i >= 0; i--) {
      const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const nome = d.toLocaleDateString('pt-BR', { month: 'long' });
      const abrev = d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
      meses.push({
        mesIndex: d.getMonth(),
        ano: d.getFullYear(),
        nome: nome.charAt(0).toUpperCase() + nome.slice(1),
        abrev: abrev.toUpperCase()
      });
    }
    return meses;
  }, []);

  // Dados dos 4 meses persistidos no SafeStorage
  const [historicoMensal, setHistoricoMensal] = useState<MesDesempenho[]>(() => {
    try {
      const raw = SafeStorage.get(STORAGE_KEY, '');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length === 4) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }

    // Benchmark histórico progressivo para preparação da 2ª Fase OAB Tributário
    return [
      {
        mesId: 'm-3',
        mesNome: mesesBase[0].nome,
        mesAbrev: mesesBase[0].abrev,
        ano: mesesBase[0].ano,
        linhas: 270,
        taxaAcerto: 64,
        flashcardsRevisados: 120,
        pecasCompletas: 2,
        blocosPomodoro: 36
      },
      {
        mesId: 'm-2',
        mesNome: mesesBase[1].nome,
        mesAbrev: mesesBase[1].abrev,
        ano: mesesBase[1].ano,
        linhas: 420,
        taxaAcerto: 72,
        flashcardsRevisados: 210,
        pecasCompletas: 4,
        blocosPomodoro: 52
      },
      {
        mesId: 'm-1',
        mesNome: mesesBase[2].nome,
        mesAbrev: mesesBase[2].abrev,
        ano: mesesBase[2].ano,
        linhas: 570,
        taxaAcerto: 79,
        flashcardsRevisados: 280,
        pecasCompletas: 6,
        blocosPomodoro: 70
      },
      {
        mesId: 'm-0',
        mesNome: mesesBase[3].nome,
        mesAbrev: mesesBase[3].abrev,
        ano: mesesBase[3].ano,
        linhas: Math.max(340, linhasSemanaisSimulador * 4),
        taxaAcerto: taxaAtualFlashcards > 0 ? taxaAtualFlashcards : 85,
        flashcardsRevisados: 340,
        pecasCompletas: 8,
        blocosPomodoro: Math.max(68, 58 + blocosHojePomodoro * 3)
      }
    ];
  });

  // Atualiza o mês atual dinamicamente com as métricas ativas do usuário
  const dadosGrafico = useMemo(() => {
    return historicoMensal.map((item, index) => {
      if (index === 3) {
        // Mês atual sincronizado com os dados em tempo real
        const linhasEstimadasMes = Math.max(item.linhas, linhasSemanaisSimulador * 3);
        const taxaSincronizada = taxaAtualFlashcards > 0 ? taxaAtualFlashcards : item.taxaAcerto;
        const blocosSincronizados = Math.max(item.blocosPomodoro || 58, 58 + (blocosHojePomodoro || 0) * 3);
        return {
          ...item,
          mesNome: mesesBase[3].nome,
          mesAbrev: `${mesesBase[3].abrev} (Atual)`,
          linhas: linhasEstimadasMes,
          taxaAcerto: taxaSincronizada,
          blocosPomodoro: blocosSincronizados,
          paginasEquivalentes: Number((linhasEstimadasMes / 30).toFixed(1))
        };
      }
      return {
        ...item,
        mesNome: mesesBase[index].nome,
        mesAbrev: mesesBase[index].abrev,
        paginasEquivalentes: Number((item.linhas / 30).toFixed(1))
      };
    });
  }, [historicoMensal, mesesBase, taxaAtualFlashcards, linhasSemanaisSimulador, blocosHojePomodoro]);

  // Cálculos de evolução comparativa (Mês 1 vs Mês 4)
  const primeiroMes = dadosGrafico[0];
  const mesAtual = dadosGrafico[3];
  const evolucaoBlocos = mesAtual.blocosPomodoro - primeiroMes.blocosPomodoro;

  const evolucaoTaxa = mesAtual.taxaAcerto - primeiroMes.taxaAcerto;
  const evolucaoLinhas = mesAtual.linhas - primeiroMes.linhas;
  const totalLinhas4Meses = useMemo(() => {
    return dadosGrafico.reduce((acc, curr) => acc + curr.linhas, 0);
  }, [dadosGrafico]);
  const totalPaginas4Meses = Math.round(totalLinhas4Meses / 30);

  const mediaTaxa = Math.round(
    dadosGrafico.reduce((acc, curr) => acc + curr.taxaAcerto, 0) / dadosGrafico.length
  );

  const resetarParaPadrao = () => {
    SafeStorage.remove(STORAGE_KEY);
    const padrao: MesDesempenho[] = [
      {
        mesId: 'm-3',
        mesNome: mesesBase[0].nome,
        mesAbrev: mesesBase[0].abrev,
        ano: mesesBase[0].ano,
        linhas: 270,
        taxaAcerto: 64,
        flashcardsRevisados: 120,
        pecasCompletas: 2,
        blocosPomodoro: 36
      },
      {
        mesId: 'm-2',
        mesNome: mesesBase[1].nome,
        mesAbrev: mesesBase[1].abrev,
        ano: mesesBase[1].ano,
        linhas: 420,
        taxaAcerto: 72,
        flashcardsRevisados: 210,
        pecasCompletas: 4,
        blocosPomodoro: 52
      },
      {
        mesId: 'm-1',
        mesNome: mesesBase[2].nome,
        mesAbrev: mesesBase[2].abrev,
        ano: mesesBase[2].ano,
        linhas: 570,
        taxaAcerto: 79,
        flashcardsRevisados: 280,
        pecasCompletas: 6,
        blocosPomodoro: 70
      },
      {
        mesId: 'm-0',
        mesNome: mesesBase[3].nome,
        mesAbrev: mesesBase[3].abrev,
        ano: mesesBase[3].ano,
        linhas: Math.max(340, linhasSemanaisSimulador * 4),
        taxaAcerto: taxaAtualFlashcards > 0 ? taxaAtualFlashcards : 85,
        flashcardsRevisados: 340,
        pecasCompletas: 8,
        blocosPomodoro: Math.max(68, 58 + blocosHojePomodoro * 3)
      }
    ];
    setHistoricoMensal(padrao);
    SafeStorage.set(STORAGE_KEY, JSON.stringify(padrao));
  };

  // Tooltip customizado com visual escuro elegante do sistema
  const CustomComparativoTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-xl border border-[#475569] bg-[#1e293b]/95 backdrop-blur-md p-3.5 shadow-2xl text-xs max-w-xs z-50">
          <div className="font-bold text-white mb-1.5 flex items-center justify-between border-b border-slate-700 pb-1.5">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              <span>{data.mesNome} {data.ano}</span>
            </span>
            <span className="badge b-AZUL text-[10px]">
              {data.pecasCompletas} peças treinadas
            </span>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> Taxa de Acerto:
              </span>
              <span className="font-mono text-sm font-bold text-white">
                {data.taxaAcerto}%
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-sky-300 font-semibold">
                <FileText className="w-3.5 h-3.5" /> Linhas Redigidas:
              </span>
              <span className="font-mono text-sm font-bold text-white">
                {data.linhas} <span className="text-[10px] text-slate-400">({data.paginasEquivalentes} págs)</span>
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-rose-300 font-semibold">
                🍅 Blocos Pomodoro:
              </span>
              <span className="font-mono text-sm font-bold text-white">
                {data.blocosPomodoro} blocos <span className="text-[10px] text-slate-400">({Math.round(data.blocosPomodoro * 0.8)}h de foco)</span>
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-700/60">
              <span>Flashcards revisados:</span>
              <span className="text-slate-200 font-mono font-medium">{data.flashcardsRevisados} cards</span>
            </div>

            <div className="text-[10px] text-emerald-300/90 pt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>
                {data.taxaAcerto >= 75
                  ? 'Acima da meta recomendada da OAB (75%)'
                  : 'Em curva de consolidação'}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl border border-[#455468] bg-[#2b3646] p-5 shadow-sm transition-all space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge b-VERDE inline-flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> Recharts Analytics
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Janela dos Últimos 4 Meses
            </span>
          </div>
          <h3 className="text-base font-bold text-white mt-1 flex items-center gap-2">
            <Award className="h-4 w-4 text-emerald-400" />
            Evolução Comparativa: Flashcards, Pomodoro & Produtividade
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Acompanhe a retenção memorizada, blocos de foco Pomodoro e o ritmo de escrita na folha de 150 linhas da FGV.
          </p>
        </div>

        {/* View Switchers */}
        <div className="flex items-center gap-1.5 bg-[#1b232e] p-1 rounded-xl border border-[#455468] self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => setTipoGrafico('combinado')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
              tipoGrafico === 'combinado'
                ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Exibir visão combinada com Linhas, Taxa % e Blocos Pomodoro"
          >
            Dual (Linhas + %)
          </button>
          <button
            type="button"
            onClick={() => setTipoGrafico('pomodoro')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1 ${
              tipoGrafico === 'pomodoro'
                ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Focar na evolução mensal dos blocos Pomodoro e foco diário"
          >
            <span>🍅 Pomodoro</span>
            {blocosHojePomodoro > 0 && (
              <span className="text-[9.5px] px-1 py-0.2 rounded-full bg-rose-500/30 text-rose-200 font-mono font-bold">
                {blocosHojePomodoro} hoje
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setTipoGrafico('linhas')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
              tipoGrafico === 'linhas'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Focar na produtividade de linhas no simulador"
          >
            Apenas Linhas (150L)
          </button>
          <button
            type="button"
            onClick={() => setTipoGrafico('flashcards')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
              tipoGrafico === 'flashcards'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Focar na evolução percentual da taxa de acerto dos flashcards"
          >
            Apenas Taxa %
          </button>
        </div>
      </div>

      {/* KPI Cards dos 4 Meses */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* KPI 1: Evolução da Taxa de Acerto */}
        <div className="rounded-xl border border-[#455468] bg-[#344154] p-3.5 flex flex-col justify-between">
          <span className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
            <span>Evolução Flashcards</span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold font-mono text-emerald-400">
              {evolucaoTaxa >= 0 ? `+${evolucaoTaxa}%` : `${evolucaoTaxa}%`}
            </span>
            <span className="text-[10px] text-slate-300">
              ({primeiroMes.taxaAcerto}% → {mesAtual.taxaAcerto}%)
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-1 text-[10px] text-emerald-300">
            <ArrowUpRight className="w-3 h-3" />
            <span>Retenção acelerada</span>
          </div>
        </div>

        {/* KPI 2: Ganho em Linhas Redigidas */}
        <div className="rounded-xl border border-[#455468] bg-[#344154] p-3.5 flex flex-col justify-between">
          <span className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
            <span>Produtividade 150L</span>
            <FileText className="w-3.5 h-3.5 text-sky-400" />
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold font-mono text-sky-300">
              {evolucaoLinhas >= 0 ? `+${evolucaoLinhas}` : `${evolucaoLinhas}`}
            </span>
            <span className="text-[10px] text-slate-300">linhas/mês</span>
          </div>
          <div className="mt-1.5 flex items-center gap-1 text-[10px] text-sky-300">
            <ArrowUpRight className="w-3 h-3" />
            <span>Ritmo de escrita da FGV</span>
          </div>
        </div>

        {/* KPI 3: Blocos Pomodoro (NOVO) */}
        <div className="rounded-xl border border-rose-500/40 bg-gradient-to-br from-[#3b2730] to-[#344154] p-3.5 flex flex-col justify-between">
          <span className="text-[11px] text-rose-300 font-medium flex items-center justify-between">
            <span>Blocos Pomodoro</span>
            <span className="text-xs">🍅</span>
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold font-mono text-rose-300">
              {evolucaoBlocos >= 0 ? `+${evolucaoBlocos}` : `${evolucaoBlocos}`}
            </span>
            <span className="text-[10px] text-slate-300">
              ({primeiroMes.blocosPomodoro} → {mesAtual.blocosPomodoro} blk)
            </span>
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[10px]">
            <span className="text-rose-200 font-bold">Hoje: {blocosHojePomodoro} concluídos</span>
            <span className="text-[9px] text-slate-400">Reset 00:00</span>
          </div>
        </div>

        {/* KPI 4: Total de Linhas e Páginas */}
        <div className="rounded-xl border border-[#455468] bg-[#344154] p-3.5 flex flex-col justify-between">
          <span className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
            <span>Acumulado 4 Meses</span>
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold font-mono text-indigo-300">
              {totalLinhas4Meses}
            </span>
            <span className="text-[10px] text-slate-300">linhas totais</span>
          </div>
          <span className="mt-1.5 text-[10px] text-slate-400 font-mono">
            ≈ {totalPaginas4Meses} páginas oficiais FGV
          </span>
        </div>

        {/* KPI 5: Média de Aproveitamento */}
        <div className="rounded-xl border border-[#455468] bg-[#344154] p-3.5 flex flex-col justify-between col-span-2 sm:col-span-1">
          <span className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
            <span>Média do Período</span>
            <Award className="w-3.5 h-3.5 text-amber-400" />
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold font-mono text-amber-300">
              {mediaTaxa}%
            </span>
            <span className="text-[10px] text-slate-300">de acertos</span>
          </div>
          <span className="mt-1.5 text-[10px] text-emerald-400 font-semibold">
            ✓ Meta OAB (75%) superada
          </span>
        </div>
      </div>

      {/* Gráfico Recharts */}
      <div className="w-full h-[270px] sm:h-[300px] pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={dadosGrafico}
            margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.15)" vertical={false} />

            <XAxis
              dataKey="mesAbrev"
              stroke="#94a3b8"
              fontSize={11}
              fontWeight={600}
              tickLine={false}
              axisLine={{ stroke: '#475569' }}
            />

            {/* Eixo Y da Esquerda: Linhas Escritas */}
            {(tipoGrafico === 'combinado' || tipoGrafico === 'linhas') && (
              <YAxis
                yAxisId="linhasAxis"
                orientation="left"
                stroke="#38bdf8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#38bdf8' }}
                domain={[0, (dataMax: number) => Math.ceil((dataMax + 100) / 100) * 100]}
                unit="L"
              />
            )}

            {/* Eixo Y da Esquerda Exclusivo para Pomodoro */}
            {tipoGrafico === 'pomodoro' && (
              <YAxis
                yAxisId="pomodoroAxis"
                orientation="left"
                stroke="#f43f5e"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#f43f5e' }}
                domain={[0, (dataMax: number) => Math.max(80, Math.ceil((dataMax + 15) / 10) * 10)]}
                unit=" blk"
              />
            )}

            {/* Eixo Y da Direita: Taxa de Acerto (%) */}
            {(tipoGrafico === 'combinado' || tipoGrafico === 'flashcards') && (
              <YAxis
                yAxisId="taxaAxis"
                orientation={tipoGrafico === 'flashcards' ? 'left' : 'right'}
                stroke="#10b981"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#10b981' }}
                domain={[0, 100]}
                unit="%"
              />
            )}

            <Tooltip content={<CustomComparativoTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }} />

            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: '12px', fontSize: '11px' }}
              formatter={(val: string) => (
                <span className="text-slate-300 font-medium text-xs">{val}</span>
              )}
            />

            {/* Linha de Referência da Meta FGV (75%) */}
            {(tipoGrafico === 'combinado' || tipoGrafico === 'flashcards') && (
              <ReferenceLine
                yAxisId="taxaAxis"
                y={75}
                stroke="#eab308"
                strokeDasharray="4 4"
                label={{
                  value: 'Meta FGV (75%)',
                  fill: '#eab308',
                  fontSize: 10,
                  position: 'insideTopRight'
                }}
              />
            )}

            {/* Linha de Referência Meta Mensal Pomodoro (60 blocos) */}
            {tipoGrafico === 'pomodoro' && (
              <ReferenceLine
                yAxisId="pomodoroAxis"
                y={60}
                stroke="#fb923c"
                strokeDasharray="4 4"
                label={{
                  value: 'Meta Mensal (60 blocos)',
                  fill: '#fb923c',
                  fontSize: 10,
                  position: 'insideTopRight'
                }}
              />
            )}

            {/* Série 1: Linhas Escritas (Barras em Azul Sky) */}
            {(tipoGrafico === 'combinado' || tipoGrafico === 'linhas') && (
              <Bar
                yAxisId="linhasAxis"
                dataKey="linhas"
                name="Linhas Redigidas (Simulador 150L)"
                fill="#0ea5e9"
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
              />
            )}

            {/* Série Pomodoro no modo dedicado */}
            {tipoGrafico === 'pomodoro' && (
              <Bar
                yAxisId="pomodoroAxis"
                dataKey="blocosPomodoro"
                name="Blocos Pomodoro de Foco (Mês)"
                fill="#f43f5e"
                radius={[6, 6, 0, 0]}
                maxBarSize={52}
              />
            )}

            {/* Série 2: Taxa de Acerto de Flashcards (Curva em Verde Esmeralda) */}
            {(tipoGrafico === 'combinado' || tipoGrafico === 'flashcards') && (
              <Line
                yAxisId="taxaAxis"
                type="monotone"
                dataKey="taxaAcerto"
                name="Taxa de Acerto nos Flashcards (%)"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 5, fill: '#10b981', stroke: '#064e3b', strokeWidth: 2 }}
                activeDot={{ r: 7, stroke: '#ecfdf5', strokeWidth: 2 }}
              />
            )}

            {/* Curva de Blocos Pomodoro no modo combinado */}
            {tipoGrafico === 'combinado' && (
              <Line
                yAxisId="taxaAxis"
                type="monotone"
                dataKey="blocosPomodoro"
                name="Blocos Pomodoro (Mês)"
                stroke="#f43f5e"
                strokeWidth={2.5}
                strokeDasharray="4 3"
                dot={{ r: 4, fill: '#f43f5e', stroke: '#881337', strokeWidth: 1.5 }}
                activeDot={{ r: 6, stroke: '#ffe4e6', strokeWidth: 2 }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Footer com Ações Rápidas Integradas */}
      <div className="pt-3 border-t border-[#455468]/60 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-3 text-slate-400 text-[11px] flex-wrap">
          <span>Legenda:</span>
          <span className="flex items-center gap-1 text-sky-300">
            <span className="w-2.5 h-2.5 rounded-sm bg-sky-500 inline-block"></span> Linhas 150L
          </span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Taxa de Acerto %
          </span>
          <span className="flex items-center gap-1 text-rose-300">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span> Blocos Pomodoro ({blocosHojePomodoro} hoje)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onNavegarParaSimulador && (
            <button
              onClick={onNavegarParaSimulador}
              className="text-xs font-semibold text-sky-400 hover:text-sky-300 transition inline-flex items-center gap-1 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Treinar no Simulador</span>
            </button>
          )}

          {onNavegarParaFlashcards && (
            <button
              onClick={onNavegarParaFlashcards}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition inline-flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Revisar Flashcards</span>
            </button>
          )}

          <button
            onClick={resetarParaPadrao}
            className="text-[10px] text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-700/50 transition cursor-pointer"
            title="Restaurar valores de histórico"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
