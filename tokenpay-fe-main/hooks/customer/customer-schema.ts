import { z } from "zod";

// Payment Schema
const PaymentSchema = z.object({
  id: z.number(),
  amountPaid: z.number(),
  paymentMethod: z.string(), // Example: BANK_TRANSFER, adjust with enum if needed
  paymentStatus: z.string(), // Example: SUCCESS, adjust with enum if needed
  timestamp: z.string().datetime({ message: "Invalid datetime format" }),
});

// Main Schema
export const CustomerRetrieveSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phoneNumber: z.string(),
  address: z.string().min(1, "Address is required"),
  meterNumber: z.string().min(1, "Meter number is required"),
  tariffType: z.enum(["PREPAID", "POSTPAID"]), // Adjust with actual tariff types
  gencoId: z.number().nullable(),
  gencoName: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.string().datetime({ message: "Invalid datetime format" }),
  updatedAt: z.string().datetime({ message: "Invalid datetime format" }),
  customerType: z.enum(["RESIDENTIAL", "COMMERCIAL", "INDUSTRIAL"]), // Adjust with actual customer types
  customerStatus: z.enum(["ACTIVE", "INACTIVE", "PENDING"]), // Adjust with actual customer statuses
  avatar: z.string().nullable(),
  note: z.string().nullable(),
  userId: z.number().nullable(),
  userName: z.string().nullable(),
  payments: z.array(PaymentSchema),
});

export const CustomerCreateOrUpdateSchema = z.object({
  id: z.number().nullable().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phoneNumber: z.string(),
  address: z.string().min(1, "Address is required"),
  meterNumber: z.string().min(1, "Meter number is required"),
  tariffType: z.string().min(1, "Tariff type is required"), // Optionally use z.enum() if there are specific allowed values
  gencoId: z.number().nonnegative("Genco ID must be a positive number"),
  customerType: z.string().min(1, "Customer type is required"), // Optionally use z.enum() if there are specific allowed values
  customerStatus: z.string().min(1, "Customer status is required"), // Optionally use z.enum() if there are specific allowed values
  avatar: z.string(),
  note: z.string(), 
  userId: z.number().nonnegative("User ID must be a positive number"),
});

// DTOs based on Zod schemas
export type PaymentDTO = z.infer<typeof PaymentSchema>;
export type CustomerRetrieveDTO = z.infer<typeof CustomerRetrieveSchema>;
export type CustomerCreateOrUpdateDTO = z.infer<typeof CustomerCreateOrUpdateSchema>;
