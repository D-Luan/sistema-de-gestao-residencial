import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

import { pessoaService } from "@/services/pessoaService";
import { financeiroService } from "@/services/financeiroService";
import type { PessoaRequisicao } from "@/types/Pessoa";
import type { RelatorioPessoaResposta, RelatorioPaginadoResposta } from "@/types/Financeiro";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

/**
 * Componente de Pessoas.
 * Centraliza o requisito de "Cadastro de Pessoas" (CRUD completo) com o requisito de 
 * "Consulta de totais por pessoa", exibindo os balanços na tabela e os totais gerais no rodapé.
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

    const formatarMoeda = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
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

                <div className="bg-white rounded-md border border-slate-200">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50">
                                <TableHead>Nome</TableHead>
                                <TableHead>Idade</TableHead>
                                <TableHead className="text-right">Receitas</TableHead>
                                <TableHead className="text-right">Despesas</TableHead>
                                <TableHead className="text-right">Saldo</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {carregando ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24 text-slate-500">Carregando...</TableCell>
                                </TableRow>
                            ) : relatorio?.itens.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24 text-slate-500">Nenhuma pessoa encontrada.</TableCell>
                                </TableRow>
                            ) : (
                                relatorio?.itens.map((pessoa) => (
                                    <TableRow key={pessoa.id}>
                                        <TableCell className="font-medium text-slate-900">{pessoa.nome}</TableCell>
                                        <TableCell className="text-slate-600">{pessoa.idade} anos</TableCell>
                                        <TableCell className="text-right text-emerald-600 font-medium">
                                            {formatarMoeda(pessoa.totalReceitas)}
                                        </TableCell>
                                        <TableCell className="text-right text-red-600 font-medium">
                                            {formatarMoeda(pessoa.totalDespesas)}
                                        </TableCell>
                                        <TableCell className={`text-right font-bold ${pessoa.saldo >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                            {formatarMoeda(pessoa.saldo)}
                                        </TableCell>
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

                        {/* Atende ao requisito de adicionar o total geral no final da listagem".
                            O TableFooter fixa os totais visíveis ao usuário independente da rolagem.
                        */}
                        {relatorio && (
                            <TableFooter className="bg-slate-50/80 font-bold border-t-2 border-slate-200">
                                <TableRow>
                                    <TableCell colSpan={2} className="text-slate-900 uppercase">TOTAL GERAL</TableCell>
                                    <TableCell className="text-right text-emerald-600">
                                        <p className="text-sm font-medium text-slate-500">Total de Receitas</p>
                                        <p className="text-base font-semibold mt-1">{formatarMoeda(relatorio.totalGeralReceitas)}</p>
                                    </TableCell>
                                    <TableCell className="text-right text-red-600">
                                        <p className="text-sm font-medium text-slate-500">Total de Despesas</p>
                                        <p className="text-base font-semibold mt-1">{formatarMoeda(relatorio.totalGeralDespesas)}</p>
                                    </TableCell>
                                    <TableCell className={`text-right ${relatorio.saldoGeralLiquido >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                        <p className="text-sm font-medium text-slate-500">Saldo Líquido</p>
                                        <p className="text-base font-semibold mt-1">{formatarMoeda(relatorio.saldoGeralLiquido)}</p>
                                    </TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableFooter>
                        )}
                    </Table>
                </div>

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

                <Dialog open={modalAberto} onOpenChange={setModalAberto}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{pessoaEditando ? "Editar Pessoa" : "Nova Pessoa"}</DialogTitle>
                            <DialogDescription className="sr-only">Preencha os dados do formulário.</DialogDescription>
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
                                    id="nome" value={formData.nome}
                                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                    placeholder="Ex: Roberto Silva" maxLength={200}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="idade">Idade</Label>
                                <Input
                                    id="idade" type="number" value={formData.idade === 0 ? "" : formData.idade}
                                    onChange={(e) => setFormData({ ...formData, idade: parseInt(e.target.value) || 0 })}
                                    placeholder="Ex: 25" min={0} max={130}
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