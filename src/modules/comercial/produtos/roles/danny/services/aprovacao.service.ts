import ariusProdutoFornecedor from '@modules/integradores/arius/comercial/services/produto-fornecedor';
import produtoModel, {
  ECadastroStatus,
  EFiscalStatus,
  ERole,
  Produto,
} from '@modules/comercial/produtos/models/produto.model';
import AprovacaoRequestDTO from '../dtos/aprovacao-request.dto';
import cadastraProdutoAriusService from './gateways/cadastro/cadastra-produto-arius.service';
import cadastraTributacaoAriusService from './gateways/fiscal/cadastra-tributacao-arius.service';
import atualizaProdutoAriusService from './gateways/cadastro/atualiza-produto-arius.service';
import { EMedidas } from '@modules/comercial/produtos/models/ean.model';
import objectUtil from '@utils/object.util';
import ErroException from '@exceptions/erro.exception';
import atualizaTributacaoAriusService from './gateways/fiscal/atualiza-tributacao.arius.service';
import produtoMapper from '../mappers/produto.mapper';
import AprovacaoResponseDTO from '../dtos/aprovacao-response.dto';
import tabelaFornecedor from '@modules/integradores/arius/comercial/services/tabela-fornecedor';
import tabelaFornecedorUf from '@modules/integradores/arius/comercial/services/tabela-fornecedor-uf';
import estadoModel from '@modules/core/models/estado.model';

export const LINHA_GERAL = 1;

export const CST_SUBSTITUIDO = '260';
export const TRIBUTACAO_SUBSTITUIDO = 'F';

async function aprovar({ role, produto, dadosAtualizacao }: AprovacaoRequestDTO): Promise<AprovacaoResponseDTO> {
  if (objectUtil.isVazio(produto)) throw new ErroException('Produto não informado para a aprovação!');
  switch (role) {
    case ERole.CADASTRO:
      return await aprovarCadastro(produtoMapper.toProduto(produto), produtoMapper.toProduto(dadosAtualizacao));
    case ERole.FISCAL:
      return await aprovarFiscal(produtoMapper.toProduto(produto), produtoMapper.toProduto(dadosAtualizacao));
  }
}

const aprovarCadastro = async (produto: Produto, produtoAtualizacao: Partial<Produto>) => {
  try {
    if (produto.status === ECadastroStatus.CADASTRADO) {
      return await atualizaProdutoAriusService.atualizar(produto, produtoAtualizacao);
    }
    return await cadastraProdutoAriusService.cadastrar(produto);
  } catch (erro) {
    throw erro;
  }
};

const aprovarFiscal = async (produto: Produto, produtoAtualizacao: Partial<Produto>) => {
  try {
    if (produto.status === EFiscalStatus.CADASTRADO) {
      return await atualizaTributacaoAriusService.atualizar(produto, produtoAtualizacao);
    }
    return await cadastraTributacaoAriusService.cadastrar(produto);
  } catch (erro) {
    throw erro;
  }
};

const validarSituacaoTributaria = ({ st_compra, tipo_tributacao }): boolean => {
  if (!st_compra) throw new Error('Situação tributária do produto não informada.');
  if (!tipo_tributacao) throw new Error('Tipo situação tributária do produto não informada.');
  const tipoTributacao = produtoModel.obterTipoTributacao(st_compra);
  return tipoTributacao === tipo_tributacao;
};

async function inserirProdutoFornecedor({ produtoId, fornecedorId, referencia }) {
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
    throw new Error(erro.response.data.processedException?.causeMessage);
  }
}

async function inserirTabelaFornecedor({ produtoId, fornecedorId }) {
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
      ipi: 0,
      quantidadeEmbalagem: 1,
      unidadeCompra: {
        id: EMedidas.UNIDADE,
      },
    });
  } catch (erro) {
    console.log(erro);
    throw new Error(erro.response.data.processedException?.causeMessage);
  }
}

async function inserirTabelaFornecedorUF({ estado, produtoId, fornecedorId, preco, desconto_p }) {
  try {
    await tabelaFornecedorUf.cadastrar({
      pk: {
        estadoId: estadoModel.obterNome(estado),
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
          estadoId: estadoModel.obterNome(estado),
        },
      },
      custo: preco,
      tributacao: TRIBUTACAO_SUBSTITUIDO,
      situacaoTributaria: { id: CST_SUBSTITUIDO },
      icms: 0,
      estado: {
        id: estadoModel.obterNome(estado),
        icms: 0,
      },
      descontoPercentual: desconto_p,
    });
  } catch (erro) {
    console.log(erro);
    throw new Error(erro.response.data.processedException?.causeMessage);
  }
}

export default {
  aprovar,
  validarSituacaoTributaria,
  inserirProdutoFornecedor,
  inserirTabelaFornecedor,
  inserirTabelaFornecedorUF,
};
