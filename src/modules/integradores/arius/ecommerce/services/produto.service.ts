import ariusUtil from "@utils/arius.util";

const URI = "/AriusERP/v2/ProdutoEcommerce";

interface Produto {
  produtoId: number;
  marcasEcommerce: {
    id: number;
  };
  referencia?: string;
  altura: number;
  alturaComEmbalagem: number;
  largura: number;
  larguraComEmbalagem: number;
  comprimento: number;
  comprimentoComEmbalagem: number;
  tipoSituacaoProdutoEcommerce?: string;
  tipoProdutoEcommerce?: number;
  embalaPresente?: boolean;
  urlYoutube?: string;
  nome: string;
  gradeProdutoPai?: boolean;
  quantidadeSeguranca?: number;
  freteGratis?: boolean;
  tag?: string;
  descricao: string;
  caracteristica: string;
  descricaoHtml?: string;
  caracteristicaHtml?: string;
  licenca?: string;
  lancamento?: boolean;
  destaque?: boolean;
  categoria?: number;
  departamento: {
    idCategoria?: number;
  };
  secao: {
    idCategoria?: number;
  };
  grupo: {
    idCategoria?: number;
  };
  subgrupo: {
    idCategoria?: number;
  };
  urlPlataforma?: string;
  principal?: boolean;
  subTitulo?: string;
  modoUso?: string;
}

const cadastrar = async (produto: Produto | any): Promise<Produto> => {
  try {
    return await ariusUtil.post(URI, produto);
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
};

const atualizar = async (produto: Produto | any): Promise<Produto> => {
  try {
    return await ariusUtil.put(URI, produto);
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
};

const obter = async (produtoId: number): Promise<Produto> => {
  try {
    return await ariusUtil.get(`${URI}/${produtoId}`);
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
};

export default {
    cadastrar,
    atualizar,
    obter
}
