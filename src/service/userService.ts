import { prismaClient } from '../lib/database'
import logger from '../logger'

export class UserService {
  static async getUserbyId(userId: string) {
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })
    if (!user) {
      logger.info(`User with id ${userId} not found`)
      return null
    }
    return user
  }

  static async findByEmailWithPassword(emailUser: string) {
    const email = await prismaClient.user.findUnique({
      where: { email: emailUser },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    })

    if (!email) {
      logger.info(`Email ${emailUser} not found`)
      return null
    }
    return email
  }

  static async createUser(data: { name: string; email: string; passwordHash: string }) {
    const user = await prismaClient.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.passwordHash,
      },
    })

    if (!user) {
      logger.info(`User ${data} not found`)
      return null
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    }
  }
}
