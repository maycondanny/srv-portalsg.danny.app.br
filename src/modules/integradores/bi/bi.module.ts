import { Router } from 'express';
import dashboardRoutes from './routes/dashboard.route';

const router = Router();

router.use('/dashboard', dashboardRoutes);

export default router;
