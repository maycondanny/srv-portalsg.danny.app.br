import { Router } from 'express';
import compradorRoutes from './routes/comprador.route';
import familiaRoutes from './routes/familia.route';
import marcaRoutes from './routes/marca.route';

const router = Router();

router.use('/compradores', compradorRoutes);
router.use('/familias', familiaRoutes);
router.use('/marcas', marcaRoutes);

export default router;
