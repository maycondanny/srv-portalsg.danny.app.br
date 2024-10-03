import { Router } from 'express';
import produtoController from '../controllers/produto.controller';

const router = Router();

router.get('/', produtoController.obterTodos);

export default router;
