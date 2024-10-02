import cacheUtil from '@utils/cache.util';
import Marca from '../models/marca.model';
import hubUtil from '@utils/hub.util';

const CHAVE_HUB_MARCAS_COMERCIAL_CACHE = 'hub_marcas_comercial';

async function obterTodas(): Promise<Marca[]> {
  const marcasCache = await cacheUtil.obter(CHAVE_HUB_MARCAS_COMERCIAL_CACHE);
  if (marcasCache) return marcasCache;

  const URL = '/portal/brands';
  const marcas = await hubUtil.get(URL);
  await cacheUtil.add(CHAVE_HUB_MARCAS_COMERCIAL_CACHE, marcas);
  return marcas;
}

export default {
  obterTodas,
};
