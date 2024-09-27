import { Router } from 'express';
import fornecedoresModules from './roles/fornecedor/fornecedor.module';
import dannyModules from './roles/danny/danny.module';
const router = Router();

router.use('/fornecedor', fornecedoresModules);
router.use('/danny', dannyModules);

export default router;
