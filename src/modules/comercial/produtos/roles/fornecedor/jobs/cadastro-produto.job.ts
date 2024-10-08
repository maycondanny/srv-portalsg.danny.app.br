import produtoEcommerceService from '@modules/comercial/ecommerce/services/produto.service';
import { Queue, Worker } from 'bullmq';
import connection from '@configs/queue.config';
import produtoService from '@modules/comercial/produtos/services/produto.service';
import cacheUtil, { ETempoExpiracao } from '@utils/cache.util';
import { CODIGO_REFERENCIA_FORNECEDOR_CACHE } from '@modules/comercial/produtos/models/produto.model';

const nome = 'CPF_CadastroProdutoJob';

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
    const referencia = produto.codigo_produto_fornecedor;
    const produtoId = await produtoService.cadastrar(produto);

    await produtoEcommerceService.cadastrar({
      caracteristica: produto.ecommerce.caracteristica,
      descricao: produto.ecommerce.descricao,
      eans: produto.eans,
      fornecedor_id: produto.fornecedor_id,
      imagens: produto.ecommerce.imagens,
      modo_uso: produto.ecommerce.modo_uso,
      nome: produto.descritivo_pdv,
      produto_id: produtoId,
    });

    await cacheUtil.add(
      `${CODIGO_REFERENCIA_FORNECEDOR_CACHE}_${produto.fornecedor_id}_${referencia}`,
      referencia,
      ETempoExpiracao.UMA_SEMANA
    );
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
