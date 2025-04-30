import { z } from "zod";

// POST /todos body
export const createTodoSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  completed: z.boolean().optional(),
});

// PUT /todos/:id body
export const updateTodoSchema = z.object({
  title: z.string().min(1).optional(),
  completed: z.boolean().optional(),
});

// URL param parsing for :id
export const todoParamsSchema = z.object({
  id: z
    .string()
    .regex(/^[0-9]+$/, { message: "ID must be a number" })
    .transform((val) => parseInt(val, 10)),
});

// Types you can reuse elsewhere
export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
export type TodoParams = z.infer<typeof todoParamsSchema>;
