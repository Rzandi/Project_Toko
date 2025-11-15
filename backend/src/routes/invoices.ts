import { Router } from 'express'
import {
  listInvoices,
  createInvoice,
  getInvoice,
  updateInvoice,
  deleteInvoice,
  getNextInvoiceNumber,
} from '../controllers/invoicesController'
import authMiddleware from '../middlewares/auth'
import { validate } from '../middlewares/validation'
import { createInvoiceSchema, updateInvoiceSchema } from '../schemas/validationSchemas'

const router = Router()

router.get('/', authMiddleware, listInvoices)
router.post('/', authMiddleware, validate(createInvoiceSchema), createInvoice)
router.get('/number/next', authMiddleware, getNextInvoiceNumber)
router.get('/:id', authMiddleware, getInvoice)
router.put('/:id', authMiddleware, validate(updateInvoiceSchema), updateInvoice)
router.delete('/:id', authMiddleware, deleteInvoice)

export default router
