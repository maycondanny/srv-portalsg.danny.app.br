import { Divergencia } from "@modules/comercial/ecommerce/models/divergencia.model";
import { Ean } from "@modules/comercial/ecommerce/models/ean.model";
import Imagem from "@modules/comercial/ecommerce/models/imagem.model";

export default interface ProdutoDTO {
  id?: number;
  nome: string;
  descricao: string;
  caracteristica: string;
  modo_uso: string;
  imagens: Imagem[];
  eans: Ean[];
  fornecedor_id: number;
  status: number;
  dataCadastro?: Date;
  marca?: number;
  depto?: number;
  secao?: number;
  ativo?: boolean;
  lancamento?: boolean;
  destaque?: boolean;
  produto_arius?: number;
  divergencias?: Divergencia[];
}
