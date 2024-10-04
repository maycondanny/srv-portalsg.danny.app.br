import { Router } from 'express';
import grupoController from '../controllers/grupo.controller';

const router = Router();

router.get('/', grupoController.obterTodos);
router.post('/', grupoController.cadastrar);
router.put('/', grupoController.atualizar);
router.put('/ativar', grupoController.ativar);
router.put('/desativar', grupoController.desativar);
router.post('/obter-por-setores', grupoController.obterTodosPorSetores);

export default router;
