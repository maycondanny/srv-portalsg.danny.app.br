import produtoModel, { EStatus, Produto } from '@modules/comercial/ecommerce/models/produto.model';
import produtoEcommerceServiceArius from '@modules/integradores/arius/ecommerce/services/produto.service';
import aprovacaoService from '../aprovacao.service';
import { Divergencia } from '@modules/comercial/ecommerce/models/divergencia.model';
import produtoService from '../produto.service';

async function atualizar(produto: Produto, dadosAtualizacao: Produto) {
  const divergencia = produto.divergencias[0];

  await atualizarArius(produto, dadosAtualizacao);

  if (existeImagens(dadosAtualizacao)) {
    await aprovacaoService.salvarImagens({ ...dadosAtualizacao, produto_id: produto.produto_id });
  }

  await atualizarBaseDados(produto, dadosAtualizacao, divergencia);
}

const existeImagens = (produto: Produto) => {
  return produto?.imagens?.length > 0;
};

const atualizarArius = async (produto: Produto, dadosAtualizacao: Produto) => {
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

  if (Object.keys(campos).length > 0) {
    await produtoEcommerceServiceArius.atualizar({
      produtoId: produto.produto_id,
      ...campos,
    });
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

  if (Object.keys(campos).length > 0) {
    await produtoService.atualizar(produto, {
      status: EStatus.APROVADO,
      produto_id: produto.produto_id,
      ...campos,
    });
  }
};

export default {
  atualizar,
};
