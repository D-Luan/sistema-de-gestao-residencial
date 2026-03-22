using GestaoResidencial.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GestaoResidencial.Api.Features.Pessoas;

[ApiController]
[Route("api/pessoas")]
public class PessoasController : ControllerBase
{
    private readonly AppDbContext _context;

    public PessoasController(AppDbContext context)
    {
        _context = context;
    }
    
    /// <summary>
    /// Cria um novo registro de pessoa no sistema.
    /// </summary>
    /// <param name="requisicao">Objeto contendo o Nome e a Idade.</param>
    /// <returns>Retorna os dados da pessoa cadastrada junto do ID.</returns>
    /// <response code="201">Pessoa cadastrada com sucesso.</response>
    /// <response code="400">Quando os dados enviados quebram as regras de negócio.</response>
    [HttpPost]
    public async Task<ActionResult<PessoaResposta>> CriarPessoa(PessoaRequisicao requisicao)
    {
        var pessoa = new Pessoa(requisicao.Nome, requisicao.Idade);

        await _context.Pessoas.AddAsync(pessoa);
        await _context.SaveChangesAsync();

        var resposta = new PessoaResposta(pessoa.Id, pessoa.Nome, pessoa.Idade);

        return CreatedAtAction(nameof(ObterPessoaPeloId), new { id = resposta.Id }, resposta);
    }

    /// <summary>
    /// Recupera os dados de uma pessoa cadastrada pelo ID.
    /// </summary>
    /// <param name="id">ID que liga a uma pessoa cadastrada.</param>
    /// <returns>Retorna os dados de uma pessoa específica.</returns>
    /// <response code="200">Requisição processada com sucesso.</response>
    /// <response code="404">Pessoa não encontrada pelo ID informado.</response>
    [HttpGet("{id}")]
    public async Task<ActionResult<PessoaResposta>> ObterPessoaPeloId(int id)
    {
        var resposta = await _context.Pessoas
            .Where(p => p.Id == id)
            .Select(p => new PessoaResposta(p.Id, p.Nome, p.Idade))
            .SingleOrDefaultAsync();

        if (resposta is null)
        {
            return NotFound();
        }

        return Ok(resposta);
    }
    
    /// <summary>
    /// Recupera os dados de todas as pessoas cadastradas.
    /// </summary>
    /// <returns>Retorna uma lista contendo os dados de todas as pessoas cadastradas.</returns>
    /// <response code="200">Requisição processada com sucesso.</response>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PessoaResposta>>> ObterTodasPessoas()
    {
        var resposta = await _context.Pessoas
            .Select(p => new PessoaResposta(p.Id, p.Nome, p.Idade))
            .ToListAsync();

        return Ok(resposta);
    }
    
    /// <summary>
    /// Atualiza os dados de uma pessoa cadastrada.
    /// </summary>
    /// <param name="id">Identificador de uma pessoa cadastrada.</param>
    /// <param name="requisicao">Objeto contendo novos dados a serem atualizados.</param>
    /// <response code="204">Requisição processada com sucesso, mas sem conteúdo adicional.</response>
    /// <response code="404">Pessoa não encontrada pelo ID informado.</response>
    [HttpPut("{id}")]
    public async Task<ActionResult> AtualizarPessoa(int id, PessoaRequisicao requisicao)
    {
        var pessoa = await _context.Pessoas.FindAsync(id);

        if (pessoa is null)
        {
            return NotFound();
        }

        pessoa.AtualizarDados(requisicao.Nome, requisicao.Idade);

        await _context.SaveChangesAsync();

        return NoContent();
    }
    
    /// <summary>
    /// Remove os dados de uma pessoa cadastrada.
    /// </summary>
    /// <param name="id">Identificador de uma pessoa cadastrada.</param>
    /// <response code="204">Requisição processada com sucesso, mas sem conteúdo adicional.</response>
    /// <response code="404">Pessoa não encontrada pelo ID informado.</response>
    [HttpDelete("{id}")]
    public async Task<ActionResult> RemoverPessoa(int id)
    {
        var pessoa = await _context.Pessoas.FindAsync(id);

        if (pessoa is null)
        {
            return NotFound();
        }

        _context.Pessoas.Remove(pessoa);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}