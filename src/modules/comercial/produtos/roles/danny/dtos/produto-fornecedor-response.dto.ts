import Fornecedor from "@models/fornecedor.model";
import ProdutoDTO from "./produto.dto";

export default interface ProdutoFornecedorResponseDTO {
  produtos: ProdutoDTO[];
  fornecedor: Fornecedor;
}
