/**
 * Interfaces que definem a estrutura de dados para a feature de Pessoas.
 * Centraliza os tipos para garantir consistência entre o serviço e os componentes.
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
    nome: string;
    idade: number;
}