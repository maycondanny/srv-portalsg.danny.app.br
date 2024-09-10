import { Router } from 'express';
import produtoController from '../controllers/produto.controller';

const router = Router();

router.post('/', produtoController.cadastrar);
router.get('/', produtoController.obterTodos);
router.get('/:id', produtoController.obterPorId);

export default router;
