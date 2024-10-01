import getDbInstance from '@db/db';
import UsuarioFornecedor from '../models/usuario-fornecedor.model';
import ErroException from '@exceptions/erro.exception';

async function cadastrar({ usuario_id, fornecedor_id, token }: UsuarioFornecedor) {
  const db = getDbInstance();

  try {
    await db.transaction(async (trx) => {
      await trx.into('usuarios_fornecedores').insert({
        usuario_id,
        fornecedor_id,
        token,
      });
    });
  } catch (erro) {
    console.error(erro);
    throw new ErroException('Não foi possível cadastrar ou atualizar um fornecedor.');
  } finally {
    await db.destroy();
  }
}

async function obterPorUsuario(usuario_id: number) {
  const db = getDbInstance();

  try {
    const db = getDbInstance();
    try {
      return await db
        .select('f.id', 'f.nome', 'f.cnpj', 'uf.ativo')
        .from('usuarios_fornecedores AS uf')
        .join('fornecedores AS f', 'uf.fornecedor_id', 'f.id')
        .where('usuario_id', '=', usuario_id)
        .first();
    } catch (erro) {
      console.error(erro);
      throw new ErroException('Não foi possivel obter o fornecedor.');
    } finally {
      db.destroy();
    }
  } catch (erro) {
    console.error(erro);
    throw new ErroException('Não foi possível cadastrar ou atualizar um fornecedor.');
  } finally {
    await db.destroy();
  }
}

async function obterPorToken(token: string) {
  const db = getDbInstance();

  try {
    const db = getDbInstance();
    try {
      return await db
        .select('f.nome', 'uf.usuario_id', 'uf.fornecedor_id', 'uf.ativo')
        .from('usuarios_fornecedores AS uf')
        .join('fornecedores AS f', 'uf.fornecedor_id', 'f.id')
        .where('token', '=', token)
        .first();
    } catch (erro) {
      console.error(erro);
      throw new ErroException('Não foi possivel obter o fornecedor.');
    } finally {
      db.destroy();
    }
  } catch (erro) {
    console.error(erro);
    throw new ErroException('Não foi possível cadastrar ou atualizar um fornecedor.');
  } finally {
    await db.destroy();
  }
}

async function atualizar({ usuario_id, fornecedor_id, ativo, datahora_ativacao }) {
  const db = getDbInstance();

  try {
    await db.transaction(async (trx) => {
      await trx
        .into('usuarios_fornecedores')
        .update({
          ativo,
          datahora_ativacao,
        })
        .where('usuario_id', '=', usuario_id)
        .andWhere('fornecedor_id', '=', fornecedor_id);
    });
  } catch (erro) {
    console.error(erro);
    throw new ErroException('Não foi possível atualizar um fornecedor.');
  } finally {
    await db.destroy();
  }
}

export default {
  obterPorUsuario,
  cadastrar,
  obterPorToken,
  atualizar,
};
