# API Lista de Tarefas

API REST para gerenciamento de tarefas com autenticação JWT.
![alt text](src/public/image.png)

## 🚀 Tecnologias

- **Node.js** com **TypeScript**
- **Express** - Framework web
- **Prisma** - ORM
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Swagger** - Documentação da API
- **Jest** - Testes


## ⚙️ Pré-requisitos

- Node.js
- PostgreSQL
- Yarn

## 🔧 Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
yarn install
```

3. Configure as variáveis de ambiente. Crie um arquivo `.env` na raiz:
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"
JWT_SECRET="sua_chave_secreta_jwt"
PORT=3000
```

4. Execute as migrations do Prisma:
```bash
npx prisma migrate dev
```

## 🏃 Executando

### Desenvolvimento
```bash
yarn dev
```

### Testes
```bash
yarn test
```

## 📚 Documentação da API

Após iniciar o servidor, acesse a documentação Swagger em:
```
http://localhost:3000/api-docs
```

## 📝 Scripts Disponíveis

- `yarn dev` - Inicia em modo desenvolvimento
- `yarn build` - Compila TypeScript
- `yarn start` - Inicia em produção
- `yarn test` - Executa testes
- `yarn format-fix` - Formata código
- `yarn lint-fix` - Corrige problemas de lint
