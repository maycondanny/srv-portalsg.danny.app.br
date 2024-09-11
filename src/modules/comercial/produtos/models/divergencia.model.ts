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
  pesol: string,
  pesob: string,
  validade: number,
  comprimento: string,
  largura: string,
  altura: string,
  qtde_embalagem: number,
  ipi: string,
  pis_cofins: string,
  fornecedor_id: string,
  preco: string,
  desconto_p: string,
  st_compra: string,
  icms_compra: string,
  tributacao_compra: string,
  estado: number,
  datahora_cadastro: Date,
  datahora_alteracao: Date
}
