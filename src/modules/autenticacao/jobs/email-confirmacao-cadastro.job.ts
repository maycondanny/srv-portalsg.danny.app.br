import { Queue, Worker } from 'bullmq';
import connection from '@configs/queue.config';
import emailUtil from '@utils/email.util';
import path from 'path';
import dotenv from 'dotenv';
import ErroException from '@exceptions/erro.exception';
import fileUtil from '@utils/file.util';
dotenv.config();

const nome = 'AUTH_EmailConfirmacaoCadastroJob';

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

    const link = `${process.env.APP_HOST}/fornecedores/confirmacao-cadastro?token=${token}`;

    try {
      const conteudoTemplate = await fileUtil.obterConteudo(
        path.join(__dirname, '..', 'templates'),
        'email-confirmacao-cadastro.template.html'
      );

      await emailUtil.enviar({
        assunto: 'Confirmação de Cadastro – Danny cosméticos',
        destinatario: email,
        remetente: 'nao.responda@dannycosmeticos.com.br',
        corpo: obterTemplateCamposSubstituidos(conteudoTemplate, nome, link),
        anexos: [
          { path: path.join(process.cwd(), 'public', 'docs', 'Importação de Produtos Cadastro Geral.pdf'), filename: 'Importação de Produtos Cadastro Geral.pdf' },
          { path: path.join(process.cwd(), 'public', 'docs', 'Importação de Produtos no Ecommerce.pdf'), filename: 'Importação de Produtos no Ecommerce.pdf' },
        ],
      });
    } catch (erro) {
      throw new ErroException('Erro ao enviar email de confirmação de cadastro');
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
