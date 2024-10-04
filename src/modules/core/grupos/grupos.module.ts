import { Router } from "express";
import grupoRoutes from './routes/grupo.route';

const router = Router();

router.use('/', grupoRoutes);

export default router;
