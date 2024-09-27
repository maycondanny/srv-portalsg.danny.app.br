import { Router } from 'express';
import multer from 'multer';
import importacaoController from '../controllers/importacao.controller';

const router = Router();
const upload = multer();

router.post('/', upload.single('planilha'), importacaoController.importar);

export default router;
