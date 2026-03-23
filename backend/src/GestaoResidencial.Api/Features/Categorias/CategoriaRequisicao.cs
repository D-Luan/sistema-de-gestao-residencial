using System.ComponentModel.DataAnnotations;

namespace GestaoResidencial.Api.Features.Categorias;

/// <summary>
/// DTO para receber os dados de criação de uma Categoria.
/// </summary>
public record CategoriaRequisicao(
    [Required][MaxLength(400)] string Descricao,
    [EnumDataType(typeof(FinalidadeCategoria))] FinalidadeCategoria Finalidade
);