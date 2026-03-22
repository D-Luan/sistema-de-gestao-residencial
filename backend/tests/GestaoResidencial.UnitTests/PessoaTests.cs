using FluentAssertions;
using GestaoResidencial.Api.Features.Pessoas;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Xunit;

namespace GestaoResidencial.UnitTests;

public class PessoaTests
{
    /// <summary>
    /// Garante que ao passar dados válidos, a entidade é instanciada corretamente
    /// mantendo a consistência do Domínio Rico.
    /// </summary>
    [Fact]
    public void InstanciarPessoa_ComDadosValidos_DeveCriarComSucesso()
    {
        var nome = "João Silva";
        var idade = 30;

        var pessoa = new Pessoa(nome, idade);

        pessoa.Should().NotBeNull();
        pessoa.Nome.Should().Be(nome);
        pessoa.Idade.Should().Be(idade);
    }

    /// <summary>
    /// Valida a regra de negócio que impede a criação de uma Pessoa sem nome.
    /// O Domínio deve rejeitar nomes nulos, vazios ou compostos apenas por espaços.
    /// </summary>
    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData(null)]
    public void InstanciarPessoa_ComNomeInvalido_DeveLancarArgumentException(string? nomeInvalido)
    {
        var idade = 30;

        Action acao = () => new Pessoa(nomeInvalido!, idade);

        acao.Should().Throw<ArgumentException>()
            .WithMessage("*O nome não pode ser nulo ou vazio.*");
    }

    /// <summary>
    /// Garante o cumprimento do limite de 200 caracteres
    /// para o nome, evitando erros de truncamento no banco de dados.
    /// </summary>
    [Fact]
    public void InstanciarPessoa_ComNomeMaiorQue200Caracteres_DeveLancarArgumentOutOfRangeException()
    {
        var nomeInvalido = new string('A', 201);
        var idade = 30;

        Action acao = () => new Pessoa(nomeInvalido, idade);

        acao.Should().Throw<ArgumentOutOfRangeException>()
            .WithMessage("*O nome não pode exceder 200 caracteres.*");
    }

    /// <summary>
    /// Garante que o Domínio Rico esteja protegido contra idades negativas,
    /// evitando inconsistências na base de dados.
    /// </summary>
    [Fact]
    public void InstanciarPessoa_ComIdadeNegativa_DeveLancarArgumentOutOfRangeException()
    {
        var nome = "João Silva";
        var idadeInvalida = -1;

        Action acao = () => new Pessoa(nome, idadeInvalida);

        acao.Should().Throw<ArgumentOutOfRangeException>()
            .WithMessage("*A idade não pode ser negativa ou maior que 130 anos.*");
    }

    /// <summary>
    /// Garante que a entidade não aceite idades irreais (acima de 130 anos),
    /// mantendo a coerência dos dados no sistema.
    /// </summary>
    [Fact]
    public void InstanciarPessoa_ComIdadeAcimaDoLimite_DeveLancarArgumentOutOfRangeException()
    {
        var nome = "João Silva";
        var idadeInvalida = 131;

        Action acao = () => new Pessoa(nome, idadeInvalida);

        acao.Should().Throw<ArgumentOutOfRangeException>()
            .WithMessage("*A idade não pode ser negativa ou maior que 130 anos.*");
    }
}