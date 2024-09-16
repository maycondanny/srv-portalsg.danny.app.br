import { Produto } from "@modules/comercial/produtos/models/produto.model";
import validacaoService from "@modules/comercial/produtos/services/validacao.service";
import numberUtil from "@utils/number.util";
import _ from "lodash";

async function validar(produto: Produto) {
  let erros: string[] = [];
  const validacao = await validacaoService.validar(produto);
  erros = _.concat(erros, validacao.erros);
  erros = _.concat(erros, validarEcommerce(produto));
  return validacaoService.montarRespostaRetorno(produto, erros);
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
  validar
}
