import { Router } from "express";
import usuarioRoutes from './routes/icone.route';

const router = Router();

router.use('/', usuarioRoutes);

export default router;
