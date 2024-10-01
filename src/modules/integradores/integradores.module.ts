import { Router } from 'express';
import retailbusModule from './retailbus/retailbus.module';
import biModule from './bi/bi.module';
import hubModule from './hub/hub.module';

const router = Router();

router.use('/retailbus', retailbusModule);
router.use('/bi', biModule);
router.use('/hub', hubModule);

export default router;
