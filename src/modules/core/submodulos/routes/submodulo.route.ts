import { Router } from 'express';
import submoduloController from '../controllers/submodulo.controller';

const router = Router();

router.post('/', submoduloController.cadastrar);
router.put('/', submoduloController.atualizar);
router.get('/', submoduloController.obterTodos);
router.delete('/:id', submoduloController.remover);
router.delete('/modulo/:modulo_id', submoduloController.removerPorModuloId);

export default router;
