import { Router } from 'express';
import marcaRoutes from './routes/marca.route';
import categoriaRoutes from './routes/categoria.route';
import produtoRoutes from './routes/produto.route';

const router = Router();

router.use('/marcas', marcaRoutes);
router.use('/categorias', categoriaRoutes);
router.use('/produtos', produtoRoutes);

export default router;
