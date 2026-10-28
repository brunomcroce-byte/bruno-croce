import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';
import { CRONOGRAMA_DATA } from '../data/tributarioData';
import {
  CheckCircle2,
  TrendingUp,
  BarChart2,
  Calendar,
  ArrowRight,
  Check,
  Clock
} from 'lucide-react';

interface CronogramaProgressoChartProps {
  tarefasConcluidas: string[];
  onNavigateToCronograma?: () => void;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isFinished = data.concluidas === data.total;
    return (
      <div className="rounded-xl border border-[#475569] bg-[#1e293b] p-3 shadow-xl text-xs max-w-xs z-50">
        <div className="font-bold text-white mb-1 flex items-center justify-between gap-2">
          <span>{data.semanaLabel}</span>
          {isFinished ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/40">
              <Check className="h-3 w-3" /> 100% Concluída
            </span>
          ) : data.concluidas > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/20 px-2 py-0.5 text-[10px] font-bold text-sky-400 border border-sky-500/40">
              <Clock className="h-3 w-3" /> Em andamento
            </span>
          ) : (
            <span className="rounded-full bg-slate-700/60 px-2 py-0.5 text-[10px] text-slate-400">
              Não iniciada
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-300 mb-2 leading-snug line-clamp-2">
          {data.semanaTitulo}
        </p>
        <div className="space-y-1 border-t border-[#334155] pt-2">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" /> Concluídas:
            </span>
            <strong className="text-white font-mono">{data.concluidas} de {data.total}</strong>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="h-2 w-2 rounded-full bg-slate-500 inline-block" /> Pendentes:
            </span>
            <span className="text-slate-300 font-mono">{data.pendentes}</span>
          </div>
          <div className="flex items-center justify-between text-slate-300 pt-1 font-semibold">
            <span className="text-sky-300">Taxa de Conclusão:</span>
            <span className="text-sky-300 font-mono">{data.porcentagem}%</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const CronogramaProgressoChart: React.FC<CronogramaProgressoChartProps> = ({
  tarefasConcluidas,
  onNavigateToCronograma
}) => {
  const [visualizacao, setVisualizacao] = useState<'tarefas' | 'percentual'>('tarefas');

  // Process data for the 8 weeks
  const chartData = useMemo(() => {
    return CRONOGRAMA_DATA.map((sem, sIdx) => {
      const total = sem.tarefas.length;
      const concluidas = sem.tarefas.filter((_, tIdx) =>
        tarefasConcluidas.includes(`${sIdx}-${tIdx}`)
      ).length;
      const pendentes = total - concluidas;
      const porcentagem = total > 0 ? Math.round((concluidas / total) * 100) : 0;

      return {
        semanaNum: sIdx + 1,
        semanaLabel: `Semana ${sIdx + 1}`,
        semanaAbrev: `Sem ${sIdx + 1}`,
        semanaTitulo: sem.semana,
        total,
        concluidas,
        pendentes,
        porcentagem
      };
    });
  }, [tarefasConcluidas]);

  // Overall statistics
  const totalTarefas = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.total, 0);
  }, [chartData]);

  const totalConcluidas = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.concluidas, 0);
  }, [chartData]);

  const percentualGeral = totalTarefas > 0 ? Math.round((totalConcluidas / totalTarefas) * 100) : 0;

  const semanasCompletas = useMemo(() => {
    return chartData.filter(c => c.concluidas === c.total).length;
  }, [chartData]);

  return (
    <div className="rounded-2xl border border-[#455468] bg-[#2b3646] p-5 shadow-sm transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge b-VERDE flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> Cronograma OAB
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              8 Semanas de Preparação
            </span>
          </div>
          <h3 className="text-base font-semibold text-white mt-1 flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-sky-400" />
            Progresso de Conclusão por Semana
          </h3>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1.5 bg-[#1b232e] p-1 rounded-xl border border-[#455468] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setVisualizacao('tarefas')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition ${
              visualizacao === 'tarefas'
                ? 'bg-sky-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tarefas (Qtd)
          </button>
          <button
            type="button"
            onClick={() => setVisualizacao('percentual')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition ${
              visualizacao === 'percentual'
                ? 'bg-sky-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Percentual (%)
          </button>
        </div>
      </div>

      {/* Mini KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="rounded-xl border border-[#455468] bg-[#344154] p-3">
          <span className="text-[11px] text-slate-400 font-medium block">Tarefas Feitas</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-lg font-bold font-mono text-emerald-400">{totalConcluidas}</span>
            <span className="text-xs text-slate-400 font-mono">/ {totalTarefas}</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#455468] bg-[#344154] p-3">
          <span className="text-[11px] text-slate-400 font-medium block">Progresso Geral</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-lg font-bold font-mono text-sky-400">{percentualGeral}%</span>
            <span className="text-[11px] text-slate-400">concluído</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#455468] bg-[#344154] p-3">
          <span className="text-[11px] text-slate-400 font-medium block">Semanas 100%</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-lg font-bold font-mono text-amber-300">{semanasCompletas}</span>
            <span className="text-xs text-slate-400 font-mono">/ 8</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#455468] bg-[#344154] p-3">
          <span className="text-[11px] text-slate-400 font-medium block">Ritmo Atual</span>
          <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold">
            {percentualGeral === 100 ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> Pronto p/ Aprovação!
              </span>
            ) : percentualGeral >= 50 ? (
              <span className="text-sky-300 flex items-center gap-1">
                <TrendingUp className="h-4 w-4" /> Em ritmo forte
              </span>
            ) : totalConcluidas > 0 ? (
              <span className="text-amber-300 flex items-center gap-1">
                <Clock className="h-4 w-4" /> Em andamento
              </span>
            ) : (
              <span className="text-slate-400">Inicie os estudos</span>
            )}
          </div>
        </div>
      </div>

      {/* Recharts Container */}
      <div className="w-full h-[250px] sm:h-[270px]">
        <ResponsiveContainer width="100%" height="100%">
          {visualizacao === 'tarefas' ? (
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              barGap={4}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #cbd5e1)" vertical={false} />
              <XAxis
                dataKey="semanaAbrev"
                stroke="var(--chart-axis, #64748b)"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: 'var(--chart-grid, #cbd5e1)' }}
              />
              <YAxis
                stroke="var(--chart-axis, #64748b)"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: 'var(--chart-grid, #cbd5e1)' }}
                domain={[0, 4]}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', color: '#cbd5e1' }}
                formatter={(value) => <span className="text-slate-300 text-xs">{value}</span>}
              />
              <Bar
                dataKey="concluidas"
                name="Tarefas Concluídas"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-concluidas-${index}`}
                    fill={entry.concluidas === entry.total ? '#10b981' : '#38bdf8'}
                  />
                ))}
              </Bar>
              <Bar
                dataKey="pendentes"
                name="Tarefas Pendentes"
                fill="#475569"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          ) : (
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #cbd5e1)" vertical={false} />
              <XAxis
                dataKey="semanaAbrev"
                stroke="var(--chart-axis, #64748b)"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: 'var(--chart-grid, #cbd5e1)' }}
              />
              <YAxis
                stroke="var(--chart-axis, #64748b)"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: 'var(--chart-grid, #cbd5e1)' }}
                domain={[0, 100]}
                unit="%"
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
              <Bar
                dataKey="porcentagem"
                name="Conclusão da Semana (%)"
                radius={[4, 4, 0, 0]}
                maxBarSize={36}
              >
                {chartData.map((entry, index) => {
                  let barColor = '#475569';
                  if (entry.porcentagem === 100) barColor = '#10b981';
                  else if (entry.porcentagem >= 50) barColor = '#38bdf8';
                  else if (entry.porcentagem > 0) barColor = '#f59e0b';
                  return <Cell key={`cell-pct-${index}`} fill={barColor} />;
                })}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Footer action / quick link to Cronograma */}
      {onNavigateToCronograma && (
        <div className="mt-4 pt-3 border-t border-[#455468]/60 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px]">
            Clique para marcar ou revisar as metas de cada semana
          </span>
          <button
            type="button"
            onClick={onNavigateToCronograma}
            className="inline-flex items-center gap-1.5 font-semibold text-sky-400 hover:text-sky-300 transition"
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Gerenciar Tarefas no Cronograma</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
