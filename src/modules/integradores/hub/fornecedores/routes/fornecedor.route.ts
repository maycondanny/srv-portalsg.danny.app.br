import { Router } from 'express';
import fornecedorController from '../controllers/fornecedor.controller';

const router = Router();

router.get('/', fornecedorController.obterPorCnpj);

export default router;
