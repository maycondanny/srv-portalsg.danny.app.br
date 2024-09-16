export default interface Divergencia {
  produto_id: string,
  marca: number,
  descritivo: string,
  descritivo_pdv: string,
  depto: number,
  secao: number,
  grupo: number,
  subgrupo: number,
  classificacao_fiscal: string,
  origem: number,
  pesol: number,
  pesob: number,
  validade: number,
  comprimento: number,
  largura: number,
  altura: number,
  qtde_embalagem: number,
  ipi: number,
  pis_cofins: string,
  fornecedor_id: number,
  preco: number,
  desconto_p: number,
  st_compra: string,
  icms_compra: number,
  tributacao_compra: string,
  estado: number,
  datahora_cadastro: Date,
  datahora_alteracao: Date
}
