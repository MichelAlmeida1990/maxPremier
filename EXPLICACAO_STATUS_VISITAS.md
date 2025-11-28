# 📋 Explicação do Sistema de Status das Visitas

## 🔍 Como Funciona Atualmente

### **Status Possíveis:**

1. **Pendente (pending)** 🟡
   - Status inicial quando uma visita é criada
   - Indica que a visita foi registrada mas ainda não foi concluída
   - **Agora:** Muda automaticamente para "Concluída" quando o checklist é preenchido

2. **Concluída (completed)** 🟢
   - Visita foi realizada e checklist foi preenchido
   - **Agora:** Muda automaticamente quando você cria uma visita com checklist preenchido
   - Pode ser alterado manualmente no modal de visualização

3. **Assinada (signed)** 🔵
   - Visita foi assinada pelo cliente
   - Status final do processo
   - Deve ser alterado manualmente quando o cliente assinar

---

## ⚙️ Mudanças Automáticas

### **Quando uma visita é criada:**
- Se o checklist **foi preenchido** → Status = **"Concluída"** ✅
- Se o checklist **não foi preenchido** → Status = **"Pendente"** ⏳

### **Lógica Implementada:**
```typescript
// Se o checklist foi preenchido, marcar como completed automaticamente
const hasChecklistData = checklistData && Object.keys(checklistData).length > 0
const initialStatus = hasChecklistData ? 'completed' : 'pending'
```

---

## ✏️ Mudança Manual de Status

### **Como Alterar:**

1. **Acesse a página de Visitas**
2. **Clique no ícone de visualizar (olho)** na visita desejada
3. **No modal de detalhes**, você verá um campo "Status da Visita"
4. **Selecione o novo status** no dropdown:
   - Pendente
   - Concluída
   - Assinada
5. **O status é atualizado automaticamente** ao selecionar

### **Quando Usar Cada Status:**

- **Pendente:** Visita criada mas ainda não realizada/preenchida
- **Concluída:** Visita realizada e checklist preenchido
- **Assinada:** Visita concluída e assinada pelo cliente

---

## 🎯 Fluxo Recomendado

```
1. Criar Visita
   ↓
   Status: Pendente (se checklist vazio) ou Concluída (se preenchido)
   ↓
2. Preencher Checklist (se ainda não preenchido)
   ↓
   Status: Concluída (automático)
   ↓
3. Cliente Assina
   ↓
   Status: Assinada (manual)
```

---

## 📊 Visualização

### **Cores dos Status:**

- 🟡 **Pendente:** Fundo amarelo claro, texto amarelo escuro
- 🟢 **Concluída:** Fundo verde claro, texto verde escuro
- 🔵 **Assinada:** Fundo azul claro, texto azul escuro

### **Onde Aparece:**

- ✅ Lista de Visitas (página Visitas)
- ✅ Dashboard (visitas recentes)
- ✅ Modal de Visualização (com opção de alterar)

---

## 🔧 Detalhes Técnicos

### **Backend:**
- Campo `status` no modelo `Visit`
- Valores aceitos: `"pending"`, `"completed"`, `"signed"`
- Valor padrão: `"pending"`
- Pode ser atualizado via PUT `/api/visits/:id`

### **Frontend:**
- Dropdown no modal de visualização
- Atualização automática via API
- Recarregamento da lista após mudança

---

**Status:** ✅ Sistema implementado e funcionando

