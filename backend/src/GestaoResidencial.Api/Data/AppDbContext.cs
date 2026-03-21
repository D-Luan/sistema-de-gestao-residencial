using Microsoft.EntityFrameworkCore;

namespace GestaoResidencial.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}
}