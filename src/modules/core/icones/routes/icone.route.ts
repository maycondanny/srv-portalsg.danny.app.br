import { Router } from 'express';
import iconeController from '../controllers/icone.controller';

const router = Router();

router.get('/', iconeController.obterTodos);
router.get('/:id', iconeController.obterPorId);
router.post('/', iconeController.cadastrar);

export default router;
