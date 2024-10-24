import { Router } from "express";
import moduloRoutes from './routes/modulo.route';

const router = Router();

router.use('/', moduloRoutes);

export default router;
