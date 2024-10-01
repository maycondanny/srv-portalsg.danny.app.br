import { Router } from 'express';
import autenticacaoRoutes from './routes/autenticacao.route';
const router = Router();

router.use('/', autenticacaoRoutes);

export default router;
