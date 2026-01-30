# Gestão de Manutenção da Rede Elétrica - Frontend

Este projeto é o frontend de um sistema robusto e escalável para a gestão de manutenção da rede elétrica. Ele fornece uma maneira estruturada de registrar e gerenciar ativos, técnicos, ocorrências e ordens de serviço, estabelecendo a base para uma plataforma completa de gerenciamento de manutenção.

## Objetivos

O objetivo principal é estruturar um sistema para o registro de ativos, técnicos, ocorrências e ordens de serviço para gerenciar a manutenção da rede elétrica.

### Objetivos Específicos

- **Cadastro de Ativos, Técnicos, Ocorrências e Ordens de Serviço:** Criar uma estrutura clara e organizada para o registro dessas entidades centrais.
- **Associações Claras:** Associar ativos a ocorrências e vinculá-los a técnicos e ordens de serviço.
- **Recuperação Eficiente de Informações:** Facilitar a busca e a recuperação de informações.
- **Autenticação e controle de acesso baseado em papéis:** Garantir que apenas usuários autorizados acessem e modifiquem os dados do sistema.
- **Base para Funcionalidades Futuras:** Estabelecer uma base confiável para futuras melhorias, incluindo:
  - Rastreamento do histórico de ativos.
  - Integração em tempo real com o atendimento ao cliente ou sistemas de monitoramento.
  - Planejamento automatizado de manutenção preventiva.
  - Relatórios e indicadores de desempenho.

## Tecnologias e Ferramentas

### Frontend
- **Framework:** [Next.js 13](https://nextjs.org/) (App Router)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Biblioteca de Componentes:** [PrimeReact](https://primereact.org/)
- **Estilização:** [PrimeFlex](https://primeflex.org/) e [SASS](https://sass-lang.com/)
- **Consumo de API:** [Axios](https://axios-http.com/)
- **Gráficos:** [Chart.js](https://www.chartjs.org/)

### Backend (Integração)
- **Framework:** [Spring Boot](https://spring.io/projects/spring-boot)
- **Segurança:** [Spring Security](https://spring.io/projects/spring-security)
- **Autenticação e Autorização:** [JWT (JSON Web Token)](https://jwt.io/)

## Estrutura do Projeto

O projeto segue a estrutura padrão do Next.js com o **App Router**, organizada da seguinte forma:

- **`app/`**: Contém as rotas e páginas da aplicação.
    - **`(main)/`**: Grupo de rotas protegidas que utilizam o layout principal.
    - **`(full-page)/`**: Grupo de rotas para páginas de tela cheia (Ex: Login).
- **`service/`**: Camada de serviços responsável pela comunicação com a API REST utilizando Axios.
- **`layout/`**: Componentes de layout, menus e contextos globais da aplicação.
- **`types/`**: Definições de interfaces e tipos TypeScript (Projeto.d.ts).

### Camada de Autenticação e Autorização

A segurança é integrada ao **Spring Security** do backend através de **JWT**:

- **[AuthContext](layout/context/authcontext.tsx)**: Gerencia o estado global de autenticação e o armazenamento do token.
- **[AuthGuard](layout/context/authguard.tsx)**: Protege as rotas, verificando se o usuário está autenticado.
- **[RoleGuard](layout/context/roleguard.tsx)**: Garante que apenas usuários com os papéis necessários acessem determinados componentes.
- **[BaseService](service/BaseService.ts)**: Configuração do Axios com interceptores para inclusão automática do cabeçalho `Authorization: Bearer <token>` e tratamento de erros de autorização.

## Como Executar Localmente

### Pré-requisitos
- **Node.js:** v18 ou superior
- **npm:** v9 ou superior
- **Backend em execução:** A aplicação depende da API Spring Boot disponível em `http://localhost:8081`

### Passo a Passo

1. **Clonar o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd <nome-da-pasta>
   ```

2. **Instalar as dependências:**
   ```bash
   npm install
   ```

3. **Configuração do Ambiente:**
   O frontend está configurado para acessar a API em `http://localhost:8081/api`. Caso seu backend esteja em outra URL, ajuste em `service/BaseService.ts`.

4. **Executar a aplicação:**
   ```bash
   npm run dev
   ```
   Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

> **Nota:** Para o funcionamento completo, o backend Spring Boot com Spring Security e JWT deve estar ativo.

## Funcionalidades Implementadas

Abaixo estão detalhadas as principais funcionalidades e os links para os respectivos códigos:

### 1. Sistema de Autenticação (Login)
- **Descrição:** Interface para entrada de usuários com validação de credenciais via JWT.
- **Código da Página:** [app/(full-page)/auth/login/page.tsx](app/(full-page)/auth/login/page.tsx)
- **Código do Serviço:** [service/AuthService.ts](service/AuthService.ts)
- **Como Testar:** Acesse a rota `/auth/login`, insira as credenciais e verifique o redirecionamento após o sucesso. O token será armazenado no `localStorage`.

### 2. Gestão de Ativos
- **Descrição:** CRUD completo de ativos (Postes, Transformadores, etc) com integração de endereço.
- **Código da Página:** [app/(main)/pages/ativo/page.tsx](app/(main)/pages/ativo/page.tsx)
- **Código do Serviço:** [service/AtivoService.tsx](service/AtivoService.tsx)
- **Como Testar:** Vá em "Pages > Ativo", use o botão "Novo Ativo" para cadastrar. A listagem suporta paginação e ações de edição/exclusão.

### 3. Gestão de Técnicos
- **Descrição:** Gerenciamento de técnicos, permitindo controle de disponibilidade e status operacional.
- **Código da Página:** [app/(main)/pages/tecnico/page.tsx](app/(main)/pages/tecnico/page.tsx)
- **Código do Serviço:** [service/TecnicoService.tsx](service/TecnicoService.tsx)
- **Como Testar:** Em "Pages > Técnico", é possível gerenciar os perfis. Utilize os botões de ação na tabela para alternar "Disponibilidade" ou "Status Ativo".

### 4. Gestão de Ocorrências
- **Descrição:** Registro e acompanhamento de ocorrências relatadas nos ativos.
- **Código da Página:** [app/(main)/pages/ocorrencia/page.tsx](app/(main)/pages/ocorrencia/page.tsx)
- **Código do Serviço:** [service/OcorrenciaService.tsx](service/OcorrenciaService.tsx)
- **Como Testar:** Acesse "Pages > Ocorrência". Ao criar uma nova, deve-se vincular o ID de um ativo existente.

### 5. Ordens de Serviço (OS)
- **Descrição:** Atribuição de técnicos a ocorrências e controle do ciclo de vida da manutenção.
- **Código da Página:** [app/(main)/pages/ordemservico/page.tsx](app/(main)/pages/ordemservico/page.tsx)
- **Código do Serviço:** [service/OrdemdeServicoService.tsx](service/OrdemdeServicoService.tsx)
- **Como Testar:** Navegue até "Pages > Ordem de Serviço". Vincule uma ocorrência a um técnico via CPF e gerencie o status da execução (Aberta, Em Andamento, Concluída).
