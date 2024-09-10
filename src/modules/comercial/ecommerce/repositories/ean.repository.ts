import getDbInstance from '@db/db';
import Ean from '../models/ean.model';

async function cadastrar(eans: Ean[]) {
  const db = getDbInstance();

  try {
    return await db.transaction(async (trx) => {
      const [{ id }] = await trx.insert(eans).into('produtos_ecommerce_eans').returning('id');
      return id;
    });
  } catch (error) {
    throw error;
  } finally {
    await db.destroy();
  }
}

async function obterPorId(ecommerceId: number): Promise<Ean> {
  const db = getDbInstance();

  try {
    return await db.select('*').from('produtos_ecommerce_eans AS p').where('p.ecommerce_id', '=', ecommerceId).first();
  } catch (erro) {
    console.error(erro);
    throw new Error('Não foi possivel obter os eans.');
  } finally {
    db.destroy();
  }
}

export default {
  cadastrar,
  obterPorId
};
