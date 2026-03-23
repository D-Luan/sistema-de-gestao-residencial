using FluentAssertions;
using GestaoResidencial.Api.Features.Categorias;

namespace GestaoResidencial.UnitTests;

public class CategoriaTests
{
    /// <summary>
    /// Garante que ao passar dados válidos, a entidade é instanciada corretamente
    /// mantendo a consistência do Domínio Rico.
    /// </summary>
    [Fact]
    public void InstanciarCategoria_ComDadosValidos_DeveCriarComSucesso()
    {
        var descricao = "Alimentação";
        var finalidade = FinalidadeCategoria.Despesa;

        var categoria = new Categoria(descricao, finalidade);

        categoria.Should().NotBeNull();
        categoria.Descricao.Should().Be(descricao);
        categoria.Finalidade.Should().Be(finalidade);
    }

    /// <summary>
    /// Valida a regra de negócio que impede a criação de uma Categoria sem descrição.
    /// O Domínio deve rejeitar descrições nulas, vazias ou compostas apenas por espaços.
    /// </summary>
    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData(null)]
    public void InstanciarCategoria_ComDescricaoInvalida_DeveLancarArgumentException(string? descricaoInvalida)
    {
        Action acao = () => new Categoria(descricaoInvalida!, FinalidadeCategoria.Ambas);

        acao.Should().Throw<ArgumentException>()
            .WithMessage("*A descrição não pode ser nula ou vazia.*");
    }

    /// <summary>
    /// Garante o cumprimento do limite de 400 caracteres
    /// para a descrição, evitando erros de truncamento no banco de dados.
    /// </summary>
    [Fact]
    public void InstanciarCategoria_ComDescricaoMaiorQue400Caracteres_DeveLancarArgumentOutOfRangeException()
    {
        var descricaoInvalida = new string('A', 401);

        Action acao = () => new Categoria(descricaoInvalida, FinalidadeCategoria.Receita);

        acao.Should().Throw<ArgumentOutOfRangeException>()
            .WithMessage("*A descrição não pode exceder 400 caracteres.*");
    }

    /// <summary>
    /// Garante que a entidade não aceite valores inválidos para a enumeração FinalidadeCategoria,
    /// mantendo a integridade dos dados do domínio.
    /// </summary>
    [Fact]
    public void InstanciarCategoria_ComFinalidadeInvalida_DeveLancarArgumentException()
    {
        var descricao = "Vendas";
        var finalidadeInvalida = (FinalidadeCategoria)99;

        Action acao = () => new Categoria(descricao, finalidadeInvalida);

        acao.Should().Throw<ArgumentException>()
            .WithMessage("*A finalidade informada é inválida.*");
    }
}