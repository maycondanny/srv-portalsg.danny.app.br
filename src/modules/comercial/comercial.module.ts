import { Router } from 'express';
import produtosModules from './produtos/produtos.module';
const router = Router();

router.use('/produtos', produtosModules);

export default router;
