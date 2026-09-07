import { z } from "zod";

const paramSchema = (paramName: string) => {
  return z.object({
    params: z.object({
      [paramName]: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId format"),
    }),
  });
};

export default paramSchema;
