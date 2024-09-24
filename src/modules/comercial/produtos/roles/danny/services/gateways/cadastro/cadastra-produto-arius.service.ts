import produtoModel, { ECadastroStatus, Produto } from '@modules/comercial/produtos/models/produto.model';
import _ from 'lodash';
import produtoEanService from '@services/hub/produtos/produto-ean.service';
import ariusProdutoEanService from '@services/arius/comercial/produto-ean.service';
import numberUtil from '@utils/number.util';
import eanModel, { EMedidas } from '@modules/comercial/produtos/models/ean.model';
import ariusProdutoService from '@services/arius/comercial/produto.service';
import produtoService from '@modules/comercial/produtos/services/produto.service';
import aprovacaoService from '../../aprovacao.service';
import produtoCompradorService from '@services/arius/comercial/produto-comprador.service';
import validacaoService from '../../validacao.service';
import ErroException from '@exceptions/erro.exception';

async function cadastrar(produto: Produto) {
  const validacao = await validacaoService.validarCadastro(produto);

  if (!validacao.valido) {
    throw new ErroException('Campos obrigatórios não preenchidos, verifique', validacao);
  }

  const codigos = produtoModel.obterCodigosEans(produto.eans);
  const eansExistem = await produtoEanService.obterPorCodigos(codigos);

  if (numberUtil.isMaiorZero(eansExistem.length))
    throw new ErroException('Já possui EANs vinculados para este produto, verifique');

  const { id, dataCadastro } = await cadastrarArius(produto);

  const produtoArius = id;

  if (!produtoArius) throw new ErroException('Não foi possivel aprovar o produto');

  await cadastrarEans(produtoArius, produto);
  await inserirComprador(produtoArius, produto);
  await aprovacaoService.inserirProdutoFornecedor({
    produtoId: produtoArius,
    fornecedorId: produto.fornecedor_id,
    referencia: produto.codigo_produto_fornecedor,
  });
  await aprovacaoService.inserirTabelaFornecedor({
    fornecedorId: produto.fornecedor_id,
    produtoId: produtoArius,
  });
  await aprovacaoService.inserirTabelaFornecedorUF({
    preco: produto?.preco,
    desconto_p: produto.desconto_p,
    estado: produto.estado,
    fornecedorId: produto.fornecedor_id,
    produtoId: produtoArius,
  });
  await atualizarDados(produtoArius, dataCadastro, produto);

  return {
    produtoId: produtoArius,
  };
}

async function cadastrarArius(produto: Produto) {
  try {
    const { id, dataCadastro } = await ariusProdutoService.cadastrar({
      descricao: produto.descritivo,
      descricaoPdv: produto.descritivo_pdv,
      unidadeVenda: {
        id: EMedidas.UNIDADE,
      },
      quantidadeEmbalagemEntrada: 1,
      quantidadeEmbalagemSaida: 1,
      embalagem: {
        id: EMedidas.UNIDADE,
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
      aceitaMultiplicacaoPDV: 'F',
      aceitaEnterPDV: false,
      incluiListaInventario: true,
      incluiListaPesquisa: false,
      familiaId: produto.familia,
      familia: {
        id: produto.familia,
      },
      origem: produtoModel.obterOrigem(produto.origem),
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
      tipoCategoriaFiscal: produto.categoria_fiscal,
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
    throw new ErroException(erro.response.data.processedException?.causeMessage);
  }
}

async function inserirComprador(produtoId: number, produto: Produto) {
  try {
    await produtoCompradorService.cadastrar({
      pk: {
        produtoId,
        compradorId: produto.comprador,
      },
    });
  } catch (erro) {
    console.log(erro);
    throw new ErroException(erro.response.data.processedException?.causeMessage);
  }
}

async function cadastrarEans(produtoAriusId: number, produto: Produto) {
  try {
    const resultado = _.map(produto.eans, async (ean) => {
      let dados: any = {
        produto: {
          id: produtoAriusId,
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
  } catch (erro) {
    console.log(erro);
    throw new ErroException(erro.response.data.processedException?.causeMessage);
  }
}

async function atualizarDados(produtoAriusId: number, dataCadastroArius: Date, produto: Produto) {
  try {
    await produtoService.atualizar({
      id: produto.id,
      codigo_produto_fornecedor: produto.codigo_produto_fornecedor,
      descritivo: produto.descritivo,
      descritivo_pdv: produto.descritivo_pdv,
      marca: produto.marca,
      depto: produto.depto,
      secao: produto.secao,
      grupo: produto.grupo,
      subgrupo: produto.subgrupo,
      classificacao_fiscal: produto.classificacao_fiscal,
      origem: produto.origem,
      pesol: produto.pesol,
      pesob: produto.pesob,
      validade: produto.validade,
      comprimento: produto.comprimento,
      largura: produto.largura,
      altura: produto.altura,
      qtde_embalagem: produto.qtde_embalagem,
      estado: produto.estado,
      preco: produto.preco,
      desconto_p: produto.desconto_p,
      cadastro_arius: dataCadastroArius,
      comprador: produto.comprador,
      categoria_fiscal: produto.categoria_fiscal,
      produto_arius: produtoAriusId,
      eans: produto.eans,
      familia: produto.familia,
      status: ECadastroStatus.APROVADO,
    });
  } catch (erro) {
    console.log(erro);
    throw new ErroException('Ocorreu um erro ao cadastrar o produto na base.');
  }
}

export default {
  cadastrar,
};
