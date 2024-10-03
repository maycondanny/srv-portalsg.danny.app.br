import { Router } from "express";
import acessoRoutes from './routes/acesso.route';

const router = Router();

router.use('/acessos', acessoRoutes);

export default router;
