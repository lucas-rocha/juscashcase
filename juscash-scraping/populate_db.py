import psycopg2
import os
from dotenv import load_dotenv
from psycopg2.extras import execute_values
load_dotenv()

# Configurações do banco de dados
DATABASE_URL = os.getenv("DATABASE_URL")

data = [
    ("123456", "Autor 1", "Advogado 1", "Conteúdo de exemplo", "2025-01-01", 1000, 50, 100, "Em andamento"),
    ("654321", "Autor 2", "Advogado 2", "Outro conteúdo", "2025-02-01", 2000, 75, 150, "Concluído")
]

# Função para conectar ao banco de dados
def get_db_connection():
    conn = psycopg2.connect(DATABASE_URL)
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

# Função para popular a tabela Publications
def populate_publications(data_list):
    """Insere múltiplos registros na tabela Publications."""
    query = """
    INSERT INTO Publications (processNumber, authors, lawyers, content, availabilityData, 
                            principalValue, interestValue, attorneyFees, status)
    VALUES %s
    ON CONFLICT (processNumber) DO NOTHING;
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            execute_values(cur, query, data_list)
            conn.commit()

# Criar a tabela se não existir
create_publications_table()

# Popular a tabela com dados de exemplo
populate_publications(data)
