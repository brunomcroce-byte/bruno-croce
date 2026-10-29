import React, { useState, useEffect } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Coffee,
  CheckCircle2,
  Download,
  Award,
  Sparkles,
  ArrowRight,
  Headphones,
  Sliders
} from 'lucide-react';
import {
  soundscapeManager,
  SoundscapeTipo,
  SOUNDSCAPE_OPCOES
} from '../utils/soundscapes';
import { dispararMegaConfetes150L } from '../utils/confetti';
import { tocarAlarmeWebAudio } from '../utils/audio';

interface NotificacaoFimSimuladoModalProps {
  aberto: boolean;
  onFechar: () => void;
  linhasCount: number;
  palavrasCount: number;
  casoTitulo: string;
  onExportarWord: () => void;
  onIrParaEspelhoCorrecao: () => void;
  onIniciarPausaPomodoro?: (minutos: number) => void;
}

export const NotificacaoFimSimuladoModal: React.FC<NotificacaoFimSimuladoModalProps> = ({
  aberto,
  onFechar,
  linhasCount,
  palavrasCount,
  casoTitulo,
  onExportarWord,
  onIrParaEspelhoCorrecao,
  onIniciarPausaPomodoro
}) => {
  // Timer de pausa de 15 minutos (15 * 60 = 900 segundos)
  const DURACAO_PAUSA_15M = 15 * 60;
  const [segundosRestantes, setSegundosRestantes] = useState(DURACAO_PAUSA_15M);
  const [pausaAtiva, setPausaAtiva] = useState(false);
  const [pausaConcluida, setPausaConcluida] = useState(false);

  // Áudio de Relaxamento
  const [tipoAudio, setTipoAudio] = useState<SoundscapeTipo>('relaxamento');
  const [audioTocando, setAudioTocando] = useState(false);
  const [volume, setVolume] = useState(() => soundscapeManager.getVolume());

  // Efeito disparador de confetes na abertura
  useEffect(() => {
    if (aberto) {
      dispararMegaConfetes150L();
      tocarAlarmeWebAudio('suave');
      setSegundosRestantes(DURACAO_PAUSA_15M);
      setPausaConcluida(false);
    } else {
      // Quando fechar o modal, para o áudio de relaxamento caso estivesse tocando
      if (audioTocando) {
        soundscapeManager.parar();
        setAudioTocando(false);
      }
      setPausaAtiva(false);
    }
  }, [aberto]);

  // Contagem regressiva da Pausa de 15 Minutos
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (pausaAtiva && segundosRestantes > 0) {
      timer = setInterval(() => {
        setSegundosRestantes(prev => {
          if (prev <= 1) {
            setPausaAtiva(false);
            setPausaConcluida(true);
            tocarAlarmeWebAudio('suave');
            soundscapeManager.parar();
            setAudioTocando(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [pausaAtiva, segundosRestantes]);

  if (!aberto) return null;

  const togglePausaTimer = () => {
    const proximoEstado = !pausaAtiva;
    setPausaAtiva(proximoEstado);

    // Se estiver iniciando a pausa, inicia o áudio de relaxamento automaticamente se ainda não estiver tocando
    if (proximoEstado && !audioTocando) {
      soundscapeManager.reproduzir(tipoAudio);
      setAudioTocando(true);
    }
    tocarAlarmeWebAudio('suave');

    if (onIniciarPausaPomodoro) {
      onIniciarPausaPomodoro(15);
    }
  };

  const reiniciarPausa = () => {
    setPausaAtiva(false);
    setPausaConcluida(false);
    setSegundosRestantes(DURACAO_PAUSA_15M);
  };

  const toggleAudio = () => {
    if (audioTocando) {
      soundscapeManager.parar();
      setAudioTocando(false);
    } else {
      soundscapeManager.reproduzir(tipoAudio);
      setAudioTocando(true);
    }
  };

  const mudarTipoAudio = (novoTipo: SoundscapeTipo) => {
    setTipoAudio(novoTipo);
    if (audioTocando) {
      soundscapeManager.reproduzir(novoTipo);
    }
  };

  const handleVolumeChange = (novoVol: number) => {
    setVolume(novoVol);
    soundscapeManager.setVolume(novoVol);
  };

  const formatarTempo = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const progressoPausa = ((DURACAO_PAUSA_15M - segundosRestantes) / DURACAO_PAUSA_15M) * 100;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-fim-simulado-title"
    >
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-black/[0.12] dark:border-white/10 bg-white dark:bg-[#202020] text-slate-900 dark:text-white shadow-2xl transition-all">
        {/* Barra de Título Windows 11 Chrome */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/[0.08] dark:border-white/[0.08] bg-slate-100/90 dark:bg-[#2b2b2b]/90 select-none">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#0067c0] text-white text-[10px] font-bold shadow-xs">
              🪟
            </span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              TributaOAB • Notificação de Fim de Simulado
            </span>
            <span className="rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2 py-0.2 text-[10px] font-bold">
              150 Linhas FGV Concluídas
            </span>
          </div>

          <button
            type="button"
            onClick={onFechar}
            className="flex h-6 w-8 items-center justify-center rounded text-slate-500 hover:bg-[#c42b1c] hover:text-white transition cursor-pointer"
            aria-label="Fechar notificação"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Conteúdo Principal */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[85vh] overflow-y-auto">
          {/* Cabeçalho da Conquista com Mica e Destaque */}
          <div className="relative overflow-hidden rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent p-4 sm:p-5">
            <div className="flex items-start gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-md shadow-emerald-500/25">
                <Award className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Meta de Peça Oficial Concluída</span>
                </div>
                <h3
                  id="modal-fim-simulado-title"
                  className="text-lg font-bold text-slate-900 dark:text-white tracking-tight"
                >
                  Parabéns! 150 Linhas Redigidas na Íntegra!
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Você completou o limite máximo de 150 linhas da folha pautada oficial da FGV.
                  Sua estrutura prática (endereçamento, qualificação, fatos, mérito e pedidos) está pronta.
                </p>
              </div>
            </div>

            {/* Badges de Métricas */}
            <div className="mt-3.5 pt-3 border-t border-emerald-500/20 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-white/70 dark:bg-black/30 p-2 border border-black/[0.04] dark:border-white/5">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Linhas Pautadas</div>
                <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  {linhasCount} / 150
                </div>
              </div>
              <div className="rounded-lg bg-white/70 dark:bg-black/30 p-2 border border-black/[0.04] dark:border-white/5">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Volume de Texto</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                  {palavrasCount} palavras
                </div>
              </div>
              <div className="rounded-lg bg-white/70 dark:bg-black/30 p-2 border border-black/[0.04] dark:border-white/5 truncate">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Caso FGV</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate" title={casoTitulo}>
                  {casoTitulo.split(':')[0] || 'Caso 1'}
                </div>
              </div>
            </div>
          </div>

          {/* CARD PRINCIPAL: SUGESTÃO DE PAUSA DE 15 MINUTOS */}
          <div className="rounded-xl border border-[#0067c0]/20 dark:border-[#4cc2ff]/20 bg-slate-50 dark:bg-[#272727] p-4 sm:p-5 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  <Coffee className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Pausa Sugerida de 15 Minutos
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Descanse os olhos e a mente antes de avaliar sua nota no espelho FGV.
                  </p>
                </div>
              </div>

              {/* Status da Pausa */}
              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <span
                  className={`h-2 w-2 rounded-full ${
                    pausaAtiva
                      ? 'bg-emerald-500 animate-ping'
                      : pausaConcluida
                      ? 'bg-amber-500'
                      : 'bg-slate-400'
                  }`}
                />
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                  {pausaAtiva ? 'Pausa em andamento' : pausaConcluida ? 'Pausa concluída!' : 'Pronto para iniciar'}
                </span>
              </div>
            </div>

            {/* Cronômetro e Barra de Progresso */}
            <div className="rounded-xl border border-black/[0.08] dark:border-white/10 bg-white dark:bg-black/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                    Tempo Restante de Relaxamento
                  </span>
                  <div className="font-mono text-3xl sm:text-4xl font-extrabold text-[#0067c0] dark:text-[#4cc2ff] tracking-tight">
                    {formatarTempo(segundosRestantes)}
                  </div>
                </div>

                {/* Botões de Ação do Timer */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={togglePausaTimer}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-sm ${
                      pausaAtiva
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                        : 'bg-[#0067c0] hover:bg-[#005fb8] text-white'
                    }`}
                  >
                    {pausaAtiva ? (
                      <>
                        <Pause className="h-3.5 w-3.5" />
                        <span>Pausar</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5 fill-current" />
                        <span>{segundosRestantes < DURACAO_PAUSA_15M ? 'Retomar' : 'Iniciar 15 min'}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={reiniciarPausa}
                    className="p-2 rounded-lg border border-black/[0.08] dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition cursor-pointer"
                    title="Reiniciar para 15 minutos"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Barra de Progresso Fluent */}
              <div className="w-full bg-slate-200 dark:bg-black/40 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#0067c0] to-emerald-500 h-full transition-all duration-1000 rounded-full"
                  style={{ width: `${progressoPausa}%` }}
                />
              </div>
            </div>

            {/* SELETOR DE ÁUDIO DE RELAXAMENTO (WEB AUDIO API) */}
            <div className="rounded-xl border border-black/[0.08] dark:border-white/10 bg-white dark:bg-black/30 p-3.5 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Headphones className="h-4 w-4 text-[#0067c0] dark:text-[#4cc2ff]" />
                  <span className="text-xs font-bold text-slate-800 dark:text-white">
                    Áudio de Relaxamento (Web Audio API)
                  </span>
                  {audioTocando && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Reproduzindo
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={toggleAudio}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition cursor-pointer flex items-center gap-1.5 ${
                    audioTocando
                      ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                      : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25'
                  }`}
                >
                  {audioTocando ? (
                    <>
                      <VolumeX className="h-3.5 w-3.5" />
                      <span>Parar Som</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-3.5 w-3.5" />
                      <span>Tocar Relaxamento</span>
                    </>
                  )}
                </button>
              </div>

              {/* Opções de Paisagens Sonoras de Relaxamento */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SOUNDSCAPE_OPCOES.filter(opt => opt.id !== 'nenhum').map(opt => {
                  const isSelected = tipoAudio === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => mudarTipoAudio(opt.id)}
                      className={`p-2 rounded-lg border text-left transition cursor-pointer flex flex-col justify-between gap-1 ${
                        isSelected
                          ? 'border-[#0067c0] dark:border-[#4cc2ff] bg-[#0067c0]/10 dark:bg-[#4cc2ff]/10 shadow-xs'
                          : 'border-black/[0.06] dark:border-white/5 bg-slate-50 dark:bg-black/20 hover:bg-slate-100 dark:hover:bg-black/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{opt.icone}</span>
                        {isSelected && (
                          <span className="text-[9px] font-bold text-[#0067c0] dark:text-[#4cc2ff]">
                            ✓ Ativo
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-slate-800 dark:text-white truncate">
                          {opt.nome}
                        </div>
                        <div className="text-[9px] text-slate-500 dark:text-slate-400 line-clamp-1">
                          {opt.badge}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Controle de Volume */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs">
                  <Sliders className="h-3 w-3" />
                  <span className="text-[11px]">Volume do áudio:</span>
                </div>
                <div className="flex items-center gap-2 flex-1 max-w-[200px]">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={e => handleVolumeChange(Number(e.target.value))}
                    className="w-full accent-[#0067c0] h-1.5 bg-slate-200 dark:bg-black/40 rounded-lg cursor-pointer"
                  />
                  <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 w-8 text-right">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé com Ações Windows 11 */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t border-black/[0.08] dark:border-white/[0.08] bg-slate-100/90 dark:bg-[#2b2b2b]/90">
          <button
            type="button"
            onClick={onExportarWord}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-black/[0.12] dark:border-white/10 bg-white dark:bg-black/30 hover:bg-slate-50 dark:hover:bg-white/5 text-xs font-semibold text-slate-700 dark:text-slate-200 transition cursor-pointer shadow-xs"
          >
            <Download className="h-3.5 w-3.5 text-[#0067c0] dark:text-[#4cc2ff]" />
            <span>Exportar Peça no Word (.doc)</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onFechar}
              className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg border border-black/[0.12] dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-white/5 transition cursor-pointer"
            >
              Voltar ao Editor
            </button>
            <button
              type="button"
              onClick={() => {
                onFechar();
                onIrParaEspelhoCorrecao();
              }}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer shadow-xs"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Avaliar no Espelho FGV</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
