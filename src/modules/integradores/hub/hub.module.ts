import { Router } from 'express';
import fornecedoresModule from './fornecedores/fornecedores.module';
import ecommerceModule from './ecommerce/ecommerce.module';
import produtosModule from './produtos/produtos.module';

const router = Router();

router.use('/fornecedores', fornecedoresModule);
router.use('/ecommerce', ecommerceModule);
router.use('/produtos', produtosModule);

export default router;
