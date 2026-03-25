#!/bin/bash

echo "Iniciando ambiente do Sistema de Gestão Residencial..."

echo "Subindo o banco de dados com Docker..."
# O parâmetro down -v apaga os volumes órfãos no docker, garantindo um banco de dados zerado
docker compose down -v 
docker compose up -d

echo "Aguardando o banco de dados inicializar..."
sleep 3

echo "Configurando ambiente Python para os dados de teste..."
cd scripts/
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt --quiet
cd ..

echo "Ambiente pronto!"
echo "Passo 1: Inicie a API (via Visual Studio, Rider ou 'dotnet run' dentro de GestaoResidencial.Api)."
echo "Passo 2: Em seguida, na raiz do projeto, rode o comando abaixo neste terminal para popular a API com os dados:"
echo "          source scripts/.venv/bin/activate && python scripts/seed_api.py"