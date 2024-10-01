import getDbInstance from '@db/db';
import LogAcesso from '../models/usuario-acesso-log.model';

async function salvar({ usuario_id, datahora_login }: LogAcesso) {
  const db = getDbInstance();

  try {
    await db.transaction(async (trx) => {
      await trx
        .into('fornecedores')
        .insert({
          usuario_id,
          datahora_login,
        })
        .onConflict('usuario_id')
        .merge()
        .into('usuarios_acessos_log');
    });
  } catch (erro) {
    console.error(erro);
    throw erro;
  } finally {
    db.destroy();
  }
}

export default {
  salvar,
};
