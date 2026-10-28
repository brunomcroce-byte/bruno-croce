import { SyntaxCategory } from './syntaxHighlight';
import { CATALOGO_PECAS, IMPOSTOS_DATA, SUMULAS_DATA } from '../data/tributarioData';

export interface LegalTooltipInfo {
  termo: string;
  categoria: SyntaxCategory;
  categoriaLabel: string;
  badgeCor: string;
  titulo: string;
  conceito: string;
  fundamentoLegal: string;
  dicaOAB: string;
  exemploPratico?: string;
  artigosRelacionados?: string[];
  linkAba?: 'pecas' | 'vade' | 'sumulas' | 'material' | 'flashcards';
  abaLabel?: string;
}

// Dicionário detalhado para termos recorrentes na 2ª Fase OAB Tributário
const GLOSSARIO_CONCEITOS: Record<string, {
  titulo: string;
  conceito: string;
  fundamentoLegal: string;
  dicaOAB: string;
  exemploPratico?: string;
  linkAba?: 'pecas' | 'vade' | 'sumulas' | 'material' | 'flashcards';
  abaLabel?: string;
}> = {
  // --- PEÇAS PRÁTICAS ---
  'mandado de seguranca': {
    titulo: 'Mandado de Segurança (MS Tributário)',
    conceito: 'Ação constitucional célere destinada a proteger direito líquido e certo contra ato ilegal ou abusivo de autoridade pública, exigindo prova pré-constituída documental, sem dilação probatória.',
    fundamentoLegal: 'Art. 5º, LXIX, CF/88 c/c Lei nº 12.016/2009',
    dicaOAB: 'Prazo decadencial estrito de 120 dias (Art. 23). Não cabe condenação em honorários de sucumbência (Art. 25 e Súmula 105 STJ). Peça mais cobrada da história da FGV (10x).',
    exemploPratico: 'Exige tópico específico de liminar (Art. 7º, III, Lei 12.016/09 c/c Art. 151, IV, CTN) e notificação da autoridade coatora (Art. 7º, I).',
    linkAba: 'pecas',
    abaLabel: 'Ver Esqueleto no Catálogo de Peças'
  },
  'acao anulatoria': {
    titulo: 'Ação Anulatória de Débito Fiscal',
    conceito: 'Ação ordinária de conhecimento com rito comum do CPC, cabível para desconstituir crédito tributário já lançado pelo Fisco antes do ajuizamento da execução fiscal ou concomitantemente sem penhora integral.',
    fundamentoLegal: 'Art. 38 da Lei nº 6.830/1980 c/c Art. 319 do CPC/2015',
    dicaOAB: 'Permite ampla dilação probatória (perícia contábil, prova testemunhal). Requer pedido de tutela de urgência (Art. 300 CPC c/c Art. 151, V do CTN) ou depósito integral (Art. 151, II CTN).',
    exemploPratico: 'Ideal para lançamentos com arbitramento incorreto de base de cálculo do IPTU, ICMS ou ISS.',
    linkAba: 'pecas',
    abaLabel: 'Ver Modelo de Ação Anulatória'
  },
  'acao declaratoria': {
    titulo: 'Ação Declaratória de Inexistência de Relação Jurídico-Tributária',
    conceito: 'Ação preventiva do CPC utilizada antes de ocorrido o lançamento fiscal definitivo, visando declarar que o contribuinte não possui obrigação tributária em relação a determinado fato futuro ou iminente.',
    fundamentoLegal: 'Art. 19, I e Art. 319 do CPC/2015',
    dicaOAB: 'Utilizada quando o Fisco ameaça autuar ou quando se pretende afastar tributação contínua. Pode ser cumulada com repetição de indébito.',
    exemploPratico: 'Empresa pleiteia declaração de não incidência de ICMS sobre a transferência de mercadorias entre matriz e filial.',
    linkAba: 'pecas',
    abaLabel: 'Ver Peças FGV'
  },
  'repeticao de indebito': {
    titulo: 'Ação de Repetição de Indébito Tributário',
    conceito: 'Ação ordinária voltada à restituição integral de valores pagos indevidamente ou a maior a título de tributo, penalidade ou juros aos cofres públicos.',
    fundamentoLegal: 'Arts. 165 a 168 do CTN c/c Art. 319 do CPC/2015',
    dicaOAB: 'Prazo decadencial de 5 anos do pagamento (Art. 168, I, CTN). Em tributos indiretos (ICMS/IPI), deve comprovar assunção do encargo financeiro (Art. 166 CTN). Correção pela Taxa SELIC (EC 113/2021).',
    exemploPratico: 'Pedido de restituição de taxa inconstitucional ou ICMS cobrado acima da base de cálculo efetiva.',
    linkAba: 'pecas',
    abaLabel: 'Ver Modelo no Catálogo de Peças'
  },
  'consignacao em pagamento': {
    titulo: 'Ação de Consignação em Pagamento',
    conceito: 'Ação especial cabível quando o contribuinte quer pagar o tributo mas há recusa injustificada do Fisco, subordinação a exigência ilegal ou cobrança concorrente por múltiplos entes públicos (bitributação).',
    fundamentoLegal: 'Art. 164 do CTN c/c Arts. 539 a 549 do CPC/2015',
    dicaOAB: 'Requer depósito do valor devido em até 5 dias (Art. 542, I, CPC), suspendendo a exigibilidade (Art. 151, II CTN). No mérito, pede a extinção do crédito (Art. 156, VIII CTN).',
    exemploPratico: 'Disputa de competência entre Municípios fronteiriços sobre qual é o credor do ISS.',
    linkAba: 'pecas',
    abaLabel: 'Ver Esqueleto no Catálogo'
  },
  'embargos a execucao': {
    titulo: 'Embargos à Execução Fiscal',
    conceito: 'Ação autônoma de defesa do devedor executado distribuída por dependência aos autos da Execução Fiscal, com contraditório pleno e cognição exauriente.',
    fundamentoLegal: 'Art. 16 da Lei nº 6.830/1980 (LEF) c/c Art. 914 e ss. do CPC/2015',
    dicaOAB: 'Exige garantia integral prévia do juízo (depósito em dinheiro, penhora, fiança ou seguro) e prazo decadencial preclusivo de 30 dias contados da intimação da penhora/garantia (Art. 16 LEF).',
    exemploPratico: 'Requerer a concessão de efeito suspensivo (Art. 919, §1º CPC) demonstrando garantia, fumus boni iuris e perigo de dano.',
    linkAba: 'pecas',
    abaLabel: 'Ver Modelo de Embargos'
  },
  'excecao de pre-executividade': {
    titulo: 'Exceção de Pré-Executividade (EPE)',
    conceito: 'Mecanismo incidental de defesa simplificada do executado dentro dos próprios autos da Execução Fiscal, sem necessidade de garantia do juízo ou de petição inicial autônoma.',
    fundamentoLegal: 'Súmula 393 do STJ c/c Art. 803, parágrafo único do CPC/2015',
    dicaOAB: 'Requisitos inafastáveis: matérias de ordem pública conhecíveis de ofício (prescrição, decadência, imunidade, ilegitimidade manifesta) com prova pré-constituída documental, sem dilação probatória.',
    exemploPratico: 'Extinção de execução proposta contra sócio sem prova de dissolução irregular (Súmula 430 STJ). Se acolhida para extinguir, cabe condenação da Fazenda em honorários (Súmula 153 STJ).',
    linkAba: 'pecas',
    abaLabel: 'Ver Esqueleto de EPE'
  },
  'epe': {
    titulo: 'Exceção de Pré-Executividade (EPE)',
    conceito: 'Defesa célere e desprovida de custas iniciais na Execução Fiscal, permitida para arguição de causas de nulidade do título ou extinção do crédito comprovadas de plano.',
    fundamentoLegal: 'Súmula 393 do STJ',
    dicaOAB: 'Dispensa garantia do juízo e não possui prazo preclusivo estrito, podendo ser oposta a qualquer tempo antes da arrematação/adjudicação.',
    linkAba: 'pecas',
    abaLabel: 'Ver Esqueleto de EPE'
  },
  'apelacao': {
    titulo: 'Recurso de Apelação Cível',
    conceito: 'Recurso ordinário interposto contra sentença que pôs fim à fase de conhecimento (com ou sem resolução de mérito), devolvendo ao Tribunal a reapreciação integral da lide.',
    fundamentoLegal: 'Arts. 1.009 a 1.014 do CPC/2015',
    dicaOAB: 'Estruturado em 2 partes: Folha de Rosto/Interposição (ao juiz prolator da sentença) e Folha de Razões (ao Tribunal de Justiça ou TRF). Prazo de 15 dias úteis com preparo.',
    exemploPratico: 'Se a sentença revogou liminar, requerer concessão de efeito suspensivo ou tutela recursal ao Relator (Art. 1.012, §3º e §4º CPC).',
    linkAba: 'pecas',
    abaLabel: 'Ver Modelo de Apelação'
  },
  'agravo de instrumento': {
    titulo: 'Agravo de Instrumento',
    conceito: 'Recurso cabível contra decisões interlocutórias do juízo de 1º grau que versem sobre tutelas provisórias, rejeição de petição inicial ou hipóteses expressas em lei.',
    fundamentoLegal: 'Art. 1.015 do CPC c/c Art. 7º, §1º da Lei 12.016/09 (em MS)',
    dicaOAB: 'Dirigido diretamente ao Tribunal ad quem (Presidente do TJ ou TRF). Prazo de 15 dias úteis. Requerer antecipação dos efeitos da tutela recursal ou efeito suspensivo ativo (Art. 1.019, I CPC).',
    exemploPratico: 'Interposição contra decisão que indeferiu liminar em Mandado de Segurança ou tutela de urgência em Ação Anulatória.',
    linkAba: 'pecas',
    abaLabel: 'Ver Roteiro de Agravo'
  },
  'recurso ordinario': {
    titulo: 'Recurso Ordinário Constitucional (ROC)',
    conceito: 'Recurso cabível ao STJ ou STF contra decisão denegatória de Mandado de Segurança julgado em competência originária de Tribunal (TJ ou TRF).',
    fundamentoLegal: 'Art. 105, II, b da CF/88 (ao STJ) ou Art. 102, II, a da CF/88 (ao STF)',
    dicaOAB: 'Interposto quando o Tribunal de Justiça ou Tribunal Regional Federal julga e denega Mandado de Segurança originário. Prazo de 15 dias úteis.',
    linkAba: 'pecas',
    abaLabel: 'Ver Recursos FGV'
  },
  'roc': {
    titulo: 'Recurso Ordinário Constitucional (ROC)',
    conceito: 'Recurso ordinário que devolve cognição ampla ao STJ/STF em acórdão denegatório de Mandado de Segurança de competência originária de Tribunal.',
    fundamentoLegal: 'Art. 105, II, b da CF/88',
    dicaOAB: 'Tem efeito devolutivo integral e não exige demonstração de repercussão geral ou dissenso jurisprudencial.',
    linkAba: 'pecas',
    abaLabel: 'Ver Recursos FGV'
  },

  // --- ARTIGOS FUNDAMENTAIS ---
  'art 151': {
    titulo: 'Art. 151 do CTN – Suspensão da Exigibilidade do Crédito',
    conceito: 'Rol taxativo de hipóteses que impedem o Fisco de promover atos executivos de cobrança e obrigam à expedição de Certidão Positiva com Efeito de Negativa (CPD-EN, Art. 206 CTN).',
    fundamentoLegal: 'Art. 151, incisos I a X do CTN (ampliado pela LC 236/2026)',
    dicaOAB: 'Causas FGV: Moratória (I); Depósito integral em dinheiro (II - Súmula 112 STJ); Impugnações/Recursos administrativos (III); Liminar em MS (IV); Tutela provisória judicial (V); Parcelamento (VI); Seguro/Fiança e Mediação (LC 236/2026).',
    exemploPratico: 'Sempre mencione o Art. 151, IV nos pedidos de liminar e o Art. 151, V nos pedidos de tutela de urgência.',
    linkAba: 'vade',
    abaLabel: 'Ver Artigo no Vade Mecum'
  },
  'art 156': {
    titulo: 'Art. 156 do CTN – Extinção do Crédito Tributário',
    conceito: 'Causas legais que põem fim à obrigação tributária e ao crédito correspondente, desonerando definitivamente o sujeito passivo.',
    fundamentoLegal: 'Art. 156, incisos I a XIII do CTN',
    dicaOAB: 'Hipóteses mais pontuadas: Pagamento (I), Compensação (II), Prescrição e Decadência (V), Homologação expressa/tácita (VII), Consignação procedente (VIII), Decisão com trânsito em julgado (X).',
    exemploPratico: 'Em ação de consignação em pagamento julgada procedente, o pedido de mérito deve fundamentar a extinção pelo Art. 156, VIII do CTN.',
    linkAba: 'vade',
    abaLabel: 'Consultar Artigo 156'
  },
  'art 173': {
    titulo: 'Art. 173 do CTN – Decadência Tributária',
    conceito: 'Perda do direito de o Fisco constituir o crédito tributário através do lançamento de ofício, em decorrência do transcurso in albis do prazo decadencial de 5 anos.',
    fundamentoLegal: 'Art. 173, I e II do CTN',
    dicaOAB: 'Regra geral (Art. 173, I): contagem a partir do primeiro dia do exercício financeiro seguinte àquele em que o lançamento poderia ter sido efetuado. Aplica-se na falta de declaração prévia (Súmula 555 STJ).',
    exemploPratico: 'Fato gerador em 2018; prazo inicia em 01/01/2019 e decai definitivamente em 31/12/2023.',
    linkAba: 'vade',
    abaLabel: 'Ver Decadência no Vade Mecum'
  },
  'art 174': {
    titulo: 'Art. 174 do CTN – Prescrição da Ação de Cobrança',
    conceito: 'Perda do direito de a Fazenda Pública ajuizar ou prosseguir na Execução Fiscal para haver o crédito tributário definitivamente constituído, no prazo de 5 anos.',
    fundamentoLegal: 'Art. 174 do CTN c/c LC 236/2026',
    dicaOAB: 'Interrupção da prescrição ocorre pelo despacho do juiz que ordenar a citação em execução fiscal (Art. 174, parágrafo único, I), retroagindo à data da propositura (Art. 240, §1º CPC).',
    exemploPratico: 'Crédito constituído em 2015; despacho citatório proferido em 2022 sem suspensão: operou-se a prescrição quinquenal da cobrança.',
    linkAba: 'vade',
    abaLabel: 'Ver Prescrição no Vade Mecum'
  },
  'art 206': {
    titulo: 'Art. 206 do CTN – CPD-EN (Certidão Positiva com Efeitos de Negativa)',
    conceito: 'Certidão emitida em favor do contribuinte que possui débitos tributários, desde que a exigibilidade esteja suspensa (Art. 151 CTN) ou o juízo esteja garantido por penhora em execução fiscal.',
    fundamentoLegal: 'Art. 206 do CTN c/c Art. 205 do CTN',
    dicaOAB: 'Quesito obrigatório no espelho FGV: em pedidos de liminar ou tutela provisória, após pedir a suspensão do crédito, pleiteie expressamente a expedição de CPD-EN com fulcro no Art. 206.',
    exemploPratico: 'Garante à empresa a participação em licitações e celebração de contratos com a Administração Pública.',
    linkAba: 'vade',
    abaLabel: 'Ver Artigo 206 no Vade Mecum'
  },
  'art 150': {
    titulo: 'Art. 150 da CF/88 – Limitações ao Poder de Tributar',
    conceito: 'Estatuto dos Direitos e Garantias Constitucionais do Contribuinte, elencando princípios e imunidades fundamentais que delimitam a competência tributária de todos os Entes Federativos.',
    fundamentoLegal: 'Art. 150, incisos I a VI da CF/88',
    dicaOAB: 'Inciso I (Legalidade); Inciso II (Isonomia); Inciso III, a (Irretroatividade); Inciso III, b (Anterioridade Anual); Inciso III, c (Anterioridade Nonagesimal); Inciso IV (Não Confisco); Inciso VI (Imunidades).',
    linkAba: 'vade',
    abaLabel: 'Consultar Art. 150 da CF'
  },
  'art 5': {
    titulo: 'Art. 5º da CF/88 – Garantias Fundamentais no Processo',
    conceito: 'Dispositivos constitucionais assecuratórios do devido processo legal, contraditório, ampla defesa e ações constitucionais de proteção ao cidadão contra abusos estatais.',
    fundamentoLegal: 'Art. 5º, incisos LIV, LV, LXIX (MS), XXXIV (gratuidade de certidões) da CF/88',
    dicaOAB: 'O inciso LXIX é a fundamentação constitucional basilar para a impetração do Mandado de Segurança contra atos abusivos de autoridade fiscal.',
    linkAba: 'vade',
    abaLabel: 'Ver Art. 5º no Vade Mecum'
  },
  'art 23 da lei 12 016': {
    titulo: 'Art. 23 da Lei 12.016/09 – Prazo Decadencial do MS',
    conceito: 'Estipula o prazo peremptório de 120 dias, contados da ciência pelo interessado do ato impugnado, para impetração do Mandado de Segurança.',
    fundamentoLegal: 'Art. 23 da Lei nº 12.016/2009',
    dicaOAB: 'A comprovação de impetração dentro dos 120 dias é quesito fixo de tempestividade no espelho de correção da OAB 2ª Fase.',
    linkAba: 'pecas',
    abaLabel: 'Ver Quesitos de MS'
  },
  'art 7 da lei 12 016': {
    titulo: 'Art. 7º da Lei 12.016/09 – Liminar e Notificação no MS',
    conceito: 'Regula os provimentos de urgência em mandado de segurança (inciso III: fundamento relevante e risco de ineficácia da medida) e os atos de notificação da autoridade coatora (inciso I: 10 dias).',
    fundamentoLegal: 'Art. 7º, incisos I, II e III da Lei nº 12.016/2009',
    dicaOAB: 'Indicar o Art. 7º, III da Lei 12.016/09 combinado com o Art. 151, IV do CTN no tópico de medida liminar.',
    linkAba: 'pecas',
    abaLabel: 'Ver Tópico de Liminar'
  },
  'art 16 da lei 6 830': {
    titulo: 'Art. 16 da LEF – Prazo e Garantia dos Embargos à Execução',
    conceito: 'Estabelece que o devedor dispõe de 30 dias para opor Embargos à Execução Fiscal, contados do depósito em dinheiro, juntada da prova da fiança/seguro ou intimação da penhora.',
    fundamentoLegal: 'Art. 16, incisos I a III e §1º da Lei nº 6.830/1980',
    dicaOAB: 'O §1º proíbe expressamente a admissão de embargos do executado antes de garantida a execução.',
    linkAba: 'pecas',
    abaLabel: 'Ver Modelo de Embargos'
  },

  // --- SÚMULAS NOTÁVEIS ---
  'sumula 166': {
    titulo: 'Súmula 166 do STJ – ICMS entre Estabelecimentos (ADC 49 STF)',
    conceito: 'Não constitui fato gerador do ICMS o simples deslocamento de mercadoria de um para outro estabelecimento do mesmo contribuinte (matriz e filiais), por ausência de transferência da propriedade jurídica.',
    fundamentoLegal: 'Súmula 166 do STJ c/c ADC 49/STF e Tema 1.099 STF',
    dicaOAB: 'Tese repetida com altíssima frequência nos exames da FGV para anulação de autos de infração e impetração de mandado de segurança preventivo.',
    linkAba: 'sumulas',
    abaLabel: 'Ver Súmula 166 no Catálogo'
  },
  'sumula 430': {
    titulo: 'Súmula 430 do STJ – Inadimplemento e Responsabilidade do Sócio',
    conceito: 'O mero inadimplemento da obrigação tributária pela sociedade empresária não gera, por si só, a responsabilidade pessoal ou solidária do sócio-gerente.',
    fundamentoLegal: 'Súmula 430 do STJ c/c Art. 135, III do CTN e Tema 430 STJ',
    dicaOAB: 'Exige comprovação cabal de dolo, excesso de poderes, infração à lei/estatuto ou dissolução irregular da pessoa jurídica (Súmula 435 STJ). Tese campeã em Exceção de Pré-Executividade.',
    linkAba: 'sumulas',
    abaLabel: 'Ver Súmula 430 no Catálogo'
  },
  'sumula 393': {
    titulo: 'Súmula 393 do STJ – Cabimento da Exceção de Pré-Executividade',
    conceito: 'A exceção de pré-executividade é admissível na execução fiscal relativamente às matérias de ordem pública conhecíveis de ofício que não demandem dilação probatória.',
    fundamentoLegal: 'Súmula 393 do STJ c/c Art. 803, parágrafo único do CPC',
    dicaOAB: 'Dispositivo padrão para fundamentar a tempestividade e o cabimento da EPE sem a necessidade de garantia ou penhora.',
    linkAba: 'sumulas',
    abaLabel: 'Ver Súmula 393 no Catálogo'
  },
  'sumula 112': {
    titulo: 'Súmula 112 do STJ – Depósito Integral e em Dinheiro',
    conceito: 'O depósito somente suspende a exigibilidade do crédito tributário (Art. 151, II do CTN) se for realizado em seu montante integral e estritamente em dinheiro.',
    fundamentoLegal: 'Súmula 112 do STJ c/c Art. 151, II do CTN',
    dicaOAB: 'A fiança bancária e o seguro-garantia garantem a execução fiscal para oposição de embargos (Art. 16 LEF), mas não suspendem a exigibilidade fora da sistemática da LC 236/2026.',
    linkAba: 'sumulas',
    abaLabel: 'Ver Súmula 112 no Catálogo'
  },
  'sumula 105': {
    titulo: 'Súmula 105 do STJ – Inadmissibilidade de Honorários em MS',
    conceito: 'Na ação de mandado de segurança não se admite condenação em honorários advocatícios sucumbenciais.',
    fundamentoLegal: 'Súmula 105 do STJ c/c Art. 25 da Lei nº 12.016/09 e Súmula 512 STF',
    dicaOAB: 'No Mandado de Segurança, peça apenas o reembolso das custas e despesas processuais, sob pena de perder pontos caso requeira honorários sucumbenciais.',
    linkAba: 'sumulas',
    abaLabel: 'Ver Súmula 105 no Catálogo'
  },
  'sumula vinculante 8': {
    titulo: 'Súmula Vinculante 8 do STF – Reserva de Lei Complementar',
    conceito: 'São inconstitucionais normas infraconstitucionais ordinárias ou decretos que estipulem prazos de decadência e prescrição tributária divergentes do CTN, por exigir lei complementar.',
    fundamentoLegal: 'Súmula Vinculante 8 do STF c/c Art. 146, III, b da CF/88',
    dicaOAB: 'Tese aplicada sempre que lei municipal ou estadual ordinária tentar estipular prazos de decadência maiores que 5 anos.',
    linkAba: 'sumulas',
    abaLabel: 'Ver Súmulas Vinculantes'
  },
  'sv 8': {
    titulo: 'Súmula Vinculante 8 do STF – Reserva de Lei Complementar',
    conceito: 'Prescrição e decadência tributárias exigem lei complementar nacional (Art. 146, III, b da CF/88), sendo inconstitucionais leis ordinárias que alterem esses prazos.',
    fundamentoLegal: 'SV nº 8 do STF',
    dicaOAB: 'Cite a SV 8 sempre que houver menção a lei estadual/municipal com prazo superior a 5 anos.',
    linkAba: 'sumulas',
    abaLabel: 'Ver Súmula no Catálogo'
  },

  // --- TRIBUTOS ---
  'icms': {
    titulo: 'ICMS – Imposto sobre Circulação de Mercadorias e Serviços',
    conceito: 'Imposto de competência estadual incidente sobre operações relativas à circulação de mercadorias e prestações de serviços de transporte interestadual/intermunicipal e de comunicação.',
    fundamentoLegal: 'Art. 155, II da CF/88 c/c Lei Complementar nº 87/1996 (Lei Kandir)',
    dicaOAB: 'Princípio da Não Cumulatividade (compensação do que for devido com o cobrado nas operações anteriores) e Seletividade facultativa em razão da essencialidade.',
    exemploPratico: 'Não incide no deslocamento entre filiais do mesmo titular (Súmula 166 STJ e ADC 49 STF) nem sobre alienação de salvados (Súmula Vinculante 32).',
    linkAba: 'material',
    abaLabel: 'Ver Impostos em Espécie'
  },
  'iss': {
    titulo: 'ISS / ISSQN – Imposto sobre Serviços de Qualquer Natureza',
    conceito: 'Imposto municipal incidente sobre a prestação de serviços constantes da lista anexa à Lei Complementar nº 116/2003, mesmo que sua prestação envolva fornecimento de mercadorias.',
    fundamentoLegal: 'Art. 156, III da CF/88 c/c Lei Complementar nº 116/2003',
    dicaOAB: 'Alíquotas balizadas entre o piso mínimo de 2% (Emenda Constitucional 37/2002) e o teto máximo de 5%. Não incide sobre locação pura de bens móveis (Súmula Vinculante 31).',
    exemploPratico: 'Regra de competência tributária: local do estabelecimento prestador do serviço (Art. 3º LC 116/03), ressalvadas as exceções expressas.',
    linkAba: 'material',
    abaLabel: 'Ver Regras do ISS'
  },
  'issqn': {
    titulo: 'ISS / ISSQN – Imposto sobre Serviços de Qualquer Natureza',
    conceito: 'Imposto de competência dos Municípios e do Distrito Federal cobrado sobre prestações de serviços descritos taxativamente na LC 116/2003.',
    fundamentoLegal: 'Art. 156, III da CF/88 c/c LC 116/2003',
    dicaOAB: 'Verifique se o serviço prestado consta da lista anexa. Se houver bitributação entre dois Municípios, a peça cabível é a Ação de Consignação em Pagamento (Art. 164, III CTN).',
    linkAba: 'material',
    abaLabel: 'Ver Regras do ISS'
  },
  'iptu': {
    titulo: 'IPTU – Imposto Predial e Territorial Urbano',
    conceito: 'Imposto municipal sobre a propriedade, posse com animus domini ou domínio útil de imóvel edificado ou não situado na zona urbana definida em lei municipal.',
    fundamentoLegal: 'Art. 156, I da CF/88 c/c Arts. 32 a 34 do CTN',
    dicaOAB: 'Base de cálculo é o valor venal do imóvel. A majoração da base por decreto executivo além do índice inflacionário é inconstitucional (Súmula 160 STJ e Tema 211 STF).',
    exemploPratico: 'Exceção à Anterioridade Nonagesimal na fixação/atualização da base de cálculo (Art. 150, §1º da CF/88).',
    linkAba: 'material',
    abaLabel: 'Ver Detalhes do IPTU'
  },
  'itbi': {
    titulo: 'ITBI – Transmissão Inter Vivos de Bens Imóveis',
    conceito: 'Imposto municipal incidente sobre a transmissão onerosa, inter vivos, a qualquer título, por ato oneroso, de bens imóveis e direitos reais a eles relativos.',
    fundamentoLegal: 'Art. 156, II da CF/88 c/c Arts. 35 a 42 do CTN',
    dicaOAB: 'Fato gerador aperfeiçoa-se unicamente com o registro imobiliário no RGI, e não com promessa de compra e venda (Tema 1.124 STF). Base é o valor de mercado (Art. 38 CTN, LC 227/2026).',
    exemploPratico: 'Imunidade constitucional na integralização de capital social, exceto na parcela que exceder o valor das quotas (Art. 156, §2º, I CF e Tema 796 STF).',
    linkAba: 'material',
    abaLabel: 'Ver Regras de ITBI'
  },
  'itcmd': {
    titulo: 'ITCMD – Causa Mortis e Doação',
    conceito: 'Imposto estadual incidente sobre a transmissão de qualquer bem ou direito por sucessão hereditária legítima/testamentária ou por doação gratuita.',
    fundamentoLegal: 'Art. 155, I da CF/88 c/c Resolução do Senado nº 9/1992',
    dicaOAB: 'Alíquotas progressivas fixadas pelos Estados com teto máximo nacional de 8% estabelecido pelo Senado Federal. Imóveis: competente o Estado onde se situa o bem.',
    linkAba: 'material',
    abaLabel: 'Ver Impostos Estaduais'
  },
  'ipva': {
    titulo: 'IPVA – Propriedade de Veículos Automotores',
    conceito: 'Imposto estadual incidente sobre a propriedade de veículos automotores terrestres, aéreos e aquáticos (EC 132/2023).',
    fundamentoLegal: 'Art. 155, III da CF/88',
    dicaOAB: 'Alíquota mínima fixada pelo Senado. Exceção à Anterioridade Nonagesimal quando houver alteração apenas da base de cálculo (valor de tabela FIPE).',
    linkAba: 'material',
    abaLabel: 'Ver Impostos Estaduais'
  },
  'ipi': {
    titulo: 'IPI – Imposto sobre Produtos Industrializados',
    conceito: 'Imposto federal incidente sobre o desembaraço aduaneiro de produtos de procedência estrangeira e a saída de estabelecimento industrial ou equiparado.',
    fundamentoLegal: 'Art. 153, IV da CF/88 c/c Arts. 46 a 51 do CTN',
    dicaOAB: 'Princípio da Não Cumulatividade e Seletividade obrigatória em função da essencialidade do produto. Exceção à Anterioridade Anual (respeita apenas a noventena de 90 dias). Alíquotas alteráveis por decreto.',
    linkAba: 'material',
    abaLabel: 'Ver Impostos Federais'
  },
  'ir': {
    titulo: 'Imposto sobre a Renda e Proventos de Qualquer Natureza (IR)',
    conceito: 'Tributo federal incidente sobre a aquisição da disponibilidade econômica ou jurídica de renda (produto do capital/trabalho) e proventos (acréscimo patrimonial).',
    fundamentoLegal: 'Art. 153, III da CF/88 c/c Arts. 43 a 45 do CTN',
    dicaOAB: 'Informado pelos critérios constitucionais da generalidade, universalidade e progressividade. Exceção à Anterioridade Nonagesimal (respeita apenas a Anual).',
    exemploPratico: 'Isenção a proventos de aposentadoria de portadores de moléstia grave sem necessidade de laudo médico oficial (Súmula 598 STJ) nem contemporaneidade (Súmula 627 STJ).',
    linkAba: 'material',
    abaLabel: 'Ver Impostos Federais'
  },
  'irpf': {
    titulo: 'IRPF – Imposto de Renda da Pessoa Física',
    conceito: 'Modalidade de IR aplicada sobre os rendimentos auferidos por pessoas físicas residentes no Brasil, regido por tabela progressiva.',
    fundamentoLegal: 'Art. 153, III da CF/88',
    dicaOAB: 'Não incide sobre verbas de natureza estritamente indenizatória (férias não gozadas, dano moral, aviso prévio indenizado).',
    linkAba: 'material',
    abaLabel: 'Ver Regras do IRPF'
  },
  'iof': {
    titulo: 'IOF – Operações de Crédito, Câmbio, Seguro e Títulos',
    conceito: 'Tributo federal de caráter predominantemente extrafiscal utilizado pelo Governo como instrumento de intervenção e regulação da moeda e do crédito.',
    fundamentoLegal: 'Art. 153, V da CF/88 c/c Arts. 63 a 67 do CTN',
    dicaOAB: 'Exceção expressa à Legalidade estrita (alíquotas alteráveis por decreto do Poder Executivo) e exceção a ambas as anterioridades (anual e nonagesimal).',
    linkAba: 'material',
    abaLabel: 'Ver Tributos Federais'
  },
  'ibs': {
    titulo: 'IBS – Imposto sobre Bens e Serviços (Reforma Tributária)',
    conceito: 'Tributo unificado estadual/distrital/municipal criado pela EC 132/2023, substituindo progressivamente o ICMS e o ISS sob o princípio do destino e com crédito amplo.',
    fundamentoLegal: 'Art. 156-A da CF/88 c/c Lei Complementar nº 214/2025 e LC 227/2026',
    dicaOAB: 'Arrecadado e gerido pelo Comitê Gestor do IBS (CGIBS). Não cumulatividade plena e alíquota uniforme para todas as operações, salvo regimes favorecidos específicos.',
    linkAba: 'material',
    abaLabel: 'Ver Reforma Tributária'
  },
  'cbs': {
    titulo: 'CBS – Contribuição sobre Bens e Serviços (Reforma Tributária)',
    conceito: 'Contribuição federal sobre o consumo instituída pela EC 132/2023 que substitui o PIS e a COFINS, incidindo harmonicamente sobre a mesma base de cálculo do IBS.',
    fundamentoLegal: 'Art. 195, V da CF/88 c/c Lei Complementar nº 214/2025',
    dicaOAB: 'Fim da cumulatividade residual. Sistema de split payment nas liquidações financeiras e transição escalonada até 2033.',
    linkAba: 'material',
    abaLabel: 'Ver Reforma Tributária'
  },

  // --- REQUISITOS PROCESSUAIS & TESES FGV ---
  'fumus boni iuris': {
    titulo: 'Fumaça do Bom Direito (Fumus Boni Iuris)',
    conceito: 'Demonstração da plausibilidade jurídica e probabilidade do direito alegado, amparado em dispositivos constitucionais, legais ou precedentes judiciais consolidados.',
    fundamentoLegal: 'Art. 300 do CPC c/c Art. 7º, III da Lei nº 12.016/2009',
    dicaOAB: 'Tópico mandatório no espelho FGV em pedidos de liminar ou tutela de urgência. Articule sempre com a fundamentação do mérito demonstrando a ilegalidade da cobrança.',
    exemploPratico: 'Exponha que a violação ao princípio da anterioridade ou a existência de Súmula pacífica consubstancia a fumaça do bom direito.',
    linkAba: 'pecas',
    abaLabel: 'Ver Requisitos de Liminar'
  },
  'periculum in mora': {
    titulo: 'Perigo da Demora (Periculum in Mora)',
    conceito: 'Risco de dano irreparável ou de difícil reparação resultante da demora natural do trâmite processual até o julgamento definitivo da causa.',
    fundamentoLegal: 'Art. 300 do CPC c/c Art. 7º, III da Lei nº 12.016/2009',
    dicaOAB: 'Em matéria tributária, fundamente no risco iminente de inscrição em Dívida Ativa, ajuizamento de execução fiscal, penhora de bens e negativa de expedição de certidões (CND/CPEN).',
    linkAba: 'pecas',
    abaLabel: 'Ver Requisitos de Liminar'
  },
  'medida liminar': {
    titulo: 'Pedido de Medida Liminar',
    conceito: 'Tutela provisória de urgência concedida inaudita altera parte no Mandado de Segurança para suspender imediatamente o ato coator lesivo.',
    fundamentoLegal: 'Art. 7º, III da Lei nº 12.016/2009 c/c Art. 151, IV do CTN',
    dicaOAB: 'Requer sempre dois desdobramentos práticos no pedido: a suspensão da exigibilidade do crédito (Art. 151, IV) e a expedição de CPD-EN (Art. 206 CTN).',
    linkAba: 'pecas',
    abaLabel: 'Ver Tópico de Liminar'
  },
  'liminar': {
    titulo: 'Medida Liminar no Processo Tributário',
    conceito: 'Ordem judicial cautelar de eficácia imediata visando resguardar a utilidade do provimento final e paralisar atos executórios do Fisco.',
    fundamentoLegal: 'Art. 7º, III da Lei nº 12.016/2009 c/c Art. 151, IV do CTN',
    dicaOAB: 'Indispensável articular fumus boni iuris + periculum in mora + suspensão do crédito.',
    linkAba: 'pecas',
    abaLabel: 'Ver Tópico de Liminar'
  },
  'efeito suspensivo': {
    titulo: 'Efeito Suspensivo aos Embargos / Recurso',
    conceito: 'Atribuição de eficácia obstativa ao prosseguimento dos atos executivos expropriatórios (em embargos) ou à eficácia da decisão recorrida (em agravo/apelação).',
    fundamentoLegal: 'Art. 919, §1º do CPC (Embargos) ou Art. 1.012, §4º e Art. 1.019, I do CPC (Recursos)',
    dicaOAB: 'Nos Embargos à Execução Fiscal, a concessão de efeito suspensivo não é automática: exige garantia prévia do juízo, relevância dos fundamentos e perigo de dano manifesto.',
    linkAba: 'pecas',
    abaLabel: 'Ver Efeito Suspensivo'
  },
  'tempestividade': {
    titulo: 'Requisito de Tempestividade Processual',
    conceito: 'Demonstração de que a manifestação processual, inicial ou recursal, foi protocolada dentro do lapso temporal estipulado expressamente pela legislação processual.',
    fundamentoLegal: 'Arts. 218 e 1.003, §5º do CPC; Art. 23 da Lei 12.016/09; Art. 16 da LEF',
    dicaOAB: 'Prazos chave FGV: Mandado de Segurança (120 dias da ciência do ato coator); Embargos à Execução (30 dias da garantia); Apelação e Agravo (15 dias úteis); Embargos de Declaração (5 dias úteis).',
    linkAba: 'pecas',
    abaLabel: 'Ver Prazos FGV'
  },
  'anterioridade': {
    titulo: 'Princípio da Anterioridade Tributária',
    conceito: 'Garantia constitucional que proíbe o Fisco de cobrar tributo criado ou majorado antes do decurso do exercício financeiro seguinte (Anterioridade Anual) e de 90 dias da publicação da lei (Noventena).',
    fundamentoLegal: 'Art. 150, III, alíneas b e c da CF/88',
    dicaOAB: 'Regra de ouro: os princípios da anterioridade anual e nonagesimal são cumulativos, ressalvadas as exceções taxativas do Art. 150, §1º (ex: II, IE, IOF não respeitam nenhuma; IR não respeita noventena; IPI não respeita anual).',
    linkAba: 'material',
    abaLabel: 'Ver Princípios Tributários'
  },
  'irretroatividade': {
    titulo: 'Princípio da Irretroatividade Tributária',
    conceito: 'Veda a cobrança de tributos em relação a fatos geradores ocorridos antes do início da vigência da lei que os houver instituído ou aumentado.',
    fundamentoLegal: 'Art. 150, III, a da CF/88 c/c Art. 105 do CTN',
    dicaOAB: 'A lei tributária aplica-se a fatos geradores futuros e pendentes. Exceção no Art. 106 do CTN (retroatividade benigna para penalidades e infrações não definitivamente julgadas).',
    linkAba: 'material',
    abaLabel: 'Ver Princípios Tributários'
  },
  'imunidade': {
    titulo: 'Imunidades Tributárias Constitucionais',
    conceito: 'Hipóteses de incompetência tributária absoluta definidas diretamente no texto da Constituição Federal, impedindo o nascimento da obrigação tributária para determinados entes, bens ou atividades.',
    fundamentoLegal: 'Art. 150, VI da CF/88 (alíneas a, b, c, d e e)',
    dicaOAB: 'Alcança apenas IMPOSTOS (não taxas ou contribuições). Exige observância dos requisitos do Art. 14 do CTN para instituições sem fins lucrativos. Não se confunde com isenção (que decorre de lei infraconstitucional).',
    linkAba: 'material',
    abaLabel: 'Ver Mapa de Imunidades'
  },
  'prescricao': {
    titulo: 'Prescrição Tributária (Extinção do Crédito)',
    conceito: 'Causa de extinção do crédito tributário (Art. 156, V do CTN) resultante da inércia do Fisco em ajuizar a cobrança executiva no prazo de 5 anos contados da constituição definitiva.',
    fundamentoLegal: 'Art. 174 do CTN c/c Art. 156, V do CTN e LC 236/2026',
    dicaOAB: 'Interrompe-se pelo despacho citatório (Art. 174, parágrafo único, I). Prescrição intercorrente na execução fiscal flui após 1 ano de suspensão (Art. 40 LEF e Súmula 314 STJ).',
    linkAba: 'vade',
    abaLabel: 'Ver Artigo 174'
  },
  'decadencia': {
    titulo: 'Decadência Tributária',
    conceito: 'Extinção do direito potestativo de a Fazenda Pública lançar e constituir formalmente o crédito tributário, ocorrida no prazo de 5 anos.',
    fundamentoLegal: 'Art. 173 do CTN c/c Art. 150, §4º do CTN e Art. 156, V do CTN',
    dicaOAB: 'Diferença FGV: Decadência = perda do direito de constituir/lançar o crédito; Prescrição = perda do direito de cobrar em juízo crédito já lançado.',
    linkAba: 'vade',
    abaLabel: 'Ver Decadência no CTN'
  },
  'garantia do juizo': {
    titulo: 'Garantia do Juízo na Execução Fiscal',
    conceito: 'Requisito legal indispensável para a oposição de Embargos à Execução Fiscal, consistente na segurança integral do débito por penhora, depósito, fiança ou seguro.',
    fundamentoLegal: 'Art. 16, §1º da Lei nº 6.830/1980 (LEF)',
    dicaOAB: 'Se o executado não tiver como garantir o juízo integralmente mas tiver prova pré-constituída de nulidade de ordem pública, a peça cabível é a Exceção de Pré-Executividade (Súmula 393 STJ).',
    linkAba: 'pecas',
    abaLabel: 'Ver Regras da LEF'
  },
  'deposito integral': {
    titulo: 'Depósito do Montante Integral (Art. 151, II CTN)',
    conceito: 'Direito subjetivo do contribuinte de depositar em dinheiro a totalidade do crédito discutido para suspender de imediato a exigibilidade e impedir a fluência de juros moratórios.',
    fundamentoLegal: 'Art. 151, II do CTN c/c Súmula 112 do STJ',
    dicaOAB: 'Deve ser integral e em dinheiro. Impede a inscrição em dívida ativa e viabiliza a CPD-EN (Art. 206 CTN).',
    linkAba: 'vade',
    abaLabel: 'Ver Artigo 151, II'
  },
  'cnd': {
    titulo: 'Certidão Negativa de Débito (CND)',
    conceito: 'Documento expedido pela autoridade fazendária comprovando a ausência de quaisquer créditos tributários pendentes em nome do sujeito passivo.',
    fundamentoLegal: 'Art. 205 do CTN',
    dicaOAB: 'Se houver débitos, mas com exigibilidade suspensa ou garantia penhorada, a certidão expedida é a CPD-EN (Art. 206 CTN), com idênticos efeitos.',
    linkAba: 'vade',
    abaLabel: 'Ver Art. 205 e 206'
  },
  'cpen': {
    titulo: 'Certidão Positiva com Efeitos de Negativa (CPD-EN)',
    conceito: 'Certidão que atesta a existência de débitos cuja cobrança está suspensa (Art. 151 CTN) ou garantida por penhora regular.',
    fundamentoLegal: 'Art. 206 do CTN',
    dicaOAB: 'Pedido obrigatório da FGV em sede liminar ou de tutela antecipada.',
    linkAba: 'vade',
    abaLabel: 'Ver Artigo 206'
  }
};

/**
 * Função inteligente de consulta que encontra a melhor definição jurídica
 * a partir do texto destacado e de sua categoria sintática.
 */
export function lookupLegalTerm(
  rawText: string,
  category: SyntaxCategory
): LegalTooltipInfo {
  const clean = rawText.trim();
  const lower = clean.toLowerCase();
  const normalized = lower
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[ºª°\.\-\/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // 1. Busca direta ou parcial no dicionário de conceitos
  for (const [key, val] of Object.entries(GLOSSARIO_CONCEITOS)) {
    if (normalized === key || normalized.includes(key) || key.includes(normalized)) {
      return {
        termo: clean,
        categoria: category,
        categoriaLabel: getCategoryLabel(category),
        badgeCor: getCategoryBadgeClass(category),
        titulo: val.titulo,
        conceito: val.conceito,
        fundamentoLegal: val.fundamentoLegal,
        dicaOAB: val.dicaOAB,
        exemploPratico: val.exemploPratico,
        linkAba: val.linkAba,
        abaLabel: val.abaLabel
      };
    }
  }

  // 2. Busca no catálogo de peças
  if (category === 'peca') {
    const pecaEncontrada = CATALOGO_PECAS.find(p =>
      normalized.includes(p.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')) ||
      p.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(normalized)
    );
    if (pecaEncontrada) {
      return {
        termo: clean,
        categoria: 'peca',
        categoriaLabel: 'Peça Prática FGV',
        badgeCor: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
        titulo: pecaEncontrada.nome,
        conceito: `Peça processual de natureza ${pecaEncontrada.tipo.toLowerCase()} cobrada com frequência em exames da OAB: ${pecaEncontrada.examesCobrados}.`,
        fundamentoLegal: pecaEncontrada.baseLegal,
        dicaOAB: `Possui ${pecaEncontrada.quesitosFGV.length} quesitos específicos pontuados no espelho oficial da FGV.`,
        linkAba: 'pecas',
        abaLabel: `Abrir Modelo de ${pecaEncontrada.nome}`
      };
    }
  }

  // 3. Busca em Impostos e Reforma
  if (category === 'tributo') {
    const impEncontrado = IMPOSTOS_DATA.find(i =>
      normalized.includes(i.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(' ')[0]) ||
      i.nome.toLowerCase().includes(normalized)
    );
    if (impEncontrado) {
      return {
        termo: clean,
        categoria: 'tributo',
        categoriaLabel: `Tributo (${impEncontrado.ente})`,
        badgeCor: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
        titulo: impEncontrado.nome,
        conceito: impEncontrado.desc,
        fundamentoLegal: impEncontrado.base,
        dicaOAB: `Tributo de competência ${impEncontrado.ente}. Fique atento às exceções aos princípios da anterioridade e legalidade no espelho FGV.`,
        linkAba: 'material',
        abaLabel: 'Ver Impostos no Material de Apoio'
      };
    }
  }

  // 4. Busca em Súmulas
  if (category === 'artigo' && (lower.includes('sumula') || lower.includes('sv'))) {
    const numMatch = clean.match(/\d+/);
    if (numMatch) {
      const numStr = numMatch[0];
      const sumulaItem = SUMULAS_DATA.find(s => s.num === numStr);
      if (sumulaItem) {
        return {
          termo: clean,
          categoria: 'artigo',
          categoriaLabel: `Súmula ${sumulaItem.tr} nº ${sumulaItem.num}`,
          badgeCor: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
          titulo: `Súmula ${sumulaItem.tr} nº ${sumulaItem.num}`,
          conceito: sumulaItem.texto,
          fundamentoLegal: `Jurisprudência Pacífica do ${sumulaItem.tr}`,
          dicaOAB: sumulaItem.tema ? `Tema central: ${sumulaItem.tema}. A menção ao número exato da súmula pontua no espelho da prova.` : 'A citação expressa da súmula no mérito garante pontuação no espelho FGV.',
          linkAba: 'sumulas',
          abaLabel: 'Ver Súmula na Aba de Súmulas'
        };
      }
    }
  }

  // 5. Fallback estruturado com base na categoria
  return generateFallbackTooltip(clean, category);
}

function generateFallbackTooltip(termo: string, category: SyntaxCategory): LegalTooltipInfo {
  switch (category) {
    case 'peca':
      return {
        termo,
        categoria: 'peca',
        categoriaLabel: 'Peça Prática FGV',
        badgeCor: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
        titulo: `Peça Prática: ${termo}`,
        conceito: 'Instrumento processual técnico exigido na 2ª Fase OAB para defesa dos interesses tributários do contribuinte ou da Fazenda Pública.',
        fundamentoLegal: 'Código de Processo Civil e Legislação Tributária Especial',
        dicaOAB: 'Indique expressamente a competência correta no endereçamento, a qualificação completa das partes e os pedidos de mérito.',
        linkAba: 'pecas',
        abaLabel: 'Consultar Peças Práticas'
      };
    case 'artigo':
      return {
        termo,
        categoria: 'artigo',
        categoriaLabel: 'Dispositivo Legal / Artigo',
        badgeCor: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
        titulo: `Dispositivo Legal: ${termo}`,
        conceito: 'Fundamentação normativa indispensável para atribuir validade jurídica à tese e garantir a pontuação nos quesitos do espelho oficial FGV.',
        fundamentoLegal: termo,
        dicaOAB: 'A banca FGV pontua separadamente a tese jurídica e a indicação do artigo ou súmula correspondente.',
        linkAba: 'vade',
        abaLabel: 'Abrir no Vade Mecum'
      };
    case 'tributo':
      return {
        termo,
        categoria: 'tributo',
        categoriaLabel: 'Espécie Tributária',
        badgeCor: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
        titulo: `Tributo: ${termo}`,
        conceito: 'Exação fiscal de prestação pecuniária compulsória (Art. 3º do CTN) sujeita ao regime constitucional de competências e limitações.',
        fundamentoLegal: 'Sistema Tributário Nacional (Arts. 145 a 162 da CF/88)',
        dicaOAB: 'Identifique o Ente Federativo competente e analise a ocorrência do fato gerador, base de cálculo e alíquota aplicável.',
        linkAba: 'material',
        abaLabel: 'Ver no Direito Material'
      };
    case 'tese':
      return {
        termo,
        categoria: 'tese',
        categoriaLabel: 'Requisito / Tese FGV',
        badgeCor: 'border-purple-500/40 bg-purple-500/10 text-purple-300',
        titulo: `Tese / Requisito FGV: ${termo}`,
        conceito: 'Conceito, pressuposto ou preliminar fundamental para a estruturação lógica da argumentação jurídica e obtenção de nota máxima.',
        fundamentoLegal: 'Constituição Federal, Código Tributário Nacional e Código de Processo Civil',
        dicaOAB: 'Desenvolva a fundamentação em parágrafo próprio: premissa maior (lei/súmula), premissa menor (fato do caso) e conclusão.',
        linkAba: 'flashcards',
        abaLabel: 'Revisar nos Flashcards'
      };
  }
}

function getCategoryLabel(category: SyntaxCategory): string {
  switch (category) {
    case 'peca': return 'Peça Prática FGV';
    case 'artigo': return 'Artigo & Súmula';
    case 'tributo': return 'Tributo & Reforma';
    case 'tese': return 'Requisito / Tese FGV';
  }
}

function getCategoryBadgeClass(category: SyntaxCategory): string {
  switch (category) {
    case 'peca': return 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300';
    case 'artigo': return 'border-amber-500/40 bg-amber-500/10 text-amber-300';
    case 'tributo': return 'border-sky-500/40 bg-sky-500/10 text-sky-300';
    case 'tese': return 'border-purple-500/40 bg-purple-500/10 text-purple-300';
  }
}
