import { z } from "zod";

export const validateData = (schema: z.ZodSchema, data: any) => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = mapZodErrors(error.errors);
      throw new Error("Validation failed", { cause: errorMessages });
    }
    throw error;
  }
};

export const mapZodErrors = (errors: z.ZodIssue[]) => {
  return errors.reduce((acc: Record<string, string>, curr) => {
    acc[curr.path[0] as string] = curr.message;
    return acc;
  }, {});
};
