import getDbInstance from "@db/db";
import Aviso from "../models/aviso.model";

async function obterUltimo() {
  const db = getDbInstance();
  try {
    return await db
      .select("mensagem", "data_inicio", "data_fim")
      .into("avisos")
      .orderBy("created_at", "desc")
      .first();
  } catch (erro) {
    console.error(erro);
    throw new Error("Não foi possivel obter o aviso.");
  } finally {
    db.destroy();
  }
};

async function obterTodos() {
  const db = getDbInstance();
  try {
    return await db
      .select("mensagem", "data_inicio", "data_fim", "created_at")
      .into("avisos")
      .orderBy("created_at", "desc");
  } catch (erro) {
    console.error(erro);
    throw new Error("Não foi possivel obter todos os avisos.");
  } finally {
    db.destroy();
  }
};

async function cadastrar(aviso: Aviso) {
  const db = getDbInstance();
  try {
    await db.transaction(async (trx) => {
      await trx
        .insert({
          mensagem: aviso.mensagem,
          data_inicio: aviso.data_inicio,
          data_fim: aviso.data_fim,
        })
        .into("avisos");
    });
  } catch (erro) {
    console.error(erro);
    throw new Error("Não foi possivel cadastrar o aviso.");
  } finally {
    db.destroy();
  }
};

export default {
  cadastrar,
  obterTodos,
  obterUltimo,
};
