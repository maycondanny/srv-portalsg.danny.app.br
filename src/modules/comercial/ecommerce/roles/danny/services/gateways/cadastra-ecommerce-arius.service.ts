import produtoEcommerceServiceArius from '@modules/integradores/arius/ecommerce/services/produto.service';
import aprovacaoService from '../aprovacao.service';
import produtoModel, { Produto } from '@modules/comercial/ecommerce/models/produto.model';

async function cadastrar(produto: Produto) {
  if (!produto.nome) throw new Error("O campo nome deve ser preenchido.");

  await cadastrarArius(produto);
  await aprovacaoService.salvarImagens(produto);
  await atualizarBaseDados(produto);
}

const cadastrarArius = async (produto: any) => {
  await produtoEcommerceServiceArius.cadastrar({
    produtoId: produto.produto_id,
    marcasEcommerce: {
      id: produto?.marca,
    },
    tipoSituacaoProdutoEcommerce: produto.ativo ? "ATIVO" : "INATIVO",
    tipoProdutoEcommerce: 1,
    nome: produto.nome,
    descricao: produto.descricao,
    caracteristica: produto.caracteristica,
    modoUso: produto.modo_uso,
    descricaoHtml: produto.descricao,
    caracteristicaHtml: produto.caracteristica,
    lancamento: produto.lancamento,
    destaque: produto.destaque,
    categoria: produto?.secao ?? 0,
    departamento: { idCategoria: produto?.depto },
    secao: { idCategoria: produto?.secao ?? 0 },
    grupo: { idCategoria: 0 },
    subgrupo: { idCategoria: 0 },
    urlPlataforma: produtoModel.obterUrlPlataforma(produto.nome),
    principal: true,
  });
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

  try {
    if (Object.keys(campos).length > 0) {
      await produtoService.atualizar(produto, {
        status: EStatus.APROVADO,
        produto_id: produto.produto_id,
        ...campos,
      });
    }
  } catch (erro) {
    console.error(
      "[ECOMMERCE-APROVACAO-CADASTRO]: Erro ao atualizar o produto em nosso banco de dados",
      erro
    );
    throw new Error(
      "Não foi possivel realizar a atualização do produto na base."
    );
  }
};

export default {
  cadastrar,
};
