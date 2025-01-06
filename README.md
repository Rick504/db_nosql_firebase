# Aplicação Express com TypeScript

Esta é uma aplicação básica utilizando **TypeScript**, **Express**, **Routers**, **CORS** e **Variáveis de Ambiente**. O objetivo desse projeto é servir como um ponto de partida para aplicações Express com TypeScript e práticas comuns de organização de código e configuração de ambiente.

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

3. Criar collections no Firebase db:

   - users
   - users_history_delete

## Execução

    pnpm run dev

ou

    npm run dev
