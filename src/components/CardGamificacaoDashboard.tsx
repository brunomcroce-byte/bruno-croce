import React from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Flame,
  Zap,
  Award,
  ChevronRight,
  Sparkles,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import {
  GamificationState,
  calcularInfoNivel,
  LISTA_CONQUISTAS
} from '../utils/gamification';

interface CardGamificacaoDashboardProps {
  gamificacao: GamificationState;
  onAbrirCentralGamificacao: () => void;
  onIrParaSimulador: () => void;
  onIrParaFlashcards: () => void;
}

export const CardGamificacaoDashboard: React.FC<CardGamificacaoDashboardProps> = ({
  gamificacao,
  onAbrirCentralGamificacao,
  onIrParaSimulador,
  onIrParaFlashcards
}) => {
  const infoNivel = calcularInfoNivel(gamificacao.xp);
  const totalConquistas = LISTA_CONQUISTAS.length;
  const desbloqueadasCount = gamificacao.conquistasDesbloqueadas.length;

  // Última conquista desbloqueada
  const ultimaConquistaId = gamificacao.conquistasDesbloqueadas[gamificacao.conquistasDesbloqueadas.length - 1];
  const ultimaConquista = LISTA_CONQUISTAS.find(c => c.id === ultimaConquistaId);

  return (
    <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/85 dark:bg-[#181d26]/85 p-5 sm:p-6 shadow-xs backdrop-blur-md transition-all">
      {/* Topo do Card */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#0078d4]/10 dark:bg-sky-500/20 text-[#0078d4] dark:text-sky-400 flex items-center justify-center border border-[#0078d4]/20">
            <Trophy className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <span>Carreira & Gamificação Tributária</span>
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Evolua suas patentes conforme pontua em simuladores e peças
            </p>
          </div>
        </div>

        <button
          onClick={onAbrirCentralGamificacao}
          className="text-xs font-semibold text-[#0078d4] dark:text-sky-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
        >
          <span>Ver Conquistas</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Grid Central */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Patente & XP */}
        <div className="md:col-span-2 p-4 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] flex flex-col justify-between">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#202738] border border-black/10 dark:border-white/10 flex items-center justify-center text-2xl shadow-xs">
                {infoNivel.patenteAtual.icone}
              </div>
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-[#0078d4] dark:text-sky-400">
                  Nível {infoNivel.patenteAtual.nivel}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white leading-tight">
                  {infoNivel.patenteAtual.titulo}
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {infoNivel.patenteAtual.subtitulo}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="inline-flex items-center gap-1 text-xs font-black text-zinc-900 dark:text-white">
                <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                <span>{gamificacao.xp.toLocaleString('pt-BR')} XP</span>
              </div>
              <div className="text-[10px] text-zinc-400">
                {infoNivel.proximaPatente ? `${infoNivel.progressoPercentual}% até Nv. ${infoNivel.proximaPatente.nivel}` : 'Nível Top'}
              </div>
            </div>
          </div>

          {/* Barra de Progresso */}
          <div className="space-y-1">
            <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#0078d4] to-sky-400 transition-all duration-700"
                style={{ width: `${infoNivel.progressoPercentual}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-zinc-400 font-medium">
              <span>{infoNivel.xpNoNivelAtual} XP no ciclo atual</span>
              {infoNivel.proximaPatente && (
                <span>Meta: {infoNivel.xpNecessarioNivel} XP (+{infoNivel.xpNecessarioNivel - infoNivel.xpNoNivelAtual} faltantes)</span>
              )}
            </div>
          </div>
        </div>

        {/* Chama da Constância & Conquistas */}
        <div className="p-4 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider">
              Chama da Constância
            </span>
            <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-black text-sm">
              <Flame className="h-4 w-4 fill-amber-500 text-amber-500" />
              <span>{gamificacao.streakDias} {gamificacao.streakDias === 1 ? 'dia' : 'dias'}</span>
            </div>
          </div>

          <div className="space-y-1.5 py-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-600 dark:text-zinc-400">Badges Desbloqueados:</span>
              <span className="font-bold text-zinc-900 dark:text-white">
                {desbloqueadasCount}/{totalConquistas}
              </span>
            </div>
            {ultimaConquista ? (
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 truncate">
                <span>{ultimaConquista.icone}</span>
                <span className="truncate">Recente: <b>{ultimaConquista.titulo}</b></span>
              </div>
            ) : (
              <div className="text-[11px] text-zinc-400 italic">
                Redija 1 linha ou resolva cards p/ desbloquear badges!
              </div>
            )}
          </div>

          <button
            onClick={onAbrirCentralGamificacao}
            className="w-full mt-2 py-1.5 px-3 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-[#0078d4]/10 dark:hover:bg-sky-500/15 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-[#0078d4] dark:hover:text-sky-300 transition cursor-pointer flex items-center justify-center gap-1"
          >
            <Award className="h-3.5 w-3.5" />
            <span>Ver Todas as Conquistas</span>
          </button>
        </div>
      </div>

      {/* Dicas de Como Ganhar Mais XP */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-black/10 dark:border-white/10 flex-wrap">
        <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 flex-wrap">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">Como subir de nível:</span>
          <span className="inline-flex items-center gap-1">✍️ +2 XP por linha no simulador</span>
          <span className="inline-flex items-center gap-1">⏱️ +40 XP por Pomodoro</span>
          <span className="inline-flex items-center gap-1">💡 +15 XP por Flashcard</span>
          <span className="inline-flex items-center gap-1">📖 +10 XP por Artigo</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onIrParaSimulador}
            className="px-3 py-1.5 rounded-lg bg-[#0078d4] hover:bg-[#006cbd] text-white text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer inline-flex items-center gap-1"
          >
            <span>Redigir Peça (+XP)</span>
            <ArrowUpRight className="h-3 w-3" />
          </button>
          <button
            onClick={onIrParaFlashcards}
            className="px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition active:scale-95 cursor-pointer"
          >
            Flashcards
          </button>
        </div>
      </div>
    </div>
  );
};
