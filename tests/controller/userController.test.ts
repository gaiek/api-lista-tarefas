import { mock } from 'node:test'
import { UserController } from '../../src/controller/userController'

describe('UserController', () => {
  let userController: UserController
  let mockUserService: any

  beforeEach(() => {
    mockUserService = {
      getUserbyId: jest.fn(),
    }
    userController = new UserController(mockUserService)
  })

  it('should be defined', () => {
    expect(userController).toBeDefined()
  })

  it('should have a getMe method', () => {
    expect(userController.getMe).toBeDefined()
  })

  it('should return 404 if user not found', async () => {
    const req: any = { user: { id: 'nonexistent' } }
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    mockUserService.getUserbyId.mockResolvedValue(null)

    await userController.getMe(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found' })
  })

  it('should return 200 if user is found', async () => {
    const req: any = { user: { id: 'existing' } }
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    const mockUser = { id: 'existing', name: 'John Doe', email: 'john.doe@example.com' }

    mockUserService.getUserbyId.mockResolvedValue(mockUser)

    await userController.getMe(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(mockUser)
  })

  it('should return 500 if there is an error', async () => {
    const req: any = { user: { id: 'error' } }
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    mockUserService.getUserbyId.mockRejectedValue(new Error('Database error'))

    await userController.getMe(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: 'Database error' })
  })
})
