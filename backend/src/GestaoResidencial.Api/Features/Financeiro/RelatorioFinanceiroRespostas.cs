namespace GestaoResidencial.Api.Features.Financeiro;

/// <summary>
/// DTO para os relatórios financeiros.
/// Resolve o requisito da especificação que exige exibir o "total geral" (Receitas, Despesas e Saldo Líquido) 
/// no rodapé das listagens, juntando com os gerais aos dados paginados.
/// </summary>
public record RelatorioPaginadoResposta<T>(
    IEnumerable<T> Itens,
    int TotalRegistros,
    int PaginaAtual,
    int TamanhoPagina,
    decimal TotalGeralReceitas,
    decimal TotalGeralDespesas,
    decimal SaldoGeralLiquido
);

/// <summary>
/// DTO para a funcionalidade "Consulta de totais por pessoa".
/// Entrega para o frontend os dados da pessoa já consolidados com o somatório de suas transações.
/// </summary>
public record RelatorioPessoaResposta(
    int Id,
    string Nome,
    int Idade,
    decimal TotalReceitas,
    decimal TotalDespesas
)
{
    public decimal Saldo => TotalReceitas - TotalDespesas;
}

/// <summary>
/// DTO de projeção para a funcionalidade "Consulta de totais por categoria".
/// Facilita a montagem da interface gráfica ao entregar os totais agregados por categoria de forma direta.
/// </summary>
public record RelatorioCategoriaResposta(
    int Id,
    string Descricao,
    string Finalidade,
    decimal TotalReceitas,
    decimal TotalDespesas
)
{
    public decimal Saldo => TotalReceitas - TotalDespesas;
}

public record RelatorioGeralResposta<T>(
    IEnumerable<T> Itens,
    decimal TotalGeralReceitas,
    decimal TotalGeralDespesas,
    decimal SaldoGeralLiquido
);