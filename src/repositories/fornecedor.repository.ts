import getDbInstance from "@db/db";
import Fornecedor from "@models/fornecedor.model";

const cadastrar = async (fornecedor: Fornecedor): Promise<number> => {
  const db = getDbInstance();

  try {
    return await db.transaction(async (trx) => {
      const [{ id }] = await trx
        .into("fornecedores")
        .insert({
          id: fornecedor.id,
          nome: fornecedor.nome,
          cnpj: fornecedor.cnpj,
        })
        .onConflict("cnpj")
        .merge()
        .returning("id");

      return id;
    });
  } catch (erro) {
    console.error(erro);
    throw new Error("Não foi possível atualizar o fornecedor");
  } finally {
    await db.destroy();
  }
};

const obterPorId = async (fornecedorId: number): Promise<Fornecedor> => {
  const db = getDbInstance();

  try {
    return await db.into("fornecedores AS f").where("f.id", "=", fornecedorId).first();
  } catch (erro) {
    console.error(erro);
    throw new Error("Não foi possível obter o fornecedor");
  } finally {
    await db.destroy();
  }
};

export default {
  cadastrar,
  obterPorId
};
