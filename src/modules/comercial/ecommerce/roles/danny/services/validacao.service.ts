import ErroValidacaoResponseDTO from '@modules/comercial/ecommerce/dtos/erro-validacao-response.dto';
import { Produto } from '@modules/comercial/ecommerce/models/produto.model';
import validacaoService from '@modules/comercial/ecommerce/services/validacao.service';
import _ from 'lodash';

function validar(produto: Produto): ErroValidacaoResponseDTO {
  let erros: string[] = [];
  erros = _.concat(erros, validacaoService.validarCamposObrigatorios(produto));
  erros = _.concat(erros, validacaoService.validarEan(produto));
  return validacaoService.montarRespostaRetorno(produto, erros);
}

export default {
  validar,
};
