import ErroValidacaoResponseDTO from '@modules/comercial/ecommerce/dtos/erro-validacao-response.dto';
import { Produto } from '@modules/comercial/ecommerce/models/produto.model';
import numberUtil from '@utils/number.util';
import { REGEX_APENAS_NUMEROS } from '@utils/regex.util';
import stringUtil from '@utils/string.util';
import _ from 'lodash';
import { ETamanho } from '../models/ean.model';
import produtoEanService from '@modules/integradores/arius/comercial/services/produto-ean.service';
import objectUtil from '@utils/object.util';

async function validar(produto: Produto): Promise<ErroValidacaoResponseDTO> {
  let erros: string[] = [];
  erros = _.concat(erros, validarCamposObrigatorios(produto));
  erros = _.concat(erros, validarEan(produto));
  erros = _.concat(erros, await validarEanEstaoCadastrados(produto));
  return montarRespostaRetorno(produto, erros);
}

function validarCamposObrigatorios(produto: Produto): string[] {
  const mensagens = [];

  if (_.isEmpty(produto.nome)) {
    mensagens.push('NOME não informado');
  }

  if (_.isEmpty(produto.caracteristica)) {
    mensagens.push('DESCRIÇÃO DETALHADA DO SKU não informada');
  }

  if (
    !produto.imagens ||
    numberUtil.isMenorOuIgualZero(produto.imagens.length) ||
    !produto.imagens.every((imagem) => typeof imagem.url === 'string' && imagem.url.trim() !== '')
  ) {
    mensagens.push('O link para vídeos e imagens devem ser preenchidos');
    return mensagens;
  }

  return mensagens;
}

async function validarEanEstaoCadastrados(produto: Produto): Promise<string[]> {
  const mensagens = [];

  for (const ean of produto.eans) {
    const produtoArius = await produtoEanService.obterPorCodigo(ean.codigo);
    if (objectUtil.isVazio(produtoArius)) {
      mensagens.push('Produto não cadastrado');
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

  const apenasNumeros = produto.eans.every((ean) => REGEX_APENAS_NUMEROS.test(ean.codigo));

  if (!apenasNumeros) {
    mensagens.push('É permitido apenas números nos códigos EANs');
    return mensagens;
  }

  _.forEach(produto.eans, (ean) => {
    if (stringUtil.isMaior(ean.codigo, ETamanho.EAN)) {
      mensagens.push(`O código do EAN ${ean.codigo} é maior que ${ETamanho.EAN} digitos`);
    }
  });

  return mensagens;
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
  validarCamposObrigatorios,
  validarEan,
  montarRespostaRetorno
};
