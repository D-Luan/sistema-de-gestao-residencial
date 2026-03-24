import { api } from "./api";
import type { TransacaoRequisicao, TransacaoResposta } from "../types/Transacao";
import type { PaginacaoResposta } from "../types/Pessoa";

/**
 * Serviço responsável por encapsular as chamadas HTTP da entidade Transação.
 * Isola as regras de comunicação com a API (Axios) dos componentes visuais do React,
 * mantendo o código limpo e facilitando a manutenção e futuros testes unitários.
 */
export const transacaoService = {
    
    /**
     * Busca a listagem de transações aplicando paginação na origem.
     * Isso evita sobrecarga de memória no navegador caso o volume de transações cresça.
     */
    obterTodas: async (pagina = 1, tamanhoPagina = 10): Promise<PaginacaoResposta<TransacaoResposta>> => {
        const response = await api.get<PaginacaoResposta<TransacaoResposta>>("/transacoes", {
            params: { pagina, tamanhoPagina },
        });
        return response.data;
    },

    criar: async (dados: TransacaoRequisicao): Promise<TransacaoResposta> => {
        const response = await api.post<TransacaoResposta>("/transacoes", dados);
        return response.data;
    }
};