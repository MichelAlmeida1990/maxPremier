# 🚀 Guia de Deploy na Vercel

## 📋 Pré-requisitos

1. Conta na Vercel (gratuita): https://vercel.com
2. Conta no Railway ou Render para o backend (gratuito)
3. Projeto no GitHub

---

## 🔧 Passo 1: Deploy do Backend (Railway ou Render)

### **Opção A: Railway (Recomendado)**

1. Acesse: https://railway.app
2. Conecte sua conta GitHub
3. Clique em "New Project"
4. Selecione "Deploy from GitHub repo"
5. Escolha o repositório `maxPremier`
6. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build && npm run prisma:generate && npm run prisma:migrate deploy`
   - **Start Command**: `npm start`
7. Adicione variável de ambiente:
   - `DATABASE_URL`: SQLite (será criado automaticamente) ou PostgreSQL
8. Copie a URL do backend (ex: `https://seu-backend.railway.app`)

### **Opção B: Render**

1. Acesse: https://render.com
2. Conecte sua conta GitHub
3. Clique em "New Web Service"
4. Selecione o repositório `maxPremier`
5. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build && npm run prisma:generate && npm run prisma:migrate deploy`
   - **Start Command**: `npm start`
6. Adicione variável de ambiente:
   - `DATABASE_URL`: PostgreSQL (Render fornece)
7. Copie a URL do backend

---

## 🌐 Passo 2: Deploy do Frontend na Vercel

### **Método 1: Via Dashboard da Vercel (Recomendado)**

1. Acesse: https://vercel.com
2. Clique em "Add New Project"
3. Conecte seu repositório GitHub `maxPremier`
4. Configure o projeto:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Adicione variável de ambiente:
   - **Nome**: `VITE_API_URL`
   - **Valor**: URL do seu backend (ex: `https://seu-backend.railway.app/api`)
6. Clique em "Deploy"

### **Método 2: Via CLI**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy
cd frontend
vercel

# Seguir as instruções:
# - Link to existing project? No
# - Project name: maxpremier
# - Directory: ./
# - Override settings? No
```

---

## ⚙️ Configuração de Variáveis de Ambiente

### **Frontend (Vercel)**

No dashboard da Vercel, vá em **Settings → Environment Variables**:

```
VITE_API_URL=https://seu-backend.railway.app/api
```

### **Backend (Railway/Render)**

```
DATABASE_URL=file:./dev.db (SQLite) ou URL do PostgreSQL
PORT=3001 (ou porta fornecida pelo serviço)
```

---

## 🔄 Atualizações Futuras

Após o deploy inicial, qualquer push para a branch `main` no GitHub fará deploy automático:

```bash
git add .
git commit -m "Atualização"
git push origin main
```

A Vercel detecta automaticamente e faz o deploy.

---

## 🧪 Testando o Deploy

1. Acesse a URL fornecida pela Vercel (ex: `https://maxpremier.vercel.app`)
2. Verifique se o frontend carrega
3. Teste criar um cliente
4. Teste criar um checklist
5. Teste criar uma visita

---

## 🐛 Troubleshooting

### **Erro: API não encontrada**
- Verifique se `VITE_API_URL` está configurada corretamente
- Verifique se o backend está rodando
- Verifique CORS no backend

### **Erro: Build falha**
- Verifique se todas as dependências estão no `package.json`
- Verifique logs de build na Vercel
- Teste build local: `cd frontend && npm run build`

### **Erro: CORS**
No backend, certifique-se de ter CORS configurado:

```typescript
app.use(cors({
  origin: ['https://seu-frontend.vercel.app', 'http://localhost:3000'],
  credentials: true
}))
```

---

## 📝 Notas Importantes

- ✅ Frontend na Vercel (gratuito)
- ✅ Backend no Railway ou Render (gratuito)
- ✅ Banco de dados SQLite (Railway) ou PostgreSQL (Render)
- ✅ Deploy automático via GitHub
- ✅ HTTPS automático

---

**Status:** ✅ Pronto para deploy!

