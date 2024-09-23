import { ERole } from "@modules/comercial/produtos/models/produto.model";
import ProdutoDTO from "./produto.dto";

export default interface AprovacaoRequestDTO {
  role: ERole;
  produto: ProdutoDTO;
  dadosAtualizacao?: Partial<ProdutoDTO>;
}
