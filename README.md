# 🐾 Pet Manager

[![Angular](https://img.shields.io/badge/Angular-19-red)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green)](https://nodejs.org/)

> Uma aplicação Angular para gerenciamento de pets e seus tutores (donos/cuidadores). Permite cadastro, edição e visualização de dados com autenticação e interface responsiva.

## 📋 Sumário

- [🏗️ Arquitetura](#-arquitetura)
- [📊 O que foi implementado / Não implementado e Priorização](#-o-que-foi-implementado-e-priorização)
- [📝 Dados de Inscrição](#-dados-de-inscrição)
- [🚀 Como Executar](#-como-executar)
- [🧪 Como Testar](#-como-testar)
- [📦 Empacotamento em Container](#-empacotamento-em-container)
- [🔧 Troubleshooting](#-troubleshooting)
- [📚 Recursos Adicionais](#-recursos-adicionais)
- [🚀 Melhorias Futuras](#-melhorias-futuras)

## 📊 O que foi implementado e Priorização

### ✅ O que foi implementado

- **Funcionalidades Core**: CRUD completo para pets e tutores (criar, ler, atualizar, deletar), com validações de formulário e upload de fotos.
- **Autenticação**: Sistema de login com guard para proteger rotas, interceptor para adicionar tokens às requisições.
- **Interface Responsiva**: UI moderna usando Angular Material, componentes compartilhados (data-grid, formulários, loading, etc.), design responsivo com efeitos glassmorphism e animações.
- **Gerenciamento de Estado**: Facades para centralizar lógica de negócio e estado, usando BehaviorSubjects para reatividade.
- **Testes**: 573 testes unitários com cobertura alta (92%+ statements e lines), incluindo testes para componentes, serviços, facades, diretivas e pipes.
- **Empacotamento**: Docker com Nginx, docker-compose para facilitar execução.
- **Documentação**: README completo com instruções de execução, testes, arquitetura e dados de inscrição.

### 🎯 Priorização

O desenvolvimento seguiu uma abordagem incremental e priorizada:

1. **Primeira Prioridade: Funcionalidades Essenciais (MVP)**
   - CRUD básico para pets e tutores.
   - Autenticação simples.
   - Interface funcional com Angular Material.

2. **Segunda Prioridade: Qualidade e Robustez**
   - Validações customizadas e tratamento de erros via facades.
   - Testes unitários abrangentes para alcançar cobertura alta.
   - Interceptors para loading e auth.

3. **Terceira Prioridade: Implantação e Documentação**
   - Docker para produção.
   - README detalhado com instruções e arquitetura.
   - Melhorias na arquitetura (facades, modularização).

## 🏗️ Arquitetura

A aplicação é construída com Angular 19 e segue uma estrutura modular organizada em camadas:

- **Core**: Contém facades, guards, interceptors e serviços base para autenticação e comunicação HTTP.
- **Features**: Módulos específicos para autenticação (auth), página inicial (home), gerenciamento de pets e tutores.
- **Shared**: Componentes reutilizáveis, diretivas, pipes, validações e estilos compartilhados.

### Componentes do Core

- **Facades**: Fornecem uma interface simplificada para subsistemas complexos. Inclui `app.facade` para gerenciamento geral da aplicação e `base.facade` como classe base para facades específicas.
- **Guards**: Controlam o acesso às rotas, como `auth.guard` para proteger rotas autenticadas.
- **Interceptors**: Interceptam requisições HTTP. `auth.interceptor` adiciona tokens de autenticação às requisições, e `loading.interceptor` gerencia estados de carregamento.
- **Serviços**: `auth.service` para lógica de autenticação e `http-base.service` para comunicação HTTP base.

### Componentes Compartilhados (Shared)

- **data-grid**: Componente para exibição de listas com paginação, busca e ações.
- **form-header**: Cabeçalho de formulários com design glassmorphism.
- **Outros componentes**: card-image, confirm-dialog, loading, toast, etc.

### Validações

No módulo Shared, há validações customizadas para formulários, incluindo regras para campos obrigatórios, formatos de email, CPF e outros dados específicos de pets e tutores.

### Tecnologias Utilizadas

| Tecnologia | Versão | Descrição                          |
| ---------- | ------ | ---------------------------------- |
| Angular    | 19     | Framework para desenvolvimento web |
| TypeScript | 5.4    | Superset do JavaScript             |
| SCSS       | -      | Pré-processador CSS                |
| Docker     | -      | Containerização                    |
| Nginx      | Alpine | Servidor web para produção         |

### Estrutura de Diretórios

```
src/
├── app/
│   ├── core/          # Serviços base, guards, interceptors
│   │   ├── facades/   # Facades para gerenciamento de estado
│   │   ├── guards/    # Proteção de rotas
│   │   ├── interceptors/ # Intercepção de requisições HTTP
│   │   ├── models/    # Modelos de dados base
│   │   └── services/  # Serviços HTTP e utilitários
│   ├── features/      # Módulos de funcionalidades
│   │   ├── auth/      # Autenticação
│   │   ├── home/      # Página inicial
│   │   ├── pets/      # Gerenciamento de pets
│   │   └── tutores/   # Gerenciamento de tutores
│   └── shared/        # Componentes e utilitários compartilhados
│       ├── components/# Componentes reutilizáveis
│       │   ├── data-grid/        # Grid de dados com paginação
│       │   ├── form-header/      # Cabeçalho de formulários
│       │   └── ...               # Outros componentes
│       ├── directives/# Diretivas customizadas
│       ├── pipes/     # Pipes para transformação de dados
│       ├── services/  # Serviços compartilhados
│       └── validations/# Validações customizadas
├── environments/      # Configurações de ambiente
└── styles.scss        # Estilos globais
```

### Fluxo Arquitetural

1. **Frontend (Angular)**: Interface do usuário com componentes standalone e formulários reativos.
2. **Core Layer**: Gerencia autenticação, interceptação de requisições e estado da aplicação via facades.
3. **Features Layer**: Módulos independentes para cada funcionalidade, com seus próprios serviços, facades e componentes.
4. **Shared Layer**: Utilitários comuns, como validações, componentes e pipes, para evitar duplicação.
5. **Backend Integration**: Comunicação via HTTP com APIs REST, utilizando interceptors para autenticação e loading.

## 📝 Dados de Inscrição

### Cadastro de Pets

| Campo           | Obrigatório | Descrição                    |
| --------------- | ----------- | ---------------------------- |
| Nome do pet     | Sim         | Nome do animal               |
| Raça            | Não         | Raça específica (opcional)   |
| Idade           | Não         | Idade em anos (opcional)     |
| Foto            | Não         | Imagem opcional              |
| Tutor associado | Não         | Tutor responsável (opcional) |

### Cadastro de Tutores

| Campo           | Obrigatório | Descrição                       |
| --------------- | ----------- | ------------------------------- |
| Nome            | Sim         | Nome completo                   |
| Email           | Não         | Endereço de email (opcional)    |
| Telefone        | Sim         | Número de telefone              |
| CPF             | Não         | Número do CPF (opcional)        |
| Endereço        | Não         | Endereço residencial (opcional) |
| Foto            | Não         | Imagem opcional                 |
| Pets associados | Não         | Lista de pets (opcional)        |

## 🚀 Como Executar

### Desenvolvimento Local

1. 📦 Instale as dependências:

   ```bash
   npm install
   ```

2. ▶️ Inicie o servidor de desenvolvimento:

   ```bash
   ng serve
   ```

3. 🌐 Acesse `http://localhost:4200` no navegador.

   **Credenciais de Login:**
   - Usuário: `admin`
   - Senha: `admin`

### Produção com Docker

1. 🐳 Construa e execute com Docker Compose:

   ```bash
   docker-compose up --build
   ```

2. 🌐 A aplicação estará disponível em `http://localhost:4200`.

Para parar os containers:

```bash
docker-compose down
```

Para construir a imagem manualmente:

```bash
docker build -t pet-manager .
```

Para executar:

```bash
docker run -p 4200:80 pet-manager
```

## 🧪 Como Testar

### Testes Unitários

Execute os testes com Karma:

```bash
ng test
```

Para testes com cobertura:

```bash
ng test --code-coverage --watch=false
```

Após a execução, o relatório de cobertura será gerado na pasta `coverage/pet-manage/`. Abra o arquivo `index.html` em um navegador para visualizar as porcentagens de cobertura de código.

**Cobertura Atual:**

- Statements: 92.63%
- Branches: 83.41%
- Functions: 87.84%
- Lines: 92.77%

## 📦 Empacotamento em Container

O artefato é empacotado em um container Docker isolado com todas as dependências. O Dockerfile constrói a aplicação Angular e a serve com Nginx em um contêiner Alpine Linux, garantindo isolamento e portabilidade.

### API Backend

A aplicação se comunica com uma API REST backend. Os endpoints principais incluem:

- `POST /api/auth/login` - Autenticação
- `GET /api/pets` - Listar pets
- `POST /api/pets` - Criar pet
- `PUT /api/pets/:id` - Atualizar pet
- `DELETE /api/pets/:id` - Deletar pet
- `POST /api/pets/:id/upload` - Upload de foto do pet
- `GET /api/tutores` - Listar tutores
- `POST /api/tutores` - Criar tutor
- `PUT /api/tutores/:id` - Atualizar tutor
- `DELETE /api/tutores/:id` - Deletar tutor
- `POST /api/tutores/:id/upload` - Upload de foto do tutor
- `POST /api/pets/:petId/tutores/:tutorId` - Vincular tutor a pet
- `DELETE /api/pets/:petId/tutores/:tutorId` - Desvincular tutor de pet
- `GET /api/pets/:id/tutores` - Listar tutores de um pet
- `GET /api/tutores/:id/pets` - Listar pets de um tutor

**Nota**: Os endpoints de upload aceitam arquivos de imagem (JPEG, PNG) com tamanho máximo de 3MB.

## 📚 Recursos Adicionais

- [Documentação Angular](https://angular.dev/)
- [Angular CLI](https://angular.dev/tools/cli)

## 🔧 Troubleshooting

### Problemas Comuns

- **Erro de CORS**: Se encontrar erros de CORS, verifique se o backend está configurado para aceitar requisições do frontend.
- **Login não funciona**: Certifique-se de que as credenciais estão corretas (usuário: `admin`, senha: `admin`).
- **Imagens não carregam**: Verifique se o diretório de uploads tem permissões adequadas.
- **Testes falham**: Execute `npm install` para garantir que todas as dependências estejam instaladas.

### Logs e Debug

Para visualizar logs detalhados durante o desenvolvimento:

```bash
ng serve --verbose
```

Para debug de testes:

```bash
ng test --browsers=Chrome --watch
```

### Padrões de Código

- Use TypeScript strict mode
- Mantenha cobertura de testes acima de 90%
- Siga as convenções de nomenclatura do Angular
- Documente novos componentes e serviços
- Evite redundancia
- Componentize oque for comum

## ⚠️ Limitações da API

### Paginação Limitada

A API de listagem de pets utiliza paginação com limite padrão de 10 registros por página. Para funcionalidades que necessitam carregar todos os pets disponíveis (como o vínculo de pets a tutores), foi implementada uma solução que força o carregamento de até 1000 registros através do parâmetro `size=1000`.

**Nota Importante**: Não existe um endpoint específico para "listar todos os pets" na API. A solução atual utiliza o endpoint paginado com um limite alto, o que pode impactar a performance em bases de dados muito grandes.

**Implementação**: No componente `pet-link.component.ts`, o método `loadAllPets()` do facade é utilizado para carregar todos os pets disponíveis para vínculo.

## 🎨 Decisões de Design

### Dropdown de Seleção de Pets

No componente de vínculo de pets com tutores (`pet-link.component.ts`), foi optado por não exibir as imagens dos pets no dropdown de seleção para evitar problemas de performance. Quando há muitos pets cadastrados, renderizar todas as imagens simultaneamente poderia causar lentidão significativa na interface.

**Decisão**: O dropdown exibe apenas o nome do pet para manter a performance e responsividade da interface, mesmo com listas grandes de pets.

## 🚀 Melhorias Futuras

Aqui estão algumas sugestões de melhorias no código que poderiam ser implementadas no futuro para aumentar a qualidade, performance e manutenibilidade:

- **Gerenciamento de Estado**: Se o app ficar maior e mais complexo (com mais telas e dados sendo compartilhados), podemos usar ferramentas como NgRx ou Akita para organizar melhor os dados e ações do sistema. Isso ajuda a evitar erros, facilita encontrar problemas e deixa o código mais fácil de crescer. Por exemplo, informações de login, listas de pets e tutores, e filtros de busca ficariam em um lugar central, evitando que dados se percam ou sejam alterados por engano entre as telas.
- **Autocomplete no Vínculo de Pets**: Implementar um campo de autocomplete na tela de vínculo de pets com tutores, permitindo buscar e selecionar pets por nome de forma mais intuitiva e eficiente, especialmente quando houver muitos pets cadastrados.
- **Cobertura de Testes**: Aumentar cobertura para 95%+ com testes de integração e mocks para APIs.
- **Atualização do Angular**: Manter o framework atualizado com as últimas versões para benefícios de performance, segurança e novos recursos. Seguir as melhores práticas de migração e executar testes completos após cada atualização.
