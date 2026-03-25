import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { categoriaService } from "@/features/categorias/categoriaService";
import { financeiroService } from "@/services/financeiroService";
import type { CategoriaRequisicao } from "@/features/categorias/categorias.types";
import type { RelatorioGeralResposta, RelatorioCategoriaResposta } from "@/types/Financeiro";

import { Button } from "@/components/ui/button";
import { CategoriasTable } from "@/features/categorias/components/CategoriasTable";
import { CategoriaFormModal } from "@/features/categorias/components/CategoriaFormModal";

/**
 * Página de gerenciamento de categorias.
 * Orquestra a listagem com balanço financeiro e a criação de novas categorias.
 */
export function Categorias() {
    // Utiliza o financeiroService para obter dados consolidados (categorias + totais)
    const [relatorio, setRelatorio] = useState<RelatorioGeralResposta<RelatorioCategoriaResposta> | null>(null);
    const [carregando, setCarregando] = useState(false);

    const [modalAberto, setModalAberto] = useState(false);
    const [formData, setFormData] = useState<CategoriaRequisicao>({ descricao: "", finalidade: 1 });
    const [erroFormulario, setErroFormulario] = useState<string | null>(null);

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            setCarregando(true);
            const dados = await financeiroService.obterTotaisPorCategoria();
            setRelatorio(dados);
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
                    Gerencie as categorias de transações e visualize o balanço de cada uma.
                </p>
            </div>

            <div className="space-y-3">
                <div className="flex justify-end">
                    <Button onClick={abrirModalNovo} className="bg-slate-900 hover:bg-slate-800 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Nova Categoria
                    </Button>
                </div>

                <CategoriasTable
                    relatorio={relatorio}
                    carregando={carregando}
                />

                <CategoriaFormModal
                    aberto={modalAberto}
                    onOpenChange={setModalAberto}
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