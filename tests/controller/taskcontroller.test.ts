import { TaskController } from '../../src/controller/taskController'

describe('TaskController', () => {
  let taskController: TaskController
  let mockTaskService: any

  beforeEach(() => {
    mockTaskService = {
      createTask: jest.fn(),
      getAllTasks: jest.fn(),
      getTasksById: jest.fn(),
      updateTaskStatus: jest.fn(),
      deleteTask: jest.fn(),
    }
    taskController = new TaskController(mockTaskService)
  })

  it('should be defined', () => {
    expect(taskController).toBeDefined()
  })

  it('should have methods', () => {
    expect(taskController.createTask).toBeDefined()
    expect(taskController.getAllTasks).toBeDefined()
    expect(taskController.getTasksById).toBeDefined()
    expect(taskController.updateTaskStatus).toBeDefined()
    expect(taskController.deleteTask).toBeDefined()
  })

  it('should return 400 if createTask is called without title', async () => {
    const req: any = { user: { id: 'user1' }, body: { description: 'Task description' } }
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() }

    await taskController.createTask(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ message: 'Title is required!' })
  })

  it('should return 400 if createTask fails to create a task', async () => {
    const req: any = {
      user: { id: 'user1' },
      body: { title: 'Task 1', description: 'Task description' },
    }
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() }

    mockTaskService.createTask.mockResolvedValue(null)

    await taskController.createTask(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ message: 'Failed to create task!' })
  })

  it('should return 201 if createTask is successful', async () => {
    const req: any = {
      user: { id: 'user1' },
      body: { title: 'Task 1', description: 'Task description' },
    }
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() }

    const mockTask = {
      id: 'task1',
      title: 'Task 1',
      description: 'Task description',
      userId: 'user1',
    }
    mockTaskService.createTask.mockResolvedValue(mockTask)

    await taskController.createTask(req, res)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(mockTask)
  })

  it('should return 500 if there is an error during createTask', async () => {
    const req: any = {
      user: { id: 'user1' },
      body: { title: 'Task 1', description: 'Task description' },
    }
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() }

    mockTaskService.createTask.mockRejectedValue(new Error('Database error'))

    await taskController.createTask(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' })
  })

  it('should return 200 if getAllTasks is successful', async () => {
    const req: any = { user: { id: 'user1' }, query: {} }
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() }

    const mockTasks = [
      { id: 'task1', title: 'Task 1', description: 'Task description', userId: 'user1' },
      { id: 'task2', title: 'Task 2', description: 'Task description', userId: 'user1' },
    ]
    mockTaskService.getAllTasks.mockResolvedValue(mockTasks)

    await taskController.getAllTasks(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(mockTasks)
  })

  it('should return 500 if there is an error during getAllTasks', async () => {
    const req: any = { user: { id: 'user1' }, query: {} }
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() }

    mockTaskService.getAllTasks.mockRejectedValue(new Error('Database error'))

    await taskController.getAllTasks(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' })
  })

  it('should return 404 if getTasksById is called with non-existent task', async () => {
    const req: any = { user: { id: 'user1' }, params: { id: 'nonexistent' } }
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() }

    mockTaskService.getTasksById.mockResolvedValue(null)

    await taskController.getTasksById(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ message: 'Task not found!' })
  })

  it('should return 403 if getTasksById is called with a task that belongs to another user', async () => {
    const req: any = { user: { id: 'user1' }, params: { id: 'task1' } }
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() }

    const mockTask = {
      id: 'task1',
      title: 'Task 1',
      description: 'Task description',
      userId: 'user2',
    }
    mockTaskService.getTasksById.mockResolvedValue(mockTask)

    await taskController.getTasksById(req, res)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith({
      message: "You don't have permission to access this task!",
    })
  })

  it('should return 200 if getTasksById is successful', async () => {
    const req: any = { user: { id: 'user1' }, params: { id: 'task1' } }
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() }

    const mockTask = {
      id: 'task1',
      title: 'Task 1',
      description: 'Task description',
      userId: 'user1',
    }
    mockTaskService.getTasksById.mockResolvedValue(mockTask)

    await taskController.getTasksById(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(mockTask)
  })

  it('should return 500 if there is an error during getTasksById', async () => {
    const req: any = { user: { id: 'user1' }, params: { id: 'task1' } }
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() }

    mockTaskService.getTasksById.mockRejectedValue(new Error('Database error'))

    await taskController.getTasksById(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' })
  })

  it('should return 400 if updateTaskStatus is called without status', async () => {
    const req: any = {
      user: { id: 'user1' },
      params: { id: 'task1' },
      body: { title: 'Updated Task', description: 'Updated description' },
    }
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() }

    await taskController.updateTaskStatus(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ message: 'Status is required!' })
  })

  it('should return 404 if updateTaskStatus is called with non-existent task', async () => {
    const req: any = {
      user: { id: 'user1' },
      params: { id: 'nonexistent' },
      body: { status: 'completed' },
    }
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() }

    mockTaskService.getTasksById.mockResolvedValue(null)

    await taskController.updateTaskStatus(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ message: 'Task not found!' })
  })

  it('should return 403 if updateTaskStatus is called with a task that belongs to another user', async () => {
    const req: any = {
      user: { id: 'user1' },
      params: { id: 'task1' },
      body: { status: 'completed' },
    }
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() }

    const mockTask = {
      id: 'task1',
      title: 'Task 1',
      description: 'Task description',
      userId: 'user2',
    }
    mockTaskService.getTasksById.mockResolvedValue(mockTask)

    await taskController.updateTaskStatus(req, res)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith({
      message: "You don't have permission to update this task!",
    })
  })

  it('should return 400 if updateTaskStatus fails to update the task', async () => {
    const req: any = {
      user: { id: 'user1' },
      params: { id: 'task1' },
      body: { status: 'completed' },
    }
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() }

    const mockTask = {
      id: 'task1',
      title: 'Task 1',
      description: 'Task description',
      userId: 'user1',
    }
    mockTaskService.getTasksById.mockResolvedValue(mockTask)
    mockTaskService.updateTaskStatus.mockResolvedValue(null)

    await taskController.updateTaskStatus(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ message: 'Failed to update task!' })
  })

  it('should return 200 if updateTaskStatus is successful', async () => {
    const req: any = {
      user: { id: 'user1' },
      params: { id: 'task1' },
      body: { status: 'completed' },
    }
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() }

    const mockTask = {
      id: 'task1',
      title: 'Task 1',
      description: 'Task description',
      userId: 'user1',
    }
    mockTaskService.getTasksById.mockResolvedValue(mockTask)
    mockTaskService.updateTaskStatus.mockResolvedValue(mockTask)

    await taskController.updateTaskStatus(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(mockTask)
  })

  it('should return 500 if there is an error during updateTaskStatus', async () => {
    const req: any = {
      user: { id: 'user1' },
      params: { id: 'task1' },
      body: { status: 'completed' },
    }
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() }

    const mockTask = {
      id: 'task1',
      title: 'Task 1',
      description: 'Task description',
      userId: 'user1',
    }
    mockTaskService.getTasksById.mockResolvedValue(mockTask)
    mockTaskService.updateTaskStatus.mockRejectedValue(new Error('Database error'))

    await taskController.updateTaskStatus(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' })
  })

  it('shoul return 404 if deleteTask is called with non-existent task', async () => {
    const req: any = { user: { id: 'user1' }, params: { id: 'nonexistent' } }
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() }

    mockTaskService.getTasksById.mockResolvedValue(null)

    await taskController.deleteTask(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ message: 'Task not found!' })
  })

  it('should return 403 if deleteTask is called with a task that belongs to another user', async () => {
    const req: any = { user: { id: 'user1' }, params: { id: 'task1' } }
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() }

    const mockTask = {
      id: 'task1',
      title: 'Task 1',
      description: 'Task description',
      userId: 'user2',
    }
    mockTaskService.getTasksById.mockResolvedValue(mockTask)

    await taskController.deleteTask(req, res)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith({
      message: "You don't have permission to delete this task!",
    })
  })

  it('should return 204 if deleteTask is successful', async () => {
    const req: any = { user: { id: 'user1' }, params: { id: 'task1' } }
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() }

    const mockTask = {
      id: 'task1',
      title: 'Task 1',
      description: 'Task description',
      userId: 'user1',
    }
    mockTaskService.getTasksById.mockResolvedValue(mockTask)

    await taskController.deleteTask(req, res)

    expect(res.status).toHaveBeenCalledWith(204)
    expect(res.send).toHaveBeenCalled()
  })

  it('should return 500 if there is an error during deleteTask', async () => {
    const req: any = { user: { id: 'user1' }, params: { id: 'task1' } }
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() }

    const mockTask = {
      id: 'task1',
      title: 'Task 1',
      description: 'Task description',
      userId: 'user1',
    }
    mockTaskService.getTasksById.mockResolvedValue(mockTask)
    mockTaskService.deleteTask.mockRejectedValue(new Error('Database error'))

    await taskController.deleteTask(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' })
  })
})
