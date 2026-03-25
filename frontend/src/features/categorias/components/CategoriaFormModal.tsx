import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import type { CategoriaRequisicao, FinalidadeCategoria } from "@/features/categorias/categorias.types";

interface CategoriaFormModalProps {
    aberto: boolean;
    onOpenChange: (open: boolean) => void;
    formData: CategoriaRequisicao;
    setFormData: (data: CategoriaRequisicao) => void;
    erroFormulario: string | null;
    onSalvar: () => void;
    onCancelar: () => void;
}

/**
 * Modal de cadastro de categorias.
 * Implementa a seleção de finalidade, que restringirá as futuras transações.
 */
export function CategoriaFormModal({
    aberto,
    onOpenChange,
    formData,
    setFormData,
    erroFormulario,
    onSalvar,
    onCancelar
}: CategoriaFormModalProps) {
    return (
        <Dialog open={aberto} onOpenChange={onOpenChange}>
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
                    <Button variant="outline" onClick={onCancelar}>Cancelar</Button>
                    <Button onClick={onSalvar} className="bg-slate-900 text-white hover:bg-slate-800">
                        Salvar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}