import _ from 'lodash';
import Imagem from '../models/imagem.model';
import imagemRepository from '../repositories/imagem.repository';

async function cadastrar(ecommerceId: number, imagens: Imagem[]) {
  return await imagemRepository.cadastrar(_.map(imagens, (imagem) => ({ url: imagem.url, ecommerce_id: ecommerceId })));
}

async function obterPorId(ecommerceId: number): Promise<Imagem[]> {
  return await imagemRepository.obterPorId(ecommerceId);
}

export default {
  cadastrar,
  obterPorId
};
