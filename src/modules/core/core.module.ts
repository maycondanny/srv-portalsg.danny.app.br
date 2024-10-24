import { Router } from 'express';
import estadosModule from './estados/estados.module';
import usuariosModule from './usuarios/usuarios.module';
import setoresModule from './setores/setores.module';
import iconesModule from './icones/icones.module';
import avisosModule from './avisos/avisos.module';
import modulosModule from './modulos/modulos.module';
import submodulosModule from './submodulos/submodulos.module';

const router = Router();

router.use('/estados', estadosModule);
router.use('/usuarios', usuariosModule);
router.use('/setores', setoresModule);
router.use('/icones', iconesModule);
router.use('/avisos', avisosModule);
router.use('/modulos', modulosModule);
router.use('/submodulos', submodulosModule);

export default router;
