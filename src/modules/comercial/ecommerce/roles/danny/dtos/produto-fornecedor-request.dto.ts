import { ERole } from "@modules/comercial/produtos/models/produto.model";

export default interface ProdutoFornecedorRequestDTO {
  id: number;
  role: ERole;
}
