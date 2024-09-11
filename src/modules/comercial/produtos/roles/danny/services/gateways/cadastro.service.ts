import produtoModel, { ECadastroStatus, Produto } from '@modules/comercial/produtos/models/produto.model';
import ProdutoCadastro from '../../models/produto-cadastro.model';
import _ from 'lodash';
import produtoEanService from '@services/hub/produtos/produto-ean.service';
import ariusProdutoEanService, { ProdutoEan } from '@services/arius/comercial/produto-ean.service';
import numberUtil from '@utils/number.util';
import eanModel, { EMedidas } from '@modules/comercial/produtos/models/ean.model';
import ariusProdutoService from '@services/arius/comercial/produto.service';
import produtoFornecedor from '@services/arius/comercial/produto-fornecedor';
import tabelaFornecedor from '@services/arius/comercial/tabela-fornecedor';
import tabelaFornecedorUf from '@services/arius/comercial/tabela-fornecedor-uf';
import siglaEstadoModel from '@models/sigla-estado.model';
import produtoService from '@modules/comercial/produtos/services/produto.service';

const LINHA_GERAL = 1;

async function cadastrar(produto: ProdutoCadastro) {
  const codigos = produtoModel.obterCodigosEans(produto.eans);
  const eansExistem = await produtoEanService.obterPorCodigos(codigos);

  if (numberUtil.isMaiorZero(eansExistem.length)) throw new Error('Já possui EANs vinculados ao produto fornecido');

  const { id, dataCadastro } = await cadastrarArius(produto);
  const produtoArius = id;
  if (!produtoArius) throw new Error('Não foi possivel aprovar o produto');
  await cadastrarEans(produtoArius, produto);
  await inserirProdutoFornecedor(produtoArius, produto);
  await inserirTabelaFornecedor(produtoArius, produto);
  await inserirTabelaFornecedorUF(produtoArius, produto);
  await atualizarDados(produtoArius, dataCadastro, produto);
}

async function cadastrarArius(produto: ProdutoCadastro) {
  try {
    const { id, dataCadastro } = await ariusProdutoService.cadastrar({
      descricao: produto.descritivo,
      descricaoPdv: produto.descritivo_pdv,
      unidadeVenda: {
        id: EMedidas.UNIDADE,
      },
      quantidadeEmbalagemEntrada: 1, // rever com a regra do duns
      quantidadeEmbalagemSaida: 1,
      embalagem: {
        id: EMedidas.UNIDADE, // rever com a regra do duns
      },
      validade: produto.validade,
      tipoValidade: 'MES',
      ncm: {
        id: produto.classificacao_fiscal,
      },
      tipoSituacaoProduto: 'MANDAPDV',
      tipoIpv: '1',
      pesoLiquido: produto.pesol,
      pesoBruto: produto.pesob,
      pisCofins: true,
      tributacaoPisCofins: produto.pis_cofins,
      aceitaMultiplicacaoPDV: 'F',
      aceitaEnterPDV: false,
      incluiListaInventario: false,
      incluiListaPesquisa: false,
      origem: ariusProdutoService.obterOrigem(produto.origem),
      baseFidelidade: 'F',
      departamento: {
        departamentoPK: {
          departamentoId: produto.depto,
          secaoId: produto.secao,
          grupoId: produto.grupo,
          subGrupoId: produto.subgrupo,
        },
      },
      largura: produto.largura,
      altura: produto.altura,
      comprimento: produto.comprimento,
      eanPorPeso: false,
      imprimeDataEmbalagem: true,
      quantidadeKgl: 0,
      aceitaTroca: true,
      controlaEstoque: true,
      tipoCategoriaFiscal: 0,
      mixBase: false,
      armazenagemElevador: false,
      removidoSortimento: false,
      marcaProduto: {
        id: produto.marca,
      },
    });
    return { id, dataCadastro };
  } catch (erro) {
    console.log(erro);
    throw new Error('Ocorreu um erro ao cadastrar o produto na ARIUS.');
  }
}

async function cadastrarEans(produtoAriusId: number, produto: ProdutoCadastro) {
  const resultado = _.map(produto.eans, async (ean) => {
    let dados: any = {
      produto: {
        id: produtoAriusId
      },
      eanPrincipal: false,
      enviaPdv: false,
      registradoGtin: false,
      ean: ean.codigo,
      quantidade: ean.quantidade,
      embalagem: {
        id: ean.tipo,
      },
    };

    if (eanModel.isEan(ean)) {
      dados = _.assign({}, dados, {
        eanPrincipal: true,
        enviaPdv: true,
      });
    }

    await ariusProdutoEanService.cadastrar(dados);
  });

  await Promise.all(resultado);
}

async function inserirProdutoFornecedor(
  produtoId: number,
  produto: ProdutoCadastro
) {
  try {
    await produtoFornecedor.cadastrar({
      pk: {
        produtoId: produtoId,
        fornecedorId: produto.fornecedor_id,
      },
      linha: LINHA_GERAL,
      referencia: produto.codigo_produto_fornecedor,
      sif: 0,
    });
  } catch (erro) {
    console.log(erro);
    throw new Error(
      "Ocorreu um erro ao cadastrar o produto/fornecedor na ARIUS."
    );
  }
}

async function inserirTabelaFornecedor(
  produtoId: number,
  produto: ProdutoCadastro
) {
  try {
    await tabelaFornecedor.cadastrar({
      pk: {
        produtoId: produtoId,
        fornecedorId: Number(produto.fornecedor_id),
      },
      produtoFornecedor: {
        pk: {
          produtoId: produtoId,
          fornecedorId: Number(produto.fornecedor_id),
        },
        produto: {
          id: produtoId,
        },
        fornecedor: {
          id: Number(produto.fornecedor_id),
        },
      },
      tipoIPI: "F",
      ipi: Number(produto?.ipi),
      quantidadeEmbalagem: 1, // rever com a regra do duns
      unidadeCompra: {
        id: EMedidas.UNIDADE, // rever com a regra do duns
      },
    });
  } catch (erro) {
    console.log(erro);
    throw new Error(
      "Ocorreu um erro ao cadastrar os custos na tabela do fornecedor na Arius."
    );
  }
};

async function inserirTabelaFornecedorUF(
  produtoId: number,
  produto: ProdutoCadastro
) {
  try {
    await tabelaFornecedorUf.cadastrar({
      pk: {
        estadoId: siglaEstadoModel.obterNome(produto.estado),
        produtoId: produtoId,
        fornecedorId: Number(produto?.fornecedor_id),
      },
      tabelaFornecedor: {
        pk: {
          produtoId: produtoId,
          fornecedorId: Number(produto?.fornecedor_id),
        },
      },
      produtoEstado: {
        pk: {
          produtoId: produtoId,
          estadoId: siglaEstadoModel.obterNome(produto.estado),
        },
      },
      custo: Number(produto?.preco),
      tributacao: tabelaFornecedorUf.obterTipoTributacao(
        produto?.st_compra
      ),
      situacaoTributaria: { id: produto?.st_compra },
      icms: Number(produto?.icms_compra),
      estado: {
        id: siglaEstadoModel.obterNome(produto.estado),
        icms: Number(produto?.icms_compra),
      },
      descontoPercentual: Number(produto?.desconto_p) ?? 0,
    });
  } catch (erro) {
    console.log(erro);
    throw new Error(
      "Ocorreu um erro ao cadastrar os custos na tabela do fornecedor no estado na Arius."
    );
  }
};

const atualizarDados = async (
  produtoAriusId: number,
  dataCadastroArius: Date,
  produto: ProdutoCadastro
) => {
  try {
    await produtoService.atualizar({
      id: produto?.id,
      codigo_produto_fornecedor: produto?.codigo_produto_fornecedor,
      descritivo: produto.descritivo,
      descritivo_pdv: produto?.descritivo_pdv,
      marca: produto?.marca,
      depto: produto?.depto,
      secao: produto?.secao,
      grupo: produto?.grupo,
      subgrupo: produto?.subgrupo,
      classificacao_fiscal: produto?.classificacao_fiscal,
      origem: produto?.origem,
      pesol: produto?.pesol,
      pesob: produto?.pesob,
      validade: produto?.validade,
      comprimento: produto?.comprimento,
      largura: produto?.largura,
      altura: produto?.altura,
      qtde_embalagem: produto?.qtde_embalagem,
      comprimento_d: produto?.comprimento_d,
      altura_d: produto?.altura_d,
      largura_d: produto?.largura_d,
      ipi: produto?.ipi,
      pis_cofins: produto?.pis_cofins,
      estado: produto?.estado,
      preco: produto?.preco,
      desconto_p: produto?.desconto_p,
      cadastro_arius: dataCadastroArius,
      produto_arius: produtoAriusId,
      eans: produto.eans,
      status: ECadastroStatus.APROVADO,
    });
  } catch (erro) {
    console.log(erro);
    throw new Error("Ocorreu um erro ao cadastrar o produto na base.");
  }
};

export default {
  cadastrar,
};
