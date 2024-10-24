import getDbInstance from '@db/db';
import UsuarioModulo from '../models/usuario-modulo.model';
import ErroException from '@exceptions/erro.exception';

async function cadastrar(usuarioModulos: UsuarioModulo[]): Promise<void> {
  const db = getDbInstance();
  try {
    await db.transaction(async (trx) => {
      await trx.into('usuario_modulos').where('usuario_id', '=', usuarioModulos[0].usuario_id).del();
      await trx.insert(usuarioModulos).into('usuario_modulos');
    });
  } catch (erro) {
    console.error(erro);
    throw new ErroException('Não foi possivel cadastrar os modulos para o usuario.');
  } finally {
    db.destroy();
  }
}

async function obterPorUsuarioId(usuarioId: number): Promise<UsuarioModulo[]> {
  const db = getDbInstance();
  try {
    return await db.select('*').from('usuario_modulos').where('usuario_id', '=', usuarioId);
  } catch (erro) {
    console.error(erro);
    throw erro;
  } finally {
    db.destroy();
  }
}

export default {
  cadastrar,
  obterPorUsuarioId,
};
