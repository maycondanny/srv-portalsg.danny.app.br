export default interface ProdutoFiscal {
  id?: number;
  ipi: number;
  st_compra: string;
  icms_compra: number;
  pis_cofins: string;
  classificacao_fiscal: string;
  fornecedor_id: number;
  produto_arius: number;
  estado: number;
  tipo_tributacao: string;
}
