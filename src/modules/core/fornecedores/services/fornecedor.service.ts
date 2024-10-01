import ErroException from "@exceptions/erro.exception";
import { Fornecedor } from "../models/fornecedor.model";
import fornecedorRepository from "../repositories/fornecedor.repository";

const obterPorId = async (id: number): Promise<Fornecedor> => {
  if (!id) throw new ErroException("Fornecedor não informado");
  return await fornecedorRepository.obterPorId(id);
};

export default {
  obterPorId,
};
