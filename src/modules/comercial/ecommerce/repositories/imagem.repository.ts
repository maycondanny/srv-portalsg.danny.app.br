import getDbInstance from '@db/db';
import Imagem from '../models/imagem.model';
import ErroException from '@exceptions/erro.exception';
import _ from 'lodash';

async function cadastrar(imagens: Imagem[]) {
  const db = getDbInstance();

  try {
    return await db.transaction(async (trx) => {
      const [{ id }] = await trx.insert(imagens).into('produtos_ecommerce_imagens').returning('id');
      return id;
    });
  } catch (error) {
    console.log(error);
    throw new ErroException('Não foi possivel cadastrar as imagens.');
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
    throw new ErroException('Não foi possivel obter as imagens.');
  } finally {
    db.destroy();
  }
}

async function remover(ecommerceId: number): Promise<void> {
  const db = getDbInstance();

  try {
    await db.transaction(async (trx) => {
      await trx.into('produtos_ecommerce_imagens AS p').where('p.ecommerce_id', '=', ecommerceId).del();
    });
  } catch (erro) {
    console.error(erro);
    throw new ErroException('Não foi possivel atualizar o produto no ecommerce');
  } finally {
    db.destroy();
  }
}

export default {
  cadastrar,
  obterPorId,
  remover,
};
