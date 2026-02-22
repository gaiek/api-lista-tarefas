import { validate } from '../../src/middleware/validate'
import { ZodError } from 'zod'

jest.mock('../../src/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}))

describe('Validate Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(validate).toBeDefined()
  })

  it('should return 400 if validation fails', async () => {
    const issues = [
      {
        path: ['field'],
        message: 'Invalid field value',
        code: 'custom' as const,
      },
    ]

    const zodError = new ZodError(issues)

    const schema: any = {
      parseAsync: jest.fn().mockRejectedValue(zodError),
    }

    const req: any = { body: { field: 'invalid' } }
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    const next = jest.fn()

    await validate(schema)(req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Validation error',
      errors: [{ field: 'field', message: 'Invalid field value' }],
    })
  })

  it('should call next if validation succeeds', async () => {
    const schema: any = {
      parseAsync: jest.fn().mockResolvedValue({ valid: true }),
    }

    const req: any = { body: { field: 'valid' } }
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    const next = jest.fn()

    await validate(schema)(req, res, next)
    expect(next).toHaveBeenCalled()
  })

  it('should return 500 if an unexpected error occurs', async () => {
    const schema: any = {
      parseAsync: jest.fn().mockRejectedValue(new Error('Unexpected error')),
    }

    const req: any = { body: { field: 'value' } }
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    const next = jest.fn()

    await validate(schema)(req, res, next)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' })
  })
})
