import express from 'express'
import prisma from '../prisma'

const router = express.Router()

// GET /api/visits - Listar todas as visitas
router.get('/', async (req, res) => {
  try {
    const { month, year, clientId } = req.query
    
    const where: any = {}
    
    if (month && year) {
      const startDate = new Date(Number(year), Number(month) - 1, 1)
      const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59)
      where.date = {
        gte: startDate,
        lte: endDate,
      }
    }
    
    if (clientId) {
      where.clientId = clientId as string
    }
    
    const visits = await prisma.visit.findMany({
      where,
      include: {
        client: true,
        supervisor: true,
        template: true,
      },
      orderBy: { date: 'desc' },
    })
    
    // Converter datas para ISO string para garantir formato consistente
    const visitsWithFormattedDates = visits.map(visit => ({
      ...visit,
      date: visit.date.toISOString(),
      createdAt: visit.createdAt.toISOString(),
      updatedAt: visit.updatedAt.toISOString(),
    }))
    
    res.json(visitsWithFormattedDates)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar visitas' })
  }
})

// GET /api/visits/:id - Buscar visita por ID
router.get('/:id', async (req, res) => {
  try {
    const visit = await prisma.visit.findUnique({
      where: { id: req.params.id },
      include: {
        client: true,
        supervisor: true,
        template: true,
      },
    })
    if (!visit) {
      return res.status(404).json({ error: 'Visita não encontrada' })
    }
    
    // Converter datas para ISO string
    const visitWithFormattedDates = {
      ...visit,
      date: visit.date.toISOString(),
      createdAt: visit.createdAt.toISOString(),
      updatedAt: visit.updatedAt.toISOString(),
    }
    
    res.json(visitWithFormattedDates)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar visita' })
  }
})

// POST /api/visits - Criar nova visita
router.post('/', async (req, res) => {
  try {
    let { clientId, supervisorId, templateId, date, checklistData, turno, nomeColaborador, setor, notes } = req.body
    
    let nomeSupervisorManual: string | undefined = undefined
    
    // Se supervisorId começar com "manual:", criar ou buscar supervisor manual
    if (supervisorId && supervisorId.startsWith('manual:')) {
      const supervisorName = supervisorId.replace('manual:', '').trim()
      nomeSupervisorManual = supervisorName
      
      // Buscar ou criar supervisor "Manual" genérico
      let manualSupervisor = await prisma.user.findFirst({
        where: {
          email: 'manual@maxpremier.com.br',
        },
      })
      
      if (!manualSupervisor) {
        manualSupervisor = await prisma.user.create({
          data: {
            name: 'Supervisor Manual',
            email: 'manual@maxpremier.com.br',
            role: 'supervisor',
          },
        })
      }
      
      supervisorId = manualSupervisor.id
    }
    
    // Se o checklist foi preenchido, marcar como completed automaticamente
    const hasChecklistData = checklistData && Object.keys(checklistData).length > 0
    const initialStatus = hasChecklistData ? 'completed' : 'pending'
    
    const visit = await prisma.visit.create({
      data: {
        clientId,
        supervisorId,
        templateId,
        date: new Date(date),
        checklistData: JSON.stringify(checklistData || {}),
        status: initialStatus,
        turno,
        nomeColaborador,
        setor,
        nomeSupervisorManual,
        notes,
      },
      include: {
        client: true,
        supervisor: true,
        template: true,
      },
    })
    // Converter datas para ISO string
    const visitWithFormattedDates = {
      ...visit,
      date: visit.date.toISOString(),
      createdAt: visit.createdAt.toISOString(),
      updatedAt: visit.updatedAt.toISOString(),
    }
    
    res.status(201).json(visitWithFormattedDates)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar visita' })
  }
})

// PUT /api/visits/:id - Atualizar visita
router.put('/:id', async (req, res) => {
  try {
    const { checklistData, clientSignature, status, turno, nomeColaborador, setor, nomeSupervisorManual, notes } = req.body
    const visit = await prisma.visit.update({
      where: { id: req.params.id },
      data: {
        checklistData: checklistData ? JSON.stringify(checklistData) : undefined,
        clientSignature,
        status,
        turno,
        nomeColaborador,
        setor,
        nomeSupervisorManual,
        notes,
      },
      include: {
        client: true,
        supervisor: true,
        template: true,
      },
    })
    // Converter datas para ISO string
    const visitWithFormattedDates = {
      ...visit,
      date: visit.date.toISOString(),
      createdAt: visit.createdAt.toISOString(),
      updatedAt: visit.updatedAt.toISOString(),
    }
    
    res.json(visitWithFormattedDates)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar visita' })
  }
})

// DELETE /api/visits/:id - Deletar visita
router.delete('/:id', async (req, res) => {
  try {
    await prisma.visit.delete({
      where: { id: req.params.id },
    })
    res.json({ message: 'Visita deletada com sucesso' })
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar visita' })
  }
})

export default router

