import getDbInstance from '@db/db';
import { Estado } from '../models/estado.model';

async function obterTodos(): Promise<Estado[]> {
  const db = getDbInstance();

  try {
    return await db.select('*').from('sigla_estados');
  } catch (erro) {
    console.error(erro);
    throw new Error('Não foi possível obter os estados');
  } finally {
    await db.destroy();
  }
}

export default {
  obterTodos,
};
