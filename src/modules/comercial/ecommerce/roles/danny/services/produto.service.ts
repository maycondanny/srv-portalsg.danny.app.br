import produtoModel, { EStatus, Produto } from '@modules/comercial/ecommerce/models/produto.model';
import produtoService from '@modules/comercial/ecommerce/services/produto.service';
import cacheUtil, { ETempoExpiracao } from '@utils/cache.util';
import produtoEanServiceArius from '@modules/integradores/arius/comercial/services/produto-ean.service';
import produtoRepository from '../repositories/produto.repository';
import _ from 'lodash';
import CapaProdutoResponseDTO from '../dtos/capa-produto-response.dto';
import ErroException from '@exceptions/erro.exception';
import fornecedorService from '@modules/core/fornecedores/services/fornecedor.service';
import produtoMapper from '../mappers/produto.mapper';
import numberUtil from '@utils/number.util';
import divergenciasService from './divergencias.service';
import objectUtil from '@utils/object.util';
import ProdutoDTO from '../dtos/produto.dto';
import httpStatusEnum from '@enums/http-status.enum';
import validacaoService from './validacao.service';

const CHAVE_PRODUTO_EAN_ECOMMERCE = 'produto_ean_ecommerce';

const CHAVE_FORNECEDOR = 'fornecedor';

async function obterTodos(): Promise<CapaProdutoResponseDTO[]> {
  const produtos = await produtoRepository.obterTodosAgrupados();
  return agruparPorFornecedor(produtos);
}

async function obterTodosPorFornecedor(fornecedorId: number) {
  if (!fornecedorId) {
    throw new ErroException('Fornecedor não encontrado.');
  }

  let fornecedor = null;
  const fornecedorCacheado = await cacheUtil.obter(`${CHAVE_FORNECEDOR}_${fornecedorId}`);

  if (fornecedorCacheado) {
    fornecedor = fornecedorCacheado;
  } else {
    fornecedor = await fornecedorService.obterPorId(fornecedorId);
    await cacheUtil.add(`${CHAVE_FORNECEDOR}_${fornecedorId}`, fornecedor, ETempoExpiracao.SEIS_HORAS);
  }

  let produtos: Produto[] = await produtoService.obterTodosPorFornecedor(fornecedorId);

  const resultado = produtos?.map(async (produto: Produto) => {
    if (produto?.status === EStatus.APROVADO) {
      return produtoMapper.toDTO(produto);
    }

    const eans = produto.eans;

    if (numberUtil.isMenorOuIgualZero(eans.length)) throw new ErroException('Não foi encontrado nenhum EAN para esse produto.');

    for (const ean of eans) {
      const produtoEan = await obterProdutoEan(ean.codigo);

      if (objectUtil.isVazio(produtoEan)) {
        return produtoMapper.toDTO({ ...produto, status: EStatus.NAO_CADASTRADO });
      }

      const produtoId = produtoEan.produto.id;
      const divergencias = await divergenciasService.obterTodas(produtoId);

      produto.divergencias = divergencias;

      if (produtoModel.possuiDivergencias(produto)) {
        return produtoMapper.toDTO({
          ...produto,
          status: EStatus.CADASTRADO,
          divergencias,
        });
      }

      return produtoMapper.toDTO({
        ...produto,
        produto_arius: produtoId,
        status: EStatus.NOVO,
      });
    }
  });

  return {
    fornecedor,
    produtos: await Promise.all(resultado),
  };
}

async function obterProdutoEan(eanCodigo: string) {
  const chaveCache = `${CHAVE_PRODUTO_EAN_ECOMMERCE}_${eanCodigo}`;
  let produtoEan = await cacheUtil.obter(chaveCache);
  if (!produtoEan) {
    produtoEan = await produtoEanServiceArius.obterPorCodigo(eanCodigo);
    await cacheUtil.add(chaveCache, produtoEan, ETempoExpiracao.QUINZE_MINUTOS);
  }
  return produtoEan;
}

async function atualizar(produtoDTO: ProdutoDTO) {
  if (!produtoDTO) throw new ErroException('Produto não informado para atualização');
  const produto = produtoMapper.toProduto(produtoDTO);
  const validacao = validacaoService.validar(produto);

  if (!validacao.valido) {
    throw new ErroException('Erro ao atualizar novo produto', validacao, httpStatusEnum.Status.ERRO_REQUISICAO);
  }

  await produtoService.atualizar(produto);
}

const agruparPorFornecedor = (produtos: CapaProdutoResponseDTO[]): CapaProdutoResponseDTO[] => {
  return _.chain(produtos)
    .groupBy('fornecedor_id')
    .map((grupo) => grupo[0])
    .value();
};

export default {
  obterTodosPorFornecedor,
  obterTodos,
  atualizar,
};
