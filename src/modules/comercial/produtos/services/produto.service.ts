import produtoEcommerceService from '@modules/comercial/ecommerce/services/produto.service';
import _ from 'lodash';
import produtoModel, { Produto } from '../models/produto.model';
import produtoRepository from '../repositories/produto.repository';
import eanService from './ean.service';
import numberUtil from '@utils/number.util';
import ErroException from '@exceptions/erro.exception';

async function cadastrar(produto: Produto) {
  const eans = produto.eans;
  const duns = produto.duns;
  const produtoTratado = _.omit(produto, ['eans', 'duns', 'ecommerce']);
  const produtoId = await produtoRepository.cadastrar(produtoTratado);
  await eanService.cadastrarEmlote(produtoId, produtoModel.juntarEansDuns(eans, duns, produtoTratado.qtde_embalagem));
  return produtoId;
}

async function obterTodosPorFornecedor(fornecedorId: number): Promise<Produto[]> {
  try {
    if (!fornecedorId) throw new ErroException('Fornecedor não encontrado.');
    const produtos = await produtoRepository.obterTodosPorFornecedor(fornecedorId);
    const resultado = _.map(produtos, async (produto) => {
      const ecommerce = await produtoEcommerceService.obterPorProdutoId(produto.id);
      const eans = await eanService.obterPorProdutoId(produto.id);
      return {
        ...produto,
        ecommerce,
        eans: produtoModel.obterEans(eans),
        duns: produtoModel.obterDuns(eans),
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
    if (!id) throw new ErroException('Id produto não encontrado.');
    const produto = await produtoRepository.obterPorId(id);
    if (!produto) throw new ErroException("Produto não encontrado");
    const eans = await eanService.obterPorProdutoId(produto.id);
    const ecommerce = await produtoEcommerceService.obterPorProdutoId(produto.id);
    return { ...produto, ecommerce, eans: produtoModel.obterEans(eans), duns: produtoModel.obterDuns(eans) };
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
}

async function atualizar(produto: Partial<Produto>) {
  if (!produto.id) throw new ErroException('ID do produto não informado para a atualização');
  const eans = produto.eans;
  const duns = produto.duns;
  const produtoTratado = _.omit(produto, ['eans', 'duns', 'ecommerce']);
  await produtoRepository.atualizar(produtoTratado);
  if ((produto.eans && numberUtil.isMaiorZero(produto.eans.length)) || (produto.duns && numberUtil.isMaiorZero(produto.duns.length))) {
    await eanService.atualizar(produtoModel.juntarEansDuns(eans, duns, produtoTratado.qtde_embalagem));
  }
}

export default {
  cadastrar,
  obterTodosPorFornecedor,
  obterPorId,
  atualizar,
};
