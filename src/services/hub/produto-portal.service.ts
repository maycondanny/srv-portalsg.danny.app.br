import hubUtil from '@utils/hub.util';

const obterTodosPorEans = async (eans: string[]) => {
  try {
    const URL = "/portal/products";
    const produtosFornecedor = await hubUtil.post(URL, { eans });
    return produtosFornecedor[0];
  } catch (erro) {
    console.log(erro);
    throw erro;
  }
};

export default {
  obterTodosPorEans,
};
