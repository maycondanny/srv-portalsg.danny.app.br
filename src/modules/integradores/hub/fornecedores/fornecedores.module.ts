import { Router } from 'express';
import fornecedorRoutes from './routes/fornecedor.route';

const router = Router();

router.use('/', fornecedorRoutes);

export default router;
