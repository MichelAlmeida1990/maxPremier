# ⚡ Deploy Rápido na Vercel

## 🚀 Deploy em 5 minutos

### **1. Deploy do Frontend (Vercel)**

1. Acesse: https://vercel.com/new
2. Conecte o repositório: `MichelAlmeida1990/maxPremier`
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Clique em **Deploy**

### **2. Deploy do Backend (Railway)**

1. Acesse: https://railway.app/new
2. Conecte GitHub e selecione `maxPremier`
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build && npm run prisma:generate && npm run prisma:migrate deploy`
   - **Start Command**: `npm start`
4. Copie a URL (ex: `https://maxpremier-backend.railway.app`)

### **3. Configurar Variável de Ambiente**

Na Vercel:
- **Settings → Environment Variables**
- Adicione: `VITE_API_URL` = URL do Railway + `/api`
- Exemplo: `https://maxpremier-backend.railway.app/api`

### **4. Redeploy**

Na Vercel, vá em **Deployments → Redeploy**

---

## ✅ Pronto!

Seu app estará em: `https://maxpremier.vercel.app`

