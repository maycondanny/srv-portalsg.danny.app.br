import { Queue, Worker } from "bullmq";
import connection from "@configs/queue.config";
import produtoMapper from "../mappers/produto.mapper";
import produtoService from "@modules/comercial/produtos/services/produto.service";
import cacheUtil, { ETempoExpiracao } from "@utils/cache.util";
import { CODIGO_REFERENCIA_FORNECEDOR_CACHE } from "@modules/comercial/produtos/models/produto.model";

const nome = "CPF_CadastroProdutoJob";

const queue = new Queue(nome, {
  connection,
  defaultJobOptions: {
    removeOnFail: true,
    removeOnComplete: true,
  },
});

queue.on("error", (erro) => {
  console.log(`Erro ao enviar o job para a fila ${nome}.`);
  console.log(erro);
});

const worker = new Worker(
  nome,
  async ({ data }) => {
    let { dto } = data;
    const referencia = dto.codigo_produto_fornecedor;
    const produto = produtoMapper.toProduto(dto);
    await produtoService.cadastrar(produto);
    await cacheUtil.add(`${CODIGO_REFERENCIA_FORNECEDOR_CACHE}_${referencia}`, referencia, ETempoExpiracao.UMA_SEMANA);
  },
  { connection, removeOnFail: { count: 0 }, removeOnComplete: { count: 0 } }
);

worker.on("error", (erro) => {
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
