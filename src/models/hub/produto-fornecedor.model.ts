export default interface ProdutoFornecedor {
  id: string;
  produto: string;
  fornecedor: string;
  referencia: string;
  linha: string;
  datahora_cadastro: Date;
  datahora_alteracao: Date;
}
