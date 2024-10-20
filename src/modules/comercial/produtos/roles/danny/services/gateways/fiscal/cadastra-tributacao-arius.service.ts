import ariusProdutoService from '@modules/integradores/arius/comercial/services/produto.service';
import aprovacaoService from '../../aprovacao.service';
import tabelaFornecedor from '@modules/integradores/arius/comercial/services/tabela-fornecedor';
import tabelaFornecedorUf from '@modules/integradores/arius/comercial/services/tabela-fornecedor-uf';
import produtoModel, { EFiscalStatus, Produto } from '@modules/comercial/produtos/models/produto.model';
import produtoService from '@modules/comercial/produtos/services/produto.service';
import validacaoService from '../../validacao.service';
import ErroException from '@exceptions/erro.exception';
import estadoModel from '@modules/core/estados/models/estado.model';
import _ from 'lodash';
import grupoTributacaoItemService from '@modules/integradores/arius/comercial/services/grupo-tributacao-item.service';

async function cadastrar(produto: Produto) {
  const validacao = await validacaoService.validarFiscal(produto);

  if (!validacao.valido) {
    throw new ErroException('Campos obrigatórios não preenchidos, verifique', validacao);
  }

  if (
    !aprovacaoService.validarSituacaoTributaria({
      st_compra: produto.st_compra,
      tipo_tributacao: produto.tipo_tributacao,
    })
  ) {
    throw new ErroException('Situação tributária está inconsistente para a tributação. Por favor, verifique');
  }

  await atualizarTributacaoArius(produto);
  await atualizarTabelaFornecedor(produto);
  await atualizarTabelaFornecedorUF(produto);
  await atualizarTributacaoSaidaTodosEstados(produto);
  await atualizarDados(produto);

  return {
    produtoId: produto.produto_arius,
  };
}

async function atualizarTributacaoArius(produto: Produto) {
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
    throw new ErroException('Ocorreu um erro ao atualizar o produto na ARIUS');
  }
}

async function atualizarTabelaFornecedor(produto: Produto) {
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
      ipi: produto.ipi,
    });
  } catch (erro) {
    console.log(erro);
    throw new ErroException('Ocorreu um erro ao atualizar os custos na tabela do fornecedor na Arius.');
  }
}

async function atualizarTabelaFornecedorUF(produto: Produto) {
  try {
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
      tributacao: produtoModel.obterTipoTributacao(produto.st_compra),
      situacaoTributaria: { id: produto.st_compra },
      icms: produto.icms_compra,
      estado: {
        id: estadoModel.obterNome(produto.estado),
        icms: produto.icms_compra,
      },
    });
  } catch (erro) {
    console.log(erro);
    throw new ErroException('Ocorreu um erro ao cadastrar os custos na tabela do fornecedor no estado na Arius.');
  }
}

async function atualizarDados(produto: Produto) {
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
    throw new ErroException('Ocorreu um erro ao atualizar na base as tributações do produto.');
  }
}

async function atualizarTributacaoSaidaTodosEstados(produto: Produto) {
  try {
    const grupoTributacao = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
    ];
    const resultado = _.map(
      grupoTributacao,
      async (grupo) =>
        await grupoTributacaoItemService.atualizar({
          grupoTributacao: {
            id: grupo,
          },
          produto: { id: produto.produto_arius },
          situacaoTributaria: { id: '041' },
          tributacaoVenda: 'N',
          icmsVenda: 0,
          reducaoVenda: 0,
          tipoIVA: 'P',
        })
    );

    await Promise.all(resultado);
  } catch (erro) {
    console.log(erro);
    throw new ErroException('Ocorreu um erro ao cadastrar a tributação de saida para os estados');
  }
}

export default {
  cadastrar,
};
