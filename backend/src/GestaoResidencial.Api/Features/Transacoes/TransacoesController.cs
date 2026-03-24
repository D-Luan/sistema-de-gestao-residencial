using GestaoResidencial.Api.Data;
using GestaoResidencial.Api.Features.Categorias;
using GestaoResidencial.Api.Features.Pessoas;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GestaoResidencial.Api.Features.Transacoes;

[ApiController]
[Route("api/transacoes")]
public class TransacoesController : ControllerBase
{
    private readonly AppDbContext _context;

    public TransacoesController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Cria um novo registro de transação no sistema.
    /// </summary>
    /// <param name="requisicao">Objeto contendo os dados da transação, incluindo os IDs da Pessoa e Categoria.</param>
    /// <returns>Retorna os dados da transação cadastrada com os nomes resolvidos (Pessoa e Categoria).</returns>
    /// <response code="201">Transação cadastrada com sucesso.</response>
    /// <response code="400">Retornado quando a Pessoa ou Categoria não existem, ou quando a
    /// requisição quebra as regras de negócio de idade e finalidade.</response>
    [HttpPost]
    public async Task<ActionResult<TransacaoResposta>> CriarTransacao(TransacaoRequisicao requisicao)
    {
        var pessoa = await _context.Pessoas.FindAsync(requisicao.PessoaId);
        if (pessoa is null)
        {
            return BadRequest(new ProblemDetails { Detail = "Pessoa informada não existe." });
        }

        var categoria = await _context.Categorias.FindAsync(requisicao.CategoriaId);
        if (categoria is null)
        {
            return BadRequest(new ProblemDetails { Detail = "Categoria informada não existe." });
        }

        var transacao = new Transacao(
            requisicao.Descricao,
            requisicao.Valor,
            requisicao.Tipo,
            pessoa.Id,
            pessoa.Idade,
            categoria.Id,
            categoria.Finalidade);

        await _context.Set<Transacao>().AddAsync(transacao);
        await _context.SaveChangesAsync();

        var resposta = new TransacaoResposta(
            transacao.Id, transacao.Descricao, transacao.Valor, transacao.Tipo,
            pessoa.Id, pessoa.Nome, categoria.Id, categoria.Descricao);

        return Created(string.Empty, resposta);
    }

    /// <summary>
    /// Recupera os dados de todas as transações cadastradas de forma paginada.
    /// </summary>
    /// <param name="pagina">Número da página (padrão: 1).</param>
    /// <param name="tamanhoPagina">Quantidade de registros por página (padrão: 10).</param>
    /// <returns>Retorna uma lista paginada com os detalhes completos das transações.</returns>
    /// <response code="200">Requisição processada com sucesso.</response>
    [HttpGet]
    public async Task<ActionResult<PaginacaoResposta<TransacaoResposta>>> ObterTodasTransacoes(
        [FromQuery] int pagina = 1,
        [FromQuery] int tamanhoPagina = 10)
    {
        var query = _context.Set<Transacao>().AsNoTracking();
        var totalRegistros = await query.CountAsync();

        var itens = await query
            .OrderByDescending(t => t.Id)
            .Skip((pagina - 1) * tamanhoPagina)
            .Take(tamanhoPagina)
            .Select(t => new TransacaoResposta(
                t.Id,
                t.Descricao,
                t.Valor,
                t.Tipo,
                t.PessoaId,
                _context.Pessoas.First(p => p.Id == t.PessoaId).Nome,
                t.CategoriaId,
                _context.Categorias.First(c => c.Id == t.CategoriaId).Descricao))
            .ToListAsync();

        return Ok(new PaginacaoResposta<TransacaoResposta>(itens, totalRegistros, pagina, tamanhoPagina));
    }
}