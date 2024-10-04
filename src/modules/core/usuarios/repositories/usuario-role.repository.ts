import getDbInstance from '@db/db';
import UsuarioRole from '../models/usuario-role.model';

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

export default {
  obterTodos,
};
