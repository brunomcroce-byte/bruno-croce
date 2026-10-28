/**
 * 32 Provas Oficiais FGV - 2ª Fase OAB Direito Tributário
 * Dados completos com enunciado oficial, esqueleto de memorização (teses e fundamentos)
 * e espelho de correção pontuado oficial da banca FGV (0,00 a 5,00 pontos).
 */

export interface CriterioCorrecaoFGV {
  id: string;
  item: string;
  pontos: number;
  descricao: string;
  palavrasChave: string[];
}

export interface SimuladoFGV {
  id: number;
  exame: string;
  ano: string;
  peca: string;
  titulo: string;
  enunciado: string;
  esqueleto: string;
  tesesPrincipais: string[];
  fundamentosNormativos: string[];
  espelhoCorrecao: CriterioCorrecaoFGV[];
  dicaBanca: string;
}

export const SIMULADOS_FGV_32: SimuladoFGV[] = [
  {
    id: 1,
    exame: "Exame XLI (41º Exame Unificado)",
    ano: "2024.2",
    peca: "Mandado de Segurança Repressivo",
    titulo: "MS Repressivo: Não Incidência de ICMS sobre TUST e TUSD",
    enunciado: "A sociedade empresária Metalúrgica Aço Forte Ltda. foi autuada pelo Estado de Minas Gerais pela falta de recolhimento de ICMS incidente sobre as tarifas de uso do sistema de transmissão e de distribuição de energia elétrica (TUST e TUSD). O auto de infração foi lavrado há 15 dias e a empresa dispõe de prova documental cabal de que a cobrança incidiu sobre custos de transporte da energia e não sobre a mercadoria propriamente consumida. Na qualidade de advogado(a), elabore a peça cabível contra o ato do Delegado da Receita Estadual para afastar o lançamento com pedido liminar.",
    esqueleto: `AO JUÍZO DA ... VARA DA FAZENDA PÚBLICA DA COMARCA DE ... DO ESTADO DE MINAS GERAIS

IMPETRANTE: METALÚRGICA AÇO FORTE LTDA., pessoa jurídica de direito privado, inscrita no CNPJ sob o nº ..., com sede em ..., neste ato representada na forma de seus atos constitutivos, por seu advogado infra-assinado (procuração anexa), com escritório profissional em ..., onde recebe intimações.
IMPETRADO: ATO COATOR DO ILUSTRÍSSIMO SENHOR DELEGADO REGIONAL DA RECEITA ESTADUAL DE MINAS GERAIS, autoridade vinculada ao ESTADO DE MINAS GERAIS, pessoa jurídica de direito público interno.
FUNDAMENTO LEGAL: Art. 5º, LXIX, da Constituição da República de 1988 e Lei nº 12.016/2009.

Ação: MANDADO DE SEGURANÇA COM PEDIDO DE MEDIDA LIMINAR

I. DO CABIMENTO E DA TEMPESTIVIDADE
- Demonstração do cabimento: violação a direito líquido e certo não amparado por habeas corpus ou habeas data, mediante prova pré-constituída (Art. 5º, LXIX, CRFB/88 e Art. 1º da Lei nº 12.016/2009).
- Tempestividade: ação proposta dentro do prazo decadencial de 120 (cento e vinte) dias a contar da notificação do auto de infração (Art. 23 da Lei nº 12.016/2009).

II. DOS FATOS
[ESTRUTURA FÁTICA: O candidato deve resumir sucintamente os fatos descritos pela FGV, apontando o auto de infração de ICMS sobre TUST/TUSD].

III. DO DIREITO / DAS TESES E FUNDAMENTOS
1. Da não incidência de ICMS sobre Tarifas de Fio (TUST e TUSD)
- Fundamento: Art. 155, II, da CRFB/88; LC nº 194/2022 (inclusão do Art. 3º, X, da LC 87/96) e jurisprudência pacificada (Tema 986/STJ).
- [DESENVOLVIMENTO DO CANDIDATO: Desenvolva a tese demonstrando que a base de cálculo do ICMS é a energia elétrica efetivamente consumida, e não as tarifas de conexão ao sistema elétrico].

2. Da violação à Legalidade Tributária e Tipicidade Fechada
- Fundamento: Art. 150, I, da CRFB/88 e Art. 97 do CTN.
- [DESENVOLVIMENTO DO CANDIDATO: Explique a impossibilidade de criar ou alargar a base de cálculo sem suporte na Lei Complementar nacional].

IV. DA MEDIDA LIMINAR
- Fumus boni iuris: Demonstração da plausibilidade jurídica com base em Lei Complementar e precedente vinculante.
- Periculum in mora: Risco iminente de inscrição em dívida ativa, protesto e constrição patrimonial indevida.
- Fundamento: Art. 7º, III, da Lei nº 12.016/2009 e Art. 151, IV, do CTN (suspensão da exigibilidade).
- [DESENVOLVIMENTO DO CANDIDATO: Fundamente a urgência e o risco à continuidade da atividade fabril].

V. DOS PEDIDOS E REQUERIMENTOS
a) Concessão da MEDIDA LIMINAR inaudita altera parte para suspender a exigibilidade do crédito tributário (Art. 151, IV, do CTN);
b) Notificação da Autoridade Coatora para que preste as informações de estilo no prazo legal de 10 dias (Art. 7º, I, da Lei 12.016/2009);
c) Ciência do feito ao órgão de representação judicial da pessoa jurídica interessada (Estado de Minas Gerais - Art. 7º, II, Lei 12.016/2009);
d) Intimação do digno Representante do Ministério Público (Art. 12 da Lei 12.016/2009);
e) Confirmação da liminar e CONCESSÃO DEFINITIVA DA SEGURANÇA para anular o auto de infração fiscal;
f) Juntada das guias de custas recolhidas;
g) Indicação da não condenação em honorários advocatícios (Art. 25 da Lei 12.016/2009; Súmulas 512/STF e 105/STJ).

Dá-se à causa o valor de R$ ... (valor integral do auto de infração).

Nestes termos,
Pede deferimento.

Local ..., Data ...
Advogado ... / OAB ...`,
    tesesPrincipais: [
      "Não incidência de ICMS sobre TUST/TUSD (Art. 3º, X da LC 87/96 e Tema 986/STJ)",
      "Base de cálculo adstrita à energia efetivamente consumida (Art. 155, II da CF)",
      "Legalidade tributária e tipicidade cerrada (Art. 150, I da CF e Art. 97 do CTN)"
    ],
    fundamentosNormativos: [
      "Art. 5º, LXIX, CF/88",
      "Lei nº 12.016/2009",
      "Art. 155, II, CF/88",
      "Art. 3º, X, LC 87/96",
      "Tema 986 STJ",
      "Art. 151, IV, CTN"
    ],
    espelhoCorrecao: [
      { id: "c1", item: "Endereçamento", pontos: 0.10, descricao: "Vara da Fazenda Pública da Comarca de MG", palavrasChave: ["vara", "fazenda pública", "minas gerais"] },
      { id: "c2", item: "Partes e Autoridade Coatora", pontos: 0.20, descricao: "Impetrante qualificada e Delegado da Receita Estadual com pessoa jurídica", palavrasChave: ["impetrante", "autoridade coatora", "delegado", "estado de minas gerais"] },
      { id: "c3", item: "Cabimento e Tempestividade", pontos: 0.30, descricao: "Art. 5º LXIX da CF, Lei 12.016/09 e prazo de 120 dias do art. 23", palavrasChave: ["direito líquido e certo", "120 dias", "art. 23", "lei 12.016"] },
      { id: "c4", item: "Tese de Mérito (TUST/TUSD)", pontos: 1.50, descricao: "Não incidência sobre tarifas de uso do sistema elétrico conforme LC 87/96 e Tema 986 STJ", palavrasChave: ["tust", "tusd", "lc 87/96", "tema 986", "energia consumida"] },
      { id: "c5", item: "Legalidade e Tipicidade", pontos: 0.50, descricao: "Princípio da estrita legalidade tributária (Art. 150, I da CF e Art. 97 do CTN)", palavrasChave: ["art. 150, i", "art. 97", "legalidade", "base de cálculo"] },
      { id: "c6", item: "Medida Liminar", pontos: 0.80, descricao: "Fumus boni iuris e periculum in mora c/ suspensão do crédito (Art. 151, IV do CTN)", palavrasChave: ["liminar", "fumus boni iuris", "periculum in mora", "art. 151, iv"] },
      { id: "c7", item: "Pedidos Completos", pontos: 1.20, descricao: "Concessão da liminar, notificação, oitiva do MP, concessão da segurança e isenção de sucumbência", palavrasChave: ["concessão da segurança", "notificação", "ministério público", "sem honorários", "art. 25"] },
      { id: "c8", item: "Fechamento e Valor da Causa", pontos: 0.40, descricao: "Indicação de valor da causa e fechamento sem identificação pessoal", palavrasChave: ["valor da causa", "nestes termos", "advogado", "oab"] }
    ],
    dicaBanca: "No Mandado de Segurança nunca peça condenação em honorários de sucumbência (Súmula 512 do STF e Art. 25 da Lei 12.016/09). Apenas custas."
  },
  {
    id: 2,
    exame: "Exame XL (40º Exame Unificado)",
    ano: "2024.1",
    peca: "Ação Anulatória com Tutela de Urgência",
    titulo: "Anulatória: Não Incidência de ISS sobre Locação de Bens Móveis",
    enunciado: "A empresa LocaFácil Equipamentos Ltda. foi autuada pelo Município de Salvador/BA para pagamento de ISS sobre receitas advindas de locação de tratores e retroescavadeiras sem fornecimento de operador. A empresa não possui prova pré-constituída sobre todos os contratos e necessitará de produção de prova pericial contábil. Foi lavrado auto de infração definitivo. Elabore a petição inicial da ação cabível para anular o lançamento, com pedido de tutela provisória de urgência.",
    esqueleto: `AO JUÍZO DA ... VARA DA FAZENDA PÚBLICA DA COMARCA DE SALVADOR/BA

AUTORA: LOCAFÁCIL EQUIPAMENTOS LTDA., pessoa jurídica de direito privado, inscrita no CNPJ sob o nº ..., com sede em Salvador/BA, por seu advogado infra-assinado (procuração anexa), com escritório profissional em ...
RÉU: MUNICÍPIO DE SALVADOR, pessoa jurídica de direito público interno, representado por seu Procurador-Geral.
FUNDAMENTO LEGAL: Art. 38 da Lei nº 6.830/1980 e Arts. 300 e 319 do Código de Processo Civil.

Ação: AÇÃO ANULATÓRIA DE DÉBITO FISCAL COM PEDIDO DE TUTELA PROVISÓRIA DE URGÊNCIA

I. DO CABIMENTO E DO PROCEDIMENTO COMUM
- Demonstração do cabimento: Ação ordinária anulatória para desconstituir crédito tributário formalizado por auto de infração, com ampla dilação probatória e produção de prova pericial (Art. 38 da Lei 6.830/80 e CPC).

II. DOS FATOS
[ESTRUTURA FÁTICA: O candidato deve relatar sucintamente a autuação municipal de ISS sobre contratos de locação de bens móveis puros].

III. DO DIREITO / DAS TESES E FUNDAMENTOS
1. Da Inconstitucionalidade da Incidência de ISS sobre Locação de Bens Móveis
- Fundamento: Art. 156, III, da CRFB/88; Súmula Vinculante 31 do STF e LC nº 116/2003.
- [DESENVOLVIMENTO DO CANDIDATO: Explique que locação é obrigação de dar e não de fazer, conforme entendimento firmado pelo STF na Súmula Vinculante 31].

2. Da Ausência de Fato Gerador de ISS
- Fundamento: Art. 110 do CTN (a lei tributária não pode alterar a definição, o conteúdo e o alcance de institutos de direito privado).
- [DESENVOLVIMENTO DO CANDIDATO: Articule a distinção entre prestação de serviços (fazer) e cessão de uso onerosa (dar)].

IV. DA TUTELA PROVISÓRIA DE URGÊNCIA ANTECIPADA
- Probabilidade do direito: Existência de Súmula Vinculante 31 do Supremo Tribunal Federal.
- Perigo de dano: Risco de inscrição em Dívida Ativa e ajuizamento de Execução Fiscal.
- Fundamento: Art. 300 do CPC e Art. 151, V, do CTN (suspensão da exigibilidade).
- [DESENVOLVIMENTO DO CANDIDATO: Justifique o deferimento liminar da tutela de urgência sem exigência de depósito prévio].

V. DOS PEDIDOS E REQUERIMENTOS
a) Concessão da TUTELA PROVISÓRIA DE URGÊNCIA inaudita altera parte para suspender a exigibilidade do crédito tributário (Art. 151, V, do CTN);
b) Citação do Município de Salvador na pessoa de seu representante judicial;
c) Procedência integral dos pedidos para ANULAR o auto de infração e desconstituir o crédito tributário;
d) Condenação do Réu no reembolso das custas e no pagamento de honorários advocatícios sucumbenciais (Art. 85, § 3º, do CPC);
e) Protesto pela produção de todas as provas admitidas em direito, em especial documental e pericial contábil;
f) Manifestação sobre a opção pela realização de audiência de conciliação ou mediação (Art. 319, VII, do CPC).

Dá-se à causa o valor de R$ ...

Nestes termos,
Pede deferimento.

Local ..., Data ...
Advogado ... / OAB ...`,
    tesesPrincipais: [
      "Inconstitucionalidade do ISS sobre locação de bens móveis (Súmula Vinculante 31 do STF)",
      "Diferença entre obrigação de dar e obrigação de fazer (Art. 156, III da CF)",
      "Respeito aos conceitos de direito privado pelo Direito Tributário (Art. 110 do CTN)"
    ],
    fundamentosNormativos: [
      "Art. 156, III, CF/88",
      "Súmula Vinculante 31 STF",
      "Art. 110 CTN",
      "Art. 38 Lei 6.830/80",
      "Art. 300 CPC",
      "Art. 151, V, CTN"
    ],
    espelhoCorrecao: [
      { id: "c1", item: "Endereçamento", pontos: 0.10, descricao: "Vara da Fazenda Pública da Comarca de Salvador/BA", palavrasChave: ["vara", "fazenda pública", "salvador"] },
      { id: "c2", item: "Qualificação e Fundamento", pontos: 0.20, descricao: "Autor e Réu qualificados com citação do Art. 38 da LEF e CPC", palavrasChave: ["locafácil", "município de salvador", "art. 38", "lei 6.830"] },
      { id: "c3", item: "Cabimento Anulatória", pontos: 0.30, descricao: "Necessidade de dilação probatória / perícia contábil", palavrasChave: ["anulatória", "dilação probatória", "perícia"] },
      { id: "c4", item: "Tese Central (Súmula Vinculante 31)", pontos: 1.50, descricao: "Inconstitucionalidade do ISS sobre locação de bens móveis puros (obrigação de dar)", palavrasChave: ["súmula vinculante 31", "locação de bens móveis", "obrigação de dar", "obrigação de fazer"] },
      { id: "c5", item: "Artigo 110 do CTN", pontos: 0.50, descricao: "Impossibilidade de alteração do conceito de locação pelo direito tributário", palavrasChave: ["art. 110", "direito privado", "conceito"] },
      { id: "c6", item: "Tutela de Urgência", pontos: 0.80, descricao: "Requisitos do Art. 300 do CPC e suspensão da exigibilidade pelo Art. 151, V do CTN", palavrasChave: ["tutela provisória", "probabilidade do direito", "art. 300", "art. 151, v"] },
      { id: "c7", item: "Pedidos e Sucumbência", pontos: 1.20, descricao: "Anulação do débito, citação, condenação em honorários (Art. 85 CPC), provas e audiência do Art. 319, VII", palavrasChave: ["anulação", "honorários", "art. 85", "provas", "art. 319"] },
      { id: "c8", item: "Fechamento e Valor da Causa", pontos: 0.40, descricao: "Valor da causa equivalente ao débito e fechamento padrão", palavrasChave: ["valor da causa", "nestes termos", "advogado", "oab"] }
    ],
    dicaBanca: "Na Ação Anulatória o candidato DEVE pedir honorários de sucumbência (Art. 85, §3º do CPC) e indicar a opção sobre a audiência de conciliação (Art. 319, VII do CPC)."
  },
  {
    id: 3,
    exame: "Exame XXXIX (39º Exame Unificado)",
    ano: "2023.3",
    peca: "Embargos à Execução Fiscal",
    titulo: "Embargos à Execução: Prescrição Intercorrente e Excesso da Taxa Selic",
    enunciado: "A sociedade Beta Engenharia S.A. teve bens imóveis penhorados na Execução Fiscal movida pelo Estado de São Paulo. A penhora foi formalizada e a intimação ocorreu há 20 dias. A execução fiscal ficou paralisada em cartório por 6 anos ininterruptos sem qualquer diligência exequenda após a primeira suspensão. Além disso, a CDA cobra juros moratórios estaduais superiores à Taxa Selic. Elabore a peça de defesa cabível com demonstração da tempestividade e garantia do juízo.",
    esqueleto: `AO JUÍZO DA ... VARA DAS EXECUÇÕES FISCAIS ESTADUAIS DA COMARCA DE SÃO PAULO/SP
(Distribuído por dependência aos autos da Execução Fiscal nº ...)

EMBARGANTE: BETA ENGENHARIA S.A., pessoa jurídica de direito privado, inscrita no CNPJ sob o nº ..., com sede em ..., por seu advogado infra-assinado (procuração anexa).
EMBARGADO: ESTADO DE SÃO PAULO, pessoa jurídica de direito público interno.
FUNDAMENTO LEGAL: Art. 16 da Lei nº 6.830/1980 e Art. 914 e seguintes do Código de Processo Civil.

Ação: EMBARGOS À EXECUÇÃO FISCAL COM PEDIDO DE EFEITO SUSPENSIVO

I. DA TEMPESTIVIDADE E DA GARANTIA DO JUÍZO
- Tempestividade: Prazo de 30 (trinta) dias a contar da intimação da penhora (Art. 16, III, da Lei nº 6.830/1980).
- Garantia do Juízo: Penhora de bem imóvel formalizada nos autos principais, atendendo ao requisito do Art. 16, § 1º, da LEF.

II. DOS FATOS
[ESTRUTURA FÁTICA: O candidato deve resumir a execução, a paralisação do processo por 6 anos e a cobrança de juros estaduais acima da Selic].

III. DO DIREITO / DAS TESES E FUNDAMENTOS
1. Da Prescrição Intercorrente
- Fundamento: Art. 40 da Lei nº 6.830/80; Art. 174 do CTN e Súmula 314 do STJ (Tema 566/STJ).
- [DESENVOLVIMENTO DO CANDIDATO: Explique o transcurso do prazo de 1 ano de suspensão somado aos 5 anos de arquivamento sem manifestação útil da Fazenda Pública].

2. Do Excesso de Execução: Limitação dos Juros de Mora à Taxa SELIC
- Fundamento: Art. 24, I, da CRFB/88 e tese fixada pelo STF no Tema 1.062 (Súmula 523/STF e ADI 442).
- [DESENVOLVIMENTO DO CANDIDATO: Desenvolva que os Estados não podem fixar índices de juros e correção monetária superiores aos utilizados pela União para os tributos federais].

IV. DO EFEITO SUSPENSIVO AOS EMBARGOS
- Garantia integral do juízo já efetuada.
- Relevância dos fundamentos e perigo de dano irreparável com a continuidade dos atos expropriatórios.
- Fundamento: Art. 919, § 1º, do CPC c/c Art. 1º da LEF.
- [DESENVOLVIMENTO DO CANDIDATO: Justifique a suspensão dos atos de hasta pública até decisão de mérito].

V. DOS PEDIDOS E REQUERIMENTOS
a) Recebimento dos presentes embargos no EFEITO SUSPENSIVO;
b) Intimação do Estado de São Paulo para impugnar os embargos no prazo de 30 dias (Art. 17 da LEF);
c) Acolhimento da preliminar de mérito de PRESCRIÇÃO INTERCORRENTE, com a extinção da execução fiscal (Art. 487, II, do CPC);
d) Subsidiariamente, o reconhecimento do excesso de execução pela aplicação indevida de juros superiores à Selic;
e) Condenação do Embargado em custas processuais e honorários advocatícios sucumbenciais (Art. 85 do CPC);
f) Protesto pela produção de todas as provas em direito permitidas.

Dá-se à causa o valor de R$ ...

Nestes termos,
Pede deferimento.

Local ..., Data ...
Advogado ... / OAB ...`,
    tesesPrincipais: [
      "Prescrição intercorrente da execução fiscal (Art. 40 da LEF, Art. 174 do CTN e Tema 566/STJ)",
      "Impossibilidade de juros estaduais superiores à Taxa SELIC (Tema 1.062 do STF)",
      "Cabimento pela garantia do juízo e prazo de 30 dias (Art. 16 da Lei 6.830/80)"
    ],
    fundamentosNormativos: [
      "Art. 16, III, Lei 6.830/80",
      "Art. 40 Lei 6.830/80",
      "Art. 174 CTN",
      "Tema 566 STJ",
      "Tema 1.062 STF",
      "Art. 919, § 1º CPC"
    ],
    espelhoCorrecao: [
      { id: "c1", item: "Endereçamento", pontos: 0.10, descricao: "Vara de Execuções Fiscais por dependência aos autos da execução", palavrasChave: ["execuções fiscais", "distribuição por dependência"] },
      { id: "c2", item: "Garantia e Tempestividade", pontos: 0.40, descricao: "Demonstração do prazo de 30 dias e penhora válida do Art. 16 da LEF", palavrasChave: ["30 dias", "art. 16", "penhora", "garantia do juízo"] },
      { id: "c3", item: "Prescrição Intercorrente", pontos: 1.50, descricao: "Art. 40 da LEF, 1 ano + 5 anos de inércia da Fazenda e Tema 566/STJ", palavrasChave: ["prescrição intercorrente", "art. 40", "tema 566", "1 ano", "5 anos"] },
      { id: "c4", item: "Excesso de Execução (Taxa Selic)", pontos: 1.00, descricao: "Juros estaduais não podem superar a Selic (Tema 1.062 do STF e Art. 24 da CF)", palavrasChave: ["selic", "tema 1.062", "juros", "art. 24"] },
      { id: "c5", item: "Efeito Suspensivo", pontos: 0.60, descricao: "Garantia do juízo, fumus boni iuris e Art. 919, § 1º do CPC", palavrasChave: ["efeito suspensivo", "art. 919", "garantia"] },
      { id: "c6", item: "Pedidos e Sucumbência", pontos: 1.00, descricao: "Intimação do embargado (Art. 17 LEF), extinção da execução fiscal e honorários advocatícios", palavrasChave: ["extinção da execução", "art. 17", "honorários", "art. 85"] },
      { id: "c7", item: "Fechamento", pontos: 0.40, descricao: "Valor da causa e encerramento nos moldes FGV", palavrasChave: ["valor da causa", "nestes termos", "advogado", "oab"] }
    ],
    dicaBanca: "Em Embargos à Execução Fiscal lembre-se de apontar a distribuição por dependência e que o prazo para o Fisco impugnar é de 30 dias (Art. 17 da LEF)."
  },
  {
    id: 4,
    exame: "Exame XXXVIII (38º Exame Unificado)",
    ano: "2023.2",
    peca: "Ação de Repetição de Indébito",
    titulo: "Repetição de Indébito: Cobrança de ITBI antes do Registro Imobiliário",
    enunciado: "Carlos celebrou contrato de promessa de compra e venda de imóvel residencial e foi obrigado pelo Município a pagar ITBI como condição para lavratura da escritura pública no Cartório de Notas. O recolhimento ocorreu há 2 anos. Carlos suportou todo o encargo financeiro e agora pretende a restituição integral do valor pago indevidamente, com incidência exclusiva da Taxa Selic. Redija a ação cabível pelo rito comum com os fundamentos aplicáveis do STF e STJ.",
    esqueleto: `AO JUÍZO DA ... VARA DA FAZENDA PÚBLICA DA COMARCA DE ...

AUTOR: CARLOS ..., [qualificação completa], por seu advogado infra-assinado (procuração anexa).
RÉU: MUNICÍPIO DE ..., pessoa jurídica de direito público interno.
FUNDAMENTO LEGAL: Art. 165, I, do Código Tributário Nacional e Art. 319 do Código de Processo Civil.

Ação: AÇÃO DE REPETIÇÃO DE INDÉBITO TRIBUTÁRIO

I. DA TEMPESTIVIDADE / PRAZO PRESCRICIONAL
- Ação ajuizada dentro do prazo de 5 (cinco) anos a contar da data da extinção do crédito tributário pelo pagamento indevido (Art. 168, I, do CTN).

II. DOS FATOS
[ESTRUTURA FÁTICA: Sintetize o pagamento forçado de ITBI na cessão ou lavratura de escritura antes do registro no RGI].

III. DO DIREITO / DAS TESES E FUNDAMENTOS
1. Do Fato Gerador do ITBI: Necessidade de Registro no Cartório de Imóveis (RGI)
- Fundamento: Art. 156, II, da CRFB/88; Art. 35 do CTN; Arts. 1.227 e 1.245 do Código Civil e Tema 1.124 do STF (Repercussão Geral).
- [DESENVOLVIMENTO DO CANDIDATO: Fundamente que a transmissão da propriedade imóvel inter vivos só se opera com a averbação no registro imobiliário, inexistindo fato gerador em compromisso ou escritura].

2. Do Direito à Restituição do Indébito
- Fundamento: Art. 165, I, do CTN.
- [DESENVOLVIMENTO DO CANDIDATO: Explique que o pagamento foi indevido e o contribuinte tem direito à devolução com juros e correção].

3. Da Aplicação Exclusiva da Taxa SELIC
- Fundamento: Emenda Constitucional nº 113/2021 (Art. 3º) e Súmula 523/STF.
- [DESENVOLVIMENTO DO CANDIDATO: Demonstre que a atualização e os juros devem incidir unicamente pela Taxa SELIC a partir do pagamento indevido].

IV. DOS PEDIDOS E REQUERIMENTOS
a) Citação do Município réu para, querendo, contestar a presente ação no prazo legal;
b) Procedência integral do pedido para condenar o Réu à RESTITUIÇÃO INTEGRAL do valor pago indevidamente a título de ITBI (R$ ...);
c) Incidência exclusiva da Taxa SELIC para fins de correção monetária e juros moratórios (EC 113/2021);
d) Condenação do Réu ao pagamento de custas e honorários advocatícios de sucumbência (Art. 85, § 3º, do CPC);
e) Produção de todas as provas admitidas em direito;
f) Manifestação sobre audiência de conciliação (Art. 319, VII, do CPC).

Dá-se à causa o valor de R$ ...

Nestes termos,
Pede deferimento.

Local ..., Data ...
Advogado ... / OAB ...`,
    tesesPrincipais: [
      "Fato gerador do ITBI apenas com o registro imobiliário em RGI (Tema 1.124/STF e Art. 1.245 do CC)",
      "Direito à repetição de indébito tributário (Art. 165, I do CTN)",
      "Aplicação da Taxa Selic para juros e correção (EC 113/2021 e Súmula 523/STF)"
    ],
    fundamentosNormativos: [
      "Art. 156, II, CF/88",
      "Art. 35 CTN",
      "Art. 165, I, CTN",
      "Art. 168, I, CTN",
      "Tema 1.124 STF",
      "EC 113/2021"
    ],
    espelhoCorrecao: [
      { id: "c1", item: "Endereçamento", pontos: 0.10, descricao: "Vara da Fazenda Pública da Comarca competente", palavrasChave: ["vara", "fazenda pública"] },
      { id: "c2", item: "Qualificação e Fundamento", pontos: 0.20, descricao: "Autor e Réu qualificados, com citação do Art. 165, I do CTN", palavrasChave: ["repetição de indébito", "art. 165, i", "município"] },
      { id: "c3", item: "Prazo Quinquenal", pontos: 0.30, descricao: "Prescrição quinquenal respeitada do Art. 168, I do CTN", palavrasChave: ["5 anos", "art. 168, i", "prescrição"] },
      { id: "c4", item: "Fato Gerador do ITBI (Tema 1.124 STF)", pontos: 1.80, descricao: "Inocorrência de fato gerador antes do registro imobiliário em RGI", palavrasChave: ["tema 1.124", "registro de imóveis", "art. 1.245", "compromisso de compra e venda"] },
      { id: "c5", item: "Atualização pela Taxa Selic", pontos: 0.80, descricao: "Incidência da Taxa SELIC conforme EC 113/2021 e precedentes do STJ", palavrasChave: ["selic", "ec 113/2021", "correção monetária", "juros"] },
      { id: "c6", item: "Pedidos e Sucumbência", pontos: 1.40, descricao: "Condenação na devolução integral, citação, honorários de sucumbência (Art. 85 CPC) e provas", palavrasChave: ["devolução", "restituição", "honorários", "art. 85"] },
      { id: "c7", item: "Fechamento", pontos: 0.40, descricao: "Valor da causa no montante a ser restituído e encerramento regular", palavrasChave: ["valor da causa", "nestes termos", "advogado", "oab"] }
    ],
    dicaBanca: "Na Repetição de Indébito o valor da causa é exatamente a quantia cuja devolução se pleiteia, acrescida dos reflexos de juros e atualização."
  },
  {
    id: 5,
    exame: "Exame XXXVII (37º Exame Unificado)",
    ano: "2023.1",
    peca: "Agravo de Instrumento",
    titulo: "Agravo de Instrumento: Denegação de Tutela Provisória contra DIFAL sem Lei Complementar",
    enunciado: "Em Ação Ordinária proposta por Comércio Eletrônico Virtual S.A. em face do Estado do Rio de Janeiro, o juiz de primeira instância indeferiu o pedido de tutela provisória de urgência que buscava suspender a cobrança do Diferencial de Alíquota de ICMS (DIFAL) nas operações interestaduais destinadas a consumidor final não contribuinte, exigido sem a observância da vacatio legis da lei complementar nacional. A decisão interlocutória foi intimada há 5 dias úteis. Elabore o recurso cabível diretamente ao Tribunal de Justiça.",
    esqueleto: `AO EGRÉGIO TRIBUNAL DE JUSTIÇA DO ESTADO DO RIO DE JANEIRO

AGRAVANTE: COMÉRCIO ELETRÔNICO VIRTUAL S.A., [qualificação completa], por seu advogado infra-assinado.
AGRAVADO: ESTADO DO RIO DE JANEIRO, pessoa jurídica de direito público interno.
ORIGEM: Autos da Ação Ordinária nº ... em trâmite perante a ... Vara da Fazenda Pública da Comarca da Capital/RJ.
FUNDAMENTO LEGAL: Art. 1.015, I, e Art. 1.019, I, do Código de Processo Civil.

Recurso: AGRAVO DE INSTRUMENTO COM PEDIDO DE EFEITO SUSPENSIVO ATIVO / ANTECIPAÇÃO DA TUTELA RECURSAL

I. DA TEMPESTIVIDADE E DO PREPARO
- Tempestividade: Recurso interposto dentro do prazo de 15 (quinze) dias úteis (Art. 1.003, § 5º, do CPC).
- Preparo: Guia de recolhimento das custas recursais e porte de retorno devidamente quitadas e anexadas.

II. DA JUNTADA DAS PEÇAS OBRIGATÓRIAS E FACULTATIVAS
- Declaração de cumprimento do Art. 1.017, I e II, do CPC, com juntada de cópia da petição inicial, decisão agravada, certidão de intimação e procurações.

III. DOS FATOS E DA DECISÃO INTERLOCUTÓRIA AGRAVADA
[ESTRUTURA FÁTICA: O candidato deve sintetizar o indeferimento da tutela pelo juízo de 1º grau que manteve a cobrança imediata do DIFAL].

IV. DAS RAZÕES RECURSAIS / TESES E FUNDAMENTOS
1. Da Violação ao Princípio da Anterioridade Anual e Nonagesimal na Cobrança do DIFAL
- Fundamento: Art. 150, III, "b" e "c", da CRFB/88; LC nº 190/2022 e Tema 1.093/STF (ADI 7066).
- [DESENVOLVIMENTO DO CANDIDATO: Explique que a instituição do DIFAL com nova disciplina por Lei Complementar impõe o estrito respeito à noventena e anterioridade de exercício].

2. Da Existência dos Requisitos para a Concessão da Tutela Provisória de Urgência
- Probabilidade do provimento recursal demonstrada na jurisprudência do STF.
- Perigo de dano consubstanciado na apreensão de mercadorias em barreiras fiscais interestaduais e risco de insolvência.
- Fundamento: Art. 300 e Art. 1.019, I, do CPC c/c Art. 151, V, do CTN.

V. DOS PEDIDOS E REQUERIMENTOS
a) Concessão LIMINAR DA ANTECIPAÇÃO DE TUTELA RECURSAL (efeito suspensivo ativo) para suspender a exigibilidade do crédito tributário relativo ao DIFAL (Art. 151, V, do CTN);
b) Intimação do Estado do Rio de Janeiro para apresentar contraminuta no prazo de 15 dias (Art. 1.019, II, do CPC);
c) Comunicação da decisão ao juiz da causa (Art. 1.019, I, do CPC);
d) No mérito, o PROVIMENTO INTEGRAL do Agravo de Instrumento para reformar a decisão interlocutória agravada e deferir em definitivo a tutela provisória.

Nestes termos,
Pede deferimento.

Local ..., Data ...
Advogado ... / OAB ...`,
    tesesPrincipais: [
      "Cabimento do Agravo de Instrumento contra decisão sobre tutela provisória (Art. 1.015, I do CPC)",
      "Inexigibilidade imediata do DIFAL e respeito à anterioridade nonagesimal (Tema 1.093 do STF e ADI 7066)",
      "Presença dos requisitos do Art. 300 do CPC e suspensão da exigibilidade pelo Art. 151, V do CTN"
    ],
    fundamentosNormativos: [
      "Art. 1.015, I, CPC",
      "Art. 1.019, I, CPC",
      "Art. 150, III, b e c, CF/88",
      "LC 190/2022",
      "Tema 1.093 STF",
      "Art. 151, V, CTN"
    ],
    espelhoCorrecao: [
      { id: "c1", item: "Endereçamento", pontos: 0.10, descricao: "Tribunal de Justiça do Estado competente (órgão ad quem)", palavrasChave: ["tribunal de justiça", "egrégio"] },
      { id: "c2", item: "Requisitos Formais", pontos: 0.30, descricao: "Peças obrigatórias do Art. 1.017 do CPC, preparo e prazo de 15 dias úteis", palavrasChave: ["art. 1.017", "15 dias", "preparo", "peças obrigatórias"] },
      { id: "c3", item: "Cabimento Art. 1.015, I do CPC", pontos: 0.30, descricao: "Decisão interlocutória que versa sobre tutela provisória", palavrasChave: ["art. 1.015, i", "tutela provisória", "decisão interlocutória"] },
      { id: "c4", item: "Tese DIFAL e Anterioridade", pontos: 1.80, descricao: "Necessidade de Lei Complementar e respeito à noventena na cobrança do DIFAL", palavrasChave: ["difal", "tema 1.093", "anterioridade", "noventena", "lc 190/2022"] },
      { id: "c5", item: "Efeito Ativo / Tutela Recursal", pontos: 0.80, descricao: "Art. 1.019, I do CPC c/c Art. 151, V do CTN (suspensão do crédito)", palavrasChave: ["efeito ativo", "art. 1.019, i", "art. 151, v", "suspensão"] },
      { id: "c6", item: "Pedidos Recursais", pontos: 1.30, descricao: "Concessão do efeito ativo, intimação para contraminuta e provimento do recurso", palavrasChave: ["provimento", "reforma da decisão", "contraminuta", "art. 1.019, ii"] },
      { id: "c7", item: "Fechamento", pontos: 0.40, descricao: "Encerramento formal regular", palavrasChave: ["nestes termos", "advogado", "oab"] }
    ],
    dicaBanca: "No Agravo de Instrumento lembre-se de que o recurso é endereçado DIRETAMENTE ao Tribunal de 2ª instância, indicando os autos de origem e a certidão de peças obrigatórias."
  },
  {
    id: 6,
    exame: "Exame XXXVI (36º Exame Unificado)",
    ano: "2022.3",
    peca: "Recurso de Apelação",
    titulo: "Apelação: Imunidade Tributária de Livros Eletrônicos (Súmula Vinculante 57)",
    enunciado: "Livraria Digital do Saber Ltda. impetrou Mandado de Segurança contra o Secretário de Fazenda do Estado X para afastar a exigência de ICMS sobre a venda de e-books e leitores de livros digitais (e-readers). O juiz da 1ª Vara da Fazenda Pública proferiu sentença DENEGANDO a segurança por entender que a imunidade da CF só alcançaria livros físicos de papel. A sentença foi publicada há 8 dias úteis. Como advogado(a) da impetrante, elabore o recurso cabível, estruturando folha de rosto e razões.",
    esqueleto: `[FOLHA DE INTERPOSIÇÃO]
AO JUÍZO DA 1ª VARA DA FAZENDA PÚBLICA DA COMARCA DE ... DO ESTADO X

Autos do Mandado de Segurança nº ...
APELANTE: LIVRARIA DIGITAL DO SABER LTDA., já qualificada nos autos.
APELADO: ESTADO X, pessoa jurídica de direito público interno.
FUNDAMENTO LEGAL: Art. 1.009 e seguintes do Código de Processo Civil e Art. 14 da Lei nº 12.016/2009.

Recurso: RECURSO DE APELAÇÃO

Vem a Apelante, não se conformando com a r. sentença de fls. ..., interpor o presente RECURSO DE APELAÇÃO, requerendo a juntada da guia de preparo devidamente recolhida.
Requer o recebimento do recurso no duplo efeito (Art. 1.012 do CPC), a intimação do Apelado para apresentar contrarrazões no prazo de 15 dias (Art. 1.010, § 1º, do CPC) e a posterior remessa dos autos ao Egrégio Tribunal de Justiça do Estado X.

Nestes termos,
Pede deferimento.

Local ..., Data ...
Advogado ... / OAB ...

============================================================

[FOLHA DE RAZÕES RECURSAIS]
AO EGRÉGIO TRIBUNAL DE JUSTIÇA DO ESTADO X

APELANTE: LIVRARIA DIGITAL DO SABER LTDA.
APELADO: ESTADO X
Autos de Origem nº ... - 1ª Vara da Fazenda Pública

RAZÕES DO RECURSO DE APELAÇÃO

I. DA TEMPESTIVIDADE E DO PREPARO
- Tempestividade: Recurso interposto dentro do prazo legal de 15 (quinze) dias úteis (Art. 1.003, § 5º, do CPC).
- Preparo: Comprovante de recolhimento das custas recursais anexado.

II. BREVE SÍNTESE DO PROCESSO
[ESTRUTURA FÁTICA: Síntese da impetração do MS e da sentença equivocada que restringiu a imunidade a livros em papel].

III. DO DIREITO / DA REFORMA DA SENTENÇA
1. Da Imunidade Constitucional dos Livros Eletrônicos (E-books e E-readers)
- Fundamento: Art. 150, VI, "d", da CRFB/88 e Súmula Vinculante 57 do STF.
- [DESENVOLVIMENTO DO CANDIDATO: Explique a finalidade da imunidade cultural de democratizar o acesso à leitura, interpretando a norma de forma finalística e ampla para abarcar suportes magnéticos e eletrônicos].

2. Da Não Incidência de ICMS
- Fundamento: A imunidade afasta a competência tributária do Estado para tributar tais operações por meio de ICMS.

IV. DOS PEDIDOS E REQUERIMENTOS
a) Conhecimento e recebimento do presente recurso de apelação;
b) Oitiva do douto Representante do Ministério Público em segundo grau;
c) No mérito, o PROVIMENTO INTEGRAL do recurso para REFORMAR a r. sentença e CONCEDER A SEGURANÇA, declarando a imunidade tributária e desconstituindo a cobrança de ICMS;
d) Restituição ou reembolso das custas adiantadas (sem honorários de sucumbência nos termos do Art. 25 da Lei 12.016/09).

Nestes termos,
Pede deferimento.

Local ..., Data ...
Advogado ... / OAB ...`,
    tesesPrincipais: [
      "Cabimento da Apelação contra sentença em Mandado de Segurança (Art. 1.009 CPC e Art. 14 Lei 12.016/09)",
      "Imunidade tributária ampla de livros eletrônicos e suportes de leitura (Art. 150, VI, 'd' da CF e Súmula Vinculante 57)",
      "Interpretação teleológica da norma imunitária para estímulo à difusão da cultura"
    ],
    fundamentosNormativos: [
      "Art. 150, VI, 'd', CF/88",
      "Súmula Vinculante 57 STF",
      "Art. 1.009 CPC",
      "Art. 1.010 CPC",
      "Art. 14 Lei 12.016/09"
    ],
    espelhoCorrecao: [
      { id: "c1", item: "Folha de Interposição", pontos: 0.30, descricao: "Endereçada ao juiz a quo da 1ª Vara com pedido de contrarrazões e remessa ao TJ", palavrasChave: ["interposição", "juízo a quo", "contrarrazões", "remessa"] },
      { id: "c2", item: "Folha de Razões", pontos: 0.20, descricao: "Endereçada ao Tribunal de Justiça competente (ad quem)", palavrasChave: ["egrégio", "tribunal de justiça", "razões"] },
      { id: "c3", item: "Tempestividade e Preparo", pontos: 0.30, descricao: "Prazo de 15 dias úteis e comprovante de recolhimento de custas", palavrasChave: ["15 dias", "preparo", "art. 1.003"] },
      { id: "c4", item: "Imunidade Cultural (Súmula Vinculante 57)", pontos: 2.00, descricao: "Art. 150, VI, d da CF e Súmula Vinculante 57 que estende imunidade a e-books e suportes", palavrasChave: ["súmula vinculante 57", "art. 150, vi, d", "livros digitais", "e-books", "e-readers"] },
      { id: "c5", item: "Oitiva do Ministério Público", pontos: 0.40, descricao: "Pedido de intimação do MP em 2º grau por se tratar de MS", palavrasChave: ["ministério público", "art. 12"] },
      { id: "c6", item: "Pedidos Recursais", pontos: 1.40, descricao: "Conhecimento, provimento integral, reforma da sentença e concessão da segurança", palavrasChave: ["conhecimento", "provimento", "reforma", "concessão da segurança"] },
      { id: "c7", item: "Fechamento", pontos: 0.40, descricao: "Fechamento e assinatura padrão", palavrasChave: ["nestes termos", "advogado", "oab"] }
    ],
    dicaBanca: "Na Apelação, estruture SEMPRE duas folhas: a folha de interposição dirigida ao juiz prolator da sentença e a folha de razões dirigida ao Tribunal."
  },
  {
    id: 7,
    exame: "Exame XXXV (35º Exame Unificado)",
    ano: "2022.2",
    peca: "Ação Declaratória de Inexistência de Relação Jurídico-Tributária",
    titulo: "Declaratória: Não Incidência de ISS sobre Atividade Notarial e Registral em Causa Própria",
    enunciado: "O Cartório do 1º Ofício de Notas da Comarca Alfa foi notificado pela Secretaria de Finanças do Município para apresentar declarações e pagar ISS sobre emolumentos de atos extrajudiciais com base de cálculo estimada e arbitrária. O titular do cartório pretende demonstrar que o cartório não possui personalidade jurídica e que a exigência com arbitramento sumário viola o contraditório e o art. 148 do CTN. Elabore a petição inicial da ação cabível para declarar a nulidade da relação antes do lançamento definitivo com tutela provisória.",
    esqueleto: `AO JUÍZO DA ... VARA DA FAZENDA PÚBLICA DA COMARCA DE ALFA

AUTOR: [TITULAR DO CARTÓRIO], [qualificação completa: nacionalidade, estado civil, tabelião titular do 1º Ofício de Notas], por seu advogado infra-assinado.
RÉU: MUNICÍPIO DE ALFA, pessoa jurídica de direito público interno.
FUNDAMENTO LEGAL: Art. 19, I, e Art. 300 do CPC c/c Art. 148 do CTN.

Ação: AÇÃO DECLARATÓRIA DE INEXISTÊNCIA DE RELAÇÃO JURÍDICO-TRIBUTÁRIA C/C PEDIDO DE TUTELA PROVISÓRIA DE URGÊNCIA

I. DO CABIMENTO DA AÇÃO DECLARATÓRIA
- Ação adequada para declarar a inexistência de relação jurídica antes da constituição definitiva do crédito ou para afastar obrigação tributária indevida (Art. 19, I, do CPC).

II. DOS FATOS
[ESTRUTURA FÁTICA: O candidato deve sintetizar a pretensão municipal de arbitrar base de cálculo de forma genérica sem processo administrativo individualizado].

III. DO DIREITO / DAS TESES E FUNDAMENTOS
1. Da Ilegalidade do Arbitramento sem Observância do Art. 148 do CTN
- Fundamento: Art. 148 do Código Tributário Nacional.
- [DESENVOLVIMENTO DO CANDIDATO: Explique que o arbitramento da base de cálculo é medida excepcional, exigindo a demonstração prévia de omissão, fraude ou inidoneidade dos registros contábeis].

2. Do Princípio da Legalidade e da Ampla Defesa
- Fundamento: Art. 5º, LIV e LV, da CRFB/88 e Art. 150, I, da CRFB/88.
- [DESENVOLVIMENTO DO CANDIDATO: Desenvolva a afronta ao devido processo legal tributário].

IV. DA TUTELA PROVISÓRIA DE URGÊNCIA
- Fumus boni iuris: Violação frontal a procedimento cogente fixado pelo CTN.
- Periculum in mora: Risco de lavratura indevida de auto de infração com pesadas multas punitivas.
- Fundamento: Art. 300 do CPC e Art. 151, V, do CTN.

V. DOS PEDIDOS E REQUERIMENTOS
a) Concessão da TUTELA PROVISÓRIA DE URGÊNCIA para obstar a lavratura do auto de infração e suspender a exigibilidade fiscal (Art. 151, V, CTN);
b) Citação do Município réu;
c) Procedência do pedido para DECLARAR a inexistência de relação jurídica e a nulidade de qualquer arbitramento fundado no procedimento irregular;
d) Condenação do réu em custas e honorários advocatícios (Art. 85 do CPC);
e) Produção de todas as provas em direito admitidas;
f) Manifestação pela realização ou não de audiência de conciliação (Art. 319, VII, CPC).

Dá-se à causa o valor de R$ ...

Nestes termos,
Pede deferimento.

Local ..., Data ...
Advogado ... / OAB ...`,
    tesesPrincipais: [
      "Cabimento da Ação Declaratória (Art. 19, I do CPC)",
      "Excepcionalidade e requisitos vinculantes para arbitramento da base de cálculo (Art. 148 do CTN)",
      "Violação ao devido processo legal e contraditório administrativo (Art. 5º, LV da CF)"
    ],
    fundamentosNormativos: [
      "Art. 19, I, CPC",
      "Art. 148 CTN",
      "Art. 5º, LIV e LV, CF/88",
      "Art. 300 CPC",
      "Art. 151, V, CTN"
    ],
    espelhoCorrecao: [
      { id: "c1", item: "Endereçamento", pontos: 0.10, descricao: "Vara da Fazenda Pública da Comarca competente", palavrasChave: ["vara", "fazenda pública"] },
      { id: "c2", item: "Legitimidade e Fundamento", pontos: 0.30, descricao: "Legitimidade da pessoa física do tabelião/oficial e Art. 19, I do CPC", palavrasChave: ["tabelião", "declaratória", "art. 19, i"] },
      { id: "c3", item: "Art. 148 do CTN (Arbitramento)", pontos: 2.00, descricao: "Demonstração de que o arbitramento exige omissão comprovada e contraditório", palavrasChave: ["art. 148", "arbitramento", "excepcional", "inidoneidade"] },
      { id: "c4", item: "Tutela de Urgência", pontos: 0.80, descricao: "Requisitos do Art. 300 do CPC e suspensão da exigibilidade pelo Art. 151, V do CTN", palavrasChave: ["tutela provisória", "art. 300", "art. 151, v"] },
      { id: "c5", item: "Pedidos e Honorários", pontos: 1.40, descricao: "Declaração de inexistência, citação, honorários (Art. 85 CPC) e audiência do Art. 319, VII", palavrasChave: ["declaração de inexistência", "honorários", "art. 85", "art. 319"] },
      { id: "c6", item: "Fechamento", pontos: 0.40, descricao: "Valor da causa e encerramento regular", palavrasChave: ["valor da causa", "nestes termos", "advogado", "oab"] }
    ],
    dicaBanca: "Lembre-se de que cartórios extrajudiciais não têm personalidade jurídica própria; quem figura no polo ativo é o titular/delegatário pessoa física."
  },
  {
    id: 8,
    exame: "Exame XXXIV (34º Exame Unificado)",
    ano: "2022.1",
    peca: "Mandado de Segurança Preventivo",
    titulo: "MS Preventivo: Ameaça de Apreensão de Mercadorias para Coação de Tributo (Súmula 323/STF)",
    enunciado: "A sociedade Indústria de Roupas Elegância Ltda. tomou ciência formal de que a fiscalização da Secretaria da Fazenda Estadual baixou ordem de serviço com ameaça expressa de retenção física de caminhões transportando suas confecções nos postos fiscais de fronteira caso não seja recolhido diferencial de alíquota em desacordo com as normas constitucionais. O transporte terá início na próxima semana. Elabore a peça judicial adequada com pedido de liminar para impedir a apreensão das mercadorias.",
    esqueleto: `AO JUÍZO DA ... VARA DA FAZENDA PÚBLICA DA COMARCA DE ... DO ESTADO ...

IMPETRANTE: INDÚSTRIA DE ROUPAS ELEGÂNCIA LTDA., [qualificação completa], por seu advogado infra-assinado (procuração anexa).
IMPETRADO: ATO COATOR AMEAÇADO PELO ILUSTRÍSSIMO SENHOR DELEGADO REGIONAL DA RECEITA ESTADUAL DE ... vinculado ao ESTADO ...
FUNDAMENTO LEGAL: Art. 5º, LXIX, da CRFB/88 e Art. 1º, caput, da Lei nº 12.016/2009.

Ação: MANDADO DE SEGURANÇA PREVENTIVO COM PEDIDO DE MEDIDA LIMINAR

I. DO CABIMENTO DO MANDADO DE SEGURANÇA PREVENTIVO
- Demonstração do justo receio de sofrer lesão a direito líquido e certo por ato iminente e concreto de autoridade pública (Art. 1º da Lei nº 12.016/2009).

II. DOS FATOS
[ESTRUTURA FÁTICA: Síntese da iminência de apreensão coercitiva de mercadorias nos postos fiscais estaduais].

III. DO DIREITO / DAS TESES E FUNDAMENTOS
1. Da Ilegalidade e Inconstitucionalidade da Apreensão de Mercadorias como Meio Coercitivo de Cobrança
- Fundamento: Súmula 323 do STF (\"É inadmissível a apreensão de mercadorias como meio coercitivo para pagamento de tributos\") e Súmulas 70 e 547 do STF.
- [DESENVOLVIMENTO DO CANDIDATO: Explique que o Estado possui instrumentos próprios de execução fiscal e não pode embaraçar a atividade empresarial nem o direito de locomoção de bens].

2. Do Princípio da Livre Iniciativa e do Devido Processo Legal
- Fundamento: Art. 1º, IV; Art. 170, caput e parágrafo único; e Art. 5º, LIV, da CRFB/88.

IV. DA MEDIDA LIMINAR
- Fumus boni iuris: Fundamentação arrimada em enunciado sumular pacífico do Supremo Tribunal Federal.
- Periculum in mora: Risco iminente de paralisação das entregas com perecimento e quebra contratual.
- Fundamento: Art. 7º, III, da Lei nº 12.016/2009 e Art. 151, IV, do CTN.

V. DOS PEDIDOS E REQUERIMENTOS
a) Concessão da MEDIDA LIMINAR inaudita altera parte determinando à autoridade coatora que se abstenha de reter, apreender ou obstar a circulação das mercadorias da Impetrante (salvo tempo estritamente necessário à conferência fiscal);
b) Notificação da Autoridade Coatora para prestar informações no prazo de 10 dias;
c) Ciência ao órgão de representação judicial da pessoa jurídica interessada (Estado);
d) Intimação do Ministério Público;
e) Confirmação da liminar e CONCESSÃO DEFINITIVA DA SEGURANÇA;
f) Sem condenação em honorários (Art. 25 da Lei 12.016/09).

Dá-se à causa o valor de R$ ...

Nestes termos,
Pede deferimento.

Local ..., Data ...
Advogado ... / OAB ...`,
    tesesPrincipais: [
      "Inadmissibilidade da apreensão de mercadorias como meio coercitivo para cobrança de tributo (Súmula 323 do STF)",
      "Cabimento da via preventiva do Mandado de Segurança diante de ameaça concreta (Art. 1º Lei 12.016/09)",
      "Proteção à livre iniciativa e livre exercício profissional (Art. 170 da CF e Súmula 70/STF)"
    ],
    fundamentosNormativos: [
      "Súmula 323 STF",
      "Súmula 70 STF",
      "Súmula 547 STF",
      "Art. 1º Lei 12.016/09",
      "Art. 170 CF/88",
      "Art. 7º, III, Lei 12.016/09"
    ],
    espelhoCorrecao: [
      { id: "c1", item: "Endereçamento", pontos: 0.10, descricao: "Vara da Fazenda Pública da Comarca competente", palavrasChave: ["vara", "fazenda pública"] },
      { id: "c2", item: "Cabimento Preventivo", pontos: 0.40, descricao: "Justo receio e prova pré-constituída da ameaça de lesão", palavrasChave: ["preventivo", "justo receio", "ameaça", "prova pré-constituída"] },
      { id: "c3", item: "Súmula 323 do STF", pontos: 2.00, descricao: "Inadmissibilidade de apreensão como sanção política / meio coercitivo", palavrasChave: ["súmula 323", "meio coercitivo", "apreensão", "sanção política"] },
      { id: "c4", item: "Livre Iniciativa (Art. 170 CF)", pontos: 0.50, descricao: "Liberdade de atividade econômica e Súmulas 70 e 547 do STF", palavrasChave: ["art. 170", "livre iniciativa", "súmula 70"] },
      { id: "c5", item: "Medida Liminar", pontos: 0.80, descricao: "Fumus boni iuris, periculum in mora e Art. 7º, III da Lei 12.016/09", palavrasChave: ["liminar", "fumus boni iuris", "periculum in mora", "art. 7º, iii"] },
      { id: "c6", item: "Pedidos e Isenção de Sucumbência", pontos: 1.20, descricao: "Ordem de abstenção definitiva, notificação, ciência ao Estado, oitiva do MP e isenção de honorários (Art. 25)", palavrasChave: ["abstenção", "concessão da segurança", "notificação", "mp", "art. 25"] },
      { id: "c7", item: "Fechamento", pontos: 0.40, descricao: "Valor da causa e encerramento", palavrasChave: ["valor da causa", "nestes termos", "advogado", "oab"] }
    ],
    dicaBanca: "No Mandado de Segurança Preventivo o pedido é que a autoridade 'se abstenha de praticar o ato coator ameaçado'."
  },
  {
    id: 9,
    exame: "Exame XXXIII (33º Exame Unificado)",
    ano: "2021.3",
    peca: "Exceção de Pré-Executividade",
    titulo: "Exceção de Pré-Executividade: Prescrição Quinquenal Originária de Tributo Lançado de Ofício",
    enunciado: "A empresa Transportadora Veloz Ltda. foi surpreendida com a citação em Execução Fiscal ajuizada pela Fazenda Nacional cobrando crédito de taxa federal cujo lançamento definitivo foi notificado ao devedor há mais de sete anos, sem qualquer causa suspensiva ou interruptiva da prescrição. A empresa não dispõe de bens livres para penhora e a prova da prescrição está plenamente demonstrada pela própria CDA e pelos documentos do processo administrativo. Como advogado(a), elabore o instrumento processual de defesa mais célere para trancar a execução sem necessidade de garantia do juízo.",
    esqueleto: `AO JUÍZO DA ... VARA FEDERAL DA SEÇÃO JUDICIÁRIA DE ...
(Autos da Execução Fiscal nº ...)

EXCIPIENTE: TRANSPORTADORA VELOZ LTDA., já qualificada nos autos da Execução Fiscal em epígrafe, por seu advogado infra-assinado.
EXCEPTA: UNIÃO (FAZENDA NACIONAL), pessoa jurídica de direito público interno.
FUNDAMENTO: Súmula 393 do STJ e Art. 803, I, do Código de Processo Civil.

Peça: EXCEÇÃO DE PRÉ-EXECUTIVIDADE COM PEDIDO DE EXTINÇÃO DA EXECUÇÃO FISCAL

I. DO CABIMENTO DA EXCEÇÃO DE PRÉ-EXECUTIVIDADE E DISPENSA DE GARANTIA
- Pleno cabimento para matérias de ordem pública conhecíveis de ofício pelo magistrado que não demandem dilação probatória (Súmula 393 do STJ e Tema 108 do STJ).
- Desnecessidade de prévia garantia do juízo ou penhora de bens.

II. DOS FATOS
[ESTRUTURA FÁTICA: O candidato deve demonstrar as datas da notificação do lançamento e do ajuizamento/citação da execução fiscal].

III. DO DIREITO / DA PRESCRIÇÃO QUINQUENAL DA PRETENSÃO EXECUTÓRIA
1. Do Transcurso do Prazo Quinquenal do Art. 174 do CTN
- Fundamento: Art. 174, caput, do CTN e Art. 156, V, do CTN.
- [DESENVOLVIMENTO DO CANDIDATO: Demonstre que entre a constituição definitiva do crédito e o ajuizamento decorreram mais de 5 anos ininterruptos sem causas de interrupção ou suspensão].

2. Da Nulidade do Título Executivo e Extinção do Processo
- Fundamento: Art. 803, I, do CPC e Art. 487, II, do CPC.
- [DESENVOLVIMENTO DO CANDIDATO: Conclua pela inexigibilidade do crédito e perda de eficácia da Certidão de Dívida Ativa].

IV. DOS PEDIDOS E REQUERIMENTOS
a) Conhecimento e processamento da presente Exceção de Pré-Executividade, com suspensão dos atos de constrição patrimonial;
b) Intimação da Fazenda Nacional para que se manifeste no prazo legal;
c) Acolhimento integral da exceção para RECONHECER A PRESCRIÇÃO e extinguir a Execução Fiscal com resolução de mérito (Art. 487, II, do CPC);
d) Desconstituição de qualquer eventual ordem de bloqueio ou penhora;
e) Condenação da Excepta ao pagamento de honorários advocatícios sucumbenciais (Súmula 153 do STJ e Art. 85 do CPC).

Nestes termos,
Pede deferimento.

Local ..., Data ...
Advogado ... / OAB ...`,
    tesesPrincipais: [
      "Cabimento da Exceção de Pré-Executividade sem garantia do juízo para matérias de ordem pública (Súmula 393 do STJ)",
      "Prescrição da pretensão executória tributária após 5 anos da constituição definitiva (Art. 174 e Art. 156, V do CTN)",
      "Cabimento de honorários advocatícios em acolhimento de EPE (Súmula 153 do STJ)"
    ],
    fundamentosNormativos: [
      "Súmula 393 STJ",
      "Súmula 153 STJ",
      "Art. 174 CTN",
      "Art. 156, V, CTN",
      "Art. 803, I, CPC",
      "Art. 487, II, CPC"
    ],
    espelhoCorrecao: [
      { id: "c1", item: "Endereçamento", pontos: 0.10, descricao: "Juízo da Vara onde tramita a Execução Fiscal (mesmos autos)", palavrasChave: ["vara federal", "execução fiscal"] },
      { id: "c2", item: "Cabimento da EPE", pontos: 0.50, descricao: "Súmula 393 do STJ, matéria de ordem pública e dispensa de garantia do juízo", palavrasChave: ["súmula 393", "ordem pública", "sem garantia", "dilação probatória"] },
      { id: "c3", item: "Prescrição Quinquenal (Art. 174 CTN)", pontos: 2.20, descricao: "Decurso de prazo superior a 5 anos sem causas interruptivas e extinção pelo Art. 156, V", palavrasChave: ["prescrição", "5 anos", "art. 174", "art. 156, v"] },
      { id: "c4", item: "Nulidade do Título", pontos: 0.40, descricao: "Nulidade da execução nos termos do Art. 803, I do CPC", palavrasChave: ["art. 803", "nulidade", "cda"] },
      { id: "c5", item: "Pedidos e Honorários (Súmula 153 STJ)", pontos: 1.40, descricao: "Extinção da execução com resolução de mérito (Art. 487, II CPC) e honorários pela Súmula 153 do STJ", palavrasChave: ["extinção da execução", "art. 487, ii", "honorários", "súmula 153"] },
      { id: "c6", item: "Fechamento", pontos: 0.40, descricao: "Fechamento regular nos moldes da banca FGV", palavrasChave: ["nestes termos", "advogado", "oab"] }
    ],
    dicaBanca: "Na Exceção de Pré-Executividade não há valor da causa novo porque a peça é protocolizada nos próprios autos da execução já em curso!"
  },
  {
    id: 10,
    exame: "Exame XXXII (32º Exame Unificado)",
    ano: "2021.2",
    peca: "Embargos à Execução Fiscal",
    titulo: "Embargos à Execução: Nulidade da CDA por Falta de Requisitos Legais (Art. 2º da LEF)",
    enunciado: "O Município Gama ajuizou execução fiscal contra Indústria Cerâmica do Sul Ltda. cobrando IPTU. A empresa teve um imóvel penhorado há 12 dias. Ao analisar a Certidão de Dívida Ativa que embasa a execução, o advogado constatou que o título não indica a forma de cálculo dos juros de mora, omite o número do processo administrativo que originou o lançamento e não especifica o termo inicial de incidência da correção monetária, impedindo a ampla defesa. Elabore os embargos cabíveis com pedido de extinção da execução fiscal.",
    esqueleto: `AO JUÍZO DA ... VARA DAS EXECUÇÕES FISCAIS DA COMARCA DE GAMA
(Distribuído por dependência aos autos da Execução Fiscal nº ...)

EMBARGANTE: INDÚSTRIA CERÂMICA DO SUL LTDA., já qualificada nos autos principais, por seu advogado infra-assinado.
EMBARGADO: MUNICÍPIO GAMA, pessoa jurídica de direito público interno.
FUNDAMENTO LEGAL: Art. 16 da Lei nº 6.830/1980 e Art. 202 do CTN c/c Art. 2º, § 5º, da LEF.

Ação: EMBARGOS À EXECUÇÃO FISCAL COM PEDIDO DE EXTINÇÃO DO TÍTULO

I. DA TEMPESTIVIDADE E DA GARANTIA DO JUÍZO
- Tempestividade demonstrada: prazo de 30 dias contados da intimação da penhora (Art. 16, III, da Lei 6.830/80).
- Juízo integralmente garantido pela penhora realizada.

II. DOS FATOS
[ESTRUTURA FÁTICA: O candidato deve relatar os vícios formais insanáveis presentes na CDA].

III. DO DIREITO / DA NULIDADE DA CERTIDÃO DE DÍVIDA ATIVA
1. Da Ausência dos Requisitos Formais Obrigatórios da CDA
- Fundamento: Art. 202 do CTN; Art. 2º, § 5º, da Lei nº 6.830/80 e Art. 203 do CTN.
- [DESENVOLVIMENTO DO CANDIDATO: Explique que a omissão do processo administrativo, da fórmula de cálculo dos juros e do termo de correção retira a certeza e liquidez do título executivo, violando o contraditório e a ampla defesa (Art. 5º, LV, da CF)].

2. Da Incerteza e Iliquidez do Título Executivo
- Fundamento: Art. 803, I, do CPC.
- [DESENVOLVIMENTO DO CANDIDATO: Demonstre que é nula a execução fundada em título que carece de certeza e liquidez].

IV. DOS PEDIDOS E REQUERIMENTOS
a) Recebimento dos presentes embargos no efeito suspensivo;
b) Intimação do Município Embargado para apresentar impugnação no prazo de 30 dias (Art. 17 da LEF);
c) Acolhimento dos embargos para DECLARAR A NULIDADE DA CDA e EXTINGUIR a Execução Fiscal com base no Art. 803, I, c/c Art. 485, IV, do CPC;
d) Cancelamento da penhora sobre o bem da Embargante;
e) Condenação do Embargado ao pagamento de custas e honorários advocatícios sucumbenciais (Art. 85 do CPC).

Dá-se à causa o valor de R$ ...

Nestes termos,
Pede deferimento.

Local ..., Data ...
Advogado ... / OAB ...`,
    tesesPrincipais: [
      "Nulidade formal da CDA pela omissão de requisitos essenciais (Art. 202 do CTN e Art. 2º, §5º da LEF)",
      "Ofensa ao contraditório e à ampla defesa pela impossibilidade de conferência do débito (Art. 5º, LV da CF)",
      "Extinção da execução fiscal por iliquidez e incerteza do título executivo (Art. 803, I do CPC)"
    ],
    fundamentosNormativos: [
      "Art. 202 CTN",
      "Art. 203 CTN",
      "Art. 2º, § 5º, Lei 6.830/80",
      "Art. 803, I, CPC",
      "Art. 5º, LV, CF/88",
      "Art. 16 Lei 6.830/80"
    ],
    espelhoCorrecao: [
      { id: "c1", item: "Endereçamento e Dependência", pontos: 0.10, descricao: "Vara de Execuções e distribuição por dependência", palavrasChave: ["execuções fiscais", "distribuição por dependência"] },
      { id: "c2", item: "Garantia e Tempestividade", pontos: 0.40, descricao: "Prazo de 30 dias da penhora comprovado nos termos do Art. 16 da LEF", palavrasChave: ["30 dias", "penhora", "garantia"] },
      { id: "c3", item: "Nulidade da CDA (Art. 202 CTN e Art. 2º LEF)", pontos: 2.20, descricao: "Omissão de requisitos essenciais do título gerando iliquidez e violação à ampla defesa", palavrasChave: ["art. 202", "art. 2º, § 5º", "nulidade da cda", "certeza e liquidez", "ampla defesa"] },
      { id: "c4", item: "Incerteza do Título (Art. 803 CPC)", pontos: 0.50, descricao: "Nulidade da execução pelo Art. 803, I do CPC", palavrasChave: ["art. 803, i", "nulidade da execução"] },
      { id: "c5", item: "Pedidos e Extinção", pontos: 1.40, descricao: "Extinção da execução fiscal, desconstituição da penhora, intimação do fisco e honorários (Art. 85)", palavrasChave: ["extinção", "cancelamento da penhora", "honorários", "art. 85"] },
      { id: "c6", item: "Fechamento", pontos: 0.40, descricao: "Valor da causa igual ao da execução e fechamento", palavrasChave: ["valor da causa", "nestes termos", "advogado", "oab"] }
    ],
    dicaBanca: "A omissão da forma de cálculo dos juros e do processo administrativo na CDA gera nulidade insanável que obsta o contraditório do executado."
  },
  {
    id: 11,
    exame: "Exame XXXI (31º Exame Unificado)",
    ano: "2020.1",
    peca: "Mandado de Segurança Repressivo",
    titulo: "MS Repressivo: Direito à Certidão Positiva com Efeitos de Negativa (CPD-EN)",
    enunciado: "A empresa Comercial Distribuidora Alvorada Ltda. necessita participar de licitação pública com prazo de habilitação iminente. Requereu perante a Delegacia da Receita Federal a expedição de CPD-EN, mas o pedido foi sumariamente indeferido sob alegação de que existem dois débitos em cobrança. Contudo, o primeiro débito está com parcelamento ativo e adimplido, e o segundo é objeto de impugnação administrativa pendente de julgamento no CARF. Como advogado(a), elabore o remédio constitucional cabível para compelir o Fisco à expedição imediata da certidão.",
    esqueleto: `AO JUÍZO DA ... VARA FEDERAL DA SEÇÃO JUDICIÁRIA DE ...

IMPETRANTE: COMERCIAL DISTRIBUIDORA ALVORADA LTDA., [qualificação completa], por seu advogado infra-assinado (procuração anexa).
IMPETRADO: ATO COATOR DO ILUSTRÍSSIMO SENHOR DELEGADO DA RECEITA FEDERAL DO BRASIL EM ..., autoridade vinculada à UNIÃO.
FUNDAMENTO LEGAL: Art. 5º, LXIX, da CRFB/88; Lei nº 12.016/2009 e Art. 206 do CTN.

Ação: MANDADO DE SEGURANÇA COM PEDIDO DE MEDIDA LIMINAR

I. DO CABIMENTO E TEMPESTIVIDADE
- Direito líquido e certo comprovado documentalmente por extrato de parcelamento pago e recurso administrativo pendente de decisão.
- Ajuizamento dentro do prazo de 120 dias do ato indeferitório.

II. DOS FATOS
[ESTRUTURA FÁTICA: O candidato deve relatar o indeferimento injustificado da certidão e o risco iminente de desclassificação em licitação pública].

III. DO DIREITO / DAS TESES E FUNDAMENTOS
1. Da Suspensão da Exigibilidade do Crédito Tributário
- Débito 1: Parcelamento ativo e adimplido (Art. 151, VI, do CTN).
- Débito 2: Reclamação/Recurso administrativo tempestivo pendente de julgamento (Art. 151, III, do CTN).
- [DESENVOLVIMENTO DO CANDIDATO: Explique que ambas as situações suspendem a exigibilidade dos créditos tributários].

2. Do Direito Líquido e Certo à Expedição de CPD-EN
- Fundamento: Art. 206 do Código Tributário Nacional.
- [DESENVOLVIMENTO DO CANDIDATO: Demonstre que créditos com exigibilidade suspensa geram obrigatoriamente direito à Certidão Positiva com Efeitos de Negativa].

IV. DA MEDIDA LIMINAR
- Fumus boni iuris: Expressa subsunção ao Art. 206 do CTN.
- Periculum in mora: Risco de exclusão de certame licitatório cujo prazo de entrega de envelopes é iminente.
- Fundamento: Art. 7º, III, da Lei nº 12.016/2009.

V. DOS PEDIDOS E REQUERIMENTOS
a) Concessão da MEDIDA LIMINAR inaudita altera parte determinando à Autoridade Coatora a expedição da Certidão Positiva com Efeitos de Negativa (CPD-EN) no prazo de 24 horas;
b) Notificação da autoridade coatora para informações;
c) Ciência do feito à Advocacia-Geral da União (AGU);
d) Intimação do Representante do Ministério Público Federal;
e) Confirmação da liminar com a CONCESSÃO DEFINITIVA DA SEGURANÇA;
f) Sem condenação em honorários (Art. 25 da Lei 12.016/09).

Dá-se à causa o valor de R$ ...

Nestes termos,
Pede deferimento.

Local ..., Data ...
Advogado ... / OAB ...`,
    tesesPrincipais: [
      "Direito subjetivo à Certidão Positiva com Efeitos de Negativa (Art. 206 do CTN)",
      "Suspensão da exigibilidade por parcelamento adimplido (Art. 151, VI do CTN)",
      "Suspensão da exigibilidade por reclamação/recurso administrativo pendente (Art. 151, III do CTN)"
    ],
    fundamentosNormativos: [
      "Art. 206 CTN",
      "Art. 151, III e VI, CTN",
      "Art. 5º, LXIX, CF/88",
      "Lei 12.016/2009",
      "Art. 7º, III, Lei 12.016/09"
    ],
    espelhoCorrecao: [
      { id: "c1", item: "Endereçamento", pontos: 0.10, descricao: "Vara Federal da Seção Judiciária competente", palavrasChave: ["vara federal", "seção judiciária"] },
      { id: "c2", item: "Partes e Autoridade Coatora", pontos: 0.20, descricao: "Impetrante e Delegado da Receita Federal com vinculação à União", palavrasChave: ["delegado", "receita federal", "união"] },
      { id: "c3", item: "Suspensão por Parcelamento (Art. 151, VI)", pontos: 1.00, descricao: "Demonstração de suspensão do crédito por parcelamento ativo", palavrasChave: ["parcelamento", "art. 151, vi", "suspensão"] },
      { id: "c4", item: "Suspensão por Recurso (Art. 151, III)", pontos: 1.00, descricao: "Demonstração de suspensão por impugnação/recurso administrativo", palavrasChave: ["recurso administrativo", "art. 151, iii", "suspensão"] },
      { id: "c5", item: "Direito à CPD-EN (Art. 206 CTN)", pontos: 0.80, descricao: "Dever legal do fisco de emitir a certidão positiva com efeitos de negativa", palavrasChave: ["art. 206", "certidão positiva com efeitos de negativa", "cpd-en"] },
      { id: "c6", item: "Medida Liminar de Urgência", pontos: 0.60, descricao: "Fumus boni iuris e periculum in mora em vista da licitação", palavrasChave: ["liminar", "licitação", "periculum in mora", "art. 7º, iii"] },
      { id: "c7", item: "Pedidos Completos", pontos: 0.90, descricao: "Expedição da certidão, notificação da autoridade, AGU e oitiva do MP", palavrasChave: ["expedição", "concessão da segurança", "notificação", "mp"] },
      { id: "c8", item: "Fechamento", pontos: 0.40, descricao: "Fechamento sem honorários de sucumbência (Art. 25 Lei 12.016)", palavrasChave: ["sem honorários", "nestes termos", "advogado", "oab"] }
    ],
    dicaBanca: "Tendo créditos suspensos pelo Art. 151 do CTN, a expedição de CPD-EN é direito líquido e certo inegável do contribuinte (Art. 206 do CTN)."
  },
  {
    id: 12,
    exame: "Exame XXX (30º Exame Unificado)",
    ano: "2019.3",
    peca: "Ação de Repetição de Indébito",
    titulo: "Repetição de Indébito: Majoração de Taxa de Polícia por Decreto sem Lei",
    enunciado: "A sociedade empresária Hotel Bela Vista Ltda. foi compelida a pagar, durante os últimos três anos, taxa de fiscalização e vigilância sanitária municipal cujo valor foi substancialmente majorado por Decreto do Chefe do Executivo Municipal acima de qualquer índice oficial de correção monetária. A empresa suportou integralmente o encargo financeiro e comprovou os pagamentos. Como advogado(a), elabore a ação pelo rito ordinário pleiteando a repetição do indébito fiscal com atualização monetária e juros moratórios.",
    esqueleto: `AO JUÍZO DA ... VARA DA FAZENDA PÚBLICA DA COMARCA DE ...

AUTOR: HOTEL BELA VISTA LTDA., [qualificação completa], por seu advogado infra-assinado.
RÉU: MUNICÍPIO DE ..., pessoa jurídica de direito público interno.
FUNDAMENTO LEGAL: Art. 165, I, do CTN e Art. 319 do Código de Processo Civil.

Ação: AÇÃO DE REPETIÇÃO DE INDÉBITO TRIBUTÁRIO

I. DA TEMPESTIVIDADE E PRAZO PRESCRICIONAL
- Ação distribuída no prazo de 5 anos contados do pagamento indevido (Art. 168, I, do CTN).

II. DOS FATOS
[ESTRUTURA FÁTICA: O candidato deve relatar o aumento da taxa por mero decreto do Poder Executivo em percentual exorbitante].

III. DO DIREITO / DAS TESES E FUNDAMENTOS
1. Da Violação ao Princípio da Estrita Legalidade Tributária
- Fundamento: Art. 150, I, da CRFB/88 e Art. 97, II e § 1º, do CTN.
- Súmula 160 do STJ (\"É defeso, ao município, atualizar o IPTU, mediante decreto, em percentual superior ao índice oficial de correção monetária\").
- [DESENVOLVIMENTO DO CANDIDATO: Explique que majoração de tributo exige lei em sentido formal, não se admitindo decreto para aumentar valores reais].

2. Do Direito à Repetição do Indébito Tributário
- Fundamento: Art. 165, I, do CTN.
- [DESENVOLVIMENTO DO CANDIDATO: Fundamente a devolução do excesso pago a maior indevidamente].

3. Dos Juros Moratórios e da Correção Monetária
- Fundamento: Súmula 188 do STJ (juros a contar do trânsito em julgado) e aplicação da Taxa SELIC (EC 113/2021).

IV. DOS PEDIDOS E REQUERIMENTOS
a) Citação do Município réu;
b) Procedência integral do pedido para condenar o Réu a RESTITUIR a quantia paga indevidamente com os acréscimos legais;
c) Condenação do Município nas custas e honorários advocatícios sucumbenciais (Art. 85 do CPC);
d) Produção de todas as provas em direito admitidas;
e) Opção pela realização de audiência de conciliação (Art. 319, VII, CPC).

Dá-se à causa o valor de R$ ...

Nestes termos,
Pede deferimento.

Local ..., Data ...
Advogado ... / OAB ...`,
    tesesPrincipais: [
      "Princípio da estrita legalidade tributária (Art. 150, I da CF e Art. 97, II do CTN)",
      "Veda-se a majoração de tributos por decreto além dos índices oficiais de inflação (Súmula 160 do STJ)",
      "Direito à repetição de indébito tributário pelo pagamento indevido (Art. 165, I do CTN)"
    ],
    fundamentosNormativos: [
      "Art. 150, I, CF/88",
      "Art. 97, II e § 1º, CTN",
      "Súmula 160 STJ",
      "Art. 165, I, CTN",
      "Art. 168, I, CTN"
    ],
    espelhoCorrecao: [
      { id: "c1", item: "Endereçamento", pontos: 0.10, descricao: "Vara da Fazenda Pública da Comarca competente", palavrasChave: ["vara", "fazenda pública"] },
      { id: "c2", item: "Qualificação e Fundamento", pontos: 0.20, descricao: "Autor e Réu qualificados, Art. 165, I do CTN e Art. 319 do CPC", palavrasChave: ["repetição de indébito", "art. 165, i", "município"] },
      { id: "c3", item: "Legalidade Estrita (Art. 150, I CF)", pontos: 2.00, descricao: "Violação à legalidade tributária e impossibilidade de aumento por decreto (Art. 97 CTN e Súmula 160 STJ)", palavrasChave: ["legalidade", "art. 150, i", "art. 97", "decreto", "súmula 160"] },
      { id: "c4", item: "Repetição do Indébito (Art. 165 CTN)", pontos: 1.00, descricao: "Dever de restituição do valor recolhido a maior", palavrasChave: ["restituição", "art. 165, i", "indébito"] },
      { id: "c5", item: "Juros e Correção", pontos: 0.50, descricao: "Incidência da Taxa Selic e Súmula 188 do STJ", palavrasChave: ["selic", "súmula 188", "trânsito em julgado"] },
      { id: "c6", item: "Pedidos e Sucumbência", pontos: 0.80, descricao: "Citação, condenação integral, honorários (Art. 85 CPC) e audiência do Art. 319, VII", palavrasChave: ["condenação", "citação", "honorários", "art. 85", "art. 319"] },
      { id: "c7", item: "Fechamento", pontos: 0.40, descricao: "Valor da causa equivalente ao valor a restituir e encerramento", palavrasChave: ["valor da causa", "nestes termos", "advogado", "oab"] }
    ],
    dicaBanca: "O decreto executivo só pode atualizar monetariamente tributos nos exatos limites dos índices oficiais de inflação; qualquer reajuste real superior a isso consubstancia majoração disfarçada violadora do princípio da legalidade."
  },
  {
    id: 13,
    exame: "Exame XXIX (29º Exame Unificado)",
    ano: "2019.2",
    peca: "Ação de Consignação em Pagamento",
    titulo: "Consignatória: Dúvida sobre a Titularidade do ISS entre Dois Municípios",
    enunciado: "A sociedade prestadora de serviços de manutenção industrial Serviços Técnicos Alfa Ltda., sediada no Município X, executou obras no Município Y. Ambos os Municípios emitiram cobranças simultâneas exigindo integralmente o pagamento de ISS sobre o mesmo fato gerador e sobre a mesma nota fiscal de serviços, recusando-se a receber sob ressalva e ameaçando a empresa com auto de infração. Diante da iminência do vencimento da obrigação tributária e da recusa mútua, elabore a petição inicial da ação cabível para efetuar o depósito e desonerar o contribuinte.",
    esqueleto: `AO JUÍZO DA ... VARA DA FAZENDA PÚBLICA DA COMARCA DE ...

AUTORA: SERVIÇOS TÉCNICOS ALFA LTDA., [qualificação completa], por seu advogado infra-assinado.
RÉUS: MUNICÍPIO X e MUNICÍPIO Y, pessoas jurídicas de direito público interno.
FUNDAMENTO LEGAL: Art. 164, III, do Código Tributário Nacional e Art. 539 e seguintes do Código de Processo Civil.

Ação: AÇÃO DE CONSIGNAÇÃO EM PAGAMENTO C/C PEDIDO DE DEPÓSITO JUDICIAL

I. DO CABIMENTO DA AÇÃO DE CONSIGNAÇÃO EM PAGAMENTO
- Hipótese legal expressa: bitributação e dúvida fundada sobre a titularidade do sujeito ativo da relação tributária (Art. 164, III, do CTN e Art. 547 do CPC).

II. DOS FATOS
[ESTRUTURA FÁTICA: O candidato deve expor a cobrança simultânea de ISS por dois entes municipais sobre o mesmo serviço prestado].

III. DO DIREITO / DA DEFINIÇÃO DO SUJEITO ATIVO COMPETENTE
1. Da Impossibilidade de Dupla Exigência Tributária sobre o Mesmo Fato Gerador
- Fundamento: Vedação à bitributação no ordenamento jurídico pátrio e Art. 156, III, da CRFB/88.

2. Da Fixação da Competência do ISS Conforme a Lei Complementar nº 116/2003
- Fundamento: Art. 3º e Art. 4º da LC nº 116/2003.
- [DESENVOLVIMENTO DO CANDIDATO: Identifique se o serviço se enquadra na regra geral do local do estabelecimento prestador (Município X) ou nas exceções do local da execução da obra (Município Y)].

3. Da Eficácia Liberatória do Depósito Judicial Integral
- Fundamento: Art. 164, § 2º, do CTN e Art. 151, II, do CTN (suspensão da exigibilidade).
- [DESENVOLVIMENTO DO CANDIDATO: Explique que o depósito em dinheiro extingue a obrigação perante o credor legítimo e impede sanções de mora].

IV. DOS PEDIDOS E REQUERIMENTOS
a) Autorização para o recolhimento do DEPÓSITO JUDICIAL INTEGRAL no prazo de 5 dias (Art. 542, I, do CPC), com a imediata suspensão da exigibilidade do crédito tributário (Art. 151, II, do CTN);
b) Citação do MUNICÍPIO X e do MUNICÍPIO Y para contestarem a ação ou comparecerem aos autos para provar o seu direito ao crédito depositado (Art. 547 do CPC);
c) Procedência do pedido para DECLARAR QUITADA a obrigação tributária da Autora, condenando-se o Município sucumbente nos ônus de custas e honorários advocatícios (Art. 85 do CPC);
d) Liberação do valor depositado em favor do Município reconhecido como legítimo credor;
e) Produção de todas as provas em direito admitidas.

Dá-se à causa o valor de R$ ... (valor integral do tributo a ser depositado).

Nestes termos,
Pede deferimento.

Local ..., Data ...
Advogado ... / OAB ...`,
    tesesPrincipais: [
      "Cabimento da Consignação em Pagamento por exigência de mais de uma pessoa jurídica de direito público (Art. 164, III do CTN)",
      "Eficácia suspensiva e liberatória do depósito integral em dinheiro (Art. 151, II e Art. 164, §2º do CTN)",
      "Regras de competência territorial do ISS da Lei Complementar nº 116/2003"
    ],
    fundamentosNormativos: [
      "Art. 164, III, CTN",
      "Art. 151, II, CTN",
      "Art. 539 CPC",
      "Art. 547 CPC",
      "Art. 3º LC 116/2003"
    ],
    espelhoCorrecao: [
      { id: "c1", item: "Endereçamento", pontos: 0.10, descricao: "Vara da Fazenda Pública competente", palavrasChave: ["vara", "fazenda pública"] },
      { id: "c2", item: "Polo Passivo Múltiplo", pontos: 0.30, descricao: "Qualificação de ambos os Municípios que cobram o imposto como litisconsortes", palavrasChave: ["município x", "município y", "ambos", "litisconsórcio"] },
      { id: "c3", item: "Cabimento Art. 164, III do CTN", pontos: 1.80, descricao: "Exigência simultânea por mais de um sujeito ativo e depósito nos moldes do Art. 164, § 2º", palavrasChave: ["art. 164, iii", "bitributação", "dúvida", "depósito integral", "art. 151, ii"] },
      { id: "c4", item: "Competência do ISS (LC 116/03)", pontos: 1.00, descricao: "Aplicação das regras do Art. 3º da LC 116/03 sobre local da prestação versus estabelecimento", palavrasChave: ["lc 116/03", "art. 3º", "estabelecimento prestador", "local da execução"] },
      { id: "c5", item: "Pedidos Completos", pontos: 1.40, descricao: "Autorização de depósito em 5 dias (Art. 542, I CPC), citação de ambos, quitação da obrigação e honorários", palavrasChave: ["depósito", "5 dias", "citação", "quitação", "honorários"] },
      { id: "c6", item: "Fechamento", pontos: 0.40, descricao: "Valor da causa no montante consignado e encerramento", palavrasChave: ["valor da causa", "nestes termos", "advogado", "oab"] }
    ],
    dicaBanca: "Na Consignação em Pagamento tributária por dúvida quanto à titularidade, ambos os entes federados devem figurar no polo passivo para que o juiz decida quem é o credor legítimo."
  },
  {
    id: 14,
    exame: "Exame XXVIII (28º Exame Unificado)",
    ano: "2019.1",
    peca: "Recurso de Apelação",
    titulo: "Apelação: Sentença Extintiva sem Resolução de Mérito em Embargos do Devedor",
    enunciado: "O juiz de direito da 2ª Vara Cível proferiu sentença indeferindo a petição inicial de Embargos à Execução Fiscal opostos por Indústria Alimentícia do Vale S.A., extinguindo o processo sem resolução do mérito sob o fundamento incorreto de intempestividade, desconsiderando que a contagem do prazo de 30 dias na vigência do CPC/2015 se dá em dias úteis e a partir da juntada do mandado de intimação da penhora. A sentença foi publicada há 10 dias úteis. Elabore o recurso cabível para anular a sentença e julgar o mérito com base na causa madura.",
    esqueleto: `[FOLHA DE INTERPOSIÇÃO]
AO JUÍZO DA 2ª VARA CÍVEL DA COMARCA DE ...

Autos dos Embargos à Execução nº ...
APELANTE: INDÚSTRIA ALIMENTÍCIA DO VALE S.A., já qualificada nos autos.
APELADO: ESTADO ..., pessoa jurídica de direito público interno.
FUNDAMENTO LEGAL: Art. 1.009 e seguintes do Código de Processo Civil.

Recurso: RECURSO DE APELAÇÃO

Vem a Apelante interpor RECURSO DE APELAÇÃO em face da r. sentença de fls. ..., requerendo a juntada da respectiva guia de preparo.
Requer a intimação do Apelado para apresentação de contrarrazões no prazo de 15 dias (Art. 1.010, § 1º, do CPC) e a remessa dos autos ao Tribunal de Justiça competente.

Nestes termos,
Pede deferimento.

Local ..., Data ...
Advogado ... / OAB ...

============================================================

[FOLHA DE RAZÕES RECURSAIS]
AO EGRÉGIO TRIBUNAL DE JUSTIÇA DO ESTADO ...

APELANTE: INDÚSTRIA ALIMENTÍCIA DO VALE S.A.
APELADO: ESTADO ...
Autos nº ... - 2ª Vara Cível da Comarca de ...

RAZÕES DO RECURSO DE APELAÇÃO

I. DA TEMPESTIVIDADE E PREPARO
- Tempestividade: Recurso interposto dentro do prazo de 15 dias úteis (Art. 1.003, § 5º, CPC).
- Preparo: Comprovante anexo.

II. BREVE RELATO DOS FATOS
[ESTRUTURA FÁTICA: O candidato deve demonstrar o erro material da sentença ao declarar a intempestividade dos embargos].

III. DO DIREITO / DAS RAZÕES DE REFORMA
1. Da Plena Tempestividade dos Embargos à Execução Fiscal
- Fundamento: Art. 16, III, da Lei nº 6.830/80 c/c Art. 219 do CPC (contagem de prazos processuais exclusivamente em dias úteis).
- [DESENVOLVIMENTO DO CANDIDATO: Demonstre o cômputo correto dos prazos processuais em dias úteis, afastando a suposta preclusão].

2. Da Aplicação da Teoria da Causa Madura
- Fundamento: Art. 1.013, § 3º, I, do Código de Processo Civil.
- [DESENVOLVIMENTO DO CANDIDATO: Explique que o processo versa sobre matéria exclusivamente de direito com prova documental pré-constituída, permitindo ao Tribunal o julgamento direto do mérito].

3. Do Mérito dos Embargos: Decadência do Crédito Tributário
- Fundamento: Art. 150, § 4º, e Art. 156, V, do CTN.
- [DESENVOLVIMENTO DO CANDIDATO: Desenvolva a tese de mérito dos embargos demonstrando a extinção do direito do Fisco de lançar].

IV. DOS PEDIDOS E REQUERIMENTOS
a) Conhecimento e processamento do presente recurso de apelação;
b) Provimento do recurso para CASSAR / ANULAR a sentença de extinção sem resolução do mérito;
c) Aplicação da Teoria da Causa Madura (Art. 1.013, § 3º, I, do CPC) para julgar PROCEDENTES os Embargos à Execução Fiscal e extinguir a execução principal;
d) Inversão dos ônus de sucumbência com condenação do Apelado em honorários advocatícios (Art. 85 do CPC).

Nestes termos,
Pede deferimento.

Local ..., Data ...
Advogado ... / OAB ...`,
    tesesPrincipais: [
      "Tempestividade dos Embargos contados em dias úteis (Art. 16 LEF c/c Art. 219 CPC)",
      "Teoria da causa madura para julgamento imediato do mérito pelo Tribunal (Art. 1.013, § 3º, I do CPC)",
      "Decadência do lançamento tributário de tributo sujeito a homologação (Art. 150, § 4º do CTN)"
    ],
    fundamentosNormativos: [
      "Art. 1.009 CPC",
      "Art. 219 CPC",
      "Art. 16 Lei 6.830/80",
      "Art. 1.013, § 3º, I, CPC",
      "Art. 150, § 4º, CTN"
    ],
    espelhoCorrecao: [
      { id: "c1", item: "Folhas Separadas", pontos: 0.30, descricao: "Interposição perante juiz a quo e razões ao Tribunal ad quem", palavrasChave: ["interposição", "razões", "juízo a quo", "ad quem"] },
      { id: "c2", item: "Tempestividade e Preparo", pontos: 0.20, descricao: "Prazo de 15 dias úteis e comprovante de recolhimento de custas recursais", palavrasChave: ["15 dias úteis", "preparo"] },
      { id: "c3", item: "Contagem em Dias Úteis (Art. 219 CPC)", pontos: 1.80, descricao: "Demonstração de que o prazo de 30 dias da LEF se conta em dias úteis pelo CPC/15", palavrasChave: ["art. 219", "dias úteis", "art. 16", "preclusão"] },
      { id: "c4", item: "Teoria da Causa Madura (Art. 1.013, § 3º)", pontos: 1.20, descricao: "Possibilidade de o Tribunal julgar diretamente o mérito por estar madura a causa", palavrasChave: ["art. 1.013, § 3º", "causa madura", "julgamento do mérito"] },
      { id: "c5", item: "Tese de Mérito (Decadência)", pontos: 0.80, descricao: "Art. 150, § 4º do CTN e extinção do crédito pelo Art. 156, V", palavrasChave: ["decadência", "art. 150, § 4º", "art. 156, v"] },
      { id: "c6", item: "Pedidos e Honorários", pontos: 0.70, descricao: "Anulação da sentença, provimento no mérito e fixação de sucumbência", palavrasChave: ["anulação", "provimento", "sucumbência", "honorários"] }
    ],
    dicaBanca: "Sempre que uma sentença extinguir o processo sem julgamento de mérito e a causa estiver pronta, peça expressamente a aplicação do Art. 1.013, §3º do CPC (teoria da causa madura)."
  },
  {
    id: 15,
    exame: "Exame XXVII (27º Exame Unificado)",
    ano: "2018.3",
    peca: "Mandado de Segurança Coletivo",
    titulo: "MS Coletivo: Majoração de PIS e COFINS contra a Anterioridade Nonagesimal",
    enunciado: "A Associação Nacional dos Lojistas de Varejo (entidade de classe regularmente constituída há mais de 3 anos, com representatividade estatutária nacional) tomou ciência de que a Presidência da República publicou Decreto majorando as alíquotas de PIS e COFINS incidentes sobre receitas financeiras, determinando sua incidência imediata a partir do primeiro dia do mês subsequente à publicação. Como advogado(a) da entidade associativa, promova a ação constitucional cabível para resguardar as empresas associadas em todo o território nacional.",
    esqueleto: `AO JUÍZO DA ... VARA FEDERAL DA SEÇÃO JUDICIÁRIA DO DISTRITO FEDERAL

IMPETRANTE: ASSOCIAÇÃO NACIONAL DOS LOJISTAS DE VAREJO, entidade de classe de âmbito nacional, inscrita no CNPJ sob o nº ..., com sede em Brasília/DF, por seu advogado infra-assinado.
IMPETRADO: ATO COATOR DO PRESIDENTE DA REPÚBLICA vinculado à UNIÃO.
FUNDAMENTO LEGAL: Art. 5º, LXX, \"b\", da CRFB/88; Art. 21 da Lei nº 12.016/2009 e Art. 195, § 6º, da CRFB/88.

Ação: MANDADO DE SEGURANÇA COLETIVO PREVENTIVO COM PEDIDO DE MEDIDA LIMINAR

I. DA LEGITIMIDADE ATIVA DA ASSOCIAÇÃO E DO CABIMENTO
- Demonstração da legitimidade ativa: Associação de classe legalmente constituída há mais de 1 ano, em defesa dos interesses de seus membros (Art. 5º, LXX, \"b\", da CRFB/88 e Art. 21 da Lei 12.016/09).
- Desnecessidade de autorização expressa individual de cada associado (Súmula 629 do STF).

II. DOS FATOS
[ESTRUTURA FÁTICA: O candidato deve relatar o decreto presidencial majorando PIS/COFINS sem observância do prazo de 90 dias].

III. DO DIREITO / DAS TESES E FUNDAMENTOS
1. Da Violação ao Princípio da Anterioridade Nonagesimal (Noventena)
- Fundamento: Art. 195, § 6º, da CRFB/88 e Art. 150, III, \"c\", da CRFB/88.
- [DESENVOLVIMENTO DO CANDIDATO: Explique que as contribuições sociais para a seguridade social só podem ser exigidas após decorridos 90 dias da data de publicação da lei/ato que as houver instituído ou modificado].

2. Da Ofensa ao Princípio da Não Surpresa e Segurança Jurídica
- Fundamento: Art. 150, III, \"b\" e \"c\", da CRFB/88.
- [DESENVOLVIMENTO DO CANDIDATO: Demonstre o direito líquido e certo dos associados ao prazo de adaptação financeira de 90 dias].

IV. DA MEDIDA LIMINAR
- Fumus boni iuris: Violação literal ao texto constitucional do Art. 195, § 6º, da CF.
- Periculum in mora: Risco de autuações fiscais imediatas contra centenas de associados em todo o país.
- Fundamento: Art. 7º, III, da Lei nº 12.016/2009 e Art. 151, IV, do CTN.

V. DOS PEDIDOS E REQUERIMENTOS
a) Concessão da MEDIDA LIMINAR inaudita altera parte para suspender a exigibilidade do PIS e COFINS majorados até que se complete o prazo de 90 dias (Art. 151, IV, CTN);
b) Notificação da Autoridade Coatora para prestar informações;
c) Ciência do feito à Advocacia-Geral da União;
d) Intimação do Ministério Público Federal;
e) Concessão definitiva da SEGURANÇA em favor de todos os associados da Impetrante em âmbito nacional;
f) Isenção de honorários sucumbenciais (Art. 25 da Lei 12.016/09).

Dá-se à causa o valor de R$ ...

Nestes termos,
Pede deferimento.

Local ..., Data ...
Advogado ... / OAB ...`,
    tesesPrincipais: [
      "Legitimidade ativa de associação de classe para Mandado de Segurança Coletivo (Art. 5º, LXX, 'b' da CF e Súmula 629/STF)",
      "Anterioridade mitigada ou nonagesimal para contribuições sociais (Art. 195, § 6º da CF/88)",
      "Inexigibilidade de majoração antes de transcorridos os 90 dias da publicação do ato"
    ],
    fundamentosNormativos: [
      "Art. 5º, LXX, 'b', CF/88",
      "Art. 21 Lei 12.016/2009",
      "Súmula 629 STF",
      "Art. 195, § 6º, CF/88",
      "Art. 151, IV, CTN"
    ],
    espelhoCorrecao: [
      { id: "c1", item: "Endereçamento", pontos: 0.10, descricao: "Vara Federal da Seção Judiciária do DF", palavrasChave: ["vara federal", "distrito federal"] },
      { id: "c2", item: "Legitimidade Ativa da Associação", pontos: 0.50, descricao: "Art. 5º, LXX, 'b' da CF, constituição há mais de 1 ano e Súmula 629 do STF", palavrasChave: ["legitimidade ativa", "art. 5º, lxx", "súmula 629", "associação"] },
      { id: "c3", item: "Anterioridade Nonagesimal (Art. 195, § 6º)", pontos: 2.20, descricao: "Necessidade de aguardar 90 dias para exigir majoração de contribuição social", palavrasChave: ["noventena", "anterioridade nonagesimal", "art. 195, § 6º", "contribuição social", "pis", "cofins"] },
      { id: "c4", item: "Medida Liminar", pontos: 0.80, descricao: "Fumus boni iuris, periculum in mora e suspensão da exigibilidade pelo Art. 151, IV do CTN", palavrasChave: ["liminar", "art. 151, iv", "periculum in mora"] },
      { id: "c5", item: "Pedidos Coletivos", pontos: 1.00, descricao: "Concessão da segurança com eficácia a todos os associados e sem honorários", palavrasChave: ["concessão da segurança", "associados", "sem honorários", "art. 25"] },
      { id: "c6", item: "Fechamento", pontos: 0.40, descricao: "Valor da causa e fechamento regular", palavrasChave: ["valor da causa", "nestes termos", "advogado", "oab"] }
    ],
    dicaBanca: "No MS Coletivo impetrado por associação não é necessária autorização individual expressa dos filiados nem assembleia específica (Súmula 629 do STF)."
  },
  {
    id: 16,
    exame: "Exame XXVI (26º Exame Unificado)",
    ano: "2018.2",
    peca: "Ação Anulatória com Depósito Judicial Integral",
    titulo: "Ação Anulatória: Depósito do Montante Integral e Suspensão da Exigibilidade (Súmula 112/STJ)",
    enunciado: "A empresa Químicos Brasil S.A. foi autuada pela Fazenda Estadual para recolhimento de ICMS sobre operações que a empresa sustenta serem isentas por convênio do CONFAZ. O débito já foi inscrito em dívida ativa, mas ainda não houve ajuizamento de execução fiscal. A empresa possui os recursos financeiros e deseja depositar o valor total cobrado em dinheiro para obter garantia definitiva contra atos expropriatórios e certidão positiva com efeitos de negativa. Elabore a ação anulatória cabível requerendo a autorização do depósito.",
    esqueleto: `AO JUÍZO DA ... VARA DA FAZENDA PÚBLICA DA COMARCA DE ... DO ESTADO ...

AUTORA: QUÍMICOS BRASIL S.A., [qualificação completa], por seu advogado infra-assinado.
RÉU: ESTADO ..., pessoa jurídica de direito público interno.
FUNDAMENTO LEGAL: Art. 38 da Lei nº 6.830/1980 e Art. 151, II, do CTN c/c Art. 319 do CPC.

Ação: AÇÃO ANULATÓRIA DE DÉBITO FISCAL C/C PEDIDO DE DEPÓSITO DO MONTANTE INTEGRAL

I. DO CABIMENTO DA AÇÃO ANULATÓRIA COM DEPÓSITO
- Cabimento da ação anulatória para desconstituir débito inscrito em dívida ativa (Art. 38 da Lei 6.830/80).
- Faculdade do contribuinte de efetuar o depósito judicial do montante integral e em dinheiro para suspensão da exigibilidade (Art. 151, II, do CTN e Súmula 112 do STJ).

II. DOS FATOS
[ESTRUTURA FÁTICA: O candidato deve relatar a autuação fiscal e a pretensão de efetuar o depósito suspensivo integral].

III. DO DIREITO / DAS TESES E FUNDAMENTOS
1. Da Eficácia da Isenção Concedida por Convênio do CONFAZ
- Fundamento: Art. 155, § 2º, XII, \"g\", da CRFB/88 e Lei Complementar nº 24/1975.
- [DESENVOLVIMENTO DO CANDIDATO: Explique que a isenção de ICMS ratificada por convênio CONFAZ é cogente e vincula a administração tributária estadual].

2. Do Direito à Suspensão da Exigibilidade e Emissão de CPD-EN
- Fundamento: Art. 151, II, e Art. 206 do Código Tributário Nacional.
- [DESENVOLVIMENTO DO CANDIDATO: Demonstre que o depósito integral confere ao contribuinte direito potestativo à suspensão do crédito e obtenção de certidão].

IV. DO DEPÓSITO JUDICIAL INTEGRAL
- Requerimento de emissão imediata da guia judicial para depósito integral em dinheiro (Súmula 112/STJ).

V. DOS PEDIDOS E REQUERIMENTOS
a) Deferimento da juntada da guia e expedição para DEPÓSITO DO MONTANTE INTEGRAL E EM DINHEIRO (Art. 151, II, CTN e Súmula 112 STJ), com declaração de suspensão da exigibilidade;
b) Determinação para expedição de Certidão Positiva com Efeitos de Negativa (CPD-EN) nos moldes do Art. 206 do CTN;
c) Citação do Estado réu;
d) Procedência integral do pedido para ANULAR o lançamento tributário e a respectiva certidão de dívida ativa;
e) Condenação do réu nas custas e honorários advocatícios (Art. 85 do CPC);
f) Liberação e levantamento do depósito judicial em favor da Autora ao final do processo.

Dá-se à causa o valor de R$ ...

Nestes termos,
Pede deferimento.

Local ..., Data ...
Advogado ... / OAB ...`,
    tesesPrincipais: [
      "Cabimento da Anulatória com depósito para suspensão do crédito (Art. 38 LEF e Art. 151, II CTN)",
      "O depósito deve ser integral e em dinheiro para produzir efeito suspensivo (Súmula 112 do STJ)",
      "Isenção de ICMS aprovada no CONFAZ vincula os Estados membros (Art. 155, § 2º, XII, 'g' da CF)"
    ],
    fundamentosNormativos: [
      "Art. 38 Lei 6.830/80",
      "Art. 151, II, CTN",
      "Súmula 112 STJ",
      "Art. 206 CTN",
      "Art. 155, § 2º, XII, 'g', CF/88"
    ],
    espelhoCorrecao: [
      { id: "c1", item: "Endereçamento", pontos: 0.10, descricao: "Vara da Fazenda Pública da Comarca competente", palavrasChave: ["vara", "fazenda pública"] },
      { id: "c2", item: "Art. 38 da LEF", pontos: 0.30, descricao: "Indicação correta do Art. 38 da Lei 6.830/80 para anulatória", palavrasChave: ["art. 38", "lei 6.830", "anulatória"] },
      { id: "c3", item: "Súmula 112 do STJ e Depósito Integral", pontos: 1.80, descricao: "Depósito integral e em dinheiro suspendendo a exigibilidade do Art. 151, II do CTN", palavrasChave: ["súmula 112", "depósito integral", "em dinheiro", "art. 151, ii"] },
      { id: "c4", item: "Tese da Isenção CONFAZ", pontos: 1.20, descricao: "Art. 155, § 2º, XII, 'g' da CF e regularidade do convênio isentivo de ICMS", palavrasChave: ["convênio", "confaz", "isenção", "art. 155"] },
      { id: "c5", item: "Direito à CPD-EN (Art. 206 CTN)", pontos: 0.50, descricao: "Concessão da certidão positiva com efeitos de negativa", palavrasChave: ["art. 206", "cpd-en", "certidão"] },
      { id: "c6", item: "Pedidos e Levantamento", pontos: 0.70, descricao: "Anulação do débito, honorários (Art. 85 CPC) e autorização para levantamento do depósito", palavrasChave: ["anulação", "levantamento", "honorários", "art. 85"] },
      { id: "c7", item: "Fechamento", pontos: 0.40, descricao: "Valor da causa no montante integral e fechamento", palavrasChave: ["valor da causa", "nestes termos", "advogado", "oab"] }
    ],
    dicaBanca: "O depósito nos moldes do Art. 151, II do CTN não é requisito obrigatório para ajuizar a anulatória, mas quando realizado deve ser em dinheiro e integral (Súmula 112 do STJ)."
  },
  {
    id: 17,
    exame: "Exame XXV (25º Exame Unificado)",
    ano: "2018.1",
    peca: "Embargos à Execução Fiscal",
    titulo: "Embargos à Execução: Imunidade Recíproca de Empresa Pública Postal (ECT)",
    enunciado: "O Município de Curitiba ajuizou Execução Fiscal contra a Empresa Brasileira de Correios e Telégrafos (ECT) cobrando IPTU sobre imóvel operacional onde funciona agência central de triagem de correspondências. A ECT teve imóvel penhorado há 15 dias. Como procurador(a)/advogado(a) da empresa pública, elabore os Embargos do Devedor defendendo a extensão da imunidade tributária recíproca.",
    esqueleto: `AO JUÍZO DA ... VARA FEDERAL DAS EXECUÇÕES FISCAIS DE CURITIBA/PR
(Distribuído por dependência aos autos da Execução Fiscal nº ...)

EMBARGANTE: EMPRESA BRASILEIRA DE CORREIOS E TELÉGRAFOS - ECT, empresa pública federal, [qualificação completa], por seu advogado infra-assinado.
EMBARGADO: MUNICÍPIO DE CURITIBA, pessoa jurídica de direito público interno.
FUNDAMENTO LEGAL: Art. 16 da Lei nº 6.830/80 e Art. 150, VI, \"a\", e § 2º, da CRFB/88.

Ação: EMBARGOS À EXECUÇÃO FISCAL COM PEDIDO DE EFEITO SUSPENSIVO

I. DA TEMPESTIVIDADE E GARANTIA DO JUÍZO
- Tempestividade: prazo de 30 dias contados da intimação da penhora (Art. 16, III, da LEF).
- Garantia do juízo comprovada pela penhora formalizada nos autos executivos.

II. DOS FATOS
[ESTRUTURA FÁTICA: O candidato deve relatar a execução de IPTU movida pelo Município contra imóvel operacional da ECT].

III. DO DIREITO / DAS TESES E FUNDAMENTOS
1. Da Extensão da Imunidade Recíproca à Empresa Pública Prestadora de Serviço Postal Exclusivo
- Fundamento: Art. 150, VI, \"a\", e § 2º, da CRFB/88; Art. 21, X, da CRFB/88 e jurisprudência vinculante do STF (Tema 508 / RE 601.392 e ACO 765).
- [DESENVOLVIMENTO DO CANDIDATO: Explique que a ECT é empresa pública federal delegatária de serviço público obrigatório em regime de monopólio, não se equiparando às empresas estatais que exploram atividade econômica em livre concorrência].

2. Do Vinculo com as Finalidades Essenciais
- Fundamento: Art. 150, § 2º, da CRFB/88.
- [DESENVOLVIMENTO DO CANDIDATO: Demonstre que o imóvel penhorado é utilizado para o serviço postal essencial de triagem].

IV. DO EFEITO SUSPENSIVO AOS EMBARGOS
- Garantia pelo juízo e evidente relevância do fundamento amparado em decisões do plenário do STF.
- Fundamento: Art. 919, § 1º, do CPC.

V. DOS PEDIDOS E REQUERIMENTOS
a) Concessão de EFEITO SUSPENSIVO aos presentes embargos;
b) Intimação do Município Embargado para apresentar impugnação no prazo de 30 dias (Art. 17 da LEF);
c) Acolhimento integral dos embargos para RECONHECER A IMUNIDADE TRIBUTÁRIA RECÍPROCA e EXTINGUIR a Execução Fiscal;
d) Cancelamento e desconstituição da penhora sobre os bens da Embargante;
e) Condenação do Embargado em custas e honorários advocatícios (Art. 85 do CPC).

Dá-se à causa o valor de R$ ...

Nestes termos,
Pede deferimento.

Local ..., Data ...
Advogado ... / OAB ...`,
    tesesPrincipais: [
      "Extensão da imunidade recíproca à ECT prestadora de serviço postal em monopólio (Art. 150, VI, 'a' e § 2º da CF e STF)",
      "Não equiparação da ECT a estatais exploradoras de atividade econômica em concorrência (Art. 173, § 2º da CF)",
      "Cabimento dos embargos por garantia do juízo e prazo de 30 dias (Art. 16 LEF)"
    ],
    fundamentosNormativos: [
      "Art. 150, VI, 'a', CF/88",
      "Art. 150, § 2º, CF/88",
      "Art. 21, X, CF/88",
      "RE 601.392 STF (Tema 508)",
      "Art. 16 Lei 6.830/80"
    ],
    espelhoCorrecao: [
      { id: "c1", item: "Endereçamento", pontos: 0.10, descricao: "Vara Federal competente em razão da natureza de empresa pública federal", palavrasChave: ["vara federal", "distribuição por dependência"] },
      { id: "c2", item: "Tempestividade e Garantia", pontos: 0.40, descricao: "Demonstração do prazo de 30 dias e penhora válida pelo Art. 16 da LEF", palavrasChave: ["30 dias", "penhora", "art. 16"] },
      { id: "c3", item: "Imunidade Recíproca da ECT", pontos: 2.20, descricao: "Art. 150, VI, a e § 2º da CF, regime de monopólio e precedente do STF no RE 601.392", palavrasChave: ["imunidade recíproca", "art. 150, vi, a", "§ 2º", "ect", "monopólio postal", "tema 508"] },
      { id: "c4", item: "Serviço Público Essencial", pontos: 0.60, descricao: "Não incidência da vedação do Art. 173, § 2º da CF por não ser mercado concorrencial", palavrasChave: ["art. 173", "não concorrencial", "finalidades essenciais"] },
      { id: "c5", item: "Pedidos e Extinção", pontos: 1.30, descricao: "Extinção da execução, cancelamento da penhora, impugnação em 30 dias e honorários advocatícios", palavrasChave: ["extinção da execução", "cancelamento da penhora", "honorários", "art. 85"] },
      { id: "c6", item: "Fechamento", pontos: 0.40, descricao: "Valor da causa e fechamento regular", palavrasChave: ["valor da causa", "nestes termos", "advogado", "oab"] }
    ],
    dicaBanca: "Empresas públicas que prestam serviços públicos exclusivos em regime de monopólio (como os Correios) gozam de imunidade recíproca para seus imóveis operacionais."
  },
  {
    id: 18,
    exame: "Exame XXIV (24º Exame Unificado)",
    ano: "2017.3",
    peca: "Ação de Repetição de Indébito",
    titulo: "Repetição de Indébito: Restituição de ICMS-ST pago a maior quando a base real foi menor (Tema 201/STF)",
    enunciado: "A empresa Comércio de Bebidas Refrescantes Ltda., atuando como substituída tributária de ICMS, recolheu imposto por substituição para frente calculado com base em margem de valor agregado estimada de R$ 10,00 por unidade. Todavia, em virtude de crise de mercado, comprovou documentalmente que comercializou efetivamente todas as unidades ao consumidor final pelo preço de R$ 6,00. Tendo suportado o encargo e demonstrado a diferença, elabore a ação cabível pelo rito ordinário com arrimo no Tema 201 do STF para reaver o excesso pago.",
    esqueleto: `AO JUÍZO DA ... VARA DA FAZENDA PÚBLICA DA COMARCA DE ... DO ESTADO ...

AUTOR: COMÉRCIO DE BEBIDAS REFRESCANTES LTDA., [qualificação completa], por seu advogado infra-assinado.
RÉU: ESTADO ..., pessoa jurídica de direito público interno.
FUNDAMENTO LEGAL: Art. 150, § 7º, da CRFB/88; Art. 165, I, e Art. 166 do CTN e Art. 319 do CPC.

Ação: AÇÃO DE REPETIÇÃO DE INDÉBITO TRIBUTÁRIO

I. DA TEMPESTIVIDADE E PRAZO PRESCRICIONAL
- Ação ajuizada dentro do prazo de 5 anos a contar da data dos recolhimentos (Art. 168, I, do CTN).

II. DOS FATOS
[ESTRUTURA FÁTICA: O candidato deve demonstrar que a base presumida no ICMS-ST foi de R$ 10,00 e a base de cálculo real efetiva de venda foi de R$ 6,00].

III. DO DIREITO / DAS TESES E FUNDAMENTOS
1. Do Direito à Restituição da Diferença de ICMS-ST (Tema 201 do STF)
- Fundamento: Art. 150, § 7º, da CRFB/88 e tese vinculante firmada pelo Pleno do STF no RE 593.849 (Tema 201).
- [DESENVOLVIMENTO DO CANDIDATO: Explique que é devida a restituição da diferença do ICMS pago a mais no regime de substituição tributária para frente se a base de cálculo efetiva da operação for inferior à presumida].

2. Do Cumprimento do Art. 166 do CTN
- Fundamento: Art. 166 do Código Tributário Nacional.
- [DESENVOLVIMENTO DO CANDIDATO: Demonstre que a Autora assumiu integralmente o encargo financeiro ou que está autorizada a pleitear a devolução sem repasse ao consumidor].

3. Dos Juros e Correção Monetária
- Fundamento: Taxa SELIC (EC 113/2021) e Súmula 188 do STJ.

IV. DOS PEDIDOS E REQUERIMENTOS
a) Citação do Estado réu para, querendo, contestar a presente ação;
b) Procedência integral dos pedidos para CONDENAR o Réu a restituir à Autora a diferença recolhida a maior de ICMS-ST (R$ ...), corrigida pela Taxa SELIC;
c) Condenação do Estado nas custas e honorários advocatícios (Art. 85 do CPC);
d) Produção de todas as provas em direito admitidas, em especial a documental e pericial contábil;
e) Manifestação sobre a audiência de conciliação (Art. 319, VII, CPC).

Dá-se à causa o valor de R$ ...

Nestes termos,
Pede deferimento.

Local ..., Data ...
Advogado ... / OAB ...`,
    tesesPrincipais: [
      "Direito à restituição do ICMS-ST pago a maior quando a base efetiva é menor (Art. 150, § 7º da CF e Tema 201/STF)",
      "Observância dos requisitos do Art. 166 do CTN pelo contribuinte substituído",
      "Aplicação de juros e correção monetária pela Taxa SELIC (EC 113/2021)"
    ],
    fundamentosNormativos: [
      "Art. 150, § 7º, CF/88",
      "Tema 201 STF (RE 593.849)",
      "Art. 165, I, CTN",
      "Art. 166 CTN",
      "EC 113/2021"
    ],
    espelhoCorrecao: [
      { id: "c1", item: "Endereçamento", pontos: 0.10, descricao: "Vara da Fazenda Pública da Comarca competente", palavrasChave: ["vara", "fazenda pública"] },
      { id: "c2", item: "Qualificação e Fundamento", pontos: 0.20, descricao: "Autor e Réu qualificados, Art. 165, I do CTN e Art. 150, § 7º da CF", palavrasChave: ["repetição", "art. 165, i", "art. 150, § 7º"] },
      { id: "c3", item: "Tema 201 do STF", pontos: 2.20, descricao: "Restituição da diferença de ICMS-ST quando a base real for menor que a presumida (RE 593.849)", palavrasChave: ["tema 201", "re 593.849", "icms-st", "base real", "base presumida", "restituição"] },
      { id: "c4", item: "Art. 166 do CTN", pontos: 0.80, descricao: "Demonstração de que a empresa suportou o encargo financeiro sem repasse", palavrasChave: ["art. 166", "encargo financeiro", "substituído"] },
      { id: "c5", item: "Pedidos e Honorários", pontos: 1.30, descricao: "Condenação na restituição, citação, honorários de sucumbência e audiência do Art. 319, VII", palavrasChave: ["condenação", "citação", "honorários", "art. 85", "art. 319"] },
      { id: "c6", item: "Fechamento", pontos: 0.40, descricao: "Valor da causa no montante a repetir e fechamento", palavrasChave: ["valor da causa", "nestes termos", "advogado", "oab"] }
    ],
    dicaBanca: "Em repetição de indébito de tributos indiretos (como ICMS e IPI), a banca exige expressamente a referência ao Art. 166 do CTN (prova de não repasse do encargo ou autorização)."
  },
  {
    id: 19,
    exame: "Exame XXIII (23º Exame Unificado)",
    ano: "2017.2",
    peca: "Mandado de Segurança Repressivo",
    titulo: "MS Repressivo: Exigência Ilegal de Depósito Prévio para Recurso Administrativo (Súmula Vinculante 21)",
    enunciado: "A sociedade Construtora Aliança S.A. foi autuada pelo Fisco Municipal e interpôs recurso administrativo ordinário voluntário perante o Conselho de Contribuintes Municipal. O Auditor-Presidente da Junta de Julgamento inadmitiu e arquivou sumariamente o recurso pelo fato de a empresa não ter efetuado o depósito prévio de 30% do valor da autuação, exigência prevista em decreto do Prefeito. Como advogado(a), proponha a medida judicial cabível para afastar a exigência e garantir o seguimento do recurso administrativo.",
    esqueleto: `AO JUÍZO DA ... VARA DA FAZENDA PÚBLICA DA COMARCA DE ...

IMPETRANTE: CONSTRUTORA ALIANÇA S.A., [qualificação completa], por seu advogado infra-assinado (procuração anexa).
IMPETRADO: ATO COATOR DO PRESIDENTE DO CONSELHO MUNICIPAL DE TRIBUTOS DE ... vinculado ao MUNICÍPIO DE ...
FUNDAMENTO LEGAL: Art. 5º, LXIX, da CRFB/88; Lei nº 12.016/2009 e Súmula Vinculante 21 do STF.

Ação: MANDADO DE SEGURANÇA COM PEDIDO DE MEDIDA LIMINAR

I. DO CABIMENTO E TEMPESTIVIDADE
- Demonstração do cabimento: Direito líquido e certo violado por ato coator de inadmissão de recurso, comprovado de plano por prova documental.
- Tempestividade respeitada dentro do prazo de 120 dias do Art. 23 da Lei 12.016/09.

II. DOS FATOS
[ESTRUTURA FÁTICA: O candidato deve relatar a negativa de seguimento do recurso administrativo por falta de depósito recursal].

III. DO DIREITO / DAS TESES E FUNDAMENTOS
1. Da Inconstitucionalidade da Exigência de Depósito Prévio para Recurso Administrativo
- Fundamento: Súmula Vinculante 21 do STF (\"É inconstitucional a exigência de depósito ou arrolamento prévios de dinheiro ou bens para admissibilidade de recurso administrativo\").
- Fundamento: Súmula 373 do STJ e Art. 5º, XXXIV, \"a\", e LV, da CRFB/88 (Direito de Petição, Contraditório e Ampla Defesa).
- [DESENVOLVIMENTO DO CANDIDATO: Explique que a garantia constitucional do duplo grau administrativo e da ampla defesa veda condicionar o acesso recursal ao depósito prévio].

2. Da Suspensão da Exigibilidade do Crédito Tributário
- Fundamento: Art. 151, III, do CTN (as reclamações e recursos administrativos suspendem a exigibilidade fiscal).

IV. DA MEDIDA LIMINAR
- Fumus boni iuris: Violação frontal a Súmula Vinculante do Supremo Tribunal Federal.
- Periculum in mora: Risco de inscrição imediata em dívida ativa e execução judicial forçada.
- Fundamento: Art. 7º, III, da Lei nº 12.016/2009 e Art. 151, IV, do CTN.

V. DOS PEDIDOS E REQUERIMENTOS
a) Concessão da MEDIDA LIMINAR inaudita altera parte para suspender a exigibilidade do crédito tributário (Art. 151, IV, CTN) e determinar o destrancamento do recurso administrativo;
b) Notificação da Autoridade Coatora para prestar as informações de estilo;
c) Ciência do feito ao Município réu;
d) Intimação do Representante do Ministério Público;
e) Confirmação da liminar e CONCESSÃO DA SEGURANÇA para anular a decisão de arquivamento e determinar o regular processamento e julgamento do recurso administrativo sem a exigência de depósito prévio;
f) Sem condenação em honorários (Art. 25 da Lei 12.016/09).

Dá-se à causa o valor de R$ ...

Nestes termos,
Pede deferimento.

Local ..., Data ...
Advogado ... / OAB ...`,
    tesesPrincipais: [
      "Inconstitucionalidade do depósito prévio para admissibilidade de recurso administrativo (Súmula Vinculante 21 do STF)",
      "Violação à ampla defesa e ao direito de petição (Art. 5º, XXXIV, 'a' e LV da CF/88)",
      "Suspensão da exigibilidade do crédito tributário pelas impugnações e recursos administrativos (Art. 151, III do CTN)"
    ],
    fundamentosNormativos: [
      "Súmula Vinculante 21 STF",
      "Súmula 373 STJ",
      "Art. 5º, XXXIV, 'a' e LV, CF/88",
      "Art. 151, III e IV, CTN",
      "Lei 12.016/2009"
    ],
    espelhoCorrecao: [
      { id: "c1", item: "Endereçamento", pontos: 0.10, descricao: "Vara da Fazenda Pública da Comarca competente", palavrasChave: ["vara", "fazenda pública"] },
      { id: "c2", item: "Autoridade Coatora", pontos: 0.20, descricao: "Presidente do Conselho/Junta de Recursos com vinculação ao Município", palavrasChave: ["presidente", "conselho de contribuintes", "município"] },
      { id: "c3", item: "Súmula Vinculante 21 do STF", pontos: 2.20, descricao: "Demonstração de inconstitucionalidade do depósito ou arrolamento prévio (SV 21)", palavrasChave: ["súmula vinculante 21", "depósito prévio", "arrolamento", "recurso administrativo", "inconstitucional"] },
      { id: "c4", item: "Ampla Defesa e Petição (Art. 5º CF)", pontos: 0.60, descricao: "Art. 5º, XXXIV e LV da CF e Súmula 373 do STJ", palavrasChave: ["ampla defesa", "direito de petição", "art. 5º, lv", "súmula 373"] },
      { id: "c5", item: "Medida Liminar (Art. 7º, III)", pontos: 0.60, descricao: "Fumus boni iuris e periculum in mora para destrancar o recurso", palavrasChave: ["liminar", "fumus boni iuris", "periculum in mora", "art. 7º, iii"] },
      { id: "c6", item: "Pedidos e Destrancamento", pontos: 0.90, descricao: "Concessão da segurança para processamento do recurso sem depósito, notificação, ciência ao ente e MP", palavrasChave: ["concessão da segurança", "destrancamento", "notificação", "mp"] },
      { id: "c7", item: "Fechamento", pontos: 0.40, descricao: "Fechamento formal sem honorários advocatícios (Art. 25 Lei 12.016)", palavrasChave: ["sem honorários", "nestes termos", "advogado", "oab"] }
    ],
    dicaBanca: "Qualquer condicionamento pecuniário ou garantia de bens para que o recurso administrativo seja conhecido viola frontalmente a Súmula Vinculante 21 do STF."
  },
  {
    id: 20,
    exame: "Exame XXII (22º Exame Unificado)",
    ano: "2017.1",
    peca: "Agravo de Instrumento",
    titulo: "Agravo de Instrumento: Rejeição de EPE sobre Redirecionamento de Execução Fiscal a Sócio sem Dissolução Irregular (Súmula 430/STJ)",
    enunciado: "O juiz da 1ª Vara das Execuções Fiscais proferiu decisão interlocutória rejeitando a Exceção de Pré-Executividade oposta pelo sócio minoritário Marcos, mantendo o redirecionamento da execução fiscal movida pela Fazenda Nacional contra ele pelo simples inadimplemento de tributos pela sociedade, restando comprovado nos autos que a empresa continua ativa, com sede aberta e sem indício de dissolução irregular. A intimação ocorreu há 4 dias úteis. Elabore o recurso cabível diretamente ao Tribunal Regional Federal.",
    esqueleto: `AO EGRÉGIO TRIBUNAL REGIONAL FEDERAL DA ... REGIÃO

AGRAVANTE: MARCOS ..., [qualificação completa], por seu advogado infra-assinado.
AGRAVADA: UNIÃO (FAZENDA NACIONAL), pessoa jurídica de direito público interno.
ORIGEM: Execução Fiscal nº ... em curso perante a 1ª Vara Federal das Execuções Fiscais da Seção Judiciária de ...
FUNDAMENTO LEGAL: Art. 1.015, parágrafo único, e Art. 1.019, I, do Código de Processo Civil.

Recurso: AGRAVO DE INSTRUMENTO COM PEDIDO DE EFEITO SUSPENSIVO

I. DO CABIMENTO, TEMPESTIVIDADE E DISPENSA DE PREPARO
- Cabimento: Art. 1.015, parágrafo único, do CPC (decisões interlocutórias proferidas na fase de execução fiscal).
- Tempestividade: prazo de 15 dias úteis (Art. 1.003, § 5º, do CPC).
- Juntada de peças obrigatórias (Art. 1.017, I, do CPC).

II. DOS FATOS E DA DECISÃO INTERLOCUTÓRIA AGRAVADA
[ESTRUTURA FÁTICA: O candidato deve sintetizar a decisão que indeferiu a EPE e manteve a constrição de bens do sócio].

III. DAS RAZÕES RECURSAIS / TESES E FUNDAMENTOS
1. Da Ilegitimidade Passiva do Sócio e Inadmissibilidade do Redirecionamento por Mero Inadimplemento
- Fundamento: Art. 135, III, do CTN e Súmula 430 do STJ (\"O inadimplemento da obrigação tributária pela sociedade não gera, por si só, a responsabilidade solidária do sócio-gerente\").
- [DESENVOLVIMENTO DO CANDIDATO: Explique que o mero não pagamento de tributo não configura ato praticado com excesso de poderes ou infração à lei/estatuto, estando a empresa em pleno funcionamento regular].

2. Da Não Incidência da Súmula 435 do STJ
- [DESENVOLVIMENTO DO CANDIDATO: Destaque que a presunção de dissolução irregular da Súmula 435/STJ não se aplica, pois a sociedade está em funcionamento regular em seu domicílio fiscal].

IV. DO EFEITO SUSPENSIVO RECURSAL
- Fumus boni iuris: Entendimento pacificado do Superior Tribunal de Justiça na Súmula 430 e Tema Repetitivo 97.
- Periculum in mora: Risco iminente de penhora e bloqueio de contas bancárias do sócio.
- Fundamento: Art. 995, parágrafo único, e Art. 1.019, I, do CPC.

V. DOS PEDIDOS E REQUERIMENTOS
a) Concessão de EFEITO SUSPENSIVO ao agravo para suspender os atos constritivos em face do Agravante;
b) Intimação da Fazenda Nacional para apresentar contraminuta no prazo de 15 dias (Art. 1.019, II, do CPC);
c) No mérito, o PROVIMENTO INTEGRAL do agravo para reformar a decisão e acolher a EPE, excluindo o Agravante do polo passivo da Execução Fiscal;
d) Condenação da Agravada em honorários sucumbenciais (Art. 85 do CPC).

Nestes termos,
Pede deferimento.

Local ..., Data ...
Advogado ... / OAB ...`,
    tesesPrincipais: [
      "Cabimento de Agravo de Instrumento contra rejeição de EPE na execução (Art. 1.015, parágrafo único do CPC)",
      "Inadimplemento tributário não gera por si só a responsabilidade do sócio (Súmula 430 do STJ e Art. 135, III do CTN)",
      "Inaplicabilidade da dissolução irregular (Súmula 435/STJ) diante da empresa em atividade regular"
    ],
    fundamentosNormativos: [
      "Art. 1.015, parágrafo único, CPC",
      "Art. 1.019, I, CPC",
      "Súmula 430 STJ",
      "Art. 135, III, CTN",
      "Art. 995, parágrafo único, CPC"
    ],
    espelhoCorrecao: [
      { id: "c1", item: "Endereçamento", pontos: 0.10, descricao: "Tribunal Regional Federal competente (ad quem)", palavrasChave: ["tribunal regional federal", "trf"] },
      { id: "c2", item: "Cabimento Art. 1.015, Parágrafo Único", pontos: 0.40, descricao: "Decisão proferida no bojo de execução fiscal e prazo de 15 dias", palavrasChave: ["art. 1.015, parágrafo único", "execução fiscal", "15 dias"] },
      { id: "c3", item: "Súmula 430 do STJ", pontos: 2.20, descricao: "Mero inadimplemento da obrigação tributária não enseja redirecionamento ao sócio (Art. 135, III CTN)", palavrasChave: ["súmula 430", "art. 135, iii", "inadimplemento", "redirecionamento", "responsabilidade solidária"] },
      { id: "c4", item: "Empresa Ativa e Sede Regular", pontos: 0.50, descricao: "Demonstração de inocorrência de dissolução irregular da Súmula 435 do STJ", palavrasChave: ["dissolução irregular", "súmula 435", "empresa ativa"] },
      { id: "c5", item: "Efeito Suspensivo", pontos: 0.50, descricao: "Requisitos do Art. 995 e Art. 1.019, I do CPC", palavrasChave: ["efeito suspensivo", "art. 1.019, i", "art. 995"] },
      { id: "c6", item: "Pedidos e Exclusão do Polo Passivo", pontos: 0.90, descricao: "Reforma da decisão para acolher a EPE e excluir o sócio da execução fiscal", palavrasChave: ["provimento", "exclusão do polo passivo", "reforma", "honorários"] },
      { id: "c7", item: "Fechamento", pontos: 0.40, descricao: "Fechamento regular", palavrasChave: ["nestes termos", "advogado", "oab"] }
    ],
    dicaBanca: "Da decisão interlocutória que rejeita a Exceção de Pré-Executividade cabe Agravo de Instrumento fundado no Art. 1.015, parágrafo único, do CPC."
  },
  {
    id: 21,
    exame: "Exame XXI (21º Exame Unificado)",
    ano: "2016.3",
    peca: "Recurso de Apelação",
    titulo: "Apelação: Imunidade de IPTU sobre Imóvel Religioso Alugado (Súmula Vinculante 52)",
    enunciado: "Em Ação Anulatória promovida pela Igreja Evangélica Luz da Esperança contra o Município de Belo Horizonte, o juiz de primeiro grau julgou totalmente improcedente o pedido e manteve a cobrança de IPTU sobre imóvel de propriedade da igreja que se encontra locado para um comércio de confecções, afirmando que a locação desvirtuaria a imunidade dos templos de qualquer culto. Contudo, restou provado pericialmente que a totalidade dos aluguéis é vertida nas atividades assistenciais e de culto da igreja. A sentença foi disponibilizada há 7 dias úteis. Elabore o recurso cabível.",
    esqueleto: `[FOLHA DE INTERPOSIÇÃO]
AO JUÍZO DA ... VARA DA FAZENDA PÚBLICA MUNICIPAL DA COMARCA DE BELO HORIZONTE/MG

Autos da Ação Anulatória nº ...
APELANTE: IGREJA EVANGÉLICA LUZ DA ESPERANÇA, já qualificada nos autos.
APELADO: MUNICÍPIO DE BELO HORIZONTE, pessoa jurídica de direito público interno.
FUNDAMENTO LEGAL: Art. 1.009 e seguintes do CPC.

Recurso: RECURSO DE APELAÇÃO

Vem a Apelante, respeitosamente, interpor o presente RECURSO DE APELAÇÃO, requerendo o recebimento no duplo efeito (Art. 1.012 do CPC) e a intimação do Apelado para contrarrazões em 15 dias (Art. 1.010, § 1º, do CPC), com posterior remessa ao Egrégio Tribunal de Justiça de Minas Gerais.

Nestes termos,
Pede deferimento.

Local ..., Data ...
Advogado ... / OAB ...

============================================================

[FOLHA DE RAZÕES RECURSAIS]
AO EGRÉGIO TRIBUNAL DE JUSTIÇA DO ESTADO DE MINAS GERAIS

APELANTE: IGREJA EVANGÉLICA LUZ DA ESPERANÇA
APELADO: MUNICÍPIO DE BELO HORIZONTE
Autos de Origem nº ...

RAZÕES DO RECURSO DE APELAÇÃO

I. DA TEMPESTIVIDADE E DA ISENÇÃO DE CUSTAS
- Prazo de 15 dias úteis (Art. 1.003, § 5º, CPC).
- Entidade assistencial/religiosa com isenção/justiça gratuita requerida.

II. BREVE SÍNTESE DO PROCESSO
[ESTRUTURA FÁTICA: O candidato deve relatar o equívoco da sentença ao afastar a imunidade sobre imóvel locado cujos rendimentos revertem aos objetivos institucionais].

III. DO DIREITO / DA REFORMA DA SENTENÇA
1. Da Imunidade Religiosa sobre Imóvel Alugado (Súmula Vinculante 52 do STF)
- Fundamento: Art. 150, VI, \"b\", e § 4º, da CRFB/88; Súmula Vinculante 52 do STF (\"Ainda quando alugado a terceiros, permanece imune ao IPTU o imóvel pertencente a qualquer das entidades referidas pelo pelo art. 150, VI, 'c', da CF, desde que o valor dos aluguéis seja aplicado nas atividades para as quais tais entidades foram constituídas\").
- Aplicação idêntica aos templos religiosos (Súmula 724 do STF e Art. 150, § 4º, da CF).
- [DESENVOLVIMENTO DO CANDIDATO: Explique que a destinação dos frutos civis da locação às atividades finalísticas da igreja garante a manutenção da imunidade tributária].

IV. DOS PEDIDOS E REQUERIMENTOS
a) Conhecimento e recebimento da apelação no duplo efeito (Art. 1.012 do CPC);
b) No mérito, o PROVIMENTO INTEGRAL do recurso para REFORMAR a r. sentença e julgar PROCEDENTE a ação anulatória, desconstituindo o lançamento de IPTU;
c) Inversão dos ônus de sucumbência, condenando o Município nas custas e honorários advocatícios (Art. 85 do CPC).

Nestes termos,
Pede deferimento.

Local ..., Data ...
Advogado ... / OAB ...`,
    tesesPrincipais: [
      "Imunidade de IPTU sobre imóvel de entidade imune alugado a terceiros cujos aluguéis revertem às atividades essenciais (Súmula Vinculante 52 e Súmula 724 do STF)",
      "Imunidade dos templos de qualquer culto e seu patrimônio (Art. 150, VI, 'b' e § 4º da CF/88)",
      "Cabimento de Apelação para reforma da sentença de mérito (Art. 1.009 CPC)"
    ],
    fundamentosNormativos: [
      "Art. 150, VI, 'b', CF/88",
      "Art. 150, § 4º, CF/88",
      "Súmula Vinculante 52 STF",
      "Súmula 724 STF",
      "Art. 1.009 CPC"
    ],
    espelhoCorrecao: [
      { id: "c1", item: "Estrutura Bipartida", pontos: 0.30, descricao: "Interposição perante juiz da vara da fazenda e razões ao Tribunal de Justiça", palavrasChave: ["interposição", "razões", "juiz a quo", "tribunal de justiça"] },
      { id: "c2", item: "Tempestividade", pontos: 0.20, descricao: "Interposição dentro do prazo legal de 15 dias úteis", palavrasChave: ["15 dias úteis", "art. 1.003"] },
      { id: "c3", item: "Súmula Vinculante 52 do STF", pontos: 2.20, descricao: "Imóvel alugado a terceiros permanece imune se o valor do aluguel é vertido às finalidades essenciais", palavrasChave: ["súmula vinculante 52", "súmula 724", "alugado", "renda revertida", "finalidades essenciais"] },
      { id: "c4", item: "Art. 150, VI, 'b' e § 4º da CF", pontos: 0.60, descricao: "Proteção constitucional aos templos de qualquer culto e seu patrimônio", palavrasChave: ["templos", "art. 150, vi, b", "§ 4º"] },
      { id: "c5", item: "Pedidos e Sucumbência", pontos: 1.30, descricao: "Provimento, reforma da sentença, procedência da anulatória e condenação em honorários (Art. 85 CPC)", palavrasChave: ["provimento", "reforma", "procedência", "honorários"] },
      { id: "c6", item: "Fechamento", pontos: 0.40, descricao: "Fechamento regular", palavrasChave: ["nestes termos", "advogado", "oab"] }
    ],
    dicaBanca: "O imóvel de entidade religiosa ou assistencial alugado a terceiro continua imune ao IPTU DESDE QUE os aluguéis sejam revertidos às atividades essenciais da entidade (SV 52 e Súmula 724 do STF)."
  },
  {
    id: 22,
    exame: "Exame XX (20º Exame Unificado)",
    ano: "2016.2",
    peca: "Ação Anulatória com Pedido de Tutela Antecipada",
    titulo: "Ação Anulatória: Decadência do Direito de Lançar Tributo Sujeito a Homologação sem Pagamento (Art. 173, I, do CTN)",
    enunciado: "A sociedade Indústria de Calçados Couro Bom Ltda. foi notificada em 15 de fevereiro de 2026 de lançamento de ofício lavrado pela Receita Federal cobrando IPI referente a fatos geradores ocorridos em março de 2019, período em que a empresa não recolheu qualquer valor nem entregou declaração com reconhecimento de dívida. O contribuinte pretende a desconstituição do crédito tributário diante da extinção do direito da Fazenda Pública de efetuar o lançamento de ofício. Elabore a peça cabível pelo rito ordinário com pedido liminar.",
    esqueleto: `AO JUÍZO DA ... VARA FEDERAL DA SEÇÃO JUDICIÁRIA DE ...

AUTORA: INDÚSTRIA DE CALÇADOS COURO BOM LTDA., [qualificação completa], por seu advogado infra-assinado.
RÉ: UNIÃO (FAZENDA NACIONAL), pessoa jurídica de direito público interno.
FUNDAMENTO LEGAL: Art. 38 da Lei nº 6.830/1980 e Art. 300 do CPC c/c Art. 173, I, do CTN.

Ação: AÇÃO ANULATÓRIA DE DÉBITO FISCAL COM PEDIDO DE TUTELA PROVISÓRIA DE URGÊNCIA

I. DO CABIMENTO DA AÇÃO ANULATÓRIA
- Ação adequada para anular o ato administrativo de lançamento fiscal indevido (Art. 38 da Lei 6.830/80 e Art. 19, I, do CPC).

II. DOS FATOS
[ESTRUTURA FÁTICA: O candidato deve demonstrar as datas do fato gerador em 2019 e da notificação do lançamento em 2026, com ausência de pagamento antecipado].

III. DO DIREITO / DA CONSUMAÇÃO DA DECADÊNCIA
1. Da Regra de Decadência do Art. 173, I, do CTN (Ausência de Pagamento Antecipado)
- Fundamento: Art. 173, I, do CTN e Súmula 555 do STJ.
- [DESENVOLVIMENTO DO CANDIDATO: Explique que nos tributos sujeitos a homologação, inexistindo pagamento antecipado e sem declaração, a regra de decadência é a do Art. 173, I, do CTN: 5 anos a contar do primeiro dia do exercício seguinte àquele em que o lançamento poderia ter sido efetuado].
- Termo inicial: 01/01/2020. Termo final: 31/12/2024. Notificação tardia em 2026.

2. Da Extinção do Crédito Tributário pela Decadência
- Fundamento: Art. 156, V, do CTN.
- [DESENVOLVIMENTO DO CANDIDATO: Conclua que a decadência extingue o próprio direito material da Fazenda Pública de lançar].

IV. DA TUTELA PROVISÓRIA DE URGÊNCIA
- Probabilidade do direito evidente pelo decurso de prazo decadencial objetivo.
- Perigo de dano consubstanciado no risco de inscrição em Dívida Ativa e CADIN.
- Fundamento: Art. 300 do CPC e Art. 151, V, do CTN.

V. DOS PEDIDOS E REQUERIMENTOS
a) Concessão da TUTELA PROVISÓRIA DE URGÊNCIA para suspender a exigibilidade do crédito tributário (Art. 151, V, do CTN);
b) Citação da União;
c) Procedência do pedido para DECLARAR A DECADÊNCIA e ANULAR definitivamente o auto de infração de IPI;
d) Condenação da Ré em custas e honorários advocatícios (Art. 85 do CPC);
e) Produção de todas as provas em direito admitidas;
f) Manifestação sobre a audiência de conciliação (Art. 319, VII, CPC).

Dá-se à causa o valor de R$ ...

Nestes termos,
Pede deferimento.

Local ..., Data ...
Advogado ... / OAB ...`,
    tesesPrincipais: [
      "Decadência do direito de lançar tributo sujeito a homologação sem pagamento antecipado (Art. 173, I do CTN e Súmula 555/STJ)",
      "Extinção do crédito tributário pela decadência consumada (Art. 156, V do CTN)",
      "Tutela de urgência para suspensão da exigibilidade do crédito tributário (Art. 151, V do CTN e Art. 300 CPC)"
    ],
    fundamentosNormativos: [
      "Art. 173, I, CTN",
      "Súmula 555 STJ",
      "Art. 156, V, CTN",
      "Art. 38 Lei 6.830/80",
      "Art. 300 CPC",
      "Art. 151, V, CTN"
    ],
    espelhoCorrecao: [
      { id: "c1", item: "Endereçamento", pontos: 0.10, descricao: "Vara Federal da Seção Judiciária competente", palavrasChave: ["vara federal", "seção judiciária"] },
      { id: "c2", item: "Qualificação e Fundamento", pontos: 0.20, descricao: "Autor e Réu qualificados com base no Art. 38 da LEF e CPC", palavrasChave: ["anulatória", "art. 38", "união"] },
      { id: "c3", item: "Regra do Art. 173, I do CTN", pontos: 2.20, descricao: "Contagem do prazo decadencial do primeiro dia do exercício seguinte (01/01/2020 até 31/12/2024) e Súmula 555 do STJ", palavrasChave: ["art. 173, i", "exercício seguinte", "decadência", "súmula 555", "5 anos"] },
      { id: "c4", item: "Extinção pelo Art. 156, V do CTN", pontos: 0.50, descricao: "Decadência como causa de extinção do crédito tributário", palavrasChave: ["art. 156, v", "extinção do crédito"] },
      { id: "c5", item: "Tutela de Urgência (Art. 300 CPC)", pontos: 0.70, descricao: "Requisitos do Art. 300 e suspensão da exigibilidade pelo Art. 151, V do CTN", palavrasChave: ["tutela provisória", "art. 300", "art. 151, v"] },
      { id: "c6", item: "Pedidos e Sucumbência", pontos: 0.90, descricao: "Anulação definitiva, citação, honorários de sucumbência (Art. 85 CPC) e audiência do Art. 319, VII", palavrasChave: ["anulação", "citação", "honorários", "art. 85", "art. 319"] },
      { id: "c7", item: "Fechamento", pontos: 0.40, descricao: "Valor da causa no montante do auto de infração e fechamento", palavrasChave: ["valor da causa", "nestes termos", "advogado", "oab"] }
    ],
    dicaBanca: "Em tributo por homologação sem qualquer pagamento ou declaração prévia, aplica-se estritamente o Art. 173, I, do CTN (primeiro dia do exercício seguinte), e NUNCA o Art. 150, § 4º (Súmula 555 do STJ)."
  },
  {
    id: 23,
    exame: "Exame XIX (19º Exame Unificado)",
    ano: "2016.1",
    peca: "Embargos à Execução Fiscal",
    titulo: "Embargos à Execução: Penhora Excessiva sobre o Faturamento da Empresa",
    enunciado: "A sociedade Hospitalar Saúde Total Ltda. teve deferida penhora sobre 40% do seu faturamento bruto mensal na Execução Fiscal movida pelo Estado. A intimação da penhora ocorreu há 18 dias. A empresa comprova que a retenção de 40% do faturamento compromete a compra de insumos hospitalares, medicamentos e a folha salarial dos médicos, inviabilizando a continuidade do funcionamento da unidade hospitalar. Elabore a peça de defesa cabível demonstrando o excesso e a violação ao princípio da menor onerosidade.",
    esqueleto: `AO JUÍZO DA ... VARA DA FAZENDA PÚBLICA ESTADUAL DA COMARCA DE ...
(Distribuído por dependência aos autos da Execução Fiscal nº ...)

EMBARGANTE: HOSPITALAR SAÚDE TOTAL LTDA., [qualificação completa], por seu advogado infra-assinado.
EMBARGADO: ESTADO ..., pessoa jurídica de direito público interno.
FUNDAMENTO LEGAL: Art. 16 da Lei nº 6.830/1980 e Art. 805 e Art. 866 do Código de Processo Civil.

Ação: EMBARGOS À EXECUÇÃO FISCAL COM PEDIDO DE EFEITO SUSPENSIVO

I. DA TEMPESTIVIDADE E DA GARANTIA DO JUÍZO
- Tempestividade comprovada: prazo de 30 dias contados da intimação da penhora (Art. 16, III, da LEF).
- Juízo garantido pela ordem de penhora sobre faturamento.

II. DOS FATOS
[ESTRUTURA FÁTICA: O candidato deve relatar o percentual excessivo de 40% sobre o faturamento hospitalar e os impactos nas atividades vitais de saúde].

III. DO DIREITO / DAS TESES E FUNDAMENTOS
1. Do Princípio da Menor Onerosidade para o Devedor
- Fundamento: Art. 805 do Código de Processo Civil.
- [DESENVOLVIMENTO DO CANDIDATO: Explique que a execução deve ser processada pelo modo menos gravoso para o executado, evitando a ruína da atividade empresarial].

2. Da Violação aos Limites Legais da Penhora sobre Faturamento
- Fundamento: Art. 866, § 1º, do Código de Processo Civil.
- [DESENVOLVIMENTO DO CANDIDATO: Demonstre que a penhora de faturamento é medida excepcional e deve ser fixada em percentual que não inviabilize o funcionamento da empresa (jurisprudência consolidada em patamares de 5% a 10%)].

3. Da Função Social da Empresa e Continuidade dos Serviços Médicos
- Fundamento: Art. 170, III, da CRFB/88 e Art. 196 da CRFB/88 (Direito à Saúde).

IV. DO EFEITO SUSPENSIVO AOS EMBARGOS
- Garantia do juízo e perigo manifesto de colapso no atendimento de urgência e emergência aos pacientes.
- Fundamento: Art. 919, § 1º, do CPC.

V. DOS PEDIDOS E REQUERIMENTOS
a) Concessão de EFEITO SUSPENSIVO aos embargos para suspender ou limitar a constrição de faturamento;
b) Intimação do Estado Embargado para apresentar impugnação em 30 dias (Art. 17 da LEF);
c) Acolhimento dos embargos para REDUZIR substancialmente a penhora para percentual módico (ex: 5%) ou determinar a substituição da penhora;
d) Condenação do Embargado em custas e honorários advocatícios (Art. 85 do CPC).

Dá-se à causa o valor de R$ ...

Nestes termos,
Pede deferimento.

Local ..., Data ...
Advogado ... / OAB ...`,
    tesesPrincipais: [
      "Princípio da menor onerosidade da execução para o devedor (Art. 805 do CPC)",
      "Limitação e excepcionalidade da penhora sobre faturamento para não inviabilizar a empresa (Art. 866, § 1º do CPC)",
      "Preservação da empresa e continuidade de serviços essenciais de saúde (Art. 170 e Art. 196 da CF)"
    ],
    fundamentosNormativos: [
      "Art. 805 CPC",
      "Art. 866, § 1º, CPC",
      "Art. 919, § 1º, CPC",
      "Art. 16 Lei 6.830/80",
      "Art. 170 CF/88"
    ],
    espelhoCorrecao: [
      { id: "c1", item: "Endereçamento e Dependência", pontos: 0.10, descricao: "Vara de Execuções e distribuição por dependência", palavrasChave: ["distribuição por dependência", "execução fiscal"] },
      { id: "c2", item: "Tempestividade", pontos: 0.40, descricao: "Prazo de 30 dias do Art. 16, III da LEF comprovado", palavrasChave: ["30 dias", "art. 16, iii"] },
      { id: "c3", item: "Art. 866, § 1º do CPC", pontos: 2.00, descricao: "Penhora de faturamento não pode inviabilizar a atividade empresarial", palavrasChave: ["art. 866, § 1º", "faturamento", "inviabilizar", "excepcional"] },
      { id: "c4", item: "Menor Onerosidade (Art. 805 CPC)", pontos: 0.80, descricao: "Execução pelo modo menos gravoso para o executado", palavrasChave: ["art. 805", "menor onerosidade", "menos gravoso"] },
      { id: "c5", item: "Efeito Suspensivo", pontos: 0.40, descricao: "Perigo de dano irreparável à atividade médica e Art. 919, § 1º CPC", palavrasChave: ["efeito suspensivo", "art. 919, § 1º"] },
      { id: "c6", item: "Pedidos e Sucumbência", pontos: 0.90, descricao: "Redução do percentual, impugnação em 30 dias e honorários de sucumbência", palavrasChave: ["redução", "honorários", "art. 85"] },
      { id: "c7", item: "Fechamento", pontos: 0.40, descricao: "Fechamento regular", palavrasChave: ["nestes termos", "advogado", "oab"] }
    ],
    dicaBanca: "Penhora sobre faturamento de empresas jamais pode comprometer o fluxo de caixa a ponto de impedir a continuidade da atividade empresarial (Art. 866, §1º do CPC)."
  },
  {
    id: 24,
    exame: "Exame XVIII (18º Exame Unificado)",
    ano: "2015.3",
    peca: "Mandado de Segurança Repressivo",
    titulo: "MS Repressivo: Bloqueio de Emissão de Notas Fiscais Eletrônicas por Débito Tributário (Súmula 70/STF)",
    enunciado: "A sociedade comercial Distribuidora de Alimentos Santa Tereza Ltda. foi sumariamente bloqueada no sistema fazendário estadual pelo Delegado da Receita Estadual, ficando impedida de emitir notas fiscais eletrônicas de venda (NF-e) sob a justificativa de que possui débitos pendentes de ICMS em aberto. Em virtude do bloqueio, os caminhões não podem circular e as mercadorias correm risco de deterioração. Como advogado(a), proponha a medida constitucional cabível com pedido liminar para restabelecer a autorização de emissão dos documentos fiscais.",
    esqueleto: `AO JUÍZO DA ... VARA DA FAZENDA PÚBLICA DA COMARCA DE ... DO ESTADO ...

IMPETRANTE: DISTRIBUIDORA DE ALIMENTOS SANTA TEREZA LTDA., [qualificação completa], por seu advogado infra-assinado (procuração anexa).
IMPETRADO: ATO COATOR DO ILUSTRÍSSIMO SENHOR DELEGADO REGIONAL DA RECEITA ESTADUAL DE ... vinculado ao ESTADO ...
FUNDAMENTO LEGAL: Art. 5º, LXIX, da CRFB/88; Lei nº 12.016/2009 e Súmulas 70 e 547 do STF.

Ação: MANDADO DE SEGURANÇA COM PEDIDO DE MEDIDA LIMINAR

I. DO CABIMENTO E TEMPESTIVIDADE
- Demonstração do direito líquido e certo à emissão de documentos fiscais para o exercício da atividade comercial.
- Prova documental pré-constituída do bloqueio telemático e respeito ao prazo de 120 dias.

II. DOS FATOS
[ESTRUTURA FÁTICA: O candidato deve relatar o bloqueio de NF-e e a coerção inconstitucional do Fisco estadual].

III. DO DIREITO / DAS TESES E FUNDAMENTOS
1. Da Inadmissibilidade de Sanções Políticas e Interdição de Atividades Comerciais
- Fundamento: Súmula 70 do STF (\"É inadmissível a interdição de estabelecimento como meio coercitivo para cobrança de tributo\").
- Fundamento: Súmula 547 do STF (\"Não é lícito à autoridade proibir que o contribuinte em débito adquira estampilhas, despache mercadorias nas alfândegas e exerça suas atividades profissionais\").
- [DESENVOLVIMENTO DO CANDIDATO: Explique que o bloqueio da emissão de notas fiscais equivale a interdição e paralisação forçada da empresa, configurando sanção política abusiva].

2. Da Violação ao Livre Exercício da Atividade Econômica
- Fundamento: Art. 170, parágrafo único, e Art. 5º, XIII, da CRFB/88.

IV. DA MEDIDA LIMINAR
- Fumus boni iuris: Fundamentação arrimada em súmulas históricas do Supremo Tribunal Federal.
- Periculum in mora: Risco iminente de paralisação total das vendas e deterioração de alimentos perecíveis.
- Fundamento: Art. 7º, III, da Lei nº 12.016/2009.

V. DOS PEDIDOS E REQUERIMENTOS
a) Concessão da MEDIDA LIMINAR inaudita altera parte para restabelecer imediatamente a liberação da emissão de Notas Fiscais Eletrônicas (NF-e);
b) Notificação da Autoridade Coatora para prestar informações no prazo de 10 dias;
c) Ciência ao órgão de representação judicial do Estado;
d) Intimação do Representante do Ministério Público;
e) Confirmação da liminar e CONCESSÃO DEFINITIVA DA SEGURANÇA;
f) Isenção de sucumbência honorária (Art. 25 da Lei 12.016/09).

Dá-se à causa o valor de R$ ...

Nestes termos,
Pede deferimento.

Local ..., Data ...
Advogado ... / OAB ...`,
    tesesPrincipais: [
      "Inadmissibilidade do bloqueio de notas fiscais como sanção política de cobrança (Súmulas 70 e 547 do STF)",
      "Violação à liberdade de exercício de atividade econômica lícita (Art. 170, parágrafo único e Art. 5º, XIII da CF)",
      "Cabimento da liminar em Mandado de Segurança (Art. 7º, III da Lei 12.016/09)"
    ],
    fundamentosNormativos: [
      "Súmula 70 STF",
      "Súmula 547 STF",
      "Art. 170, parágrafo único, CF/88",
      "Art. 5º, XIII e LXIX, CF/88",
      "Lei 12.016/2009"
    ],
    espelhoCorrecao: [
      { id: "c1", item: "Endereçamento", pontos: 0.10, descricao: "Vara da Fazenda Pública da Comarca competente", palavrasChave: ["vara", "fazenda pública"] },
      { id: "c2", item: "Autoridade Coatora", pontos: 0.20, descricao: "Delegado da Receita Estadual e pessoa jurídica de direito público", palavrasChave: ["delegado", "receita estadual", "estado"] },
      { id: "c3", item: "Súmula 70 do STF", pontos: 1.50, descricao: "Inadmissibilidade de interdição de atividades como meio coercitivo de cobrança de tributo", palavrasChave: ["súmula 70", "interdição", "meio coercitivo", "sanção política"] },
      { id: "c4", item: "Súmula 547 do STF e Livre Iniciativa", pontos: 1.20, descricao: "Súmula 547 do STF e Art. 170, parágrafo único da CF garantindo o livre exercício da atividade", palavrasChave: ["súmula 547", "art. 170", "livre iniciativa", "notas fiscais"] },
      { id: "c5", item: "Medida Liminar (Art. 7º, III)", pontos: 0.70, descricao: "Fumus boni iuris e periculum in mora em vista do perecimento de alimentos", palavrasChave: ["liminar", "periculum in mora", "art. 7º, iii"] },
      { id: "c6", item: "Pedidos Completos", pontos: 0.90, descricao: "Desbloqueio definitivo, notificação, ciência ao Estado, oitiva do MP e sem honorários", palavrasChave: ["concessão da segurança", "desbloqueio", "notificação", "mp", "art. 25"] },
      { id: "c7", item: "Fechamento", pontos: 0.40, descricao: "Fechamento regular", palavrasChave: ["nestes termos", "advogado", "oab"] }
    ],
    dicaBanca: "O Fisco não pode travar a emissão de notas fiscais nem fechar estabelecimentos para forçar o recolhimento de impostos em aberto (Súmulas 70, 323 e 547 do STF)."
  },
  {
    id: 25,
    exame: "Exame XVII (17º Exame Unificado)",
    ano: "2015.2",
    peca: "Ação Declaratória com Tutela de Urgência",
    titulo: "Declaratória: Imunidade Musical de Fonogramas e Videofonogramas Nacionais (Art. 150, VI, 'e')",
    enunciado: "A gravadora Som Brasileiro Produções Artísticas Ltda. pretende lançar no mercado álbum musical contendo gravações de artistas e compositores brasileiros gravadas em estúdio nacional. O Município Alfa notificou a produtora comunicando que exigirá ISS sobre as etapas de masterização e produção dos suportes físicos e digitais, sustentando que a imunidade da Emenda Constitucional 75/2013 se aplicaria exclusivamente ao ICMS. Como advogado(a), elabore a ação declaratória para resguardar a imunidade constitucional plena com pedido de tutela provisória.",
    esqueleto: `AO JUÍZO DA ... VARA DA FAZENDA PÚBLICA DA COMARCA DE ALFA

AUTORA: SOM BRASILEIRO PRODUÇÕES ARTÍSTICAS LTDA., [qualificação completa], por seu advogado infra-assinado.
RÉU: MUNICÍPIO DE ALFA, pessoa jurídica de direito público interno.
FUNDAMENTO LEGAL: Art. 19, I, e Art. 300 do CPC c/c Art. 150, VI, \"e\", da CRFB/88.

Ação: AÇÃO DECLARATÓRIA DE INEXISTÊNCIA DE RELAÇÃO JURÍDICO-TRIBUTÁRIA C/C TUTELA PROVISÓRIA DE URGÊNCIA

I. DO CABIMENTO DA AÇÃO DECLARATÓRIA
- Ação adequada para prevenir exigência tributária inconstitucional e declarar a inexistência de obrigação antes do lançamento formal (Art. 19, I, do CPC).

II. DOS FATOS
[ESTRUTURA FÁTICA: O candidato deve sintetizar a pretensão municipal indevida de cobrar ISS sobre produção musical protegida por imunidade].

III. DO DIREITO / DAS TESES E FUNDAMENTOS
1. Da Imunidade Constitucional Musical da Emenda Constitucional nº 75/2013
- Fundamento: Art. 150, VI, \"e\", da Constituição da República de 1988.
- [DESENVOLVIMENTO DO CANDIDATO: Explique que a imunidade recai sobre fonogramas e videofonogramas musicais produzidos no Brasil contendo obras de autores brasileiros, alcançando indistintamente os impostos estaduais e municipais sobre a cadeia produtiva].

2. Do Alcance Geral das Imunidades do Art. 150, VI, da CRFB/88
- Fundamento: O Art. 150, VI, estabelece expressamente a proibição de instituir IMPOSTOS, vinculando União, Estados, DF e Municípios.

IV. DA TUTELA PROVISÓRIA DE URGÊNCIA
- Fumus boni iuris: Literalidade do texto constitucional da alínea \"e\" do inciso VI do Art. 150 da CF.
- Periculum in mora: Risco de cancelamento de contratos e inviabilização do lançamento do álbum musical.
- Fundamento: Art. 300 do CPC e Art. 151, V, do CTN.

V. DOS PEDIDOS E REQUERIMENTOS
a) Concessão da TUTELA PROVISÓRIA DE URGÊNCIA para suspender qualquer ato de cobrança ou lançamento tributário de ISS (Art. 151, V, CTN);
b) Citação do Município réu;
c) Procedência do pedido para DECLARAR a imunidade tributária e a inexistência de relação jurídico-tributária;
d) Condenação do Município em custas e honorários advocatícios (Art. 85 do CPC);
e) Produção de todas as provas em direito admitidas;
f) Manifestação sobre a audiência de conciliação (Art. 319, VII, CPC).

Dá-se à causa o valor de R$ ...

Nestes termos,
Pede deferimento.

Local ..., Data ...
Advogado ... / OAB ...`,
    tesesPrincipais: [
      "Imunidade dos fonogramas e videofonogramas musicais brasileiros (Art. 150, VI, 'e' da CF/88)",
      "A imunidade do Art. 150, VI veda a instituição de quaisquer IMPOSTOS por todos os entes federados",
      "Cabimento da tutela de urgência e da ação declaratória (Art. 19, I e Art. 300 CPC)"
    ],
    fundamentosNormativos: [
      "Art. 150, VI, 'e', CF/88",
      "EC nº 75/2013",
      "Art. 19, I, CPC",
      "Art. 300 CPC",
      "Art. 151, V, CTN"
    ],
    espelhoCorrecao: [
      { id: "c1", item: "Endereçamento", pontos: 0.10, descricao: "Vara da Fazenda Pública da Comarca competente", palavrasChave: ["vara", "fazenda pública"] },
      { id: "c2", item: "Qualificação e Fundamento", pontos: 0.20, descricao: "Autor e Réu qualificados com base no Art. 19, I do CPC", palavrasChave: ["declaratória", "art. 19, i", "município"] },
      { id: "c3", item: "Imunidade Musical (Art. 150, VI, 'e')", pontos: 2.20, descricao: "Demonstração da imunidade sobre fonogramas e obras musicais brasileiras extensiva a todos os impostos", palavrasChave: ["art. 150, vi, 'e'", "ec 75/2013", "fonogramas", "imunidade musical", "impostos"] },
      { id: "c4", item: "Tutela de Urgência", pontos: 0.70, descricao: "Requisitos do Art. 300 do CPC e suspensão da exigibilidade pelo Art. 151, V do CTN", palavrasChave: ["tutela provisória", "art. 300", "art. 151, v"] },
      { id: "c5", item: "Pedidos e Sucumbência", pontos: 1.40, descricao: "Declaração de imunidade, citação, honorários de sucumbência (Art. 85 CPC) e audiência do Art. 319, VII", palavrasChave: ["declaração de imunidade", "honorários", "art. 85", "art. 319"] },
      { id: "c6", item: "Fechamento", pontos: 0.40, descricao: "Valor da causa e encerramento regular", palavrasChave: ["valor da causa", "nestes termos", "advogado", "oab"] }
    ],
    dicaBanca: "A imunidade da 'música nacional' (Art. 150, VI, 'e' da CF) abrange fonogramas e videofonogramas musicais produzidos no Brasil com obras de autores brasileiros, atingindo impostos em todas as esferas."
  },
  {
    id: 26,
    exame: "Exame XVI (16º Exame Unificado)",
    ano: "2015.1",
    peca: "Recurso Ordinário Constitucional (ROC)",
    titulo: "Recurso Ordinário Constitucional: Denegação de MS Originário pelo Tribunal de Justiça",
    enunciado: "A Associação dos Médicos de Clínicas Privadas impetrou Mandado de Segurança de competência originária perante o Tribunal de Justiça do Estado Alfa contra ato do Governador do Estado que vetou a aplicação de alíquota diferenciada de ICMS. O Tribunal de Justiça, em decisão colegiada (acórdão), DENEGOU a segurança em única instância. O acórdão foi publicado há 12 dias úteis. Elabore o recurso cabível para levar a apreciação da matéria ao Superior Tribunal de Justiça.",
    esqueleto: `[FOLHA DE INTERPOSIÇÃO]
AO EXCELENTÍSSIMO SENHOR DESEMBARGADOR PRESIDENTE DO EGRÉGIO TRIBUNAL DE JUSTIÇA DO ESTADO ALFA

Autos do Mandado de Segurança nº ... (Competência Originária)
RECORRENTE: ASSOCIAÇÃO DOS MÉDICOS DE CLÍNICAS PRIVADAS, já qualificada nos autos.
RECORRIDO: ESTADO ALFA, pessoa jurídica de direito público interno.
FUNDAMENTO LEGAL: Art. 105, II, \"b\", da Constituição da República de 1988 e Art. 1.027, II, \"a\", do Código de Processo Civil.

Recurso: RECURSO ORDINÁRIO CONSTITUCIONAL

Vem a Recorrente interpor RECURSO ORDINÁRIO CONSTITUCIONAL em face do v. acórdão de fls. ..., requerendo a juntada do comprovante de preparo.
Requer o recebimento do recurso, a intimação do Recorrido para contrarrazões em 15 dias (Art. 1.028, § 2º, CPC) e a posterior remessa dos autos ao Colendo Superior Tribunal de Justiça.

Nestes termos,
Pede deferimento.

Local ..., Data ...
Advogado ... / OAB ...

============================================================

[FOLHA DE RAZÕES RECURSAIS]
AO COLENDO SUPERIOR TRIBUNAL DE JUSTIÇA

RECORRENTE: ASSOCIAÇÃO DOS MÉDICOS DE CLÍNICAS PRIVADAS
RECORRIDO: ESTADO ALFA
Processo de Origem nº ... - TJALFA

RAZÕES DO RECURSO ORDINÁRIO CONSTITUCIONAL

I. DO CABIMENTO E TEMPESTIVIDADE
- Cabimento: Art. 105, II, \"b\", da CRFB/88 (Mandados de segurança decididos em única instância pelos Tribunais de Justiça quando denegatória a decisão).
- Tempestividade: prazo de 15 dias úteis (Art. 1.003, § 5º, do CPC).
- Preparo devidamente comprovado.

II. BREVE RELATO DOS FATOS
[ESTRUTURA FÁTICA: O candidato deve sintetizar o acórdão que denegou o MS de competência originária do TJ].

III. DO DIREITO / DAS RAZÕES DE REFORMA DO ACÓRDÃO
1. Da Violação a Direito Líquido e Certo e Precedentes Vinculantes
- [DESENVOLVIMENTO DO CANDIDATO: Desenvolva a tese material demonstrando o direito dos contribuintes à correta subsunção tributária e legalidade].

IV. DOS PEDIDOS E REQUERIMENTOS
a) Conhecimento e recebimento do presente Recurso Ordinário Constitucional;
b) Oitiva do Ministério Público Federal;
c) No mérito, o PROVIMENTO INTEGRAL do recurso para REFORMAR o v. acórdão recorrido e CONCEDER A SEGURANÇA pleiteada;
d) Sem honorários advocatícios (Art. 25 da Lei 12.016/09 e Súmula 105/STJ).

Nestes termos,
Pede deferimento.

Local ..., Data ...
Advogado ... / OAB ...`,
    tesesPrincipais: [
      "Cabimento do Recurso Ordinário Constitucional perante o STJ contra MS denegado em única instância por TJ (Art. 105, II, 'b' da CF)",
      "Estrutura bipartida do recurso com folha de interposição perante o Presidente do TJ e razões ao STJ",
      "Regime recursal do Art. 1.027, II, 'a' do CPC"
    ],
    fundamentosNormativos: [
      "Art. 105, II, 'b', CF/88",
      "Art. 1.027, II, 'a', CPC",
      "Art. 1.028 CPC",
      "Lei 12.016/2009",
      "Súmula 105 STJ"
    ],
    espelhoCorrecao: [
      { id: "c1", item: "Folha de Interposição", pontos: 0.30, descricao: "Endereçada ao Desembargador Presidente do TJ de origem com pedido de contrarrazões e remessa ao STJ", palavrasChave: ["desembargador presidente", "tribunal de justiça", "contrarrazões", "remessa ao stj"] },
      { id: "c2", item: "Folha de Razões ao STJ", pontos: 0.20, descricao: "Endereçada ao Colendo Superior Tribunal de Justiça (ad quem)", palavrasChave: ["superior tribunal de justiça", "stj", "razões"] },
      { id: "c3", item: "Cabimento Art. 105, II, 'b' da CF", pontos: 2.00, descricao: "Decisão denegatória de Mandado de Segurança de competência originária de Tribunal de Justiça", palavrasChave: ["art. 105, ii, 'b'", "ms denegado", "competência originária", "única instância", "recurso ordinário"] },
      { id: "c4", item: "Tempestividade e Preparo", pontos: 0.30, descricao: "Prazo de 15 dias úteis e guia de preparo anexada", palavrasChave: ["15 dias úteis", "preparo"] },
      { id: "c5", item: "Oitiva do MPF", pontos: 0.40, descricao: "Pedido de intimação do Ministério Público Federal em grau recursal", palavrasChave: ["ministério público federal", "mpf"] },
      { id: "c6", item: "Pedidos Recursais", pontos: 1.40, descricao: "Conhecimento, provimento integral, reforma do acórdão e concessão da segurança sem honorários (Art. 25)", palavrasChave: ["conhecimento", "provimento", "concessão da segurança", "sem honorários", "art. 25"] },
      { id: "c7", item: "Fechamento", pontos: 0.40, descricao: "Fechamento regular", palavrasChave: ["nestes termos", "advogado", "oab"] }
    ],
    dicaBanca: "Quando o Mandado de Segurança é impetrado diretamente no Tribunal de Justiça (competência originária) e a ordem é denegada, o recurso cabível para o STJ é o Recurso Ordinário Constitucional (Art. 105, II, 'b' da CF), e NÃO Recurso Especial."
  },
  {
    id: 27,
    exame: "Exame XV (15º Exame Unificado)",
    ano: "2014.3",
    peca: "Ação de Repetição de Indébito",
    titulo: "Repetição de Indébito: Não Incidência de ITR sobre Área de Preservação Permanente (Lei 9.393/96)",
    enunciado: "O produtor rural Fazenda Verdejante Ltda. recolheu ITR sobre a totalidade de seu imóvel rural nos últimos 4 anos, incluindo 30% da propriedade que constitui Área de Preservação Permanente (APP) e Reserva Legal devidamente averbada e registrada no Cadastro Ambiental Rural (CAR). O Fisco Federal recusou a restituição administrativa sob pretexto de ausência de Ato Declaratório Ambiental (ADA) tempestivo. Elabore a petição inicial da ação cabível para obter a repetição judicial do indébito tributário.",
    esqueleto: `AO JUÍZO DA ... VARA FEDERAL DA SEÇÃO JUDICIÁRIA DE ...

AUTOR: FAZENDA VERDEJANTE LTDA., [qualificação completa], por seu advogado infra-assinado.
RÉU: UNIÃO (FAZENDA NACIONAL), pessoa jurídica de direito público interno.
FUNDAMENTO LEGAL: Art. 10, § 1º, II, da Lei nº 9.393/1996 e Art. 165, I, do CTN.

Ação: AÇÃO DE REPETIÇÃO DE INDÉBITO TRIBUTÁRIO

I. DA TEMPESTIVIDADE E PRAZO PRESCRICIONAL
- Ação ajuizada dentro do quinquênio prescricional do Art. 168, I, do CTN.

II. DOS FATOS
[ESTRUTURA FÁTICA: O candidato deve relatar o recolhimento de ITR sobre áreas de APP e Reserva Legal registradas no CAR e a recusa da Receita Federal].

III. DO DIREITO / DAS TESES E FUNDAMENTOS
1. Da Não Incidência / Isenção de ITR sobre Áreas de Preservação Permanente
- Fundamento: Art. 10, § 1º, II, \"a\", da Lei nº 9.393/1996 e Art. 153, VI, da CRFB/88.
- [DESENVOLVIMENTO DO CANDIDATO: Explique que as áreas de preservação permanente e reserva legal são excluídas da área tributável do ITR por expressa determinação de lei federal].

2. Da Desnecessidade do Ato Declaratório Ambiental (ADA) quando Comprovada a Área por Cadastro Ambiental Rural (CAR)
- Jurisprudência pacificada do STJ (Súmula 643 e Tema Repetitivo 1.012 do STJ).
- [DESENVOLVIMENTO DO CANDIDATO: Demonstre que a ausência ou atraso do ADA não impede o contribuinte de comprovar a existência da área de preservação por outros meios idôneos como o CAR].

3. Do Direito à Repetição do Indébito e Taxa SELIC
- Fundamento: Art. 165, I, do CTN e EC 113/2021.

IV. DOS PEDIDOS E REQUERIMENTOS
a) Citação da União;
b) Procedência do pedido para CONDENAR a Ré a restituir a quantia indevidamente paga a título de ITR sobre a área não tributável (R$ ...), acrescida da Taxa SELIC;
c) Condenação da União em custas e honorários advocatícios (Art. 85 do CPC);
d) Produção de todas as provas em direito admitidas, em especial a documental e pericial;
e) Opção sobre a audiência de conciliação (Art. 319, VII, CPC).

Dá-se à causa o valor de R$ ...

Nestes termos,
Pede deferimento.

Local ..., Data ...
Advogado ... / OAB ...`,
    tesesPrincipais: [
      "Exclusão da área de preservação permanente e reserva legal da base de cálculo do ITR (Art. 10, § 1º, II da Lei 9.393/96)",
      "Desnecessidade de exigência formal do ADA quando comprovada a vegetação nativa por perícia ou CAR (STJ)",
      "Repetição de indébito tributário com atualização pela Selic (Art. 165, I CTN e EC 113/21)"
    ],
    fundamentosNormativos: [
      "Art. 10, § 1º, II, Lei 9.393/96",
      "Art. 165, I, CTN",
      "Art. 168, I, CTN",
      "Art. 153, VI, CF/88",
      "Tema 1.012 STJ"
    ],
    espelhoCorrecao: [
      { id: "c1", item: "Endereçamento", pontos: 0.10, descricao: "Vara Federal da Seção Judiciária competente", palavrasChave: ["vara federal", "seção judiciária"] },
      { id: "c2", item: "Qualificação e Fundamento", pontos: 0.20, descricao: "Autor e Réu qualificados, Art. 165, I do CTN e Lei do ITR", palavrasChave: ["repetição", "art. 165, i", "união"] },
      { id: "c3", item: "Área Não Tributável de ITR (Art. 10 Lei 9.393/96)", pontos: 2.20, descricao: "Exclusão das áreas de preservação permanente da base de cálculo do ITR", palavrasChave: ["art. 10", "lei 9.393/96", "preservação permanente", "reserva legal", "não tributável"] },
      { id: "c4", item: "Desnecessidade de ADA / Precedente STJ", pontos: 0.80, descricao: "Demonstração de que a falta do ADA prévio não retira a isenção legal ambiental", palavrasChave: ["ada", "ato declaratório ambiental", "car", "jurisprudência stj"] },
      { id: "c5", item: "Pedidos e Honorários", pontos: 1.30, descricao: "Condenação na restituição com Selic, citação, honorários de sucumbência e audiência do Art. 319, VII", palavrasChave: ["condenação", "selic", "honorários", "art. 85", "art. 319"] },
      { id: "c6", item: "Fechamento", pontos: 0.40, descricao: "Valor da causa equivalente ao valor a restituir e encerramento", palavrasChave: ["valor da causa", "nestes termos", "advogado", "oab"] }
    ],
    dicaBanca: "Áreas de Preservação Permanente (APP) e Reserva Legal não integram a área tributável do ITR por expressa disposição da Lei 9.393/96."
  },
  {
    id: 28,
    exame: "Exame XIV (14º Exame Unificado)",
    ano: "2014.2",
    peca: "Embargos à Execução Fiscal",
    titulo: "Embargos à Execução: Cobrança Indevida de ITBI antes do Registro Translativo",
    enunciado: "O Município Beta ajuizou Execução Fiscal contra a compradora Maria da Silva cobrando débito de ITBI fundado exclusivamente na assinatura de contrato particular de promessa de compra e venda de imóvel residencial urbano. Maria teve penhorada sua conta bancária e foi intimada há 14 dias. Redija a peça de defesa mais ampla admitida, sustentando a inexigibilidade do tributo diante da ausência de fato gerador.",
    esqueleto: `AO JUÍZO DA ... VARA DA FAZENDA PÚBLICA MUNICIPAL DA COMARCA DE BETA
(Distribuído por dependência aos autos da Execução Fiscal nº ...)

EMBARGANTE: MARIA DA SILVA, [qualificação completa], por seu advogado infra-assinado.
EMBARGADO: MUNICÍPIO BETA, pessoa jurídica de direito público interno.
FUNDAMENTO LEGAL: Art. 16 da Lei nº 6.830/80 e Art. 156, II, da CRFB/88 c/c Art. 1.245 do Código Civil.

Ação: EMBARGOS À EXECUÇÃO FISCAL COM PEDIDO DE EFEITO SUSPENSIVO

I. DA TEMPESTIVIDADE E DA GARANTIA DO JUÍZO
- Tempestividade demonstrada: prazo de 30 dias contados da intimação da constrição (Art. 16, III, da LEF).
- Juízo integralmente garantido pela penhora realizada nos autos executivos.

II. DOS FATOS
[ESTRUTURA FÁTICA: O candidato deve narrar a cobrança de ITBI sobre mera promessa particular de compra e venda sem registro em cartório].

III. DO DIREITO / DAS TESES E FUNDAMENTOS
1. Da Inocorrência do Fato Gerador do ITBI em Promessa de Compra e Venda
- Fundamento: Art. 156, II, da CRFB/88; Art. 35 do CTN; Art. 1.227 e Art. 1.245 do Código Civil e Tema 1.124 do STF.
- [DESENVOLVIMENTO DO CANDIDATO: Explique que o compromisso particular de compra e venda gera apenas direito pessoal e não transmite a propriedade imobiliária, a qual se transfere exclusivamente mediante o registro no RGI].

2. Da Iliquidez e Inexigibilidade da CDA
- Fundamento: Art. 803, I, do Código de Processo Civil.

IV. DO EFEITO SUSPENSIVO
- Relevância da fundamentação jurídica e perigo de desapossamento de patrimônio pessoal.
- Fundamento: Art. 919, § 1º, do CPC.

V. DOS PEDIDOS E REQUERIMENTOS
a) Concessão de EFEITO SUSPENSIVO aos presentes embargos;
b) Intimação do Município Embargado para apresentar impugnação no prazo de 30 dias (Art. 17 da LEF);
c) Acolhimento integral dos embargos para EXTINGUIR a Execução Fiscal com resolução de mérito (Art. 487, II, do CPC), cancelando-se a CDA;
d) Desconstituição e liberação da penhora sobre a conta bancária da Embargante;
e) Condenação do Embargado nas custas e honorários advocatícios (Art. 85 do CPC).

Dá-se à causa o valor de R$ ...

Nestes termos,
Pede deferimento.

Local ..., Data ...
Advogado ... / OAB ...`,
    tesesPrincipais: [
      "Inocorrência de fato gerador do ITBI em promessa ou compromisso de compra e venda (Tema 1.124/STF e Art. 1.245 do CC)",
      "Cabimento dos embargos à execução fiscal garantido o juízo no prazo de 30 dias (Art. 16 LEF)",
      "Nulidade da execução e desconstituição da penhora (Art. 803, I do CPC)"
    ],
    fundamentosNormativos: [
      "Art. 156, II, CF/88",
      "Art. 35 CTN",
      "Art. 1.245 Código Civil",
      "Tema 1.124 STF",
      "Art. 16 Lei 6.830/80"
    ],
    espelhoCorrecao: [
      { id: "c1", item: "Endereçamento e Dependência", pontos: 0.10, descricao: "Vara da Fazenda Pública competente e distribuição por dependência", palavrasChave: ["distribuição por dependência", "fazenda pública"] },
      { id: "c2", item: "Garantia e Tempestividade", pontos: 0.40, descricao: "Prazo de 30 dias e penhora comprovada nos termos do Art. 16 da LEF", palavrasChave: ["30 dias", "penhora", "art. 16"] },
      { id: "c3", item: "Fato Gerador do ITBI (Registro em RGI)", pontos: 2.20, descricao: "Art. 156, II da CF, Art. 1.245 do CC e Tema 1.124 do STF (necessidade de registro)", palavrasChave: ["fato gerador", "itbi", "registro de imóveis", "art. 1.245", "tema 1.124", "promessa de compra e venda"] },
      { id: "c4", item: "Efeito Suspensivo", pontos: 0.50, descricao: "Garantia do juízo e requisitos do Art. 919, § 1º do CPC", palavrasChave: ["efeito suspensivo", "art. 919, § 1º"] },
      { id: "c5", item: "Pedidos e Desconstituição da Penhora", pontos: 1.40, descricao: "Extinção da execução fiscal, liberação da penhora, impugnação em 30 dias e honorários de sucumbência", palavrasChave: ["extinção da execução", "liberação da penhora", "honorários", "art. 85"] },
      { id: "c6", item: "Fechamento", pontos: 0.40, descricao: "Valor da causa e encerramento regular", palavrasChave: ["valor da causa", "nestes termos", "advogado", "oab"] }
    ],
    dicaBanca: "O ITBI não incide sobre contrato de promessa de compra e venda, escritura pública sem registro ou cessão de direitos possessórios (Tema 1.124/STF)."
  },
  {
    id: 29,
    exame: "Exame XIII (13º Exame Unificado)",
    ano: "2014.1",
    peca: "Mandado de Segurança Preventivo",
    titulo: "MS Preventivo: Cobrança de Taxa de Fiscalização de Anúncio Interno em Shopping",
    enunciado: "A empresa Moda Jovem Roupas Ltda., locatária de loja em centro de compras (shopping center), foi notificada formalmente pelo Fisco Municipal de que na próxima semana será lavrado auto de infração cobrando Taxa de Fiscalização de Anúncios e Publicidade (TFA) sobre os cartazes e manequins de vitrine expostos exclusivamente no interior da loja. Elabore a peça judicial adequada com pedido liminar para obstar o lançamento da taxa.",
    esqueleto: `AO JUÍZO DA ... VARA DA FAZENDA PÚBLICA DA COMARCA DE ...

IMPETRANTE: MODA JOVEM ROUPAS LTDA., [qualificação completa], por seu advogado infra-assinado (procuração anexa).
IMPETRADO: ATO COATOR AMEAÇADO PELO SECRETÁRIO MUNICIPAL DE FINANÇAS DE ... vinculado ao MUNICÍPIO DE ...
FUNDAMENTO LEGAL: Art. 5º, LXIX, da CRFB/88; Art. 1º da Lei nº 12.016/2009 e Art. 145, II, da CRFB/88.

Ação: MANDADO DE SEGURANÇA PREVENTIVO COM PEDIDO DE MEDIDA LIMINAR

I. DO CABIMENTO DO MANDADO DE SEGURANÇA PREVENTIVO
- Ameaça concreta e iminente de lançamento tributário indevido demonstrada por notificação prévia de fiscalização (Art. 1º da Lei 12.016/09).

II. DOS FATOS
[ESTRUTURA FÁTICA: O candidato deve relatar a pretensão de tributar anúncios e vitrines estritamente internas sem visualização pública exterior].

III. DO DIREITO / DAS TESES E FUNDAMENTOS
1. Da Ausência de Poder de Polícia Municipal sobre Publicidade Interna em Estabelecimento Privado
- Fundamento: Art. 145, II, da CRFB/88 e Art. 77 e Art. 78 do CTN.
- [DESENVOLVIMENTO DO CANDIDATO: Explique que a taxa de fiscalização pressupõe o exercício regular do poder de polícia sobre impacto no espaço público urbano e paisagem visual da cidade, não podendo incidir sobre anúncios internos sem visibilidade da rua].

2. Do Princípio da Legalidade e Tipicidade
- Fundamento: Art. 150, I, da CRFB/88.

IV. DA MEDIDA LIMINAR
- Fumus boni iuris: Falta de competência tributária para fiscalizar propaganda puramente interna.
- Periculum in mora: Risco iminente de lançamento de pesadas multas e restrições cadastrais.
- Fundamento: Art. 7º, III, da Lei nº 12.016/2009.

V. DOS PEDIDOS E REQUERIMENTOS
a) Concessão da MEDIDA LIMINAR inaudita altera parte determinando à autoridade coatora que se abstenha de efetuar o lançamento da taxa sobre a publicidade interna;
b) Notificação da autoridade coatora;
c) Ciência do feito ao Município;
d) Intimação do Representante do Ministério Público;
e) Confirmação da liminar e CONCESSÃO DEFINITIVA DA SEGURANÇA para declarar a imunidade/inexigibilidade da taxa;
f) Sem honorários advocatícios (Art. 25 da Lei 12.016/09).

Dá-se à causa o valor de R$ ...

Nestes termos,
Pede deferimento.

Local ..., Data ...
Advogado ... / OAB ...`,
    tesesPrincipais: [
      "Ilegalidade da taxa de publicidade sobre anúncios internos sem visibilidade da via pública (Art. 145, II da CF e Art. 78 do CTN)",
      "Inexistência de poder de polícia municipal justificante da exação fiscal",
      "Via preventiva do Mandado de Segurança diante de ameaça concreta (Art. 1º da Lei 12.016/09)"
    ],
    fundamentosNormativos: [
      "Art. 145, II, CF/88",
      "Art. 77 e Art. 78 CTN",
      "Art. 150, I, CF/88",
      "Art. 1º Lei 12.016/09",
      "Art. 7º, III, Lei 12.016/09"
    ],
    espelhoCorrecao: [
      { id: "c1", item: "Endereçamento", pontos: 0.10, descricao: "Vara da Fazenda Pública da Comarca competente", palavrasChave: ["vara", "fazenda pública"] },
      { id: "c2", item: "Cabimento Preventivo", pontos: 0.40, descricao: "Justo receio e prova pré-constituída da ameaça de fiscalização", palavrasChave: ["preventivo", "justo receio", "lei 12.016"] },
      { id: "c3", item: "Poder de Polícia (Art. 145, II CF e Art. 78 CTN)", pontos: 2.20, descricao: "Ausência de poder de polícia sobre anúncios exclusivamente internos em estabelecimento privado", palavrasChave: ["poder de polícia", "art. 145, ii", "art. 78 ctn", "anúncio interno", "paisagem urbana"] },
      { id: "c4", item: "Medida Liminar (Art. 7º, III)", pontos: 0.70, descricao: "Fumus boni iuris e periculum in mora em face da iminência do auto", palavrasChave: ["liminar", "periculum in mora", "art. 7º, iii"] },
      { id: "c5", item: "Pedidos Completos", pontos: 1.20, descricao: "Ordem de abstenção definitiva de lançamento, notificação, ciência ao Município, MP e sem sucumbência", palavrasChave: ["concessão da segurança", "abstenção", "notificação", "mp", "art. 25"] },
      { id: "c6", item: "Fechamento", pontos: 0.40, descricao: "Fechamento regular", palavrasChave: ["nestes termos", "advogado", "oab"] }
    ],
    dicaBanca: "Taxas municipais de fiscalização de publicidade exigem a afixação visível em logradouro público ou impacto no ordenamento urbano; vitrines internas em shoppings não sofrem incidência."
  },
  {
    id: 30,
    exame: "Exame XII (12º Exame Unificado)",
    ano: "2013.3",
    peca: "Exceção de Pré-Executividade",
    titulo: "Exceção de Pré-Executividade: Nulidade da Citação por Edital sem Esgotamento das Vias Ordinárias (Súmula 414/STJ)",
    enunciado: "O Estado Gama ajuizou Execução Fiscal contra a sociedade Indústria Têxtil Moderna Ltda. e, após uma única tentativa frustrada do oficial de justiça no endereço anterior constante do cadastro antigo, requereu imediatamente a citação por edital, a qual foi deferida de plano pelo juiz, culminando em penhora online de ativos financeiros (bloqueio Bacenjud/Sisbajud). A empresa comprova que alterou seu endereço na Junta Comercial de forma pública há mais de 2 anos e nunca se esquivou. Elabore a medida de defesa cabível para anular a citação editalícia e desbloquear os ativos.",
    esqueleto: `AO JUÍZO DA ... VARA DAS EXECUÇÕES FISCAIS ESTADUAIS DA COMARCA DE ...
(Autos da Execução Fiscal nº ...)

EXCIPIENTE: INDÚSTRIA TÊXTIL MODERNA LTDA., já qualificada nos autos da Execução Fiscal em epígrafe, por seu advogado infra-assinado.
EXCEPTA: ESTADO GAMA, pessoa jurídica de direito público interno.
FUNDAMENTO LEGAL: Súmula 414 do Superior Tribunal de Justiça e Art. 8º da Lei nº 6.830/1980 c/c Art. 280 do CPC.

Peça: EXCEÇÃO DE PRÉ-EXECUTIVIDADE COM PEDIDO DE ANULAÇÃO DA CITAÇÃO E DESBLOQUEIO DE ATIVOS

I. DO CABIMENTO DA EXCEÇÃO DE PRÉ-EXECUTIVIDADE
- Matéria de ordem pública referente a vício transrescisório de citação, arguível a qualquer tempo sem necessidade de prévia garantia do juízo (Súmula 393 do STJ).

II. DOS FATOS
[ESTRUTURA FÁTICA: O candidato deve demonstrar que a citação por edital ocorreu sem esgotamento de diligências e com alteração regular de endereço na Junta Comercial].

III. DO DIREITO / DAS TESES E FUNDAMENTOS
1. Da Nulidade Absoluta da Citação por Edital sem o Esgotamento Prévio de Outros Meios de Localização
- Fundamento: Súmula 414 do STJ (\"A citação por edital na execução fiscal é cabível apenas quando esgotadas as outras modalidades de citação e frustradas as diligências para localização do devedor\").
- Fundamento: Art. 8º da Lei nº 6.830/80 e Art. 256, § 3º, do CPC.
- [DESENVOLVIMENTO DO CANDIDATO: Explique que a citação por edital é medida subsidiária e excepcional, e sua utilização prematura acarreta nulidade insanável de todos os atos posteriores].

2. Da Nulidade do Bloqueio de Ativos Financeiros Decorrente de Citação Inválida
- Fundamento: Art. 280 e Art. 281 do CPC.

IV. DOS PEDIDOS E REQUERIMENTOS
a) Conhecimento e processamento da presente Exceção de Pré-Executividade;
b) Determinação IMEDIATA DE DESBLOQUEIO dos ativos financeiros constritos nas contas bancárias da Excipiente;
c) Intimação do Excepto para manifestação;
d) Acolhimento da exceção para DECLARAR A NULIDADE ABSOLUTA da citação por edital e de todos os atos constritivos subsequentes;
e) Renovação do ato citatório no endereço regular e atualizado da executada;
f) Condenação do Excepto ao pagamento de custas e honorários advocatícios (Súmula 153/STJ).

Nestes termos,
Pede deferimento.

Local ..., Data ...
Advogado ... / OAB ...`,
    tesesPrincipais: [
      "Nulidade da citação por edital realizada sem o prévio esgotamento de diligências de localização (Súmula 414 do STJ)",
      "Cabimento de EPE para arguir vício absoluto de citação sem garantia do juízo (Súmula 393 do STJ)",
      "Desconstituição dos atos constritivos e desbloqueio imediato de valores (Art. 280 do CPC)"
    ],
    fundamentosNormativos: [
      "Súmula 414 STJ",
      "Súmula 393 STJ",
      "Art. 8º Lei 6.830/80",
      "Art. 256, § 3º, CPC",
      "Art. 280 CPC"
    ],
    espelhoCorrecao: [
      { id: "c1", item: "Endereçamento", pontos: 0.10, descricao: "Vara de Execuções Fiscais onde tramita a ação", palavrasChave: ["vara", "execuções fiscais"] },
      { id: "c2", item: "Cabimento da EPE", pontos: 0.40, descricao: "Matéria de ordem pública referente a nulidade de citação arguível por EPE (Súmula 393 STJ)", palavrasChave: ["súmula 393", "ordem pública", "sem garantia"] },
      { id: "c3", item: "Súmula 414 do STJ (Citação por Edital)", pontos: 2.30, descricao: "Demonstração de que a citação por edital na LEF pressupõe o esgotamento cabal das diligências (Art. 8º LEF e Súmula 414 STJ)", palavrasChave: ["súmula 414", "edital", "esgotamento de diligências", "art. 8º", "subsidiária", "nulidade da citação"] },
      { id: "c4", item: "Desbloqueio de Ativos", pontos: 0.80, descricao: "Desconstituição imediata da penhora de dinheiro decorrente de ato nulo (Art. 280 CPC)", palavrasChave: ["desbloqueio", "penhora online", "art. 280", "nulidade"] },
      { id: "c5", item: "Pedidos Completos", pontos: 1.00, descricao: "Declaração de nulidade, desbloqueio de contas, renovação de citação e honorários", palavrasChave: ["nulidade", "desbloqueio", "renovação", "honorários"] },
      { id: "c6", item: "Fechamento", pontos: 0.40, descricao: "Fechamento regular", palavrasChave: ["nestes termos", "advogado", "oab"] }
    ],
    dicaBanca: "A citação por edital em Execução Fiscal exige obrigatoriamente a comprovação de que foram esgotados os meios ordinários de localização do executado (Súmula 414 do STJ)."
  },
  {
    id: 31,
    exame: "Exame XI (11º Exame Unificado)",
    ano: "2013.2",
    peca: "Ação de Consignação em Pagamento",
    titulo: "Consignatória: Conflito de Competência entre Estado e Município (ICMS x ISS) sobre Fornecimento de Software",
    enunciado: "A empresa Tecnologia e Desenvolvimento Ltda. desenvolve programas de computador por encomenda personalizada e fornece o suporte técnico correspondente. O Estado e o Município estão exigindo simultaneamente o pagamento integral de ICMS e ISS, respectivamente, sobre o valor total do mesmo contrato, lavrando autos de infração e recusando-se a receber o tributo sem renúncia à bitributação. Proponha a ação judicial adequada para depositar o montante devido e liberar o contribuinte.",
    esqueleto: `AO JUÍZO DA ... VARA DA FAZENDA PÚBLICA DA COMARCA DE ...

AUTORA: TECNOLOGIA E DESENVOLVIMENTO LTDA., [qualificação completa], por seu advogado infra-assinado.
RÉUS: ESTADO ... e MUNICÍPIO ..., pessoas jurídicas de direito público interno.
FUNDAMENTO LEGAL: Art. 164, III, do CTN e Art. 539 e Art. 547 do CPC.

Ação: AÇÃO DE CONSIGNAÇÃO EM PAGAMENTO C/C PEDIDO DE DEPÓSITO JUDICIAL

I. DO CABIMENTO DA CONSIGNAÇÃO EM PAGAMENTO TRIBUTÁRIA
- Cabimento expresso diante da exigência concomitante de mais de um ente da Federação sobre o mesmo fato gerador (Art. 164, III, do CTN).

II. DOS FATOS
[ESTRUTURA FÁTICA: O candidato deve relatar o conflito de competência federativa entre Estado (ICMS) e Município (ISS) sobre desenvolvimento de software].

III. DO DIREITO / DA DEFINIÇÃO DO TRIBUTO DEVIDO
1. Da Inadmissibilidade da Bitributação
- Fundamento: A Constituição veda a sobreposição impositiva sobre o mesmo fato jurídico.

2. Da Incidência Exclusiva de ISS sobre Desenvolvimento de Software e Cessão de Uso
- Fundamento: Subitem 1.05 da Lista Anexa da Lei Complementar nº 116/2003 e julgamento das ADIs 5659 e 5576 pelo STF.
- [DESENVOLVIMENTO DO CANDIDATO: Explique que o STF pacificou a incidência exclusiva de ISS sobre operações envolvendo programas de computador (software), afastando o ICMS].

3. Do Efeito Liberatório do Depósito Judicial
- Fundamento: Art. 164, § 2º, e Art. 151, II, do CTN.

IV. DOS PEDIDOS E REQUERIMENTOS
a) Autorização judicial para efetuar o DEPÓSITO INTEGRAL no prazo de 5 dias (Art. 542, I, CPC), com a suspensão da exigibilidade de ambos os tributos (Art. 151, II, CTN);
b) Citação do ESTADO e do MUNICÍPIO para contestarem a ação ou comparecerem para provar seu direito ao crédito depositado (Art. 547 do CPC);
c) Procedência do pedido para DECLARAR EXTINTA a obrigação da Autora pelo depósito efetuado;
d) Reconhecimento da competência do ente legítimo (Município para fins de ISS) com levantamento do valor em seu favor e condenação do ente sucumbente (Estado) em honorários (Art. 85 do CPC);
e) Produção de todas as provas em direito admitidas.

Dá-se à causa o valor de R$ ...

Nestes termos,
Pede deferimento.

Local ..., Data ...
Advogado ... / OAB ...`,
    tesesPrincipais: [
      "Cabimento da Consignatória contra Estado e Município em litisconsórcio passivo (Art. 164, III do CTN)",
      "Incidência exclusiva de ISS sobre operações com softwares (ADIs 5659 e 5576 do STF e LC 116/03)",
      "Eficácia extintiva e suspensiva do depósito judicial integral (Art. 151, II e Art. 164, § 2º do CTN)"
    ],
    fundamentosNormativos: [
      "Art. 164, III, CTN",
      "Art. 151, II, CTN",
      "LC 116/2003 (item 1.05)",
      "ADIs 5659 e 5576 STF",
      "Art. 547 CPC"
    ],
    espelhoCorrecao: [
      { id: "c1", item: "Endereçamento", pontos: 0.10, descricao: "Vara da Fazenda Pública competente", palavrasChave: ["vara", "fazenda pública"] },
      { id: "c2", item: "Polo Passivo Duplo", pontos: 0.30, descricao: "Inclusão conjunta de Estado e Município como réus em litisconsórcio", palavrasChave: ["estado", "município", "réus", "litisconsórcio"] },
      { id: "c3", item: "Cabimento da Consignatória (Art. 164, III)", pontos: 1.80, descricao: "Bitributação e exigência simultânea pelo mesmo fato gerador (Art. 164, III do CTN)", palavrasChave: ["art. 164, iii", "consignação", "exigência simultânea", "bitributação"] },
      { id: "c4", item: "Competência do ISS (Software)", pontos: 1.20, descricao: "Demonstração de que sobre software incide ISS e não ICMS conforme STF e LC 116/03", palavrasChave: ["software", "iss", "lc 116/03", "adi 5659", "stf"] },
      { id: "c5", item: "Depósito e Pedidos", pontos: 1.20, descricao: "Autorização de depósito em 5 dias, citação de ambos, quitação e honorários sucumbenciais", palavrasChave: ["depósito", "5 dias", "quitação", "honorários", "art. 85"] },
      { id: "c6", item: "Fechamento", pontos: 0.40, descricao: "Valor da causa no montante consignado e fechamento", palavrasChave: ["valor da causa", "nestes termos", "advogado", "oab"] }
    ],
    dicaBanca: "Em litígio entre Estado e Município por ICMS e ISS sobre software, o STF firmou tese de que incide apenas ISS (LC 116/03)."
  },
  {
    id: 32,
    exame: "Exame X (10º Exame Unificado)",
    ano: "2013.1",
    peca: "Ação Anulatória com Tutela de Urgência",
    titulo: "Ação Anulatória: Contribuição de Melhoria Cobrada sem Prévia Notificação e sem Demonstração da Valorização Imobiliária",
    enunciado: "O Município Ômega realizou obras de pavimentação asfáltica e notificou os moradores da Rua dos Cravos da exigência de 'Contribuição de Melhoria', dividindo o custo total da obra igualmente entre todos os proprietários pelo critério de testada, sem publicar edital prévio de memorial descritivo da obra e sem comprovar a efetiva valorização individual de cada imóvel. A notificação foi recebida há 10 dias. Como advogado(a) de um dos proprietários, elabore a ação cabível pelo rito ordinário para anular o lançamento tributário com pedido liminar.",
    esqueleto: `AO JUÍZO DA ... VARA DA FAZENDA PÚBLICA DA COMARCA DE ÔMEGA

AUTOR: JOÃO ..., [qualificação completa], por seu advogado infra-assinado.
RÉU: MUNICÍPIO ÔMEGA, pessoa jurídica de direito público interno.
FUNDAMENTO LEGAL: Art. 38 da Lei nº 6.830/1980 e Art. 300 do CPC c/c Art. 145, III, da CRFB/88 e Decreto-Lei nº 195/1967.

Ação: AÇÃO ANULATÓRIA DE DÉBITO FISCAL COM PEDIDO DE TUTELA PROVISÓRIA DE URGÊNCIA

I. DO CABIMENTO DA AÇÃO ANULATÓRIA
- Ação adequada para anular lançamento tributário nulo praticado em desconformidade com os ditames constitucionais e legais (Art. 38 da Lei 6.830/80).

II. DOS FATOS
[ESTRUTURA FÁTICA: O candidato deve narrar a cobrança de contribuição de melhoria baseada apenas no custo da obra dividido por testada, sem comprovação de mais-valia].

III. DO DIREITO / DAS TESES E FUNDAMENTOS
1. Da Inconstitucionalidade da Cobrança de Contribuição de Melhoria sem Efetiva Valorização Imobiliária
- Fundamento: Art. 145, III, da CRFB/88; Art. 81 e Art. 82 do CTN e Decreto-Lei nº 195/1967.
- [DESENVOLVIMENTO DO CANDIDATO: Explique que o fato gerador da contribuição de melhoria não é a realização da obra pública em si, mas sim a efetiva valorização imobiliária individual decorrente dela (limite individual), não podendo o Fisco simplesmente ratear o custo global].

2. Da Nulidade por Ausência de Edital Prévio Obrigatório
- Fundamento: Art. 82 do CTN e Art. 5º do Decreto-Lei nº 195/1967.
- [DESENVOLVIMENTO DO CANDIDATO: Demonstre que a ausência de publicação prévia de edital com memorial descritivo e orçamento retira a higidez do lançamento e vicia o contraditório].

IV. DA TUTELA PROVISÓRIA DE URGÊNCIA
- Fumus boni iuris: Violação flagrante ao limite individual da contribuição de melhoria.
- Periculum in mora: Risco de vencimento do tributo, acréscimo de multas e cobrança forçada.
- Fundamento: Art. 300 do CPC e Art. 151, V, do CTN.

V. DOS PEDIDOS E REQUERIMENTOS
a) Concessão da TUTELA PROVISÓRIA DE URGÊNCIA para suspender a exigibilidade do crédito tributário (Art. 151, V, CTN);
b) Citação do Município réu;
c) Procedência do pedido para ANULAR o lançamento tributário de contribuição de melhoria;
d) Condenação do réu nas custas e honorários advocatícios (Art. 85 do CPC);
e) Produção de todas as provas admitidas em direito, em especial prova pericial de engenharia e avaliação imobiliária;
f) Manifestação sobre a audiência de conciliação (Art. 319, VII, CPC).

Dá-se à causa o valor de R$ ...

Nestes termos,
Pede deferimento.

Local ..., Data ...
Advogado ... / OAB ...`,
    tesesPrincipais: [
      "O fato gerador da Contribuição de Melhoria é a efetiva valorização imobiliária decorrente de obra pública (Art. 145, III da CF e Art. 81 do CTN)",
      "Necessidade de observância do limite individual e publicação prévia de edital com memorial (Art. 82 do CTN e DL 195/67)",
      "Ilegalidade do mero rateio de custo da obra sem cálculo de mais-valia"
    ],
    fundamentosNormativos: [
      "Art. 145, III, CF/88",
      "Art. 81 e Art. 82 CTN",
      "Decreto-Lei nº 195/1967",
      "Art. 38 Lei 6.830/80",
      "Art. 300 CPC",
      "Art. 151, V, CTN"
    ],
    espelhoCorrecao: [
      { id: "c1", item: "Endereçamento", pontos: 0.10, descricao: "Vara da Fazenda Pública da Comarca competente", palavrasChave: ["vara", "fazenda pública"] },
      { id: "c2", item: "Qualificação e Fundamento", pontos: 0.20, descricao: "Autor e Réu qualificados, com base no Art. 38 da LEF e CPC", palavrasChave: ["anulatória", "art. 38", "município"] },
      { id: "c3", item: "Fato Gerador (Valorização Imobiliária)", pontos: 2.20, descricao: "Art. 145, III da CF e Art. 81 do CTN: a base é a valorização e não o custo rateado da obra", palavrasChave: ["contribuição de melhoria", "valorização imobiliária", "art. 145, iii", "art. 81 ctn", "mais-valia", "limite individual"] },
      { id: "c4", item: "Ausência de Edital Prévio (Art. 82 CTN)", pontos: 0.80, descricao: "Obrigatoriedade de edital prévio com memorial descritivo conforme Art. 82 do CTN e DL 195/67", palavrasChave: ["edital prévio", "art. 82 ctn", "decreto-lei 195/67", "memorial descritivo"] },
      { id: "c5", item: "Tutela de Urgência", pontos: 0.60, descricao: "Requisitos do Art. 300 do CPC e suspensão da exigibilidade pelo Art. 151, V do CTN", palavrasChave: ["tutela provisória", "art. 300", "art. 151, v"] },
      { id: "c6", item: "Pedidos e Sucumbência", pontos: 0.70, descricao: "Anulação do lançamento, citação, honorários (Art. 85 CPC) e perícia técnica", palavrasChave: ["anulação", "citação", "honorários", "art. 85"] },
      { id: "c7", item: "Fechamento", pontos: 0.40, descricao: "Valor da causa e encerramento regular", palavrasChave: ["valor da causa", "nestes termos", "advogado", "oab"] }
    ],
    dicaBanca: "Na Contribuição de Melhoria, a administração não pode simplesmente somar o custo do asfalto e dividir pelos metros de testada dos imóveis; é indispensável comprovar o ganho de valor imobiliário individual de cada bem (Art. 81 do CTN)."
  }
];
