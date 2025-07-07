import { Router } from 'express';
import { createTask, getTaskById } from '../controllers/tasks';
import { taskGetValidator } from '../validators/taskGet.validator';
import { taskPostValidator } from '../validators/taskPost.validator';

export default function tasksRoutes() {
  const router: Router = Router();

  router.post('/tasks', taskPostValidator, createTask);
  router.get('/tasks/:id', taskGetValidator, getTaskById);

  return router;
}
