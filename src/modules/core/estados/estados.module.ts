import { Router } from "express";
import estadoRoutes from './routes/estado.route';

const router = Router();

router.use('/', estadoRoutes);

export default router;
