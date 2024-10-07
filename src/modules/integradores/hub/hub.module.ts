import { Router } from 'express';
import fornecedoresModule from './fornecedores/fornecedores.module';
import ecommerceModule from './ecommerce/ecommerce.module';
import produtosModule from './produtos/produtos.module';
import authMiddleware from '@middlewares/auth.middleware';

const router = Router();

router.use('/fornecedores', fornecedoresModule);
router.use('/ecommerce', authMiddleware, ecommerceModule);
router.use('/produtos', authMiddleware, produtosModule);

export default router;
