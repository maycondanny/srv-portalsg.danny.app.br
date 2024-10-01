import { Router } from 'express';
import estadosModule from './estados/routes/estado.route';

const router = Router();

router.use('/estados', estadosModule);
// router.use('/fornecedores', fornecedoresModule);
// router.use('/usuarios', usuariosModule);

export default router;
