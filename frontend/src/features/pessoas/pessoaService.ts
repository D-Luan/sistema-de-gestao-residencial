import { api } from "../../services/api";
import type { PaginacaoResposta, PessoaRequisicao, PessoaResposta } from "./pessoas.types";

/**
 * Camada de serviço responsável pelas requisições HTTP da entidade Pessoa.
 * Isola a lógica de API do restante da aplicação.
 */
export const pessoaService = {
    obterTodas: async (pagina = 1, tamanhoPagina = 10): Promise<PaginacaoResposta<PessoaResposta>> => {
        const response = await api.get<PaginacaoResposta<PessoaResposta>>("/pessoas", {
            params: { pagina, tamanhoPagina },
        });
        return response.data;
    },

    criar: async (dados: PessoaRequisicao): Promise<PessoaResposta> => {
        const response = await api.post<PessoaResposta>("/pessoas", dados);
        return response.data;
    },

    atualizar: async (id: number, dados: PessoaRequisicao): Promise<void> => {
        await api.put(`/pessoas/${id}`, dados);
    },

    remover: async (id: number): Promise<void> => {
        await api.delete(`/pessoas/${id}`);
    }
};