import { useEffect, useState } from "react";
import { Plus, Tag } from "lucide-react";

import { categoriaService } from "@/services/categoriaService";
import { type CategoriaResposta, type CategoriaRequisicao, FinalidadeCategoriaLabel, type FinalidadeCategoria } from "@/types/Categoria";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

/**
 * Página de gerenciamento de Categorias.
 * Permite visualizar todas as categorias cadastradas e criar novas.
 */
export function Categorias() {
    const [categorias, setCategorias] = useState<CategoriaResposta[]>([]);
    const [carregando, setCarregando] = useState(false);

    // Controle do modal de criação
    const [modalAberto, setModalAberto] = useState(false);
    const [formData, setFormData] = useState<CategoriaRequisicao>({ descricao: "", finalidade: 1 });
    const [erroFormulario, setErroFormulario] = useState<string | null>(null);

    useEffect(() => {
        carregarDados();
    }, []);

    /**
    * Busca a lista de categorias na API e atualiza o estado.
    */
    const carregarDados = async () => {
        try {
            setCarregando(true);
            const dados = await categoriaService.obterTodas();
            setCategorias(dados);
        } catch (error) {
            console.error("Erro ao carregar categorias:", error);
            alert("Não foi possível carregar os dados. Verifique se a API está rodando.");
        } finally {
            setCarregando(false);
        }
    };

    const abrirModalNovo = () => {
        setFormData({ descricao: "", finalidade: 1 });
        setErroFormulario(null);
        setModalAberto(true);
    };

    /**
    * Envia os dados da nova categoria para a API e, em caso de sucesso,
    * fecha o modal e recarrega a lista.
    */
    const handleSalvar = async () => {
        try {
            setErroFormulario(null);
            await categoriaService.criar(formData);
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

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Categorias</h2>
                <p className="text-slate-500 mt-1">
                    Gerencie as categorias de transações para classificar suas receitas e despesas.
                </p>
            </div>

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
                        Nova Categoria
                    </Button>
                </div>

                <div className="bg-white rounded-md border border-slate-200">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50">
                                <TableHead>Descrição</TableHead>
                                <TableHead>Finalidade</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {carregando ? (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center h-24 text-slate-500">Carregando...</TableCell>
                                </TableRow>
                            ) : categorias.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center h-24 text-slate-500">Nenhuma categoria encontrada.</TableCell>
                                </TableRow>
                            ) : (
                                categorias.map((categoria) => (
                                    <TableRow key={categoria.id}>
                                        <TableCell className="font-medium text-slate-900">
                                            <div className="flex items-center gap-2">
                                                <Tag className="w-4 h-4 text-slate-400" />
                                                {categoria.descricao}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                                                ${categoria.finalidade === 1 ? 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10' :
                                                    categoria.finalidade === 2 ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/10' :
                                                        'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/10'}`}
                                            >
                                                {FinalidadeCategoriaLabel[categoria.finalidade]}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                <Dialog open={modalAberto} onOpenChange={setModalAberto}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Nova Categoria</DialogTitle>
                            <DialogDescription className="sr-only">
                                Adicione uma nova categoria para agrupar suas transações.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            {erroFormulario && (
                                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                                    {erroFormulario}
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="descricao">Descrição</Label>
                                <Input
                                    id="descricao"
                                    value={formData.descricao}
                                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                                    placeholder="Ex: Alimentação, Salário..."
                                    maxLength={400}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="finalidade">Finalidade</Label>
                                <select
                                    id="finalidade"
                                    value={formData.finalidade}
                                    onChange={(e) => setFormData({ ...formData, finalidade: parseInt(e.target.value) as FinalidadeCategoria })}
                                    className="h-7 w-full min-w-0 rounded-md border border-input bg-input/20 px-2 py-0.5 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 dark:bg-input/30"
                                >
                                    <option value={1}>Despesa</option>
                                    <option value={2}>Receita</option>
                                    <option value={3}>Ambas</option>
                                </select>
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