import { Router } from 'express';
import endpointsModule from './endpoints/endpoints.module';

const router = Router();

router.use('/', endpointsModule);

export default router;
