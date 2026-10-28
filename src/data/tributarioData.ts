export interface PecaQuesito {
  item: string;
  cor: 'ROSA' | 'VERDE' | 'AMARELO' | 'AZUL' | 'CLIPES';
  pts: string;
}

export interface PecaBloco {
  cor: 'ROSA' | 'VERDE' | 'AMARELO' | 'AZUL';
  titulo: string;
  dica: string;
  texto: string;
}

export interface PecaCatalogo {
  codigo: string;
  tipo: 'Inicial' | 'Recursal';
  nome: string;
  examesCobrados: string;
  baseLegal: string;
  quesitosFGV: PecaQuesito[];
  blocos: PecaBloco[];
}

export interface SumulaItem {
  tr: 'SV' | 'STF' | 'STJ' | string;
  num: string;
  texto: string;
  recente?: boolean;
  dataInfo?: string;
  mesesAtras?: number;
  tema?: string;
}

export const CATALOGO_PECAS: PecaCatalogo[] = [
  {
    codigo: "MS",
    tipo: "Inicial",
    nome: "Mandado de Segurança",
    examesCobrados: "Exames IV, VII, IX, X, XI, XIV, XIX, XXIX, 40º e 45º (10x)",
    baseLegal: "Art. 5º, LXIX, da CF/88 c/c Lei nº 12.016/2009",
    quesitosFGV: [
      { item: "Endereçamento (Vara Cível Federal ou Vara da Fazenda Pública)", cor: "ROSA", pts: "0,10" },
      { item: "Qualificação do Impetrante + Autoridade Coatora (Impetrado) e PJ", cor: "ROSA", pts: "0,20" },
      { item: "Cabimento do MS (prova pré-constituída) e Prazo de 120 dias (Art. 23)", cor: "VERDE", pts: "0,30" },
      { item: "Exposição dos Fatos", cor: "ROSA", pts: "0,10" },
      { item: "Teses de Direito Material (Tese 1, Tese 2, Tese 3)", cor: "AMARELO", pts: "2,20" },
      { item: "Tópico da Medida Liminar (Art. 7º, III, Lei 12.016/09 c/c Art. 151, IV, CTN)", cor: "VERDE", pts: "0,80" },
      { item: "Pedido Liminar (Suspensão do crédito + CPD-EN Art. 206 CTN)", cor: "VERDE", pts: "0,30" },
      { item: "Pedido de Notificação da Autoridade Coatora (Art. 7º, I - 10 dias)", cor: "VERDE", pts: "0,20" },
      { item: "Pedido de Cientificação do Ente Público (Art. 7º, II) + Intimação do MP (Art. 12)", cor: "VERDE", pts: "0,20" },
      { item: "Pedido de Procedência (Concessão da Segurança) + Custas (Sem honorários - Súm. 105 STJ)", cor: "ROSA", pts: "0,40" },
      { item: "Valor da Causa + Fechamento (Local, Data, Advogado, OAB)", cor: "ROSA", pts: "0,20" }
    ],
    blocos: [
      {
        cor: "ROSA",
        titulo: "1. Endereçamento",
        dica: "Federal -> Juiz Federal da ... Vara Cível da Seção/Subseção Judiciária | Estadual/Municipal -> Juiz de Direito da ... Vara da Fazenda Pública.",
        texto: "EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA ... VARA DA FAZENDA PÚBLICA DA COMARCA DE ... (OU JUIZ FEDERAL DA ... VARA CÍVEL DA SEÇÃO/SUBSEÇÃO JUDICIÁRIA DE ...)"
      },
      {
        cor: "ROSA",
        titulo: "2. Qualificação do Impetrante e da Autoridade Coatora",
        dica: "Qualifique o Impetrante e indique a Autoridade Coatora + a Pessoa Jurídica de Direito Público a que pertence.",
        texto: "[Nome do Impetrante], [qualificação e CNPJ/CPF...], com sede em [endereço...], endereço eletrônico ..., por seu advogado infra-assinado (procuração anexa), com escritório em [endereço...], onde recebe intimações, vem, respeitosamente, à presença de Vossa Excelência, com fulcro no Art. 5º, inciso LXIX, da CF/88 e na Lei nº 12.016/2009, impetrar\n\nMANDADO DE SEGURANÇA COM PEDIDO DE MEDIDA LIMINAR\n\nem face de ato coator praticado pelo [Cargo da Autoridade Coatora], vinculado ao [União / Estado / Município], pessoa jurídica de direito público interno, inscrita no CNPJ sob o nº ..., com endereço em ..., pelos fatos e fundamentos a seguir:"
      },
      {
        cor: "ROSA",
        titulo: "3. I – Dos Fatos",
        dica: "Síntese objetiva do problema narrado pela FGV em 1 ou 2 parágrafos curtos.",
        texto: "Trata-se de ato coator ilegal praticado pela autoridade impetrada que exige indevidamente o recolhimento de [tributo] sobre [descrever fato do enunciado], obstando a regularidade fiscal do Impetrante."
      },
      {
        cor: "VERDE",
        titulo: "4. II – Do Cabimento e da Tempestividade",
        dica: "Demonstre direito líquido e certo (prova pré-constituída sem dilação probatória) e prazo de até 120 dias (Art. 23 da Lei 12.016/09).",
        texto: "O presente Mandado de Segurança é cabível (Art. 5º, LXIX, da CF/88 e Art. 1º da Lei nº 12.016/2009) por amparar direito líquido e certo comprovado de plano por prova documental pré-constituída, sem necessidade de dilação probatória. Ademais, é tempestivo, pois observado o prazo decadencial de 120 dias (Art. 23 da Lei nº 12.016/2009)."
      },
      {
        cor: "AMARELO",
        titulo: "5. III – Do Direito (Teses 1, 2 e 3)",
        dica: "A FGV divide o mérito em Tese 1, Tese 2 e Tese 3. Em cada tese cite o Artigo da CF/CTN + Súmula + aplicação ao caso.",
        texto: "III.1 – Da Tese 1: Violação Constitucional / Legal\nNos termos do Art. [...] da CF/88, do Art. [...] do CTN e da Súmula [...] do STF/STJ, é indevida a exigência fiscal sobre o fato narrado.\n\nIII.2 – Da Tese 2: Ilegalidade / Não Incidência / Imunidade\nNo caso concreto, verifica-se que o ato coator afronta diretamente a norma tributária de regência, impondo-se o reconhecimento do direito líquido e certo do Impetrante."
      },
      {
        cor: "VERDE",
        titulo: "6. IV – Da Medida Liminar",
        dica: "Cite o Art. 7º, III, da Lei 12.016/09 + fumus boni iuris + periculum in mora + suspensão da exigibilidade (Art. 151, IV, CTN) + CPD-EN (Art. 206 CTN).",
        texto: "Presentes os requisitos do Art. 7º, inciso III, da Lei nº 12.016/2009, quais sejam, o fundamento relevante (plausibilidade das teses jurídicas expostas) e o risco de ineficácia da medida (perigo de inscrição em dívida ativa, bloqueio de bens e negativa de certidão), impõe-se a concessão de medida liminar para suspender a exigibilidade do crédito tributário (Art. 151, IV, do CTN) e garantir a expedição de Certidão Positiva com Efeitos de Negativa (Art. 206 do CTN)."
      },
      {
        cor: "ROSA",
        titulo: "7. V – Dos Pedidos e Requerimentos Finais",
        dica: "Inclui os pedidos específicos do MS (Verde) e os pedidos gerais de todas as peças (Rosa).",
        texto: "Ante o exposto, requer a Vossa Excelência:\na) A concessão de medida liminar (Art. 7º, III, da Lei 12.016/09) para suspender a exigibilidade do crédito tributário (Art. 151, IV, do CTN) e determinar a expedição de CPD-EN (Art. 206 do CTN);\nb) A notificação da autoridade coatora para prestar informações no prazo de 10 dias (Art. 7º, I, da Lei 12.016/09);\nc) A cientificação do órgão de representação judicial da pessoa jurídica interessada (Art. 7º, II, da Lei 12.016/09);\nd) A intimação do Ministério Público para parecer em 10 dias (Art. 12 da Lei 12.016/09);\ne) No mérito, a confirmação da medida liminar e a procedência do pedido com a concessão definitiva da segurança;\nf) A condenação ao ressarcimento das custas processuais, sem honorários advocatícios (Art. 25 da Lei 12.016/09 e Súmulas 512 STF e 105 STJ).\n\nDá-se à causa o valor de R$ ...\n\nNestes termos, pede deferimento.\nLocal..., Data...\nAdvogado... / OAB/... nº ..."
      }
    ]
  },
  {
    codigo: "ANULATORIA",
    tipo: "Inicial",
    nome: "Ação Anulatória de Débito Fiscal",
    examesCobrados: "Exames IV, IX, XXX, XXXI, XXXIV, 39º e 42º (7x)",
    baseLegal: "Art. 38 da Lei nº 6.830/80 (LEF) c/c Arts. 300 e 319 do CPC",
    quesitosFGV: [
      { item: "Endereçamento + Qualificação Requerente e Requerido", cor: "ROSA", pts: "0,30" },
      { item: "Cabimento da Anulatória (Art. 38 LEF e SV 28) + Exposição dos Fatos", cor: "VERDE", pts: "0,30" },
      { item: "Teses de Direito Material (Tese 1, Tese 2, Tese 3)", cor: "AMARELO", pts: "2,20" },
      { item: "Tópico de Tutela Provisória de Urgência (Art. 300 CPC c/c Art. 151, V, CTN)", cor: "VERDE", pts: "0,80" },
      { item: "Pedidos Gerais: Tutela Provisória + Procedência + Citação do Requerido", cor: "ROSA", pts: "0,60" },
      { item: "Pedidos Gerais: Produção de Provas + Não Audiência de Mediação/Conciliação + Custas e Honorários (Art. 85, §3º CPC)", cor: "ROSA", pts: "0,60" },
      { item: "Valor da Causa + Fechamento (Local, Data, Advogado, OAB)", cor: "ROSA", pts: "0,20" }
    ],
    blocos: [
      {
        cor: "ROSA",
        titulo: "1. Endereçamento e Qualificação",
        dica: "Qualifique Autor e Fazenda Pública Ré.",
        texto: "EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA ... VARA DA FAZENDA PÚBLICA DA COMARCA DE ... (OU JUIZ FEDERAL DA ... VARA CÍVEL DA SEÇÃO/SUBSEÇÃO JUDICIÁRIA DE ...)\n\n[Autor], [qualificação completa...], por seu advogado infra-assinado (procuração anexa), vem, com fulcro no Art. 38 da Lei nº 6.830/1980 c/c Arts. 300 e 319 do CPC, propor\n\nAÇÃO ANULATÓRIA DE DÉBITO FISCAL COM PEDIDO DE TUTELA PROVISÓRIA DE URGÊNCIA\n\nem face do [União / Estado / Município], pessoa jurídica de direito público interno, pelos fatos e fundamentos a seguir:"
      },
      {
        cor: "VERDE",
        titulo: "2. I – Dos Fatos e do Cabimento",
        dica: "Destaque que já houve lançamento, exige dilação probatória/perícia e independe de depósito prévio (SV 28).",
        texto: "A presente Ação Anulatória é cabível (Art. 38 da Lei nº 6.830/80) para desconstituir lançamento fiscal já constituído que demanda dilação probatória pericial, sendo desnecessário depósito prévio (Súmula Vinculante 28 do STF) e observando-se o prazo quinquenal (Dec. 20.910/32)."
      },
      {
        cor: "AMARELO",
        titulo: "3. II – Do Direito (Teses 1, 2 e 3)",
        dica: "Desenvolva cada tese material em subtópicos separados.",
        texto: "II.1 – Da Tese 1: [...]\nNos termos do Art. [...] da CF/88, do Art. [...] do CTN e da Súmula [...], mostra-se nulo o lançamento fiscal.\n\nII.2 – Da Tese 2: [...]\nNo caso concreto, restou comprovada a ilegalidade da autuação, impondo-se sua anulação."
      },
      {
        cor: "VERDE",
        titulo: "4. III – Da Tutela Provisória de Urgência",
        dica: "Art. 300 do CPC (probabilidade do direito + perigo de dano) c/c Art. 151, V, e Art. 206 do CTN.",
        texto: "Preenchem-se os requisitos do Art. 300 do CPC: a probabilidade do direito decorre da inconstitucionalidade/ilegalidade demonstrada, e o perigo de dano reside na inscrição em dívida ativa, protesto e ajuizamento de execução fiscal. Requer-se a tutela de urgência para suspender a exigibilidade do crédito (Art. 151, V, do CTN) e expedir CPD-EN (Art. 206 do CTN)."
      },
      {
        cor: "ROSA",
        titulo: "5. IV – Dos Pedidos e Requerimentos Finais",
        dica: "Inclua todos os itens cobrados pela FGV na tabela da Anulatória (inclusive dispensa de conciliação).",
        texto: "Ante o exposto, requer a Vossa Excelência:\na) A concessão de tutela provisória de urgência (Art. 300 do CPC) para suspender a exigibilidade do crédito (Art. 151, V, do CTN) e expedir CPD-EN (Art. 206 do CTN);\nb) A citação do Requerido, na pessoa de seu Procurador, para contestar o feito;\nc) No mérito, a confirmação da tutela e a total procedência do pedido para anular o Auto de Infração / lançamento tributário, extinguindo o crédito (Art. 156, X, do CTN);\nd) A produção de todas as provas em direito admitidas, em especial documental e pericial (Art. 319, VI, do CPC);\ne) A dispensa da realização de audiência de conciliação ou mediação (Art. 319, VII, do CPC);\nf) A condenação do Requerido ao pagamento das custas processuais e dos honorários advocatícios sucumbenciais (Art. 85, §3º, do CPC).\n\nDá-se à causa o valor de R$ ...\n\nNestes termos, pede deferimento.\nLocal..., Data...\nAdvogado... / OAB/... nº ..."
      }
    ]
  },
  {
    codigo: "REPETICAO",
    tipo: "Inicial",
    nome: "Ação de Repetição de Indébito",
    examesCobrados: "Exames VI, X, XXI, XXIII, XXIV e 37º (6x)",
    baseLegal: "Art. 165, I, do CTN c/c Art. 319 do CPC",
    quesitosFGV: [
      { item: "Endereçamento + Qualificação Requerente e Requerido", cor: "ROSA", pts: "0,30" },
      { item: "Cabimento da Repetição (Art. 165 CTN) + Comprovação do Pagamento", cor: "VERDE", pts: "0,30" },
      { item: "Tempestividade Quinquenal (5 anos - Art. 168, I, CTN)", cor: "VERDE", pts: "0,30" },
      { item: "Exposição dos Fatos + Teses de Direito Material (Teses 1 a 4)", cor: "AMARELO", pts: "2,50" },
      { item: "Pedidos Gerais: Procedência (Restituição c/ SELIC EC 113/21) + Citação + Endereço de Intimação", cor: "ROSA", pts: "0,70" },
      { item: "Pedidos Gerais: Produção de Provas + Não Audiência Conciliação + Custas e Honorários (Art. 85, §3º CPC)", cor: "ROSA", pts: "0,70" },
      { item: "Valor da Causa + Local, Data, Advogado, OAB", cor: "ROSA", pts: "0,20" }
    ],
    blocos: [
      {
        cor: "ROSA",
        titulo: "1. Endereçamento e Qualificação",
        dica: "Enderece à Vara da Fazenda Pública ou Vara Federal.",
        texto: "EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA ... VARA DA FAZENDA PÚBLICA DA COMARCA DE ... (OU JUIZ FEDERAL...)\n\n[Requerente], [qualificação completa...], por seu advogado (procuração anexa, com endereço profissional para intimações em ... - Art. 77, V, CPC), vem, com fulcro no Art. 165, I, do CTN e Art. 319 do CPC, propor\n\nAÇÃO DE REPETIÇÃO DE INDÉBITO TRIBUTÁRIO\n\nem face do [União / Estado / Município], pelos fatos e fundamentos a seguir:"
      },
      {
        cor: "VERDE",
        titulo: "2. I – Do Cabimento e da Tempestividade",
        dica: "A FGV pontua separadamente o Cabimento (Art. 165 CTN + comprovação do pagamento) e a Tempestividade (5 anos do Art. 168, I, CTN).",
        texto: "A ação é cabível (Art. 165, I, do CTN) diante da comprovação do pagamento indevido (guias anexas), observando-se o Art. 166 do CTN e a Súmula 546 do STF.\n\nOutrossim, é tempestiva, pois proposta dentro do prazo de 5 (cinco) anos contados da extinção do crédito pelo pagamento, conforme o Art. 168, inciso I, do CTN."
      },
      {
        cor: "AMARELO",
        titulo: "3. II – Dos Fatos e do Direito (Teses de Mérito)",
        dica: "Desenvolva a inconstitucionalidade/ilegalidade do tributo pago e o direito à Taxa SELIC (EC 113/2021 e Súmula 188 STJ).",
        texto: "Nos termos do Art. [...] da CF/88 e do Art. [...] do CTN, o pagamento exigido pelo Fisco mostra-se indevido, impondo-se a restituição integral atualizada exclusivamente pela taxa SELIC (Art. 3º da EC 113/2021, Art. 167 do CTN e Súmula 188 do STJ)."
      },
      {
        cor: "ROSA",
        titulo: "4. III – Dos Pedidos e Requerimentos Finais",
        dica: "Checklist exato dos exames 6, 21, 23, 24 e 37.",
        texto: "Ante o exposto, requer:\na) A citação do Requerido para apresentar contestação;\nb) A total procedência do pedido para condenar o Requerido à restituição integral dos valores recolhidos indevidamente (comprovados pelas guias anexas), atualizados pela taxa SELIC;\nc) A produção de todas as provas em direito admitidas, em especial documental e pericial;\nd) A dispensa da audiência de conciliação/mediação (Art. 319, VII, do CPC);\ne) A condenação do Requerido em custas processuais e honorários advocatícios (Art. 85, §3º, do CPC);\nf) Que as intimações sejam dirigidas ao endereço do advogado indicado no preâmbulo.\n\nDá-se à causa o valor de R$ ...\n\nNestes termos, pede deferimento.\nLocal..., Data...\nAdvogado... / OAB/... nº ..."
      }
    ]
  },
  {
    codigo: "EMBARGOS",
    tipo: "Inicial",
    nome: "Embargos à Execução Fiscal",
    examesCobrados: "Exames 2010.2, 2010.3, XX, XXII e XXVII (5x)",
    baseLegal: "Art. 16 da Lei nº 6.830/80 (LEF) c/c Art. 919, §1º, do CPC",
    quesitosFGV: [
      { item: "Endereçamento ao Juízo da Execução + Distribuição por Dependência", cor: "ROSA", pts: "0,30" },
      { item: "Qualificação do Embargante e do Embargado", cor: "ROSA", pts: "0,20" },
      { item: "Cabimento (Juízo Garantido Art. 16, §1º) + Tempestividade (30 dias Art. 16 LEF)", cor: "VERDE", pts: "0,50" },
      { item: "Exposição dos Fatos + Teses de Mérito (Teses 1 a 4)", cor: "AMARELO", pts: "2,20" },
      { item: "Concessão de Efeito Suspensivo (Art. 919, §1º, CPC)", cor: "VERDE", pts: "0,60" },
      { item: "Pedidos: Concessão Efeito Suspensivo + Procedência + Intimação do Embargado", cor: "ROSA", pts: "0,60" },
      { item: "Pedidos: Produção de Provas + Não Audiência Conciliação + Custas e Honorários + Valor da Causa + Fechamento", cor: "ROSA", pts: "0,60" }
    ],
    blocos: [
      {
        cor: "ROSA",
        titulo: "1. Endereçamento, Dependência e Qualificação",
        dica: "Inclua sempre a linha 'Distribuído por dependência aos autos da Execução Fiscal nº ...'",
        texto: "EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA ... VARA DE EXECUÇÕES FISCAIS DA COMARCA DE ... (OU JUIZ FEDERAL...)\n\nDistribuído por dependência aos autos da Execução Fiscal nº ... (Art. 914, §1º, do CPC)\n\n[Embargante], qualificação completa, por seu advogado, vem, com fulcro no Art. 16 da Lei nº 6.830/1980 e Art. 919, §1º, do CPC, opor\n\nEMBARGOS À EXECUÇÃO FISCAL COM PEDIDO DE EFEITO SUSPENSIVO\n\nem face da [Fazenda Pública Embargada], pelos fatos e fundamentos a seguir:"
      },
      {
        cor: "VERDE",
        titulo: "2. I – Do Cabimento (Garantia do Juízo) e da Tempestividade (30 Dias)",
        dica: "Destaque a garantia do juízo (Art. 16, §1º, LEF) e o prazo de 30 dias (Art. 16, I a III, LEF).",
        texto: "Os Embargos são cabíveis porquanto o juízo executivo encontra-se integralmente garantido por [depósito / fiança / seguro / penhora] (Art. 16, §1º, da LEF), e tempestivos pois opostos dentro do prazo legal de 30 dias (Art. 16, I a III, da LEF)."
      },
      {
        cor: "AMARELO",
        titulo: "3. II – Dos Fatos e do Direito (Teses 1 a 4)",
        dica: "Alegue nulidade da CDA, prescrição/decadência, ilegitimidade do sócio (Súmula 430 STJ) e inconstitucionalidade.",
        texto: "Nos termos do Art. [...] da CF/88, do Art. [...] do CTN e da Súmula [...] do STJ, mostra-se inexigível o título executivo."
      },
      {
        cor: "VERDE",
        titulo: "4. III – Da Concessão de Efeito Suspensivo",
        dica: "Garantia do juízo + fumus boni iuris + periculum in mora (Art. 919, §1º, do CPC).",
        texto: "Presentes a garantia do juízo, a relevância da fundamentação e o perigo de dano grave decorrente do prosseguimento dos atos expropriatórios, requer-se a atribuição de efeito suspensivo aos Embargos, nos termos do Art. 919, §1º, do CPC."
      },
      {
        cor: "ROSA",
        titulo: "5. IV – Dos Pedidos e Requerimentos Finais",
        dica: "Todos os pedidos exigidos nos Exames 3, 20, 22 e 27.",
        texto: "Ante o exposto, requer:\na) A distribuição por dependência à Execução Fiscal nº ... e a concessão de efeito suspensivo aos Embargos (Art. 919, §1º, do CPC) com expedição de CPD-EN (Art. 206 do CTN);\nb) A intimação da Fazenda Embargada para apresentar impugnação em 30 dias (Art. 17 da LEF);\nc) No mérito, a total procedência dos Embargos para extinguir a execução fiscal e desconstituir a CDA e a penhora;\nd) A produção de todas as provas admitidas, inclusive documental e pericial;\ne) A dispensa da audiência de conciliação (Art. 319, VII, CPC);\nf) A condenação da Embargada em custas e honorários advocatícios (Art. 85, §3º, do CPC).\n\nDá-se à causa o valor de R$ ...\nLocal..., Data...\nAdvogado... / OAB/... nº ..."
      }
    ]
  },
  {
    codigo: "EPE",
    tipo: "Inicial",
    nome: "Exceção de Pré-Executividade (EPE)",
    examesCobrados: "Exames XV, XVII, 36º e 44º (4x)",
    baseLegal: "Súmula 393 do STJ c/c Art. 803, parágrafo único, do CPC",
    quesitosFGV: [
      { item: "Endereçamento ao Juízo da Execução + Qualificação Excipiente e Excepto", cor: "ROSA", pts: "0,30" },
      { item: "Cabimento da EPE (Súmula 393 STJ: matéria de ofício, sem dilação e sem garantia) + Tempestividade", cor: "VERDE", pts: "0,60" },
      { item: "Exposição dos Fatos + Teses de Ordem Pública (Teses 1 a 4)", cor: "AMARELO", pts: "2,80" },
      { item: "Pedidos: Acolhimento da Exceção (Extinção da Execução) + Intimação do Excepto", cor: "ROSA", pts: "0,70" },
      { item: "Pedidos: Juntada de Provas Pré-Constituídas + Condenação em Custas e Honorários (Súmula 153 STJ) + Fechamento", cor: "ROSA", pts: "0,60" }
    ],
    blocos: [
      {
        cor: "ROSA",
        titulo: "1. Endereçamento e Qualificação",
        dica: "Peticione dentro dos próprios autos da Execução Fiscal.",
        texto: "EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA ... VARA DE EXECUÇÕES FISCAIS DA COMARCA DE ... (OU JUIZ FEDERAL...)\nProcesso nº ...\n\n[Excipiente], qualificação completa, por seu advogado, nos autos da Execução Fiscal movida por [Fazenda Excepta], vem, com fulcro na Súmula 393 do STJ, opor\n\nEXCEÇÃO DE PRÉ-EXECUTIVIDADE"
      },
      {
        cor: "VERDE",
        titulo: "2. I – Do Cabimento e da Tempestividade da EPE",
        dica: "Destaque que independe de garantia do juízo, trata de matéria conhecível de ofício com prova pré-constituída e pode ser oposta a qualquer tempo.",
        texto: "A Exceção de Pré-Executividade é cabível nos termos da Súmula 393 do STJ, pois versa sobre matéria de ordem pública conhecível de ofício que não demanda dilação probatória, dispensando garantia do juízo e podendo ser arguida a qualquer tempo antes da extinção executiva."
      },
      {
        cor: "AMARELO",
        titulo: "3. II – Dos Fatos e do Direito (Teses 1 a 4)",
        dica: "Matérias de ordem pública: prescrição, decadência, imunidade, isenção ou ilegitimidade passiva manifesta.",
        texto: "Demonstram os documentos acostados a manifesta nulidade/inexigibilidade do crédito executado, impondo-se o reconhecimento de ofício da tese material."
      },
      {
        cor: "ROSA",
        titulo: "4. III – Dos Pedidos e Requerimentos Finais",
        dica: "Checklist oficial dos Exames 13, 15, 36 e 44.",
        texto: "Ante o exposto, requer:\na) O recebimento da Exceção independentemente de garantia do juízo, suspendendo-se atos constritivos;\nb) A intimação da Fazenda Excepta para se manifestar no prazo legal;\nc) O acolhimento da Exceção de Pré-Executividade para extinguir a Execução Fiscal (ou excluir o Excipiente do polo passivo);\nd) A condenação da Excepta em custas e honorários advocatícios sucumbenciais (Súmula 153 do STJ e Art. 85, §3º, do CPC);\ne) A juntada das provas documentais pré-constituídas.\n\nLocal..., Data...\nAdvogado... / OAB/... nº ..."
      }
    ]
  },
  {
    codigo: "CONSIGNACAO",
    tipo: "Inicial",
    nome: "Ação de Consignação em Pagamento",
    examesCobrados: "Exame V (1x)",
    baseLegal: "Art. 164 do CTN c/c Art. 539 e ss. do CPC",
    quesitosFGV: [
      { item: "Endereçamento + Qualificação Requerente e Requerido(s)", cor: "ROSA", pts: "0,30" },
      { item: "Exposição dos Fatos + Teses de Mérito (Tese 1 e Tese 2)", cor: "AMARELO", pts: "2,20" },
      { item: "Tópico de Depósito em Consignação (Art. 542, I, CPC) + Tópico de Suspensão da Exigibilidade", cor: "VERDE", pts: "1,00" },
      { item: "Pedidos: Deferir Depósito + Suspensão Exigibilidade + Procedência (Extinção Art. 156, VIII CTN)", cor: "ROSA", pts: "0,80" },
      { item: "Pedidos: Citação + Provas + Custas e Honorários + Valor da Causa + Fechamento", cor: "ROSA", pts: "0,70" }
    ],
    blocos: [
      {
        cor: "ROSA",
        titulo: "1. Endereçamento e Qualificação",
        dica: "Se a União for ré junto com Município (ITR x IPTU), enderece ao Juiz Federal (Art. 109, I, CF).",
        texto: "EXCELENTÍSSIMO SENHOR DOUTOR JUIZ FEDERAL DA ... VARA CÍVEL DA SUBSEÇÃO JUDICIÁRIA DE ... (OU VARA DA FAZENDA PÚBLICA)\n\n[Requerente], qualificação, vem, com fulcro no Art. 164 do CTN e Art. 539 do CPC, propor AÇÃO DE CONSIGNAÇÃO EM PAGAMENTO em face de [Requeridos]."
      },
      {
        cor: "AMARELO",
        titulo: "2. I – Dos Fatos e do Direito (Teses 1 e 2)",
        dica: "Explique a recusa, subordinação ilegal ou bitributação (Art. 164, I, II ou III, do CTN).",
        texto: "Resta configurada a hipótese do Art. 164 do CTN, assistindo direito ao Autor de consignar exclusivamente o valor constitucionalmente devido."
      },
      {
        cor: "VERDE",
        titulo: "3. II – Do Depósito e da Suspensão da Exigibilidade",
        dica: "A FGV exige tópico específico do Depósito (Art. 542, I, CPC) e da Suspensão da Exigibilidade.",
        texto: "Requer-se autorização para depósito da quantia devida em 5 dias (Art. 542, I, do CPC), operando-se a imediata suspensão da exigibilidade do crédito tributário e expedição de CPD-EN (Art. 206 do CTN)."
      },
      {
        cor: "ROSA",
        titulo: "4. III – Dos Pedidos e Requerimentos Finais",
        dica: "Checklist oficial do Exame V.",
        texto: "Ante o exposto, requer:\na) O deferimento do depósito em consignação em 5 dias (Art. 542, I, CPC) e a suspensão da exigibilidade do crédito;\nb) A citação dos Requeridos (Art. 542, II, e 547 do CPC);\nc) A procedência do pedido para declarar extinto o crédito tributário (Art. 156, VIII, do CTN);\nd) A produção de provas e a condenação em custas e honorários advocatícios (Art. 85 e 546 do CPC).\n\nDá-se à causa o valor de R$ ...\nLocal..., Data... / Advogado... OAB/..."
      }
    ]
  },
  {
    codigo: "APELACAO",
    tipo: "Recursal",
    nome: "Recurso de Apelação",
    examesCobrados: "Exames X, XVI, XX, XXV, XXX, XXXII, 35º, 41º e 43º (9x)",
    baseLegal: "Art. 1.009 a 1.014 do CPC",
    quesitosFGV: [
      { item: "Peça de Interposição: Endereçamento Juízo a quo + Qualificação Apelante/Apelado + Intimação p/ Contrarrazões + Remessa ao Tribunal", cor: "ROSA", pts: "0,50" },
      { item: "Razões: Cabimento da Apelação + Tempestividade (15 dias) + Preparo do Recurso", cor: "VERDE", pts: "0,50" },
      { item: "Descrição dos Fatos + Teses de Reforma da Sentença (Teses 1 a 4)", cor: "AMARELO", pts: "2,40" },
      { item: "Concessão de Tutela Provisória Recursal / Efeito Suspensivo (Art. 1.012, §§ 3º e 4º, CPC)", cor: "VERDE", pts: "0,50" },
      { item: "Pedidos: Provimento Monocrático/Colegiado + Reforma da Sentença + Custas e Honorários (Art. 85, §11 CPC) + Fechamento", cor: "ROSA", pts: "1,10" }
    ],
    blocos: [
      {
        cor: "ROSA",
        titulo: "1. Folha de Interposição (Juízo de 1º Grau)",
        dica: "Peça a intimação para contrarrazões (Art. 1.010, §1º) e a remessa dos autos ao Tribunal (Art. 1.010, §3º).",
        texto: "EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA ... VARA DA FAZENDA PÚBLICA DA COMARCA DE ... (OU JUIZ FEDERAL...)\nProcesso nº ...\n\n[Apelante], já qualificado, inconformado com a sentença proferida nos autos em que contende com [Apelado], vem, com fulcro no Art. 1.009 do CPC, interpor RECURSO DE APELAÇÃO, requerendo a intimação do Apelado para apresentar contrarrazões em 15 dias (Art. 1.010, §1º, CPC) e a posterior remessa dos autos ao Egrégio Tribunal (Art. 1.010, §3º, CPC).\nLocal..., Data... / Advogado... OAB/..."
      },
      {
        cor: "VERDE",
        titulo: "2. Razões: Cabimento, Tempestividade e Preparo",
        dica: "Dirija ao Tribunal (TJ ou TRF) e abra tópicos para Cabimento, Prazo de 15 dias e Preparo.",
        texto: "EGRÉGIO TRIBUNAL DE JUSTIÇA DO ESTADO DE ... (OU TRF DA ... REGIÃO)\nApelante: ... | Apelado: ... | Processo nº ...\n\nI – Do Cabimento, da Tempestividade (15 Dias) e do Preparo\nO recurso é cabível contra sentença (Art. 1.009 do CPC), tempestivo (15 dias úteis - Art. 1.003, §5º, CPC) e devidamente preparado (Art. 1.007 do CPC)."
      },
      {
        cor: "AMARELO",
        titulo: "3. II – Dos Fatos e do Direito (Teses 1 a 4)",
        dica: "Demonstre o error in judicando da sentença.",
        texto: "A r. sentença merece reforma, pois violou o Art. [...] da CF/88, o Art. [...] do CTN e a Súmula [...] do STF/STJ."
      },
      {
        cor: "VERDE",
        titulo: "4. III – Da Concessão de Tutela Provisória Recursal",
        dica: "Demonstre probabilidade de provimento + risco de dano grave (Art. 1.012, §§ 3º e 4º, do CPC).",
        texto: "Presentes a probabilidade de provimento do recurso e o risco de dano grave (Art. 1.012, §4º, do CPC), requer-se a concessão de efeito suspensivo / tutela provisória recursal para suspender a exigibilidade do crédito (Art. 151 do CTN) e expedir CPD-EN (Art. 206 do CTN)."
      },
      {
        cor: "ROSA",
        titulo: "5. IV – Dos Pedidos Recursais",
        dica: "Inclua o pedido de provimento para reforma da sentença e inversão de custas e honorários.",
        texto: "Ante o exposto, requer:\na) O conhecimento do recurso e a concessão liminar da tutela provisória recursal (Art. 1.012, §4º, CPC);\nb) O provimento do recurso (inclusive monocraticamente se contrariar súmula - Art. 932, V, CPC) para reformar a sentença;\nc) A condenação do Apelado em custas e honorários advocatícios, inclusive recursais (Art. 85, §§ 3º e 11, do CPC).\n\nLocal..., Data...\nAdvogado... / OAB/... nº ..."
      }
    ]
  },
  {
    codigo: "AGRAVO_INST",
    tipo: "Recursal",
    nome: "Agravo de Instrumento",
    examesCobrados: "Exames VIII, X, XII, XVII, XXVI, XXXIII e 38º (7x)",
    baseLegal: "Art. 1.015 e Art. 1.019, I, do CPC",
    quesitosFGV: [
      { item: "Endereçamento Direto ao Tribunal (TJ ou TRF) + Qualificação Agravante e Agravado", cor: "ROSA", pts: "0,30" },
      { item: "Tópicos Formais: Fatos/Decisão + Documentos Obrigatórios (1.017, I) + Advogados (1.016, IV) + Prazo 15d + Preparo + Cabimento", cor: "VERDE", pts: "0,90" },
      { item: "Teses de Direito Material (Teses 1 a 3)", cor: "AMARELO", pts: "2,20" },
      { item: "Concessão de Tutela Recursal (Art. 1.019, I, c/c Art. 995, par. único, CPC)", cor: "VERDE", pts: "0,70" },
      { item: "Pedidos: Concessão Tutela Recursal + Provimento do Recurso + Intimação Agravado + Oitiva MP + Fechamento", cor: "ROSA", pts: "0,90" }
    ],
    blocos: [
      {
        cor: "ROSA",
        titulo: "1. Endereçamento ao Tribunal e Qualificação",
        dica: "Interposto diretamente na Presidência do TJ ou TRF (Art. 1.016 do CPC).",
        texto: "EXCELENTÍSSIMO SENHOR DOUTOR DESEMBARGADOR PRESIDENTE DO EGRÉGIO TRIBUNAL DE JUSTIÇA DO ESTADO DE ... (OU TRF DA ... REGIÃO)\n\n[Agravante], qualificado nos autos nº ..., em que contende com [Agravado], vem, com fulcro no Art. 1.015 do CPC, interpor AGRAVO DE INSTRUMENTO COM PEDIDO DE TUTELA RECURSAL."
      },
      {
        cor: "VERDE",
        titulo: "2. I – Do Cabimento, Prazo de 15 Dias, Preparo, Advogados e Peças Obrigatórias",
        dica: "A tabela da FGV pontua cada um desses 5 requisitos formais separadamente.",
        texto: "1. Cabimento e Tempestividade: Cabível contra decisão interlocutória (Art. 1.015 do CPC) e tempestivo no prazo de 15 dias úteis (Art. 1.003, §5º, CPC), acompanhado da guia de preparo (Art. 1.007 CPC).\n2. Indicação dos Advogados (Art. 1.016, IV, CPC): Pelo Agravante, Dr. ..., OAB/..., endereço...; Pelo Agravado, Procurador..., endereço...\n3. Documentos Obrigatórios (Art. 1.017, I e §5º, CPC): Acompanham cópias da petição inicial, contestação, petição que ensejou a decisão agravada, própria decisão agravada, certidão de intimação e procurações (ou declara-se tratar de autos eletrônicos)."
      },
      {
        cor: "AMARELO",
        titulo: "3. II – Dos Fatos (Da Decisão) e do Direito (Teses 1 a 3)",
        dica: "Demonstre por que a decisão interlocutória agravada violou o direito material tributário.",
        texto: "A decisão agravada merece reforma por violar o Art. [...] da CF/88, o Art. [...] do CTN e a Súmula [...] do STF/STJ."
      },
      {
        cor: "VERDE",
        titulo: "4. III – Da Concessão da Tutela Provisória Recursal",
        dica: "Fundamente no Art. 1.019, I, c/c Art. 995, parágrafo único, do CPC.",
        texto: "Presentes a probabilidade de provimento do recurso e o perigo de dano grave, requer-se ao Relator a concessão liminar da tutela antecipada recursal (Art. 1.019, I, do CPC) para suspender a exigibilidade do crédito (Art. 151 do CTN) e expedir CPD-EN (Art. 206 do CTN)."
      },
      {
        cor: "ROSA",
        titulo: "5. IV – Dos Pedidos e Requerimentos Finais",
        dica: "Checklist dos Exames 8, 12, 17, 26, 33 e 38.",
        texto: "Ante o exposto, requer:\na) A concessão liminar da tutela provisória recursal pelo Relator (Art. 1.019, I, CPC);\nb) A intimação do Agravado para apresentar contraminuta em 15 dias (Art. 1.019, II, CPC);\nc) A oitiva do Ministério Público (Art. 1.019, III, CPC);\nd) O conhecimento e o total provimento do recurso para reformar em definitivo a decisão agravada.\n\nLocal..., Data...\nAdvogado... / OAB/... nº ..."
      }
    ]
  },
  {
    codigo: "AGRAVO_INT",
    tipo: "Recursal",
    nome: "Agravo Interno",
    examesCobrados: "Exame XVIII (1x)",
    baseLegal: "Art. 1.021 do CPC",
    quesitosFGV: [
      { item: "Endereçamento ao Relator do Recurso no Tribunal + Qualificação das Partes", cor: "ROSA", pts: "0,40" },
      { item: "Cabimento do Agravo Interno (Art. 1.021 CPC) + Tempestividade (15 dias)", cor: "VERDE", pts: "0,60" },
      { item: "Descrição dos Fatos + Teses Jurídicas (Teses 1 a 3)", cor: "AMARELO", pts: "2,80" },
      { item: "Pedidos: Juízo de Retratação pelo Relator (Art. 1.021, §2º) + Provimento pelo Órgão Colegiado + Fechamento", cor: "ROSA", pts: "1,20" }
    ],
    blocos: [
      {
        cor: "ROSA",
        titulo: "1. Endereçamento ao Relator e Qualificação",
        dica: "Dirigido ao próprio Desembargador/Ministro Relator que proferiu a decisão monocrática.",
        texto: "EXCELENTÍSSIMO SENHOR DOUTOR DESEMBARGADOR (OU MINISTRO) RELATOR DA ... CÂMARA/TURMA DO EGRÉGIO TRIBUNAL ...\nRecurso nº ...\n\n[Agravante], já qualificado nos autos em que contende com [Agravado], inconformado com a decisão monocrática proferida por Vossa Excelência, vem, com fulcro no Art. 1.021 do CPC, interpor AGRAVO INTERNO."
      },
      {
        cor: "VERDE",
        titulo: "2. I – Do Cabimento e da Tempestividade",
        dica: "Contra qualquer decisão monocrática de Relator cabe Agravo Interno em 15 dias úteis (Art. 1.021 do CPC).",
        texto: "O presente Agravo Interno é cabível contra decisão monocrática proferida pelo Relator (Art. 1.021, caput, do CPC) e tempestivo, pois interposto no prazo de 15 dias úteis (Art. 1.003, §5º, do CPC)."
      },
      {
        cor: "AMARELO",
        titulo: "3. II – Dos Fatos e do Direito (Impugnação Específica)",
        dica: "Impugne especificadamente os fundamentos da decisão monocrática (Art. 1.021, §1º, do CPC).",
        texto: "A decisão monocrática merece reforma, pois equivocou-se ao aplicar o entendimento contrário ao Art. [...] da CF/88, ao Art. [...] do CTN e à Súmula [...] do STF/STJ."
      },
      {
        cor: "ROSA",
        titulo: "4. III – Dos Pedidos e Requerimentos Finais",
        dica: "Peça a intimação do Agravado, a Retratação do Relator e, subsidiariamente, o Provimento pelo Colegiado.",
        texto: "Ante o exposto, requer:\na) A intimação do Agravado para se manifestar sobre o recurso no prazo de 15 dias (Art. 1.021, §2º, do CPC);\nb) O exercício do juízo de retratação por Vossa Excelência para reconsiderar a decisão monocrática;\nc) Caso não haja retratação, a inclusão em pauta para julgamento pelo Órgão Colegiado, dando-se total provimento ao Agravo Interno.\n\nLocal..., Data...\nAdvogado... / OAB/... nº ..."
      }
    ]
  },
  {
    codigo: "ROC",
    tipo: "Recursal",
    nome: "Recurso Ordinário Constitucional (ROC)",
    examesCobrados: "Exame XXVIII (1x)",
    baseLegal: "Art. 105, II, 'b', da CF/88 c/c Art. 1.027, II, 'a', do CPC",
    quesitosFGV: [
      { item: "Interposição: Endereçamento Juízo a quo (Presidente TJ/TRF) + Intimação Recorrido + Remessa ao STJ", cor: "ROSA", pts: "0,50" },
      { item: "Razões: Endereçamento STJ + Identificação das Partes + Tempestividade (15d) + Cabimento do ROC + Preparo", cor: "VERDE", pts: "0,80" },
      { item: "Teses de Direito Material (Teses 1 a 3)", cor: "AMARELO", pts: "2,50" },
      { item: "Pedidos: Tutela/Retratação + Provimento do Recurso + Condenação em Custas + Fechamento", cor: "ROSA", pts: "1,20" }
    ],
    blocos: [
      {
        cor: "ROSA",
        titulo: "1. Folha de Interposição (Presidente do TJ/TRF)",
        dica: "Peça intimação do Recorrido para contrarrazões e remessa ao STJ (Art. 1.028, §§ 2º e 3º, CPC).",
        texto: "EXCELENTÍSSIMO SENHOR DOUTOR DESEMBARGADOR PRESIDENTE DO EGRÉGIO TRIBUNAL DE JUSTIÇA DO ESTADO DE ... (OU TRF...)\nMandado de Segurança Originário nº ...\n\n[Recorrente], inconformado com o acórdão denegatório, vem, com fulcro no Art. 105, II, 'b', da CF/88 e Art. 1.027, II, 'a', do CPC, interpor RECURSO ORDINÁRIO CONSTITUCIONAL, requerendo a intimação do Recorrido para contrarrazões em 15 dias e a remessa dos autos ao Superior Tribunal de Justiça."
      },
      {
        cor: "VERDE",
        titulo: "2. Razões ao STJ: Cabimento, Tempestividade e Preparo",
        dica: "Destaque que o acórdão denegou MS de competência originária do Tribunal.",
        texto: "COLENDO SUPERIOR TRIBUNAL DE JUSTIÇA — EMÉRITOS MINISTROS\n\nI – Do Cabimento, da Tempestividade e do Preparo\nCabível o ROC contra acórdão denegatório de MS decididos em única instância por TJ/TRF (Art. 105, II, 'b', CF), tempestivo em 15 dias e preparado."
      },
      {
        cor: "AMARELO",
        titulo: "3. II – Do Direito (Teses 1 a 3)",
        dica: "Desenvolva as teses de direito líquido e certo.",
        texto: "O acórdão recorrido violou direito líquido e certo amparado pela CF/88, pelo CTN e por Súmula de Tribunal Superior."
      },
      {
        cor: "ROSA",
        titulo: "4. III – Dos Pedidos e Requerimentos Finais",
        dica: "Peça tutela recursal (Art. 1.027, §2º CPC), provimento para conceder a segurança e custas.",
        texto: "Ante o exposto, requer o conhecimento e o total provimento do Recurso Ordinário para reformar o acórdão e conceder a segurança, com ressarcimento das custas (sem honorários - Súmula 105 STJ).\n\nLocal..., Data... / Advogado... OAB/..."
      }
    ]
  }
];

export const PECA_EXAMES: Record<string, string> = {
  MS: 'IV, VII, IX, X, XI, XIV, XIX, XXIX, 40º e 45º',
  APELACAO: 'X, XVI, XX (RO), XXV, XXX, XXXII, 35º, 41º, 43º',
  ANULATORIA: 'IV, IX, X, XX (POA), XXXI, XXXIV, 39º, 42º, 46º',
  AGRAVO_INST: 'VIII, X, XII, XVII, XXVI, XXXIII, 38º',
  REPETICAO: 'VI, X, XXI, XXIII, XXIV, 37º',
  EMBARGOS: '2010.2, 2010.3, XX, XXII, XXVII',
  EPE: 'XV, XVIII, 36º, 44º',
  AGRAVO_INT: 'XVIII',
  CONSIGNACAO: 'V',
  ROC: 'XXVIII'
};

export const ROTEIROS: Record<string, string[]> = {
  AGRAVO_INST: [
    'Endereçamento (art. 1.016): Desembargador Presidente do TJ / Relator',
    'Autos do processo nº ...',
    'Qualificar o agravante (art. 1.016, I) com fundamento: art. 1.015 + dispositivo que autoriza (ex.: XIII c/c art. 7º, §1º, Lei 12.016/09)',
    'Nome da peça: AGRAVO DE INSTRUMENTO',
    'Qualificar o agravado (mesmos elementos do art. 319, II; ente: art. 75 CPC)',
    'Admissibilidade (CPP): cabimento; preparo (arts. 1.007 e 1.017, §1º); prazo de 15 dias úteis (arts. 1.003, §5º, 212 e 219)',
    'Peças obrigatórias: art. 1.017, §5º se autos eletrônicos (dispensa); art. 1.017, I se físicos ou omisso; procurações (art. 1.016, IV)',
    'Comunicação ao 1º grau: art. 1.018, §§2º e 3º (dispensada em autos eletrônicos)',
    'Fatos (art. 1.016, II): com suas palavras',
    'Razões de reforma (art. 1.016, III): atacar os requisitos da liminar (art. 7º, III, Lei 12.016/09), não o mérito',
    'Antecipação de tutela recursal: art. 1.019, I c/c art. 995, p. único (+ art. 151, IV CTN)',
    'Pedidos: admissão; tutela recursal; contrarrazões (art. 1.019, II c/c 183); MP (art. 1.019, III); provimento',
    'Fechamento: Nestes termos, pede deferimento. Local ... Data ... Advogado ... OAB ...'
  ],
  APELACAO: [
    'Folha de rosto (art. 1.010): dirigir ao juízo de 1º grau que julgou',
    'Autos do processo nº ...',
    'Qualificar o apelante (art. 1.010, I), fundamento: art. 1.009',
    'Nome da peça: APELAÇÃO; qualificar o apelado (art. 75 CPC)',
    'Pedidos da folha de rosto: contrarrazões (art. 1.010, §1º c/c 183) e remessa ao tribunal sem juízo de admissibilidade (art. 1.010, §3º)',
    'Fechamento da folha de rosto',
    'Folha de razões (art. 1.011): Desembargador Presidente do TJ / Relator',
    'Admissibilidade: cabimento (art. 1.009), preparo (art. 1.007), prazo de 15 dias úteis (arts. 1.003, §5º, 212, 219)',
    'Fatos (art. 1.010, II)',
    'Razões de reforma (art. 1.010, III): atacar o mérito da sentença',
    'Se revogou liminar: efeito suspensivo (art. 1.012, §1º, V e §4º) c/c art. 7º, III, Lei 12.016/09',
    'Pedidos: admissão; efeito suspensivo; julgamento monocrático (art. 932, V); provimento; inversão do ônus (art. 82, §2º)',
    'Fechamento'
  ]
};

export const PECOMETRO_DATA: Record<string, { q: string; o: [string, string][] }> = {
  inicio: {
    q: "Em que fase você está?",
    o: [
      ["Ainda não há processo judicial", "objetivo"],
      ["Há execução fiscal em curso", "execucao"],
      ["Há decisão judicial a impugnar", "decisao"]
    ]
  },
  objetivo: {
    q: "Qual o objetivo do cliente?",
    o: [
      ["Direito líquido e certo, prova pré-constituída, ato coator de autoridade pública", "MS"],
      ["Anular lançamento/crédito fiscal que exige perícia ou sem pagar", "ANULATORIA"],
      ["Recuperar tributo já pago indevidamente nos últimos 5 anos", "REPETICAO"],
      ["Pagar, mas há recusa do Fisco ou dúvida sobre qual ente deve receber", "CONSIGNACAO"]
    ]
  },
  execucao: {
    q: "Há garantia integral do juízo executivo?",
    o: [
      ["Sim (penhora, depósito em dinheiro, seguro-garantia ou fiança)", "EMBARGOS"],
      ["Não, e a matéria é de ordem pública (prescrição, decadência, imunidade) sem dilação", "EPE"]
    ]
  },
  decisao: {
    q: "Qual a natureza da decisão judicial?",
    o: [
      ["Sentença definitiva que extinguiu o processo (com ou sem resolução de mérito)", "APELACAO"],
      ["Decisão interlocutória de urgência (liminar, tutela, penhora) em 1º grau", "AGRAVO_INST"],
      ["Decisão monocrática proferida por Desembargador ou Ministro Relator", "AGRAVO_INT"],
      ["Acórdão que denegou Mandado de Segurança originário de Tribunal (TJ ou TRF)", "ROC"]
    ]
  }
};

export const CASOS_SIMULADO: { id: number; titulo: string; enunciado: string }[] = [
  {
    id: 0,
    titulo: "Prova 01: Mandado de Segurança (ICMS Filiais)",
    enunciado: "A empresa Alfa Ltda., com matriz em Juiz de Fora/MG e filiais em outros Estados, foi autuada pelo Estado de Minas Gerais por não recolher ICMS nas transferências de mercadorias entre seus estabelecimentos. O auto de infração foi lavrado há 20 dias e a empresa dispõe de toda a prova documental pré-constituída. Na qualidade de advogado(a), elabore a peça cabível, abordando as teses de direito material (ADC 49/STF e Súmula 166/STJ), a medida liminar e os pedidos correspondentes."
  },
  {
    id: 1,
    titulo: "Prova 02: Embargos à Execução Fiscal",
    enunciado: "O Município X ajuizou execução fiscal contra Beta S.A. para cobrança de ISS. A empresa foi citada, teve bem imóvel penhorado e foi intimada da penhora há 10 dias. Alega que os serviços foram prestados em outro Município e que parte do crédito está prescrita. Elabore a peça cabível demonstrando o cabimento diante da garantia do juízo e o efeito suspensivo."
  },
  {
    id: 2,
    titulo: "Prova 03: Ação Anulatória",
    enunciado: "Gama Ltda. recebeu notificação de lançamento de IPTU com base em valor venal superior ao da planta genérica de valores, majorado por decreto do Prefeito sem lei formal. Ainda não houve inscrição em dívida ativa e a empresa necessita de perícia para demonstrar a disparidade de avaliação, não pretendendo pagar previamente. Elabore a peça cabível com pedido de tutela provisória de urgência."
  },
  {
    id: 3,
    titulo: "Prova 04: Recurso de Apelação",
    enunciado: "Em ação ordinária, o juízo julgou improcedente o pedido de Delta Ltda. de afastar a incidência de contribuição previdenciária sobre verbas rescisórias e indenizatórias, condenando-a ao pagamento de honorários. A sentença foi publicada há 8 dias úteis. Elabore a peça cabível, estruturando folha de interposição e folha de razões."
  },
  {
    id: 4,
    titulo: "Prova 05: Repetição de Indébito",
    enunciado: "Épsilon Ltda. recolheu, durante os últimos cinco anos, taxa estadual cuja lei instituidora foi declarada inconstitucional pelo STF em controle concentrado de constitucionalidade. A empresa comprova o pagamento indevido e suportou integralmente o encargo financeiro. Elabore a peça cabível com pedido de incidência exclusiva da taxa SELIC (EC 113/2021)."
  },
  {
    id: 5,
    titulo: "Prova 06: Exceção de Pré-Executividade",
    enunciado: "Zeta S.A. foi executada pela União por crédito tributário cujo lançamento de ofício foi notificado há mais de seis anos sem qualquer causa interruptiva ou suspensiva da prescrição. A empresa não possui bens livres para penhora. A prova da prescrição quinquenal da cobrança é exclusivamente documental. Elabore a peça cabível."
  },
  {
    id: 6,
    titulo: "Prova 07: Agravo de Instrumento",
    enunciado: "O juiz da 1ª Vara da Fazenda Pública deferiu tutela cautelar de urgência em favor do Estado, determinando o bloqueio de ativos financeiros de Eta Ltda. antes da citação e sem oportunidade de manifestação prévia. A intimação foi disponibilizada no diário há 5 dias úteis. Elabore o recurso cabível diretamente ao Tribunal competente com pedido de efeito suspensivo/tutela recursal."
  },
  {
    id: 7,
    titulo: "Prova 08: Consignação em Pagamento",
    enunciado: "Teta Ltda. pretende pagar o ISS devido pela prestação de serviço, mas o Município A e o Município B simultaneamente exigem o mesmo imposto sobre o mesmo fato gerador, recusando-se a receber sem renúncia de direitos. Elabore a peça cabível indicando a competência e o depósito do montante devido em consignação."
  }
];

export const IMPOSTOS_DATA = [
  { nome: "II – Importação", ente: "FEDERAL", base: "Art. 153, I, CF", desc: "Fato gerador: entrada de produto estrangeiro. Extrafiscal; alíquotas alteráveis pelo Poder Executivo Federal; exceção aos princípios da legalidade e de ambas as anterioridades." },
  { nome: "IE – Exportação", ente: "FEDERAL", base: "Art. 153, II, CF", desc: "Fato gerador: saída do território nacional de produto nacional ou nacionalizado. Extrafiscal; alíquotas alteráveis pelo Executivo; exceção à legalidade e à anterioridade." },
  { nome: "IR – Imposto de Renda", ente: "FEDERAL", base: "Art. 153, III, CF", desc: "Aquisição da disponibilidade econômica ou jurídica de renda e proventos. Critérios: generalidade, universalidade e progressividade. Exceção à anterioridade nonagesimal (respeita a anual)." },
  { nome: "IPI – Produtos Industrializados", ente: "FEDERAL", base: "Art. 153, IV, CF", desc: "Saída de produto industrializado e desembaraço aduaneiro. Seletivo em função da essencialidade e não cumulativo. Exceção à anterioridade anual (sujeito à noventena). Alíquotas alteráveis por decreto." },
  { nome: "IOF – Operações Financeiras", ente: "FEDERAL", base: "Art. 153, V, CF", desc: "Operações de crédito, câmbio, seguro e títulos/valores mobiliários. Extrafiscal; exceção à legalidade e a ambas as anterioridades (anual e nonagesimal)." },
  { nome: "ITR – Propriedade Territorial Rural", ente: "FEDERAL", base: "Art. 153, VI, CF", desc: "Propriedade, posse ou domínio útil de imóvel fora da zona urbana. Progressivo e extrafiscal; fiscalização e arrecadação podem ser delegadas ao Município (100% da arrecadação permanece se conveniado)." },
  { nome: "ITCMD – Causa Mortis e Doação", ente: "ESTADUAL", base: "Art. 155, I, CF", desc: "Transmissão causa mortis e doação de quaisquer bens ou direitos. Alíquota máxima fixada pelo Senado Federal; bens imóveis: competência do Estado onde situado o bem." },
  { nome: "ICMS – Circulação de Mercadorias e Serviços", ente: "ESTADUAL", base: "Art. 155, II, CF", desc: "Operações relativas à circulação de mercadorias e prestação de serviços de transporte interestadual/intermunicipal e de comunicação. Não cumulativo; seletivo facultativo; regido pela LC 87/96 (Lei Kandir)." },
  { nome: "IPVA – Veículos Automotores", ente: "ESTADUAL", base: "Art. 155, III, CF", desc: "Propriedade de veículo automotor. Alíquotas mínimas fixadas pelo Senado Federal; exceção à anterioridade nonagesimal na fixação da base de cálculo (valor venal)." },
  { nome: "IPTU – Propriedade Predial e Territorial Urbana", ente: "MUNICIPAL", base: "Art. 156, I, CF", desc: "Propriedade, posse ou domínio útil de imóvel na zona urbana. Base: valor venal. Progressivo no tempo (extrafiscal) e em razão do valor. Exceção à noventena na fixação da base." },
  { nome: "ITBI – Transmissão Inter Vivos de Imóveis", ente: "MUNICIPAL", base: "Art. 156, II, CF", desc: "Transmissão inter vivos, a título oneroso, de bens imóveis e direitos reais. Base: valor de mercado (Art. 38 CTN, LC 227/2026). Não incide na integralização de capital social." },
  { nome: "ISS – Serviços de Qualquer Natureza", ente: "MUNICIPAL", base: "Art. 156, III, CF", desc: "Serviços constantes da lista anexa à LC 116/2003 não tributados pelo ICMS. Alíquota mínima de 2% e máxima de 5%. Regra geral: local do estabelecimento prestador." },
  { nome: "IBS – Imposto sobre Bens e Serviços", ente: "REFORMA", base: "Art. 156-A, CF (EC 132/23)", desc: "Imposto de competência compartilhada entre Estados, DF e Municípios através do Comitê Gestor (CGIBS). Substitui ICMS e ISS; não cumulatividade ampla; cobrança no destino; regido pela LC 214/2025." },
  { nome: "CBS – Contribuição sobre Bens e Serviços", ente: "REFORMA", base: "Art. 195, V, CF (EC 132/23)", desc: "Contribuição federal sobre bens e serviços de competência da União. Substitui PIS e Cofins. Mesma base, incidência e regras harmonizadas com o IBS." },
  { nome: "IS – Imposto Seletivo", ente: "REFORMA", base: "Art. 153, VIII, CF (EC 132/23)", desc: "Imposto da União incidente uma única vez sobre produção, extração, comercialização ou importação de bens e serviços prejudiciais à saúde ou ao meio ambiente. Não incide em exportações." }
];

export const MATERIAL_DATA = [
  {
    cat: "Princípios e imunidades",
    titulo: "Imunidades Constitucionais (Art. 150, VI, CF/88)",
    texto: "Atinge exclusivamente IMPOSTOS. Abrange: (a) Imunidade Recíproca entre Entes Federados, extensiva a autarquias e fundações públicas (§2º); (b) Templos de qualquer culto; (c) Patrimônio, renda e serviços dos partidos políticos, entidades sindicais dos trabalhadores e instituições de educação e assistência social sem fins lucrativos (Art. 14 CTN); (d) Livros, jornais, periódicos e papel destinado à sua impressão (estendida a e-books e e-readers - SV 57); (e) Fonogramas e videofonogramas musicais nacionais. Imóvel alugado segue imune se os aluguéis forem vertidos às atividades essenciais (SV 52 e Súmula 724 STF)."
  },
  {
    cat: "Obrigação e crédito",
    titulo: "Suspensão da Exigibilidade do Crédito (Art. 151 CTN)",
    texto: "Rol taxativo do Art. 151 do CTN: I - moratória; II - o depósito do seu montante integral e em dinheiro (Súmula 112 STJ); III - as reclamações e os recursos administrativos; IV - a concessão de medida liminar em mandado de segurança; V - a concessão de medida liminar ou de tutela antecipada em outras espécies de ação judicial; VI - o parcelamento; VII - a submissão a arbitragem; VIII - transação; IX - mediação; X - fiança ou seguro-garantia aceitos (LC 236/2026). Efeito: impede a execução fiscal e garante Certidão Positiva com Efeito de Negativa (Art. 206 CTN)."
  },
  {
    cat: "Obrigação e crédito",
    titulo: "Extinção do Crédito Tributário (Art. 156 CTN)",
    texto: "Modalidades: I - pagamento; II - compensação; III - transação; IV - remissão; V - prescrição e decadência; VI - conversão de depósito em renda; VII - pagamento antecipado e a homologação do lançamento; VIII - consignação em pagamento julgada procedente; IX - decisão administrativa irreformável; X - decisão judicial passada em julgado; XI - dação em pagamento em bens imóveis; XII - sentença arbitral; XIII - cumprimento de termo de mediação (LC 236/2026)."
  },
  {
    cat: "Obrigação e crédito",
    titulo: "Decadência e Prescrição no Direito Tributário",
    texto: "Decadência: prazo de 5 anos para o Fisco CONSTITUIR o crédito pelo lançamento. Conta-se: da data do fato gerador se houver pagamento parcial em tributo por homologação sem fraude (Art. 150, §4º, CTN); ou do primeiro dia do exercício seguinte àquele em que o lançamento poderia ter sido efetuado (Art. 173, I, CTN e Súmula 555 STJ). Prescrição: prazo de 5 anos da constituição definitiva para COBRAR judicialmente (Art. 174 CTN). Interrupção pelo despacho citatório (Art. 174, parágrafo único, I) com efeito retroativo à propositura."
  },
  {
    cat: "Obrigação e crédito",
    titulo: "Responsabilidade Tributária e Sócio-Gerente",
    texto: "Sucessores (Arts. 129 a 133 CTN), terceiros com responsabilidade subsidiária (Art. 134 CTN) e responsabilidade pessoal dos sócios/diretores (Art. 135, III, CTN). O simples inadimplemento da obrigação tributária não enseja o redirecionamento da execução fiscal contra o sócio-gerente (Súmula 430 STJ). O redirecionamento pressupõe dissolução irregular da sociedade empresária (Súmula 435 STJ) ou ato com excesso de mandato / infração à lei."
  },
  {
    cat: "Obrigação e crédito",
    titulo: "Repetição de Indébito e Atualização (Art. 165 CTN)",
    texto: "Direito de restituição do tributo pago a maior ou indevidamente no prazo decadencial de 5 anos (Art. 168, I, CTN). Em tributos indiretos (ICMS, IPI), exige prova de ter assumido o encargo financeiro ou autorização expressa do contribuinte de fato (Art. 166 CTN e Súmula 546 STF). A atualização monetária e juros ocorrem exclusivamente pela taxa SELIC, sem cumulação (Art. 3º da EC 113/2021 e Tema 1.419 STF)."
  },
  {
    cat: "Tributo e competência",
    titulo: "Conceito de Tributo e Teoria Quinária",
    texto: "Art. 3º do CTN: prestação pecuniária compulsória, em moeda ou cujo valor nela se possa exprimir, que não constitua sanção de ato ilícito, instituída em lei e cobrada mediante atividade administrativa plenamente vinculada. Princípio do non olet (Art. 118, I, CTN): tributa-se a capacidade contributiva originada mesmo em atividades ilícitas. Espécies da Teoria Pentapartida (STF): impostos, taxas, contribuições de melhoria, empréstimos compulsórios e contribuições especiais."
  },
  {
    cat: "Processo e execução fiscal",
    titulo: "Execução Fiscal (LEF Lei 6.830/80) e Defesas",
    texto: "A CDA goza de presunção relativa de certeza e liquidez (Art. 204 CTN). Formas de defesa: (1) Embargos à Execução Fiscal: prazo de 30 dias contados do depósito, fiança, seguro ou intimação da penhora (Art. 16 LEF); (2) Exceção de Pré-Executividade: sem garantia do juízo, para matérias de ordem pública comprováveis por prova pré-constituída (Súmula 393 STJ); (3) Prescrição intercorrente: paralisação por 1 ano de suspensão + 5 anos de arquivamento (Art. 40 LEF e Súmula 314 STJ)."
  },
  {
    cat: "Impostos e taxas",
    titulo: "Taxas e Contribuição de Melhoria (Art. 145 CF/88)",
    texto: "Taxas exigem efetivo poder de polícia ou serviço público específico e divisível posto à disposição (Art. 145, II, CF). A base de cálculo não pode ser integralmente idêntica à de imposto (SV 29). Taxa de lixo e coleta domiciliar é constitucional (SV 19). Taxa de iluminação pública é inconstitucional (SV 41) – substituída pela COSIP (Art. 149-A). Taxa de matrícula universitária pública é inconstitucional (SV 12)."
  },
  {
    cat: "Reforma 2026",
    titulo: "Reforma Tributária sobre o Consumo (EC 132/23 e LC 214/25)",
    texto: "Criação do modelo IVA Dual: IBS (Estados e Municípios através do Comitê Gestor) e CBS (União), além do Imposto Seletivo (IS). Princípios basilares: não cumulatividade plena (crédito financeiro imediato), tributação no destino da mercadoria ou serviço, cashback para famílias de baixa renda e split payment nas liquidações financeiras. Transição progressiva de 2026 até 2033 com extinção definitiva de PIS, COFINS, IPI, ICMS e ISS."
  },
  {
    cat: "Reforma 2026",
    titulo: "Leis Complementares nº 227/2026 e 236/2026",
    texto: "A LC 227/2026 disciplinou a gestão do Comitê do IBS e normas gerais de ITBI e ITCMD (base de cálculo pelo valor de mercado). A LC 236/2026 (vigor desde 04/09/2026) alterou o CTN: instituiu teto geral para multas punitivas (75%, 100% ou 150% - Art. 113-A), incluiu causas de suspensão e extinção (mediação, arbitragem, seguro-fiança), disciplinou novos marcos de interrupção da prescrição (Art. 174) e vinculou o Fisco a decisões dos tribunais superiores (Art. 194-A)."
  }
];

export const PRECEDENTES_QUALIFICADOS = [
  { tr: "STF", tema: "53", titulo: "Alteração de Alíquotas do Imposto de Exportação", texto: "É compatível com a Constituição Federal a norma infraconstitucional que atribui a órgão integrante do Poder Executivo da União a faculdade de alterar as alíquotas do Imposto de Exportação." },
  { tr: "STF", tema: "69", titulo: "Tese do Século: ICMS na Base de PIS/COFINS", texto: "O ICMS não compõe a base de cálculo para a incidência do PIS e da COFINS." },
  { tr: "STF", tema: "104", titulo: "Incidência de IOF em Mútuo entre PJ", texto: "É constitucional a incidência do IOF sobre operações de crédito correspondentes a mútuo de recursos financeiros entre pessoas jurídicas ou entre pessoa jurídica e pessoa física, não se restringindo a instituições financeiras." },
  { tr: "STF", tema: "125", titulo: "Incidência de ISS sobre Leasing Financeiro", texto: "É constitucional a incidência do Imposto sobre Serviços de Qualquer Natureza (ISS) sobre as operações de arrendamento mercantil (leasing financeiro)." },
  { tr: "STF", tema: "201", titulo: "Restituição de ICMS-ST Pago a Mais", texto: "É devida a restituição da diferença do ICMS pago a mais no regime de substituição tributária para a frente se a base de cálculo efetiva da operação for inferior à presumida." },
  { tr: "STF", tema: "211", titulo: "Atualização do Valor Venal de Imóveis no IPTU", texto: "A majoração do valor venal dos imóveis para efeito da cobrança de IPTU não prescinde da edição de lei em sentido formal, salvo quando a atualização não excede os índices oficiais anuais de correção inflacionária." },
  { tr: "STF", tema: "796", titulo: "Imunidade de ITBI na Integralização de Capital", texto: "A imunidade em relação ao ITBI (Art. 156, §2º, I, CF) não alcança o valor dos bens que exceder o limite do capital social subscrito a ser integralizado." },
  { tr: "STF", tema: "816", titulo: "Teto Constitucional da Multa Moratória", texto: "A multa moratória cobrada pelo Fisco não pode ultrapassar o patamar de 20%, sob pena de violação ao princípio do não confisco (Art. 150, IV, CF)." },
  { tr: "STF", tema: "962", titulo: "Não Incidência de IRPJ/CSLL sobre a Taxa SELIC no Indébito", texto: "É inconstitucional a incidência do IRPJ e da CSLL sobre os valores atinentes à taxa Selic recebidos pelo contribuinte em razão de repetição de indébito tributário." },
  { tr: "STF", tema: "1099", titulo: "Não Incidência de ICMS no Deslocamento entre Estabelecimentos", texto: "Não incide ICMS no deslocamento de bens e mercadorias de um estabelecimento para outro do mesmo titular localizados em estados distintos, visto não haver a transferência da titularidade jurídica." },
  { tr: "STF", tema: "1419", titulo: "Aplicação da Taxa SELIC Conforme EC 113/2021", texto: "A taxa SELIC prevista no art. 3º da EC 113/2021 é de aplicação obrigatória para atualização monetária e juros na repetição ou condenação da Fazenda Pública." },
  { tr: "STJ", tema: "104", titulo: "Sócio Constante da CDA e EPE", texto: "A exceção de pré-executividade é cabível na execução fiscal relativamente às matérias de ordem pública conhecíveis de ofício que não demandem dilação probatória." },
  { tr: "STJ", tema: "142", titulo: "Termo Inicial da Repetição em Lei Inconstitucional", texto: "O prazo quinquenal para pleitear a repetição tributária conta-se da data do efetivo pagamento indevido, sendo despicienda a posterior declaração de inconstitucionalidade pelo STF." },
  { tr: "STJ", tema: "430", titulo: "Inadimplemento Tributário e Sócio-Gerente", texto: "O mero inadimplemento da obrigação tributária pela sociedade não gera, por si só, a responsabilidade pessoal e solidária do sócio-gerente." },
  { tr: "STJ", tema: "435", titulo: "Presunção de Dissolução Irregular", texto: "Presume-se dissolvida irregularmente a empresa que deixar de funcionar no seu domicílio fiscal sem comunicação aos órgãos competentes, legitimando o redirecionamento da execução fiscal para o sócio-gerente." },
  { tr: "STJ", tema: "566", titulo: "Sistemática da Prescrição Intercorrente (Art. 40 LEF)", texto: "O prazo de 1 ano de suspensão inicia-se automaticamente da ciência da Fazenda a respeito da não localização de bens, findo o qual flui a prescrição quinquenal." },
  { tr: "STJ", tema: "1113", titulo: "Base de Cálculo do ITBI: Valor da Transação", texto: "A base de cálculo do ITBI é o valor do imóvel transmitido em condições normais de mercado declarado pelo contribuinte, não vinculada à base do IPTU nem a pauta prévia unilateral do Município." }
];

export const SUMULAS_DATA: SumulaItem[] = [
  // Súmulas Vinculantes (STF)
  { tr: "SV", num: "8", texto: "São inconstitucionais os parágrafos únicos dos arts. 5º do DL 1.569/77 e os arts. 45 e 46 da Lei 8.212/91, que tratam de prescrição e decadência de crédito tributário (matéria reservada a lei complementar).", tema: "Prescrição e Decadência" },
  { tr: "SV", num: "12", texto: "A cobrança de taxa de matrícula nas universidades públicas viola o disposto no art. 206, IV, da Constituição Federal.", tema: "Taxa de Matrícula" },
  { tr: "SV", num: "19", texto: "A taxa cobrada exclusivamente em razão dos serviços públicos de coleta, remoção e tratamento ou destinação de lixo ou resíduos provenientes de imóveis não viola o art. 145, II, CF.", tema: "Taxa de Coleta de Lixo" },
  { tr: "SV", num: "21", texto: "É inconstitucional a exigência de depósito ou arrolamento prévios de dinheiro ou bens para admissibilidade de recurso administrativo.", tema: "Processo Administrativo Fiscal" },
  { tr: "SV", num: "28", texto: "É inconstitucional a exigência de depósito prévio como requisito de admissibilidade de ação judicial na qual se pretenda discutir a exigibilidade de crédito tributário.", tema: "Ação Judicial e Depósito" },
  { tr: "SV", num: "29", texto: "É constitucional a adoção, no cálculo do valor de taxa, de um ou mais elementos da base de cálculo própria de determinado imposto, desde que não haja identidade integral.", tema: "Base de Cálculo de Taxa" },
  { tr: "SV", num: "31", texto: "É inconstitucional a incidência do ISS sobre operações de locação de bens móveis.", tema: "ISS e Locação" },
  { tr: "SV", num: "32", texto: "O ICMS não incide sobre alienação de salvados de sinistro pelas seguradoras.", tema: "ICMS Salvados de Sinistro" },
  { tr: "SV", num: "41", texto: "O serviço de iluminação pública não pode ser remunerado mediante taxa.", tema: "Iluminação Pública e CIP" },
  { tr: "SV", num: "48", texto: "Na entrada de mercadoria importada do exterior, é legítima a cobrança do ICMS por ocasião do desembaraço aduaneiro.", tema: "ICMS Importação" },
  { tr: "SV", num: "50", texto: "Norma legal que altera o prazo de recolhimento de obrigação tributária não se sujeita ao princípio da anterioridade.", tema: "Prazo de Recolhimento" },
  { tr: "SV", num: "52", texto: "Ainda que alugado a terceiros, permanece imune ao IPTU o imóvel pertencente a entidade imune, desde que o valor dos aluguéis seja aplicado nas atividades essenciais da entidade.", tema: "Imunidade de IPTU Aluguel" },
  { tr: "SV", num: "57", texto: "A imunidade tributária do art. 150, VI, d, CF aplica-se ao livro eletrônico e aos suportes exclusivamente utilizados para fixá-lo.", recente: true, dataInfo: "Atualizada nos últimos 6 meses", mesesAtras: 5, tema: "Livros Eletrônicos / E-readers" },
  { tr: "SV", num: "58", texto: "Inexiste direito a crédito presumido de IPI relativamente à entrada de insumos isentos, sujeitos à alíquota zero ou não tributáveis.", recente: true, dataInfo: "Adicionada nos últimos 6 meses", mesesAtras: 3, tema: "IPI e Insumos Isentos/Zero" },
  { tr: "SV", num: "59", texto: "A disponibilização de conteúdos de áudio, vídeo, imagem e texto por meio da internet sujeita-se ao ISSQN, competindo ao Município do domicílio do prestador.", recente: true, dataInfo: "Adicionada nos últimos 6 meses", mesesAtras: 4, tema: "ISS em Streaming e Conteúdos" },

  // Súmulas do Supremo Tribunal Federal (STF)
  { tr: "STF", num: "70", texto: "É inadmissível a interdição de estabelecimento como meio coercitivo para cobrança de tributo.", tema: "Sanções Políticas e Cobrança" },
  { tr: "STF", num: "323", texto: "É inadmissível a apreensão de mercadorias como meio coercitivo para pagamento de tributos.", tema: "Apreensão de Mercadorias" },
  { tr: "STF", num: "547", texto: "Não é lícito à autoridade proibir que o contribuinte em débito adquira estampilhas, despache mercadorias nas alfândegas e exerça suas atividades profissionais.", tema: "Livre Exercício da Atividade" },
  { tr: "STF", num: "724", texto: "Ainda quando alugado a terceiros, permanece imune ao IPTU o imóvel pertencente a instituição de assistência social ou de educação sem fins lucrativos.", tema: "Imunidade Assistencial IPTU" },

  // Súmulas do Superior Tribunal de Justiça (STJ)
  { tr: "STJ", num: "105", texto: "Na ação de mandado de segurança não se admite condenação em honorários advocatícios.", tema: "Mandado de Segurança e Honorários" },
  { tr: "STJ", num: "106", texto: "Proposta a ação no prazo fixado para o seu exercício, a demora na citação, por motivos inerentes ao mecanismo da justiça, não justifica o acolhimento da arguição de prescrição ou decadência.", tema: "Demora na Citação Judicial" },
  { tr: "STJ", num: "112", texto: "O depósito somente suspende a exigibilidade do crédito tributário se for integral e em dinheiro.", tema: "Depósito do Art. 151, II CTN" },
  { tr: "STJ", num: "166", texto: "Não constitui fato gerador do ICMS o simples deslocamento de mercadoria de um para outro estabelecimento do mesmo contribuinte.", tema: "ICMS Entre Filiais (ADC 49)" },
  { tr: "STJ", num: "212", texto: "A compensação de créditos tributários não pode ser deferida em ação cautelar ou por medida liminar cautelar ou antecipatória.", tema: "Compensação Tributária e Liminar" },
  { tr: "STJ", num: "213", texto: "O mandado de segurança constitui ação adequada para a declaração do direito à compensação tributária.", tema: "Compensação em Mandado de Segurança" },
  { tr: "STJ", num: "314", texto: "Em execução fiscal, não localizados bens penhoráveis, suspende-se o processo por um ano, findo o qual se inicia o prazo da prescrição quinquenal intercorrente.", tema: "Prescrição Intercorrente (LEF)" },
  { tr: "STJ", num: "392", texto: "A Fazenda Pública pode substituir a CDA até a prolação da sentença de embargos, quando se tratar de correção de erro material ou formal, vedada a modificação do sujeito passivo da execução.", tema: "Substituição da CDA" },
  { tr: "STJ", num: "393", texto: "A exceção de pré-executividade é admissível na execução fiscal relativamente às matérias conhecíveis de ofício que não demandem dilação probatória.", tema: "Exceção de Pré-Executividade" },
  { tr: "STJ", num: "430", texto: "O inadimplemento da obrigação tributária pela sociedade não gera, por si só, a responsabilidade solidária do sócio-gerente.", tema: "Responsabilidade dos Sócios" },
  { tr: "STJ", num: "435", texto: "Presume-se dissolvida irregularmente a empresa que deixar de funcionar no seu domicílio fiscal sem comunicação aos órgãos competentes, legitimando o redirecionamento da execução fiscal para o sócio-gerente.", tema: "Dissolução Irregular e Redirecionamento" },
  { tr: "STJ", num: "436", texto: "A entrega de declaração pelo contribuinte reconhecendo débito fiscal constitui o crédito tributário, dispensada qualquer outra providência por parte do fisco.", tema: "Constituição por DCTF/GIA" },
  { tr: "STJ", num: "446", texto: "Declarado e não pago o débito tributário pelo contribuinte, é legítima a recusa de expedição de certidão negativa.", tema: "Certidão Negativa e Débito Declarado" },
  { tr: "STJ", num: "461", texto: "O contribuinte pode optar por receber, por meio de precatório ou por compensação, o indébito tributário certificado por sentença declaratória transitada em julgado.", tema: "Opção Precatório ou Compensação" },
  { tr: "STJ", num: "555", texto: "Quando não houver declaração do débito, o prazo decadencial quinquenal para o Fisco constituir o crédito tributário conta-se exclusivamente na forma do art. 173, I, do CTN.", tema: "Decadência do Art. 173, I CTN" },
  { tr: "STJ", num: "598", texto: "É desnecessária a apresentação de laudo médico oficial para o reconhecimento judicial da isenção do imposto de renda, desde que o magistrado entenda demonstrada a moléstia por outras provas.", recente: true, dataInfo: "Atualizada nos últimos 6 meses", mesesAtras: 6, tema: "Isenção IRPF e Laudo Particular" },
  { tr: "STJ", num: "612", texto: "O CEBAS, no prazo de sua validade, possui natureza declaratória para fins tributários, retroagindo seus efeitos à data em que demonstrado o cumprimento dos requisitos legais.", recente: true, dataInfo: "Atualizada nos últimos 6 meses", mesesAtras: 5, tema: "CEBAS e Imunidade Beneficente" },
  { tr: "STJ", num: "627", texto: "O contribuinte faz jus à isenção do imposto de renda por moléstia grave sem necessidade de demonstrar a contemporaneidade dos sintomas ou recidiva.", recente: true, dataInfo: "Adicionada nos últimos 6 meses", mesesAtras: 4, tema: "Isenção IRPF Moléstia Grave" },
  { tr: "STJ", num: "649", texto: "Não incide IPI sobre veículo automotor importado para uso próprio por pessoa física que não seja comerciante nem habitual importadora.", recente: true, dataInfo: "Adicionada nos últimos 5 meses", mesesAtras: 5, tema: "IPI e Importação Pessoa Física" },
  { tr: "STJ", num: "653", texto: "O pedido de parcelamento fiscal, ainda que indeferido, interrompe o prazo prescricional, pois caracteriza confissão extrajudicial inequívoca do débito.", recente: true, dataInfo: "Adicionada nos últimos 3 meses", mesesAtras: 3, tema: "Parcelamento e Prescrição" },
  { tr: "STJ", num: "656", texto: "É válida a apresentação de fiança bancária ou seguro-garantia em medida preparatória para fins de expedição de Certidão Positiva com Efeitos de Negativa (CPD-EN, art. 206 do CTN).", recente: true, dataInfo: "Adicionada nos últimos 4 meses", mesesAtras: 4, tema: "Garantia Antecipada e CPD-EN" },
  { tr: "STJ", num: "659", texto: "A fração de imóvel indivisível pertencente ao devedor não pode ser expropriada caso sirva de residência à entidade familiar, resguardando-se a impenhorabilidade do bem de família.", recente: true, dataInfo: "Adicionada nos últimos 3 meses", mesesAtras: 3, tema: "Execução Fiscal e Bem de Família" },
  { tr: "STJ", num: "665", texto: "O pagamento integral do tributo com os devidos acréscimos moratórios antes de qualquer procedimento fiscalizatório afasta a exigência de multa de mora, configurando denúncia espontânea (Art. 138 do CTN).", recente: true, dataInfo: "Adicionada nos últimos 2 meses", mesesAtras: 2, tema: "Denúncia Espontânea e Multa de Mora" },
  { tr: "STJ", num: "668", texto: "Não incide IRPJ e CSLL sobre os valores decorrentes de incentivos e benefícios fiscais de ICMS (isenção, redução de base de cálculo e crédito presumido), com fulcro no art. 30 da Lei 12.973/2014.", recente: true, dataInfo: "Adicionada nos últimos 1 mês", mesesAtras: 1, tema: "Não incidência IRPJ/CSLL em Benefícios ICMS" }
];

export const FLASHCARDS_DATA = [
  { c: "IMUNIDADES", p: "A imunidade tributária recíproca (Art. 150, VI, 'a', CF) alcança taxas e contribuições de melhoria?", r: "Não. A imunidade recíproca abrange exclusivamente IMPOSTOS sobre patrimônio, renda e serviços dos entes federados e suas autarquias/fundações públicas vinculadas às finalidades essenciais." },
  { c: "IMUNIDADES", p: "Qual o instrumento normativo indispensável para fixar as condições de imunidade das entidades de assistência social e educação?", r: "Lei Complementar formal (Art. 146, II, c/c Art. 150, VI, 'c', CF e Art. 14 do CTN): não distribuir patrimônio ou lucro, aplicar os recursos no país e manter escrituração contábil regular." },
  { c: "IMUNIDADES", p: "Livros eletrônicos (e-books) e suportes materiais de leitura digital (e-readers) são alcançados pela imunidade de livros?", r: "Sim. Conforme entendimento firmado pelo STF na Súmula Vinculante 57 e Tema 593 da Repercussão Geral, aplicando-se interpretação teleológica ao Art. 150, VI, 'd', da CF/88." },
  { c: "IMPOSTOS", p: "Quais impostos federais constituem exceção simultânea aos princípios da anterioridade anual e nonagesimal?", r: "II (Importação), IE (Exportação), IOF (Operações Financeiras) e Imposto Extraordinário de Guerra (Art. 154, II). O IR é exceção apenas à noventena; o IPI é exceção apenas à anterioridade anual." },
  { c: "IMPOSTOS", p: "Qual é o piso e o teto constitucional da alíquota do ISS fixados por Lei Complementar nacional?", r: "Alíquota mínima de 2% (para coibir guerra fiscal - Art. 88 ADCT) e máxima de 5% (Art. 8º da LC 116/2003)." },
  { c: "IMPOSTOS", p: "O ICMS incide sobre operações de transferência física de mercadorias entre estabelecimentos do mesmo titular?", r: "Não. Conforme Súmula 166 do STJ e decisão do STF na ADC 49, a circulação meramente física de mercadoria entre matriz e filiais não configura circulação jurídica (não há transferência de titularidade)." },
  { c: "IMPOSTOS", p: "Quem detém competência constitucional privativa para fixar alíquotas máximas de ITCMD e mínimas de IPVA?", r: "O Senado Federal, por meio de Resolução própria (Art. 155, §1º, IV e §6º, I, da CF/88)." },
  { c: "EXECUCAO", p: "Qual é o prazo legal e a partir de quando se conta para a oposição de Embargos à Execução Fiscal?", r: "Prazo de 30 dias contados do depósito integral em dinheiro, da juntada da fiança bancária ou seguro-garantia, ou da data da efetiva intimação da penhora (Art. 16 da LEF - Lei 6.830/80)." },
  { c: "EXECUCAO", p: "Quais são os dois requisitos cumulativos essenciais para o cabimento da Exceção de Pré-Executividade (EPE)?", r: "1) Versar sobre matérias de ordem pública conhecíveis de ofício pelo magistrado (ex: prescrição, decadência, nulidade da CDA); 2) Comprovação de plano mediante prova pré-constituída, sem dilação probatória (Súmula 393 STJ)." },
  { c: "EXECUCAO", p: "Como se opera a sistemática da prescrição intercorrente na execução fiscal conforme o Art. 40 da LEF e Súmula 314 STJ?", r: "Não localizados o devedor ou bens penhoráveis, o processo suspende-se por 1 ano; findo este prazo sem provocação da Fazenda, inicia-se automaticamente o prazo de 5 anos da prescrição intercorrente." },
  { c: "EXECUCAO", p: "A oposição de Embargos à Execução Fiscal suspende automaticamente o prosseguimento da execução?", r: "Não. O efeito suspensivo não é automático; depende de requerimento expresso e preenchimento dos requisitos do Art. 919, §1º, do CPC (garantia prévia do juízo + relevância do direito + perigo de dano irreparável)." },
  { c: "CREDITO", p: "Quais são as causas taxativas de suspensão da exigibilidade do crédito tributário previstas no Art. 151 do CTN?", r: "I - Moratória; II - Depósito integral e em dinheiro; III - Reclamações e recursos administrativos; IV - Liminar em MS; V - Liminar ou tutela provisória em outras ações; VI - Parcelamento; VII - Arbitragem; VIII - Transação; IX - Mediação; X - Fiança/seguro aceitos (LC 236/2026)." },
  { c: "CREDITO", p: "Qual é a regra geral para a contagem do prazo decadencial do lançamento de ofício suplementar?", r: "Cinco anos contados do primeiro dia do exercício financeiro seguinte àquele em que o lançamento poderia ter sido efetuado (Art. 173, I, do CTN)." },
  { c: "CREDITO", p: "A compensação de créditos tributários pode ser efetivada antes do trânsito em julgado da decisão judicial?", r: "Não. É expressamente vedada a compensação mediante liminar ou antes do trânsito em julgado da sentença declaratória, por força do Art. 170-A do CTN e Súmula 212 do STJ." },
  { c: "CREDITO", p: "Em quanto tempo se extingue o direito do contribuinte de pleitear judicialmente a restituição de tributo pago indevidamente?", r: "Em 5 anos contados da data da extinção do crédito pelo pagamento indevido (Art. 168, I, do CTN)." },
  { c: "REFORMA", p: "Quais tributos federais, estaduais e municipais serão substituídos pelo IBS e pela CBS criados pela EC 132/2023?", r: "O IBS (subnacional) substitui o ICMS e o ISS; a CBS (federal) substitui o PIS e a COFINS. O IPI será reduzido a alíquota zero nacionalmente (exceto itens da Zona Franca de Manaus) e haverá o Imposto Seletivo." },
  { c: "REFORMA", p: "Qual Lei Complementar formalizou o regime geral, o fato gerador e as regras de não cumulatividade do IBS, CBS e Imposto Seletivo?", r: "A Lei Complementar nº 214/2025, complementada institucionalmente pela Lei Complementar nº 227/2026 (Comitê Gestor do IBS)." },
  { c: "REFORMA", p: "Qual a finalidade constitucional precípua do Imposto Seletivo (Art. 153, VIII, CF)?", r: "Tributo de natureza extrafiscal da União para desestimular a produção, comercialização ou importação de bens e serviços prejudiciais à saúde humana ou ao meio ambiente. Incidência monofásica, desonerando exportações." }
];

export const VADE_DATA = [
  { cor: "AMARELO", ref: "Art. 3º CTN – Conceito formal de tributo", obs: "", novo: false },
  { cor: "AMARELO", ref: "Arts. 5º a 7º CTN – Espécies tributárias e indelegabilidade de competência", obs: "", novo: false },
  { cor: "AMARELO", ref: "Arts. 113 a 115 CTN – Obrigação tributária principal e acessória", obs: "", novo: false },
  { cor: "AMARELO", ref: "Arts. 116 e 118 CTN – Fato gerador e princípio do pecunia non olet", obs: "", novo: false },
  { cor: "AMARELO", ref: "Arts. 121 a 123 CTN – Sujeito passivo direto e convenções particulares inoponíveis", obs: "", novo: false },
  { cor: "AMARELO", ref: "Arts. 128 a 138 CTN – Responsabilidade tributária e denúncia espontânea", obs: "", novo: false },
  { cor: "AMARELO", ref: "Art. 142 CTN – Lançamento tributário", obs: "LC 236/2026: sem multa no lançamento preventivo se suspensa exigibilidade; reduções da multa de ofício (50% a 20%).", novo: true },
  { cor: "AMARELO", ref: "Art. 150 CTN – Lançamento por homologação", obs: "LC 236/2026 (§§5º e 6º): com dolo/fraude vai para art. 173, I; pagamento parcial conta do fato gerador.", novo: true },
  { cor: "AMARELO", ref: "Art. 156 CTN – Extinção do crédito", obs: "LC 236/2026: +XII sentença arbitral favorável; +XIII cumprimento de termo de mediação.", novo: true },
  { cor: "AMARELO", ref: "Art. 166 CTN – Prova do encargo nos tributos indiretos para restituição", obs: "", novo: false },
  { cor: "VERDE", ref: "Art. 151 CTN – Suspensão da exigibilidade", obs: "LC 236/2026: novos incisos VII arbitragem, VIII transação, IX mediação, X seguro-garantia/fiança aceitos.", novo: true },
  { cor: "VERDE", ref: "Art. 7º Lei 12.016/09 – Medida liminar em Mandado de Segurança", obs: "", novo: false },
  { cor: "VERDE", ref: "Art. 23 Lei 12.016/09 – Prazo decadencial de 120 dias do MS", obs: "", novo: false },
  { cor: "VERDE", ref: "Art. 300 CPC – Tutela provisória de urgência antecipada", obs: "", novo: false },
  { cor: "VERDE", ref: "Art. 16 Lei 6.830/80 – Embargos à Execução Fiscal", obs: "Prazo de 30 dias contados da garantia do juízo.", novo: false },
  { cor: "VERDE", ref: "Art. 38 Lei 6.830/80 – Ação Anulatória de Débito Fiscal", obs: "Desnecessidade de depósito prévio (SV 28).", novo: false },
  { cor: "VERDE", ref: "Art. 1.015 CPC – Cabimento do Agravo de Instrumento", obs: "", novo: false },
  { cor: "VERDE", ref: "Art. 1.009 CPC – Cabimento da Apelação Cível", obs: "", novo: false },
  { cor: "VERDE", ref: "Art. 1.021 CPC – Agravo Interno contra decisão monocrática de Relator", obs: "", novo: false },
  { cor: "VERDE", ref: "Art. 164 CTN – Hipóteses cabíveis de Consignação em Pagamento", obs: "", novo: false },
  { cor: "ROSA", ref: "Art. 319 CPC – Requisitos estruturais da petição inicial", obs: "", novo: false },
  { cor: "ROSA", ref: "Art. 292 CPC – Regras de fixação do valor da causa", obs: "", novo: false },
  { cor: "ROSA", ref: "Art. 82 CPC – Antecipação e recolhimento de despesas processuais", obs: "", novo: false },
  { cor: "ROSA", ref: "Art. 85 CPC – Honorários advocatícios sucumbenciais contra a Fazenda", obs: "", novo: false },
  { cor: "ROSA", ref: "Art. 77 CPC – Indicação do endereço profissional para intimações", obs: "", novo: false },
  { cor: "ROSA", ref: "Art. 1.010 CPC – Requisitos formais da Apelação (Folha de rosto + Razões)", obs: "", novo: false },
  { cor: "ROSA", ref: "Art. 1.016 CPC – Requisitos do Agravo de Instrumento ao Tribunal", obs: "", novo: false },
  { cor: "ROSA", ref: "Art. 311 CPC – Tutela provisória da evidência fundada em precedentes", obs: "", novo: false },
  { cor: "AZUL", ref: "Art. 150 CF – Limitações constitucionais ao poder de tributar", obs: "Princípios da legalidade, anterioridades, irretroatividade e imunidades.", novo: false },
  { cor: "AZUL", ref: "Art. 145 CF – Sistema tributário: impostos, taxas e contribuição de melhoria", obs: "", novo: false },
  { cor: "AZUL", ref: "Art. 153 CF – Competência tributária da União (Impostos federais)", obs: "", novo: false },
  { cor: "AZUL", ref: "Art. 155 CF – Competência dos Estados e do DF (ITCMD, ICMS, IPVA)", obs: "", novo: false },
  { cor: "AZUL", ref: "Art. 156 CF – Competência dos Municípios (IPTU, ITBI, ISS)", obs: "", novo: false },
  { cor: "AZUL", ref: "Art. 195 CF – Financiamento da seguridade social e imunidade beneficente (§7º)", obs: "", novo: false },
  { cor: "CLIPES", ref: "Art. 170-A CTN – Vedação de compensação antes do trânsito em julgado", obs: "", novo: false },
  { cor: "CLIPES", ref: "Art. 174 CTN – Prescrição da ação de cobrança do crédito tributário", obs: "LC 236/2026 ampliou as hipóteses de interrupção (§1º: protesto da CDA, mediação, arbitragem).", novo: true },
  { cor: "CLIPES", ref: "Art. 206 CTN – Expedição de CPD-EN com exigibilidade suspensa ou garantia", obs: "", novo: false },
  { cor: "CLIPES", ref: "Art. 40 Lei 6.830/80 – Prescrição intercorrente na execução fiscal", obs: "", novo: false },
  { cor: "CLIPES", ref: "Art. 173 CTN – Decadência do direito de constituir o crédito tributário", obs: "", novo: false },
  { cor: "CLIPES", ref: "Art. 168 CTN – Prazo quinquenal para repetição de indébito tributário", obs: "LC 236/2026 §§2º e 3º: habilitação administrativa do indébito transitado em 5 anos.", novo: true },
  { cor: "AMARELO", ref: "Art. 38 CTN – Base de cálculo do ITBI pelo valor de mercado à vista", obs: "LC 227/2026: critério técnico de mercado com possibilidade de contraditório pelo contribuinte.", novo: true },
  { cor: "AMARELO", ref: "Art. 113-A CTN – Teto e limites de razoabilidade das multas punitivas", obs: "LC 236/2026: teto de 75% da exação; 100% com dolo/fraude; 150% reincidência.", novo: true },
  { cor: "AMARELO", ref: "Art. 138 CTN – Denúncia espontânea com exclusão expressa da multa moratória", obs: "LC 236/2026: abrange expressamente a dispensa da multa de mora.", novo: true },
  { cor: "VERDE", ref: "Art. 194-A CTN – Obrigatoriedade de o Fisco respeitar teses do STF e STJ", obs: "LC 236/2026: vedada autuação ou inscrição contrária a precedentes qualificados.", novo: true },
  { cor: "VERDE", ref: "Arts. 208-A a 208-J CTN – Procedimento Administrativo Fiscal Unificado", obs: "LC 236/2026: prazo de 20 dias úteis para impugnação e recurso administrativo.", novo: true },
  { cor: "AZUL", ref: "Art. 156-A CF / Art. 195, V CF – Reforma Tributária (IBS e CBS)", obs: "EC 132/2023 e LC 214/2025: transição do novo modelo até 2033.", novo: true }
];

export const CRONOGRAMA_DATA = [
  {
    semana: "Semana 1 – Sistema Tributário e Princípios Fundamentais",
    tarefas: [
      "Leitura dos Arts. 145 a 152 da CF/88 e marcação no Vade Mecum",
      "Resolução de 10 questões práticas sobre Anterioridades e Legalidade",
      "Estudo dos Flashcards da categoria Imunidades Tributárias",
      "Simulação cronometrada Prova 01 – Mandado de Segurança (5h)"
    ]
  },
  {
    semana: "Semana 2 – Obrigação, Fato Gerador e Crédito Tributário",
    tarefas: [
      "Leitura e fichamento dos Arts. 113 a 138 do CTN",
      "Esquematização de Responsabilidade dos Sócios (Art. 135 e Súmula 430 STJ)",
      "Estudo dos Flashcards da categoria Crédito Tributário",
      "Simulação cronometrada Prova 02 – Embargos à Execução Fiscal (5h)"
    ]
  },
  {
    semana: "Semana 3 – Suspensão, Extinção e Exclusão do Crédito",
    tarefas: [
      "Leitura e memorização do Art. 151 (suspensão) e Art. 156 (extinção)",
      "Quadro comparativo de Decadência (Art. 173) versus Prescrição (Art. 174)",
      "Revisão das Súmulas Vinculantes aplicadas ao processo tributário",
      "Simulação cronometrada Prova 03 – Ação Anulatória de Débito Fiscal (5h)"
    ]
  },
  {
    semana: "Semana 4 – Impostos em Espécie (Federais, Estaduais e Municipais)",
    tarefas: [
      "Revisão completa de II, IE, IPI, IR e IOF (Art. 153 CF)",
      "Estudo aprofundado do ICMS (LC 87/96), IPVA e ITCMD (Art. 155 CF)",
      "Estudo detalhado do IPTU, ITBI e ISS (LC 116/2003 e Art. 156 CF)",
      "Simulação cronometrada Prova 04 – Recurso de Apelação Cível (5h)"
    ]
  },
  {
    semana: "Semana 5 – Execução Fiscal e Defesa do Contribuinte",
    tarefas: [
      "Leitura integral da Lei nº 6.830/1980 (LEF) com anotações de remissão",
      "Treinamento de Exceção de Pré-Executividade (Súmula 393 STJ)",
      "Estudo dos Flashcards da categoria Execução Fiscal",
      "Simulação cronometrada Prova 05 – Ação de Repetição de Indébito (5h)"
    ]
  },
  {
    semana: "Semana 6 – Reforma Tributária e Atualizações de 2026",
    tarefas: [
      "Estudo da EC 132/2023 e Leis Complementares nº 214/2025 e 227/2026",
      "Análise das novidades trazidas pela LC nº 236/2026 ao CTN",
      "Estudo dos Flashcards da categoria Reforma Tributária",
      "Simulação cronometrada Prova 06 – Exceção de Pré-Executividade (5h)"
    ]
  },
  {
    semana: "Semana 7 – Recursos em Espécie e Processo Constitucional",
    tarefas: [
      "Oficina de redação de Agravo de Instrumento (Art. 1.015 do CPC)",
      "Treinamento de Agravo Interno e Recurso Ordinário Constitucional (ROC)",
      "Revisão dos Precedentes Qualificados do STF e STJ",
      "Simulação cronometrada Prova 07 – Agravo de Instrumento (5h)"
    ]
  },
  {
    semana: "Semana 8 – Sprint Final de Revisão e Marcação do Vade Mecum",
    tarefas: [
      "Revisão do checklist do Vade Mecum com o sistema 4 cores e clipes",
      "Revisão Turbo de todos os 36+ Flashcards e Súmulas prioritárias",
      "Revisão dos esqueletos e quesitos das 9 peças oficiais",
      "Simulação cronometrada Prova 08 – Consignação em Pagamento (5h)"
    ]
  }
];

export const TESES_CONT: Record<number, string> = {
  1: "Conceito de Tributo",
  2: "Competência Tributária",
  3: "Princípios Tributários",
  4: "Imunidades Tributárias",
  5: "Obrigação Tributária",
  6: "Constituição do Crédito Tributário",
  7: "Suspensão da Exigibilidade do Crédito",
  8: "Exclusão do Crédito Tributário",
  9: "Extinção do Crédito Tributário"
};

export const TESES_DATA = [
  {
    c: 2,
    t: "Reserva de lei complementar para prescrição e decadência",
    n: 1,
    s: [
      ["Art. 146, III, da CRFB/88", "Cabe à lei complementar: III - estabelecer normas gerais em matéria de legislação tributária, especialmente sobre: a) definição de tributos e de suas espécies; b) obrigação, lançamento, crédito, prescrição e decadência tributários."],
      ["Súmula Vinculante 8 do STF", "São inconstitucionais o parágrafo único do artigo 5º do Decreto-lei 1.569/1977 e os artigos 45 e 46 da Lei 8.212/1991, que tratam de prescrição e decadência de crédito tributário."]
    ],
    e: "XX-R"
  },
  {
    c: 3,
    t: "Anterioridade tributária (do exercício financeiro e nonagesimal)",
    n: 9,
    s: [
      ["Art. 150, III, b, da CRFB/88", "É vedado cobrar tributos no mesmo exercício financeiro em que haja sido publicada a lei que os instituiu ou aumentou."],
      ["Art. 150, III, c, da CRFB/88", "É vedado cobrar tributos antes de decorridos noventa dias da data em que haja sido publicada a lei que os instituiu ou aumentou, observado o disposto na alínea b."]
    ],
    e: "VI, XIV, XVIII, XXI, XXIX, XXXIV, XXXVII, XXXIX, 40º"
  },
  {
    c: 3,
    t: "Sanção política: apreensão de mercadorias e interdição de estabelecimento",
    n: 7,
    s: [
      ["Súmula 70 do STF", "É inadmissível a interdição de estabelecimento como meio coercitivo para cobrança de tributo."],
      ["Súmula 323 do STF", "É inadmissível a apreensão de mercadorias como meio coercitivo para pagamento de tributos."],
      ["Súmula 547 do STF", "Não é lícito à autoridade proibir que o contribuinte em débito adquira estampilhas, despache mercadorias nas alfândegas e exerça suas atividades profissionais."]
    ],
    e: "IV, XI, XIX, XXV-R, XXXVIII, 42º, 46º"
  },
  {
    c: 3,
    t: "Legalidade tributária: criar ou majorar exige lei em sentido estrito",
    n: 3,
    s: [
      ["Art. 150, I, da CRFB/88", "Sem prejuízo de outras garantias asseguradas ao contribuinte, é vedado à União, aos Estados, ao Distrito Federal e aos Municípios: I - exigir ou aumentar tributo sem lei que o estabeleça."],
      ["Art. 97, II, do CTN", "Somente a lei pode estabelecer: II - a majoração de tributos, ou sua redução, ressalvadas as hipóteses constitucionais."]
    ],
    e: "XIV, XXXIV, 40º"
  },
  {
    c: 3,
    t: "Multa confiscatória (vedação ao confisco aplicado às penalidades)",
    n: 3,
    s: [
      ["Art. 150, IV, da CRFB/88", "É vedado à União, aos Estados, ao Distrito Federal e aos Municípios utilizar tributo com efeito de confisco."],
      ["Tema 816 STF", "A multa moratória cobrada pelo Fisco não pode ultrapassar o limite constitucional de 20%."]
    ],
    e: "XXXI, 42º, 46º"
  },
  {
    c: 3,
    t: "Inafastabilidade da jurisdição (dispensa de esgotamento da via administrativa)",
    n: 2,
    s: [
      ["Art. 5º, XXXV, da CRFB/88", "A lei não excluirá da apreciação do Poder Judiciário lesão ou ameaça a direito."],
      ["Tema 350 da Repercussão Geral do STF", "A exigência de prévio requerimento administrativo não se confunde com o esgotamento das instâncias administrativas."]
    ],
    e: "XVI, 41º"
  },
  {
    c: 3,
    t: "Isonomia tributária e tratamento proporcional",
    n: 1,
    s: [
      ["Art. 150, II, da CRFB/88", "É vedado instituir tratamento desigual entre contribuintes que se encontrem em situação equivalente, proibida qualquer distinção em razão de ocupação profissional ou função por eles exercida."]
    ],
    e: "XII"
  },
  {
    c: 4,
    t: "Imunidade de entidades de educação, assistência social e partidos",
    n: 3,
    s: [
      ["Art. 150, VI, c, da CRFB/88", "É vedado instituir impostos sobre patrimônio, renda ou serviços dos partidos políticos, sindicatos dos trabalhadores e instituições de educação e assistência social sem fins lucrativos."],
      ["Art. 150, § 4º, da CRFB/88", "Compreende somente o patrimônio, a renda e os serviços vinculados às finalidades essenciais das entidades."]
    ],
    e: "IX, XXIII, XXXVIII"
  },
  {
    c: 4,
    t: "Imunidade de imóvel alugado com renda revertida para a finalidade essencial",
    n: 2,
    s: [
      ["Súmula Vinculante 52 do STF", "Ainda quando alugado a terceiros, permanece imune ao IPTU o imóvel pertencente a qualquer das entidades do art. 150, VI, c, desde que o valor dos aluguéis seja aplicado nas atividades para as quais foram constituídas."],
      ["Súmula 724 do STF", "Ainda quando alugado a terceiros, permanece imune ao IPTU o imóvel pertencente a entidade beneficente."]
    ],
    e: "IX, XXIII"
  },
  {
    c: 4,
    t: "Imunidade recíproca aplicada a empresas públicas prestadoras de serviço público",
    n: 1,
    s: [
      ["Art. 150, VI, a, da CRFB/88", "É vedado instituir impostos sobre patrimônio, renda ou serviços uns dos outros."],
      ["Art. 150, § 2º, da CRFB/88", "Extensiva às autarquias e às fundações instituídas e mantidas pelo Poder Público vinculadas às finalidades essenciais."]
    ],
    e: "VII"
  },
  {
    c: 4,
    t: "Gratuidade de certidões e defesa de direitos (Imunidade de taxas)",
    n: 1,
    s: [
      ["Art. 5º, XXXIV, b, da CRFB/88", "São a todos assegurados, independentemente do pagamento de taxas: b) a obtenção de certidões em repartições públicas, para defesa de direitos e esclarecimento de situações de interesse pessoal."]
    ],
    e: "40º"
  },
  {
    c: 5,
    t: "Responsabilidade do sócio: o simples inadimplemento não transfere a obrigação",
    n: 6,
    s: [
      ["Art. 135, III, do CTN", "São pessoalmente responsáveis pelos créditos resultantes de atos praticados com excesso de poderes ou infração de lei, contrato ou estatutos os diretores, gerentes ou representantes."],
      ["Súmula 430 do STJ", "O inadimplemento da obrigação tributária pela sociedade não gera, por si só, a responsabilidade solidária do sócio-gerente."]
    ],
    e: "2010.3, XIII, XV, XX-R, XXX, 44º"
  },
  {
    c: 6,
    t: "Decadência do lançamento tributário no prazo de cinco anos",
    n: 2,
    s: [
      ["Art. 173, I, do CTN", "O direito de a Fazenda Pública constituir o crédito tributário extingue-se após 5 anos contados do primeiro dia do exercício seguinte àquele em que o lançamento poderia ter sido efetuado."],
      ["Art. 150, § 4º, do CTN", "Nos tributos por homologação, se a lei não fixar outro prazo, será de 5 anos a contar do fato gerador; expirado sem pronunciamento, considera-se homologado."],
      ["Súmula 555 do STJ", "Quando não houver declaração do débito, o prazo decadencial para o Fisco constituir o crédito conta-se exclusivamente pelo art. 173, I, do CTN."]
    ],
    e: "XXVIII, XXXII"
  },
  {
    c: 7,
    t: "Suspensão da exigibilidade pela concessão de parcelamento",
    n: 2,
    s: [
      ["Art. 151, VI, do CTN", "Suspendem a exigibilidade do crédito tributário: VI - o parcelamento."],
      ["Art. 155-A, §§ 3º e 4º, do CTN", "Parcelamento do devedor em recuperação judicial."]
    ],
    e: "43º"
  },
  {
    c: 8,
    t: "Isenção de Imposto de Renda por moléstia grave sem contemporaneidade",
    n: 3,
    s: [
      ["Art. 6º, XIV, da Lei 7.713/88", "Ficam isentos do imposto de renda os proventos de aposentadoria ou reforma percebidos pelos portadores de moléstia grave especificada em lei."],
      ["Súmula 627 do STJ", "O contribuinte faz jus à isenção do imposto de renda sem exigir demonstração da contemporaneidade dos sintomas nem da recidiva da enfermidade."],
      ["Súmula 598 do STJ", "É desnecessária a apresentação de laudo médico oficial quando o magistrado considerar suficientemente demonstrada a doença por outros meios idôneos."]
    ],
    e: "2010.1, 41º"
  },
  {
    c: 9,
    t: "Prescrição da ação de cobrança executiva no prazo de cinco anos",
    n: 4,
    s: [
      ["Art. 174 do CTN", "A ação para a cobrança do crédito tributário prescreve em cinco anos, contados da data da sua constituição definitiva."]
    ],
    e: "XV, XX-R, XXXVI, 45º"
  },
  {
    c: 9,
    t: "Restituição de tributo indireto condicionada à assunção do encargo financeiro",
    n: 3,
    s: [
      ["Art. 166 do CTN", "A restituição de tributos que comportem repercussão somente será feita a quem prove haver assumido o referido encargo ou estar expressamente autorizado pelo contribuinte de fato."],
      ["Súmula 546 do STF", "Cabe a restituição do tributo pago indevidamente quando reconhecido que o contribuinte de jure não recuperou do contribuinte de facto o quantum respectivo."]
    ],
    e: "VI, XVI, XXIV"
  }
];

export const ESTRUTURA_CONTROLE_AULAS = [
  {
    titulo: "Marcações e Colagem do Vade Mecum",
    itens: [
      "Marcações - Parte I (Artigos Fundamentais da CF e CTN)",
      "Marcações - Parte II (Leis Especiais LEF, LMS e LC 116/03)",
      "Colagem das Etiquetas Marca Fácil e Clipes Coloridos",
      "Revisão das Atualizações de 2026 (LC 227 e LC 236)"
    ]
  },
  {
    titulo: "Aulas ao Vivo de Direito Material e Processual",
    itens: [
      "Aula Inaugural OAB 2ª Fase Tributário",
      "Conceito de Tributo e Teoria Pentapartida",
      "Limitações Constitucionais ao Poder de Tributar (Princípios)",
      "Imunidades Tributárias em Espécie",
      "Obrigação Tributária e Responsabilidade dos Sócios",
      "Lançamento, Decadência e Prescrição",
      "Suspensão da Exigibilidade e Extinção do Crédito",
      "Mandado de Segurança Tributário",
      "Ação Anulatória e Ação Declaratória",
      "Ação de Repetição de Indébito e SELIC",
      "Embargos à Execução Fiscal e Garantia",
      "Exceção de Pré-Executividade",
      "Recursos: Apelação, Agravo de Instrumento e ROC"
    ]
  },
  {
    titulo: "Revisão Turbo & Mentorias",
    itens: [
      "Revisão Turbo – Semana 1 (Tributos e Competência)",
      "Revisão Turbo – Semana 2 (Crédito e Execução)",
      "Revisão Turbo – Semana 3 (Peças Iniciais e Tutelas)",
      "Revisão Turbo – Semana 4 (Peças Recursais e Teses)",
      "Mentoria: Como Identificar a Peça em 5 Minutos",
      "Mentoria: Técnica de Resolução de Questões Discursivas",
      "Oficina de Peças Práticas FGV",
      "Dicas Finais de Véspera"
    ]
  },
  {
    titulo: "Treinamento Intensivo de Peças e Questões",
    itens: [
      "Treinamento de Peças Iniciais (21 Casos Concretos)",
      "Treinamento de Peças Recursais (14 Casos Concretos)",
      "Resolução de Questões Oficiais FGV (Exames 33º ao 44º)",
      "Treinamento de Redação na Folha Pautada FGV 150 Linhas"
    ]
  },
  {
    titulo: "Simulados Oficiais Ceisc",
    itens: [
      "Simulado 01 (Correção Individualizada de Peça e Questões)",
      "Simulado 02 (Correção Individualizada)",
      "Simulado 03 (Correção Individualizada)",
      "Simulado 04 (Correção Individualizada)",
      "Simulado 05 (Correção Individualizada)",
      "Simulado 06 (Correção em Vídeo com Gabarito Comentado)",
      "Simulado 07 (Simulado Geral Pré-Prova 5 Horas)"
    ]
  }
];
