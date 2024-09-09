import getDbInstance from '@db/db';
import { Ean } from '../models/ean.model';
import _ from 'lodash';

async function obterPor(produtoId: number): Promise<Ean[]> {
  const db = getDbInstance();
  try {
    return await db.select('*').into('produtos_eans as p').where('p.produto_id', '=', produtoId);
  } catch (error) {
    throw error;
  } finally {
    await db.destroy();
  }
};

async function obterPorCodigos(codigos: string[]) {
  const db = getDbInstance();

  try {
    return await db
      .select('e.*', 'p.*')
      .into('produtos_eans as e')
      .join('produtos as p', 'p.id', 'e.produto_id')
      .whereIn('e.codigo_ean', codigos);
  } catch (error) {
    throw error;
  } finally {
    await db.destroy();
  }
};

async function cadastrarEmlote(eans: Partial<Ean>[]) {
  const db = getDbInstance();
  try {
    await db.transaction(async (trx) => {
      await trx.insert(eans).into('produtos_eans');
    });
  } catch (error) {
    throw error;
  } finally {
    await db.destroy();
  }
};

async function atualizar(eans: Ean[]) {
  const db = getDbInstance();

  try {
    await db.transaction(async (trx) => {
      for (const ean of eans) {
        await trx.update({ codigo_ean: ean.codigo }).from('produtos_eans').where('id', '=', ean.id);
      }
    });
  } catch (erro) {
    throw erro;
  } finally {
    await db.destroy();
  }
};

export default {
  obterPor,
  obterPorCodigos,
  cadastrarEmlote,
  atualizar,
};
