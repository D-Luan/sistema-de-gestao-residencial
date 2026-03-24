using System.ComponentModel.DataAnnotations;

namespace GestaoResidencial.Api.Features.Transacoes;

public record TransacaoRequisicao(
    [Required][MaxLength(400)] string Descricao,
    [Range(0.01, double.MaxValue, ErrorMessage = "O valor deve ser maior que zero.")] decimal Valor,
    [EnumDataType(typeof(TipoTransacao))] TipoTransacao Tipo,
    [Required] int PessoaId,
    [Required] int CategoriaId
);