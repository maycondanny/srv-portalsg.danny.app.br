import _ from 'lodash';
import produtoDto, { ProdutoDTO } from '../dtos/produto.dto';
import numberUtil from '@utils/number.util';
import cacheUtil from '@utils/cache.util';
import produtosFornecedorService from 'services/hub/produtos-fornecedor.service';
import { ETamanho } from '@modules/comercial/produtos/models/ean.model';
import stringUtil from '@utils/string.util';
import { CODIGO_REFERENCIA_FORNECEDOR_CACHE } from '@modules/comercial/produtos/models/produto.model';

interface ValidacaoResponseProps {
  valido: boolean;
  mensagensErro: string[];
}

async function isValido(produtoDTO: ProdutoDTO): Promise<ValidacaoResponseProps> {
  if (!produtoDto.validarPossuiEan(produtoDTO)) {
    return montarResposta(false, ['O produto deve conter ao menos 1 código EAN']);
  }
  const mensagensErro: string[] = [];
  validarCamposObrigatorios(produtoDTO, mensagensErro);
  validarDun(produtoDTO, mensagensErro);
  validarTamanhoEan(produtoDTO, mensagensErro);
  await validarCodigoFornecedor(produtoDTO, mensagensErro);
  return montarResposta(numberUtil.isMenorOuIgualZero(mensagensErro.length), mensagensErro);
}

async function validarCodigoFornecedor(produtoDTO: ProdutoDTO, mensagensErro: string[]) {
  const codigo = produtoDTO.codigo_produto_fornecedor;
  const produtoFornecedorCache = await cacheUtil.obter(`${CODIGO_REFERENCIA_FORNECEDOR_CACHE}_${codigo}`);
  if (produtoFornecedorCache) {
    adicionarErro('CODIGO INTERNO DO PRODUTO FORNECEDOR já cadastrado', mensagensErro);
    return;
  }
  const produtoFornecedor = await produtosFornecedorService.obterPorReferencia(codigo);
  if (produtoFornecedor) {
    adicionarErro('CODIGO INTERNO DO PRODUTO FORNECEDOR já cadastrado', mensagensErro);
  }
}

function montarResposta(valido: boolean, mensagens: string[]): ValidacaoResponseProps {
  return {
    valido,
    mensagensErro: mensagens,
  };
}

function validarDun(produto: ProdutoDTO, mensagensErro: string[]) {
  if (
    numberUtil.isMaiorZero(produto.duns?.length) &&
    (!produto?.qtde_embalagem || numberUtil.isMenorOuIgualZero(produto?.qtde_embalagem))
  ) {
    adicionarErro('Necessário enviar a QTDE POR CX para preencher o campo DUN', mensagensErro);
  }
  if (
    numberUtil.isMaiorZero(produto?.qtde_embalagem) &&
    (!produto.duns || numberUtil.isMenorOuIgualZero(produto.duns?.length))
  ) {
    adicionarErro('Necessário enviar o DUN para preencher a QTDE POR CX', mensagensErro);
  }
}

function validarTamanhoEan(produto: ProdutoDTO, mensagensErro: string[]) {
  _.forEach(produto.eans, (ean) => {
    if (stringUtil.isMaior(ean.codigo, ETamanho.EAN)) {
      adicionarErro(`O código do EAN ${ean.codigo} é maior que ${ETamanho.EAN} digitos`, mensagensErro);
    }
  });
  _.forEach(produto.duns, (dun) => {
    if (stringUtil.isMaior(dun.codigo, ETamanho.DUN)) {
      adicionarErro(`O código do DUN ${dun.codigo} é maior que ${ETamanho.DUN} digitos`, mensagensErro);
    }
  });
}

function validarCamposObrigatorios(produto: ProdutoDTO, mensagensErro: string[]) {
  if (_.isEmpty(produto.codigo_produto_fornecedor)) {
    adicionarErro('CODIGO INTERNO DO PRODUTO FORNECEDOR não informado', mensagensErro);
  }
  if (_.isEmpty(produto.descritivo)) {
    adicionarErro('DESCRIÇÃO COMPLETA não informada', mensagensErro);
  }
  if (!_.isNumber(produto.estado) || _.isUndefined(produto.estado) || numberUtil.isMenorOuIgualZero(produto.estado)) {
    adicionarErro('UF FATURAMENTO não informado', mensagensErro);
  }
  if (!_.isNumber(produto.preco) || _.isUndefined(produto.preco) || numberUtil.isMenorOuIgualZero(produto.preco)) {
    adicionarErro('PREÇO CUSTO não informado', mensagensErro);
  }
  if (!_.isNumber(produto.pesob) || _.isUndefined(produto.pesob) || numberUtil.isMenorOuIgualZero(produto.pesob)) {
    adicionarErro('PESO BRUTO(KG) não informado', mensagensErro);
  }
  if (!_.isNumber(produto.pesol) || _.isUndefined(produto.pesol) || numberUtil.isMenorOuIgualZero(produto.pesol)) {
    adicionarErro('PESO LIQUIDO não informado', mensagensErro);
  }
  if (!_.isNumber(produto.altura) || _.isUndefined(produto.altura) || numberUtil.isMenorOuIgualZero(produto.altura)) {
    adicionarErro('ALTURA não informada', mensagensErro);
  }
  if (
    !_.isNumber(produto.largura) ||
    _.isUndefined(produto.largura) ||
    numberUtil.isMenorOuIgualZero(produto.largura)
  ) {
    adicionarErro('LARGURA não informada', mensagensErro);
  }
  if (
    !_.isNumber(produto.comprimento) ||
    _.isUndefined(produto.comprimento) ||
    numberUtil.isMenorOuIgualZero(produto.comprimento)
  ) {
    adicionarErro('COMPRIMENTO não informado', mensagensErro);
  }
  if (!_.isNumber(produto.validade) && _.isUndefined(produto.validade)) {
    adicionarErro('VALIDADE DO PRODUTO (MESES) não informado', mensagensErro);
  }
  if (_.isEmpty(produto.classificacao_fiscal)) {
    adicionarErro('NCM não informado', mensagensErro);
  }
  if (_.isEmpty(produto.st_compra)) {
    adicionarErro('CÓDIGO SUBSTITUIÇÃO TRIBUTÁRIA não informado', mensagensErro);
  }
  if (!_.isNumber(produto.ipi) || _.isUndefined(produto.ipi) || numberUtil.isMenorZero(produto.ipi)) {
    adicionarErro('IPI não informado', mensagensErro);
  }
  if (
    !_.isNumber(produto.icms_compra) ||
    _.isUndefined(produto.icms_compra) ||
    numberUtil.isMenorZero(produto.icms_compra)
  ) {
    adicionarErro('ICMS não informado', mensagensErro);
  }
  if (_.isEmpty(produto.caracteristica)) {
    adicionarErro('DESCRIÇÃO DETALHADA DO SKU não informado', mensagensErro);
  }
  if (numberUtil.isMenorOuIgualZero(produto.imagens?.length) || !_.isArray(produto.imagens)) {
    adicionarErro('Link para vídeos e Imagens não informadas', mensagensErro);
  }
}

function adicionarErro(mensagem: string, mensagensErro: string[]) {
  mensagensErro.push(mensagem);
}

export default {
  isValido,
};
