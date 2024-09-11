import { Router } from 'express';
import fornecedoresModules from './roles/fornecedores/fornecedores.module';
import dannyModules from './roles/danny/danny.module';
const router = Router();

router.use('/fornecedores', fornecedoresModules);
router.use('/danny', dannyModules);

export default router;
