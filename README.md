# Aplicação Express com TypeScript

CRUD usando banco de dados Firebase nosql, sendo armazenado tambem no objeto do usuario as atualizações de nome,
e-mail e senhas, utilizando tambem collections de historico de deleção de usuarios e schedules de programação de deleção dos ususarios inativos.

## Requisitos

Antes de começar, você precisará de:

- **Node.js** (versão 14 ou superior)
- **pnpm** (gerenciador de pacotes) ou **npm**

## Instalação

1. Instale as dependências::

   ```bash
   pnpm install
   ```

   ou

   ```bash
   npm install
   ```

2. Crie um arquivo .env na raiz do projeto com a variável de ambiente PORT:

   ```bash
   PORT=5000
   JWT_SECRET=qualquerchave
   JWT_EXPIRE_IN=30m
   TEST_MODE=true
   ```

   Isso configura a porta em que o servidor irá rodar. Você pode alterar o valor de PORT conforme sua necessidade.

## Execução

    pnpm run dev

ou

    npm run dev
