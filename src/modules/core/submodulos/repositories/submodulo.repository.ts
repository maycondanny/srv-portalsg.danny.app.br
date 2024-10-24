import getDbInstance from '@db/db';
import ErroException from '@exceptions/erro.exception';
import SubModulo from '../models/submodulo.model';

async function cadastrar(submodulo: SubModulo): Promise<void> {
  const db = getDbInstance();
  try {
    await db.transaction(async (trx) => {
      await trx.insert(submodulo).into('submodulos');
    });
  } catch (erro) {
    console.error(erro);
    throw new ErroException('Não foi possivel cadastrar os submodulos.');
  } finally {
    db.destroy();
  }
}

async function obterTodos(): Promise<SubModulo[]> {
  const db = getDbInstance();
  try {
    return await db.select('*').from('submodulos AS s');
  } catch (erro) {
    console.error(erro);
    throw new ErroException('Não foi possivel carregar os submodulos!');
  } finally {
    db.destroy();
  }
}

async function obterPorModuloId(moduloId: number): Promise<SubModulo[]> {
  const db = getDbInstance();
  try {
    return await db.select('*').from('submodulos AS s').where('s.modulo_id', '=', moduloId);
  } catch (erro) {
    console.error(erro);
    throw new ErroException('Não foi possivel obter os submodulos!');
  } finally {
    db.destroy();
  }
}

async function removerPorModuloId(moduloId: number): Promise<void> {
  const db = getDbInstance();
  try {
    await db.transaction(async (trx) => {
      await trx.into('submodulos AS s').where('s.modulo_id', '=', moduloId).del();
    });
  } catch (erro) {
    console.error(erro);
    throw new ErroException('Não foi possivel remover o submodulo!');
  } finally {
    db.destroy();
  }
}

async function remover(id: number): Promise<void> {
  const db = getDbInstance();
  try {
    await db.transaction(async (trx) => {
      await trx.into('submodulos AS s').where('s.id', '=', id).del();
    });
  } catch (erro) {
    console.error(erro);
    throw new ErroException('Não foi possivel remover o submodulo!');
  } finally {
    db.destroy();
  }
}

async function atualizar(submodulo: SubModulo) {
  const db = getDbInstance();
  try {
    await db.transaction(async (trx) => {
      await trx
        .update({
          nome: submodulo.nome,
          descricao: submodulo.descricao,
          url: submodulo.url,
          modulo_id: submodulo.modulo_id,
          icone_id: submodulo.icone_id,
          updated_at: new Date(),
        })
        .from('submodulos')
        .where('id', submodulo.id);
    });
  } catch (erro) {
    console.error(erro);
    throw new ErroException('Não foi possivel atualizar o submodulo');
  } finally {
    db.destroy();
  }
}

export default {
  cadastrar,
  obterTodos,
  obterPorModuloId,
  removerPorModuloId,
  remover,
  atualizar
};
