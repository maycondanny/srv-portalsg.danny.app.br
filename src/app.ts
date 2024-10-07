import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import comercialModule from './modules/comercial/comercial.module';
import integradoresModule from './modules/integradores/integradores.module';
import autenticacaoModule from './modules/autenticacao/autenticacao.module';
import coreModule from './modules/core/core.module';
import httpStatusEnum from '@enums/http-status.enum';
import authMiddleware from '@middlewares/auth.middleware';
dotenv.config();

if (process.env.NODE_ENV === 'production') {
  require('module-alias/register');
}

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/autenticacao', autenticacaoModule);
app.use('/api/comercial', authMiddleware, comercialModule);
app.use('/api/integradores', authMiddleware, integradoresModule);
app.use('/api/core', authMiddleware, coreModule);

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`);
});

app.use((error, req, res, next) => {
  const codigo = error.codigo || httpStatusEnum.Status.ERRO_INTERNO_SERVIDOR;
  return res.status(codigo).json({
    nome: error.name,
    codigo: codigo,
    mensagem: error.message,
    dados: error.dados,
    stacktrace: error.stack,
  });
});
