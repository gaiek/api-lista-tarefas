import { Router } from 'express'
import { UserController } from '../controller/userController'
import { AuthController } from '../controller/authController'
import { TaskController } from '../controller/taskController'
import { authenticate } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { createUserSchema, loginUserSchema } from '../schema/user.schema'
import {
  createTaskSchema,
  updateTaskSchema,
  listTaskSchema,
  getListTaskByIdSchema,
  deleteTaskSchema,
} from '../schema/task.schema'

const routes = Router()
/**
 * @swagger
 * /me:
 *   get:
 *     summary: Retorna as informações do usuário autenticado
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sucesso. Retorna as informações do usuário.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *       404:
 *         description: Usuário não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Erro interno do servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
routes.get('/me', authenticate, UserController.getMe)

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserDTO'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       409:
 *         description: Email já em uso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Erro interno do servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
routes.post('/auth/register', validate(createUserSchema), AuthController.register)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza o login de um usuário existente
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUserDTO'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       401:
 *         description: Credenciais inválidas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Erro interno do servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
routes.post('/auth/login', validate(loginUserSchema), AuthController.login)

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Cria uma nova tarefa para o usuário autenticado
 *     tags:
 *       - Task
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskDTO'
 *     responses:
 *       201:
 *         description: Tarefa criada com sucesso.
 *       400:
 *         description: Requisição inválida.
 *       401:
 *         description: Acesso não autorizado.
 *       500:
 *         description: Erro interno do servidor.
 */
routes.post('/tasks', authenticate, validate(createTaskSchema), TaskController.createTask)

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Retorna todas as tarefas do usuário autenticado
 *     tags:
 *       - Task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, IN_PROGRESS, COMPLETED]
 *         description: Filtra tarefas por status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tarefas retornadas com sucesso.
 *       500:
 *         description: Erro interno do servidor.
 */
routes.get('/tasks', authenticate, validate(listTaskSchema), TaskController.getAllTasks)

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Retorna uma tarefa específica do usuário autenticado
 *     tags:
 *       - Task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da tarefa
 *     responses:
 *       200:
 *         description: Tarefa retornada com sucesso.
 *       403:
 *         description: Acesso negado.
 *       404:
 *         description: Tarefa não encontrada.
 *       500:
 *         description: Erro interno do servidor.
 */
routes.get('/tasks/:id', authenticate, validate(getListTaskByIdSchema), TaskController.getTasksById)

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Atualiza o status de uma tarefa específica do usuário autenticado
 *     tags:
 *       - Task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da tarefa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTaskBodyDTO'
 *     responses:
 *       200:
 *         description: Tarefa atualizada com sucesso.
 *       400:
 *         description: Requisição inválida.
 *       403:
 *         description: Acesso negado.
 *       404:
 *         description: Tarefa não encontrada.
 *       500:
 *         description: Erro interno do servidor.
 */
routes.put('/tasks/:id', authenticate, validate(updateTaskSchema), TaskController.updateTaskStatus)

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Deleta uma tarefa específica do usuário autenticado
 *     tags:
 *       - Task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da tarefa
 *     responses:
 *       204:
 *         description: Tarefa deletada com sucesso.
 *       403:
 *         description: Acesso negado.
 *       404:
 *         description: Tarefa não encontrada.
 *       500:
 *         description: Erro interno do servidor.
 */
routes.delete('/tasks/:id', authenticate, validate(deleteTaskSchema), TaskController.deleteTask)


export default routes
