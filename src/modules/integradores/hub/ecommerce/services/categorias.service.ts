import cacheUtil from '@utils/cache.util';
import hubUtil from '@utils/hub.util';
import Categoria from '../models/categoria.model';

const CHAVE_HUB_CATEGORIAS_ECOMMERCE_CACHE = 'hub_categorias_ecommerce';

async function obterTodas(): Promise<Categoria[]> {
  const categoriasCache = await cacheUtil.obter(CHAVE_HUB_CATEGORIAS_ECOMMERCE_CACHE);
  if (categoriasCache) return categoriasCache;

  let URL = '/categories';
  const categorias = await hubUtil.get(URL);

  await cacheUtil.add(CHAVE_HUB_CATEGORIAS_ECOMMERCE_CACHE, categorias);
  return categorias;
}

export default {
  obterTodas,
};
