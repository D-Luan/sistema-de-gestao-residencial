namespace GestaoResidencial.Api.Features.Pessoas;

public class Pessoa
{
    public int Id { get; private set; }
    public string Nome { get; private set; } = string.Empty;
    public int Idade { get; private set; }
    
    protected Pessoa() {}

    public Pessoa(string nome, int idade)
    {
        ValidarDados(nome, idade);

        Nome = nome;
        Idade = idade;
    }

    /// <summary>
    /// Atualiza e valida dados de forma segura dos
    /// dados proviniente do corpo das requisições PUT.
    /// </summary>
    public void AtualizarDados(string nome, int idade)
    {
        ValidarDados(nome, idade);

        Nome = nome;
        Idade = idade;
    }

    /// <summary>
    /// Validação das regras de negócios:
    /// 1. Não permite que o nome seja nulo ou vazio.
    /// 2. Restringe o tamanho do nome a 200 caracteres.
    /// 3. Não permite que a idade seja negativa ou maior que 130 anos.
    /// </summary>
    private static void ValidarDados(string nome, int idade)
    {
        if (string.IsNullOrWhiteSpace(nome))
        {
            throw new ArgumentException("O nome não pode ser nulo ou vazio.", nameof(nome));
        }

        if (nome.Length > 200)
        {
            throw new ArgumentOutOfRangeException(nameof(nome), "O nome não pode exceder 200 caracteres.");
        }

        if (idade < 0 || idade > 130)
        {
            throw new ArgumentOutOfRangeException(nameof(idade), "A idade não pode ser negativa ou maior que 130 anos.");
        }
    }
}