import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { PATENTES_TRIBUTARIAS } from '../utils/gamification';

interface ModalSubidaNivelProps {
  isOpen: boolean;
  novoNivel: number;
  tituloNivel: string;
  onClose: () => void;
  onVerTodasConquistas: () => void;
}

export const ModalSubidaNivel: React.FC<ModalSubidaNivelProps> = ({
  isOpen,
  novoNivel,
  tituloNivel,
  onClose,
  onVerTodasConquistas
}) => {
  if (!isOpen) return null;

  const patente = PATENTES_TRIBUTARIAS.find(p => p.nivel === novoNivel) || PATENTES_TRIBUTARIAS[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 260 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border-2 border-[#0078d4]/40 bg-white/95 dark:bg-[#181d26]/95 p-7 text-center shadow-2xl backdrop-blur-xl"
        >
          {/* Fundo radiante suave */}
          <div className="absolute inset-0 bg-radial from-[#0078d4]/10 via-transparent to-transparent pointer-events-none" />

          {/* Ícone com pulso */}
          <div className="relative mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-[#0078d4]/20 to-sky-400/20 border-2 border-[#0078d4]/40 text-5xl shadow-lg">
            <span className="animate-bounce">{patente.icone}</span>
            <div className="absolute -top-2 -right-2 rounded-full bg-amber-500 p-1.5 text-white shadow-md">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0078d4]/15 px-3 py-1 text-xs font-black uppercase tracking-wider text-[#0078d4] dark:text-sky-400 border border-[#0078d4]/30 mb-2">
            <Trophy className="h-3.5 w-3.5" />
            Promoção de Patente!
          </span>

          <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white mt-1">
            Nível {novoNivel}: {tituloNivel}
          </h2>

          <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-xs mx-auto">
            {patente.subtitulo}. Seu preparo e consistência jurídica estão cada vez mais próximos da aprovação na FGV!
          </p>

          <div className="mt-5 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] p-3 border border-black/10 dark:border-white/10 text-xs flex items-center justify-center gap-2 text-zinc-700 dark:text-zinc-300">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>+100 XP Bônus de Promoção Creditado</span>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => {
                onClose();
                onVerTodasConquistas();
              }}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0078d4] hover:bg-[#006cbd] px-4 py-2.5 text-xs font-bold text-white shadow-md transition active:scale-95 cursor-pointer"
            >
              <span>Ver Central de Conquistas</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={onClose}
              className="rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 px-4 py-2.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition active:scale-95 cursor-pointer"
            >
              Continuar Treino
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
