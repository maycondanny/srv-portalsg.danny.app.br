import { Queue, Worker } from 'bullmq';
import connection from '@configs/queue.config';
import produtoService from '@modules/comercial/ecommerce/services/produto.service';
import cadastraEcommerceAriusService from '../services/gateways/cadastra-ecommerce-arius.service';
import aprovacaoService from '../services/aprovacao.service';

const nome = 'COM_Danny_CadastraProdutosEcommerceAriusEmLoteJob';

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
    const { produto } = data;
    try {
      cadastraEcommerceAriusService.cadastrar(produto);
      aprovacaoService.salvarImagens(produto);
      cadastraEcommerceAriusService.atualizarBaseDados(produto);
    } catch (erro) {
      throw erro;
    }
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