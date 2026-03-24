using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using GestaoResidencial.Api.Features.Categorias;
using GestaoResidencial.Api.Features.Financeiro;
using GestaoResidencial.Api.Features.Pessoas;
using GestaoResidencial.Api.Features.Transacoes;

namespace GestaoResidencial.IntegrationTests;

public class FinanceiroControllerTests : IClassFixture<GestaoResidencialApiFactory>
{
    private readonly HttpClient _client;

    public FinanceiroControllerTests(GestaoResidencialApiFactory factory)
    {
        _client = factory.CreateClient();
    }
    
    /// <summary>
    /// Cria intencionalmente uma pessoa com transações e outra sem nenhuma transação, 
    /// a fim de validar como a API lida com agregações vazias (tratamento de nulos).
    /// </summary>
    private async Task<(int pessoaComTransacao, int pessoaSemTransacao, int categoriaDespesa, int categoriaReceita)> PrepararCenarioAsync()
    {
        var p1 = await _client.PostAsJsonAsync("/api/pessoas", new PessoaRequisicao("João (Com Transação)", 30));
        var idComTransacao = (await p1.Content.ReadFromJsonAsync<PessoaResposta>())!.Id;

        var p2 = await _client.PostAsJsonAsync("/api/pessoas", new PessoaRequisicao("Maria (Sem Transação)", 25));
        var idSemTransacao = (await p2.Content.ReadFromJsonAsync<PessoaResposta>())!.Id;

        var c1 = await _client.PostAsJsonAsync("/api/categorias", new CategoriaRequisicao("Mercado", FinalidadeCategoria.Despesa));
        var idCatDespesa = (await c1.Content.ReadFromJsonAsync<CategoriaResposta>())!.Id;

        var c2 = await _client.PostAsJsonAsync("/api/categorias", new CategoriaRequisicao("Salário", FinalidadeCategoria.Receita));
        var idCatReceita = (await c2.Content.ReadFromJsonAsync<CategoriaResposta>())!.Id;

        await _client.PostAsJsonAsync("/api/transacoes", 
            new TransacaoRequisicao("Compra Mês", 100m, TipoTransacao.Despesa, idComTransacao, idCatDespesa));
        
        await _client.PostAsJsonAsync("/api/transacoes", 
            new TransacaoRequisicao("Pagamento", 500m, TipoTransacao.Receita, idComTransacao, idCatReceita));

        return (idComTransacao, idSemTransacao, idCatDespesa, idCatReceita);
    }

    /// <summary>
    /// Testa o endpoint principal de relatórios financeiros exigido pela especificação.
    /// Valida três pontos cruciais:
    /// 1. A precisão matemática dos totalizadores gerais da aplicação.
    /// 2. O cálculo individual do saldo de uma pessoa com movimentações.
    /// 3. O comportamento defensivo da API ao retornar 0 (e não null) para pessoas sem movimentação.
    /// </summary>
    [Fact]
    public async Task Get_RelatorioPessoas_DeveRetornarTotaisCorretos_E_ZerarPessoasSemTransacao()
    {
        var ids = await PrepararCenarioAsync();

        var resposta = await _client.GetAsync("/api/financeiro/pessoas?pagina=1&tamanhoPagina=10");

        resposta.StatusCode.Should().Be(HttpStatusCode.OK);
        var relatorio = await resposta.Content.ReadFromJsonAsync<RelatorioPaginadoResposta<RelatorioPessoaResposta>>();
        
        relatorio.Should().NotBeNull();
        relatorio!.Itens.Should().NotBeEmpty();

        relatorio.TotalGeralDespesas.Should().Be(100m);
        relatorio.TotalGeralReceitas.Should().Be(500m);
        relatorio.SaldoGeralLiquido.Should().Be(400m);

        var joao = relatorio.Itens.First(p => p.Id == ids.pessoaComTransacao);
        joao.TotalDespesas.Should().Be(100m);
        joao.TotalReceitas.Should().Be(500m);
        joao.Saldo.Should().Be(400m);

        var maria = relatorio.Itens.First(p => p.Id == ids.pessoaSemTransacao);
        maria.TotalDespesas.Should().Be(0m);
        maria.TotalReceitas.Should().Be(0m);
        maria.Saldo.Should().Be(0m);
    }

    /// <summary>
    /// Testa o requisito opcional de "Consulta de totais por categoria".
    /// Verifica se a query do Entity Framework agrupa corretamente os valores,
    /// garantindo que as despesas não vazem para as categorias de receita e vice-versa.
    /// </summary>
    [Fact]
    public async Task Get_RelatorioCategorias_DeveRetornarTotaisCorretos()
    {
        var ids = await PrepararCenarioAsync();

        var resposta = await _client.GetAsync("/api/financeiro/categorias");

        resposta.StatusCode.Should().Be(HttpStatusCode.OK);
        var relatorio = await resposta.Content.ReadFromJsonAsync<RelatorioGeralResposta<RelatorioCategoriaResposta>>();

        relatorio.Should().NotBeNull();
        relatorio!.Itens.Should().NotBeEmpty();

        var catDespesa = relatorio.Itens.First(c => c.Id == ids.categoriaDespesa);
        catDespesa.TotalDespesas.Should().Be(100m);
        catDespesa.TotalReceitas.Should().Be(0m);

        var catReceita = relatorio.Itens.First(c => c.Id == ids.categoriaReceita);
        catReceita.TotalDespesas.Should().Be(0m);
        catReceita.TotalReceitas.Should().Be(500m);
    }
}