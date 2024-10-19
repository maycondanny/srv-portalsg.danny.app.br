import { Router } from 'express';
import usuarioController from '../controllers/usuario.controller';

const router = Router();

router.get('/', usuarioController.obterTodos);
router.post('/', usuarioController.cadastrar);
router.put('/', usuarioController.atualizar);
router.put('/troca-senha-primeiro-acesso', usuarioController.trocarSenhaPrimeiroAcesso);
router.get('/onlines', usuarioController.obterTodosOnline);

export default router;
