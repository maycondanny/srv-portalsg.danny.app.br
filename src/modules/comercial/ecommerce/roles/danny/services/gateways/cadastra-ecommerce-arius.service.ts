import produtoEcommerceServiceArius from '@modules/integradores/arius/ecommerce/services/produto.service';
import aprovacaoService from '../aprovacao.service';
import produtoModel, { EStatus, Produto } from '@modules/comercial/ecommerce/models/produto.model';
import validacaoService from '../validacao.service';
import httpStatusEnum from '@enums/http-status.enum';
import ErroException from '@exceptions/erro.exception';
import objectUtil from '@utils/object.util';
import produtoService from '@modules/comercial/ecommerce/services/produto.service';

async function cadastrar(produto: Produto) {
  const validacao = validacaoService.validar(produto);

  if (!validacao.valido) {
    throw new ErroException('Erro ao aprovar o produto', validacao, httpStatusEnum.Status.ERRO_REQUISICAO);
  }

  await cadastrarArius(produto);
  await aprovacaoService.salvarImagens(produto);
  await atualizarBaseDados(produto);
}

const cadastrarArius = async (produto: Produto) => {
  try {
    await produtoEcommerceServiceArius.cadastrar({
      produtoId: produto.produto_id,
      marcasEcommerce: {
        id: produto.marca,
      },
      tipoSituacaoProdutoEcommerce: produto.ativo ? 'ATIVO' : 'INATIVO',
      tipoProdutoEcommerce: 1,
      nome: produto.nome,
      descricao: produto.descricao,
      caracteristica: produto.caracteristica,
      modoUso: produto.modo_uso,
      descricaoHtml: produto.descricao,
      caracteristicaHtml: produto.caracteristica,
      lancamento: produto.lancamento,
      destaque: produto.destaque,
      categoria: produto.secao,
      departamento: { idCategoria: produto.depto },
      secao: { idCategoria: produto.secao },
      grupo: { idCategoria: 0 },
      subgrupo: { idCategoria: 0 },
      urlPlataforma: produtoModel.obterUrlPlataforma(produto.nome),
      principal: true,
    });
  } catch (erro) {
    console.log(erro);
    throw new ErroException(erro.response.data.processedException?.causeMessage);
  }
};

const atualizarBaseDados = async (produto: Produto) => {
  const campos = {
    ...(produto.nome && { nome: produto.nome }),
    ...(produto.marca && { marca: produto.marca }),
    ...(produto.depto && { depto: produto.depto }),
    ...(produto.secao && { secao: produto.secao }),
    ...(produto.descricao && { descricao: produto.descricao }),
    ...(produto.caracteristica && { caracteristica: produto.caracteristica }),
    ...(produto.modo_uso && { modo_uso: produto.modo_uso }),
    ...(produto.ativo && { ativo: produto.ativo }),
    ...(produto.lancamento && { lancamento: produto.lancamento }),
    ...(produto.destaque && { destaque: produto.destaque }),
  };

  if (objectUtil.isVazio(campos)) {
    return;
  }

  try {
    await produtoService.atualizar({
      ...produto,
      status: EStatus.APROVADO,
      produto_id: produto.produto_id,
      ...campos,
    });
  } catch (erro) {
    console.log(erro);
    throw new ErroException('Não foi possivel realizar a atualização do produto na base de dados');
  }
};

export default {
  cadastrar,
};
