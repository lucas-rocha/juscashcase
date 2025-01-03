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
POST api/users
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
POST api/users/login
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


### Busca todas as publicações
#### Requisição:
```bash
GET api/publications
Content-Type: application/json
x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYjdjMDZlYzYtNTVkZi00ZDQ1LWFiMmYtNzEwN2M4ZGY0MzFmIiwiaWF0IjoxNzM1NjkwMDgyfQ.RFB-pqu5WmnYKaLQDMQiZkDu_F9ebIVX7A-605HqQq8
```
### Parâmetros de Query

| Nome         | Tipo     | Obrigatório | Descrição                                                                 |
|--------------|----------|-------------|---------------------------------------------------------------------------|
| `search`     | String   | Não         | Texto para realizar a busca nas publicações. Se não informado, retorna todas as publicações. |
| `dataInicio` | String   | Não         | Data de início para filtrar publicações, no formato `YYYY-MM-DD`. Se não informado, sem filtro de data. |
| `dataFim`    | String   | Não         | Data de término para filtrar publicações, no formato `YYYY-MM-DD`. Se não informado, sem filtro de data. |
| `offset`     | Integer  | Não         | Índice inicial para a paginação, padrão é `0`. Utilizado para buscar publicações a partir de uma posição específica. |
| `limit`      | Integer  | Não         | Limite de publicações por página, padrão é `30`. Controla o número de publicações retornadas. |


#### Resposta:
```json
{
  "nova": {
    "title": "Publicações novas",
    "id": "nova",
    "tasks": [
      {
        "id": "123",
        "processNumber": "000123456789",
        "authors": "Autor Exemplo",
        "content": "Conteúdo da publicação.",
        "updatedAt": "2025-01-02T12:00:00Z"
      }
    ]
  },
  "lida": {
    "title": "Publicações Lidas",
    "id": "lida",
    "tasks": []
  },
  "enviada_adv": {
    "title": "Publicações Enviadas para o Advogado",
    "id": "enviada_adv",
    "tasks": []
  },
  "concluida": {
    "title": "Publicações Concluídas",
    "id": "concluida",
    "tasks": []
  }
}
```

## Busca Publicação por ID

### Descrição
Este endpoint permite buscar uma publicação específica com base no seu ID.

### URL
```bash
GET /api/publications/:id
x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYjdjMDZlYzYtNTVkZi00ZDQ1LWFiMmYtNzEwN2M4ZGY0MzFmIiwiaWF0IjoxNzM1NjkwMDgyfQ.RFB-pqu5WmnYKaLQDMQiZkDu_F9ebIVX7A-605HqQq8
```

### Parâmetros de Path

| Nome   | Tipo   | Obrigatório | Descrição                       |
|--------|--------|-------------|---------------------------------|
| `id`   | String | Sim         | ID da publicação que será buscada. |

### Resposta

#### Exemplo de Resposta Sucesso (200)
```json
{
  "id": "123",
  "processNumber": "000123456789",
  "authors": "Autor Exemplo",
  "content": "Conteúdo da publicação.",
  "status": "nova",
  "updatedAt": "2025-01-02T12:00:00Z"
}
```

## Atualizar Status da Publicação

### Descrição
Este endpoint permite atualizar o status de uma publicação específica com base no seu ID.

### URL
```bash
PUT /api/publications/:id
x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYjdjMDZlYzYtNTVkZi00ZDQ1LWFiMmYtNzEwN2M4ZGY0MzFmIiwiaWF0IjoxNzM1NjkwMDgyfQ.RFB-pqu5WmnYKaLQDMQiZkDu_F9ebIVX7A-605HqQq8
```

### Parâmetros de Path

| Nome   | Tipo   | Obrigatório | Descrição                       |
|--------|--------|-------------|---------------------------------|
| `id`   | String | Sim         | ID da publicação que será atualizada. |

### Corpo da Requisição

| Nome    | Tipo   | Obrigatório | Descrição                           |
|---------|--------|-------------|-------------------------------------|
| `status`| String | Sim         | Novo status da publicação. Os valores válidos são: `nova`, `lida`, `enviada_adv`, `concluida`. |

### Resposta

#### Exemplo de Resposta Sucesso (200)
```json
{
  "id": "123",
  "processNumber": "000123456789",
  "authors": "Autor Exemplo",
  "content": "Conteúdo da publicação.",
  "status": "lida",
  "updatedAt": "2025-01-02T12:00:00Z"
}

