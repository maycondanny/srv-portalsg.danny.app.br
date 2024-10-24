import getDbInstance from '@db/db';
import ErroException from '@exceptions/erro.exception';
import Modulo from '../models/modulo.model';

async function cadastrar(modulo: Modulo): Promise<number> {
  const db = getDbInstance();
  try {
    return await db.transaction(async (trx) => {
      const [{ id }] = await trx
        .insert({
          nome: modulo.nome,
          descricao: modulo.descricao,
          url: modulo.url,
          setor_id: modulo.setor_id,
          icone_id: modulo.icone_id,
        })
        .into('modulos')
        .returning('id');
      return id;
    });
  } catch (erro) {
    console.error(erro);
    throw new ErroException('Não foi possivel cadastrar um novo modulo');
  } finally {
    db.destroy();
  }
}

async function obterTodos(): Promise<Modulo[]> {
  const db = getDbInstance();
  try {
    return await db.select('m.*').from('modulos AS m');
  } catch (erro) {
    console.error(erro);
    throw new ErroException('Não foi possivel obter os modulos!');
  } finally {
    db.destroy();
  }
}

async function remover(moduloId: number) {
  const db = getDbInstance();
  try {
    await db.transaction(async (trx) => {
      await trx.into('modulos AS m').where('m.id', '=', moduloId).del();
    });
  } catch (erro) {
    console.error(erro);
    throw new ErroException('Não foi possivel remover o modulo');
  } finally {
    db.destroy();
  }
}

async function atualizar(modulo: Modulo) {
  const db = getDbInstance();
  try {
    await db.transaction(async (trx) => {
      await trx
        .update({
          nome: modulo.nome,
          descricao: modulo.descricao,
          url: modulo.url,
          setor_id: modulo.setor_id,
          icone_id: modulo.icone_id,
          updated_at: new Date(),
        })
        .from('modulos')
        .where('id', modulo.id);
    });
  } catch (erro) {
    console.error(erro);
    throw new ErroException('Não foi possivel atualizar o modulo');
  } finally {
    db.destroy();
  }
}

async function obterPorIds(ids: number[]): Promise<Modulo[]> {
  const db = getDbInstance();
  try {
    return await db.select('m.*').from('modulos AS m').whereIn('m.id', ids);
  } catch (erro) {
    console.error(erro);
    throw new ErroException('Não foi possivel obter os modulos!');
  } finally {
    db.destroy();
  }
}

export default {
  cadastrar,
  remover,
  obterTodos,
  atualizar,
  obterPorIds
};
