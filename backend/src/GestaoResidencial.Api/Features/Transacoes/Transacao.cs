using GestaoResidencial.Api.Features.Categorias;

namespace GestaoResidencial.Api.Features.Transacoes;

/// <summary>
/// Entidade de domínio que representa uma Transação.
/// Segue o padrão de Domínio Rico (Rich Domain), garantindo que a entidade 
/// seja instanciada apenas se atender a todos os requisitos estruturais e de negócio.
/// </summary>
public class Transacao
{
    public int Id { get; private set; }
    public string Descricao { get; private set; } = string.Empty;
    public decimal Valor { get; private set; }
    public TipoTransacao Tipo { get; private set; }
    
    public int PessoaId { get; private set; }
    public int CategoriaId { get; private set; }

    protected Transacao() { }

    public Transacao(string descricao, decimal valor, TipoTransacao tipo, 
        int pessoaId, int idadePessoa, 
        int categoriaId, FinalidadeCategoria finalidadeCategoria)
    {
        ValidarDadosBasicos(descricao, valor, tipo, pessoaId, categoriaId);
        ValidarRegrasDeNegocio(tipo, idadePessoa, finalidadeCategoria);

        Descricao = descricao;
        Valor = valor;
        Tipo = tipo;
        PessoaId = pessoaId;
        CategoriaId = categoriaId;
    }

    /// <summary>
    /// Validações estruturais definidas na especificação:
    /// - Descrição obrigatória com máximo de 400 caracteres.
    /// - Valor deve ser estritamente positivo.
    /// </summary>
    private static void ValidarDadosBasicos(string descricao, decimal valor, TipoTransacao tipo, int pessoaId, int categoriaId)
    {
        if (string.IsNullOrWhiteSpace(descricao))
            throw new ArgumentException("A descrição não pode ser vazia.", nameof(descricao));

        if (descricao.Length > 400)
            throw new ArgumentOutOfRangeException(nameof(descricao), "A descrição não pode exceder 400 caracteres.");

        if (valor <= 0)
            throw new ArgumentOutOfRangeException(nameof(valor), "O valor deve ser maior que zero.");

        if (!Enum.IsDefined(typeof(TipoTransacao), tipo))
            throw new ArgumentException("O tipo informado é inválido.", nameof(tipo));

        if (pessoaId <= 0)
            throw new ArgumentException("Pessoa inválida.", nameof(pessoaId));

        if (categoriaId <= 0)
            throw new ArgumentException("Categoria inválida.", nameof(categoriaId));
    }
    
    /// <summary>
    /// Aplica as regras de negócio centrais do sistema de transações:
    /// 1. Restrição de idade: Menores de 18 anos só podem registrar transações do tipo Despesa.
    /// 2. Integridade de categorias: O tipo da transação deve respeitar a finalidade da categoria vinculada.
    /// </summary>
    private static void ValidarRegrasDeNegocio(TipoTransacao tipo, int idadePessoa, FinalidadeCategoria finalidadeCategoria)
    {
        if (idadePessoa < 18 && tipo != TipoTransacao.Despesa)
        {
            throw new ArgumentException("Menores de idade só podem registrar transações do tipo Despesa.");
        }

        if (tipo == TipoTransacao.Despesa && finalidadeCategoria == FinalidadeCategoria.Receita)
        {
            throw new ArgumentException("Não é possível usar uma categoria de Receita para uma Despesa.");
        }

        if (tipo == TipoTransacao.Receita && finalidadeCategoria == FinalidadeCategoria.Despesa)
        {
            throw new ArgumentException("Não é possível usar uma categoria de Despesa para uma Receita.");
        }
    }
}