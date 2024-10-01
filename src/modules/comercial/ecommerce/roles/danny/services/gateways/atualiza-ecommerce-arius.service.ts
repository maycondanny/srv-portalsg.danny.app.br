import produtoModel, { EStatus, Produto } from '@modules/comercial/ecommerce/models/produto.model';
import produtoEcommerceServiceArius from '@modules/integradores/arius/ecommerce/services/produto.service';
import aprovacaoService from '../aprovacao.service';
import { Divergencia } from '@modules/comercial/ecommerce/models/divergencia.model';
import objectUtil from '@utils/object.util';
import numberUtil from '@utils/number.util';
import produtoService from '@modules/comercial/ecommerce/services/produto.service';
import ErroException from '@exceptions/erro.exception';
import validacaoService from '../validacao.service';
import _ from 'lodash';
import httpStatusEnum from '@enums/http-status.enum';

async function atualizar(produto: Produto, produtoAtualizacao: Produto) {
  if (!produtoModel.possuiDivergencias(produto)) {
    throw new ErroException('Dados do produto cadastrado não informados');
  }
  const divergencia: Divergencia = produto.divergencias[0];

  const validacao = validacaoService.validar(_.merge({}, produto, produtoAtualizacao));

  if (!validacao.valido) {
    throw new ErroException('Erro ao aprovar o produto', validacao, httpStatusEnum.Status.ERRO_REQUISICAO);
  }

  await atualizarArius(produtoAtualizacao, divergencia);

  if (produtoModel.possuiImagens(produtoAtualizacao)) {
    await aprovacaoService.salvarImagens({ ...produtoAtualizacao, produto_id: produto.produto_arius });
  }

  await atualizarBaseDados(produto, produtoAtualizacao, divergencia);
}

const atualizarArius = async (produtoAtualizacao: Produto, divergencia: Divergencia) => {
  try {
    const campos = {
      ...(produtoAtualizacao.nome && {
        nome: produtoAtualizacao.nome,
        urlPlataforma: produtoModel.obterUrlPlataforma(produtoAtualizacao.nome),
      }),
      ...(produtoAtualizacao.marca && { marcasEcommerce: { id: produtoAtualizacao.marca } }),
      ...(produtoAtualizacao.depto && { departamento: { idCategoria: produtoAtualizacao.depto } }),
      ...(produtoAtualizacao.secao && { secao: { idCategoria: produtoAtualizacao.secao } }),
      ...(produtoAtualizacao.descricao && {
        descricao: produtoAtualizacao.descricao,
        descricaoHtml: produtoAtualizacao.descricao,
      }),
      ...(produtoAtualizacao.caracteristica && {
        caracteristica: produtoAtualizacao.caracteristica,
        caracteristicaHtml: produtoAtualizacao.caracteristica,
      }),
      ...(produtoAtualizacao.modo_uso && { modoUso: produtoAtualizacao.modo_uso }),
      ...(typeof produtoAtualizacao.ativo !== undefined && {
        tipoSituacaoProdutoEcommerce: produtoAtualizacao.ativo ? 'ATIVO' : 'INATIVO',
      }),
      ...(typeof produtoAtualizacao.lancamento !== undefined && { lancamento: produtoAtualizacao.lancamento }),
      ...(typeof produtoAtualizacao.destaque !== undefined && { destaque: produtoAtualizacao.destaque }),
    };

    if (objectUtil.isVazio(campos)) {
      return;
    }

    await produtoEcommerceServiceArius.atualizar({
      produtoId: divergencia.produto_id,
      ...campos,
    });
  } catch (erro) {
    console.log(erro);
    throw new ErroException(erro.response.data.processedException?.causeMessage);
  }
};

const atualizarBaseDados = async (produto: Produto, produtoAtualizacao: Produto, divergencia: Divergencia) => {
  const campos = {
    nome: produtoAtualizacao?.nome ?? divergencia.nome,
    marca: produtoAtualizacao?.marca ?? divergencia.marca,
    depto: produtoAtualizacao?.depto ?? divergencia.depto,
    secao: produtoAtualizacao?.secao ?? divergencia.secao,
    descricao: produtoAtualizacao?.descricao ?? divergencia.descricao,
    caracteristica: produtoAtualizacao?.caracteristica ?? divergencia.caracteristica,
    modo_uso: produtoAtualizacao?.modo_uso ?? divergencia.modo_uso,
    ativo: produtoAtualizacao?.ativo ?? divergencia.ativo,
    lancamento: produtoAtualizacao?.lancamento ?? divergencia.lancamento,
    destaque: produtoAtualizacao?.destaque ?? divergencia.destaque,
    imagens: numberUtil.isMaiorZero(produtoAtualizacao?.imagens?.length)
      ? produtoAtualizacao.imagens
      : divergencia.imagens,
  };

  if (objectUtil.isVazio(campos)) {
    return;
  }

  try {
    await produtoService.atualizar({
      id: produto.id,
      status: EStatus.APROVADO,
      produto_arius: divergencia.produto_id,
      ...campos,
    });
  } catch (erro) {
    console.log(erro);
    throw new ErroException('Não foi possivel realizar a atualização do produto na base de dados');
  }
};

export default {
  atualizar,
};
