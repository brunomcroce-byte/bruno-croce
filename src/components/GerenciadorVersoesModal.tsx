import React, { useState, useMemo } from 'react';
import {
  History,
  GitCompare,
  Plus,
  Trash2,
  RotateCcw,
  Copy,
  Check,
  X,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  Split,
  Eye,
  Bookmark,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { computeLineDiff, buildSideBySideDiff, DiffLine } from '../utils/diff';

export interface VersaoRedacao {
  id: string;
  casoId: number;
  casoTitulo: string;
  nome: string;
  descricao?: string;
  texto: string;
  criadoEm: string;
  linhasCount: number;
  palavrasCount: number;
  tag: 'esqueleto' | 'preliminares' | 'merito' | 'revisao' | 'final';
}

interface GerenciadorVersoesModalProps {
  aberta: boolean;
  onFechar: () => void;
  textoAtual: string;
  casoIndexAtual: number;
  casoTituloAtual: string;
  versoes: VersaoRedacao[];
  onSalvarVersao: (dados: { nome: string; descricao?: string; tag: VersaoRedacao['tag'] }) => void;
  onRestaurarVersao: (versao: VersaoRedacao) => void;
  onExcluirVersao: (id: string) => void;
}

const TAG_CONFIG: Record<
  VersaoRedacao['tag'],
  { label: string; bg: string; text: string; border: string }
> = {
  esqueleto: { label: 'Esqueleto', bg: 'bg-blue-500/15', text: 'text-blue-300', border: 'border-blue-500/40' },
  preliminares: { label: 'Preliminares', bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/40' },
  merito: { label: 'Mérito & Leis', bg: 'bg-purple-500/15', text: 'text-purple-300', border: 'border-purple-500/40' },
  revisao: { label: 'Revisão', bg: 'bg-sky-500/15', text: 'text-sky-300', border: 'border-sky-500/40' },
  final: { label: 'Peça Definitiva', bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/40' }
};

export const GerenciadorVersoesModal: React.FC<GerenciadorVersoesModalProps> = ({
  aberta,
  onFechar,
  textoAtual,
  casoIndexAtual,
  casoTituloAtual,
  versoes,
  onSalvarVersao,
  onRestaurarVersao,
  onExcluirVersao
}) => {
  const [abaAtiva, setAbaAtiva] = useState<'versoes' | 'diff'>('versoes');
  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novaDescricao, setNovaDescricao] = useState('');
  const [novaTag, setNovaTag] = useState<VersaoRedacao['tag']>('revisao');

  // Seleções para comparação Diff
  const [idVersaoBase, setIdVersaoBase] = useState<string>('primeira');
  const [idVersaoAlvo, setIdVersaoAlvo] = useState<string>('atual');
  const [modoDiffVisualizacao, setModoDiffVisualizacao] = useState<'unificado' | 'lado-a-lado'>('unificado');
  const [ocultarInalteradas, setOcultarInalteradas] = useState(false);
  const [copiadoId, setCopiadoId] = useState<string | null>(null);

  // Inicializa a seleção de versões para comparação quando abrir
  useMemo(() => {
    if (versoes.length > 0) {
      if (idVersaoBase === 'primeira') {
        setIdVersaoBase(versoes[0].id);
      }
    }
  }, [versoes]);

  // Filtra as versões do caso atual e demais casos
  const versoesCasoAtual = useMemo(() => {
    return versoes.filter(v => v.casoId === casoIndexAtual);
  }, [versoes, casoIndexAtual]);

  // Conteúdo da versão base para o diff
  const textoBase = useMemo(() => {
    if (idVersaoBase === 'atual') return textoAtual;
    const v = versoes.find(item => item.id === idVersaoBase);
    return v ? v.texto : (versoes[0]?.texto || '');
  }, [idVersaoBase, versoes, textoAtual]);

  // Conteúdo da versão alvo para o diff
  const textoAlvo = useMemo(() => {
    if (idVersaoAlvo === 'atual') return textoAtual;
    const v = versoes.find(item => item.id === idVersaoAlvo);
    return v ? v.texto : textoAtual;
  }, [idVersaoAlvo, versoes, textoAtual]);

  // Execução do algoritmo de Diff
  const diffResultado = useMemo(() => {
    return computeLineDiff(textoBase, textoAlvo);
  }, [textoBase, textoAlvo]);

  // Linhas formatadas para visualização lado a lado
  const sideBySideRows = useMemo(() => {
    return buildSideBySideDiff(diffResultado.lines);
  }, [diffResultado.lines]);

  if (!aberta) return null;

  const handleSalvarNovaVersao = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNome.trim()) return;

    onSalvarVersao({
      nome: novoNome.trim(),
      descricao: novaDescricao.trim() || undefined,
      tag: novaTag
    });

    setNovoNome('');
    setNovaDescricao('');
    setModalNovoAberto(false);
  };

  const handleCopiarTexto = (texto: string, id: string) => {
    navigator.clipboard.writeText(texto);
    setCopiadoId(id);
    setTimeout(() => setCopiadoId(null), 2000);
  };

  const iniciarComparacao = (versaoId: string) => {
    setIdVersaoBase(versaoId);
    setIdVersaoAlvo('atual');
    setAbaAtiva('diff');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="flex flex-col h-[92vh] max-h-[850px] w-full max-w-5xl rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden text-zinc-900 dark:text-zinc-100">
        {/* Header do Gerenciador de Versões */}
        <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 bg-slate-50 dark:bg-zinc-800 px-5 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-sky-600 text-white shadow-md">
              <History className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-zinc-900 dark:text-white">Versões de Redação & Diff</h2>
                <span className="rounded-full bg-sky-50 dark:bg-sky-950/80 border border-sky-400 dark:border-sky-500/40 px-2 py-0.5 text-[10px] font-mono font-semibold text-sky-700 dark:text-sky-300">
                  {versoes.length} {versoes.length === 1 ? 'versão salva' : 'versões salvas'}
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-slate-400">
                Caso Ativo: <span className="font-semibold text-zinc-700 dark:text-slate-200">{casoTituloAtual}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setModalNovoAberto(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-sky-600 hover:bg-sky-500 px-3.5 py-1.5 text-xs font-bold text-white transition shadow-sm cursor-pointer active:scale-95"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Salvar Versão Atual</span>
            </button>
            <button
              onClick={onFechar}
              className="rounded-full p-1.5 text-zinc-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-zinc-700 dark:hover:text-white transition cursor-pointer"
              title="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher: Lista de Versões vs Comparador Diff */}
        <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 bg-slate-100/80 dark:bg-zinc-900/90 px-5 py-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAbaAtiva('versoes')}
              className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                abaAtiva === 'versoes'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-zinc-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-zinc-900 dark:hover:text-slate-200'
              }`}
            >
              <History className="h-3.5 w-3.5" />
              <span>Histórico de Versões ({versoes.length})</span>
            </button>

            <button
              onClick={() => setAbaAtiva('diff')}
              className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                abaAtiva === 'diff'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-zinc-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-zinc-900 dark:hover:text-slate-200'
              }`}
            >
              <GitCompare className="h-3.5 w-3.5" />
              <span>Comparador de Mudanças (Diff)</span>
            </button>
          </div>

          {abaAtiva === 'diff' && (
            <div className="flex items-center gap-2">
              {/* Alternador Lado a Lado / Unificado */}
              <div className="flex items-center rounded-lg border border-black/10 dark:border-white/10 bg-slate-200/80 dark:bg-zinc-800 p-0.5 text-[11px]">
                <button
                  onClick={() => setModoDiffVisualizacao('unificado')}
                  className={`rounded-md px-2.5 py-1 font-semibold transition cursor-pointer ${
                    modoDiffVisualizacao === 'unificado'
                      ? 'bg-sky-600 text-white'
                      : 'text-zinc-600 dark:text-slate-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  Unificado
                </button>
                <button
                  onClick={() => setModoDiffVisualizacao('lado-a-lado')}
                  className={`rounded-md px-2.5 py-1 font-semibold transition cursor-pointer ${
                    modoDiffVisualizacao === 'lado-a-lado'
                      ? 'bg-sky-600 text-white'
                      : 'text-zinc-600 dark:text-slate-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  Lado a Lado
                </button>
              </div>

              {/* Filtro: Ocultar Inalteradas */}
              <button
                onClick={() => setOcultarInalteradas(!ocultarInalteradas)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold border transition cursor-pointer ${
                  ocultarInalteradas
                    ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/50'
                    : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-slate-400 border-black/10 dark:border-white/10 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {ocultarInalteradas ? 'Mostrando só diferenças' : 'Todas as linhas'}
              </button>
            </div>
          )}
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* ================= ABA 1: HISTÓRICO DE VERSÕES ================= */}
          {abaAtiva === 'versoes' && (
            <div className="space-y-4">
              {/* Banner Informativo / Rápido */}
              <div className="flex items-center justify-between rounded-xl border border-sky-500/30 bg-sky-50 dark:bg-sky-950/20 p-3.5 text-xs text-zinc-700 dark:text-slate-300">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="h-4 w-4 text-sky-600 dark:text-sky-400 shrink-0" />
                  <span>
                    O histórico permite salvar checkpoints da sua peça antes de grandes alterações, garantindo que nenhum argumento ou preliminar seja perdido.
                  </span>
                </div>
                <div className="text-[11px] font-mono text-sky-700 dark:text-sky-300 shrink-0 ml-3 font-bold">
                  Editor atual: {textoAtual.split('\n').length} linhas
                </div>
              </div>

              {versoes.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-black/15 dark:border-white/15 bg-slate-50 dark:bg-zinc-900/50 p-12 text-center space-y-3">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-zinc-800 text-zinc-400">
                    <History className="h-7 w-7 text-sky-600 dark:text-sky-400" />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Nenhuma versão salva até o momento</h3>
                  <p className="text-xs text-zinc-500 dark:text-slate-400 max-w-md mx-auto">
                    Salve sua redação atual como a primeira versão para acompanhar o progresso das suas teses, fundamentações e correções.
                  </p>
                  <button
                    onClick={() => setModalNovoAberto(true)}
                    className="inline-flex items-center gap-2 rounded-full bg-sky-600 hover:bg-sky-500 px-4 py-2 text-xs font-bold text-white transition shadow cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Salvar Versão Inicial</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {versoes.map((versao) => {
                    const tagInfo = TAG_CONFIG[versao.tag] || TAG_CONFIG.revisao;
                    const ehDoCasoAtual = versao.casoId === casoIndexAtual;

                    return (
                      <div
                        key={versao.id}
                        className={`rounded-2xl border p-4.5 transition-all shadow-sm flex flex-col justify-between space-y-3.5 ${
                          ehDoCasoAtual
                            ? 'border-black/10 dark:border-white/10 bg-slate-50 dark:bg-zinc-800 hover:border-sky-500/50'
                            : 'border-black/5 dark:border-white/5 bg-slate-100/60 dark:bg-zinc-800/50 opacity-85'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${tagInfo.bg} ${tagInfo.text} ${tagInfo.border}`}
                            >
                              {tagInfo.label}
                            </span>
                            <span className="text-[11px] font-mono text-zinc-500 dark:text-slate-400 flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {versao.criadoEm}
                            </span>
                          </div>

                          <div>
                            <h4 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                              {versao.nome}
                            </h4>
                            <p className="text-[11px] text-zinc-500 dark:text-slate-400 font-medium">
                              {versao.casoTitulo}
                            </p>
                          </div>

                          {versao.descricao && (
                            <p className="text-xs text-zinc-700 dark:text-slate-300 italic bg-white dark:bg-zinc-900 p-2 rounded-lg border border-black/5 dark:border-slate-700/60">
                              "{versao.descricao}"
                            </p>
                          )}

                          {/* Prévia das primeiras linhas */}
                          <div className="rounded-lg bg-white dark:bg-zinc-900/90 p-2.5 border border-black/10 dark:border-slate-800 text-[11px] font-mono text-zinc-700 dark:text-slate-300 line-clamp-3 leading-relaxed select-none">
                            {versao.texto.slice(0, 220) || '(Sem conteúdo)'}
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-zinc-500 dark:text-slate-400 font-mono pt-1">
                            <span>📄 {versao.linhasCount} linhas</span>
                            <span>•</span>
                            <span>✍️ {versao.palavrasCount} palavras</span>
                          </div>
                        </div>

                        {/* Botões de Ação na Versão */}
                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-black/10 dark:border-white/10">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => iniciarComparacao(versao.id)}
                              className="inline-flex items-center gap-1 rounded-lg bg-sky-50 dark:bg-sky-600/20 hover:bg-sky-100 dark:hover:bg-sky-600/30 border border-sky-400 dark:border-sky-500/40 px-2.5 py-1 text-[11px] font-semibold text-sky-700 dark:text-sky-300 transition cursor-pointer"
                              title="Comparar esta versão com o rascunho atual"
                            >
                              <GitCompare className="h-3 w-3" />
                              <span>Diff com Atual</span>
                            </button>

                            <button
                              onClick={() => onRestaurarVersao(versao)}
                              className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 dark:bg-emerald-600/20 hover:bg-emerald-100 dark:hover:bg-emerald-600/30 border border-emerald-400 dark:border-emerald-500/40 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 transition cursor-pointer"
                              title="Carregar esta versão para o editor de 150 linhas"
                            >
                              <RotateCcw className="h-3 w-3" />
                              <span>Restaurar</span>
                            </button>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleCopiarTexto(versao.texto, versao.id)}
                              className="rounded-lg p-1.5 text-zinc-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-zinc-700 dark:hover:text-white transition cursor-pointer"
                              title="Copiar texto da versão"
                            >
                              {copiadoId === versao.id ? (
                                <Check className="h-3.5 w-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>

                            <button
                              onClick={() => onExcluirVersao(versao.id)}
                              className="rounded-lg p-1.5 text-zinc-400 hover:bg-rose-500/20 hover:text-rose-500 transition cursor-pointer"
                              title="Excluir versão"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ================= ABA 2: COMPARADOR DE MUDANÇAS (DIFF) ================= */}
          {abaAtiva === 'diff' && (
            <div className="space-y-4">
              {/* Seletores de Versões para Comparação */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-2xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-zinc-800 p-4 shadow-sm">
                {/* Lado Esquerdo: Versão Base */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-slate-300 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-rose-500" />
                    Versão Base (Original / Antes)
                  </label>
                  <select
                    value={idVersaoBase}
                    onChange={e => setIdVersaoBase(e.target.value)}
                    className="w-full rounded-xl border border-black/15 dark:border-white/15 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-900 dark:text-white focus:outline-none focus:border-sky-400"
                  >
                    <option value="atual">⭐ Rascunho Atual no Editor ({textoAtual.split('\n').length} linhas)</option>
                    {versoes.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.nome} ({v.linhasCount} linhas • {v.criadoEm})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Lado Direito: Versão Alvo */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-slate-300 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Versão Alvo (Comparada / Depois)
                  </label>
                  <select
                    value={idVersaoAlvo}
                    onChange={e => setIdVersaoAlvo(e.target.value)}
                    className="w-full rounded-xl border border-black/15 dark:border-white/15 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-900 dark:text-white focus:outline-none focus:border-sky-400"
                  >
                    <option value="atual">⭐ Rascunho Atual no Editor ({textoAtual.split('\n').length} linhas)</option>
                    {versoes.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.nome} ({v.linhasCount} linhas • {v.criadoEm})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Estatísticas do Diff */}
              <div className="flex items-center justify-between flex-wrap gap-3 rounded-xl border border-black/10 dark:border-white/10 bg-slate-100 dark:bg-zinc-900 px-4 py-2.5">
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-bold text-zinc-700 dark:text-slate-300">Resumo de Alterações:</span>
                  <span className="inline-flex items-center gap-1 font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-400/40 px-2 py-0.5 rounded">
                    +{diffResultado.addedCount} {diffResultado.addedCount === 1 ? 'linha adicionada' : 'linhas adicionadas'}
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-400/40 px-2 py-0.5 rounded">
                    -{diffResultado.removedCount} {diffResultado.removedCount === 1 ? 'linha removida' : 'linhas removidas'}
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono text-zinc-500 dark:text-slate-400">
                    {diffResultado.unchangedCount} inalteradas
                  </span>
                </div>

                {/* Ação rápida para aplicar */}
                {idVersaoBase !== 'atual' && (
                  <button
                    onClick={() => {
                      const v = versoes.find(item => item.id === idVersaoBase);
                      if (v) onRestaurarVersao(v);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-500 transition cursor-pointer"
                  >
                    <RotateCcw className="h-3 w-3" /> Restaurar Versão Base no Editor
                  </button>
                )}
              </div>

              {/* Tabela / Bloco de Visualização do Diff */}
              <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-950 overflow-hidden shadow-inner font-mono text-xs">
                {modoDiffVisualizacao === 'unificado' ? (
                  /* ================= DIFF UNIFICADO ================= */
                  <div className="max-h-[500px] overflow-y-auto divide-y divide-black/5 dark:divide-slate-800/60">
                    {diffResultado.lines
                      .filter(l => !ocultarInalteradas || l.type !== 'unchanged')
                      .map((line, idx) => {
                        let rowStyle = 'bg-transparent text-zinc-800 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-slate-800/30';
                        let prefix = ' ';
                        let prefixColor = 'text-zinc-400 dark:text-slate-600';

                        if (line.type === 'added') {
                          rowStyle = 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200 border-l-4 border-emerald-500';
                          prefix = '+';
                          prefixColor = 'text-emerald-600 dark:text-emerald-400 font-bold';
                        } else if (line.type === 'removed') {
                          rowStyle = 'bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-200 border-l-4 border-rose-500';
                          prefix = '-';
                          prefixColor = 'text-rose-600 dark:text-rose-400 font-bold';
                        }

                        return (
                          <div
                            key={idx}
                            className={`flex items-start px-3 py-1 transition ${rowStyle}`}
                          >
                            <span className="w-10 shrink-0 select-none text-[10px] text-zinc-400 dark:text-slate-500 text-right pr-2">
                              {line.lineA || ''}
                            </span>
                            <span className="w-10 shrink-0 select-none text-[10px] text-zinc-400 dark:text-slate-500 text-right pr-3">
                              {line.lineB || ''}
                            </span>
                            <span className={`w-5 shrink-0 select-none ${prefixColor}`}>
                              {prefix}
                            </span>
                            <span className="flex-1 whitespace-pre-wrap break-words leading-relaxed">
                              {line.content || ' '}
                            </span>
                          </div>
                        );
                      })}

                    {diffResultado.addedCount === 0 && diffResultado.removedCount === 0 && (
                      <div className="p-8 text-center text-zinc-500 dark:text-slate-400 text-xs">
                        🎉 As duas versões comparadas são <strong className="text-emerald-600 dark:text-emerald-400">idênticas</strong>. Nenhuma linha divergente encontrada.
                      </div>
                    )}
                  </div>
                ) : (
                  /* ================= DIFF LADO A LADO ================= */
                  <div className="max-h-[500px] overflow-y-auto">
                    <div className="grid grid-cols-2 border-b border-black/10 dark:border-slate-700 bg-slate-50 dark:bg-zinc-900 px-3 py-1.5 text-[11px] font-bold text-zinc-700 dark:text-slate-300">
                      <div>Versão Base (Original)</div>
                      <div>Versão Alvo (Comparada)</div>
                    </div>
                    <div className="divide-y divide-black/5 dark:divide-slate-800/60">
                      {sideBySideRows
                        .filter(
                          r =>
                            !ocultarInalteradas ||
                            r.lineA?.type === 'removed' ||
                            r.lineB?.type === 'added'
                        )
                        .map((row, idx) => (
                          <div key={idx} className="grid grid-cols-2 divide-x divide-black/10 dark:divide-slate-800">
                            {/* Coluna Esquerda */}
                            <div
                              className={`flex items-start px-2.5 py-1 ${
                                row.lineA?.type === 'removed'
                                  ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-200 border-l-2 border-rose-500'
                                  : 'text-zinc-800 dark:text-slate-300'
                              }`}
                            >
                              <span className="w-8 shrink-0 select-none text-[10px] text-zinc-400 dark:text-slate-500 pr-2 text-right">
                                {row.lineA?.num || ''}
                              </span>
                              <span className="flex-1 whitespace-pre-wrap break-words leading-relaxed">
                                {row.lineA?.content || ' '}
                              </span>
                            </div>

                            {/* Coluna Direita */}
                            <div
                              className={`flex items-start px-2.5 py-1 ${
                                row.lineB?.type === 'added'
                                  ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200 border-l-2 border-emerald-500'
                                  : 'text-zinc-800 dark:text-slate-300'
                              }`}
                            >
                              <span className="w-8 shrink-0 select-none text-[10px] text-zinc-400 dark:text-slate-500 pr-2 text-right">
                                {row.lineB?.num || ''}
                              </span>
                              <span className="flex-1 whitespace-pre-wrap break-words leading-relaxed">
                                {row.lineB?.content || ' '}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer do Modal */}
        <div className="flex items-center justify-between border-t border-black/10 dark:border-white/10 bg-slate-50 dark:bg-zinc-800 px-5 py-3 shrink-0">
          <div className="text-xs text-zinc-500 dark:text-slate-400">
            Dica: Salve versões em cada etapa (ex: <em>Após endereçamento</em>, <em>Após preliminares</em>, <em>Peça completa</em>).
          </div>
          <button
            onClick={onFechar}
            className="rounded-full bg-slate-200 dark:bg-zinc-700 hover:bg-slate-300 dark:hover:bg-zinc-600 px-4 py-1.5 text-xs font-semibold text-zinc-800 dark:text-white transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>

      {/* Modal Secundário: Salvar Nova Versão */}
      {modalNovoAberto && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-sky-500/40 bg-white dark:bg-zinc-900 p-5 shadow-2xl space-y-4 text-zinc-900 dark:text-zinc-100">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Bookmark className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                Salvar Nova Versão da Redação
              </h3>
              <button
                onClick={() => setModalNovoAberto(false)}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSalvarNovaVersao} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-slate-300">
                  Nome da Versão *
                </label>
                <input
                  type="text"
                  required
                  value={novoNome}
                  onChange={e => setNovoNome(e.target.value)}
                  placeholder="Ex: Versão 2 - Preliminares e Decadência"
                  className="w-full rounded-xl border border-black/15 dark:border-white/15 bg-slate-50 dark:bg-zinc-800 px-3 py-2 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-sky-400"
                  autoFocus
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-slate-300">
                  Etapa / Categoria
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['esqueleto', 'preliminares', 'merito', 'revisao', 'final'] as const).map(
                    tag => (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => setNovaTag(tag)}
                        className={`rounded-lg px-2 py-1.5 text-[11px] font-semibold border transition cursor-pointer ${
                          novaTag === tag
                            ? 'bg-sky-600 text-white border-sky-400 shadow-sm'
                            : 'bg-slate-100 dark:bg-zinc-800 text-zinc-600 dark:text-slate-400 border-black/10 dark:border-white/10 hover:text-zinc-900 dark:hover:text-white'
                        }`}
                      >
                        {TAG_CONFIG[tag].label}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-slate-300">
                  Observações (Opcional)
                </label>
                <textarea
                  value={novaDescricao}
                  onChange={e => setNovaDescricao(e.target.value)}
                  rows={2}
                  placeholder="Ex: Corrigido o endereçamento para a Vara de Execuções e citada a Súmula 112 do STJ."
                  className="w-full rounded-xl border border-black/15 dark:border-white/15 bg-slate-50 dark:bg-zinc-800 px-3 py-2 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="rounded-xl bg-slate-50 dark:bg-zinc-800 p-3 border border-black/10 dark:border-white/10 text-[11px] text-zinc-500 dark:text-slate-400 flex items-center justify-between">
                <span>Total no editor:</span>
                <span className="font-mono font-bold text-sky-600 dark:text-sky-300">
                  {textoAtual.split('\n').length} linhas • {textoAtual.trim() ? textoAtual.trim().split(/\s+/).length : 0} palavras
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalNovoAberto(false)}
                  className="rounded-full border border-black/15 dark:border-white/15 px-4 py-1.5 text-xs font-semibold text-zinc-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-sky-600 hover:bg-sky-500 px-5 py-1.5 text-xs font-bold text-white transition shadow-sm cursor-pointer"
                >
                  Salvar Versão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
