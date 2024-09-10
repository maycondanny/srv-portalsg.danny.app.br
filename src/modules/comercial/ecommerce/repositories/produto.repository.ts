import getDbInstance from '@db/db';
import Produto from '../models/produto.model';

async function cadastrar(produto: Produto) {
  const db = getDbInstance();

  try {
    return await db.transaction(async (trx) => {
      const [{ id }] = await trx.insert(produto).into('produtos_ecommerce').returning('id');
      return id;
    });
  } catch (error) {
    throw error;
  } finally {
    await db.destroy();
  }
}

async function obterPorProdutoId(produtoId: number): Promise<Produto> {
  const db = getDbInstance();

  try {
    return await db.select('*').from('produtos_ecommerce AS p').where('p.produto_id', '=', produtoId).first();
  } catch (erro) {
    console.error(erro);
    throw new Error('Não foi possivel obter os produtos.');
  } finally {
    db.destroy();
  }
}

export default {
  cadastrar,
  obterPorProdutoId
};
