Write-Host "Iniciando ambiente do Sistema de Gestão Residencial..." -ForegroundColor Cyan

Write-Host "Subindo o banco de dados com Docker..." -ForegroundColor Cyan
docker compose down -v 
docker compose up -d

Write-Host "Aguardando o banco de dados inicializar..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host "Configurando ambiente Python para os dados de teste..." -ForegroundColor Cyan
cd scripts

# Só cria o ambiente virtual se ele não existir, evitando o erro de arquivo em uso no Windows
if (-Not (Test-Path ".venv")) {
    python -m venv .venv
}

.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt --quiet
cd ..

Write-Host "--------------------------------------------------------" -ForegroundColor Green
Write-Host "Ambiente pronto para o avaliador!" -ForegroundColor Green
Write-Host "1. Inicie a API (via Visual Studio, Rider ou 'dotnet run' dentro de GestaoResidencial.Api)"
Write-Host "2. Com a API rodando, execute o comando abaixo neste terminal para popular os dados:"
Write-Host "   .\scripts\.venv\Scripts\Activate.ps1 ; python scripts\seed_api.py" -ForegroundColor Yellow
Write-Host "--------------------------------------------------------" -ForegroundColor Green