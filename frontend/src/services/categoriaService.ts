import { api } from "./api";
import type { CategoriaRequisicao, CategoriaResposta } from "../types/Categoria";

/**
 * Serviço responsável por encapsular as chamadas HTTP relacionadas à entidade Categoria.
 * Isola as regras de comunicação do backend dos componentes visuais.
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