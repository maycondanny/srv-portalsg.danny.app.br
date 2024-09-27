import { Router } from 'express';
import compradorController from '../controllers/comprador.controller';

const router = Router();

router.get('/', compradorController.obterTodos);

export default router;
