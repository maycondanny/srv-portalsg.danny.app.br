import getDbInstance from '@db/db';
import { Produto } from '../models/produto.model';
import _ from 'lodash';

async function cadastrar(produto: Partial<Produto>) {
  const db = getDbInstance();
  try {
    return await db.transaction(async (trx) => {
      const [{ id }] = await trx.insert(produto).into('produtos').returning('id');
      return id;
    });
  } catch (error) {
    throw error;
  } finally {
    await db.destroy();
  }
};

export default {
  cadastrar,
};
