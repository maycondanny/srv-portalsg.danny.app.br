import { ECadastroStatus, EFiscalStatus, ERole, Produto } from "@modules/comercial/produtos/models/produto.model";
import AprovacaoRequestDTO from "../dtos/aprovacao-request.dto";
import tabelaFornecedorUf from "@services/arius/comercial/tabela-fornecedor-uf";
import cadastraProdutoAriusService from "./gateways/cadastro/cadastra-produto-arius.service";
import cadastraTributacaoAriusService from "./gateways/fiscal/cadastra-tributacao-arius.service";
import atualizaProdutoAriusService from "./gateways/cadastro/atualiza-produto-arius.service";
import ProdutoDTO from "../dtos/produto.dto";
import ProdutoAtualizacao from "../dtos/produto-atualizacao.dto";
import produtoMapper from "../mappers/produto.mapper";
import ariusProdutoFornecedor from '@services/arius/comercial/produto-fornecedor';
import siglaEstadoModel from "@models/sigla-estado.model";
import tabelaFornecedor from "@services/arius/comercial/tabela-fornecedor";
import { EMedidas } from "@modules/comercial/produtos/models/ean.model";
import objectUtil from "@utils/object.util";
import ErroException from "@exceptions/erro.exception";

export const LINHA_GERAL = 1;

async function aprovar(dto: AprovacaoRequestDTO) {
  if (objectUtil.isVazio(dto.produto)) throw new ErroException("Produto não informado para a aprovação!");
  const produto = produtoMapper.toProduto(dto.produto);
  switch (dto.role) {
    case ERole.CADASTRO:
      await aprovarCadastro(produto, dto.dadosAtualizacao);
      return;
    case ERole.FISCAL:
      await aprovarFiscal(produto, dto.dadosAtualizacao);
      return;
  }
};

const aprovarCadastro = async (produto: Omit<Produto, "ecommerce">, produtoAtualizacaoDto: Partial<ProdutoAtualizacao>) => {
  try {
    if (produto.status === ECadastroStatus.CADASTRADO) {
      await atualizaProdutoAriusService.atualizar(produto, produtoAtualizacaoDto);
    } else {
      await cadastraProdutoAriusService.cadastrar(produto);
    }
  } catch (erro) {
    throw erro;
  }
};

const aprovarFiscal = async (produto: Omit<Produto, "ecommerce">, produtoAtualizacaoDto: Partial<ProdutoAtualizacao>) => {
  try {
    if (produto.status === EFiscalStatus.CADASTRADO) {
      await atualizaProdutoAriusService.atualizar(produto, produtoAtualizacaoDto);
    } else {
      await cadastraTributacaoAriusService.cadastrar(produto);
    }
  } catch (erro) {
    throw erro;
  }
};

const validarSituacaoTributaria = ({ st_compra, tipo_tributacao }): boolean => {
  if (st_compra || tipo_tributacao) {
    if (!st_compra) throw new Error("Situação tributária do produto não informada.");
    if (!tipo_tributacao) throw new Error("Tipo situação tributária do produto não informada.");
    const tipoTributacao = tabelaFornecedorUf.obterTipoTributacao(st_compra);
    return tipoTributacao === tipo_tributacao;
  }
  return true;
};

async function inserirProdutoFornecedor({
  produtoId,
  fornecedorId,
  referencia
}) {
  try {
    await ariusProdutoFornecedor.cadastrar({
      pk: {
        produtoId,
        fornecedorId,
      },
      linha: LINHA_GERAL,
      referencia,
      sif: 0,
    });
  } catch (erro) {
    console.log(erro);
    throw new Error('Ocorreu um erro ao cadastrar o produto fornecedor na ARIUS.');
  }
}

async function inserirTabelaFornecedor({
  produtoId,
  fornecedorId,
  ipi
}) {
  try {
    await tabelaFornecedor.cadastrar({
      pk: {
        produtoId: produtoId,
        fornecedorId,
      },
      produtoFornecedor: {
        pk: {
          produtoId: produtoId,
          fornecedorId,
        },
        produto: {
          id: produtoId,
        },
        fornecedor: {
          id: fornecedorId,
        },
      },
      tipoIPI: 'F',
      ipi: Number(ipi),
      quantidadeEmbalagem: 1,
      unidadeCompra: {
        id: EMedidas.UNIDADE,
      },
    });
  } catch (erro) {
    console.log(erro);
    throw new Error('Ocorreu um erro ao cadastrar os custos na tabela do fornecedor na Arius.');
  }
}

async function inserirTabelaFornecedorUF({
  estado,
  produtoId,
  fornecedorId,
  preco,
  st_compra,
  icms_compra,
  desconto_p
}) {
  try {
    await tabelaFornecedorUf.cadastrar({
      pk: {
        estadoId: siglaEstadoModel.obterNome(estado),
        produtoId: produtoId,
        fornecedorId,
      },
      tabelaFornecedor: {
        pk: {
          produtoId: produtoId,
          fornecedorId,
        },
      },
      produtoEstado: {
        pk: {
          produtoId: produtoId,
          estadoId: siglaEstadoModel.obterNome(estado),
        },
      },
      custo: Number(preco),
      tributacao: tabelaFornecedorUf.obterTipoTributacao(st_compra),
      situacaoTributaria: { id: st_compra },
      icms: Number(icms_compra),
      estado: {
        id: siglaEstadoModel.obterNome(estado),
        icms: Number(icms_compra),
      },
      descontoPercentual: desconto_p,
    });
  } catch (erro) {
    console.log(erro);
    throw new Error('Ocorreu um erro ao cadastrar os custos na tabela do fornecedor no estado na Arius.');
  }
}

export default {
  aprovar,
  validarSituacaoTributaria,
  inserirProdutoFornecedor,
  inserirTabelaFornecedor,
  inserirTabelaFornecedorUF
}
