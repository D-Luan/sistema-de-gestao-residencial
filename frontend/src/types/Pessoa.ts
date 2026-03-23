/**
 * Interfaces alinhadas com o Schema do Backend (.NET).
 */

export interface PaginacaoResposta<T> {
    itens: T[];
    totalRegistros: number;
    paginaAtual: number;
    tamanhoPagina: number;
}

export interface PessoaResposta {
    id: number;
    nome: string;
    idade: number;
}

export interface PessoaRequisicao {
    // Regras: Nome máx 200 caracteres | Idade positiva
    nome: string;
    idade: number;
}