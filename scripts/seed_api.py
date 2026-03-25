import requests
import urllib3
import random
from faker import Faker

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

BASE_URL = "https://localhost:7278/api"
fake = Faker('pt_BR')
SESSION = requests.Session()
SESSION.verify = False

def post_data(endpoint, payload):
    url = f"{BASE_URL}/{endpoint}"
    try:
        response = SESSION.post(url, json=payload)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as err:
        print(f"\n[ERRO HTTP {response.status_code}] ao acessar {endpoint}")
        print(f"Payload enviado: {payload}")
        print(f"Detalhes do backend: {response.text}\n")
        return None
    except Exception as e:
        print(f"\n[ERRO FATAL] {e}\n")
        return None

def seed_pessoas(quantidade=15):
    print(f"Criando {quantidade} Pessoas...")
    pessoas_criadas = []
    
    for i in range(quantidade):
        idade = random.randint(10, 75) 
        payload = {
            "nome": fake.name(),
            "idade": idade
        }
        
        result = post_data("pessoas", payload)
        if result:
            pessoas_criadas.append(result)
            print(f"[{i+1}/{quantidade}] Pessoa criada: {result['nome']} ({result['idade']} anos)")
            
    return pessoas_criadas

def seed_categorias():
    print("\nCriando Categorias Fixas...")
    categorias_base = [
        {"descricao": "Alimentação e Supermercado", "finalidade": 1},
        {"descricao": "Contas de Consumo (Água, Luz)", "finalidade": 1},
        {"descricao": "Lazer e Assinaturas", "finalidade": 1},
        {"descricao": "Salário Mensal", "finalidade": 2},
        {"descricao": "Rendimento de Investimentos", "finalidade": 2}, 
        {"descricao": "Venda de Itens Usados", "finalidade": 2},
        {"descricao": "Mesada", "finalidade": 3}, 
        {"descricao": "Transferência PIX", "finalidade": 3},
    ]
    
    categorias_criadas = []
    for i, payload in enumerate(categorias_base):
        result = post_data("categorias", payload)
        if result:
            categorias_criadas.append(result)
            print(f"[{i+1}/{len(categorias_base)}] Categoria criada: {result['descricao']} (Finalidade: {result['finalidade']})")
            
    return categorias_criadas

def seed_transacoes(quantidade, pessoas, categorias):
    print(f"\nCriando {quantidade} Transações...")
    
    sucessos = 0
    for i in range(quantidade):
        pessoa = random.choice(pessoas)
        
        if pessoa['idade'] < 18:
            tipo = 1
        else:
            tipo = random.choice([1, 2])
            
        if tipo == 1:
            categorias_validas = [c for c in categorias if c['finalidade'] in [1, 3]]
            descricao = fake.sentence(nb_words=4, variable_nb_words=True).replace(".", "")
        else:
            categorias_validas = [c for c in categorias if c['finalidade'] in [2, 3]]
            descricao = f"Recebimento referente a {fake.word()}"
            
        categoria = random.choice(categorias_validas)
        
        valor = round(random.uniform(15.0, 3500.0), 2)
        
        payload = {
            "descricao": descricao.capitalize(),
            "valor": valor,
            "tipo": tipo,
            "pessoaId": pessoa['id'],
            "categoriaId": categoria['id']
        }
        
        result = post_data("transacoes", payload)
        if result:
            sucessos += 1
            tipo_str = "Despesa" if tipo == 1 else "Receita"
            print(f"[{i+1}/{quantidade}] {tipo_str} de R${valor:.2f} registrada para {pessoa['nome']}.")

    print(f"\nPopulação concluída! {sucessos} transações criadas com sucesso.")

def main():
    print("Iniciando rotina de testes (MOCK DATA)...")
    
    pessoas = seed_pessoas(60)
    categorias = seed_categorias()
    
    if not pessoas or not categorias:
        print("\n[ERRO] Não foi possível criar as dependências (Pessoas ou Categorias). Abortando transações.")
        return
        
    seed_transacoes(120, pessoas, categorias)

if __name__ == "__main__":
    main()