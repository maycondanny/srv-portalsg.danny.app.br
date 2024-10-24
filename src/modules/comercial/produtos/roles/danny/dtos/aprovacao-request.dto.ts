import ProdutoDTO from "./produto.dto";

export default interface AprovacaoRequestDTO {
  role: number;
  produto: ProdutoDTO;
  dadosAtualizacao?: Partial<ProdutoDTO>;
}
