import { Router } from 'express';
import produtoController from '../controllers/produto.controller';

const router = Router();

router.post('/', produtoController.cadastrar);

export default router;
