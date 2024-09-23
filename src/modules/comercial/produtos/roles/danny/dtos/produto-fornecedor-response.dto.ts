import Fornecedor from "@models/fornecedor.model";
import ProdutoFornecedorDTO from "./produto-fornecedor.dto";

export default interface ProdutoFornecedorResponse {
  produtos: ProdutoFornecedorDTO[];
  fornecedor: Fornecedor;
}
