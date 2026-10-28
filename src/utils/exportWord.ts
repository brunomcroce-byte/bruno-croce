import { PecaCatalogo } from '../data/tributarioData';

function obterCssEditorialWord(): string {
  return `
    @page { size: 21cm 29.7cm; margin: 1.5cm; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #FAF8F5; color: #1e293b; font-size: 10.5pt; line-height: 1.6; }
    .folha-word { background-color: #FAF8F5; border: 1pt solid #d6d3d1; padding: 18pt 20pt; margin-bottom: 20pt; }
    .cabecalho-peca { border-bottom: 2pt solid #0284c7; padding-bottom: 10pt; margin-bottom: 14pt; }
    .titulo-peca { font-size: 15pt; font-weight: bold; color: #0f172a; margin: 6pt 0 2pt 0; }
    .subtitulo-peca { font-size: 10pt; color: #475569; font-style: italic; }
    .pilula { display: inline-block; padding: 3pt 9pt; font-size: 8.5pt; font-weight: bold; border-radius: 12pt; }
    .pil-ROSA { background-color: #fce7f3; color: #9d174d; border: 1pt solid #f472b6; }
    .pil-VERDE { background-color: #dcfce7; color: #166534; border: 1pt solid #34d399; }
    .pil-AMARELO { background-color: #fef9c3; color: #854d0e; border: 1pt solid #facc15; }
    .pil-AZUL { background-color: #e0f2fe; color: #075985; border: 1pt solid #38bdf8; }
    .tabela-quesitos { width: 100%; border-collapse: collapse; margin-bottom: 14pt; font-size: 9.5pt; }
    .tabela-quesitos th, .tabela-quesitos td { border: 1pt solid #cbd5e1; padding: 6pt 8pt; text-align: left; }
    .tabela-quesitos th { background-color: #f1f5f9; color: #334155; }
    .card-bloco { width: 100%; border-collapse: collapse; margin-bottom: 12pt; background-color: #FFFFFF; border: 1pt solid #e2e8f0; }
    .barra-ROSA { border-left: 4.5pt solid #ec4899; }
    .barra-VERDE { border-left: 4.5pt solid #22c55e; }
    .barra-AMARELO { border-left: 4.5pt solid #eab308; }
    .barra-AZUL { border-left: 4.5pt solid #0284c7; }
    .dica-box { background-color: #f8fafc; border: 1pt solid #e2e8f0; padding: 6pt 8pt; margin-bottom: 8pt; font-size: 9pt; color: #475569; border-radius: 4pt; }
    .texto-juridico { font-family: 'Segoe UI', Arial, sans-serif; font-size: 10pt; line-height: 1.65; color: #1e293b; white-space: pre-wrap; }
  `;
}

export function montarHtmlEditorialDeUmaPeca(p: PecaCatalogo): string {
  const nomesCor: Record<string, string> = {
    ROSA: "Rosa • Geral / Estrutura",
    VERDE: "Verde • Requisito da Peça",
    AMARELO: "Amarelo • Mérito Material",
    AZUL: "Azul • Constitucional"
  };

  const linhasQuesitos = p.quesitosFGV
    .map(
      q => `<tr>
        <td>${q.item}</td>
        <td style="text-align:center;"><span class="pilula pil-${q.cor}">${q.cor}</span></td>
        <td style="text-align:center; font-weight:bold; color:#15803d;">${q.pts} pt</td>
      </tr>`
    )
    .join('');

  const cartoesBlocos = p.blocos
    .map(
      b => `<table class="card-bloco barra-${b.cor}">
        <tr>
          <td style="padding: 12pt 14pt;">
            <table style="width:100%; border-collapse:collapse; margin-bottom:6pt;">
              <tr>
                <td style="font-size:11pt; font-weight:bold; color:#1e293b;">${b.titulo}</td>
                <td style="text-align:right;"><span class="pilula pil-${b.cor}">${nomesCor[b.cor] || b.cor}</span></td>
              </tr>
            </table>
            <div class="dica-box">💡 <strong>Como pontuar na FGV:</strong> ${b.dica}</div>
            <div class="texto-juridico">${b.texto.replace(/\n/g, '<br>')}</div>
          </td>
        </tr>
      </table>`
    )
    .join('');

  return `<div class="folha-word">
    <div class="cabecalho-peca">
      <span class="pilula pil-VERDE">${p.tipo} • ${p.examesCobrados}</span>
      <div class="titulo-peca">${p.nome}</div>
      <div class="subtitulo-peca">${p.baseLegal}</div>
    </div>
    <table class="tabela-quesitos">
      <thead>
        <tr>
          <th>Quesito Exigido no Espelho FGV</th>
          <th style="width:90pt; text-align:center;">Cor no Vade</th>
          <th style="width:70pt; text-align:center;">Pontos</th>
        </tr>
      </thead>
      <tbody>${linhasQuesitos}</tbody>
    </table>
    ${cartoesBlocos}
  </div>`;
}

export function baixarTodasPecasNoWord(catalogo: PecaCatalogo[]): void {
  const todasSecoes = catalogo
    .map((p, idx) => montarHtmlEditorialDeUmaPeca(p) + (idx < catalogo.length - 1 ? '<br clear="all" style="page-break-before:always">' : ''))
    .join('');
  const htmlWord = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset="utf-8"><title>Apostila de Peças Tributárias FGV</title><style>${obterCssEditorialWord()}</style></head>
    <body>${todasSecoes}</body>
  </html>`;
  const blob = new Blob(['\ufeff', htmlWord], { type: 'application/msword;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'Apostila_Pecas_FGV.doc';
  a.click();
}

export function exportarRedacaoNoWord(texto: string): void {
  const textoFormatado = texto.replace(/\n/g, '<br>');
  const htmlWord = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset="utf-8"><title>Caderno de Textos Definitivos FGV</title><style>${obterCssEditorialWord()}</style></head>
    <body>
      <div class="folha-word">
        <div class="titulo-peca">Caderno de Textos Definitivos — OAB 2ª Fase Direito Tributário</div>
        <p style="font-size:10pt; color:#64748b; margin-bottom:12pt;">Simulador Oficial Padrão 150 Linhas FGV</p>
        <table class="card-bloco barra-VERDE">
          <tr>
            <td style="padding:14pt;" class="texto-juridico">${textoFormatado || 'Nenhum texto preenchido.'}</td>
          </tr>
        </table>
      </div>
    </body>
  </html>`;
  const blob = new Blob(['\ufeff', htmlWord], { type: 'application/msword;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'Redacao_FGV_150Linhas.doc';
  a.click();
}

export function exportarFlashcardsNoWord(flashcards: { c: string; p: string; r: string }[]): void {
  const cartoesHtml = flashcards
    .map(
      c => `<table class="card-bloco barra-AMARELO">
        <tr>
          <td style="padding: 12pt 14pt;">
            <span class="pilula pil-AZUL">${c.c}</span>
            <div style="font-size:11pt; font-weight:bold; color:#1e293b; margin:8pt 0 4pt;">${c.p}</div>
            <div style="background:#f0fdf4; border:1pt solid #bbf7d0; padding:8pt; border-radius:4pt; font-size:10pt; color:#166534;">
              <strong>✓ Gabarito:</strong> ${c.r}
            </div>
          </td>
        </tr>
      </table>`
    )
    .join('');

  const htmlWord = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset="utf-8"><title>Flashcards OAB Tributário</title><style>${obterCssEditorialWord()}</style></head>
    <body>
      <div class="folha-word">
        <div class="titulo-peca">Flashcards de Repetição Espaçada — Direito Tributário FGV</div>
        <div style="margin-top:14pt;">${cartoesHtml}</div>
      </div>
    </body>
  </html>`;
  const blob = new Blob(['\ufeff', htmlWord], { type: 'application/msword;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'Flashcards_TributaOAB.doc';
  a.click();
}

export function baixarRedacaoTxt(texto: string): void {
  const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'Minha_Redacao_FGV.txt';
  a.click();
}
