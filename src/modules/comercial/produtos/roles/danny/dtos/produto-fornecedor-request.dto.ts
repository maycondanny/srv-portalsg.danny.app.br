import { ERole } from "@modules/comercial/produtos/models/produto.model";

export default interface ProdutoFornecedorRequest {
  fornecedorId: number;
  role: ERole;
}
