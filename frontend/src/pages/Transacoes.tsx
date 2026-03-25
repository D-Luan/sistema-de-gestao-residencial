import { useEffect, useState } from "react";
import { Plus, ChevronLeft, ChevronRight, ArrowDownCircle, ArrowUpCircle } from "lucide-react";

import { transacaoService } from "@/services/transacaoService";
import { pessoaService } from "@/features/pessoas/pessoaService";
import { categoriaService } from "@/features/categorias/categoriaService";

import type { TransacaoResposta, TransacaoRequisicao, TipoTransacao } from "@/types/Transacao";
import type { PessoaResposta } from "@/features/pessoas/pessoas.types";
import type { CategoriaResposta } from "@/features/categorias/categorias.types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

/**
 * Página de gerenciamento de Transações.
 * Controla a listagem paginada e o formulário de cadastro, orquestrando as dependências 
 * de Pessoas e Categorias para montagem do dropdown de seleção.
 */
export function Transacoes() {
    const [transacoes, setTransacoes] = useState<TransacaoResposta[]>([]);
    const [pessoas, setPessoas] = useState<PessoaResposta[]>([]);
    const [categorias, setCategorias] = useState<CategoriaResposta[]>([]);
    const [carregando, setCarregando] = useState(false);

    // Controle de Paginação controlada pelo servidor
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalRegistros, setTotalRegistros] = useState(0);
    const tamanhoPagina = 10;

    // Estado do Modal de Cadastro    
    const [modalAberto, setModalAberto] = useState(false);
    const [erroFormulario, setErroFormulario] = useState<string | null>(null);
    const [formData, setFormData] = useState<TransacaoRequisicao>({
        descricao: "", valor: 0, tipo: 1, pessoaId: 0, categoriaId: 0
    });

    useEffect(() => {
        carregarDados();
    }, [paginaAtual]);

    // Busca os dados auxiliares apenas uma vez para popular o formulário
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

    /**
     * Tenta salvar a transação e intercepta as validações de Domínio do backend.
     * O erro em formato ProblemDetails é extraído e exibido ao usuário.
     */
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

    const formatarMoeda = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
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

                <div className="bg-white rounded-md border border-slate-200">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50">
                                <TableHead>Descrição</TableHead>
                                <TableHead>Pessoa</TableHead>
                                <TableHead>Categoria</TableHead>
                                <TableHead className="text-right">Valor</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {carregando ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24 text-slate-500">Carregando...</TableCell>
                                </TableRow>
                            ) : transacoes.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24 text-slate-500">Nenhuma transação registrada.</TableCell>
                                </TableRow>
                            ) : (
                                transacoes.map((t) => (
                                    <TableRow key={t.id}>
                                        <TableCell className="font-medium text-slate-900">
                                            <div className="flex items-center gap-2">
                                                {t.tipo === 1 ? (
                                                    <ArrowDownCircle className="w-4 h-4 text-red-500" />
                                                ) : (
                                                    <ArrowUpCircle className="w-4 h-4 text-emerald-500" />
                                                )}
                                                {t.descricao}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-600">{t.nomePessoa}</TableCell>
                                        <TableCell className="text-slate-600">{t.descricaoCategoria}</TableCell>
                                        <TableCell className={`text-right font-medium ${t.tipo === 1 ? 'text-red-600' : 'text-emerald-600'}`}>
                                            {t.tipo === 1 ? '-' : '+'}{formatarMoeda(t.valor)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

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

                <Dialog open={modalAberto} onOpenChange={setModalAberto}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Nova Transação</DialogTitle>
                            <DialogDescription className="sr-only">Cadastre uma nova transação financeira.</DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            {erroFormulario && (
                                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                                    {erroFormulario}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="descricao">Descrição</Label>
                                    <Input
                                        id="descricao"
                                        value={formData.descricao}
                                        onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                                        placeholder="Ex: Compra do mês"
                                        maxLength={400}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tipo">Tipo</Label>
                                    <select
                                        id="tipo"
                                        value={formData.tipo}
                                        onChange={(e) => setFormData({ ...formData, tipo: parseInt(e.target.value) as TipoTransacao })}
                                        className="h-7 w-full min-w-0 rounded-md border border-input bg-input/20 px-2 py-0.5 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 dark:bg-input/30"
                                    >
                                        <option value={1}>Despesa</option>
                                        <option value={2}>Receita</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="valor">Valor (R$)</Label>
                                    <Input
                                        id="valor"
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={formData.valor === 0 ? "" : formData.valor}
                                        onChange={(e) => setFormData({ ...formData, valor: parseFloat(e.target.value) || 0 })}
                                        placeholder="0,00"
                                    />
                                </div>

                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="pessoa">Pessoa</Label>
                                    <select
                                        id="pessoa"
                                        value={formData.pessoaId}
                                        onChange={(e) => setFormData({ ...formData, pessoaId: parseInt(e.target.value) })}
                                        className="h-7 w-full min-w-0 rounded-md border border-input bg-input/20 px-2 py-0.5 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 dark:bg-input/30"
                                    >
                                        <option value={0}>Selecione...</option>
                                        {pessoas.map(p => <option key={p.id} value={p.id}>{p.nome} ({p.idade} anos)</option>)}
                                    </select>
                                </div>

                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="categoria">Categoria</Label>
                                    <select
                                        id="categoria"
                                        value={formData.categoriaId}
                                        onChange={(e) => setFormData({ ...formData, categoriaId: parseInt(e.target.value) })}
                                        className="h-7 w-full min-w-0 rounded-md border border-input bg-input/20 px-2 py-0.5 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 dark:bg-input/30"
                                    >
                                        <option value={0}>Selecione...</option>
                                        {categorias.map(c => <option key={c.id} value={c.id}>{c.descricao}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setModalAberto(false)}>Cancelar</Button>
                            <Button onClick={handleSalvar} className="bg-slate-900 text-white hover:bg-slate-800">
                                Registrar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}