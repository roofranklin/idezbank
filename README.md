# 🏦 Fintech Dashboard - Painel Financeiro Inteligente

Um painel financeiro moderno, seguro e performático desenvolvido para simular a experiência de um cliente numa conta digital. 

Este projeto foi desenvolvido como resolução de um desafio técnico para a posição de Desenvolvedor React Especialista, com foco em boas práticas, tipagem estática e experiência do usuário (UX).

**🌐 Acesse a aplicação ao vivo:** [https://idezbank.vercel.app/](https://idezbank.vercel.app/)

**📚 A documentação pode ser vista em:** [https://idezbank.vercel.app/docs.html](https://idezbank.vercel.app/docs.html)

## 🚀 Tecnologias e Arquitetura Adotada

A arquitetura foi pensada para um ambiente real de *fintech*, priorizando escalabilidade, previsibilidade de dados e performance.

- **React 19 + Vite + TypeScript:** Base da aplicação. O Vite garante um *build* ultrarrápido, enquanto o TypeScript elimina erros de runtime garantindo os contratos de dados.
- **TanStack Query (React Query):** Escolhido para o gerir o estado assíncrono (Server State). Facilita o *caching*, invalidação de consultas após mutações (como ao criar uma nova transação) e gere nativamente os estados de `loading` e `error`.
- **MSW (Mock Service Worker):** Em vez de um simples ficheiro JSON, optei pelo MSW para interceptar requisições ao nível da rede. Isso permitiu simular um banco de dados real no *front-end*, com paginação verdadeira, filtros compostos e cálculos de saldo dinâmicos.
- **Tailwind CSS v4:** Utilizado para garantir alta fidelidade ao design proposto, permitindo estilização rápida e um *bundle* CSS otimizado.
- **React Hook Form + Zod:** Combinação *state-of-the-art* para formulários. Garante validações complexas de forma performática (sem re-renders desnecessários a cada clique) e totalmente tipada.
- **Vitest + Testing Library:** Escolhidos para os testes unitários e de integração pela sua velocidade e integração nativa com o ecossistema Vite. Entendo que o teste requeria Jest mas a sintaxe do Jest e Vitest é exatamente a mesma.

## ⚙️ Como executar o projeto localmente

Pré-requisitos: Ter o [Node.js](https://nodejs.org/) instalado (versão 18 ou superior).

1. Clone o repositório:
   ```bash
   git clone https://github.com/roofranklin/idezbank.git
   ```
2. Entre no diretório:
   ```bash
   cd idezbank
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Abra o navegador em http://localhost:5173.
   (Nota: Abra o console do navegador para confirmar que o MSW está ativo com a mensagem [MSW] Mocking enabled.)

## 📚 Documentação da API (Mock)

A API simulada foi documentada utilizando a especificação OpenAPI (Swagger).
Para gerar e visualizar a documentação:

1. Rode o comando:
   ```bash
   npm run docs
   ```
2. Com a aplicação rodando (npm run dev), pode acessar a documentação em: http://localhost:5173/docs.html

## 🧪 Como rodar os testes

Os testes cobrem renderização de componentes isolados e fluxos principais de integração (como a submissão e validação do formulário de nova transação).

Para rodar os testes uma única vez:
```bash
npm run test
```

## 🔮 Lista de Melhorias Futuras

Pensando num cenário de evolução contínua do produto, as próximas etapas de engenharia incluiriam:

1. Virtualização de Listas: Implementar TanStack Virtual na tabela de transações para manter a performance de renderização em 60fps caso o usuário decida carregar centenas de transações na mesma página.
2. Autenticação e Segurança: Implementar um fluxo de JWT com refresh tokens e proteção de rotas privadas.
3. Acessibilidade (a11y): Garantir que todos os modais e tabelas são 100% navegáveis via teclado e compatíveis com leitores de tela (ARIA labels, foco trapping).
4. Testes E2E: Adicionar Cypress ou Playwright para testes de ponta a ponta, simulando a jornada completa do usuário num ambiente de browser real.
5. Dark Mode: Aproveitar a arquitetura de variáveis do Tailwind CSS para adicionar suporte nativo a temas claros e escuros.
