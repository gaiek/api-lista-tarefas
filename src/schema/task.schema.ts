import { Status } from "../generated/prisma/enums";
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

export type UpdateTaskBodyDTO = z.infer<typeof updateTaskSchema>["body"];
export type UpdateTaskParamsDTO = z.infer<typeof updateTaskSchema>["params"];

export const listTaskSchema = z.object({
    query: z.object({
        status: z.nativeEnum(Status).optional(),
        pageSize: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().int().positive()).optional(),
        page: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().int().positive()).optional(),
    }),
})

export type ListTaskQueryDTO = z.infer<typeof listTaskSchema>["query"];

export const getListTaskByIdSchema = z.object({
    params: z.object({
        id: z.string().uuid(),
    }),
})

export type GetTaskByIdParamsDTO = z.infer<typeof getListTaskByIdSchema>["params"];

export const deleteTaskSchema = z.object({
    params: z.object({
        id: z.string().uuid(),
    }),
})

export type DeleteTaskParamsDTO = z.infer<typeof deleteTaskSchema>["params"];