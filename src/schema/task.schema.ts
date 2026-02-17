import { Status } from "src/generated/prisma/enums";
import { z } from "zod";

export const createTaskSchema = z.object({
    body: z.object({
        title: z.string().min(2),
        description: z.string().optional(),
    }),
});

export type CreateTaskDTO = z.infer<typeof createTaskSchema>["body"];

export const updateTaskSchema = z.object({
    body: z.object({
        title: z.string().min(2).optional(),
        description: z.string().optional(),
        status: z.nativeEnum(Status).optional(),    
    }),
    params: z.object({
        id: z.string().uuid(),
    }),
});

export type UpdateTaskDTO = z.infer<typeof updateTaskSchema>["body"];