import { Router } from 'express';
import autenticacaoController from '../controllers/autenticacao.controller';
import authMiddleware from '@middlewares/auth.middleware';

const router = Router();

router.post('/registro', autenticacaoController.registrar);
router.post('/login', autenticacaoController.login);
router.post('/redefine-senha', autenticacaoController.redefinirSenha);
router.post('/carrega-sessao', authMiddleware, autenticacaoController.carregarSessao);
router.post('/email-redefinicao-senha', autenticacaoController.enviarEmailRedefinicaoSenha);
router.post('/confirma-cadastro', autenticacaoController.confirmarCadastro);

export default router;
