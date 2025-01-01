# JusCash Project

## Visão Geral
O JusCash é um sistema completo que integra uma API, um banco de dados PostgreSQL e uma interface frontend. Este projeto utiliza o Docker Compose para simplificar o processo de configuração e execução local dos seus componentes.

## Requisitos para Execução Local

Certifique-se de que seu ambiente atenda aos seguintes requisitos:

- Docker: Versão 20.10 ou superior
- Docker Compose: Versão 1.29 ou superior
- Porta 5432 livre para o banco de dados
- Porta 5000 livre para a API
- Porta 3000 livre para o frontend

## Instruções de Instalação e Execução

1. Clone o repositório:
   ```bash
   git clone https://github.com/lucas-rocha/juscashcase.git
   cd juscashcase
   ```

2. Certifique-se de que os arquivos `Dockerfile` estão configurados corretamente nos diretórios `juscash-api` e `juscash-front`.

3. Inicie os serviços:
   ```bash
   docker-compose up -d
   ```
   Isso iniciará:
   - O banco de dados PostgreSQL na porta 5432
   - A API na porta 5000
   - O frontend na porta 3000

4. Verifique se os contêineres estão em execução:
   ```bash
   docker ps
   ```

5. Acesse os serviços:
   - API: [http://localhost:5000](http://localhost:5000)
   - Frontend: [http://localhost:3000](http://localhost:3000)

6. Para parar os serviços:
   ```bash
   docker-compose down
   ```

## Exemplos de Requisições à API

### Registro de usuário
#### Requisição:
```bash
POST /auth/login
Content-Type: application/json

{
  "fullname": "Lucas Souzas Rocha",
  "email": "lucasrocha.dv@gmail.com",
  "password": "senha"
}
```

#### Resposta:
```json
{
  "message": "Usuário criado com sucesso.",
  "user": {
      "id": "65ddf774-b39f-4406-a21f-5309d12a73e1",
      "fullname": "Lucas Souzas Rocha",
      "email": "lucasrocha.dv@gmail.com"
  }
}
```

### Autenticação
#### Requisição:
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "usuario",
  "password": "senha"
}
```

#### Resposta:
```json
{
  "message": "Usuário logado com sucesso.",
  "user": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYjdjMDZlYzYtNTVkZi00ZDQ1LWFiMmYtNzEwN2M4ZGY0MzFmIiwiaWF0IjoxNzM1NjkwMDgyfQ.RFB-pqu5WmnYKaLQDMQiZkDu_F9ebIVX7A-605HqQq8"
  }
}
```