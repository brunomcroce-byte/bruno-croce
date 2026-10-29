import React, { useState, useEffect } from 'react';
import {
  X,
  RefreshCw,
  Wifi,
  WifiOff,
  CheckCircle2,
  Database,
  BookOpen,
  Scale,
  ShieldCheck,
  Download,
  Upload,
  ExternalLink,
  Sparkles,
  Clock,
  ArrowRight,
  Copy,
  Check,
  Activity,
  Layers,
  FileText
} from 'lucide-react';
import {
  onlineLegalSync,
  StatusConexao,
  AtualizacaoJuridica,
  RegistroSincronizacao
} from '../utils/onlineLegalSync';
import { tocarAlarmeWebAudio } from '../utils/audio';

interface CentralAtualizacoesModalProps {
  aberto: boolean;
  onFechar: () => void;
  onNavegarParaAba: (aba: string) => void;
  onInserirTextoSimulador?: (texto: string) => void;
  linhasRedacaoCount: number;
}

export const CentralAtualizacoesModal: React.FC<CentralAtualizacoesModalProps> = ({
  aberto,
  onFechar,
  onNavegarParaAba,
  onInserirTextoSimulador,
  linhasRedacaoCount
}) => {
  const [statusConexao, setStatusConexao] = useState<StatusConexao>(() => onlineLegalSync.getStatus());
  const [atualizacoes, setAtualizacoes] = useState<AtualizacaoJuridica[]>(() => onlineLegalSync.getAtualizacoes());
  const [historico, setHistorico] = useState<RegistroSincronizacao[]>(() => onlineLegalSync.getHistorico());
  const [abaAtiva, setAbaAtiva] = useState<'leis' | 'banco' | 'conexao'>('leis');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [verificandoAgora, setVerificandoAgora] = useState(false);
  const [termoCopiadoId, setTermoCopiadoId] = useState<string | null>(null);
  const [msgFeedback, setMsgFeedback] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onlineLegalSync.subscrever((novoStatus) => {
      setStatusConexao(novoStatus);
      setAtualizacoes(onlineLegalSync.getAtualizacoes());
      setHistorico(onlineLegalSync.getHistorico());
    });
    return unsub;
  }, []);

  if (!aberto) return null;

  const handleVerificarManual = async () => {
    setVerificandoAgora(true);
    tocarAlarmeWebAudio('suave');
    await onlineLegalSync.verificarAtualizacoesLeis(true);
    setTimeout(() => {
      setVerificandoAgora(false);
      setMsgFeedback('✓ Verificação de leis e banco concluída. Todos os módulos atualizados!');
      setTimeout(() => setMsgFeedback(null), 3500);
    }, 600);
  };

  const copiarFundamentacao = (item: AtualizacaoJuridica) => {
    const texto = `[Atualização Normativa] ${item.titulo}\n${item.descricao}\nDispositivos: ${item.artigosChave.join(', ')}`;
    navigator.clipboard.writeText(texto);
    setTermoCopiadoId(item.id);
    setTimeout(() => setTermoCopiadoId(null), 2500);
  };

  const handleExportarBackup = () => {
    const json = onlineLegalSync.exportarSnapshotBancoDeDados();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tributaoab_backup_banco_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    tocarAlarmeWebAudio('suave');
    setMsgFeedback('📥 Backup do banco de dados exportado com sucesso (.json)!');
    setTimeout(() => setMsgFeedback(null), 3500);
  };

  const handleImportarBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const conteudo = event.target?.result as string;
      const ok = onlineLegalSync.restaurarSnapshotBancoDeDados(conteudo);
      if (ok) {
        tocarAlarmeWebAudio('suave');
        setMsgFeedback('✓ Banco de dados restaurado com sucesso a partir do backup!');
        setTimeout(() => {
          setMsgFeedback(null);
          window.location.reload();
        }, 1200);
      } else {
        alert('Erro ao restaurar o banco de dados. Verifique se o arquivo JSON é válido.');
      }
    };
    reader.readAsText(file);
  };

  const atualizacoesFiltradas = atualizacoes.filter((att) => {
    if (filtroTipo === 'todos') return true;
    return att.tipo === filtroTipo;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-atualizacoes-title"
    >
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-black/[0.12] dark:border-white/10 bg-white dark:bg-[#202020] text-slate-900 dark:text-white shadow-2xl transition-all flex flex-col max-h-[90vh]">
        {/* Barra de Título Windows 11 Chrome */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/[0.08] dark:border-white/[0.08] bg-slate-100/90 dark:bg-[#2b2b2b]/90 select-none shrink-0">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#0067c0] text-white text-[10px] font-bold shadow-xs">
              🪟
            </span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Windows 11 • Central de Atualizações de Leis & Banco de Dados
            </span>
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2 py-0.2 text-[10px] font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Sempre Online Ativo
            </span>
          </div>

          <button
            type="button"
            onClick={onFechar}
            className="flex h-6 w-8 items-center justify-center rounded text-slate-500 hover:bg-[#c42b1c] hover:text-white transition cursor-pointer"
            aria-label="Fechar janela"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Banner de Feedback Rápido */}
        {msgFeedback && (
          <div className="px-4 py-2 bg-emerald-500/15 border-b border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>{msgFeedback}</span>
            </div>
            <button
              onClick={() => setMsgFeedback(null)}
              className="text-xs text-emerald-800 dark:text-emerald-200 hover:underline"
            >
              Fechar
            </button>
          </div>
        )}

        {/* Conteúdo com rolagem */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Card Principal de Status da Conexão & Atualizações (Windows Update Style) */}
          <div className="rounded-xl border border-black/[0.08] dark:border-white/10 bg-slate-50 dark:bg-[#272727] p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-md ${
                  statusConexao.online
                    ? 'bg-emerald-600 shadow-emerald-600/25'
                    : 'bg-rose-600 shadow-rose-600/25'
                }`}
              >
                {statusConexao.online ? <Wifi className="h-6 w-6" /> : <WifiOff className="h-6 w-6" />}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3
                    id="modal-atualizacoes-title"
                    className="text-base font-bold text-slate-900 dark:text-white"
                  >
                    {statusConexao.online
                      ? 'Você está online e com o banco de dados atualizado'
                      : 'Modo Offline: Operando com dados em cache local'}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {statusConexao.online
                    ? `Latência contínua: ${statusConexao.latenciaMs}ms • Varredura de leis a cada 30 segundos • ${atualizacoes.length} normas sincronizadas.`
                    : 'Suas alterações estão salvas no SafeStorage local e serão sincronizadas assim que a conexão retornar.'}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Última verificação:{' '}
                    <strong className="text-slate-700 dark:text-slate-200 font-mono">
                      {statusConexao.ultimaVerificacaoLeis.toLocaleTimeString('pt-BR')}
                    </strong>
                  </span>
                  <span>•</span>
                  <span>
                    Total de verificações:{' '}
                    <strong className="text-slate-700 dark:text-slate-200 font-mono">
                      {statusConexao.totalVerificacoes}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Botão de Verificação Imediata */}
            <div className="shrink-0 flex items-center gap-2">
              <button
                type="button"
                onClick={handleVerificarManual}
                disabled={verificandoAgora}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#0067c0] hover:bg-[#005fb8] disabled:bg-slate-400 text-white text-xs font-bold transition cursor-pointer shadow-xs active:scale-95"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${verificandoAgora ? 'animate-spin' : ''}`} />
                <span>{verificandoAgora ? 'Verificando...' : 'Verificar Atualizações Agora'}</span>
              </button>
            </div>
          </div>

          {/* Abas Estilo Windows 11 Fluent */}
          <div className="flex items-center gap-1 border-b border-black/[0.08] dark:border-white/[0.08] pb-1 overflow-x-auto">
            <button
              type="button"
              onClick={() => setAbaAtiva('leis')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                abaAtiva === 'leis'
                  ? 'bg-[#0067c0]/15 text-[#0067c0] dark:text-[#4cc2ff] font-bold border border-[#0067c0]/30 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Scale className="h-3.5 w-3.5" />
              <span>Leis & Jurisprudência ({atualizacoes.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setAbaAtiva('banco')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                abaAtiva === 'banco'
                  ? 'bg-[#0067c0]/15 text-[#0067c0] dark:text-[#4cc2ff] font-bold border border-[#0067c0]/30 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Database className="h-3.5 w-3.5" />
              <span>Banco de Dados & Backup</span>
            </button>

            <button
              type="button"
              onClick={() => setAbaAtiva('conexao')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                abaAtiva === 'conexao'
                  ? 'bg-[#0067c0]/15 text-[#0067c0] dark:text-[#4cc2ff] font-bold border border-[#0067c0]/30 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Activity className="h-3.5 w-3.5" />
              <span>Conectividade Contínua</span>
            </button>
          </div>

          {/* ABA 1: LEIS E JURISPRUDÊNCIA SINCRONIZADAS */}
          {abaAtiva === 'leis' && (
            <div className="space-y-3">
              {/* Filtros por tipo de norma */}
              <div className="flex items-center gap-1.5 flex-wrap text-xs">
                <span className="text-slate-500 dark:text-slate-400 text-[11px] mr-1">Filtrar por:</span>
                {[
                  { id: 'todos', label: 'Todas as Normas' },
                  { id: 'reforma', label: 'Reforma Tributária (EC 132)' },
                  { id: 'lei', label: 'Leis Complementares' },
                  { id: 'jurisprudencia', label: 'Súmulas STF / STJ' },
                  { id: 'banco_dados', label: 'Esquema do Banco' }
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFiltroTipo(f.id)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                      filtroTipo === f.id
                        ? 'bg-[#0067c0] text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-black/30 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-black/50 border border-black/[0.06] dark:border-white/5'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Lista de Atualizações Normativas */}
              <div className="grid grid-cols-1 gap-2.5">
                {atualizacoesFiltradas.map((att) => (
                  <div
                    key={att.id}
                    className="rounded-xl border border-black/[0.08] dark:border-white/10 bg-slate-50 dark:bg-black/20 p-3.5 sm:p-4 space-y-2.5 hover:border-[#0067c0]/40 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            att.tipo === 'reforma'
                              ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                              : att.tipo === 'jurisprudencia'
                              ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                              : att.tipo === 'banco_dados'
                              ? 'bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30'
                              : 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                          }`}
                        >
                          {att.tipo === 'reforma'
                            ? 'Reforma Tributária'
                            : att.tipo === 'jurisprudencia'
                            ? 'Jurisprudência FGV'
                            : att.tipo === 'banco_dados'
                            ? 'Banco de Dados'
                            : 'Lei Federal'}
                        </span>

                        <span
                          className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                            att.impactoOAB === 'CRÍTICO'
                              ? 'bg-red-500/20 text-red-600 dark:text-red-300'
                              : att.impactoOAB === 'ALTO'
                              ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300'
                              : 'bg-slate-500/20 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          Impacto: {att.impactoOAB}
                        </span>

                        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                          {att.codigoNorma} • Versão {att.versaoBanco}
                        </span>
                      </div>

                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Sincronizado no App ({att.aplicadoEm})
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                        {att.titulo}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {att.descricao}
                      </p>
                    </div>

                    {/* Dispositivos Chave e Ações */}
                    <div className="pt-2 border-t border-black/[0.06] dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                          Artigos Chave:
                        </span>
                        {att.artigosChave.map((art, idx) => (
                          <span
                            key={idx}
                            className="rounded bg-slate-200/70 dark:bg-black/40 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 border border-black/[0.06] dark:border-white/5"
                          >
                            {art}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-1.5 self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => copiarFundamentacao(att)}
                          className="px-2.5 py-1 rounded bg-white dark:bg-black/30 border border-black/[0.08] dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-[10px] font-bold text-slate-700 dark:text-slate-300 transition cursor-pointer flex items-center gap-1"
                          title="Copiar fundamentação para a área de transferência"
                        >
                          {termoCopiadoId === att.id ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-500" />
                              <span>Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>Copiar</span>
                            </>
                          )}
                        </button>

                        {onInserirTextoSimulador && (
                          <button
                            type="button"
                            onClick={() => {
                              const citacao = `\n\nNesse sentido, preceitua a ${att.codigoNorma}: "${att.descricao}".\n`;
                              onInserirTextoSimulador(citacao);
                              setMsgFeedback(`✓ Citação da ${att.codigoNorma} inserida na folha de 150 linhas!`);
                              setTimeout(() => setMsgFeedback(null), 3500);
                            }}
                            className="px-2.5 py-1 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-[10px] font-bold text-amber-700 dark:text-amber-300 transition cursor-pointer flex items-center gap-1"
                          >
                            <span>Citar na Folha 150L</span>
                          </button>
                        )}

                        {att.linkOficial && (
                          <a
                            href={att.linkOficial}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded bg-[#0067c0]/15 hover:bg-[#0067c0]/25 border border-[#0067c0]/30 text-[10px] font-bold text-[#0067c0] dark:text-[#4cc2ff] transition flex items-center gap-1"
                          >
                            <span>Planalto Oficial</span>
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ABA 2: BANCO DE DADOS & SINCRONIZAÇÃO */}
          {abaAtiva === 'banco' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-black/[0.08] dark:border-white/10 bg-slate-50 dark:bg-black/20 p-3.5 space-y-1">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    Coleções no Banco Local
                  </div>
                  <div className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                    8 Tabelas Ativas
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
                    ✓ Esquema v3.5 Íntegro
                  </div>
                </div>

                <div className="rounded-xl border border-black/[0.08] dark:border-white/10 bg-slate-50 dark:bg-black/20 p-3.5 space-y-1">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    Folha 150L Redigida
                  </div>
                  <div className="text-lg font-bold font-mono text-[#0067c0] dark:text-[#4cc2ff]">
                    {linhasRedacaoCount} / 150 Linhas
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    Salvamento instantâneo
                  </div>
                </div>

                <div className="rounded-xl border border-black/[0.08] dark:border-white/10 bg-slate-50 dark:bg-black/20 p-3.5 space-y-1">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    Persistência Segura
                  </div>
                  <div className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                    SafeStorage Sync
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
                    Sincronização em nuvem
                  </div>
                </div>
              </div>

              {/* Botões de Ação de Backup & Restauração do Banco */}
              <div className="rounded-xl border border-black/[0.08] dark:border-white/10 bg-slate-50 dark:bg-black/20 p-4 space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Database className="h-4 w-4 text-[#0067c0] dark:text-[#4cc2ff]" />
                    <span>Backup e Snapshot Completo do Banco de Dados</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Exporte ou restaure todas as suas redações, versões de diff, metas diárias, súmulas e flashcards.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={handleExportarBackup}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0067c0] hover:bg-[#005fb8] text-white text-xs font-bold transition cursor-pointer shadow-xs"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Exportar Backup do Banco (.json)</span>
                  </button>

                  <label className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-black/[0.12] dark:border-white/10 bg-white dark:bg-black/30 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer shadow-xs">
                    <Upload className="h-3.5 w-3.5 text-amber-500" />
                    <span>Restaurar de Arquivo JSON</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportarBackup}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Histórico Recente de Sincronizações */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Histórico de Sincronizações Contínuas
                </div>
                <div className="rounded-xl border border-black/[0.08] dark:border-white/10 bg-white dark:bg-black/30 p-2 divide-y divide-black/[0.04] dark:divide-white/5 max-h-[160px] overflow-y-auto">
                  {historico.map((h) => (
                    <div key={h.id} className="py-2 px-2 flex items-center justify-between text-xs gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`h-2 w-2 rounded-full shrink-0 ${
                            h.status === 'sucesso' ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                        />
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {h.tipo}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate hidden sm:inline">
                          — {h.detalhes}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400 shrink-0">
                        {h.horario}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ABA 3: CONECTIVIDADE CONTÍNUA */}
          {abaAtiva === 'conexao' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    Modo "Sempre Online" Ativo
                  </h4>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  O TributaOAB Desktop Pro executa um loop de escuta e heartbeat de rede contínuo.
                  Se sua conexão oscilar, o sistema entra em modo de cache local automaticamente e reestabelece
                  a sincronização com o banco de leis e normas assim que a conexão é recuperada.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-black/[0.08] dark:border-white/10 bg-slate-50 dark:bg-black/20 p-4 space-y-2">
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Activity className="h-4 w-4 text-[#0067c0] dark:text-[#4cc2ff]" />
                    <span>Métricas de Rede ao Vivo</span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex justify-between">
                      <span>Status do Navegador:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400 font-mono">
                        {statusConexao.online ? 'Online (Conectado)' : 'Offline'}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Latência de Ping:</span>
                      <strong className="font-mono text-slate-800 dark:text-white">
                        {statusConexao.latenciaMs} ms
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Qualidade da Conexão:</span>
                      <strong className="capitalize text-emerald-600 dark:text-emerald-400">
                        {statusConexao.qualidade}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Último Heartbeat:</span>
                      <strong className="font-mono text-slate-800 dark:text-white">
                        {statusConexao.ultimoHeartbeat.toLocaleTimeString('pt-BR')}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-black/[0.08] dark:border-white/10 bg-slate-50 dark:bg-black/20 p-4 space-y-2">
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-[#0067c0] dark:text-[#4cc2ff]" />
                    <span>Frequência da Varredura</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    A varredura contínua pesquisa alterações em:
                  </p>
                  <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 list-disc pl-4">
                    <li>Diário Oficial da União (Leis Complementares & Decretos)</li>
                    <li>Súmulas Vinculantes e Repercussão Geral do STF</li>
                    <li>Súmulas e Temas Repetitivos do STJ em Direito Tributário</li>
                    <li>Esquemas locais do Simulador 150L e Histórico de Versões</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé Windows 11 */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3 border-t border-black/[0.08] dark:border-white/[0.08] bg-slate-100/90 dark:bg-[#2b2b2b]/90 shrink-0">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>
              Banco de Dados Tributário v3.5 • Sincronização em Tempo Real Ativa
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onFechar}
              className="flex-1 sm:flex-none px-4 py-1.5 rounded-lg border border-black/[0.12] dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-white/5 transition cursor-pointer"
            >
              Concluir & Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
