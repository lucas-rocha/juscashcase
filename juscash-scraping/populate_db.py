import psycopg2
import os
from psycopg2.extras import execute_values
import uuid
from datetime import datetime


DB_CONFIG = {
    'host': 'juscash_database',
    'port': 5432,
    'database': 'juscash_db',
    'user': 'postgres',
    'password': 'juscash2025'
}

data = [
    ("1234565", "Autor 1s", "Advogado 1", "tes3te", "Conteú3do de exemplo", "2025-01-01", 1000, 50, 100, "Em andamento"),
    ("6543213", "Autor 2", "Advogado 2", "te3ste", "Out3ro conteúdo", "2025-02-01", 2000, 75, 150, "Concluído")
]

# Função para conectar ao banco de dados
def get_db_connection():
    conn = psycopg2.connect(**DB_CONFIG)
    return conn

# Função para criar a tabela, caso não exista
def create_publications_table():
    """Cria a tabela Publications no banco de dados, caso não exista."""
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
            CREATE TABLE IF NOT EXISTS Publications (
                id SERIAL PRIMARY KEY,
                processNumber TEXT NOT NULL UNIQUE,
                authors TEXT,
                lawyers TEXT,
                defendant TEXT,
                content TEXT,
                availabilityData DATE,
                principalValue NUMERIC(15, 2),
                interestValue NUMERIC(15, 2),
                attorneyFees NUMERIC(15, 2),
                status TEXT,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            """)
            conn.commit()

def populate_publications(data_list):
    print(data_list[0])
    query = """
    INSERT INTO "Publications" ("id", "processNumber", "authors", "lawyers", "defendant", "content", "availabilityData", "principalValue", "interestValue", "attorneyFees", "status", "updatedAt")
    VALUES %s
    ON CONFLICT ("processNumber") DO NOTHING;
    """
    print(query)
    data_list_with_ids = [(str(uuid.uuid4()),) + item + (datetime.now(),) for item in data_list]
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                execute_values(cur, query, data_list_with_ids)
                conn.commit()
                print("Inserção concluída com sucesso!")
    except Exception as e:
        print(f"Erro ao inserir dados: {e}")