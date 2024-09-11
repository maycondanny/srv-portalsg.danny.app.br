import axios from 'axios';

const LOGIN = process.env.ARIUS_AUTH_LOGIN;
const PASSWORD = process.env.ARIUS_AUTH_PASSWORD;

const instanciaAxios = axios.create({
  baseURL: process.env.ARIUS_API,
});

async function post<T>(uri: string, dados: T): Promise<any> {
  try {
    const token = obterAutenticacao();
    const resposta = await instanciaAxios.post(uri, dados, {
      headers: {
        Authorization: token,
      },
    });
    return resposta.data;
  } catch (erro) {
    console.error('Erro no POST da Arius');
    throw erro;
  }
}

async function put<T>(uri: string, dados: T): Promise<any> {
  try {
    const token = obterAutenticacao();
    const resposta = await instanciaAxios.put(uri, dados, {
      headers: {
        Authorization: token,
      },
    });
    return resposta.data;
  } catch (erro) {
    console.error('Erro no PUT da Arius');
    throw erro;
  }
}

async function get<T>(uri: string): Promise<T> {
  try {
    const resposta = await instanciaAxios.get(uri, {
      headers: {
        Authorization: obterAutenticacao(),
      },
    });
    return resposta.data;
  } catch (erro) {
    console.error('Erro no PUT da Arius');
    throw erro;
  }
}

const obterAutenticacao = () => {
  const basicAuth = 'Basic ' + btoa(LOGIN + ':' + PASSWORD);
  return basicAuth;
};

export default {
  get,
  post,
  put,
};
