import { Router } from 'express';
import estadosModule from './estados/routes/estado.route';
import acessosModule from './acessos/routes/acesso.route';

const router = Router();

router.use('/estados', estadosModule);
router.use('/acessos', acessosModule);
// router.use('/fornecedores', fornecedoresModule);
// router.use('/usuarios', usuariosModule);

export default router;
