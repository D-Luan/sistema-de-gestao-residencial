namespace GestaoResidencial.Api.Features.Categorias;

/// <summary>
/// Define as finalidades permitidas para uma categoria.
/// Usado para restringir as transações.
/// </summary>
public enum FinalidadeCategoria
{
    Despesa = 1,
    Receita = 2,
    Ambas = 3
}