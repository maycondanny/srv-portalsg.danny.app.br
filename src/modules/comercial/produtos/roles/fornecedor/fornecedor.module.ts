import { Router } from 'express';
import importacaoRoutes from './routes/importacao.route';
import produtosRoutes from './routes/produtos.route';

const router = Router();

router.use('/importacao', importacaoRoutes);
router.use('/produtos', produtosRoutes);

export default router;
