namespace GestaoResidencial.Api.Features.Categorias;

/// <summary>
/// DTO para enviar os dados de uma Categoria para o frontend.
/// </summary>
public record CategoriaResposta(
    int Id,
    string Descricao,
    FinalidadeCategoria Finalidade
);