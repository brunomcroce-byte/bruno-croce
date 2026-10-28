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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notif-modal-title"
    >
      <div className={`relative w-full max-w-lg rounded-2xl border p-6 shadow-2xl text-slate-100 animate-scaleIn ${
        isWord 
          ? 'border-blue-500/80 bg-[#1b232e]' 
          : 'border-amber-500/80 bg-[#1b232e]'
      }`}>
        {/* Close Button */}
        <button
          onClick={onFechar}
          className="absolute top-4 right-4 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          aria-label="Fechar notificação"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header with Pulse Icon */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
            isWord 
              ? 'bg-blue-500/20 border-blue-500 text-blue-400' 
              : 'bg-amber-500/20 border-amber-500 text-amber-400'
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
              <span className={`font-mono text-xs font-bold ${isWord ? 'text-blue-300' : 'text-amber-300'}`}>
                {horario}
              </span>
            </div>
            <h3 id="notif-modal-title" className="text-lg font-bold text-white mt-0.5">
              {isWord ? 'Hora de Exportar sua Redação para o Word!' : 'Hora de Focar na Aprovação!'}
            </h3>
          </div>
        </div>

        {/* Message Card */}
        <div className="rounded-xl border border-[#455468] bg-[#222b38] p-4 mb-5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            {isWord ? 'Instrução do Lembrete Programado:' : 'Meta Programada para Hoje:'}
          </div>
          <p className={`text-sm font-medium leading-relaxed ${isWord ? 'text-blue-200' : 'text-amber-200'}`}>
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
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-800 hover:bg-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-200 transition"
            >
              <FileText className="h-4 w-4 text-sky-400" /> Abrir Folha de 150 Linhas para Revisar Antes
            </button>
          </div>
        ) : (
          <div className="space-y-2 mb-5">
            <div className="text-xs text-slate-300 font-medium mb-1.5">
              Escolha por onde deseja começar agora:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  onIniciarFoco();
                  onFechar();
                }}
                className="flex items-center gap-2.5 rounded-xl border border-sky-400 bg-sky-600/90 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-sky-500 transition shadow-sm text-left"
              >
                <Clock className="h-4 w-4 shrink-0 text-sky-200" />
                <div>
                  <div>Iniciar Bloco Foco</div>
                  <div className="text-[10px] font-normal text-sky-200">Pomodoro de Foco</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onIrParaSimulador();
                  onFechar();
                }}
                className="flex items-center gap-2.5 rounded-xl border border-emerald-400 bg-emerald-600/90 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-sm text-left"
              >
                <FileText className="h-4 w-4 shrink-0 text-emerald-200" />
                <div>
                  <div>Simulador 150L</div>
                  <div className="text-[10px] font-normal text-emerald-200">Redigir peça FGV</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onIrParaCronograma();
                  onFechar();
                }}
                className="flex items-center gap-2.5 rounded-xl border border-[#455468] bg-[#2b3646] px-3.5 py-2.5 text-xs font-bold text-slate-200 hover:border-slate-400 hover:bg-[#344154] transition text-left"
              >
                <BookOpen className="h-4 w-4 shrink-0 text-amber-400" />
                <div>
                  <div>Ver Cronograma</div>
                  <div className="text-[10px] font-normal text-slate-400">Tarefas da semana</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onIrParaFlashcards();
                  onFechar();
                }}
                className="flex items-center gap-2.5 rounded-xl border border-[#455468] bg-[#2b3646] px-3.5 py-2.5 text-xs font-bold text-slate-200 hover:border-slate-400 hover:bg-[#344154] transition text-left"
              >
                <Sparkles className="h-4 w-4 shrink-0 text-pink-400" />
                <div>
                  <div>Flashcards (36)</div>
                  <div className="text-[10px] font-normal text-slate-400">Repetição rápida</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#455468] pt-4 text-xs text-slate-400">
          <span>Configurado no Painel de Notificação & LocalStorage</span>
          <button
            onClick={onFechar}
            className="rounded-lg px-3 py-1 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
          >
            Dispensar por agora
          </button>
        </div>
      </div>
    </div>
  );
}
