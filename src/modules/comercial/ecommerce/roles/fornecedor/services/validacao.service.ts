import ErroValidacaoResponseDTO from '@modules/comercial/ecommerce/dtos/erro-validacao-response.dto';
import { Produto } from '@modules/comercial/ecommerce/models/produto.model';
import validacaoService from '@modules/comercial/ecommerce/services/validacao.service';
import numberUtil from '@utils/number.util';
import _ from 'lodash';

function validar(produto: Produto): ErroValidacaoResponseDTO {
  let erros: string[] = [];
  erros = _.concat(erros, validacaoService.validarCamposObrigatorios(produto));
  erros = _.concat(erros, validacaoService.validarEan(produto));
  return montarRespostaRetorno(produto, erros);
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
};
