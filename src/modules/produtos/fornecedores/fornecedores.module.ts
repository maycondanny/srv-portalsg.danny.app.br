import { Router } from 'express';
import importacaoRoutes from './routes/importacao.route';

const router = Router();

router.use('/importacao', importacaoRoutes);

export default router;