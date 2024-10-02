import cacheUtil from '@utils/cache.util';
import hubUtil from '@utils/hub.util';
import Departamento from '../models/departamento.model';

const CHAVE_HUB_DEPARTAMENTOS_COMERCIAL_CACHE = 'hub_departamentos_comercial';

async function obterTodos(): Promise<Departamento[]> {
  const departamentosCache = await cacheUtil.obter(CHAVE_HUB_DEPARTAMENTOS_COMERCIAL_CACHE);
  if (departamentosCache) return departamentosCache;

  let URL = '/portal/departments';
  const departamentos = await hubUtil.get(URL);
  await cacheUtil.add(CHAVE_HUB_DEPARTAMENTOS_COMERCIAL_CACHE, departamentos);
  return departamentos;
}

export default {
  obterTodos,
};
