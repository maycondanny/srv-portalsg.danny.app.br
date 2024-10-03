import { Router } from 'express';
import familiaRoutes from './routes/familia.route';

const router = Router();

router.use('/familias', familiaRoutes);

export default router;
