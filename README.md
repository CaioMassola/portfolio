# Caio Massola — Portfólio

Portfólio pessoal de Caio Massola, engenheiro de software front-end. O site apresenta minha trajetória profissional, tecnologias, projetos e canais de contato em uma interface editorial e responsiva.

## Destaques

- Conteúdo em português, inglês e espanhol
- Temas claro e escuro com preferência salva no navegador
- Layout responsivo para desktop e dispositivos móveis
- Imagens reais e links dos projetos
- Download do currículo em PDF
- Navegação por teclado e suporte a leitores de tela
- Animações compatíveis com `prefers-reduced-motion`

## Projetos apresentados

| Projeto           | Tecnologias                     | Links                                                                                                                                    |
| ----------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Tic Tac Toe       | Next.js, TypeScript e WebSocket | [Aplicação](https://tic-tac-toe-five-blond-67.vercel.app/) · [Código](https://github.com/CaioMassola/tic-tac-toe)                        |
| Tic Tac Toe API   | Java, Spring Boot e STOMP       | [Status da API](https://tic-tac-toe-backend-5si6.onrender.com/api/health) · [Código](https://github.com/CaioMassola/tic-tac-toe-backend) |
| LoL Quiz          | React, TypeScript e Riot API    | [Aplicação](https://lol-quiz-tau.vercel.app/) · [Código](https://github.com/CaioMassola/lol-quiz)                                        |
| Block Boost Arena | Java, renderização 3D e TCP     | [Código](https://github.com/CaioMassola/block-boost-arena)                                                                               |

## Tecnologias do portfólio

- React 19
- TypeScript
- Vite
- SCSS
- Lucide React
- Karma, Jasmine e Istanbul
- Playwright

## Executar localmente

Requisitos: Node.js 20.19 ou superior e npm.

```bash
npm install
npm run dev
```

O servidor será iniciado em http://127.0.0.1:5173/.

## Scripts

| Comando                   | Descrição                                      |
| ------------------------- | ---------------------------------------------- |
| `npm run dev`             | Inicia o ambiente de desenvolvimento           |
| `npm run build`           | Valida o TypeScript e gera o build de produção |
| `npm run preview`         | Executa localmente o build de produção         |
| `npm run lint`            | Analisa o código com ESLint                    |
| `npm run format`          | Formata os arquivos com Prettier               |
| `npm run format:check`    | Verifica a formatação sem alterar arquivos     |
| `npm run test:unit`       | Executa os testes unitários e gera a cobertura |
| `npm run test:unit:watch` | Executa os testes unitários em modo contínuo   |
| `npm run test:e2e`        | Executa os testes de interface com Playwright  |

## Testes

Os testes unitários são executados com Karma e Jasmine no Microsoft Edge headless. O processo falha se statements, branches, functions ou lines ficarem abaixo de 100% de cobertura.

O relatório HTML é gerado em `coverage/karma/html/index.html`.

Os testes E2E com Playwright verificam:

- Grade de projetos em diferentes larguras de tela
- Persistência de idioma e tema
- Foto, currículo e links externos
- Conteúdo e navegação essenciais

## Estrutura principal

```text
src/
├── components/   Componentes de layout, seções e projetos
├── hooks/        Preferências, movimento reduzido e animações
├── lib/          Links públicos e persistência local
├── styles/       Estilos organizados por seção
├── App.tsx       Composição da página
└── content.ts    Textos traduzidos e dados dos projetos

tests/
├── unit/         Testes unitários com Karma e Jasmine
└── portfolio.spec.ts  Testes E2E com Playwright
```

## Build de produção

```bash
npm run build
npm run preview
```

Os arquivos estáticos são gerados em `dist/`.

## Contato

- [LinkedIn](https://www.linkedin.com/in/caio-massola-37863b169/)
- [GitHub](https://github.com/CaioMassola)
- [E-mail](mailto:chmassola@gmail.com)
