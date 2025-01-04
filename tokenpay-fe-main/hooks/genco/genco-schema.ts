import { z } from "zod";

export const ProviderRetrieveSchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string(),
  contactNumber: z.string(),
  email: z.string().email("Invalid email format"),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string()
});



export const ProviderCreateSchema = z.object({
  name: z.string().min(1, "Name is required"), // Mandatory and cannot be empty
  address: z.string().min(1, "Address is required"), // Mandatory and cannot be empty
  contactNumber: z
    .string()
    .min(1, "Contact number is required") // Mandatory and cannot be empty
    .regex(/^\+?[0-9\s\-]+$/, "Contact number must be valid"), // Optional validation for valid contact number format
  email: z
    .string()
    .min(1, "Email is required") // Mandatory and cannot be empty
    .email("Invalid email address"), // Ensures a valid email format
  isActive: z.boolean(), // Mandatory and must be boolean
});

export const ProviderUpdateSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required"), // Mandatory and cannot be empty
  address: z.string().min(1, "Address is required"), // Mandatory and cannot be empty
  contactNumber: z
    .string()
    .min(1, "Contact number is required") // Mandatory and cannot be empty
    .regex(/^\+?[0-9\s\-]+$/, "Contact number must be valid"), // Optional validation for valid contact number format
  email: z
    .string()
    .min(1, "Email is required") // Mandatory and cannot be empty
    .email("Invalid email address"), // Ensures a valid email format
  isActive: z.boolean(), // Mandatory and must be boolean
});


export type ProviderRetrieveDTO = z.infer<typeof ProviderRetrieveSchema>;
export type ProviderCreateDTO = z.infer<typeof ProviderCreateSchema>;
export type ProviderUpdateDTO = z.infer<typeof ProviderUpdateSchema>;