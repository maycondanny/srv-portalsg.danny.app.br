import { Router } from "express";
import setorRoutes from './routes/setor.route';

const router = Router();

router.use('/', setorRoutes);

export default router;
