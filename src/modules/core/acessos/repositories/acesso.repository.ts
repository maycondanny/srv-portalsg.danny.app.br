import getDbInstance from "@db/db";
import Acesso from "../models/acesso.model";
import Grupo from "@modules/core/grupos/models/grupo.model";

async function obterTodos(ativo?: boolean): Promise<Acesso[]> {
  const db = getDbInstance();

  try {
    const query = db
      .select("a.*", "s.nome AS setor")
      .from("acessos AS a")
      .join("setores AS s", "a.setor_id", "s.id")
      .where("s.ativo", "=", 1);

    if (ativo) {
      query.andWhere("a.ativo", "=", 1);
    }

    let acessos = await query;

    acessos = await Promise.all(
      acessos.map(async (acesso) => {
        return {
          ...acesso,
          grupos: await obterGrupos(acesso),
        };
      })
    );
    return acessos;
  } catch (erro) {
    console.error(erro);
    throw new Error("Não foi possivel obter os acessos.");
  } finally {
    db.destroy();
  }
};

async function obterGrupos(acesso: Acesso) {
  const db = getDbInstance();
  try {
    return await db
      .select("g.*")
      .from("acessos_grupos AS a")
      .join("grupos AS g", "g.id", "a.grupo_id")
      .where("a.acesso_id", "=", acesso.id)
      .andWhere("g.ativo", "=", 1);
  } catch (erro) {
    console.error(erro);
    throw new Error("Não foi possivel obter os grupos do acesso.");
  } finally {
    db.destroy();
  }
};

async function obterTodosPorSetores(setores: number[]): Promise<Acesso[]> {
  const db = getDbInstance();
  try {
    return await db
      .select("a.*", "s.nome AS setor")
      .from("acessos AS a")
      .join("setores AS s", "a.setor_id", "s.id")
      .whereIn("setor_id", setores)
      .andWhere("s.ativo", "=", 1);
  } catch (erro) {
    console.error(erro);
    throw new Error("Não foi possivel obter os acessos.");
  } finally {
    db.destroy();
  }
};

async function cadastrar(acesso: Acesso) {
  const db = getDbInstance();
  try {
    await db.transaction(async (trx) => {
      const [{ id }] = await trx
        .insert({
          pagina: acesso.pagina,
          modulo: acesso.modulo,
          setor_id: acesso.setor_id,
          sub_submodulo: acesso.sub_submodulo,
          submodulo: acesso.submodulo,
          tag: acesso.tag,
          icone_id: acesso.icone_id
        })
        .into("acessos")
        .returning("id");
      await trx.commit();
      await cadastrarGrupos(id, acesso.grupos);
    });
  } catch (erro) {
    console.error(erro);
    throw new Error("Não foi possivel cadastrar um novo acesso.");
  } finally {
    db.destroy();
  }
};

async function cadastrarGrupos(acessoId: number, grupos: Grupo[]) {
  const db = getDbInstance();
  try {
    await db.transaction(async (trx) => {
      for (const grupo of grupos) {
        await trx
          .insert({
            grupo_id: grupo.id,
            acesso_id: acessoId,
          })
          .into("acessos_grupos");
      }
      await trx.commit();
    });
  } catch (erro) {
    console.error(erro);
    throw new Error("Não foi possivel cadastrar os grupos do acesso.");
  } finally {
    db.destroy();
  }
};

async function atualizar(acesso: Acesso) {
  const db = getDbInstance();

  try {
    await db.transaction(async (trx) => {
      await trx
        .update({
          pagina: acesso.pagina,
          modulo: acesso.modulo,
          setor_id: acesso.setor_id,
          icone_id: acesso.icone_id,
          sub_submodulo: acesso.sub_submodulo,
          submodulo: acesso.submodulo,
          tag: acesso.tag,
          ativo: acesso.ativo,
        })
        .from("acessos")
        .where("id", acesso.id);

      await trx
        .from("acessos_grupos AS ag")
        .where("ag.acesso_id", "=", acesso.id)
        .del();

      await cadastrarGrupos(acesso.id, acesso.grupos);
      await trx.commit();
    });
  } catch (erro) {
    console.error(erro);
    throw new Error("Não foi possivel atualizar os acessos.");
  } finally {
    db.destroy();
  }
};

export default {
  obterTodos,
  obterTodosPorSetores,
  cadastrar,
  atualizar,
  obterGrupos,
};
