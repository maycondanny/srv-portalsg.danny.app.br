import produtoEcommerceService from '@modules/comercial/ecommerce/services/produto.service';
import ErroException from '@exceptions/erro.exception';
import { ProdutoDTO } from '../dtos/produto.dto';
import produtoMapper from '../mappers/produto.mapper';
import httpStatusEnum from '@enums/http-status.enum';
import produtoService from '@modules/comercial/produtos/services/produto.service';
import _ from 'lodash';
import cacheUtil, { ETempoExpiracao } from '@utils/cache.util';
import { CODIGO_REFERENCIA_FORNECEDOR_CACHE } from '@modules/comercial/produtos/models/produto.model';
import validacaoService from './validacao.service';

async function cadastrar(produtoDTO: ProdutoDTO): Promise<void> {
  const produto = produtoMapper.toProduto(produtoDTO);
  const validacao = await validacaoService.validarCadastro(produto);

  if (!validacao.valido) {
    throw new ErroException('Erro ao cadastrar novo produto', validacao, httpStatusEnum.Status.ERRO_REQUISICAO);
  }

  const produtoId = await produtoService.cadastrar(produto);

  try {
    await produtoEcommerceService.cadastrar({
      caracteristica: produto.ecommerce.caracteristica,
      descricao: produto.ecommerce.descricao,
      eans: produto.eans,
      fornecedor_id: produto.fornecedor_id,
      imagens: produto.ecommerce.imagens,
      modo_uso: produto.ecommerce.modo_uso,
      nome: produto.descritivo_pdv,
      produto_id: produtoId,
    });
  } catch (erro) {
    console.log('O produto não foi cadastrado no ecommerce pois o mesmo não existe');
  }

  const referenciaFornecedor = produto.codigo_produto_fornecedor;

  await cacheUtil.add(
    `${CODIGO_REFERENCIA_FORNECEDOR_CACHE}_${produto.fornecedor_id}_${referenciaFornecedor}`,
    referenciaFornecedor,
    ETempoExpiracao.UMA_SEMANA
  );
}

async function obterTodosPorFornecedor(fornecedorId: number): Promise<ProdutoDTO[]> {
  const produtos = await produtoService.obterTodosPorFornecedor(fornecedorId);
  return _.map(produtos, (produto) => produtoMapper.toDTO(produto));
}

async function obterPorId(id: number): Promise<ProdutoDTO> {
  const produto = await produtoService.obterPorId(id);
  return produtoMapper.toDTO(produto);
}

async function atualizar(produtoDTO: ProdutoDTO) {
  const produto = produtoMapper.toProduto(produtoDTO);
  const validacao = await validacaoService.validarAtualizacao(produto);

  if (!validacao.valido) {
    throw new ErroException('Erro ao atualizar o produto', validacao, httpStatusEnum.Status.ERRO_REQUISICAO);
  }

  await produtoService.atualizar(produto);

  await produtoEcommerceService.atualizarPorProdutoId(produto.id, {
    descricao: produto.ecommerce.descricao,
    imagens: produto.ecommerce.imagens,
    modo_uso: produto.ecommerce.modo_uso,
    caracteristica: produto.ecommerce.caracteristica,
    eans: produto.eans,
  });
}

export default {
  cadastrar,
  obterTodosPorFornecedor,
  obterPorId,
  atualizar,
};
