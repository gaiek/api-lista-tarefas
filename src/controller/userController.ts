import { Response } from 'express'
import { UserService } from '../service/userService'
import { AuthRequest } from '../middleware/auth'
import logger from '../logger'

export class UserController {
  constructor(private userService: UserService) {}

  async getMe(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id
      const user = await this.userService.getUserbyId(userId)
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }
      return res.status(200).json(user)
    } catch (error: unknown) {
      logger.error({ error }, '[UserController.getMe] Error')
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}
