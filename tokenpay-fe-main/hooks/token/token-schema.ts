import { z } from "zod";

// Genco Schema
const GencoSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  contactNumber: z.string().min(1, "Contact number is required"),
  email: z.string().email("Invalid email format"),
  isActive: z.boolean(),
  createdAt: z.string().datetime({ message: "Invalid datetime format" }),
  updatedAt: z.string().datetime({ message: "Invalid datetime format" }),
});

// Main Schema
export const TokenRetrieveSchema = z.object({
  id: z.number(),
  tokenCode: z.string().min(1, "Token code is required"),
  amount: z.number().nonnegative("Amount must be a positive number"),
  amountEconomic: z.number().nonnegative("Amount must be a positive number"),
  unitsPurchased: z.number().nonnegative("Units purchased must be a positive number"),
  genco: GencoSchema,
  createdAt: z.string().datetime({ message: "Invalid datetime format" }),
  expiresAt: z.string().datetime({ message: "Invalid datetime format" }),
  tokenStatus: z.enum(["ACTIVE", "INACTIVE", "EXPIRED"]), // Adjust as needed
  tokenType: z.enum(["PRIVATE", "PUBLIC", "RESTRICTED"]), // Adjust as needed
});

export const TokenCreateOrUpdateSchema = z.object({
  id: z.number().nullable().optional(),
  tokenCode: z.string().min(1, "Token code is required"),
  amount: z.number().nonnegative("Amount must be a positive number"),
  amountEconomic: z.number().nonnegative("Amount must be a positive number"),
  unitsPurchased: z.number().nonnegative("Units purchased must be a positive number"),
  gencoId: z.number().nonnegative("Genco ID must be a positive number"),
  expiresAt: z.string().datetime({ message: "Invalid datetime format" }),
  tokenStatus: z.string().min(1, "Token status is required"), // Optionally use z.enum() if there are specific allowed values
  tokenType: z.string().min(1, "Token type is required"), // Optionally use z.enum() if there are specific allowed values
});


export type TokenRetrieveDTO = z.infer<typeof TokenRetrieveSchema>;
export type TokenCreateDTO = z.infer<typeof TokenCreateOrUpdateSchema>;
export type TokenUpdateDTO = z.infer<typeof TokenCreateOrUpdateSchema>;