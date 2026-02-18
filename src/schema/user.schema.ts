import { z } from 'zod'

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2),
    email: z.string().email(),
    password: z.string().min(6),
  }),
})

export type CreateUserDTO = z.infer<typeof createUserSchema>['body']

export const loginUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
})

export type LoginUserDTO = z.infer<typeof loginUserSchema>['body']

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
})

export type UpdateUserBodyDTO = z.infer<typeof updateUserSchema>['body']
export type UpdateUserParamsDTO = z.infer<typeof updateUserSchema>['params']
