import _ from 'lodash';
import numberUtil from '@utils/number.util';
import cacheUtil from '@utils/cache.util';
import produtoFornecedorService from 'services/hub/produto-fornecedor.service';
import { ETamanho } from '@modules/comercial/produtos/models/ean.model';
import stringUtil from '@utils/string.util';
import { CODIGO_REFERENCIA_FORNECEDOR_CACHE, Produto } from '@modules/comercial/produtos/models/produto.model';
import { REGEX_APENAS_NUMEROS } from '@utils/regex.util';
import ErroValidacaoResponseDTO from '../dtos/erro-validacao-response.dto';

async function validar(produto: Produto): Promise<ErroValidacaoResponseDTO> {
  let erros: string[] = [];
  erros = _.concat(erros, await validarCodigoFornecedor(produto));
  erros = _.concat(erros, validarEan(produto));
  erros = _.concat(erros, validarCaixaDun(produto));
  erros = _.concat(erros, validarCamposObrigatorios(produto));
  return montarRespostaRetorno(produto, erros);
}

async function validarCodigoFornecedor(produto: Produto): Promise<string[]> {
  const mensagens = [];

  if (_.isEmpty(produto.codigo_produto_fornecedor)) {
    mensagens.push('CODIGO INTERNO DO PRODUTO FORNECEDOR não informado');
    return mensagens;
  }

  const codigo = produto.codigo_produto_fornecedor;
  const produtoFornecedorCache = await cacheUtil.obter(`${CODIGO_REFERENCIA_FORNECEDOR_CACHE}_${codigo}`);
  if (produtoFornecedorCache) {
    mensagens.push('CODIGO INTERNO DO PRODUTO FORNECEDOR já cadastrado');
  } else {
    const produtoFornecedor = await produtoFornecedorService.obterPorReferencia(codigo);
    if (produtoFornecedor) {
      mensagens.push('CODIGO INTERNO DO PRODUTO FORNECEDOR já cadastrado');
    }
  }

  return mensagens;
}

function validarEan(produto: Produto): string[] {
  const mensagens = [];

  if (
    !produto.eans ||
    numberUtil.isMenorOuIgualZero(produto.eans.length) ||
    !produto.eans.every((ean) => typeof ean.codigo === 'string' && ean.codigo.trim() !== '')
  ) {
    mensagens.push('O código EAN deve ser preenchido');
    return mensagens;
  }

  const apenasNumeros = produto.eans.concat(produto.duns).every((ean) => REGEX_APENAS_NUMEROS.test(ean.codigo));

  if (!apenasNumeros) {
    mensagens.push('É permitido apenas números no códigos EANs e DUNs');
    return mensagens;
  }

  _.forEach(produto.eans, (ean) => {
    if (stringUtil.isMaior(ean.codigo, ETamanho.EAN)) {
      mensagens.push(`O código do EAN ${ean.codigo} é maior que ${ETamanho.EAN} digitos`);
    }
  });
  _.forEach(produto.duns, (dun) => {
    if (stringUtil.isMaior(dun.codigo, ETamanho.DUN)) {
      mensagens.push(`O código do DUN ${dun.codigo} é maior que ${ETamanho.DUN} digitos`);
    }
  });

  return mensagens;
}

function validarCaixaDun(produto: Produto): string[] {
  const mensagens = [];

  if (
    numberUtil.isMaiorZero(produto.duns?.length) &&
    (!produto?.qtde_embalagem || numberUtil.isMenorOuIgualZero(produto?.qtde_embalagem))
  ) {
    mensagens.push('Necessário enviar a QTDE POR CX para preencher o campo DUN');
  }
  if (
    numberUtil.isMaiorZero(produto?.qtde_embalagem) &&
    (!produto.duns || numberUtil.isMenorOuIgualZero(produto.duns?.length))
  ) {
    mensagens.push('Necessário enviar o DUN para preencher a QTDE POR CX');
  }

  return mensagens;
}

function validarCamposObrigatorios(produto: Produto): string[] {
  const mensagens = [];
  if (_.isEmpty(produto.descritivo)) {
    mensagens.push('DESCRIÇÃO COMPLETA não informada');
  }
  if (validaCampo(produto, 'estado')) {
    mensagens.push('UF FATURAMENTO não informado');
  }
  if (validaCampo(produto, 'preco')) {
    mensagens.push('PREÇO CUSTO não informado');
  }
  if (validaCampo(produto, 'pesob')) {
    mensagens.push('PESO BRUTO(KG) não informado');
  }
  if (validaCampo(produto, 'pesol')) {
    mensagens.push('PESO LIQUIDO não informado');
  }
  if (validaCampo(produto, 'altura')) {
    mensagens.push('ALTURA não informada');
  }
  if (validaCampo(produto, 'largura')) {
    mensagens.push('LARGURA não informada');
  }
  if (validaCampo(produto, 'comprimento')) {
    mensagens.push('COMPRIMENTO não informado');
  }
  if (!_.isNumber(produto.validade) && _.isUndefined(produto.validade)) {
    mensagens.push('VALIDADE DO PRODUTO (MESES) não informado');
  }
  if (_.isEmpty(produto.classificacao_fiscal)) {
    mensagens.push('NCM não informado');
  }
  if (_.isEmpty(produto.st_compra)) {
    mensagens.push('CÓDIGO SUBSTITUIÇÃO TRIBUTÁRIA não informado');
  }
  if (!_.isNumber(produto.ipi) || _.isUndefined(produto.ipi) || numberUtil.isMenorZero(produto.ipi)) {
    mensagens.push('IPI não informado');
  }
  if (
    !_.isNumber(produto.icms_compra) ||
    _.isUndefined(produto.icms_compra) ||
    numberUtil.isMenorZero(produto.icms_compra)
  ) {
    mensagens.push('ICMS não informado');
  }

  return mensagens;
}

function validaCampo(produto: Produto, campo: string): boolean {
  return !_.isNumber(produto[campo]) || _.isUndefined(produto[campo]) || numberUtil.isMenorOuIgualZero(produto[campo]);
}

function montarRespostaRetorno(produto: Produto, erros: string[]): ErroValidacaoResponseDTO {
  return {
    valido: numberUtil.isMenorOuIgualZero(erros.length),
    ean: (numberUtil.isMaiorZero(produto.eans?.length) && produto.eans[0].codigo) || null,
    erros,
  };
}

export default {
  validar,
  montarRespostaRetorno
};
