export interface DicaTributaria {
  id: number;
  titulo: string;
  categoria:
    | 'Súmula Vinculante'
    | 'Prática da Peça'
    | 'Impostos em Espécie'
    | 'Processo Tributário'
    | 'Princípios & Imunidades'
    | 'Reforma Tributária'
    | 'Execução Fiscal'
    | 'Extinção & Suspensão'
    | string;
  artigoSumula: string;
  tese: string;
  explicacao: string;
  dicaPraticaOAB: string;
  relevanciaFGV: 'Alta' | 'Altíssima' | 'Garantida na Prova' | string;
  tag: string;
  isAiGenerated?: boolean;
  geradaEm?: string;
}

export const DICAS_TRIBUTARIAS: DicaTributaria[] = [
  {
    id: 1,
    titulo: 'Prescrição e Decadência Previdenciária: Súmula Vinculante 8',
    categoria: 'Súmula Vinculante',
    artigoSumula: 'Súmula Vinculante 8 do STF / Art. 146, III, "b" da CF / Arts. 150, §4º e 174 do CTN',
    tese: 'São inconstitucionais os arts. 45 e 46 da Lei 8.212/91 que fixavam prazo de 10 anos para decadência e prescrição previdenciária.',
    explicacao: 'Matéria de normas gerais tributárias, incluindo decadência e prescrição de quaisquer tributos (inclusive contribuições sociais), exige estritamente Lei Complementar (CF, art. 146, III, b). Leis ordinárias não podem dilatar os prazos quinquenais previstos no CTN.',
    dicaPraticaOAB: 'Se a FGV cobrar cobrança previdenciária de contribuição com mais de 5 anos, invoque preliminar ou prejudicial de mérito com a SV 8 do STF e os arts. 156, V e 174 do CTN para extinguir o crédito tributário.',
    relevanciaFGV: 'Altíssima',
    tag: 'SV 8 • Prazos de 5 anos'
  },
  {
    id: 2,
    titulo: 'Não Incidência de ISS sobre Locação de Bens Móveis: Súmula Vinculante 31',
    categoria: 'Súmula Vinculante',
    artigoSumula: 'Súmula Vinculante 31 do STF / Art. 156, III da CF',
    tese: 'É inconstitucional a incidência do ISS sobre operações de locação de bens móveis.',
    explicacao: 'O fato gerador do ISS é a prestação de serviço (obrigação de fazer). A locação de coisas móveis (como veículos, guindastes ou equipamentos) constitui mera obrigação de dar, desprovida de esforço humano produtivo personalizado, não caracterizando serviço tributável.',
    dicaPraticaOAB: 'Em caso de autos de infração municipais cobrando ISS de locadoras de veículos ou maquinário, peça a anulação do lançamento tributário ou liminar em MS citando a SV 31 e o art. 156, III da CF.',
    relevanciaFGV: 'Garantida na Prova',
    tag: 'SV 31 • Locação de Bens Móveis'
  },
  {
    id: 3,
    titulo: 'Momento de Incidência do ITBI: Tema 1124 do STF',
    categoria: 'Impostos em Espécie',
    artigoSumula: 'Tema 1124 da Repercussão Geral (STF) / Art. 156, II da CF / Art. 1.245 do Código Civil',
    tese: 'O fato gerador do ITBI só ocorre com a efetiva transferência da propriedade imobiliária, mediante o registro do título translativo no Cartório de Registro de Imóveis (RGI).',
    explicacao: 'A promessa de compra e venda ou compromisso preliminar, mesmo registrado em cartório de notas ou com imissão na posse, não transfere propriedade. O município não pode exigir ITBI antecipadamente na celebração do contrato de promessa.',
    dicaPraticaOAB: 'A FGV adora cobrar cobrança antecipada de ITBI pela prefeitura antes da escritura e registro. A resposta exige afastar o lançamento com base no Tema 1124 do STF e no art. 1.245 do Código Civil.',
    relevanciaFGV: 'Altíssima',
    tag: 'ITBI • Registro Imobiliário'
  },
  {
    id: 4,
    titulo: 'Descabimento de Honorários em Mandado de Segurança: Súmulas 105 STJ e 512 STF',
    categoria: 'Processo Tributário',
    artigoSumula: 'Art. 25 da Lei 12.016/2009 / Súmula 105 do STJ / Súmula 512 do STF',
    tese: 'Não cabe condenação ao pagamento de honorários advocatícios sucumbenciais em Mandado de Segurança.',
    explicacao: 'O Mandado de Segurança tem rito especial e expressa vedação legal aos honorários de sucumbência (art. 25 da Lei 12.016/09), admitindo-se apenas a condenação em custas processuais.',
    dicaPraticaOAB: 'Ao redigir a petição inicial de Mandado de Segurança na 2ª Fase, NUNCA formule pedido de condenação em honorários de sucumbência. Peça apenas "a condenação da autoridade coatora/pessoa jurídica nas custas processuais".',
    relevanciaFGV: 'Garantida na Prova',
    tag: 'MS • Sem Honorários Sucumbenciais'
  },
  {
    id: 5,
    titulo: 'Requisitos do Pedido Liminar em MS Tributário',
    categoria: 'Prática da Peça',
    artigoSumula: 'Art. 7º, III da Lei 12.016/2009 c/c Art. 151, IV do CTN',
    tese: 'A concessão de liminar em Mandado de Segurança suspende a exigibilidade do crédito tributário ope legis.',
    explicacao: 'O pedido de liminar exige demonstrar o fumus boni iuris (relevância dos fundamentos / probabilidade do direito) e o periculum in mora (risco de ineficácia da medida caso deferida apenas ao final, como inscrição em dívida ativa, protesto ou impedimento de certidão CND).',
    dicaPraticaOAB: 'No tópico "Da Medida Liminar", fundamente cumulativamente no art. 7º, III da Lei 12.016/09 e no art. 151, IV do CTN (suspensão da exigibilidade do crédito tributário). A pontuação no espelho FGV sempre exige ambos.',
    relevanciaFGV: 'Altíssima',
    tag: 'Liminar • Art. 151, IV CTN'
  },
  {
    id: 6,
    titulo: 'Mero Deslocamento entre Filiais não Gera ICMS: Tema 1099 STF e Súmula 166 STJ',
    categoria: 'Impostos em Espécie',
    artigoSumula: 'Tema 1099/STF (ADC 49) / Súmula 166 do STJ / LC 204/2023',
    tese: 'Não incide ICMS sobre a transferência de mercadorias entre estabelecimentos do mesmo titular (mesma pessoa jurídica).',
    explicacao: 'A circulação meramente física de mercadoria entre matriz e filial ou entre filiais do mesmo contribuinte não configura circulação econômica com transferência de titularidade, afastando a hipótese de incidência do ICMS.',
    dicaPraticaOAB: 'Fundamente com o Tema 1099 do STF, a Súmula 166 do STJ e o novel art. 12, §4º da LC 87/96 (incluído pela LC 204/2023). Mostre domínio da atualização legislativa recente!',
    relevanciaFGV: 'Altíssima',
    tag: 'ICMS • Mero Deslocamento'
  },
  {
    id: 7,
    titulo: 'Rol Taxativo de Suspensão da Exigibilidade do Crédito: Art. 151 do CTN',
    categoria: 'Extinção & Suspensão',
    artigoSumula: 'Art. 151 do CTN / Súmula 112 do STJ',
    tese: 'As hipóteses de suspensão da exigibilidade do crédito tributário são taxativas (numerus clausus): MO-DE-PA-RE-LO-CON.',
    explicacao: 'MOratória, DEpósito do montante integral e em dinheiro, PArclamamento, REclamações e recursos administrativos, LIminar em MS ou cautelar, CONcessão de tutela provisória em outras ações. Oferta de seguro-garantia ou fiança não suspende a exigibilidade, apenas garante a execução para fins de CPD-EN.',
    dicaPraticaOAB: 'Lembre-se da Súmula 112 do STJ: "O depósito somente suspende a exigibilidade do crédito tributário se for integral e em dinheiro". Cheque sem fundos ou bens não suspendem.',
    relevanciaFGV: 'Garantida na Prova',
    tag: 'Art. 151 CTN • Suspensão'
  },
  {
    id: 8,
    titulo: 'Exceção de Pré-Executividade (EPE) e Ausência de Dilação Probatória',
    categoria: 'Processo Tributário',
    artigoSumula: 'Súmula 393 do STJ / Art. 803 do CPC / Art. 16, §1º da LEF (a contrario sensu)',
    tese: 'A EPE é cabível na Execução Fiscal para matérias de ordem pública que prescindam de dilação probatória, sem necessidade de garantia do juízo.',
    explicacao: 'Questões como decadência, prescrição, nulidade flagrante da CDA ou pagamento comprovado por recibo pré-constituído dispensam embargos e não exigem penhora ou caução prévia.',
    dicaPraticaOAB: 'Se o enunciado disser que o cliente foi citado em Execução Fiscal, possui prova documental inequívoca e NÃO tem patrimônio para garantir o juízo, a peça adequada é a Exceção de Pré-Executividade.',
    relevanciaFGV: 'Altíssima',
    tag: 'EPE • Súmula 393 STJ'
  },
  {
    id: 9,
    titulo: 'Prazo para Embargos à Execução Fiscal: Art. 16, III da LEF',
    categoria: 'Prática da Peça',
    artigoSumula: 'Art. 16, III da Lei 6.830/80 (LEF) / Não se aplica o CPC',
    tese: 'O prazo para opor Embargos à Execução Fiscal é de 30 dias contados da intimação da penhora (ou depósito/garantia), e não da juntada do mandado.',
    explicacao: 'O processo tributário executivo rege-se pelo princípio da especialidade da LEF. O prazo geral de 15 dias do CPC para embargos do devedor é afastado pelo prazo especial de 30 dias da LEF.',
    dicaPraticaOAB: 'Atenção ao termo inicial: é a data da intimação da penhora, e não a juntada do mandado de penhora. Erro clássico que a FGV costuma pontuar no espelho de tempestividade.',
    relevanciaFGV: 'Altíssima',
    tag: 'Embargos • 30 Dias da Penhora'
  },
  {
    id: 10,
    titulo: 'Anterioridade Geral vs. Anterioridade Nonagesimal e Exceções',
    categoria: 'Princípios & Imunidades',
    artigoSumula: 'Art. 150, III, "b" e "c", e §1º da CF / Art. 195, §6º da CF',
    tese: 'Tributos criados ou majorados respeitam em regra ambas as anterioridades (exercício seguinte e 90 dias), salvo exceções constitucionais expressas.',
    explicacao: 'Exceções a ambas: II, IE, IOF, Impostos Extraordinários de Guerra e Empréstimos Compulsórios de calamidade/guerra. Apenas nonagesimal (dispensa exercício financeiro): IPI, Cide-Combustíveis, ICMS-Combustíveis, Contribuições Sociais da Seguridade (art. 195, §6º). Apenas exercício (dispensa 90 dias): IR e base de cálculo de IPTU/IPVA.',
    dicaPraticaOAB: 'Se o município aumentar a alíquota do IPTU em dezembro para vigorar em janeiro, viola a anterioridade nonagesimal (pois apenas a base de cálculo é exceção, e não a alíquota!).',
    relevanciaFGV: 'Garantida na Prova',
    tag: 'Anterioridade • Art. 150, §1º CF'
  },
  {
    id: 11,
    titulo: 'Imunidade Recíproca e Extensão a Empresas Públicas Prestadoras de Serviço Público',
    categoria: 'Princípios & Imunidades',
    artigoSumula: 'Art. 150, VI, "a", e §2º e §3º da CF / Jurisprudência consolidada do STF (Correios, Infraero, Caern)',
    tese: 'A imunidade tributária recíproca aplica-se a empresas públicas e sociedades de economia mista prestadoras de serviços públicos próprios do Estado em regime de exclusividade/monopólio.',
    explicacao: 'O STF firmou que estatais que não exploram atividade econômica em livre concorrência com o setor privado e que prestam serviços públicos essenciais (como a ECT - Correios) gozam da imunidade recíproca dos impostos.',
    dicaPraticaOAB: 'Se a questão apresentar uma concessionária de energia ou empresa de telecomunicações que cobra tarifa com finalidade lucrativa e em concorrência, ela NÃO tem imunidade (art. 150, §3º da CF).',
    relevanciaFGV: 'Alta',
    tag: 'Imunidade Recíproca • Estatais'
  },
  {
    id: 12,
    titulo: 'Redirecionamento da Execução Fiscal e Dissolução Irregular: Súmula 435 STJ',
    categoria: 'Execução Fiscal',
    artigoSumula: 'Súmula 435 do STJ / Art. 135, III do CTN / Tema 981 do STJ',
    tese: 'Presume-se dissolvida irregularmente a empresa que deixar de funcionar no seu domicílio fiscal, sem comunicação aos órgãos competentes, legitimando o redirecionamento da execução fiscal para o sócio-gerente.',
    explicacao: 'O mero inadimplemento da obrigação tributária não enseja o redirecionamento (Súmula 430 do STJ). Contudo, a certidão do Oficial de Justiça atestando que a empresa encerrou as atividades no endereço cadastrado autoriza o redirecionamento.',
    dicaPraticaOAB: 'Defenda o sócio demonstrando que: (1) ele não exercia poderes de gerência na data da dissolução irregular (Tema 981 STJ); ou (2) que a empresa continua ativa ou teve falência decretada regularmente.',
    relevanciaFGV: 'Altíssima',
    tag: 'Súmula 435 STJ • Redirecionamento'
  },
  {
    id: 13,
    titulo: 'Prazo da Repetição de Indébito: Regra dos 5 Anos (LC 118/2005 e RE 566.621)',
    categoria: 'Processo Tributário',
    artigoSumula: 'Art. 168, I do CTN / Art. 3º da LC 118/2005 / Tema 4 do STF',
    tese: 'O prazo prescricional para pleitear a repetição de indébito de tributos sujeitos a lançamento por homologação é de 5 anos a contar do pagamento indevido.',
    explicacao: 'A antiga tese dos "cinco mais cinco" foi superada pela LC 118/2005 e pelo STF no RE 566.621. Hoje, qualquer ação de repetição ou pedido de compensação deve ser ajuizado no prazo improrrogável de 5 anos do pagamento.',
    dicaPraticaOAB: 'Em Ação de Repetição de Indébito ou Ação Ordinária com pedido de restituição, peça a atualização pela Taxa SELIC (que engloba juros moratórios e correção monetária) a partir do pagamento indevido (Súmula 523/STJ).',
    relevanciaFGV: 'Garantida na Prova',
    tag: 'Repetição • Prazo Quinquenal e SELIC'
  },
  {
    id: 14,
    titulo: 'Não Incidência de Imposto de Renda sobre Verbas Indenizatórias',
    categoria: 'Impostos em Espécie',
    artigoSumula: 'Art. 43 do CTN / Súmulas 125, 136 e 386 do STJ / Art. 153, III da CF',
    tese: 'O Imposto de Renda incide apenas sobre acréscimo patrimonial; indenizações destinadas a recompor perda ou dano não configuram renda ou provento.',
    explicacao: 'Verbas como férias não gozadas indenizadas (Súmula 125 STJ), aviso prévio indenizado, indenização por dano moral ou PDV (Súmula 215 STJ) possuem caráter estritamente indenizatório, sem riqueza nova auferida.',
    dicaPraticaOAB: 'Ao impugnar retenção na fonte sobre rescisão trabalhista com verbas indenizatórias, sustente ofensa direta ao conceito constitucional de renda do art. 43 do CTN e art. 153, III da CF.',
    relevanciaFGV: 'Alta',
    tag: 'IR • Verbas Indenizatórias'
  },
  {
    id: 15,
    titulo: 'Reforma Tributária (EC 132/2023): Dualidade IVA e Transição do IBS e CBS',
    categoria: 'Reforma Tributária',
    artigoSumula: 'Arts. 156-A e 195, V da CF (incluídos pela EC 132/2023)',
    tese: 'A EC 132/2023 introduziu o IVA Dual: IBS (Estados e Municípios) e CBS (União), extinguindo gradualmente ICMS, ISS, PIS, Cofins e IPI.',
    explicacao: 'O IBS e a CBS adotam o princípio do destino (o tributo pertence ao local de consumo final), não cumulatividade plena (crédito financeiro total sobre todas as aquisições, exceto uso pessoal) e base ampla sobre bens materiais, imateriais e serviços.',
    dicaPraticaOAB: 'Fique atento em questões conceituais da 2ª Fase: o princípio do destino impede a chamada "guerra fiscal" de ICMS e põe fim à divisão clássica entre bens e serviços.',
    relevanciaFGV: 'Alta',
    tag: 'EC 132/23 • IBS, CBS e Destino'
  },
  {
    id: 16,
    titulo: 'Depósito Judicial em Dinheiro: Direito Subjetivo do Contribuinte',
    categoria: 'Extinção & Suspensão',
    artigoSumula: 'Súmula 112 do STJ / Art. 151, II do CTN',
    tese: 'O depósito judicial integral e em dinheiro é um direito potestativo do contribuinte e independe de autorização do Fisco ou do Magistrado.',
    explicacao: 'Efetuado o depósito do montante integral discutido, a suspensão da exigibilidade opera-se de pleno direito, impedindo a lavratura de auto de infração executável, o ajuizamento de execução fiscal ou a negação de CND.',
    dicaPraticaOAB: 'Em Ação Anulatória ou Ação Declaratória c/c depósito preparatório, informe o depósito para pleitear a emissão de Certidão Positiva com Efeitos de Negativa (CPD-EN) com base no art. 206 do CTN.',
    relevanciaFGV: 'Altíssima',
    tag: 'Depósito Judicial • Art. 206 CTN'
  },
  {
    id: 17,
    titulo: 'Imunidade Musical e Livros Eletrônicos (Kindle / E-books): Súmula Vinculante 57',
    categoria: 'Princípios & Imunidades',
    artigoSumula: 'Art. 150, VI, "d" da CF / Súmula Vinculante 57 do STF',
    tese: 'A imunidade tributária de livros, jornais e periódicos abrange os livros eletrônicos (e-books) e os aparelhos leitores exclusivos (e-readers).',
    explicacao: 'A finalidade da imunidade cultural é incentivar a difusão do conhecimento e a liberdade de expressão. O suporte físico ou digital é irrelevante, estendendo-se a proteção inclusive aos leitores dedicados como o Kindle.',
    dicaPraticaOAB: 'Dispositivos multifuncionais (tablets ou smartphones) não têm a imunidade do aparelho, mas os e-books baixados neles sim. Essa sutileza já foi questão da FGV!',
    relevanciaFGV: 'Alta',
    tag: 'SV 57 • E-books & Imunidade'
  },
  {
    id: 18,
    titulo: 'Certidão Positiva com Efeitos de Negativa: Art. 206 do CTN',
    categoria: 'Processo Tributário',
    artigoSumula: 'Art. 206 do CTN / Art. 151 do CTN',
    tese: 'Tem os mesmos efeitos da CND a certidão que conste a existência de créditos não vencidos, em curso de cobrança executiva garantida ou cuja exigibilidade esteja suspensa.',
    explicacao: 'Se o débito foi objeto de parcelamento, depósito judicial, recurso administrativo tempestivo ou liminar concedida, o contribuinte faz jus incontestável à expedição da CPD-EN em até 10 dias.',
    dicaPraticaOAB: 'Se a autoridade fazendária recusar certidão para empresa com liminar vigente ou garantia prestada, a peça cabível é o Mandado de Segurança com pedido liminar para determinar expedição imediata da CPD-EN.',
    relevanciaFGV: 'Garantida na Prova',
    tag: 'Art. 206 CTN • CPD-EN'
  },
  {
    id: 19,
    titulo: 'Imposto sobre Grandes Fortunas e Competência Residual: Exigência de LC',
    categoria: 'Princípios & Imunidades',
    artigoSumula: 'Art. 153, VII e Art. 154, I da Constituição Federal',
    tese: 'Tanto o Imposto sobre Grandes Fortunas (IGF) quanto novos impostos da competência residual da União dependem obrigatoriamente de Lei Complementar.',
    explicacao: 'Os impostos residuais da União não podem ser cumulativos nem ter fato gerador ou base de cálculo próprios dos impostos discriminados na CF. Medida Provisória não pode instituir tributo reservado à LC (art. 62, §1º, III da CF).',
    dicaPraticaOAB: 'Se o Presidente editar Medida Provisória criando IGF ou imposto residual, aponte dupla inconstitucionalidade formal: desrespeito à reserva de LC e vedação expressa à edição de MP sobre a matéria.',
    relevanciaFGV: 'Alta',
    tag: 'Reserva de LC • IGF e Residual'
  },
  {
    id: 20,
    titulo: 'Não Incidência de IPTU sobre Terreno Rural com Destinação Agrícola: Art. 15 do DL 57/66',
    categoria: 'Impostos em Espécie',
    artigoSumula: 'Art. 15 do Decreto-Lei 57/66 / Súmula 211 do STJ / REsp 1.112.646/SP (Repetitivo)',
    tese: 'Não incide IPTU, mas ITR, sobre imóvel situado na zona urbana quando comprovadamente utilizado em exploração extrativa, vegetal, agrícola, pecuária ou agroindustrial.',
    explicacao: 'O critério da destinação econômica (prevalente por força do art. 15 do DL 57/66, recepcionado com status de lei complementar) prevalece sobre a localização geográfica do imóvel no perímetro urbano.',
    dicaPraticaOAB: 'Caso a prefeitura cobre IPTU de sítio ou fazenda produtiva englobada pela expansão urbana municipal, invoque o DL 57/66 e a jurisprudência repetitiva do STJ para anular o lançamento de IPTU.',
    relevanciaFGV: 'Alta',
    tag: 'IPTU vs. ITR • Destinação Agrícola'
  },
  {
    id: 21,
    titulo: 'Bitributação vs. Bis in Idem: Diferenças Cruciais na 2ª Fase',
    categoria: 'Princípios & Imunidades',
    artigoSumula: 'Arts. 153, 155 e 156 da CF',
    tese: 'Bitributação: dois entes políticos diferentes cobram tributos sobre o mesmo fato gerador (vedada, salvo guerra externa). Bis in Idem: o mesmo ente cobra duas exações sobre a mesma base.',
    explicacao: 'Exemplo de bitributação inconstitucional: Estado cobrando ICMS e Município cobrando ISS sobre o mesmo software ou operação mista sem previsão expressa na LC 116/2003.',
    dicaPraticaOAB: 'Nas peças contra autos de infração onde Município e Estado cobram simultaneamente, você deve suscitar a delimitação de competência constitucional para anular a exação indevida.',
    relevanciaFGV: 'Alta',
    tag: 'Bitributação • Conflito Federativo'
  },
  {
    id: 22,
    titulo: 'Repetição de Tributo Indireto: A Trava do Artigo 166 do CTN',
    categoria: 'Processo Tributário',
    artigoSumula: 'Art. 166 do CTN / Súmula 546 do STF',
    tese: 'A repetição de tributo que comporte transferência do encargo financeiro (ICMS/IPI) exige prova de que assumiu o encargo ou expressa autorização do contribuinte de fato.',
    explicacao: 'Em tributos indiretos, quem recolhe é o contribuinte de direito (comerciante/vendedor), mas quem paga a conta é o consumidor final. O comerciante só pode pedir o dinheiro de volta se provar que não repassou o imposto no preço.',
    dicaPraticaOAB: 'Fique atento: nas questões sobre ICMS ou IPI pagos a mais, o espelho FGV sempre exige abrir um parágrafo cumprindo a exigência do art. 166 do CTN para assegurar a legitimidade ativa na repetição!',
    relevanciaFGV: 'Garantida na Prova',
    tag: 'Art. 166 CTN • Tributos Indiretos'
  },
  {
    id: 23,
    titulo: 'Imunidade dos Templos de Qualquer Culto: Abrangência Ampla',
    categoria: 'Princípios & Imunidades',
    artigoSumula: 'Art. 150, VI, "b", e §4º da CF / Súmula Vinculante 52 do STF',
    tese: 'A imunidade tributária dos templos de qualquer culto abrange inclusive os imóveis alugados a terceiros, desde que o valor dos aluguéis seja aplicado nas suas atividades essenciais.',
    explicacao: 'O STF e a EC 116/2022 estenderam expressamente a imunidade de IPTU para imóveis que as entidades religiosas alugam para seu funcionamento (locatárias) e a SV 52 protege imóveis de sua propriedade alugados a terceiros com renda revertida para o culto.',
    dicaPraticaOAB: 'Invoque o art. 150, §4º da CF, a SV 52 e o novel art. 156, §1º-A da CF (incluído pela EC 116/2022).',
    relevanciaFGV: 'Altíssima',
    tag: 'Templos • SV 52 e EC 116'
  },
  {
    id: 24,
    titulo: 'Legitimidade Ativa em Execução Fiscal: Inadmissibilidade do MP',
    categoria: 'Execução Fiscal',
    artigoSumula: 'Súmula 643 do STF / Art. 1º da Lei 6.830/80',
    tese: 'O Ministério Público não tem legitimidade para propor execução fiscal.',
    explicacao: 'A cobrança judicial da dívida ativa tributária ou não tributária da Fazenda Pública compete exclusivamente à representação judicial da Fazenda (Procuradoria da Fazenda Nacional, PGEs e PGMs).',
    dicaPraticaOAB: 'Se em questão da OAB o Ministério Público ajuizar execução de certidão de dívida ativa relativa a multa aplicada por tribunal de contas ou dano ao erário, argua ilegitimidade ativa ad causam.',
    relevanciaFGV: 'Alta',
    tag: 'Execução Fiscal • Legitimidade'
  },
  {
    id: 25,
    titulo: 'Não Incidência de ITCMD sobre Planos de Previdência VGBL e PGBL',
    categoria: 'Impostos em Espécie',
    artigoSumula: 'Tema 1214 do STF / Art. 794 do Código Civil',
    tese: 'É inconstitucional a incidência do ITCMD sobre o repasse de valores e direitos aos beneficiários decorrentes de VGBL e PGBL na hipótese de morte do titular.',
    explicacao: 'O STF definiu em sede de repercussão geral (Tema 1214) que o VGBL tem natureza de seguro de pessoa e não integra a herança nem constitui transmissão causa mortis.',
    dicaPraticaOAB: 'Tema quentíssimo para a 2ª Fase! Em inventários ou cobranças de ITCMD pelo Fisco estadual sobre VGBL/PGBL, peça a anulação com fundamento no Tema 1214 do STF.',
    relevanciaFGV: 'Altíssima',
    tag: 'ITCMD • Tema 1214 STF (VGBL/PGBL)'
  },
  {
    id: 26,
    titulo: 'Ação Consignatória em Matéria Tributária: Hipóteses do Art. 164 do CTN',
    categoria: 'Prática da Peça',
    artigoSumula: 'Art. 164 do CTN / Art. 539 do CPC',
    tese: 'Cabe ação de consignação em pagamento nos casos de: recusa de recebimento, subordinação a exigência ilegal ou bitributação (exigência por mais de um ente).',
    explicacao: 'A consignatória tributária é peça padrão da FGV quando duas cidades ou um município e um estado cobram simultaneamente o contribuinte (ex: dúvida se incide ISS em Barueri ou em São Paulo).',
    dicaPraticaOAB: 'A petição deve conter pedido expresso de depósito da quantia devida para suspender a exigibilidade e a citação de ambos os entes fiscais disputantes para debaterem o direito entre si.',
    relevanciaFGV: 'Altíssima',
    tag: 'Ação de Consignação • Art. 164 CTN'
  },
  {
    id: 27,
    titulo: 'Princípio do Não Confisco e Multas Tributárias Punitivas vs. Moratórias',
    categoria: 'Princípios & Imunidades',
    artigoSumula: 'Art. 150, IV da CF / Jurisprudência consolidada do STF (Tema 214 e Tema 863)',
    tese: 'Multas moratórias não podem ultrapassar 20%; multas punitivas (pelo não pagamento decorrente de infração) não podem exceder 100% do valor do tributo devido.',
    explicacao: 'O princípio do não confisco aplica-se tanto ao tributo quanto às multas fiscais. Multas punitivas de 150% ou 200% rotineiramente aplicadas por leis estaduais/federais são manifestamente inconstitucionais.',
    dicaPraticaOAB: 'Ao impugnar autos de infração com multas desproporcionais, abra tópico específico "Do Caráter Confiscatório da Multa" citando o art. 150, IV da CF e os precedentes do STF.',
    relevanciaFGV: 'Altíssima',
    tag: 'Não Confisco • Teto de Multas STF'
  },
  {
    id: 28,
    titulo: 'Isenção Heterônoma: Vedação Constitucional Expressa',
    categoria: 'Princípios & Imunidades',
    artigoSumula: 'Art. 151, III da CF / Exceção: Tratados Internacionais (Art. 98 CTN e STF)',
    tese: 'É vedado à União instituir isenções de tributos da competência dos Estados, do Distrito Federal ou dos Municípios.',
    explicacao: 'A isenção heterônoma é proibida em respeito ao pacto federativo e à autonomia financeira dos entes. A única hipótese admitida pelo STF ocorre em tratados internacionais ratificados pela República Federativa do Brasil.',
    dicaPraticaOAB: 'Se uma Lei Federal ordinária conceder isenção de IPVA ou ISS para determinada categoria, denuncie a violação direta ao art. 151, III da CF por se tratar de isenção heterônoma flagrante.',
    relevanciaFGV: 'Alta',
    tag: 'Art. 151, III CF • Isenção Heterônoma'
  },
  {
    id: 29,
    titulo: 'Homologação Tácita e Decadência: Art. 150, §4º vs. Art. 173, I do CTN',
    categoria: 'Extinção & Suspensão',
    artigoSumula: 'Art. 150, §4º do CTN / Súmula 555 do STJ / REsp 973.733/SC (Repetitivo)',
    tese: 'Se houve pagamento antecipado (mesmo a menor), o prazo decadencial de 5 anos conta-se do fato gerador (art. 150, §4º). Se não houve pagamento ou houve dolo/fraude, conta-se do 1º dia do exercício seguinte (art. 173, I).',
    explicacao: 'Esta distinção é cobrada em quase todas as edições da 2ª Fase OAB. O pagamento de apenas R$ 1,00 atrai a incidência do art. 150, §4º e a homologação tácita quinquenal a partir do fato gerador.',
    dicaPraticaOAB: 'Verifique no enunciado: o contribuinte recolheu qualquer valor? Se sim, conte 5 anos da data do fato gerador. Se não recolheu nada ou fraudou, conte 5 anos a partir de 1º de janeiro do ano seguinte.',
    relevanciaFGV: 'Garantida na Prova',
    tag: 'Decadência • 150, §4º vs. 173, I CTN'
  },
  {
    id: 30,
    titulo: 'Imposto sobre Transmissão Causa Mortis (ITCMD): Alíquotas Progressivas',
    categoria: 'Impostos em Espécie',
    artigoSumula: 'Súmula Vinculante 59 do STF / Art. 155, §1º da CF (alterado pela EC 132/2023)',
    tese: 'É legítima a fixação de alíquota progressiva para o ITCMD com base no valor do quinhão recebido pelo herdeiro (SV 59). A EC 132/2023 tornou a progressividade obrigatória.',
    explicacao: 'Antes facultativa segundo o STF, a EC 132/2023 tornou o ITCMD compulsoriamente progressivo em razão do valor do quinhão, do legado ou da doação, com teto máximo de 8% fixado pelo Senado Federal (Resolução 9/92).',
    dicaPraticaOAB: 'Em questões sobre sucessão e planejamento tributário, ressalte a constitucionalidade da progressividade e mencione a obrigatoriedade imposta pela recente Reforma Tributária.',
    relevanciaFGV: 'Alta',
    tag: 'ITCMD • Progressividade Obrigatória'
  }
];

/**
 * Retorna o índice determinístico da dica do dia para a data atual.
 * Alterna automaticamente a cada 24 horas à meia-noite local.
 */
export function getIndiceDicaDoDia(totalDicas: number = DICAS_TRIBUTARIAS.length): number {
  if (totalDicas <= 0) return 0;
  const agora = new Date();
  // Cria marco zero da meia-noite do dia atual no fuso local
  const ano = agora.getFullYear();
  const mes = agora.getMonth();
  const dia = agora.getDate();
  const meiaNoiteHoje = new Date(ano, mes, dia).getTime();
  const diasDesdeOrigem = Math.floor(meiaNoiteHoje / (1000 * 60 * 60 * 24));
  return ((diasDesdeOrigem % totalDicas) + totalDicas) % totalDicas;
}

/**
 * Retorna quantas horas e minutos restam para a próxima troca de dica (meia-noite).
 */
export function getTempoAteProximaTroca(): string {
  const agora = new Date();
  const meiaNoiteAmanha = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + 1).getTime();
  const diffMs = meiaNoiteAmanha - agora.getTime();
  const horas = Math.floor(diffMs / (1000 * 60 * 60));
  const minutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${horas}h ${minutos}m`;
}
