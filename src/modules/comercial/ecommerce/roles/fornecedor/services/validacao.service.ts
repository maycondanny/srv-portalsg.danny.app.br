import ErroValidacaoResponseDTO from '@modules/comercial/ecommerce/dtos/erro-validacao-response.dto';
import { Produto } from '@modules/comercial/ecommerce/models/produto.model';
import validacaoService from '@modules/comercial/ecommerce/services/validacao.service';
import produtoEanService from '@modules/integradores/arius/comercial/services/produto-ean.service';
import objectUtil from '@utils/object.util';
import _ from 'lodash';

async function validar(produto: Produto): Promise<ErroValidacaoResponseDTO> {
  let erros: string[] = [];
  erros = _.concat(erros, validacaoService.validarCamposObrigatorios(produto));
  erros = _.concat(erros, validacaoService.validarEan(produto));
  erros = _.concat(erros, await validarEanEstaoCadastrados(produto));
  return validacaoService.montarRespostaRetorno(produto, erros);
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

export default {
  validar,
};
