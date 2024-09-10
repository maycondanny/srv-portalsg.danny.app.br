import _ from 'lodash';
import Produto from '../models/produto.model';
import produtoRepository from '../repositories/produto.repository';
import eanService from './ean.service';
import imagemService from './imagem.service';

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
    console.log('Nao foi possivel cadastrar no ecommerce');
    throw erro;
  }
}

async function obterPorProdutoId(produtoId: number) {
  try {
    const produto = await produtoRepository.obterPorProdutoId(produtoId);
    const eans = await eanService.obterPorId(produto.id);
    const imagens = await imagemService.obterPorId(produto.id);
    return { ...produto, eans, imagens };
  } catch (erro) {
    console.error(erro);
    console.log('Nao foi possivel obter o produto');
    throw erro;
  }
}

export default {
  cadastrar,
  obterPorProdutoId,
};
