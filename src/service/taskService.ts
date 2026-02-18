import { prismaClient } from '../lib/database'
import logger from '../logger'
import { Status } from '../generated/prisma/enums'

export class TaskService {
  static async createTask(data: { title: string; description?: string; userId: string }) {
    const task = await prismaClient.task.create({
      data: {
        title: data.title,
        description: data.description,
        userId: data.userId,
      },
    })

    if (!task) {
      logger.info(`Task ${data} not created`)
      return null
    }

    return task
  }

  static async getAllTasks(
    userId: string,
    options: { status?: Status; page?: number; pageSize?: number },
  ) {
    const tasks = await prismaClient.task.findMany({
      where: {
        userId,
        status: options.status,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        userId: true,
        created_at: true,
        updated_at: true,
      },
    })

    if (!tasks) {
      logger.info(`No tasks found`)
      return []
    }

    return tasks
  }

  static async getTasksById(taskId: string) {
    const task = await prismaClient.task.findUnique({
      where: { id: taskId },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        userId: true,
        created_at: true,
        updated_at: true,
      },
    })

    if (!task) {
      logger.info(`No task found for id ${taskId}`)
      return null
    }

    return task
  }

  static async updateTaskStatus(data: {
    taskId: string
    title?: string
    description?: string
    userId: string
    status?: Status
  }) {
    const task = await prismaClient.task.update({
      where: { id: data.taskId },
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
      },
    })

    if (!task) {
      logger.info(`Task with id ${data.taskId} not found for update`)
      return null
    }

    return task
  }

  static async deleteTask(taskId: string) {
    const task = await prismaClient.task.delete({
      where: { id: taskId },
    })

    if (!task) {
      logger.info(`Task with id ${taskId} not found for deletion`)
      return null
    }

    return task
  }
}
