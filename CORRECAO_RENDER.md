# 🔧 Correção do Erro no Render

## ❌ Erro Encontrado

```
npm error Missing script: "prisma:generate"
```

## 🔍 Causa

O Render estava executando o comando na raiz do projeto, mas o script `prisma:generate` está no `backend/package.json`.

## ✅ Solução

### Opção 1: Configurar Root Directory no Render (Recomendado)

1. No painel do Render, vá em **Settings**
2. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run prisma:generate && npm run build`
   - **Start Command**: `npm run prisma:migrate deploy && npm start`

### Opção 2: Usar Comandos com `cd backend`

Se o Root Directory não funcionar, use comandos completos:

1. No painel do Render, vá em **Settings**
2. Configure:
   - **Root Directory**: deixe vazio (raiz do projeto)
   - **Build Command**: `cd backend && npm install && npm run prisma:generate && npm run build`
   - **Start Command**: `cd backend && npm run prisma:migrate deploy && npm start`

### Opção 3: Usar render.yaml (Automático)

O arquivo `render.yaml` já foi criado na raiz do projeto. O Render detecta automaticamente.

1. No painel do Render, certifique-se de que:
   - **Root Directory**: deixe vazio (raiz do projeto)
   - O Render vai usar o `render.yaml` automaticamente

## 📝 Comandos Corretos

### Build Command
```bash
cd backend && npm install && npm run prisma:generate && npm run build
```

### Start Command
```bash
cd backend && npm run prisma:migrate deploy && npm start
```

## ✅ Após Corrigir

1. Salve as configurações no Render
2. O Render vai fazer um novo deploy automaticamente
3. Verifique os logs para confirmar que está funcionando

## 🐛 Se Ainda Der Erro

Verifique se:
- [ ] O Root Directory está configurado corretamente
- [ ] Os comandos estão usando `cd backend &&` antes de cada comando npm
- [ ] O arquivo `backend/package.json` existe e tem os scripts corretos
- [ ] O arquivo `backend/prisma/schema.prisma` existe

