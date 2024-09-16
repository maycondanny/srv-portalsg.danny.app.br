import { EFiscalStatus, Produto } from '@modules/comercial/produtos/models/produto.model';
import ProdutoAtualizacao from '../../../dtos/produto-atualizacao.dto';
import aprovacaoService from '../../aprovacao.service';
import Divergencia from '@modules/comercial/produtos/models/divergencia.model';
import produtoService from '@modules/comercial/produtos/services/produto.service';
import objectUtil from '@utils/object.util';
import siglaEstadoModel from '@models/sigla-estado.model';
import tabelaFornecedorUf from '@services/arius/comercial/tabela-fornecedor-uf';
import tabelaFornecedor from '@services/arius/comercial/tabela-fornecedor';
import ariusProdutoArius from "@services/arius/comercial/produto.service";
import _ from 'lodash';

const atualizar = async (produto: Omit<Produto, 'ecommerce'>, produtoAtualizacao: Partial<ProdutoAtualizacao>) => {
  const divergencia = produto.divergencias[0];

  if (!aprovacaoService.validarSituacaoTributaria({
      st_compra: produtoAtualizacao.st_compra,
      tipo_tributacao: produtoAtualizacao.tipo_tributacao,
    })) {
    throw new Error('Situação tributária está inconsistente para a tributação. Por favor, verifique.');
  }
  await atualizarProdutoArius(produto, produtoAtualizacao);
  await atualizarTabelaFornecedor(produto, produtoAtualizacao);
  await atualizarTabelaFornecedorUF(produto, produtoAtualizacao);
  await atualizarDados(produto, produtoAtualizacao, divergencia);
};

const atualizarProdutoArius = async (produto: Omit<Produto, 'ecommerce'>, produtoAtualizacao: Partial<ProdutoAtualizacao>) => {
  try {
    const campos = {
      ...(produtoAtualizacao.classificacao_fiscal && {
        ncm: { id: produtoAtualizacao.classificacao_fiscal },
      }),
      ...(produtoAtualizacao.pis_cofins && {
        tributacaoPisCofins: produtoAtualizacao.pis_cofins,
        pisCofins: true,
      }),
    };

    if (!objectUtil.isVazio(campos)) return;

    await ariusProdutoArius.atualizar({
      id: produto.produto_arius,
      ...campos,
    });
  } catch (erro) {
    console.log(erro);
    throw new Error('Ocorreu um erro ao atualizar o produto na Arius.');
  }
};

const atualizarTabelaFornecedor = async (produto: Omit<Produto, 'ecommerce'>, produtoAtualizacao: Partial<ProdutoAtualizacao>) => {
  try {
    const campos = {
      ...(produtoAtualizacao.ipi && { ipi: produtoAtualizacao.ipi }),
    };

    if (!objectUtil.isVazio(campos)) return;

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
      ...campos,
    });
  } catch (erro) {
    console.log(erro);
    throw new Error('Ocorreu um erro ao atualizar as tributações do fornecedor na Arius.');
  }
};

const atualizarTabelaFornecedorUF = async (produto: Omit<Produto, 'ecommerce'>, produtoAtualizacao: Partial<ProdutoAtualizacao>) => {
  try {
    const campos = {
      ...(produtoAtualizacao.st_compra && {
        situacaoTributaria: { id: produtoAtualizacao.st_compra },
        tributacao: tabelaFornecedorUf.obterTipoTributacao(produto.st_compra),
      }),
      ...(produtoAtualizacao.icms_compra && {
        icms: produtoAtualizacao.icms_compra,
      }),
    };

    if (!objectUtil.isVazio(campos)) return;

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
      estado: {
        id: siglaEstadoModel.obterNome(produto.estado),
        icms: produto.icms_compra,
      },
      ...campos,
    });
  } catch (erro) {
    console.log(erro);
    throw new Error('Ocorreu um erro ao atualizar as tributações por estado na Arius.');
  }
};

const atualizarDados = async (produto: Omit<Produto, 'ecommerce'>, produtoAtualizacao: Partial<ProdutoAtualizacao>, divergencia: Divergencia) => {
  try {
    const campos = _.defaults({}, produtoAtualizacao, divergencia);

    await produtoService.atualizar({
      id: produto.id,
      ...campos,
      status: EFiscalStatus.APROVADO,
    });
  } catch (erro) {
    console.log(erro);
    throw new Error('Ocorreu um erro ao atualizar na base as tributações do produto.');
  }
};

export default {
  atualizar,
};
