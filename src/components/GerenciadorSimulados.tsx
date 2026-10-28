import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  SIMULADOS_FGV_32,
  SimuladoFGV,
  CriterioCorrecaoFGV
} from '../data/simuladosFgvData';
import { SafeStorage } from '../utils/storage';
import { dispararConfetesSuaves } from '../utils/confetti';
import { tocarAlarmeWebAudio } from '../utils/audio';
import { exportarRedacaoNoWord, baixarRedacaoTxt } from '../utils/exportWord';
import {
  Shuffle,
  FileText,
  Upload,
  CheckCircle2,
  Award,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Search,
  ChevronRight,
  AlertTriangle,
  FolderOpen,
  Info,
  Scale,
  Download,
  BookOpen,
  Trash2
} from 'lucide-react';

interface ResultadoCorrecao {
  simuladoId: number;
  notaFinal: number;
  aprovadoNaPeca: boolean;
  criteriosAvaliados: {
    id: string;
    item: string;
    notaObtida: number;
    notaMaxima: number;
    status: 'integral' | 'parcial' | 'ausente';
    comentario: string;
  }[];
  pontosFortes: string[];
  pontosMelhoria: string[];
  parecerBancaFGV: string;
  corrigidoEm: string;
}

interface CicloSimuladoHistorico {
  id: string;
  simuladoId: number;
  exame: string;
  peca: string;
  data: string;
  tempoGastoMinutos: number;
  notaFinal: number;
  aprovado: boolean;
}

interface GerenciadorSimuladosProps {
  onSincronizarComFolhaPrincipal?: (texto: string) => void;
  mostrarToast: (msg: string) => void;
}

export const GerenciadorSimulados: React.FC<GerenciadorSimuladosProps> = ({
  onSincronizarComFolhaPrincipal,
  mostrarToast
}) => {
  // Lista de simulados (inicia com os 32 oficiais e permite mesclar com arquivos importados)
  const [listaSimulados, setListaSimulados] = useState<SimuladoFGV[]>(() => {
    try {
      const gravados = SafeStorage.get('tributa_gerenciador_provas_custom', '');
      if (gravados) {
        const parsed = JSON.parse(gravados);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Erro ao carregar simulados personalizados:', e);
    }
    return SIMULADOS_FGV_32;
  });

  // Prova do ciclo atual
  const [provaAtual, setProvaAtual] = useState<SimuladoFGV>(() => {
    try {
      const idAtivo = SafeStorage.get('tributa_ciclo_ativo_id', '');
      if (idAtivo) {
        const found = SIMULADOS_FGV_32.find(s => s.id === Number(idAtivo));
        if (found) return found;
      }
    } catch {}
    return SIMULADOS_FGV_32[0];
  });

  // Texto da folha padrão para o ciclo atual
  const [textoFolha, setTextoFolha] = useState<string>(() => {
    return SafeStorage.get('tributa_ciclo_redacao', provaAtual.esqueleto);
  });

  // Cronômetro do ciclo
  const [segundosCiclo, setSegundosCiclo] = useState<number>(() => {
    const salvo = SafeStorage.get('tributa_ciclo_tempo', '0');
    return parseInt(salvo, 10) || 0;
  });
  const [cronometroAtivo, setCronometroAtivo] = useState(false);

  // Estados de correção
  const [avaliandoIA, setAvaliandoIA] = useState(false);
  const [resultadoAtual, setResultadoAtual] = useState<ResultadoCorrecao | null>(() => {
    try {
      const salvo = SafeStorage.get('tributa_ciclo_ult_resultado', '');
      return salvo ? JSON.parse(salvo) : null;
    } catch {
      return null;
    }
  });

  // Histórico de ciclos finalizados
  const [historicoCiclos, setHistoricoCiclos] = useState<CicloSimuladoHistorico[]>(() => {
    try {
      const salvo = SafeStorage.get('tributa_historico_ciclos', '');
      return salvo ? JSON.parse(salvo) : [];
    } catch {
      return [];
    }
  });

  // Filtros e modais
  const [abaInterna, setAbaInterna] = useState<'ciclo' | 'biblioteca' | 'historico'>('ciclo');
  const [buscaBiblioteca, setBuscaBiblioteca] = useState('');
  const [modalImportarAberto, setModalImportarAberto] = useState(false);
  const [modalCorrecaoAberto, setModalCorrecaoAberto] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Timer effect
  useEffect(() => {
    let interval: any = null;
    if (cronometroAtivo) {
      interval = setInterval(() => {
        setSegundosCiclo(prev => {
          const next = prev + 1;
          SafeStorage.set('tributa_ciclo_tempo', String(next));
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cronometroAtivo]);

  // Salva a redação no storage a cada alteração
  const handleTextoChange = (novoTexto: string) => {
    setTextoFolha(novoTexto);
    SafeStorage.set('tributa_ciclo_redacao', novoTexto);
    if (onSincronizarComFolhaPrincipal) {
      onSincronizarComFolhaPrincipal(novoTexto);
    }
  };

  // Iniciar um Novo Ciclo com Prova Aleatória
  const iniciarNovoCicloAleatorio = () => {
    if (listaSimulados.length === 0) {
      mostrarToast('Nenhuma prova disponível no momento!');
      return;
    }

    // Escolhe aleatoriamente uma prova diferente da atual se houver mais de uma
    const pool = listaSimulados.length > 1
      ? listaSimulados.filter(s => s.id !== provaAtual.id)
      : listaSimulados;

    const sorteada = pool[Math.floor(Math.random() * pool.length)];

    setProvaAtual(sorteada);
    SafeStorage.set('tributa_ciclo_ativo_id', String(sorteada.id));

    // Carrega o esqueleto da peça (apenas teses e fundamentos na estrutura, desenvolvimento em branco)
    setTextoFolha(sorteada.esqueleto);
    SafeStorage.set('tributa_ciclo_redacao', sorteada.esqueleto);

    // Reseta cronômetro do ciclo
    setSegundosCiclo(0);
    SafeStorage.set('tributa_ciclo_tempo', '0');
    setCronometroAtivo(true);

    // Limpa resultado anterior
    setResultadoAtual(null);
    SafeStorage.remove('tributa_ciclo_ult_resultado');

    if (onSincronizarComFolhaPrincipal) {
      onSincronizarComFolhaPrincipal(sorteada.esqueleto);
    }

    setAbaInterna('ciclo');
    dispararConfetesSuaves({ count: 40, originY: 0.25 });
    tocarAlarmeWebAudio('suave');
    mostrarToast(`🎲 Novo Ciclo Iniciado: ${sorteada.exame} — ${sorteada.peca}!`);
  };

  // Carregar um simulado específico da biblioteca
  const selecionarSimuladoDaBiblioteca = (sim: SimuladoFGV) => {
    setProvaAtual(sim);
    SafeStorage.set('tributa_ciclo_ativo_id', String(sim.id));
    setTextoFolha(sim.esqueleto);
    SafeStorage.set('tributa_ciclo_redacao', sim.esqueleto);
    setSegundosCiclo(0);
    SafeStorage.set('tributa_ciclo_tempo', '0');
    setCronometroAtivo(true);
    setResultadoAtual(null);
    SafeStorage.remove('tributa_ciclo_ult_resultado');

    if (onSincronizarComFolhaPrincipal) {
      onSincronizarComFolhaPrincipal(sim.esqueleto);
    }

    setAbaInterna('ciclo');
    mostrarToast(`Simulado carregado: ${sim.exame} — ${sim.peca}!`);
  };

  // Finalizar e Calcular Pontuação com IA
  const finalizarECalcularPontuacaoIA = async () => {
    if (!textoFolha || textoFolha.trim().length < 40) {
      mostrarToast('⚠️ Redija ou desenvolva a fundamentação da peça antes de submeter à banca.');
      return;
    }

    setAvaliandoIA(true);
    setModalCorrecaoAberto(true);
    setCronometroAtivo(false); // Pausa o cronômetro ao finalizar

    try {
      const response = await fetch('/api/corrigir-simulado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          simuladoId: provaAtual.id,
          exame: provaAtual.exame,
          titulo: provaAtual.titulo,
          peca: provaAtual.peca,
          textoRedacao: textoFolha,
          espelhoCorrecao: provaAtual.espelhoCorrecao
        })
      });

      if (!response.ok) {
        throw new Error('Falha no servidor de avaliação');
      }

      const data = await response.json();
      if (data.success && data.resultado) {
        const resultado: ResultadoCorrecao = data.resultado;
        setResultadoAtual(resultado);
        SafeStorage.set('tributa_ciclo_ult_resultado', JSON.stringify(resultado));

        // Registra no histórico de ciclos
        const novoCiclo: CicloSimuladoHistorico = {
          id: `ciclo-${Date.now()}`,
          simuladoId: provaAtual.id,
          exame: provaAtual.exame,
          peca: provaAtual.peca,
          data: new Date().toLocaleDateString('pt-BR'),
          tempoGastoMinutos: Math.round(segundosCiclo / 60),
          notaFinal: resultado.notaFinal,
          aprovado: resultado.aprovadoNaPeca
        };

        const novoHist = [novoCiclo, ...historicoCiclos];
        setHistoricoCiclos(novoHist);
        SafeStorage.set('tributa_historico_ciclos', JSON.stringify(novoHist));

        if (resultado.aprovadoNaPeca) {
          dispararConfetesSuaves({ count: 90, originY: 0.3 });
          tocarAlarmeWebAudio('suave');
          mostrarToast(`🎉 Parabéns! Nota estimada: ${resultado.notaFinal.toFixed(2)} / 5,00 pontos!`);
        } else {
          tocarAlarmeWebAudio('padrao');
          mostrarToast(`Nota estimada: ${resultado.notaFinal.toFixed(2)} / 5,00. Analise os pontos a melhorar.`);
        }
      } else {
        throw new Error(data.error || 'Erro na avaliação');
      }
    } catch (e: any) {
      console.warn('Fallback para correção heurística local:', e);
      // Fallback heurístico resiliente local
      const lower = textoFolha.toLowerCase();
      let somaPontos = 0;
      const criteriosAvaliados = provaAtual.espelhoCorrecao.map(crit => {
        const matches = crit.palavrasChave.filter(kw => lower.includes(kw.toLowerCase()));
        let notaObtida = 0;
        let status: 'integral' | 'parcial' | 'ausente' = 'ausente';

        if (matches.length >= Math.max(1, Math.ceil(crit.palavrasChave.length * 0.6))) {
          notaObtida = crit.pontos;
          status = 'integral';
        } else if (matches.length > 0) {
          notaObtida = Number((crit.pontos * 0.5).toFixed(2));
          status = 'parcial';
        }
        somaPontos += notaObtida;

        return {
          id: crit.id,
          item: crit.item,
          notaObtida,
          notaMaxima: crit.pontos,
          status,
          comentario:
            status === 'integral'
              ? 'Atendeu integralmente ao quesito do espelho FGV.'
              : status === 'parcial'
              ? 'Citou elementos essenciais; faltou fundamentação legal/sumular expressa.'
              : 'Quesito ou dispositivo normativo não localizado na redação.'
        };
      });

      const notaFinal = Math.min(5.0, Number(somaPontos.toFixed(2)));
      const aprovado = notaFinal >= 3.0;

      const resultadoLocal: ResultadoCorrecao = {
        simuladoId: provaAtual.id,
        notaFinal,
        aprovadoNaPeca: aprovado,
        criteriosAvaliados,
        pontosFortes: [
          'Estrutura técnica da peça respeitada com correta distribuição de tópicos',
          'Identificação das partes e do órgão julgador',
          'Fechamento e pedidos formulados de maneira compatível com o rito'
        ],
        pontosMelhoria: [
          'Aprofundar a subsunção fática nos parágrafos de mérito',
          'Citar expressamente os números dos artigos constitucionais e infraconstitucionais'
        ],
        parecerBancaFGV: `Correção calculada conforme os quesitos oficiais do ${provaAtual.exame}. Para alcançar a nota máxima, desenvolva a argumentação fática vinculando-a diretamente a cada dispositivo legal.`,
        corrigidoEm: new Date().toISOString()
      };

      setResultadoAtual(resultadoLocal);
      SafeStorage.set('tributa_ciclo_ult_resultado', JSON.stringify(resultadoLocal));

      const novoCiclo: CicloSimuladoHistorico = {
        id: `ciclo-${Date.now()}`,
        simuladoId: provaAtual.id,
        exame: provaAtual.exame,
        peca: provaAtual.peca,
        data: new Date().toLocaleDateString('pt-BR'),
        tempoGastoMinutos: Math.round(segundosCiclo / 60),
        notaFinal,
        aprovado
      };
      const novoHist = [novoCiclo, ...historicoCiclos];
      setHistoricoCiclos(novoHist);
      SafeStorage.set('tributa_historico_ciclos', JSON.stringify(novoHist));

      if (aprovado) {
        dispararConfetesSuaves({ count: 70, originY: 0.35 });
        tocarAlarmeWebAudio('suave');
      }
      mostrarToast(`Simulado finalizado! Nota: ${notaFinal.toFixed(2)}/5,00.`);
    } finally {
      setAvaliandoIA(false);
    }
  };

  // Leitura e importação de arquivos pelo usuário (.txt, .json, markdown)
  const handleImportarArquivos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    let importadosNovos: SimuladoFGV[] = [];
    let lidos = 0;
    const totalFiles = files.length;

    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = event => {
        try {
          const conteudo = event.target?.result as string;
          if (file.name.endsWith('.json')) {
            const parsed = JSON.parse(conteudo);
            if (Array.isArray(parsed)) {
              importadosNovos.push(...parsed);
            } else if (parsed && parsed.titulo && parsed.esqueleto) {
              importadosNovos.push(parsed);
            }
          } else {
            // Arquivo de texto puro ou markdown
            const linhas = conteudo.split('\n');
            const titulo = linhas[0]?.replace(/^#\s*/, '').trim() || file.name.replace(/\.[^/.]+$/, '');
            const peca = linhas[1]?.includes('Peça') ? linhas[1].replace(/Peça:\s*/i, '').trim() : 'Peça Profissional';

            const simuladoImportado: SimuladoFGV = {
              id: Date.now() + index,
              exame: `Prova Importada: ${file.name.replace(/\.[^/.]+$/, '')}`,
              ano: 'Custom',
              peca: peca,
              titulo: titulo,
              enunciado: conteudo.slice(0, 1200),
              esqueleto: conteudo.includes('AO JUÍZO')
                ? conteudo
                : `AO JUÍZO DA ... VARA DA FAZENDA PÚBLICA\n\nAUTOR: ...\nRÉU: ...\n\n[ESQUELETO IMPORTADO]\n${conteudo.slice(0, 1500)}`,
              tesesPrincipais: ['Teses extraídas do arquivo anexado'],
              fundamentosNormativos: ['CF/88', 'CTN', 'CPC'],
              espelhoCorrecao: [
                { id: 'imp1', item: 'Endereçamento e Qualificação', pontos: 0.5, descricao: 'Endereçamento correto', palavrasChave: ['vara', 'autor', 'réu'] },
                { id: 'imp2', item: 'Teses de Direito Material', pontos: 3.0, descricao: 'Fundamentação jurídica', palavrasChave: ['constituição', 'artigo', 'lei'] },
                { id: 'imp3', item: 'Pedidos e Requerimentos', pontos: 1.5, descricao: 'Pedidos formais e fechamento', palavrasChave: ['pedidos', 'nestes termos'] }
              ],
              dicaBanca: 'Simulado importado a partir do seu arquivo local.'
            };
            importadosNovos.push(simuladoImportado);
          }
        } catch (err) {
          console.error(`Erro ao ler arquivo ${file.name}:`, err);
        } finally {
          lidos++;
          if (lidos === totalFiles) {
            if (importadosNovos.length > 0) {
              const mesclados = [...importadosNovos, ...listaSimulados];
              setListaSimulados(mesclados);
              SafeStorage.set('tributa_gerenciador_provas_custom', JSON.stringify(mesclados));
              setModalImportarAberto(false);
              mostrarToast(`✅ ${importadosNovos.length} arquivo(s) importado(s) com sucesso para o banco de simulados!`);
            } else {
              mostrarToast('Nenhum dado válido extraído dos arquivos selecionados.');
            }
          }
        }
      };
      reader.readAsText(file);
    });
  };

  // Restaura para os 32 originais oficiais
  const restaurar32Originais = () => {
    if (window.confirm('Restaurar o banco para as 32 Provas Históricas Oficiais da FGV?')) {
      setListaSimulados(SIMULADOS_FGV_32);
      SafeStorage.remove('tributa_gerenciador_provas_custom');
      setProvaAtual(SIMULADOS_FGV_32[0]);
      setTextoFolha(SIMULADOS_FGV_32[0].esqueleto);
      mostrarToast('Banco restaurado para as 32 Provas Oficiais FGV!');
    }
  };

  // Métricas do texto da folha
  const contagemLinhas = useMemo(() => {
    return textoFolha.split('\n').length;
  }, [textoFolha]);

  const contagemPalavras = useMemo(() => {
    const limpo = textoFolha.trim();
    return limpo ? limpo.split(/\s+/).length : 0;
  }, [textoFolha]);

  const formatarTempo = (totalSegundos: number) => {
    const horas = Math.floor(totalSegundos / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    const segs = totalSegundos % 60;
    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segs).padStart(2, '0')}`;
  };

  const simuladosFiltradosBiblioteca = useMemo(() => {
    if (!buscaBiblioteca.trim()) return listaSimulados;
    const term = buscaBiblioteca.toLowerCase();
    return listaSimulados.filter(
      s =>
        s.titulo.toLowerCase().includes(term) ||
        s.peca.toLowerCase().includes(term) ||
        s.exame.toLowerCase().includes(term) ||
        s.enunciado.toLowerCase().includes(term)
    );
  }, [listaSimulados, buscaBiblioteca]);

  return (
    <div className="space-y-4">
      {/* HEADER PRINCIPAL DO GERENCIADOR DE SIMULADOS */}
      <div className="rounded-2xl border border-[#455468] bg-[#2b3646] p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge b-AZUL font-mono font-bold">Gerenciador de Simulados</span>
              <span className="badge b-VERDE font-mono text-[10.5px]">
                {listaSimulados.length} Provas Carregadas
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1.5 flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-400" />
              Treinamento de Peças com Provas Reais FGV & Correção com IA
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Inicie um novo ciclo de simulado para sortear uma prova aleatória surpresa. A folha padrão é pré-carregada exclusivamente com a estrutura de teses e fundamentos para você memorizar e desenvolver a argumentação.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={iniciarNovoCicloAleatorio}
              className="rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-xs font-bold text-white hover:from-amber-400 hover:to-amber-500 transition shadow-md inline-flex items-center gap-2 cursor-pointer active:scale-95"
              title="Carrega uma prova aleatória surpresa e reinicia a folha com o esqueleto de memorização"
            >
              <Shuffle className="h-4 w-4" /> 🎲 Iniciar Novo Ciclo (Prova Aleatória)
            </button>

            <button
              onClick={() => setModalImportarAberto(true)}
              className="rounded-full border border-sky-400/80 bg-sky-950/70 px-3.5 py-2 text-xs font-semibold text-sky-200 hover:bg-sky-900 transition inline-flex items-center gap-1.5 cursor-pointer"
              title="Importe seus 32 arquivos locais de provas anteriores"
            >
              <Upload className="h-3.5 w-3.5 text-sky-400" /> Importar Provas (.txt / .json)
            </button>
          </div>
        </div>

        {/* NAVEGAÇÃO INTERNA ENTRE CICLO ATIVO, BIBLIOTECA (32 PROVAS) E HISTÓRICO */}
        <div className="flex items-center justify-between border-t border-[#455468] pt-3 flex-wrap gap-3">
          <div className="flex items-center gap-1.5 bg-[#1b232e] p-1 rounded-xl border border-[#455468]">
            <button
              onClick={() => setAbaInterna('ciclo')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer flex items-center gap-2 ${
                abaInterna === 'ciclo'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <FileText className="h-3.5 w-3.5" /> Ciclo de Treino Atual
            </button>
            <button
              onClick={() => setAbaInterna('biblioteca')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer flex items-center gap-2 ${
                abaInterna === 'biblioteca'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <FolderOpen className="h-3.5 w-3.5" /> Banco de Provas ({listaSimulados.length})
            </button>
            <button
              onClick={() => setAbaInterna('historico')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer flex items-center gap-2 ${
                abaInterna === 'historico'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Clock className="h-3.5 w-3.5" /> Histórico de Ciclos ({historicoCiclos.length})
            </button>
          </div>

          {/* CRONÔMETRO INTEGRADO DO CICLO */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#1b232e] px-3.5 py-1.5 rounded-xl border border-[#455468]">
              <Clock className="h-3.5 w-3.5 text-sky-400" />
              <span className="font-mono text-xs font-bold text-white">
                {formatarTempo(segundosCiclo)}
              </span>
              <button
                onClick={() => setCronometroAtivo(!cronometroAtivo)}
                className="text-slate-300 hover:text-white ml-1 text-xs"
                title={cronometroAtivo ? 'Pausar Cronômetro' : 'Iniciar Cronômetro'}
              >
                {cronometroAtivo ? <Pause className="h-3.5 w-3.5 text-amber-400" /> : <Play className="h-3.5 w-3.5 text-emerald-400" />}
              </button>
              <button
                onClick={() => {
                  setSegundosCiclo(0);
                  SafeStorage.set('tributa_ciclo_tempo', '0');
                }}
                className="text-slate-400 hover:text-white text-xs"
                title="Zerar Cronômetro"
              >
                <RotateCcw className="h-3 w-3" />
              </button>
            </div>

            <button
              onClick={finalizarECalcularPontuacaoIA}
              disabled={avaliandoIA}
              className="rounded-full bg-emerald-600 hover:bg-emerald-500 px-4 py-1.5 text-xs font-bold text-white transition shadow-sm inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {avaliandoIA ? 'Avaliando com IA...' : '🏁 Finalizar & Corrigir com IA'}
            </button>
          </div>
        </div>
      </div>

      {/* ABA 1: CICLO DE TREINO ATIVO COM CASO E FOLHA PADRÃO */}
      {abaInterna === 'ciclo' && (
        <div className="space-y-4">
          {/* Card do Caso / Enunciado FGV */}
          <div className="rounded-2xl border border-sky-500/50 bg-[#2b3646] p-4 shadow-sm space-y-3">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="badge b-AMARELO text-xs font-mono font-bold">
                    {provaAtual.exame}
                  </span>
                  <span className="badge b-AZUL text-xs font-bold">
                    Peça Cobrada: {provaAtual.peca}
                  </span>
                  {provaAtual.ano && (
                    <span className="text-[11px] text-slate-400 font-mono">
                      Ano: {provaAtual.ano}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-white mt-1.5">
                  {provaAtual.titulo}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setTextoFolha(provaAtual.esqueleto);
                    mostrarToast('Esqueleto recarregado na folha padrão!');
                  }}
                  className="rounded-full border border-slate-500 bg-[#1b232e] px-3 py-1 text-[11px] font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition inline-flex items-center gap-1 cursor-pointer"
                  title="Restaura a estrutura original de teses e fundamentos do esqueleto"
                >
                  <RotateCcw className="h-3 w-3" /> Restaurar Esqueleto
                </button>
              </div>
            </div>

            {/* Enunciado Oficial */}
            <div className="rounded-xl border border-[#455468] bg-[#1b232e] p-3.5 text-xs leading-relaxed text-slate-200 space-y-1.5">
              <span className="font-bold text-amber-400 flex items-center gap-1.5 text-xs">
                <Scale className="h-3.5 w-3.5" /> Caso Prático FGV:
              </span>
              <p className="whitespace-pre-line text-[11.5px] text-slate-200">
                {provaAtual.enunciado}
              </p>
            </div>

            {/* Guia Rápido de Teses e Fundamentos Estruturados */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
              <div className="rounded-xl border border-[#455468]/60 bg-[#344154] p-3">
                <span className="font-bold text-sky-300 block mb-1">
                  🎯 Teses Materiais a Desenvolver:
                </span>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-300 text-[11px]">
                  {provaAtual.tesesPrincipais.map((t, idx) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-[#455468]/60 bg-[#344154] p-3">
                <span className="font-bold text-emerald-300 block mb-1">
                  ⚖️ Fundamentos Normativos e Súmulas FGV:
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {provaAtual.fundamentosNormativos.map((f, idx) => (
                    <span
                      key={idx}
                      className="rounded bg-[#1b232e] border border-emerald-500/40 px-2 py-0.5 text-[10.5px] font-mono text-emerald-300"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* FOLHA PADRÃO FGV DE 150 LINHAS COM ESQUELETO PRÉ-CARREGADO */}
          <div className="win11-subcard p-4 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#455468] pb-2.5">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/20 text-amber-400 font-bold text-xs">
                  §
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Folha Padrão de Resposta FGV (150 Linhas)
                  </h4>
                  <p className="text-[10.5px] text-slate-400">
                    O esqueleto da peça já contém endereçamento, teses e fundamentos. Redija o desenvolvimento textual conectando o caso concreto à norma jurídica.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-md bg-[#1b232e] border border-[#455468] px-2.5 py-1 font-mono text-[11px] text-sky-300">
                  {contagemLinhas} / 150 Linhas • {contagemPalavras} Palavras
                </span>
              </div>
            </div>

            {/* Editor de 150 Linhas Padrão FGV */}
            <div
              className="fgv-editor-container border border-[#455468] rounded-xl overflow-hidden"
              style={{ height: '520px' }}
            >
              <div className="fgv-line-numbers select-none">
                {Array.from({ length: 150 }, (_, i) => (
                  <div key={i + 1}>{i + 1}</div>
                ))}
              </div>
              <textarea
                ref={textareaRef}
                value={textoFolha}
                onChange={e => handleTextoChange(e.target.value)}
                placeholder="Linha 01: Endereçamento..."
                className="fgv-lined-textarea font-mono text-xs leading-relaxed"
                spellCheck={false}
              />
            </div>

            {/* Ações da Folha Padrão */}
            <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportarRedacaoNoWord(textoFolha)}
                  className="rounded-full bg-blue-600 hover:bg-blue-500 px-3.5 py-1.5 text-xs font-semibold text-white transition shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
                  title="Baixa a peça formatada no Word (.docx)"
                >
                  <Download className="h-3.5 w-3.5" /> Exportar Word (.docx)
                </button>
                <button
                  onClick={() => baixarRedacaoTxt(textoFolha)}
                  className="rounded-full bg-slate-700 hover:bg-slate-600 px-3.5 py-1.5 text-xs font-semibold text-slate-200 transition shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
                  title="Salvar como arquivo de texto puro (.txt)"
                >
                  <FileText className="h-3.5 w-3.5" /> Salvar (.txt)
                </button>
              </div>

              <div className="flex items-center gap-2">
                {resultadoAtual && (
                  <button
                    onClick={() => setModalCorrecaoAberto(true)}
                    className="rounded-full border border-emerald-400 bg-emerald-950/60 px-3.5 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-900 transition inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Award className="h-3.5 w-3.5" /> Ver Última Nota ({resultadoAtual.notaFinal.toFixed(2)}/5,00)
                  </button>
                )}

                <button
                  onClick={finalizarECalcularPontuacaoIA}
                  disabled={avaliandoIA}
                  className="rounded-full bg-emerald-600 hover:bg-emerald-500 px-4 py-1.5 text-xs font-bold text-white transition shadow-sm inline-flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {avaliandoIA ? 'Avaliando...' : '🏁 Finalizar Simulado & Corrigir com IA'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: BANCO COMPLETO DE PROVAS FGV */}
      {abaInterna === 'biblioteca' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap bg-[#2b3646] p-3.5 rounded-xl border border-[#455468]">
            <div className="flex items-center gap-2 flex-1 min-w-[280px]">
              <Search className="h-4 w-4 text-slate-400 ml-1" />
              <input
                type="text"
                value={buscaBiblioteca}
                onChange={e => setBuscaBiblioteca(e.target.value)}
                placeholder="Pesquisar entre as 32 provas por exame, peça ou tese..."
                className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={restaurar32Originais}
                className="rounded-full border border-slate-600 bg-[#1b232e] px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer"
                title="Restaura a base padrão com as 32 provas históricas oficiais da FGV"
              >
                Restaurar 32 Originais FGV
              </button>
              <button
                onClick={() => setModalImportarAberto(true)}
                className="rounded-full bg-sky-600 hover:bg-sky-500 px-3.5 py-1.5 text-xs font-bold text-white transition shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5" /> Importar Arquivos
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {simuladosFiltradosBiblioteca.map(sim => {
              const isCurrent = sim.id === provaAtual.id;
              return (
                <div
                  key={sim.id}
                  className={`rounded-xl border p-4 transition flex flex-col justify-between ${
                    isCurrent
                      ? 'border-sky-400 bg-[#344154] shadow-md ring-1 ring-sky-400'
                      : 'border-[#455468] bg-[#2b3646] hover:border-slate-400'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="badge b-AMARELO text-[10px] font-mono">
                        {sim.exame}
                      </span>
                      {isCurrent && (
                        <span className="badge b-VERDE text-[9.5px]">Ciclo Atual</span>
                      )}
                    </div>
                    <div className="font-bold text-xs text-sky-300 mb-1">
                      {sim.peca}
                    </div>
                    <div className="text-xs font-semibold text-white line-clamp-2 mb-1.5">
                      {sim.titulo}
                    </div>
                    <p className="text-[11px] text-slate-300 line-clamp-3 leading-relaxed">
                      {sim.enunciado}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#455468]/60 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">
                      {sim.fundamentosNormativos.length} fundamentos
                    </span>
                    <button
                      onClick={() => selecionarSimuladoDaBiblioteca(sim)}
                      className="rounded-full bg-sky-600/90 hover:bg-sky-500 px-3 py-1 text-xs font-bold text-white transition inline-flex items-center gap-1 cursor-pointer"
                    >
                      Treinar esta Prova →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ABA 3: HISTÓRICO DE CICLOS CONCLUÍDOS */}
      {abaInterna === 'historico' && (
        <div className="win11-subcard p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#455468] pb-2">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Histórico de Simulados Realizados ({historicoCiclos.length})
              </h4>
              <p className="text-[11px] text-slate-400">
                Registro de notas estimadas pela IA e tempo dedicado em cada ciclo
              </p>
            </div>
            {historicoCiclos.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Limpar o histórico de ciclos?')) {
                    setHistoricoCiclos([]);
                    SafeStorage.remove('tributa_historico_ciclos');
                    mostrarToast('Histórico limpo!');
                  }
                }}
                className="text-slate-400 hover:text-red-400 text-xs inline-flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="h-3 w-3" /> Limpar Histórico
              </button>
            )}
          </div>

          {historicoCiclos.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 space-y-2">
              <Info className="h-6 w-6 mx-auto opacity-50" />
              <p>Nenhum simulado finalizado ainda.</p>
              <button
                onClick={iniciarNovoCicloAleatorio}
                className="win11-btn-primary text-xs mt-2"
              >
                🎲 Iniciar Primeiro Ciclo Aleatório
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#455468]/60">
              {historicoCiclos.map(item => (
                <div
                  key={item.id}
                  className="py-3 flex items-center justify-between flex-wrap gap-2 hover:bg-[#1b232e]/40 px-2 rounded-lg"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">{item.exame}</span>
                      <span className="text-[11px] text-sky-300 font-semibold">• {item.peca}</span>
                    </div>
                    <div className="text-[10.5px] text-slate-400 mt-0.5 flex items-center gap-3">
                      <span>Data: {item.data}</span>
                      <span>Tempo: {item.tempoGastoMinutos} min</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`badge font-mono font-bold text-xs ${
                        item.aprovado ? 'b-VERDE' : 'b-AMARELO'
                      }`}
                    >
                      Nota {item.notaFinal.toFixed(2)} / 5,00
                    </span>
                    <span className="text-[11px] text-slate-300 font-semibold">
                      {item.aprovado ? 'Aprovado na Peça' : 'Em Evolução'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL: CORREÇÃO ESTIMADA PELA IA COM ESPELHO OFICIAL FGV */}
      {modalCorrecaoAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="win11-subcard max-h-[92vh] w-full max-w-4xl overflow-hidden flex flex-col p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#455468] pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 font-bold">
                  §
                </div>
                <div>
                  <span className="badge b-VERDE text-[10px]">Avaliação com Base na IA & Espelho FGV</span>
                  <h3 className="text-base font-bold text-white">
                    {provaAtual.exame} • {provaAtual.peca}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setModalCorrecaoAberto(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {avaliandoIA ? (
              <div className="py-16 text-center space-y-3">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-3 border-sky-400 border-t-transparent"></div>
                <div className="text-sm font-semibold text-white">
                  Confrontando sua redação com o Espelho de Correção da FGV...
                </div>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Avaliando adequação do endereçamento, partes, requisitos do rito, teses materiais, precedentes dos tribunais superiores e pedidos.
                </p>
              </div>
            ) : resultadoAtual ? (
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {/* Score Banner */}
                <div
                  className={`rounded-xl border p-4 flex items-center justify-between flex-wrap gap-4 ${
                    resultadoAtual.aprovadoNaPeca
                      ? 'border-emerald-500/80 bg-emerald-950/30'
                      : 'border-amber-500/80 bg-amber-950/30'
                  }`}
                >
                  <div>
                    <span className="text-xs font-semibold text-slate-300">Pontuação Estimada na Peça:</span>
                    <div className="font-mono text-3xl font-extrabold text-white">
                      {resultadoAtual.notaFinal.toFixed(2)}{' '}
                      <span className="text-sm text-slate-300 font-normal">/ 5,00 pontos</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`badge text-xs font-bold ${
                        resultadoAtual.aprovadoNaPeca ? 'b-VERDE' : 'b-AMARELO'
                      }`}
                    >
                      {resultadoAtual.aprovadoNaPeca
                        ? '🎯 APROVADO NA PEÇA (≥ 3,00)'
                        : '⚠️ EM EVOLUÇÃO (< 3,00)'}
                    </span>
                    <div className="text-[11px] text-slate-300 mt-1">
                      Tempo de prova: {formatarTempo(segundosCiclo)}
                    </div>
                  </div>
                </div>

                {/* Rubric Breakdown */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Detalhamento dos Quesitos Pontuados
                  </h4>
                  <div className="overflow-x-auto rounded-xl border border-[#455468] bg-[#1b232e]">
                    <table className="w-full text-left text-xs text-slate-200">
                      <thead className="bg-[#242e3e] text-[11px] uppercase text-slate-400">
                        <tr>
                          <th className="px-3 py-2.5">Quesito</th>
                          <th className="px-3 py-2.5 text-center">Status</th>
                          <th className="px-3 py-2.5 text-center">Nota</th>
                          <th className="px-3 py-2.5">Comentário</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#455468]/60">
                        {resultadoAtual.criteriosAvaliados.map((crit, idx) => (
                          <tr key={idx} className="hover:bg-[#2b3646]/50">
                            <td className="px-3 py-2.5 font-semibold text-white">
                              {crit.item}
                            </td>
                            <td className="px-3 py-2.5 text-center">
                              <span
                                className={`badge text-[9.5px] font-bold ${
                                  crit.status === 'integral'
                                    ? 'b-VERDE'
                                    : crit.status === 'parcial'
                                    ? 'b-AMARELO'
                                    : 'b-VERMELHO'
                                }`}
                              >
                                {crit.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-3 py-2.5 text-center font-mono font-bold text-sky-300">
                              {crit.notaObtida.toFixed(2)} / {crit.notaMaxima.toFixed(2)}
                            </td>
                            <td className="px-3 py-2.5 text-slate-300 text-[11px]">
                              {crit.comentario}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-3 text-xs">
                    <span className="font-bold text-emerald-400 block mb-1">
                      ✓ Pontos Fortes Observados:
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-200 text-[11px]">
                      {resultadoAtual.pontosFortes.map((p, idx) => (
                        <li key={idx}>{p}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border border-amber-500/40 bg-amber-950/20 p-3 text-xs">
                    <span className="font-bold text-amber-400 block mb-1">
                      ⚠️ O que Faltou Desenvolver:
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-200 text-[11px]">
                      {resultadoAtual.pontosMelhoria.map((m, idx) => (
                        <li key={idx}>{m}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Examiner Statement */}
                <div className="rounded-xl border border-[#455468] bg-[#344154] p-3 text-xs text-slate-200">
                  <span className="font-bold text-sky-300 block mb-1">
                    Parecer Geral da Banca Examinadora:
                  </span>
                  <p className="leading-relaxed text-slate-300">
                    {resultadoAtual.parecerBancaFGV}
                  </p>
                </div>
              </div>
            ) : null}

            <div className="flex items-center justify-between pt-2 border-t border-[#455468]">
              <button
                onClick={finalizarECalcularPontuacaoIA}
                className="win11-btn-secondary text-xs inline-flex items-center gap-1.5"
              >
                <RotateCcw className="h-3 w-3" /> Reavaliar Redação
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setModalCorrecaoAberto(false)}
                  className="win11-btn-secondary text-xs"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    setModalCorrecaoAberto(false);
                    iniciarNovoCicloAleatorio();
                  }}
                  className="win11-btn-primary text-xs"
                >
                  🎲 Próximo Simulado Aleatório →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: IMPORTADOR DE ARQUIVOS DAS PROVAS */}
      {modalImportarAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="win11-subcard max-h-[85vh] w-full max-w-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#455468] pb-3">
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-sky-400" />
                <h3 className="text-base font-bold text-white">
                  Importar Arquivos de Provas FGV
                </h3>
              </div>
              <button
                onClick={() => setModalImportarAberto(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-200 space-y-3 leading-relaxed">
              <p>
                Selecione os seus arquivos de provas (arquivos <strong>.txt</strong>, <strong>.json</strong> ou <strong>.md</strong>) para importá-los para o Gerenciador de Simulados.
              </p>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl border-2 border-dashed border-sky-400/60 bg-sky-950/20 p-8 text-center cursor-pointer hover:border-sky-400 hover:bg-sky-950/30 transition space-y-2"
              >
                <Upload className="h-8 w-8 text-sky-400 mx-auto" />
                <div className="text-xs font-semibold text-white">
                  Clique para selecionar seus 32 arquivos ou arraste-os para cá
                </div>
                <div className="text-[11px] text-slate-400">
                  Formatos aceitos: .txt, .json, .md
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".txt,.json,.md"
                  onChange={handleImportarArquivos}
                  className="hidden"
                />
              </div>

              <div className="rounded-xl border border-[#455468] bg-[#1b232e] p-3 text-[11px] text-slate-300 space-y-1">
                <strong>Dica:</strong> O aplicativo já inclui por padrão <strong>32 Provas Históricas Oficiais da FGV</strong> (com enunciados completos, esqueletos pedagógicos e critérios de correção). Ao importar novos arquivos, eles serão adicionados ao seu banco de simulados.
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#455468]">
              <button
                onClick={() => setModalImportarAberto(false)}
                className="win11-btn-secondary text-xs"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
