import Fornecedor from "@models/fornecedor.model";
import fornecedorRepository from "repositories/fornecedor.repository";

async function obterPorId(id: number): Promise<Fornecedor> {
  if (!id) throw new Error("Fornecedor não encontrado");
  return await fornecedorRepository.obterPorId(id);
};

export default {
  obterPorId
}
