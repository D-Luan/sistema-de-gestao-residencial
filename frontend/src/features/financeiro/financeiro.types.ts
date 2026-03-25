/**
 * Interfaces para representação de dados consolidados e relatórios.
 * Estes tipos facilitam a exibição dos balanços financeiros exigidos no teste,
 * unindo dados cadastrais com somatórios de transações.
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

/**
 * Representa o balanço financeiro individual de uma pessoa.
 */
export interface RelatorioPessoaResposta {
    id: number;
    nome: string;
    idade: number;
    totalReceitas: number;
    totalDespesas: number;
    saldo: number;
}

/**
 * Representa o balanço financeiro individual de uma categoria.
 */
export interface RelatorioCategoriaResposta {
    id: number;
    descricao: string;
    finalidade: string;
    totalReceitas: number;
    totalDespesas: number;
    saldo: number;
}

// Wrapper para listas que não necessitam de paginação, mas exigem totais gerais
export interface RelatorioGeralResposta<T> {
    itens: T[];
    totalGeralReceitas: number;
    totalGeralDespesas: number;
    saldoGeralLiquido: number;
}