import { Router } from 'express';
import departamentoRoutes from './routes/departamento.route';
import marcaRoutes from './routes/marca.route';

const router = Router();

router.use('/departamentos', departamentoRoutes);
router.use('/marcas', marcaRoutes);

export default router;
