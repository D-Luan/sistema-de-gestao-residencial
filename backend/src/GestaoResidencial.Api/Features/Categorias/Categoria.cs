namespace GestaoResidencial.Api.Features.Categorias;

public class Categoria
{
    public int Id { get; private set; }
    public string Descricao { get; private set; } = string.Empty;
    public FinalidadeCategoria Finalidade { get; private set; }

    protected Categoria() { }

    public Categoria(string descricao, FinalidadeCategoria finalidade)
    {
        ValidarDados(descricao, finalidade);

        Descricao = descricao;
        Finalidade = finalidade;
    }

    /// <summary>
    /// Validação das regras de negócios:
    /// 1. Não permite descrição nula ou vazia.
    /// 2. Restringe o tamanho a 400 caracteres.
    /// 3. Garante que a finalidade seja um valor válido do enum.
    /// </summary>
    private static void ValidarDados(string descricao, FinalidadeCategoria finalidade)
    {
        if (string.IsNullOrWhiteSpace(descricao))
        {
            throw new ArgumentException("A descrição não pode ser nula ou vazia.", nameof(descricao));
        }

        if (descricao.Length > 400)
        {
            throw new ArgumentOutOfRangeException(nameof(descricao), "A descrição não pode exceder 400 caracteres.");
        }

        if (!Enum.IsDefined(typeof(FinalidadeCategoria), finalidade))
        {
            throw new ArgumentException("A finalidade informada é inválida.", nameof(finalidade));
        }
    }
}