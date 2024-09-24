import { Router } from 'express';
import marcaController from '../controllers/marca.controller';

const router = Router();

router.get('/', marcaController.obterTodas);

export default router;
