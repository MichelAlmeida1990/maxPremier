# 🚀 Guia de Deploy - MAXPREMIER

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no Vercel (frontend) - Gratuito
- Conta no Railway ou Render (backend) - Gratuito

## 🔧 Configuração do Frontend (Vercel)

### 1. Preparar o projeto

```bash
# Na raiz do projeto
cd frontend
npm install
npm run build
```

### 2. Deploy no Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Conecte seu repositório GitHub
3. Configure o projeto:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. Adicione variáveis de ambiente (se necessário):
   - `VITE_API_URL`: URL do backend (ex: `https://seu-backend.railway.app/api`)

### 3. Configuração do vercel.json

O arquivo `vercel.json` já está configurado na raiz do projeto.

## 🔧 Configuração do Backend (Railway/Render)

### Opção 1: Railway (Recomendado)

1. Acesse [railway.app](https://railway.app)
2. Crie um novo projeto
3. Conecte seu repositório GitHub
4. Adicione um serviço "Node.js"
5. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Port**: `3001` (ou deixe Railway definir)

6. Variáveis de ambiente:
   - `PORT`: Porta (Railway define automaticamente)
   - `DATABASE_URL`: SQLite (Railway cria automaticamente)

7. Execute migrations:
   - Adicione um comando de build: `npm install && npm run prisma:generate && npm run build`
   - Adicione um comando de start: `npm run prisma:migrate deploy && npm start`

### Opção 2: Render

1. Acesse [render.com](https://render.com)
2. Crie um novo "Web Service"
3. Conecte seu repositório GitHub
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run prisma:generate && npm run build`
   - **Start Command**: `npm run prisma:migrate deploy && npm start`
   - **Environment**: Node

   **⚠️ IMPORTANTE**: Se o Root Directory não funcionar, use os comandos completos:
   - **Build Command**: `cd backend && npm install && npm run prisma:generate && npm run build`
   - **Start Command**: `cd backend && npm run prisma:migrate deploy && npm start`

5. Variáveis de ambiente:
   - `PORT`: Porta (Render define automaticamente)
   - `DATABASE_URL`: SQLite (Render cria automaticamente)

**OU** use o arquivo `render.yaml` na raiz do projeto (já criado):
- O Render detecta automaticamente o arquivo `render.yaml`
- Configure apenas o Root Directory como vazio (raiz do projeto)

## 🔗 Conectar Frontend e Backend

1. Após deploy do backend, copie a URL (ex: `https://seu-backend.railway.app`)
2. No Vercel, adicione variável de ambiente:
   - `VITE_API_URL`: `https://seu-backend.railway.app/api`
3. Faça novo deploy do frontend

## ✅ Checklist de Deploy

- [ ] Frontend builda sem erros (`npm run build`)
- [ ] Backend builda sem erros (`npm run build`)
- [ ] Migrations do Prisma executadas no backend
- [ ] Variável `VITE_API_URL` configurada no Vercel
- [ ] CORS configurado no backend (já está configurado)
- [ ] Testar endpoints da API
- [ ] Testar aplicação frontend

## 🐛 Troubleshooting

### Frontend não conecta ao backend
- Verifique se `VITE_API_URL` está configurada corretamente
- Verifique se o backend está rodando
- Verifique CORS no backend

### Erro de build no frontend
- Verifique se todas as dependências estão instaladas
- Verifique se não há erros de TypeScript (`npm run build`)

### Erro de build no backend
- Verifique se Prisma está configurado (`npm run prisma:generate`)
- Verifique se as migrations foram executadas

### Erro de database no backend
- Verifique se `DATABASE_URL` está configurada
- Execute migrations: `npm run prisma:migrate deploy`

## 📝 Notas Importantes

- O backend usa SQLite, que é persistente no Railway/Render
- O frontend usa Vite, que já está configurado para produção
- CORS já está configurado no backend para aceitar requisições de qualquer origem
- O logo deve estar em `frontend/public/logo.jpg`

