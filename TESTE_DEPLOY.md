# ✅ Checklist de Teste para Deploy

## 🔍 Testes Locais (Antes do Deploy)

### Frontend
- [ ] `cd frontend && npm install` - Instala dependências
- [ ] `cd frontend && npm run build` - Build sem erros
- [ ] `cd frontend && npm run dev` - Servidor inicia na porta 3000
- [ ] Acessar http://localhost:3000 - Página carrega
- [ ] Verificar console do navegador - Sem erros críticos

### Backend
- [ ] `cd backend && npm install` - Instala dependências
- [ ] `cd backend && npm run prisma:generate` - Gera Prisma Client
- [ ] `cd backend && npm run prisma:migrate` - Executa migrations
- [ ] `cd backend && npm run build` - Build sem erros
- [ ] `cd backend && npm start` - Servidor inicia na porta 3001
- [ ] Acessar http://localhost:3001/api/health - Retorna `{"status":"ok"}`

### Funcionalidades
- [ ] Criar cliente - Funciona
- [ ] Criar checklist - Funciona
- [ ] Criar visita - Funciona
- [ ] Visualizar dashboard - Funciona
- [ ] Exportar PDF de checklist vazio - Funciona
- [ ] Exportar PDF de checklist preenchido - Funciona
- [ ] Filtros de visitas - Funcionam
- [ ] Formatação de datas - Mostra data correta (sem problema de timezone)

## 🚀 Testes de Deploy

### Frontend (Vercel)
- [ ] Build no Vercel completa sem erros
- [ ] Site acessível após deploy
- [ ] Variável `VITE_API_URL` configurada corretamente
- [ ] Conexão com backend funciona

### Backend (Railway/Render)
- [ ] Build completa sem erros
- [ ] Migrations executadas automaticamente
- [ ] API acessível (testar `/api/health`)
- [ ] CORS configurado corretamente
- [ ] Banco de dados criado e funcionando

### Integração
- [ ] Frontend consegue fazer requisições ao backend
- [ ] Criar cliente funciona
- [ ] Criar checklist funciona
- [ ] Criar visita funciona
- [ ] Dashboard carrega dados corretamente
- [ ] Exportação de PDF funciona

## 🐛 Problemas Comuns

### Frontend não conecta ao backend
- Verificar `VITE_API_URL` no Vercel
- Verificar se backend está rodando
- Verificar CORS no backend

### Erro 404 no backend
- Verificar se rotas estão corretas (`/api/...`)
- Verificar se backend está rodando

### Erro de database
- Verificar se migrations foram executadas
- Verificar `DATABASE_URL` no backend

### Datas incorretas
- Já corrigido: usar apenas parte da data (YYYY-MM-DD)
- Verificar se backend retorna ISO string

## 📝 Notas

- Todas as correções de data foram aplicadas
- Exportação de PDF implementada
- Tour guiado implementado
- Layout responsivo implementado
- Cores MAXPREMIER aplicadas

