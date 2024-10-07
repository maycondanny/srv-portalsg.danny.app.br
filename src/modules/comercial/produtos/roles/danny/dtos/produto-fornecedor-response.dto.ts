import { Fornecedor } from "@modules/core/fornecedores/models/fornecedor.model";
import ProdutoDTO from "./produto.dto";

export default interface ProdutoFornecedorResponseDTO {
  produtos: ProdutoDTO[];
  fornecedor: Fornecedor;
}
