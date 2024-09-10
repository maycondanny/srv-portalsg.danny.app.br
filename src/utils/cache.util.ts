import config from '@configs/cache.config';
import { Redis } from 'ioredis';

const redis = new Redis(config);

redis.on('ready', () => console.log('Servidor de cacheamento iniciado com SUCESSO...'));
redis.on('error', (error) => console.log('Erro nao iniciar servidor de cacheamento!', error));

export enum ETempoExpiracao {
  QUINZE_MINUTOS = 60 * 15,
  UMA_HORA = 60 * 60 * 1,
  SEIS_HORAS = 60 * 60 * 6,
  UMA_SEMANA = 60 * 60 * 24 * 7,
}

const obter = async (chave: string) => {
  try {
    const data = await redis.get(chave);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Erro ao obter os dados do cache. CHAVE: [${chave}]`, error);
    return null;
  }
};

const add = async (chave: string, valor: any, expiracao: ETempoExpiracao = ETempoExpiracao.UMA_HORA) => {
  try {
    await redis.set(chave, JSON.stringify(valor), 'EX', expiracao);
  } catch (error) {
    console.error(`Erro ao adicionar no cache. CHAVE: [${chave}]`, error);
  }
};

const remover = async (chave: string) => {
  try {
    await redis.del(chave);
  } catch (error) {
    console.error(`Erro ao deletar do cache. CHAVE: [${chave}]`, error);
  }
};

export default {
  obter,
  add,
  remover,
};
