import { Router } from 'express';
import usuarioRoleController from '../controllers/usuario-role.controller';

const router = Router();

router.get('/', usuarioRoleController.obterTodos);

export default router;
