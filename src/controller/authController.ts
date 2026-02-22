import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import logger from '../logger'
import { UserService } from '../service/userService'
import { LoginUserDTO, CreateUserDTO } from '../schema/user.schema'

export class AuthController {
  constructor(private userService: UserService) {}

  async register(req: Request, res: Response) {
    try {
      const data: CreateUserDTO = req.body
      const existingUser = await this.userService.findByEmailWithPassword(data.email)
      if (existingUser) {
        return res.status(409).json({ message: 'Email already in use' })
      }

      const passwordHash = await bcrypt.hash(data.password, 8)
      const user = await this.userService.createUser({
        name: data.name,
        email: data.email,
        passwordHash,
      })

      const secretKey = process.env.JWT_SECRET
      if (!secretKey) {
        logger.error('JWT_SECRET is not configured')
        return res.status(500).json({ message: 'Internal server error' })
      }

      const token = jwt.sign({ id: user?.id }, secretKey, { expiresIn: '1h' })

      return res.status(201).json({ user, token })
    } catch (error: any) {
      logger.error({ error }, '[AuthController.register] Error')
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  async login(req: Request, res: Response) {
    try {
      const data: LoginUserDTO = req.body
      const user = await this.userService.findByEmailWithPassword(data.email)
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' })
      }

      const isPasswordValid = await bcrypt.compare(data.password, user.password)
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' })
      }

      const secretKey = process.env.JWT_SECRET
      if (!secretKey) {
        logger.error('JWT_SECRET is not configured')
        return res.status(500).json({ message: 'Internal server error' })
      }

      const token = jwt.sign({ id: user?.id }, secretKey, { expiresIn: '1h' })

      return res.status(201).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token,
      })
    } catch (error: any) {
      logger.error({ error }, '[AuthController.login] Error')
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}
