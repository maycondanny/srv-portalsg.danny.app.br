import { Ean } from "@modules/comercial/produtos/models/ean.model";

export default interface ProdutoCadastro {
  id?: number;
  codigo_produto_fornecedor: string;
  descritivo: string;
  descritivo_pdv: string;
  classificacao_fiscal: string;
  origem: number;
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
  comprimento_d?: number;
  largura_d?: number;
  altura_d?: number;
  eans: Ean[];
  pis_cofins: string;
  fornecedor_id: number;
  ipi: number;
  st_compra: string;
  icms_compra: number;
}
