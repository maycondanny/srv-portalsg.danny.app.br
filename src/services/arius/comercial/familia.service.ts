import ariusUtil from '@utils/arius.util';
import cacheUtil, { ETempoExpiracao } from '@utils/cache.util';

interface Familia {
  id?: number;
  descricao: string;
  dataCadastro?: Date;
  dataAlteracao?: Date;
  maxDesconto?: number;
}

const URI = '/AriusERP/v2/Familia';
const CHAVE_CACHE = 'familia';

async function cadastrar(familia: Familia): Promise<Familia> {
  try {
    const resposta = await ariusUtil.post(URI, familia);
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
