import { z } from "zod";


// Sub-schema for Token
const TokenSchema = z.object({
  id: z.number().int(), // Token ID
  tokenCode: z.string(), // Token code
  amount: z.number(), // Token amount
});

// Sub-schema for Customer
const CustomerSchema = z.object({
  id: z.number().int(), // Customer ID
  name: z.string(), // Customer name
  email: z.string().email(), // Customer email
  phoneNumber: z.string(), // Customer phone number
  meterNumber: z.string(), // Meter number
  tariffType: z.string(), // Tariff type
  customerType: z.string(), // Customer type
  customerStatus: z.string(), // Customer status
  avatar: z.string().url(), // Avatar URL
  note: z.string().nullable(), // Customer note
});

export const PaymentRetrieveSchema = z.object({
  id: z.number().int(), // Payment ID
  paymentId: z.string(), // UUID for the payment
  userId: z.number(),
  wa: z.string().optional().nullable(),
  token: TokenSchema, // Reference to Token sub-schema
  tokenCode: z.string(), // Token code string
  customer: CustomerSchema, // Reference to Customer sub-schema
  customerName: z.string(), // Customer name string
  energyUsage: z.number().gt(0, { message: "Energy usage must be greater than 0" }), // Energy usage
  amountPaid: z.number().gt(0, { message: "Amount paid must be greater than 0" }), // Amount paid
  ppn: z.number().gt(0, { message: "PPN must be greater than 0" }), // PPN
  ppj: z.number().gt(0, { message: "PPJ must be greater than 0" }), // PPJ
  materai: z.number().gt(0, { message: "Materai must be greater than 0" }), // Materai
  bankFee: z.number().gt(0, { message: "Bank fee must be greater than 0" }), // Bank fee
  serviceFee: z.number().gt(0, { message: "Service fee must be greater than 0" }), // Service fee
  total: z.number().gt(0, { message: "Total amount must be greater than 0" }), // Total amount
  paymentMethod: z.string(),
  paymentStatus: z.string(),
  paymentPromo: z.string(), // Payment promo
  qris: z.string().nullable().optional(), // QRIS field
  timestamp: z.string(), // ISO timestamp
  note: z.string(), // Payment note
});



export const PaymentUpdateSchema = z.object({
  id: z.number().nullable().optional(),
  tokenId: z.number().gt(0), // Payment ID
  userId: z.number(),
  wa: z.string().optional().nullable(),
  customerId: z.number().gt(0), // Payment ID
  energyUsage: z.number().nonnegative("Energy usage must be a positive number"),
  amountPaid: z.number().nonnegative("Amount paid must be a positive number"),
  ppn: z.number().nonnegative("PPN must be a positive number"),
  ppj: z.number().nonnegative("PPJ must be a positive number"),
  materai: z.number().nonnegative("Materai must be a positive number"),
  bankFee: z.number().nonnegative("Bank fee must be a positive number"),
  serviceFee: z.number().nonnegative("Service fee must be a positive number"),
  total: z.number().nonnegative("Total must be a positive number"),
  paymentMethod: z.string().min(1, "Payment method is required"), // Optionally use z.enum() if specific values are needed
  qris: z.string().nullable().optional(), // Allows null values
  paymentStatus: z.string().min(1, "Payment status is required"), // Optionally use z.enum() if specific values are needed
  paymentPromo: z.string().nullable(), // Allows null values
  note: z.string().nullable(), // Allows null values
});


export const PaymentCreateSchema = z.object({
  tokenId: z.number().gt(0), // Payment ID
  customerId: z.number().gt(0), // Payment ID
  userId: z.number(),
  wa: z.string().optional().nullable(),
  energyUsage: z.number().gt(0).nonnegative("Energy usage must be a positive number"),
  amountPaid: z.number().gt(0).nonnegative("Amount paid must be a positive number"),
  ppn: z.number().gt(0).nonnegative("PPN must be a positive number"),
  ppj: z.number().gt(0).nonnegative("PPJ must be a positive number"),
  materai: z.number().gt(0).nonnegative("Materai must be a positive number"),
  bankFee: z.number().gt(0).nonnegative("Bank fee must be a positive number"),
  serviceFee: z.number().gt(0).nonnegative("Service fee must be a positive number"),
  total: z.number().gt(0).nonnegative("Total must be a positive number"),
  paymentMethod: z.string().min(1, "Payment method is required"), // Optionally use z.enum() if specific values are needed
  qris: z.string().nullable().optional(), // Allows null values
  paymentStatus: z.string().min(1, "Payment status is required"), // Optionally use z.enum() if specific values are needed
  paymentPromo: z.string(), // Allows null values
  note: z.string().nullable().optional(), // Allows null values
});

export type PaymentRetrieveDTO = z.infer<typeof PaymentRetrieveSchema>;
export type PaymentCreateDTO = z.infer<typeof PaymentCreateSchema>;
export type PaymentUpdateDTO = z.infer<typeof PaymentUpdateSchema>;