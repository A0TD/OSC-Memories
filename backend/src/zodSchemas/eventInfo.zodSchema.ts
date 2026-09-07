import { z } from "zod";

export const createEventInfoSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Name is required"),
    description: z.string().trim().min(1, "Description is required"),
  }),
});

export const updateEventInfoSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Name cannot be empty").optional(),
    description: z
      .string()
      .trim()
      .min(1, "Description cannot be empty")
      .optional(),
  }),
});
