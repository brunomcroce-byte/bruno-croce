import React from 'react';
import { Bell, Clock, Sparkles, BookOpen, FileText, Check, X, Download, FileCheck } from 'lucide-react';

interface NotificacaoEstudoModalProps {
  aberta: boolean;
  horario: string;
  mensagem: string;
  tipo?: 'estudo' | 'word';
  onFechar: () => void;
  onIniciarFoco: () => void;
  onIrParaSimulador: () => void;
  onIrParaCronograma: () => void;
  onIrParaFlashcards: () => void;
  onExportarWord?: () => void;
}

export function NotificacaoEstudoModal({
  aberta,
  horario,
  mensagem,
  tipo = 'estudo',
  onFechar,
  onIniciarFoco,
  onIrParaSimulador,
  onIrParaCronograma,
  onIrParaFlashcards,
  onExportarWord
}: NotificacaoEstudoModalProps) {
  if (!aberta) return null;

  const isWord = tipo === 'word';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notif-modal-title"
    >
      <div className={`relative w-full max-w-lg rounded-2xl border p-6 shadow-2xl animate-scaleIn bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 ${
        isWord 
          ? 'border-blue-500/80 shadow-blue-500/10' 
          : 'border-amber-500/80 shadow-amber-500/10'
      }`}>
        {/* Close Button */}
        <button
          onClick={onFechar}
          className="absolute top-4 right-4 rounded-lg p-1 text-zinc-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-zinc-700 dark:hover:text-white transition"
          aria-label="Fechar notificação"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header with Pulse Icon */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
            isWord 
              ? 'bg-blue-500/15 border-blue-500 text-blue-600 dark:text-blue-400' 
              : 'bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400'
          }`}>
            {isWord ? (
              <FileCheck className="h-6 w-6 animate-bounce" />
            ) : (
              <Bell className="h-6 w-6 animate-bounce" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`badge ${isWord ? 'b-AZUL' : 'b-AMARELO'} text-[10px]`}>
                {isWord ? '📄 Lembrete Semanal de Exportação' : '⏰ Alarme de Estudo Diário'}
              </span>
              <span className={`font-mono text-xs font-bold ${isWord ? 'text-blue-600 dark:text-blue-300' : 'text-amber-600 dark:text-amber-300'}`}>
                {horario}
              </span>
            </div>
            <h3 id="notif-modal-title" className="text-lg font-bold text-zinc-900 dark:text-white mt-0.5">
              {isWord ? 'Hora de Exportar sua Redação para o Word!' : 'Hora de Focar na Aprovação!'}
            </h3>
          </div>
        </div>

        {/* Message Card */}
        <div className="rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-zinc-800 p-4 mb-5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
            {isWord ? 'Instrução do Lembrete Programado:' : 'Meta Programada para Hoje:'}
          </div>
          <p className={`text-sm font-medium leading-relaxed ${isWord ? 'text-blue-700 dark:text-blue-200' : 'text-amber-700 dark:text-amber-200'}`}>
            {mensagem || (isWord 
              ? 'Lembrete semanal: Faça o backup da sua peça prática de 150 linhas no Word (.doc) para arquivar seus treinos!' 
              : 'Hora do seu bloco diário de estudos! Dedique 50 minutos ao Direito Tributário.')}
          </p>
        </div>

        {/* Action Buttons */}
        {isWord ? (
          <div className="space-y-2.5 mb-5">
            <button
              onClick={() => {
                if (onExportarWord) onExportarWord();
                onFechar();
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-3 text-sm font-bold text-white shadow-lg transition"
            >
              <Download className="h-4 w-4" /> Baixar Redação Atual no Word (.doc) Agora
            </button>

            <button
              onClick={() => {
                onIrParaSimulador();
                onFechar();
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 px-4 py-2.5 text-xs font-semibold text-zinc-700 dark:text-zinc-200 transition"
            >
              <FileText className="h-4 w-4 text-sky-500 dark:text-sky-400" /> Abrir Folha de 150 Linhas para Revisar Antes
            </button>
          </div>
        ) : (
          <div className="space-y-2 mb-5">
            <div className="text-xs text-zinc-600 dark:text-zinc-300 font-medium mb-1.5">
              Escolha por onde deseja começar agora:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  onIniciarFoco();
                  onFechar();
                }}
                className="flex items-center gap-2.5 rounded-xl border border-sky-400 bg-sky-600 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-sky-500 transition shadow-sm text-left"
              >
                <Clock className="h-4 w-4 shrink-0 text-sky-200" />
                <div>
                  <div>Iniciar Bloco Foco</div>
                  <div className="text-[10px] font-normal text-sky-100">Pomodoro de Foco</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onIrParaSimulador();
                  onFechar();
                }}
                className="flex items-center gap-2.5 rounded-xl border border-emerald-400 bg-emerald-600 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-sm text-left"
              >
                <FileText className="h-4 w-4 shrink-0 text-emerald-200" />
                <div>
                  <div>Simulador 150L</div>
                  <div className="text-[10px] font-normal text-emerald-100">Redigir peça FGV</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onIrParaCronograma();
                  onFechar();
                }}
                className="flex items-center gap-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-slate-100 dark:bg-zinc-800 px-3.5 py-2.5 text-xs font-bold text-zinc-800 dark:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-700 transition text-left"
              >
                <BookOpen className="h-4 w-4 shrink-0 text-amber-500" />
                <div>
                  <div>Ver Cronograma</div>
                  <div className="text-[10px] font-normal text-zinc-500 dark:text-zinc-400">Tarefas da semana</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onIrParaFlashcards();
                  onFechar();
                }}
                className="flex items-center gap-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-slate-100 dark:bg-zinc-800 px-3.5 py-2.5 text-xs font-bold text-zinc-800 dark:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-700 transition text-left"
              >
                <Sparkles className="h-4 w-4 shrink-0 text-pink-500" />
                <div>
                  <div>Flashcards (36)</div>
                  <div className="text-[10px] font-normal text-zinc-500 dark:text-zinc-400">Repetição rápida</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-black/10 dark:border-white/10 pt-4 text-xs text-zinc-500 dark:text-zinc-400">
          <span>Configurado no Painel de Notificação & LocalStorage</span>
          <button
            onClick={onFechar}
            className="rounded-lg px-3 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition"
          >
            Dispensar por agora
          </button>
        </div>
      </div>
    </div>
  );
}
