# 🚀 Comandos Rápidos - MAXPREMIER Docs

## Iniciar o Sistema

### Opção 1: Iniciar tudo de uma vez (RECOMENDADO)

Na **raiz do projeto** (`maxPremier`), execute:

```bash
npm run dev
```

Isso iniciará automaticamente:
- ✅ Backend na porta 3001
- ✅ Frontend na porta 3000

### Opção 2: Iniciar separadamente

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Comandos Úteis

### Backend
```bash
cd backend

# Desenvolvimento
npm run dev

# Gerar Prisma Client (após mudanças no schema)
npm run prisma:generate

# Criar nova migração
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
```

## Estrutura de Pastas

```
maxPremier/              ← Você deve estar AQUI para usar npm run dev
├── backend/            ← Para comandos do backend, faça: cd backend
├── frontend/           ← Para comandos do frontend, faça: cd frontend
└── package.json        ← Scripts principais aqui
```

## ⚠️ Erro Comum

Se você ver o erro:
```
Cannot find path '...\backend' because it does not exist
```

**Solução:** Certifique-se de estar na pasta `maxPremier` (raiz do projeto) antes de executar os comandos.

Para verificar onde você está:
```bash
pwd    # Linux/Mac
cd     # Windows PowerShell (mostra o caminho atual)
```

Para voltar à raiz do projeto:
```bash
cd C:\Users\miche\OneDrive\Área de Trabalho\maxPremier
```

## Acessar o Sistema

Após iniciar:
- 🌐 **Frontend**: http://localhost:3000
- 🔌 **Backend API**: http://localhost:3001/api/health

