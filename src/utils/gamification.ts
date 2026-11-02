/**
 * Gamificação Completa TributaOAB Desktop Pro
 * Sistema de XP, Níveis de Carreira Tributária, Badges/Conquistas e Sequência (Streak)
 */

import { SafeStorage } from './storage';

export interface PatenteNivel {
  nivel: number;
  titulo: string;
  subtitulo: string;
  xpMinimo: number;
  xpProximo: number;
  icone: string;
  cor: string;
}

export const PATENTES_TRIBUTARIAS: PatenteNivel[] = [
  {
    nivel: 1,
    titulo: 'Estagiário Tributário',
    subtitulo: 'Iniciando o mapeamento das regras de competência e tributos',
    xpMinimo: 0,
    xpProximo: 300,
    icone: '🌱',
    cor: '#64748b'
  },
  {
    nivel: 2,
    titulo: 'Conciliador Fiscal',
    subtitulo: 'Dominando distinção entre impostos, taxas e contribuições',
    xpMinimo: 300,
    xpProximo: 800,
    icone: '⚖️',
    cor: '#0284c7'
  },
  {
    nivel: 3,
    titulo: 'Bacharel de Prontidão',
    subtitulo: 'Afiado em anterioridade, legalidade estrita e imunidades',
    xpMinimo: 800,
    xpProximo: 1600,
    icone: '📜',
    cor: '#0078d4'
  },
  {
    nivel: 4,
    titulo: 'Advogado Tributarista',
    subtitulo: 'Estruturação impecável de peças da inicial à execução',
    xpMinimo: 1600,
    xpProximo: 2600,
    icone: '💼',
    cor: '#2563eb'
  },
  {
    nivel: 5,
    titulo: 'Especialista em Teses FGV',
    subtitulo: 'Mapeamento certeiro de precedentes e súmulas vinculantes',
    xpMinimo: 2600,
    xpProximo: 4000,
    icone: '🎯',
    cor: '#1d4ed8'
  },
  {
    nivel: 6,
    titulo: 'Mestre da LEF & Repetição',
    subtitulo: 'Estrategista de defesas fiscais, EPE, embargos e cautelares',
    xpMinimo: 4000,
    xpProximo: 6000,
    icone: '🛡️',
    cor: '#0369a1'
  },
  {
    nivel: 7,
    titulo: 'Tributarista de Elite OAB',
    subtitulo: 'Nota 10 no espelho de correção da banca FGV!',
    xpMinimo: 6000,
    xpProximo: 99999,
    icone: '👑',
    cor: '#d97706'
  }
];

export interface Conquista {
  id: string;
  titulo: string;
  descricao: string;
  categoria: 'redacao' | 'pomodoro' | 'flashcards' | 'vademecum' | 'estudo' | 'constancia';
  icone: string;
  xpBonus: number;
}

export const LISTA_CONQUISTAS: Conquista[] = [
  {
    id: 'primeira_linha',
    titulo: 'Primeira Linha',
    descricao: 'Redigiu a primeira linha na folha oficial de 150 linhas.',
    categoria: 'redacao',
    icone: '✍️',
    xpBonus: 25
  },
  {
    id: 'cinquenta_linhas',
    titulo: 'Ritmo de Petição',
    descricao: 'Alcançou 50 linhas redigidas no simulador de peça.',
    categoria: 'redacao',
    icone: '📝',
    xpBonus: 50
  },
  {
    id: 'cem_linhas',
    titulo: 'Domínio da Peça',
    descricao: 'Alcançou 100 linhas redigidas com fundamentação técnica.',
    categoria: 'redacao',
    icone: '📑',
    xpBonus: 80
  },
  {
    id: 'folha_completa',
    titulo: 'Mestre das 150 Linhas',
    descricao: 'Completou o limite máximo de 150 linhas oficiais da FGV.',
    categoria: 'redacao',
    icone: '🏆',
    xpBonus: 150
  },
  {
    id: 'bloco_foco',
    titulo: 'Foco Inicial',
    descricao: 'Completou com êxito seu 1º bloco de Pomodoro.',
    categoria: 'pomodoro',
    icone: '⏱️',
    xpBonus: 30
  },
  {
    id: 'foco_inabalavel',
    titulo: 'Foco de Ferro',
    descricao: 'Concluiu 4 blocos de Pomodoro no mesmo dia de estudo.',
    categoria: 'pomodoro',
    icone: '🔥',
    xpBonus: 90
  },
  {
    id: 'maratona_pomodoro',
    titulo: 'Maratona Pomodoro',
    descricao: 'Acumulou 10 blocos de concentração produtiva.',
    categoria: 'pomodoro',
    icone: '🚀',
    xpBonus: 120
  },
  {
    id: 'flash_iniciante',
    titulo: 'Memória Jurídica',
    descricao: 'Revisou e acertou 10 flashcards de Direito Tributário.',
    categoria: 'flashcards',
    icone: '💡',
    xpBonus: 40
  },
  {
    id: 'flash_mestre',
    titulo: 'Retenção Ativa FGV',
    descricao: 'Dominou 25 flashcards com conceitos cruciais do exame.',
    categoria: 'flashcards',
    icone: '🧠',
    xpBonus: 100
  },
  {
    id: 'vade_explorador',
    titulo: 'Vade Mecum Turbinado',
    descricao: 'Marcou 5 artigos utilizando o código de 4 cores da FGV.',
    categoria: 'vademecum',
    icone: '📖',
    xpBonus: 35
  },
  {
    id: 'vade_expert',
    titulo: 'Artigo na Ponta da Língua',
    descricao: 'Marcou 20 artigos fundamentais para a 2ª Fase.',
    categoria: 'vademecum',
    icone: '📚',
    xpBonus: 90
  },
  {
    id: 'vade_desafio',
    titulo: 'Desafio Relâmpago',
    descricao: 'Acertou o teste de localização física rápida no Vade Mecum.',
    categoria: 'vademecum',
    icone: '⚡',
    xpBonus: 50
  },
  {
    id: 'guardiao_prazos',
    titulo: 'Guardião dos Prazos',
    descricao: 'Acessou e conferiu as datas críticas: 12/11 (17h) e 13/11.',
    categoria: 'estudo',
    icone: '🔔',
    xpBonus: 30
  },
  {
    id: 'metas_cumpridas',
    titulo: 'Meta Diária Conquistada',
    descricao: 'Concluiu todas as metas diárias propostas para o dia.',
    categoria: 'estudo',
    icone: '🎯',
    xpBonus: 70
  },
  {
    id: 'simulado_fgv',
    titulo: 'Simulado Realista',
    descricao: 'Praticou o Simulado Semanal Oficial nos padrões FGV.',
    categoria: 'estudo',
    icone: '⚖️',
    xpBonus: 120
  },
  {
    id: 'constancia_bronze',
    titulo: 'Chama Acesa (3 Dias)',
    descricao: 'Manteve 3 dias seguidos com atividade de estudo registrada.',
    categoria: 'constancia',
    icone: '🔥',
    xpBonus: 60
  },
  {
    id: 'constancia_prata',
    titulo: 'Rotina de Aprovado (7 Dias)',
    descricao: 'Completou 7 dias ininterruptos de dedicação à 2ª Fase.',
    categoria: 'constancia',
    icone: '⭐',
    xpBonus: 150
  },
  {
    id: 'som_do_foco',
    titulo: 'Imersão Acústica',
    descricao: 'Ativou soundscape sonoro durante a redação ou leitura.',
    categoria: 'estudo',
    icone: '🎧',
    xpBonus: 20
  },
  {
    id: 'backup_seguro',
    titulo: 'Diligência Processual',
    descricao: 'Gerou backup no Word ou relatório semanal completo em PDF.',
    categoria: 'estudo',
    icone: '💾',
    xpBonus: 30
  }
];

export interface ItemHistoricoXP {
  id: string;
  data: string;
  hora: string;
  acao: string;
  xpGanho: number;
}

export interface GamificationState {
  xp: number;
  nivel: number;
  streakDias: number;
  ultimoDiaEstudo: string; // YYYY-MM-DD
  conquistasDesbloqueadas: string[]; // array de IDs
  historico: ItemHistoricoXP[];
  linhasEscritasTotal: number;
  pomodorosConcluidosTotal: number;
  flashcardsDominadosTotal: number;
  artigosMarcadosTotal: number;
  metasCompletadasTotal: number;
  desafiosVadeConcluidos: number;
}

const STORAGE_KEY = 'tributa_gamification_v3';

export function obterHojeFormatado(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export function obterHoraFormatada(): string {
  const d = new Date();
  return d.toTimeString().slice(0, 5);
}

export function carregarEstadoGamificacao(): GamificationState {
  const padrao: GamificationState = {
    xp: 120, // pontuação de boas-vindas
    nivel: 1,
    streakDias: 1,
    ultimoDiaEstudo: obterHojeFormatado(),
    conquistasDesbloqueadas: [],
    historico: [
      {
        id: 'init_welcome',
        data: obterHojeFormatado(),
        hora: obterHoraFormatada(),
        acao: 'Início da Jornada 2ª Fase OAB Tributário',
        xpGanho: 120
      }
    ],
    linhasEscritasTotal: 0,
    pomodorosConcluidosTotal: 0,
    flashcardsDominadosTotal: 0,
    artigosMarcadosTotal: 0,
    metasCompletadasTotal: 0,
    desafiosVadeConcluidos: 0
  };

  const salvo = SafeStorage.get(STORAGE_KEY, '');
  if (!salvo) {
    salvarEstadoGamificacao(padrao);
    return padrao;
  }

  try {
    const parsed = JSON.parse(salvo);
    // Preserva integridade de campos
    return {
      ...padrao,
      ...parsed,
      conquistasDesbloqueadas: Array.isArray(parsed.conquistasDesbloqueadas) ? parsed.conquistasDesbloqueadas : [],
      historico: Array.isArray(parsed.historico) ? parsed.historico : padrao.historico
    };
  } catch {
    return padrao;
  }
}

export function salvarEstadoGamificacao(state: GamificationState): void {
  SafeStorage.set(STORAGE_KEY, JSON.stringify(state));
}

export function calcularInfoNivel(xp: number): {
  patenteAtual: PatenteNivel;
  proximaPatente: PatenteNivel | null;
  xpNoNivelAtual: number;
  xpNecessarioNivel: number;
  progressoPercentual: number;
} {
  let patenteAtual = PATENTES_TRIBUTARIAS[0];

  for (let i = PATENTES_TRIBUTARIAS.length - 1; i >= 0; i--) {
    if (xp >= PATENTES_TRIBUTARIAS[i].xpMinimo) {
      patenteAtual = PATENTES_TRIBUTARIAS[i];
      break;
    }
  }

  const proximaPatente = PATENTES_TRIBUTARIAS.find(p => p.nivel === patenteAtual.nivel + 1) || null;

  if (!proximaPatente) {
    return {
      patenteAtual,
      proximaPatente: null,
      xpNoNivelAtual: xp - patenteAtual.xpMinimo,
      xpNecessarioNivel: 1,
      progressoPercentual: 100
    };
  }

  const xpBase = patenteAtual.xpMinimo;
  const xpAlvo = proximaPatente.xpMinimo;
  const xpNoNivelAtual = Math.max(0, xp - xpBase);
  const xpNecessarioNivel = xpAlvo - xpBase;
  const progressoPercentual = Math.min(100, Math.max(0, Math.round((xpNoNivelAtual / xpNecessarioNivel) * 100)));

  return {
    patenteAtual,
    proximaPatente,
    xpNoNivelAtual,
    xpNecessarioNivel,
    progressoPercentual
  };
}

export interface ResultadoAdicionarXP {
  novoEstado: GamificationState;
  subiuNivel: boolean;
  nivelAnterior: number;
  novoNivel: number;
  tituloNovoNivel: string;
  conquistasNovas: Conquista[];
}

export function creditarXP(
  estadoAtual: GamificationState,
  xpGanho: number,
  motivoAcao: string,
  atualizacoesExtras?: Partial<Pick<GamificationState, 'linhasEscritasTotal' | 'pomodorosConcluidosTotal' | 'flashcardsDominadosTotal' | 'artigosMarcadosTotal' | 'metasCompletadasTotal' | 'desafiosVadeConcluidos'>>
): ResultadoAdicionarXP {
  const hoje = obterHojeFormatado();
  let streak = estadoAtual.streakDias;

  // Lógica de cálculo do Streak diário
  if (estadoAtual.ultimoDiaEstudo) {
    const dataUltima = new Date(estadoAtual.ultimoDiaEstudo);
    const dataHoje = new Date(hoje);
    const diffDias = Math.floor((dataHoje.getTime() - dataUltima.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDias === 1) {
      streak += 1; // dia seguinte consecutivo!
    } else if (diffDias > 1) {
      streak = 1; // quebrou a sequência
    }
  }

  const novoTotalXP = Math.max(0, estadoAtual.xp + xpGanho);
  const infoNivelAnterior = calcularInfoNivel(estadoAtual.xp);
  const infoNivelNovo = calcularInfoNivel(novoTotalXP);

  const subiuNivel = infoNivelNovo.patenteAtual.nivel > infoNivelAnterior.patenteAtual.nivel;

  const novoHistoricoItem: ItemHistoricoXP = {
    id: `xp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    data: hoje,
    hora: obterHoraFormatada(),
    acao: motivoAcao,
    xpGanho
  };

  const conquistasDesbloqueadas = [...estadoAtual.conquistasDesbloqueadas];
  const conquistasNovas: Conquista[] = [];

  const tempState: GamificationState = {
    ...estadoAtual,
    xp: novoTotalXP,
    nivel: infoNivelNovo.patenteAtual.nivel,
    streakDias: streak,
    ultimoDiaEstudo: hoje,
    conquistasDesbloqueadas,
    historico: [novoHistoricoItem, ...estadoAtual.historico].slice(0, 30),
    linhasEscritasTotal: atualizacoesExtras?.linhasEscritasTotal ?? estadoAtual.linhasEscritasTotal,
    pomodorosConcluidosTotal: atualizacoesExtras?.pomodorosConcluidosTotal ?? estadoAtual.pomodorosConcluidosTotal,
    flashcardsDominadosTotal: atualizacoesExtras?.flashcardsDominadosTotal ?? estadoAtual.flashcardsDominadosTotal,
    artigosMarcadosTotal: atualizacoesExtras?.artigosMarcadosTotal ?? estadoAtual.artigosMarcadosTotal,
    metasCompletadasTotal: atualizacoesExtras?.metasCompletadasTotal ?? estadoAtual.metasCompletadasTotal,
    desafiosVadeConcluidos: atualizacoesExtras?.desafiosVadeConcluidos ?? estadoAtual.desafiosVadeConcluidos
  };

  // Checagem de Conquistas
  const testarConquista = (id: string, condicao: boolean) => {
    if (condicao && !tempState.conquistasDesbloqueadas.includes(id)) {
      const c = LISTA_CONQUISTAS.find(item => item.id === id);
      if (c) {
        tempState.conquistasDesbloqueadas.push(id);
        conquistasNovas.push(c);
        tempState.xp += c.xpBonus;
      }
    }
  };

  testarConquista('primeira_linha', tempState.linhasEscritasTotal >= 1);
  testarConquista('cinquenta_linhas', tempState.linhasEscritasTotal >= 50);
  testarConquista('cem_linhas', tempState.linhasEscritasTotal >= 100);
  testarConquista('folha_completa', tempState.linhasEscritasTotal >= 150);
  testarConquista('bloco_foco', tempState.pomodorosConcluidosTotal >= 1);
  testarConquista('foco_inabalavel', tempState.pomodorosConcluidosTotal >= 4);
  testarConquista('maratona_pomodoro', tempState.pomodorosConcluidosTotal >= 10);
  testarConquista('flash_iniciante', tempState.flashcardsDominadosTotal >= 10);
  testarConquista('flash_mestre', tempState.flashcardsDominadosTotal >= 25);
  testarConquista('vade_explorador', tempState.artigosMarcadosTotal >= 5);
  testarConquista('vade_expert', tempState.artigosMarcadosTotal >= 20);
  testarConquista('vade_desafio', tempState.desafiosVadeConcluidos >= 1);
  testarConquista('constancia_bronze', tempState.streakDias >= 3);
  testarConquista('constancia_prata', tempState.streakDias >= 7);

  salvarEstadoGamificacao(tempState);

  return {
    novoEstado: tempState,
    subiuNivel,
    nivelAnterior: infoNivelAnterior.patenteAtual.nivel,
    novoNivel: infoNivelNovo.patenteAtual.nivel,
    tituloNovoNivel: infoNivelNovo.patenteAtual.titulo,
    conquistasNovas
  };
}
