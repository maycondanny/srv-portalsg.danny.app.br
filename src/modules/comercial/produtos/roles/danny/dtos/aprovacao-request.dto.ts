import { ERole } from "@modules/comercial/produtos/models/produto.model";
import ProdutoDTO from "./produto.dto";
import ProdutoAtualizacao from "./produto-atualizacao.dto";

export default interface AprovacaoRequestDTO {
  role: ERole;
  produto: Partial<ProdutoDTO>;
  dadosAtualizacao?: Partial<ProdutoAtualizacao>;
}
