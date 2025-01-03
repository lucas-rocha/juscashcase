FROM python:3.10-slim

# Diretório de trabalho
WORKDIR /app

# Copiar o requirements.txt e instalar dependências
COPY requirements.txt .  
RUN pip install --no-cache-dir -r requirements.txt

# Copiar o código fonte
COPY . .

# Comando padrão: executa o script
CMD ["python", "main.py"]
