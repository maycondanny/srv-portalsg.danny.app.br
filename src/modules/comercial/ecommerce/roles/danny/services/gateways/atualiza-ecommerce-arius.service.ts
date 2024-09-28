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
  const divergencia: Divergencia = produto.divergencias[0];

  const validacao = validacaoService.validar(_.merge({}, produto, produtoAtualizacao));

  if (!validacao.valido) {
    throw new ErroException('Erro ao aprovar o produto', validacao, httpStatusEnum.Status.ERRO_REQUISICAO);
  }

  await atualizarArius(produto, produtoAtualizacao);

  if (numberUtil.isMaiorZero(produtoAtualizacao?.imagens?.length)) {
    await aprovacaoService.salvarImagens({ ...produtoAtualizacao, produto_id: produto.produto_id });
  }

  await atualizarBaseDados(produto, produtoAtualizacao, divergencia);
}

const atualizarArius = async (produto: Produto, dadosAtualizacao: Produto) => {
  try {
    const campos = {
      ...(dadosAtualizacao.nome && {
        nome: dadosAtualizacao.nome,
        urlPlataforma: produtoModel.obterUrlPlataforma(dadosAtualizacao.nome),
      }),
      ...(dadosAtualizacao.marca && { marcasEcommerce: { id: dadosAtualizacao.marca } }),
      ...(dadosAtualizacao.depto && { departamento: { idCategoria: dadosAtualizacao.depto } }),
      ...(dadosAtualizacao.secao && { secao: { idCategoria: dadosAtualizacao.secao } }),
      ...(dadosAtualizacao.descricao && {
        descricao: dadosAtualizacao.descricao,
        descricaoHtml: dadosAtualizacao.descricao,
      }),
      ...(dadosAtualizacao.caracteristica && {
        caracteristica: dadosAtualizacao.caracteristica,
        caracteristicaHtml: dadosAtualizacao.caracteristica,
      }),
      ...(dadosAtualizacao.modo_uso && { modoUso: dadosAtualizacao.modo_uso }),
      ...(typeof dadosAtualizacao.ativo !== undefined && {
        tipoSituacaoProdutoEcommerce: dadosAtualizacao.ativo ? 'ATIVO' : 'INATIVO',
      }),
      ...(typeof dadosAtualizacao.lancamento !== undefined && { lancamento: dadosAtualizacao.lancamento }),
      ...(typeof dadosAtualizacao.destaque !== undefined && { destaque: dadosAtualizacao.destaque }),
    };

    if (objectUtil.isVazio(campos)) {
      return;
    }

    await produtoEcommerceServiceArius.atualizar({
      produtoId: produto.produto_id,
      ...campos,
    });
  } catch (erro) {
    console.log(erro);
    throw new ErroException(erro.response.data.processedException?.causeMessage);
  }
};

const atualizarBaseDados = async (produto: Produto, dadosAtualizacao: Produto, divergencia: Divergencia) => {
  const campos = {
    nome: dadosAtualizacao?.nome ?? divergencia.nome,
    marca: dadosAtualizacao?.marca ?? divergencia.marca,
    depto: dadosAtualizacao?.depto ?? divergencia.depto,
    secao: dadosAtualizacao?.secao ?? divergencia.secao,
    descricao: dadosAtualizacao?.descricao ?? divergencia.descricao,
    caracteristica: dadosAtualizacao?.caracteristica ?? divergencia.caracteristica,
    modo_uso: dadosAtualizacao?.modo_uso ?? divergencia.modo_uso,
    ativo: dadosAtualizacao?.ativo ?? divergencia.ativo,
    lancamento: dadosAtualizacao?.lancamento ?? divergencia.lancamento,
    destaque: dadosAtualizacao?.destaque ?? divergencia.destaque,
  };

  produto.imagens = dadosAtualizacao?.imagens ?? divergencia.imagens;

  if (objectUtil.isVazio(campos)) {
    return;
  }

  try {
    await produtoService.atualizar({
      ...produto,
      status: EStatus.APROVADO,
      produto_arius: produto.produto_id,
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
