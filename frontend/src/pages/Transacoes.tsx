import { useEffect, useState } from "react";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";

import { transacaoService } from "@/features/transacoes/transacaoService";
import { pessoaService } from "@/features/pessoas/pessoaService";
import { categoriaService } from "@/features/categorias/categoriaService";

import type { TransacaoResposta, TransacaoRequisicao } from "@/features/transacoes/transacoes.types";
import type { PessoaResposta } from "@/features/pessoas/pessoas.types";
import type { CategoriaResposta } from "@/features/categorias/categorias.types";

import { Button } from "@/components/ui/button";
import { TransacoesTable } from "@/features/transacoes/components/TransacoesTable";
import { TransacaoFormModal } from "@/features/transacoes/components/TransacaoFormModal";

/**
 * Página principal de Transações.
 * Gerencia o carregamento assíncrono de dependências (Pessoas e Categorias)
 * necessárias para o cadastro de novos lançamentos.
 */
export function Transacoes() {
    const [transacoes, setTransacoes] = useState<TransacaoResposta[]>([]);
    const [pessoas, setPessoas] = useState<PessoaResposta[]>([]);
    const [categorias, setCategorias] = useState<CategoriaResposta[]>([]);
    const [carregando, setCarregando] = useState(false);

    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalRegistros, setTotalRegistros] = useState(0);
    const tamanhoPagina = 10;

    const [modalAberto, setModalAberto] = useState(false);
    const [erroFormulario, setErroFormulario] = useState<string | null>(null);
    const [formData, setFormData] = useState<TransacaoRequisicao>({
        descricao: "", valor: 0, tipo: 1, pessoaId: 0, categoriaId: 0
    });

    useEffect(() => {
        carregarDados();
    }, [paginaAtual]);

    // Carrega Pessoas e Categorias uma única vez para popular os selects do modal
    useEffect(() => {
        const carregarDependencias = async () => {
            try {
                const resPessoas = await pessoaService.obterTodas(1, 1000);
                setPessoas(resPessoas.itens);

                const resCategorias = await categoriaService.obterTodas();
                setCategorias(resCategorias);
            } catch (error) {
                console.error("Erro ao carregar dependências", error);
            }
        };
        carregarDependencias();
    }, []);

    const carregarDados = async () => {
        try {
            setCarregando(true);
            const resposta = await transacaoService.obterTodas(paginaAtual, tamanhoPagina);
            setTransacoes(resposta.itens);
            setTotalRegistros(resposta.totalRegistros);
        } catch (error) {
            console.error("Erro ao carregar transações:", error);
        } finally {
            setCarregando(false);
        }
    };

    const abrirModalNovo = () => {
        setFormData({ descricao: "", valor: 0, tipo: 1, pessoaId: pessoas[0]?.id || 0, categoriaId: categorias[0]?.id || 0 });
        setErroFormulario(null);
        setModalAberto(true);
    };

    const handleSalvar = async () => {
        try {
            setErroFormulario(null);
            await transacaoService.criar(formData);
            setModalAberto(false);
            carregarDados();
        } catch (error: any) {
            const data = error.response?.data;
            if (data?.errors) {
                const mensagens = Object.values(data.errors).flat();
                setErroFormulario(mensagens[0] as string);
            } else {
                setErroFormulario(data?.detail || "Erro inesperado.");
            }
        }
    };

    const totalPaginas = Math.ceil(totalRegistros / tamanhoPagina);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Transações</h2>
                <p className="text-slate-500 mt-1">
                    Histórico de lançamentos e fluxo de caixa.
                </p>
            </div>

            <div className="space-y-3">
                <div className="flex justify-end">
                    <Button onClick={abrirModalNovo} className="bg-slate-900 hover:bg-slate-800 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Nova Transação
                    </Button>
                </div>

                <TransacoesTable
                    transacoes={transacoes}
                    carregando={carregando}
                />

                {totalRegistros > 0 && (
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">
                            Mostrando {transacoes.length} de {totalRegistros} registros
                        </span>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" disabled={paginaAtual === 1} onClick={() => setPaginaAtual(p => p - 1)}>
                                <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
                            </Button>
                            <Button variant="outline" size="sm" disabled={paginaAtual >= totalPaginas} onClick={() => setPaginaAtual(p => p + 1)}>
                                Próxima <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                )}

                <TransacaoFormModal
                    aberto={modalAberto}
                    onOpenChange={setModalAberto}
                    formData={formData}
                    setFormData={setFormData}
                    erroFormulario={erroFormulario}
                    pessoas={pessoas}
                    categorias={categorias}
                    onSalvar={handleSalvar}
                    onCancelar={() => setModalAberto(false)}
                />
            </div>
        </div>
    );
}