import { Router } from 'express';

export default function mainRouter() {
  const router: Router = Router();

  router.get('/', (req, res) => {
    res.send('Hello World');
  });

  return router;
}
