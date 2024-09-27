import { Router } from 'express';
import familiaController from '../controllers/familia.controller';

const router = Router();

router.get('/', familiaController.obterTodas);

export default router;
