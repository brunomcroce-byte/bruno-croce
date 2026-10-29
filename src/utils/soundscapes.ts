/**
 * Soundscape de Foco via Web Audio API para o Bloco Pomodoro.
 * Gera áudios sintéticos puros (sem dependência de arquivos externos ou rede):
 * - Ruído Branco / Pink Noise (foco constante e isolamento acústico)
 * - Chuva (camada de chuva relaxante com modulação e gotas)
 * - Lo-fi (acordes quentes de piano Rhodes/jazz com filtro low-pass, wow & flutter e textura analógica)
 */

import { SafeStorage } from './storage';

export type SoundscapeTipo = 'nenhum' | 'ruido_branco' | 'chuva' | 'lofi' | 'relaxamento';

export interface SoundscapeOpcao {
  id: SoundscapeTipo;
  nome: string;
  icone: string;
  descricao: string;
  badge: string;
}

export const SOUNDSCAPE_OPCOES: SoundscapeOpcao[] = [
  {
    id: 'nenhum',
    nome: 'Silêncio',
    icone: '🔇',
    descricao: 'Sem som de fundo durante o estudo',
    badge: 'Mudo'
  },
  {
    id: 'relaxamento',
    nome: 'Relaxamento & Meditação',
    icone: '🧘',
    descricao: 'Ondas alpha suaves, ressonância harmônica e respiração para descanso pós-simulado',
    badge: 'Pausa 15m'
  },
  {
    id: 'ruido_branco',
    nome: 'Ruído Branco',
    icone: '💨',
    descricao: 'Ruído rosa filtrado para mascarar distrações externas',
    badge: 'Isolamento'
  },
  {
    id: 'chuva',
    nome: 'Chuva',
    icone: '🌧️',
    descricao: 'Tempestade suave e relaxante com gotas e vento calmo',
    badge: 'Relaxante'
  },
  {
    id: 'lofi',
    nome: 'Lo-fi',
    icone: '☕',
    descricao: 'Acordes jazzy mornos com efeito fita analógica e texturas',
    badge: 'Foco Profundo'
  }
];

class SoundscapeManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeTipo: SoundscapeTipo = 'nenhum';
  private isPlaying: boolean = false;
  private volume: number = 0.5; // 0 a 1

  // Referências para parar nós ativos
  private activeSources: AudioNode[] = [];
  private activeIntervals: number[] = [];

  constructor() {
    try {
      const volSalvo = SafeStorage.get('tributa_pomodoro_soundscape_vol', '0.5');
      this.volume = Math.max(0, Math.min(1, Number(volSalvo) || 0.5));
    } catch {
      this.volume = 0.5;
    }
  }

  private initContext(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return false;

      if (!this.ctx || this.ctx.state === 'closed') {
        this.ctx = new AudioCtx();
      }

      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      if (!this.masterGain) {
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
      return true;
    } catch {
      return false;
    }
  }

  public getTipoAtivo(): SoundscapeTipo {
    return this.activeTipo;
  }

  public getVolume(): number {
    return this.volume;
  }

  public isAtivo(): boolean {
    return this.isPlaying && this.activeTipo !== 'nenhum';
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    SafeStorage.set('tributa_pomodoro_soundscape_vol', String(this.volume));
    if (this.ctx && this.masterGain) {
      try {
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(this.volume, this.ctx.currentTime + 0.1);
      } catch {}
    }
  }

  public parar(): void {
    if (!this.isPlaying) return;
    this.isPlaying = false;

    // Cancela intervals de loop de acordes se houver
    this.activeIntervals.forEach((id) => clearInterval(id));
    this.activeIntervals = [];

    // Fade out suave
    if (this.ctx && this.masterGain) {
      try {
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
      } catch {}
    }

    setTimeout(() => {
      this.activeSources.forEach((src) => {
        try {
          if ('stop' in src && typeof (src as AudioScheduledSourceNode).stop === 'function') {
            (src as AudioScheduledSourceNode).stop();
          }
          src.disconnect();
        } catch {}
      });
      this.activeSources = [];
      if (this.masterGain && this.ctx) {
        try {
          this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        } catch {}
      }
    }, 280);
  }

  public reproduzir(tipo: SoundscapeTipo): void {
    this.activeTipo = tipo;
    SafeStorage.set('tributa_pomodoro_soundscape', tipo);

    if (tipo === 'nenhum') {
      this.parar();
      return;
    }

    if (!this.initContext() || !this.ctx || !this.masterGain) return;

    // Se já estiver tocando algo, para primeiro antes de iniciar o novo
    if (this.isPlaying) {
      this.parar();
    }

    // Garante que o AudioContext está em execução
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    this.isPlaying = true;
    this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(this.volume, this.ctx.currentTime + 0.4);

    if (tipo === 'ruido_branco') {
      this.gerarRuidoBranco();
    } else if (tipo === 'chuva') {
      this.gerarChuva();
    } else if (tipo === 'lofi') {
      this.gerarLofi();
    } else if (tipo === 'relaxamento') {
      this.gerarRelaxamento();
    }
  }

  /**
   * 1. RUIDO BRANCO / ROSA (White & Pink Noise Warm Filtered)
   * Gera ruído contínuo com filtro passa-baixa em 900Hz para abafar ruídos de trânsito e conversas
   */
  private gerarRuidoBranco(): void {
    if (!this.ctx || !this.masterGain) return;
    const sampleRate = this.ctx.sampleRate;
    const bufferSize = sampleRate * 5; // 5 segundos em loop perfeito
    const buffer = this.ctx.createBuffer(2, bufferSize, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const output = buffer.getChannelData(channel);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        b3 = 0.8665 * b3 + white * 0.3104856;
        b4 = 0.55 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.016898;
        const pink = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.085;
        b6 = white * 0.115926;
        output[i] = pink;
      }
    }

    const whiteNoiseSource = this.ctx.createBufferSource();
    whiteNoiseSource.buffer = buffer;
    whiteNoiseSource.loop = true;

    // Filtro passa-baixa suave para não agredir os ouvidos
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(850, this.ctx.currentTime);
    filter.Q.setValueAtTime(0.7, this.ctx.currentTime);

    whiteNoiseSource.connect(filter);
    filter.connect(this.masterGain);

    whiteNoiseSource.start();
    this.activeSources.push(whiteNoiseSource, filter);
  }

  /**
   * 2. CHUVA (Rain Soundscape)
   * Combina camada densa de chuva constante, modulação suave de vento e respingos
   */
  private gerarChuva(): void {
    if (!this.ctx || !this.masterGain) return;
    const sampleRate = this.ctx.sampleRate;
    const bufferSize = sampleRate * 4;
    const buffer = this.ctx.createBuffer(2, bufferSize, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Brown/Pink noise filter
        lastOut = (lastOut + 0.025 * white) / 1.025;
        data[i] = lastOut * 2.8;
      }
    }

    const rainBedSource = this.ctx.createBufferSource();
    rainBedSource.buffer = buffer;
    rainBedSource.loop = true;

    // Filtro de corte de chuva
    const rainFilter = this.ctx.createBiquadFilter();
    rainFilter.type = 'lowpass';
    rainFilter.frequency.setValueAtTime(1400, this.ctx.currentTime);

    // LFO para oscilação natural da intensidade da chuva
    const rainLfo = this.ctx.createOscillator();
    const rainLfoGain = this.ctx.createGain();
    rainLfo.frequency.setValueAtTime(0.18, this.ctx.currentTime); // modulação lenta a cada ~5.5s
    rainLfoGain.gain.setValueAtTime(0.2, this.ctx.currentTime);

    const rainGain = this.ctx.createGain();
    rainGain.gain.setValueAtTime(0.75, this.ctx.currentTime);

    rainBedSource.connect(rainFilter);
    rainFilter.connect(rainGain);
    rainGain.connect(this.masterGain);

    rainLfo.connect(rainLfoGain);
    rainLfoGain.connect(rainGain.gain);

    rainBedSource.start();
    rainLfo.start();
    this.activeSources.push(rainBedSource, rainFilter, rainLfo, rainLfoGain, rainGain);

    // Camada adicional de gotas de água estalando suavemente (Highpass noise)
    const dropBuffer = this.ctx.createBuffer(1, sampleRate * 2, sampleRate);
    const dropData = dropBuffer.getChannelData(0);
    for (let i = 0; i < dropData.length; i++) {
      dropData[i] = (Math.random() * 2 - 1) * 0.04;
    }
    const dropSource = this.ctx.createBufferSource();
    dropSource.buffer = dropBuffer;
    dropSource.loop = true;

    const dropFilter = this.ctx.createBiquadFilter();
    dropFilter.type = 'highpass';
    dropFilter.frequency.setValueAtTime(2600, this.ctx.currentTime);

    const dropGain = this.ctx.createGain();
    dropGain.gain.setValueAtTime(0.25, this.ctx.currentTime);

    dropSource.connect(dropFilter);
    dropFilter.connect(dropGain);
    dropGain.connect(this.masterGain);

    dropSource.start();
    this.activeSources.push(dropSource, dropFilter, dropGain);
  }

  /**
   * 3. LO-FI (Chill Jazz Chords & Tape Warmth)
   * Sequência contínua de acordes relaxantes de piano Rhodes em loop, com filtro passa-baixa quente,
   * efeito "wow & flutter" de fita analógica e texturizador sutil.
   */
  private gerarLofi(): void {
    if (!this.ctx || !this.masterGain) return;

    // Progressão suave de acordes Lo-fi (frequências em Hz):
    // 1. Fmaj7: F3, A3, C4, E4
    // 2. Em7:   E3, G3, B3, D4
    // 3. Dm7:   D3, F3, A3, C4
    // 4. Cmaj7: C3, E3, G3, B3
    const acordes = [
      [174.61, 220.0, 261.63, 329.63],
      [164.81, 196.0, 246.94, 293.66],
      [146.83, 174.61, 220.0, 261.63],
      [130.81, 164.81, 196.0, 246.94]
    ];

    let chordIdx = 0;
    const duracaoAcordeSegundos = 4.2;

    const tocarAcorde = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const freqs = acordes[chordIdx % acordes.length];
      chordIdx++;

      const now = this.ctx.currentTime;
      const attack = 0.55;
      const decay = 3.6;

      // Master bus do acorde com filtro low-pass mofado/vintage
      const chordFilter = this.ctx.createBiquadFilter();
      chordFilter.type = 'lowpass';
      chordFilter.frequency.setValueAtTime(520, now); // som abafado de fita cassete
      chordFilter.Q.setValueAtTime(1.1, now);

      // Efeito Wow & Flutter analógico (modulação sutil de pitch)
      const vibrato = this.ctx.createOscillator();
      const vibratoGain = this.ctx.createGain();
      vibrato.frequency.setValueAtTime(4.2, now); // 4.2 Hz
      vibratoGain.gain.setValueAtTime(1.8, now); // leve flutuação de 1.8 Hz

      vibrato.connect(vibratoGain);
      vibrato.start(now);
      vibrato.stop(now + duracaoAcordeSegundos + 0.5);

      const chordGain = this.ctx.createGain();
      chordGain.gain.setValueAtTime(0.001, now);
      chordGain.gain.exponentialRampToValueAtTime(0.28, now + attack);
      chordGain.gain.exponentialRampToValueAtTime(0.001, now + attack + decay);

      chordFilter.connect(chordGain);
      chordGain.connect(this.masterGain);

      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        // Onda triangular rica, suavemente aquecida
        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        vibratoGain.connect(osc.frequency);

        osc.connect(chordFilter);
        osc.start(now);
        osc.stop(now + duracaoAcordeSegundos + 0.3);
      });
    };

    // Toca o primeiro acorde de imediato
    tocarAcorde();

    // Loop a cada 4.2 segundos
    const intervalId = window.setInterval(() => {
      tocarAcorde();
    }, duracaoAcordeSegundos * 1000);

    this.activeIntervals.push(intervalId);

    // Adiciona textura de vinil sutil de fundo (crackle quente)
    const vinylSampleRate = this.ctx.sampleRate;
    const vinylBuffer = this.ctx.createBuffer(1, vinylSampleRate * 2, vinylSampleRate);
    const vData = vinylBuffer.getChannelData(0);
    for (let i = 0; i < vData.length; i++) {
      // Pequenos estalidos de agulha de toca-discos
      const isPop = Math.random() < 0.0012;
      vData[i] = isPop ? (Math.random() * 2 - 1) * 0.12 : (Math.random() * 2 - 1) * 0.005;
    }
    const vinylSource = this.ctx.createBufferSource();
    vinylSource.buffer = vinylBuffer;
    vinylSource.loop = true;

    const vinylFilter = this.ctx.createBiquadFilter();
    vinylFilter.type = 'bandpass';
    vinylFilter.frequency.setValueAtTime(1200, this.ctx.currentTime);
    vinylFilter.Q.setValueAtTime(0.8, this.ctx.currentTime);

    const vinylGain = this.ctx.createGain();
    vinylGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

    vinylSource.connect(vinylFilter);
    vinylFilter.connect(vinylGain);
    vinylGain.connect(this.masterGain);

    vinylSource.start();
    this.activeSources.push(vinylSource, vinylFilter, vinylGain);
  }

  /**
   * 4. RELAXAMENTO & MEDITAÇÃO (Ondas Alpha, Drones Harmônicos e Respiração Sonora)
   * Criado especialmente para descanso pós-simulado e pausas de 15 minutos:
   * - Acorde de repouso harmônico puro (108Hz, 216Hz, 324Hz, 432Hz)
   * - Batimento binaural suave de 10Hz (ritmo cerebral Alpha restaurador)
   * - Modulação cíclica de respiração relaxante (ciclo de 10s inspirar/expirar)
   * - Sino/tigela tibetana suave a 528Hz a cada 7.5 segundos com decaimento exponencial
   */
  private gerarRelaxamento(): void {
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;

    // Filtro master quente para sons terapêuticos
    const relaxFilter = this.ctx.createBiquadFilter();
    relaxFilter.type = 'lowpass';
    relaxFilter.frequency.setValueAtTime(380, now);
    relaxFilter.Q.setValueAtTime(1.2, now);

    // LFO de respiração lenta (0.09 Hz = ciclo de ~11s inspirar/expirar)
    const breathLfo = this.ctx.createOscillator();
    const breathGain = this.ctx.createGain();
    breathLfo.frequency.setValueAtTime(0.09, now);
    breathGain.gain.setValueAtTime(180, now); // modula o filtro entre ~200Hz e ~560Hz
    breathLfo.connect(breathGain);
    breathGain.connect(relaxFilter.frequency);
    breathLfo.start(now);
    this.activeSources.push(breathLfo, breathGain);

    // Ganho principal da camada de drones
    const droneGain = this.ctx.createGain();
    droneGain.gain.setValueAtTime(0.38, now);
    relaxFilter.connect(droneGain);
    droneGain.connect(this.masterGain);
    this.activeSources.push(relaxFilter, droneGain);

    // Drones harmônicos de repouso (A2=108Hz, A3=216Hz, E4=324Hz)
    const droneFreqs = [108, 216, 324];
    droneFreqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      const oscGain = this.ctx.createGain();
      oscGain.gain.setValueAtTime(idx === 0 ? 0.35 : 0.2, now);

      osc.connect(oscGain);
      oscGain.connect(relaxFilter);
      osc.start(now);
      this.activeSources.push(osc, oscGain);
    });

    // Batimento Alpha (216Hz vs 226Hz = 10Hz de pulsação suave relaxante)
    const alphaOsc = this.ctx.createOscillator();
    alphaOsc.type = 'sine';
    alphaOsc.frequency.setValueAtTime(226, now);
    const alphaGain = this.ctx.createGain();
    alphaGain.gain.setValueAtTime(0.15, now);
    alphaOsc.connect(alphaGain);
    alphaGain.connect(relaxFilter);
    alphaOsc.start(now);
    this.activeSources.push(alphaOsc, alphaGain);

    // Sino Tibetano / Chime 528Hz a cada 7.5 segundos
    const tocarChime = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const chimeNow = this.ctx.currentTime;
      const chimeOsc = this.ctx.createOscillator();
      chimeOsc.type = 'sine';
      chimeOsc.frequency.setValueAtTime(528, chimeNow); // frequência regenerativa 528Hz

      const chimeGain = this.ctx.createGain();
      chimeGain.gain.setValueAtTime(0.001, chimeNow);
      chimeGain.gain.exponentialRampToValueAtTime(0.18, chimeNow + 0.05);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, chimeNow + 5.5);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(this.masterGain);

      chimeOsc.start(chimeNow);
      chimeOsc.stop(chimeNow + 6.0);
    };

    tocarChime();
    const chimeInterval = window.setInterval(() => {
      tocarChime();
    }, 7500);
    this.activeIntervals.push(chimeInterval);
  }
}

// Instância singleton global
export const soundscapeManager = new SoundscapeManager();
