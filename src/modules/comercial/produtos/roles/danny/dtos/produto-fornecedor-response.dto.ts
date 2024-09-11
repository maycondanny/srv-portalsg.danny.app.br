import Fornecedor from "@models/fornecedor.model";
import { Produto } from "@modules/comercial/produtos/models/produto.model";

export default interface ProdutoFornecedorResponse {
  produtos: Produto[];
  fornecedor: Fornecedor;
}
