using GestaoResidencial.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GestaoResidencial.Api.Features.Categorias;

[ApiController]
[Route("api/categorias")]
public class CategoriasController : ControllerBase
{
    private readonly AppDbContext _context;

    public CategoriasController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Cria um novo registro de categoria no sistema.
    /// </summary>
    /// <param name="requisicao">Objeto contendo a Descrição e a Finalidade da categoria.</param>
    /// <returns>Retorna os dados da categoria cadastrada junto do ID.</returns>
    /// <response code="201">Categoria cadastrada com sucesso.</response>
    /// <response code="400">Quando os dados enviados quebram as regras de negócio.</response>
    [HttpPost]
    public async Task<ActionResult<CategoriaResposta>> CriarCategoria(CategoriaRequisicao requisicao)
    {
        var categoria = new Categoria(requisicao.Descricao, requisicao.Finalidade);

        await _context.Categorias.AddAsync(categoria);
        await _context.SaveChangesAsync();

        var resposta = new CategoriaResposta(categoria.Id, categoria.Descricao, categoria.Finalidade);
        
        return Created(string.Empty, resposta); 
    }
    
    /// <summary>
    /// Recupera os dados de todas as categorias cadastradas.
    /// </summary>
    /// <returns>Retorna uma lista com todas as categorias ordenadas por descrição.</returns>
    /// <response code="200">Requisição processada com sucesso.</response>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoriaResposta>>> ObterTodasCategorias()
    {
        var itens = await _context.Categorias
            .AsNoTracking()
            .OrderBy(c => c.Descricao)
            .Select(c => new CategoriaResposta(c.Id, c.Descricao, c.Finalidade))
            .ToListAsync();

        return Ok(itens);
    }
}