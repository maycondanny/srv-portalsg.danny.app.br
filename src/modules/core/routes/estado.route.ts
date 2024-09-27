import { Router } from 'express';
import estadoController from '../controllers/estado.controller';

const router = Router();

router.get('/', estadoController.obterTodos);

export default router;
