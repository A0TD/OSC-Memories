import { Request, Response, NextFunction } from "express";
import { ZodObject } from "zod";

const validate =
  (schema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      req.body = parsed.body;
      req.query = parsed.query as any;
      req.params = parsed.params as any;

      next();
    } catch (err) {
      next(err);
    }
  };

export default validate;
