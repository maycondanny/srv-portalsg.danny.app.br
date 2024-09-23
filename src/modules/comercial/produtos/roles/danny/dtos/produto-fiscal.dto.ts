import Divergencia from "@modules/comercial/produtos/models/divergencia.model";

export default interface ProdutoFiscalDTO {
  id: number;
  produto_arius: number;
  estado: number;
  fornecedor_id: number;
  classificacao_fiscal: string;
  st_compra: string;
  tipo_tributacao: string;
  ipi: number;
  icms_compra: number;
  pis_cofins: string;
  divergencias: Divergencia[];
  status: number;
}
