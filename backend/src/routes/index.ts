import express from 'express'
import clientsRoutes from './clients'
import checklistsRoutes from './checklists'
import visitsRoutes from './visits'
import usersRoutes from './users'

const router = express.Router()

router.use('/clients', clientsRoutes)
router.use('/checklists', checklistsRoutes)
router.use('/visits', visitsRoutes)
router.use('/users', usersRoutes)

export default router

