import { api } from "../../lib/api";
import type { CategoriaRequisicao, CategoriaResposta } from "@/features/categorias/categorias.types";

/**
 * Serviço responsável pela persistência de categorias.
 * Garante a comunicação com o back-end.
 */
export const categoriaService = {
    obterTodas: async (): Promise<CategoriaResposta[]> => {
        const response = await api.get<CategoriaResposta[]>("/categorias");
        return response.data;
    },

    criar: async (dados: CategoriaRequisicao): Promise<CategoriaResposta> => {
        const response = await api.post<CategoriaResposta>("/categorias", dados);
        return response.data;
    }
};