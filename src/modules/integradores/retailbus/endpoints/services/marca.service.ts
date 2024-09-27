import Marca from '../models/marca.model';
import retailbus from '../utils/retailbus';

const MARCAS_URI = '/portalsg/brands';

async function obterTodas(): Promise<Marca[]> {
  const { marcas } = await retailbus.get(MARCAS_URI);
  return marcas;
}

export default {
  obterTodas,
};
