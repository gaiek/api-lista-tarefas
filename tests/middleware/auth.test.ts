import { authenticate } from '../../src/middleware/auth'
import jwt from 'jsonwebtoken'

describe('Auth Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should be defined', () => {
    expect(authenticate).toBeDefined()
  })

  it('should return 401 if authHeader is missing', async () => {
    const req: any = { headers: {} }
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    const next = jest.fn()

    authenticate(req, res, next)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ message: 'Authorization header missing' })
  })

  it('should return 401 if token is missing', async () => {
    const req: any = { headers: { authorization: 'Bearer' } }
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    const next = jest.fn()

    authenticate(req, res, next)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ message: 'Token missing' })
  })

  it('should return error if JWT_SECRET is not configured', async () => {
    const req: any = { headers: { authorization: 'Bearer validtoken' } }
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    const next = jest.fn()

    const originalEnv = process.env.JWT_SECRET
    delete process.env.JWT_SECRET

    authenticate(req, res, next)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' })

    process.env.JWT_SECRET = originalEnv
  })

  it('should set req.user and call next when jwt.verify returns payload', () => {
    const req: any = { headers: { authorization: 'Bearer validtoken' } }
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    const next = jest.fn()

    jest.spyOn(jwt, 'verify').mockReturnValue({ id: 'user1' } as any)

    authenticate(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(req.user).toEqual({ id: 'user1' })
  })
})
