import ariusUtil from '@utils/arius.util';
import cacheUtil, { ETempoExpiracao } from '@utils/cache.util';
import Familia from '../models/familia.model';

const URI = '/AriusERP/v2/Familia';
const CHAVE_CACHE = 'familia';

async function cadastrar(nome: string): Promise<Familia> {
  try {
    const resposta = await ariusUtil.post<Familia>(URI, {
      descricao: nome,
    });
    cacheUtil.add(`${CHAVE_CACHE}_${resposta.id}`, resposta, ETempoExpiracao.UMA_SEMANA);
    return resposta;
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
}

async function obter(id: number): Promise<Familia> {
  try {
    const chave = `${CHAVE_CACHE}_${id}`;
    const familiaCache = await cacheUtil.obter(chave);
    if (familiaCache) return familiaCache;

    const url = `${URI}/${id}`;
    return await ariusUtil.get(url);
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
}

export default {
  cadastrar,
  obter,
};
