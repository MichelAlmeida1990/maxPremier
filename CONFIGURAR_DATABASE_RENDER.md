# 🔧 Configurar DATABASE_URL no Render

## ❌ Erro Encontrado

```
Error: Environment variable not found: DATABASE_URL.
```

## 🔍 Causa

O Prisma precisa da variável `DATABASE_URL` para funcionar, mas ela não está configurada no Render.

## ✅ Solução

### Passo 1: Configurar DATABASE_URL no Render

1. No painel do Render, vá em **Environment** (ou **Environment Variables**)
2. Clique em **Add Environment Variable**
3. Adicione:
   - **Key**: `DATABASE_URL`
   - **Value**: `file:./dev.db` (para SQLite)
4. Salve

### Passo 2: Verificar Configuração

O Render deve ter:
- `DATABASE_URL` = `file:./dev.db`
- `PORT` = (deixar Render definir automaticamente)

### Passo 3: Comando de Migrate Correto

O comando `prisma migrate dev deploy` está incorreto. Deve ser `prisma migrate deploy` (sem `dev`).

## 🔧 Correção no Código

Precisamos atualizar o `package.json` do backend para usar o comando correto:

```json
{
  "scripts": {
    "prisma:migrate": "prisma migrate deploy"
  }
}
```

Ou no start command do Render, usar diretamente:
```
prisma migrate deploy && npm start
```

## 📝 Configuração Completa no Render

### Environment Variables
- `DATABASE_URL` = `file:./dev.db`
- `PORT` = (deixar vazio, Render define automaticamente)

### Build Command
```
npm install && npm run prisma:generate && npm run build
```

### Start Command
```
prisma migrate deploy && npm start
```

OU se preferir usar o script:
```
npm run prisma:migrate:deploy && npm start
```

## ⚠️ Importante

- O SQLite precisa de um caminho de arquivo persistente
- O Render pode precisar de um volume persistente para o banco
- Alternativamente, considere usar PostgreSQL (gratuito no Render)

