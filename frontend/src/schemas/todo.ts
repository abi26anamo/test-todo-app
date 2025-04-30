import { z } from "zod";

export const todoFormSchema = z.object({
  title: z.string().min(1, { message: "Task title is required" }),
});

export type TodoFormInput = z.infer<typeof todoFormSchema>;
