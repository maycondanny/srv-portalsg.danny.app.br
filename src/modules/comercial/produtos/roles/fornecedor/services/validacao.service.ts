import { CODIGO_REFERENCIA_FORNECEDOR_CACHE, Produto } from '@modules/comercial/produtos/models/produto.model';
import validacaoService from '@modules/comercial/produtos/services/validacao.service';
import cacheUtil from '@utils/cache.util';
import numberUtil from '@utils/number.util';
import _ from 'lodash';

async function validarCadastro(produto: Produto) {
  let erros: string[] = [];
  erros = _.concat(erros, validacaoService.validarCodigoFornecedor(produto));
  erros = _.concat(erros, await validarCodigoFornecedorCache(produto));
  erros = _.concat(erros, validacaoService.validarEan(produto));
  erros = _.concat(erros, validacaoService.validarCaixaDun(produto));
  erros = _.concat(erros, validacaoService.validarCamposObrigatorios(produto));
  erros = _.concat(erros, validacaoService.validarCamposObrigatoriosFiscal(produto));
  erros = _.concat(erros, validarEcommerce(produto));
  return validacaoService.montarRespostaRetorno(produto, erros);
}

async function validarAtualizacao(produto: Produto) {
  let erros: string[] = [];
  erros = _.concat(erros, validacaoService.validarEan(produto));
  erros = _.concat(erros, validacaoService.validarCaixaDun(produto));
  erros = _.concat(erros, validacaoService.validarCamposObrigatorios(produto));
  erros = _.concat(erros, validacaoService.validarCamposObrigatoriosFiscal(produto));
  erros = _.concat(erros, validarEcommerce(produto));
  return validacaoService.montarRespostaRetorno(produto, erros);
}

async function validarCodigoFornecedorCache(produto: Produto): Promise<string[]> {
  const mensagens = [];

  const referencia = produto.codigo_produto_fornecedor;

  const produtoFornecedorCache = await cacheUtil.obter(
    `${CODIGO_REFERENCIA_FORNECEDOR_CACHE}_${produto.fornecedor_id}_${referencia}`
  );

  if (produtoFornecedorCache) {
    mensagens.push('CODIGO INTERNO DO PRODUTO FORNECEDOR já cadastrado');
  }

  return mensagens;
}

function validarEcommerce(produto: Produto): string[] {
  const mensagens = [];

  if (_.isEmpty(produto.ecommerce.caracteristica)) {
    mensagens.push('DESCRIÇÃO DETALHADA DO SKU não informada');
  }

  if (
    !produto.ecommerce.imagens ||
    numberUtil.isMenorOuIgualZero(produto.ecommerce.imagens.length) ||
    !produto.ecommerce.imagens.every((imagem) => typeof imagem.url === 'string' && imagem.url.trim() !== '')
  ) {
    mensagens.push('O link para vídeos e imagens devem ser preenchidos');
    return mensagens;
  }

  return mensagens;
}

export default {
  validarAtualizacao,
  validarCadastro,
};
