# 🚀 Guia de Instalação - MAXPREMIER Docs

## Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn

## Passo a Passo

### 1. Instalar Dependências

Na raiz do projeto, execute:

```bash
npm install
cd frontend && npm install
cd ../backend && npm install
cd ..
```

Ou use o script automatizado:

```bash
npm run install:all
```

### 2. Configurar Banco de Dados

Crie o arquivo `.env` na pasta `backend/` com o seguinte conteúdo:

```
DATABASE_URL="file:./dev.db"
PORT=3001
```

Depois, execute:

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

Isso criará o banco de dados SQLite e as tabelas necessárias.

### 3. Iniciar o Projeto

Na raiz do projeto, execute:

```bash
npm run dev
```

Isso iniciará:
- ✅ Frontend em http://localhost:3000
- ✅ Backend em http://localhost:3001

### 4. Verificar Funcionamento

- Acesse http://localhost:3000 no navegador
- Você deve ver a interface do sistema
- O backend deve estar respondendo em http://localhost:3001/api/health

## Comandos Úteis

### Backend

```bash
cd backend

# Desenvolvimento
npm run dev

# Gerar Prisma Client
npm run prisma:generate

# Criar migração
npm run prisma:migrate

# Abrir Prisma Studio (interface visual do banco)
npm run prisma:studio
```

### Frontend

```bash
cd frontend

# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## Estrutura Criada

```
maxPremier/
├── frontend/              # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── services/      # Serviços API
│   │   └── types/         # Tipos TypeScript
│   └── package.json
├── backend/               # Express + TypeScript
│   ├── src/
│   │   ├── routes/        # Rotas da API
│   │   └── index.ts       # Servidor principal
│   ├── prisma/
│   │   └── schema.prisma  # Schema do banco
│   └── package.json
└── package.json           # Workspace root
```

## Próximos Passos

Após a instalação, você pode:

1. ✅ Verificar se tudo está funcionando
2. ✅ Criar seu primeiro cliente
3. ✅ Criar seu primeiro template de checklist
4. ✅ Começar a usar o sistema

## Problemas Comuns

### Erro: "Cannot find module"
- Execute `npm install` novamente na pasta com erro

### Erro: "Prisma Client not generated"
- Execute `cd backend && npm run prisma:generate`

### Porta 3000 ou 3001 já em uso
- Altere a porta no arquivo de configuração correspondente

### Banco de dados não encontrado
- Execute `cd backend && npm run prisma:migrate` novamente

