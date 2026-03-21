using System.ComponentModel.DataAnnotations;

namespace GestaoResidencial.Api.Features.Pessoas;

/// <summary>
/// DTO para receber os dados de criação ou atualização de uma Pessoa.
/// </summary>
public record PessoaRequisicao(
    [Required][MaxLength(200)] string Nome,
    [Range(0, 130)] int Idade
);