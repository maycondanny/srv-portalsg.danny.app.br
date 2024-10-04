import { Router } from "express";
import acessoRoutes from './routes/acesso.route';

const router = Router();

router.use('/', acessoRoutes);

export default router;
