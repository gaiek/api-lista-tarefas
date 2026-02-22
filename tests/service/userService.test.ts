import { prismaClient } from '../../src/lib/database'
import { UserService } from '../../src/service/userService'

jest.mock('../../src/lib/database', () => ({
  prismaClient: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}))

describe('UserService', () => {
  let userService: UserService

  beforeEach(() => {
    userService = new UserService()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(userService).toBeDefined()
  })

  it('should have methods', () => {
    expect(userService.getUserbyId).toBeDefined()
    expect(userService.findByEmailWithPassword).toBeDefined()
    expect(userService.createUser).toBeDefined()
  })

  describe('getUserbyId', () => {
    it('should return user by id', async () => {
      const userId = 'user123'
      const user = { id: userId, name: 'Test User', email: 'jhon@teste.com' }
      ;(prismaClient.user.findUnique as jest.Mock).mockResolvedValue(user)

      const result = await userService.getUserbyId(userId)
      expect(prismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        select: { id: true, name: true, email: true },
      })
      expect(result).toEqual(user)
    })

    it('should return null if user not found', async () => {
      const userId = 'user123'
      ;(prismaClient.user.findUnique as jest.Mock).mockResolvedValue(null)

      const result = await userService.getUserbyId(userId)
      expect(prismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        select: { id: true, name: true, email: true },
      })
      expect(result).toBeNull()
    })
  })

  describe('findByEmailWithPassword', () => {
    it('should return user by email with password', async () => {
      const email = 'jhon@teste.com'
      const user = { id: 'user123', name: 'Test User', email, password: 'hashedpassword' }
      ;(prismaClient.user.findUnique as jest.Mock).mockResolvedValue(user)

      const result = await userService.findByEmailWithPassword(email)
      expect(prismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { email },
        select: { id: true, name: true, email: true, password: true },
      })
      expect(result).toEqual(user)
    })

    it('should return null if email not found', async () => {
      const email = 'jhon@teste.com'
      ;(prismaClient.user.findUnique as jest.Mock).mockResolvedValue(null)

      const result = await userService.findByEmailWithPassword(email)
      expect(prismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { email },
        select: { id: true, name: true, email: true, password: true },
      })
      expect(result).toBeNull()
    })
  })

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'jhon@teste.com',
        passwordHash: 'hashedpassword',
      }
      const createdUser = { id: 'user123', name: userData.name, email: userData.email }
      ;(prismaClient.user.create as jest.Mock).mockResolvedValue(createdUser)

      const result = await userService.createUser(userData)
      expect(prismaClient.user.create).toHaveBeenCalledWith({
        data: {
          name: userData.name,
          email: userData.email,
          password: userData.passwordHash,
        },
      })
      expect(result).toEqual(createdUser)
    })

    it('should return null if user creation fails', async () => {
      const userData = {
        name: 'Test User',
        email: 'jhon@teste.com',
        passwordHash: 'hashedpassword',
      }
      ;(prismaClient.user.create as jest.Mock).mockResolvedValue(null)

      const result = await userService.createUser(userData)
      expect(prismaClient.user.create).toHaveBeenCalledWith({
        data: {
          name: userData.name,
          email: userData.email,
          password: userData.passwordHash,
        },
      })
      expect(result).toBeNull()
    })
  })
})
