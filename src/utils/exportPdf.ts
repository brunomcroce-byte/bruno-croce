import { jsPDF } from 'jspdf';
import { PecaCatalogo, ROTEIROS, CRONOGRAMA_DATA } from '../data/tributarioData';
import { SimuladoSemanalCompleto } from '../data/simuladoSemanalCompletoData';

/**
 * Remove caracteres especiais conflitantes com fontes padrão do jsPDF,
 * garantindo compatibilidade universal com caracteres da língua portuguesa.
 */
function sanitizarTextoPdf(texto: string): string {
  if (!texto) return '';
  return texto
    .replace(/[–—]/g, '-')
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/…/g, '...')
    .replace(/[•]/g, '*');
}

/**
 * Gera um arquivo PDF consolidado com o esqueleto completo da peça prática,
 * quesitos pontuados da FGV, dicas de redação e roteiro de recurso.
 */
export function exportarEsqueletoParaPdf(peca: PecaCatalogo): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 14;
  const marginY = 16;
  const contentWidth = pageWidth - marginX * 2;
  const bottomLimit = pageHeight - marginY - 10;
  let cursorY = marginY;

  // Função auxiliar para checar quebra de página
  const checarQuebraPagina = (alturaNecessaria: number) => {
    if (cursorY + alturaNecessaria > bottomLimit) {
      doc.addPage();
      cursorY = marginY + 6;
      desenharCabecalhoCompacto();
    }
  };

  const desenharCabecalhoCompacto = () => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('TributaOAB Desktop Pro • Material Oficial de Estudo Offline 2ª Fase OAB', marginX, cursorY);
    doc.text(sanitizarTextoPdf(peca.nome), pageWidth - marginX, cursorY, { align: 'right' });
    cursorY += 2;
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.2);
    doc.line(marginX, cursorY, pageWidth - marginX, cursorY);
    cursorY += 5;
  };

  // --- CABEÇALHO PRINCIPAL DA PÁGINA 1 ---
  // Tarja superior decorativa
  doc.setFillColor(2, 132, 199); // Sky-600
  doc.rect(marginX, cursorY, contentWidth, 3, 'F');
  cursorY += 7;

  // Tag do Tipo e Exames Cobrados
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(186, 230, 253);
  doc.roundedRect(marginX, cursorY, contentWidth, 7, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(2, 132, 199);
  const tagTopo = sanitizarTextoPdf(`${peca.tipo.toUpperCase()} • ${peca.examesCobrados}`);
  doc.text(tagTopo, marginX + 3, cursorY + 4.8);
  cursorY += 11;

  // Título da Peça
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42); // Slate-900
  const linhasTitulo = doc.splitTextToSize(sanitizarTextoPdf(peca.nome), contentWidth);
  doc.text(linhasTitulo, marginX, cursorY);
  cursorY += linhasTitulo.length * 6.5 + 1;

  // Base Legal
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  const baseLegalFormatada = sanitizarTextoPdf(`Base Legal FGV: ${peca.baseLegal}`);
  const linhasBase = doc.splitTextToSize(baseLegalFormatada, contentWidth);
  doc.text(linhasBase, marginX, cursorY);
  cursorY += linhasBase.length * 4.5 + 4;

  // Linha divisória
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(marginX, cursorY, pageWidth - marginX, cursorY);
  cursorY += 6;

  // --- SEÇÃO 1: QUESITOS EXIGIDOS NO ESPELHO FGV ---
  checarQuebraPagina(25);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('1. Quesitos Exigidos no Espelho de Correção FGV', marginX, cursorY);
  cursorY += 5;

  // Cabeçalho da tabela de quesitos
  doc.setFillColor(248, 250, 252);
  doc.rect(marginX, cursorY, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Item Avaliado', marginX + 2, cursorY + 4);
  doc.text('Cor Vade', marginX + contentWidth - 38, cursorY + 4);
  doc.text('Pontuação', marginX + contentWidth - 4, cursorY + 4, { align: 'right' });
  cursorY += 7;

  // Linhas da tabela
  peca.quesitosFGV.forEach((q, idx) => {
    checarQuebraPagina(8);
    const bg = idx % 2 === 0 ? 255 : 249;
    doc.setFillColor(bg, bg, bg);
    doc.rect(marginX, cursorY - 1, contentWidth, 6.5, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);

    const itemTexto = sanitizarTextoPdf(q.item);
    const itemTruncado = doc.splitTextToSize(itemTexto, contentWidth - 50)[0];
    doc.text(itemTruncado, marginX + 2, cursorY + 3.2);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(14, 116, 144);
    doc.text(q.cor, marginX + contentWidth - 38, cursorY + 3.2);

    doc.setTextColor(22, 101, 52);
    doc.text(`${q.pts} pt`, marginX + contentWidth - 4, cursorY + 3.2, { align: 'right' });

    cursorY += 6.5;
  });

  cursorY += 5;

  // --- SEÇÃO 2: BLOCOS ESTRUTURADOS DO ESQUELETO ---
  checarQuebraPagina(20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('2. Estrutura e Redação Oficial da Peça (Esqueleto)', marginX, cursorY);
  cursorY += 6;

  peca.blocos.forEach((bloco) => {
    checarQuebraPagina(25);

    // Barra lateral de cor de acordo com o Vade
    const corMap: Record<string, [number, number, number]> = {
      ROSA: [236, 72, 153],
      VERDE: [34, 197, 94],
      AMARELO: [234, 179, 8],
      AZUL: [2, 132, 199]
    };
    const [r, g, b] = corMap[bloco.cor] || [71, 85, 105];

    // Caixa de Título do Bloco
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(marginX, cursorY, contentWidth, 7, 1, 1, 'FD');

    // Marcador colorido
    doc.setFillColor(r, g, b);
    doc.rect(marginX, cursorY, 2.5, 7, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(sanitizarTextoPdf(bloco.titulo), marginX + 4.5, cursorY + 4.8);

    doc.setFontSize(7.5);
    doc.setTextColor(r, g, b);
    doc.text(bloco.cor, marginX + contentWidth - 3, cursorY + 4.8, { align: 'right' });
    cursorY += 9;

    // Dica FGV
    if (bloco.dica) {
      checarQuebraPagina(12);
      doc.setFillColor(254, 252, 232); // Amarelo bem claro
      doc.setDrawColor(254, 240, 138);
      const dicaTexto = sanitizarTextoPdf(`Como pontuar na FGV: ${bloco.dica}`);
      const linhasDica = doc.splitTextToSize(dicaTexto, contentWidth - 6);
      const alturaDica = linhasDica.length * 3.8 + 3.5;

      doc.roundedRect(marginX, cursorY, contentWidth, alturaDica, 1, 1, 'FD');
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(133, 77, 14);
      doc.text(linhasDica, marginX + 3, cursorY + 3.5);
      cursorY += alturaDica + 3;
    }

    // Texto jurídico / modelo de redação
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);

    const linhasTexto = doc.splitTextToSize(sanitizarTextoPdf(bloco.texto), contentWidth - 4);
    for (let i = 0; i < linhasTexto.length; i++) {
      checarQuebraPagina(5);
      doc.text(linhasTexto[i], marginX + 2, cursorY);
      cursorY += 4.2;
    }

    cursorY += 5;
  });

  // --- SEÇÃO 3: ROTEIRO PASSO A PASSO (SE HOUVER) ---
  const roteiro = ROTEIROS[peca.codigo];
  if (roteiro && roteiro.length > 0) {
    checarQuebraPagina(25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text('3. Roteiro Passo a Passo de Elaboração', marginX, cursorY);
    cursorY += 6;

    roteiro.forEach((passo, pIdx) => {
      checarQuebraPagina(8);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(2, 132, 199);
      doc.text(`${pIdx + 1}.`, marginX + 2, cursorY);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      const linhasPasso = doc.splitTextToSize(sanitizarTextoPdf(passo), contentWidth - 10);
      doc.text(linhasPasso, marginX + 8, cursorY);
      cursorY += linhasPasso.length * 4.2 + 2;
    });
  }

  // --- RODAPÉ EM TODAS AS PÁGINAS ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(marginX, pageHeight - marginY + 2, pageWidth - marginX, pageHeight - marginY + 2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text('TributaOAB Desktop Pro • Direito Tributário 2ª Fase FGV • Apostila de Consulta Offline', marginX, pageHeight - marginY + 6);
    doc.text(`Página ${i} de ${totalPages}`, pageWidth - marginX, pageHeight - marginY + 6, { align: 'right' });
  }

  // Efetua o download do arquivo PDF com nome semântico
  const nomeArquivo = `Esqueleto_${peca.codigo}_FGV.pdf`;
  doc.save(nomeArquivo);
}

/**
 * Gera documento HTML otimizado para impressão de alta qualidade (Ctrl+P / Salvar em PDF)
 * que pode ser impresso diretamente ou gerado via visualização no navegador.
 */
export function imprimirEsqueletoPeca(peca: PecaCatalogo): void {
  const roteiro = ROTEIROS[peca.codigo];

  const htmlConteudo = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Esqueleto Oficial - ${peca.nome}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm 12mm 15mm 12mm;
    }
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      font-size: 10pt;
      line-height: 1.5;
      color: #0f172a;
      background: #fff;
      margin: 0;
      padding: 0;
    }
    .header {
      border-bottom: 2.5pt solid #0284c7;
      padding-bottom: 8pt;
      margin-bottom: 12pt;
    }
    .tag {
      display: inline-block;
      background: #e0f2fe;
      color: #0369a1;
      font-size: 8pt;
      font-weight: 700;
      padding: 2pt 8pt;
      border-radius: 9999px;
      margin-bottom: 4pt;
    }
    h1 {
      font-size: 16pt;
      margin: 4pt 0 2pt 0;
      color: #0f172a;
    }
    .base-legal {
      font-size: 9.5pt;
      color: #475569;
    }
    .secao-titulo {
      font-size: 11pt;
      font-weight: 700;
      color: #1e293b;
      margin-top: 14pt;
      margin-bottom: 6pt;
      border-bottom: 1pt solid #e2e8f0;
      padding-bottom: 2pt;
    }
    table.quesitos {
      width: 100%;
      border-collapse: collapse;
      font-size: 8.5pt;
      margin-bottom: 12pt;
    }
    table.quesitos th, table.quesitos td {
      border: 1pt solid #cbd5e1;
      padding: 4pt 6pt;
      text-align: left;
    }
    table.quesitos th {
      background: #f8fafc;
      font-weight: 700;
      color: #334155;
    }
    .bloco-card {
      border: 1pt solid #cbd5e1;
      border-left-width: 5pt;
      border-radius: 4pt;
      padding: 8pt 10pt;
      margin-bottom: 10pt;
      page-break-inside: avoid;
    }
    .bloco-card.ROSA { border-left-color: #ec4899; }
    .bloco-card.VERDE { border-left-color: #22c55e; }
    .bloco-card.AMARELO { border-left-color: #eab308; }
    .bloco-card.AZUL { border-left-color: #0284c7; }
    .bloco-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4pt;
    }
    .bloco-titulo {
      font-size: 10pt;
      font-weight: 700;
      color: #0f172a;
    }
    .bloco-dica {
      background: #fefce8;
      border: 1pt solid #fef08a;
      color: #854d0e;
      font-size: 8pt;
      padding: 4pt 6pt;
      border-radius: 3pt;
      margin-bottom: 6pt;
    }
    .bloco-texto {
      white-space: pre-wrap;
      font-family: inherit;
      font-size: 9pt;
      color: #1e293b;
      line-height: 1.6;
    }
    .footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      font-size: 7.5pt;
      color: #94a3b8;
      border-top: 0.5pt solid #e2e8f0;
      padding-top: 3pt;
      display: flex;
      justify-content: space-between;
    }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="tag">${peca.tipo} • ${peca.examesCobrados}</div>
    <h1>${peca.nome}</h1>
    <div class="base-legal"><strong>Base Legal:</strong> ${peca.baseLegal}</div>
  </div>

  <div class="secao-titulo">Quesitos Exigidos no Espelho FGV</div>
  <table class="quesitos">
    <thead>
      <tr>
        <th>Item Avaliado na Prova</th>
        <th style="width: 80pt; text-align: center;">Cor Vade</th>
        <th style="width: 60pt; text-align: center;">Pontuação</th>
      </tr>
    </thead>
    <tbody>
      ${peca.quesitosFGV
        .map(
          q => `<tr>
            <td>${q.item}</td>
            <td style="text-align: center; font-weight: 700;">${q.cor}</td>
            <td style="text-align: center; font-weight: 700; color: #166534;">${q.pts} pt</td>
          </tr>`
        )
        .join('')}
    </tbody>
  </table>

  <div class="secao-titulo">Esqueleto e Redação dos Blocos</div>
  ${peca.blocos
    .map(
      b => `
    <div class="bloco-card ${b.cor}">
      <div class="bloco-header">
        <span class="bloco-titulo">${b.titulo}</span>
        <span style="font-size: 8pt; font-weight: 700;">${b.cor}</span>
      </div>
      ${b.dica ? `<div class="bloco-dica">💡 <strong>Como pontuar na FGV:</strong> ${b.dica}</div>` : ''}
      <div class="bloco-texto">${b.texto}</div>
    </div>
  `
    )
    .join('')}

  ${
    roteiro && roteiro.length > 0
      ? `
    <div class="secao-titulo">Roteiro Passo a Passo de Elaboração</div>
    <ol style="font-size: 9pt; padding-left: 18pt; margin-top: 4pt; color: #334155;">
      ${roteiro.map(r => `<li style="margin-bottom: 3pt;">${r}</li>`).join('')}
    </ol>
  `
      : ''
  }

  <div class="footer">
    <span>TributaOAB Desktop Pro • Material de Estudo Offline 2ª Fase OAB</span>
    <span>Impresso em ${new Date().toLocaleDateString('pt-BR')}</span>
  </div>

  <script>
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>
`;

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  iframe.contentDocument?.open();
  iframe.contentDocument?.write(htmlConteudo);
  iframe.contentDocument?.close();

  // Limpa o iframe após a impressão ser acionada
  setTimeout(() => {
    if (iframe.parentNode) {
      iframe.parentNode.removeChild(iframe);
    }
  }, 60000);
}

/**
 * Interface com os dados compilados para o Relatório Semanal de Progresso
 */
export interface RelatorioSemanalDados {
  taxaAcertoEstimada: number;
  flashStats: { acertos: number; total: number };
  totalLinhasSemana: number;
  linhasCount: number;
  tarefasConcluidas: string[];
  totalTarefas: number;
  dataProva?: string;
  dataRepescagem?: string;
  repescagemPaga?: boolean;
  vadeMarcadosCount?: number;
  pomodoroBlocosHoje?: number;
}

/**
 * Compila automaticamente os dados de Flashcards, Simulador e Cronograma,
 * gerando um arquivo PDF oficial e estruturado de Relatório Semanal de Progresso.
 */
export function exportarRelatorioSemanalPdf(dados: RelatorioSemanalDados): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 14;
  const marginY = 15;
  const contentWidth = pageWidth - marginX * 2;
  const bottomLimit = pageHeight - marginY - 10;
  let cursorY = marginY;

  const desenharCabecalhoCompactoRelatorio = () => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('TributaOAB Desktop Pro • Relatório Semanal de Progresso • 2ª Fase OAB', marginX, cursorY);
    doc.text('Direito Tributário FGV', pageWidth - marginX, cursorY, { align: 'right' });
    cursorY += 2;
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.2);
    doc.line(marginX, cursorY, pageWidth - marginX, cursorY);
    cursorY += 6;
  };

  const checarQuebraPagina = (alturaNecessaria: number) => {
    if (cursorY + alturaNecessaria > bottomLimit) {
      doc.addPage();
      cursorY = marginY + 4;
      desenharCabecalhoCompactoRelatorio();
    }
  };

  // --- CABEÇALHO PRINCIPAL (PÁGINA 1) ---
  // Tarja superior decorativa
  doc.setFillColor(2, 132, 199); // Sky-600
  doc.rect(marginX, cursorY, contentWidth, 3.5, 'F');
  cursorY += 7;

  // Tag Superior
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(186, 230, 253);
  doc.roundedRect(marginX, cursorY, contentWidth, 6.5, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(2, 132, 199);
  const tagTopo = sanitizarTextoPdf('RELATÓRIO OFICIAL DE DESEMPENHO E METAS • 2ª FASE DIREITO TRIBUTÁRIO FGV');
  doc.text(tagTopo, marginX + 3, cursorY + 4.5);
  cursorY += 10;

  // Título do Relatório
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42); // Slate-900
  doc.text('Relatório Semanal de Progresso & Estudo', marginX, cursorY);
  cursorY += 5.5;

  // Subtítulo e data de emissão
  const agora = new Date();
  const dataExtenso = agora.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  const horaFormatada = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(sanitizarTextoPdf(`Emitido em ${dataExtenso} às ${horaFormatada} • Preparação Intensiva OAB`), marginX, cursorY);
  cursorY += 7;

  // Linha divisória
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(marginX, cursorY, pageWidth - marginX, cursorY);
  cursorY += 6;

  // --- 3 KPI CARDS LADO A LADO ---
  const cardWidth = (contentWidth - 6) / 3; // ~58.6mm
  const cardHeight = 32;

  // 1. KPI Flashcards
  const card1X = marginX;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(card1X, cursorY, cardWidth, cardHeight, 1.5, 1.5, 'FD');
  // Barra topo verde
  doc.setFillColor(34, 197, 94);
  doc.rect(card1X, cursorY, cardWidth, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(22, 101, 52);
  doc.text('RETENÇÃO & FLASHCARDS', card1X + 3, cursorY + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42);
  doc.text(`${dados.taxaAcertoEstimada}%`, card1X + 3, cursorY + 13.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`${dados.flashStats.acertos} acertos em ${dados.flashStats.total} revisões`, card1X + 3, cursorY + 18.5);

  const statusFlash = dados.taxaAcertoEstimada >= 75 ? 'Excelente (Meta: 75%)' : dados.taxaAcertoEstimada >= 60 ? 'Bom (Meta: 75%)' : 'Reforçar Revisão';
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(dados.taxaAcertoEstimada >= 75 ? 22 : 180, dados.taxaAcertoEstimada >= 75 ? 101 : 83, 52);
  doc.text(statusFlash, card1X + 3, cursorY + 24);

  // Barra de progresso Flashcards
  doc.setFillColor(226, 232, 240);
  doc.roundedRect(card1X + 3, cursorY + 26.5, cardWidth - 6, 2, 0.5, 0.5, 'F');
  doc.setFillColor(34, 197, 94);
  doc.roundedRect(card1X + 3, cursorY + 26.5, Math.min(cardWidth - 6, (cardWidth - 6) * (dados.taxaAcertoEstimada / 100)), 2, 0.5, 0.5, 'F');

  // 2. KPI Simulador 150 Linhas
  const card2X = card1X + cardWidth + 3;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(card2X, cursorY, cardWidth, cardHeight, 1.5, 1.5, 'FD');
  // Barra topo azul
  doc.setFillColor(2, 132, 199);
  doc.rect(card2X, cursorY, cardWidth, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(3, 105, 161);
  doc.text('SIMULADOR 150 LINHAS', card2X + 3, cursorY + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42);
  doc.text(`${dados.totalLinhasSemana} L`, card2X + 3, cursorY + 13.5);

  const pctLinhas = Math.round((dados.totalLinhasSemana / 150) * 100);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Meta Semanal: 150L (${pctLinhas}%)`, card2X + 3, cursorY + 18.5);

  const paginasPreenchidas = Math.min(5, Math.ceil(dados.totalLinhasSemana / 30));
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(pctLinhas >= 100 ? 22 : 3, pctLinhas >= 100 ? 101 : 105, pctLinhas >= 100 ? 52 : 161);
  doc.text(pctLinhas >= 100 ? 'Meta 150L Atingida! 🎯' : `${paginasPreenchidas}/5 páginas completas`, card2X + 3, cursorY + 24);

  // Barra de progresso Linhas
  doc.setFillColor(226, 232, 240);
  doc.roundedRect(card2X + 3, cursorY + 26.5, cardWidth - 6, 2, 0.5, 0.5, 'F');
  doc.setFillColor(2, 132, 199);
  doc.roundedRect(card2X + 3, cursorY + 26.5, Math.min(cardWidth - 6, (cardWidth - 6) * Math.min(1, dados.totalLinhasSemana / 150)), 2, 0.5, 0.5, 'F');

  // 3. KPI Cronograma 8 Semanas
  const card3X = card2X + cardWidth + 3;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(card3X, cursorY, cardWidth, cardHeight, 1.5, 1.5, 'FD');
  // Barra topo âmbar
  doc.setFillColor(217, 119, 6);
  doc.rect(card3X, cursorY, cardWidth, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(180, 83, 9);
  doc.text('CRONOGRAMA 8 SEMANAS', card3X + 3, cursorY + 6);

  const pctGeralCronograma = Math.round((dados.tarefasConcluidas.length / (dados.totalTarefas || 1)) * 100);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42);
  doc.text(`${dados.tarefasConcluidas.length} / ${dados.totalTarefas}`, card3X + 3, cursorY + 13.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`${pctGeralCronograma}% do plano concluído`, card3X + 3, cursorY + 18.5);

  let semanasCompletasCount = 0;
  CRONOGRAMA_DATA.forEach((sem, sIdx) => {
    const todasFeitas = sem.tarefas.every((_, tIdx) => dados.tarefasConcluidas.includes(`${sIdx}-${tIdx}`));
    if (todasFeitas) semanasCompletasCount++;
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(semanasCompletasCount >= 4 ? 22 : 180, semanasCompletasCount >= 4 ? 101 : 83, 9);
  doc.text(`${semanasCompletasCount} de 8 semanas 100%`, card3X + 3, cursorY + 24);

  // Barra de progresso Cronograma
  doc.setFillColor(226, 232, 240);
  doc.roundedRect(card3X + 3, cursorY + 26.5, cardWidth - 6, 2, 0.5, 0.5, 'F');
  doc.setFillColor(217, 119, 6);
  doc.roundedRect(card3X + 3, cursorY + 26.5, Math.min(cardWidth - 6, (cardWidth - 6) * (pctGeralCronograma / 100)), 2, 0.5, 0.5, 'F');

  cursorY += cardHeight + 8;

  // --- SEÇÃO 1: DETALHAMENTO DO CRONOGRAMA DE 8 SEMANAS ---
  checarQuebraPagina(20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('1. Execução Detalhada do Cronograma de 8 Semanas FGV', marginX, cursorY);
  cursorY += 5;

  // Cabeçalho da Tabela
  doc.setFillColor(241, 245, 249);
  doc.rect(marginX, cursorY, contentWidth, 6.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Semana & Foco Temático', marginX + 3, cursorY + 4.5);
  doc.text('Tarefas', marginX + 105, cursorY + 4.5);
  doc.text('Progresso', marginX + 130, cursorY + 4.5);
  doc.text('Status', marginX + contentWidth - 3, cursorY + 4.5, { align: 'right' });
  cursorY += 7.5;

  CRONOGRAMA_DATA.forEach((sem, sIdx) => {
    checarQuebraPagina(7.5);
    const concluidasDaSemana = sem.tarefas.filter((_, tIdx) => dados.tarefasConcluidas.includes(`${sIdx}-${tIdx}`)).length;
    const totalDaSemana = sem.tarefas.length;
    const pctSemana = Math.round((concluidasDaSemana / totalDaSemana) * 100);

    const isZebra = sIdx % 2 === 0;
    doc.setFillColor(isZebra ? 255 : 249, isZebra ? 255 : 250, isZebra ? 255 : 252);
    doc.rect(marginX, cursorY - 1, contentWidth, 6.5, 'F');

    // Título da Semana (truncado se necessário)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    const tituloSemanaTrunc = doc.splitTextToSize(sanitizarTextoPdf(sem.semana), 100)[0];
    doc.text(tituloSemanaTrunc, marginX + 3, cursorY + 3.5);

    // Tarefas
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    doc.text(`${concluidasDaSemana}/${totalDaSemana}`, marginX + 105, cursorY + 3.5);

    // Mini barra de progresso
    doc.setFillColor(226, 232, 240);
    doc.roundedRect(marginX + 125, cursorY + 1.8, 20, 2.2, 0.5, 0.5, 'F');
    const corBarra = pctSemana === 100 ? [34, 197, 94] : pctSemana > 0 ? [2, 132, 199] : [148, 163, 184];
    doc.setFillColor(corBarra[0], corBarra[1], corBarra[2]);
    doc.roundedRect(marginX + 125, cursorY + 1.8, (20 * pctSemana) / 100, 2.2, 0.5, 0.5, 'F');

    // Status Texto
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    if (pctSemana === 100) {
      doc.setTextColor(22, 101, 52);
      doc.text('100% Concluída', marginX + contentWidth - 3, cursorY + 3.5, { align: 'right' });
    } else if (pctSemana > 0) {
      doc.setTextColor(2, 132, 199);
      doc.text(`${pctSemana}% Em andamento`, marginX + contentWidth - 3, cursorY + 3.5, { align: 'right' });
    } else {
      doc.setTextColor(148, 163, 184);
      doc.text('Não iniciada', marginX + contentWidth - 3, cursorY + 3.5, { align: 'right' });
    }

    cursorY += 6.5;
  });

  cursorY += 6;

  // --- SEÇÃO 2: DIAGNÓSTICO PEDAGÓGICO E RECOMENDAÇÕES DA FGV ---
  checarQuebraPagina(45);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('2. Diagnóstico Pedagógico e Recomendações Estratégicas para a FGV', marginX, cursorY);
  cursorY += 5;

  const recomendacoes = [
    {
      titulo: 'Retenção de Flashcards & Jurisprudência:',
      texto: dados.taxaAcertoEstimada >= 75
        ? `Sua taxa de acerto de ${dados.taxaAcertoEstimada}% está acima da média histórica exigida pela FGV (75%). Mantenha o ritmo realizando 5 a 10 flashcards diários para fixar prazos do CTN e Súmulas Vinculantes.`
        : `Sua taxa de acerto atual é de ${dados.taxaAcertoEstimada}%. Recomenda-se realizar ao menos 2 blocos de repetição espaçada por dia para fixar os artigos de suspensão (Art. 151 CTN) e extinção (Art. 156 CTN).`
    },
    {
      titulo: 'Redação Prática no Simulador de 150 Linhas:',
      texto: dados.totalLinhasSemana >= 150
        ? `Parabéns! Você redigiu ${dados.totalLinhasSemana} linhas nesta semana, atingindo a meta de uma prova completa da OAB. Foque agora em calibrar o tempo de prova (meta de 5 horas com o cronômetro oficial).`
        : `Você acumulou ${dados.totalLinhasSemana} linhas de 150 previstas. A banca FGV penaliza peças incompletas. Pratique redigir uma petição inicial ou recursal inteira para ganhar velocidade manual.`
    },
    {
      titulo: 'Marcação do Vade Mecum e Sistema 4 Cores:',
      texto: 'Utilize rigorosamente o código de cores oficial (Amarelo para Direito Material, Verde para Processo, Rosa para Endereçamento e Azul para CF/88). Certifique-se de não utilizar anotações manuscritas estruturais proibidas pelo edital da FGV.'
    },
    {
      titulo: 'Priorização de Peças Campeãs de Incidência:',
      texto: 'Mandado de Segurança, Recurso de Apelação, Ação Anulatória e Embargos à Execução Fiscal representam mais de 70% de todas as 2ª Fases de Tributário. Domine o esqueleto e a pontuação dos quesitos de cada uma delas.'
    }
  ];

  recomendacoes.forEach((rec) => {
    checarQuebraPagina(16);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    const linhasRec = doc.splitTextToSize(sanitizarTextoPdf(rec.texto), contentWidth - 10);
    const cardH = linhasRec.length * 4 + 7;

    doc.roundedRect(marginX, cursorY, contentWidth, cardH, 1, 1, 'FD');

    // Marcador lateral
    doc.setFillColor(2, 132, 199);
    doc.rect(marginX, cursorY, 2.5, cardH, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(sanitizarTextoPdf(rec.titulo), marginX + 5, cursorY + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    doc.text(linhasRec, marginX + 5, cursorY + 9);

    cursorY += cardH + 3;
  });

  // --- SEÇÃO 3: METAS DO PRÓXIMO CICLO ---
  checarQuebraPagina(24);
  doc.setFillColor(254, 252, 232); // Amarelo bem claro
  doc.setDrawColor(254, 240, 138);
  doc.roundedRect(marginX, cursorY, contentWidth, 20, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(133, 77, 14);
  doc.text('COMPROMISSO DE FOCO PARA A PRÓXIMA SEMANA', marginX + 4, cursorY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(113, 63, 18);
  const textoCompromisso = sanitizarTextoPdf(
    '1. Concluir ao menos 1 Simulado de 150 linhas • 2. Revisar 15 flashcards de teses de mérito • 3. Marcar 5 súmulas recentes no Vade Mecum • 4. Fechar 100% das tarefas da semana vigente.'
  );
  doc.text(textoCompromisso, marginX + 4, cursorY + 10);
  doc.text(sanitizarTextoPdf('Assinatura do Candidato: _____________________________________________ Data: ____/____/2026'), marginX + 4, cursorY + 16);
  cursorY += 26;

  // --- RODAPÉ EM TODAS AS PÁGINAS ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(marginX, pageHeight - marginY + 2, pageWidth - marginX, pageHeight - marginY + 2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text('TributaOAB Desktop Pro • Relatório Semanal de Progresso • Direito Tributário 2ª Fase OAB', marginX, pageHeight - marginY + 6);
    doc.text(`Página ${i} de ${totalPages}`, pageWidth - marginX, pageHeight - marginY + 6, { align: 'right' });
  }

  // Download do arquivo PDF com nome limpo e com timestamp
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');
  const nomeArquivo = `Relatorio_Semanal_Progresso_OAB_${ano}${mes}${dia}.pdf`;
  doc.save(nomeArquivo);
}

/**
 * Exporta o Caderno Oficial de Prova FGV completo (Peça Prático-Profissional + 4 Questões Discursivas)
 * em formato PDF idêntico ao modelo da banca FGV, com instruções, enunciados e folhas pautadas.
 */
export function exportarCadernoSimuladoCompletoPdf(
  simulado: SimuladoSemanalCompleto,
  respostasCandidato?: {
    peca?: string;
    q1?: string;
    q2?: string;
    q3?: string;
    q4?: string;
  }
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 14;
  const marginY = 14;
  const contentWidth = pageWidth - marginX * 2;
  const bottomLimit = pageHeight - marginY - 10;
  let cursorY = marginY;

  const checarQuebra = (altura: number) => {
    if (cursorY + altura > bottomLimit) {
      doc.addPage();
      cursorY = marginY;
    }
  };

  // --- CAPA OFICIAL FGV ---
  doc.setFillColor(15, 23, 42); // Navy Dark
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('ORDEM DOS ADVOGADOS DO BRASIL - CONSELHO FEDERAL', pageWidth / 2, 10, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(186, 230, 253);
  doc.text(`EXAME DE ORDEM UNIFICADO - 2ª FASE - DIREITO TRIBUTÁRIO`, pageWidth / 2, 16, { align: 'center' });
  doc.text(sanitizarTextoPdf(simulado.titulo), pageWidth / 2, 22, { align: 'center' });

  cursorY = 36;

  // Box de Dados do Candidato
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(marginX, cursorY, contentWidth, 32, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('DADOS DE IDENTIFICAÇÃO DO(A) EXAMINANDO(A)', marginX + 4, cursorY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Nome do Candidato: ___________________________________________________________', marginX + 4, cursorY + 13);
  doc.text('Inscrição / CPF: __________________________________   Seccional OAB: _________________', marginX + 4, cursorY + 20);
  doc.text('Data de Realização: ______/______/2026   Tempo Utilizado: ____________________________', marginX + 4, cursorY + 27);

  cursorY += 38;

  // Instruções Oficiais da FGV
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(148, 163, 184);
  doc.roundedRect(marginX, cursorY, contentWidth, 54, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59);
  doc.text('INSTRUÇÕES GERAIS DE PROVA (PADRÃO OFICIAL BANCA FGV)', marginX + 4, cursorY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(51, 65, 85);

  const instrucoes = [
    '1. Este caderno contém a Prova Prático-Profissional com 1 (uma) Peça e 4 (quatro) Questões Discursivas.',
    '2. Duração máxima oficial da prova: 5 (cinco) horas ininterruptas (300 minutos).',
    '3. Pontuação: A Peça Prática vale até 5,00 pontos. Cada Questão vale até 1,25 pontos (Total = 10,00 pontos).',
    '4. Critério de Aprovação: Será considerado aprovado o examinando que obtiver nota final igual ou superior a 6,00.',
    '5. Extensão máxima de linhas: Até 150 linhas para a Peça Prático-Profissional e até 30 linhas para cada Questão.',
    '6. Identificação pessoal é terminantemente proibida (assinar apenas como Advogado... / OAB...).',
    '7. A fundamentação deve conter expressamente o artigo, parágrafo, inciso ou súmula vinculado à respectiva tese.'
  ];

  instrucoes.forEach((inst, idx) => {
    doc.text(sanitizarTextoPdf(inst), marginX + 4, cursorY + 12 + idx * 5.8);
  });

  cursorY += 60;

  // Box de Resumo da Estrutura de Pontuação
  doc.setFillColor(254, 252, 232);
  doc.setDrawColor(250, 204, 21);
  doc.roundedRect(marginX, cursorY, contentWidth, 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(133, 77, 14);
  doc.text('COMPOSIÇÃO OFICIAL DA NOTA FGV (0,00 A 10,00 PONTOS)', marginX + 4, cursorY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(113, 63, 18);
  doc.text('• Peça Prática: 5,00 pts (Folha FGV de 150 linhas)', marginX + 4, cursorY + 12);
  doc.text('• Questões 1 a 4: 1,25 pts cada (Folhas FGV de 30 linhas)', marginX + 75, cursorY + 12);
  doc.text('• Nota de Corte: 6,00 pontos para Aprovação Definitiva na 2ª Fase OAB', marginX + 4, cursorY + 17);

  // --- SEÇÃO 1: PEÇA PRÁTICO-PROFISSIONAL ---
  doc.addPage();
  cursorY = marginY;

  doc.setFillColor(30, 41, 59);
  doc.rect(marginX, cursorY, contentWidth, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('CADERNO DE TEXTOS • PARTE I: PEÇA PRÁTICO-PROFISSIONAL (VALOR: 5,00 PONTOS)', marginX + 3, cursorY + 5.5);

  cursorY += 13;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(sanitizarTextoPdf(`Enunciado da Peça - ${simulado.peca.exame} (${simulado.peca.peca})`), marginX, cursorY);
  cursorY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  const splitEnunciadoPeca = doc.splitTextToSize(sanitizarTextoPdf(simulado.peca.enunciado), contentWidth);
  doc.text(splitEnunciadoPeca, marginX, cursorY);
  cursorY += splitEnunciadoPeca.length * 4.5 + 6;

  // Dica da Banca
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(marginX, cursorY, contentWidth, 12, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(22, 101, 52);
  doc.text('DICA DA BANCA FGV:', marginX + 3, cursorY + 4.5);
  doc.setFont('helvetica', 'normal');
  doc.text(sanitizarTextoPdf(simulado.peca.dicaBanca), marginX + 3, cursorY + 9);

  cursorY += 18;

  // Folha de Resposta Pautada para a Peça (Amostra de 30 linhas com indicação de continuidade)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('FOLHA OFICIAL DE RESPOSTA DA PEÇA (PÁGINA 1 DE 5 - LINHAS 1 A 30)', marginX, cursorY);
  cursorY += 4;

  const linhasPeca = respostasCandidato?.peca ? respostasCandidato.peca.split('\n') : [];
  for (let l = 1; l <= 30; l++) {
    doc.setDrawColor(226, 232, 240);
    doc.line(marginX, cursorY, marginX + contentWidth, cursorY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text(String(l).padStart(3, '0'), marginX - 1, cursorY - 1, { align: 'right' });

    if (linhasPeca[l - 1]) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text(sanitizarTextoPdf(linhasPeca[l - 1].slice(0, 85)), marginX + 3, cursorY - 1);
    }
    cursorY += 6.2;
  }

  // --- SEÇÃO 2: AS 4 QUESTÕES PRÁTICAS DISCURSIVAS ---
  simulado.questoes.forEach(q => {
    doc.addPage();
    cursorY = marginY;

    doc.setFillColor(30, 41, 59);
    doc.rect(marginX, cursorY, contentWidth, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(`CADERNO DE TEXTOS • QUESTÃO ${q.numero} (VALOR TOTAL: 1,25 PONTOS)`, marginX + 3, cursorY + 5.5);

    cursorY += 13;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(sanitizarTextoPdf(q.titulo), marginX, cursorY);
    cursorY += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.2);
    doc.setTextColor(30, 41, 59);
    const splitEnunciado = doc.splitTextToSize(sanitizarTextoPdf(q.enunciado), contentWidth);
    doc.text(splitEnunciado, marginX, cursorY);
    cursorY += splitEnunciado.length * 4.2 + 4;

    // Item A
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(marginX, cursorY, contentWidth, 14, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(3, 105, 161);
    doc.text(`A) [Valor: ${q.itemA.pontos.toFixed(2)} pt]`, marginX + 3, cursorY + 4.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    const splitItemA = doc.splitTextToSize(sanitizarTextoPdf(q.itemA.pergunta), contentWidth - 6);
    doc.text(splitItemA, marginX + 3, cursorY + 8.5);
    cursorY += 17;

    // Item B
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(marginX, cursorY, contentWidth, 14, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(3, 105, 161);
    doc.text(`B) [Valor: ${q.itemB.pontos.toFixed(2)} pt]`, marginX + 3, cursorY + 4.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    const splitItemB = doc.splitTextToSize(sanitizarTextoPdf(q.itemB.pergunta), contentWidth - 6);
    doc.text(splitItemB, marginX + 3, cursorY + 8.5);
    cursorY += 18;

    // Folha de Resposta Pautada de 30 linhas para a Questão
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`FOLHA DE RESPOSTA DA QUESTÃO ${q.numero} (MÁXIMO DE 30 LINHAS)`, marginX, cursorY);
    cursorY += 4;

    const textoQuestao =
      q.numero === 1
        ? respostasCandidato?.q1
        : q.numero === 2
        ? respostasCandidato?.q2
        : q.numero === 3
        ? respostasCandidato?.q3
        : respostasCandidato?.q4;

    const linhasQuestao = textoQuestao ? textoQuestao.split('\n') : [];

    for (let l = 1; l <= 30; l++) {
      doc.setDrawColor(226, 232, 240);
      doc.line(marginX, cursorY, marginX + contentWidth, cursorY);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(148, 163, 184);
      doc.text(String(l).padStart(2, '0'), marginX - 1, cursorY - 1, { align: 'right' });

      if (linhasQuestao[l - 1]) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(15, 23, 42);
        doc.text(sanitizarTextoPdf(linhasQuestao[l - 1].slice(0, 85)), marginX + 3, cursorY - 1);
      }
      cursorY += 5.5;
    }
  });

  // --- RODAPÉ EM TODAS AS PÁGINAS ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(marginX, pageHeight - marginY + 2, pageWidth - marginX, pageHeight - marginY + 2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text('OAB 2ª Fase Direito Tributário • Caderno Oficial de Prova FGV (Peça + 4 Questões)', marginX, pageHeight - marginY + 6);
    doc.text(`Página ${i} de ${totalPages}`, pageWidth - marginX, pageHeight - marginY + 6, { align: 'right' });
  }

  const nomeArquivo = `Caderno_Oficial_FGV_Simulado_Semanal_${simulado.id}.pdf`;
  doc.save(nomeArquivo);
}

