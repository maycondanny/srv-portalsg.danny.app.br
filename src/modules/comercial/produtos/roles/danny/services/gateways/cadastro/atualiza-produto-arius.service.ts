import produtoModel, { ECadastroStatus, Produto } from '@modules/comercial/produtos/models/produto.model';
import ariusProdutoService from '@services/arius/comercial/produto.service';
import { EMedidas } from '@modules/comercial/produtos/models/ean.model';
import tabelaFornecedorUf from '@services/arius/comercial/tabela-fornecedor-uf';
import siglaEstadoModel from '@models/sigla-estado.model';
import produtoService from '@modules/comercial/produtos/services/produto.service';
import ariusProdutoFornecedor from '@services/arius/comercial/produto-fornecedor';
import aprovacaoService, { CST_SUBSTITUIDO, TRIBUTACAO_SUBSTITUIDO } from '../../aprovacao.service';
import _ from 'lodash';
import objectUtil from '@utils/object.util';
import ProdutoCadastroDTO from '../../../dtos/produto-cadastro.dto';
import produtoCompradorService from '@services/arius/comercial/produto-comprador.service';

async function atualizar(produto: ProdutoCadastroDTO, produtoAtualizacao: Partial<ProdutoCadastroDTO>) {
  if (!produto.produto_arius) throw new Error('Produto não encontrado!');
  if (!produto.fornecedor_id) throw new Error('Fornecedor não encontrado!');

  if (produtoAtualizacao.depto <= 0 || !validarDepartamento(produtoAtualizacao)) {
    throw new Error('Deve ser informado o departamento, seção, grupo e subgrupo do produto.');
  }

  const produtoId = produto.produto_arius;
  const compradorCadastrado = produto.divergencias[0].comprador;

  const comprador = await produtoCompradorService.obter({
    compradorId: compradorCadastrado,
    produtoId,
  });

  if (objectUtil.isVazio(comprador)) {
    throw new Error(`O comprador ${compradorCadastrado} não existe para o produto ${produtoId} no ERP, verifique.`);
  }

  const produtoFornecedor = await ariusProdutoFornecedor.obter({
    fornecedorId: produto.fornecedor_id,
    produtoId: produto.produto_arius,
  });

  if (objectUtil.isVazio(produtoFornecedor)) {
    await aprovacaoService.inserirProdutoFornecedor({
      produtoId: produto.produto_arius,
      fornecedorId: produto.fornecedor_id,
      referencia: produto.codigo_produto_fornecedor,
    });
  }

  const existeTributacaoEstado = await tabelaFornecedorUf.obter({
    estado: siglaEstadoModel.obterNome(produtoAtualizacao.estado || produto.estado),
    fornecedorId: produto.fornecedor_id,
    produtoId: produto.produto_arius,
  });

  if (objectUtil.isVazio(existeTributacaoEstado)) {
    await aprovacaoService.inserirTabelaFornecedor({
      fornecedorId: produto.fornecedor_id,
      produtoId: produto.produto_arius,
    });
    await aprovacaoService.inserirTabelaFornecedorUF({
      estado: produto.estado,
      fornecedorId: produto.fornecedor_id,
      desconto_p: produtoAtualizacao.desconto_p ?? produto.desconto_p,
      preco: produtoAtualizacao.preco ?? produto.preco,
      produtoId: produto.produto_arius,
    });
  } else {
    await atualizarTabelaFornecedorUF(produto, produtoAtualizacao);
  }

  if (produtoAtualizacao.comprador) {
    await atualizarComprador(produto, produtoAtualizacao);
  }

  await atualizarArius(produto, produtoAtualizacao);
  await atualizarDados(produto, produtoAtualizacao);

  return {
    produtoId: produto.produto_arius,
  };
}

function validarDepartamento(produtoAtualizacao: Partial<ProdutoCadastroDTO>): boolean {
  return (
    typeof produtoAtualizacao.secao !== undefined &&
    typeof produtoAtualizacao.grupo !== undefined &&
    typeof produtoAtualizacao.subgrupo !== undefined
  );
}

async function atualizarComprador(produto: ProdutoCadastroDTO, produtoAtualizacao: Partial<ProdutoCadastroDTO>) {
  try {
    const produtoId = produto.produto_arius;
    const compradorCadastrado = produto.divergencias[0].comprador;

    await produtoCompradorService.excluir({
      compradorId: compradorCadastrado,
      produtoId,
    });

    await produtoCompradorService.cadastrar({
      pk: {
        compradorId: produtoAtualizacao.comprador,
        produtoId,
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error(error.response.data.processedException?.causeMessage);
  }
}

async function atualizarArius(produto: ProdutoCadastroDTO, produtoAtualizacao: Partial<ProdutoCadastroDTO>) {
  const campos = {
    ...(produtoAtualizacao.descritivo && {
      descricao: produtoAtualizacao.descritivo,
    }),
    ...(produtoAtualizacao.descritivo_pdv && {
      descricaoPdv: produtoAtualizacao.descritivo_pdv,
    }),
    ...(produtoAtualizacao.qtde_embalagem && {
      quantidadeEmbalagemEntrada: 1,
      embalagem: { id: EMedidas.UNIDADE },
    }),
    ...(produtoAtualizacao.validade && { validade: produtoAtualizacao.validade }),
    ...(produtoAtualizacao.origem && {
      origem: produtoModel.obterOrigem(produtoAtualizacao.origem),
    }),
    ...(produtoAtualizacao.familia && {
      familiaId: produtoAtualizacao.familia,
      familia: {
        id: produtoAtualizacao.familia,
      },
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

  if (objectUtil.isVazio(campos)) return;

  const dataHoje = new Date();

  try {
    await ariusProdutoService.atualizar({
      id: Number(produto.produto_arius),
      dataAlteracao: dataHoje.toISOString(),
      ...campos,
    });
  } catch (erro) {
    console.log(erro);
    throw new Error(erro.response.data.processedException?.causeMessage);
  }
}

async function atualizarTabelaFornecedorUF(
  produto: ProdutoCadastroDTO,
  produtoAtualizacao: Partial<ProdutoCadastroDTO>
) {
  const campos = {
    ...(produtoAtualizacao.preco && { custo: produtoAtualizacao.preco }),
    ...(produtoAtualizacao.desconto_p && {
      descontoPercentual: produtoAtualizacao.desconto_p,
    }),
  };

  if (objectUtil.isVazio(campos)) return;

  try {
    await tabelaFornecedorUf.atualizar({
      pk: {
        estadoId: siglaEstadoModel.obterNome(produtoAtualizacao.estado || produto.estado),
        produtoId: produto.produto_arius,
        fornecedorId: produto?.fornecedor_id,
      },
      tabelaFornecedor: {
        pk: {
          produtoId: produto.produto_arius,
          fornecedorId: produto?.fornecedor_id,
        },
      },
      produtoEstado: {
        pk: {
          produtoId: produto.produto_arius,
          estadoId: siglaEstadoModel.obterNome(produtoAtualizacao.estado || produto.estado),
        },
      },
      tributacao: TRIBUTACAO_SUBSTITUIDO,
      situacaoTributaria: { id: CST_SUBSTITUIDO },
      icms: 0,
      estado: {
        id: siglaEstadoModel.obterNome(produto.estado),
        icms: 0,
      },
      ...campos,
    });
  } catch (erro) {
    console.log(erro);
    throw new Error(erro.response.data.processedException?.causeMessage);
  }
}

async function atualizarDados(produto: ProdutoCadastroDTO, produtoAtualizacao: Partial<ProdutoCadastroDTO>) {
  try {
    const divergencia = produto.divergencias[0];
    const campos = {
      descritivo: produtoAtualizacao.descritivo ?? divergencia.descritivo,
      descritivo_pdv: produtoAtualizacao.descritivo_pdv ?? divergencia.descritivo_pdv,
      qtde_embalagem: produtoAtualizacao.qtde_embalagem ?? divergencia.qtde_embalagem,
      validade: produtoAtualizacao.validade ?? divergencia.validade,
      origem: produtoAtualizacao.origem ?? divergencia.origem,
      pesob: produtoAtualizacao.pesob ?? divergencia.pesob,
      pesol: produtoAtualizacao.pesol ?? divergencia.pesol,
      comprimento: produtoAtualizacao.comprimento ?? divergencia.comprimento,
      largura: produtoAtualizacao.largura ?? divergencia.largura,
      altura: produtoAtualizacao.altura ?? divergencia.altura,
      marca: produtoAtualizacao.marca ?? divergencia.marca,
      depto: produtoAtualizacao.depto ?? divergencia.depto,
      secao: produtoAtualizacao.secao ?? divergencia.secao,
      grupo: produtoAtualizacao.grupo ?? divergencia.grupo,
      familia: produtoAtualizacao.familia ?? divergencia.familia,
      comprador: produtoAtualizacao.comprador ?? divergencia.comprador,
      subgrupo: produtoAtualizacao.subgrupo ?? divergencia.subgrupo,
      preco: produtoAtualizacao.preco ?? divergencia.preco,
      desconto_p: produtoAtualizacao.desconto_p ?? divergencia.desconto_p,
      categoria_fiscal: produtoAtualizacao.categoria_fiscal ?? divergencia.categoria_fiscal,
    };

    if (objectUtil.isVazio(campos)) return;

    await produtoService.atualizar({
      id: produto?.id,
      produto_arius: produto.produto_arius,
      status: ECadastroStatus.APROVADO,
      ...campos,
    });
  } catch (erro) {
    console.log(erro);
    throw new Error('Ocorreu um erro ao atualizar o produto na base.');
  }
}

export default {
  atualizar,
};
