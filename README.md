# MAXPREMIER - Sistema de Gestão de Documentos

Sistema web completo para gestão de documentos de inspeção/supervisão da MAXPREMIER.

## ✨ Funcionalidades

- ✅ **Gestão de Clientes** - Cadastro e gerenciamento de clientes
- ✅ **Templates de Checklist** - Criação e edição de checklists personalizados
- ✅ **Registro de Visitas** - Registro completo de visitas com preenchimento de checklist
- ✅ **Dashboard** - Estatísticas e gráficos em tempo real
- ✅ **Exportação PDF** - Exportação de checklists vazios e preenchidos
- ✅ **Tour Guiado** - Tutorial interativo para novos usuários
- ✅ **Layout Responsivo** - Funciona perfeitamente em mobile e desktop
- ✅ **Filtros Avançados** - Filtros por data, cliente, setor, turno, etc.

## 🚀 Tecnologias

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Banco de Dados**: SQLite (Prisma ORM)
- **PDF**: jsPDF para geração de documentos
- **Gráficos**: Recharts para visualizações

## 📦 Instalação

### 1. Instalar dependências

```bash
npm run install:all
```

### 2. Configurar banco de dados

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

### 3. Iniciar desenvolvimento

```bash
# Na raiz do projeto
npm run dev
```

Isso iniciará:
- Frontend em http://localhost:3000
- Backend em http://localhost:3001

## 🚀 Deploy

### Frontend (Vercel)
1. Conecte o repositório no Vercel
2. Configure `Root Directory`: `frontend`
3. Adicione variável `VITE_API_URL` com a URL do backend

### Backend (Railway/Render)
1. Conecte o repositório
2. Configure `Root Directory`: `backend`
3. Build: `npm install && npm run prisma:generate && npm run build`
4. Start: `npm run prisma:migrate deploy && npm start`

**📖 Guia completo de deploy:** Veja `DEPLOY.md`

## 📁 Estrutura do Projeto

```
maxPremier/
├── frontend/          # Aplicação React
│   ├── src/
│   │   ├── components/  # Componentes reutilizáveis
│   │   ├── pages/       # Páginas da aplicação
│   │   ├── services/    # Serviços de API
│   │   ├── utils/       # Utilitários (PDF, etc)
│   │   └── types/       # Tipos TypeScript
│   ├── public/          # Arquivos estáticos (logo.jpg)
│   └── package.json
├── backend/           # API Express
│   ├── src/
│   │   ├── routes/      # Rotas da API
│   │   └── index.ts     # Entrada da aplicação
│   ├── prisma/
│   │   └── schema.prisma # Schema do banco
│   └── package.json
└── package.json       # Workspace root
```

## 🎨 Cores MAXPREMIER

- Azul Escuro: `#031f5f`
- Azul Vívido: `#00afee`
- Rosa Neon: `#ca00ca`
- Marrom: `#c2af00`
- Verde Amarelado: `#ccff00` (botões principais)
- Preto: `#000000`

## ✅ Status do Projeto

- ✅ Todas as funcionalidades principais implementadas
- ✅ Correção de problemas de timezone nas datas
- ✅ Exportação de PDF implementada
- ✅ Tour guiado implementado
- ✅ Layout responsivo completo
- ✅ Pronto para deploy

## 📝 Documentação Adicional

- `DEPLOY.md` - Guia completo de deploy
- `TESTE_DEPLOY.md` - Checklist de testes
- `ROADMAP.md` - Plano de desenvolvimento

