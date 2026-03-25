import { api } from "../../lib/api";
import type { TransacaoRequisicao, TransacaoResposta } from "./transacoes.types";
import type { PaginacaoResposta } from "../pessoas/pessoas.types";

/**
 * Serviço para persistência de lançamentos financeiros.
 * As validações de regra de negócio (idade e categoria) são processadas no back-end
 * para garantir a integridade dos dados.
 */
export const transacaoService = {
    
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