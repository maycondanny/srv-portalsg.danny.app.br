import { Fornecedor } from "../models/fornecedor.model";
import fornecedorRepository from "../repositories/fornecedor.repository";

const obterPorId = async (id: number): Promise<Fornecedor> => {
  if (!id) throw new Error("Fornecedor não informado");
  return await fornecedorRepository.obterPorId(id);
};

export default {
  obterPorId,
};
