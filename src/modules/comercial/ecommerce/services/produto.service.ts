import _ from 'lodash';
import { Produto } from '../models/produto.model';
import produtoRepository from '../repositories/produto.repository';
import eanService from './ean.service';
import imagemService from './imagem.service';
import numberUtil from '@utils/number.util';
import ErroException from '@exceptions/erro.exception';

async function cadastrar(produto: Produto) {
  try {
    const eans = produto.eans;
    const imagens = produto.imagens;
    const produtoTratado = _.omit(produto, ['eans', 'imagens']) as Produto;
    const ecommerceId = await produtoRepository.cadastrar(produtoTratado);
    await eanService.cadastrar(ecommerceId, eans);
    await imagemService.cadastrar(ecommerceId, imagens);
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
}

async function obterTodosPorFornecedor(fornecedorId: number): Promise<Produto[]> {
  try {
    if (!fornecedorId) throw new ErroException('Fornecedor não informado');
    const produtos = await produtoRepository.obterTodosPorFornecedor(fornecedorId);
    const produtosFornecedor = _.map(produtos, async (produto) => ({
      ...produto,
      eans: await eanService.obterPorId(produto.id),
      imagens: await imagemService.obterPorId(produto.id),
    }));
    return await Promise.all(produtosFornecedor);
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
}

async function obterPorProdutoId(produtoId: number) {
  try {
    const produto = await produtoRepository.obterPorProdutoId(produtoId);
    if (!produto?.id) return produto;
    const eans = await eanService.obterPorId(produto?.id);
    const imagens = await imagemService.obterPorId(produto?.id);
    return { ...produto, eans, imagens };
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
}

async function obterPorId(id: number) {
  try {
    const produto = await produtoRepository.obterPorId(id);
    if (!produto) throw new ErroException('Produto não encontrado');
    const eans = await eanService.obterPorId(produto?.id);
    const imagens = await imagemService.obterPorId(produto?.id);
    return { ...produto, eans, imagens };
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
}

async function atualizarPorProdutoId(produtoId: number, produto: Partial<Produto>) {
  try {
    const eans = produto.eans;
    const imagens = produto.imagens;
    const produtoTratado = _.omit(produto, ['eans', 'imagens']) as Produto;
    const ecommerceId = await produtoRepository.atualizarPorProdutoId(produtoId, produtoTratado);
    if (numberUtil.isMaiorZero(imagens.length)) {
      await imagemService.atualizar(ecommerceId, imagens);
    }
    if (numberUtil.isMaiorZero(eans.length)) {
      await eanService.atualizar(ecommerceId, eans);
    }
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
}

async function atualizar(produto: Partial<Produto>) {
  try {
    const eans = produto?.eans;
    const imagens = produto?.imagens;
    const produtoTratado = _.omit(produto, ['eans', 'imagens', 'divergencias']) as Produto;
    const ecommerceId = await produtoRepository.atualizar(produtoTratado);
    if (numberUtil.isMaiorZero(imagens?.length)) {
      await imagemService.atualizar(ecommerceId, imagens);
    }
    if (numberUtil.isMaiorZero(eans?.length)) {
      await eanService.atualizar(ecommerceId, eans);
    }
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
}

export default {
  cadastrar,
  obterPorProdutoId,
  atualizarPorProdutoId,
  obterTodosPorFornecedor,
  obterPorId,
  atualizar,
};
