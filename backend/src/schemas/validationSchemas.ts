import * as yup from "yup";

// Auth validation schemas
export const registerSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  business: yup.object().shape({
    name: yup.string(),
    npwp: yup.string(),
    address: yup.string(),
  }),
});

export const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

// Transaction validation schema (for create/update)
export const createTransactionSchema = yup.object().shape({
  type: yup
    .string()
    .oneOf(
      ["INCOME", "EXPENSE", "income", "expense"],
      "Type must be INCOME or EXPENSE",
    )
    .required("Type is required"),
  date: yup.date().required("Date is required"),
  amount: yup
    .number()
    .positive("Amount must be positive")
    .required("Amount is required"),
  currency: yup.string().default("IDR"),
  category: yup.string().required("Category is required"),
  description: yup
    .string()
    .required("Description is required")
    .min(3, "Description must be at least 3 characters"),
  paymentMethod: yup.string(),
  notes: yup.string(),
});

// Invoice validation schema
export const createInvoiceSchema = yup.object().shape({
  client: yup.mixed().required("Client is required"), // can be ID string or object
  items: yup
    .array()
    .of(
      yup.object().shape({
        description: yup.string().required("Item description required"),
        quantity: yup.number().positive().required("Quantity required"),
        unitPrice: yup.number().positive().required("Unit price required"),
        tax: yup.number().min(0).max(100),
      }),
    )
    .min(1, "At least one item required"),
  issuedDate: yup.date(),
  dueDate: yup.date(),
  currency: yup.string().default("IDR"),
  notes: yup.string(),
});

export const updateInvoiceSchema = yup.object().shape({
  client: yup.mixed(),
  items: yup
    .array()
    .of(
      yup.object().shape({
        description: yup.string().required("Item description required"),
        quantity: yup.number().positive().required("Quantity required"),
        unitPrice: yup.number().positive().required("Unit price required"),
        tax: yup.number().min(0).max(100),
      }),
    )
    .min(1, "At least one item required"),
  issuedDate: yup.date(),
  dueDate: yup.date(),
  currency: yup.string(),
  notes: yup.string(),
  status: yup.string().oneOf(["draft", "sent", "paid", "overdue", "cancelled"]),
});

// Client validation schema
export const createClientSchema = yup.object().shape({
  name: yup.string().required("Client name is required"),
  email: yup.string().email("Invalid email"),
  phone: yup.string(),
  address: yup.string(),
  notes: yup.string(),
});
