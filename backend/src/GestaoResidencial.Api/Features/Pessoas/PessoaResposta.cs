namespace GestaoResidencial.Api.Features.Pessoas;

/// <summary>
/// DTO para enviar os dados de uma Pessoa de volta para o frontend.
/// </summary>
public record PessoaResposta(
    int Id,
    string Nome,
    int Idade
);