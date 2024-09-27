import { Queue, Worker } from 'bullmq';
import connection from '@configs/queue.config';
import produtoService from '@modules/comercial/ecommerce/services/produto.service';

const nome = 'COM_Fornecedor_CadastroProdutoEcommerceJob';

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
    let { produto } = data;
    await produtoService.cadastrar(produto);
  },
  { connection, removeOnFail: { count: 0 }, removeOnComplete: { count: 0 } }
);

worker.on('error', (erro) => {
  console.log(`Erro ao processar o job ${nome}.`);
  console.log(erro);
});

export default {
  async add(data) {
    try {
      return await queue.add(nome, { ...data });
    } catch (erro) {
      throw erro;
    }
  },
};
