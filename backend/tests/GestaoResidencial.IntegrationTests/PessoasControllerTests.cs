using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using GestaoResidencial.Api.Features.Pessoas;
using Microsoft.AspNetCore.Mvc;

namespace GestaoResidencial.IntegrationTests;

public class PessoasControllerTests : IClassFixture<GestaoResidencialApiFactory>
{
    private readonly HttpClient _client;

    public PessoasControllerTests(GestaoResidencialApiFactory factory)
    {
        _client = factory.CreateClient();
    }

    /// <summary>
    /// Testa o endpoint POST /api/pessoas para o cenário de sucesso.
    /// Verifica se a API processa corretamente a requisição, salva no banco e retorna 201 Created.
    /// </summary>
    [Fact]
    public async Task Post_CriarPessoaComSucesso_DeveRetornar201Created()
    {
        var requisicao = new PessoaRequisicao("Maria Souza", 25);
        
        var resposta = await _client.PostAsJsonAsync("/api/pessoas", requisicao);
        
        resposta.StatusCode.Should().Be(HttpStatusCode.Created);
    
        // Desserializa o corpo da resposta HTTP (JSON) de volta para o objeto PessoaResposta.
        // Isso permite validar se a API devolveu os dados exatos que foi enviado e se o ID foi gerado.
        var pessoaCriada = await resposta.Content.ReadFromJsonAsync<PessoaResposta>();
        pessoaCriada.Should().NotBeNull();
        pessoaCriada!.Nome.Should().Be("Maria Souza");
        pessoaCriada.Idade.Should().Be(25);
        pessoaCriada.Id.Should().BeGreaterThan(0);
    }

    /// <summary>
    /// Testa se a API está validando os dados de entrada (Fail Fast).
    /// Como foi usado Data Annotations [Range] no DTO, a API deve barrar a requisição
    /// e retornar o padrão ProblemDetails indicando erro de validação (HTTP 400).
    /// </summary>
    [Fact]
    public async Task Post_FalhaDeRegraDeNegocio_IdadeNegativa_DeveRetornar400BadRequest()
    {
        var requisicaoInvalida = new PessoaRequisicao("Carlos", -5);
        
        var resposta = await _client.PostAsJsonAsync("/api/pessoas", requisicaoInvalida);
        
        resposta.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        
        // Lê o JSON de erro gerado pelo ProblemDetails para garantir 
        // que a recusa foi devido a falha de validação da propriedade.
        var detalhesDoProblema = await resposta.Content.ReadFromJsonAsync<ProblemDetails>();
        detalhesDoProblema.Should().NotBeNull();
        detalhesDoProblema!.Title.Should().Be("One or more validation errors occurred.");
    }

    /// <summary>
    /// Testa o endpoint GET /api/pessoas/{id} para garantir que a consulta
    /// retorna corretamente os dados de uma pessoa cadastrada.
    /// </summary>
    [Fact]
    public async Task Get_ObterPessoaPorId_DeveRetornar200OK()
    {
        var requisicao = new PessoaRequisicao("Pedro Alves", 40);
        var postResposta = await _client.PostAsJsonAsync("/api/pessoas", requisicao);
        var pessoaCriada = await postResposta.Content.ReadFromJsonAsync<PessoaResposta>();
        
        var getResposta = await _client.GetAsync($"/api/pessoas/{pessoaCriada!.Id}");
        
        getResposta.StatusCode.Should().Be(HttpStatusCode.OK);

        // Extrai o conteúdo do GET para confirmar se os dados vieram íntegros do banco
        var pessoaObtida = await getResposta.Content.ReadFromJsonAsync<PessoaResposta>();
        pessoaObtida.Should().NotBeNull();
        pessoaObtida!.Id.Should().Be(pessoaCriada.Id);
        pessoaObtida.Nome.Should().Be("Pedro Alves");
    }
}