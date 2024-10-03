import { Router } from 'express';
import comercialModule from './comercial/comercial.module';

const router = Router();

router.use('/comercial', comercialModule);

export default router;
