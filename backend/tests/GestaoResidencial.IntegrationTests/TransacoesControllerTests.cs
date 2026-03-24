using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using GestaoResidencial.Api.Features.Categorias;
using GestaoResidencial.Api.Features.Pessoas;
using GestaoResidencial.Api.Features.Transacoes;
using Microsoft.AspNetCore.Mvc;

namespace GestaoResidencial.IntegrationTests;

public class TransacoesControllerTests : IClassFixture<GestaoResidencialApiFactory>
{
    private readonly HttpClient _client;

    public TransacoesControllerTests(GestaoResidencialApiFactory factory)
    {
        _client = factory.CreateClient();
    }

    /// <summary>
    /// Método auxiliar (Arrange) para preparar o estado do banco de dados em memória.
    /// Como a Transação depende de chaves estrangeiras (Pessoa e Categoria), 
    /// este método cria essas dependências antes da execução do teste principal.
    /// </summary>
    private async Task<(int PessoaId, int CategoriaId)> PrepararDependenciasAsync(int idadePessoa, FinalidadeCategoria finalidadeCategoria)
    {
        var pessoaReq = new PessoaRequisicao("Usuario Teste", idadePessoa);
        var pessoaRes = await _client.PostAsJsonAsync("/api/pessoas", pessoaReq);
        var pessoaCriada = await pessoaRes.Content.ReadFromJsonAsync<PessoaResposta>();

        var catReq = new CategoriaRequisicao("Categoria Teste", finalidadeCategoria);
        var catRes = await _client.PostAsJsonAsync("/api/categorias", catReq);
        var categoriaCriada = await catRes.Content.ReadFromJsonAsync<CategoriaResposta>();

        return (pessoaCriada!.Id, categoriaCriada!.Id);
    }

    /// <summary>
    /// Testa o endpoint POST /api/transacoes no cenário de sucesso.
    /// Verifica a integração completa: validação de chaves estrangeiras, salvamento via EF Core e retorno 201 Created.
    /// </summary>
    [Fact]
    public async Task Post_CriarTransacaoComSucesso_DeveRetornar201Created()
    {
        var (pessoaId, categoriaId) = await PrepararDependenciasAsync(30, FinalidadeCategoria.Despesa);
        var requisicao = new TransacaoRequisicao("Conta de Luz", 150.75m, TipoTransacao.Despesa, pessoaId, categoriaId);

        var resposta = await _client.PostAsJsonAsync("/api/transacoes", requisicao);

        resposta.StatusCode.Should().Be(HttpStatusCode.Created);

        // Valida se o controller montou o DTO de resposta corretamente,
        // injetando os dados resolvidos das entidades relacionadas.
        var transacaoCriada = await resposta.Content.ReadFromJsonAsync<TransacaoResposta>();
        transacaoCriada.Should().NotBeNull();
        transacaoCriada!.Id.Should().BeGreaterThan(0);
        transacaoCriada.Valor.Should().Be(150.75m);
        transacaoCriada.NomePessoa.Should().Be("Usuario Teste"); 
    }

    /// <summary>
    /// Testa a aplicação da regra de negócio central da especificação pela API.
    /// Garante que o GlobalExceptionHandler capture a restrição do Domínio (Menores de 18 anos)
    /// e a devolva em um formato padronizado (ProblemDetails) com HTTP 400.
    /// </summary>
    [Fact]
    public async Task Post_FalhaRegraDeNegocio_MenorDeIdadeRegistrandoReceita_DeveRetornar400BadRequest()
    {
        var (pessoaId, categoriaId) = await PrepararDependenciasAsync(15, FinalidadeCategoria.Receita);
        var requisicao = new TransacaoRequisicao("Mesada", 100m, TipoTransacao.Receita, pessoaId, categoriaId);

        var resposta = await _client.PostAsJsonAsync("/api/transacoes", requisicao);

        resposta.StatusCode.Should().Be(HttpStatusCode.BadRequest);

        // Verifica a consistência da mensagem de erro repassada ao front-end.
        var detalhes = await resposta.Content.ReadFromJsonAsync<ProblemDetails>();
        detalhes.Should().NotBeNull();
        detalhes!.Detail.Should().Contain("Menores de idade só podem registrar transações do tipo Despesa");
    }

    /// <summary>
    /// Testa o mecanismo de Fail Fast.
    /// Garante que o ASP.NET Core barre valores inválidos (como valor zero) através de
    /// Data Annotations antes mesmo de tentar instanciar o modelo de Domínio.
    /// </summary>
    [Fact]
    public async Task Post_FalhaDeValidacao_ValorZero_DeveRetornar400BadRequest()
    {
        var (pessoaId, categoriaId) = await PrepararDependenciasAsync(30, FinalidadeCategoria.Ambas);
        var requisicao = new TransacaoRequisicao("Compra", 0, TipoTransacao.Despesa, pessoaId, categoriaId);

        var resposta = await _client.PostAsJsonAsync("/api/transacoes", requisicao);

        resposta.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var detalhes = await resposta.Content.ReadFromJsonAsync<ProblemDetails>();
        detalhes!.Title.Should().Be("One or more validation errors occurred."); 
    }

    /// <summary>
    /// Testa o endpoint GET /api/transacoes para assegurar que a paginação funciona
    /// e que a projeção de dados (AsNoTracking + Select) devolve informações sem
    /// expor as entidades completas.
    /// </summary>
    [Fact]
    public async Task Get_ListarTransacoes_DeveRetornarPaginadoComDadosDesnormalizados()
    {
        var (pessoaId, categoriaId) = await PrepararDependenciasAsync(25, FinalidadeCategoria.Ambas);
        await _client.PostAsJsonAsync("/api/transacoes", 
            new TransacaoRequisicao("Transacao 1", 10m, TipoTransacao.Despesa, pessoaId, categoriaId));
        await _client.PostAsJsonAsync("/api/transacoes", 
            new TransacaoRequisicao("Transacao 2", 20m, TipoTransacao.Despesa, pessoaId, categoriaId));

        var resposta = await _client.GetAsync("/api/transacoes?pagina=1&tamanhoPagina=10");

        resposta.StatusCode.Should().Be(HttpStatusCode.OK);

        var paginacao = await resposta.Content.ReadFromJsonAsync<PaginacaoResposta<TransacaoResposta>>();
        paginacao.Should().NotBeNull();
        paginacao!.TotalRegistros.Should().BeGreaterThanOrEqualTo(2);
        paginacao.Itens.Should().NotBeEmpty();
        
        // Garante que o JOIN funcionou e os dados chegaram íntegros
        var primeiraTransacao = paginacao.Itens.First();
        primeiraTransacao.NomePessoa.Should().NotBeNullOrWhiteSpace();
        primeiraTransacao.DescricaoCategoria.Should().NotBeNullOrWhiteSpace();
    }
}