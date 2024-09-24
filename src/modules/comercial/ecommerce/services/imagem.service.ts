import _ from 'lodash';
import Imagem from '../models/imagem.model';
import imagemRepository from '../repositories/imagem.repository';

async function cadastrar(ecommerceId: number, imagens: Imagem[]) {
  return await imagemRepository.cadastrar(_.map(imagens, (imagem) => ({ url: imagem.url, ecommerce_id: ecommerceId })));
}

async function obterPorId(ecommerceId: number): Promise<Imagem[]> {
  return await imagemRepository.obterPorId(ecommerceId);
}

async function atualizar(ecommerceId: number, imagens: Imagem[]) {
  await imagemRepository.remover(ecommerceId);
  imagens = _.map(imagens, (imagem) => ({ ...imagem, ecommerce_id: ecommerceId }));
  await imagemRepository.cadastrar(imagens);
}

export default {
  cadastrar,
  obterPorId,
  atualizar,
};
