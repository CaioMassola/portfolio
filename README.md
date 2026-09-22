# Caio Massola — Portfólio

Portfólio em **Vite, React, TypeScript e SCSS**, com foto e informações do CV, três idiomas, dois temas e carrossel de projetos.

## Desenvolvimento

```sh
npm install
npm run dev
```

Abra http://127.0.0.1:5173.

## Organização do código

```text
src/
  App.tsx                  Composição das seções da página
  content.ts               Textos traduzidos e dados dos projetos
  components/
    layout/                Header e Footer
    hero/                  Console animado
    sections/              Hero, About, Skills, Experience, Projects e Contact
    projects/              Card e ilustrações dos projetos
  hooks/
    useCarousel.ts         Navegação e sincronização da rolagem
    usePreferences.ts      Idioma, tema, metadados e persistência
    useReducedMotion.ts    Preferência de movimento do navegador
    useReveal.ts           Animações de entrada das seções
  lib/                     Links públicos e acesso ao armazenamento
  styles.scss              Importação dos estilos
  styles/                  SCSS separado por seção, temas e responsividade
public/
  caio.jpeg                Foto fornecida
  Caio-Massola-CV.pdf       Currículo fornecido
 tests/
  portfolio.spec.ts        Testes de navegação e regressão no navegador
```

Os arquivos antigos estão em `legacy/`, fora do build e das verificações.

## Formatação e validação

```sh
npm run format
npm run format:check
npm run lint
npm run build
npm run test:e2e
```

Prettier mantém indentação de dois espaços, elementos JSX hierárquicos e um atributo por linha. JSX, TypeScript, SCSS, HTML e configurações são formatados.

Os testes usam Microsoft Edge instalado e iniciam seu próprio Vite na porta 5174. O servidor de desenvolvimento da porta 5173 pode continuar aberto. A suíte verifica:

- Avançar e voltar por todos os projetos em 390, 1440, 1920 e 2560 px, com animações normais.
- Cliques rápidos sem perder o destino solicitado.
- Indicadores, teclado, rolagem nativa e redimensionamento com movimento reduzido.
- Persistência de idioma e tema, foto, currículo e links GitHub.

O cálculo do carrossel usa coordenadas relativas à sua própria área de rolagem. Assim, a margem centralizada da página e as animações de entrada não alteram o destino dos botões.

## Funcionalidades

- Português, inglês e espanhol.
- Tema escuro azul/preto e tema claro azul. Preferências salvas em localStorage, com fallback em memória quando o armazenamento é bloqueado.
- Foto pessoal, console animado com pausa e animações de entrada que respeitam movimento reduzido.
- Carrossel com setas, indicadores, teclado e rolagem por toque.
- Tic Tac Toe front-end e back-end, LoL Quiz e Block Boost Arena, com links GitHub.
- E-mail, LinkedIn, GitHub e download do CV em português.

Os cards usam ilustrações CSS, não screenshots. As fontes externas possuem fallback local. A experiência profissional reflete o currículo fornecido.

## Build estático

```sh
npm run build
npm run preview
```

Publique `dist/` na raiz de uma hospedagem estática. A pasta inclui foto e CV. Para hospedar em subdiretório, configure `base` no Vite e ajuste os links dos arquivos públicos.
