import getDbInstance from '@db/db';
import { Fornecedor } from '../models/fornecedor.model';

async function cadastrar(fornecedor: Fornecedor): Promise<number> {
  const db = getDbInstance();

  try {
    return await db.transaction(async (trx) => {
      const [{ id }] = await trx
        .into('fornecedores')
        .insert({
          id: fornecedor.id,
          nome: fornecedor.nome,
          cnpj: fornecedor.cnpj,
        })
        .onConflict('cnpj')
        .merge()
        .returning('id');

      return id;
    });
  } catch (erro) {
    console.error(erro);
    throw new Error('Não foi possível cadastrar ou atualizar um fornecedor.');
  } finally {
    await db.destroy();
  }
}

async function obterPorId(fornecedorId: number): Promise<Fornecedor> {
  const db = getDbInstance();

  try {
    return await db.into('fornecedores AS f').where('f.id', '=', fornecedorId).first();
  } catch (erro) {
    console.error(erro);
    throw new Error('Não foi possível cadastrar ou atualizar um fornecedor.');
  } finally {
    await db.destroy();
  }
}

export default {
  cadastrar,
  obterPorId,
};
