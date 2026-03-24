/**
 * Interfaces TypeScript alinhadas com os DTOs do Backend.
 */

export type TipoTransacao = 1 | 2;

export const TipoTransacaoLabel: Record<TipoTransacao, string> = {
    1: 'Despesa',
    2: 'Receita'
};

/**
 * Modelo de resposta desnormalizado. 
 * O backend já resolve as chaves estrangeiras e entrega o NomePessoa e DescricaoCategoria.
 * Isso otimiza a tabela do frontend, evitando múltiplas requisições adicionais (N+1 queries).
 */
export interface TransacaoResposta {
    id: number;
    descricao: string;
    valor: number;
    tipo: TipoTransacao;
    pessoaId: number;
    nomePessoa: string;
    categoriaId: number;
    descricaoCategoria: string;
}

export interface TransacaoRequisicao {
    descricao: string;
    valor: number;
    tipo: TipoTransacao;
    pessoaId: number;
    categoriaId: number;
}