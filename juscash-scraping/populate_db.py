import psycopg2
import os
from psycopg2.extras import execute_values

DB_CONFIG = {
    'host': 'juscash_database',
    'port': 5432,
    'database': 'juscash_db',
    'user': 'postgres',
    'password': 'juscash2025'
}

data = [
    ("123456", "Autor 1", "Advogado 1", "teste", "Conteúdo de exemplo", "2025-01-01", 1000, 50, 100, "Em andamento"),
    ("654321", "Autor 2", "Advogado 2", "teste", "Outro conteúdo", "2025-02-01", 2000, 75, 150, "Concluído")
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
    query = """
    INSERT INTO Publications (processNumber, authors, lawyers, defendant, content, availabilityData, 
                            principalValue, interestValue, attorneyFees, status)
    VALUES %s
    ON CONFLICT (processNumber) DO NOTHING;
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            execute_values(cur, query, data_list)
            conn.commit()