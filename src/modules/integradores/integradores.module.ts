import { Router } from 'express';
import retailbusModule from './retailbus/retailbus.module';
import biModule from './bi/bi.module';
import hubModule from './hub/hub.module';
import ariusModule from './arius/arius.module';

const router = Router();

router.use('/retailbus', retailbusModule);
router.use('/bi', biModule);
router.use('/hub', hubModule);
router.use('/arius', ariusModule);

export default router;
