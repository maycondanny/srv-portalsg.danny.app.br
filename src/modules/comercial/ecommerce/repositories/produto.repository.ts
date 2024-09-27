import getDbInstance from '@db/db';
import { Produto } from '../models/produto.model';
import ErroException from '@exceptions/erro.exception';

async function cadastrar(produto: Produto) {
  const db = getDbInstance();

  try {
    return await db.transaction(async (trx) => {
      const [{ id }] = await trx.insert(produto).into('produtos_ecommerce').returning('id');
      return id;
    });
  } catch (error) {
    throw new ErroException('Não foi possivel obter os produtos no ecommerce');
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
    throw new ErroException('Não foi possivel obter os produtos no ecommerce');
  } finally {
    db.destroy();
  }
}

async function obterPorId(id: number): Promise<Produto> {
  const db = getDbInstance();

  try {
    return await db.select('*').from('produtos_ecommerce AS p').where('p.id', '=', id).first();
  } catch (erro) {
    console.error(erro);
    throw new ErroException('Não foi possivel obter os produtos no ecommerce');
  } finally {
    db.destroy();
  }
}

async function atualizarPorProdutoId(produtoId: number, produto: Partial<Produto>): Promise<number> {
  const db = getDbInstance();

  try {
    return await db.transaction(async (trx) => {
      const [{ id }] = await trx
        .update(produto)
        .from('produtos_ecommerce AS p')
        .where('p.produto_id', '=', produtoId)
        .returning('id');
      return id;
    });
  } catch (erro) {
    console.error(erro);
    throw new ErroException('Não foi possivel atualizar o produto no ecommerce');
  } finally {
    db.destroy();
  }
}

async function atualizar(produto: Partial<Produto>): Promise<number> {
  const db = getDbInstance();

  try {
    return await db.transaction(async (trx) => {
      const [{ id }] = await trx
        .update({
          ...produto,
          updated_at: new Date()
        })
        .from('produtos_ecommerce AS p')
        .where('p.id', '=', produto.id)
        .returning('id');
      return id;
    });
  } catch (erro) {
    console.error(erro);
    throw new ErroException('Não foi possivel atualizar o produto no ecommerce');
  } finally {
    db.destroy();
  }
}

async function obterTodosPorFornecedor(fornecedorId: number): Promise<Produto[]> {
  const db = getDbInstance();

  try {
    return await db.select('*').from('produtos_ecommerce AS p').where('p.fornecedor_id', '=', fornecedorId);
  } catch (erro) {
    console.error(erro);
    throw new ErroException('Não foi possivel obter os produtos no ecommerce');
  } finally {
    db.destroy();
  }
}

export default {
  cadastrar,
  obterPorProdutoId,
  atualizarPorProdutoId,
  obterTodosPorFornecedor,
  obterPorId,
  atualizar
};
