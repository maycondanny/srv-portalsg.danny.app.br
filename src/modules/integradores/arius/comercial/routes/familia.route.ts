import { Router } from 'express';
import familiaController from '../controllers/familia.controller';

const router = Router();

router.get('/:id', familiaController.obterPorId);
router.post('/', familiaController.cadastrar);

export default router;
