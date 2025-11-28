# Changelog - MAXPREMIER

## [1.0.0] - 2024-11-28

### ✨ Funcionalidades Implementadas

- **Gestão de Clientes**
  - CRUD completo de clientes
  - Busca e filtros
  - Layout responsivo

- **Templates de Checklist**
  - Criação e edição de templates
  - Editor com drag-and-drop
  - Dropdown com locais pré-definidos
  - Exportação para PDF (checklist vazio)

- **Registro de Visitas**
  - Registro completo de visitas
  - Preenchimento de checklist
  - Campos adicionais: setor, turno, colaborador
  - Supervisor manual ou da lista
  - Filtros avançados (data, cliente, setor, turno, status)
  - Exportação para PDF (checklist preenchido)

- **Dashboard**
  - Estatísticas em tempo real
  - Gráficos de visitas (últimos 6 meses)
  - Gráficos por setor e turno
  - Lista de visitas recentes
  - Botão de atualização manual

- **Exportação PDF**
  - Checklist vazio (template)
  - Checklist preenchido (visita)
  - Formatação profissional com logo MAXPREMIER

- **Tour Guiado**
  - Tutorial interativo completo
  - Navegação automática entre páginas
  - Opcional (botão flutuante)

- **Layout e UX**
  - Design responsivo (mobile e desktop)
  - Menu hamburger para mobile
  - Cores MAXPREMIER aplicadas
  - Animações e transições suaves
  - Gradientes e sombras modernas

### 🐛 Correções

- **Problema de Timezone nas Datas**
  - Corrigido problema de datas mostrando dia anterior
  - Formatação consistente em todo o sistema
  - Parsing correto de datas ISO

- **Sincronização do Dashboard**
  - Dados do dashboard sincronizados com backend
  - Visitas aparecem corretamente nos gráficos
  - Cálculo correto dos últimos 6 meses

- **Modal**
  - Modal não fecha mais ao clicar fora
  - Fecha apenas pelo botão X
  - Melhor controle de interação

### 🔧 Melhorias Técnicas

- Tratamento de erros melhorado
- Logs de debug adicionados
- Validação de dados
- TypeScript strict mode
- Código organizado e documentado

### 📦 Dependências

- React 18.2.0
- TypeScript 5.2.2
- Vite 5.0.8
- Tailwind CSS 3.3.6
- Prisma 5.7.1
- Express 4.18.2
- jsPDF 2.5.1
- Recharts 2.10.3
- react-joyride 2.9.3

### 🚀 Deploy

- Configuração para Vercel (frontend)
- Configuração para Railway/Render (backend)
- Documentação de deploy completa

