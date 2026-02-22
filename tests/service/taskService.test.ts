import { prismaClient } from "../../src/lib/database";
import { TaskService } from "../../src/service/taskService";

jest.mock('../../src/lib/database', () => ({
    prismaClient: {
        task: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    },
}));

describe('TaskService', () => {
    let taskService: TaskService;

    beforeEach(() => {
        taskService = new TaskService();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(taskService).toBeDefined();
    });

    it('should have methods', () => {
        expect(taskService.createTask).toBeDefined();
        expect(taskService.getAllTasks).toBeDefined();
        expect(taskService.getTasksById).toBeDefined();
        expect(taskService.updateTaskStatus).toBeDefined();
        expect(taskService.deleteTask).toBeDefined();
    });

    describe('createTask', () => {
        it('should create a task', async () => {
            const taskData = { title: 'Test Task', description: 'Test Description', userId: 'user123' };
            const createdTask = { id: 'task123', ...taskData, status: 'PENDING', created_at: new Date(), updated_at: new Date() };
            (prismaClient.task.create as jest.Mock).mockResolvedValue(createdTask);

            const result = await taskService.createTask(taskData);
            expect(prismaClient.task.create).toHaveBeenCalledWith({ data: taskData });
            expect(result).toEqual(createdTask);
        });

        it('should return null if task creation fails', async () => {
            const taskData = { title: 'Test Task', description: 'Test Description', userId: 'user123' };
            (prismaClient.task.create as jest.Mock).mockResolvedValue(null);

            const result = await taskService.createTask(taskData);
            expect(prismaClient.task.create).toHaveBeenCalledWith({ data: taskData });
            expect(result).toBeNull();
        });
    });

    describe('getAllTasks', () => {
        it('should return all tasks for a user', async () => {
            const userId = 'user123';
            const tasks = [
                { id: 'task1', title: 'Task 1', description: 'Description 1', status: 'PENDING', userId, created_at: new Date(), updated_at: new Date() },
                { id: 'task2', title: 'Task 2', description: 'Description 2', status: 'IN_PROGRESS', userId, created_at: new Date(), updated_at: new Date() },
            ];
            (prismaClient.task.findMany as jest.Mock).mockResolvedValue(tasks);

            const result = await taskService.getAllTasks(userId, {});
            expect(prismaClient.task.findMany).toHaveBeenCalledWith({
                where: { userId, status: undefined },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    status: true,
                    userId: true,
                    created_at: true,
                    updated_at: true,
                },
            });
            expect(result).toEqual(tasks);
        });

        it('should return an empty array if no tasks are found', async () => {
            const userId = 'user123';
            (prismaClient.task.findMany as jest.Mock).mockResolvedValue(null);

            const result = await taskService.getAllTasks(userId, {});
            expect(prismaClient.task.findMany).toHaveBeenCalledWith({
                where: { userId, status: undefined },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    status: true,
                    userId: true,
                    created_at: true,
                    updated_at: true,
                },
            });
            expect(result).toEqual([]);
        });
    });

    describe('getTasksById', () => {
        it('should return a task by ID', async () => {
            const taskId = 'task123';
            const task = { id: taskId, title: 'Test Task', description: 'Test Description', status: 'PENDING', userId: 'user123', created_at: new Date(), updated_at: new Date() };
            (prismaClient.task.findUnique as jest.Mock).mockResolvedValue(task);

            const result = await taskService.getTasksById(taskId);
            expect(prismaClient.task.findUnique).toHaveBeenCalledWith({
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
            });
            expect(result).toEqual(task);
        });

        it('should return null if task is not found', async () => {
            const taskId = 'task123';
            (prismaClient.task.findUnique as jest.Mock).mockResolvedValue(null);

            const result = await taskService.getTasksById(taskId);
            expect(prismaClient.task.findUnique).toHaveBeenCalledWith({
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
            });
            expect(result).toBeNull();
        });
    });

    describe('updateTaskStatus', () => {
        it('should update a task status', async () => {
            const taskId = 'task123';
            const updateData = { taskId, status: 'COMPLETED' as any, userId: 'user123' };
            const updatedTask = { id: taskId, title: 'Test Task', description: 'Test Description', status: 'COMPLETED', userId: 'user123', created_at: new Date(), updated_at: new Date() };
            (prismaClient.task.update as jest.Mock).mockResolvedValue(updatedTask);

            const result = await taskService.updateTaskStatus(updateData);
            expect(prismaClient.task.update).toHaveBeenCalledWith({
                where: { id: taskId },
                data: {
                    status: 'COMPLETED',
                },
            });
            expect(result).toEqual(updatedTask);
        });

        it('should return null if task update fails', async () => {
            const taskId = 'task123';
            const updateData = { taskId, status: 'COMPLETED' as any, userId: 'user123' };
            (prismaClient.task.update as jest.Mock).mockResolvedValue(null);

            const result = await taskService.updateTaskStatus(updateData);
            expect(prismaClient.task.update).toHaveBeenCalledWith({
                where: { id: taskId },
                data: {
                    title: undefined,
                    description: undefined,
                    status: 'COMPLETED',
                },
            });
            expect(result).toBeNull();
        });
    });

    describe('deleteTask', () => {
        it('should delete a task', async () => {
            const taskId = 'task123';
            const deletedTask = { id: taskId, title: 'Test Task', description: 'Test Description', status: 'PENDING', userId: 'user123', created_at: new Date(), updated_at: new Date() };
            (prismaClient.task.delete as jest.Mock).mockResolvedValue(deletedTask);

            const result = await taskService.deleteTask(taskId);
            expect(prismaClient.task.delete).toHaveBeenCalledWith({ where: { id: taskId } });
            expect(result).toEqual(deletedTask);
        });

        it('should return null if task deletion fails', async () => {
            const taskId = 'task123';
            (prismaClient.task.delete as jest.Mock).mockResolvedValue(null);

            const result = await taskService.deleteTask(taskId);
            expect(prismaClient.task.delete).toHaveBeenCalledWith({ where: { id: taskId } });
            expect(result).toBeNull();
        });
    });
});