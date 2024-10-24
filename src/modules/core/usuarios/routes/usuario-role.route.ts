import { Router } from 'express';
import usuarioRoleController from '../controllers/usuario-role.controller';

const router = Router();

router.get('/', usuarioRoleController.obterTodos);
router.post('/', usuarioRoleController.cadastrar);
router.put('/', usuarioRoleController.atualizar);
router.delete('/:id', usuarioRoleController.remover);

export default router;
