namespace GestaoResidencial.Api.Features.Pessoas;

/// <summary>
/// Envelope padrão para retornar dados paginados para o frontend.
/// </summary>
public record PaginacaoResposta<T>(
    IEnumerable<T> Itens,
    int TotalRegistros,
    int PaginaAtual,
    int TamanhoPagina
);