import ariusHttpUtil from '@utils/arius-http.util';

const URI = '/AriusERP/v2/ProdutoEan';

export interface ProdutoEan {
  ean: string;
  produto: {
    id: number;
  };
  quantidade: number;
  embalagem: {
    id: string;
  };
  registradoGtin?: boolean;
  eanPrincipal?: boolean;
  enviaPdv?: boolean;
  dataCadastro?: Date;
  dataAlteracao?: Date;
}

async function cadastrar(produtoEan: ProdutoEan) {
  try {
    await ariusHttpUtil.post(URI, produtoEan);
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
}

async function atualizar(produtoEan: ProdutoEan) {
  try {
    await ariusHttpUtil.put(URI, produtoEan);
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
}

async function obterPorCodigo(codigo: string): Promise<ProdutoEan> {
  try {
    return await ariusHttpUtil.get(`${URI}/${codigo}`);
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
}

export default {
  cadastrar,
  obterPorCodigo,
  atualizar,
};
