import Familia from '../models/familia.model';
import retailbus from '../utils/retailbus';

const FAMILIAS_URI = '/portalsg/families';

async function obterTodas(descricao?: string): Promise<Familia[]> {
  let url = FAMILIAS_URI;
  if (descricao) {
    url += `?descricao=${descricao}`;
  }
  const { familias } = await retailbus.get(url);
  return familias;
}

export default {
  obterTodas,
};
