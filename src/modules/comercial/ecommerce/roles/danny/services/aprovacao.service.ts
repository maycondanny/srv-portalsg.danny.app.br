import { EStatus, Produto } from '@modules/comercial/ecommerce/models/produto.model';
import AprovacaoRequestDTO from '../dtos/aprovacao-request.dto';
import numberUtil from '@utils/number.util';
import _ from 'lodash';
import atualizaEcommerceAriusService from './gateways/atualiza-ecommerce-arius.service';
import cadastraEcommerceAriusService from './gateways/cadastra-ecommerce-arius.service';
import produtoMapper from '../mappers/produto.mapper';

const aprovar = async ({ produto, dadosAtualizacao }: AprovacaoRequestDTO): Promise<void> => {
  if (produto.status === EStatus.CADASTRADO) {
    await atualizaEcommerceAriusService.atualizar(
      produtoMapper.toProduto(produto),
      produtoMapper.toProduto(dadosAtualizacao)
    );
    return;
  }

  await cadastraEcommerceAriusService.cadastrar(produtoMapper.toProduto(produto));
};

async function salvarImagens(produto: Produto) {
  // const URL = '/images/create';
  // const imagens = tratarImagens(produto);
  // await hubUtil.post(URL, imagens);
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
