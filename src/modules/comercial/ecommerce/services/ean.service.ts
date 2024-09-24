import _ from 'lodash';
import Ean from '../models/ean.model';
import eanRepository from '../repositories/ean.repository';

async function cadastrar(ecommerceId: number, eans: Ean[]) {
  return await eanRepository.cadastrar(_.map(eans, (ean) => ({ codigo: ean.codigo, ecommerce_id: ecommerceId })));
}

async function obterPorId(ecommerceId: number): Promise<Ean> {
  return await eanRepository.obterPorId(ecommerceId);
}

async function atualizar(ecommerceId: number, eans: Ean[]): Promise<void> {
  return await eanRepository.atualizar(ecommerceId, eans);
}

export default {
  cadastrar,
  obterPorId,
  atualizar
};
