import { Router } from 'express';
import produtosModules from './produtos/produtos.module';
import ecommerceModules from './ecommerce/ecommerce.module';
const router = Router();

router.use('/produtos', produtosModules);
router.use('/ecommerce', ecommerceModules);

export default router;
