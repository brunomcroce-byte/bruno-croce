import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Compass,
  Scale,
  Highlighter,
  Award,
  Layers,
  FileText,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import {
  CATALOGO_PECAS,
  SUMULAS_DATA,
  VADE_DATA,
  TESES_DATA,
  TESES_CONT,
  IMPOSTOS_DATA,
  CASOS_SIMULADO,
  CRONOGRAMA_DATA,
  FLASHCARDS_DATA
} from '../data/tributarioData';

interface BuscaGlobalModalProps {
  aberta: boolean;
  onFechar: () => void;
  onSelecionarItem: (destino: {
    aba: string;
    pecaCodigo?: string;
    sumulaNum?: string;
    casoId?: number;
    impostoNome?: string;
    vadeCor?: string;
    teseCat?: number;
    flashCat?: string;
  }) => void;
}

export function BuscaGlobalModal({ aberta, onFechar, onSelecionarItem }: BuscaGlobalModalProps) {
  const [termo, setTermo] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (aberta) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setTermo('');
    }
  }, [aberta]);

  // Resultados consolidados
  const resultados = useMemo(() => {
    const q = termo.trim().toLowerCase();
    if (q.length < 2) return null;

    // 1. Peças
    const pecas = CATALOGO_PECAS.filter(
      p => p.nome.toLowerCase().includes(q) || p.codigo.toLowerCase().includes(q) || p.baseLegal.toLowerCase().includes(q)
    ).slice(0, 4);

    // 2. Súmulas
    const sumulas = SUMULAS_DATA.filter(
      s => (s.tr + ' ' + s.num + ' ' + s.texto).toLowerCase().includes(q)
    ).slice(0, 5);

    // 3. Vade Mecum
    const vade = VADE_DATA.filter(
      v => (v.ref + ' ' + v.obs).toLowerCase().includes(q)
    ).slice(0, 5);

    // 4. Teses
    const teses = TESES_DATA.filter(
      t => (t.t + ' ' + t.s.map(x => x.join(' ')).join(' ')).toLowerCase().includes(q)
    ).slice(0, 4);

    // 5. Impostos
    const impostos = IMPOSTOS_DATA.filter(
      i => (i.nome + ' ' + i.desc + ' ' + i.base).toLowerCase().includes(q)
    ).slice(0, 4);

    // 6. Casos Simulador
    const casos = CASOS_SIMULADO.filter(
      c => (c.titulo + ' ' + c.enunciado).toLowerCase().includes(q)
    ).slice(0, 3);

    // 7. Flashcards
    const flashcards = FLASHCARDS_DATA.filter(
      f => (f.p + ' ' + f.r + ' ' + f.c).toLowerCase().includes(q)
    ).slice(0, 4);

    const total = pecas.length + sumulas.length + vade.length + teses.length + impostos.length + casos.length + flashcards.length;

    return { pecas, sumulas, vade, teses, impostos, casos, flashcards, total };
  }, [termo]);

  if (!aberta) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 pb-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="busca-global-title"
      onClick={e => {
        if (e.target === e.currentTarget) onFechar();
      }}
    >
      <div className="relative w-full max-w-2xl rounded-2xl border border-sky-500/70 bg-[#1e293b] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Input Bar */}
        <div className="flex items-center gap-3 border-b border-[#455468] p-3.5 bg-[#1b232e]">
          <Search className="h-5 w-5 text-sky-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={termo}
            onChange={e => setTermo(e.target.value)}
            placeholder="Digite para buscar em Peças, Súmulas, Vade Mecum, Teses, Impostos..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
            aria-label="Campo de busca integrado"
          />
          {termo && (
            <button
              onClick={() => setTermo('')}
              className="text-xs text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800"
            >
              Limpar
            </button>
          )}
          <button
            onClick={onFechar}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {!termo.trim() ? (
            <div className="text-center py-8 text-slate-400 space-y-2">
              <div className="text-3xl">🔍</div>
              <p className="font-semibold text-slate-200">Busca Global Integrada TributaOAB</p>
              <p className="text-[11px] max-w-sm mx-auto text-slate-400 leading-relaxed">
                Digite um termo como <em>"ICMS"</em>, <em>"Mandado de Segurança"</em>, <em>"Prescrição"</em>, <em>"166"</em> ou <em>"Apelação"</em> para encontrar correspondências imediatas em todas as abas.
              </p>
            </div>
          ) : resultados && resultados.total === 0 ? (
            <div className="text-center py-8 text-slate-400">
              Nenhum resultado encontrado para "{termo}". Tente outras palavras-chave.
            </div>
          ) : resultados ? (
            <div className="space-y-4">
              {/* Peças */}
              {resultados.pecas.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-sky-400 font-bold uppercase tracking-wider text-[10px] mb-2">
                    <Compass className="h-3.5 w-3.5" /> Peças Oficiais FGV ({resultados.pecas.length})
                  </div>
                  <div className="space-y-1.5">
                    {resultados.pecas.map(p => (
                      <button
                        key={p.codigo}
                        onClick={() => {
                          onSelecionarItem({ aba: 'pecas', pecaCodigo: p.codigo });
                          onFechar();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl border border-[#455468] bg-[#2b3646] hover:border-sky-400 hover:bg-[#344154] transition text-left group"
                      >
                        <div>
                          <div className="font-bold text-white group-hover:text-sky-300 transition">
                            {p.nome}
                          </div>
                          <div className="text-[11px] text-slate-300">{p.baseLegal}</div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-sky-300 transition shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Súmulas */}
              {resultados.sumulas.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wider text-[10px] mb-2">
                    <Scale className="h-3.5 w-3.5" /> Súmulas STF / STJ ({resultados.sumulas.length})
                  </div>
                  <div className="space-y-1.5">
                    {resultados.sumulas.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          onSelecionarItem({ aba: 'sumulas', sumulaNum: s.num });
                          onFechar();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl border border-[#455468] bg-[#2b3646] hover:border-emerald-400 hover:bg-[#344154] transition text-left group"
                      >
                        <div className="pr-2">
                          <div className="flex items-center gap-1.5 flex-wrap mb-1">
                            <span className={`badge ${s.tr === 'SV' ? 'b-ROSA' : s.tr === 'STF' ? 'b-VERDE' : 'b-AZUL'}`}>
                              {s.tr === 'SV' ? `Súmula Vinculante ${s.num}` : `Súmula ${s.tr} ${s.num}`}
                            </span>
                            {s.recente && (
                              <span className="badge bg-amber-400/20 text-amber-300 border border-amber-400 text-[9px] font-bold">
                                ⚡ Recente
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-200 line-clamp-1">{s.texto}</div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-300 transition shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Vade Mecum */}
              {resultados.vade.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wider text-[10px] mb-2">
                    <Highlighter className="h-3.5 w-3.5" /> Vade Mecum & Artigos Marcados ({resultados.vade.length})
                  </div>
                  <div className="space-y-1.5">
                    {resultados.vade.map((v, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          onSelecionarItem({ aba: 'vademecum', vadeCor: v.cor });
                          onFechar();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl border border-[#455468] bg-[#2b3646] hover:border-amber-400 hover:bg-[#344154] transition text-left group"
                      >
                        <div className="pr-2">
                          <div className="flex items-center gap-1.5">
                            <span className={`badge b-${v.cor}`}>{v.cor}</span>
                            <span className="font-bold text-white group-hover:text-amber-200 transition">
                              {v.ref}
                            </span>
                          </div>
                          {v.obs && <div className="text-[11px] text-slate-300 mt-1 line-clamp-1">{v.obs}</div>}
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-amber-300 transition shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Teses */}
              {resultados.teses.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-pink-400 font-bold uppercase tracking-wider text-[10px] mb-2">
                    <Award className="h-3.5 w-3.5" /> Teses Frequentes de Peça ({resultados.teses.length})
                  </div>
                  <div className="space-y-1.5">
                    {resultados.teses.map((t, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          onSelecionarItem({ aba: 'teses', teseCat: t.c });
                          onFechar();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl border border-[#455468] bg-[#2b3646] hover:border-pink-400 hover:bg-[#344154] transition text-left group"
                      >
                        <div>
                          <div className="font-bold text-white group-hover:text-pink-300 transition line-clamp-1">
                            {t.t}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {TESES_CONT[t.c]} • Cobrada {t.n}x (OAB {t.e})
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-pink-300 transition shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Impostos */}
              {resultados.impostos.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-blue-400 font-bold uppercase tracking-wider text-[10px] mb-2">
                    <Layers className="h-3.5 w-3.5" /> Competência e Impostos ({resultados.impostos.length})
                  </div>
                  <div className="space-y-1.5">
                    {resultados.impostos.map((imp, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          onSelecionarItem({ aba: 'impostos', impostoNome: imp.ente });
                          onFechar();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl border border-[#455468] bg-[#2b3646] hover:border-blue-400 hover:bg-[#344154] transition text-left group"
                      >
                        <div>
                          <div className="font-bold text-white group-hover:text-blue-300 transition">
                            {imp.nome} <span className="font-mono text-[10px] text-sky-300">({imp.base})</span>
                          </div>
                          <div className="text-[11px] text-slate-300 line-clamp-1">{imp.desc}</div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-300 transition shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Casos do Simulador */}
              {resultados.casos.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-purple-400 font-bold uppercase tracking-wider text-[10px] mb-2">
                    <FileText className="h-3.5 w-3.5" /> Casos no Simulador 150L ({resultados.casos.length})
                  </div>
                  <div className="space-y-1.5">
                    {resultados.casos.map(c => (
                      <button
                        key={c.id}
                        onClick={() => {
                          onSelecionarItem({ aba: 'simulador', casoId: c.id });
                          onFechar();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl border border-[#455468] bg-[#2b3646] hover:border-purple-400 hover:bg-[#344154] transition text-left group"
                      >
                        <div>
                          <div className="font-bold text-white group-hover:text-purple-300 transition">
                            {c.titulo}
                          </div>
                          <div className="text-[11px] text-slate-300 line-clamp-1">{c.enunciado}</div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-purple-300 transition shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Flashcards */}
              {resultados.flashcards.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-yellow-400 font-bold uppercase tracking-wider text-[10px] mb-2">
                    <Sparkles className="h-3.5 w-3.5" /> Flashcards ({resultados.flashcards.length})
                  </div>
                  <div className="space-y-1.5">
                    {resultados.flashcards.map((f, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          onSelecionarItem({ aba: 'flashcards', flashCat: f.c });
                          onFechar();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl border border-[#455468] bg-[#2b3646] hover:border-yellow-400 hover:bg-[#344154] transition text-left group"
                      >
                        <div>
                          <div className="font-bold text-white group-hover:text-yellow-300 transition line-clamp-1">
                            {f.p}
                          </div>
                          <div className="text-[11px] text-emerald-300 line-clamp-1">✓ {f.r}</div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-yellow-300 transition shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer shortcuts info */}
        <div className="flex items-center justify-between border-t border-[#455468] px-4 py-2 bg-[#1b232e] text-[11px] text-slate-400">
          <span>Use <strong>Esc</strong> para fechar</span>
          <span>Navegue direto para qualquer peça, artigo ou súmula</span>
        </div>
      </div>
    </div>
  );
}
