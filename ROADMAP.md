# 🗺️ Roadmap - Sistema de Gestão de Documentos MAXPREMIER

## 📋 Visão Geral do Projeto

Sistema web para gestão de documentos de inspeção/supervisão, permitindo:
- ✅ Criação de checklists personalizados
- ✅ Exportação de documentos em branco (PDF) para preenchimento manual
- ✅ Armazenamento e controle mensal de preenchimentos
- ✅ Histórico de visitas e assinaturas

---

## 🎯 Funcionalidades Principais

### 1. **Gestão de Checklists**
   - Criar templates de checklist personalizados
   - Definir locais a serem vistoriados (Banheiro, Salas, Recepção, etc.)
   - Campos administrativos: Nome do cliente, Supervisor, Data
   - Campo para assinatura do cliente

### 2. **Exportação de Documentos**
   - Exportar checklist em branco em PDF
   - Layout profissional com logo da empresa
   - Formato adequado para impressão e preenchimento manual

### 3. **Controle e Armazenamento**
   - Salvar checklists preenchidos digitalmente
   - Visualização mensal de todas as visitas
   - Filtros por cliente, supervisor, período
   - Histórico completo de inspeções

### 4. **Dashboard e Relatórios**
   - Visão geral mensal de atividades
   - Estatísticas de visitas por cliente
   - Gráficos e métricas de desempenho

---

## 🛠️ Stack Tecnológica (100% Gratuita)

### **Frontend**
- **React** + **TypeScript** - Framework moderno e gratuito
- **Tailwind CSS** - Estilização rápida e responsiva
- **React Router** - Navegação entre páginas
- **React Hook Form** - Formulários eficientes
- **jsPDF** ou **react-pdf** - Geração de PDFs
- **Recharts** - Gráficos e visualizações

### **Backend**
- **Node.js** + **Express** - Servidor gratuito e robusto
- **TypeScript** - Type safety
- **SQLite** (via **Prisma**) - Banco de dados local, sem necessidade de servidor separado
  - Alternativa: **PostgreSQL** (gratuito no Heroku/Railway/Supabase)
- **Prisma ORM** - Gerenciamento de banco de dados moderno

### **Armazenamento de Arquivos**
- **Local Storage** (para desenvolvimento)
- **Cloudinary** (plano gratuito) - Para imagens/PDFs se necessário
- Ou armazenamento local no servidor

### **Deploy Gratuito**
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Backend**: Railway, Render, Fly.io
- **Banco de Dados**: Supabase (PostgreSQL gratuito), Railway (SQLite/PostgreSQL)

---

## 📐 Arquitetura do Sistema

```
┌─────────────────┐
│   Frontend      │
│   (React)       │
│   Porta: 3000   │
└────────┬────────┘
         │
         │ HTTP/REST API
         │
┌────────▼────────┐
│   Backend       │
│   (Express)     │
│   Porta: 3001   │
└────────┬────────┘
         │
         │ Prisma ORM
         │
┌────────▼────────┐
│   SQLite DB     │
│   (local.db)    │
└─────────────────┘
```

---

## 🎨 Design System

### Cores (baseadas no site MAXPREMIER)
- **Azul Escuro**: `#031f5f` - Headers, textos principais
- **Azul Vívido**: `#00afee` - Links, destaques, botões secundários
- **Rosa Neon**: `#ca00ca` - Acentos, badges
- **Marrom**: `#c2af00` - Acentos alternativos
- **Verde Amarelado**: `#ccff00` - Botões principais, CTAs
- **Preto**: `#000000` - Backgrounds, textos
- **Branco**: `#ffffff` - Backgrounds claros, textos sobre escuro

### Componentes
- Cards com sombras suaves
- Botões com hover effects
- Formulários com validação visual
- Tabelas responsivas
- Modais para confirmações

---

## 📅 Fases de Desenvolvimento

### **Fase 1: Setup e Estrutura Base** (Semana 1)
- [ ] Configurar projeto React + TypeScript
- [ ] Configurar backend Express + TypeScript
- [ ] Configurar Prisma com SQLite
- [ ] Setup de rotas básicas
- [ ] Estrutura de pastas organizada

### **Fase 2: Autenticação e Usuários** (Semana 1-2)
- [ ] Sistema de login simples (ou sem auth inicial)
- [ ] CRUD de usuários (supervisores)
- [ ] Gerenciamento de clientes

### **Fase 3: Gestão de Checklists** (Semana 2-3)
- [ ] CRUD de templates de checklist
- [ ] Editor de checklist (adicionar/remover campos)
- [ ] Preview do checklist
- [ ] Validação de formulários

### **Fase 4: Exportação PDF** (Semana 3)
- [ ] Integração com jsPDF ou react-pdf
- [ ] Template PDF com logo
- [ ] Geração de PDF em branco
- [ ] Download do PDF

### **Fase 5: Armazenamento de Preenchimentos** (Semana 3-4)
- [ ] Formulário de preenchimento digital
- [ ] Upload de PDF preenchido (opcional)
- [ ] Salvar dados no banco
- [ ] Visualização de checklist preenchido

### **Fase 6: Dashboard e Relatórios** (Semana 4-5)
- [ ] Dashboard com estatísticas mensais
- [ ] Filtros por período, cliente, supervisor
- [ ] Gráficos de visitas
- [ ] Exportação de relatórios

### **Fase 7: Refinamentos e Deploy** (Semana 5-6)
- [ ] Ajustes de UI/UX
- [ ] Testes básicos
- [ ] Deploy em plataformas gratuitas
- [ ] Documentação

---

## 🗄️ Estrutura do Banco de Dados

### **Tabelas Principais**

```sql
-- Usuários/Supervisores
Users {
  id, name, email, role, createdAt
}

-- Clientes
Clients {
  id, name, contact, address, createdAt
}

-- Templates de Checklist
ChecklistTemplates {
  id, name, description, locations[], createdAt, updatedAt
}

-- Visitas/Preenchimentos
Visits {
  id, clientId, supervisorId, date, 
  checklistData (JSON), clientSignature, 
  status, createdAt, updatedAt
}

-- Locais de Inspeção (tabela auxiliar)
InspectionLocations {
  id, templateId, name, order
}
```

---

## 🚀 Funcionalidades Futuras (Opcionais)

- 📱 App mobile (React Native)
- 🔔 Notificações de visitas pendentes
- 📊 Relatórios avançados com IA
- 🔐 Autenticação completa com JWT
- 📎 Upload de fotos durante inspeção
- 🌐 Multi-idioma
- 📧 Envio de relatórios por email

---

## 💰 Custos

**Total: R$ 0,00** (100% gratuito)

- Desenvolvimento: Gratuito
- Hospedagem Frontend: Gratuito (Vercel/Netlify)
- Hospedagem Backend: Gratuito (Railway/Render)
- Banco de Dados: Gratuito (SQLite local ou PostgreSQL no Supabase)
- Domínio: Opcional (pode usar subdomínio gratuito)

---

## 📝 Próximos Passos

1. **Aprovar este roadmap**
2. **Iniciar Fase 1** - Setup do projeto
3. **Definir prioridades** - Quais funcionalidades são mais urgentes?
4. **Testar MVP** - Versão mínima funcional primeiro

---

## ❓ Dúvidas para Definir

- [ ] Precisa de autenticação/login ou pode ser acesso direto?
- [ ] Quantos usuários simultâneos esperados?
- [ ] Precisa de backup automático dos dados?
- [ ] Preferência por SQLite local ou PostgreSQL na nuvem?
- [ ] Precisa de upload de imagens/fotos nas inspeções?

---

**Status**: 📋 Aguardando aprovação para iniciar desenvolvimento

