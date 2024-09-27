import { EFiscalStatus, Produto } from '@modules/comercial/produtos/models/produto.model';
import ProdutoAtualizacao from '../../../dtos/produto.dto';
import aprovacaoService from '../../aprovacao.service';
import produtoService from '@modules/comercial/produtos/services/produto.service';
import objectUtil from '@utils/object.util';
import tabelaFornecedorUf from '@modules/integradores/arius/comercial/services/tabela-fornecedor-uf';
import tabelaFornecedor from '@modules/integradores/arius/comercial/services/tabela-fornecedor';
import ariusProdutoArius from '@modules/integradores/arius/comercial/services/produto.service';
import _ from 'lodash';
import ErroException from '@exceptions/erro.exception';
import numberUtil from '@utils/number.util';
import Divergencia from '../../../../../models/divergencia.model';
import validacaoService from '../../validacao.service';
import estadoModel from '@modules/core/models/estado.model';

const atualizar = async (produto: Produto, produtoAtualizacao: Partial<Produto>) => {
  const validacao = await validacaoService.validarFiscal(_.merge({}, produto, produtoAtualizacao));

  if (!validacao.valido) {
    throw new ErroException('Campos obrigatórios não preenchidos, verifique', validacao);
  }

  if (
    !aprovacaoService.validarSituacaoTributaria({
      st_compra: produtoAtualizacao.st_compra,
      tipo_tributacao: produtoAtualizacao.tipo_tributacao || produto.tipo_tributacao,
    })
  ) {
    throw new ErroException('Situação tributária está inconsistente para a tributação. Por favor, verifique.');
  }
  await atualizarProdutoArius(produto, produtoAtualizacao);
  await atualizarTabelaFornecedor(produto, produtoAtualizacao);
  await atualizarTabelaFornecedorUF(produto, produtoAtualizacao);
  await atualizarDados(produto, produtoAtualizacao);

  return {
    produtoId: produto.produto_arius,
  };
};

const atualizarProdutoArius = async (produto: Produto, produtoAtualizacao: Partial<Produto>) => {
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

    if (objectUtil.isVazio(campos)) return;

    await ariusProdutoArius.atualizar({
      id: produto.produto_arius,
      ...campos,
    });
  } catch (erro) {
    console.log(erro);
    throw new ErroException(erro.response.data.processedException?.causeMessage);
  }
};

const atualizarTabelaFornecedor = async (produto: Produto, produtoAtualizacao: Partial<ProdutoAtualizacao>) => {
  try {
    const campos = {
      ...(numberUtil.isMaiorOuIgualZero(produtoAtualizacao.ipi) && { ipi: produtoAtualizacao.ipi }),
    };

    if (objectUtil.isVazio(campos)) return;

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
    throw new ErroException(erro.response.data.processedException?.causeMessage);
  }
};

const atualizarTabelaFornecedorUF = async (produto: Produto, produtoAtualizacao: Partial<ProdutoAtualizacao>) => {
  try {
    const campos = {
      ...(produtoAtualizacao.st_compra && {
        situacaoTributaria: { id: produtoAtualizacao.st_compra },
        tributacao: produtoAtualizacao.tipo_tributacao,
      }),
      ...(numberUtil.isMaiorOuIgualZero(produtoAtualizacao.icms_compra) && {
        icms: produtoAtualizacao.icms_compra,
      }),
    };

    if (objectUtil.isVazio(campos)) return;

    await tabelaFornecedorUf.atualizar({
      pk: {
        estadoId: estadoModel.obterNome(produto.estado),
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
        id: estadoModel.obterNome(produto.estado),
        icms: numberUtil.isMaiorOuIgualZero(produtoAtualizacao.icms_compra)
          ? produtoAtualizacao.icms_compra
          : produto.icms_compra,
      },
      ...campos,
    });
  } catch (erro) {
    console.log(erro);
    throw new ErroException(erro.response.data.processedException?.causeMessage);
  }
};

const atualizarDados = async (produto: Produto, produtoAtualizacao: Partial<Produto>) => {
  try {
    const divergencia: Divergencia = produto.divergencias[0];
    const campos = {
      st_compra: produtoAtualizacao.st_compra ?? divergencia.st_compra,
      ipi: produtoAtualizacao.ipi ?? divergencia.ipi,
      icms_compra: produtoAtualizacao.icms_compra ?? divergencia.icms_compra,
      pis_cofins: produtoAtualizacao.pis_cofins ?? divergencia.pis_cofins,
      tipo_tributacao: produtoAtualizacao.tipo_tributacao ?? divergencia.tributacao_compra,
      classificacao_fiscal: produtoAtualizacao.classificacao_fiscal ?? divergencia.classificacao_fiscal,
    };

    if (objectUtil.isVazio(campos)) return;

    await produtoService.atualizar({
      id: produto.id,
      status: EFiscalStatus.APROVADO,
      ...campos,
    });
  } catch (erro) {
    console.log(erro);
    throw new ErroException('Ocorreu um erro ao atualizar na base as tributações do produto.');
  }
};

export default {
  atualizar,
};
