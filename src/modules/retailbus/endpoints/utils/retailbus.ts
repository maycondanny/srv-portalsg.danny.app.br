import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const instanciaAxios = axios.create({
  baseURL: process.env.BUS_HOST,
  headers: {
    "x-api-token": process.env.BUS_AUTH_TOKEN,
  },
});

const get = async (url: string, headers?: any) => {
  try {
    const resposta = await instanciaAxios.get(url, { headers });
    return resposta.data;
  } catch (erro) {
    console.error(erro);
    throw new Error(erro);
  }
};

export default {
    get
}
