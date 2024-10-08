import { Router } from 'express';
import retailbusModule from './retailbus/retailbus.module';
import biModule from './bi/bi.module';
import hubModule from './hub/hub.module';
import ariusModule from './arius/arius.module';
import authMiddleware from '@middlewares/auth.middleware';

const router = Router();

router.use('/retailbus', authMiddleware, retailbusModule);
router.use('/bi', authMiddleware, biModule);
router.use('/hub', hubModule);
router.use('/arius', authMiddleware, ariusModule);

export default router;
