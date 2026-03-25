import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import type { TransacaoRequisicao, TipoTransacao } from "@/features/transacoes/transacoes.types";
import type { PessoaResposta } from "@/features/pessoas/pessoas.types";
import type { CategoriaResposta } from "@/features/categorias/categorias.types";

interface TransacaoFormModalProps {
    aberto: boolean;
    onOpenChange: (open: boolean) => void;
    formData: TransacaoRequisicao;
    setFormData: (data: TransacaoRequisicao) => void;
    erroFormulario: string | null;
    pessoas: PessoaResposta[];
    categorias: CategoriaResposta[];
    onSalvar: () => void;
    onCancelar: () => void;
}

/**
 * Modal para registro de transações financeiras.
 * Reúne dados de Pessoas e Categorias para estabelecer os vínculos necessários.
 */
export function TransacaoFormModal({
    aberto,
    onOpenChange,
    formData,
    setFormData,
    erroFormulario,
    pessoas,
    categorias,
    onSalvar,
    onCancelar
}: TransacaoFormModalProps) {
    return (
        <Dialog open={aberto} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Nova Transação</DialogTitle>
                    <DialogDescription className="sr-only">Cadastre uma nova transação financeira.</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Exibe erros de validação como: menor de idade tentando cadastrar receita 
                        ou categoria incompatível com o tipo de transação. */}
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

                        <div className="space-y-2 col-span-2 flex flex-col">
                            <Label htmlFor="pessoa">Pessoa</Label>
                            <SearchableSelect
                                options={pessoas.map(p => ({ label: `${p.nome} (${p.idade} anos)`, value: p.id }))}
                                value={formData.pessoaId}
                                onChange={(val) => setFormData({ ...formData, pessoaId: val })}
                                placeholder="Pesquise e selecione uma pessoa..."
                            />
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
                    <Button variant="outline" onClick={onCancelar}>Cancelar</Button>
                    <Button onClick={onSalvar} className="bg-slate-900 text-white hover:bg-slate-800">
                        Registrar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}