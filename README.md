# Vooa

Aplicativo Expo unificado na raiz do projeto. O app ativo usa `src/`, `assets/`
e `server/`.

## Executar

As dependências do app e da API já estão separadas. Para instalar novamente,
rode:

```powershell
npm install
npm install --prefix server
```

O app abre no fluxo visual do Vooa (login/cadastro e home após autenticação).
Na tela de login, use **Explorar sem entrar** para conhecer as páginas sem
configurar o banco. Depois de entrar, os atalhos da home levam a Destinos,
Ofertas, Diário, Histórias e Memórias.

Para iniciar somente o app, sem iniciar a API:

```powershell
npm run start:app
```

Para validar lint, tipos e exportação web:

```powershell
npm run validate
```

Para usar login e cadastro, inicie API e app juntos:

```powershell
npm start
```

Use `npm run android`, `npm run ios` ou `npm run web` para escolher a plataforma.

## API e banco SQLite

O servidor da API precisa do Node.js 22.13 ou superior. Na primeira
inicialização, cria automaticamente o banco SQLite, as contas e as sessões. O
caminho padrão é `server/data/vooa.sqlite`; para mudar, configure `DB_PATH` em
`server/.env`. Caminhos relativos são resolvidos a partir de `server/`.

O login de cliente fica na tela inicial (`/`) e aceita cadastro público. O
acesso administrativo é separado em `/admin-login`; o painel em `/admin` permite
bloquear/reativar clientes e remover histórias publicadas. O servidor confere o
papel e a sessão em cada operação administrativa; o cadastro público sempre cria
clientes.

Crie a configuração local da API e defina um e-mail de admin e uma senha forte
(mínimo de 12 caracteres) em `server/.env`:

   ```powershell
   Copy-Item server/.env.example server/.env
   ```

Crie a conta de administrador configurada:

   ```powershell
   npm run seed:admin --prefix server
   ```

Para criar a conta de cliente de demonstração local, execute:

   ```powershell
   npm run seed --prefix server
   ```

O seed cria `julia@gmail.com` com a senha `123456`; essa credencial é apenas
para desenvolvimento e o seed de cliente é bloqueado quando
`NODE_ENV=production`. O seed de admin exige credenciais definidas no ambiente
e pode ser executado para provisionar a conta administrativa.

Inicie API e app com `npm start`. Com a API ativa, confira
`http://localhost:3001/health`; a resposta deve indicar `status: "ok"` e
`database: "connected"`. Os testes da API podem ser executados com
`npm test --prefix server`.

Para produção, configure `DB_PATH` apontando para um disco persistente do
provedor (por exemplo, `/data/vooa.sqlite`) e faça backups regulares do arquivo.
Não use armazenamento efêmero de contêiner ou serverless: ele pode apagar o
banco em reinicializações ou novos deploys. SQLite é apropriado para uma única
instância de API com volume persistente; para múltiplas instâncias simultâneas,
use um banco de dados servidor.

O app usa `http://localhost:3001` no navegador e `http://10.0.2.2:3001` no
Android Emulator, salvo se `EXPO_PUBLIC_API_URL` estiver configurada. Em um
aparelho físico ou no deploy web, configure essa variável com o endereço público
da API.

Use a conta de demonstração somente em desenvolvimento e nunca publique
credenciais, o banco de dados ou arquivos `.env`.

## Estrutura principal

```text
assets/       imagens e ícones
scripts/      inicialização do app e tarefas auxiliares
server/       API Express, schema SQLite e banco local persistente
src/app/      rotas Expo Router (login, admin e grupo de abas)
src/components/
src/screens/  telas reutilizáveis, incluindo o diário coletivo corrigido
src/contexts/ sessão compartilhada entre login, conta e rotas protegidas
src/services/ integração com a API de autenticação
```

O diário coletivo corrigido está disponível na home Vooa em **Histórias** e em
**Explorar → Abrir diário coletivo**. A tela inicial antiga do Diário foi
preservada na rota **Memórias** (`/diario-inicio`).
