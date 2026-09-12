MODO CAMPO PWA — V1

1. Publique esta pasta em um endereço HTTPS estático (GitHub Pages, Cloudflare Pages, Firebase Hosting etc.).
2. Abra o endereço no celular/computador enquanto estiver online.
3. Use "Adicionar à tela inicial" / "Instalar aplicativo" no navegador.
4. Importe o backup JSON gerado pelo mapa principal.
5. Enquadre a área de trabalho e clique em "Preparar mapa visível".
6. Depois disso, feche o navegador e teste em modo avião abrindo pelo ícone instalado.

IMPORTANTE: o endereço /exec do Google Apps Script continua sendo o sistema online. Esta PWA é o cliente de campo offline. O Apps Script não hospeda service worker com o escopo necessário para tornar a própria página /exec reabrível offline.
