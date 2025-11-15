import { Request, Response, NextFunction } from 'express'
import Transaction from '../models/Transaction'

export const listTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const userId = req.userId
    const skip = Number(req.query.skip || 0)
    const limit = Number(req.query.limit || 10)
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : null
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : null
    const type = req.query.type as string | undefined
    const category = req.query.category as string | undefined

    // Build filter
    const filter: any = { user: userId }
    if (startDate && endDate) {
      filter.date = { $gte: startDate, $lte: endDate }
    }
    if (type && type !== 'ALL') {
      // Accept both uppercase (frontend) and lowercase (DB) formats
      filter.type = type.toUpperCase()
    }
    if (category) {
      filter.category = category
    }

    const [items, total] = await Promise.all([
      Transaction.find(filter)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Transaction.countDocuments(filter)
    ])

    const pages = Math.ceil(total / limit)

    res.json({
      success: true,
      data: items,
      pagination: {
        total,
        skip,
        limit,
        pages
      }
    })
  } catch (err) {
    next(err)
  }
}

export const getTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const userId = req.userId
    const { id } = req.params

    const transaction = await Transaction.findOne({
      _id: id,
      user: userId
    })

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' })
    }

    res.json({ success: true, data: transaction })
  } catch (err) {
    next(err)
  }
}

export const createTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const userId = req.userId
    const payload = { ...req.body, user: userId }
    const tx = await Transaction.create(payload)
    res.status(201).json({ success: true, data: tx })
  } catch (err) {
    next(err)
  }
}

export const updateTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const userId = req.userId
    const { id } = req.params

    // Verify ownership
    const transaction = await Transaction.findOne({
      _id: id,
      user: userId
    })

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' })
    }

    // Update allowed fields only
    const updateData = {
      type: req.body.type || transaction.type,
      date: req.body.date || transaction.date,
      amount: req.body.amount || transaction.amount,
      category: req.body.category || transaction.category,
      notes: req.body.notes || transaction.notes,
      currency: req.body.currency || transaction.currency
    }

    const updated = await Transaction.findByIdAndUpdate(id, updateData, { new: true })

    res.json({ success: true, data: updated })
  } catch (err) {
    next(err)
  }
}

export const deleteTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const userId = req.userId
    const { id } = req.params

    // Verify ownership
    const transaction = await Transaction.findOne({
      _id: id,
      user: userId
    })

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' })
    }

    await Transaction.findByIdAndDelete(id)

    res.json({ success: true, message: 'Transaction deleted successfully' })
  } catch (err) {
    next(err)
  }
}
