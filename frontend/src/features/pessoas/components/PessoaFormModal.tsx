import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import type { PessoaRequisicao } from "@/features/pessoas/pessoas.types";

interface PessoaFormModalProps {
    aberto: boolean;
    onOpenChange: (open: boolean) => void;
    editando: boolean;
    formData: PessoaRequisicao;
    setFormData: (data: PessoaRequisicao) => void;
    erroFormulario: string | null;
    onSalvar: () => void;
    onCancelar: () => void;
}

/**
 * Componente de modal para criação e edição de pessoas.
 * Implementa restrições de UI como limite de caracteres e controle de idade.
 */
export function PessoaFormModal({
    aberto,
    onOpenChange,
    editando,
    formData,
    setFormData,
    erroFormulario,
    onSalvar,
    onCancelar
}: PessoaFormModalProps) {
    return (
        <Dialog open={aberto} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editando ? "Editar Pessoa" : "Nova Pessoa"}</DialogTitle>
                    <DialogDescription className="sr-only">Preencha os dados do formulário.</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Exibição centralizada de erros retornados pela API */}
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
                            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                            placeholder="Ex: Roberto Silva"
                            maxLength={200}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="idade">Idade</Label>
                        <Input
                            id="idade"
                            type="number"
                            value={formData.idade === 0 ? "" : formData.idade}
                            onChange={(e) => setFormData({ ...formData, idade: parseInt(e.target.value) || 0 })}
                            placeholder="Ex: 25"
                            min={0}
                            max={130}
                        />
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