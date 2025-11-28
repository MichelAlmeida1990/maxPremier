# 🔧 Solução: Erro de Conexão com Backend

## 🐛 Problema

Erro `ECONNREFUSED` ao tentar acessar `/api/clients`:
```
http proxy error: /api/clients
AggregateError [ECONNREFUSED]
```

## ✅ Solução

O backend não está rodando. Siga estes passos:

### **1. Iniciar o Backend**

Abra um terminal e execute:

```bash
cd backend
npm run dev
```

Você deve ver:
```
🚀 Servidor rodando na porta 3001
📍 http://localhost:3001
```

### **2. Verificar se está funcionando**

Em outro terminal, teste:

```bash
curl http://localhost:3001/api/health
```

Deve retornar:
```json
{"status":"ok","message":"MAXPREMIER API está funcionando!"}
```

### **3. Iniciar o Frontend**

Em outro terminal (com o backend rodando):

```bash
cd frontend
npm run dev
```

### **4. Acessar a aplicação**

Abra: http://localhost:3000

---

## 🚀 Iniciar Tudo de Uma Vez

Na raiz do projeto:

```bash
npm run dev
```

Isso inicia backend e frontend simultaneamente.

---

## ⚠️ Se o erro persistir

1. **Verifique se a porta 3001 está livre:**
   ```bash
   netstat -ano | findstr :3001
   ```

2. **Verifique se o banco de dados existe:**
   ```bash
   cd backend
   npm run prisma:generate
   npm run prisma:migrate
   ```

3. **Verifique o arquivo `.env` no backend:**
   ```env
   DATABASE_URL="file:./dev.db"
   PORT=3001
   ```

---

**Status:** Backend precisa estar rodando para o frontend funcionar!

