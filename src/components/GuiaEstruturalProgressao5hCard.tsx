import React, { useState, useEffect } from 'react';
import {
  Clock,
  Compass,
  CheckCircle2,
  Circle,
  Sparkles,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Scale,
  Award,
  Lightbulb,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  PlusCircle,
  Check,
  Zap,
  Target
} from 'lucide-react';
import { SafeStorage } from '../utils/storage';
import { tocarAlarmeWebAudio } from '../utils/audio';
import { dispararConfetesSuaves } from '../utils/confetti';

interface GuiaEstruturalProps {
  pecaNome: string;
  linhasCount: number;
  prova5hSecs: number;
  prova5hRunning: boolean;
  onToggleTimer5h: () => void;
  onInserirTexto: (texto: string) => void;
  onNavigateToTab?: (tab: string) => void;
}

interface MarcoProgresso5h {
  id: string;
  fase: string;
  intervaloHoras: string;
  tempoIdealMin: string;
  titulo: string;
  descricao: string;
  pontosChave: string[];
  snippetSugerido?: { rotulo: string; texto: string };
}

// Retorna as orientações estruturais personalizadas conforme a peça identificada/selecionada
function getDicasEstruturaisPorPeca(peca: string): {
  categoria: string;
  prazo: string;
  fundamentoLegal: string;
  marcos: MarcoProgresso5h[];
} {
  const pLower = peca.toLowerCase();

  if (pLower.includes('mandado de segurança') || pLower.includes('ms')) {
    return {
      categoria: 'Ação Constitucional',
      prazo: '120 dias a contar da ciência do ato coator (art. 23 Lei 12.016/09)',
      fundamentoLegal: 'Art. 5º, LXIX da CF/88 e Lei nº 12.016/2009',
      marcos: [
        {
          id: 'ms-fase-1',
          fase: 'Fase 1',
          intervaloHoras: '0h00 – 0h30',
          tempoIdealMin: '30 min',
          titulo: 'Identificação & Análise da Ilegalidade',
          descricao: 'Verifique se há prova pré-constituída sem necessidade de perícia e ausência de decurso do prazo de 120 dias.',
          pontosChave: [
            'Ato de autoridade manifestamente ilegal ou com abuso de poder',
            'Direito líquido e certo demonstrável de plano por documentos',
            'Inexistência de dilação probatória (perícia contábil inviabiliza o MS)',
            'Identificação precisa da Autoridade Coatora (ex: Delegado da Receita Federal/Secretário da Fazenda)'
          ],
          snippetSugerido: {
            rotulo: 'Inserir Preâmbulo do MS',
            texto: '\n\nvem, tempestivamente, com fulcro no artigo 5º, inciso LXIX, da Constituição Federal e na Lei nº 12.016/2009, impetrar o presente\n\nMANDADO DE SEGURANÇA COM PEDIDO DE MEDIDA LIMINAR\n\nem face do ato ilegal praticado pelo ILUSTRÍSSIMO SENHOR DELEGADO DA RECEITA FEDERAL DO BRASIL, autoridade coatora vinculada à UNIÃO...'
          }
        },
        {
          id: 'ms-fase-2',
          fase: 'Fase 2',
          intervaloHoras: '0h30 – 1h15',
          tempoIdealMin: '45 min',
          titulo: 'Endereçamento, Tempestividade & Cabimento',
          descricao: 'Enderece à Vara competente da Fazenda Pública e comprove a tempestividade dentro dos 120 dias.',
          pontosChave: [
            'Endereçamento ao Juiz Federal ou Estadual competente',
            'Demonstração explícita da contagem dos 120 dias (art. 23 LMS)',
            'Indicação da Pessoa Jurídica de Direito Público (art. 6º LMS)',
            'Afirmação do não cabimento de condenação em honorários (Súmula 105 STJ e 512 STF)'
          ]
        },
        {
          id: 'ms-fase-3',
          fase: 'Fase 3',
          intervaloHoras: '1h15 – 2h45',
          tempoIdealMin: '90 min',
          titulo: 'Mérito & Pedido Liminar Imbatível',
          descricao: 'Desenvolva a tese tributária com indicação de súmulas, fumus boni iuris e periculum in mora.',
          pontosChave: [
            'Fumus boni iuris: tese constitucional/legal (art. 150 CF ou CTN)',
            'Periculum in mora: risco iminente de autuação, inscrição em dívida ativa ou CADIN',
            'Requerimento de suspensão da exigibilidade do crédito (art. 151, IV CTN c/c art. 7º, III Lei 12.016/09)',
            'Pedidos finais: notificação da autoridade, oitiva do MP e concessão definitiva'
          ],
          snippetSugerido: {
            rotulo: 'Inserir Requerimento Liminar',
            texto: '\n\nDOS PEDIDOS:\nDiante do exposto, requer a Vossa Excelência:\na) A concessão da MEDIDA LIMINAR, inaudita altera parte, para suspender a exigibilidade do crédito tributário (art. 151, IV, do CTN c/c art. 7º, III, da Lei 12.016/2009);\nb) A notificação da autoridade coatora para prestar informações no prazo de 10 dias;\nc) A intimação do representante do Ministério Público...'
          }
        },
        {
          id: 'ms-fase-4',
          fase: 'Fase 4',
          intervaloHoras: '2h45 – 4h15',
          tempoIdealMin: '90 min',
          titulo: 'Resolução das 4 Questões Discursivas',
          descricao: 'Responda direta e objetivamente: afirmação/negação, fundamentação legal exata e subsunção ao caso.',
          pontosChave: [
            'Questão 1: Direta com artigo específico (ex: Art. 150, VI, CF)',
            'Questão 2: Distinção entre decadência (art. 173) e prescrição (art. 174)',
            'Questão 3: Precedentes vinculantes STF/STJ ou súmulas expressas',
            'Questão 4: Síntese pontual sem rodeios nem repetição do enunciado'
          ]
        },
        {
          id: 'ms-fase-5',
          fase: 'Fase 5',
          intervaloHoras: '4h15 – 5h00',
          tempoIdealMin: '45 min',
          titulo: 'Revisão Minuciosa & Checklist FGV',
          descricao: 'Conferência de linha a linha, artigos citados e garantia de ausência de rasuras e sinais identificadores.',
          pontosChave: [
            'Garantir fechamento anônimo: "Local..., Data..., Advogado..., OAB..."',
            'Conferência de preenchimento das 150 linhas distribuídas nas 5 páginas',
            'Verificação de citação de artigos nas alíneas de pedidos e nas 4 questões'
          ]
        }
      ]
    };
  }

  if (pLower.includes('anulatória') || pLower.includes('anulatoria')) {
    return {
      categoria: 'Ação de Conhecimento Pleno',
      prazo: '5 anos do lançamento fiscal (art. 169 CTN ou art. 1º Decreto 20.910/32)',
      fundamentoLegal: 'Art. 38 da Lei 6.830/1980 e Art. 319 do CPC/2015',
      marcos: [
        {
          id: 'anu-fase-1',
          fase: 'Fase 1',
          intervaloHoras: '0h00 – 0h30',
          tempoIdealMin: '30 min',
          titulo: 'Identificação & Existência do Lançamento',
          descricao: 'O débito já foi lançado formalmente pelo fisco e não foi ajuizada execução fiscal ou há necessidade de dilação probatória.',
          pontosChave: [
            'Lançamento tributário formalmente constituído (auto de infração/notificação)',
            'Ação pelo rito comum com ampla produção de provas periciais ou testemunhais',
            'Hipótese de depósito integral e em dinheiro para suspensão (art. 151, II CTN) OU tutela provisória (art. 300 CPC)'
          ],
          snippetSugerido: {
            rotulo: 'Inserir Preâmbulo de Anulatória',
            texto: '\n\nvem respeitosamente perante Vossa Excelência, com fundamento no artigo 38 da Lei nº 6.830/1980 e artigos 318 e 319 do Código de Processo Civil, propor a presente\n\nAÇÃO ANULATÓRIA DE DÉBITO FISCAL C/C PEDIDO DE TUTELA PROVISÓRIA DE URGÊNCIA\n\nem face do ESTADO/MUNICÍPIO/UNIÃO...'
          }
        },
        {
          id: 'anu-fase-2',
          fase: 'Fase 2',
          intervaloHoras: '0h30 – 1h15',
          tempoIdealMin: '45 min',
          titulo: 'Estruturação & Tutela Provisória de Urgência',
          descricao: 'Formule os requisitos do art. 300 do CPC ou comprove o depósito integral (art. 151, II CTN).',
          pontosChave: [
            'Demonstração da probabilidade do direito e perigo de dano ou risco ao resultado útil',
            'Requerimento de certidão positiva com efeitos de negativa (CPEN - art. 206 CTN)',
            'Requerimento de não inclusão ou exclusão do CADIN'
          ]
        },
        {
          id: 'anu-fase-3',
          fase: 'Fase 3',
          intervaloHoras: '1h15 – 2h45',
          tempoIdealMin: '90 min',
          titulo: 'Desenvolvimento do Mérito & Pedidos',
          descricao: 'Ataque o vício material ou formal do auto de infração e deduza todos os pedidos de procedência e sucumbência.',
          pontosChave: [
            'Inconstitucionalidade ou ilegalidade do tributo',
            'Pedido de anulação total do lançamento e cancelamento da CDA',
            'Condenação da Fazenda em custas e honorários advocatícios (art. 85 CPC)'
          ]
        },
        {
          id: 'anu-fase-4',
          fase: 'Fase 4',
          intervaloHoras: '2h45 – 4h15',
          tempoIdealMin: '90 min',
          titulo: 'As 4 Questões Discursivas',
          descricao: 'Dedique tempo concentrado às questões com respostas assertivas e indicação legal completa.',
          pontosChave: [
            'Fundamentação objetiva sem transcrever longos trechos da lei',
            'Atenção aos temas de competência, decadência e isenções tributárias'
          ]
        },
        {
          id: 'anu-fase-5',
          fase: 'Fase 5',
          intervaloHoras: '4h15 – 5h00',
          tempoIdealMin: '45 min',
          titulo: 'Revisão & Conferência do Espelho FGV',
          descricao: 'Verifique se indicou valor da causa (art. 319, V CPC) e o rol completo de provas.',
          pontosChave: [
            'Valor da causa correspondente ao valor integral do crédito tributário impugnado',
            'Protesto por todas as provas em direito admitidas'
          ]
        }
      ]
    };
  }

  if (pLower.includes('embargos') || pLower.includes('execução')) {
    return {
      categoria: 'Ação Incidental de Defesa',
      prazo: '30 dias a contar da garantia da execução (art. 16 Lei 6.830/80)',
      fundamentoLegal: 'Art. 16 da Lei nº 6.830/80 c/c Art. 914 e seguintes do CPC/2015',
      marcos: [
        {
          id: 'emb-fase-1',
          fase: 'Fase 1',
          intervaloHoras: '0h00 – 0h30',
          tempoIdealMin: '30 min',
          titulo: 'Garantia do Juízo & Prazo de 30 Dias',
          descricao: 'Exija a comprovação da segurança do juízo (penhora, depósito ou fiança bancária) e distribuição por dependência.',
          pontosChave: [
            'Distribuição por dependência aos autos da Execução Fiscal nº ...',
            'Demonstração expressa da garantia do juízo (art. 16, § 1º da LEF)',
            'Contagem do prazo de 30 dias (da intimação da penhora, depósito ou fiança)'
          ],
          snippetSugerido: {
            rotulo: 'Inserir Endereçamento por Dependência',
            texto: '\n\nEXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA ... VARA CÍVEL / DE FAZENDA PÚBLICA DA COMARCA DE ...\n\nDistribuição por dependência à Execução Fiscal nº ...\n\n..., já devidamente qualificado nos autos da Execução Fiscal que lhe move a FAZENDA PÚBLICA, vem opor\n\nEMBARGOS À EXECUÇÃO FISCAL COM PEDIDO DE EFEITO SUSPENSIVO\n\ncom fulcro no artigo 16 da Lei nº 6.830/1980...'
          }
        },
        {
          id: 'emb-fase-2',
          fase: 'Fase 2',
          intervaloHoras: '0h30 – 1h15',
          tempoIdealMin: '45 min',
          titulo: 'Efeito Suspensivo (Art. 919, § 1º CPC)',
          descricao: 'Requeira o efeito suspensivo demonstrando a garantia da execução e o periculum in mora de expropriação.',
          pontosChave: [
            'Garantia integral da dívida',
            'Probabilidade de procedência dos embargos',
            'Risco grave de dano ou difícil reparação com a continuidade dos atos executórios'
          ]
        },
        {
          id: 'emb-fase-3',
          fase: 'Fase 3',
          intervaloHoras: '1h15 – 2h45',
          tempoIdealMin: '90 min',
          titulo: 'Nulidade da CDA, Matéria de Defesa & Pedidos',
          descricao: 'Alegue vícios da CDA (art. 2º LEF), causas extintivas (art. 156 CTN) ou inexigibilidade do tributo.',
          pontosChave: [
            'Ausência de requisitos formais do art. 202 do CTN e art. 2º da LEF',
            'Prescrição do crédito ou decadência',
            'Pedido de extinção da execução fiscal e desoneração dos bens penhorados'
          ]
        },
        {
          id: 'emb-fase-4',
          fase: 'Fase 4',
          intervaloHoras: '2h45 – 4h15',
          tempoIdealMin: '90 min',
          titulo: 'As 4 Questões da Prova',
          descricao: 'Resolva as 4 questões discursivas mantendo o raciocínio afirmativo ou negativo com citação do diploma correto.',
          pontosChave: [
            'Responda item por item sem deixar alínea sem resposta',
            'Cite artigos da CF, CTN ou Súmulas correlatas'
          ]
        },
        {
          id: 'emb-fase-5',
          fase: 'Fase 5',
          intervaloHoras: '4h15 – 5h00',
          tempoIdealMin: '45 min',
          titulo: 'Fechamento & Honorários Sucumbenciais',
          descricao: 'Requeira a condenação do ente público em honorários advocatícios e levantamento da penhora.',
          pontosChave: [
            'Condenação da Fazenda em honorários nos termos do art. 85, § 3º do CPC',
            'Revisão formal sem assinatura identificadora'
          ]
        }
      ]
    };
  }

  if (pLower.includes('repetição') || pLower.includes('repeticao')) {
    return {
      categoria: 'Ação de Cobrança / Restituição',
      prazo: '5 anos da data da extinção do crédito pelo pagamento (art. 168, I do CTN)',
      fundamentoLegal: 'Art. 165, I c/c Art. 168, I do CTN e Art. 319 do CPC/2015',
      marcos: [
        {
          id: 'rep-fase-1',
          fase: 'Fase 1',
          intervaloHoras: '0h00 – 0h30',
          tempoIdealMin: '30 min',
          titulo: 'Identificação do Pagamento Indevido',
          descricao: 'O contribuinte pagou voluntária ou compulsoriamente tributo indevido ou a maior.',
          pontosChave: [
            'Comprovação de pagamento indevido ou a maior (art. 165, I CTN)',
            'Prazo quinquenal contado da extinção pelo pagamento (Súmula Vinculante 8 e art. 168 CTN)',
            'Se tributo indireto (ex: ICMS/IPI), demonstrar ausência de repasse ou autorização (art. 166 CTN)'
          ],
          snippetSugerido: {
            rotulo: 'Inserir Preâmbulo de Repetição',
            texto: '\n\nvem à presença de Vossa Excelência propor a presente\n\nAÇÃO DE REPETIÇÃO DE INDÉBITO TRIBUTÁRIO\n\ncom fundamento no artigo 165, inciso I, do Código Tributário Nacional e artigo 319 do Código de Processo Civil, em face do...'
          }
        },
        {
          id: 'rep-fase-2',
          fase: 'Fase 2',
          intervaloHoras: '0h30 – 1h15',
          tempoIdealMin: '45 min',
          titulo: 'Qualificação & Tempestividade Quinquenal',
          descricao: 'Qualificação do autor e da Fazenda Pública competente com demonstração da contagem do prazo prescricional de 5 anos.',
          pontosChave: [
            'Endereçamento à Vara da Fazenda Pública competente',
            'Demostração de que a ação foi proposta dentro dos 5 anos do pagamento indevido'
          ]
        },
        {
          id: 'rep-fase-3',
          fase: 'Fase 3',
          intervaloHoras: '1h15 – 2h45',
          tempoIdealMin: '90 min',
          titulo: 'Mérito & Consectários: Juros e SELIC',
          descricao: 'Demonstre a inconstitucionalidade/ilegalidade e requeira juros moratórios e taxa SELIC a partir do trânsito em julgado.',
          pontosChave: [
            'Tese jurídica que tornou o tributo indevido',
            'Atualização monetária e juros moratórios pela Taxa SELIC (art. 39, § 4º Lei 9.250/95)',
            'Incidência de juros a partir do trânsito em julgado (Súmula 188 do STJ e art. 167, p. único CTN)'
          ]
        },
        {
          id: 'rep-fase-4',
          fase: 'Fase 4',
          intervaloHoras: '2h45 – 4h15',
          tempoIdealMin: '90 min',
          titulo: 'As 4 Questões Discursivas',
          descricao: 'Resolva as 4 questões discursivas.',
          pontosChave: [
            'Resolução objetiva apontando sempre o fundamento normativo',
            'Atenção às regras de imunidade recíproca e responsabilidade tributária'
          ]
        },
        {
          id: 'rep-fase-5',
          fase: 'Fase 5',
          intervaloHoras: '4h15 – 5h00',
          tempoIdealMin: '45 min',
          titulo: 'Pedidos Expressos & Fechamento',
          descricao: 'Requeira a procedência para restituição da quantia exata atualizada e expedição de precatório/RPV.',
          pontosChave: [
            'Condenação ao pagamento do montante principal acrescido de SELIC',
            'Expedição de precatório ou RPV (art. 100 da CF/88)',
            'Condenação em honorários advocatícios sucumbenciais'
          ]
        }
      ]
    };
  }

  // Padrão Geral (Apelação, Agravo, Exceção, etc.)
  return {
    categoria: 'Peça Processual FGV',
    prazo: '15 dias úteis (Recursos) ou Prazo Geral CPC/2015',
    fundamentoLegal: 'Código de Processo Civil e Código Tributário Nacional',
    marcos: [
      {
        id: 'geral-fase-1',
        fase: 'Fase 1',
        intervaloHoras: '0h00 – 0h30',
        tempoIdealMin: '30 min',
        titulo: 'Leitura Minuciosa, Identificação da Peça & Teses',
        descricao: 'Diagnostique com certeza a peça cabível e as 2 a 3 teses de mérito que o espelho oficial exigirá.',
        pontosChave: [
          'Identificar quem é o cliente (contribuinte ou responsável tributário)',
          'Momento processual exato: antes do lançamento, após notificação, com execução fiscal ou após sentença',
          'Anotar no rascunho todos os artigos da CF e CTN aplicáveis'
        ]
      },
      {
        id: 'geral-fase-2',
        fase: 'Fase 2',
        intervaloHoras: '0h30 – 1h15',
        tempoIdealMin: '45 min',
        titulo: 'Esqueleto Completo & Qualificação das Partes',
        descricao: 'Monte a estrutura de tópicos na folha padrão com endereçamento e indicação das leis.',
        pontosChave: [
          'Endereçamento correto sem abreviações indevidas',
          'Qualificação das partes (art. 319, II do CPC)',
          'Tópico dos fatos narrados com síntese clara'
        ]
      },
      {
        id: 'geral-fase-3',
        fase: 'Fase 3',
        intervaloHoras: '1h15 – 2h45',
        tempoIdealMin: '90 min',
        titulo: 'Do Direito: Preliminares, Mérito e Pedidos',
        descricao: 'Desenvolva o silogismo jurídico demonstrando a subsunção do fato narrado à norma violada.',
        pontosChave: [
          'Preliminares de mérito (se houver vício de citação, incompetência, etc.)',
          'Tese principal de inconstitucionalidade ou ilegalidade',
          'Pedidos divididos em alíneas claras (procedência, tutela, custas e honorários)'
        ]
      },
      {
        id: 'geral-fase-4',
        fase: 'Fase 4',
        intervaloHoras: '2h45 – 4h15',
        tempoIdealMin: '90 min',
        titulo: 'As 4 Questões Discursivas da OAB',
        descricao: 'Responda as questões de 1 a 4 com respostas afirmativas/negativas e fundamento normativo exato.',
        pontosChave: [
          'Resposta direta no primeiro parágrafo',
          'Indicação do artigo de lei e súmula correspondente',
          'Conclusão lógica aplicada ao problema narrado'
        ]
      },
      {
        id: 'geral-fase-5',
        fase: 'Fase 5',
        intervaloHoras: '4h15 – 5h00',
        tempoIdealMin: '45 min',
        titulo: 'Revisão Geral & Checklist FGV',
        descricao: 'Verifique se atingiu as linhas pretendidas e se não há sinais identificadores no texto.',
        pontosChave: [
          'Fechamento com "Local..., Data..., Advogado..., OAB..."',
          'Conferência do espelho e distribuição nas páginas pautadas'
        ]
      }
    ]
  };
}

export const GuiaEstruturalProgressao5hCard: React.FC<GuiaEstruturalProps> = ({
  pecaNome,
  linhasCount,
  prova5hSecs,
  prova5hRunning,
  onToggleTimer5h,
  onInserirTexto,
  onNavigateToTab
}) => {
  const dadosPeca = getDicasEstruturaisPorPeca(pecaNome);
  const [faseExpandida, setFaseExpandida] = useState<string>(dadosPeca.marcos[0]?.id || '');

  // Salva no LocalStorage as tarefas cumpridas deste guia
  const [itensConcluidos, setItensConcluidos] = useState<string[]>(() => {
    try {
      const salvo = SafeStorage.get('tributa_guia_5h_itens', '[]');
      return JSON.parse(salvo);
    } catch {
      return [];
    }
  });

  const toggleItemConcluido = (itemId: string) => {
    let novos: string[];
    if (itensConcluidos.includes(itemId)) {
      novos = itensConcluidos.filter(id => id !== itemId);
    } else {
      novos = [...itensConcluidos, itemId];
      tocarAlarmeWebAudio('suave');
      dispararConfetesSuaves({ count: 25, originY: 0.6 });
    }
    setItensConcluidos(novos);
    SafeStorage.set('tributa_guia_5h_itens', JSON.stringify(novos));
  };

  // Tempo decorrido de prova em segundos (de 0 a 5h)
  const tempoDecorridoSecs = Math.max(0, 5 * 3600 - prova5hSecs);
  const tempoDecorridoMin = Math.floor(tempoDecorridoSecs / 60);

  // Determina a fase ativa pelo relógio
  let faseAtivaIndex = 0;
  if (tempoDecorridoMin < 30) faseAtivaIndex = 0; // 0h00 - 0h30
  else if (tempoDecorridoMin < 75) faseAtivaIndex = 1; // 0h30 - 1h15
  else if (tempoDecorridoMin < 165) faseAtivaIndex = 2; // 1h15 - 2h45
  else if (tempoDecorridoMin < 255) faseAtivaIndex = 3; // 2h45 - 4h15
  else faseAtivaIndex = 4; // 4h15 - 5h00

  // Formatação do tempo 5h
  const horas = Math.floor(prova5hSecs / 3600);
  const minutos = Math.floor((prova5hSecs % 3600) / 60);
  const segundos = prova5hSecs % 60;
  const tempoFormatado = `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;

  const pctTempoDecorrido = Math.min(100, Math.round((tempoDecorridoSecs / (5 * 3600)) * 100));

  return (
    <div className="rounded-3xl border border-blue-200/70 dark:border-white/10 bg-gradient-to-br from-white via-blue-50/20 to-sky-50/30 dark:from-zinc-800/95 dark:via-zinc-800/90 dark:to-zinc-800/95 p-5 lg:p-6 shadow-sm space-y-5 transition-all">
      {/* 1. TOPO: CRONOGRAMA DAS 5 HORAS & PEÇA CABÍVEL ATIVA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1 border-b border-black/5 dark:border-white/5">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 shrink-0">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-100/70 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-300/60 dark:border-blue-700/60 inline-flex items-center gap-1">
                <Scale className="h-3 w-3" /> Guia Estrutural de 5 Horas
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                Peça em Redação: <strong className="text-zinc-900 dark:text-white font-bold">{pecaNome}</strong>
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white mt-0.5 tracking-tight">
              Progresso Estrutural Passo a Passo ({dadosPeca.categoria})
            </h3>
          </div>
        </div>

        {/* Temporizador 5h Integrado */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 shadow-xs">
            <Clock className={`h-4 w-4 ${prova5hRunning ? 'text-blue-600 dark:text-blue-400 animate-pulse' : 'text-zinc-400'}`} />
            <div>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block font-medium">Tempo Restante:</span>
              <span className="font-mono text-xs font-extrabold text-zinc-900 dark:text-white">{tempoFormatado}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleTimer5h}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition shadow-xs cursor-pointer inline-flex items-center gap-1.5 active:scale-95 ${
              prova5hRunning
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            {prova5hRunning ? (
              <>
                <Pause className="h-3.5 w-3.5 fill-current" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>{prova5hSecs < 5 * 3600 ? 'Retomar' : 'Iniciar 5h'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. BARRA DE LINHA DO TEMPO DOS 5 BLOCOS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400 font-medium">
          <span className="flex items-center gap-1.5 font-bold text-zinc-900 dark:text-white">
            <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
            <span>Trilha Cronológica de 5 Horas da Banca FGV</span>
          </span>
          <span className="text-[11px] font-mono">
            {tempoDecorridoMin} min decorridos ({pctTempoDecorrido}%)
          </span>
        </div>

        {/* Timeline Visual de 5 Fases */}
        <div className="grid grid-cols-5 gap-1.5">
          {dadosPeca.marcos.map((marco, idx) => {
            const isFaseAtual = idx === faseAtivaIndex;
            const isPassada = idx < faseAtivaIndex;
            return (
              <button
                key={marco.id}
                type="button"
                onClick={() => setFaseExpandida(marco.id)}
                className={`p-2 rounded-xl text-left transition-all cursor-pointer border ${
                  isFaseAtual
                    ? 'border-blue-500 bg-blue-500/10 text-blue-900 dark:text-blue-100 ring-2 ring-blue-400/30'
                    : isPassada
                    ? 'border-emerald-300 dark:border-emerald-800/40 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300'
                    : 'border-black/5 dark:border-white/5 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-black/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold font-mono uppercase">{marco.fase}</span>
                  {isPassada ? (
                    <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                  ) : isFaseAtual ? (
                    <span className="h-2 w-2 rounded-full bg-blue-600 animate-ping" />
                  ) : null}
                </div>
                <div className="text-[11px] font-semibold truncate mt-0.5">{marco.titulo.split(' ')[0]}</div>
                <div className="text-[9.5px] opacity-75 font-mono truncate">{marco.intervaloHoras}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. CONTEÚDO EXPANDIDO DO MARCO SELECIONADO */}
      <div className="space-y-3">
        {dadosPeca.marcos.map((marco, idx) => {
          const isExpandida = faseExpandida === marco.id;
          const isFaseAtual = idx === faseAtivaIndex;

          return (
            <div
              key={marco.id}
              className={`rounded-2xl border transition-all ${
                isFaseAtual
                  ? 'border-blue-400/80 bg-white dark:bg-zinc-800/95 shadow-sm'
                  : 'border-black/5 dark:border-white/5 bg-white/70 dark:bg-zinc-800/70 hover:border-black/15'
              }`}
            >
              {/* Cabeçalho do Accordion */}
              <button
                type="button"
                onClick={() => setFaseExpandida(isExpandida ? '' : marco.id)}
                className="w-full p-4 flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-xl text-xs font-bold shrink-0 ${
                      isFaseAtual
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300'
                    }`}
                  >
                    {idx + 1}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-zinc-900 dark:text-white">
                        {marco.fase}: {marco.titulo}
                      </span>
                      <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-zinc-600 dark:text-zinc-300">
                        {marco.intervaloHoras} ({marco.tempoIdealMin})
                      </span>
                      {isFaseAtual && (
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full border border-blue-300/60">
                          🎯 Momento Ideal
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                      {marco.descricao}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-2">
                  {isExpandida ? (
                    <ChevronDown className="h-4 w-4 text-zinc-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-zinc-400" />
                  )}
                </div>
              </button>

              {/* Corpo com Pontos-Chave & Snippets */}
              {isExpandida && (
                <div className="p-4 pt-1 border-t border-black/5 dark:border-white/5 space-y-3.5">
                  <div className="space-y-2">
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
                      Checklist do Espelho de Correção FGV para esta etapa:
                    </span>
                    <div className="space-y-1.5">
                      {marco.pontosChave.map((ponto, pIdx) => {
                        const itemId = `${marco.id}-ponto-${pIdx}`;
                        const cumprido = itensConcluidos.includes(itemId);
                        return (
                          <div
                            key={pIdx}
                            onClick={() => toggleItemConcluido(itemId)}
                            className={`flex items-start gap-2.5 p-2 rounded-xl text-xs transition cursor-pointer select-none ${
                              cumprido
                                ? 'bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 line-through opacity-75'
                                : 'bg-zinc-50 dark:bg-zinc-900/60 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={cumprido}
                              onChange={() => toggleItemConcluido(itemId)}
                              className="mt-0.5 h-3.5 w-3.5 rounded accent-emerald-600 shrink-0 cursor-pointer"
                            />
                            <span className="leading-snug">{ponto}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Snippet Recomendado para Inserção Direta na Folha de 150L */}
                  {marco.snippetSugerido && (
                    <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                      <div>
                        <span className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                          <span>Modelo Rápido FGV</span>
                        </span>
                        <p className="text-[11px] text-zinc-600 dark:text-zinc-300 mt-0.5">
                          Insira a estrutura formal padronizada diretamente no cursor da sua folha.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onInserirTexto(marco.snippetSugerido!.texto);
                          tocarAlarmeWebAudio('suave');
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-xs inline-flex items-center gap-1.5 cursor-pointer shrink-0 active:scale-95"
                      >
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span>{marco.snippetSugerido.rotulo}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. RODAPÉ DE RECOMENDAÇÃO PRÁTICA */}
      <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-zinc-600 dark:text-zinc-400">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-amber-500 shrink-0" />
          <span>
            <strong>Dica de Ouro da 2ª Fase:</strong> Nunca gaste mais de 2h45 na peça principal para ter pelo menos 1h30 líquida para as 4 questões discursivas (valor: 5,00 pontos).
          </span>
        </div>
        <span className="font-mono text-[11px] font-bold text-blue-600 dark:text-blue-400 shrink-0">
          Linhas Atuais: {linhasCount}/150
        </span>
      </div>
    </div>
  );
};
