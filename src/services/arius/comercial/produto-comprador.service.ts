import ariusUtil from '@utils/arius.util';

const URI = '/AriusERP/v2/ProdutoComprador';

interface ProdutoComprador {
  pk: {
    produtoId: number;
    compradorId: number;
  };
  compradorAnterior?: {
    id: number;
  };
}

async function cadastrar(produto: ProdutoComprador): Promise<ProdutoComprador> {
  try {
    const resposta = await ariusUtil.post(URI, produto);
    return resposta;
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
}

async function atualizar(produto: ProdutoComprador): Promise<ProdutoComprador> {
  try {
    return await ariusUtil.put(URI, produto);
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
}

async function obter({ compradorId, produtoId }): Promise<ProdutoComprador> {
  try {
    const url = `${URI}/{produtoId:${produtoId},compradorId:${compradorId}}`;
    return await ariusUtil.get(url);
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
}

async function excluir({ compradorId, produtoId }): Promise<ProdutoComprador> {
  try {
    const url = `${URI}/{produtoId:${produtoId},compradorId:${compradorId}}`;
    return await ariusUtil.remove(url);
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
}

export default {
  cadastrar,
  atualizar,
  obter,
  excluir,
};
