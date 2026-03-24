using GestaoResidencial.Api.Data;
using GestaoResidencial.Api.Features.Categorias;
using GestaoResidencial.Api.Features.Transacoes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GestaoResidencial.Api.Features.Financeiro;

/// <summary>
/// Controller responsável por gerar os relatórios e totalizadores do sistema.
/// Agrupa e consolida as informações financeiras de Pessoas e Categorias.
/// </summary>
[ApiController]
[Route("api/financeiro")]
public class FinanceiroController : ControllerBase
{
    private readonly AppDbContext _context;

    public FinanceiroController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Atende ao requisito: "Consulta de totais por pessoa".
    /// Lista as pessoas exibindo o total de receitas, despesas e saldo individual, 
    /// além de calcular o total geral da aplicação para exibição no frontend.
    /// </summary>
    /// <param name="pagina">Número da página (padrão: 1).</param>
    /// <param name="tamanhoPagina">Quantidade de registros por página (padrão: 10).</param>
    /// <returns>Retorna a listagem de pessoas com seus respectivos totais e os totalizadores globais.</returns>
    /// <response code="200">Relatório gerado com sucesso.</response>
    [HttpGet("pessoas")]
    public async Task<ActionResult<RelatorioPaginadoResposta<RelatorioPessoaResposta>>> ObterTotaisPorPessoa(
        [FromQuery] int pagina = 1, 
        [FromQuery] int tamanhoPagina = 10)
    {
        // Calcula os totais gerais para o rodapé da listagem
        var totalReceitasGeral = await _context.Set<Transacao>().Where(t => t.Tipo == TipoTransacao.Receita).SumAsync(t => t.Valor);
        var totalDespesasGeral = await _context.Set<Transacao>().Where(t => t.Tipo == TipoTransacao.Despesa).SumAsync(t => t.Valor);
        
        var totalRegistros = await _context.Pessoas.CountAsync();
        
        // Resolve os totais por pessoa diretamente no banco de dados.
        // Isso evita trazer todas as transações para a memória da API, garantindo alta performance.
        var itens = await _context.Pessoas
            .AsNoTracking()
            .OrderBy(p => p.Nome)
            .Skip((pagina - 1) * tamanhoPagina)
            .Take(tamanhoPagina)
            .Select(p => new RelatorioPessoaResposta(
                p.Id,
                p.Nome,
                p.Idade,
                _context.Set<Transacao>().Where(t => t.PessoaId == p.Id && t.Tipo == TipoTransacao.Receita).Sum(t => (decimal?)t.Valor) ?? 0,
                _context.Set<Transacao>().Where(t => t.PessoaId == p.Id && t.Tipo == TipoTransacao.Despesa).Sum(t => (decimal?)t.Valor) ?? 0
            ))
            .ToListAsync();

        return Ok(new RelatorioPaginadoResposta<RelatorioPessoaResposta>(
            itens, totalRegistros, pagina, tamanhoPagina, 
            totalReceitasGeral, totalDespesasGeral, totalReceitasGeral - totalDespesasGeral));
    }
    
    /// <summary>
    /// Atende ao requisito Opcional: "Consulta de totais por categoria".
    /// Lista todas as categorias cadastradas exibindo o total de receitas, despesas e saldo de cada uma,
    /// junto do total geral.
    /// </summary>
    /// <returns>Retorna a listagem completa de categorias com os respectivos totais e o total geral.</returns>
    /// <response code="200">Relatório gerado com sucesso.</response>
    [HttpGet("categorias")]
    public async Task<ActionResult<RelatorioGeralResposta<RelatorioCategoriaResposta>>> ObterTotaisPorCategoria()
    {
        // Calcula os totais gerais da aplicação
        var totalReceitasGeral = await _context.Set<Transacao>().Where(t => t.Tipo == TipoTransacao.Receita).SumAsync(t => t.Valor);
        var totalDespesasGeral = await _context.Set<Transacao>().Where(t => t.Tipo == TipoTransacao.Despesa).SumAsync(t => t.Valor);
        
        // Resolve os totais de cada categoria diretamente no banco de dados.
        // O uso do Select com o Sum evita o problema do "N+1 Queries". 
        var itens = await _context.Categorias
            .AsNoTracking()
            .OrderBy(c => c.Descricao)
            .Select(c => new RelatorioCategoriaResposta(
                c.Id,
                c.Descricao,
                c.Finalidade.ToString(),
                _context.Set<Transacao>().Where(t => t.CategoriaId == c.Id && t.Tipo == TipoTransacao.Receita).Sum(t => (decimal?)t.Valor) ?? 0,
                _context.Set<Transacao>().Where(t => t.CategoriaId == c.Id && t.Tipo == TipoTransacao.Despesa).Sum(t => (decimal?)t.Valor) ?? 0
            ))
            .ToListAsync();

        return Ok(new RelatorioGeralResposta<RelatorioCategoriaResposta>(
            itens, totalReceitasGeral, totalDespesasGeral, totalReceitasGeral - totalDespesasGeral));
    }
}