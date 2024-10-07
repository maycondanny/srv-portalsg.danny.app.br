import _ from 'lodash';
import ErroException from '@exceptions/erro.exception';
import excelUtil from '@utils/excel.util';
import ImportacaoRequestDTO from '../dtos/importacao.request.dto';
import httpStatusEnum from '@enums/http-status.enum';
import numberUtil from '@utils/number.util';
import ProdutoImportacaoDTO from '../dtos/produto-importacao.dto';
import importacaoMapper from '../mappers/importacao.mapper';
import cadastroProdutoJob from '../jobs/cadastro-produto.job';
import validacaoService from './validacao.service';

async function importar({ planilha, fornecedorId }: ImportacaoRequestDTO): Promise<void> {
  if (!planilha) throw new ErroException('Planilha não enviada', httpStatusEnum.Status.ERRO_REQUISICAO);
  if (!fornecedorId) throw new ErroException('Fornecedor não encontrado', httpStatusEnum.Status.ERRO_REQUISICAO);

  const dados = excelUtil.lerDados(planilha.buffer);
  if (_.isEmpty(dados)) throw new ErroException('A planilha importada está vazia, tente novamente');

  const produtosInvalidos = [];
  const produtos = [];

  for (const dado of dados) {
    const linhaProduto = obterDadosLinhaProduto(dado);
    const produto = importacaoMapper.toProduto({
      fornecedorId,
      produto: linhaProduto,
    });

    const validacao = await validacaoService.validarCadastro(produto);

    if (!validacao.valido) {
      produtosInvalidos.push({ ean: validacao.ean, erros: validacao.erros });
    } else {
      produtos.push(produto);
    }
  }

  if (numberUtil.isMaiorZero(produtosInvalidos.length)) {
    throw new ErroException(
      'Ocorreu um erro ao cadastrar os produtos',
      produtosInvalidos,
      httpStatusEnum.Status.ERRO_REQUISICAO
    );
  }

  for (const produto of produtos) {
    await cadastroProdutoJob.add({ produto });
  }
}

function obterDadosLinhaProduto(dadosImportados: any): ProdutoImportacaoDTO {
  return {
    codigo_produto_fornecedor: dadosImportados['CODIGO INTERNO DO PRODUTO FORNECEDOR'],
    descritivo_pdv: dadosImportados['DESCRIÇÃO ABREVIADA'],
    descritivo: dadosImportados['DESCRIÇÃO COMPLETA'],
    origem: dadosImportados['ORIGEM PRODUTO'],
    eans: dadosImportados['EAN'],
    duns: dadosImportados['DUN'],
    estado: dadosImportados['UF FATURAMENTO'],
    preco: dadosImportados['PREÇO CUSTO'],
    desconto_p: dadosImportados['DESCONTO'],
    pesob: dadosImportados['PESO BRUTO(KG)'],
    pesol: dadosImportados['PESO LIQUIDO'],
    altura: dadosImportados['ALTURA'],
    largura: dadosImportados['LARGURA'],
    comprimento: dadosImportados['COMPRIMENTO'],
    validade: dadosImportados['VALIDADE DO PRODUTO (MESES)'],
    qtde_embalagem: dadosImportados['QTDE POR CX'],
    comprimento_d: dadosImportados['COMPRIMENTO DA CX'],
    largura_d: dadosImportados['LARGURA DA CX'],
    altura_d: dadosImportados['ALTURA DA CX'],
    classificacao_fiscal: dadosImportados['NCM'],
    st_compra: dadosImportados['CÓDIGO SUBSTITUIÇÃO TRIBUTÁRIA'],
    icms_compra: dadosImportados['ICMS'],
    ipi: dadosImportados['IPI'],
    pis_cofins: dadosImportados['PIS/COFINS'],
    descricao: dadosImportados['DESCRIÇÃO CURTA / titulo'],
    caracteristica: dadosImportados['DESCRIÇÃO DETALHADA DO SKU'],
    imagens: dadosImportados['Link para vídeos e Imagens'],
    modo_uso: dadosImportados['MODO DE USO'],
  };
}

export default {
  importar,
};
