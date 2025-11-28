import React from 'react'
import { Step } from 'react-joyride'

// Tour completo seguindo o fluxo: Cliente → Checklist → Visita
export const completeTourSteps: (Step & { navigateTo?: string })[] = [
  // ========== INTRODUÇÃO ==========
  {
    target: 'body',
    content: (
      <div>
        <h3 className="font-bold text-lg mb-2">Bem-vindo ao MAXPREMIER! 👋</h3>
        <p className="mb-2">Este tour vai te guiar pelo processo completo de uso do sistema.</p>
        <p className="text-sm text-gray-600">Vamos começar pelo cadastro de um cliente e seguir todo o fluxo até registrar uma visita.</p>
      </div>
    ),
    placement: 'center',
    disableBeacon: true,
  },
  
  // ========== PÁGINA DE CLIENTES ==========
  {
    target: '[data-tour="clients-page"]',
    content: (
      <div>
        <h3 className="font-bold text-lg mb-2">Passo 1: Cadastrar Cliente 👥</h3>
        <p>Primeiro, vamos cadastrar um cliente. Esta é a página de gerenciamento de clientes.</p>
      </div>
    ),
    placement: 'bottom',
    navigateTo: '/clients',
  },
  {
    target: '[data-tour="create-client"]',
    content: (
      <div>
        <h3 className="font-bold text-lg mb-2">Criar Novo Cliente</h3>
        <p>Clique neste botão para abrir o formulário de cadastro.</p>
        <p className="text-sm text-gray-600 mt-2">Você precisará informar o nome do cliente e, opcionalmente, contato e endereço.</p>
      </div>
    ),
    placement: 'bottom',
  },
  {
    target: '[data-tour="client-form-modal"]',
    content: (
      <div>
        <h3 className="font-bold text-lg mb-2">Formulário de Cliente</h3>
        <p>Preencha os dados do cliente:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li><strong>Nome:</strong> Obrigatório</li>
          <li><strong>Contato:</strong> Telefone ou email (opcional)</li>
          <li><strong>Endereço:</strong> Endereço completo (opcional)</li>
        </ul>
        <p className="text-sm text-gray-600 mt-2">💡 Dica: Após criar o cliente, você poderá usá-lo ao registrar visitas.</p>
      </div>
    ),
    placement: 'left',
  },
  
  // ========== PÁGINA DE CHECKLISTS ==========
  {
    target: '[data-tour="sidebar"]',
    content: (
      <div>
        <h3 className="font-bold text-lg mb-2">Passo 2: Criar Checklist 📋</h3>
        <p>Agora vamos criar um template de checklist. Clique em "Checklists" no menu lateral.</p>
      </div>
    ),
    placement: 'right',
    navigateTo: '/checklists',
  },
  {
    target: '[data-tour="checklists-page"]',
    content: (
      <div>
        <h3 className="font-bold text-lg mb-2">Página de Checklists</h3>
        <p>Esta é a página onde você cria e gerencia os templates de checklists.</p>
        <p className="text-sm text-gray-600 mt-2">Os checklists são usados para padronizar as inspeções realizadas nas visitas.</p>
      </div>
    ),
    placement: 'bottom',
  },
  {
    target: '[data-tour="create-checklist"]',
    content: (
      <div>
        <h3 className="font-bold text-lg mb-2">Criar Novo Checklist</h3>
        <p>Clique neste botão para criar um novo template de checklist.</p>
      </div>
    ),
    placement: 'bottom',
  },
  {
    target: '[data-tour="checklist-form-modal"]',
    content: (
      <div>
        <h3 className="font-bold text-lg mb-2">Formulário de Checklist</h3>
        <p>Preencha os dados do checklist:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li><strong>Nome:</strong> Ex: "Inspeção Diária"</li>
          <li><strong>Descrição:</strong> Explique o propósito (opcional)</li>
          <li><strong>Locais de Inspeção:</strong> Adicione os locais que serão vistoriados</li>
        </ul>
        <p className="text-sm text-gray-600 mt-2">💡 Dica: Use o dropdown para adicionar locais pré-definidos ou crie locais personalizados.</p>
      </div>
    ),
    placement: 'left',
  },
  
  // ========== PÁGINA DE VISITAS ==========
  {
    target: '[data-tour="sidebar"]',
    content: (
      <div>
        <h3 className="font-bold text-lg mb-2">Passo 3: Registrar Visita 📅</h3>
        <p>Agora vamos registrar uma visita usando o cliente e checklist que criamos.</p>
        <p className="text-sm text-gray-600 mt-2">Clique em "Visitas" no menu lateral.</p>
      </div>
    ),
    placement: 'right',
    navigateTo: '/visits',
  },
  {
    target: '[data-tour="visits-page"]',
    content: (
      <div>
        <h3 className="font-bold text-lg mb-2">Página de Visitas</h3>
        <p>Esta é a página onde você registra todas as visitas e inspeções realizadas.</p>
        <p className="text-sm text-gray-600 mt-2">Aqui você pode ver todas as visitas registradas e criar novas.</p>
      </div>
    ),
    placement: 'bottom',
  },
  {
    target: '[data-tour="create-visit"]',
    content: (
      <div>
        <h3 className="font-bold text-lg mb-2">Nova Visita</h3>
        <p>Clique neste botão para registrar uma nova visita.</p>
        <p className="text-sm text-gray-600 mt-2">Você precisará selecionar o cliente e checklist que criamos anteriormente.</p>
      </div>
    ),
    placement: 'bottom',
  },
  {
    target: '[data-tour="visit-form-modal"]',
    content: (
      <div>
        <h3 className="font-bold text-lg mb-2">Formulário de Visita</h3>
        <p>Preencha os dados da visita:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li><strong>Cliente:</strong> Selecione o cliente cadastrado</li>
          <li><strong>Supervisor:</strong> Escolha da lista ou preencha manualmente</li>
          <li><strong>Checklist:</strong> Selecione o template criado</li>
          <li><strong>Data:</strong> Data da visita</li>
          <li><strong>Setor, Turno, Colaborador:</strong> Informações operacionais</li>
          <li><strong>Preenchimento:</strong> Preencha cada local do checklist</li>
        </ul>
        <p className="text-sm text-gray-600 mt-2">💡 Dica: Após preencher todos os campos, a visita será salva automaticamente.</p>
      </div>
    ),
    placement: 'left',
  },
  
  // ========== DASHBOARD ==========
  {
    target: '[data-tour="sidebar"]',
    content: (
      <div>
        <h3 className="font-bold text-lg mb-2">Visualizar Resultados 📊</h3>
        <p>Após registrar visitas, você pode visualizar estatísticas e relatórios no Dashboard.</p>
        <p className="text-sm text-gray-600 mt-2">Clique em "Dashboard" no menu lateral.</p>
      </div>
    ),
    placement: 'right',
    navigateTo: '/',
  },
  {
    target: '[data-tour="dashboard"]',
    content: (
      <div>
        <h3 className="font-bold text-lg mb-2">Dashboard</h3>
        <p>No Dashboard você encontra:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>📊 Estatísticas em tempo real</li>
          <li>📈 Gráficos de visitas</li>
          <li>📋 Visitas recentes</li>
          <li>📅 Análises mensais</li>
        </ul>
      </div>
    ),
    placement: 'bottom',
  },
  {
    target: '[data-tour="stats-cards"]',
    content: (
      <div>
        <h3 className="font-bold text-lg mb-2">Estatísticas</h3>
        <p>Aqui você vê em tempo real:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Visitas do mês atual</li>
          <li>Total de visitas</li>
          <li>Checklists ativos</li>
          <li>Total de clientes</li>
        </ul>
      </div>
    ),
    placement: 'top',
  },
  
  // ========== CONCLUSÃO ==========
  {
    target: 'body',
    content: (
      <div>
        <h3 className="font-bold text-lg mb-2">Tour Concluído! 🎉</h3>
        <p className="mb-2">Você aprendeu o fluxo completo:</p>
        <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
          <li>✅ Cadastrar Cliente</li>
          <li>✅ Criar Checklist</li>
          <li>✅ Registrar Visita</li>
          <li>✅ Visualizar Dashboard</li>
        </ol>
        <p className="text-sm text-gray-600 mt-3">Agora você está pronto para usar o sistema! Se precisar, pode reiniciar este tour a qualquer momento.</p>
      </div>
    ),
    placement: 'center',
  },
]

// Passos individuais por página (mantidos para compatibilidade)
export const dashboardSteps: Step[] = []
export const checklistsSteps: Step[] = []
export const visitsSteps: Step[] = []
export const clientsSteps: Step[] = []
