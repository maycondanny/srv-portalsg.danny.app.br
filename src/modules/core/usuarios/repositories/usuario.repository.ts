import getDbInstance from '@db/db';
import Usuario from '../models/usuario.model';
import ErroException from '@exceptions/erro.exception';

async function cadastrar(usuario: Usuario): Promise<number> {
  const db = getDbInstance();
  try {
    const id = await db.transaction(async (trx) => {
      let dados: any = {
        nome: usuario.nome,
        email: usuario.email,
        senha: usuario.senha,
        role: usuario.role,
      };

      if (usuario.id) {
        dados.id = usuario.id;
      }

      const [{ id }] = await trx.insert(dados).into('usuarios').returning('id');

      await trx
        .insert(
          usuario.setores.map((setor) => ({
            usuario_id: id,
            setor_id: setor.id,
          }))
        )
        .into('usuarios_setores');
      await trx
        .insert(
          usuario.grupos.map((grupo) => ({
            usuario_id: id,
            grupo_id: grupo.id,
          }))
        )
        .into('usuarios_grupos');
      await trx
        .insert(
          usuario.acessos.map((acesso) => ({
            usuario_id: id,
            acesso_id: acesso.id,
          }))
        )
        .into('usuarios_acessos');

      return id;
    });
    return id;
  } catch (erro) {
    console.error(erro);
    throw new ErroException('Não foi possivel cadastrar um novo usuário.');
  } finally {
    db.destroy();
  }
}

async function obterTodos(): Promise<Usuario[]> {
  const db = getDbInstance();
  try {
    return await db
      .select('u.*')
      .from('usuarios AS u')
      .orderBy([{ column: 'online', order: 'desc' }]);
  } catch (erro) {
    console.error(erro);
    throw new ErroException('Não foi possivel carregar os usuarios!');
  } finally {
    db.destroy();
  }
}

async function obterUsuarioPorEmail(email: string): Promise<Usuario> {
  const db = getDbInstance();
  try {
    return await db.select('*').from('usuarios AS u').where('u.email', '=', email).first();
  } catch (erro) {
    console.error(erro);
    throw new ErroException('Não foi possivel carregar o usuario!');
  } finally {
    db.destroy();
  }
}

async function obterPorId(id: number): Promise<Usuario> {
  const db = getDbInstance();
  try {
    return await db.select('*').from('usuarios AS u').where('u.id', '=', id).first();
  } catch (erro) {
    console.error(erro);
    throw new ErroException('Não foi possivel carregar o usuario!');
  } finally {
    db.destroy();
  }
}

async function obterPorCNPJ(cnpj: string): Promise<Usuario> {
  const db = getDbInstance();
  try {
    return await db.select('*').from('usuarios AS u').where('u.cnpj', '=', cnpj).first();
  } catch (erro) {
    console.error(erro);
    throw new ErroException('Não foi possivel carregar o usuario!');
  } finally {
    db.destroy();
  }
}

async function atualizar(usuario: Usuario) {
  const db = getDbInstance();
  try {
    await db.transaction(async (trx) => {
      await trx
        .update({
          nome: usuario.nome,
          email: usuario.email,
          senha: usuario.senha,
          troca_senha: usuario.troca_senha,
          role: usuario.role,
          online: usuario.online,
        })
        .from('usuarios')
        .where('id', '=', usuario.id);

      await trx.from('usuarios_setores AS us').where('us.usuario_id', '=', usuario.id).del();
      await trx.from('usuarios_grupos AS ug').where('ug.usuario_id', '=', usuario.id).del();
      await trx.from('usuarios_acessos AS ua').where('ua.usuario_id', '=', usuario.id).del();

      await trx.from('usuarios_setores AS us').insert(
        usuario.setores.map((setor) => ({
          setor_id: setor.id,
          usuario_id: usuario.id,
        }))
      );

      await trx.from('usuarios_grupos AS ug').insert(
        usuario.grupos.map((grupo) => ({
          grupo_id: grupo.id,
          usuario_id: usuario.id,
        }))
      );

      await trx.from('usuarios_acessos AS ua').insert(
        usuario.acessos.map((acesso) => ({
          acesso_id: acesso.id,
          usuario_id: usuario.id,
        }))
      );
    });
  } catch (erro) {
    console.error(erro);
    throw new ErroException('Não foi possivel atualizar o usuário.');
  } finally {
    db.destroy();
  }
}

async function obterGrupos(usuario_id: number): Promise<any[]> {
  const db = getDbInstance();
  try {
    return await db
      .select('g.id', 'g.nome', 'g.setor_id')
      .from('usuarios_grupos AS ug')
      .join('grupos AS g', 'g.id', '=', 'ug.grupo_id')
      .where('ug.usuario_id', '=', usuario_id)
      .andWhere('g.ativo', '=', 1);
  } catch (erro) {
    console.error(erro);
    throw new ErroException('Não foi possivel obter os grupos.');
  } finally {
    db.destroy();
  }
}

async function obterAcessos(usuario_id: number): Promise<any[]> {
  const db = getDbInstance();
  try {
    const acessos = await db
      .select(
        'a.id',
        'a.pagina',
        'a.modulo',
        'a.submodulo',
        'a.sub_submodulo',
        'a.setor_id',
        'a.icone_id',
        'ag.grupo_id'
      )
      .distinct()
      .from('usuarios_acessos AS ua')
      .join('acessos AS a', 'a.id', '=', 'ua.acesso_id')
      .join('usuarios_setores AS us', 'a.setor_id', '=', 'us.setor_id')
      .join('acessos_grupos AS ag', 'ag.acesso_id', '=', 'ua.acesso_id')
      .join('usuarios_grupos AS ug', function () {
        this.on('ug.grupo_id', '=', 'ag.grupo_id').andOn('ug.usuario_id', '=', db.raw('?', [usuario_id]));
      })
      .where('ua.usuario_id', '=', usuario_id)
      .andWhere('a.ativo', '=', 1);

    return acessos.filter((valor, indice, array) => {
      return !array.slice(indice + 1).some((item) => item.id == valor.id);
    });
  } catch (erro) {
    console.error(erro);
    throw new ErroException('Não foi possivel obter os acessos.');
  } finally {
    db.destroy();
  }
}

async function obterSetores(usuario_id: number): Promise<any[]> {
  const db = getDbInstance();
  try {
    return await db
      .select('s.id', 's.nome')
      .from('usuarios_setores AS us')
      .join('setores AS s', 's.id', '=', 'us.setor_id')
      .where('us.usuario_id', '=', usuario_id)
      .andWhere('s.ativo', '=', 1);
  } catch (erro) {
    console.error(erro);
    throw new ErroException('Não foi possivel obter os setores.');
  } finally {
    db.destroy();
  }
}

async function obterTodosOnline(): Promise<Usuario[]> {
  const db = getDbInstance();
  try {
    return await db.select('u.id', 'u.nome', 'u.email', 'u.role').from('usuarios AS u').where('u.online', '=', 1);
  } catch (erro) {
    console.error(erro);
    throw new ErroException('Não foi possivel obter os usuários onlines');
  } finally {
    db.destroy();
  }
}

export default {
  obterUsuarioPorEmail,
  obterPorId,
  obterGrupos,
  obterTodos,
  obterSetores,
  obterAcessos,
  atualizar,
  cadastrar,
  obterPorCNPJ,
  obterTodosOnline,
};
