import getDbInstance from '@db/db';
import Icone from '../models/icone.model';

const obterTodos = async (): Promise<Icone[]> => {
  const db = getDbInstance();
  try {
    return await db.select('*').from('icones');
  } catch (erro) {
    console.error(erro);
    throw new Error('Não foi possivel obter os icones.');
  } finally {
    db.destroy();
  }
};

const salvar = async (icone: Icone) => {
  const db = getDbInstance();
  try {
    await db.transaction(async (trx) => {
      await trx
        .insert({
          nome: icone.nome,
          pacote: icone.pacote,
          apelido: icone.apelido,
        })
        .into('icones');
    });
  } catch (erro) {
    console.error(erro);
    throw new Error('Não foi possivel salvar o icone.');
  } finally {
    db.destroy();
  }
};

const obterPorId = async (id: number) => {
  const db = getDbInstance();
  try {
    const icones = await db.select('*').from('icones').where('id', '=', id);
    return icones[0];
  } catch (erro) {
    console.error(erro);
    throw new Error('Não foi possivel obter os icones.');
  } finally {
    db.destroy();
  }
};

export default {
  obterTodos,
  salvar,
  obterPorId,
};
