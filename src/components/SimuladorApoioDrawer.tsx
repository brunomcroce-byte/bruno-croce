import React, { useState } from 'react';
import {
  BookOpen,
  Scale,
  Award,
  Highlighter,
  FileCheck2,
  Plus,
  Search,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ExternalLink,
  Download
} from 'lucide-react';
import {
  CATALOGO_PECAS,
  SUMULAS_DATA,
  TESES_DATA,
  VADE_DATA,
  PecaCatalogo
} from '../data/tributarioData';
import { exportarEsqueletoParaPdf } from '../utils/exportPdf';

interface SimuladorApoioDrawerProps {
  pecaAtual: PecaCatalogo;
  onInserirTexto: (texto: string) => void;
  onSalvarNoPlanner: () => void;
  onNavegarParaAba: (aba: string) => void;
}

export function SimuladorApoioDrawer({
  pecaAtual,
  onInserirTexto,
  onSalvarNoPlanner,
  onNavegarParaAba
}: SimuladorApoioDrawerProps) {
  const [abaAtiva, setAbaAtiva] = useState<'esqueleto' | 'sumulas' | 'teses' | 'vade'>('esqueleto');
  const [busca, setBusca] = useState('');
  const [expandido, setExpandido] = useState(true);
  const [apenasRecentes, setApenasRecentes] = useState(false);

  return (
    <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 p-4 shadow-sm space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="badge b-AZUL text-[10px]">Apoio Integrado</span>
          <h4 className="text-xs font-bold text-zinc-900 dark:text-white">Central de Fundamentação da Peça</h4>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onSalvarNoPlanner}
            className="rounded-full border border-emerald-400 bg-emerald-600/80 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-500 transition inline-flex items-center gap-1 shadow-sm"
            title="Registrar esta simulação no Planner Diário"
          >
            <FileCheck2 className="h-3 w-3" /> Registrar no Planner
          </button>
          <button
            onClick={() => setExpandido(!expandido)}
            className="rounded-lg p-1 text-zinc-600 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/10"
          >
            {expandido ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {expandido && (
        <>
          {/* Sub Navigation */}
          <div className="flex items-center gap-1.5 border-b border-black/10 dark:border-white/10 pb-2 flex-wrap">
            <button
              onClick={() => { setAbaAtiva('esqueleto'); setBusca(''); }}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition inline-flex items-center gap-1 ${
                abaAtiva === 'esqueleto'
                  ? 'bg-sky-600 text-white border border-sky-400'
                  : 'bg-slate-100 dark:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700'
              }`}
            >
              <BookOpen className="h-3 w-3" /> 1. Esqueleto ({pecaAtual.nome.split(' ')[0]})
            </button>

            <button
              onClick={() => { setAbaAtiva('sumulas'); setBusca(''); }}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition inline-flex items-center gap-1 ${
                abaAtiva === 'sumulas'
                  ? 'bg-emerald-600 text-white border border-emerald-400'
                  : 'bg-slate-100 dark:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700'
              }`}
            >
              <Scale className="h-3 w-3" /> 2. Citar Súmulas
            </button>

            <button
              onClick={() => { setAbaAtiva('teses'); setBusca(''); }}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition inline-flex items-center gap-1 ${
                abaAtiva === 'teses'
                  ? 'bg-pink-600 text-white border border-pink-400'
                  : 'bg-slate-100 dark:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700'
              }`}
            >
              <Award className="h-3 w-3" /> 3. Inserir Teses
            </button>

            <button
              onClick={() => { setAbaAtiva('vade'); setBusca(''); }}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition inline-flex items-center gap-1 ${
                abaAtiva === 'vade'
                  ? 'bg-amber-600 text-white border border-amber-400'
                  : 'bg-slate-100 dark:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700'
              }`}
            >
              <Highlighter className="h-3 w-3" /> 4. Vade Mecum
            </button>
          </div>

          {/* Search bar inside drawer (for sumulas, teses, vade) */}
          {abaAtiva !== 'esqueleto' && (
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-zinc-400" />
                <input
                  type="text"
                  value={busca}
                  onChange={e => setBusca(e.target.value)}
                  placeholder={`Pesquisar em ${abaAtiva}...`}
                  className="w-full rounded-lg border border-black/15 dark:border-white/15 bg-slate-50 dark:bg-zinc-900 pl-8 pr-3 py-1.5 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-sky-400"
                />
              </div>
              {abaAtiva === 'sumulas' && (
                <button
                  onClick={() => setApenasRecentes(!apenasRecentes)}
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold shrink-0 transition flex items-center gap-1 cursor-pointer ${
                    apenasRecentes
                      ? 'bg-amber-500 text-slate-950 font-bold border border-amber-300 shadow-sm'
                      : 'border border-amber-500/50 bg-slate-100 dark:bg-zinc-900 text-amber-600 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/40'
                  }`}
                  title="Filtrar súmulas recentes dos últimos 6 meses"
                >
                  <span>{apenasRecentes ? '✓ Recentes' : '⚡ Recentes (6m)'}</span>
                </button>
              )}
            </div>
          )}

          {/* Content: Esqueleto */}
          {abaAtiva === 'esqueleto' && (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              <div className="text-[11px] text-zinc-700 dark:text-slate-300 bg-slate-100 dark:bg-zinc-900 p-2.5 rounded-xl border border-black/10 dark:border-white/10 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <strong>Peça ativa:</strong> {pecaAtual.nome} ({pecaAtual.baseLegal})
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => exportarEsqueletoParaPdf(pecaAtual)}
                    className="text-rose-600 dark:text-rose-400 hover:text-rose-500 inline-flex items-center gap-1 text-[10.5px] font-semibold cursor-pointer"
                    title="Baixar esqueleto completo desta peça em PDF para estudo offline"
                  >
                    <Download className="h-3 w-3" /> Baixar PDF
                  </button>
                  <button
                    onClick={() => onNavegarParaAba('pecas')}
                    className="text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1 text-[10px] cursor-pointer"
                  >
                    Ver no Catálogo <ExternalLink className="h-2.5 w-2.5" />
                  </button>
                </div>
              </div>

              {pecaAtual.blocos.map((bloco, bIdx) => (
                <div key={bIdx} className="rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-zinc-700/60 p-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-sky-600 dark:text-sky-300">{bloco.titulo}</span>
                    <button
                      onClick={() => onInserirTexto(`\n\n${bloco.titulo}\n${bloco.texto}\n`)}
                      className="rounded bg-sky-600 px-2 py-0.5 text-[10px] font-semibold text-white hover:bg-sky-500 inline-flex items-center gap-1"
                      title="Inserir este bloco no texto da redação"
                    >
                      <Plus className="h-2.5 w-2.5" /> Inserir Bloco
                    </button>
                  </div>
                  <p className="text-[11px] text-zinc-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {bloco.texto}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Content: Súmulas */}
          {abaAtiva === 'sumulas' && (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {SUMULAS_DATA.filter(
                s =>
                  (!apenasRecentes || Boolean(s.recente)) &&
                  (s.tr + ' ' + s.num + ' ' + s.texto + ' ' + (s.tema || '')).toLowerCase().includes(busca.toLowerCase())
              ).slice(0, 25).map((sum, idx) => {
                const label = sum.tr === 'SV' ? `Súmula Vinculante ${sum.num}` : `Súmula ${sum.tr} ${sum.num}`;
                const citacao = `\n\nNesse sentido, prevê a ${label}: "${sum.texto}".\n`;
                const isRecente = Boolean(sum.recente);
                return (
                  <div
                    key={idx}
                    className={`rounded-xl border p-2.5 flex items-start justify-between gap-2 transition ${
                      isRecente
                        ? 'border-amber-400/60 bg-gradient-to-b from-amber-500/10 dark:from-[#344154] to-transparent dark:to-[#273240] ring-1 ring-amber-400/20'
                        : 'border-black/10 dark:border-white/10 bg-slate-50 dark:bg-zinc-700/60'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <span className={`badge ${sum.tr === 'SV' ? 'b-ROSA' : sum.tr === 'STF' ? 'b-VERDE' : 'b-AZUL'} text-[9px]`}>
                          {label}
                        </span>
                        {isRecente && (
                          <span className="badge bg-amber-400/20 text-amber-600 dark:text-amber-300 border border-amber-400 text-[9px] font-bold">
                            ⚡ Recente ({sum.dataInfo || 'Últimos 6m'})
                          </span>
                        )}
                      </div>
                      {sum.tema && (
                        <div className="text-[10px] text-sky-600 dark:text-sky-300 font-bold mb-1">
                          📌 {sum.tema}
                        </div>
                      )}
                      <p className="text-[11px] text-zinc-700 dark:text-slate-200 leading-snug">{sum.texto}</p>
                    </div>
                    <button
                      onClick={() => onInserirTexto(citacao)}
                      className="rounded bg-emerald-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-emerald-500 shrink-0 inline-flex items-center gap-1 shadow-sm"
                      title="Inserir citação desta súmula no texto"
                    >
                      <Plus className="h-2.5 w-2.5" /> Citar
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Content: Teses */}
          {abaAtiva === 'teses' && (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {TESES_DATA.filter(
                t => (t.t + ' ' + t.s.map(x => x.join(' ')).join(' ')).toLowerCase().includes(busca.toLowerCase())
              ).slice(0, 10).map((tese, idx) => {
                const textoTese = `\n\nDO DIREITO: ${tese.t.toUpperCase()}\n${tese.s.map(sub => `${sub[0]}: ${sub[1]}`).join('\n')}\n`;
                return (
                  <div key={idx} className="rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-zinc-700/60 p-2.5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-pink-600 dark:text-pink-300">{tese.t}</span>
                      <button
                        onClick={() => onInserirTexto(textoTese)}
                        className="rounded bg-pink-600 px-2 py-0.5 text-[10px] font-bold text-white hover:bg-pink-500 inline-flex items-center gap-1"
                        title="Inserir esta tese no mérito da redação"
                      >
                        <Plus className="h-2.5 w-2.5" /> Inserir Tese
                      </button>
                    </div>
                    <div className="text-[10px] text-amber-600 dark:text-amber-300 font-mono mb-1">
                      Cobrada {tese.n}x (OAB {tese.e})
                    </div>
                    <p className="text-[11px] text-zinc-600 dark:text-slate-300 line-clamp-2">
                      {tese.s[0]?.[1]}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Content: Vade Mecum */}
          {abaAtiva === 'vade' && (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {VADE_DATA.filter(
                v => (v.ref + ' ' + v.obs).toLowerCase().includes(busca.toLowerCase())
              ).slice(0, 15).map((vade, idx) => {
                const citacao = `\n\nConforme preconiza o ${vade.ref}${vade.obs ? ` (${vade.obs})` : ''}.\n`;
                return (
                  <div key={idx} className="rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-zinc-700/60 p-2.5 flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`badge b-${vade.cor} text-[9px]`}>{vade.cor}</span>
                        <strong className="text-xs text-zinc-900 dark:text-white">{vade.ref}</strong>
                      </div>
                      {vade.obs && <p className="text-[11px] text-zinc-600 dark:text-slate-300 mt-1">{vade.obs}</p>}
                    </div>
                    <button
                      onClick={() => onInserirTexto(citacao)}
                      className="rounded bg-amber-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-amber-500 shrink-0 inline-flex items-center gap-1"
                      title="Inserir referência no texto"
                    >
                      <Plus className="h-2.5 w-2.5" /> Citar
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
