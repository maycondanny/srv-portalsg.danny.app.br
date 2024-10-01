import { Router } from 'express';
import fornecedoresModule from './fornecedores/fornecedores.module';

const router = Router();

router.use('/fornecedores', fornecedoresModule);

export default router;
