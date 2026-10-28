import { SafeStorage } from './storage';

export type TomAlarme = 'padrao' | 'suave' | 'urgente';

export interface InfoTomAlarme {
  id: TomAlarme;
  nome: string;
  descricao: string;
  icone: string;
  corTag: string;
}

export const TONS_ALARME: InfoTomAlarme[] = [
  {
    id: 'padrao',
    nome: 'Padrão',
    descricao: 'Acorde harmônico ascendente clássico (C5 → C6)',
    icone: '🔔',
    corTag: 'text-amber-400 border-amber-500/40 bg-amber-500/10'
  },
  {
    id: 'suave',
    nome: 'Suave',
    descricao: 'Campânula zen e discreta com ondas senoidais mornas',
    icone: '🍃',
    corTag: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
  },
  {
    id: 'urgente',
    nome: 'Urgente',
    descricao: 'Alerta duplo pulsante de alta prioridade (Staccato rápido)',
    icone: '⚡',
    corTag: 'text-rose-400 border-rose-500/40 bg-rose-500/10'
  }
];

export function tocarAlarmeWebAudio(tomEscolhido?: TomAlarme): void {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // Recupera tom das preferências salvas no LocalStorage caso não passado explicitamente
    const tom =
      tomEscolhido ||
      (SafeStorage.get('tributa_notif_tom_alarme', 'padrao') as TomAlarme) ||
      'padrao';

    if (tom === 'suave') {
      // Tom Suave: Frequências mornas, onda senoidal (sine), ataque suave e decay longo e calmo
      const frequencies = [440.0, 554.37, 659.25]; // A4, C#5, E5
      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.16);
        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.16);
        gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + idx * 0.16 + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.16 + 0.85);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.16);
        osc.stop(ctx.currentTime + idx * 0.16 + 0.9);
      });
    } else if (tom === 'urgente') {
      // Tom Urgente: Beeps staccato rápidos com harmônicos pontiagudos (sawtooth/square)
      const beeps = [
        { freq: 880, start: 0, dur: 0.09 },
        { freq: 1174.66, start: 0.11, dur: 0.09 },
        { freq: 880, start: 0.26, dur: 0.09 },
        { freq: 1174.66, start: 0.38, dur: 0.16 }
      ];
      beeps.forEach((b) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(b.freq, ctx.currentTime + b.start);
        gain.gain.setValueAtTime(0.18, ctx.currentTime + b.start);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + b.start + b.dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + b.start);
        osc.stop(ctx.currentTime + b.start + b.dur + 0.02);
      });
    } else {
      // Tom Padrão: Acorde clássico em onda triangular C5, E5, G5, C6
      const frequencies = [523.25, 659.25, 783.99, 1046.5];
      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0.22, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 0.35);
      });
    }
  } catch {
    // AudioContext bloqueado pela política de reprodução do navegador antes da interação
  }
}

export function lerTextoEmVozAlta(texto: string): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
  }
}

export function testarAlarmeSonoro(tom?: TomAlarme): void {
  tocarAlarmeWebAudio(tom);
  lerTextoEmVozAlta('Sistema em funcionamento! Alarme testado com sucesso.');
}
