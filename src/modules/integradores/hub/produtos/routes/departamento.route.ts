import { Router } from 'express';
import departamentoController from '../controllers/departamento.controller';

const router = Router();

router.get('/', departamentoController.obterTodos);

export default router;
