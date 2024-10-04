import getDbInstance from "@db/db";
import Setor from "../models/setor.model";
import ErroException from "@exceptions/erro.exception";

async function obterTodos(ativos?: boolean): Promise<Setor[]> {
  const db = getDbInstance();
  try {
    const query = db.select("*").from("setores AS s");
    if (ativos) {
      query.where("s.ativo", "=", 1);
    }
    return await query;
  } catch (erro) {
    console.error(erro);
    throw new ErroException("Não foi possivel obter os setores.");
  } finally {
    db.destroy();
  }
};

async function cadastrar(setor: Setor) {
  const db = getDbInstance();

  try {
    await db.transaction(async (trx) => {
      await trx
        .insert({
          nome: setor.nome,
        })
        .into("setores");
    });
  } catch (erro) {
    console.error(erro);
    throw new ErroException("Não foi possivel cadastrar um novo setor.");
  } finally {
    db.destroy();
  }
};

async function atualizar(setor: Setor) {
  const db = getDbInstance();

  try {
    await db.transaction(async (trx) => {
      await trx
        .update({
          nome: setor.nome,
          ativo: setor.ativo,
        })
        .from("setores")
        .where("id", setor.id);
    });
  } catch (erro) {
    console.error(erro);
    throw new ErroException("Não foi possivel atualizar o setor.");
  } finally {
    db.destroy();
  }
};

export default {
  obterTodos,
  cadastrar,
  atualizar,
};
