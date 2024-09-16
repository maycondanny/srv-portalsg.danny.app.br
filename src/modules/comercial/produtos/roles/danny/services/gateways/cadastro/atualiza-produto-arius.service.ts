import Divergencia from "@modules/comercial/produtos/models/divergencia.model";
import { ECadastroStatus, Produto } from "@modules/comercial/produtos/models/produto.model";
import ProdutoAtualizacao from "../../../dtos/produto-atualizacao.dto";
import ariusProdutoService from "@services/arius/comercial/produto.service";
import { EMedidas } from "@modules/comercial/produtos/models/ean.model";
import tabelaFornecedorUf from "@services/arius/comercial/tabela-fornecedor-uf";
import siglaEstadoModel from "@models/sigla-estado.model";
import produtoService from "@modules/comercial/produtos/services/produto.service";
import ariusProdutoFornecedor from "@services/arius/comercial/produto-fornecedor";
import aprovacaoService from "../../aprovacao.service";
import _ from "lodash";
import objectUtil from "@utils/object.util";

async function atualizar(produto: Omit<Produto, "ecommerce">, produtoAtualizacao: Partial<ProdutoAtualizacao>) {
  const divergencia = produto.divergencias[0];

  if (!produto.produto_arius) throw new Error("Produto não encontrado!");
  if (!produto.fornecedor_id) throw new Error("Fornecedor não encontrado!");

  if (produtoAtualizacao.depto <= 0 || !validarDepartamento(produtoAtualizacao)) {
    throw new Error(
      "Deve ser informado o departamento, seção, grupo e subgrupo do produto."
    );
  }

  const produtoFornecedor = await ariusProdutoFornecedor.obter({
    estado: produtoAtualizacao.estado || produto.estado,
    fornecedorId: produto.fornecedor_id,
    produtoId: Number(produto.produto_arius),
  });

  if (!objectUtil.isVazio(produtoFornecedor)) {
    await aprovacaoService.inserirProdutoFornecedor({
      produtoId:  produto.produto_arius,
      fornecedorId: Number(produto.fornecedor_id),
      referencia: produto.codigo_produto_fornecedor,
    });
  }

  const existeTributacaoEstado = await tabelaFornecedorUf.obter({
    estado: siglaEstadoModel.obterNome(produtoAtualizacao.estado || produto.estado),
    fornecedorId: produto.fornecedor_id,
    produtoId: Number(produto.produto_arius),
  });

  if (!objectUtil.isVazio(existeTributacaoEstado)) {
    await aprovacaoService.inserirTabelaFornecedor({
      fornecedorId: produto.fornecedor_id,
      ipi: produtoAtualizacao?.ipi || produto.ipi,
      produtoId: produto.produto_arius
    });
    await aprovacaoService.inserirTabelaFornecedorUF(
      {
        estado: produto?.estado,
        fornecedorId: produto.fornecedor_id,
        desconto_p: produtoAtualizacao?.desconto_p ?? produto?.desconto_p,
        icms_compra: produto?.icms_compra,
        preco: produtoAtualizacao?.preco ?? produto?.preco,
        st_compra: produto?.st_compra,
        produtoId: produto.produto_arius
      }
    );
  } else {
    await atualizarTabelaFornecedorUF(produto, produtoAtualizacao);
  }

  await atualizarArius(produto, produtoAtualizacao);
  await atualizarDados(produto, produtoAtualizacao, divergencia);
};

function validarDepartamento(produtoAtualizacao: Partial<ProdutoAtualizacao>): boolean {
  return (
    typeof produtoAtualizacao.secao !== undefined &&
    typeof produtoAtualizacao.grupo !== undefined &&
    typeof produtoAtualizacao.subgrupo !== undefined
  );
};

async function atualizarArius(produto: Omit<Produto, "ecommerce">, produtoAtualizacao: Partial<ProdutoAtualizacao>) {
  const campos = {
    ...(produtoAtualizacao.descritivo && {
      descricao: produtoAtualizacao.descritivo,
    }),
    ...(produtoAtualizacao.descritivo_pdv && {
      descricaoPdv: produtoAtualizacao.descritivo_pdv,
    }),
    ...(produtoAtualizacao.qtde_embalagem && {
      quantidadeEmbalagemEntrada: 1, // rever com a regra do duns unidade compra
      embalagem: { id: EMedidas.UNIDADE }, // rever com a regra do duns unidade compra
    }),
    ...(produtoAtualizacao.validade && { validade: produtoAtualizacao.validade }),
    ...(produtoAtualizacao.origem && {
      origem: ariusProdutoService.obterOrigem(produtoAtualizacao.origem),
    }),
    ...(produtoAtualizacao.pesob && { pesoBruto: produtoAtualizacao.pesob }),
    ...(produtoAtualizacao.pesol && { pesoLiquido: produtoAtualizacao.pesol }),
    ...(produtoAtualizacao.comprimento && {
      comprimento: produtoAtualizacao.comprimento,
    }),
    ...(produtoAtualizacao.largura && { largura: produtoAtualizacao.largura }),
    ...(produtoAtualizacao.altura && { altura: produtoAtualizacao.altura }),
    ...(produtoAtualizacao.marca && {
      marcaProduto: { id: produtoAtualizacao.marca },
    }),
    ...(produtoAtualizacao.depto && {
      departamento: {
        departamentoPK: {
          departamentoId: produtoAtualizacao.depto,
          secaoId: produtoAtualizacao.secao,
          grupoId: produtoAtualizacao.grupo,
          subGrupoId: produtoAtualizacao.subgrupo,
        },
      },
    }),
  };

  if (!objectUtil.isVazio(campos)) return;

  const dataHoje = new Date();

  await ariusProdutoService.atualizar({
    id: Number(produto.produto_arius),
    dataAlteracao: dataHoje.toISOString(),
    ...campos,
  });
}

async function atualizarTabelaFornecedorUF(
  produto: Omit<Produto, "ecommerce">,
  produtoAtualizacao: Partial<ProdutoAtualizacao>
) {
  const campos = {
    ...(produtoAtualizacao.preco && { custo: produtoAtualizacao.preco }),
    ...(produtoAtualizacao.desconto_p && {
      descontoPercentual: produtoAtualizacao.desconto_p,
    }),
  };

  if (!objectUtil.isVazio(campos)) return;

  try {
    await tabelaFornecedorUf.atualizar({
      pk: {
        estadoId: siglaEstadoModel.obterNome(produtoAtualizacao?.estado || produto.estado),
        produtoId: Number(produto.produto_arius),
        fornecedorId: Number(produto?.fornecedor_id),
      },
      tabelaFornecedor: {
        pk: {
          produtoId: Number(produto.produto_arius),
          fornecedorId: Number(produto?.fornecedor_id),
        },
      },
      produtoEstado: {
        pk: {
          produtoId: Number(produto.produto_arius),
          estadoId: siglaEstadoModel.obterNome(produtoAtualizacao?.estado || produto.estado),
        },
      },
      tributacao: tabelaFornecedorUf.obterTipoTributacao(
        produto?.st_compra
      ),
      situacaoTributaria: { id: produto?.st_compra },
      icms: Number(produto?.icms_compra),
      estado: {
        id: siglaEstadoModel.obterNome(produto.estado),
        icms: Number(produto?.icms_compra),
      },
      ...campos,
    });
  } catch (erro) {
    console.log(erro);
    throw new Error(
      "Ocorreu um erro ao cadastrar os custos na tabela do fornecedor no estado na Arius."
    );
  }
};

async function atualizarDados(
  produto: Omit<Produto, "ecommerce">,
  produtoAtualizacao: Partial<ProdutoAtualizacao>,
  divergencia: Divergencia
) {
  try {
    const campos: Partial<Produto> = _.defaults({}, produtoAtualizacao, divergencia);

    if (!objectUtil.isVazio(campos)) return;

    await produtoService.atualizar({
      id: produto?.id,
      produto_arius: produto.produto_arius,
      status: ECadastroStatus.APROVADO,
      ...campos,
    });
  } catch (erro) {
    console.log(erro);
    throw new Error("Ocorreu um erro ao atualizar o produto na base.");
  }
};

export default {
  atualizar,
};
