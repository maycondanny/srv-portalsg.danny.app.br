import cacheUtil from '@utils/cache.util';
import hubUtil from '@utils/hub.util';
import Marca from '../models/marca.model';

const CHAVE_HUB_MARCAS_ECOMMERCE_CACHE = 'hub_marcas_ecommerce';

async function obterTodas(): Promise<Marca[]> {
  const marcasCache = await cacheUtil.obter(CHAVE_HUB_MARCAS_ECOMMERCE_CACHE);
  if (marcasCache) return marcasCache;

  const URL = '/brands';
  const marcas = await hubUtil.get(URL);
  await cacheUtil.add(CHAVE_HUB_MARCAS_ECOMMERCE_CACHE, marcas);
  return marcas;
}

export default {
  obterTodas,
};
