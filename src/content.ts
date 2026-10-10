export type Language = 'pt' | 'en' | 'es';

export const copy = {
  pt: {
    nav: ['Sobre', 'Experiência', 'Projetos', 'Contato'],
    skip: 'Pular para o conteúdo',
    role: 'Engenheiro de Software Front-End',
    headline: ['Sou Caio Massola', '.'],
    intro:
      'Engenheiro de software front-end com mais de 6 anos de experiência em aplicações web e mobile.',
    projectsCta: 'Conheça meus projetos',
    cv: 'Baixar currículo',
    aboutLabel: '01 — SOBRE MIM',
    aboutSecond:
      'Na SoftExpert, trabalho na evolução de um produto corporativo com React e TypeScript: componentes reutilizáveis, Design System com Storybook, testes e integrações com APIs REST e AWS.',
    aboutBackground: 'Antes disso, desenvolvi aplicações web com Angular, serviços com Node.js e MySQL e aplicativos com React Native. Essa experiência me ajuda a pensar na interface e também nos dados e serviços que a sustentam.',
    educationLabel: 'Formação acadêmica',
    education: 'Bacharel em Sistemas de Informação',
    school: 'Universidade Anhembi Morumbi · 2018 — 2021',
    skillsTitle: 'Tecnologias com que construo',
    experienceLabel: '02 — TRAJETÓRIA',
    experienceTitle: 'Minha trajetória profissional',
    current: 'ATUAL',
    jobs: [
      {
        role: 'Engenheiro de Software Front-End',
        company: 'SoftExpert',
        date: 'MAI 2023 — PRESENTE',
        description:
          'Evolução de um produto corporativo com React e TypeScript. Componentes reutilizáveis, Design System com Storybook, testes com Jest e Testing Library e integrações com AWS e APIs REST.',
      },
      {
        role: 'Desenvolvedor Full Stack',
        company: 'Orhganiza Tecnologia',
        date: 'DEZ 2021 — MAI 2023',
        description:
          'Aplicações web com Angular, serviços com Node.js e MySQL e aplicativos iOS e Android com React Native. Melhorias de performance, escalabilidade e revisão de código.',
      },
      {
        role: 'Estagiário de Desenvolvimento',
        company: 'Orhganiza Tecnologia',
        date: 'NOV 2019 — NOV 2021',
        description:
          'Desenvolvimento com Angular, TypeScript e Node.js. Integração de APIs REST, correção de bugs em produção e colaboração em times ágeis.',
      },
    ],
    projectsLabel: '03 — PROJETOS SELECIONADOS',
    projectsTitle: 'Meus projetos',
    projectLink: 'Explorar no GitHub',
    demo: 'Abrir projeto',
    projectNames: ['Tic Tac Toe', 'Tic Tac Toe API', 'LoL Quiz', 'Block Boost Arena', 'Price Alert Bot'],
    projectDescriptions: [
      'Um clássico, uma nova experiência. Jogo da velha com salas online, chat em tempo real, temas e três idiomas.',
      'O motor das partidas. API com regras validadas pelo servidor, salas para dois jogadores e atualizações em tempo real.',
      'Você reconhece um campeão em 50 milissegundos? Um quiz visual de League of Legends que desafia sua memória.',
      'Futebol com carros, turbo e saltos. Um jogo 3D em Java inspirado em Rocket League, com física própria, bots e multiplayer por IP.',
      'Monitoramento de preços com histórico e alertas de ofertas no Discord. Um bot em Java e Spring Boot, executado com Docker, que ajuda a acompanhar oportunidades de compra.',
    ],
    projectTypes: [
      'FRONT-END · MULTIPLAYER',
      'BACK-END · REALTIME',
      'FRONT-END · GAME',
      'JAVA · GAME DEVELOPMENT',
      'BACK-END · DISCORD BOT',
    ],
    contactLabel: '04 — VAMOS CONVERSAR',
    footer: 'Construído com React, TypeScript e atenção aos detalhes.',
    light: 'Ativar tema claro',
    dark: 'Ativar tema escuro',
    language: 'Idioma',
  },
  en: {
    nav: ['About', 'Experience', 'Projects', 'Contact'],
    skip: 'Skip to content',
    role: 'Front-End Software Engineer',
    headline: ['I’m Caio Massola', '.'],
    intro:
      'Front-end software engineer with over 6 years of experience building web and mobile applications.',
    projectsCta: 'Explore my projects',
    cv: 'Download résumé',
    aboutLabel: '01 — ABOUT ME',
    aboutSecond:
      'At SoftExpert, I develop a business software product with React and TypeScript: reusable components, a Storybook design system, tests, and integrations with REST APIs and AWS.',
    aboutBackground: 'Previously, I built Angular web applications, Node.js and MySQL services, and React Native apps. That experience helps me consider both the interface and the data and services behind it.',
    educationLabel: 'Education',
    education: 'Bachelor’s in Information Systems',
    school: 'Anhembi Morumbi University · 2018 — 2021',
    skillsTitle: 'Technologies I build with',
    experienceLabel: '02 — MY JOURNEY',
    experienceTitle: 'My professional journey',
    current: 'CURRENT',
    jobs: [
      {
        role: 'Front-End Software Engineer',
        company: 'SoftExpert',
        date: 'MAY 2023 — PRESENT',
        description:
          'Developing an enterprise product with React and TypeScript. Reusable components, a Storybook Design System, Jest and Testing Library tests, and AWS and REST API integrations.',
      },
      {
        role: 'Full Stack Developer',
        company: 'Orhganiza Tecnologia',
        date: 'DEC 2021 — MAY 2023',
        description:
          'Angular web apps, Node.js and MySQL services, and iOS and Android apps with React Native. Performance improvements, scalability and code reviews.',
      },
      {
        role: 'Software Development Intern',
        company: 'Orhganiza Tecnologia',
        date: 'NOV 2019 — NOV 2021',
        description:
          'Development with Angular, TypeScript and Node.js. REST API integration, production bug fixes and collaboration in agile teams.',
      },
    ],
    projectsLabel: '03 — BEYOND THE EXPECTED',
    projectsTitle: 'My projects',
    projectLink: 'Explore on GitHub',
    demo: 'Open project',
    projectNames: ['Tic Tac Toe', 'Tic Tac Toe API', 'LoL Quiz', 'Block Boost Arena', 'Price Alert Bot'],
    projectDescriptions: [
      'A classic, a new experience. Tic-tac-toe with online rooms, real-time chat, themes and three languages.',
      'The engine behind the matches. Server-validated rules, two-player rooms and real-time updates.',
      'Can you recognize a champion in 50 milliseconds? A visual League of Legends quiz that challenges your memory.',
      'Car soccer, boost and jumps. A Java 3D game inspired by Rocket League, with custom physics, bots and direct-IP multiplayer.',
      'Price tracking with historical data and deal alerts on Discord. A Java and Spring Boot bot running with Docker that helps you keep an eye on buying opportunities.',
    ],
    projectTypes: [
      'FRONT-END · MULTIPLAYER',
      'BACK-END · REALTIME',
      'FRONT-END · GAME',
      'JAVA · GAME DEVELOPMENT',
      'BACK-END · DISCORD BOT',
    ],
    contactLabel: '04 — LET’S TALK',
    footer: 'Built with React, TypeScript and attention to detail.',
    light: 'Switch to light theme',
    dark: 'Switch to dark theme',
    language: 'Language',
  },
  es: {
    nav: ['Sobre mí', 'Experiencia', 'Proyectos', 'Contacto'],
    skip: 'Saltar al contenido',
    role: 'Ingeniero de Software Front-End',
    headline: ['Soy Caio Massola', '.'],
    intro:
      'Ingeniero de software front-end con más de 6 años de experiencia en aplicaciones web y móviles.',
    projectsCta: 'Explora mis proyectos',
    cv: 'Descargar currículum',
    aboutLabel: '01 — SOBRE MÍ',
    aboutSecond:
      'En SoftExpert, trabajo en la evolución de un producto empresarial con React y TypeScript: componentes reutilizables, un Design System con Storybook, pruebas e integraciones con APIs REST y AWS.',
    aboutBackground: 'Antes desarrollé aplicaciones web con Angular, servicios con Node.js y MySQL y aplicaciones con React Native. Esa experiencia me ayuda a pensar tanto en la interfaz como en los datos y servicios que la sostienen.',
    educationLabel: 'Formación académica',
    education: 'Grado en Sistemas de Información',
    school: 'Universidad Anhembi Morumbi · 2018 — 2021',
    skillsTitle: 'Tecnologías con las que construyo',
    experienceLabel: '02 — TRAYECTORIA',
    experienceTitle: 'Mi trayectoria profesional',
    current: 'ACTUAL',
    jobs: [
      {
        role: 'Ingeniero de Software Front-End',
        company: 'SoftExpert',
        date: 'MAY 2023 — PRESENTE',
        description:
          'Evolución de un producto empresarial con React y TypeScript. Componentes reutilizables, Design System con Storybook, pruebas con Jest y Testing Library e integraciones con AWS y APIs REST.',
      },
      {
        role: 'Desarrollador Full Stack',
        company: 'Orhganiza Tecnologia',
        date: 'DIC 2021 — MAY 2023',
        description:
          'Aplicaciones web con Angular, servicios con Node.js y MySQL y aplicaciones iOS y Android con React Native. Mejoras de rendimiento, escalabilidad y revisión de código.',
      },
      {
        role: 'Pasante de Desarrollo de Software',
        company: 'Orhganiza Tecnologia',
        date: 'NOV 2019 — NOV 2021',
        description:
          'Desarrollo con Angular, TypeScript y Node.js. Integración de APIs REST, corrección de errores en producción y colaboración en equipos ágiles.',
      },
    ],
    projectsLabel: '03 — MÁS ALLÁ DE LO OBVIO',
    projectsTitle: 'Mis proyectos',
    projectLink: 'Explorar en GitHub',
    demo: 'Abrir proyecto',
    projectNames: ['Tic Tac Toe', 'Tic Tac Toe API', 'LoL Quiz', 'Block Boost Arena', 'Price Alert Bot'],
    projectDescriptions: [
      'Un clásico, una nueva experiencia. Tres en raya con salas en línea, chat en tiempo real, temas y tres idiomas.',
      'El motor de las partidas. Reglas validadas por el servidor, salas para dos jugadores y actualizaciones en tiempo real.',
      '¿Reconoces a un campeón en 50 milisegundos? Un quiz visual de League of Legends que desafía tu memoria.',
      'Fútbol con coches, turbo y saltos. Un juego 3D en Java inspirado en Rocket League, con física propia, bots y multijugador por IP.',
      'Seguimiento de precios con historial y alertas de ofertas en Discord. Un bot en Java y Spring Boot, ejecutado con Docker, para estar al tanto de oportunidades de compra.',
    ],
    projectTypes: [
      'FRONT-END · MULTIJUGADOR',
      'BACK-END · TIEMPO REAL',
      'FRONT-END · JUEGO',
      'JAVA · DESARROLLO DE JUEGOS',
      'BACK-END · BOT DE DISCORD',
    ],
    contactLabel: '04 — HABLEMOS',
    footer: 'Hecho con React, TypeScript y atención a los detalles.',
    light: 'Activar tema claro',
    dark: 'Activar tema oscuro',
    language: 'Idioma',
  },
};

export interface Project {
  id: 'trio' | 'api' | 'lol' | 'arena' | 'price';
  repo: string;
  tags: string[];
  demo?: string;
}

export const projects: Project[] = [
  {
    id: 'trio',
    repo: 'tic-tac-toe',
    tags: ['Next.js', 'TypeScript', 'WebSocket'],
    demo: 'https://tic-tac-toe-five-blond-67.vercel.app',
  },
  {
    id: 'api',
    repo: 'tic-tac-toe-backend',
    tags: ['Java', 'Spring Boot', 'STOMP'],
    demo: 'https://tic-tac-toe-backend-5si6.onrender.com/api/health',
  },
  {
    id: 'lol',
    repo: 'lol-quiz',
    tags: ['React', 'TypeScript', 'Riot API'],
    demo: 'https://lol-quiz-tau.vercel.app',
  },
  { id: 'arena', repo: 'block-boost-arena', tags: ['Java', '3D', 'Multiplayer TCP'] },
  { id: 'price', repo: 'price-alert-bot', tags: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker'] },
];

export type Copy = (typeof copy)[Language];
