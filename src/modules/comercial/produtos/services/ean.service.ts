import _ from "lodash";
import { Ean } from "../models/ean.model";
import eanRepository from "../repositories/ean.repository";

async function cadastrarEmlote(produtoId: number, eans: Partial<Ean>[]) {
  eans = _.map(eans, ean => {
    const { codigo, principal } = _.pick(ean, ['codigo', 'principal']);
    const resultado = _.omit(ean, ['codigo', 'principal']);
    return {
      ...resultado,
      produto_id: produtoId,
      codigo_ean: codigo,
      ean_principal: principal,
    };
  });
  await eanRepository.cadastrarEmlote(eans);
}

export default {
  cadastrarEmlote
}
