/**
 * TributaOAB - Confetes Suaves & Mega Conquista 150 Linhas
 * Animação fluida e de alto desempenho usando Canvas nativo 60fps
 * sem bibliotecas pesadas, com física balística realista, rotação 3D
 * e cascata persistente para grandes conquistas da 2ª Fase OAB.
 */

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  wobble: number;
  wobbleSpeed: number;
  opacity: number;
  decay: number;
  shape: 'rect' | 'circle' | 'star';
}

interface ConfettiOptions {
  count?: number;
  originX?: number; // 0 to 1 (proporção da largura da tela, padrão 0.5)
  originY?: number; // 0 to 1 (proporção da altura da tela, padrão 0.35)
  spread?: number; // dispersão em pixels de velocidade
  angleMinDeg?: number;
  angleMaxDeg?: number;
  gravity?: number;
  decayMin?: number;
  decayMax?: number;
}

const PALETA_CORES = [
  '#f59e0b', // Âmbar FGV / Dourado
  '#fbbf24', // Amarelo Ouro
  '#fde047', // Ouro Brilhante
  '#38bdf8', // Azul Claro Fluent
  '#0284c7', // Azul Royal
  '#10b981', // Esmeralda Aprovação
  '#34d399', // Verde Menta
  '#818cf8', // Índigo / Violeta
  '#ec4899', // Rosa Celebração
  '#a855f7', // Roxo Conquista
  '#ffffff'  // Branco Acetinado
];

let canvasInstance: HTMLCanvasElement | null = null;
let ctxInstance: CanvasRenderingContext2D | null = null;
let animationFrameId: number | null = null;
let particles: ConfettiParticle[] = [];
let timeoutsAtivos: number[] = [];

function obterOuCriarCanvas(): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } | null {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null;
  }

  if (!canvasInstance || !canvasInstance.parentElement) {
    const canvas = document.createElement('canvas');
    canvas.id = 'tributa-confetti-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '99999';
    canvas.setAttribute('aria-hidden', 'true');

    document.body.appendChild(canvas);
    canvasInstance = canvas;
    ctxInstance = canvas.getContext('2d');
  }

  redimensionarCanvas();
  return ctxInstance ? { canvas: canvasInstance, ctx: ctxInstance } : null;
}

function redimensionarCanvas(): void {
  if (!canvasInstance) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = window.innerWidth;
  const h = window.innerHeight;

  if (canvasInstance.width !== w * dpr || canvasInstance.height !== h * dpr) {
    canvasInstance.width = w * dpr;
    canvasInstance.height = h * dpr;
    if (ctxInstance) {
      ctxInstance.scale(dpr, dpr);
    }
  }
}

function desenharEstrela(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fill();
}

function loopAnimacao(): void {
  if (!canvasInstance || !ctxInstance) {
    animationFrameId = null;
    return;
  }

  const w = window.innerWidth;
  const h = window.innerHeight;

  ctxInstance.clearRect(0, 0, w, h);

  // Atualiza e renderiza cada partícula
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];

    p.x += p.vx + Math.sin(p.wobble) * 1.3;
    p.y += p.vy;
    p.vy += 0.14; // Gravidade suave e elegante
    p.vx *= 0.988; // Resistência do ar natural
    p.rotation += p.rotationSpeed;
    p.wobble += p.wobbleSpeed;
    p.opacity -= p.decay;

    // Se saiu da tela ou desvaneceu, remove da memória
    if (p.opacity <= 0 || p.y > h + 60) {
      particles.splice(i, 1);
      continue;
    }

    ctxInstance.save();
    ctxInstance.globalAlpha = Math.max(0, p.opacity);
    ctxInstance.fillStyle = p.color;
    ctxInstance.translate(p.x, p.y);
    ctxInstance.rotate(p.rotation);

    // Efeito de ondulação 3D giratória
    const escala3D = Math.cos(p.wobble);

    if (p.shape === 'star') {
      desenharEstrela(ctxInstance, 0, 0, 5, p.width * Math.abs(escala3D), (p.width / 2) * Math.abs(escala3D));
    } else if (p.shape === 'circle') {
      ctxInstance.beginPath();
      ctxInstance.arc(0, 0, (p.width / 2) * Math.abs(escala3D), 0, Math.PI * 2);
      ctxInstance.fill();
    } else {
      ctxInstance.fillRect(
        (-p.width / 2) * escala3D,
        -p.height / 2,
        p.width * escala3D,
        p.height
      );
    }

    ctxInstance.restore();
  }

  if (particles.length > 0) {
    animationFrameId = requestAnimationFrame(loopAnimacao);
  } else {
    // Limpeza final e parada do loop
    ctxInstance.clearRect(0, 0, w, h);
    animationFrameId = null;
    if (canvasInstance && canvasInstance.parentElement) {
      canvasInstance.parentElement.removeChild(canvasInstance);
      canvasInstance = null;
      ctxInstance = null;
    }
  }
}

/**
 * Dispara uma rajada única de confetes com parâmetros flexíveis.
 */
function dispararRajada(options: ConfettiOptions = {}): void {
  const container = obterOuCriarCanvas();
  if (!container) return;

  const count = options.count ?? 48;
  const originXProp = options.originX ?? 0.5;
  const originYProp = options.originY ?? 0.35;
  const spread = options.spread ?? 1;
  const angleMin = options.angleMinDeg ?? 200;
  const angleMax = options.angleMaxDeg ?? 340;
  const decayMin = options.decayMin ?? 0.005;
  const decayMax = options.decayMax ?? 0.01;

  const startX = window.innerWidth * originXProp;
  const startY = window.innerHeight * originYProp;

  const novasParticulas: ConfettiParticle[] = [];

  for (let i = 0; i < count; i++) {
    const angleDeg = Math.random() * (angleMax - angleMin) + angleMin;
    const angleRad = angleDeg * (Math.PI / 180);
    const speed = (Math.random() * 7 + 4) * spread;

    const cor = PALETA_CORES[Math.floor(Math.random() * PALETA_CORES.length)];
    const rand = Math.random();
    const shape: 'rect' | 'circle' | 'star' = rand > 0.4 ? 'rect' : rand > 0.15 ? 'circle' : 'star';

    novasParticulas.push({
      x: startX + (Math.random() * 50 - 25),
      y: startY + (Math.random() * 30 - 15),
      vx: Math.cos(angleRad) * speed + (Math.random() * 2 - 1),
      vy: Math.sin(angleRad) * speed,
      width: Math.random() * 5 + 7,
      height: Math.random() * 8 + 10,
      color: cor,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() * 0.12 - 0.06),
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.08 + 0.04,
      opacity: 1,
      decay: Math.random() * (decayMax - decayMin) + decayMin,
      shape
    });
  }

  particles.push(...novasParticulas);

  if (!animationFrameId) {
    animationFrameId = requestAnimationFrame(loopAnimacao);
  }
}

/**
 * Dispara uma chuva de confetes suave e não intrusiva.
 * Ideal para pequenas conquistas e tarefas normais do cronograma.
 */
export function dispararConfetesSuaves(options: ConfettiOptions = {}): void {
  dispararRajada({
    count: options.count ?? 48,
    originX: options.originX ?? 0.5,
    originY: options.originY ?? 0.35,
    spread: options.spread ?? 1,
    decayMin: 0.006,
    decayMax: 0.012
  });
}

/**
 * ANIMAÇÃO ÉPICA DE CONQUISTA: 150 LINHAS FGV CONCLUÍDAS
 * Animação densa, persistente e em múltiplos canhões sincronizados
 * que dura de 6 a 8 segundos com cascata contínua de partículas douradas,
 * estrelas e serpentinas para recompensar o esforço máximo do aluno.
 */
export function dispararMegaConfetes150L(): void {
  // Limpa eventuais temporizadores anteriores
  limparTimeoutsConfetes();

  // Onda 1 (t=0ms): Canhões duplos diagonais a partir dos cantos inferiores
  dispararRajada({
    count: 85,
    originX: 0.08,
    originY: 0.82,
    angleMinDeg: 285,
    angleMaxDeg: 335,
    spread: 1.45,
    decayMin: 0.0025,
    decayMax: 0.0045 // Queda super persistente
  });

  dispararRajada({
    count: 85,
    originX: 0.92,
    originY: 0.82,
    angleMinDeg: 205,
    angleMaxDeg: 255,
    spread: 1.45,
    decayMin: 0.0025,
    decayMax: 0.0045
  });

  // Onda 2 (t=350ms): Fonte central exuberante de estrelas e dourados
  const t1 = window.setTimeout(() => {
    dispararRajada({
      count: 90,
      originX: 0.5,
      originY: 0.28,
      angleMinDeg: 190,
      angleMaxDeg: 350,
      spread: 1.35,
      decayMin: 0.002,
      decayMax: 0.004
    });
  }, 350);
  timeoutsAtivos.push(t1);

  // Onda 3 (t=900ms): Chuva diagonal esquerda com velocidade reforçada
  const t2 = window.setTimeout(() => {
    dispararRajada({
      count: 75,
      originX: 0.2,
      originY: 0.45,
      angleMinDeg: 230,
      angleMaxDeg: 320,
      spread: 1.25,
      decayMin: 0.0025,
      decayMax: 0.005
    });
  }, 900);
  timeoutsAtivos.push(t2);

  // Onda 4 (t=1600ms): Chuva diagonal direita para manter a persistência
  const t3 = window.setTimeout(() => {
    dispararRajada({
      count: 75,
      originX: 0.8,
      originY: 0.45,
      angleMinDeg: 220,
      angleMaxDeg: 310,
      spread: 1.25,
      decayMin: 0.0025,
      decayMax: 0.005
    });
  }, 1600);
  timeoutsAtivos.push(t3);

  // Onda 5 (t=2400ms): Grand Finale de poeira estelar cintilante do topo da tela
  const t4 = window.setTimeout(() => {
    dispararRajada({
      count: 80,
      originX: 0.5,
      originY: 0.1,
      angleMinDeg: 180,
      angleMaxDeg: 360,
      spread: 1.2,
      decayMin: 0.002,
      decayMax: 0.0038
    });
  }, 2400);
  timeoutsAtivos.push(t4);
}

function limparTimeoutsConfetes() {
  timeoutsAtivos.forEach(t => clearTimeout(t));
  timeoutsAtivos = [];
}

/**
 * Remove imediatamente todos os confetes da tela (ao fechar modais, etc.)
 */
export function limparConfetes(): void {
  limparTimeoutsConfetes();
  particles = [];
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  if (canvasInstance && canvasInstance.parentElement) {
    canvasInstance.parentElement.removeChild(canvasInstance);
    canvasInstance = null;
    ctxInstance = null;
  }
}
