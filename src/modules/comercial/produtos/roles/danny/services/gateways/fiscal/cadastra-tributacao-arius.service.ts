import ariusProdutoService from "@services/arius/comercial/produto.service";
import aprovacaoService from "../../aprovacao.service";
import tabelaFornecedor from "@services/arius/comercial/tabela-fornecedor";
import tabelaFornecedorUf from "@services/arius/comercial/tabela-fornecedor-uf";
import siglaEstadoModel from "@models/sigla-estado.model";
import { EFiscalStatus, Produto } from "@modules/comercial/produtos/models/produto.model";
import produtoService from "@modules/comercial/produtos/services/produto.service";

async function cadastrar(produto: Omit<Produto, "ecommerce">) {
  if (!aprovacaoService.validarSituacaoTributaria({ st_compra: produto.st_compra, tipo_tributacao: produto.tipo_tributacao })) {
    throw new Error("Situação tributária está inconsistente para a tributação. Por favor, verifique.");
  }

  await atualizarTributacaoArius(produto);
  await atualizarTabelaFornecedor(produto);
  await atualizarTabelaFornecedorUF(produto);
  await atualizarDados(produto);
}

async function atualizarTributacaoArius(produto: Omit<Produto, "ecommerce">) {
  try {
    await ariusProdutoService.atualizar({
      id: produto.produto_arius,
      ncm: {
        id: produto.classificacao_fiscal,
      },
      pisCofins: true,
      tributacaoPisCofins: produto.pis_cofins,
    });
  } catch (erro) {
    console.log(erro);
    throw new Error("Ocorreu um erro ao atualizar o produto na ARIUS.");
  }
};

async function atualizarTabelaFornecedor(produto: Omit<Produto, "ecommerce">) {
  try {
    await tabelaFornecedor.atualizar({
      pk: {
        produtoId: produto.produto_arius,
        fornecedorId: produto.fornecedor_id,
      },
      produtoFornecedor: {
        pk: {
          produtoId: produto.produto_arius,
          fornecedorId: produto.fornecedor_id,
        },
        produto: {
          id: produto.produto_arius,
        },
        fornecedor: {
          id: produto.fornecedor_id,
        },
      },
      tipoIPI: "F",
      ipi: produto.ipi,
    });
  } catch (erro) {
    console.log(erro);
    throw new Error(
      "Ocorreu um erro ao atualizar os custos na tabela do fornecedor na Arius."
    );
  }
};

async function atualizarTabelaFornecedorUF(produto: Omit<Produto, "ecommerce">) {
  try {
    await tabelaFornecedorUf.atualizar({
      pk: {
        estadoId: siglaEstadoModel.obterNome(produto.estado),
        produtoId: produto.produto_arius,
        fornecedorId: produto.fornecedor_id,
      },
      tabelaFornecedor: {
        pk: {
          produtoId: produto.produto_arius,
          fornecedorId: produto.fornecedor_id,
        },
      },
      produtoEstado: {
        pk: {
          produtoId: produto.produto_arius,
          estadoId: produto.estado,
        },
      },
      tributacao: tabelaFornecedorUf.obterTipoTributacao(
        produto.st_compra
      ),
      situacaoTributaria: { id: produto.st_compra },
      icms: produto.icms_compra,
      estado: {
        id: siglaEstadoModel.obterNome(produto.estado),
        icms: produto.icms_compra,
      },
    });
  } catch (erro) {
    console.log(erro);
    throw new Error(
      "Ocorreu um erro ao cadastrar os custos na tabela do fornecedor no estado na Arius."
    );
  }
};

async function atualizarDados(produto: Omit<Produto, "ecommerce">) {
  try {
    await produtoService.atualizar({
      id: produto.id,
      ipi: produto.ipi,
      st_compra: produto.st_compra,
      icms_compra: produto.icms_compra,
      pis_cofins: produto.pis_cofins,
      classificacao_fiscal: produto.classificacao_fiscal,
      status: EFiscalStatus.APROVADO,
    });
  } catch (erro) {
    console.log(erro);
    throw new Error(
      "Ocorreu um erro ao atualizar na base as tributações do produto."
    );
  }
};


export default {
  cadastrar
}
