import ProdutoFornecedor from "@models/hub/produto-fornecedor.model";
import hubHttpUtil from "@utils/hub-http.util";

const obterPorReferencia = async (referencia: string): Promise<ProdutoFornecedor> => {
  try {
    const URL = `/supplier_products?reference=${referencia}`;
    const produtosFornecedor = await hubHttpUtil.get(URL);
    return produtosFornecedor[0];
  } catch (erro) {
    console.log(erro);
    throw erro;
  }
};

export default {
  obterPorReferencia,
};
