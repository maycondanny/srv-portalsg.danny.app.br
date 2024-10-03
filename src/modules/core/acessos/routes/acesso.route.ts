import { Router } from 'express';
import acessoController from '../controllers/acesso.controller';

const router = Router();

router.get('/', acessoController.obterTodos);
router.post('/', acessoController.cadastrar);
router.put('/', acessoController.atualizar);
router.put('/ativar', acessoController.ativar);
router.put('/desativar', acessoController.desativar);
router.post('/obter-por-setores', acessoController.obterTodosPorSetores);

export default router;
