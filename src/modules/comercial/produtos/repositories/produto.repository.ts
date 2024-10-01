import getDbInstance from '@db/db';
import { Produto } from '../models/produto.model';
import _ from 'lodash';
import ErroException from '@exceptions/erro.exception';

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
}

async function obterTodosPorFornecedor(fornecedorId: number) {
  const db = getDbInstance();

  try {
    return await db.select('*').from('produtos AS p').andWhere('p.fornecedor_id', '=', fornecedorId);
  } catch (erro) {
    console.error(erro);
    throw new ErroException('Não foi possivel obter os produtos.');
  } finally {
    db.destroy();
  }
}

async function obterPorId(id: number) {
  const db = getDbInstance();

  try {
    return await db.select('*').from('produtos AS p').where('p.id', '=', id).first();
  } catch (erro) {
    console.error(erro);
    throw new ErroException('Não foi possivel obter o produto.');
  } finally {
    db.destroy();
  }
}

async function atualizar(produto: Partial<Produto>) {
  const db = getDbInstance();

  try {
    await db.transaction(async (trx) => {
      await trx.update(produto).from("produtos").where("id", produto.id);
    });
  } catch (erro) {
    console.error(erro);
    throw new ErroException("Não foi possivel atualizar os produtos.");
  } finally {
    db.destroy();
  }
};

export default {
  cadastrar,
  obterTodosPorFornecedor,
  obterPorId,
  atualizar
};
