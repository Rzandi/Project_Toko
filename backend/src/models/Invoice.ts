import mongoose, { Document, Schema } from 'mongoose'

type InvoiceStatus = 'draft' | 'sent' | 'overdue' | 'paid' | 'partial'

export interface IInvoiceItem {
  desc: string
  qty: number
  unitPrice: number
  taxPct?: number
}

export interface IInvoice extends Document {
  user: mongoose.Types.ObjectId
  number: string
  series?: string
  status: InvoiceStatus
  client?: mongoose.Types.ObjectId
  clientSnapshot?: {
    name: string
    email?: string
    address?: string
    phone?: string
  }
  items: IInvoiceItem[]
  subtotal: number
  tax: number
  total: number
  currency: string
  issuedDate?: Date
  dueDate?: Date
  paidDate?: Date
  pdfUrl?: string
  createdAt: Date
  updatedAt: Date
}

const InvoiceItemSchema = new Schema<IInvoiceItem>(
  {
    desc: { type: String, required: true },
    qty: { type: Number, required: true, default: 1 },
    unitPrice: { type: Number, required: true },
    taxPct: { type: Number, default: 0 }
  },
  { _id: false }
)

const InvoiceSchema = new Schema<IInvoice>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    number: { type: String, required: true, index: true },
    series: { type: String },
    status: { type: String, enum: ['draft', 'sent', 'overdue', 'paid', 'partial'], default: 'draft' },
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
    clientSnapshot: { name: String, email: String, address: String, phone: String },
    items: { type: [InvoiceItemSchema], default: [] },
    subtotal: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    currency: { type: String, default: 'IDR' },
    issuedDate: { type: Date },
    dueDate: { type: Date },
    paidDate: { type: Date },
    pdfUrl: { type: String }
  },
  { timestamps: true }
)

// convenience method to compute totals
InvoiceSchema.methods.computeTotals = function () {
  const items = this.items || []
  const subtotal = items.reduce((s: number, it: IInvoiceItem) => s + it.qty * it.unitPrice, 0)
  const tax = items.reduce((t: number, it: IInvoiceItem) => t + Math.round((it.qty * it.unitPrice * (it.taxPct || 0)) / 100), 0)
  this.subtotal = subtotal
  this.tax = tax
  this.total = subtotal + tax
}

InvoiceSchema.pre('save', function (next) {
  // recalc totals before save
  // @ts-ignore
  if (this.items) this.computeTotals()
  next()
})

InvoiceSchema.index({ user: 1, number: 1 }, { unique: true })

export default mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema)
