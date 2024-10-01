import https from 'https';
import axios from 'axios';
import ErroException from '@exceptions/erro.exception';

const AUTH_URI = '/auth/portal';

const agent = new https.Agent({
  rejectUnauthorized: false,
});

const instanciaAxios = axios.create({
  baseURL: process.env.HUB_API,
  httpsAgent: agent,
});

async function get(url: string, headers?: any) {
  try {
    const token = await obterTokenAcessoHub();
    const resposta = await instanciaAxios.get(url, {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });
    return resposta.data;
  } catch (erro) {
    console.error(erro);
    throw new ErroException(erro);
  }
}

async function post<T>(url: string, data: T, headers?: any) {
  try {
    const token = await obterTokenAcessoHub();
    const resposta = await instanciaAxios.post(url, data, {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });
    return resposta.data ?? {};
  } catch (erro) {
    console.error(erro);
    throw new ErroException(erro);
  }
}

async function put<T>(url: string, data: T, headers?: any) {
  try {
    const token = await obterTokenAcessoHub();
    const resposta = await instanciaAxios.put(url, data, {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });
    return resposta.data ?? {};
  } catch (erro) {
    console.error(erro);
    throw new ErroException(erro);
  }
}

async function obterTokenAcessoHub() {
  const url = `${process.env.HUB_API}${AUTH_URI}`;
  const resposta = await axios.post(url, {
    login: process.env.HUB_AUTH_LOGIN,
    password: process.env.HUB_AUTH_PASSWORD,
  });
  const token = resposta.data?.token;
  if (!token) throw new ErroException('Nao foi possivel obter o token de acesso do HUB');
  return token;
}

export default {
  get,
  post,
  put,
  obterTokenAcessoHub
};
