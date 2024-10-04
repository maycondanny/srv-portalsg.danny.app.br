import { Router } from "express";
import usuarioRoutes from './routes/usuario.route';
import usuarioRoleRoutes from './routes/usuario-role.route';

const router = Router();

router.use('/', usuarioRoutes);
router.use('/roles', usuarioRoleRoutes);

export default router;
