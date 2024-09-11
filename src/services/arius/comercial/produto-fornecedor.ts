import ariusHttpUtil from '@utils/arius-http.util';

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
    return await ariusHttpUtil.post(URI, produto);
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
}

async function atualizar(produto: ProdutoFornecedor): Promise<ProdutoFornecedor> {
  try {
    return await ariusHttpUtil.put(URI, produto);
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
}

async function obter({ estado, fornecedorId, produtoId }): Promise<ProdutoFornecedor> {
  try {
    const url = `${URI}/{estadoId:${estado},produtoId:${produtoId},fornecedorId:${fornecedorId}}`;
    return await ariusHttpUtil.get(url);
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
