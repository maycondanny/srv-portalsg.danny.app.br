import { Router } from 'express';
import moduloController from '../controllers/modulo.controller';

const router = Router();

router.get('/', moduloController.obterTodos);
router.post('/', moduloController.cadastrar);
router.delete('/:id', moduloController.remover);
router.put('/', moduloController.atualizar);
router.post('/obter-por-ids', moduloController.obterPorIds);
// router.put('/troca-senha-primeiro-acesso', usuarioController.trocarSenhaPrimeiroAcesso);
// router.get('/onlines', usuarioController.obterTodosOnline);

export default router;
