import ProdutoDTO from "./produto.dto";

export default interface AprovacaoRequestDTO {
  produto: ProdutoDTO;
  dadosAtualizacao?: Partial<ProdutoDTO>;
}
