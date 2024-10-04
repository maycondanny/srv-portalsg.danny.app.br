import { Router } from 'express';
import setorController from '../controllers/setor.controller';

const router = Router();

router.get('/', setorController.obterTodos);
router.post('/', setorController.cadastrar);
router.put('/', setorController.atualizar);
router.put('/ativar', setorController.ativar);
router.put('/desativar', setorController.desativar);

export default router;
