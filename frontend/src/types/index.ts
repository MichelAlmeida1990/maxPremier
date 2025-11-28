export interface Client {
  id: string
  name: string
  contact?: string
  address?: string
  createdAt: string
  updatedAt: string
}

export interface ChecklistTemplate {
  id: string
  name: string
  description?: string
  locations: string // JSON string
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
  updatedAt: string
}

export interface Visit {
  id: string
  clientId: string
  supervisorId: string
  templateId?: string
  date: string
  checklistData: string // JSON string
  clientSignature?: string
  status: string
  notes?: string
  turno?: string
  nomeColaborador?: string
  setor?: string
  nomeSupervisorManual?: string
  createdAt: string
  updatedAt: string
  client?: Client
  supervisor?: User
  template?: ChecklistTemplate
}

