using GestaoResidencial.Api.Features.Categorias;
using GestaoResidencial.Api.Features.Pessoas;
using Microsoft.EntityFrameworkCore;

namespace GestaoResidencial.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

    public DbSet<Pessoa> Pessoas { get; set; }
    public DbSet<Categoria> Categorias { get; set; }

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
        
        base.OnModelCreating(modelBuilder);
    }
}