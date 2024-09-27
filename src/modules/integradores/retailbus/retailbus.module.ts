import { Router } from 'express';
import endpointsModule from './endpoints/endpoints.module';

const router = Router();

router.use('/endpoints', endpointsModule);

export default router;
