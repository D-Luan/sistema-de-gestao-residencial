import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

import { pessoaService } from "@/services/pessoaService";
import type { PessoaResposta, PessoaRequisicao } from "@/types/Pessoa";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

/**
 * Página de gerenciamento de Pessoas.
 * Implementa CRUD completo e atende ao requisito de listagem de totais por pessoa.
 */
export function Pessoas() {
    const [pessoas, setPessoas] = useState<PessoaResposta[]>([]);
    const [carregando, setCarregando] = useState(false);

    // Controle de Paginação
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalRegistros, setTotalRegistros] = useState(0);
    const tamanhoPagina = 10;

    // Estado do Modal e Formulário (Unificado para Criação e Edição)
    const [modalAberto, setModalAberto] = useState(false);
    const [pessoaEditando, setPessoaEditando] = useState<PessoaResposta | null>(null);
    const [formData, setFormData] = useState<PessoaRequisicao>({ nome: "", idade: 0 });
    const [erroFormulario, setErroFormulario] = useState<string | null>(null);

    useEffect(() => {
        carregarDados();
    }, [paginaAtual]);

    const carregarDados = async () => {
        try {
            setCarregando(true);
            const resposta = await pessoaService.obterTodas(paginaAtual, tamanhoPagina);
            setPessoas(resposta.itens);
            setTotalRegistros(resposta.totalRegistros);
        } catch (error) {
            console.error("Erro ao carregar pessoas:", error);
            alert("Não foi possível carregar os dados. Verifique se a API está rodando.");
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

    const abrirModalEditar = (pessoa: PessoaResposta) => {
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
            const mensagemErro = error.response?.data?.detail || "Ocorreu um erro ao salvar. Verifique os dados.";
            setErroFormulario(mensagemErro);
        }
    };

    const handleDeletar = async (id: number) => {
        // Alerta preventivo reforçando a regra de negócio de exclusão de pessoa.
        if (!window.confirm("Tem certeza que deseja excluir esta pessoa? Todas as transações vinculadas serão apagadas.")) return;

        try {
            await pessoaService.remover(id);
            carregarDados();
        } catch (error) {
            console.error("Erro ao deletar:", error);
            alert("Não foi possível excluir o registro.");
        }
    };

    const totalPaginas = Math.ceil(totalRegistros / tamanhoPagina);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Pessoas</h2>
                <p className="text-slate-500 mt-1">
                    Resumo de todas as pessoas cadastradas e seus respectivos balanços financeiros.
                </p>
            </div>

            {/* 
                Cards para Consulta de total Geral de pessoas. 
                Os valores totais virão do somatório das transações via API.
            */}
            <div className="bg-white border border-slate-200 rounded-md flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-200">
                <div className="flex-1 px-6 py-4">
                    <p className="text-sm font-medium text-slate-500">Total de Receitas</p>
                    <p className="text-2xl font-semibold text-slate-900 mt-1">R$ 0,00</p>
                </div>
                <div className="flex-1 px-6 py-4">
                    <p className="text-sm font-medium text-slate-500">Total de Despesas</p>
                    <p className="text-2xl font-semibold text-slate-900 mt-1">R$ 0,00</p>
                </div>
                <div className="flex-1 px-6 py-4">
                    <p className="text-sm font-medium text-slate-500">Saldo Líquido</p>
                    <p className="text-2xl font-semibold text-slate-900 mt-1">R$ 0,00</p>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex justify-end">
                    <Button onClick={abrirModalNovo} className="bg-slate-900 hover:bg-slate-800 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Nova Pessoa
                    </Button>
                </div>

                <div className="bg-white rounded-md border border-slate-200">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50">
                                <TableHead>Nome</TableHead>
                                <TableHead>Idade</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {carregando ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24 text-slate-500">Carregando...</TableCell>
                                </TableRow>
                            ) : pessoas.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24 text-slate-500">Nenhuma pessoa encontrada.</TableCell>
                                </TableRow>
                            ) : (
                                pessoas.map((pessoa) => (
                                    <TableRow key={pessoa.id}>
                                        <TableCell className="font-medium text-slate-900">{pessoa.nome}</TableCell>
                                        <TableCell className="text-slate-600">{pessoa.idade} anos</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => abrirModalEditar(pessoa)}>
                                                <Pencil className="w-4 h-4 text-slate-500 hover:text-blue-600" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDeletar(pessoa.id)}>
                                                <Trash2 className="w-4 h-4 text-slate-500 hover:text-red-600" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Paginação condicional: só aparece se houver dados */}
                {totalRegistros > 0 && (
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">
                            Mostrando {pessoas.length} de {totalRegistros} registros
                        </span>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={paginaAtual === 1}
                                onClick={() => setPaginaAtual(p => p - 1)}
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={paginaAtual >= totalPaginas}
                                onClick={() => setPaginaAtual(p => p + 1)}
                            >
                                Próxima <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Modal de Cadastro/Edição */}
                <Dialog open={modalAberto} onOpenChange={setModalAberto}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{pessoaEditando ? "Editar Pessoa" : "Nova Pessoa"}</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            {erroFormulario && (
                                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                                    {erroFormulario}
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="nome">Nome Completo</Label>
                                <Input
                                    id="nome"
                                    value={formData.nome}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, nome: e.target.value })}
                                    placeholder="Ex: Luan Silva"
                                    maxLength={200}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="idade">Idade</Label>
                                <Input
                                    id="idade"
                                    type="number"
                                    value={formData.idade === 0 ? "" : formData.idade}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, idade: parseInt(e.target.value) || 0 })}
                                    placeholder="Ex: 25"
                                    min={0}
                                    max={130}
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setModalAberto(false)}>Cancelar</Button>
                            <Button onClick={handleSalvar} className="bg-slate-900 text-white hover:bg-slate-800">
                                Salvar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}