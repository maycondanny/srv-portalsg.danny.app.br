import hubUtil from '@utils/hub.util';
import ProdutoFornecedor from '../../produtos/models/produto-fornecedor.model';

async function obterPorReferencia(referencia: string): Promise<ProdutoFornecedor> {
  const URL = `/supplier_products?reference=${referencia}`;
  const produtosFornecedor = await hubUtil.get(URL);
  return produtosFornecedor[0];
}

export default {
  obterPorReferencia,
};
