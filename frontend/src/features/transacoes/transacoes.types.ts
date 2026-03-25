/**
 * Definições de tipo para o domínio de Transações.
 * 1 representa Saída (Despesa) e 2 representa Entrada (Receita).
 */
export type TipoTransacao = 1 | 2;

export const TipoTransacaoLabel: Record<TipoTransacao, string> = {
    1: 'Despesa',
    2: 'Receita'
};

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