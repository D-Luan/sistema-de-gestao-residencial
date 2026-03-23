import { api } from "./api";
import type { PaginacaoResposta, PessoaRequisicao, PessoaResposta } from "../types/Pessoa";

/**
 * Serviço responsável por encapsular as chamadas de Pessoa.
 * Segue o padrão de isolar as regras de comunicação HTTP dos componentes visuais.
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

    /**
     * A exclusão de uma pessoa implica na remoção de todas as suas transações
     * vinculadas, conforme regra de negócio definida no backend.
     */
    remover: async (id: number): Promise<void> => {
        await api.delete(`/pessoas/${id}`);
    }
};