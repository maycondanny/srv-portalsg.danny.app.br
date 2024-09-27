import cacheUtil from '@utils/cache.util';
import Produto from '../models/produto.model';
import hubUtil from '@utils/hub.util';

const CHAVE_DIVERGENCIAS_ECOMMERCE = 'divergencias_ecommerce';

async function obterTodos(produtoId: number): Promise<Produto[]> {
  if (!produtoId) throw new Error('ID do produto não informado.');
  const chaveCache = `${CHAVE_DIVERGENCIAS_ECOMMERCE}_${produtoId}`;
  const produtosCache = await cacheUtil.obter(chaveCache);
  if (produtosCache) return produtosCache;

  const URL = `/portal/products_ecommerce/${produtoId}`;
  const produtos = await hubUtil.get(URL);
  await cacheUtil.add(chaveCache, produtos);
  return produtos;
};

export default {
  obterTodos,
};
