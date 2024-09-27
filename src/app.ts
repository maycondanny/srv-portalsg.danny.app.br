import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import comercialModule from './modules/comercial/comercial.module';
import integradoresModule from './modules/integradores/integradores.module';
import coreModule from './modules/core/core.module';
import httpStatusEnum from '@enums/http-status.enum';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/comercial', comercialModule);
app.use('/api/integradores', integradoresModule);
app.use('/api/core', coreModule);

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
    stacktrace: error.stack
  });
});
