export default interface Produto {
  produto_id: number;
  nome: string;
  caracteristica: string;
  descricao: string;
  modo_uso: string;
  destaque: boolean;
  lancamento: boolean;
  ativo: boolean;
  depto: number;
  marca: number;
  secao: number;
  created_at?: Date;
  updated_at?: Date;
}
