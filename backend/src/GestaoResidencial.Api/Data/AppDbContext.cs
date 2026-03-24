using GestaoResidencial.Api.Features.Categorias;
using GestaoResidencial.Api.Features.Pessoas;
using GestaoResidencial.Api.Features.Transacoes;
using Microsoft.EntityFrameworkCore;

namespace GestaoResidencial.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

    public DbSet<Pessoa> Pessoas { get; set; }
    public DbSet<Categoria> Categorias { get; set; }
    public DbSet<Transacao> Transacoes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Pessoa>(pessoa =>
        {
            pessoa.HasKey(p => p.Id);
            pessoa.Property(p => p.Nome)
                .HasMaxLength(200)
                .IsRequired();
        });

        modelBuilder.Entity<Categoria>(categoria =>
        {
            categoria.HasKey(c => c.Id);
            categoria.Property(c => c.Descricao).HasMaxLength(400).IsRequired();
        });
        
        modelBuilder.Entity<Transacao>(transacao =>
        {
            transacao.HasKey(t => t.Id);
            transacao.Property(t => t.Descricao).HasMaxLength(400).IsRequired();
            transacao.Property(t => t.Valor).IsRequired();
    
            // Regra: Em casos que se delete uma pessoa, todas a transações dessa pessoa deverão ser apagadas.
            transacao.HasOne<Pessoa>()
                .WithMany()
                .HasForeignKey(t => t.PessoaId)
                .OnDelete(DeleteBehavior.Cascade);

            transacao.HasOne<Categoria>()
                .WithMany()
                .HasForeignKey(t => t.CategoriaId)
                .OnDelete(DeleteBehavior.Restrict);
        });
        
        base.OnModelCreating(modelBuilder);
    }
}