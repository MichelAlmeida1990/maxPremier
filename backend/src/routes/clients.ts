import express from 'express'
import prisma from '../prisma'

const router = express.Router()

// GET /api/clients - Listar todos os clientes
router.get('/', async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: 'desc' },
    })
    res.json(clients)
  } catch (error: any) {
    console.error('Erro ao buscar clientes:', error)
    res.status(500).json({ 
      error: 'Erro ao buscar clientes',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// GET /api/clients/:id - Buscar cliente por ID
router.get('/:id', async (req, res) => {
  try {
    const client = await prisma.client.findUnique({
      where: { id: req.params.id },
    })
    if (!client) {
      return res.status(404).json({ error: 'Cliente não encontrado' })
    }
    res.json(client)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar cliente' })
  }
})

// POST /api/clients - Criar novo cliente
router.post('/', async (req, res) => {
  try {
    const { name, contact, address } = req.body
    const client = await prisma.client.create({
      data: { name, contact, address },
    })
    res.status(201).json(client)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar cliente' })
  }
})

// PUT /api/clients/:id - Atualizar cliente
router.put('/:id', async (req, res) => {
  try {
    const { name, contact, address } = req.body
    const client = await prisma.client.update({
      where: { id: req.params.id },
      data: { name, contact, address },
    })
    res.json(client)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar cliente' })
  }
})

// DELETE /api/clients/:id - Deletar cliente
router.delete('/:id', async (req, res) => {
  try {
    await prisma.client.delete({
      where: { id: req.params.id },
    })
    res.json({ message: 'Cliente deletado com sucesso' })
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar cliente' })
  }
})

export default router

