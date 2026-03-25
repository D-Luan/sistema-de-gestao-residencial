/**
 * Define as finalidades permitidas para uma categoria.
 * 1: Despesa, 2: Receita, 3: Ambas.
 */
export type FinalidadeCategoria = 1 | 2 | 3;

// Mapeamento para exibição amigável no front-end
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