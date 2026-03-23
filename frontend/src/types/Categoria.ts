/**
 * Interfaces alinhadas com o Schema de Categoria definida no Backend (.NET).
 */

export type FinalidadeCategoria = 1 | 2 | 3;

export const FinalidadeCategoriaLabel: Record<FinalidadeCategoria, string> = {
    1: 'Despesa',
    2: 'Receita',
    3: 'Ambas'
};

export interface CategoriaResposta {
    id: number;
    descricao: string;
    finalidade: FinalidadeCategoria;
}

export interface CategoriaRequisicao {
    descricao: string;
    finalidade: FinalidadeCategoria;
}