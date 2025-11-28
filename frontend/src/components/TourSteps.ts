import { Step } from 'react-joyride'

// Passos do tour para diferentes páginas
export const dashboardSteps: Step[] = [
  {
    target: '[data-tour="dashboard"]',
    content: (
      <div>
        <h3 className="font-bold text-lg mb-2">Bem-vindo ao MAXPREMIER! 👋</h3>
        <p>Este é o Dashboard, onde você pode ver todas as estatísticas e informações importantes do sistema.</p>
      </div>
    ),
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '[data-tour="sidebar"]',
    content: (
      <div>
        <h3 className="font-bold text-lg mb-2">Menu de Navegação</h3>
        <p>Use este menu para navegar entre as diferentes seções do sistema:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li><strong>Dashboard:</strong> Visão geral</li>
          <li><strong>Checklists:</strong> Gerenciar templates</li>
          <li><strong>Visitas:</strong> Registrar inspeções</li>
          <li><strong>Clientes:</strong> Gerenciar clientes</li>
        </ul>
      </div>
    ),
    placement: 'right',
  },
  {
    target: '[data-tour="stats-cards"]',
    content: (
      <div>
        <h3 className="font-bold text-lg mb-2">Estatísticas em Tempo Real</h3>
        <p>Aqui você vê em tempo real:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>📊 Visitas do mês atual</li>
          <li>📈 Total de visitas</li>
          <li>📋 Checklists ativos</li>
          <li>👥 Total de clientes</li>
        </ul>
      </div>
    ),
    placement: 'top',
  },
  {
    target: '[data-tour="charts"]',
    content: (
      <div>
        <h3 className="font-bold text-lg mb-2">Gráficos e Análises</h3>
        <p>Visualize dados importantes através de gráficos interativos:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>📅 Visitas dos últimos 6 meses</li>
          <li>🏢 Visitas por setor</li>
          <li>🕐 Visitas por turno</li>
        </ul>
      </div>
    ),
    placement: 'top',
  },
]

export const checklistsSteps: Step[] = [
  {
    target: '[data-tour="checklists-page"]',
    content: (
      <div>
        <h3 className="font-bold text-lg mb-2">Gerenciar Checklists 📋</h3>
        <p>Aqui você cria e gerencia os templates de checklists que serão usados nas visitas.</p>
      </div>
    ),
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '[data-tour="create-checklist"]',
    content: (
      <div>
        <h3 className="font-bold text-lg mb-2">Criar Checklist</h3>
        <p>Clique neste botão para criar um novo template de checklist. Você pode adicionar locais de inspeção personalizados.</p>
      </div>
    ),
    placement: 'bottom',
  },
  {
    target: '[data-tour="checklist-card"]',
    content: (
      <div>
        <h3 className="font-bold text-lg mb-2">Cards de Checklist</h3>
        <p>Cada card representa um checklist. Você pode:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>👁️ Visualizar detalhes (clique no card)</li>
          <li>📄 Exportar PDF</li>
          <li>✏️ Editar</li>
          <li>🗑️ Deletar</li>
        </ul>
      </div>
    ),
    placement: 'top',
  },
]

export const visitsSteps: Step[] = [
  {
    target: '[data-tour="visits-page"]',
    content: (
      <div>
        <h3 className="font-bold text-lg mb-2">Registrar Visitas 📅</h3>
        <p>Esta é a página onde você registra todas as visitas e inspeções realizadas.</p>
      </div>
    ),
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '[data-tour="create-visit"]',
    content: (
      <div>
        <h3 className="font-bold text-lg mb-2">Nova Visita</h3>
        <p>Clique aqui para registrar uma nova visita. Você precisará:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Selecionar o cliente</li>
          <li>Escolher o supervisor</li>
          <li>Selecionar o checklist</li>
          <li>Preencher os dados do checklist</li>
        </ul>
      </div>
    ),
    placement: 'bottom',
  },
  {
    target: '[data-tour="visit-filters"]',
    content: (
      <div>
        <h3 className="font-bold text-lg mb-2">Filtros</h3>
        <p>Use os filtros para encontrar visitas específicas por:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Mês e ano</li>
          <li>Cliente</li>
          <li>Setor</li>
          <li>Turno</li>
        </ul>
      </div>
    ),
    placement: 'bottom',
  },
]

export const clientsSteps: Step[] = [
  {
    target: '[data-tour="clients-page"]',
    content: (
      <div>
        <h3 className="font-bold text-lg mb-2">Gerenciar Clientes 👥</h3>
        <p>Aqui você cadastra e gerencia todos os clientes da MAXPREMIER.</p>
      </div>
    ),
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '[data-tour="create-client"]',
    content: (
      <div>
        <h3 className="font-bold text-lg mb-2">Novo Cliente</h3>
        <p>Clique aqui para adicionar um novo cliente ao sistema. Você precisará informar:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Nome do cliente</li>
          <li>Contato (opcional)</li>
          <li>Endereço (opcional)</li>
        </ul>
      </div>
    ),
    placement: 'bottom',
  },
]

