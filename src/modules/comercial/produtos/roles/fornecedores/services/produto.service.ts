import produtoEcommerceService from '@modules/comercial/ecommerce/services/produto.service';
import ErroException from '@exceptions/erro.exception';
import { ProdutoDTO } from '../dtos/produto.dto';
import produtoMapper from '../mappers/produto.mapper';
import validacaoService from './validacao.service';
import httpStatusEnum from '@enums/http-status.enum';
import produtoService from '@modules/comercial/produtos/services/produto.service';
import ErroCadastroProdutoDTO from '../dtos/erro-cadastro-produto.dto';
import _ from 'lodash';
import cacheUtil, { ETempoExpiracao } from '@utils/cache.util';
import { CODIGO_REFERENCIA_FORNECEDOR_CACHE } from '@modules/comercial/produtos/models/produto.model';

async function cadastrar(dto: ProdutoDTO): Promise<void | ErroCadastroProdutoDTO> {
  try {
    const referencia = dto.codigo_produto_fornecedor;
    const { valido, mensagensErro } = await validacaoService.isValido(dto);

    if (!valido) {
      throw new ErroException<ErroCadastroProdutoDTO[]>(
        'Erro ao cadastrar novo produto',
        [
          {
            ean: dto.eans[0].codigo || null,
            erros: mensagensErro,
          },
        ],
        httpStatusEnum.Status.ERRO_REQUISICAO
      );
    }

    const produto = produtoMapper.toProduto(dto);
    const produtoId = await produtoService.cadastrar(produto);

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

    await cacheUtil.add(`${CODIGO_REFERENCIA_FORNECEDOR_CACHE}_${referencia}`, referencia, ETempoExpiracao.UMA_SEMANA);
  } catch (erro) {
    console.error(erro);
    throw erro;
  }
}

async function obterTodosPorFornecedor(fornecedorId: number): Promise<ProdutoDTO[]> {
  const produtos = await produtoService.obterTodosPorFornecedor(fornecedorId);
  return _.map(produtos, (produto) => produtoMapper.toDTO(produto));
}

async function obterPorId(id: number): Promise<ProdutoDTO> {
  const produto = await produtoService.obterPorId(id);
  return produtoMapper.toDTO(produto);
}

export default {
  cadastrar,
  obterTodosPorFornecedor,
  obterPorId,
};
