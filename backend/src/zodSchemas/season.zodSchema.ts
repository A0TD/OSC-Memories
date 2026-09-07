import { z } from "zod";

export const createSeasonSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1),
    date: z.coerce.date(),
    imageUrl: z.string().trim().default("https://placeholder.co/600x400"),
    description: z.string().trim().min(1).default("No description included"),
  }),
});

export const updateSeasonSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).optional(),
    date: z.coerce.date().optional(),
    imageUrl: z.string().trim().optional(),
    description: z.string().trim().min(1).optional(),
  }),
});
