import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  X,
  Sparkles,
  Download,
  ShieldAlert,
  ChevronRight,
  Bookmark
} from 'lucide-react';
import { SafeStorage } from '../utils/storage';

interface AlertasPrazosOABModalProps {
  aberto: boolean;
  onFechar: () => void;
  onDefinirAlarme?: () => void;
  onMostrarToast?: (msg: string) => void;
}

export const DATA_RESULTADO_PROVA = new Date('2026-11-12T17:00:00-03:00');
export const DATA_REPESCAGEM_INICIO = new Date('2026-11-13T00:00:00-03:00');

export function calcularTempoRestante(alvo: Date) {
  const agora = new Date();
  const diffMs = alvo.getTime() - agora.getTime();

  if (diffMs <= 0) {
    return { expirado: true, dias: 0, horas: 0, minutos: 0, segundos: 0 };
  }

  const dias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((diffMs % (1000 * 60)) / 1000);

  return { expirado: false, dias, horas, minutos, segundos };
}

export const AlertasPrazosOABModal: React.FC<AlertasPrazosOABModalProps> = ({
  aberto,
  onFechar,
  onDefinirAlarme,
  onMostrarToast
}) => {
  const [tempoResultado, setTempoResultado] = useState(() => calcularTempoRestante(DATA_RESULTADO_PROVA));
  const [tempoRepescagem, setTempoRepescagem] = useState(() => calcularTempoRestante(DATA_REPESCAGEM_INICIO));

  useEffect(() => {
    if (!aberto) return;
    const interval = setInterval(() => {
      setTempoResultado(calcularTempoRestante(DATA_RESULTADO_PROVA));
      setTempoRepescagem(calcularTempoRestante(DATA_REPESCAGEM_INICIO));
    }, 1000);
    return () => clearInterval(interval);
  }, [aberto]);

  const baixarArquivoCalendarioIcs = (tipo: 'resultado' | 'repescagem') => {
    const isResultado = tipo === 'resultado';
    const titulo = isResultado
      ? 'OAB 2ª Fase: Divulgação do Resultado Preliminar (FGV)'
      : 'OAB 2ª Fase: Abertura da Inscrição na Repescagem (Reaproveitamento)';
    const dataInicio = isResultado ? '20261112T200000Z' : '20261113T120000Z'; // UTC (17:00 BRT = 20:00 UTC)
    const dataFim = isResultado ? '20261112T220000Z' : '20261113T235959Z';
    const descricao = isResultado
      ? 'Acesso ao espelho de correção oficial e nota preliminar da peça profissional e 4 questões discursivas no portal FGV OAB.'
      : 'Início do prazo improrrogável para solicitar o reaproveitamento da 1ª fase (Repescagem) e emissão do boleto bancário.';

    const conteudoIcs = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//TributaOAB//Prazos Oficiais FGV//PT',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `SUMMARY:${titulo}`,
      `DESCRIPTION:${descricao}`,
      `DTSTART:${dataInicio}`,
      `DTEND:${dataFim}`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT60M',
      'ACTION:DISPLAY',
      `DESCRIPTION:Lembrete: ${titulo}`,
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([conteudoIcs], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = isResultado ? 'OAB_Resultado_12_Nov_2026.ics' : 'OAB_Repescagem_13_Nov_2026.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (onMostrarToast) {
      onMostrarToast('📅 Evento (.ics) baixado! Adicione ao Google Agenda, Outlook ou Apple Calendar.');
    }
  };

  return (
    <AnimatePresence>
      {aberto && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md">
          {/* Backdrop click to close */}
          <div className="absolute inset-0" onClick={onFechar} />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 14 }}
            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
            className="relative w-full max-w-2xl bg-white dark:bg-[#202020] border border-black/10 dark:border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Windows 11 Fluent Mica */}
            <div className="p-4 sm:p-6 pb-4 border-b border-black/5 dark:border-white/5 bg-gradient-to-r from-amber-500/10 via-blue-500/10 to-purple-500/10 dark:from-amber-500/15 dark:via-sky-500/10 dark:to-purple-500/15 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-md shrink-0">
                  <Bell className="h-5 w-5 sm:h-6 sm:w-6 animate-bounce" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 mb-1">
                    <ShieldAlert className="h-3 w-3" />
                    <span>CALENDÁRIO OFICIAL FGV • DATAS CRÍTICAS</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">
                    2 Prazos Decisivos da 2ª Fase
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Acompanhe a contagem regressiva e prepare-se com antecedência para cada etapa.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onFechar}
                className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-zinc-500 dark:text-zinc-400 transition cursor-pointer"
                title="Fechar (Esc)"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
              {/* CARD 1: DIVULGAÇÃO DO RESULTADO (12/11/2026 às 17h00) */}
              <div className="p-4 sm:p-5 rounded-2xl border-2 border-amber-400/80 dark:border-amber-500/60 bg-gradient-to-br from-amber-50/70 to-orange-50/40 dark:from-amber-950/30 dark:to-zinc-900/60 shadow-xs space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 px-3 py-1 bg-amber-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider rounded-bl-xl shadow-xs">
                  Prioridade Máxima
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-lg shrink-0">
                    📢
                  </div>
                  <div className="space-y-0.5 min-w-0 pr-16">
                    <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide block">
                      Alerta 1 • Divulgação Oficial da Banca
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
                      Resultado Preliminar da Prova Prático-Profissional
                    </h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/80 dark:bg-zinc-800/80 border border-amber-300/60 dark:border-amber-500/30">
                    <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block font-medium">Data Marcada</span>
                      <strong className="text-xs sm:text-sm text-zinc-900 dark:text-white font-mono">
                        12 de Novembro de 2026
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/80 dark:bg-zinc-800/80 border border-amber-300/60 dark:border-amber-500/30">
                    <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block font-medium">Horário de Liberação</span>
                      <strong className="text-xs sm:text-sm text-zinc-900 dark:text-white font-mono">
                        A partir das 17:00h (Brasília)
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Countdown Box */}
                <div className="p-3 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-semibold text-amber-800 dark:text-amber-200 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                    <span>Contagem Regressiva:</span>
                  </span>

                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-amber-900 dark:text-amber-200">
                    <span className="px-2 py-0.5 rounded bg-white dark:bg-zinc-800 shadow-xs">
                      {tempoResultado.dias}d
                    </span>
                    <span>:</span>
                    <span className="px-2 py-0.5 rounded bg-white dark:bg-zinc-800 shadow-xs">
                      {String(tempoResultado.horas).padStart(2, '0')}h
                    </span>
                    <span>:</span>
                    <span className="px-2 py-0.5 rounded bg-white dark:bg-zinc-800 shadow-xs">
                      {String(tempoResultado.minutos).padStart(2, '0')}m
                    </span>
                    <span>:</span>
                    <span className="px-2 py-0.5 rounded bg-white dark:bg-zinc-800 shadow-xs">
                      {String(tempoResultado.segundos).padStart(2, '0')}s
                    </span>
                  </div>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  💡 <strong>Checklist do Resultado:</strong> Às 17h serão disponibilizados a lista oficial dos aprovados, a folha de respostas digitalizada e o espelho de correção individual com a pontuação quesito a quesito da peça (0 a 5,00) e das 4 questões discursivas (0 a 1,25 cada).
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => baixarArquivoCalendarioIcs('resultado')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow-xs active:scale-95"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Salvar no Calendário (.ics)</span>
                  </button>
                  <a
                    href="https://oab.fgv.br"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-800/70 hover:bg-white dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold transition"
                  >
                    <span>Portal FGV OAB</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {/* CARD 2: INSCRIÇÃO NA REPESCAGEM (A PARTIR DE 13/11/2026) */}
              <div className="p-4 sm:p-5 rounded-2xl border-2 border-blue-400/80 dark:border-sky-500/60 bg-gradient-to-br from-blue-50/70 to-indigo-50/40 dark:from-sky-950/30 dark:to-zinc-900/60 shadow-xs space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 px-3 py-1 bg-[#0078d4] dark:bg-[#4cc2ff] text-white dark:text-slate-950 font-bold text-[10px] uppercase tracking-wider rounded-bl-xl shadow-xs">
                  Etapa Crucial
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl bg-blue-500/20 text-blue-700 dark:text-sky-300 flex items-center justify-center font-bold text-lg shrink-0">
                    📝
                  </div>
                  <div className="space-y-0.5 min-w-0 pr-16">
                    <span className="text-[11px] font-bold text-blue-700 dark:text-sky-400 uppercase tracking-wide block">
                      Alerta 2 • Aproveitamento da 1ª Fase
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
                      Abertura das Inscrições na Repescagem
                    </h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/80 dark:bg-zinc-800/80 border border-blue-300/60 dark:border-sky-500/30">
                    <Calendar className="h-5 w-5 text-blue-600 dark:text-sky-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block font-medium">Início das Inscrições</span>
                      <strong className="text-xs sm:text-sm text-zinc-900 dark:text-white font-mono">
                        A partir de 13/11/2026
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/80 dark:bg-zinc-800/80 border border-blue-300/60 dark:border-sky-500/30">
                    <Bookmark className="h-5 w-5 text-blue-600 dark:text-sky-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block font-medium">Modalidade</span>
                      <strong className="text-xs sm:text-sm text-zinc-900 dark:text-white font-mono">
                        Reaproveitamento de Fase
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Countdown Box */}
                <div className="p-3 rounded-xl bg-blue-500/10 dark:bg-sky-500/15 border border-blue-500/30 flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-semibold text-blue-800 dark:text-sky-200 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#0078d4] dark:bg-[#4cc2ff] animate-ping" />
                    <span>Contagem até a Abertura:</span>
                  </span>

                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-blue-900 dark:text-sky-200">
                    <span className="px-2 py-0.5 rounded bg-white dark:bg-zinc-800 shadow-xs">
                      {tempoRepescagem.dias}d
                    </span>
                    <span>:</span>
                    <span className="px-2 py-0.5 rounded bg-white dark:bg-zinc-800 shadow-xs">
                      {String(tempoRepescagem.horas).padStart(2, '0')}h
                    </span>
                    <span>:</span>
                    <span className="px-2 py-0.5 rounded bg-white dark:bg-zinc-800 shadow-xs">
                      {String(tempoRepescagem.minutos).padStart(2, '0')}m
                    </span>
                    <span>:</span>
                    <span className="px-2 py-0.5 rounded bg-white dark:bg-zinc-800 shadow-xs">
                      {String(tempoRepescagem.segundos).padStart(2, '0')}s
                    </span>
                  </div>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  ⚠️ <strong>Atenção Estratégica:</strong> O edital complementar de reaproveitamento da 1ª fase abre no dia 13/11. Mesmo que você pretenda interpor recurso contra a nota da prova, <em>recomenda-se realizar a inscrição na repescagem e gerar o boleto</em> para garantir sua vaga caso o recurso não seja provido.
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => baixarArquivoCalendarioIcs('repescagem')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0078d4] hover:bg-[#0067c0] dark:bg-[#4cc2ff] dark:hover:bg-sky-400 text-white dark:text-slate-950 font-bold text-xs transition cursor-pointer shadow-xs active:scale-95"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Salvar no Calendário (.ics)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-black/5 dark:border-white/5 bg-zinc-50/80 dark:bg-zinc-900/60 flex items-center justify-between gap-3 flex-wrap">
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Prazos sincronizados com o cronograma do Exame de Ordem Unificado.
              </span>

              <div className="flex items-center gap-2">
                {onDefinirAlarme && (
                  <button
                    type="button"
                    onClick={() => {
                      onDefinirAlarme();
                      onFechar();
                    }}
                    className="px-3.5 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200 transition cursor-pointer"
                  >
                    🔔 Configurar Alarme Push
                  </button>
                )}
                <button
                  type="button"
                  onClick={onFechar}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition cursor-pointer shadow-xs active:scale-95"
                >
                  Entendido, Manter no Topo ✓
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export interface BannerPrazosOABProps {
  onAbrirModal: () => void;
}

export const BannerPrazosOAB: React.FC<BannerPrazosOABProps> = ({ onAbrirModal }) => {
  const [dispensado, setDispensado] = useState(() => {
    return SafeStorage.get('tributa_banner_prazos_dispensado', 'false') === 'true';
  });

  const tempoResultado = calcularTempoRestante(DATA_RESULTADO_PROVA);
  const tempoRepescagem = calcularTempoRestante(DATA_REPESCAGEM_INICIO);

  if (dispensado) {
    return (
      <motion.button
        type="button"
        initial={{ opacity: 0.9, scale: 0.995 }}
        animate={{
          opacity: [0.9, 1, 0.9],
          scale: [0.995, 1.003, 0.995],
          boxShadow: [
            '0 1px 4px rgba(245, 158, 11, 0.08)',
            '0 0 16px rgba(245, 158, 11, 0.35)',
            '0 1px 4px rgba(245, 158, 11, 0.08)'
          ]
        }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ opacity: 1, scale: 1 }}
        onClick={() => {
          setDispensado(false);
          SafeStorage.set('tributa_banner_prazos_dispensado', 'false');
        }}
        className="w-full bg-amber-500/10 dark:bg-amber-500/15 border-b border-amber-500/30 px-3 py-1.5 text-[11.5px] text-amber-800 dark:text-amber-200 font-semibold flex items-center justify-center gap-2 hover:bg-amber-500/20 transition cursor-pointer"
      >
        <span>⚠️ 2 Alertas Críticos FGV: Resultado 12/11 (17h) & Repescagem 13/11</span>
        <span className="underline text-[10px] font-bold">Expandir banner</span>
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0.94, scale: 0.998 }}
      animate={{
        opacity: [0.92, 1, 0.92],
        scale: [0.998, 1.004, 0.998],
        boxShadow: [
          '0 2px 10px rgba(245, 158, 11, 0.10)',
          '0 0 28px rgba(245, 158, 11, 0.42), 0 4px 18px rgba(245, 158, 11, 0.22)',
          '0 2px 10px rgba(245, 158, 11, 0.10)'
        ]
      }}
      transition={{
        duration: 3.2,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      whileHover={{ opacity: 1, scale: 1, boxShadow: '0 0 32px rgba(245, 158, 11, 0.5)' }}
      className="relative z-30 shrink-0 overflow-hidden border-b border-amber-500/40 dark:border-amber-500/50 bg-amber-500/[0.08] dark:bg-amber-500/[0.12] backdrop-blur-md px-3 sm:px-5 py-2"
    >
      {/* Pulso de luz suave ocasional deslizando suavemente pelo banner */}
      <motion.div
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-amber-300/25 dark:via-amber-400/20 to-transparent"
        animate={{ x: ['-100%', '200%'] }}
        transition={{
          repeat: Infinity,
          duration: 3.5,
          repeatDelay: 2.8,
          ease: 'easeInOut'
        }}
      />

      <div className="relative max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap">
        {/* Lado Esquerdo: Os 2 Alertas com visual padronizado e sem excesso de cores */}
        <div className="flex items-center gap-3 flex-wrap min-w-0">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, -4, 4, -2, 0]
            }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="h-7 w-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs"
          >
            🔔
          </motion.div>

          {/* Alerta 1 */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-amber-900 dark:text-amber-200">
              1. Resultado Preliminar:
            </span>
            <span className="font-mono font-bold text-zinc-900 dark:text-white bg-amber-500/20 dark:bg-amber-500/30 px-2 py-0.5 rounded border border-amber-500/40 inline-block">
              12/11/2026 às 17h00
            </span>
            <span className="hidden sm:inline font-mono text-[10px] text-amber-800/80 dark:text-amber-300/80">
              ({tempoResultado.dias}d {tempoResultado.horas}h restantes)
            </span>
          </div>

          <span className="text-amber-500/50 hidden md:inline">•</span>

          {/* Alerta 2 */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-amber-900 dark:text-amber-200">
              2. Inscrição na Repescagem:
            </span>
            <span className="font-mono font-bold text-zinc-900 dark:text-white bg-amber-500/20 dark:bg-amber-500/30 px-2 py-0.5 rounded border border-amber-500/40 inline-block">
              A partir de 13/11/2026
            </span>
            <span className="hidden lg:inline text-[10.5px] text-amber-800/80 dark:text-amber-300/80 font-medium">
              (Aproveitamento da 1ª fase)
            </span>
          </div>
        </div>

        {/* Lado Direito: Ações */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onAbrirModal}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xs transition cursor-pointer active:scale-95"
          >
            <span>Ver Orientações & Contagem</span>
            <ChevronRight className="h-3 w-3" />
          </button>

          <button
            type="button"
            onClick={() => {
              setDispensado(true);
              SafeStorage.set('tributa_banner_prazos_dispensado', 'true');
            }}
            className="p-1 rounded-md text-amber-800/70 dark:text-amber-300/70 hover:bg-amber-500/10 transition cursor-pointer"
            title="Minimizar banner de avisos"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
