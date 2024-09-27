export interface Divergencia {
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
  imagens: string[];
  datahora_cadastro: Date,
  datahora_alteracao: Date,
}
