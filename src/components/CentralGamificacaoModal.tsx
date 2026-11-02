import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Award,
  Zap,
  Flame,
  CheckCircle2,
  Lock,
  ChevronRight,
  X,
  History,
  TrendingUp,
  Sparkles,
  Shield,
  Star,
  Target
} from 'lucide-react';
import {
  GamificationState,
  LISTA_CONQUISTAS,
  PATENTES_TRIBUTARIAS,
  calcularInfoNivel,
  Conquista
} from '../utils/gamification';

interface CentralGamificacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  gamificacao: GamificationState;
}

export const CentralGamificacaoModal: React.FC<CentralGamificacaoModalProps> = ({
  isOpen,
  onClose,
  gamificacao
}) => {
  const [abaAtiva, setAbaAtiva] = useState<'conquistas' | 'patentes' | 'historico'>('conquistas');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas');

  if (!isOpen) return null;

  const infoNivel = calcularInfoNivel(gamificacao.xp);
  const totalConquistas = LISTA_CONQUISTAS.length;
  const desbloqueadasCount = gamificacao.conquistasDesbloqueadas.length;

  const conquistasFiltradas = LISTA_CONQUISTAS.filter(c => {
    if (filtroCategoria === 'desbloqueadas') return gamificacao.conquistasDesbloqueadas.includes(c.id);
    if (filtroCategoria === 'pendentes') return !gamificacao.conquistasDesbloqueadas.includes(c.id);
    if (filtroCategoria !== 'todas') return c.categoria === filtroCategoria;
    return true;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border border-black/10 dark:border-white/10 bg-white/95 dark:bg-[#181d26]/95 text-zinc-900 dark:text-zinc-100 shadow-2xl overflow-hidden backdrop-blur-xl"
        >
          {/* Header Superior Windows 11 Fluent */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0078d4]/10 dark:bg-sky-500/20 text-[#0078d4] dark:text-sky-400 flex items-center justify-center border border-[#0078d4]/20">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold tracking-tight flex items-center gap-2">
                  <span>Central de Conquistas & Gamificação</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#0078d4]/15 text-[#0078d4] dark:text-sky-300 border border-[#0078d4]/30">
                    OAB 2ª Fase
                  </span>
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Evolua de Estagiário a Tributarista de Elite através de estudo constante
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/5 transition"
              title="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Banner de Status do Aluno / Patente Atual */}
          <div className="p-6 border-b border-black/10 dark:border-white/10 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-[#151922] dark:to-[#1c2230]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
              {/* Card Nível */}
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-[#202738] border-2 border-[#0078d4] dark:border-sky-400 flex items-center justify-center text-3xl shadow-md">
                    {infoNivel.patenteAtual.icone}
                  </div>
                  <span className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded-md bg-[#0078d4] text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                    Nv. {infoNivel.patenteAtual.nivel}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#0078d4] dark:text-sky-400">
                    Patente Atual
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white leading-tight">
                    {infoNivel.patenteAtual.titulo}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
                    {infoNivel.patenteAtual.subtitulo}
                  </p>
                </div>
              </div>

              {/* Barra de Progresso de XP */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                    <Zap className="h-3.5 w-3.5 text-amber-500" />
                    <span>{gamificacao.xp.toLocaleString('pt-BR')} XP Total</span>
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400 text-[11px]">
                    {infoNivel.proximaPatente ? (
                      `Faltam ${infoNivel.xpNecessarioNivel - infoNivel.xpNoNivelAtual} XP p/ Nv. ${infoNivel.proximaPatente.nivel}`
                    ) : (
                      'Nível Máximo Atingido!'
                    )}
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden p-0.5">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#0078d4] to-sky-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${infoNivel.progressoPercentual}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-zinc-400">
                  <span>{infoNivel.xpNoNivelAtual} XP acumulados no nível</span>
                  <span>{infoNivel.progressoPercentual}%</span>
                </div>
              </div>

              {/* Chama de Constância / Streak */}
              <div className="flex items-center justify-around sm:justify-end gap-5 bg-white/70 dark:bg-[#1f2636]/70 p-3 rounded-xl border border-black/10 dark:border-white/10">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-amber-600 dark:text-amber-400 font-bold text-base">
                    <Flame className="h-5 w-5 fill-amber-500 text-amber-500 animate-pulse" />
                    <span>{gamificacao.streakDias} {gamificacao.streakDias === 1 ? 'dia' : 'dias'}</span>
                  </div>
                  <span className="text-[10px] uppercase font-semibold text-zinc-500 dark:text-zinc-400 tracking-wider">
                    Constância
                  </span>
                </div>

                <div className="h-8 w-px bg-black/10 dark:bg-white/10" />

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-[#0078d4] dark:text-sky-400 font-bold text-base">
                    <Award className="h-5 w-5" />
                    <span>{desbloqueadasCount}/{totalConquistas}</span>
                  </div>
                  <span className="text-[10px] uppercase font-semibold text-zinc-500 dark:text-zinc-400 tracking-wider">
                    Conquistas
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Abas de Navegação Interna */}
          <div className="flex items-center gap-2 px-6 pt-3 border-b border-black/10 dark:border-white/10 bg-black/[0.01] dark:bg-white/[0.01]">
            <button
              onClick={() => setAbaAtiva('conquistas')}
              className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                abaAtiva === 'conquistas'
                  ? 'border-[#0078d4] text-[#0078d4] dark:text-sky-400 dark:border-sky-400'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <Award className="h-4 w-4" />
              <span>Conquistas & Badges ({desbloqueadasCount})</span>
            </button>
            <button
              onClick={() => setAbaAtiva('patentes')}
              className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                abaAtiva === 'patentes'
                  ? 'border-[#0078d4] text-[#0078d4] dark:text-sky-400 dark:border-sky-400'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <Shield className="h-4 w-4" />
              <span>Plano de Carreira OAB</span>
            </button>
            <button
              onClick={() => setAbaAtiva('historico')}
              className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                abaAtiva === 'historico'
                  ? 'border-[#0078d4] text-[#0078d4] dark:text-sky-400 dark:border-sky-400'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <History className="h-4 w-4" />
              <span>Extrato de XP</span>
            </button>
          </div>

          {/* Conteúdo das Abas */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {abaAtiva === 'conquistas' && (
              <div className="space-y-4">
                {/* Filtros de Categoria */}
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { id: 'todas', label: 'Todas' },
                    { id: 'desbloqueadas', label: `Desbloqueadas (${desbloqueadasCount})` },
                    { id: 'pendentes', label: `Pendentes (${totalConquistas - desbloqueadasCount})` },
                    { id: 'redacao', label: '✍️ Redação 150L' },
                    { id: 'pomodoro', label: '⏱️ Pomodoro' },
                    { id: 'flashcards', label: '💡 Flashcards' },
                    { id: 'vademecum', label: '📖 Vade Mecum' },
                    { id: 'constancia', label: '🔥 Constância' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setFiltroCategoria(tab.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                        filtroCategoria === tab.id
                          ? 'bg-[#0078d4] text-white shadow-xs'
                          : 'bg-black/5 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-black/10 dark:hover:bg-white/10'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Grade de Conquistas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {conquistasFiltradas.map(conquista => {
                    const desbloqueada = gamificacao.conquistasDesbloqueadas.includes(conquista.id);
                    return (
                      <div
                        key={conquista.id}
                        className={`p-3.5 rounded-xl border transition flex items-start gap-3 relative ${
                          desbloqueada
                            ? 'bg-[#0078d4]/[0.04] dark:bg-sky-500/[0.08] border-[#0078d4]/30 dark:border-sky-400/30'
                            : 'bg-black/[0.02] dark:bg-white/[0.02] border-black/10 dark:border-white/10 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                            desbloqueada
                              ? 'bg-white dark:bg-zinc-800 shadow-xs border border-[#0078d4]/30'
                              : 'bg-zinc-200/80 dark:bg-zinc-800/80 grayscale'
                          }`}
                        >
                          {conquista.icone}
                        </div>

                        <div className="flex-1 min-w-0 pr-4">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                              {conquista.titulo}
                            </h4>
                            {desbloqueada ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                            ) : (
                              <Lock className="h-3.5 w-3.5 text-zinc-400" />
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">
                            {conquista.descricao}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 inline-flex items-center gap-1">
                              <Sparkles className="h-2.5 w-2.5" />
                              +{conquista.xpBonus} XP
                            </span>
                            <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
                              {conquista.categoria}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {abaAtiva === 'patentes' && (
              <div className="space-y-3">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Cada nova patente desbloqueia prestígio, consolida seus conhecimentos para a aprovação e reflete seu preparo técnico para o espelho de correção da FGV.
                </p>

                <div className="space-y-2.5">
                  {PATENTES_TRIBUTARIAS.map(patente => {
                    const alcancada = gamificacao.xp >= patente.xpMinimo;
                    const eAtual = infoNivel.patenteAtual.nivel === patente.nivel;

                    return (
                      <div
                        key={patente.nivel}
                        className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition ${
                          eAtual
                            ? 'bg-[#0078d4]/10 dark:bg-sky-500/15 border-[#0078d4] dark:border-sky-400 shadow-xs'
                            : alcancada
                            ? 'bg-black/[0.02] dark:bg-white/[0.03] border-black/10 dark:border-white/10'
                            : 'bg-black/[0.01] dark:bg-white/[0.01] border-black/5 dark:border-white/5 opacity-55'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10 flex items-center justify-center text-2xl shadow-xs">
                            {patente.icone}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-black uppercase text-[#0078d4] dark:text-sky-400">
                                Nível {patente.nivel}
                              </span>
                              <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                                {patente.titulo}
                              </h4>
                              {eAtual && (
                                <span className="px-2 py-0.5 rounded-full bg-[#0078d4] text-white text-[10px] font-bold">
                                  Você está aqui
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              {patente.subtitulo}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                            {patente.xpMinimo.toLocaleString('pt-BR')} XP
                          </span>
                          <div className="text-[10px] text-zinc-400">
                            {alcancada ? 'Conquistado' : 'Bloqueado'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {abaAtiva === 'historico' && (
              <div className="space-y-3">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Extrato detalhado de todas as suas últimas conquistas e pontos obtidos estudando.
                </p>

                <div className="divide-y divide-black/5 dark:divide-white/5 border border-black/10 dark:border-white/10 rounded-xl overflow-hidden bg-black/[0.02] dark:bg-white/[0.02]">
                  {gamificacao.historico.length === 0 ? (
                    <div className="p-6 text-center text-xs text-zinc-400">
                      Nenhuma atividade registrada ainda. Comece a redigir ou resolver flashcards!
                    </div>
                  ) : (
                    gamificacao.historico.map(item => (
                      <div key={item.id} className="p-3.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 font-bold text-xs">
                            +{item.xpGanho}
                          </div>
                          <div>
                            <div className="font-semibold text-zinc-800 dark:text-zinc-200">
                              {item.acao}
                            </div>
                            <div className="text-[10px] text-zinc-400">
                              {item.data} às {item.hora}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          +{item.xpGanho} XP
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Rodapé Informativo */}
          <div className="px-6 py-3 border-t border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span className="inline-flex items-center gap-1.5">
              <span>💡 Dica:</span>
              <span>Escrever linhas no Caderno 150L e concluir blocos Pomodoro geram o maior rendimento de XP.</span>
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-[#0078d4] hover:bg-[#006cbd] text-white text-xs font-semibold shadow-xs cursor-pointer transition active:scale-95"
            >
              Fechar & Continuar Estudando
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
