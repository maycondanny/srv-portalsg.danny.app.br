import { Router } from 'express';
import retailbusModule from './retailbus/retailbus.module';
const router = Router();

router.use('/retailbus', retailbusModule);

export default router;
