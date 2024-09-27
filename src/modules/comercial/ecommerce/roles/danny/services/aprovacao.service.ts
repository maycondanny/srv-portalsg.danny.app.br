import { EStatus, Produto } from '@modules/comercial/ecommerce/models/produto.model';
import AprovacaoRequestDTO from '../dtos/aprovacao-request.dto';
import AprovacaoResponseDTO from '../dtos/aprovacao-response.dto';
import hubUtil from '@utils/hub.util';
import numberUtil from '@utils/number.util';
import _ from 'lodash';
import atualizaEcommerceAriusService from './gateways/atualiza-ecommerce-arius.service';
import cadastraEcommerceAriusService from './gateways/cadastra-ecommerce-arius.service';

const aprovar = async ({ produto, dadosAtualizacao }: AprovacaoRequestDTO): Promise<AprovacaoResponseDTO> => {
  if (produto.status === EStatus.CADASTRADO) {
    return await atualizaEcommerceAriusService.atualizar(produto, dadosAtualizacao);
  } else {
    return await cadastraEcommerceAriusService.cadastrar(produto);
  }
};

async function salvarImagens(produto: Produto) {
  const URL = '/images/create';
  const imagens = tratarImagens(produto);
  await hubUtil.post(URL, imagens);
}

function tratarImagens(produto: Produto) {
  if (!produto.imagens || numberUtil.isMenorOuIgualZero(produto.imagens.length)) {
    return;
  }
  const urls = _.chain(produto.imagens)
    .map((imagem) => ({
      url: imagem.url.trim(),
    }))
    .filter(Boolean)
    .value();

  return _.map(urls, (url) => ({
    link: url,
    produtoId: produto.produto_id,
  }));
}

export default {
  aprovar,
  salvarImagens,
};
