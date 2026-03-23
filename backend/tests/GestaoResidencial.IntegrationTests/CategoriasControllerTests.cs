using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using GestaoResidencial.Api.Features.Categorias;
using Microsoft.AspNetCore.Mvc;

namespace GestaoResidencial.IntegrationTests;

public class CategoriasControllerTests : IClassFixture<GestaoResidencialApiFactory>
{
    private readonly HttpClient _client;

    public CategoriasControllerTests(GestaoResidencialApiFactory factory)
    {
        _client = factory.CreateClient();
    }

    /// <summary>
    /// Testa o endpoint POST /api/categorias para o cenário de sucesso.
    /// Verifica se a API processa corretamente a requisição, salva no banco e retorna 201 Created.
    /// </summary>
    [Fact]
    public async Task Post_CriarCategoriaComSucesso_DeveRetornar201Created()
    {
        var requisicao = new CategoriaRequisicao("Salário", FinalidadeCategoria.Receita);

        var resposta = await _client.PostAsJsonAsync("/api/categorias", requisicao);

        resposta.StatusCode.Should().Be(HttpStatusCode.Created);

        // Desserializa o corpo da resposta HTTP (JSON) de volta para o objeto CategoriaResposta.
        // Permite validar se a API devolveu os dados exatos que foi enviado e se o ID foi gerado.
        var categoriaCriada = await resposta.Content.ReadFromJsonAsync<CategoriaResposta>();
        categoriaCriada.Should().NotBeNull();
        categoriaCriada!.Descricao.Should().Be("Salário");
        categoriaCriada.Finalidade.Should().Be(FinalidadeCategoria.Receita);
        categoriaCriada.Id.Should().BeGreaterThan(0);
    }

    /// <summary>
    /// Testa se a API está validando os dados de entrada (Fail Fast) quando a descrição é vazia.
    /// Como a entidade Categoria valida a descrição no construtor, a API deve barrar a requisição
    /// e retornar o padrão ProblemDetails indicando erro de validação (HTTP 400).
    /// </summary>
    [Fact]
    public async Task Post_FalhaDeValidacao_DescricaoVazia_DeveRetornar400BadRequest()
    {
        var requisicaoInvalida = new CategoriaRequisicao("", FinalidadeCategoria.Despesa);

        var resposta = await _client.PostAsJsonAsync("/api/categorias", requisicaoInvalida);

        resposta.StatusCode.Should().Be(HttpStatusCode.BadRequest);

        var detalhesDoProblema = await resposta.Content.ReadFromJsonAsync<ProblemDetails>();
        detalhesDoProblema.Should().NotBeNull();
    }

    /// <summary>
    /// Testa o endpoint GET /api/categorias para garantir que a listagem retorna todas as categorias
    /// ordenadas por descrição, conforme especificação da API.
    /// </summary>
    [Fact]
    public async Task Get_ListarCategorias_DeveRetornar200OK_E_OrdenadoPorDescricao()
    {
        await _client.PostAsJsonAsync("/api/categorias",
            new CategoriaRequisicao("Z - Lazer", FinalidadeCategoria.Despesa));
        await _client.PostAsJsonAsync("/api/categorias",
            new CategoriaRequisicao("A - Água", FinalidadeCategoria.Despesa));

        var resposta = await _client.GetAsync("/api/categorias");

        resposta.StatusCode.Should().Be(HttpStatusCode.OK);

        // Verifica o conteúdo do GET para confirmar se os dados estão corretos
        var lista = await resposta.Content.ReadFromJsonAsync<List<CategoriaResposta>>();
        lista.Should().NotBeNull();
        lista.Should().NotBeEmpty();
        lista!.First().Descricao.Should().StartWith("A -");
    }
}