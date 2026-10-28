export type SyntaxCategory = 'peca' | 'artigo' | 'tributo' | 'tese';

export interface SyntaxRule {
  category: SyntaxCategory;
  pattern: RegExp;
  label: string;
}

export interface SyntaxMatch {
  id: string;
  category: SyntaxCategory;
  text: string;
  start: number;
  end: number;
}

export interface SyntaxSegment {
  type: 'text' | 'match';
  text: string;
  category?: SyntaxCategory;
}

export interface SyntaxStats {
  total: number;
  peca: number;
  artigo: number;
  tributo: number;
  tese: number;
}

// Regras especializadas para a 2ª Fase OAB Direito Tributário (FGV)
export const SYNTAX_RULES: SyntaxRule[] = [
  // 1. Peças Práticas Profissionais FGV
  {
    category: 'peca',
    label: 'Peças Práticas',
    pattern: /\b(?:Mandado\s+de\s+Seguran[çc]a(?:\s+(?:Individual|Coletivo))?|A[çc][ãa]o\s+Anulat[óo]ria(?:\s+de\s+D[ée]bito\s+Fiscal)?|A[çc][ãa]o\s+Declarat[óo]ria(?:\s+de\s+Inexist[êe]ncia\s+de\s+Rela[çc][ãa]o\s+Jur[íi]dico-Tribut[áa]ria)?|A[çc][ãa]o\s+de\s+Repeti[çc][ãa]o\s+de\s+Ind[ée]bito|Repeti[çc][ãa]o\s+de\s+Ind[ée]bito|A[çc][ãa]o\s+de\s+Consigna[çc][ãa]o\s+em\s+Pagamento|Consigna[çc][ãa]o\s+em\s+Pagamento|Embargos\s+[àa]\s+Execu[çc][ãa]o(?:\s+Fiscal)?|Embargos\s+do\s+Devedor|Exce[çc][ãa]o\s+de\s+Pr[ée]-Executividade|EPE|Recurso\s+de\s+Apela[çc][ãa]o|Apela[çc][ãa]o|Agravo\s+de\s+Instrumento|Recurso\s+Ordin[áa]rio(?:\s+Constitucional)?|ROC|Recurso\s+Especial|RESP|Recurso\s+Extraordin[áa]rio|RE\b|Embargos\s+de\s+Declara[çc][ãa]o|Agravo\s+Interno|Contesta[çc][ãa]o|Contrarraz[õo]es)\b/gi
  },

  // 2. Dispositivos Legais, Artigos e Súmulas
  {
    category: 'artigo',
    label: 'Artigos & Súmulas',
    pattern: /\b(?:(?:Arts?\.?|Artigos?)\s*\d+[ºoª]?(?:\s*[-–,e§]\s*\d+[ºoª]?)?(?:\s*,?\s*(?:incisos?\s+[IVXLCDM]+|par[áa]grafo\s+[úu]nico|§\s*\d+[ºoª]?))*(?:\s*(?:do|da|dos|das)?\s*(?:CTN|CF(?:(?:\/|\s*)88)?|CPC(?:(?:\/|\s*)15)?|LEF|Lei\s*(?:n[ºoª]?\s*)?6\.?830(?:\/80)?|Lei\s*(?:n[ºoª]?\s*)?12\.?016(?:\/09)?|Lei\s*(?:n[ºoª]?\s*)?5\.?172(?:\/66)?|LC\s*(?:n[ºoª]?\s*)?\d+(?:\/\d+)?|Constitui[çc][ãa]o(?:\s+Federal)?|C[óo]digo\s+Tribut[áa]rio|C[óo]digo\s+de\s+Processo\s+Civil))?|S[úu]mula\s+Vinculante(?:\s*(?:n[ºoª]?|n[ºoª]\.?))?\s*\d+|SV\s*\d+|S[úu]mulas?(?:\s*(?:n[ºoª]?|n[ºoª]\.?))?\s*\d+(?:\s*(?:do\s+STF|do\s+STJ|STF|STJ))?|Tema(?:\s*(?:n[ºoª]?|n[ºoª]\.?))?\s*\d+(?:\s*(?:do\s+STF|do\s+STJ|STF|STJ|RG))?)\b/gi
  },

  // 3. Tributos e Reforma Tributária (EC 132/2023)
  {
    category: 'tributo',
    label: 'Tributos & Reforma',
    pattern: /\b(?:ICMS|ISSQN|ISS|IPTU|ITBI|ITCMD|IPVA|IPI|IRPF|IRPJ|IR\b|CSLL|IOF|PIS|COFINS|CIDE|IGF|II\b|IE\b|CIP\b|COSIP|IBS|CBS|Imposto\s+Seletivo|Imposto\s+de\s+Renda|Impostos?|Taxas?|Contribui[çc][ãa]o\s+de\s+Melhoria|Contribui[çc][õo]es\s+de\s+Melhoria|Empr[ée]stimos?\s+Compuls[óo]ri(?:o|os)|Contribui[çc][ãa]o\s+Especial|Contribui[çc][õo]es\s+Especiais|Contribui[çc][ãa]o\s+Social|Contribui[çc][õo]es\s+Sociais|Contribui[çc][ãa]o\s+Residual|Contribui[çc][õo]es\s+Residuais)\b/gi
  },

  // 4. Requisitos Processuais e Teses FGV
  {
    category: 'tese',
    label: 'Requisitos & Teses FGV',
    pattern: /\b(?:fuma[çc]a\s+do\s+bom\s+direito|fumus\s+boni\s+iuris|perigo\s+da\s+demora|periculum\s+in\s+mora|pedido\s+liminar|medida\s+liminar|liminar|tutela\s+(?:de\s+urg[êe]ncia|provis[óo]ria|antecipada)|efeito\s+suspensivo|tempestividade|tempestiv[ao]|prescri[çc][ãa]o(?:\s+intercorrente)?|decad[êe]ncia|capacidade\s+postulat[óo]ria|legitimidade\s+ativa|legitimidade\s+passiva|preparo(?:\s+recursal)?|justi[çc]a\s+gratuita|gratuidade\s+de\s+justi[çc]a|garantia\s+do\s+ju[íi]zo|dep[óo]sito\s+integral|anterioridade(?:\s+nonagesimal|\s+anual|\s+geral)?|irretroatividade|estrita\s+legalidade|princ[íi]pio\s+da\s+legalidade|n[ãa]o\s+confisco|veda[çc][ãa]o\s+ao\s+confisco|imunidade(?:\s+tribut[áa]ria|\s+rec[íi]proca)?|isen[çc][ãa]o|n[ãa]o\s+incid[êe]ncia|bitributa[çc][ãa]o|bis\s+in\s+idem|fato\s+gerador|base\s+de\s+c[áa]lculo|al[íi]quota|lan[çc]amento(?:\s+de\s+of[íi]cio|\s+por\s+homologa[çc][ãa]o|\s+por\s+declara[çc][ãa]o)?|certid[ãa]o\s+negativa|CND|CPEN)\b/gi
  }
];

export interface ParseOptions {
  activeCategories?: Record<SyntaxCategory, boolean>;
}

export function parseLegalSyntax(
  text: string,
  options: ParseOptions = {}
): {
  segments: SyntaxSegment[];
  stats: SyntaxStats;
  matches: SyntaxMatch[];
} {
  const activeCategories = options.activeCategories || {
    peca: true,
    artigo: true,
    tributo: true,
    tese: true
  };

  const stats: SyntaxStats = {
    total: 0,
    peca: 0,
    artigo: 0,
    tributo: 0,
    tese: 0
  };

  if (!text) {
    return { segments: [{ type: 'text', text: '' }], stats, matches: [] };
  }

  const rawMatches: SyntaxMatch[] = [];

  for (const rule of SYNTAX_RULES) {
    if (!activeCategories[rule.category]) continue;

    const regex = new RegExp(rule.pattern.source, rule.pattern.flags);
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (!match[0]) continue;
      const start = match.index;
      const end = start + match[0].length;
      rawMatches.push({
        id: `${rule.category}-${start}-${end}`,
        category: rule.category,
        text: match[0],
        start,
        end
      });
    }
  }

  // Ordena por posição inicial crescente; se igual, o match mais longo tem prioridade
  rawMatches.sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    return (b.end - b.start) - (a.end - a.start);
  });

  // Remove sobreposições
  const filteredMatches: SyntaxMatch[] = [];
  let lastEnd = 0;

  for (const m of rawMatches) {
    if (m.start >= lastEnd) {
      filteredMatches.push(m);
      lastEnd = m.end;
      stats[m.category]++;
      stats.total++;
    }
  }

  // Gera os segmentos de texto simples e marcações destacadas
  const segments: SyntaxSegment[] = [];
  let cursor = 0;

  for (const m of filteredMatches) {
    if (m.start > cursor) {
      segments.push({
        type: 'text',
        text: text.slice(cursor, m.start)
      });
    }
    segments.push({
      type: 'match',
      text: text.slice(m.start, m.end),
      category: m.category
    });
    cursor = m.end;
  }

  if (cursor < text.length) {
    segments.push({
      type: 'text',
      text: text.slice(cursor)
    });
  }

  // Para evitar que quebras de linha finais no textarea façam desalinhar a altura
  if (text.endsWith('\n')) {
    segments.push({
      type: 'text',
      text: '\u200B'
    });
  }

  return {
    segments,
    stats,
    matches: filteredMatches
  };
}
