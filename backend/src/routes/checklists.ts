import express from 'express'
import prisma from '../prisma'

const router = express.Router()

// GET /api/checklists - Listar todos os templates
router.get('/', async (req, res) => {
  try {
    const templates = await prisma.checklistTemplate.findMany({
      orderBy: { createdAt: 'desc' },
    })
    res.json(templates)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar templates' })
  }
})

// GET /api/checklists/:id - Buscar template por ID
router.get('/:id', async (req, res) => {
  try {
    const template = await prisma.checklistTemplate.findUnique({
      where: { id: req.params.id },
    })
    if (!template) {
      return res.status(404).json({ error: 'Template não encontrado' })
    }
    res.json(template)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar template' })
  }
})

// POST /api/checklists - Criar novo template
router.post('/', async (req, res) => {
  try {
    const { name, description, locations } = req.body
    const template = await prisma.checklistTemplate.create({
      data: {
        name,
        description,
        locations: JSON.stringify(locations || []),
      },
    })
    res.status(201).json(template)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar template' })
  }
})

// PUT /api/checklists/:id - Atualizar template
router.put('/:id', async (req, res) => {
  try {
    const { name, description, locations } = req.body
    const template = await prisma.checklistTemplate.update({
      where: { id: req.params.id },
      data: {
        name,
        description,
        locations: JSON.stringify(locations || []),
      },
    })
    res.json(template)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar template' })
  }
})

// DELETE /api/checklists/:id - Deletar template
router.delete('/:id', async (req, res) => {
  try {
    await prisma.checklistTemplate.delete({
      where: { id: req.params.id },
    })
    res.json({ message: 'Template deletado com sucesso' })
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar template' })
  }
})

export default router

