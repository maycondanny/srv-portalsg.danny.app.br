import getDbInstance from '@db/db';
import UsuarioRole from '../models/usuario-role.model';
import ErroException from '@exceptions/erro.exception';

async function obterTodos(): Promise<UsuarioRole[]> {
  const db = getDbInstance();
  try {
    return await db.select('*').from('usuario_roles');
  } catch (erro) {
    console.error(erro);
    throw erro;
  } finally {
    db.destroy();
  }
}

async function cadastrar(role: UsuarioRole): Promise<void> {
  const db = getDbInstance();
  try {
    await db.transaction(async (trx) => {
      await trx
        .insert({
          nome: role.nome,
        })
        .into('usuario_roles');
    });
  } catch (erro) {
    console.error(erro);
    throw new ErroException('Não foi possivel cadastrar uma nova função');
  } finally {
    db.destroy();
  }
}

async function remover(roleId: number) {
  const db = getDbInstance();
  try {
    await db.transaction(async (trx) => {
      await trx.into('usuario_roles AS ur').where('ur.id', '=', roleId).del();
    });
  } catch (erro) {
    console.error(erro);
    throw new ErroException('Não foi possivel remover a função');
  } finally {
    db.destroy();
  }
}

async function atualizar(role: UsuarioRole) {
  const db = getDbInstance();
  try {
    await db.transaction(async (trx) => {
      await trx
        .update({
          nome: role.nome,
          updated_at: new Date(),
        })
        .from('usuario_roles AS ur')
        .where('ur.id', role.id);
    });
  } catch (erro) {
    console.error(erro);
    throw new ErroException('Não foi possivel atualizar a função');
  } finally {
    db.destroy();
  }
}

export default {
  cadastrar,
  atualizar,
  remover,
  obterTodos,
};
