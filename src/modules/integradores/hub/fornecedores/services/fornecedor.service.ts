import hubUtil from '@utils/hub.util';
import Fornecedor from '../models/fornecedor.model';
import ErroException from '@exceptions/erro.exception';

async function obterPorCnpj(cnpj: string): Promise<Fornecedor> {
  if (!cnpj) {
    throw new ErroException('CNPJ não informado.');
  }
  const dados = await hubUtil.get(`/suppliers?cnpj_cpf=${cnpj}`);
  return dados[0];
}

async function atualizar(fornecedor: Partial<Fornecedor>) {
  try {
    if (!fornecedor) {
      throw new ErroException('Fornecedor não informado para atualização.');
    }
    await hubUtil.put('/suppliers/update', fornecedor);
  } catch (erro) {
    console.log('Erro ao atualizar os dados do fornecedor.');
    throw erro;
  }
}

export default {
  obterPorCnpj,
  atualizar,
};
