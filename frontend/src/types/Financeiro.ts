/**
 * DTOs alinhados com os relatórios do Backend.
 * Os totais e saldos já vêm pré-calculados da API, garantindo consistência financeira.
 */

export interface RelatorioPaginadoResposta<T> {
    itens: T[];
    totalRegistros: number;
    paginaAtual: number;
    tamanhoPagina: number;
    totalGeralReceitas: number;
    totalGeralDespesas: number;
    saldoGeralLiquido: number;
}

export interface RelatorioPessoaResposta {
    id: number;
    nome: string;
    idade: number;
    totalReceitas: number;
    totalDespesas: number;
    saldo: number;
}

export interface RelatorioCategoriaResposta {
    id: number;
    descricao: string;
    finalidade: string;
    totalReceitas: number;
    totalDespesas: number;
    saldo: number;
}

export interface RelatorioGeralResposta<T> {
    itens: T[];
    totalGeralReceitas: number;
    totalGeralDespesas: number;
    saldoGeralLiquido: number;
}