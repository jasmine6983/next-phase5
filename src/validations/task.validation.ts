import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters"),

  description: z
    .string()
    .optional(),
});

export const updateTaskSchema = z
  .object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters")
      .optional(),

    description: z.string().optional(),

    completed: z.boolean().optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field is required",
    }
  );