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
- [🚀 Melhorias Futuras](#-melhorias-futuras)
- [📚 Recursos Adicionais](#-recursos-adicionais)

## 📊 O que foi implementado e Priorização

### ✅ O que foi implementado

- **Funcionalidades Core**: CRUD completo para pets e tutores (criar, ler, atualizar, deletar), com validações de formulário, upload de fotos e autocomplete para vinculação entre tutores e pets.
- **Autenticação**: Sistema de login com guard para proteger rotas, interceptors para adicionar tokens às requisições.
- **Interface Responsiva**: UI moderna usando Angular Material, componentes compartilhados (data-grid, formulários, loading, etc.), design responsivo com efeitos glassmorphism e animações.
- **Gerenciamento de Estado**: Facades para centralizar lógica de negócio e estado, usando BehaviorSubjects para reatividade.
- **Testes**: 588 testes unitários com cobertura alta (Statements: 95.72%, Lines: 96.12%, Functions: 95.18%, Branches: 85.4%), incluindo testes para componentes, serviços, facades, diretivas e pipes.
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
   - Interceptors para loading, auth e tratamento de erros.
3. **Terceira Prioridade: Implantação e Documentação**
   - Docker para produção.
   - README detalhado com instruções e arquitetura.
   - Melhorias na arquitetura (facades, modularização).

## 🏗️ Arquitetura

A aplicação é construída com Angular 19 e segue uma estrutura modular organizada em camadas:

- **Core**: Facades, guards, interceptors e serviços base para autenticação e comunicação HTTP.
- **Features**: Módulos específicos para autenticação (auth), página inicial (home), gerenciamento de pets e tutores.
- **Shared**: Componentes reutilizáveis, diretivas, pipes, validações e estilos compartilhados.

### Componentes do Core

- **Facades**: Interface simplificada para subsistemas complexos. Inclui `app.facade` para gerenciamento geral da aplicação e `base.facade` como classe base para facades específicas.
- **Guards**: Controlam o acesso às rotas, como `auth.guard` para proteger rotas autenticadas.
- **Interceptors**: Interceptam requisições HTTP. `auth.interceptor` adiciona tokens de autenticação às requisições, `loading.interceptor` gerencia estados de carregamento, e `error.interceptor` trata erros de requisições HTTP.
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

#### ℹ️ Observação sobre CSS, SCSS, Angular Material e Tailwind

**Este projeto utiliza [Angular Material](https://material.angular.io/) como biblioteca principal de componentes de interface, com customizações via SCSS.**

- **Angular Material** fornece componentes prontos (inputs, botões, cards, etc.) e um sistema de temas, não sendo um framework de utilitários CSS como Tailwind ou Bootstrap.
- **SCSS** é utilizado para customizar temas, variáveis e estilos específicos do Material, aproveitando o poder do pré-processador.
- **Tailwind CSS** é um framework de utilitários CSS. A recomendação de “priorizar Tailwind” se aplica apenas quando for necessário adotar um framework de utilitários CSS para layout e estilização rápida.

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
2. **Core**: Gerencia autenticação, interceptação de requisições e estado da aplicação via facades.
3. **Features**: Módulos independentes para cada funcionalidade, com seus próprios serviços, facades e componentes.
4. **Shared**: Utilitários comuns, como validações, componentes e pipes, para evitar duplicação.
5. **Backend Integration**: Comunicação via HTTP com APIs REST, utilizando interceptors para autenticação e loading.

## 📝 Dados de Inscrição

### Cadastro de Pets

| Campo | Tipo   | Obrigatório | Descrição                  |
| ----- | ------ | ----------- | -------------------------- |
| Nome  | string | Sim         | Nome do animal             |
| Raça  | string | Não         | Raça específica (opcional) |
| Idade | number | Não         | Idade em anos (opcional)   |
| Foto  | object | Não         | Imagem opcional            |

**Nota**: A informação de espécie não foi disponibilizada devido à ausência do campo no endpoint da API.

### Cadastro de Tutores

| Campo    | Tipo   | Obrigatório | Descrição                       |
| -------- | ------ | ----------- | ------------------------------- |
| Nome     | string | Sim         | Nome completo                   |
| Email    | string | Não         | Endereço de email (opcional)    |
| Telefone | string | Sim         | Número de telefone              |
| CPF      | number | Não         | Número do CPF (opcional)        |
| Endereço | string | Não         | Endereço residencial (opcional) |
| Foto     | object | Não         | Imagem opcional                 |

### Estrutura da Foto

| Campo       | Tipo   | Descrição                   |
| ----------- | ------ | --------------------------- |
| id          | number | Identificador único da foto |
| nome        | string | Nome do arquivo da imagem   |
| contentType | string | Tipo MIME da imagem         |
| url         | string | URL assinada para acesso    |

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

**Cobertura Atual (última execução em 30/01/2026):**

- Statements: 95.72% (964/1007)
- Branches: 85.4% (199/233)
- Functions: 95.18% (356/374)
- Lines: 96.12% (918/955)

**Testes:** 588/588 SUCCESS

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

## 🚀 Melhorias Futuras

- **Gerenciamento de Estado**:Se o app crescer, considerar ferramentas como NgRx ou Akita para organizar melhor os dados e ações do sistema.
- **Cobertura de Testes**: Aumentar cobertura para 95%+ com testes de integração e mocks para APIs.
- **Atualização do Angular**: Manter o framework atualizado com as últimas versões para benefícios de performance, segurança e novos recursos.

---

## 📚 Recursos Adicionais

- Documentação Angular: https://angular.dev/
- Angular CLI: https://angular.dev/tools/cli
