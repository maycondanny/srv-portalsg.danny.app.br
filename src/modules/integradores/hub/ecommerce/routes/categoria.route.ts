import { Router } from 'express';
import categoriaController from '../controllers/categoria.controller';

const router = Router();

router.get('/', categoriaController.obterTodas);

export default router;
