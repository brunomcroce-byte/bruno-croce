/**
 * TributaOAB - Confetes Suaves (Smooth Celebration Animation)
 * Animação suave e fluida de confetes usando Canvas nativo 60fps
 * sem dependências pesadas, com auto-limpeza e física de queda graciosa.
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
  shape: 'rect' | 'circle';
}

interface ConfettiOptions {
  count?: number;
  originX?: number; // 0 to 1 (proporção da largura da tela, padrão 0.5)
  originY?: number; // 0 to 1 (proporção da altura da tela, padrão 0.35)
  spread?: number; // dispersão em pixels de velocidade
}

const PALETA_CORES = [
  '#f59e0b', // Âmbar FGV / Dourado
  '#fbbf24', // Amarelo Ouro
  '#38bdf8', // Azul Claro Fluent
  '#0284c7', // Azul Royal
  '#10b981', // Esmeralda Sucesso
  '#34d399', // Verde Menta
  '#818cf8', // Índigo / Violeta
  '#ec4899', // Rosa Celebração
  '#e0e7ff'  // Branco Acetinado
];

let canvasInstance: HTMLCanvasElement | null = null;
let ctxInstance: CanvasRenderingContext2D | null = null;
let animationFrameId: number | null = null;
let particles: ConfettiParticle[] = [];

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

function loopAnimacao(): void {
  if (!canvasInstance || !ctxInstance) {
    animationFrameId = null;
    return;
  }

  const w = window.innerWidth;
  const h = window.innerHeight;

  ctxInstance.clearRect(0, 0, w, h);

  // Atualiza e desenha cada partícula
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];

    p.x += p.vx + Math.sin(p.wobble) * 1.2;
    p.y += p.vy;
    p.vy += 0.16; // Gravidade suave e elegante
    p.vx *= 0.985; // Resistência do ar suave
    p.rotation += p.rotationSpeed;
    p.wobble += p.wobbleSpeed;
    p.opacity -= p.decay;

    // Se saiu da tela ou ficou transparente, remove
    if (p.opacity <= 0 || p.y > h + 50) {
      particles.splice(i, 1);
      continue;
    }

    ctxInstance.save();
    ctxInstance.globalAlpha = Math.max(0, p.opacity);
    ctxInstance.fillStyle = p.color;
    ctxInstance.translate(p.x, p.y);
    ctxInstance.rotate(p.rotation);

    // Efeito de ondulação 3D no papel (escala horizontal oscilante)
    const escala3D = Math.cos(p.wobble);

    if (p.shape === 'circle') {
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
 * Dispara uma chuva de confetes suave e não intrusiva.
 * Perfeita para conclusão de tarefas no cronograma ou metas do simulador.
 */
export function dispararConfetesSuaves(options: ConfettiOptions = {}): void {
  const container = obterOuCriarCanvas();
  if (!container) return;

  const count = options.count ?? 48; // Quantidade elegante e suave
  const originXProp = options.originX ?? 0.5;
  const originYProp = options.originY ?? 0.35;
  const spread = options.spread ?? 1;

  const startX = window.innerWidth * originXProp;
  const startY = window.innerHeight * originYProp;

  const novasParticulas: ConfettiParticle[] = [];

  for (let i = 0; i < count; i++) {
    // Ângulo de dispersão leve para cima e para os lados
    const angle = (Math.random() * 140 + 200) * (Math.PI / 180); // 200° a 340° (arco ascendente)
    const speed = (Math.random() * 6 + 3.5) * spread;

    const cor = PALETA_CORES[Math.floor(Math.random() * PALETA_CORES.length)];
    const shape: 'rect' | 'circle' = Math.random() > 0.3 ? 'rect' : 'circle';

    novasParticulas.push({
      x: startX + (Math.random() * 40 - 20),
      y: startY + (Math.random() * 20 - 10),
      vx: Math.cos(angle) * speed + (Math.random() * 2 - 1),
      vy: Math.sin(angle) * speed,
      width: Math.random() * 4 + 7,
      height: Math.random() * 6 + 10,
      color: cor,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() * 0.1 - 0.05) * 1.5,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.08 + 0.04,
      opacity: 1,
      decay: Math.random() * 0.005 + 0.007, // Duração de ~2.5 a 4 segundos
      shape
    });
  }

  particles.push(...novasParticulas);

  if (!animationFrameId) {
    animationFrameId = requestAnimationFrame(loopAnimacao);
  }
}
