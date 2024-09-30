import { Fornecedor } from "@modules/core/models/fornecedor.model";
import ProdutoDTO from "../../fornecedor/dtos/produto.dto";

export default interface ProdutoFornecedorResponseDTO {
  produtos: ProdutoDTO[];
  fornecedor: Fornecedor;
}
