import { z } from "zod";
import { createProfissionalSchema } from "./createSchema";

export const updateProfissionalSchema = createProfissionalSchema.partial();

export type UpdateProfissionalDTO = z.infer<typeof updateProfissionalSchema>;
