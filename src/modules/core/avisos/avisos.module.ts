import { Router } from "express";
import avisoRoutes from './routes/aviso.route';

const router = Router();

router.use('/', avisoRoutes);

export default router;
