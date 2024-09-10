import getDbInstance from '@db/db';
import Imagem from '../models/imagem.model';

async function cadastrar(imagens: Imagem[]) {
  const db = getDbInstance();

  try {
    return await db.transaction(async (trx) => {
      const [{ id }] = await trx.insert(imagens).into('produtos_ecommerce_imagens').returning('id');
      return id;
    });
  } catch (error) {
    throw error;
  } finally {
    await db.destroy();
  }
}

async function obterPorId(ecommerceId: number): Promise<Imagem[]> {
  const db = getDbInstance();

  try {
    return await db.select('*').from('produtos_ecommerce_imagens AS p').where('p.ecommerce_id', '=', ecommerceId);
  } catch (erro) {
    console.error(erro);
    throw new Error('Não foi possivel obter as imagens.');
  } finally {
    db.destroy();
  }
}

export default {
  cadastrar,
  obterPorId
};
