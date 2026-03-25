import { api } from "../../lib/api";
import type { RelatorioPaginadoResposta, RelatorioPessoaResposta, RelatorioCategoriaResposta, RelatorioGeralResposta} from "./financeiro.types";

/**
 * Serviço especializado em consultas agregadas.
 * Centraliza as chamadas que realizam cálculos de saldo e somatórios no back-end,
 * garantindo que a lógica de negócio financeira seja processada no .NET.
 */
export const financeiroService = {
    /**
     * Recupera o relatório de pessoas com seus respectivos saldos.
     */
    obterTotaisPorPessoa: async (pagina = 1, tamanhoPagina = 10): Promise<RelatorioPaginadoResposta<RelatorioPessoaResposta>> => {
        const response = await api.get<RelatorioPaginadoResposta<RelatorioPessoaResposta>>("/financeiro/pessoas", {
            params: { pagina, tamanhoPagina },
        });
        return response.data;
    },

    /**
     * Recupera o relatório de categorias com seus respectivos saldos.
     */
    obterTotaisPorCategoria: async (): Promise<RelatorioGeralResposta<RelatorioCategoriaResposta>> => {
        const response = await api.get<RelatorioGeralResposta<RelatorioCategoriaResposta>>("/financeiro/categorias");
        return response.data;
    }
};