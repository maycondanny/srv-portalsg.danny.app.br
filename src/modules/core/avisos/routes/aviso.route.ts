import { Router } from 'express';
import avisoController from '../controllers/aviso.controller';

const router = Router();

router.get('/', avisoController.obterTodos);
router.get('/ativo', avisoController.obterAtivo);
router.post('/', avisoController.cadastrar);

export default router;
