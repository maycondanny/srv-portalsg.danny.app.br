import Divergencia from "@modules/comercial/produtos/models/divergencia.model";
import { Ean } from "@modules/comercial/produtos/models/ean.model";

export default interface ProdutoCadastroDTO {
  id: number;
  codigo_produto_fornecedor: string;
  descritivo: string;
  descritivo_pdv: string;
  classificacao_fiscal: string;
  origem: string;
  estado: number;
  marca: number;
  depto: number;
  secao: number;
  grupo: number;
  subgrupo: number;
  preco: number;
  desconto_p: number;
  pesob: number;
  pesol: number;
  altura: number;
  largura: number;
  comprimento: number;
  validade: number;
  qtde_embalagem: number;
  eans: Ean[];
  fornecedor_id: number;
  divergencias: Divergencia[];
  produto_arius: number;
  comprador: number;
  categoria_fiscal: string;
  status: number;
  familia: number;
}
