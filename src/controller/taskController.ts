import { Request, Response } from 'express'
import { TaskService } from '../service/taskService'
import { AuthRequest } from '../middleware/auth'
import {
  CreateTaskDTO,
  UpdateTaskBodyDTO,
  ListTaskQueryDTO,
  GetTaskByIdParamsDTO,
  DeleteTaskParamsDTO,
} from 'src/schema/task.schema'
import logger from '../logger'

export class TaskController {
  constructor() {}

  static async createTask(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id
      const { title, description }: CreateTaskDTO = req.body

      if (!title) {
        return res.status(400).json({ message: 'Title is required!' })
      }

      const task = await TaskService.createTask({
        title,
        description,
        userId,
      })

      if (!task) {
        return res.status(400).json({ message: 'Failed to create task!' })
      }

      logger.info(`Task created: ${task.title}`)
      return res.status(201).json(task)
    } catch (error: any) {
      logger.error(`[TaskController.createTask] Error: ${error.message}`)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  static async getAllTasks(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id
      const { status, page, pageSize }: ListTaskQueryDTO = req.query
      const tasks = await TaskService.getAllTasks(userId, { status, page, pageSize })
      return res.status(200).json(tasks)
    } catch (error: any) {
      logger.error(`[TaskController.getAllTasks] Error: ${error.message}`)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  static async getTasksById(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id
      const { id: taskId } = req.params as GetTaskByIdParamsDTO
      const task = await TaskService.getTasksById(taskId)
      if (!task) {
        return res.status(404).json({ message: 'Task not found!' })
      }
      if (task.userId !== userId) {
        return res.status(403).json({ message: "You don't have permission to access this task!" })
      }
      return res.status(200).json(task)
    } catch (error: any) {
      logger.error(`[TaskController.getTasksById] Error: ${error.message}`)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  static async updateTaskStatus(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id
      const { id: taskId } = req.params as GetTaskByIdParamsDTO
      const { title, description, status }: UpdateTaskBodyDTO = req.body

      if (!status) {
        return res.status(400).json({ message: 'Status is required!' })
      }

      const task = await TaskService.getTasksById(taskId)
      if (!task) {
        return res.status(404).json({ message: 'Task not found!' })
      }
      if (task.userId !== userId) {
        return res.status(403).json({ message: "You don't have permission to update this task!" })
      }

      const updatedTask = await TaskService.updateTaskStatus({
        taskId,
        title,
        description,
        userId,
        status,
      })

      if (!updatedTask) {
        return res.status(400).json({ message: 'Failed to update task!' })
      }

      logger.info(`Task updated: ${updatedTask.title}`)
      return res.status(200).json(updatedTask)
    } catch (error: any) {
      logger.error(`[TaskController.updateTaskStatus] Error: ${error.message}`)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  static async deleteTask(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id
      const { id: taskId } = req.params as DeleteTaskParamsDTO

      const task = await TaskService.getTasksById(taskId)
      if (!task) {
        return res.status(404).json({ message: 'Task not found!' })
      }
      if (task.userId !== userId) {
        return res.status(403).json({ message: "You don't have permission to delete this task!" })
      }

      await TaskService.deleteTask(taskId)

      logger.info(`Task deleted: ${task.title}`)
      return res.status(204).send()
    } catch (error: any) {
      logger.error(`[TaskController.deleteTask] Error: ${error.message}`)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}
