import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  CheckCircle2,
  FileCheck2,
  FileText,
  Sparkles,
  BookOpen,
  Edit3,
  ListTodo,
  TrendingUp,
  Check
} from 'lucide-react';
import { ESTRUTURA_CONTROLE_AULAS } from '../data/tributarioData';
import { tocarAlarmeWebAudio } from '../utils/audio';
import { dispararConfetesSuaves } from '../utils/confetti';

interface PlannerViewProps {
  plannerData: Record<string, any>;
  onPlannerUpdate: (id: string, value: any) => void;
  onSincronizarCronograma: () => void;
  onAbrirSimulador: () => void;
  subAbaPlanner: 'mensal' | 'semanal' | 'diario' | 'controle';
  setSubAbaPlanner: (aba: 'mensal' | 'semanal' | 'diario' | 'controle') => void;
  mostrarToast: (msg: string) => void;
}

export const PlannerView: React.FC<PlannerViewProps> = ({
  plannerData,
  onPlannerUpdate,
  onSincronizarCronograma,
  onAbrirSimulador,
  subAbaPlanner,
  setSubAbaPlanner,
  mostrarToast
}) => {
  // Contagem de tarefas concluídas no dia
  const tarefasDiaConcluidas = React.useMemo(() => {
    let count = 0;
    for (let i = 0; i < 10; i++) {
      if (plannerData[`plD_ck_${i}`]) count++;
    }
    return count;
  }, [plannerData]);

  // Contagem de aulas concluídas no controle
  const totalAulasConcluidas = React.useMemo(() => {
    let count = 0;
    ESTRUTURA_CONTROLE_AULAS.forEach((sec, secIdx) => {
      sec.itens.forEach((_, itIdx) => {
        if (plannerData[`plC_ck_${secIdx}_${itIdx}`]) count++;
      });
    });
    return count;
  }, [plannerData]);

  const totalAulasGerais = React.useMemo(() => {
    return ESTRUTURA_CONTROLE_AULAS.reduce((acc, curr) => acc + curr.itens.length, 0);
  }, []);

  const handleToggleTarefaDia = (i: number, checked: boolean) => {
    onPlannerUpdate(`plD_ck_${i}`, checked);
    if (checked) {
      tocarAlarmeWebAudio('suave');
      dispararConfetesSuaves({ count: 25, originY: 0.4 });
      mostrarToast(`✓ Tarefa ${i + 1} concluída com sucesso!`);
    }
  };

  const handleToggleAula = (key: string, checked: boolean, nomeItem: string) => {
    onPlannerUpdate(key, checked);
    if (checked) {
      tocarAlarmeWebAudio('suave');
      dispararConfetesSuaves({ count: 30, originY: 0.4 });
      mostrarToast(`🎓 Concluído: ${nomeItem}`);
    }
  };

  const subAbas = [
    { id: 'mensal', label: 'Planejamento Mensal', icon: Calendar, badge: '35 Dias' },
    { id: 'semanal', label: 'Planejamento Semanal', icon: Clock, badge: 'Turnos' },
    {
      id: 'diario',
      label: 'Planejamento Diário',
      icon: ListTodo,
      badge: `${tarefasDiaConcluidas}/10`
    },
    {
      id: 'controle',
      label: 'Controle de Aulas',
      icon: CheckCircle2,
      badge: `${totalAulasConcluidas}/${totalAulasGerais}`
    }
  ] as const;

  return (
    <div className="space-y-4">
      {/* HEADER DO PLANNER COM VIDRO SEQUOIA E AÇÕES */}
      <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md text-zinc-800 dark:text-zinc-100 p-4 lg:p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/20">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="badge b-AZUL text-[10px]">Ceisc OAB Tributário</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {tarefasDiaConcluidas} tarefas hoje • {Math.round((totalAulasConcluidas / totalAulasGerais) * 100)}% das aulas
                </span>
              </div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-white mt-0.5">
                Planner de Produtividade & Metas OAB
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onSincronizarCronograma}
              className="rounded-xl border border-sky-400/80 bg-sky-500/10 dark:bg-sky-500/20 px-3.5 py-2 text-xs font-semibold text-sky-700 dark:text-sky-300 hover:bg-sky-500/20 dark:hover:bg-sky-500/30 transition shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
              title="Importa até 5 metas pendentes da semana atual do Cronograma para o checklist do dia"
            >
              <FileCheck2 className="h-3.5 w-3.5 text-sky-500" />
              <span>Puxar Metas do Cronograma</span>
            </button>
            <button
              onClick={onAbrirSimulador}
              className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3.5 py-2 text-xs font-semibold text-white hover:from-emerald-500 hover:to-teal-500 transition shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Simulador 150L</span>
            </button>
          </div>
        </div>

        {/* NAVEGAÇÃO ENTRE SUB-ABAS COM TRANSIÇÕES TÁTEIS E PILL DESLIZANTE */}
        <div className="flex items-center gap-1.5 border-b border-black/10 dark:border-white/10 pb-3 flex-wrap">
          {subAbas.map(item => {
            const isActive = subAbaPlanner === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setSubAbaPlanner(item.id)}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors duration-200 inline-flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'text-white'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="planner-active-subtab"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 shadow-md shadow-sky-500/25"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </span>
                <span
                  className={`relative z-10 font-mono text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-black/5 dark:bg-white/10 text-zinc-500 dark:text-zinc-400'
                  }`}
                >
                  {item.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* CONTEÚDO COM TRANSIÇÕES SUAVES (FADE & SCALE) USANDO FRAMER MOTION */}
        <div className="pt-1 overflow-hidden min-h-[380px]">
          <AnimatePresence mode="wait">
            {/* SUB-ABA 1: PLANEJAMENTO MENSAL */}
            {subAbaPlanner === 'mensal' && (
              <motion.div
                key="mensal"
                initial={{ opacity: 0, scale: 0.98, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -8 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 flex-wrap">
                  <input
                    type="text"
                    placeholder="Mês (Ex: Novembro / Dezembro)"
                    value={plannerData['plM_mes'] || ''}
                    onChange={e => onPlannerUpdate('plM_mes', e.target.value)}
                    className="rounded-xl border border-black/15 dark:border-white/15 bg-slate-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 px-3.5 py-2 text-xs font-bold w-56 focus:outline-none focus:border-sky-500 transition"
                  />
                  <input
                    type="text"
                    placeholder="Foco prioritário do mês (ex: Gabaritar Peças e Teses de Imunidades)..."
                    value={plannerData['plM_foco'] || ''}
                    onChange={e => onPlannerUpdate('plM_foco', e.target.value)}
                    className="flex-1 min-w-[220px] rounded-xl border border-black/15 dark:border-white/15 bg-slate-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 px-3.5 py-2 text-xs focus:outline-none focus:border-sky-500 transition"
                  />
                </div>

                <textarea
                  placeholder="Tarefas e metas importantes do mês..."
                  value={plannerData['plM_tarefas'] || ''}
                  onChange={e => onPlannerUpdate('plM_tarefas', e.target.value)}
                  className="w-full h-16 rounded-xl border border-black/15 dark:border-white/15 bg-slate-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 p-3 text-xs resize-none focus:outline-none focus:border-sky-500 transition"
                />

                {/* Grade dos 35 Dias do Mês */}
                <div className="grid grid-cols-7 gap-2 pt-1">
                  {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(d => (
                    <div
                      key={d}
                      className="text-center font-bold text-[11px] text-sky-600 dark:text-sky-400 py-1 bg-sky-500/5 dark:bg-sky-500/10 rounded-lg"
                    >
                      {d}
                    </div>
                  ))}
                  {Array.from({ length: 35 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-zinc-900/90 text-zinc-900 dark:text-zinc-100 p-2 min-h-[90px] flex flex-col hover:border-sky-400/50 transition group"
                    >
                      <input
                        type="text"
                        placeholder={`${i + 1}`}
                        value={plannerData[`plM_dia_${i}`] || ''}
                        onChange={e => onPlannerUpdate(`plM_dia_${i}`, e.target.value)}
                        className="w-8 border-b border-black/10 dark:border-white/10 bg-transparent text-[10px] text-sky-600 dark:text-sky-400 font-mono font-bold focus:outline-none mb-1 group-hover:border-sky-400/50"
                      />
                      <textarea
                        placeholder="..."
                        value={plannerData[`plM_txt_${i}`] || ''}
                        onChange={e => onPlannerUpdate(`plM_txt_${i}`, e.target.value)}
                        className="w-full flex-1 bg-transparent text-zinc-800 dark:text-zinc-200 text-xs resize-none focus:outline-none leading-relaxed"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* SUB-ABA 2: PLANEJAMENTO SEMANAL */}
            {subAbaPlanner === 'semanal' && (
              <motion.div
                key="semanal"
                initial={{ opacity: 0, scale: 0.98, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -8 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4"
              >
                <textarea
                  placeholder="Metas da semana e horários disponíveis para o bloco de redação de 150 linhas..."
                  value={plannerData['plS_metas'] || ''}
                  onChange={e => onPlannerUpdate('plS_metas', e.target.value)}
                  className="w-full h-16 rounded-xl border border-black/15 dark:border-white/15 bg-slate-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 p-3 text-xs resize-none focus:outline-none focus:border-sky-500 transition"
                />

                <div className="overflow-x-auto rounded-xl border border-black/10 dark:border-white/10 shadow-xs">
                  <table className="w-full border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-zinc-800/90 text-sky-600 dark:text-sky-300">
                        <th className="border border-black/10 dark:border-white/10 p-2.5 text-center w-24 font-bold">
                          Turno
                        </th>
                        {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(d => (
                          <th
                            key={d}
                            className="border border-black/10 dark:border-white/10 p-2.5 text-left font-bold"
                          >
                            {d}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {['MANHÃ', 'TARDE', 'NOITE'].map(t => (
                        <tr key={t} className="bg-slate-50 dark:bg-zinc-900/60">
                          <td className="border border-black/10 dark:border-white/10 p-2.5 text-center font-bold text-zinc-600 dark:text-zinc-300 bg-slate-100/70 dark:bg-zinc-800/60">
                            {t}
                          </td>
                          {Array.from({ length: 7 }).map((_, dIdx) => (
                            <td
                              key={dIdx}
                              className="border border-black/10 dark:border-white/10 p-2 align-top hover:bg-black/5 dark:hover:bg-white/5 transition"
                            >
                              <textarea
                                value={plannerData[`plS_${t[0]}_${dIdx}`] || ''}
                                onChange={e =>
                                  onPlannerUpdate(`plS_${t[0]}_${dIdx}`, e.target.value)
                                }
                                placeholder="Estudo..."
                                className="w-full min-h-[75px] bg-transparent text-zinc-800 dark:text-zinc-200 text-xs resize-none focus:outline-none leading-relaxed"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* SUB-ABA 3: PLANEJAMENTO DIÁRIO COM TRANSIÇÃO EM TAREFAS */}
            {subAbaPlanner === 'diario' && (
              <motion.div
                key="diario"
                initial={{ opacity: 0, scale: 0.98, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -8 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 md:grid-cols-12 gap-4"
              >
                {/* Checklist de Tarefas do Dia com animação Framer Motion */}
                <div className="md:col-span-6 rounded-2xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-zinc-900/70 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2.5">
                    <div className="flex items-center gap-2">
                      <ListTodo className="h-4 w-4 text-sky-500" />
                      <h3 className="text-xs font-bold text-zinc-900 dark:text-white">
                        Tarefas Prioritárias do Dia
                      </h3>
                    </div>
                    <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded-full">
                      {tarefasDiaConcluidas} de 10 concluídas
                    </span>
                  </div>

                  {/* Barra de progresso do dia */}
                  <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-sky-500 to-emerald-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(tarefasDiaConcluidas / 10) * 100}%` }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    />
                  </div>

                  <div className="space-y-2 pt-1">
                    {Array.from({ length: 10 }).map((_, i) => {
                      const isChecked = Boolean(plannerData[`plD_ck_${i}`]);
                      return (
                        <motion.div
                          key={i}
                          whileTap={{ scale: 0.98 }}
                          layout
                          className={`flex items-center gap-3 p-2 rounded-xl border transition-colors ${
                            isChecked
                              ? 'border-emerald-500/40 bg-emerald-500/10 dark:bg-emerald-500/15'
                              : 'border-black/5 dark:border-white/5 bg-white dark:bg-zinc-800/80 hover:border-black/15 dark:hover:border-white/15'
                          }`}
                        >
                          <label className="relative flex items-center justify-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={e => handleToggleTarefaDia(i, e.target.checked)}
                              className="sr-only"
                            />
                            <motion.div
                              className={`h-5 w-5 rounded-lg border flex items-center justify-center transition-colors ${
                                isChecked
                                  ? 'bg-emerald-500 border-emerald-400 text-white shadow-sm'
                                  : 'border-zinc-300 dark:border-zinc-600 bg-transparent hover:border-sky-400'
                              }`}
                              animate={{ scale: isChecked ? [0.85, 1.15, 1] : 1 }}
                              transition={{ duration: 0.25 }}
                            >
                              {isChecked && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                                >
                                  <Check className="h-3 w-3 stroke-[3]" />
                                </motion.div>
                              )}
                            </motion.div>
                          </label>

                          <input
                            type="text"
                            placeholder={`Tarefa ${i + 1}...`}
                            value={plannerData[`plD_txt_${i}`] || ''}
                            onChange={e => onPlannerUpdate(`plD_txt_${i}`, e.target.value)}
                            className={`flex-1 bg-transparent text-xs focus:outline-none transition-all ${
                              isChecked
                                ? 'line-through text-zinc-400 dark:text-zinc-500'
                                : 'text-zinc-900 dark:text-zinc-100 font-medium'
                            }`}
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Aulas do Dia & Anotações */}
                <div className="md:col-span-6 space-y-4">
                  <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-zinc-900/70 p-4 space-y-3">
                    <div className="flex items-center gap-2 border-b border-black/10 dark:border-white/10 pb-2">
                      <BookOpen className="h-4 w-4 text-emerald-500" />
                      <h3 className="text-xs font-bold text-zinc-900 dark:text-white">
                        Aulas do Dia (Ceisc EAD)
                      </h3>
                    </div>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-zinc-400 dark:text-zinc-500 border-b border-black/10 dark:border-white/10">
                          <th className="text-left py-1 font-semibold">Aula / Conteúdo</th>
                          <th className="text-left py-1 w-24 font-semibold">Plataforma</th>
                          <th className="text-left py-1 w-20 font-semibold">Horário</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: 4 }).map((_, i) => (
                          <tr key={i} className="border-b border-black/5 dark:border-white/5">
                            <td className="py-1.5 pr-2">
                              <input
                                type="text"
                                placeholder={`Ex: Aula ${i + 1} - Peças`}
                                value={plannerData[`plD_a_${i}`] || ''}
                                onChange={e => onPlannerUpdate(`plD_a_${i}`, e.target.value)}
                                className="w-full bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none"
                              />
                            </td>
                            <td className="py-1.5 pr-2">
                              <input
                                type="text"
                                placeholder="EAD Ceisc"
                                value={plannerData[`plD_ead_${i}`] || ''}
                                onChange={e => onPlannerUpdate(`plD_ead_${i}`, e.target.value)}
                                className="w-full bg-transparent text-zinc-700 dark:text-zinc-300 focus:outline-none text-[11px]"
                              />
                            </td>
                            <td className="py-1.5">
                              <input
                                type="text"
                                placeholder="19:00"
                                value={plannerData[`plD_h_${i}`] || ''}
                                onChange={e => onPlannerUpdate(`plD_h_${i}`, e.target.value)}
                                className="w-full bg-transparent text-sky-600 dark:text-sky-400 font-mono focus:outline-none text-[11px]"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-zinc-900/70 p-4 space-y-2">
                    <div className="flex items-center gap-2 border-b border-black/10 dark:border-white/10 pb-1.5">
                      <Edit3 className="h-4 w-4 text-amber-500" />
                      <h3 className="text-xs font-bold text-zinc-900 dark:text-white">
                        Anotações, Teses & Dúvidas
                      </h3>
                    </div>
                    <textarea
                      placeholder="Escreva aqui suas observações de aula, dúvidas para tirar na monitoria ou artigos para reler no Vade..."
                      value={plannerData['plD_anotacoes'] || ''}
                      onChange={e => onPlannerUpdate('plD_anotacoes', e.target.value)}
                      className="w-full h-28 bg-transparent text-xs text-zinc-900 dark:text-zinc-100 resize-none focus:outline-none leading-relaxed"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* SUB-ABA 4: CONTROLE DE AULAS & PEÇAS */}
            {subAbaPlanner === 'controle' && (
              <motion.div
                key="controle"
                initial={{ opacity: 0, scale: 0.98, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -8 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                  <p>
                    Marque as aulas e treinamentos conforme for concluindo a visualização dos vídeos e a resolução dos exercícios práticos.
                  </p>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    Progresso Geral: {totalAulasConcluidas} de {totalAulasGerais} (
                    {Math.round((totalAulasConcluidas / totalAulasGerais) * 100)}%)
                  </span>
                </div>

                <div className="space-y-4">
                  {ESTRUTURA_CONTROLE_AULAS.map((sec, secIdx) => {
                    const concluidasNaSecao = sec.itens.filter(
                      (_, itIdx) => plannerData[`plC_ck_${secIdx}_${itIdx}`]
                    ).length;
                    const percentSecao = Math.round((concluidasNaSecao / sec.itens.length) * 100);

                    return (
                      <div
                        key={secIdx}
                        className="rounded-2xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-zinc-900/70 p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-black/10 dark:border-white/10 pb-2">
                          <h3 className="text-xs font-bold text-sky-600 dark:text-sky-300">
                            {sec.titulo}
                          </h3>
                          <span className="font-mono text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
                            {concluidasNaSecao} / {sec.itens.length} ({percentSecao}%)
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {sec.itens.map((it, itIdx) => {
                            const key = `plC_ck_${secIdx}_${itIdx}`;
                            const checked = Boolean(plannerData[key]);
                            return (
                              <motion.label
                                key={itIdx}
                                whileTap={{ scale: 0.98 }}
                                layout
                                className={`flex items-center gap-2.5 p-2 rounded-xl border text-xs cursor-pointer select-none transition-colors ${
                                  checked
                                    ? 'border-emerald-500/40 bg-emerald-500/10 dark:bg-emerald-500/15 text-zinc-400 dark:text-zinc-500'
                                    : 'border-black/5 dark:border-white/5 bg-white dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 hover:border-black/15 dark:hover:border-white/15'
                                }`}
                              >
                                <div className="relative flex items-center justify-center">
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={e => handleToggleAula(key, e.target.checked, it)}
                                    className="sr-only"
                                  />
                                  <motion.div
                                    className={`h-4 w-4 rounded-md border flex items-center justify-center transition-colors ${
                                      checked
                                        ? 'bg-emerald-500 border-emerald-400 text-white'
                                        : 'border-zinc-300 dark:border-zinc-600 bg-transparent'
                                    }`}
                                    animate={{ scale: checked ? [0.8, 1.2, 1] : 1 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    {checked && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                                  </motion.div>
                                </div>
                                <span className={checked ? 'line-through text-zinc-400 dark:text-zinc-500' : 'font-medium'}>
                                  {it}
                                </span>
                              </motion.label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
