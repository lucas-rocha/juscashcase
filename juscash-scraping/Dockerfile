FROM python:3.9-slim

# Configurações de localidade
ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8

# Diretório de trabalho
WORKDIR /app

# Copiar os arquivos para o contêiner
COPY . /app

# Instalar dependências
RUN pip install --no-cache-dir -r requirements.txt

# Comando para rodar o script
CMD ["python", "main.py"]
