import { Router } from "express";
import moduloRoutes from './routes/submodulo.route';

const router = Router();

router.use('/', moduloRoutes);

export default router;
