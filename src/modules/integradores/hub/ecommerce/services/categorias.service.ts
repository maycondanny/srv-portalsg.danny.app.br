import cacheUtil from '@utils/cache.util';
import hubUtil from '@utils/hub.util';

const CHAVE_HUB_CATEGORIAS_ECOMMERCE_CACHE = 'hub_categorias_ecommerce';

async function obterTodas() {
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
