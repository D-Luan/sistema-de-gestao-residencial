using FluentAssertions;
using GestaoResidencial.Api.Features.Categorias;
using GestaoResidencial.Api.Features.Transacoes;

namespace GestaoResidencial.UnitTests;

public class TransacaoTests
{
    /// <summary>
    /// Usuários menores de 18 anos são estritamente proibidos de registrar transações do tipo Receita,
    /// sendo permitidos apenas registros de Despesa.
    /// </summary>
    [Fact]
    public void InstanciarTransacao_MenorDeIdadeTentandoRegistrarReceita_DeveLancarArgumentException()
    {
        Action acao = () => new Transacao("Mesada", 100, TipoTransacao.Receita, 1, 17, 1, FinalidadeCategoria.Ambas);

        acao.Should().Throw<ArgumentException>()
            .WithMessage("*Menores de idade só podem registrar transações do tipo Despesa.*");
    }

    /// <summary>
    /// Garante a integridade financeira do Domínio Rico ao aplicar a restrição de categorias.
    /// Impede estruturalmente que uma transação de Despesa seja atrelada a uma categoria de Receita.
    /// </summary>
    [Fact]
    public void InstanciarTransacao_CategoriaIncompativel_DeveLancarArgumentException()
    {
        Action acao = () => new Transacao("Supermercado", 200, TipoTransacao.Despesa, 1, 30, 1, FinalidadeCategoria.Receita);

        acao.Should().Throw<ArgumentException>()
            .WithMessage("*Não é possível usar uma categoria de Receita para uma Despesa.*");
    }

    /// <summary>
    /// Confirma que ao passar por todas as validações estruturais e de negócio (Fail Fast), 
    /// a entidade é instanciada corretamente, mantendo a consistência dos dados esperada.
    /// </summary>
    [Fact]
    public void InstanciarTransacao_DadosValidos_DeveCriarComSucesso()
    {
        var transacao = new Transacao("Salário", 5000, TipoTransacao.Receita, 1, 30, 1, FinalidadeCategoria.Receita);

        transacao.Should().NotBeNull();
        transacao.Valor.Should().Be(5000);
        transacao.Tipo.Should().Be(TipoTransacao.Receita);
    }
}