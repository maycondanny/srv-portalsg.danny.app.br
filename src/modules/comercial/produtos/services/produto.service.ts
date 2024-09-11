import produtoEcommerceService from '@modules/comercial/ecommerce/services/produto.service';
import _ from 'lodash';
import { Produto } from '../models/produto.model';
import produtoRepository from '../repositories/produto.repository';
import eanService from './ean.service';
import numberUtil from '@utils/number.util';
import eanModel from '../models/ean.model';

async function cadastrar(produto: Produto) {
  const eans = produto.eans;
  const produtoTratado = _.omit(produto, ['eans', 'ecommerce']);
  const produtoId = await produtoRepository.cadastrar(produtoTratado);
  await eanService.cadastrarEmlote(produtoId, eans);
  return produtoId;
}

async function obterTodosPorFornecedor(fornecedorId: number): Promise<Produto[]> {
  try {
    if (!fornecedorId) throw new Error('Fornecedor não encontrado.');
    const produtos = await produtoRepository.obterTodosPorFornecedor(fornecedorId);
    const resultado = _.map(produtos, async (produto) => {
      const ecommerce = await produtoEcommerceService.obterPorProdutoId(produto.id);
      return {
        ...produto,
        ecommerce,
      };
    });
    return await Promise.all(resultado);
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
}

async function obterPorId(id: number): Promise<Produto> {
  try {
    if (!id) throw new Error('Id produto não encontrado.');
    const produto = await produtoRepository.obterPorId(id);
    const eans = await eanService.obterPorProdutoId(produto.id);
    const ecommerce = await produtoEcommerceService.obterPorProdutoId(produto.id);
    return { ...produto, ecommerce, eans };
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
}

async function atualizar(produto: Partial<Produto>) {
  const eans = produto.eans;
  const produtoTratado = _.omit(produto, ['eans', 'ecommerce']);
  await produtoRepository.atualizar(produtoTratado);
  if (eans && numberUtil.isMaiorZero(eans.length)) {
    await eanService.atualizar(produto.eans);
  }
}

export default {
  cadastrar,
  obterTodosPorFornecedor,
  obterPorId,
  atualizar,
};
