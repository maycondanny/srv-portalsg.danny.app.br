import { ERole, Produto } from "@modules/comercial/produtos/models/produto.model";

export default interface AprovacaoRequestDTO {
  role: ERole;
  produto: Produto;
  dadosAtualizacao?: Produto;
}
