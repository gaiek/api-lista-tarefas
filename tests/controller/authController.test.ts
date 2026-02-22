import { AuthController } from '../../src/controller/authController'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

jest.mock('bcrypt')
jest.mock('jsonwebtoken')

const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>
const mockJwt = jwt as jest.Mocked<typeof jwt>

describe('AuthController', () => {
  let authController: AuthController
  let mockUserService: any

  beforeEach(() => {
    process.env.JWT_SECRET = 'test_secret'
    jest.clearAllMocks()
    mockUserService = {
      createUser: jest.fn(),
      findByEmailWithPassword: jest.fn(),
    }
    authController = new AuthController(mockUserService)
  })

  it('should be defined', () => {
    expect(authController).toBeDefined()
  })

  it('should have method', () => {
    expect(authController.register).toBeDefined()
    expect(authController.login).toBeDefined()
  })

  describe('register', () => {
      it('shoul return 409 if email already in use for register', async () => {
    const req: any = { body: { name: 'John Doe', email: 'john.doe@example.com', password: 'password123' } }
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() }

    mockUserService.findByEmailWithPassword.mockResolvedValue({ id: 'existing', name: 'John Doe', email: 'john.doe@example.com' })

    await authController.register(req, res)

    expect(res.status).toHaveBeenCalledWith(409)
    expect(res.json).toHaveBeenCalledWith({ message: 'Email already in use' })
  })

  it('should return 500 if JWT_SECRET is not configured for register', async () => {
    delete process.env.JWT_SECRET
    const req: any = { body: { name: 'John Doe', email: 'jhom@teste.com', password: 'password123' } }
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() }

    mockUserService.findByEmailWithPassword.mockResolvedValue(null)

    await authController.register(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' })
  })

    it('should return 201 if user is created successfully', async () => {
      const req: any = { body: { name: 'John Doe', email: 'jhon@teste.com', password: 'password123' } }
      const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() }

      mockUserService.findByEmailWithPassword.mockResolvedValue(null)
      mockUserService.createUser.mockResolvedValue({ id: 'new', name: 'John Doe', email: 'jhon@teste.com' })

      await authController.register(req, res)

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({
        user: { id: 'new', name: 'John Doe', email: 'jhon@teste.com' },
        token: expect.any(String),
      })
    })

    it('should return 500 if there is an error during registration', async () => {
      const req: any = { body: { name: 'John Doe', email: 'jhon@teste.com', password: 'password123' } }
      const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() }

      mockUserService.findByEmailWithPassword.mockResolvedValue(null)
      mockUserService.createUser.mockRejectedValue(new Error('Database error'))

      await authController.register(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' })
    })
  })

  describe('login', () => {
    it('should return 401 if user not found for login', async () => {
      const req: any = { body: { email: 'jhon@teste.com', password: 'password123' } }
      const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() }

      mockUserService.findByEmailWithPassword.mockResolvedValue(null)

      await authController.login(req, res)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' })
    })

    it('should return 401 if password is invalid for login', async () => {
      const req: any = { body: { email: 'jhon@teste.com', password: 'wrongpassword' } }
      const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() }

      mockUserService.findByEmailWithPassword.mockResolvedValue({ id: 'existing', name: 'John Doe', email: 'jhon@teste.com', password: 'hashed_password' })

      await authController.login(req, res)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' })
    })

    it('should return 500 if JWT_SECRET is not configured', async () => {
    process.env.JWT_SECRET = ''; 
    
    const req: any = { body: { email: 'jhon@teste.com', password: '123' } };
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    mockUserService.findByEmailWithPassword.mockResolvedValue({ id: '1', password: 'hash' });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('should return 201 if login is successful', async () => {
    const req: any = { body: { email: 'jhon@teste.com', password: '123' } };
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    mockUserService.findByEmailWithPassword.mockResolvedValue({ 
      id: 'existing', name: 'John Doe', email: 'jhon@teste.com', password: 'hashed_password' 
    });

    mockBcrypt.compare = jest.fn().mockResolvedValue(true);
    mockJwt.sign = jest.fn().mockReturnValue('mocked-jwt-token');

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      user: { id: 'existing', name: 'John Doe', email: 'jhon@teste.com' },
      token: 'mocked-jwt-token',
    });
  });

    it('should return 500 if there is an error during login', async () => {
      const req: any = { body: { email: 'jhon@teste.com', password: 'password123' } }
      const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() }

      mockUserService.findByEmailWithPassword.mockRejectedValue(new Error('Database error'))

      await authController.login(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' })
    })
  })
})

