import { Router } from 'express';

export default function mainRouter() {
  const router: Router = Router();

  router.get('/', (req, res) => {
    res.status(200).send({ data: 'Hello World!' });
  });

  return router;
}
