# Backend Validation & Error Handling

Saya sudah menambahkan:

## 1. Validation Schemas (src/schemas/validationSchemas.ts)
- `registerSchema` — validates email, password, business fields
- `loginSchema` — validates email, password
- `createTransactionSchema` — validates type, date, amount, currency, category
- `createInvoiceSchema` — validates client, items, dates
- `createClientSchema` — validates client data

Gunakan Yup's `.validate()` method untuk manual validation atau gunakan middleware factory.

## 2. Validation Middleware & Error Handler (src/middlewares/validation.ts)
- `validate(schema)` — middleware factory yang auto-validates request body
- `AppError` — custom error class for better error handling
- `errorHandler` — global Express error handler

Error types yang ditangani:
- Yup validation errors → 400 dengan detail errors per field
- MongoDB CastError → 400
- MongoDB duplicate key (E11000) → 409 Conflict
- MongoDB ValidationError → 400
- AppError custom errors → status code + message
- Unhandled errors → 500 Internal Server Error

## 3. Updated Routes
Semua routes sekarang punya validation middleware:
- `/auth/register` — validate registerSchema
- `/auth/login` — validate loginSchema
- `/transactions POST` — validate createTransactionSchema
- `/invoices POST` — validate createInvoiceSchema

## 4. Updated Controllers
Semua controllers sekarang:
- Wrap logic dalam try-catch
- Call `next(err)` untuk forward errors ke global error handler
- Throw `AppError(statusCode, message)` untuk custom errors

## Cara menggunakan

### Dalam route file:
```typescript
import { validate } from '../middlewares/validation'
import { mySchema } from '../schemas/validationSchemas'

router.post('/', validate(mySchema), myController)
```

### Dalam controller:
```typescript
import { AppError } from '../middlewares/validation'

export const myController = async (req, res, next) => {
  try {
    if (someCondition) throw new AppError(400, 'Custom error message')
    // ... logic
    res.json({ success: true, data })
  } catch (err) {
    next(err) // forwards to errorHandler
  }
}
```

## Install dependency
Jalankan di backend folder untuk install yup:
```powershell
npm install yup
```

Validation sekarang siap digunakan!
