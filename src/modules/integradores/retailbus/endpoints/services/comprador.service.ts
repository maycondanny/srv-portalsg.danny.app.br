import Comprador from '../models/comprador.model';
import retailbus from '../utils/retailbus';

const FAMILIAS_URI = '/portalsg/buyers';

async function obterTodos(): Promise<Comprador[]> {
  const { compradores } = await retailbus.get(FAMILIAS_URI);
  return compradores;
}

export default {
  obterTodos,
};
