import getDbInstance from '@db/db';
import { Ean } from '../models/ean.model';
import ErroException from '@exceptions/erro.exception';
import _ from 'lodash';

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

async function obterPorId(ecommerceId: number): Promise<Ean[]> {
  const db = getDbInstance();

  try {
    return await db.select('*').from('produtos_ecommerce_eans AS p').where('p.ecommerce_id', '=', ecommerceId);
  } catch (erro) {
    console.error(erro);
    throw new ErroException('Não foi possivel obter os eans.');
  } finally {
    db.destroy();
  }
}

async function atualizar(ecommerceId: number, eans: Ean[]): Promise<void> {
  const db = getDbInstance();

  try {
    await db.transaction(async (trx) => {
      for (const ean of eans) {
        await trx('produtos_ecommerce_eans').where('ecommerce_id', ecommerceId).update({ codigo: ean.codigo });
      }
    });
  } catch (erro) {
    console.error(erro);
    throw new ErroException('Não foi possivel atualizar os eans');
  } finally {
    db.destroy();
  }
}

export default {
  cadastrar,
  obterPorId,
  atualizar,
};
