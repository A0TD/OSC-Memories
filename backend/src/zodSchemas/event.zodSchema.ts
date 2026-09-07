import { z } from "zod";

export const createEventSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    imageUrl: z.string().trim().default("https://placeholder.co/600x400"),
    description: z.string().default("No description included"),
  }),
});
//
export const updateEventSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    seasonId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId format")
      .optional(),
    imageUrl: z.string().trim().optional(),
    description: z.string().optional(),
  }),
});
