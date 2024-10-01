import getDbInstance from '@db/db';
import { Estado } from '../models/estado.model';
import ErroException from '@exceptions/erro.exception';

async function obterTodos(): Promise<Estado[]> {
  const db = getDbInstance();

  try {
    return await db.select('*').from('sigla_estados');
  } catch (erro) {
    console.error(erro);
    throw new ErroException('Não foi possível obter os estados');
  } finally {
    await db.destroy();
  }
}

export default {
  obterTodos,
};
