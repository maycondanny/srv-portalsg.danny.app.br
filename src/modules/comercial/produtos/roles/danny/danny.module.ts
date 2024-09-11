import { Router } from 'express';
import produtosRoutes from './routes/produtos.route';

const router = Router();

router.use('/produtos', produtosRoutes);

export default router;
