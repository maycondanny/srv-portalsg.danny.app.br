import { Router } from 'express';
import importacaoController from '../controllers/importacao.controller';
const router = Router();

router.post('/', importacaoController.importar);

export default router;