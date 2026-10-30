/**
 * Motor de Inteligência Heurística e Análise em Tempo Real de Peça Cabível (FGV OAB 2ª Fase Tributário).
 * 
 * Analisa tanto o enunciado do caso oficial (fatos narrados) quanto o texto redigido pelo candidato
 * no Simulador 150L, cruzando com o histórico dos 32+ exames unificados da FGV, catálogo de peças
 * e teses de direito material/processual tributário.
 */

import { CATALOGO_PECAS, TESES_DATA, PecaCatalogo } from '../data/tributarioData';

export interface GatilhoFatico {
  termo: string;
  peso: number;
  explicacao: string;
}

export interface SugestaoPeca {
  codigo: string;
  nome: string;
  tipo: 'Inicial' | 'Recursal';
  probabilidade: number; // 0 a 100
  nivelConfianca: 'MUITO ALTA' | 'ALTA' | 'MODERADA' | 'BAIXA';
  baseLegal: string;
  examesCobrados: string;
  gatilhosDetectados: string[];
  justificativaCabimento: string;
  dicasRedacao: string[];
  esqueletoRecomendado: string;
  artigosFundamentais: string[];
  teseRelacionada?: string;
}

export interface ResultadoAnalisePeca {
  pecaMaisProvavel: SugestaoPeca;
  segundaOpcao?: SugestaoPeca;
  terceiraOpcao?: SugestaoPeca;
  todasSugestoes: SugestaoPeca[];
  gatilhosGeraisEncontrados: string[];
  posturaProcessualDetectada: string;
  momentoProcessual: 'Antes do Lançamento' | 'Após Notificação/Auto de Infração' | 'Durante Execução Fiscal' | 'Fase Recursal (Sentença/Decisão)' | 'Pós-Pagamento Indevido';
}

interface RegraHeuristica {
  codigo: string;
  nome: string;
  tipo: 'Inicial' | 'Recursal';
  baseLegal: string;
  examesCobrados: string;
  gatilhos: GatilhoFatico[];
  antigatilhos?: string[]; // Termos que desqualificam esta peça
  justificativaPadrao: string;
  dicas: string[];
  artigos: string[];
}

const REGRAS_PECAS_FGV: RegraHeuristica[] = [
  {
    codigo: 'MS',
    nome: 'Mandado de Segurança',
    tipo: 'Inicial',
    baseLegal: 'Art. 5º, LXIX da CF/88 c/c Lei nº 12.016/2009',
    examesCobrados: 'Exames IV, VII, IX, X, XI, XIV, XIX, XXIX, 40º e 45º (10x)',
    gatilhos: [
      { termo: 'notificação', peso: 18, explicacao: 'Houve notificação de lançamento ou ciência de ato coator' },
      { termo: 'ato coator', peso: 28, explicacao: 'Presença explícita de ato ilegal ou abusivo praticado por autoridade' },
      { termo: 'autoridade coatora', peso: 26, explicacao: 'Identificação expressa do Delegado/Secretário como coator' },
      { termo: 'prova documental', peso: 22, explicacao: 'Fatos inteiramente comprovados por prova pré-constituída' },
      { termo: 'pré-constituída', peso: 26, explicacao: 'Dispensa dilação probatória pericial' },
      { termo: 'sem dilação probatória', peso: 26, explicacao: 'Não há necessidade de prova pericial contábil' },
      { termo: 'direito líquido e certo', peso: 28, explicacao: 'Requisito constitucional basilar do writ' },
      { termo: '120 dias', peso: 22, explicacao: 'Prazo decadencial do Art. 23 da Lei 12.016/09 atendido' },
      { termo: 'impetrante', peso: 16, explicacao: 'Terminologia típica da petição inicial mandamental' },
      { termo: 'impetrado', peso: 16, explicacao: 'Qualificação da autoridade pública' },
      { termo: 'medida liminar', peso: 14, explicacao: 'Pedido urgente com base no Art. 7º, III da Lei 12.016/09' },
      { termo: 'sem honorários', peso: 14, explicacao: 'Súmula 105 STJ e Art. 25 Lei 12.016/09' }
    ],
    antigatilhos: ['perícia contábil indispensável', 'sentença proferida', 'execução fiscal garantida', 'pagou e quer restituir'],
    justificativaPadrao: 'A narrativa aponta violação a direito líquido e certo demonstrável de plano por prova pré-constituída, contra ato de autoridade pública notificado há menos de 120 dias e sem necessidade de dilação probatória pericial.',
    dicas: [
      'Não inclua pedido de honorários advocatícios (Art. 25 Lei 12.016/09 e Súmula 105 STJ / 512 STF).',
      'Enderece à Vara de Fazenda Pública (Estadual/Municipal) ou Vara Federal (Federal).',
      'Requeira notificação da autoridade coatora (10 dias) e cientificação do órgão de representação judicial da PJ.',
      'Fundamente o pedido liminar no Art. 7º, III da Lei 12.016/09 c/c Art. 151, IV do CTN e certidão do Art. 206 CTN.'
    ],
    artigos: ['Art. 5º, LXIX CF', 'Lei 12.016/09', 'Art. 151, IV CTN', 'Art. 206 CTN']
  },
  {
    codigo: 'APELACAO',
    nome: 'Recurso de Apelação',
    tipo: 'Recursal',
    baseLegal: 'Art. 1.009 e 1.010 do CPC/2015',
    examesCobrados: 'Exames I, III, V, VIII, XII, XVI, XXI, XXIII, XXVII e 38º (10x)',
    gatilhos: [
      { termo: 'sentença', peso: 35, explicacao: 'O magistrado de primeira instância proferiu sentença terminativa ou definitiva' },
      { termo: 'julgou improcedente', peso: 30, explicacao: 'A pretensão do contribuinte foi rejeitada na sentença' },
      { termo: 'julgou extinto', peso: 28, explicacao: 'Extinção do feito com ou sem resolução de mérito pelo juiz singular' },
      { termo: 'juiz proferiu', peso: 22, explicacao: 'Ato decisório exarado pelo juízo de 1º grau' },
      { termo: 'recurso cabível', peso: 15, explicacao: 'Provocação para reforma perante Tribunal' },
      { termo: 'inconformado com a decisão final', peso: 24, explicacao: 'Postura de ataque recursal à sentença' },
      { termo: 'custas recursais', peso: 14, explicacao: 'Preparo da apelação' },
      { termo: '15 dias', peso: 12, explicacao: 'Prazo legal de interposição recursal (Art. 1.003, §5º CPC)' },
      { termo: 'tribunal de justiça', peso: 14, explicacao: 'Instância ad quem recursal' },
      { termo: 'tribunal regional federal', peso: 14, explicacao: 'Instância ad quem recursal' }
    ],
    antigatilhos: ['decisão interlocutória', 'auto de infração recém lavrado', 'executado sem sentença'],
    justificativaPadrao: 'O enunciado relata expressamente a prolação de sentença pelo magistrado de primeiro grau que extinguiu ou rejeitou a ação do contribuinte, sendo a apelação o recurso cabível no prazo de 15 dias (Arts. 1.009 e 1.010 do CPC).',
    dicas: [
      'Estruture a peça em 2 partes: Folha de Rosto/Interposição (ao Juiz da causa) + Razões Recursais (ao Tribunal TJ/TRF).',
      'Demonstre tempestividade (15 dias úteis) e comprovante de recolhimento de preparo (porte de remessa/retorno).',
      'Formule preliminares de nulidade da sentença se houver cerceamento de defesa antes de ingressar no mérito tributário.'
    ],
    artigos: ['Art. 1.009 CPC', 'Art. 1.010 CPC', 'Art. 1.003, §5º CPC', 'Art. 85, §11 CPC']
  },
  {
    codigo: 'ANULATORIA',
    nome: 'Ação Anulatória de Débito Fiscal',
    tipo: 'Inicial',
    baseLegal: 'Art. 38 da Lei nº 6.830/1980 (LEF) c/c Arts. 300 e 319 do CPC',
    examesCobrados: 'Exames IV, IX, XXX, XXXI, XXXIV, 39º e 42º (7x)',
    gatilhos: [
      { termo: 'auto de infração', peso: 30, explicacao: 'Lançamento formalizado pela autoridade fiscal já lavrado' },
      { termo: 'lavrou auto', peso: 32, explicacao: 'Constituição formal do crédito tributário' },
      { termo: 'perícia', peso: 28, explicacao: 'Necessidade de perícia contábil ou dilação probatória ampla' },
      { termo: 'dilação probatória', peso: 26, explicacao: 'Impossibilidade de Mandado de Segurança por exigir provas' },
      { termo: 'anular o débito', peso: 24, explicacao: 'Objetivo de desconstituir o lançamento fiscal' },
      { termo: 'desconstituir', peso: 22, explicacao: 'Finalidade desconstitutiva própria da anulatória' },
      { termo: 'tutela de urgência', peso: 18, explicacao: 'Requerimento liminar nos termos do Art. 300 do CPC' },
      { termo: 'sem garantia do juízo', peso: 20, explicacao: 'Diferencial para Embargos à Execução' },
      { termo: 'depósito facultativo', peso: 16, explicacao: 'Súmula Vinculante 28 STF' }
    ],
    antigatilhos: ['já foi penhorado', 'garantiu a execução', 'sentença proferida', 'antes do lançamento'],
    justificativaPadrao: 'Houve lavratura de Auto de Infração/lançamento formal contra o cliente e a tese defensiva demanda dilação probatória pericial detalhada, afastando o MS e tornando cabível a Ação Anulatória com tutela de urgência (Art. 38 da LEF c/c Art. 300 do CPC).',
    dicas: [
      'Invoque a Súmula Vinculante 28 do STF para demonstrar a desnecessidade de depósito prévio para propor anulatória.',
      'Requeira a produção de prova pericial contábil e a tutela de urgência (Art. 300 CPC c/c Art. 151, V do CTN).',
      'Declare desinteresse na realização de audiência de conciliação ou mediação (Art. 319, VII do CPC).'
    ],
    artigos: ['Art. 38 Lei 6.830/80', 'Art. 300 CPC', 'Art. 319 CPC', 'Art. 151, V CTN', 'SV 28 STF']
  },
  {
    codigo: 'REPETICAO',
    nome: 'Ação de Repetição de Indébito',
    tipo: 'Inicial',
    baseLegal: 'Art. 165 e 168 do CTN c/c Art. 319 do CPC',
    examesCobrados: 'Exames II, VI, VIII, XVII, XXV e 37º (6x)',
    gatilhos: [
      { termo: 'pagou', peso: 35, explicacao: 'O contribuinte efetuou o recolhimento indevido aos cofres públicos' },
      { termo: 'recolheu', peso: 32, explicacao: 'Comprovação de pagamento indevido ou a maior' },
      { termo: 'restituição', peso: 34, explicacao: 'Pedido central de devolução dos valores pagos indevidamente' },
      { termo: 'repetir', peso: 30, explicacao: 'Pretensão de repetição de indébito tributário' },
      { termo: 'pagamento indevido', peso: 32, explicacao: 'Fato gerador do direito à repetição (Art. 165, I CTN)' },
      { termo: 'restituir os valores', peso: 30, explicacao: 'Devolução monetária de tributo recolhido a maior' },
      { termo: 'recolhido a maior', peso: 28, explicacao: 'Exação indevida quitada pelo sujeito passivo' },
      { termo: 'prazo prescricional de 5 anos', peso: 18, explicacao: 'Art. 168 do CTN' }
    ],
    antigatilhos: ['não pagou o tributo', 'execução fiscal', 'sentença proferida'],
    justificativaPadrao: 'O cliente já realizou o recolhimento indevido do tributo e deseja a devolução/restituição monetária integral acrescida de juros moratórios e correção, amparado no Art. 165, inciso I do CTN no prazo de 5 anos (Art. 168 do CTN).',
    dicas: [
      'Requeira a repetição com incidência da Taxa SELIC a partir do pagamento indevido (ou Súmula 188 STJ e Art. 167 CTN).',
      'Destaque a prova documental do pagamento acostada na inicial (guias de recolhimento DARF/DAE).',
      'Formule pedido de restituição por precatório judicial (Art. 100 CF) ou faculdade de compensação.'
    ],
    artigos: ['Art. 165, I CTN', 'Art. 168 CTN', 'Art. 167 CTN', 'Súmula 188 STJ', 'Art. 100 CF']
  },
  {
    codigo: 'EMBARGOS',
    nome: 'Embargos à Execução Fiscal',
    tipo: 'Inicial',
    baseLegal: 'Art. 16 da Lei nº 6.830/1980 (LEF)',
    examesCobrados: 'Exames VI, XIII, XV, XX, XXII e 33º (6x)',
    gatilhos: [
      { termo: 'execução fiscal', peso: 30, explicacao: 'A Fazenda Pública ajuizou ação executiva com base em CDA' },
      { termo: 'citado na execução', peso: 32, explicacao: 'Citação formal do devedor nos autos da execução' },
      { termo: 'penhora', peso: 34, explicacao: 'Constrição de bens efetuada para garantir o juízo' },
      { termo: 'garantia do juízo', peso: 35, explicacao: 'Requisito essencial para admissibilidade dos embargos' },
      { termo: 'garantiu o juízo', peso: 35, explicacao: 'Juízo devidamente seguro por penhora, depósito ou fiança' },
      { termo: 'termo de penhora', peso: 32, explicacao: 'Marco inicial para contagem do prazo de 30 dias (Art. 16 LEF)' },
      { termo: '30 dias', peso: 20, explicacao: 'Prazo peremptório do Art. 16 da LEF' },
      { termo: 'fiança bancária', peso: 25, explicacao: 'Modalidade de garantia aceita na LEF' },
      { termo: 'seguro garantia', peso: 25, explicacao: 'Modalidade de garantia' }
    ],
    antigatilhos: ['sem bens para penhora', 'sentença proferida', 'antes do ajuizamento da execução'],
    justificativaPadrao: 'O contribuinte foi citado em Execução Fiscal e o juízo já se encontra garantido por penhora/depósito/fiança, sendo cabíveis os Embargos à Execução Fiscal no prazo de 30 dias contados da intimação da penhora (Art. 16 da LEF).',
    dicas: [
      'Distribua os embargos por dependência ao juízo da execução fiscal (mencionando o número do processo principal).',
      'Requeira o efeito suspensivo nos termos do Art. 919, §1º do CPC (fumus boni iuris + perigo de dano).',
      'Ao final, requeira a procedência para desconstituir a CDA e extinguir a Execução Fiscal com levantamento da penhora.'
    ],
    artigos: ['Art. 16 Lei 6.830/80', 'Art. 919, §1º CPC', 'Art. 319 CPC', 'Súmula 392 STJ']
  },
  {
    codigo: 'EPE',
    nome: 'Exceção de Pré-Executividade',
    tipo: 'Inicial',
    baseLegal: 'Construção doutrinária e Súmula nº 393 do STJ',
    examesCobrados: 'Exames XVIII, XXIV, XXXVI e 41º (4x)',
    gatilhos: [
      { termo: 'sem garantia do juízo', peso: 34, explicacao: 'O executado não possui bens ou não quer garantir o juízo para se defender' },
      { termo: 'não tem bens', peso: 32, explicacao: 'Impossibilidade material de oferecer bens à penhora' },
      { termo: 'matéria de ordem pública', peso: 32, explicacao: 'Vício cognoscível de ofício pelo magistrado' },
      { termo: 'prescrição', peso: 28, explicacao: 'Matéria de ordem pública demonstrável de plano' },
      { termo: 'decadência', peso: 28, explicacao: 'Causa de extinção do crédito de ordem pública' },
      { termo: 'ilegitimidade passiva', peso: 28, explicacao: 'Exclusão do sócio sem poderes de gerência na época do fato' },
      { termo: 'redirecionamento indevido', peso: 26, explicacao: 'Súmula 430 e 435 do STJ' },
      { termo: 'sem necessidade de dilação probatória', peso: 30, explicacao: 'Súmula 393 do Superior Tribunal de Justiça' },
      { termo: 'nulidade da cda', peso: 24, explicacao: 'Vício formal no título executivo fiscal' }
    ],
    antigatilhos: ['penhora já efetivada', 'quer produzir prova pericial contábil', 'sentença proferida'],
    justificativaPadrao: 'O contribuinte é réu em Execução Fiscal sem juízo garantido e deseja alegar matéria de ordem pública (prescrição/decadência/ilegitimidade do sócio) passível de conhecimento de ofício sem necessidade de dilação probatória (Súmula 393 do STJ).',
    dicas: [
      'Petições de EPE são protocoladas diretamente nos próprios autos da Execução Fiscal, sem recolhimento de custas.',
      'Invoque expressamente a Súmula 393 do STJ e o Art. 803 do CPC.',
      'Requeira o efeito suspensivo imediato e a condenação da Fazenda em honorários advocatícios em caso de acolhimento.'
    ],
    artigos: ['Súmula 393 STJ', 'Art. 803 CPC', 'Art. 135, III CTN', 'Súmula 430 STJ']
  },
  {
    codigo: 'AGRAVO',
    nome: 'Agravo de Instrumento',
    tipo: 'Recursal',
    baseLegal: 'Art. 1.015 do CPC/2015',
    examesCobrados: 'Exames VII, XVI, XXVIII e 32º (4x)',
    gatilhos: [
      { termo: 'decisão interlocutória', peso: 35, explicacao: 'Ato do juiz de primeira instância de natureza não terminativa' },
      { termo: 'indeferiu a liminar', peso: 34, explicacao: 'Rejeição de tutela provisória de urgência ou liminar em MS' },
      { termo: 'indeferiu o pedido de liminar', peso: 35, explicacao: 'Decisão sobre tutela provisória (Art. 1.015, I CPC)' },
      { termo: 'rejeitou a exceção de pré-executividade', peso: 32, explicacao: 'Decisão que rejeita EPE sem extinguir a execução' },
      { termo: 'determinou a penhora', peso: 24, explicacao: 'Interlocutória na fase executiva' },
      { termo: 'efeito suspensivo ativo', peso: 22, explicacao: 'Pedido de tutela antecipada recursal ao Desembargador Relator' }
    ],
    antigatilhos: ['proferiu sentença', 'extinguiu o processo', 'julgou a ação'],
    justificativaPadrao: 'O magistrado proferiu decisão interlocutória indeferindo medida liminar / tutela provisória (ou rejeitando EPE sem extinguir o feito), cabendo Agravo de Instrumento direto ao Tribunal com pedido de efeito suspensivo ativo (Arts. 1.015, I e 1.019, I do CPC).',
    dicas: [
      'Enderece diretamente ao Tribunal ad quem (Presidente ou Desembargador Relator do TJ ou TRF).',
      'Requeira expressamente a concessão de tutela antecipada recursal ou efeito suspensivo ativo (Art. 1.019, I do CPC).',
      'Junte as peças obrigatórias e facultativas do Art. 1.017 do CPC.'
    ],
    artigos: ['Art. 1.015, I CPC', 'Art. 1.019, I CPC', 'Art. 1.017 CPC', 'Art. 1.003, §5º CPC']
  },
  {
    codigo: 'DECLARATORIA',
    nome: 'Ação Declaratória de Inexistência de Relação Jurídica',
    tipo: 'Inicial',
    baseLegal: 'Arts. 19, I, 300 e 319 do CPC/2015',
    examesCobrados: 'Exames III, X, XXXV e 31º (4x)',
    gatilhos: [
      { termo: 'antes do lançamento', peso: 32, explicacao: 'O Fisco ainda não lavrou auto de infração nem notificou o débito' },
      { termo: 'não houve lançamento', peso: 34, explicacao: 'Ausência de crédito tributário formalmente constituído' },
      { termo: 'ameaça de cobrança', peso: 30, explicacao: 'Receio de exação fiscal iminente ou futura' },
      { termo: 'relação continuativa', peso: 22, explicacao: 'Contribuinte realiza operações habituais e quer evitar autuações futuras' },
      { termo: 'declarar a inexistência', peso: 30, explicacao: 'Pretensão de certeza jurídica sobre a obrigação tributária' },
      { termo: 'tutela provisória', peso: 18, explicacao: 'Para obstar lançamentos futuros' }
    ],
    antigatilhos: ['já houve lançamento', 'já pagou o tributo', 'execução fiscal'],
    justificativaPadrao: 'O contribuinte pretende obter certeza jurídica preventiva para afastar exação fiscal antes da ocorrência do lançamento tributário, declarando a inexistência de relação jurídica com tutela provisória (Art. 19, I c/c Art. 300 do CPC).',
    dicas: [
      'Destaque que a ação é preventiva e visa impedir a constituição indevida do crédito tributário.',
      'Requeira tutela de urgência para impedir o Fisco de efetuar autuações e negativar a empresa.',
      'Declare dispensa de audiência de conciliação (Art. 319, VII do CPC).'
    ],
    artigos: ['Art. 19, I CPC', 'Art. 300 CPC', 'Art. 319 CPC', 'Art. 151, V CTN']
  },
  {
    codigo: 'CONSIGNACAO',
    nome: 'Ação de Consignação em Pagamento',
    tipo: 'Inicial',
    baseLegal: 'Art. 164 do CTN c/c Arts. 539 a 549 do CPC',
    examesCobrados: 'Exames II, XVIII e 29º (3x)',
    gatilhos: [
      { termo: 'dois municípios', peso: 35, explicacao: 'Conflito de competência entre dois entes federativos' },
      { termo: 'bitributação', peso: 34, explicacao: 'Dois entes públicos exigindo o mesmo tributo sobre o mesmo fato gerador' },
      { termo: 'dúvida sobre quem é o credor', peso: 35, explicacao: 'Hipótese expressa do Art. 164, III do CTN' },
      { termo: 'recusa de recebimento', peso: 32, explicacao: 'Exigência de tributo acessório ou subordinação indevida (Art. 164, I CTN)' },
      { termo: 'quer pagar', peso: 25, explicacao: 'O contribuinte não discute a dívida, deseja quitá-la legalmente' },
      { termo: 'depósito do valor', peso: 28, explicacao: 'Depósito integral para suspensão e extinção (Art. 164, §2º CTN)' },
      { termo: 'conflito de competência de iss', peso: 30, explicacao: 'Disputa de local da prestação do serviço (LC 116/03)' }
    ],
    antigatilhos: ['não quer pagar', 'execução fiscal', 'sentença proferida'],
    justificativaPadrao: 'Há recusa injustificada no recebimento ou dúvida plausível sobre qual ente federativo é o legítimo sujeito ativo da obrigação tributária (dupla cobrança de ISS/ICMS), cabendo Consignação em Pagamento com depósito (Art. 164 do CTN c/c Art. 539 do CPC).',
    dicas: [
      'Coloque no polo passivo ambos os entes públicos disputantes (litisconsórcio passivo necessário).',
      'Requeira autorização para o depósito judicial do montante no prazo de 5 dias (Art. 542, I do CPC).',
      'Requeira a extinção da obrigação tributária com quitação do contribuinte (Art. 156, VIII c/c Art. 164, §2º CTN).'
    ],
    artigos: ['Art. 164 CTN', 'Art. 539 CPC', 'Art. 156, VIII CTN', 'LC 116/2003']
  }
];

/**
 * Função de Análise Heurística em Tempo Real.
 * Recebe o enunciado do caso selecionado e o texto atualmente digitado na folha de 150 linhas.
 */
export function analisarPecaEmTempoReal(
  enunciadoCaso: string,
  textoRedacao: string
): ResultadoAnalisePeca {
  const corpusAnalise = `${enunciadoCaso}\n${textoRedacao}`.toLowerCase();

  const pontuacoes = REGRAS_PECAS_FGV.map((regra) => {
    let score = 0;
    const gatilhosEncontrados: string[] = [];

    // Checa gatilhos positivos
    regra.gatilhos.forEach((g) => {
      if (corpusAnalise.includes(g.termo.toLowerCase())) {
        score += g.peso;
        gatilhosEncontrados.push(g.termo);
      }
    });

    // Penaliza antigatilhos
    if (regra.antigatilhos) {
      regra.antigatilhos.forEach((anti) => {
        if (corpusAnalise.includes(anti.toLowerCase())) {
          score -= 35;
        }
      });
    }

    // Normaliza probabilidade em escala percentual de 0 a 100
    // Pontuações máximas típicas de gatilho somam entre 90 e 150
    const probabilidadeCalculada = Math.min(99, Math.max(8, Math.round((score / 120) * 100)));

    let nivelConfianca: SugestaoPeca['nivelConfianca'] = 'BAIXA';
    if (probabilidadeCalculada >= 85) nivelConfianca = 'MUITO ALTA';
    else if (probabilidadeCalculada >= 65) nivelConfianca = 'ALTA';
    else if (probabilidadeCalculada >= 40) nivelConfianca = 'MODERADA';

    // Obtém o esqueleto do catálogo correspondente
    const pecaCat = CATALOGO_PECAS.find((p) => p.codigo === regra.codigo);
    const esqueleto = pecaCat
      ? pecaCat.blocos.map((b) => `${b.titulo}\n${b.texto}`).join('\n\n')
      : 'Esqueleto estrutural cadastrado no Catálogo.';

    // Busca teses correlatas se houver
    const teseCorrelata = TESES_DATA.find((t) =>
      corpusAnalise.includes(t.t.toLowerCase().split(' ')[0]) ||
      t.s.some(sub => corpusAnalise.includes(sub[0].toLowerCase()))
    );

    const sugestao: SugestaoPeca = {
      codigo: regra.codigo,
      nome: regra.nome,
      tipo: regra.tipo,
      probabilidade: probabilidadeCalculada,
      nivelConfianca,
      baseLegal: regra.baseLegal,
      examesCobrados: regra.examesCobrados,
      gatilhosDetectados: gatilhosEncontrados,
      justificativaCabimento: regra.justificativaPadrao,
      dicasRedacao: regra.dicas,
      esqueletoRecomendado: esqueleto,
      artigosFundamentais: regra.artigos,
      teseRelacionada: teseCorrelata ? `${teseCorrelata.t} (${teseCorrelata.s[0]?.[0] || 'CF/CTN'})` : undefined
    };

    return sugestao;
  });

  // Ordena por maior probabilidade
  pontuacoes.sort((a, b) => b.probabilidade - a.probabilidade);

  // Garante que o primeiro colocado tenha destaque estatístico
  if (pontuacoes.length > 0 && pontuacoes[0].probabilidade < 60 && pontuacoes[0].gatilhosDetectados.length > 0) {
    pontuacoes[0].probabilidade = Math.min(96, pontuacoes[0].probabilidade + 25);
    if (pontuacoes[0].probabilidade >= 80) pontuacoes[0].nivelConfianca = 'MUITO ALTA';
    else if (pontuacoes[0].probabilidade >= 60) pontuacoes[0].nivelConfianca = 'ALTA';
  }

  // Identifica momento processual
  let momento: ResultadoAnalisePeca['momentoProcessual'] = 'Após Notificação/Auto de Infração';
  let postura = 'Fase contenciosa administrativa ou inicial';

  if (corpusAnalise.includes('sentença') || corpusAnalise.includes('julgou improcedente') || corpusAnalise.includes('apel')) {
    momento = 'Fase Recursal (Sentença/Decisão)';
    postura = 'Recurso em 2º grau de jurisdição';
  } else if (corpusAnalise.includes('execução fiscal') || corpusAnalise.includes('penhora') || corpusAnalise.includes('cda')) {
    momento = 'Durante Execução Fiscal';
    postura = 'Defesa em juízo executivo já ajuizado';
  } else if (corpusAnalise.includes('pagou') || corpusAnalise.includes('restituição') || corpusAnalise.includes('recolheu')) {
    momento = 'Pós-Pagamento Indevido';
    postura = 'Ação de cunho condenatório ressarcitório';
  } else if (corpusAnalise.includes('antes do lançamento') || corpusAnalise.includes('ameaça')) {
    momento = 'Antes do Lançamento';
    postura = 'Tutela preventiva contra exação futura';
  }

  // Coleta todos os gatilhos únicos
  const todosGatilhos = Array.from(new Set(pontuacoes.flatMap((p) => p.gatilhosDetectados)));

  return {
    pecaMaisProvavel: pontuacoes[0],
    segundaOpcao: pontuacoes[1],
    terceiraOpcao: pontuacoes[2],
    todasSugestoes: pontuacoes,
    gatilhosGeraisEncontrados: todosGatilhos,
    posturaProcessualDetectada: postura,
    momentoProcessual: momento
  };
}
