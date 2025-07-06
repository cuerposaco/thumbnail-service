import { Router } from 'express';
import { createTask, getTaskById } from '../controllers/tasks';

export default function tasksRoutes() {
  const router: Router = Router();

  router.post('/tasks', createTask);
  router.get('/tasks/:id', getTaskById);

  return router;
}
