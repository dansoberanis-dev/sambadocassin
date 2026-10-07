# Prompt mestre — Samba do Cassin

> **Revisado em:** 7 de outubro de 2026 (America/Sao_Paulo)  
> Use este documento como contexto inicial se a conversa anterior ficar indisponível. Ele registra o estado conhecido do projeto; confirme com o usuário se algo mudou desde esta revisão.

## Prompt de continuidade para o próximo assistente

Você está dando continuidade ao site oficial do grupo de samba **Samba do Cassin**. Leia este documento antes de alterar qualquer coisa. Trabalhe com cuidado e preserve o que já foi aprovado: efeitos, dinâmica, conteúdo, fotos, logos e interações existentes. Faça mudanças no escopo pedido, teste o build quando possível e explique claramente o que foi alterado.

**Não alegue acesso ao computador do usuário, ao disco `E:\` ou a contas externas.** O projeto é editado na cópia disponível no workspace e entregue como ZIP/comandos. Não solicite senhas, tokens ou reenvio de imagens que já estão no projeto. O usuário prefere instruções de publicação consolidadas em **um único comando PowerShell** quando pedir publicação; diga para colar somente a linha, sem o prompt `PS ...>`.

Antes de afirmar que uma alteração está publicada, confirme com o usuário ou consulte evidência disponível: o assistente não sabe se o último ZIP foi extraído, enviado ao GitHub ou implantado na Vercel.

## Hospedagem e repositório

- **Site público:** <https://sambadocassin.vercel.app/>
- **Hospedagem:** Vercel. O projeto está configurado para build estático, com funções de API para Instagram e, em teste, agenda via Google Sheets. Push para `main` publica produção; push de branch deve gerar Preview Deployment (não usar `main` para testar a planilha fictícia).
- **Repositório GitHub previamente confirmado:** <https://github.com/dansoberanis-dev/sambadocassin>
- **Branch de publicação:** `main` (acompanha `origin/main`, conforme informação anterior).
- **Pasta do usuário no Windows:** `E:\SITES\cassin`
- **Cópia de trabalho deste agente:** `/home/user/cassin-project`
- **Vercel:** `npm install` para instalação, `npm run build` para build, diretório de saída `dist`.

A cópia no workspace **não contém `.git`**; o clone Git real é o do usuário em `E:\SITES\cassin`. Portanto, não use `git status` nesta cópia para inferir o estado do repositório do usuário. O README do projeto contém instruções genéricas antigas de criação do repositório; os URLs acima são os dados atuais conhecidos.

## Stack e comandos

- React 19, TypeScript 5, Vite 7, Tailwind CSS 4, Embla Carousel e Lucide Icons.
- Scripts do `package.json`: `npm run dev`, `npm run build`, `npm run preview`.
- `vite.config.ts` usa `vite-plugin-singlefile`.
- Verificação local no workspace: `./node_modules/.bin/tsc --noEmit` e `npm run build`.
- **Último build conhecido:** TypeScript (`tsc --noEmit`) e `npm run build` passaram após os ajustes dos botões dos cards e dos controles da Agenda (7 de outubro de 2026).
- `npm ci` reportou 5 vulnerabilidades nas dependências (1 low, 4 high). Não rode `npm audit fix --force` sem pedido/avaliação, pois pode introduzir breaking changes.

No computador do usuário, `npm ci` já falhou anteriormente com `EPERM` ao remover um binário do `lightningcss`, e `npm run dev` falhou porque o Vite não estava instalado corretamente. Se isso voltar a ocorrer, não alegue que o teste local foi concluído; o deploy pode ser feito pelo GitHub/Vercel após o usuário extrair o ZIP.

## Estado funcional e alterações já feitas

### Capa / Hero

- A foto vertical enviada pelo usuário (`Show ao Vivo com Público em Êxtase.png`) foi otimizada para **`public/images/cassinhero-show.jpg`** (1024 × 1536, aproximadamente 443 KB) e é a imagem atual configurada em `src/data/config.ts`.
- `src/components/Hero.tsx` usa `object-cover`; enquadramento: `object-[50%_50%]` no mobile e `md:object-[50%_72%]` no desktop. O `72%` foi ajustado após o usuário informar que, no desktop, queria mostrar mais do artista; **não reverta a posição mobile**, que o usuário aprovou como perfeita.
- A capa usa a logo horizontal oficial em imagem: `public/images/logo-horizontal-samba-cassin.png`. Não substituir a logo por uma aproximação tipográfica; o usuário rejeitou anteriormente uma versão feita com fonte.
- A frase do Hero é **“O meu samba te abraça”**; foi solicitado remover apenas um emoji, preservando o texto.
- A contagem de “Próximo show” avança sem recarregar a página. `src/contexts/AgendaContext.tsx` compartilha os shows entre Hero e Agenda, consulta `/api/agenda` ao abrir, a cada 60 segundos e quando a aba volta ao foco. `api/agenda.ts` lê a planilha publicada como CSV; o cache da função é 15 s e o Google pode levar alguns minutos para atualizar a publicação. Assim, não é instantâneo, mas atualiza sem redeploy dentro desse intervalo.
- Nos cards da Agenda, com `ticketUrl` o botão mostra **“INGRESSOS AQUI”** e abre esse link; sem `ticketUrl`, mostra **“MAIS INFORMAÇÕES”** e abre `config.social.instagram` (`@sambadocassin`).
- A Agenda mantém o autoplay do carrossel (3,5 s por parada) e os botões de avançar/voltar, mas não exibe bolinhas nem barra de progresso. Os controles com bolinhas da Discografia não mudam.
- Se o feed não estiver configurado ou falhar, o site mantém `config.shows` como fallback. Em produção, a agenda continua usando o fallback até definir `AGENDA_CSV_URL` no ambiente Production da Vercel. Em Preview, se essa variável não estiver definida, o endpoint usa a planilha fictícia do teste. **Nunca fazer merge/publicar o feed de teste como fonte de produção.**
- Planilha de teste criada pelo usuário (somente dados fictícios), publicada com colunas `DATA`, `CIDADE`, `LOCAL`, `HORÁRIO`, `LINK INGRESSOS`, `STATUS`. CSV testado: datas 20–23/10/2026; as três linhas `confirmado` são retornadas, a de 23/10 `cancelado` é excluída, e o link sem protocolo é normalizado para HTTPS. `api/agenda.ts` aceita CSV com cabeçalhos em português, converte datas `DD/MM/AAAA` para ISO e lê horários `HH:MM`.
- **Status da agenda:** o usuário confirmou que o Preview carregou as datas da planilha em `https://sambadocassin-6z5q6job3-dansoberanis-7942.vercel.app/`; vai alterar datas e cancelar uma linha para testar a atualização. As mudanças de rótulos dos links e controles somente com setas passaram no build local, mas ainda precisam ser enviadas para a branch Preview existente e redeployadas. A URL `pubhtml` original é convertida no código para o endpoint `pub?...&output=csv`.
- A agenda enviada pelo usuário continua sendo a fonte de verdade para o site de produção enquanto não houver uma planilha oficial. Não corrigir a divergência do dia da semana de Capilé Seu Zé sem autorização.

### Footer

- O footer agora usa a **logo horizontal oficial branca** (`/images/logo-horizontal-samba-cassin.png`) em vez do nome do grupo escrito em amarelo. A alteração foi feita somente no footer; a capa continua com sua própria logo.
- O crédito **“Desenvolvido por: Daniel Soberanis”** está em negrito e amarelo (`text-gold-500`).
- No mobile existe um espaço reservado (`data-music-player-dock`, altura de 16) depois dos contatos e antes de **“OUÇA EM TODAS AS PLATAFORMAS”**. Quando o rodapé entra na tela, o player é posicionado nesse espaço, para não cobrir o crédito nem a última frase. No desktop o player continua flutuante.

### Player musical

- `src/components/MusicPlayer.tsx` escolhe uma faixa aleatória ao carregar, tenta autoplay a 35% de volume e oferece Play/Pause.
- O autoplay pode ser bloqueado pelo navegador até uma interação do visitante; não prometer que o áudio sempre começa automaticamente.
- Caminhos esperados no site:
  - `CLAMOR A XANGÔ.mp3` → `/audio/clamor-a-xango.mp3`
  - `ÍRIS DE OYÁ.mp3` → `/audio/iris-de-oya.mp3`
  - `DE REZAR E SAMBAR.mp3` → `/audio/de-rezar-e-sambar.mp3`
  - `QUARTINHA CHEIA.mp3` → `/audio/quartinha-cheia.mp3`
- **Atenção:** os MP3s não estão na cópia do workspace e não entram nos ZIPs gerados por este agente. O usuário informou que os arquivos originais ficam na pasta Downloads do Windows. Já foi fornecido um comando para copiá-los/renomeá-los para `E:\SITES\cassin\public\audio`; não pedir upload pelo chat. Não sabemos se a cópia local contém hoje as quatro faixas. Os builds passaram sem esses arquivos, mas isso não comprova reprodução ponta a ponta.

### Contato, Instagram e redes

- WhatsApp de contato: `5541984542307`; exibição `(41) 98454-2307`.
- Mensagem do botão: **“Olá, vim pelo site, quero contratar o Samba do Cassin”**.
- Perfis a preservar: `@sambadocassin`, `@bru.alcantara06`, `@ystuarty_martins`, `@marcos.peres1` e `@guiii.alberti`.
- Fotos de integrantes já usadas: `cassinperfil.png` (Cassin), `brunaperfil.png` (Bruna), `ystuartyperfil.png` (Ystuarty), `carcaoperfil.png` (Marcão), `guiperfil.png` (Gui).
- Instagram usa a logo circular oficial `public/images/logo-samba-cassin.png`; não trocar por iniciais.
- `src/components/Contrate.tsx` e `src/index.css` receberam ajustes de overflow/min-width para mobile.

## Arquivos importantes

- `src/data/config.ts` — textos, contatos, redes, imagem da capa e agenda estática de fallback.
- `src/contexts/AgendaContext.tsx` — consulta `/api/agenda`, compartilha a lista entre Hero/Agenda e faz polling a cada 60 s.
- `api/agenda.ts` — lê e normaliza o CSV da planilha; em Preview usa o CSV fictício de teste. Em produção usa `AGENDA_CSV_URL` ou sinaliza para usar o fallback.
- `src/App.tsx` — ordem das seções e provider da agenda; inclui Footer, FloatingButtons e MusicPlayer.
- `src/components/Hero.tsx` — foto, logo, animações, serviços de streaming e contagem regressiva.
- `src/components/Footer.tsx` — logo horizontal, dock mobile, plataformas e crédito.
- `src/components/MusicPlayer.tsx` — player aleatório e lógica de docking no footer.
- `src/components/Instagram.tsx` — feed/grade do Instagram e logo circular.
- `src/components/FloatingButtons.tsx` — botões flutuantes e mensagem de WhatsApp.
- `src/components/Contrate.tsx` — seção para contratação.
- `src/index.css` — tema, animações e ajustes responsivos.
- `api/instagram.ts` — função server-side para o feed do Instagram.
- `index.html` — título e metadados Open Graph/Twitter.
- `public/images/logo-horizontal-samba-cassin.png` — logo horizontal oficial.
- `public/images/logo-samba-cassin.png` — logo circular oficial.
- `public/images/cassinhero-show.jpg` — foto atual do Hero.

## Segurança e segredos

- O token do Instagram é **segredo técnico**; jamais colocá-lo no frontend, em arquivos públicos, no chat ou em commit.
- A função `api/instagram.ts` lê `INSTAGRAM_ACCESS_TOKEN` no servidor da Vercel. `INSTAGRAM_API_VERSION` é opcional e tem default `v26.0`.
- Configurar variáveis somente em **Vercel → Project → Settings → Environment Variables**. Sem token do Instagram, a API responde com fallback sem publicações.
- `AGENDA_CSV_URL` é a URL pública CSV da planilha oficial; adicionar em **Production** apenas quando Cassin criar/publicar a planilha oficial. Não usar a URL fictícia em Production. Uma planilha publicada é pública: incluir somente dados que podem aparecer no site. O endpoint de Preview já usa o CSV teste apenas quando `VERCEL_ENV=preview` e a variável não está definida.
- `.gitignore` ignora `.env` e `.env.*`, exceto `.env.example`. Revisar `git status`/arquivos staged antes de commit para não publicar credenciais.
- O site é de um grupo de samba e seu conteúdo comum não é confidencial; tokens e segredos técnicos são exceção.

## Metadados de compartilhamento

- `index.html` contém Open Graph/Twitter com URL HTTPS absoluta.
- No estado atual, a imagem de compartilhamento ainda aponta para `/images/cassinhero.png` (547 × 365), enquanto o Hero usa `cassinhero-show.jpg`. Isso foi mantido como preview horizontal; só alterar se o usuário pedir para atualizar também o preview de WhatsApp/redes.

## ZIP e publicação

- **Último ZIP gerado nesta sessão:** `/home/user/cassin-agenda-preview-ajustes.zip` — inclui o código e `MASTER-PROMPT.md`; exclui `node_modules`, `dist`, `.git`, `.vercel`, segredos `.env` e MP3s.
- O ZIP é uma cópia do workspace, não do PC do usuário. Ao extrair com `Expand-Archive -Force` sobre `E:\SITES\cassin`, arquivos que não estão no ZIP (incluindo MP3s já existentes em `public\audio`) não são apagados.
- A branch de Preview existente é `agenda-google-sheets-preview-20261007`. O usuário confirmou que o Preview anterior carregou as datas da planilha em `https://sambadocassin-6z5q6job3-dansoberanis-7942.vercel.app/`. Os ajustes de rótulos e controles passaram no build do workspace, mas **ainda não foram enviados/redeployados**. Não usar `main`; o push da branch deve criar um novo Preview. Após o deploy, confirmar a URL do deployment mais recente na Vercel.
- Comando consolidado para atualizar a branch de Preview existente. Ele para diante de alterações locais fora de `public/audio`, exclui essa pasta do staging, mostra os arquivos preparados e exige confirmação antes do commit. Colar **somente a linha** no PowerShell, sem `PS ...>`:

```powershell
$ErrorActionPreference='Stop'; $dest='E:\SITES\cassin'; $zip=Join-Path $env:USERPROFILE 'Downloads\cassin-agenda-preview-ajustes.zip'; $branch='agenda-google-sheets-preview-20261007'; if(-not (Test-Path $zip)){throw 'Baixe o ZIP para a pasta Downloads primeiro'}; $dirty=@(git -C $dest status --porcelain); if($LASTEXITCODE -ne 0){throw 'Não foi possível verificar o clone Git'}; $unexpected=$dirty | Where-Object {$_ -notmatch '^\?\? public/audio/'}; if($unexpected){$unexpected;throw 'Há alterações locais fora de public/audio; revise/guarde-as antes de continuar'}; git -C $dest switch $branch; if($LASTEXITCODE -ne 0){throw 'Não foi possível mudar para a branch de Preview existente'}; Expand-Archive -LiteralPath $zip -DestinationPath $dest -Force; git -C $dest add -A -- . ':(exclude)public/audio' ':(exclude)public/audio/**'; if($LASTEXITCODE -ne 0){throw 'git add falhou'}; $staged=@(git -C $dest diff --cached --name-only); if($LASTEXITCODE -ne 0){throw 'Não foi possível verificar os arquivos preparados'}; $staged; $unsafe=$staged | Where-Object {($_ -match '(^|/)\.env($|\.)' -and $_ -ne '.env.example') -or $_ -match '(token|secret|credential)'}; if($unsafe){git -C $dest reset; $unsafe;throw 'Possível arquivo sensível; nada foi commitado'}; if((Read-Host 'Confira os arquivos acima e digite Y para autorizar o commit') -ne 'Y'){git -C $dest reset;throw 'Commit cancelado; as alterações continuam no disco'}; git -C $dest commit -m 'Ajusta botões e controles da agenda'; if($LASTEXITCODE -ne 0){throw 'git commit falhou'}; git -C $dest push -u origin $branch; if($LASTEXITCODE -ne 0){throw 'git push falhou'}
```

## Preferências e limites de trabalho do usuário

1. Preservar efeitos, transições e dinâmica já existentes; fazer somente as mudanças solicitadas.
2. Alterar apenas a cópia no workspace e entregar ZIP/instruções; nunca dizer que o agente acessou diretamente o PC `E:\`.
3. Não pedir senhas/tokens nem alterar contas GitHub/Vercel; orientar o usuário a fazer login quando necessário.
4. Não pedir novamente arquivos de imagem que já estão no workspace. Para as músicas, oferecer instrução de cópia do Downloads, não exigir upload no chat.
5. Não aproximar logos oficiais com texto/fonte; usar os assets de logo já disponíveis.
6. Respeitar a agenda fornecida e a regra de contagem regressiva descrita acima.
7. Em comandos PowerShell, pedir para colar só o comando, nunca o prefixo de prompt.

## Incertezas que devem continuar explícitas

- O usuário forneceu um link Preview e confirmou que ele carregou a planilha. O URL do novo deployment, após publicar os ajustes visuais ainda pendentes, não é conhecido; confirmar na Vercel. O site oficial não deve receber os dados fictícios.
- A planilha oficial do Cassin ainda não foi criada; enquanto `AGENDA_CSV_URL` não for configurada no ambiente Production, a produção usa a agenda de fallback em `config.ts`.
- Não há MP3s em `/home/user/cassin-project/public/audio`; é incerto se eles estão no clone Windows do usuário.
- A cópia de trabalho do agente não tem `.git`; estado/commit atual do clone Windows não foi verificado.
- A prévia Open Graph continua usando o arquivo horizontal antigo, apesar do novo Hero.
