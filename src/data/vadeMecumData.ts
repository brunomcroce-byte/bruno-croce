export interface VadeItem {
  cor: 'AMARELO' | 'VERDE' | 'ROSA' | 'AZUL' | 'CLIPES' | string;
  ref: string;
  artigoNum: string;
  diplomaNome: string;
  titulo: string;
  textoCompleto: string;
  descricaoDetalhada: string;
  aplicacaoPeca: string;
  pegadinhaFGV: string;
  obs: string;
  novo?: boolean;
}

export const VADE_DATA: VadeItem[] = [
  // 1. Art. 3º CTN
  {
    cor: "AMARELO",
    ref: "Art. 3º CTN – Conceito formal de tributo",
    artigoNum: "Art. 3º",
    diplomaNome: "Código Tributário Nacional (Lei nº 5.172/1966)",
    titulo: "Conceito Formal de Tributo e Natureza Não Sancionatória",
    textoCompleto: `Art. 3º Tributo é toda prestação pecuniária compulsória, em moeda ou cujo valor nela se possa exprimir, que não constitua sanção de ato ilícito, instituída em lei e cobrada mediante atividade administrativa plenamente vinculada.`,
    descricaoDetalhada: `O Art. 3º do CTN consagra a definição legal e formal de tributo no ordenamento jurídico brasileiro, desdobrando-se em cinco elementos essenciais e cumulativos:
1. Prestação pecuniária: obrigação de entregar dinheiro (salvo dação em pagamento de bens imóveis prevista em lei nos termos do Art. 156, XI, do CTN);
2. Compulsória: decorre diretamente da lei (ex lege), independente de manifestação de vontade ou contrato do contribuinte;
3. Em moeda ou cujo valor nela se possa exprimir: veda tributos in natura (em grãos/mercadorias) ou in labore (trabalho forçado);
4. Que não constitua sanção de ato ilícito: o tributo distingue-se ontologicamente da penalidade ou multa. A multa pune a conduta ilícita; o tributo é cobrado diante de um fato gerador lícito ou de uma manifestação de capacidade econômica. Aplica-se concomitantemente o princípio do "pecunia non olet" (Art. 118, I, CTN), segundo o qual as consequências tributárias incidem independentemente da ilicitude do ato de onde se originou a renda ou patrimônio;
5. Instituída em lei e cobrada mediante atividade administrativa plenamente vinculada: obediência estrita ao princípio da legalidade (Art. 150, I, CF) e ao dever de lançamento vinculado (Art. 142, parágrafo único, CTN), sem margem para discricionariedade do auditor fiscal.`,
    aplicacaoPeca: "Utilizado em preliminares e mérito de Ação Anulatória, Mandado de Segurança e Embargos para comprovar que valores cobrados pelo Fisco sem lei expressa ou com natureza punitiva disfarçada não atendem à definição jurídica de tributo.",
    pegadinhaFGV: "A FGV adora cobrar a distinção entre tributo e multa. Lembre-se: tributo não é sanção de ato ilícito. Se o Fisco tentar cobrar 'tributo' exclusivamente porque alguém cometeu um crime ou infração administrativa, há desvirtuamento do Art. 3º do CTN. Todavia, os rendimentos auferidos pelo criminoso sofrem incidência de IR pelo 'pecunia non olet' (Art. 118, I).",
    obs: "Artigo clássico de abertura de fundamentação de direito material na 2ª Fase.",
    novo: false
  },

  // 2. Arts. 5º a 7º CTN
  {
    cor: "AMARELO",
    ref: "Arts. 5º a 7º CTN – Espécies tributárias e indelegabilidade de competência",
    artigoNum: "Arts. 5º a 7º",
    diplomaNome: "Código Tributário Nacional (CTN)",
    titulo: "Espécies Tributárias e Indelegabilidade da Competência Tributária",
    textoCompleto: `Art. 5º Os tributos são impostos, taxas e contribuições de melhoria.

Art. 6º A atribuição constitucional de competência tributária compreende a competência legislativa plena, ressalvadas as limitações contidas na Constituição Federal, nas Constituições dos Estados e nas Leis Orgânicas do Distrito Federal e dos Municípios, e observado o disposto nesta Lei.
Parágrafo único. Os tributos cuja receita seja distribuída, no todo ou em parte, a outras pessoas jurídicas de direito público pertencerá à competência legislativa daquela a que tenham sido atribuídos.

Art. 7º A competência tributária é indelegável, salvo atribuição das funções de arrecadar ou fiscalizar tributos, ou de executar leis, serviços, atos ou decisões administrativas em matéria tributária, conferida por uma pessoa jurídica de direito público a outra, nos termos do § 3º do artigo 18 da Constituição.
§ 1º A atribuição compreende as garantias e os privilégios processuais que competem à pessoa jurídica de direito público que a conferir.
§ 2º A atribuição pode ser revogada, a qualquer tempo, por ato unilateral da pessoa jurídica de direito público que a tenha conferido.
§ 3º Não constitui delegação de competência o cometimento, a pessoas de direito privado, do encargo ou da função de arrecadar tributos.`,
    descricaoDetalhada: `Trata da classificação das espécies e da indelegabilidade do poder de tributar:
- O Art. 5º adota a teoria tripartite (impostos, taxas e contribuição de melhoria), superada pela Teoria Pentapartida do STF (que inclui empréstimos compulsórios e contribuições especiais);
- O Art. 7º faz a distinção fundamental entre Competência Tributária (poder legislativo de instituir o tributo, indelegável e constitucional) e Capacidade Tributária Ativa (função administrativa de arrecadar, fiscalizar e cobrar, que pode ser delegada a outras pessoas jurídicas de direito público, como autarquias).`,
    aplicacaoPeca: "Essencial para teses de ilegitimidade do polo passivo ou incompetência legislativa do ente quando uma lei municipal ou estadual tenta instituir tributo cuja competência é privativa da União ou vice-versa.",
    pegadinhaFGV: "Cuidado: bancos que recebem guias de pagamento não exercem capacidade tributária ativa, apenas mera função material arrecadatória (§3º do Art. 7º). Além disso, autarquia que arrecada pode sofrer revogação da atribuição a qualquer tempo por ato unilateral do ente político instituidor.",
    obs: "Atenção ao Art. 7º, §3º: concessionárias e bancos exercem mera arrecadação financeira privada.",
    novo: false
  },

  // 3. Arts. 113 a 115 CTN
  {
    cor: "AMARELO",
    ref: "Arts. 113 a 115 CTN – Obrigação tributária principal e acessória",
    artigoNum: "Arts. 113 a 115",
    diplomaNome: "Código Tributário Nacional (CTN)",
    titulo: "Estrutura da Obrigação Tributária Principal e Acessória",
    textoCompleto: `Art. 113. A obrigação tributária é principal ou acessória.
§ 1º A obrigação principal surge com a ocorrência do fato gerador, tem por objeto o pagamento de tributo ou penalidade pecuniária e extingue-se juntamente com o crédito dela decorrente.
§ 2º A obrigação acessória decorre da legislação tributária e tem por objeto as prestações, positivas ou negativas, nela previstas no interesse da arrecadação ou da fiscalização dos tributos.
§ 3º A obrigação acessória, pelo simples fato da sua inobservância, converte-se em obrigação principal relativamente à penalidade pecuniária.

Art. 114. Fato gerador da obrigação principal é a situação definida em lei como necessária e suficiente à sua ocorrência.

Art. 115. Fato gerador da obrigação acessória é qualquer situação que, na forma da legislação aplicável, imponha a prática ou a abstenção de ato que não configure obrigação principal.`,
    descricaoDetalhada: `Consagra a dualidade fundamental do dever fiscal:
- Obrigação Principal (§1º): tem conteúdo sempre patrimonial pecuniário (dinheiro). Surge no exato momento da subsunção fática à hipótese de incidência (fato gerador). Inclui pagamento do tributo e da penalidade pecuniária (multa).
- Obrigação Acessória (§2º): tem caráter instrumental (fazer, não fazer ou tolerar algo no interesse da fiscalização, tais como emitir nota fiscal, manter livros contábeis e escrituração digital, declarar rendimentos).
- Conversão pelo descumprimento (§3º): se a pessoa descumpre um dever instrumental (obrigação acessória), aplica-se a penalidade pecuniária (multa), tornando-se uma obrigação principal quanto ao pagamento daquela quantia.`,
    aplicacaoPeca: "Fundamental para fundamentar a nulidade de autuações por descumprimento de obrigação acessória inexigível, bem como para teses de imunidade que não dispensam o cumprimento de obrigações acessórias.",
    pegadinhaFGV: "A FGV costuma questionar se entidade imune precisa cumprir obrigação acessória. A resposta é SIM: a imunidade afasta a obrigação principal (pagamento do imposto), mas não dispensa o cumprimento das obrigações acessórias (Art. 113, §2º, e Art. 194 do CTN).",
    obs: "O Art. 113, §3º explica por que a multa fiscal se torna obrigação principal.",
    novo: false
  },

  // 4. Arts. 116 e 118 CTN
  {
    cor: "AMARELO",
    ref: "Arts. 116 e 118 CTN – Fato gerador e princípio do pecunia non olet",
    artigoNum: "Arts. 116 e 118",
    diplomaNome: "Código Tributário Nacional (CTN)",
    titulo: "Fato Gerador, Cláusula Antielisiva e Princípio do Pecunia Non Olet",
    textoCompleto: `Art. 116. Salvo disposição de lei em contrário, considera-se ocorrido o fato gerador e existentes os seus efeitos:
I - tratando-se de situação de fato, desde o momento em que o se verifiquem as circunstâncias materiais necessárias a que produza os efeitos que normalmente lhe são próprios;
II - tratando-se de situação jurídica, desde o momento em que esteja definitivamente constituída, nos termos de direito aplicável.
Parágrafo único. A autoridade administrativa poderá desconsiderar atos ou negócios jurídicos praticados com a finalidade de dissimular a ocorrência do fato gerador do tributo ou a natureza dos elementos constitutivos da obrigação tributária, observados os procedimentos a serem estabelecidos em lei ordinária.

Art. 118. A definição legal do fato gerador é interpretada com abstração:
I - da validade jurídica dos atos efetivamente praticados pelos contribuintes, responsáveis, ou terceiros, bem como da natureza do seu objeto ou dos seus efeitos;
II - dos efeitos dos fatos efetivamente ocorridos.`,
    descricaoDetalhada: `Define o momento em que a relação jurídica tributária se concretiza no mundo fenomênico:
- Situação de fato (inciso I): quando se consolidam os elementos empíricos (ex: auferir renda, prestar um serviço);
- Situação jurídica (inciso II): quando os atos de direito estão constituídos de forma definitiva (ex: registro do imóvel para transmissão de propriedade);
- Parágrafo único do Art. 116: norma geral antielisiva (antielisão/desconsideração de negócios simulados), que exige prévio procedimento legal de contraditório;
- Art. 118 (Pecunia Non Olet): a tributação não depende da licitude do ato ou da capacidade civil da parte. Renda obtida por atividade ilícita (jogos de azar, contrabando) deve pagar Imposto de Renda, pois a dispensa violaria a isonomia com o cidadão honesto.`,
    aplicacaoPeca: "Invocado quando a autoridade fiscal autua o contribuinte sem lei ordinária regulamentando o procedimento do parágrafo único do art. 116, ou em questões da OAB que tratam de tributação de pessoas incapazes ou atividades ilícitas.",
    pegadinhaFGV: "Tributar atividade ilícita (pecunia non olet) NÃO significa que o tributo é sanção! O tributo incide sobre a manifestação de riqueza econômica (auferir renda), independentemente de o negócio subjacente ser lícito ou ilícito.",
    obs: "Art. 116, parágrafo único é norma de eficácia limitada quanto ao procedimento administrativo.",
    novo: false
  },

  // 5. Arts. 121 a 123 CTN
  {
    cor: "AMARELO",
    ref: "Arts. 121 a 123 CTN – Sujeito passivo direto e convenções particulares inoponíveis",
    artigoNum: "Arts. 121 a 123",
    diplomaNome: "Código Tributário Nacional (CTN)",
    titulo: "Sujeito Passivo da Obrigação e Inoponibilidade de Convenções Privadas",
    textoCompleto: `Art. 121. Sujeito passivo da obrigação principal é a pessoa obrigada ao pagamento de tributo ou penalidade pecuniária.
Parágrafo único. O sujeito passivo da obrigação principal diz-se:
I - contribuinte, quando tenha relação pessoal e direta com a situação que constitua o respectivo fato gerador;
II - responsável, quando, sem revestir a condição de contribuinte, sua obrigação decorra de disposição expressa de lei.

Art. 122. Sujeito passivo da obrigação acessória é a pessoa obrigada às prestações que constituam o seu objeto.

Art. 123. Salvo disposições de lei em contrário, as convenções particulares, relativas à responsabilidade pelo pagamento de tributos, não podem ser opostas à Fazenda Pública, para modificar a definição legal do sujeito passivo da obrigação tributária correspondente.`,
    descricaoDetalhada: `Estabelece as regras de sujeição passiva tributária:
- Contribuinte (Art. 121, parágrafo único, I): sujeito que pratica diretamente o fato gerador (relação pessoal e direta);
- Responsável (Art. 121, parágrafo único, II): terceiro cuja obrigação decorre de expressa previsão em lei (responsabilidade por transferência ou substituição);
- Inoponibilidade de contratos ao Fisco (Art. 123): cláusulas de contratos de locação ou compra e venda estipulando que o inquilino pagará o IPTU ou que o comprador pagará a taxa só produzem efeitos entre as partes particulares. O Fisco continuará cobrando do proprietário legalmente definido, não podendo o particular alegar o contrato privado para se eximir perante a Fazenda.`,
    aplicacaoPeca: "Muito citado na 2ª Fase em teses de defesa em Execuções Fiscais e Embargos para comprovar ilegitimidade passiva do responsável tributário ou justificar direito de regresso em Repetição de Indébito.",
    pegadinhaFGV: "A questão típica da FGV traz um contrato de locação em que o locatário se comprometeu a pagar o IPTU, mas não pagou. O Município ajuíza Execução Fiscal contra o proprietário locador. O locador pode alegar em Embargos o contrato de locação? NÃO! O Art. 123 veda opor convenções privadas à Fazenda Pública.",
    obs: "Súmula 399 do STJ: 'O negócio jurídico que transfere o encargo do IPTU ao locatário não é oponível ao Fisco'.",
    novo: false
  },

  // 6. Arts. 128 a 138 CTN
  {
    cor: "AMARELO",
    ref: "Arts. 128 a 138 CTN – Responsabilidade tributária e denúncia espontânea",
    artigoNum: "Arts. 128 a 138",
    diplomaNome: "Código Tributário Nacional (CTN)",
    titulo: "Regime da Responsabilidade dos Sucessores, Terceiros, Sócios e Denúncia Espontânea",
    textoCompleto: `Art. 128. Sem prejuízo do disposto neste capítulo, a lei pode atribuir de modo expresso a responsabilidade pelo crédito tributário a terceira pessoa, vinculada ao fato gerador da respectiva obrigação, excluindo a responsabilidade do contribuinte ou atribuindo-a a este em caráter supletivo do cumprimento total ou parcial da referida obrigação.

Art. 135. São pessoalmente responsáveis pelos créditos correspondentes a obrigações tributárias resultantes de atos praticados com excesso de poderes ou infração de lei, contrato social ou estatutos:
I - as pessoas referidas no artigo anterior;
II - os mandatários, prepostos e empregados;
III - os diretores, gerentes ou representantes de pessoas jurídicas de direito privado.

Art. 138. A responsabilidade é excluída pela denúncia espontânea da infração, acompanhada, se for o caso, do pagamento do tributo devido e dos juros de mora, ou do depósito da importância arbitrada pela autoridade administrativa, quando o montante do tributo dependa de apuração.
Parágrafo único. Não se considera espontânea a denúncia apresentada após o início de qualquer procedimento administrativo ou medida de fiscalização, relacionados com a infração. (Atualizado pela LC 236/2026: a denúncia espontânea exclui expressamente a multa moratória e punitiva).`,
    descricaoDetalhada: `Conjunto central de dispositivos de responsabilidade patrimonial e exclusão de penalidades:
- Art. 128: princípio da legalidade estrita na atribuição de responsabilidade tributária a terceiros;
- Art. 135, III: responsabilidade pessoal de administradores e sócios-gerentes. Exige DOLO, excesso de poderes ou infração à lei/contrato. O mero inadimplemento da obrigação tributária não enseja o redirecionamento da execução fiscal contra o sócio (Súmula 430 do STJ);
- Súmula 435 do STJ: presume-se dissolvida irregularmente a empresa que deixar de funcionar no seu domicílio fiscal sem comunicação aos órgãos competentes, legitimando o redirecionamento ao sócio-gerente da época da dissolução;
- Art. 138: Denúncia Espontânea. Confissão da dívida e pagamento integral antes de qualquer ação do Fisco afasta a multa moratória e punitiva (consolidado pelo STJ na Súmula 665 e na redação da LC 236/2026).`,
    aplicacaoPeca: "Tese mestra da Exceção de Pré-Executividade (EPE) e dos Embargos à Execução Fiscal para requerer a exclusão do sócio-gerente do polo passivo da CDA por ausência dos requisitos do Art. 135, III, do CTN c/c Súmula 430 do STJ.",
    pegadinhaFGV: "Tributo declarado pelo contribuinte e não pago (ex: DCTF entregue sem recolhimento da guia) NÃO dá direito à denúncia espontânea (Súmula 360 do STJ). A denúncia espontânea exige que o Fisco não tivesse ciência prévia da infração.",
    obs: "Com a LC 236/2026, ficou pacificado em lei que a denúncia espontânea exclui também a multa moratória.",
    novo: false
  },

  // 7. Art. 142 CTN
  {
    cor: "AMARELO",
    ref: "Art. 142 CTN – Lançamento tributário",
    artigoNum: "Art. 142",
    diplomaNome: "Código Tributário Nacional (CTN)",
    titulo: "Constituição do Crédito Tributário pelo Lançamento Vinculado",
    textoCompleto: `Art. 142. Compete privativamente à autoridade administrativa constituir o crédito tributário pelo lançamento, assim entendido o procedimento administrativo tendente a verificar a ocorrência do fato gerador da obrigação correspondente, determinar a matéria tributável, calcular o montante do tributo devido, identificar o sujeito passivo e, sendo caso, propor a aplicação da penalidade cabível.
Parágrafo único. A atividade administrativa de lançamento é vinculada e obrigatória, sob pena de responsabilidade funcional.
(Atualizado pela LC 236/2026: vedada a lavratura de lançamento com aplicação de multas punitivas nas hipóteses de lançamento preventivo quando a exigibilidade estiver suspensa, e instituídas reduções escalonadas de 50% a 20% no recolhimento tempestivo).`,
    descricaoDetalhada: `O Art. 142 define a natureza e os atos essenciais do lançamento tributário:
- Natureza Jurídica: ato administrativo privativo, vinculado e obrigatório, de efeito declaratório da obrigação e constitutivo do crédito tributário;
- Elementos constitutivos do procedimento:
  a) Verificação da ocorrência do fato gerador concreto;
  b) Determinação da matéria tributável (base de cálculo);
  c) Aplicação da alíquota e cálculo do montante devido;
  d) Identificação precisa do sujeito passivo (contribuinte ou responsável);
  e) Aplicação fundamentada da penalidade cabível se houver infração.
- O parágrafo único veda juízo de conveniência ou oportunidade ao auditor fiscal. O lançamento deve ser realizado obrigatoriamente, ressalvadas as hipóteses em que o crédito estiver com exigibilidade suspensa preventivamente.`,
    aplicacaoPeca: "Tese forte em Ação Anulatória de Lançamento Fiscal e Mandado de Segurança repressivo quando a notificação do lançamento foi realizada sem motivação clara, com erro na identificação do sujeito passivo ou erro na quantificação da base de cálculo.",
    pegadinhaFGV: "Lançamento preventivo: se o crédito tributário estiver com a exigibilidade suspensa (ex: liminar em MS - Art. 151, IV), o Fisco PODE e DEVE efetuar o lançamento preventivo para evitar a decadência (Súmula 622 do STJ), mas não pode praticar atos de cobrança coativa nem impor penalidades punitivas (LC 236/2026).",
    obs: "Artigo de menção obrigatória para conceituar a constituição definitiva do crédito.",
    novo: true
  },

  // 8. Art. 150 CTN
  {
    cor: "AMARELO",
    ref: "Art. 150 CTN – Lançamento por homologação",
    artigoNum: "Art. 150",
    diplomaNome: "Código Tributário Nacional (CTN)",
    titulo: "Regime do Lançamento por Homologação e Decadência com Pagamento Parcial",
    textoCompleto: `Art. 150. O lançamento por homologação, que ocorre quanto aos tributos cuja legislação atribua ao sujeito passivo o dever de antecipar o pagamento sem prévio exame da autoridade administrativa, opera-se pelo ato em que a referida autoridade, tomando conhecimento da atividade assim exercida pelo obrigado, expressamente a homologa.
§ 1º O pagamento antecipado pelo obrigado nos termos deste artigo extingue o crédito, sob condição resolutória da ulterior homologação ao lançamento.
§ 2º Não influem sobre a obrigação tributária quaisquer atos anteriores à homologação, praticados pelo sujeito passivo ou por terceiro, visando à extinção total ou parcial do crédito.
§ 3º Os atos a que se refere o parágrafo anterior serão, porém, considerados na apuração do saldo porventura devido e, sendo caso, na imposição de penalidade, ou sua graduação.
§ 4º Se a lei não fixar prazo a homologação, será ele de cinco anos, a contar da ocorrência do fato gerador; expirado esse prazo sem que a Fazenda Pública se tenha pronunciado, considera-se homologado o lançamento e definitivamente extinto o crédito, salvo se comprovada a ocorrência de dolo, fraude ou simulação.
§ 5º (Incluído pela LC 236/2026): A contagem do prazo quinquenal previsto no § 4º tem início na data da ocorrência do fato gerador sempre que houver antecipação parcial de pagamento sem constatação de dolo, fraude ou simulação.
§ 6º (Incluído pela LC 236/2026): Havendo comprovação de dolo, fraude ou simulação, ou inexistindo qualquer pagamento antecipado, a contagem do prazo decadencial rege-se integralmente pelo art. 173, inciso I, deste Código.`,
    descricaoDetalhada: `Disciplina a modalidade de lançamento mais frequente na vida prática e nas provas da OAB:
- O contribuinte calcula, declara e antecipa o pagamento antes de qualquer manifestação do Fisco (ex: ICMS, ISS, IRPJ, PIS, COFINS);
- Homologação expressa: o Fisco confere e emite termo de homologação;
- Homologação tácita ou 'lançamento tácito' (§4º): decurso de 5 anos contados do fato gerador sem que a Fazenda se pronuncie opera a homologação tácita e a extinção definitiva do crédito (Art. 156, VII);
- Regra de ouro da decadência:
  1) Se houve pagamento antecipado (ainda que a menor) sem dolo/fraude: prazo de 5 anos conta-se DA DATA DO FATO GERADOR (Art. 150, §4º);
  2) Se NÃO houve pagamento antecipado algum, ou se houver dolo, fraude ou simulação: a decadência conta-se do primeiro dia do exercício seguinte (Art. 173, I, do CTN c/c Súmula 555 do STJ).`,
    aplicacaoPeca: "Tese principal de decadência em Ação Anulatória, Embargos à Execução Fiscal e Exceção de Pré-Executividade quando o cliente realizou pagamento a menor e o Fisco lavrou auto de infração após 5 anos do fato gerador.",
    pegadinhaFGV: "A FGV sempre tenta induzir o aluno a contar o prazo do Art. 173, I quando o enunciado informa que o contribuinte pagou 70% da guia. Se houve recolhimento parcial de boa-fé, a decadência rege-se pelo Art. 150, §4º (da data do fato gerador), e NÃO pelo 173, I!",
    obs: "A LC 236/2026 pacificou expressamente os §§ 5º e 6º incorporando a jurisprudência sumulada do STJ.",
    novo: true
  },

  // 9. Art. 156 CTN
  {
    cor: "AMARELO",
    ref: "Art. 156 CTN – Extinção do crédito",
    artigoNum: "Art. 156",
    diplomaNome: "Código Tributário Nacional (CTN)",
    titulo: "Modalidades de Extinção do Crédito Tributário",
    textoCompleto: `Art. 156. Extinguem o crédito tributário:
I - o pagamento;
II - a compensação;
III - a transação;
IV - a remissão;
V - a prescrição e a decadência;
VI - a conversão de depósito em renda;
VII - o pagamento antecipado e a homologação do lançamento nos termos do disposto no artigo 150 e seus §§ 1º e 4º;
VIII - a consignação em pagamento, nos termos do disposto no § 2º do artigo 164;
IX - a decisão administrativa irreformável, assim entendida a definitiva na órbita administrativa, que não mais possa ser objeto de ação anulatória;
X - a decisão judicial passada em julgado;
XI - a dação em pagamento em bens imóveis, na forma e condições estabelecidas em lei;
XII - (Incluído pela LC 236/2026): a sentença arbitral transitada em julgado que resolver o litígio em favor do contribuinte;
XIII - (Incluído pela LC 236/2026): o cumprimento integral de termo de acordo firmado em procedimento de mediação ou conciliação tributária.`,
    descricaoDetalhada: `Rol das hipóteses que põem fim ao vínculo obrigacional entre o Fisco e o contribuinte:
- Pagamento (inciso I): forma natural de extinção;
- Compensação (inciso II): encontro de contas entre créditos recíprocos líquidos e certos (exige lei autorizadora e trânsito em julgado para compensação judicial - Art. 170-A);
- Prescrição e Decadência (inciso V): no Direito Tributário, a prescrição e a decadência EXTINGUEM o próprio direito material/crédito, e não apenas o direito de ação!
- Conversão de depósito em renda (inciso VI): quando o contribuinte perde a ação na qual realizou depósito do montante integral;
- Consignação procedente (inciso VIII): na Ação de Consignação julgada procedente, o valor depositado é convertido em renda e o crédito extinto na data do depósito;
- Dação em pagamento de bens imóveis (inciso XI): admitida somente para imóveis e se houver lei autorizativa do respectivo ente;
- Inovações da LC 236/2026: inclusão formal da sentença arbitral e do cumprimento de termo de mediação/conciliação tributária (incisos XII e XIII).`,
    aplicacaoPeca: "Sempre que a tese envolver pagamento comprovado, prescrição, decadência ou compensação, o pedido de procedência da peça deve requerer expressamente a extinção do crédito tributário com fulcro no Art. 156 do CTN.",
    pegadinhaFGV: "Dação em pagamento de bens MÓVEIS (veículos, ações, computadores) extingue o crédito tributário? NÃO! O inciso XI prevê exclusivamente bens IMÓVEIS na forma da lei. Dação em bens móveis não é causa de extinção do Art. 156.",
    obs: "A LC 236/2026 acrescentou os incisos XII e XIII modernizando as soluções consensuais de litígios.",
    novo: true
  },

  // 10. Art. 166 CTN
  {
    cor: "AMARELO",
    ref: "Art. 166 CTN – Prova do encargo nos tributos indiretos para restituição",
    artigoNum: "Art. 166",
    diplomaNome: "Código Tributário Nacional (CTN)",
    titulo: "Legitimidade Ativa na Restituição de Tributos Indiretos e Prova do Encargo Financeiro",
    textoCompleto: `Art. 166. A restituição de tributos que comportem, por sua natureza, transferência do encargo financeiro somente será feita a quem prove haver assumido o referido encargo, ou, no caso de tê-lo transferido a terceiro, estar por este expressamente autorizado a recebê-la.`,
    descricaoDetalhada: `Regula a legitimidade ativa extraordinária e as exigências probatórias nas Ações de Repetição de Indébito que envolvam tributos indiretos (ICMS e IPI, em que há repercussão econômica e o ônus é repassado ao consumidor final):
- Contribuinte de direito: quem recolhe a guia formal ao Fisco (ex: comerciante, industrial);
- Contribuinte de fato: quem suporta o impacto econômico financeiro do tributo no preço final da mercadoria (consumidor final);
- Regra do Art. 166: para que o contribuinte de direito possa pedir a repetição do tributo indevido de volta aos seus cofres, ele deve demonstrar:
  a) Que assumiu o encargo financeiro (não repassou o tributo no preço cobrado do comprador); OU
  b) Que possui autorização expressa do terceiro (contribuinte de fato) que suportou o ônus para receber a quantia em seu nome.
- Súmula 546 do STF: 'Cabe a restituição do tributo pago indevidamente, quando reconhecido por decisão, que o contribuinte de jure não recuperou do contribuinte de facto o quantum respectivo'.`,
    aplicacaoPeca: "Obrigatório abrir um parágrafo expresso no tópico 'Do Cabimento e da Legitimidade' na Petição Inicial de Ação de Repetição de Indébito quando a peça envolver ICMS ou IPI, afirmando o cumprimento dos requisitos do Art. 166 do CTN.",
    pegadinhaFGV: "Se a prova da OAB trouxer caso de repetição de ICMS pago indevidamente por uma fábrica, o espelho da FGV sempre desconta de 0,20 a 0,40 se o candidato não mencionar expressamente o Art. 166 do CTN e a demonstração de não repercussão ou autorização do comprador.",
    obs: "Aplicável exclusivamente a tributos indiretos. Não se aplica a tributos diretos (ex: IRPJ, IPTU, IPVA).",
    novo: false
  },

  // 11. Art. 151 CTN
  {
    cor: "VERDE",
    ref: "Art. 151 CTN – Suspensão da exigibilidade",
    artigoNum: "Art. 151",
    diplomaNome: "Código Tributário Nacional (CTN)",
    titulo: "Hipóteses Taxativas de Suspensão da Exigibilidade do Crédito Tributário",
    textoCompleto: `Art. 151. Suspendem a exigibilidade do crédito tributário:
I - moratória;
II - o depósito do seu montante integral e em dinheiro;
III - as reclamações e os recursos, nos termos das leis reguladoras do processo tributário administrativo;
IV - a concessão de medida liminar em mandado de segurança;
V - a concessão de medida liminar ou de tutela antecipada, em outras espécies de ação judicial;
VI - o parcelamento;
VII - (Incluído pela LC 236/2026): a submissão do crédito tributário a procedimento de arbitragem, durante a pendência do processo arbitral;
VIII - (Incluído pela LC 236/2026): a proposta de transação tributária aceita ou em fase de análise tempestiva conforme a lei de regência;
IX - (Incluído pela LC 236/2026): a submissão a procedimento de mediação ou conciliação prévia em matéria tributária;
X - (Incluído pela LC 236/2026): a apresentação tempestiva de fiança bancária ou de seguro-garantia devidamente aceitos pela Fazenda Pública ou homologados pelo Poder Judiciário.
Parágrafo único. O disposto neste artigo não dispensa o cumprimento das obrigações assessórias dependentes da obrigação principal cujo crédito seja suspenso, ou dela conseqüentes.`,
    descricaoDetalhada: `Dispositivo mais cobrado na 2ª Fase OAB em Direito Tributário!
- Efeitos imediatos da suspensão da exigibilidade:
  1) O Fisco fica impedido de praticar quaisquer atos de cobrança coativa (não pode ajuizar Execução Fiscal, não pode protestar a CDA, não pode incluir o devedor em cadastros restritivos como CADIN/SERASA);
  2) O contribuinte faz jus à expedição de Certidão Positiva com Efeitos de Negativa (CPD-EN, Art. 206 do CTN);
  3) Não impede a autoridade fazendária de efetuar o lançamento preventivo para evitar a decadência (Súmula 622 do STJ);
- Rol taxativo: não cabe interpretação analógica ou criação jurisprudencial de novas causas além das estipuladas em lei complementar nacional;
- Inovações da LC 236/2026: incluiu arbitragem (VII), transação (VIII), mediação (IX) e expressamente a fiança bancária/seguro-garantia homologados (X), positivando antiga controvérsia.`,
    aplicacaoPeca: "Indispensável em TODOS os pedidos de Liminar em Mandado de Segurança (Art. 151, IV) e pedidos de Tutela Provisória de Urgência em Ação Anulatória e Declaratória (Art. 151, V).",
    pegadinhaFGV: "Depósito para suspender a exigibilidade: deve ser INTEGRAL e EM DINHEIRO (Art. 151, II c/c Súmula 112 do STJ). Oferecer bens ou depósito parcial não suspende a exigibilidade. Com a LC 236/2026, seguro e fiança agora têm previsão no inciso X.",
    obs: "Artigo campeão de pontuação nos quesitos de tutela de urgência e liminar na FGV.",
    novo: true
  },

  // 12. Art. 7º Lei 12.016/09
  {
    cor: "VERDE",
    ref: "Art. 7º Lei 12.016/09 – Medida liminar em Mandado de Segurança",
    artigoNum: "Art. 7º",
    diplomaNome: "Lei nº 12.016/2009 (Lei do Mandado de Segurança)",
    titulo: "Concessão de Liminar em Mandado de Segurança e Notificação da Autoridade",
    textoCompleto: `Art. 7º Ao despachar a inicial, o juiz ordenará:
I - que se notifique o coator do conteúdo da petição inicial, enviando-lhe a segunda via apresentada com as cópias dos documentos, a fim de que, no prazo de 10 (dez) dias, preste as informações;
II - que se dê ciência do feito ao órgão de representação judicial da pessoa jurídica interessada, enviando-lhe cópia da inicial sem documentos, para que, querendo, ingresse no feito;
III - que se suspenda o ato que deu motivo ao pedido, quando houver fundamento relevante e do ato impugnado puder resultar a ineficácia da medida, caso seja finalmente deferida, sendo facultado exigir do impetrante caução, fiança ou depósito, com o objetivo de assegurar o ressarcimento à pessoa jurídica.`,
    descricaoDetalhada: `Estrutura procedimental do rito especial do Mandado de Segurança individual ou coletivo:
- Inciso I: notificação da autoridade coatora para prestar informações no prazo legal e improrrogável de 10 dias úteis;
- Inciso II: cientificação do órgão de representação judicial da respectiva pessoa jurídica de direito público (Advocacia-Geral da União, Procuradoria-Geral do Estado ou do Município);
- Inciso III: concessão de MEDIDA LIMINAR. Exige dois pressupostos cumulativos:
  1) Fumus boni iuris (fundamento relevante do direito alegado comprovado por prova documental pré-constituída);
  2) Periculum in mora (risco de ineficácia da medida caso seja concedida somente ao final, ex: risco de protesto da CDA, bloqueio de contas ou impossibilidade de exercer atividade econômica).`,
    aplicacaoPeca: "Base legal obrigatória do tópico e do pedido de Medida Liminar na Petição Inicial de Mandado de Segurança (Art. 7º, III da Lei 12.016/09 c/c Art. 151, IV do CTN), bem como dos pedidos de notificação (inciso I) e intimação da PJ (inciso II).",
    pegadinhaFGV: "Nunca esqueça de pedir a notificação da autoridade coatora (Art. 7º, I) no prazo de 10 dias e a cientificação do órgão de representação judicial do ente público (Art. 7º, II). A omissão de qualquer desses dois pedidos custa de 0,20 a 0,40 no espelho!",
    obs: "A liminar em MS não gera condenação em honorários de sucumbência (Súmula 105 STJ e Art. 25 Lei 12.016/09).",
    novo: false
  },

  // 13. Art. 23 Lei 12.016/09
  {
    cor: "VERDE",
    ref: "Art. 23 Lei 12.016/09 – Prazo decadencial de 120 dias do MS",
    artigoNum: "Art. 23",
    diplomaNome: "Lei nº 12.016/2009 (Lei do Mandado de Segurança)",
    titulo: "Prazo Decadencial de 120 Dias para Impetração de Mandado de Segurança",
    textoCompleto: `Art. 23. O direito de requerer mandado de segurança extinguir-se-á decorridos 120 (cento e vinte) dias contados da ciência, pelo interessado, do ato impugnado.`,
    descricaoDetalhada: `Estabelece o limite temporal peremptório para a utilização do Mandado de Segurança:
- O prazo de 120 dias é de natureza DECADENCIAL (não se interrompe e não se suspende por recursos administrativos que não tenham efeito suspensivo nato);
- Termo inicial: data da ciência inequívoca pelo contribuinte do ato coator (ex: recebimento da notificação do lançamento, publicação da decisão administrativa no Diário Oficial);
- Se o ato for de efeitos contínuos ou trato sucessivo (ex: cobrança mensal de tributo ilegal), o prazo renova-se mês a mês;
- Se decorridos mais de 120 dias da ciência do ato coator, o MS não mais poderá ser utilizado, restando a propositura de Ação Ordinária (Ação Anulatória ou Declaratória).`,
    aplicacaoPeca: "Obrigatório abrir o tópico 'Da Tempestividade' na Petição Inicial do Mandado de Segurança para demonstrar expressamente que a peça está sendo impetrada antes do decurso dos 120 dias do Art. 23 da Lei 12.016/09.",
    pegadinhaFGV: "Se a questão indicar que a notificação foi recebida há 140 dias, NÃO impetre Mandado de Segurança! A peça cabível será Ação Anulatória ou Ação Declaratória c/c Tutela de Urgência pelo esgotamento do prazo do Art. 23.",
    obs: "Contagem em dias: conforme jurisprudência do STJ e CPC, contam-se 120 dias corridos em prazos decadenciais.",
    novo: false
  },

  // 14. Art. 300 CPC
  {
    cor: "VERDE",
    ref: "Art. 300 CPC – Tutela provisória de urgência antecipada",
    artigoNum: "Art. 300",
    diplomaNome: "Código de Processo Civil (Lei nº 13.105/2015)",
    titulo: "Requisitos da Tutela Provisória de Urgência Antecipada ou Cautelar",
    textoCompleto: `Art. 300. A tutela de urgência será concedida quando houver elementos que evidenciem a probabilidade do direito e o perigo de dano ou o risco ao resultado útil do processo.
§ 1º Para a concessão da tutela de urgência, o juiz pode, conforme o caso, exigir caução real ou fidejussória idônea para ressarcir os danos que a outra parte possa vir a sofrer, podendo a caução ser dispensada se a parte economicamente hipossuficiente não puder oferecê-la.
§ 2º A tutela de urgência pode ser concedida liminarmente ou após justificação prévia.
§ 3º A tutela de urgência de natureza antecipada não será concedida quando houver perigo de irreversibilidade dos efeitos da decisão.`,
    descricaoDetalhada: `Requisitos processuais para a antecipação dos efeitos do provimento jurisdicional em ações de rito comum (Ação Anulatória, Ação Declaratória e Repetição de Indébito):
- Probabilidade do direito (fumus boni iuris): plausibilidade jurídica da tese, demonstrada por precedentes dos Tribunais Superiores (STF/STJ) ou violação literal a dispositivos da CF/88 ou do CTN;
- Perigo de dano ou risco ao resultado útil (periculum in mora): demonstração de prejuízo iminente e concreto ao autor (ex: iminência de inscrição em Dívida Ativa, protesto cartorário, impossibilidade de contratar com o poder público ou obter financiamentos por falta de CPD-EN);
- Reversibilidade dos efeitos (§3º): possibilidade fática e jurídica de retorno ao status quo ante caso a ação seja ao final julgada improcedente.`,
    aplicacaoPeca: "Fundamentação obrigatória do capítulo de 'Tutela Provisória de Urgência' em Ações Anulatórias e Declaratórias (Art. 300 do CPC c/c Art. 151, V do CTN), pleiteando a suspensão da exigibilidade do crédito fiscal.",
    pegadinhaFGV: "Em Mandado de Segurança, use o Art. 7º, III da Lei 12.016/09 (e não o Art. 300 do CPC). Em Ação Anulatória e Declaratória, use o Art. 300 do CPC c/c Art. 151, V do CTN. Misturar a fundamentação de urgência do MS com a do rito comum desconta pontuação.",
    obs: "A concessão da tutela do Art. 300 opera a suspensão da exigibilidade via Art. 151, V do CTN.",
    novo: false
  },

  // 15. Art. 16 Lei 6.830/80
  {
    cor: "VERDE",
    ref: "Art. 16 Lei 6.830/80 – Embargos à Execução Fiscal",
    artigoNum: "Art. 16",
    diplomaNome: "Lei nº 6.830/1980 (Lei de Execução Fiscal - LEF)",
    titulo: "Prazo, Termo Inicial e Pressuposto de Admissibilidade dos Embargos à Execução",
    textoCompleto: `Art. 16. O executado oferecerá embargos, no prazo de 30 (trinta) dias, contados:
I - do depósito;
II - da juntada da prova da fiança bancária ou do seguro garantia;
III - da intimação da penhora.
§ 1º Não são admissíveis embargos do executado antes de garantida a execução.
§ 2º No prazo dos embargos, o executado deverá alegar toda matéria útil à defesa, requerer provas e juntar aos autos os documentos e rol de testemunhas, até três, ou, a critério do juiz, até o dobro desse limite.
§ 3º Não será admitida reconvenção, nem compensação, e as exceções, salvo as de suspeição, incompetência e impedimentos, serão argüidas como matéria preliminar e serão processadas e julgadas com os embargos.`,
    descricaoDetalhada: `Regula o ajuizamento da principal ação defensiva do executado em execução fiscal:
- Prazo: 30 (trinta) dias. Atenção: contam-se em dias úteis conforme Art. 219 do CPC (jurisprudência consolidada do STJ);
- Termo inicial do prazo:
  1) Do efetivo depósito em dinheiro (inciso I);
  2) Da juntada aos autos da certidão de fiança ou seguro-garantia (inciso II);
  3) Da data da efetiva intimação da penhora do executado (inciso III) - e NÃO da juntada do mandado!
- Requisito indispensável de admissibilidade (§1º): GARANTIA INTEGRAL DO JUÍZO executivo. Sem garantia prévia (penhora, depósito, fiança ou seguro), os embargos são liminarmente inadmissíveis;
- Princípio da concentração da defesa (§2º): todas as matérias de fato e de direito devem ser alegadas nos embargos com o requerimento de todas as provas.`,
    aplicacaoPeca: "Indispensável na folha inicial dos Embargos à Execução Fiscal para fundamentar o cabimento (diante da garantia do juízo - §1º) e a tempestividade (30 dias do Art. 16, I, II ou III).",
    pegadinhaFGV: "Na Execução Fiscal, o prazo dos embargos para o caso de penhora conta-se da INTIMAÇÃO DA PENHORA (Art. 16, III da LEF), e não da juntada do mandado de penhora aos autos como prevê a regra geral do CPC. Fique atento a essa pegadinha temporal!",
    obs: "A garantia é condição para opor embargos, salvo quando o executado demonstrar cabal hipossuficiência (Tema 1026 STJ).",
    novo: false
  },

  // 16. Art. 38 Lei 6.830/80
  {
    cor: "VERDE",
    ref: "Art. 38 Lei 6.830/80 – Ação Anulatória de Débito Fiscal",
    artigoNum: "Art. 38",
    diplomaNome: "Lei nº 6.830/1980 (LEF)",
    titulo: "Ação Anulatória do Ato Declarativo da Dívida e Desnecessidade de Depósito",
    textoCompleto: `Art. 38. A discussão judicial da Dívida Ativa da Fazenda Pública só é admissível em execução, na forma desta Lei, salvo as ações de mandado de segurança, ação de repetição de indébito ou ação anulatória do ato declarativo da dívida, esta precedida do depósito preparatório do valor do débito, monetariamente corrigido e acrescido dos juros e multas de mora e demais encargos.
Parágrafo único. A propositura, pelo contribuinte, da ação anulatória do ato declarativo da dívida, importará em renúncia ao direito de recorrer na esfera administrativa e desistência do recurso acaso interposto.
(Nota Constitucional: A exigência de depósito prévio preparatório contida na parte final do caput foi declarada INCONSTITUCIONAL pelo STF na Súmula Vinculante 28).`,
    descricaoDetalhada: `Base legal para o ajuizamento de ações cognitivas antes ou concomitantemente à execução fiscal:
- Reconhece expressamente a Ação Anulatória do débito fiscal, o Mandado de Segurança e a Ação de Repetição de Indébito;
- Súmula Vinculante 28 do STF: 'É inconstitucional a exigência de depósito prévio como requisito de admissibilidade de ação judicial na qual se pretenda discutir a exigibilidade de crédito tributário'. Logo, a parte final do caput do Art. 38 é nula e ineficaz;
- Parágrafo único: opção pela via judicial extingue ou renuncia o processo administrativo sobre a mesma matéria.`,
    aplicacaoPeca: "Fundamentação legal preliminar de cabimento da Petição Inicial de Ação Anulatória de Débito Fiscal, invocando o Art. 38 da LEF c/c Art. 19 e Art. 319 do CPC e a Súmula Vinculante 28 do STF.",
    pegadinhaFGV: "Se o enunciado da peça sugerir que o cliente não tem recursos para depositar em dinheiro o valor exigido pelo Fisco, mencione expressamente a Súmula Vinculante 28 para demonstrar que o depósito NÃO é condição de admissibilidade da Ação Anulatória.",
    obs: "A propositura da anulatória não suspende automaticamente a exigibilidade; deve-se pedir tutela do Art. 300 do CPC c/c Art. 151, V CTN.",
    novo: false
  },

  // 17. Art. 1.015 CPC
  {
    cor: "VERDE",
    ref: "Art. 1.015 CPC – Cabimento do Agravo de Instrumento",
    artigoNum: "Art. 1.015",
    diplomaNome: "Código de Processo Civil (CPC/2015)",
    titulo: "Hipóteses de Cabimento do Agravo de Instrumento",
    textoCompleto: `Art. 1.015. Cabe agravo de instrumento contra as decisões interlocutórias que versarem sobre:
I - tutelas provisórias;
II - mérito do processo;
III - rejeição da alegação de convenção de arbitragem;
IV - incidente de desconsideração da personalidade jurídica;
V - rejeição do pedido de gratuidade da justiça ou acolhimento do pedido de sua revogação;
VI - exibição ou posse de documento ou coisa;
VII - exclusão de litisconsorte;
VIII - rejeição do pedido de limitação do litisconsórcio;
IX - admissão ou inadmissão de intervenção de terceiros;
X - concessão, modificação ou revogação do efeito suspensivo aos embargos à execução;
XI - redistribuição do ônus da prova nos termos do art. 373, § 1º;
XII - (vetado);
XIII - outros casos expressos em lei.
Parágrafo único. Também caberá agravo de instrumento contra decisões interlocutórias proferidas na fase de liquidação de sentença ou de cumprimento de sentença, no processo de execução e no processo de inventário.`,
    descricaoDetalhada: `Dispositivo essencial de cabimento recursal:
- Inciso I: decisão que defere ou indefere tutela provisória de urgência em 1º grau (ex: nega suspensão de exigibilidade em Ação Anulatória);
- Inciso XIII c/c Art. 7º, §1º da Lei 12.016/09: decisão do juiz de 1º grau que concede ou nega a liminar em Mandado de Segurança;
- Inciso X: decisão que indefere efeito suspensivo aos Embargos à Execução Fiscal;
- Parágrafo único: decisão que rejeita Exceção de Pré-Executividade (EPE) sem extinguir a execução fiscal cabe Agravo de Instrumento!`,
    aplicacaoPeca: "Indispensável na folha de interposição do Agravo de Instrumento para comprovar o preenchimento do cabimento recursal (Art. 1.015, I para tutelas; Art. 1.015, XIII c/c Art. 7º, §1º da Lei 12.016/09 para liminar em MS; ou Art. 1.015, parágrafo único para EPE rejeitada).",
    pegadinhaFGV: "Se o juiz ACOLHER integralmente a EPE e extinguir a execução fiscal, a peça é Apelação (sentença definitiva)! Se o juiz REJEITAR a EPE e a execução prosseguir, a decisão é interlocutória e a peça correta é o Agravo de Instrumento (Art. 1.015, parágrafo único).",
    obs: "Taxatividade mitigada (Tema 988 do STJ): cabimento quando verificada a urgência decorrente da inutilidade do julgamento na apelação.",
    novo: false
  },

  // 18. Art. 1.009 CPC
  {
    cor: "VERDE",
    ref: "Art. 1.009 CPC – Cabimento da Apelação Cível",
    artigoNum: "Art. 1.009",
    diplomaNome: "Código de Processo Civil (CPC/2015)",
    titulo: "Cabimento da Apelação contra Sentença e Remessa sem Juízo de Admissibilidade",
    textoCompleto: `Art. 1.009. Da sentença cabe apelação.
§ 1º As questões resolvidas na fase de conhecimento, se a decisão a seu respeito não comportar agravo de instrumento, não são cobertas pela preclusão e devem ser suscitadas em preliminar de apelação, eventualmente interposta contra a decisão final, ou nas contrarrazões.
§ 2º Se as questões referidas no § 1º forem suscitadas em contrarrazões, o recorrente será intimado para, em 15 (quinze) dias, manifestar-se a respeito delas.
§ 3º O juízo de primeiro grau não exercerá o juízo de admissibilidade, competindo ao tribunal a quo intimar o apelado para contrarrazões e remeter os autos ao tribunal de justiça ou tribunal regional federal competente.`,
    descricaoDetalhada: `Recurso por excelência contra sentença terminativa (sem mérito - Art. 485 CPC) ou definitiva (com mérito - Art. 487 CPC):
- Prazo: 15 (quinze) dias úteis (Art. 1.003, §5º c/c Art. 219 CPC);
- Estrutura bipartida: Folha de Interposição (dirigida ao juiz de 1º grau que proferiu a sentença) + Folha de Razões Recursais (dirigida ao Tribunal de Justiça estadual ou Tribunal Regional Federal);
- O juiz de 1º grau NÃO faz mais juízo de admissibilidade (§3º). Sua competência na folha de rosto restringe-se a intimar o recorrido para apresentar contrarrazões em 15 dias (Art. 1.010, §1º) e remeter os autos à 2ª Instância.`,
    aplicacaoPeca: "Fundamentação do cabimento da Apelação na Folha de Interposição e na Folha de Razões contra sentença denegatória de Mandado de Segurança, improcedência de Ação Anulatória ou acolhimento/rejeição de Embargos à Execução.",
    pegadinhaFGV: "Nunca peça ao juiz de 1º grau para 'dar provimento' à Apelação! O juiz de 1º grau apenas recebe o recurso, intima a outra parte para contrarrazões e remete ao Tribunal. O pedido de provimento e reforma é feito exclusivamente nas Razões Recursais dirigidas aos Desembargadores do Tribunal.",
    obs: "A Apelação em Mandado de Segurança não possui efeito suspensivo automático (Art. 14, §3º da Lei 12.016/09), devendo ser requerida tutela recursal (Art. 1.012, §4º CPC).",
    novo: false
  },

  // 19. Art. 1.021 CPC
  {
    cor: "VERDE",
    ref: "Art. 1.021 CPC – Agravo Interno contra decisão monocrática de Relator",
    artigoNum: "Art. 1.021",
    diplomaNome: "Código de Processo Civil (CPC/2015)",
    titulo: "Agravo Interno ao Colegiado contra Decisão Unipessoal de Relator",
    textoCompleto: `Art. 1.021. Contra decisão proferida pelo relator caberá agravo interno para o respectivo órgão colegiado, observadas, quanto ao processamento, as regras do regimento interno do tribunal.
§ 1º Na petição de agravo interno, o recorrente impugnará especificadamente os fundamentos da decisão agravada.
§ 2º O agravo será dirigido ao relator, que intimará o agravado para manifestar-se sobre o recurso no prazo de 15 (quinze) dias, ao final do qual, não havendo retratação, o relator levá-lo-á a julgamento pelo órgão colegiado, com inclusão em pauta.
§ 3º É vedado ao relator limitar-se à reprodução dos fundamentos da decisão agravada para julgar improcedente o agravo interno.
§ 4º Quando o agravo interno for declarado manifestamente inadmissível ou improcedente em votação unânime, o órgão colegiado, em decisão fundamentada, condenará o agravante a pagar ao agravado multa fixada entre um e cinco por cento do valor atualizado da causa.`,
    descricaoDetalhada: `Instrumento para assegurar a colegialidade nos Tribunais:
- Cabível contra decisões monocráticas do Desembargador ou Ministro Relator (ex: relator nega efeito suspensivo a agravo de instrumento, indefere liminar originária ou julga monocraticamente apelação pelo Art. 932 CPC);
- Prazo de 15 (quinze) dias úteis;
- Princípio da dialeticidade estrita (§1º): o recorrente deve rebater especificamente cada fundamento adotado pelo relator monocrático;
- Juízo de retratação (§2º): o relator pode retratar-se e acolher o pedido; caso não se retrate, é obrigado a levar o processo à mesa de julgamento da Câmara ou Turma julgadora.`,
    aplicacaoPeca: "Peça cabível quando o enunciado trouxer uma decisão monocrática proferida por Relator de Tribunal (TJ, TRF ou STJ) indeferindo tutela recursal ou negando seguimento a recurso de forma unipessoal.",
    pegadinhaFGV: "Dever de impugnação específica (§1º): não adianta copiar e colar a petição recursal anterior. É indispensável refutar expressamente os argumentos invocados pelo Relator na decisão agravada, sob pena de não conhecimento.",
    obs: "Art. 1.021, §4º prevê multa de 1% a 5% se o agravo for unanimente manifestamente inadmissível.",
    novo: false
  },

  // 20. Art. 164 CTN
  {
    cor: "VERDE",
    ref: "Art. 164 CTN – Hipóteses cabíveis de Consignação em Pagamento",
    artigoNum: "Art. 164",
    diplomaNome: "Código Tributário Nacional (CTN)",
    titulo: "Hipóteses de Cabimento da Ação de Consignação em Pagamento Tributária",
    textoCompleto: `Art. 164. A importância de crédito tributário pode ser consignada judicialmente pelo sujeito passivo, nos casos:
I - de recusa de recebimento, ou subordinação deste ao pagamento de outro tributo ou de penalidade, ou ao cumprimento de obrigação acessória;
II - de subordinação do recebimento ao cumprimento de exigências administrativas sem fundamento legal;
III - de exigência, por mais de uma pessoa jurídica de direito público, de tributo idêntico sobre um mesmo fato gerador.
§ 1º A consignação só pode versar sobre o crédito que o consignante se propõe pagar.
§ 2º Julgada procedente a consignação, o pagamento se reputa efetuado e a importância consignada é convertida em renda; julgada improcedente a consignação no todo ou em parte, cobra-se o crédito acrescido de juros de mora, sem prejuízo das penalidades cabíveis.`,
    descricaoDetalhada: `Ação protetiva do contribuinte devedor de boa-fé que quer pagar, mas encontra obstáculo ilícito:
- Inciso I: recusa imotivada do Fisco em receber o tributo, ou condicionamento ilegal a pagamento de outro tributo ou cumprimento de dever acessório;
- Inciso II: condicionamento a exigências administrativas desprovidas de base em lei formal;
- Inciso III (o mais frequente na OAB): conflito de competência federativa e bitributação (ex: Município A e Município B exigindo simultaneamente ISS sobre o mesmo serviço de construção civil; ou União exigindo ITR e Município exigindo IPTU sobre a mesma gleba de terra).
- O depósito inicial do valor que o autor entende devido deve ser requerido para realização em 5 dias (Art. 542, I do CPC) e suspende a exigibilidade (Art. 151, II CTN).`,
    aplicacaoPeca: "Fundamentação obrigatória da Petição Inicial de Ação de Consignação em Pagamento (Art. 164 do CTN c/c Art. 539 e seguintes do CPC). No caso de dúvida entre entes (inciso III), ambos os entes federativos devem figurar no polo passivo em litisconsórcio passivo.",
    pegadinhaFGV: "Se a União for ré juntamente com um Município em razão de disputa ITR versus IPTU, a competência é da JUSTIÇA FEDERAL (Art. 109, I da CF/88), pois a presença da União atrai a jurisdição federal para a causa.",
    obs: "A procedência da ação extingue definitivamente o crédito tributário com fulcro no Art. 156, VIII do CTN.",
    novo: false
  },

  // 21. Art. 319 CPC
  {
    cor: "ROSA",
    ref: "Art. 319 CPC – Requisitos estruturais da petição inicial",
    artigoNum: "Art. 319",
    diplomaNome: "Código de Processo Civil (CPC/2015)",
    titulo: "Requisitos Formais e Obrigatórios da Petição Inicial",
    textoCompleto: `Art. 319. A petição inicial indicará:
I - o juízo a que é dirigida;
II - os nomes, os prenomes, o estado civil, a existência de união estável, a profissão, o número de inscrição no Cadastro de Pessoas Físicas ou no Cadastro Nacional da Pessoa Jurídica, o endereço eletrônico, o domicílio e a residência do autor e do réu;
III - o fato e os fundamentos jurídicos do pedido;
IV - o pedido com as suas especificações;
V - o valor da causa;
VI - as provas com que o autor pretende demonstrar a verdade dos fatos alegados;
VII - a opção do autor pela realização ou não de audiência de conciliação ou de mediação.`,
    descricaoDetalhada: `Checklist estrutural indispensável de qualquer petição inicial na 2ª Fase OAB:
- I: Endereçamento correto (Vara da Fazenda Pública ou Vara Federal);
- II: Qualificação completa do autor e do réu (Fazenda Pública representada por seu procurador);
- III: Dos Fatos e do Direito (teses doutrinárias e precedentes);
- IV: Dos Pedidos (citação, procedência, repetição ou anulação, honorários);
- V: Valor da Causa (regido pelo Art. 292 do CPC);
- VI: Das Provas (produção de todas as provas em direito admitidas);
- VII: Manifestação expressa sobre a realização ou dispensa de audiência de conciliação/mediação.`,
    aplicacaoPeca: "Estrutura mestra para Ação Anulatória, Declaratória, Repetição de Indébito, Consignação em Pagamento e Embargos à Execução Fiscal.",
    pegadinhaFGV: "Não esquecer o inciso VII: em ações tributárias contra o Poder Público, declarar expressamente o desinteresse na realização da audiência de conciliação por versar sobre direito indisponível da Fazenda sem prévia lei autorizativa, ou requerer sua dispensa.",
    obs: "Em Mandado de Segurança, a prova deve ser documental pré-constituída (não há audiência nem fase probatória).",
    novo: false
  },

  // 22. Art. 292 CPC
  {
    cor: "ROSA",
    ref: "Art. 292 CPC – Regras de fixação do valor da causa",
    artigoNum: "Art. 292",
    diplomaNome: "Código de Processo Civil (CPC/2015)",
    titulo: "Regras de Fixação do Valor da Causa em Ações Tributárias",
    textoCompleto: `Art. 292. O valor da causa constará da petição inicial ou da reconvenção e será:
I - na ação de cobrança de dívida, a soma monetariamente corrigida do principal, dos juros de mora vencidos e de outras penalidades, se houver, até a data de propositura da ação;
II - na ação que tiver por objeto a existência, a validade, o cumprimento, a modificação, a resolução, a resilição ou a rescisão de ato jurídico, o valor do ato ou o de sua parte controvertida;
...
§ 3º O juiz corrigirá, de ofício e por arbitramento, o valor da causa quando verificar que não corresponde ao conteúdo patrimonial em discussão ou ao proveito econômico perseguido pelo autor.`,
    descricaoDetalhada: `Fixação técnica do conteúdo econômico da lide:
- Na Ação Anulatória e Embargos: o valor da causa deve corresponder ao valor do lançamento ou crédito tributário que se pretende anular (Art. 292, II do CPC);
- Na Repetição de Indébito: corresponde ao valor pago indevidamente somado à correção e juros que se pretende restituir (Art. 292, I do CPC);
- Na Ação Declaratória: se visar não pagar tributo futuro continuado, pode ser fixado com base no proveito econômico anual estimado.`,
    aplicacaoPeca: "Requisito obrigatório no fechamento da Petição Inicial: 'Dá-se à causa o valor de R$ ... (Art. 292 do CPC)'.",
    pegadinhaFGV: "Nunca invente números no valor da causa se a prova não trouxer o montante exato! Use sempre 'R$ ...' ou 'o valor do lançamento fiscal' para não sofrer penalização por identificação de peça.",
    obs: "O valor da causa serve de base de cálculo para os honorários de sucumbência (Art. 85, §3º CPC).",
    novo: false
  },

  // 23. Art. 82 CPC
  {
    cor: "ROSA",
    ref: "Art. 82 CPC – Antecipação e recolhimento de despesas processuais",
    artigoNum: "Art. 82",
    diplomaNome: "Código de Processo Civil (CPC/2015)",
    titulo: "Adiantamento de Custas e Reembolso pelo Vencido",
    textoCompleto: `Art. 82. Salvo o disposto em lei diversa, incumbe às partes prover as despesas dos atos que realizarem ou requererem no processo, antecipando-lhes o pagamento, desde o início até a sentença final ou, na execução, até a plena satisfação do direito reconhecido no título.
§ 1º Incumbe ao autor adiantar as despesas relativas a ato cuja realização o juiz determinar de ofício ou a requerimento do Ministério Público, quando sua intervenção ocorrer como fiscal da ordem jurídica.
§ 2º A sentença condenará o vencido a pagar ao vencedor as despesas que antecipou.`,
    descricaoDetalhada: `Trata do recolhimento preparatório de custas processuais e do direito de ressarcimento em face do Fisco vencido na demanda.`,
    aplicacaoPeca: "Pedido de condenação da Fazenda Ré no ressarcimento de todas as custas e despesas processuais adiantadas pelo autor.",
    pegadinhaFGV: "Em Mandado de Segurança a Fazenda deve ressarcir as custas adiantadas pelo impetrante (§2º), mesmo não havendo condenação em honorários.",
    obs: "Junte sempre a guia comprobatória do recolhimento das custas iniciais ou o pedido de gratuidade.",
    novo: false
  },

  // 24. Art. 85 CPC
  {
    cor: "ROSA",
    ref: "Art. 85 CPC – Honorários advocatícios sucumbenciais contra a Fazenda",
    artigoNum: "Art. 85",
    diplomaNome: "Código de Processo Civil (CPC/2015)",
    titulo: "Fixação Escalonada de Honorários Sucumbenciais contra a Fazenda Pública",
    textoCompleto: `Art. 85. A sentença condenará o vencido a pagar honorários ao advogado do vencedor.
...
§ 3º Nas causas em que a Fazenda Pública for parte, a fixação dos honorários observará os critérios estabelecidos nos incisos I a IV do § 2º e os seguintes percentuais:
I - mínimo de dez e máximo de vinte por cento sobre o valor da condenação ou do proveito econômico obtido até 200 (duzentos) salários-mínimos;
II - mínimo de oito e máximo de dez por cento sobre o que ultrapassar 200 até 2.000 salários-mínimos;
III - mínimo de cinco e máximo de oito por cento sobre o que ultrapassar 2.000 até 20.000 salários-mínimos;
IV - mínimo de três e máximo de cinco por cento sobre o que ultrapassar 20.000 até 100.000 salários-mínimos;
V - mínimo de um e máximo de três por cento sobre o que ultrapassar 100.000 salários-mínimos.`,
    descricaoDetalhada: `Fixação legal e escalonada de honorários advocatícios em face da Fazenda Pública:
- Veda o arbitramento por equidade fora das hipóteses do §8º (Tema 1076 do STJ);
- A regra geral e obrigatória é a fixação sobre o valor da condenação ou do proveito econômico nos percentuais do §3º.`,
    aplicacaoPeca: "Pedido obrigatório nos requerimentos finais de todas as petições iniciais (Ação Anulatória, Declaratória, Repetição, Embargos): 'Condenação do réu em custas e honorários advocatícios sucumbenciais nos termos do Art. 85, §3º do CPC'.",
    pegadinhaFGV: "NUNCA peça honorários advocatícios em MANDADO DE SEGURANÇA! Súmula 512 do STF, Súmula 105 do STJ e Art. 25 da Lei 12.016/09 vedam expressamente a condenação em honorários no MS. Pedir honorários em MS acarreta perda de pontos na FGV!",
    obs: "A Súmula 153 do STJ autoriza a fixação de honorários quando a Exceção de Pré-Executividade for acolhida para extinguir a execução.",
    novo: false
  },

  // 25. Art. 77 CPC
  {
    cor: "ROSA",
    ref: "Art. 77 CPC – Indicação do endereço profissional para intimações",
    artigoNum: "Art. 77",
    diplomaNome: "Código de Processo Civil (CPC/2015)",
    titulo: "Deveres das Partes e Declaração de Endereço Profissional do Advogado",
    textoCompleto: `Art. 77. Além de outros previstos neste Código, são deveres das partes, de seus procuradores e de todos aqueles que de qualquer forma participem do processo:
...
V - declinar, no primeiro momento em que lhes couber falar nos autos, o endereço residencial ou profissional no qual receberão as intimações, atualizando essa informação sempre que ocorrer qualquer modificação temporária ou definitiva.`,
    descricaoDetalhada: `Dever formal de indicação do domicílio profissional do patrono constituído nos autos para regularidade dos atos de comunicação processual.`,
    aplicacaoPeca: "No preâmbulo da peça inicial ou de recurso: '...por seu advogado, com endereço profissional para intimações em ... (Art. 77, V, do CPC)...'.",
    pegadinhaFGV: "A FGV pontua nos quesitos de preâmbulo a indicação de que o procurador informa seu endereço para recebimento de futuras intimações.",
    obs: "Elemento indispensável de qualificação inicial segundo o espelho padrão da OAB.",
    novo: false
  },

  // 26. Art. 1.010 CPC
  {
    cor: "ROSA",
    ref: "Art. 1.010 CPC – Requisitos formais da Apelação (Folha de rosto + Razões)",
    artigoNum: "Art. 1.010",
    diplomaNome: "Código de Processo Civil (CPC/2015)",
    titulo: "Requisitos Formais da Apelação e Procedimento em 1º Grau",
    textoCompleto: `Art. 1.010. A apelação, interposta por petição dirigida ao juízo de primeiro grau, conterá:
I - os nomes e a qualificação das partes;
II - a exposição do fato e do direito;
III - as razões do pedido de reforma ou de decretação de nulidade;
IV - o pedido de nova decisão.
§ 1º O apelado será intimado para apresentar contrarrazões no prazo de 15 (quinze) dias.
§ 2º Se o apelado interpuser apelação adesiva, o apelante será intimado para apresentar contrarrazões.
§ 3º Após as formalidades previstas nos §§ 1º e 2º, os autos serão remetidos ao tribunal pelo juiz, independentemente de juízo de admissibilidade.`,
    descricaoDetalhada: `Checklist obrigatório para a redação da Apelação Cível:
- Folha de rosto endereçada ao Juiz de 1º grau que proferiu a sentença;
- Pedido de intimação do recorrido para contrarrazões em 15 dias (§1º);
- Pedido de remessa ao Tribunal competente independentemente de juízo de admissibilidade (§3º);
- Folha de Razões com fatos, direito e pedido de reforma (incisos I a IV).`,
    aplicacaoPeca: "Estrutura padrão da peça de Apelação Cível em matéria tributária.",
    pegadinhaFGV: "Lembre-se de estruturar a peça em duas partes distintas: Folha de Rosto (Interposição) e Folha de Razões ao Tribunal.",
    obs: "O juízo de admissibilidade é exclusivo do Tribunal ad quem.",
    novo: false
  },

  // 27. Art. 1.016 CPC
  {
    cor: "ROSA",
    ref: "Art. 1.016 CPC – Requisitos do Agravo de Instrumento ao Tribunal",
    artigoNum: "Art. 1.016",
    diplomaNome: "Código de Processo Civil (CPC/2015)",
    titulo: "Requisitos Obrigatórios da Petição do Agravo de Instrumento",
    textoCompleto: `Art. 1.016. O agravo de instrumento será dirigido diretamente ao tribunal competente, por meio de petição com os seguintes requisitos:
I - os nomes das partes;
II - a exposição do fato e do direito;
III - as razões do pedido de reforma ou de invalidação da decisão e o próprio pedido;
IV - o nome e o endereço completo dos advogados constantes do processo.`,
    descricaoDetalhada: `Requisitos específicos do Agravo de Instrumento:
- Endereçamento DIRETO ao Presidente do Tribunal de Justiça ou Tribunal Regional Federal (e não ao juiz de 1º grau);
- Exposição sucinta da lide e motivação recursal atacando a decisão de urgência recorrida;
- Obrigação de declinar os nomes e endereços de todos os patronos (inciso IV).`,
    aplicacaoPeca: "Indispensável na confecção do Agravo de Instrumento contra decisões liminares e interlocutórias.",
    pegadinhaFGV: "O Agravo de Instrumento NÃO tem folha de rosto para o juiz da causa; ele é protocolado diretamente na 2ª Instância (Presidência do Tribunal competente).",
    obs: "Se os autos forem eletrônicos, dispensa-se a juntada das peças obrigatórias (Art. 1.017, §5º).",
    novo: false
  },

  // 28. Art. 311 CPC
  {
    cor: "ROSA",
    ref: "Art. 311 CPC – Tutela provisória da evidência fundada em precedentes",
    artigoNum: "Art. 311",
    diplomaNome: "Código de Processo Civil (CPC/2015)",
    titulo: "Concessão da Tutela Provisória da Evidência Dispensando Periculum In Mora",
    textoCompleto: `Art. 311. A tutela da evidência será concedida, independentemente da demonstração de perigo de dano ou de risco ao resultado útil do processo, quando:
I - ficar caracterizado o abuso do direito de defesa ou o manifesto propósito protelatório da parte;
II - as alegações de fato puderem ser comprovadas apenas documentalmente e houver tese firmada em julgamento de casos repetitivos ou em súmula vinculante;
III - se tratar de pedido reipersecutório fundado em prova documental adequada do contrato de depósito, caso em que será decretada a ordem de entrega do objeto custodiado, sob cominação de multa;
IV - a petição inicial for instruída com prova documental suficiente dos fatos constitutivos do direito do autor, a que o réu não oponha prova capaz de gerar dúvida razoável.
Parágrafo único. Nas hipóteses dos incisos II e III, o juiz poderá decidir liminarmente.`,
    descricaoDetalhada: `Modalidade de tutela de urgência mitigada fundada na força de precedentes vinculantes:
- Não exige a demonstração de perigo da demora (periculum in mora);
- Bastam a comprovação documental dos fatos e tese fixada em Súmula Vinculante ou Tema Repetitivo do STF/STJ (inciso II);
- Pode ser concedida em caráter liminar inaudita altera parte (parágrafo único).`,
    aplicacaoPeca: "Excelente tese alternativa ou cumulativa de tutela provisória em Ações Anulatórias e Declaratórias quando o tema estiver respaldado em Súmula Vinculante do STF ou Tema Repetitivo do STJ.",
    pegadinhaFGV: "Se o caso versar sobre matéria idêntica a uma Súmula Vinculante (ex: SV 57 sobre livros digitais), pode-se requerer liminarmente a tutela da evidência do Art. 311, II do CPC, dispensando a prova do perigo da demora.",
    obs: "Sua concessão opera a suspensão da exigibilidade via Art. 151, V do CTN.",
    novo: false
  },

  // 29. Art. 150 CF
  {
    cor: "AZUL",
    ref: "Art. 150 CF – Limitações constitucionais ao poder de tributar",
    artigoNum: "Art. 150",
    diplomaNome: "Constituição Federal de 1988",
    titulo: "Princípios Fundamentais, Anterioridades, Não Confisco e Imunidades Constitucionais",
    textoCompleto: `Art. 150. Sem prejuízo de outras garantias asseguradas ao contribuinte, é vedado à União, aos Estados, ao Distrito Federal e aos Municípios:
I - exigir ou aumentar tributo sem lei que o estabeleça;
II - instituir tratamento desigual entre contribuintes que se encontrem em situação equivalente, proibida qualquer distinção em razão de ocupação profissional ou função por eles exercida, independentemente da denominação jurídica dos rendimentos, títulos ou direitos;
III - cobrar tributos:
  a) em relação a fatos geradores ocorridos antes do início da vigência da lei que os houver instituído ou aumentado (irretroatividade);
  b) no mesmo exercício financeiro em que haja sido publicada a lei que os instituiu ou aumentou (anterioridade anual ou de exercício);
  c) antes de decorridos noventa dias da data em que haja sido publicada a lei que os instituiu ou aumentou, observado o disposto na alínea b (anterioridade nonagesimal ou noventena);
IV - utilizar tributo com efeito de confisco;
V - estabelecer limitações ao tráfego de pessoas ou bens, por meio de tributos interestaduais ou intermunicipais, ressalvada a cobrança de pedágio pela utilização de vias conservadas pelo Poder Público;
VI - instituir impostos sobre:
  a) patrimônio, renda ou serviços, uns dos outros (imunidade recíproca);
  b) templos de qualquer culto;
  c) patrimônio, renda ou serviços dos partidos políticos, inclusive suas fundações, das entidades sindicais dos trabalhadores, das instituições de educação e de assistência social, sem fins lucrativos, atendidos os requisitos da lei;
  d) livros, jornais, periódicos e o papel destinado a sua impressão;
  e) fonogramas e videofonogramas musicais produzidos no Brasil.`,
    descricaoDetalhada: `Estatuto fundamental das garantias do contribuinte brasileiro:
- Legalidade Tributária (inciso I): exigência de lei formal ordinária ou complementar para instituir ou majorar tributos;
- Isonomia (inciso II): proibição de privilégios odiosos ou discriminações arbitrárias;
- Irretroatividade (III, a): a lei tributária nova somente se aplica a fatos geradores futuros (salvo hipóteses benéficas do Art. 106 CTN);
- Anterioridade Cumulativa (III, b e c): exige simultaneamente o exercício financeiro seguinte E a noventena de 90 dias, aplicando-se o que vencer por último. Exceções clássicas: II, IE, IOF (não respeitam nenhuma); IPI (exceção à anual, respeita a noventena); IR (exceção à noventena, respeita a anual);
- Vedação ao confisco (inciso IV): limite à carga fiscal excessiva e teto de multas (STF Tema 816: multa moratória máxima de 20%);
- Imunidades aos IMPOSTOS (inciso VI): não protegem taxas nem contribuições de melhoria.`,
    aplicacaoPeca: "Fundamento constitucional de mais de 70% das teses de mérito da 2ª Fase OAB em Mandado de Segurança, Ação Declaratória e Anulatória.",
    pegadinhaFGV: "Imunidade do Art. 150, VI alcança TAXAS? NÃO! O caput do inciso VI veda expressamente instituir IMPOSTOS sobre o patrimônio, renda ou serviços. As entidades imunes continuam sujeitas ao pagamento de taxas e contribuições de melhoria.",
    obs: "E-books e leitores de livros digitais (Kindle) são imunes com base no art. 150, VI, 'd' (Súmula Vinculante 57).",
    novo: false
  },

  // 30. Art. 145 CF
  {
    cor: "AZUL",
    ref: "Art. 145 CF – Sistema tributário: impostos, taxas e contribuição de melhoria",
    artigoNum: "Art. 145",
    diplomaNome: "Constituição Federal de 1988",
    titulo: "Competência Geral, Espécies Tributárias Vinculadas e Princípio da Capacidade Contributiva",
    textoCompleto: `Art. 145. A União, os Estados, o Distrito Federal e os Municípios poderão instituir os seguintes tributos:
I - impostos;
II - taxas, em razão do exercício do poder de polícia ou pela utilização, efetiva ou potencial, de serviços públicos específicos e divisíveis, prestados ao contribuinte ou postos a sua disposição;
III - contribuição de melhoria, decorrente de obras públicas.
§ 1º Sempre que possível, os impostos terão caráter pessoal e serão graduados segundo a capacidade econômica do contribuinte, facultado à administração tributária, especialmente para conferir efetividade a esses objetivos, identificar, respeitados os direitos individuais e nos termos da lei, o patrimônio, os rendimentos e as atividades econômicas do contribuinte.
§ 2º As taxas não poderão ter base de cálculo própria de impostos.`,
    descricaoDetalhada: `Organização matricial do Sistema Tributário Nacional:
- Impostos (I): tributos não vinculados a uma atuação estatal direta;
- Taxas (II): tributos vinculados a contraprestação estatal específica:
  a) Taxa de Polícia: fiscalização regular de estabelecimentos, trânsito, vigilância sanitária;
  b) Taxa de Serviço Público: serviços UTI SINGULI (específicos e divisíveis). Serviços gerais (uti universi, como segurança pública e iluminação) NÃO podem ser remunerados por taxa (Súmula Vinculante 41);
- Taxa de Lixo domiciliar é constitucional (Súmula Vinculante 19);
- Base de cálculo de taxa (§2º): não pode ser integralmente idêntica à de imposto (Súmula Vinculante 29);
- Contribuição de Melhoria (III): exige DUPLO LIMITE (custo total da obra pública como teto global e a efetiva valorização individual do imóvel como teto individual);
- Princípio da Capacidade Contributiva (§1º): graduação segundo as forças econômicas do indivíduo.`,
    aplicacaoPeca: "Tese mestra para anular cobranças inconstitucionais de taxas municipais e estaduais que não tenham divisibilidade ou poder de polícia efetivo, ou que possuam base de cálculo de IPTU/ICMS.",
    pegadinhaFGV: "Cobrança de taxa de iluminação pública ou taxa de segurança pública: MANIFESTAMENTE INCONSTITUCIONAIS por violação ao Art. 145, II da CF/88 e SV 41 do STF. Para iluminação pública, a CF criou a contribuição específica (COSIP - Art. 149-A).",
    obs: "A taxa de coleta e tratamento de lixo domiciliar é válida (SV 19), mas a taxa de limpeza de logradouros públicos é inconstitucional.",
    novo: false
  },

  // 31. Art. 153 CF
  {
    cor: "AZUL",
    ref: "Art. 153 CF – Competência tributária da União (Impostos federais)",
    artigoNum: "Art. 153",
    diplomaNome: "Constituição Federal de 1988",
    titulo: "Competência Impositiva da União e Imposto Seletivo",
    textoCompleto: `Art. 153. Compete à União instituir impostos sobre:
I - importação de produtos estrangeiros (II);
II - exportação, para o exterior, de produtos nacionais ou nacionalizados (IE);
III - renda e proventos de qualquer natureza (IR);
IV - produtos industrializados (IPI);
V - operações de crédito, câmbio e seguro, ou relativas a títulos ou valores mobiliários (IOF);
VI - propriedade territorial rural (ITR);
VII - grandes fortunas, nos termos de lei complementar (IGF);
VIII - (Incluído pela EC 132/2023): produção, extração, comercialização ou importação de bens e serviços prejudiciais à saúde ou ao meio ambiente, nos termos de lei complementar (Imposto Seletivo).`,
    descricaoDetalhada: `Rol de impostos privativos federais:
- Impostos extrafiscais com alíquotas alteráveis pelo Poder Executivo (Decreto Presidencial): II, IE, IPI, IOF;
- Critérios do Imposto de Renda (§2º, I): generalidade, universalidade e progressividade;
- IPI: seletivo em função da essencialidade e não cumulativo (§3º);
- ITR (§4º): progressivo no tempo e desestimulante de latifúndios improdutivos; pode ter fiscalização e cobrança delegadas aos Municípios optantes (que ficam com 100% da arrecadação);
- Imposto Seletivo (inciso VIII): novo tributo criado pela Reforma Tributária do Consumo (EC 132/23 e LC 214/25) com incidência monofásica para desestimular produtos nocivos (cigarro, bebidas, veículos poluentes), desonerando totalmente exportações.`,
    aplicacaoPeca: "Invocado em teses de incompetência legislativa estadual/municipal que tentem instituir exação sobre operações privativas da União ou para discutir alíquotas abusivas de IPI, IR e ITR.",
    pegadinhaFGV: "O Poder Executivo pode alterar as alíquotas de II, IE, IPI e IOF por Decreto, MAS não pode alterar a base de cálculo nem criar novas hipóteses de incidência sem lei formal!",
    obs: "O Imposto Seletivo (Art. 153, VIII) não integra a base de cálculo do IBS e da CBS.",
    novo: false
  },

  // 32. Art. 155 CF
  {
    cor: "AZUL",
    ref: "Art. 155 CF – Competência dos Estados e do DF (ITCMD, ICMS, IPVA)",
    artigoNum: "Art. 155",
    diplomaNome: "Constituição Federal de 1988",
    titulo: "Competência Tributária Estadual: ITCMD, ICMS e IPVA",
    textoCompleto: `Art. 155. Compete aos Estados e ao Distrito Federal instituir impostos sobre:
I - transmissão causa mortis e doação, de quaisquer bens ou direitos (ITCMD);
II - operações relativas à circulação de mercadorias e sobre prestações de serviços de transporte interestadual e intermunicipal e de comunicação, ainda que as operações e as prestações se iniciem no exterior (ICMS);
III - propriedade de veículos automotores (IPVA).
§ 1º O imposto previsto no inciso I (ITCMD):
I - relativamente a bens imóveis e respectivos direitos, compete ao Estado da situação do bem, ou ao Distrito Federal;
II - relativamente a bens móveis, títulos e créditos, compete ao Estado onde era domiciliado o de cujus, ou tiver domicílio o doador;
IV - terá suas alíquotas máximas fixadas pelo Senado Federal;
VI - (EC 132/23): será progressivo em razão do valor do quinhão, do legado ou da doação.
§ 2º O imposto previsto no inciso II (ICMS):
I - será não-cumulativo, compensando-se o que for devido com o montante cobrado nas anteriores;
§ 6º O imposto previsto no inciso III (IPVA):
I - terá alíquotas mínimas fixadas pelo Senado Federal;
II - poderá ter alíquotas diferenciadas em função do tipo e da utilização;
III - (EC 132/23): incidirá sobre veículos automotores terrestres, aquáticos e aéreos, com exceções legais.`,
    descricaoDetalhada: `Regime dos tributos estaduais de maior repercussão:
- ITCMD: com a EC 132/23 tornou-se obrigatoriamente progressivo; teto fixado pelo Senado Federal (atualmente 8%);
- ICMS: princípio da não cumulatividade ampla; desoneração de exportações (LC 87/96); não incide sobre mero deslocamento entre estabelecimentos do mesmo titular (Súmula 166 STJ e ADC 49 STF);
- IPVA: com a EC 132/23 passou a incidir expressamente sobre embarcações (lanchas, iates) e aeronaves (jatos particulares), superando antiga jurisprudência restritiva do STF.`,
    aplicacaoPeca: "Indispensável na confecção de Mandado de Segurança contra exigência de ICMS na transferência interestadual de mercadorias entre matriz e filial (ADC 49 e Súmula 166 STJ).",
    pegadinhaFGV: "Competência territorial do ITCMD: para IMÓVEIS, o imposto é devido no Estado onde o imóvel está situado! O domicílio do falecido ou o local onde corre o inventário são totalmente irrelevantes para imóveis (Art. 155, §1º, I).",
    obs: "O ICMS será progressivamente substituído pelo IBS na transição da Reforma Tributária (2026-2033).",
    novo: false
  },

  // 33. Art. 156 CF
  {
    cor: "AZUL",
    ref: "Art. 156 CF – Competência dos Municípios (IPTU, ITBI, ISS)",
    artigoNum: "Art. 156",
    diplomaNome: "Constituição Federal de 1988",
    titulo: "Competência Tributária Municipal: IPTU, ITBI e ISS",
    textoCompleto: `Art. 156. Compete aos Municípios instituir impostos sobre:
I - propriedade predial e territorial urbana (IPTU);
II - transmissão "inter vivos", a qualquer título, por ato oneroso, de bens imóveis, por natureza ou acessão física, e de direitos reais sobre imóveis, exceto os de garantia, bem como cessão de direitos a sua aquisição (ITBI);
III - serviços de qualquer natureza, não compreendidos no art. 155, II, definidos em lei complementar (ISS).
§ 1º Sem prejuízo da progressividade no tempo a que se refere o art. 182, § 4º, inciso II, o IPTU poderá:
I - ser progressivo em razão do valor do imóvel; e
II - ter alíquotas diferentes de acordo com a localização e o uso do imóvel.
§ 1º-A (EC 132/23): O imposto previsto no inciso I poderá ter sua base de cálculo atualizada pelo Poder Executivo, conforme critérios estabelecidos em lei municipal.
§ 2º O imposto previsto no inciso II (ITBI):
I - não incide sobre a transmissão de bens ou direitos incorporados ao patrimônio de pessoa jurídica em realização de capital, nem sobre a transmissão de bens ou direitos decorrente de fusão, incorporação, cisão ou extinção de pessoa jurídica, salvo se, nesses casos, a atividade preponderante do adquirente for a compra e venda desses bens ou direitos, locação de bens imóveis ou arrendamento mercantil;
II - compete ao Município da situação do bem.
§ 3º Em relação ao imposto previsto no inciso III (ISS), cabe à lei complementar (LC 116/2003):
I - fixar as suas alíquotas máximas e mínimas (mínima de 2% e máxima de 5%);
II - excluir da sua incidência exportações de serviços para o exterior.`,
    descricaoDetalhada: `Tributos de competência impositiva municipal:
- IPTU: incidência sobre propriedade, posse ou domínio útil em zona urbana (Art. 32 CTN). Majoração de alíquota ou valor venal depende de lei em sentido formal (Súmula 160 STJ e Tema 211 STF);
- ITBI: fato gerador ocorre exclusivamente com o REGISTRO da transferência no Cartório de Registro de Imóveis (Tema 1.124 STF). Imunidade na integralização de capital (§2º, I), ressalvada a atividade imobiliária preponderante (Tema 796 STF);
- ISS: regido pela LC 116/2003 com rol taxativo de serviços, admitindo-se apenas interpretação extensiva analógica intra-item.`,
    aplicacaoPeca: "Utilizado com muita força em Ações Anulatórias e Mandados de Segurança contra cobrança de ITBI antes do registro da escritura ou contra majoração de IPTU realizada exclusivamente por decreto do Prefeito sem lei municipal.",
    pegadinhaFGV: "O Município pode cobrar ITBI na lavratura da escritura pública em cartório de notas ou no contrato de promessa de compra e venda? NÃO! O STF pacificou no Tema 1.124 que o ITBI só pode ser exigido com a efetiva transferência da propriedade no Cartório de Registro de Imóveis (RGI).",
    obs: "A EC 132/2023 inseriu o §1º-A no Art. 156 permitindo atualização da base do IPTU por decreto municipal.",
    novo: false
  },

  // 34. Art. 195 CF
  {
    cor: "AZUL",
    ref: "Art. 195 CF – Financiamento da seguridade social e imunidade beneficente (§7º)",
    artigoNum: "Art. 195",
    diplomaNome: "Constituição Federal de 1988",
    titulo: "Seguridade Social, Noventena e Imunidade Beneficente",
    textoCompleto: `Art. 195. A seguridade social será financiada por toda a sociedade, de forma direta e indireta, nos termos da lei, mediante recursos provenientes dos orçamentos da União, dos Estados, do Distrito Federal e dos Municípios, e das seguintes contribuições sociais:
I - do empregador, da empresa e da entidade a ela equiparada na forma da lei, incidentes sobre:
  a) a folha de salários e demais rendimentos do trabalho pagos ou creditados, a qualquer título, à pessoa física que lhe preste serviço, mesmo sem vínculo empregatício;
  b) a receita ou o faturamento;
  c) o lucro;
II - do trabalhador e dos demais segurados da previdência social;
III - sobre a receita de concursos de prognósticos;
IV - do importador de bens ou serviços do exterior, ou de quem a lei a ele equiparar;
V - (EC 132/2023): sobre bens e serviços, nos termos de lei complementar (CBS - Contribuição sobre Bens e Serviços).
§ 6º As contribuições sociais de que trata este artigo só poderão ser exigidas após decorridos noventa dias da data da publicação da lei que as houver instituído ou modificado, não se lhes aplicando o disposto no art. 150, III, "b" (anterioridade nonagesimal exclusiva).
§ 7º São isentas [imunes] de contribuição para a seguridade social as entidades beneficentes de assistência social que atendam às exigências estabelecidas em lei complementar.`,
    descricaoDetalhada: `Pilar do custeio da Seguridade Social (Saúde, Previdência e Assistência Social):
- As contribuições sociais submetem-se EXCLUSIVAMENTE à anterioridade nonagesimal (§6º). Não respeitam a anterioridade anual (podem ser cobradas no mesmo exercício financeiro após transcorridos 90 dias da publicação da lei);
- Imunidade Beneficente (§7º): embora o texto constitucional use impropriamente o termo 'isentas', trata-se de autêntica IMUNIDADE CONSTITUCIONAL de contribuições para a seguridade social em favor de entidades beneficentes de assistência social e de saúde/educação (CEBAS - Lei Complementar nº 187/2021).`,
    aplicacaoPeca: "Fundamentação de Mandado de Segurança repressivo para declarar o direito à imunidade do Art. 195, §7º de hospitais filantrópicos e entidades beneficentes ou para afastar contribuição social cobrada antes de 90 dias (§6º).",
    pegadinhaFGV: "A imunidade do Art. 195, §7º abrange impostos? NÃO! O Art. 195, §7º abrange exclusivamente CONTRIBUIÇÕES SOCIAIS DE SEGURIDADE. Para imunidade de impostos, a entidade deve invocar o Art. 150, VI, 'c' da CF/88.",
    obs: "A CBS (Art. 195, V) é a contribuição federal que substitui PIS e COFINS no modelo da Reforma Tributária.",
    novo: false
  },

  // 35. Art. 170-A CTN
  {
    cor: "CLIPES",
    ref: "Art. 170-A CTN – Vedação de compensação antes do trânsito em julgado",
    artigoNum: "Art. 170-A",
    diplomaNome: "Código Tributário Nacional (CTN)",
    titulo: "Vedação à Compensação Tributária Liminar ou Prévia ao Trânsito em Julgado",
    textoCompleto: `Art. 170-A. É vedada a compensação mediante o aproveitamento de tributo, objeto de contestação judicial pelo sujeito passivo, antes do trânsito em julgado da respectiva decisão judicial.`,
    descricaoDetalhada: `Regra peremptória de segurança financeira nas discussões tributárias judiciais:
- Impede que o contribuinte realize compensação de débitos tributários correntes com créditos que estejam sob litígio judicial antes do encerramento definitivo do processo;
- Súmula 212 do STJ: 'A compensação de créditos tributários não pode ser deferida em ação cautelar ou por medida liminar cautelar ou antecipatória';
- Apenas a partir do trânsito em julgado da sentença que reconheceu o direito creditório pode o contribuinte promover o procedimento compensatório formal perante a Receita Federal ou Secretarias de Fazenda (ou optar por precatório nos termos da Súmula 461 do STJ).`,
    aplicacaoPeca: "Item fundamental em Mandado de Segurança que visa a compensação: o pedido deve requerer a 'declaração do direito à compensação a ser realizada após o trânsito em julgado (Art. 170-A do CTN e Súmula 213 do STJ)'.",
    pegadinhaFGV: "Se você pedir compensação imediata ou liminar de tributo em peça da OAB, perderá pontos! O pedido correto é DECLARAR o direito à compensação futura, a ser efetuada administrativamente após o trânsito em julgado da decisão, em estrita obediência ao Art. 170-A do CTN.",
    obs: "Súmula 213 do STJ: 'O mandado de segurança constitui ação adequada para a declaração do direito à compensação tributária'.",
    novo: false
  },

  // 36. Art. 174 CTN
  {
    cor: "CLIPES",
    ref: "Art. 174 CTN – Prescrição da ação de cobrança do crédito tributário",
    artigoNum: "Art. 174",
    diplomaNome: "Código Tributário Nacional (CTN)",
    titulo: "Prescrição Quinquenal da Cobrança Judicial e Marcos Interruptivos",
    textoCompleto: `Art. 174. A ação para a cobrança do crédito tributário prescreve em 5 (cinco) anos, contados da data da sua constituição definitiva.
Parágrafo único. A prescrição se interrompe:
I - pelo despacho do juiz que ordenar a citação em execução fiscal;
II - pelo protesto judicial;
III - por qualquer ato judicial que constitua em mora o devedor;
IV - por qualquer ato inequívoco ainda que extrajudicial, que importe em reconhecimento do débito pelo devedor.
§ 1º (Incluído pela LC 236/2026): O protesto da Certidão de Dívida Ativa efetuado na forma da lei interrompe a prescrição pelo prazo improrrogável de um ano, voltando a correr por inteiro após decorrido esse período se não houver ajuizamento da execução.
§ 2º (Incluído pela LC 236/2026): A submissão do litígio a procedimento de mediação ou conciliação, bem como o protocolo tempestivo de pedido de transação tributária, interrompe o prazo prescricional, que reinicia sua contagem caso as negociações sejam formalmente frustradas.`,
    descricaoDetalhada: `Regula a perda da pretensão de cobrança coativa do Fisco:
- Prazo: 5 (cinco) anos a contar da CONSTITUIÇÃO DEFINITIVA do crédito tributário (notificação do lançamento sem impugnação ou intimação da decisão final que julgou o recurso administrativo);
- Extingue o próprio crédito tributário (Art. 156, V do CTN);
- Marco interruptivo judicial (inciso I): o DESPACHO DO JUIZ QUE ORDENA A CITAÇÃO na Execução Fiscal interrompe a prescrição, retroagindo à data da propositura da ação (Art. 174, p. único, I c/c Art. 240, §1º do CPC e Súmula 106 do STJ);
- Marco extrajudicial (inciso IV): parcelamento pedido pelo contribuinte constitui confissão e interrompe a prescrição (Súmula 653 do STJ);
- Inovações da LC 236/2026: regulamentou nos §§ 1º e 2º a interrupção pelo protesto de CDA e pelas tratativas de mediação/transação.`,
    aplicacaoPeca: "Principal tese de mérito e ordem pública da Exceção de Pré-Executividade (EPE) e dos Embargos à Execução Fiscal para extinguir a execução quando decorridos mais de 5 anos entre a constituição definitiva e o despacho citatório.",
    pegadinhaFGV: "Atenção: o marco interruptivo é o DESPACHO QUE ORDENA A CITAÇÃO (redação dada pela LC 118/2005), e NÃO a citação pessoal efetiva do réu! Cuidado para não errar o marco temporal no enunciado.",
    obs: "Súmula Vinculante 8 do STF: prazos de decadência e prescrição tributária são matéria reservada a lei complementar nacional.",
    novo: true
  },

  // 37. Art. 206 CTN
  {
    cor: "CLIPES",
    ref: "Art. 206 CTN – Expedição de CPD-EN com exigibilidade suspensa ou garantia",
    artigoNum: "Art. 206",
    diplomaNome: "Código Tributário Nacional (CTN)",
    titulo: "Direito à Certidão Positiva com Efeitos de Negativa (CPD-EN)",
    textoCompleto: `Art. 206. Tem os mesmos efeitos previstos no artigo anterior a certidão de que conste a existência de créditos não vencidos, em curso de cobrança executiva em que tenha sido efetivada a penhora, ou cuja exigibilidade esteja suspensa.`,
    descricaoDetalhada: `Garantia do direito de regularidade fiscal do contribuinte perante o Poder Público:
- Certidão Negativa de Débitos (CND, Art. 205): emitida quando não consta débito algum;
- Certidão Positiva com Efeitos de Negativa (CPD-EN, Art. 206): o contribuinte possui dívida registrada, MAS essa dívida:
  1) Não está vencida (crédito vincendo); OU
  2) Está em execução fiscal com PENHORA ou garantia suficiente formalizada nos autos; OU
  3) Está com a EXIGIBILIDADE SUSPENSA por qualquer das causas do Art. 151 do CTN (liminar, tutela, depósito, recurso administrativo, parcelamento);
- A CPD-EN tem exatamente o mesmo valor legal e eficácia da CND para participar de licitações, obter empréstimos e manter contratos públicos.`,
    aplicacaoPeca: "Pedido acessório obrigatório nos pedidos de liminar ou tutela de urgência em Mandado de Segurança e Ação Anulatória: 'Requer-se a concessão da tutela para suspender a exigibilidade do crédito (Art. 151 CTN) e determinar a imediata expedição de CPD-EN nos termos do Art. 206 do CTN'.",
    pegadinhaFGV: "Se o contribuinte ajuizou ação com pedido de liminar e obteve a decisão favorável, o Fisco pode negar certidão sob argumento de que o processo ainda não transitou em julgado? NÃO! A suspensão da exigibilidade obriga a expedição imediata da CPD-EN com fulcro no Art. 206.",
    obs: "Súmula 656 do STJ: é válida a apresentação de fiança ou seguro preparatório para obter CPD-EN.",
    novo: false
  },

  // 38. Art. 40 Lei 6.830/80
  {
    cor: "CLIPES",
    ref: "Art. 40 Lei 6.830/80 – Prescrição intercorrente na execução fiscal",
    artigoNum: "Art. 40",
    diplomaNome: "Lei nº 6.830/1980 (LEF)",
    titulo: "Rito e Sistemática da Prescrição Intercorrente na Execução Fiscal",
    textoCompleto: `Art. 40 - Não tendo sido localizado o devedor ou não tendo sido encontrados bens penhoráveis, o juiz suspenderá o curso da execução, não correndo o prazo de prescrição.
§ 1º - Suspenso o curso da execução, será aberta vista dos autos ao representante judicial da Fazenda Pública.
§ 2º - Decorrido o prazo máximo de 1 (um) ano, sem que seja localizado o devedor ou encontrados bens penhoráveis, o juiz ordenará o arquivamento dos autos.
§ 3º - Encontrados que sejam, a qualquer tempo, o devedor ou os bens, serão desarquivados os autos para prosseguimento da execução.
§ 4º - Se da decisão que ordenar o arquivamento tiver decorrido o prazo prescricional, o juiz, depois de ouvida a Fazenda Pública, poderá, de ofício, reconhecer a prescrição intercorrente e decretá-la de imediato.
§ 5º - A manifestação prévia da Fazenda Pública prevista no § 4º deste artigo será dispensada no caso de cobranças judiciais cujo valor seja igual ou inferior ao que foi estabelecido por ato do Ministro de Estado da Fazenda.`,
    descricaoDetalhada: `Procedimento uniforme fixado pelo STJ no Tema 566 e Súmula 314:
- Início automático: a constatação da não localização de bens penhoráveis ou do executado inicia automaticamente o prazo de 1 (um) ano de suspensão da execução;
- Fim da suspensão: findo o prazo de 1 ano, inicia-se automaticamente o prazo de 5 (cinco) anos da prescrição intercorrente, independentemente de despacho expresso do juiz ou provocação do Fisco;
- Total de 6 anos: se após 1 ano de suspensão + 5 anos de arquivamento provisório a Fazenda não localizar bens efetivos, opera-se a prescrição intercorrente;
- Mera petição sem indicação de bens concretos penhoráveis não interrompe a fluência da prescrição intercorrente.`,
    aplicacaoPeca: "Tese forte em Exceção de Pré-Executividade (EPE) para extinguir a Execução Fiscal paralisada em cartório por mais de 5 anos após o arquivamento provisório.",
    pegadinhaFGV: "A Fazenda pede diversas vezes suspensão do processo ou desarquivamento apenas para requerer penhora bacenjud infrutífera. Isso interrompe a prescrição intercorrente? NÃO! O STJ fixou que apenas a constrição patrimonial EFETIVA interrompe a prescrição intercorrente.",
    obs: "Súmula 314 do STJ: consolidou o procedimento de 1 ano de suspensão seguido de 5 anos de prescrição.",
    novo: false
  },

  // 39. Art. 173 CTN
  {
    cor: "CLIPES",
    ref: "Art. 173 CTN – Decadência do direito de constituir o crédito tributário",
    artigoNum: "Art. 173",
    diplomaNome: "Código Tributário Nacional (CTN)",
    titulo: "Regra Geral da Decadência Quinquenal do Lançamento de Ofício",
    textoCompleto: `Art. 173. O direito de a Fazenda Pública constituir o crédito tributário extingue-se após 5 (cinco) anos, contados:
I - do primeiro dia do exercício seguinte àquele em que o lançamento poderia ter sido efetuado;
II - da data em que se tornar definitiva a decisão que houver anulado, por vício formal, o lançamento anteriormente efetuado.
Parágrafo único. O direito a que se refere este artigo extingue-se definitivamente com o decurso do prazo nele previsto, contado da data em que tenha sido iniciada a constituição do crédito tributário pela notificação, ao sujeito passivo, de qualquer medida preparatória indispensável ao lançamento.`,
    descricaoDetalhada: `Regra mestra da decadência tributária no lançamento direto (de ofício) e nas infrações dolosas:
- Prazo: 5 (cinco) anos;
- Termo inicial (inciso I): primeiro dia do exercício financeiro seguinte (1º de janeiro do ano seguinte) àquele em que o lançamento poderia ter sido realizado;
- Aplica-se quando:
  1) O tributo for lançado diretamente de ofício (ex: IPTU, IPVA, taxas);
  2) No tributo por homologação, quando o contribuinte NÃO recolheu nada antecipadamente (Súmula 555 STJ);
  3) No tributo por homologação quando comprovada a ocorrência de dolo, fraude ou simulação (Art. 150, §4º, in fine c/c Art. 173, I);
- Inciso II: prazo de 5 anos para renovar lançamento anulado por vício FORMAL (se a anulação foi por vício material, não cabe novo lançamento).`,
    aplicacaoPeca: "Tese clássica de Ação Anulatória de Débito Fiscal, Mandado de Segurança e Embargos para demonstrar que o Auto de Infração foi notificado após o decurso dos 5 anos da decadência.",
    pegadinhaFGV: "Cuidado com o cálculo: fato gerador ocorrido em 20/05/2020 sem declaração nem pagamento. O prazo de 5 anos NÃO começa em maio de 2020! Começa em 01/01/2021 (primeiro dia do exercício seguinte) e finda em 31/12/2025. Se o Fisco notificar o auto em janeiro de 2026, houve decadência do Art. 173, I.",
    obs: "Súmula 555 do STJ: quando não houver declaração prévia do débito, o prazo conta-se do Art. 173, I.",
    novo: false
  },

  // 40. Art. 168 CTN
  {
    cor: "CLIPES",
    ref: "Art. 168 CTN – Prazo quinquenal para repetição de indébito tributário",
    artigoNum: "Art. 168",
    diplomaNome: "Código Tributário Nacional (CTN)",
    titulo: "Prazo Decadencial Quinquenal para Pleitear a Restituição do Indébito Tributário",
    textoCompleto: `Art. 168. O direito de pleitear a restituição extingue-se com o decurso do prazo de 5 (cinco) anos, contados:
I - nas hipótese dos incisos I e II do artigo 165, da data da extinção do crédito tributário (do efetivo pagamento indevido);
II - na hipótese do inciso III do artigo 165, da data em que se tornar definitiva a decisão administrativa ou passar em julgado a decisão judicial que tenha reformado, anulado, revogado ou rescindido a decisão condenatória.
§ 2º (Incluído pela LC 236/2026): A habilitação administrativa do crédito decorrente de decisão judicial transitada em julgado deve ser requerida no prazo de 5 (cinco) anos contados do trânsito em julgado.
§ 3º (Incluído pela LC 236/2026): O deferimento da habilitação administrativa suspende o prazo prescricional para a efetivação das compensações ou expedição de precatório.`,
    descricaoDetalhada: `Regula o prazo para que o contribuinte recupere valores tributários recolhidos indevidamente ou a maior aos cofres públicos:
- Prazo: 5 (cinco) anos contados da data da extinção pelo efetivo pagamento indevido (inciso I);
- Ajuizada a Ação de Repetição de Indébito no prazo de 5 anos do pagamento, o contribuinte recupera todas as parcelas recolhidas nos 5 anos anteriores à propositura da ação judicial;
- LC 118/2005 e Tema 142 do STJ: superada a antiga tese dos 'cinco mais cinco'; o prazo conta-se incondicionalmente da data do pagamento indevido;
- Inovações da LC 236/2026: disciplinou o prazo quinquenal para habilitação administrativa e efeitos de suspensão da prescrição (§§ 2º e 3º).`,
    aplicacaoPeca: "Obrigatório abrir o tópico 'Da Tempestividade Quinquenal' na Petição Inicial de Ação de Repetição de Indébito Tributário (Art. 168, I do CTN).",
    pegadinhaFGV: "Se a lei que instituiu o tributo foi declarada inconstitucional pelo STF em controle concentrado no ano passado, o prazo de 5 anos conta-se da decisão do STF? NÃO! Conta-se da data em que o contribuinte realizou o pagamento indevido (Tema 142 STJ).",
    obs: "A atualização da quantia a repetir faz-se exclusivamente pela taxa SELIC (EC 113/2021).",
    novo: true
  },

  // 41. Art. 38 CTN (LC 227/2026)
  {
    cor: "AMARELO",
    ref: "Art. 38 CTN – Base de cálculo do ITBI pelo valor de mercado à vista",
    artigoNum: "Art. 38",
    diplomaNome: "Código Tributário Nacional (com alterações da LC 227/2026)",
    titulo: "Base de Cálculo do ITBI: Valor Real de Mercado e Proibição de Pautas Arbitrárias",
    textoCompleto: `Art. 38. A base de cálculo do imposto é o valor de mercado dos bens ou direitos transmitidos, assim entendido o valor que seria alcançado em condições normais de mercado em operação à vista.
§ 1º (Incluído pela LC 227/2026): Presume-se como valor de mercado aquele declarado de boa-fé pelo sujeito passivo no instrumento de transmissão, ressalvada a faculdade de a administração tributária instaurar procedimento individualizado de arbitramento fundado em critérios técnicos e objetivos.
§ 2º (Incluído pela LC 227/2026): É vedada a fixação prévia e unilateral de valores mínimos ou pautas fiscais abstratas por ato do Poder Executivo municipal sem a concessão de prévio contraditório e ampla defesa ao contribuinte.`,
    descricaoDetalhada: `Positivação legislativa uniforme pela Lei Complementar nº 227/2026 do entendimento consolidado pelo STJ no Tema 1.113:
- A base de cálculo do ITBI é o valor de mercado da transação real declarada pelo contribuinte;
- A base do ITBI não se vincula à base de cálculo pré-fixada do IPTU;
- O Município não pode estipular valor mínimo prévio arbitrário (valor de referência) por decreto ou tabela unilateral; se desconfiar do valor declarado, o Fisco deve instaurar o procedimento administrativo de arbitramento do Art. 148 do CTN, assegurando contraditório ao cidadão.`,
    aplicacaoPeca: "Tese forte em Mandado de Segurança ou Ação Anulatória contra Municípios que arbitram base de cálculo do ITBI superior ao valor da escritura com base em tabelas prévias unilaterais.",
    pegadinhaFGV: "A prova traz o Município cobrando ITBI com base em uma 'pauta de valores de referência' muito maior que o valor real de compra e venda. Invoque o Art. 38 do CTN c/c LC 227/2026 e o Tema 1.113 do STJ.",
    obs: "Tema super quente na 2ª Fase em virtude da vigência da LC 227/2026.",
    novo: true
  },

  // 42. Art. 113-A CTN (LC 236/2026)
  {
    cor: "AMARELO",
    ref: "Art. 113-A CTN – Teto e limites de razoabilidade das multas punitivas",
    artigoNum: "Art. 113-A",
    diplomaNome: "Código Tributário Nacional (incluído pela LC 236/2026)",
    titulo: "Teto Legal e Limites Constitucionais das Multas Punitivas Fiscais",
    textoCompleto: `Art. 113-A. As penalidades pecuniárias de natureza tributária observarão os princípios da razoabilidade, da proporcionalidade e da vedação ao confisco, sujeitando-se aos seguintes limites máximos:
I - a multa punitiva de ofício pelo descumprimento de obrigação principal não excederá a 75% (setenta e cinco por cento) do valor do tributo devido;
II - no caso de comprovada ocorrência de dolo, fraude ou simulação, a penalidade prevista no inciso I poderá ser exasperada até o limite de 100% (cem por cento);
III - em caso de reincidência qualificada pelo cometimento de nova conduta fraudulenta no período de 5 (cinco) anos, o percentual máximo será de 150% (cento e cinquenta por cento);
IV - a multa por descumprimento de obrigação meramente acessória não poderá superar o valor do tributo porventura relacionado ou limites legais razoáveis fixados em lei.`,
    descricaoDetalhada: `Grande avanço normativo da Lei Complementar nº 236/2026 (vigor desde setembro/2026), positivando a jurisprudência do STF sobre vedação ao confisco em multas:
- Limita a 75% o teto geral da multa punitiva de ofício;
- Limita a 100% se houver dolo, fraude ou simulação;
- Limite excepcional de 150% apenas em reincidência dolosa comprovada;
- Qualquer multa cobrada pelo Fisco acima desses patamares é manifestamente inconstitucional por afronta ao Art. 150, IV da CF/88 e ilegal por afronta direta ao Art. 113-A do CTN.`,
    aplicacaoPeca: "Tese subsidiária ou principal de excesso de execução nos Embargos à Execução Fiscal ou em Ação Anulatória para reduzir autos de infração que impuseram multas de 150% ou 200%.",
    pegadinhaFGV: "Se a FGV cobrar auto de infração com multa punitiva de 150% sem prova de reincidência ou com multa de 200%, peça a redução para o patamar legal do Art. 113-A do CTN c/c Art. 150, IV da CF/88.",
    obs: "Inovação trazida pela LC 236/2026 em vigor imediato.",
    novo: true
  },

  // 43. Art. 138 CTN (LC 236/2026)
  {
    cor: "AMARELO",
    ref: "Art. 138 CTN – Denúncia espontânea com exclusão expressa da multa moratória",
    artigoNum: "Art. 138",
    diplomaNome: "Código Tributário Nacional (com alterações da LC 236/2026)",
    titulo: "Alcance Pleno da Denúncia Espontânea e Exclusão Expressa da Multa Moratória",
    textoCompleto: `Art. 138. A responsabilidade é excluída pela denúncia espontânea da infração, acompanhada, se for o caso, do pagamento do tributo devido e dos juros de mora, ou do depósito da importância arbitrada pela autoridade administrativa, quando o montante do tributo dependa de apuração.
§ 1º A denúncia espontânea apresentada antes do início de qualquer medida de fiscalização exclui expressamente a incidência de multas punitivas e de qualquer multa de mora.
§ 2º Não se considera espontânea a denúncia apresentada após o início de qualquer procedimento administrativo ou medida de fiscalização, relacionados com a infração.`,
    descricaoDetalhada: `A LC 236/2026 inseriu o §1º no Art. 138 pondo fim em definitivo à discussão sobre a incidência de multa de mora:
- Se o contribuinte confessa e recolhe integralmente o tributo com juros antes da lavratura do termo de início de fiscalização pelo Fisco, NÃO cabe cobrança de multa de mora nem de multa punitiva;
- Alinhamento total com a Súmula 665 do STJ: 'O pagamento integral do tributo com juros antes de qualquer procedimento fiscal afasta a multa de mora'.`,
    aplicacaoPeca: "Tese forte em Mandado de Segurança ou Repetição de Indébito para afastar multa de mora cobrada indevidamente após confissão e pagamento espontâneo da dívida.",
    pegadinhaFGV: "Lembre-se: o benefício da denúncia espontânea depende do pagamento INTEGRAL e em dinheiro à vista. O parcelamento NÃO confere denúncia espontânea para afastar a multa de mora (Súmula 555 do STJ).",
    obs: "A redação da LC 236/2026 protege o contribuinte de boa-fé que regulariza débitos espontaneamente.",
    novo: true
  },

  // 44. Art. 194-A CTN (LC 236/2026)
  {
    cor: "VERDE",
    ref: "Art. 194-A CTN – Obrigatoriedade de o Fisco respeitar teses do STF e STJ",
    artigoNum: "Art. 194-A",
    diplomaNome: "Código Tributário Nacional (incluído pela LC 236/2026)",
    titulo: "Vinculação Obrigatória da Administração Tributária aos Precedentes do STF e STJ",
    textoCompleto: `Art. 194-A. É vedada à autoridade administrativa tributária a lavratura de auto de infração, a constituição de crédito tributário ou a inscrição de débito em dívida ativa fundada em interpretação manifestamente contrária a:
I - súmula vinculante editada pelo Supremo Tribunal Federal;
II - acórdão proferido pelo Supremo Tribunal Federal em sede de controle concentrado de constitucionalidade ou em regime de repercussão geral;
III - acórdão proferido pelo Superior Tribunal de Justiça no rito dos recursos especiais repetitivos.
Parágrafo único. O crédito tributário constituído em violação ao disposto no caput deste artigo é nulo de pleno direito, devendo ser cancelado de ofício pela autoridade julgadora ou revisto pela procuradoria fiscal competente.`,
    descricaoDetalhada: `Marco histórico da segurança jurídica e da desjudicialização introduzido pela LC 236/2026:
- Proíbe a Fazenda Pública (federal, estadual ou municipal) de continuar autuando ou ajuizando execuções fiscais contrárias às decisões firmadas pelo STF e STJ em sede de precedentes qualificados;
- Impõe nulidade absoluta e de pleno direito (parágrafo único) a qualquer lançamento fiscal efetuado contra Súmula Vinculante ou Tema Repetitivo.`,
    aplicacaoPeca: "Tese preliminar de nulidade absoluta do Auto de Infração em Mandado de Segurança, Ação Anulatória e Exceção de Pré-Executividade quando o lançamento descumprir tese pacificada do STF ou STJ.",
    pegadinhaFGV: "Ao elaborar a peça, invoque o Art. 194-A do CTN juntamente com o precedente vinculante específico para fundamentar a nulidade do lançamento de pleno direito.",
    obs: "Inovação trazida pela LC 236/2026 em vigor desde setembro/2026.",
    novo: true
  },

  // 45. Arts. 208-A a 208-J CTN (LC 236/2026)
  {
    cor: "VERDE",
    ref: "Arts. 208-A a 208-J CTN – Procedimento Administrativo Fiscal Unificado",
    artigoNum: "Arts. 208-A a 208-J",
    diplomaNome: "Código Tributário Nacional (incluídos pela LC 236/2026)",
    titulo: "Normas Gerais do Processo Administrativo Fiscal Nacional e Prazo de 20 Dias Úteis",
    textoCompleto: `Art. 208-A. O processo administrativo tributário no âmbito de todos os entes federados reger-se-á pelos princípios da ampla defesa, do contraditório, da celeridade, da segurança jurídica e da razoável duração do processo.
Art. 208-C. O prazo geral para apresentação de impugnação contra o auto de infração ou notificação de lançamento, bem como para a interposição de recursos administrativos ordinários, é de 20 (vinte) dias úteis contados da regular intimação do sujeito passivo.
Art. 208-E. A impugnação e o recurso tempestivo suspendem plenamente a exigibilidade do crédito tributário impugnado nos termos do Art. 151, inciso III, deste Código.`,
    descricaoDetalhada: `Padronização nacional do Processo Administrativo Tributário trazida pela Lei Complementar nº 236/2026:
- Institui normas gerais unificadas válidas para a União, todos os Estados, DF e Municípios;
- Fixa o prazo unificado de 20 (vinte) dias úteis para defesa e recurso administrativo;
- Garante o efeito suspensivo automático e pleno do crédito tributário (Art. 151, III do CTN) até o trânsito em julgado administrativo.`,
    aplicacaoPeca: "Utilizado para defender a tempestividade da impugnação administrativa e requerer a anulação de inscrição indevida em Dívida Ativa enquanto pendente decisão de recurso.",
    pegadinhaFGV: "Se a autoridade inscreveu o débito em dívida ativa antes do julgamento final do recurso administrativo tempestivo, a CDA é nula por violação aos Arts. 208-E e 151, III do CTN.",
    obs: "Unificou o prazo de 20 dias úteis em âmbito nacional pela LC 236/2026.",
    novo: true
  },

  // 46. Art. 156-A CF / Art. 195, V CF (EC 132/2023)
  {
    cor: "AZUL",
    ref: "Art. 156-A CF / Art. 195, V CF – Reforma Tributária (IBS e CBS)",
    artigoNum: "Art. 156-A e Art. 195, V",
    diplomaNome: "Constituição Federal (Emenda Constitucional nº 132/2023 e LC 214/2025)",
    titulo: "O Novo IVA Dual: Imposto sobre Bens e Serviços (IBS) e Contribuição sobre Bens e Serviços (CBS)",
    textoCompleto: `Art. 156-A. Lei complementar instituirá imposto sobre bens e serviços de competência compartilhada entre Estados, Distrito Federal e Municípios (IBS).
§ 1º O imposto previsto no caput será informado pelo princípio da neutralidade e:
I - incidirá sobre operações com bens materiais ou imateriais, inclusive direitos, ou com serviços;
II - incidirá sobre a importação de bens materiais ou imateriais, inclusive direitos, ou de serviços;
V - será não cumulativo, compensando-se o imposto devido com o montante cobrado sobre todas as operações anteriores;
VIII - será cobrado pelo somatório das alíquotas fixadas pelos Estados e pelos Municípios no destino da operação;
IX - não integrará sua própria base de cálculo, nem a base de cálculo da CBS, do Imposto Seletivo ou de quaisquer outros tributos.

Art. 195, V. Contribuição sobre bens e serviços (CBS), instituída pela União, harmonizada com as regras gerais do IBS.`,
    descricaoDetalhada: `A nova espinha dorsal da tributação do consumo no Brasil:
- IVA Dual: IBS (subnacional gerido pelo Comitê Gestor) e CBS (federal gerido pela Receita Federal);
- Não cumulatividade plena (crédito financeiro integral para qualquer aquisição vinculada à atividade produtiva);
- Tributação no destino (onde a mercadoria ou serviço é consumido);
- Transição de 2026 a 2033 com extinção do PIS, COFINS, ICMS e ISS;
- Regulamentação pela Lei Complementar nº 214/2025 e LC nº 227/2026.`,
    aplicacaoPeca: "Indispensável para responder às questões discursivas e fundamentações sobre a nova arquitetura do Sistema Tributário Nacional.",
    pegadinhaFGV: "O IBS e a CBS incidem 'por dentro'? NÃO! O Art. 156-A, §1º, IX determina expressamente o cálculo 'por fora' (não integram sua própria base de cálculo nem a base de cálculo um do outro).",
    obs: "Norma constitucional fundamental da Reforma Tributária 2026-2033.",
    novo: true
  }
];
