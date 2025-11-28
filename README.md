# MAXPREMIER - Sistema de Gestão de Documentos

Sistema web para gestão de documentos de inspeção/supervisão da MAXPREMIER.

## 🚀 Tecnologias

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Banco de Dados**: SQLite (Prisma ORM)

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

## 📁 Estrutura do Projeto

```
maxPremier/
├── frontend/          # Aplicação React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   └── package.json
├── backend/           # API Express
│   ├── src/
│   │   └── index.ts
│   ├── prisma/
│   │   └── schema.prisma
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

## 📝 Próximos Passos

Ver o arquivo `ROADMAP.md` para o plano completo de desenvolvimento.

