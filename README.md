# Aplicação Express com TypeScript

CRUD usando banco de dados Firebase NoSQL, sendo armazenado também no objeto do usuário as atualizações de nome,
e-mail e senhas, utilizando também collections de histórico de deleção de usuários e schedules de programação de deleção dos usuários inativos.

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

3. pegue do Firebase o arquivo json de configuração e conexao com banco:

   - Clique no ícone de engrenagem ⚙️ no canto superior esquerdo para abrir as Configurações do Projeto > Contas de serviço > Gerar nova chave privada

   Fara um dowload do serviceAccountKey.json que vc colocara na raiz do projeto.

## Execução

    pnpm run dev

ou

    npm run dev
