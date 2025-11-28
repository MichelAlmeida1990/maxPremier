# ✅ Teste do Sistema - MAXPREMIER Docs

## Status da Instalação

✅ **Dependências instaladas**
✅ **Banco de dados criado** (SQLite)
✅ **Prisma Client gerado**
✅ **Migrações aplicadas**

## Como Testar

### 1. Iniciar o Backend

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

### 2. Testar a API

Em outro terminal, teste o endpoint de health:

```bash
curl http://localhost:3001/api/health
```

Ou acesse no navegador: http://localhost:3001/api/health

Resposta esperada:
```json
{
  "status": "ok",
  "message": "MAXPREMIER API está funcionando!"
}
```

### 3. Iniciar o Frontend

Em outro terminal (com o backend ainda rodando), execute:

```bash
cd frontend
npm run dev
```

Você deve ver:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### 4. Acessar a Aplicação

Abra o navegador em: **http://localhost:3000**

Você deve ver:
- ✅ Header com logo MAXPREMIER
- ✅ Sidebar com menu de navegação
- ✅ Dashboard com cards de estatísticas
- ✅ Design com cores da empresa

## Endpoints da API Disponíveis

### Clientes
- `GET /api/clients` - Listar clientes
- `POST /api/clients` - Criar cliente
- `GET /api/clients/:id` - Buscar cliente
- `PUT /api/clients/:id` - Atualizar cliente
- `DELETE /api/clients/:id` - Deletar cliente

### Checklists
- `GET /api/checklists` - Listar templates
- `POST /api/checklists` - Criar template
- `GET /api/checklists/:id` - Buscar template
- `PUT /api/checklists/:id` - Atualizar template
- `DELETE /api/checklists/:id` - Deletar template

### Visitas
- `GET /api/visits` - Listar visitas
- `POST /api/visits` - Criar visita
- `GET /api/visits/:id` - Buscar visita
- `PUT /api/visits/:id` - Atualizar visita
- `DELETE /api/visits/:id` - Deletar visita

### Usuários
- `GET /api/users` - Listar usuários
- `POST /api/users` - Criar usuário
- `GET /api/users/:id` - Buscar usuário
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário

## Próximos Passos

Agora que o sistema está funcionando, podemos implementar:

1. **Editor de Checklist** - Criar templates personalizados
2. **Exportação PDF** - Gerar documentos em branco
3. **Formulário de Visita** - Preencher checklists digitalmente
4. **Dashboard Completo** - Gráficos e estatísticas reais
5. **Filtros e Busca** - Encontrar visitas rapidamente

## Problemas?

Se encontrar algum erro:

1. Verifique se as portas 3000 e 3001 estão livres
2. Certifique-se de que o arquivo `.env` existe em `backend/`
3. Execute `npm run prisma:generate` novamente se necessário
4. Verifique os logs no terminal para mensagens de erro

