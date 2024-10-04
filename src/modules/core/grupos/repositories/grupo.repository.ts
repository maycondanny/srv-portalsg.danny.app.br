import getDbInstance from "@db/db";
import Grupo from "../models/grupo.model";
import ErroException from "@exceptions/erro.exception";

const obterPorSetores = async (setores: number[]): Promise<Grupo[]> => {
  const db = getDbInstance();
  try {
    return await db
      .select("g.*", "s.nome AS setor")
      .from("grupos AS g")
      .join("setores AS s", "g.setor_id", "s.id")
      .whereIn("setor_id", setores)
      .andWhere("s.ativo", "=", 1);
  } catch (erro) {
    console.error(erro);
    throw new ErroException("Não foi possivel obter os grupos.");
  } finally {
    db.destroy();
  }
};

const obterTodos = async (ativos?: boolean): Promise<Grupo[]> => {
  const db = getDbInstance();
  try {
    const query = db
      .select("g.*", "s.nome AS setor")
      .from("grupos AS g")
      .join("setores AS s", "g.setor_id", "s.id")
      .andWhere("s.ativo", "=", 1);

      if (ativos) {
        query.andWhere("g.ativo", "=", 1);
      }

    return await query;
  } catch (erro) {
    console.error(erro);
    throw new ErroException("Não foi possivel obter os grupos.");
  } finally {
    db.destroy();
  }
};

const cadastrar = async (grupo: Grupo) => {
  const db = getDbInstance();

  try {
    await db.transaction(async (trx) => {
      await trx
        .insert({
          nome: grupo.nome,
          setor_id: grupo.setor_id
        })
        .into("grupos");
    });
  } catch (erro) {
    console.error(erro);
    throw new ErroException("Não foi possivel cadastrar um novo grupo.");
  } finally {
    db.destroy();
  }
};

const atualizar = async (grupo: Grupo) => {
  const db = getDbInstance();

  try {
    await db.transaction(async (trx) => {
      await trx
        .update({
          nome: grupo.nome,
          setor_id: grupo.setor_id,
          ativo: grupo.ativo
        })
        .from("grupos")
        .where("id", grupo.id);
    });
  } catch (erro) {
    console.error(erro);
    throw new ErroException("Não foi possivel atualizar o grupo.");
  } finally {
    db.destroy();
  }
};

export default {
  obterPorSetores,
  obterTodos,
  cadastrar,
  atualizar,
};
