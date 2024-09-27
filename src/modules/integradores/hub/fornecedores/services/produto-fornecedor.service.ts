import ProdutoFornecedor from '@models/hub/produto-fornecedor.model';
import hubUtil from '@utils/hub.util';

async function obterPorReferencia(referencia: string): Promise<ProdutoFornecedor> {
  const URL = `/supplier_products?reference=${referencia}`;
  const produtosFornecedor = await hubUtil.get(URL);
  return produtosFornecedor[0];
}

export default {
  obterPorReferencia,
};
