import { useEffect, useState } from "react";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";

import { pessoaService } from "@/features/pessoas/pessoaService";
import { financeiroService } from "@/services/financeiroService";
import type { PessoaRequisicao } from "@/features/pessoas/pessoas.types";
import type { RelatorioPessoaResposta, RelatorioPaginadoResposta } from "@/types/Financeiro";

import { Button } from "@/components/ui/button";
import { PessoasTable } from "@/features/pessoas/components/PessoasTable";
import { PessoaFormModal } from "@/features/pessoas/components/PessoaFormModal";

/**
 * Componente principal da funcionalidade de Pessoas.
 * Gerencia a sincronização entre a listagem (com totais financeiros) e as operações de CRUD.
 */
export function Pessoas() {
    const [relatorio, setRelatorio] = useState<RelatorioPaginadoResposta<RelatorioPessoaResposta> | null>(null);
    const [carregando, setCarregando] = useState(false);

    const [paginaAtual, setPaginaAtual] = useState(1);
    const tamanhoPagina = 10;

    const [modalAberto, setModalAberto] = useState(false);
    const [pessoaEditando, setPessoaEditando] = useState<RelatorioPessoaResposta | null>(null);
    const [formData, setFormData] = useState<PessoaRequisicao>({ nome: "", idade: 0 });
    const [erroFormulario, setErroFormulario] = useState<string | null>(null);

    useEffect(() => {
        carregarDados();
    }, [paginaAtual]);

    const carregarDados = async () => {
        try {
            setCarregando(true);
            const dados = await financeiroService.obterTotaisPorPessoa(paginaAtual, tamanhoPagina);
            setRelatorio(dados);
        } catch (error) {
            console.error("Erro ao carregar relatório:", error);
        } finally {
            setCarregando(false);
        }
    };

    const abrirModalNovo = () => {
        setPessoaEditando(null);
        setFormData({ nome: "", idade: 0 });
        setErroFormulario(null);
        setModalAberto(true);
    };

    const abrirModalEditar = (pessoa: RelatorioPessoaResposta) => {
        setPessoaEditando(pessoa);
        setFormData({ nome: pessoa.nome, idade: pessoa.idade });
        setErroFormulario(null);
        setModalAberto(true);
    };

    const handleSalvar = async () => {
        try {
            setErroFormulario(null);
            if (pessoaEditando) {
                await pessoaService.atualizar(pessoaEditando.id, formData);
            } else {
                await pessoaService.criar(formData);
            }
            setModalAberto(false);
            carregarDados();
        } catch (error: any) {
            const data = error.response?.data;
            if (data?.errors) {
                setErroFormulario(Object.values(data.errors).flat()[0] as string);
            } else {
                setErroFormulario(data?.detail || "Erro inesperado.");
            }
        }
    };

    const handleDeletar = async (id: number) => {
        if (!window.confirm("Tem certeza que deseja excluir esta pessoa? Todas as transações vinculadas serão apagadas.")) return;
        try {
            await pessoaService.remover(id);
            carregarDados();
        } catch (error) {
            alert("Não foi possível excluir o registro.");
        }
    };

    const totalRegistros = relatorio?.totalRegistros || 0;
    const totalPaginas = Math.ceil(totalRegistros / tamanhoPagina);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Pessoas</h2>
                <p className="text-slate-500 mt-1">
                    Resumo de todas as pessoas cadastradas e seus respectivos balanços financeiros.
                </p>
            </div>

            <div className="space-y-3">
                <div className="flex justify-end">
                    <Button onClick={abrirModalNovo} className="bg-slate-900 hover:bg-slate-800 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Nova Pessoa
                    </Button>
                </div>

                <PessoasTable 
                    relatorio={relatorio} 
                    carregando={carregando} 
                    onEditar={abrirModalEditar} 
                    onDeletar={handleDeletar} 
                />

                {totalRegistros > 0 && (
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">
                            Mostrando {relatorio?.itens.length} de {totalRegistros} registros
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

                <PessoaFormModal
                    aberto={modalAberto}
                    onOpenChange={setModalAberto}
                    editando={!!pessoaEditando}
                    formData={formData}
                    setFormData={setFormData}
                    erroFormulario={erroFormulario}
                    onSalvar={handleSalvar}
                    onCancelar={() => setModalAberto(false)}
                />
            </div>
        </div>
    );
}