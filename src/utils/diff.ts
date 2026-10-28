/**
 * Utilitário de comparação textual linha a linha (Diff) usando algoritmo LCS
 * (Longest Common Subsequence), ideal para comparar versões de peças jurídicas.
 */

export type DiffLineType = 'added' | 'removed' | 'unchanged';

export interface DiffLine {
  type: DiffLineType;
  lineA?: number;
  lineB?: number;
  content: string;
}

export interface DiffResult {
  lines: DiffLine[];
  addedCount: number;
  removedCount: number;
  unchangedCount: number;
}

export interface SideBySideRow {
  lineA?: { num: number; content: string; type: 'removed' | 'unchanged' };
  lineB?: { num: number; content: string; type: 'added' | 'unchanged' };
}

export function computeLineDiff(textA: string, textB: string): DiffResult {
  const linesA = textA.split('\n');
  const linesB = textB.split('\n');
  const m = linesA.length;
  const n = linesB.length;

  // Tabela de programação dinâmica para LCS
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (linesA[i] === linesB[j]) {
        dp[i + 1][j + 1] = dp[i][j] + 1;
      } else {
        dp[i + 1][j + 1] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  // Rastreamento reverso para gerar a lista de diff
  let i = m;
  let j = n;
  const rawDiff: DiffLine[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && linesA[i - 1] === linesB[j - 1]) {
      rawDiff.push({
        type: 'unchanged',
        lineA: i,
        lineB: j,
        content: linesA[i - 1]
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      rawDiff.push({
        type: 'added',
        lineB: j,
        content: linesB[j - 1]
      });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      rawDiff.push({
        type: 'removed',
        lineA: i,
        content: linesA[i - 1]
      });
      i--;
    }
  }

  rawDiff.reverse();

  let addedCount = 0;
  let removedCount = 0;
  let unchangedCount = 0;

  for (const item of rawDiff) {
    if (item.type === 'added') addedCount++;
    else if (item.type === 'removed') removedCount++;
    else unchangedCount++;
  }

  return {
    lines: rawDiff,
    addedCount,
    removedCount,
    unchangedCount
  };
}

/**
 * Converte o diff linear em formato lado a lado (Side-by-side)
 */
export function buildSideBySideDiff(diff: DiffLine[]): SideBySideRow[] {
  const rows: SideBySideRow[] = [];
  let idx = 0;

  while (idx < diff.length) {
    const item = diff[idx];

    if (item.type === 'unchanged') {
      rows.push({
        lineA: { num: item.lineA || 0, content: item.content, type: 'unchanged' },
        lineB: { num: item.lineB || 0, content: item.content, type: 'unchanged' }
      });
      idx++;
    } else if (item.type === 'removed') {
      // Verifica se a próxima linha é 'added' para parear como modificação
      const next = diff[idx + 1];
      if (next && next.type === 'added') {
        rows.push({
          lineA: { num: item.lineA || 0, content: item.content, type: 'removed' },
          lineB: { num: next.lineB || 0, content: next.content, type: 'added' }
        });
        idx += 2;
      } else {
        rows.push({
          lineA: { num: item.lineA || 0, content: item.content, type: 'removed' },
          lineB: undefined
        });
        idx++;
      }
    } else if (item.type === 'added') {
      rows.push({
        lineA: undefined,
        lineB: { num: item.lineB || 0, content: item.content, type: 'added' }
      });
      idx++;
    }
  }

  return rows;
}
