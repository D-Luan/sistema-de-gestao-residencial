namespace GestaoResidencial.Api.Features.Transacoes;

public record TransacaoResposta(
    int Id,
    string Descricao,
    decimal Valor,
    TipoTransacao Tipo,
    int PessoaId,
    string NomePessoa,
    int CategoriaId,
    string DescricaoCategoria
);