import { Router } from 'express';
import autenticacaoController from '../controllers/autenticacao.controller';

const router = Router();

router.post('/registro', autenticacaoController.registrar);
router.post('/login', autenticacaoController.login);
router.post('/redefine-senha', autenticacaoController.redefinirSenha);
router.post('/carrega-sessao', autenticacaoController.carregarSessao);
router.post('/email-redefinicao-senha', autenticacaoController.enviarEmailRedefinicaoSenha);

export default router;
