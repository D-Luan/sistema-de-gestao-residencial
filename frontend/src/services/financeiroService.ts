import { api } from "./api";
import type { RelatorioPaginadoResposta, RelatorioPessoaResposta, RelatorioCategoriaResposta, RelatorioGeralResposta} from "../types/Financeiro";

/**
 * Serviço para consumo de relatórios e totalizadores.
 * Separado dos serviços de CRUD (Pessoa/Categoria) para respeitar o Princípio da Responsabilidade Única (SRP).
 */
export const financeiroService = {
    /**
     * Atende ao requisito "Consulta de totais por pessoa".
     * Traz a listagem paginada unida ao totalizador geral da aplicação.
     */
    obterTotaisPorPessoa: async (pagina = 1, tamanhoPagina = 10): Promise<RelatorioPaginadoResposta<RelatorioPessoaResposta>> => {
        const response = await api.get<RelatorioPaginadoResposta<RelatorioPessoaResposta>>("/financeiro/pessoas", {
            params: { pagina, tamanhoPagina },
        });
        return response.data;
    },

    obterTotaisPorCategoria: async (): Promise<RelatorioGeralResposta<RelatorioCategoriaResposta>> => {
        const response = await api.get<RelatorioGeralResposta<RelatorioCategoriaResposta>>("/financeiro/categorias");
        return response.data;
    }
};