import React, { useState } from 'react';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Scale,
  Award,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  Copy,
  Check,
  Zap,
  Info
} from 'lucide-react';
import { ResultadoAnalisePeca, SugestaoPeca } from '../utils/pecaAnalyzer';

interface SimuladorAnalisePecaCardProps {
  analise: ResultadoAnalisePeca;
  onAdotarEsqueleto: (esqueleto: string, nomePeca: string) => void;
  onNavegarParaCatalogo: (codigoPeca: string) => void;
}

export const SimuladorAnalisePecaCard: React.FC<SimuladorAnalisePecaCardProps> = ({
  analise,
  onAdotarEsqueleto,
  onNavegarParaCatalogo
}) => {
  const [expandido, setExpandido] = useState(true);
  const [mostrarAlternativas, setMostrarAlternativas] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const peca = analise.pecaMaisProvavel;
  if (!peca) return null;

  const copiarFundamentos = () => {
    const texto = `[Análise de Peça FGV] ${peca.nome}\nBase Legal: ${peca.baseLegal}\nJustificativa: ${peca.justificativaCabimento}\nArtigos: ${peca.artigosFundamentais.join(', ')}`;
    navigator.clipboard.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const corBadgeConfianca =
    peca.nivelConfianca === 'MUITO ALTA'
      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
      : peca.nivelConfianca === 'ALTA'
      ? 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30'
      : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30';

  return (
    <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/80 dark:bg-[#202022]/85 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.35)] overflow-hidden transition-all duration-200">
      {/* Header com estilo macOS Toolbar */}
      <div className="px-4 py-3 border-b border-black/5 dark:border-white/10 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-transparent dark:from-blue-950/25 dark:via-indigo-950/15 dark:to-transparent flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#007aff] to-[#5856d6] text-white shadow-xs">
            <Sparkles className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <span>Análise de Peça em Tempo Real</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-bold">
                  Histórico FGV
                </span>
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Momento detectado: <strong className="text-zinc-700 dark:text-zinc-300 font-medium">{analise.momentoProcessual}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${corBadgeConfianca}`}
          >
            {peca.probabilidade}% {peca.nivelConfianca}
          </span>
          <button
            type="button"
            onClick={() => setExpandido(!expandido)}
            className="p-1 rounded-md text-zinc-500 hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer"
            aria-label={expandido ? 'Recolher análise' : 'Expandir análise'}
          >
            {expandido ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Conteúdo Principal */}
      {expandido && (
        <div className="p-4 space-y-3.5 text-xs">
          {/* Peça Recomendada em Destaque */}
          <div className="rounded-xl border border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/20 p-3.5 space-y-2">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Peça Cabível Recomendada:
                </span>
                <h4 className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
                  <Scale className="h-4 w-4 text-[#007aff]" />
                  <span>{peca.nome}</span>
                  <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">
                    ({peca.tipo})
                  </span>
                </h4>
                <div className="text-[11px] font-mono text-zinc-600 dark:text-zinc-300 mt-0.5">
                  Base Legal: <strong>{peca.baseLegal}</strong>
                </div>
              </div>

              {/* Botão de Adotar Esqueleto com 1 clique */}
              <button
                type="button"
                onClick={() => onAdotarEsqueleto(peca.esqueletoRecomendado, peca.nome)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#007aff] hover:bg-[#0062cc] text-white font-semibold text-xs transition shadow-xs active:scale-95 cursor-pointer"
                title="Carregar o esqueleto estrutural completo desta peça no simulador"
              >
                <Zap className="h-3.5 w-3.5" />
                <span>Aplicar Esqueleto na Folha</span>
              </button>
            </div>

            {/* Barra de Probabilidade Estilo Apple */}
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-[10.5px] text-zinc-600 dark:text-zinc-400">
                <span>Aderência aos fatos narrados e jurisprudência FGV</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{peca.probabilidade}% de certeza</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-200/80 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#007aff] to-[#5856d6] rounded-full transition-all duration-500"
                  style={{ width: `${peca.probabilidade}%` }}
                />
              </div>
            </div>

            <p className="text-[11.5px] text-zinc-700 dark:text-zinc-300 leading-relaxed pt-1">
              {peca.justificativaCabimento}
            </p>
          </div>

          {/* Gatilhos Fáticos Identificados */}
          {peca.gatilhosDetectados.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                <span>Gatilhos fáticos identificados no enunciado / redação:</span>
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {peca.gatilhosDetectados.map((g, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 px-2 py-0.5 text-[10.5px] font-medium"
                  >
                    ✓ {g}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Incidência Histórica nos Exames OAB */}
          <div className="rounded-xl border border-black/5 dark:border-white/10 bg-zinc-50/80 dark:bg-zinc-900/40 p-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-500 shrink-0" />
              <div className="text-[11px] text-zinc-600 dark:text-zinc-300">
                <strong className="text-zinc-900 dark:text-zinc-100">Frequência FGV:</strong> {peca.examesCobrados}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavegarParaCatalogo(peca.codigo)}
              className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline shrink-0 inline-flex items-center gap-0.5"
            >
              <span>Ver Modelo Oficial</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {/* Dicas Estratégicas para Não Zerar Quesitos */}
          <div className="rounded-xl border border-black/5 dark:border-white/10 bg-zinc-50/80 dark:bg-zinc-900/40 p-3 space-y-1.5">
            <div className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-blue-500" />
              <span>Dicas Cruciais da Banca FGV para {peca.nome}:</span>
            </div>
            <ul className="space-y-1 pl-4 list-disc text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {peca.dicasRedacao.map((dica, idx) => (
                <li key={idx}>{dica}</li>
              ))}
            </ul>
          </div>

          {/* Alternativas e Comparativo Heurístico */}
          {analise.segundaOpcao && (
            <div className="pt-1 border-t border-black/5 dark:border-white/10">
              <button
                type="button"
                onClick={() => setMostrarAlternativas(!mostrarAlternativas)}
                className="w-full flex items-center justify-between text-[11px] text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition py-1 cursor-pointer"
              >
                <span>
                  {mostrarAlternativas ? 'Ocultar outras hipóteses' : `Comparar com outras hipóteses (${analise.segundaOpcao.nome} ${analise.segundaOpcao.probabilidade}%)`}
                </span>
                {mostrarAlternativas ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>

              {mostrarAlternativas && (
                <div className="mt-2 space-y-2 pt-1">
                  {[analise.segundaOpcao, analise.terceiraOpcao].filter(Boolean).map((alt) => {
                    if (!alt) return null;
                    return (
                      <div
                        key={alt.codigo}
                        className="p-2.5 rounded-lg border border-black/5 dark:border-white/5 bg-zinc-100/60 dark:bg-zinc-900/30 flex items-center justify-between gap-2"
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-zinc-800 dark:text-zinc-200">{alt.nome}</span>
                            <span className="text-[10px] text-zinc-500 font-mono">({alt.probabilidade}%)</span>
                          </div>
                          <div className="text-[10.5px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
                            {alt.justificativaCabimento}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => onAdotarEsqueleto(alt.esqueletoRecomendado, alt.nome)}
                          className="px-2 py-1 rounded-md text-[10px] font-bold text-zinc-700 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 shrink-0"
                        >
                          Adotar
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Rodapé com botão de copiar fundamentação */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[10.5px] text-zinc-400">
              Análise atualizada dinamicamente a cada parágrafo redigido.
            </span>
            <button
              type="button"
              onClick={copiarFundamentos}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-600 dark:text-zinc-300 hover:text-[#007aff] transition cursor-pointer"
            >
              {copiado ? (
                <>
                  <Check className="h-3 w-3 text-emerald-500" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copiar Fundamentação</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
