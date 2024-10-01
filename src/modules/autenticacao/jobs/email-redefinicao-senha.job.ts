import { Queue, Worker } from 'bullmq';
import connection from '@configs/queue.config';
import emailUtil from '@utils/email.util';
import path from 'path';
import dotenv from 'dotenv';
import fileUtil from '@utils/file.util';
import ErroException from '@exceptions/erro.exception';
dotenv.config();

const nome = 'AUTH_EmailRedefinicaoSenhaJob';

const queue = new Queue(nome, {
  connection,
  defaultJobOptions: {
    removeOnFail: true,
    removeOnComplete: true,
  },
});

queue.on('error', (erro) => {
  console.log(`Erro ao enviar o job para a fila ${nome}.`);
  console.log(erro);
});

const worker = new Worker(
  nome,
  async ({ data }) => {
    let { nome, email, token } = data;

    const link = `${process.env.APP_HOST}/fornecedores/redefinicao-senha?token=${token}`;

    try {
      const conteudoTemplate = await fileUtil.obterConteudo(
        path.join(__dirname, '..', 'templates'),
        'email-redefinicao-senha.html'
      );

      await emailUtil.enviar({
        assunto: 'Redefinição de senha – Danny cosméticos',
        destinatario: email,
        remetente: 'nao.responda@dannycosmeticos.com.br',
        corpo: obterTemplateCamposSubstituidos(conteudoTemplate, nome, link),
      });
    } catch (erro) {
      throw new ErroException('Erro ao enviar email de redefinição da senha');
    }
  },
  { connection, removeOnFail: { count: 0 }, removeOnComplete: { count: 0 } }
);

const obterTemplateCamposSubstituidos = (template, nome, link) => {
  template = template.replace('%NOME%', nome);
  template = template.replace('%LINK%', link);
  return template;
};

worker.on('error', (erro) => {
  console.log(`Erro ao processar o job ${nome}.`);
  console.log(erro);
});

export default {
  async add(data) {
    try {
      return await queue.add(nome, { ...data });
    } catch (erro) {
      console.log(erro);
      throw erro;
    }
  },
};
