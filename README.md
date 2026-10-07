# 🥁 Samba do Cassin • Site Oficial

Site oficial do grupo de samba **Samba do Cassin** (Curitiba/PR) — inspirado no site do Péricles.

**O que o site tem:**
- Capa com logo animada, foto de palco, botões de Spotify/YouTube e contagem regressiva para o próximo show
- **Agenda** em carrossel automático com controles de avançar/voltar; cada show leva aos ingressos ou ao Instagram para mais informações
- **Lançamento** com capa do álbum "O Princípio" + tracklist
- **Discografia** com as capas oficiais (O Princípio, De Rezar e Sambar, Quartinha Cheia)
- **Fotos** em mosaico com tela cheia, **Bio** com história e integrantes, **Contrate** com WhatsApp/e-mail, **Instagram** e rodapé completo

**Tecnologias:** React 19 + Vite 7 + Tailwind CSS 4 + TypeScript + Embla Carousel + Lucide Icons.

---

## ✅ Pré-requisitos

Antes de começar, você precisa ter instalado:

1. **Node.js 18 ou superior** → baixe em [nodejs.org](https://nodejs.org/) (recomendado: versão LTS)
   - Confira no terminal: `node --version` e `npm --version`
2. **Git** → baixe em [git-scm.com](https://git-scm.com/)
   - Confira: `git --version`
3. Conta no **GitHub** → [github.com](https://github.com/)
4. Conta na **Vercel** → [vercel.com](https://vercel.com/) (entre com a conta do GitHub — é grátis)

---

## 📦 Passo 1 — Baixar e abrir o projeto

1. Baixe o arquivo **`samba-do-cassin-site.zip`** e extraia em uma pasta, por exemplo:
   - Windows: `Documentos\samba-do-cassin-site`
   - Mac/Linux: `~/samba-do-cassin-site`
2. Abra o terminal **dentro dessa pasta**:
   - **Windows:** abra a pasta no Explorador → clique na barra de endereço → digite `cmd` → Enter (ou botão direito → "Abrir no Terminal")
   - **Mac:** botão direito na pasta → "Novo Terminal na Pasta"
   - **VS Code:** menu `Arquivo → Abrir Pasta…` → selecione a pasta → `Terminal → Novo Terminal`

---

## 🖥️ Passo 2 — Testar no seu computador

No terminal, dentro da pasta do projeto, rode:

```bash
# 1. Instalar as dependências (só precisa na primeira vez)
npm install

# 2. Rodar o site localmente
npm run dev
```

Abra no navegador o endereço que aparecer (geralmente http://localhost:5173). Aperte `Ctrl + C` no terminal para parar.

Para conferir se o build de produção funciona (igual ao que a Vercel vai fazer):

```bash
npm run build
npm run preview
```

Se abrir sem erro, está tudo certo. ✅

---

## 🐙 Passo 3 — Subir para o GitHub pelo terminal

1. No GitHub, crie um repositório novo:
   - Acesse [github.com/new](https://github.com/new)
   - **Repository name:** `samba-do-cassin-site` (ou outro nome)
   - Deixe como **Public** (ou Private, a Vercel funciona com os dois)
   - **NÃO** marque "Add a README" (o projeto já tem um)
   - Clique em **Create repository**
2. Copie a URL do repositório (ex.: `https://github.com/SEU-USUARIO/samba-do-cassin-site.git`)
3. No terminal, dentro da pasta do projeto, rode (troque a URL pela sua):

```bash
# Inicia o git no projeto
git init

# Adiciona todos os arquivos
git add .

# Cria o primeiro commit
git commit -m "Site Samba do Cassin no ar 🥁"

# Renomeia a branch principal para main
git branch -M main

# Conecta com o repositório do GitHub (TROQUE PELA SUA URL)
git remote add origin https://github.com/SEU-USUARIO/samba-do-cassin-site.git

# Envia o código
git push -u origin main
```

Se pedir login, use seu usuário do GitHub e um **Personal Access Token** como senha (GitHub não aceita mais senha normal no terminal — crie em `GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)` com permissão `repo`).

Pronto — seu código está no GitHub. 🎉

---

## ▲ Passo 4 — Publicar na Vercel

1. Acesse [vercel.com](https://vercel.com/) e entre com sua conta do GitHub
2. Clique em **Add New… → Project**
3. Em "Import Git Repository", encontre `samba-do-cassin-site` e clique em **Import**
4. Na tela de configuração, confira (a Vercel detecta sozinha, mas vale checar):
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Clique em **Deploy** e aguarde 1–2 minutos
6. Pronto! Você recebe um link tipo `https://samba-do-cassin-site.vercel.app` 🎶

> O arquivo `vercel.json` já está configurado no projeto, então esses valores entram automaticamente.

**Domínio próprio (opcional):** na página do projeto na Vercel → `Settings → Domains` → adicione seu domínio (ex.: `sambadocassin.com.br`) e siga as instruções de DNS.

---

## ✏️ Passo 5 — Como editar e republicar (rotina)

Toda vez que quiser mudar algo (agenda, fotos, textos, contatos):

1. **Edite os arquivos** no VS Code (veja a tabela abaixo com o que editar)
2. **Teste localmente:** `npm run dev`
3. **Envie para o GitHub:**

```bash
git add .
git commit -m "Descreva a mudança, ex: agenda de novembro"
git push
```

4. A **Vercel atualiza sozinha** em 1–2 minutos (deploy automático a cada `push` na branch `main`). Acompanhe em `vercel.com → seu projeto → Deployments`.

### 📝 Onde editar cada coisa

| Quero mudar… | Arquivo |
|---|---|
| Shows da agenda (fallback), textos, contatos, redes sociais, integrantes, fotos, tracklist | `src/data/config.ts` |
| Agenda ao vivo | O site lê o CSV publicado da planilha temporária já usada no Preview. `AGENDA_CSV_URL` em Production pode sobrescrever essa fonte; quando Cassin publicar a oficial, substituir o endereço por esse. O site consulta a fonte automaticamente; não precisa de redeploy por show. Se o feed falhar, usa `config.shows`. Shows somem após o horário de início, mesmo que continuem marcados como confirmados. Sem link de ingresso, o card mostra `MAIS INFORMAÇÕES` e leva ao Instagram do grupo; com link, mostra `INGRESSOS AQUI`. A coluna `DESCRIÇÃO` aparece no card. O carrossel avança automaticamente e exibe apenas as setas de navegação e a barra de progresso entre elas. |
| Foto de fundo da capa | `public/images/cassin3.jpg` (substitua o arquivo, mantendo o nome) |
| Foto da seção Bio | `public/images/cassinbio.jpg` |
| Título da aba do navegador | `index.html` (tag `<title>`) |
| Cores e fontes | `src/index.css` (bloco `@theme`) |
| Ordem das seções | `src/App.tsx` |

> **Dica:** depois de trocar uma foto em `public/images/`, faça o Passo 5 (commit + push) para ela entrar no ar.

---

## 📁 Estrutura do projeto

```
samba-do-cassin-site/
├── public/
│   └── images/            → fotos do site (hero, bio, galeria)
├── src/
│   ├── components/        → seções do site (Hero, Agenda, Bio…)
│   ├── data/
│   │   └── config.ts      → ★ TODOS OS TEXTOS, SHOWS E LINKS
│   ├── hooks/             → animações e contagem regressiva
│   ├── utils/             → funções auxiliares
│   ├── App.tsx            → monta as seções na ordem
│   ├── main.tsx           → entrada do React
│   └── index.css          → tema (cores, fontes, animações)
├── index.html             → título, favicon, fontes
├── package.json           → dependências e scripts
├── vite.config.ts         → configuração do Vite
├── tsconfig.json          → configuração do TypeScript
├── vercel.json            → configuração do deploy
└── README.md              → este guia
```

---

## 📷 Feed automático do Instagram

A grade de publicações usa a função `api/instagram.ts` na Vercel. Com a integração configurada, ela busca as publicações recentes e as métricas do perfil; sem token, o site mantém os cards de fallback de `src/data/config.ts`.

**Pré-requisitos:** conta profissional do Instagram (Empresa ou Criador), um app da Meta com **Instagram API with Instagram Login** e a permissão `instagram_business_basic`. Esse fluxo oficial não exige que a conta esteja ligada a uma Página do Facebook. Consulte a [visão geral oficial da API](https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-instagram-login/).

### Configurar o token na Vercel

1. Autorize a conta `@sambadocassin` no app da Meta e gere um token de acesso de longa duração.
2. Na Vercel, abra **Project → Settings → Environment Variables** e crie `INSTAGRAM_ACCESS_TOKEN` com esse token. Marque os ambientes em que o feed deve funcionar (Production e Preview).
3. Salve e faça um novo deploy.

O nome deve ser exatamente `INSTAGRAM_ACCESS_TOKEN` — **não** use o prefixo `VITE_`, pois variáveis `VITE_` ficam expostas no navegador. Nunca versione ou compartilhe o token. O arquivo `.env.example` contém apenas os nomes, sem credenciais.

A função mantém cache por cinco minutos. Tokens de longa duração ainda precisam ser renovados antes de expirar; depois da renovação, atualize o valor da variável na Vercel e faça novo deploy. O `npm run dev` do Vite não executa funções serverless, então, sem `vercel dev`, o navegador local exibirá os cards de fallback. A versão publicada na Vercel usa o feed ao vivo quando o token estiver configurado.

## 🛠️ Comandos úteis

```bash
npm run dev      # roda o site localmente (desenvolvimento)
npm run build    # gera a pasta dist/ (produção, igual à Vercel)
npm run preview  # visualiza o build de produção localmente
git status       # vê arquivos modificados
git log --oneline -5  # vê os últimos 5 commits
```

---

## 🆘 Problemas comuns

| Problema | Solução |
|---|---|
| `npm install` dá erro | Atualize o Node para a versão LTS em nodejs.org e tente de novo. Apague `node_modules/` e `package-lock.json` e rode `npm install` novamente. |
| `git push` pede senha e falha | O GitHub não aceita senha normal no terminal. Crie um Personal Access Token (classic) com permissão `repo` e use como senha. |
| Deploy na Vercel falhou | Abra a aba do deploy com erro → veja o log. 99% das vezes é erro de digitação em `config.ts` (vírgula, aspas). Corrija, commit + push. |
| Imagem não aparece | Confira se o arquivo está em `public/images/` e se o nome no `config.ts` é idêntico (maiúsculas/minúsculas contam). |
| Show passado ainda aparece | O site esconde automaticamente (`hidePastShows: true`). Se o horário estiver errado, confira o campo `time` do show (ex.: `'20h'`, `'19h30'`). |
| Quero voltar uma versão | Na Vercel: `Deployments` → encontre o deploy anterior → menu `⋯` → `Promote to Production`. |

---

Feito com 🥁 e muito samba. **O meu samba te abraça!**
