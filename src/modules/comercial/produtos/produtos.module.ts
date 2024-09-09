import { Router } from 'express';
import fornecedoresModules from './roles/fornecedores/fornecedores.module';
const router = Router();

router.use('/fornecedores', fornecedoresModules);

export default router;
