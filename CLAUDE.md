# Site da Bruplast — regras para o Claude

Site vendido pela Vanguard Web Studio a um cliente real: **Bruplast Embalagens Plásticas**, indústria de Brusque/SC.
No ar em https://bruplast.vercel.app (projeto Vercel `bruplast`, equipe `vanguard-web`; push na `main` publica sozinho).
Dado errado ou site quebrado expõe o dono na frente do cliente.

## Como trabalhar

- Autorizado a alterar e publicar sem pedir, **desde que**: revise e teste tudo antes; trabalhe em
  branch + Pull Request (o merge na `main` é a publicação); anote qual versão estava no ar antes;
  se algo quebrar, reverta na hora e conte com franqueza o que aconteceu.
- Consertar o que foi pedido. Conteúdo ou visual novo que ninguém pediu: sugerir primeiro.
- Nunca digitar senha, chave de API ou token. Quem põe é o dono.
- Responder em português do Brasil, simples e direto. O dono costuma ler pelo celular.

## Limite de publicações da Vercel

- O plano gratuito aceita **100 publicações por dia para a equipe inteira** (todos os sites juntos).
  Cada commit enviado ao GitHub vira uma publicação (branch = prévia, `main` = produção).
- Este site foi criado **um arquivo por commit** (25 commits "init: upload ..."): cada um gastou uma publicação.
  **Sempre juntar as mudanças num commit só.** Nunca subir arquivo por arquivo pela API do GitHub.
- Se o check da Vercel no GitHub disser "Deployment rate limited", nada foi publicado: esperar liberar e
  publicar de novo.

## Comandos (obrigatório)

```bash
npm install     # uma vez
npm run build   # compila o CSS, põe código de versão no nome dos arquivos e roda as verificações
npm run dev     # servidor local (http://localhost:4321) com os mesmos cabeçalhos de segurança da Vercel
npm run security:scan   # Observatório da MDN contra o servidor local (com o dev rodando)
```

Não publicar se `npm run build` falhar. Scripts de imagem (precisam do `sharp`, que não fica no package.json
para a Vercel não baixar à toa): `build/imagens.cjs` (fotos WebP), `build/logo.cjs` (logo em SVG),
`build/og.cjs` + `build/og.html` (prévia do WhatsApp e ícones; precisa do puppeteer-core e do Chrome).
Ícone da aba (pedido do dono): **"Bp" vermelho sobre preto**, com as letras do logo (`build/icone.svg`, feito pelo `logo.cjs`).

## Regras do código

- Nunca editar `css/style.*.css` direto: mexer em `build/input.css` e rodar o build.
- Nunca `style="..."` nem `<script>` escrito dentro do HTML, e nunca CDN (nem Google Fonts). A segurança
  do site (CSP) bloqueia isso **em silêncio**: o visual quebra sem erro aparente.
- Se mudar o bloco `ld+json` do `index.html`, o hash dele na CSP do `vercel.json` muda junto
  (o `npm run build` avisa qual é).
- Imagens: WebP, com `width`/`height` e `draggable="false"`; nenhuma imagem pode ser arrastada.
  Originais em `build/originais/` (não vão para o site, ver `.vercelignore`).
- Nada de `loading="lazy"` dentro de bloco com `data-aos` (no Studio +Movimento, o conteúdo não apareceu no
  celular do dono).
- Estética: preto, vermelho do logo (`brand-red` #E3151E em fundo de botão; `brand-red-claro` #F2353D para TEXTO
  sobre preto, porque o escuro não passa no contraste) e a fonte Outfit bem grossa nos títulos (combina com o logo,
  que é de letra pesada). Elemento novo copia as classes de um equivalente que já existe.
- Animações: AOS (`js/aos.*.js`, `css/aos.*.css`) + `js/app.js` (menu do celular, números que contam, menu que
  escurece ao rolar, anos de mercado calculados pela data de fundação). Fotos da primeira tela flutuando e faixa
  vermelha que corre: CSS (`animate-flutuar`, `animate-faixa`). Se o AOS não carregar, o `app.js` põe `sem-animacao`
  e tudo aparece parado (nunca em branco). Quem pede menos animação no aparelho vê tudo parado.
- Segurança: nota A+ no MDN HTTP Observatory. Não pode cair. A CSP tem `connect-src 'self'` (e não 'none'):
  com 'none' o Lighthouse não consegue ler o robots.txt e acusa "robots.txt inválido".

## Conteúdo (não inventar: tudo abaixo foi conferido em 29/09/2026)

O site que o dono entregou (feito no Antigravity) tinha **WhatsApp falso (47 0000-0000)**, nenhum endereço, e-mail ou
telefone, animações quebradas e várias frases inventadas ("impressão HD", "extrusoras de alta precisão", "tintas
atóxicas", "suporta baixas temperaturas"). Tudo isso saiu. Fontes usadas:
- **Instagram @bruplast** (bio: "Whats e telefone fixo (47) 3351-3199"; posts de 2015-2016 com endereço, e-mails,
  trabalhos de clientes, toalhas da Fenarreco e a matéria do jornal).
- **Site antigo bruplast.com.br** (2009, visto no arquivo da internet, web.archive.org): textos de Quem Somos,
  Produtos, Responsabilidade e Contato. Hoje o domínio mostra só a página padrão do servidor (Plesk).
- **Receita Federal / Google Maps / Facebook**: Bruplast Indústria e Comércio de Plásticos Ltda., CNPJ
  04.478.205/0001-38, aberta em 21/05/2001, CNAE 2222-6/00 (fabricação de embalagens de material plástico),
  Av. Primeiro de Maio, 569, bairro Primeiro de Maio, Brusque/SC, CEP 88353-202, (47) 3351-3199, contato@bruplast.com.br.

Detalhes:
- WhatsApp = o próprio fixo (47) 3351-3199 (`wa.me/554733513199`), como diz a bio do Instagram.
- E-mail: contato@bruplast.com.br (o domínio tem e-mail ativo: MX em correio.biz). Existe também comercial@ (resposta
  num comentário de 2015); não pus para não arriscar um endereço desativado.
- Slogan real: **"Tudo em embalagens plásticas, lisas e impressas."** O logo do site entregue era uma imagem feita
  por IA com o slogan errado ("LEVES e impressas"). O logo atual (`img/logo.svg` e `img/logo-branco.svg`) foi
  **redesenhado em vetor** a partir do cartão do Instagram, com a Arial Black (fonte do logo original). Se o cliente
  mandar o arquivo original do logo, usar o dele.
- Fotos dos trabalhos: posts do Instagram da Bruplast (Cosh Multimarcas, Fino Bambino, boutiques, Euphoria/
  Encantu's/Maresia, Sul Modas, toalhas da 30ª Fenarreco) + duas que vieram no site entregue (sacos de alimentos
  "Devate/Vô Tonho/Amanda/Sta. Marta" — a Devate aparece no site antigo da Bruplast — e sacos de gelo).
  `build/originais/cosh-gerada-por-ia.jpg` NÃO é usada: é a foto da Cosh refeita por IA, com texto inventado na sacola.
- Anos de mercado: calculado pela data de fundação (21/05/2001) no `app.js`; o HTML traz 25 (valor em 2026).
- "100% das aparas": o site antigo diz "toda sobra de plástico (APARA) são recuperados fazendo sacarias".
- Projeto Cata Caca (matéria do jornal Município Dia a Dia, 23/09/2015): **saiu do site a pedido do dono** (29/09/2026),
  porque o recorte do jornal ficou feio. Além disso, a matéria conta que o projeto só foi proposto e ficou parado.
- Toalhas da Fenarreco: post de 19/10/2015 ("mais 1 ano de confiança na 30ª Fenarreco"). O site diz que a Bruplast
  **fez** as toalhas da 30ª Fenarreco (não que faz até hoje).

## A confirmar com o cliente (não inventar)

- Horário de atendimento: o Google mostra 08:00–12:00 e 13:00–17:48 (só vi um dia). Não pus no site.
- Segundo telefone (47) 3355-0465 (site antigo e post de 2016): não pus; perguntar se ainda existe.
- A Receita diz "569 - Fundos": perguntar se vale pôr "fundos" no endereço.
- Quantidade mínima e prazo de entrega: o site não fala (não há fonte).
- Domínio: o cliente tem **bruplast.com.br** (hoje com página padrão de servidor, e com o e-mail funcionando).
  Para o site ir para lá: no DNS, só os registros do site (A/CNAME que a Vercel indicar); **nunca mexer no MX
  nem nos registros de e-mail**. Depois trocar canonical, og:url, og:image, twitter:image, ld+json (e o hash
  na CSP), sitemap, robots e llms.txt, e rever o HSTS (`includeSubDomains` pode quebrar webmail/painel sem
  certificado; foi o que aconteceu no site do Rodrigo Titericz).

## Google (Search Console)

- Site cadastrado no Google Search Console (29/09/2026) na conta Google do dono, propriedade https://bruplast.vercel.app/.
  A verificação é a meta tag google-site-verification no head do index.html: **não remover** (senão o Google tira o
  acesso ao painel). Se o site mudar de endereço (domínio bruplast.com.br), cadastrar o endereço novo lá também.

## Armadilhas que já aconteceram (aqui ou nos sites com a mesma base)

1. `js/aos.js` e `css/aos.css` eram uma página de "Redirecting" baixada por engano: as animações nunca
   funcionaram. Aconteceu aqui, no Studio +Movimento e no site do Rodrigo Titericz.
2. Script que sobe arquivo por arquivo: estoura o limite diário da Vercel.
3. Arquivo com quebra de linha CRLF muda o selo de integridade (SRI): o navegador bloqueia o script e a
   página fica **em branco**. O `.gitattributes` força LF e o `npm run build` confere.
4. Com script `build` no `package.json`, a Vercel exige `"outputDirectory": "."` no `vercel.json`.
5. `curl` repetido no domínio dispara o anti-robô da Vercel (erro 403). Não é o site caindo.

## Sessão na nuvem (aberta pelo celular, com o PC do dono desligado)

- Dá para: editar, rodar `npm run build`, abrir o PR, esperar o check da Vercel no PR e mesclar.
  Se não conseguir mesclar, peça ao dono para tocar em "Merge" no PR (dá pelo app do GitHub).
- Se não der para conferir o site no ar, diga isso claramente em vez de supor que funcionou.
- O que não der para fazer ou conferir na nuvem: deixe anotado no GitHub (issue, ou PR em rascunho)
  com título começando por **"Fazer no PC:"**, para não se perder.
