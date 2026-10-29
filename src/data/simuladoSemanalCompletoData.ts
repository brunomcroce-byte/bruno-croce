import { SimuladoFGV, SIMULADOS_FGV_32, CriterioCorrecaoFGV } from './simuladosFgvData';

export interface CriterioItemQuestao {
  id: string;
  item: 'A' | 'B';
  pontos: number;
  descricao: string;
  palavrasChave: string[];
}

export interface QuestaoDiscursivaFGV {
  numero: 1 | 2 | 3 | 4;
  titulo: string;
  enunciado: string;
  itemA: {
    letra: 'a';
    pergunta: string;
    pontos: number; // 0.65
    gabaritoEsperado: string;
    fundamentos: string[];
  };
  itemB: {
    letra: 'b';
    pergunta: string;
    pontos: number; // 0.60
    gabaritoEsperado: string;
    fundamentos: string[];
  };
  criteriosCorrecao: CriterioItemQuestao[];
  dicaBanca: string;
}

export interface SimuladoSemanalCompleto {
  id: number;
  semanaNumero: number;
  titulo: string;
  exameReferencia: string;
  anoReferencia: string;
  tempoOficialMinutos: number; // 300 min (5h)
  notaMaximaTotal: number; // 10.00
  notaCorteAprovacao: number; // 6.00
  peca: SimuladoFGV;
  questoes: QuestaoDiscursivaFGV[];
  dicasGerais: string[];
}

export const SIMULADOS_SEMANAIS_COMPLETOS: SimuladoSemanalCompleto[] = [
  {
    id: 1,
    semanaNumero: 1,
    titulo: "Simulado Semanal 01 • Padrão Oficial FGV (Exame XLI / 41º OAB)",
    exameReferencia: "41º Exame de Ordem Unificado (2024.2)",
    anoReferencia: "2024.2",
    tempoOficialMinutos: 300,
    notaMaximaTotal: 10.00,
    notaCorteAprovacao: 6.00,
    peca: SIMULADOS_FGV_32[0], // Mandado de Segurança Repressivo (TUST/TUSD)
    questoes: [
      {
        numero: 1,
        titulo: "Questão 1: Não Incidência de ICMS em Filiais e Transferência de Créditos",
        enunciado:
          "A sociedade empresária Alfa Alimentos S.A., com sede industrial em Uberlândia/MG, transfere semanalmente toneladas de laticínios de sua produção para o centro de distribuição da sua filial Beta Ltda., localizado em Goiânia/GO, sem qualquer venda a consumidores terceiros nessa etapa. O Estado de Goiás lavrou auto de infração cobrando ICMS interestadual com alíquota de 12% sobre o valor arbitrado das mercadorias transferidas, alegando saída física do estabelecimento. Ademais, o Fisco goiano determinou o estorno integral dos créditos de ICMS aproveitados pela matriz mineira na aquisição de insumos.\n\nNa condição de advogado(a) contratado(a) pela empresa, responda fundamentadamente:",
        itemA: {
          letra: 'a',
          pergunta: "É legítima a exigência fiscal de ICMS sobre a transferência física de mercadorias entre matriz e filial da mesma empresa? Justifique com a jurisprudência vinculante e base legal.",
          pontos: 0.65,
          gabaritoEsperado:
            "Não é legítima a cobrança. A mera circulação física de mercadorias entre estabelecimentos do mesmo titular (matriz e filiais) não configura fato gerador do ICMS, pois inexiste circulação jurídica ou econômica com transferência de titularidade ou domínio. Aplica-se a Súmula 166 do STJ, o precedente vinculante do STF na ADC 49 (Tema 1.099 de Repercussão Geral) e o Art. 12, § 4º, da Lei Complementar nº 87/1996 (com a redação dada pela Lei Complementar nº 204/2023).",
          fundamentos: [
            "Súmula 166 do STJ",
            "ADC 49/STF (Tema 1.099 STF)",
            "Art. 12, § 4º, da Lei Complementar nº 87/96 (LC 204/2023)",
            "Art. 155, II, da CRFB/88"
          ]
        },
        itemB: {
          letra: 'b',
          pergunta: "Pode o Fisco exigir o estorno dos créditos de ICMS das etapas anteriores em razão da não incidência na remessa entre filiais? Justifique.",
          pontos: 0.60,
          gabaritoEsperado:
            "Não é legítima a exigência de estorno. Conforme a modulação de efeitos proferida pelo STF na ADC 49 e expressamente positivada pelo Art. 12, § 5º, da LC nº 87/1996 (incluído pela LC nº 204/2023), é assegurada expressamente a manutenção dos créditos do ICMS relativos às operações e prestações anteriores em favor do contribuinte, bem como a sua transferência para a filial de destino, não se aplicando a regra geral restritiva de estorno do Art. 155, § 2º, II, 'b', da CRFB/88.",
          fundamentos: [
            "Art. 12, § 5º, da Lei Complementar nº 87/96 (LC 204/2023)",
            "ADC 49/STF (Acórdão de Modulação)",
            "Princípio da Não Cumulatividade (Art. 155, § 2º, I, CRFB/88)"
          ]
        },
        criteriosCorrecao: [
          {
            id: "q1_a",
            item: "A",
            pontos: 0.65,
            descricao: "Demonstração da não incidência de ICMS entre filiais por ausência de circulação jurídica (Súmula 166 STJ, ADC 49 STF e Art. 12, §4º da LC 87/96).",
            palavrasChave: ["súmula 166", "adc 49", "lc 204", "art. 12, § 4º", "titularidade", "circulação jurídica"]
          },
          {
            id: "q1_b",
            item: "B",
            pontos: 0.60,
            descricao: "Demonstração da impossibilidade de estorno e garantia de manutenção/transferência dos créditos (Art. 12, §5º da LC 87/96 e ADC 49 STF).",
            palavrasChave: ["estorno", "manutenção de créditos", "art. 12, § 5º", "transferência", "não cumulatividade"]
          }
        ],
        dicaBanca: "Em questões sobre ICMS interestadual e filiais, a banca FGV pontua cumulativamente a menção à ADC 49 e à recentíssima Lei Complementar nº 204/2023 (Art. 12, §§ 4º e 5º da Lei Kandir)."
      },
      {
        numero: 2,
        titulo: "Questão 2: Imunidade Tributária Religiosa, Locação e Taxas Municipais",
        enunciado:
          "A Igreja Pentecostal Fonte de Água Viva, entidade religiosa devidamente constituída, é proprietária de três imóveis contíguos no Município de Niterói/RJ: o imóvel 'A', onde são celebrados os cultos religiosos e a catequese; o imóvel 'B', alugado a uma empresa comercial privada de vestuário, sendo comprovado por escrituração contábil idônea que a totalidade dos aluguéis é destinada à manutenção do templo e obras assistenciais; e o imóvel 'C', um lote de terreno não edificado, mantido para futura expansão da nave da igreja. O Município efetuou o lançamento de IPTU referente aos imóveis 'B' e 'C', além de lançar a Taxa de Coleta de Resíduos Domiciliares (TCRD) em face dos três imóveis.\n\nNa qualidade de advogado(a) da Igreja, responda aos itens a seguir:",
        itemA: {
          letra: 'a',
          pergunta: "É constitucional a cobrança de IPTU sobre o imóvel 'B' (alugado a terceiro) e sobre o imóvel 'C' (terreno vago)? Justifique.",
          pontos: 0.65,
          gabaritoEsperado:
            "A cobrança de IPTU é inconstitucional em ambos os casos. A imunidade de templos de qualquer culto (Art. 150, VI, 'b', c/c § 4º da CRFB/88) abrange todo o patrimônio vinculado às finalidades essenciais da entidade. Quanto ao imóvel alugado ('B'), a Súmula Vinculante 52 e a Súmula 724 do STF consolidam que a imunidade tributária alcança imóveis alugados a terceiros, desde que o valor dos aluguéis seja integralmente aplicado nas atividades essenciais da entidade religiosa. Em relação ao terreno vago ('C'), milita presunção relativa de destinação às finalidades institucionais, cabendo ao Fisco a prova em contrário (Tema 87 do STF).",
          fundamentos: [
            "Art. 150, VI, 'b' e § 4º da CRFB/88",
            "Súmula Vinculante 52 do STF",
            "Súmula 724 do STF",
            "Tema 87 do STF (Repercussão Geral)"
          ]
        },
        itemB: {
          letra: 'b',
          pergunta: "A imunidade de templos de qualquer culto afasta a cobrança da Taxa de Coleta de Resíduos Domiciliares (TCRD)? Justifique.",
          pontos: 0.60,
          gabaritoEsperado:
            "A imunidade religiosa não afasta a cobrança da taxa. A garantia constitucional da imunidade tributária prevista no Art. 150, inciso VI, da CRFB/88 limita-se exclusivamente a IMPOSTOS, não alcançando taxas instituídas em razão do exercício do poder de polícia ou pela utilização efetiva ou potencial de serviços públicos específicos e divisíveis (Art. 145, II, CRFB/88). Ademais, a Súmula Vinculante 19 do STF reconhece expressamente a constitucionalidade da taxa cobrada exclusivamente pela coleta, remoção e tratamento ou destinação de lixo ou resíduos provenientes de imóveis.",
          fundamentos: [
            "Art. 150, VI, da CRFB/88 (alcance restrito a impostos)",
            "Art. 145, II, da CRFB/88",
            "Súmula Vinculante 19 do STF"
          ]
        },
        criteriosCorrecao: [
          {
            id: "q2_a",
            item: "A",
            pontos: 0.65,
            descricao: "Imunidade do imóvel alugado vinculada à aplicação das rendas nas finalidades essenciais (Art. 150, VI, 'b' e § 4º da CF; SV 52 e Súmula 724 STF; Tema 87 STF para terreno vago).",
            palavrasChave: ["súmula vinculante 52", "art. 150, vi, b", "§ 4º", "finalidades essenciais", "aluguel", "terreno vago", "tema 87"]
          },
          {
            id: "q2_b",
            item: "B",
            pontos: 0.60,
            descricao: "Inaplicabilidade da imunidade a taxas, ressaltando o alcance restrito aos impostos e a validade da taxa de coleta de lixo (Art. 145, II da CF e Súmula Vinculante 19).",
            palavrasChave: ["súmula vinculante 19", "taxas", "restrito a impostos", "art. 145, ii", "específico e divisível"]
          }
        ],
        dicaBanca: "A FGV adora contrapor a Súmula Vinculante 52 (imunidade de imóvel alugado) com a Súmula Vinculante 19 (taxa de lixo devida porque imunidade não alcança taxa)."
      },
      {
        numero: 3,
        titulo: "Questão 3: Execução Fiscal, Prescrição Intercorrente e Redirecionamento a Sócios",
        enunciado:
          "Em fevereiro de 2017, a Fazenda Nacional ajuizou Execução Fiscal contra a sociedade Madeireira Pinhal Ltda. para cobrança de Certidão de Dívida Ativa referente a débitos de Contribuição Social sobre o Lucro Líquido (CSLL). Citada regularmente a devedora, não foram localizados bens passíveis de penhora. Em agosto de 2017, o juízo determinou a suspensão do feito com fulcro no Art. 40 da Lei nº 6.830/80 (LEF). O processo permaneceu paralisado sem qualquer movimentação por parte da Fazenda Pública por mais de 6 anos e meio. Em outubro de 2024, a Fazenda requereu o desarquivamento dos autos e o imediato redirecionamento da execução fiscal contra o sócio administrador Carlos, sob o único argumento de que a sociedade devedora inadimpliu o tributo e não possui mais ativos financeiros.\n\nNa qualidade de advogado(a) constituído(a) pela empresa e pelo sócio Carlos, responda:",
        itemA: {
          letra: 'a',
          pergunta: "Qual causa extintiva do crédito tributário deve ser arguida perante o juízo da execução? Explique a sistemática e o cômputo do prazo.",
          pontos: 0.65,
          gabaritoEsperado:
            "Deve ser arguida a PRESCRIÇÃO INTERCORRENTE do crédito tributário (Art. 156, V, do CTN). Conforme estabelece o Art. 40, §§ 1º e 2º, da LEF e o precedente vinculante firmado pelo STJ no Tema Repetitivo 566 (c/c Súmula 314/STJ), não localizados bens penhoráveis, o feito suspende-se por 1 (um) ano. Findo esse prazo sem localização de bens, inicia-se automaticamente a contagem do prazo prescricional de 5 (cinco) anos da prescrição intercorrente. Como transcorreram mais de 6 (seis) anos desde a ordem de suspensão (1 ano de suspensão + mais de 5 anos de inércia), consumou-se a prescrição intercorrente da pretensão executória.",
          fundamentos: [
            "Art. 156, V, do CTN (extinção do crédito)",
            "Art. 40, §§ 1º e 2º, da Lei nº 6.830/80 (LEF)",
            "Tema 566 do STJ (Recurso Repetitivo)",
            "Súmula 314 do STJ"
          ]
        },
        itemB: {
          letra: 'b',
          pergunta: "É admissível o redirecionamento da execução fiscal contra o sócio administrador fundamentado unicamente no inadimplemento do tributo ou na insuficiência patrimonial da sociedade? Justifique.",
          pontos: 0.60,
          gabaritoEsperado:
            "Não é admissível o redirecionamento. Conforme enunciado da Súmula 430 do STJ, o mero inadimplemento da obrigação tributária pela sociedade não gera, por si só, a responsabilidade pessoal e solidária dos sócios ou administradores prevista no Art. 135, III, do CTN. Para que haja o redirecionamento, faz-se indispensável a comprovação inequívoca de que o sócio praticou atos com excesso de poderes, infração à lei, ao contrato social ou estatuto, ou que tenha ocorrido dissolução irregular da sociedade (Súmula 435/STJ e Temas 962 e 981 do STJ).",
          fundamentos: [
            "Súmula 430 do STJ",
            "Art. 135, III, do CTN",
            "Tema 962 do STJ",
            "Tema 981 do STJ"
          ]
        },
        criteriosCorrecao: [
          {
            id: "q3_a",
            item: "A",
            pontos: 0.65,
            descricao: "Alegação da prescrição intercorrente e explicação do cômputo de 1 ano de suspensão + 5 anos de prazo prescricional (Art. 40 da LEF; Tema 566 e Súmula 314 STJ; Art. 156, V do CTN).",
            palavrasChave: ["prescrição intercorrente", "art. 40", "tema 566", "súmula 314", "1 ano de suspensão", "5 anos", "art. 156, v"]
          },
          {
            id: "q3_b",
            item: "B",
            pontos: 0.60,
            descricao: "Impossibilidade de redirecionamento por mero inadimplemento tributário (Súmula 430 do STJ e Art. 135, III do CTN; exigência de ato com infração à lei ou excesso de poderes).",
            palavrasChave: ["súmula 430", "mero inadimplemento", "art. 135, iii", "excesso de poderes", "infração à lei"]
          }
        ],
        dicaBanca: "O candidato deve citar expressamente a Súmula 430 do STJ e a contagem de 1 ano de suspensão + 5 anos de prazo (regra do Tema 566 do STJ)."
      },
      {
        numero: 4,
        titulo: "Questão 4: Repetição de Indébito de Tributo Indireto (Art. 166 CTN) e Taxa SELIC",
        enunciado:
          "A sociedade empresária Comercial Varejista de Eletrodomésticos Ltda. recolheu, ao longo dos últimos cinco anos, ICMS com alíquota majorada indevidamente pelo Estado 'W' em desacordo com as alíquotas fixadas pelo Senado Federal. Após consulta tributária e auditoria fiscal, constatou-se que a empresa recolheu indevidamente aos cofres públicos estaduais o montante de R$ 650.000,00. A empresa ingressou com Ação de Repetição de Indébito para pleitear a restituição integral do valor, requerendo a incidência cumulativa de juros moratórios de 1% ao mês mais correção monetária pelo IPCA-E a partir do pagamento indevido.\n\nCom base no ordenamento jurídico tributário e na jurisprudência dos Tribunais Superiores, responda:",
        itemA: {
          letra: 'a',
          pergunta: "Por se tratar de tributo indireto que comporta repercussão financeira (ICMS), qual requisito específico do Código Tributário Nacional deve ser comprovado para viabilizar a restituição? Justifique.",
          pontos: 0.65,
          gabaritoEsperado:
            "A empresa deve comprovar o cumprimento do Art. 166 do CTN e da Súmula 546 do STF. Por se tratar de tributo que comporte, por sua natureza, transferência do respectivo encargo financeiro (tributo indireto, como o ICMS), a restituição somente será feita a quem prove haver assumido o referido encargo sem tê-lo transferido a terceiro (consumidor de fato), ou, no caso de tê-lo transferido, estar por este expressamente autorizado a recebê-la.",
          fundamentos: [
            "Art. 166 do CTN",
            "Súmula 546 do STF",
            "Art. 165, I, do CTN"
          ]
        },
        itemB: {
          letra: 'b',
          pergunta: "É legítimo o pedido de incidência cumulada de juros moratórios de 1% ao mês com correção monetária pelo IPCA-E? Qual é o índice aplicável a partir da EC nº 113/2021?",
          pontos: 0.60,
          gabaritoEsperado:
            "O pedido de cumulação é ilegítimo. A partir da promulgação da Emenda Constitucional nº 113/2021 (Art. 3º), nas discussões e condenações que envolvam a Fazenda Pública, independentemente da natureza da dívida, para fins de atualização monetária, remuneração do capital e compensação da mora, inclusive do precatório, haverá a incidência, uma única vez, até o efetivo pagamento, do índice da taxa referencial do Sistema Especial de Liquidação e Custódia (SELIC), acumulado mensalmente, sendo vedada a cumulação com qualquer outro índice de correção monetária ou juros de mora (Tema 1.419 do STF e Tema 1.154 do STJ).",
          fundamentos: [
            "Art. 3º da Emenda Constitucional nº 113/2021",
            "Tema 1.419 do STF (Repercussão Geral)",
            "Tema 1.154 do STJ",
            "Súmula 523 do STJ"
          ]
        },
        criteriosCorrecao: [
          {
            id: "q4_a",
            item: "A",
            pontos: 0.65,
            descricao: "Exigência de prova de assunção do encargo financeiro ou autorização expressa do contribuinte de fato nos tributos indiretos (Art. 166 do CTN e Súmula 546 STF).",
            palavrasChave: ["art. 166", "súmula 546", "encargo financeiro", "contribuinte de fato", "autorização expressa"]
          },
          {
            id: "q4_b",
            item: "B",
            pontos: 0.60,
            descricao: "Incidência exclusiva da Taxa SELIC e vedação à cumulação com juros ou outros índices de correção (Art. 3º da EC 113/2021; Tema 1.419 STF e Tema 1.154 STJ).",
            palavrasChave: ["selic", "taxa selic", "ec 113/2021", "art. 3º", "vedada cumulação", "tema 1.419"]
          }
        ],
        dicaBanca: "Em repetição de indébito tributário, a FGV exige expressamente a menção à trava do Art. 166 do CTN e à taxa SELIC exclusiva da EC 113/2021."
      }
    ],
    dicasGerais: [
      "Tempo Total de Prova: 5 horas ininterruptas (recomenda-se destinar 2h30 a 3h00 para a Peça e 2h00 para as 4 Questões).",
      "Cada Questão Discursiva deve ser respondida em no máximo 30 linhas na folha pautada FGV correspondente.",
      "A aprovação na 2ª Fase exige nota final igual ou superior a 6,00 pontos (soma da Peça de 0 a 5,00 + Questões de 0 a 5,00)."
    ]
  },
  {
    id: 2,
    semanaNumero: 2,
    titulo: "Simulado Semanal 02 • Padrão Oficial FGV (Exame XL / 40º OAB)",
    exameReferencia: "40º Exame de Ordem Unificado (2024.1)",
    anoReferencia: "2024.1",
    tempoOficialMinutos: 300,
    notaMaximaTotal: 10.00,
    notaCorteAprovacao: 6.00,
    peca: SIMULADOS_FGV_32[1], // Ação Anulatória com Tutela de Urgência (ISS Locação Bens Móveis)
    questoes: [
      {
        numero: 1,
        titulo: "Questão 1: ISS sobre Locação de Bens Móveis vs Serviços Mistos",
        enunciado:
          "A empresa Andaimes e Máquinas Ltda. loca guindastes e andaimes para construtoras civis sem fornecimento de mão de obra de operador. O Município de Salvador/BA lançou ISS sobre a totalidade dos contratos sob a justificativa de que a locação estaria enquadrada como serviço no subitem 3.01 da Lei Complementar nº 116/2003. Em outro contrato, a empresa aluga guindaste COM operador especializado da própria locadora para montagem de estrutura industrial.\n\nResponda fundamentadamente:",
        itemA: {
          letra: 'a',
          pergunta: "É constitucional a incidência de ISS sobre a locação pura de bens móveis (sem fornecimento de operador)? Justifique.",
          pontos: 0.65,
          gabaritoEsperado:
            "É inconstitucional. A locação pura de bens móveis consubstancia obrigação de dar, e não obrigação de fazer, afastando o conceito constitucional de 'serviços de qualquer natureza' tributáveis pelo ISS (Art. 156, III, CRFB/88). Aplica-se a Súmula Vinculante 31 do STF ('É inconstitucional a incidência do imposto sobre serviços de qualquer natureza - ISS sobre operações de locação de bens móveis') e o Tema 19 do STF.",
          fundamentos: [
            "Súmula Vinculante 31 do STF",
            "Art. 156, III, da CRFB/88",
            "Tema 19 do STF",
            "Distinção entre obrigação de dar e de fazer"
          ]
        },
        itemB: {
          letra: 'b',
          pergunta: "No contrato em que há locação de guindaste COM fornecimento de operador especializado, incide o ISS sobre a totalidade do valor contratual? Justifique.",
          pontos: 0.60,
          gabaritoEsperado:
            "Incide ISS apenas sobre a parcela relativa à prestação dos serviços do operador, sendo legítima a segregação contratual da locação do bem móvel. O STF pacificou no Tema 212 da Repercussão Geral que, nos contratos complexos ou mistos, é lícita a tributação pelo ISS da atividade de prestar serviço com cessão de operador, devendo a base de cálculo restringir-se ao valor dos serviços prestados caso haja discriminação clara e separada nos contratos e notas fiscais.",
          fundamentos: [
            "Tema 212 do STF (Repercussão Geral)",
            "Súmula Vinculante 31 do STF",
            "Art. 156, III, da CRFB/88"
          ]
        },
        criteriosCorrecao: [
          {
            id: "q1_a_s2",
            item: "A",
            pontos: 0.65,
            descricao: "Inconstitucionalidade do ISS sobre locação pura de bens móveis por ser obrigação de dar (Súmula Vinculante 31 e Tema 19 do STF; Art. 156, III da CF).",
            palavrasChave: ["súmula vinculante 31", "obrigação de dar", "tema 19", "art. 156, iii", "bens móveis"]
          },
          {
            id: "q1_b_s2",
            item: "B",
            pontos: 0.60,
            descricao: "Incidência de ISS restrita ao valor do serviço do operador e viabilidade de segregação nos contratos mistos (Tema 212 STF).",
            palavrasChave: ["tema 212", "contrato misto", "segregação", "operador", "base de cálculo"]
          }
        ],
        dicaBanca: "Sempre destaque a diferença entre obrigação de dar (locação pura, SV 31) e obrigação de fazer (prestação de serviço de operador, Tema 212 STF)."
      },
      {
        numero: 2,
        titulo: "Questão 2: Princípio da Anterioridade Anual e Nonagesimal e Medida Provisória",
        enunciado:
          "Em 20 de dezembro de 2024, o Presidente da República editou a Medida Provisória nº 999 majorando a alíquota da Contribuição Social sobre o Lucro Líquido (CSLL) devida pelas instituições financeiras de 20% para 25%, com vigência imediata a partir de 1º de janeiro de 2025. A referida Medida Provisória foi convertida na Lei Ordinária Federal nº 15.000 em 15 de março de 2025 sem alterações de mérito.\n\nComo advogado(a) de um banco comercial afetado pela majoração, responda:",
        itemA: {
          letra: 'a',
          pergunta: "A exigência da nova alíquota majorada da CSLL a partir de 1º de janeiro de 2025 é constitucional? Justifique.",
          pontos: 0.65,
          gabaritoEsperado:
            "A exigência a partir de 1º de janeiro de 2025 é inconstitucional por violação à anterioridade nonagesimal (noventena). As contribuições sociais para a seguridade social sujeitam-se ao princípio da anterioridade nonagesimal especial previsto no Art. 195, § 6º, da CRFB/88, só podendo ser exigidas após decorridos 90 (noventa) dias da data da publicação da lei (ou MP) que as houver instituído ou modificado. Como a MP foi publicada em 20/12/2024, a cobrança majorada só poderia surtir efeitos a partir de 20 de março de 2025.",
          fundamentos: [
            "Art. 195, § 6º, da CRFB/88 (anterioridade nonagesimal das contribuições sociais)",
            "Art. 150, III, 'c', da CRFB/88",
            "Prazo de 90 dias a contar da publicação da MP"
          ]
        },
        itemB: {
          letra: 'b',
          pergunta: "A CSLL se sujeita também ao princípio da anterioridade anual do exercício financeiro seguinte (Art. 150, III, 'b', da CF)? Justifique.",
          pontos: 0.60,
          gabaritoEsperado:
            "Não. Por expressa disposição constitucional constante do Art. 195, § 6º, c/c Art. 150, § 1º, da CRFB/88, as contribuições para a seguridade social (dentre elas a CSLL) constituem exceção taxativa ao princípio da anterioridade anual do exercício financeiro seguinte, sujeitando-se única e exclusivamente à observância da anterioridade nonagesimal (90 dias).",
          fundamentos: [
            "Art. 195, § 6º, da CRFB/88",
            "Art. 150, § 1º, da CRFB/88 (exceção à anterioridade anual)",
            "Natureza de contribuição da seguridade social"
          ]
        },
        criteriosCorrecao: [
          {
            id: "q2_a_s2",
            item: "A",
            pontos: 0.65,
            descricao: "Violação da anterioridade nonagesimal de 90 dias para contribuições de seguridade social (Art. 195, § 6º da CF; contagem a partir de 20/12/2024).",
            palavrasChave: ["anterioridade nonagesimal", "90 dias", "art. 195, § 6º", "seguridade social", "20 de março"]
          },
          {
            id: "q2_b_s2",
            item: "B",
            pontos: 0.60,
            descricao: "Demonstração de que a CSLL é exceção à anterioridade anual e sujeita apenas à noventena (Art. 195, § 6º c/c Art. 150, § 1º da CF).",
            palavrasChave: ["exceção à anterioridade anual", "art. 150, § 1º", "art. 195, § 6º", "exercício seguinte"]
          }
        ],
        dicaBanca: "Lembre-se: Contribuições da Seguridade Social (PIS, COFINS, CSLL) obedecem apenas à noventena de 90 dias, sendo exceção à anterioridade anual do exercício seguinte."
      },
      {
        numero: 3,
        titulo: "Questão 3: Responsabilidade Tributária na Sucessão Empresarial e Fundo de Comércio",
        enunciado:
          "A sociedade Drogaria Vida Nova Ltda. adquiriu, mediante contrato de trespasse de fundo de comércio, o estabelecimento comercial e o ponto de venda da antiga Farmácia Saúde Total Ltda., continuando a explorar a mesma atividade comercial no mesmo endereço. A vendedora encerrou integralmente suas atividades mercantis e deu baixa no CNPJ 30 dias após a alienação. Passados seis meses, o Estado lavrou auto de infração cobrando da adquirente Drogaria Vida Nova Ltda. débitos fiscais de ICMS gerados pela antiga farmácia em período anterior ao trespasse.\n\nNa qualidade de advogado(a) da adquirente, responda:",
        itemA: {
          letra: 'a',
          pergunta: "A Drogaria Vida Nova Ltda. responde pelos débitos de ICMS constituídos pela vendedora antes da aquisição? Em que modalidade de responsabilidade? Justifique.",
          pontos: 0.65,
          gabaritoEsperado:
            "Sim, a adquirente responde integralmente pelos débitos fiscais na modalidade de RESPONSABILIDADE SUBSIDIÁRIA/INTEGRAL POR SUCESSÃO. Nos termos do Art. 133, inciso I, do Código Tributário Nacional (CTN), a pessoa jurídica que adquire de outra, por qualquer título, fundo de comércio ou estabelecimento comercial, e continuar a respectiva exploração, responde pelos tributos relativos ao estabelecimento adquirido até a data do ato, integralmente, se o alienante cessar a exploração do comércio, indústria ou atividade.",
          fundamentos: [
            "Art. 133, inciso I, do CTN",
            "Responsabilidade por sucessão empresarial / trespasse",
            "Cessação de atividade pelo alienante"
          ]
        },
        itemB: {
          letra: 'b',
          pergunta: "Qual seria a modalidade de responsabilidade da adquirente caso a vendedora continuasse a exercer atividade empresarial em novo ramo no prazo de 6 meses? Justifique.",
          pontos: 0.60,
          gabaritoEsperado:
            "A responsabilidade da adquirente seria meramente SUBSIDIÁRIA com o alienante. Conforme preceitua o Art. 133, inciso II, do CTN, a adquirente responde subsidiariamente com o alienante se este prosseguir na exploração ou iniciar, dentro de 6 (seis) meses a contar da data da alienação, nova atividade no mesmo ou em outro ramo de comércio, indústria ou profissão, devendo o Fisco executar primeiramente os bens do devedor originário (alienante).",
          fundamentos: [
            "Art. 133, inciso II, do CTN",
            "Responsabilidade subsidiária e benefício de ordem",
            "Prazo de 6 meses para reinício de atividade"
          ]
        },
        criteriosCorrecao: [
          {
            id: "q3_a_s2",
            item: "A",
            pontos: 0.65,
            descricao: "Responsabilidade integral da adquirente pelo encerramento de atividades do alienante conforme Art. 133, I, do CTN.",
            palavrasChave: ["art. 133, i", "integralmente", "sucessão", "cessação", "fundo de comércio"]
          },
          {
            id: "q3_b_s2",
            item: "B",
            pontos: 0.60,
            descricao: "Responsabilidade subsidiária caso o alienante reinicie atividade em até 6 meses conforme Art. 133, II, do CTN.",
            palavrasChave: ["art. 133, ii", "subsidiariamente", "6 meses", "nova atividade", "benefício de ordem"]
          }
        ],
        dicaBanca: "O Art. 133 do CTN divide a responsabilidade: se o vendedor parar = comprador responde integralmente (inciso I); se o vendedor continuar ou reabrir em até 6 meses = comprador responde subsidiariamente (inciso II)."
      },
      {
        numero: 4,
        titulo: "Questão 4: Certidão Positiva com Efeitos de Negativa (CPD-EN) e Seguro-Garantia",
        enunciado:
          "A empresa Construtora Horizonte S.A. pretende participar de uma concorrência pública de grande vulto promovida pelo Governo do Estado da Bahia, cujo edital exige a apresentação de Certidão Negativa de Débitos (CND) ou Certidão Positiva com Efeitos de Negativa (CPD-EN). Ocorre que a Fazenda Estadual efetuou lançamento tributário de ICMS no valor de R$ 3.000.000,00, contra o qual a empresa não apresentou recurso administrativo e que ainda não foi executado judicialmente pela Procuradoria. Com receio de ficar inabilitada no certame, a empresa ofereceu perante o juízo cível, em ação cautelar preparatória, apólice idônea de SEGURO-GARANTIA no valor do débito acrescido de 30%, requerendo a expedição de CPD-EN. O Fisco recusou o documento alegando ausência de depósito em dinheiro.\n\nComo advogado(a) da construtora, responda fundamentadamente:",
        itemA: {
          letra: 'a',
          pergunta: "É lícito à empresa oferecer seguro-garantia em ação cautelar preparatória para garantir o débito antes da execução fiscal e obter a CPD-EN? Justifique.",
          pontos: 0.65,
          gabaritoEsperado:
            "Sim, é plenamente lícito. Conforme enunciado da Súmula 656 do STJ e o Tema Repetitivo 383 do STJ, é válida a apresentação de fiança bancária ou seguro-garantia em medida cautelar preparatória antes do ajuizamento da execução fiscal, com a finalidade de antecipar a garantia do juízo e obter a Certidão Positiva com Efeitos de Negativa (CPD-EN), nos termos do Art. 206 do CTN c/c Art. 9º, II, e Art. 15, I, da LEF (Lei nº 6.830/80).",
          fundamentos: [
            "Súmula 656 do STJ",
            "Art. 206 do CTN (CPD-EN)",
            "Tema 383 do STJ",
            "Art. 9º, II, da Lei nº 6.830/80 (LEF) e Art. 848, parágrafo único, do CPC"
          ]
        },
        itemB: {
          letra: 'b',
          pergunta: "A apresentação de seguro-garantia suspende a exigibilidade do crédito tributário (Art. 151 do CTN)? Justifique a repercussão prática sobre a expedição da certidão.",
          pontos: 0.60,
          gabaritoEsperado:
            "A fiança ou seguro-garantia não constitui modalidade clássica originária de suspensão da exigibilidade pelo rol do Art. 151 do CTN (salvo sob os novos ditames da LC 236/2026). Contudo, mesmo sem suspender a exigibilidade do crédito em sentido estrito, o Art. 206 do CTN expressamente determina que tem os mesmos efeitos da CND a certidão que constar a existência de créditos garantidos por penhora ou garantia idônea em juízo, conferindo direito subjetivo à obtenção imediata da CPD-EN (Súmula 656/STJ).",
          fundamentos: [
            "Art. 206 do CTN (Garantia do juízo assegura CPD-EN)",
            "Súmula 656 do STJ",
            "Art. 151 do CTN c/c LC 236/2026"
          ]
        },
        criteriosCorrecao: [
          {
            id: "q4_a_s2",
            item: "A",
            pontos: 0.65,
            descricao: "Validade da antecipação de garantia por seguro-garantia antes da execução fiscal para fins de CPD-EN (Súmula 656 STJ; Art. 206 do CTN).",
            palavrasChave: ["súmula 656", "seguro-garantia", "art. 206", "cpd-en", "ação preparatória", "cautelar"]
          },
          {
            id: "q4_b_s2",
            item: "B",
            pontos: 0.60,
            descricao: "Efeito do Art. 206 do CTN assegurando a expedição de CPD-EN mediante garantia idônea mesmo em face das regras do Art. 151 do CTN.",
            palavrasChave: ["art. 206", "mesmos efeitos da cnd", "garantia idônea", "direito subjetivo", "súmula 656"]
          }
        ],
        dicaBanca: "Súmula 656 do STJ é questão carimbada na 2ª Fase: seguro-garantia em medida cautelar preparatória gera direito líquido e certo à CPD-EN (Art. 206 CTN)."
      }
    ],
    dicasGerais: [
      "No 40º Exame da OAB, a banca cobrou a identificação de tese de inconstitucionalidade do ISS (Súmula Vinculante 31) e a correta aplicação do Art. 133 do CTN.",
      "Para cada questão discursiva, mantenha a resposta clara e objetiva com a sequência: Tese Jurídica -> Fundamento Legal -> Aplicação ao caso concreto."
    ]
  }
];
