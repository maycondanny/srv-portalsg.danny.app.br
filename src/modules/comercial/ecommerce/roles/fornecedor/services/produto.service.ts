import validacaoService from './validacao.service';
import ErroException from '@exceptions/erro.exception';
import httpStatusEnum from '@enums/http-status.enum';
import ProdutoDTO from '../dtos/produto.dto';
import produtoService from '@modules/comercial/ecommerce/services/produto.service';
import produtoMapper from '../mappers/produto.mapper';
import _ from 'lodash';

async function cadastrar(produtoDTO: ProdutoDTO) {
  const produto = produtoMapper.toProduto(produtoDTO);
  const validacao = await validacaoService.validar(produto);

  if (!validacao.valido) {
    throw new ErroException('Erro ao cadastrar novo produto', validacao, httpStatusEnum.Status.ERRO_REQUISICAO);
  }

  await produtoService.cadastrar(produto);
}

async function obterTodos(fornecedorId: number): Promise<ProdutoDTO[]> {
  const produtos = await produtoService.obterTodosPorFornecedor(fornecedorId);
  const produtosDTO = _.map(produtos, (produto) => produtoMapper.toDTO(produto));
  return produtosDTO;
}

async function obterPorId(id: number): Promise<ProdutoDTO> {
  if (!id) throw new ErroException('ID do produto não informado');
  const produto = await produtoService.obterPorId(id);
  return produtoMapper.toDTO(produto);
}

async function atualizar(produtoDTO: ProdutoDTO): Promise<void> {
  if (!produtoDTO) throw new ErroException('Produto não informado para atualização');
  const produto = produtoMapper.toProduto(produtoDTO);
  const validacao = await validacaoService.validar(produto);

  if (!validacao.valido) {
    throw new ErroException('Erro ao atualizar o produto', validacao, httpStatusEnum.Status.ERRO_REQUISICAO);
  }

  await produtoService.atualizar(produto);
}

export default {
  cadastrar,
  obterTodos,
  obterPorId,
  atualizar,
};
