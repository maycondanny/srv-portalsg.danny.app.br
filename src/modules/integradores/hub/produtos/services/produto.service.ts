import hubUtil from '@utils/hub.util';

async function obterTodosPorEans(eans: string[]) {
  const URL = '/portal/products';
  const produtosFornecedor = await hubUtil.post(URL, { eans });
  return produtosFornecedor[0];
}

export default {
  obterTodosPorEans,
};
