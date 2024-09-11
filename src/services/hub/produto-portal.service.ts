import hubHttpUtil from '@utils/hub-http.util';

const obterTodosPorEans = async (eans: string[]) => {
  try {
    const URL = "/portal/products";
    const produtosFornecedor = await hubHttpUtil.post(URL, { eans });
    return produtosFornecedor[0];
  } catch (erro) {
    console.log(erro);
    throw erro;
  }
};

export default {
  obterTodosPorEans,
};
