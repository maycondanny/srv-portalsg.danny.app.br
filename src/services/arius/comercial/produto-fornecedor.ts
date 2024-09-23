import ariusUtil from '@utils/arius.util';

const URI = '/AriusERP/v2/ProdutoFornecedor';

interface ProdutoFornecedor {
  pk?: {
    produtoId?: number;
    fornecedorId?: number;
  };
  linha?: number;
  referencia?: string;
  sif?: number;
}

async function cadastrar(produto: ProdutoFornecedor): Promise<ProdutoFornecedor> {
  try {
    return await ariusUtil.post(URI, produto);
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
}

async function atualizar(produto: ProdutoFornecedor): Promise<ProdutoFornecedor> {
  try {
    return await ariusUtil.put(URI, produto);
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
}

async function obter({ fornecedorId, produtoId }): Promise<ProdutoFornecedor> {
  try {
    const url = `${URI}/{produtoId:${produtoId},fornecedorId:${fornecedorId}}`;
    return await ariusUtil.get(url);
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
}

export default {
  atualizar,
  cadastrar,
  obter,
};
