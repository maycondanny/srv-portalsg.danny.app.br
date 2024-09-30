import { Router } from 'express';
import produtoController from '../controllers/produto.controller';

const router = Router();

router.get('/', produtoController.obterTodos);
router.get('/fornecedor', produtoController.obterTodosPorFornecedor);
router.post('/aprovacao', produtoController.aprovar);
router.post('/aprovacao-em-lote', produtoController.aprovarEmLote);
router.put('/', produtoController.atualizar);

export default router;
