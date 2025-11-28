import express from 'express'
import prisma from '../prisma'

const router = express.Router()

// GET /api/users - Listar todos os usuários
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    })
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários' })
  }
})

// GET /api/users/:id - Buscar usuário por ID
router.get('/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
    })
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário' })
  }
})

// POST /api/users - Criar novo usuário
router.post('/', async (req, res) => {
  try {
    const { name, email, role } = req.body
    const user = await prisma.user.create({
      data: { name, email, role: role || 'supervisor' },
    })
    res.status(201).json(user)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar usuário' })
  }
})

// PUT /api/users/:id - Atualizar usuário
router.put('/:id', async (req, res) => {
  try {
    const { name, email, role } = req.body
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { name, email, role },
    })
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar usuário' })
  }
})

// DELETE /api/users/:id - Deletar usuário
router.delete('/:id', async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: req.params.id },
    })
    res.json({ message: 'Usuário deletado com sucesso' })
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar usuário' })
  }
})

export default router

