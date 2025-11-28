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
    disableBeacon: true,
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
  
  // ========== PÁGINA DE CHECKLISTS ==========
  {
    target: '[data-tour="sidebar"]',
    content: (
      <div>
        <h3 className="font-bold text-lg mb-2">Passo 2: Criar Checklist 📋</h3>
        <p>Agora vamos criar um template de checklist. Use o menu lateral para navegar.</p>
        <p className="text-sm text-gray-600 mt-2">O tour vai te levar automaticamente para a página de Checklists.</p>
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
    target: '[data-tour="create-visit"]',
    content: (
      <div>
        <h3 className="font-bold text-lg mb-2">Nova Visita</h3>
        <p>Clique aqui para registrar uma nova visita. No formulário você precisará:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Selecionar o cliente cadastrado</li>
          <li>Escolher o supervisor (ou preencher manualmente)</li>
          <li>Selecionar o checklist criado</li>
          <li>Preencher os dados operacionais (setor, turno, colaborador)</li>
          <li>Preencher cada local do checklist</li>
        </ul>
        <p className="text-sm text-gray-600 mt-2">💡 Dica: Após preencher todos os campos, a visita será salva automaticamente.</p>
      </div>
    ),
    placement: 'bottom',
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
